import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/blogs/${id}`).then((res) => setPost(res.data)).catch(() => setPost(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Post not found.</p>
        <Link to="/blogs" className="text-primary-600 mt-2 inline-block">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/blogs" className="text-primary-600 hover:underline text-sm mb-4 inline-block">← Blogs</Link>
      {post.coverImage && (
        <img src={post.coverImage} alt="" className="w-full rounded-2xl mb-6 shadow-card" />
      )}
      <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
      {post.author && (
        <p className="mt-2 text-gray-500">By {post.author.username}</p>
      )}
      <div className="mt-6 prose prose-gray max-w-none text-gray-700 whitespace-pre-wrap">
        {post.content}
      </div>
    </article>
  );
}
