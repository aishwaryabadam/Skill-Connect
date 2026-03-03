import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Reviews() {
  const [given, setGiven] = useState([]);
  const [received, setReceived] = useState([]);
  const [tab, setTab] = useState('given');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/reviews/given').then((r) => r.data),
      api.get('/reviews/received').then((r) => r.data),
    ])
      .then(([g, r]) => {
        setGiven(g || []);
        setReceived(r || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const list = tab === 'given' ? given : received;
  const title = tab === 'given' ? 'Reviews You Gave' : 'Reviews You Received';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Reviews & Ratings</h1>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('given')}
          className={`px-4 py-2 rounded-xl font-medium transition ${tab === 'given' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Reviews You Gave
        </button>
        <button
          onClick={() => setTab('received')}
          className={`px-4 py-2 rounded-xl font-medium transition ${tab === 'received' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Reviews You Received
        </button>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-4">
        {list.length === 0 && (
          <p className="text-gray-500 py-8">{tab === 'given' ? 'You haven’t given any reviews yet.' : 'No reviews received yet.'}</p>
        )}
        {list.map((r) => (
          <div key={r._id} className="card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-500 font-medium">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              <span className="text-gray-500 text-sm">
                {tab === 'given' ? (
                  <>To <Link to={`/profile/${r.toUser?._id}`} className="text-primary-600 hover:underline">{r.toUser?.username}</Link></>
                ) : (
                  <>From <Link to={`/profile/${r.fromUser?._id}`} className="text-primary-600 hover:underline">{r.fromUser?.username}</Link></>
                )}
              </span>
            </div>
            {r.comment && <p className="text-gray-600 text-sm">{r.comment}</p>}
            <p className="text-xs text-gray-500 mt-2">{new Date(r.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
