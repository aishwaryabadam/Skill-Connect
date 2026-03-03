import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function Browse() {
  const [profiles, setProfiles] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    (async () => {
      try {
        const [profRes, recRes] = await Promise.all([
          api.get('/profiles'),
          token
            ? api.get('/requests/recommendations').catch(() => ({ data: [] }))
            : Promise.resolve({ data: [] }),
        ]);
        setProfiles(profRes.data);
        setRecommendations(recRes.data || []);
      } catch (e) {
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

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
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            Browse Skill Exchange Profiles
          </h1>
          <p className="text-lg text-gray-600">Find peers to learn from and teach. Swap skills — no cost, just exchange.</p>
        </div>

        {/* Recommendations Section */}
        {token && recommendations.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <span className="inline-block w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-lg shadow-cyan-300" />
                Recommended for You
                <span className="text-sm font-normal text-gray-500">({recommendations.slice(0, 6).length} matches)</span>
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, 6).map((rec, idx) => (
                <div 
                  key={idx} 
                  className="group backdrop-blur-sm bg-white/90 border border-gray-200 rounded-3xl p-6 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-200/50 transition-all duration-500 hover:scale-[1.02]"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Link 
                      to={`/profile/${rec.profile?.user?._id}`}
                      className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                    >
                      {rec.profile?.name || rec.profile?.user?.username}
                    </Link>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-cyan-100 border-2 border-emerald-300 shadow-sm">
                      <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-emerald-700 font-bold text-sm">{rec.matchScore}%</span>
                    </span>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-3">
                      <div className="text-xs text-cyan-600 font-semibold uppercase mb-1">Learn</div>
                      <div className="text-sm font-bold text-gray-800">{rec.skillToLearn}</div>
                    </div>
                    <div className="flex items-center justify-center px-2">
                      <span className="text-2xl text-purple-500">⇄</span>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-3">
                      <div className="text-xs text-purple-600 font-semibold uppercase mb-1">Teach</div>
                      <div className="text-sm font-bold text-gray-800">{rec.skillToTeach}</div>
                    </div>
                  </div>

                  <Link 
                    to={`/profile/${rec.profile?.user?._id}`}
                    className="block text-center px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold hover:shadow-xl hover:shadow-cyan-300/50 transition-all duration-300 hover:scale-105"
                  >
                    View & Request →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Profiles Section */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span className="inline-block w-3 h-3 bg-purple-500 rounded-full animate-pulse animation-delay-1000 shadow-lg shadow-purple-300" />
              All Profiles
              <span className="text-sm font-normal text-gray-500">({profiles.length} {profiles.length === 1 ? 'person' : 'people'})</span>
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
          </div>

          {profiles.length === 0 ? (
            <div className="backdrop-blur-sm bg-white/80 border border-gray-200 rounded-3xl p-16 text-center shadow-xl">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-xl mb-2">No profiles yet</p>
              <p className="text-gray-400">Be the first to sign up!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {profiles.map((p, idx) => (
                <div 
                  key={p._id} 
                  className="group backdrop-blur-sm bg-white/90 border border-gray-200 rounded-3xl p-5 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-500 hover:scale-[1.02]"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 p-0.5 shadow-lg mb-3">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-600 font-bold text-2xl">
                        {(p.name || p.user?.username || '?').charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <Link 
                      to={`/profile/${p.user?._id}`}
                      className="text-lg font-bold text-gray-800 hover:text-purple-600 transition-colors"
                    >
                      {p.name || p.user?.username}
                    </Link>
                    {p.availability && (
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        {p.availability}
                      </div>
                    )}
                  </div>

                  {p.aboutMe && (
                    <p className="text-sm text-gray-600 text-center mb-3 line-clamp-2">
                      {p.aboutMe}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                    {(p.skillsICanTeach || []).slice(0, 3).map((s, j) => (
                      <span key={j} className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-300 text-purple-700 font-semibold text-xs">
                        {s}
                      </span>
                    ))}
                  </div>

                  <Link 
                    to={`/profile/${p.user?._id}`}
                    className="block text-center px-4 py-2 rounded-2xl border-2 border-purple-300 text-purple-600 font-semibold text-sm hover:bg-purple-50 transition-all duration-300 hover:scale-105"
                  >
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          )}
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