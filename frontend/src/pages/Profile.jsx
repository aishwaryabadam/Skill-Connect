import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const currentUserId = useAuthStore((s) => s.user?._id);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      api.get(`/profiles/${userId}`).then((r) => r.data).catch(() => null),
      api.get(`/reviews/user/${userId}`).then((r) => r.data).catch(() => []),
    ]).then(([p, r]) => {
      setProfile(p);
      setReviews(r || []);
    }).finally(() => setLoading(false));
  }, [userId]);

  const [showRequest, setShowRequest] = useState(false);
  const [skillToLearn, setSkillToLearn] = useState('');
  const [skillToTeach, setSkillToTeach] = useState('');
  const [message, setMessage] = useState('');

  const sendRequest = async (e) => {
    e.preventDefault();
    if (!skillToLearn.trim() || !skillToTeach.trim()) return;
    setSending(true);
    try {
      await api.post('/requests', {
        tutorId: userId,
        skillToLearn: skillToLearn.trim(),
        skillToTeach: skillToTeach.trim(),
        message: message.trim(),
      });
      setShowRequest(false);
      setSkillToLearn('');
      setSkillToTeach('');
      setMessage('');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to send request.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Profile not found.</p>
        <Link to="/browse" className="text-primary-600 mt-2 inline-block">Browse Profiles</Link>
      </div>
    );
  }

  const isOwn = currentUserId === userId;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="card">
        <div className="flex flex-wrap items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold">
            {(profile.name || profile.user?.username || '?').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">{profile.name || profile.user?.username}</h1>
            {profile.availability && <p className="text-gray-600 mt-1">{profile.availability}</p>}
            {profile.aboutMe && <p className="mt-3 text-gray-600">{profile.aboutMe}</p>}
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold text-gray-900 mb-2">Skills I Can Teach</h2>
            <div className="flex flex-wrap gap-2">
              {(profile.skillsICanTeach || []).map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-primary-100 text-primary-700 text-sm">{s}</span>
              ))}
              {(profile.skillsICanTeach || []).length === 0 && <span className="text-gray-500 text-sm">—</span>}
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 mb-2">Skills I Want to Learn</h2>
            <div className="flex flex-wrap gap-2">
              {(profile.skillsIWantToLearn || []).map((s, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm">{s}</span>
              ))}
              {(profile.skillsIWantToLearn || []).length === 0 && <span className="text-gray-500 text-sm">—</span>}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          {profile.instagramId && (
            <a href={`https://instagram.com/${profile.instagramId.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
              Instagram
            </a>
          )}
          {profile.linkedInId && (
            <a href={profile.linkedInId.startsWith('http') ? profile.linkedInId : `https://linkedin.com/in/${profile.linkedInId}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
              LinkedIn
            </a>
          )}
          {profile.githubId && (
            <a href={profile.githubId.startsWith('http') ? profile.githubId : `https://github.com/${profile.githubId}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
              GitHub
            </a>
          )}
        </div>

        {profile.educationDetails?.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold text-gray-900 mb-2">Education</h2>
            <ul className="space-y-1 text-gray-600 text-sm">
              {profile.educationDetails.map((e, i) => (
                <li key={i}>{e.institution} {e.degree && `— ${e.degree}`} {e.field && `(${e.field})`} {e.year && e.year}</li>
              ))}
            </ul>
          </div>
        )}

        {!isOwn && token && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            {!showRequest ? (
              <button onClick={() => setShowRequest(true)} className="btn-primary">Send Skill Swap Request</button>
            ) : (
              <form onSubmit={sendRequest} className="space-y-3 max-w-md">
                <input
                  type="text"
                  value={skillToLearn}
                  onChange={(e) => setSkillToLearn(e.target.value)}
                  placeholder="Skill you want to learn"
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  value={skillToTeach}
                  onChange={(e) => setSkillToTeach(e.target.value)}
                  placeholder="Skill you can teach in return"
                  className="input-field"
                  required
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message (optional)"
                  className="input-field"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={sending} className="btn-primary">Send</button>
                  <button type="button" onClick={() => setShowRequest(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {reviews.length > 0 && (
        <div className="mt-8 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews Received</h2>
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li key={r._id} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">★</span>
                  <span className="font-medium">{r.rating}/5</span>
                  <span className="text-gray-500 text-sm">by {r.fromUser?.username}</span>
                </div>
                {r.comment && <p className="mt-1 text-gray-600 text-sm">{r.comment}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
