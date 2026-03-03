import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function SessionDetail() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = useAuthStore((s) => s.user?._id);
  const isTutor = session?.tutor?._id === userId || session?.tutor === userId;
  const isLearner = session?.learner?._id === userId || session?.learner === userId;

  useEffect(() => {
    api.get(`/sessions/${id}`)
      .then((res) => setSession(res.data))
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, [id]);

  const onStart = () => {
    api.patch(`/sessions/${id}/start`).then((res) => setSession(res.data)).catch((e) => alert(e.response?.data?.message));
  };
  const onComplete = () => {
    api.patch(`/sessions/${id}/complete`).then((res) => setSession(res.data)).catch((e) => alert(e.response?.data?.message));
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }
  if (!session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Session not found.</p>
        <Link to="/sessions" className="text-primary-600 mt-2 inline-block">Back to Sessions</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/sessions" className="text-primary-600 hover:underline text-sm mb-4 inline-block">← Sessions</Link>
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Session Details</h1>
        <p><span className="text-gray-600">Type:</span> <span className="capitalize font-medium">{session.sessionType}</span></p>
        {session.sessionType === 'offline' && (
          <>
            <p className="mt-2"><span className="text-gray-600">Location:</span> {session.locationDetails || '—'}</p>
            {session.googleMapsLink && (
              <a href={session.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline mt-1 inline-block">
                Open in Google Maps
              </a>
            )}
          </>
        )}
        {session.sessionType === 'online' && session.sessionDate && (
          <p className="mt-2"><span className="text-gray-600">Date & time:</span> {new Date(session.sessionDate).toLocaleString()} {session.sessionTime}</p>
        )}
        <p className="mt-2"><span className="text-gray-600">Status:</span> <span className="capitalize">{session.status?.replace('_', ' ')}</span></p>
        <p className="mt-2">
          <span className="text-gray-600">With:</span>{' '}
          <Link to={`/profile/${session.learner?._id || session.learner}`} className="text-primary-600 hover:underline">
            {session.learner?.username}
          </Link>
          {' / '}
          <Link to={`/profile/${session.tutor?._id || session.tutor}`} className="text-primary-600 hover:underline">
            {session.tutor?.username}
          </Link>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {(session.status === 'scheduled' || session.status === 'in_progress') && (
            <Link to={`/classroom/${session._id}`} className="btn-primary">Join Classroom</Link>
          )}
          {session.status === 'scheduled' && isTutor && (
            <button onClick={onStart} className="btn-secondary">Mark In Progress</button>
          )}
          {session.status === 'in_progress' && (
            <button onClick={onComplete} className="btn-secondary">Mark Completed</button>
          )}
          {session.status === 'completed' && isLearner && (
            <LeaveReviewButton sessionId={session._id} onDone={() => setSession((s) => ({ ...s }))} />
          )}
        </div>
      </div>
      {session.status === 'completed' && (
        <div className="mt-8 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test & Results</h2>
          <TestSection sessionId={session._id} session={session} userId={userId} onRefresh={() => setSession((s) => ({ ...s }))} />
        </div>
      )}
    </div>
  );
}

function TestSection({ sessionId, session, userId, onRefresh }) {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showAttempt, setShowAttempt] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const fetchTest = () => {
    api.get(`/tests/session/${sessionId}`)
      .then((res) => setTest(res.data))
      .catch(() => setTest(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTest();
  }, [sessionId]);

  const isTutor = session?.tutor?._id === userId || session?.tutor === userId;
  const isLearner = session?.learner?._id === userId || session?.learner === userId;

  if (loading) return <p className="text-gray-500 mt-2">Loading...</p>;

  if (!test && isTutor && !showCreate) {
    return (
      <div>
        <p className="text-gray-500 mt-2">No test for this session yet.</p>
        <button onClick={() => setShowCreate(true)} className="mt-3 btn-primary">Create Test</button>
      </div>
    );
  }
  if (!test && isTutor && showCreate) {
    return <CreateTestForm sessionId={sessionId} onDone={() => { setShowCreate(false); fetchTest(); onRefresh?.(); }} onCancel={() => setShowCreate(false)} />;
  }
  if (!test) return <p className="text-gray-500 mt-2">No test for this session yet.</p>;

  if (submitted !== null) {
    return (
      <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200">
        <p className="font-semibold text-green-800">Test submitted!</p>
        <p className="text-green-700 mt-1">Your score: {submitted.score}% ({submitted.correct}/{submitted.totalQuestions} correct)</p>
      </div>
    );
  }

  if (isLearner && !showAttempt && test.attempts?.length === 0) {
    return (
      <div>
        <p className="font-medium">{test.title}</p>
        <p className="text-sm text-gray-600">{test.questions?.length || 0} questions</p>
        <button onClick={() => setShowAttempt(true)} className="mt-3 btn-primary">Attempt Test</button>
      </div>
    );
  }
  if (isLearner && showAttempt) {
    return <AttemptTestForm test={test} onDone={(result) => { setSubmitted(result); setShowAttempt(false); }} onCancel={() => setShowAttempt(false)} />;
  }

  return (
    <div className="mt-4">
      <p className="font-medium">{test.title}</p>
      <p className="text-sm text-gray-600">{test.questions?.length || 0} questions</p>
      {test.attempts?.length > 0 && (
        <p className="text-sm text-green-600 mt-1">
          Learner score: {test.attempts[test.attempts.length - 1].score}%
        </p>
      )}
    </div>
  );
}

function CreateTestForm({ sessionId, onDone, onCancel }) {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ 
    question: '', 
    options: ['', '', '', ''], 
    correctOption: 0 
  }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => setQuestions((q) => [...q, { 
    question: '', 
    options: ['', '', '', ''], 
    correctOption: 0 
  }]);
  
  const removeQuestion = (i) => setQuestions((q) => q.filter((_, idx) => idx !== i));
  
  const updateQuestion = (i, field, value) => {
    setQuestions((q) => q.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));
  };

  const updateOption = (questionIdx, optionIdx, value) => {
    setQuestions((q) => q.map((item, idx) => {
      if (idx === questionIdx) {
        const newOptions = [...item.options];
        newOptions[optionIdx] = value;
        return { ...item, options: newOptions };
      }
      return item;
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title required'); return; }
    
    const validQuestions = questions.filter((q) => q.question.trim());
    if (!validQuestions.length) { setError('At least one question required'); return; }
    
    // Validate each question has at least 2 non-empty options
    for (let i = 0; i < validQuestions.length; i++) {
      const nonEmptyOptions = validQuestions[i].options.filter(opt => opt.trim());
      if (nonEmptyOptions.length < 2) {
        setError(`Question ${i + 1} must have at least 2 options`);
        return;
      }
    }
    
    setError('');
    setSaving(true);
    try {
      await api.post('/tests', {
        sessionId,
        title: title.trim(),
        questions: validQuestions.map((q) => ({
          question: q.question.trim(),
          options: q.options.filter(opt => opt.trim()).map(opt => opt.trim()),
          correctOption: q.correctOption,
        })),
      });
      onDone();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create test');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Test title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="input-field" 
          placeholder="e.g. Quiz 1" 
          required 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Questions</label>
        {questions.map((q, i) => (
          <div key={i} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <label className="text-sm font-medium text-gray-700">Question {i + 1}</label>
              {questions.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeQuestion(i)} 
                  className="text-red-600 text-sm hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            
            <input
              type="text"
              value={q.question}
              onChange={(e) => updateQuestion(i, 'question', e.target.value)}
              className="input-field mb-3"
              placeholder="Enter question"
              required
            />
            
            <div className="space-y-2 mb-3">
              <label className="block text-xs font-medium text-gray-600">Options</label>
              {q.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${i}`}
                    checked={q.correctOption === optIdx}
                    onChange={() => updateQuestion(i, 'correctOption', optIdx)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(i, optIdx, e.target.value)}
                    className="input-field flex-1"
                    placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                  />
                </div>
              ))}
            </div>
            
            <p className="text-xs text-gray-500 italic">
              Select the radio button next to the correct answer
            </p>
          </div>
        ))}
        
        <button 
          type="button" 
          onClick={addQuestion} 
          className="text-primary-600 text-sm font-medium hover:text-primary-700"
        >
          + Add question
        </button>
      </div>
      
      {error && <p className="text-sm text-red-600">{error}</p>}
      
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Creating...' : 'Create Test'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function LeaveReviewButton({ sessionId, onDone }) {
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/reviews', { sessionId, rating, comment });
      setShow(false);
      onDone?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setSending(false);
    }
  };

  if (!show) return <button onClick={() => setShow(true)} className="text-primary-600 hover:underline">Leave a review</button>;
  return (
    <form onSubmit={submit} className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
      <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="input-field w-24">
        {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r} ★</option>)}
      </select>
      <label className="block text-sm font-medium text-gray-700">Comment (optional)</label>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="input-field" rows={2} />
      <div className="flex gap-2">
        <button type="submit" disabled={sending} className="btn-primary">Submit Review</button>
        <button type="button" onClick={() => setShow(false)} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}

function AttemptTestForm({ test, onDone, onCancel }) {
  const [answers, setAnswers] = useState(test.questions?.map(() => null) || []);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post(`/tests/${test._id}/attempt`, { answers });
      onDone(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit test');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-6">
      <p className="font-medium text-lg">{test.title}</p>
      
      {(test.questions || []).map((q, qIdx) => (
        <div key={q._id || qIdx} className="p-4 border border-gray-200 rounded-lg bg-white">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            {qIdx + 1}. {q.question}
          </label>
          
          <div className="space-y-2">
            {(q.options || []).map((option, optIdx) => (
              <label 
                key={optIdx} 
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`question-${qIdx}`}
                  value={optIdx}
                  checked={answers[qIdx] === optIdx}
                  onChange={() => setAnswers((a) => { 
                    const n = [...a]; 
                    n[qIdx] = optIdx; 
                    return n; 
                  })}
                  className="w-4 h-4 text-primary-600"
                  required
                />
                <span className="text-sm text-gray-700">
                  {String.fromCharCode(65 + optIdx)}. {option}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
      
      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Submitting...' : 'Submit Test'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}