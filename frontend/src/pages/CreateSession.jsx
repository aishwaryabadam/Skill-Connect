import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../api/axios';

export default function CreateSession() {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [type, setType] = useState('online');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (!requestId) {
      setError('Missing request ID');
      return;
    }
    setError('');
    const payload = {
      requestId,
      sessionType: type,
    };
    if (type === 'offline') {
      payload.locationDetails = data.locationDetails;
      payload.googleMapsLink = data.googleMapsLink;
      if (!data.googleMapsLink?.trim()) {
        setError('Google Maps link is mandatory for offline sessions.');
        return;
      }
    } else {
      payload.sessionDate = data.sessionDate;
      payload.sessionTime = data.sessionTime;
    }
    try {
      await api.post('/sessions', payload);
      navigate('/sessions');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create session.');
    }
  };

  if (!requestId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">No request specified.</p>
        <Link to="/requests" className="text-primary-600 mt-2 inline-block">Back to Requests</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/requests" className="text-primary-600 hover:underline text-sm mb-4 inline-block">← Requests</Link>
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Session</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="sessionType" value="online" checked={type === 'online'} onChange={() => setType('online')} />
                Online
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="sessionType" value="offline" checked={type === 'offline'} onChange={() => setType('offline')} />
                Offline
              </label>
            </div>
          </div>
          {type === 'offline' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Details</label>
                <input type="text" {...register('locationDetails')} className="input-field" placeholder="Address or venue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link *</label>
                <input
                  type="url"
                  {...register('googleMapsLink', { required: type === 'offline' ? 'Required' : false })}
                  className="input-field"
                  placeholder="https://maps.google.com/..."
                />
                {errors.googleMapsLink && <p className="mt-1 text-sm text-red-600">{errors.googleMapsLink.message}</p>}
              </div>
            </>
          )}
          {type === 'online' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Date</label>
                <input type="date" {...register('sessionDate', { required: type === 'online' ? 'Required' : false })} className="input-field" />
                {errors.sessionDate && <p className="mt-1 text-sm text-red-600">{errors.sessionDate.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Time</label>
                <input type="time" {...register('sessionTime', { required: type === 'online' ? 'Required' : false })} className="input-field" />
                {errors.sessionTime && <p className="mt-1 text-sm text-red-600">{errors.sessionTime.message}</p>}
              </div>
            </>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary">Create Session</button>
        </form>
      </div>
    </div>
  );
}
