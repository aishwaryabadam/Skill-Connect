import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const setProfileStore = useAuthStore((s) => s.setProfile);

  useEffect(() => {
    api.get('/profiles/me')
      .then((res) => setProfile(res.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();

  useEffect(() => {
    if (!profile) return;
    reset({
      name: profile.name || '',
      aboutMe: profile.aboutMe || '',
      availability: profile.availability || '',
      instagramId: profile.instagramId || '',
      linkedInId: profile.linkedInId || '',
      githubId: profile.githubId || '',
    });
    if (profile.skillsICanTeach?.length) {
      setValue('skillsICanTeach', profile.skillsICanTeach.join(', '));
    }
    if (profile.skillsIWantToLearn?.length) {
      setValue('skillsIWantToLearn', profile.skillsIWantToLearn.join(', '));
    }
  }, [profile, reset, setValue]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = {
        name: data.name?.trim(),
        aboutMe: data.aboutMe?.trim(),
        availability: data.availability?.trim(),
        skillsICanTeach: (data.skillsICanTeach || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        skillsIWantToLearn: (data.skillsIWantToLearn || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        instagramId: data.instagramId?.trim(),
        linkedInId: data.linkedInId?.trim(),
        githubId: data.githubId?.trim(),
      };
      const res = await api.put('/profiles/me', payload);
      setProfile(res.data);
      setProfileStore(res.data);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" {...register('name')} className="input-field" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About Me</label>
            <textarea {...register('aboutMe')} className="input-field" rows={4} placeholder="A short bio" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <input type="text" {...register('availability')} className="input-field" placeholder="e.g. Weekends, evenings" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills I Can Teach (comma-separated)</label>
            <input
              type="text"
              {...register('skillsICanTeach')}
              className="input-field"
              placeholder="React, JavaScript, Design"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills I Want to Learn (comma-separated)</label>
            <input
              type="text"
              {...register('skillsIWantToLearn')}
              className="input-field"
              placeholder="Python, Guitar, Spanish"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram ID</label>
            <input type="text" {...register('instagramId')} className="input-field" placeholder="@username or username" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn ID or URL</label>
            <input type="text" {...register('linkedInId')} className="input-field" placeholder="username or full URL" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub ID or URL</label>
            <input type="text" {...register('githubId')} className="input-field" placeholder="username or full URL" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
