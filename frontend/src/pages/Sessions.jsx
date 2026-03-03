import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { getSocket } from '../api/socket';

export default function Sessions() {
  const [data, setData] = useState({ asTutor: [], asLearner: [] });
  const [loading, setLoading] = useState(true);

  const fetchSessions = () => {
    api.get('/sessions').then((res) => setData(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
    const socket = getSocket();
    if (socket) {
      socket.on('session_update', fetchSessions);
      return () => socket.off('session_update', fetchSessions);
    }
  }, []);

  const all = [...(data.asTutor || []), ...(data.asLearner || [])].filter(
    (s, i, arr) => arr.findIndex((x) => x._id === s._id) === i
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
            Your Learning Sessions
          </h1>
          <p className="text-lg text-gray-600">Manage your active and completed skill exchange sessions</p>
        </div>

        {/* Sessions List */}
        {all.length === 0 ? (
          <div className="backdrop-blur-sm bg-white/80 border border-gray-200 rounded-3xl p-16 text-center shadow-xl">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-100 to-purple-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-xl mb-2">No sessions yet</p>
            <p className="text-gray-400">Accept a request to create your first learning session</p>
          </div>
        ) : (
          <div className="space-y-6">
            {all.map((s, idx) => (
              <div 
                key={s._id} 
                className="group backdrop-blur-sm bg-white/90 border border-gray-200 rounded-3xl p-6 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-200/50 transition-all duration-500 hover:scale-[1.01]"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    {/* Session Type Badge */}
                    <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-gradient-to-r from-cyan-100 to-cyan-50 border-2 border-cyan-300 text-cyan-700 font-semibold text-sm shadow-sm capitalize">
                      {s.sessionType}
                    </span>

                    {/* Session Details */}
                    <div className="mb-3">
                      {s.sessionType === 'online' && s.sessionDate && (
                        <p className="text-gray-800 font-bold text-lg mb-2 flex items-center gap-2">
                          <span className="text-2xl">📅</span>
                          {new Date(s.sessionDate).toLocaleDateString(undefined, { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                          {s.sessionTime && <span className="text-purple-600">@ {s.sessionTime}</span>}
                        </p>
                      )}
                      {s.sessionType === 'offline' && s.locationDetails && (
                        <p className="text-gray-800 font-bold text-lg mb-2 flex items-center gap-2">
                          <span className="text-2xl">📍</span>
                          {s.locationDetails}
                        </p>
                      )}
                      {s.sessionType === 'offline' && s.googleMapsLink && (
                        <a 
                          href={s.googleMapsLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1 text-cyan-600 hover:text-cyan-700 font-medium text-sm transition-colors"
                        >
                          View on Google Maps →
                        </a>
                      )}
                    </div>

                    {/* Participant Info */}
                    <p className="text-gray-600 text-sm mb-4">
                      Learning with{' '}
                      <Link 
                        to={`/profile/${s.tutor?._id === s.learner?._id ? s.learner?._id : (s.tutor?._id)}`} 
                        className="text-purple-600 hover:text-purple-700 font-bold transition-colors"
                      >
                        {s.tutor?.username || s.learner?.username}
                      </Link>
                    </p>

                    {/* Status Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border-2 shadow-sm
                      ${s.status === 'scheduled' 
                        ? 'bg-gradient-to-r from-amber-100 to-amber-50 border-amber-300 text-amber-700' 
                        : s.status === 'in_progress' 
                        ? 'bg-gradient-to-r from-blue-100 to-blue-50 border-blue-300 text-blue-700' 
                        : s.status === 'completed'
                        ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300 text-gray-600'
                      }`}>
                      <span className={`inline-block w-2 h-2 rounded-full
                        ${s.status === 'scheduled' 
                          ? 'bg-amber-500 animate-pulse' 
                          : s.status === 'in_progress' 
                          ? 'bg-blue-500 animate-pulse' 
                          : s.status === 'completed'
                          ? 'bg-emerald-500'
                          : 'bg-gray-500'
                        }`} />
                      <span className="font-semibold capitalize">{s.status.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 lg:min-w-[200px]">
                    <Link 
                      to={`/sessions/${s._id}`}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-center hover:shadow-xl hover:shadow-cyan-300/50 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      View Details
                    </Link>
                    
                    {(s.status === 'scheduled' || s.status === 'in_progress') && (
                      <Link 
                        to={`/classroom/${s._id}`}
                        className="px-6 py-3 rounded-2xl border-2 border-purple-300 text-purple-600 font-semibold text-center hover:bg-purple-50 transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                        Join Classroom
                      </Link>
                    )}
                  </div>
                </div>
              </div>
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