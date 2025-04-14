const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const PublishedPost = require("../models/PublishedPost");
const GeneratedPdf = require("../models/GeneratedPdf");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
// const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { PDFDocument } = require('pdf-lib');
const axios = require('axios');


router.post("/pdf/generate", auth, async (req, res) => {
  try {
    const { postIds, title } = req.body;

    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return res.status(400).json({ msg: "No posts selected" });
    }
    const postsMap = new Map();
    const posts = await PublishedPost.find({ _id: { $in: postIds }, status: "approved" });
    posts.forEach(post => postsMap.set(post._id.toString(), post));

    const orderedPosts = postIds.map(id => postsMap.get(id)).filter(Boolean);

    if (orderedPosts.length === 0) {
      return res.status(404).json({ msg: "No approved posts found" });
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Unauthorized: No token provided" });
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1280,900'
      ]
    });

    const page = await browser.newPage();
    
    await page.setViewport({ 
      width: 1280,
      height: 900,
      deviceScaleFactor: 2
    });

    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);

    await page.setRequestInterception(true);

    page.on('request', request => {
      if (request.resourceType() === 'image') {
        const originalUrl = request.url();
        // Don't modify the URL, just add any necessary headers
        console.log(`Processing image request: ${originalUrl}`);
        
        request.continue({
          url: originalUrl,  // Keep the original S3 URL
          headers: {
            ...request.headers(),
            'Cache-Control': 'no-cache'
          }
        });
      } else {
        request.continue();
      }
    });
    

    const frontendURL = "http://localhost:5173";
    const timestamp = Date.now();
    
    const { default: PDFMerger } = await import('pdf-merger-js');
    const merger = new PDFMerger();

    const tempDir = path.join(__dirname, "..", "uploads", "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    for (const post of orderedPosts) {
      const postURL = `${frontendURL}/admin-dashboard/post/${post._id}`;
      console.log(`Processing post: ${post._id}`);
      
      await page.goto(postURL, { 
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 60000 
      });

      // Wait for post content
      await page.waitForSelector(".post-content", { visible: true });

      // Wait for all images to load
      await page.evaluate(async () => {
        const images = document.getElementsByTagName('img');
        await Promise.all(
          Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve, reject) => {
              img.addEventListener('load', resolve);
              img.addEventListener('error', () => {
                console.error('Image failed to load:', img.src);
                resolve();
              });
            });
          })
        );
      });

      // Additional wait to ensure all content is rendered
      await new Promise(resolve => setTimeout(resolve, 5000));


      // Force re-render of images
      await page.evaluate(() => {
        const images = document.getElementsByTagName('img');
        const images1 = document.querySelectorAll("img");
        images1.forEach(img => {
          console.log(`Image: ${img.src}, Loaded: ${img.complete}`);
        });

        Array.from(images).forEach(img => {
          const currentSrc = img.src;
          img.src = '';
          img.src = currentSrc;
        });
      });

      // Wait for images again after re-render
      await page.evaluate(async () => {
        const images = document.getElementsByTagName('img');
        await Promise.all(
          Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve, reject) => {
              img.addEventListener('load', resolve);
              img.addEventListener('error', () => {
                console.error('Image failed to load:', img.src);
                resolve();
              });
            });
          })
        );
      });

      console.log(`Generating PDF for post: ${post._id}`);
      
      const tempPdfPath = path.join(tempDir, `temp_${post._id}.pdf`);
      await page.pdf({
        path: tempPdfPath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        timeout: 60000
      });

      await merger.add(tempPdfPath);
      console.log(`PDF generated for post: ${post._id}`);
    }

    await browser.close();

    const pdfFilename = `posts_${timestamp}.pdf`;
    const finalPdfPath = path.join(__dirname, "..", "uploads", "pdfs", pdfFilename);

    const pdfDir = path.dirname(finalPdfPath);
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    await merger.save(finalPdfPath);

    // Clean up temporary files
    // ✅ NEW: Upload to S3 and save URL to DB
    // AWS SDK v3 S3 Upload
    const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    const pdfBuffer = fs.readFileSync(finalPdfPath);
    const s3Key = `pdfs/${uuidv4()}_${pdfFilename}`;
    console.log('PDF Buffer Length:', pdfBuffer.length);


    const uploadCommand = new PutObjectCommand({
      Bucket: 'studentmagazine',
      Key: s3Key,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
      // ACL: 'public-read'
    });

    await s3Client.send(uploadCommand);

    const s3PdfUrl = `https://${'studentmagazine'}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${s3Key}`;


    // Clean up local files
    fs.readdirSync(tempDir).forEach(file => {
      fs.unlinkSync(path.join(tempDir, file));
    });
    fs.rmdirSync(tempDir);
    fs.unlinkSync(finalPdfPath);

    // Save to MongoDB
    const generatedPdf = new GeneratedPdf({
      title: title || `Generated PDF - ${timestamp}`,
      postIds: postIds,
      pdfPath: s3PdfUrl
    });
    await generatedPdf.save();

    try {
      const pdfResponse = await axios.get(s3PdfUrl, { responseType: 'arraybuffer' });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${title || 'generated-pdf'}.pdf`);
      return res.send(Buffer.from(pdfResponse.data));
    } catch (downloadError) {
      console.error("Error downloading PDF from S3:", downloadError);
      return res.status(500).json({ msg: "Failed to download PDF from storage", error: downloadError.message });
    }

    return res.status(200).sendFile(finalPdfPath);
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;