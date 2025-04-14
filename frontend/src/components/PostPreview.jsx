import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';

export default function PostPreview() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [TemplateComponent, setTemplateComponent] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`https://sudentmagazine-api.vercel.app/publishedposts/${id}`);
        const data = await response.json();
        setPost(data);

        // **Dynamically import the template based on post category & templateId**
        const { category, templateId } = data;
        const templatePath = `../components/templates/${category}/Template${templateId}.jsx`;

        const module = await import(/* @vite-ignore */ templatePath);
        setTemplateComponent(() => module.default);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    }

    fetchPost();
  }, [id]);

  if (!post || !TemplateComponent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-white">
      <Suspense fallback={<div>Loading template...</div>}>
        <TemplateComponent {...post} />
      </Suspense>
    </div>
  );
}
