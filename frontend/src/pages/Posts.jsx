// Posts Component

export function Posts() {
    const [statusFilter, setStatusFilter] = useState('all');
  
    const filteredPosts = MOCK_POSTS.filter(post =>
      statusFilter === 'all' ? true : post.status === statusFilter
    );
  
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Posts</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Posts</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
  
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  post.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  post.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{post.content.substring(0, 200)}...</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  <span className="font-medium">{post.author}</span>
                  <span className="mx-2">•</span>
                  <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                </div>
                <span className="bg-gray-100 px-3 py-1 rounded-full">
                  {post.genre}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }