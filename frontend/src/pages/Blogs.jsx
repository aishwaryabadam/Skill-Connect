import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blogs')
      .then((res) => setBlogs(res.data))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin w-16 h-16 border-4 border-transparent border-t-cyan-500 border-r-purple-500 rounded-full" />
          <div className="absolute inset-0 animate-ping w-16 h-16 border-4 border-cyan-400 rounded-full opacity-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            Community Insights & Stories
          </h1>
          <p className="text-lg text-gray-600 mb-8">Tips, experiences, and knowledge shared by our learning community.</p>
          
          
        </div>

        {/* Blog Posts Grid */}
        {blogs.length === 0 ? (
          <div className="backdrop-blur-sm bg-white/80 border border-gray-200 rounded-3xl p-16 text-center shadow-xl">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-100 to-purple-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-gray-500 text-xl mb-2">No blog posts yet</p>
            <p className="text-gray-400 mb-6">Be the first to share your knowledge!</p>
            <Link
              to="/blogs/create"
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold hover:shadow-xl hover:shadow-cyan-300/50 transition-all duration-300 hover:scale-105"
            >
              Create First Blog
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((b, idx) => (
              <Link 
                key={b._id} 
                to={`/blogs/${b._id}`}
                className="group backdrop-blur-sm bg-white/90 border border-gray-200 rounded-3xl overflow-hidden hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-500 hover:scale-[1.02]"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Cover Image */}
                {b.coverImage && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={b.coverImage} 
                      alt={b.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {b.title}
                  </h2>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {b.excerpt || b.content?.slice(0, 120)}
                  </p>

                  {/* Tags */}
                  {b.tags && b.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {b.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-100 to-cyan-50 border border-cyan-300 text-cyan-700 font-semibold text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                        {(b.author?.username || 'A').charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {b.author?.username || 'Anonymous'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(b.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Read More Button */}
                <div className="px-6 pb-6">
                  <div className="w-full text-center px-4 py-2 rounded-2xl border-2 border-purple-300 text-purple-600 font-semibold text-sm group-hover:bg-purple-50 transition-all duration-300">
                    Read More →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}