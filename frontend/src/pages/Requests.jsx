import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { getSocket } from '../api/socket';

export default function Requests() {
  const [data, setData] = useState({ incoming: [], outgoing: [] });
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    api.get('/requests').then((res) => setData(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
    const socket = getSocket();
    if (socket) {
      socket.emit('join_notifications');
      socket.on('request_update', fetchRequests);
      return () => socket.off('request_update', fetchRequests);
    }
  }, []);

  const accept = (id) => {
    api.patch(`/requests/${id}/accept`).then(() => fetchRequests()).catch((e) => alert(e.response?.data?.message || 'Failed'));
  };
  const reject = (id) => {
    api.patch(`/requests/${id}/reject`).then(() => fetchRequests()).catch((e) => alert(e.response?.data?.message || 'Failed'));
  };

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

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            Skill Exchange Requests
          </h1>
          <p className="text-lg text-gray-600">Manage your incoming and outgoing learning connections</p>
        </div>

        {/* Incoming Requests Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span className="inline-block w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-lg shadow-cyan-300" />
              Incoming Requests
              <span className="text-sm font-normal text-gray-500">(as tutor)</span>
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
          </div>

          <div className="grid gap-6">
            {data.incoming.length === 0 && (
              <div className="backdrop-blur-sm bg-white/80 border border-gray-200 rounded-3xl p-12 text-center shadow-xl">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-100 to-purple-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No incoming requests at the moment</p>
              </div>
            )}
            
            {data.incoming.map((r, idx) => (
              <div 
                key={r._id} 
                className="group backdrop-blur-sm bg-white/90 border border-gray-200 rounded-3xl p-6 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-200/50 transition-all duration-500 hover:scale-[1.02]"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 p-0.5 shadow-lg">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-br from-cyan-600 to-purple-600 font-bold text-lg">
                          {r.learner?.username?.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <Link 
                        to={`/profile/${r.learner?._id}`} 
                        className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                      >
                        {r.learner?.username}
                      </Link>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gray-600 font-medium">Wants to learn</span>
                        <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-100 to-cyan-50 border-2 border-cyan-300 text-cyan-700 font-semibold text-sm shadow-sm">
                          {r.skillToLearn}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gray-600 font-medium">and teach</span>
                        <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-purple-50 border-2 border-purple-300 text-purple-700 font-semibold text-sm shadow-sm">
                          {r.skillToTeach}
                        </span>
                      </div>
                    </div>

                    {r.message && (
                      <div className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 mb-3">
                        <p className="text-gray-700 text-sm italic">"{r.message}"</p>
                      </div>
                    )}

                    {r.matchScore != null && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-cyan-100 border-2 border-emerald-300 shadow-sm">
                        <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-emerald-700 font-bold">{r.matchScore}% Match</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 lg:min-w-[200px]">
                    {r.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => accept(r._id)} 
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold hover:shadow-xl hover:shadow-cyan-300/50 transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                          Accept Request
                        </button>
                        <button 
                          onClick={() => reject(r._id)} 
                          className="px-6 py-3 rounded-2xl border-2 border-red-300 text-red-600 font-semibold hover:bg-red-50 hover:border-red-400 transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {r.status === 'accepted' && (
                      <>
                        <Link 
                          to={`/sessions/create?requestId=${r._id}`} 
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-center hover:shadow-xl hover:shadow-purple-300/50 transition-all duration-300 hover:scale-105"
                        >
                          Create Session
                        </Link>
                        <Link 
                          to="/sessions" 
                          className="px-6 py-3 rounded-2xl border-2 border-purple-300 text-purple-600 font-semibold text-center hover:bg-purple-50 transition-all duration-300 hover:scale-105"
                        >
                          View Sessions
                        </Link>
                      </>
                    )}
                    {r.status === 'rejected' && (
                      <div className="px-6 py-3 rounded-2xl bg-gray-100 border border-gray-300 text-gray-500 text-center font-semibold">
                        Rejected
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Outgoing Requests Section */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span className="inline-block w-3 h-3 bg-purple-500 rounded-full animate-pulse animation-delay-1000 shadow-lg shadow-purple-300" />
              Outgoing Requests
              <span className="text-sm font-normal text-gray-500">(as learner)</span>
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
          </div>

          <div className="grid gap-6">
            {data.outgoing.length === 0 && (
              <div className="backdrop-blur-sm bg-white/80 border border-gray-200 rounded-3xl p-12 text-center shadow-xl">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No outgoing requests yet</p>
              </div>
            )}
            
            {data.outgoing.map((r, idx) => (
              <div 
                key={r._id} 
                className="group backdrop-blur-sm bg-white/90 border border-gray-200 rounded-3xl p-6 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-500 hover:scale-[1.02]"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 p-0.5 shadow-lg">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-600 font-bold text-lg">
                      {r.tutor?.username?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <Link 
                    to={`/profile/${r.tutor?._id}`} 
                    className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                  >
                    {r.tutor?.username}
                  </Link>
                </div>

                <div className="flex items-center gap-4 flex-wrap mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm font-medium">Learn</span>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-100 to-cyan-50 border-2 border-cyan-300 text-cyan-700 font-semibold text-sm shadow-sm">
                      {r.skillToLearn}
                    </span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm font-medium">Teach</span>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-purple-50 border-2 border-purple-300 text-purple-700 font-semibold text-sm shadow-sm">
                      {r.skillToTeach}
                    </span>
                  </div>
                </div>

                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border-2 shadow-sm
                  ${r.status === 'pending' 
                    ? 'bg-gradient-to-r from-amber-100 to-amber-50 border-amber-300 text-amber-700' 
                    : r.status === 'accepted' 
                    ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 border-emerald-300 text-emerald-700' 
                    : 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300 text-gray-600'
                  }`}>
                  <span className={`inline-block w-2 h-2 rounded-full
                    ${r.status === 'pending' 
                      ? 'bg-amber-500 animate-pulse' 
                      : r.status === 'accepted' 
                      ? 'bg-emerald-500' 
                      : 'bg-gray-500'
                    }`} />
                  <span className="font-semibold capitalize">{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
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
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}