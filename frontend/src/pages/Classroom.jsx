import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSocket } from '../api/socket';
import { useAuthStore } from '../store/authStore';

const COLORS = ['#000', '#e11', '#16a34a', '#2563eb', '#7c3aed', '#dc2626', '#f59e0b'];

export default function Classroom() {
  const { sessionId } = useParams();
  const [socket, setSocket] = useState(null);
  const [session, setSession] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [videoMuted, setVideoMuted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [whiteboardColor, setWhiteboardColor] = useState('#000');
  const [isEraser, setIsEraser] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const canvasRef = useRef(null);
  const chatEndRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPosRef = useRef(null);
  const userId = useAuthStore((s) => s.user?._id);

  useEffect(() => {
    const s = getSocket();
    if (!s || !sessionId) return;
    s.emit('join_room', sessionId);
    setSocket(s);
    s.on('room_chat_history', (history) => setChatMessages(history || []));
    s.on('chat_message', (msg) => setChatMessages((prev) => [...prev, msg]));
    s.on('whiteboard_state', (state) => {
      if (!canvasRef.current || !state?.length) return;
      const ctx = canvasRef.current.getContext('2d');
      state.forEach((d) => drawStroke(ctx, d));
    });
    s.on('whiteboard_draw', (data) => {
      if (!canvasRef.current) return;
      drawStroke(canvasRef.current.getContext('2d'), data);
    });
    s.on('whiteboard_clear', () => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    });
    s.on('webrtc_offer', async ({ from, offer }) => {
      if (from === userId) return;
      const pc = pcRef.current;
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      s.emit('webrtc_answer', { roomId: sessionId, answer });
    });
    s.on('webrtc_answer', async ({ from, answer }) => {
      if (from === userId) return;
      const pc = pcRef.current;
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });
    s.on('webrtc_ice', ({ from, candidate }) => {
      if (from === userId) return;
      const pc = pcRef.current;
      if (pc && candidate) pc.addIceCandidate(new RTCIceCandidate(candidate));
    });
    return () => {
      s.emit('leave_room', sessionId);
      s.off('room_chat_history');
      s.off('chat_message');
      s.off('whiteboard_state');
      s.off('whiteboard_draw');
      s.off('whiteboard_clear');
      s.off('webrtc_offer');
      s.off('webrtc_answer');
      s.off('webrtc_ice');
    };
  }, [sessionId, userId]);

  const drawStroke = useCallback((ctx, data) => {
    if (!ctx) return;
    if (data.clear) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      return;
    }
    ctx.strokeStyle = data.eraser ? '#fff' : (data.color || '#000');
    ctx.lineWidth = data.eraser ? 20 : (data.width || 2);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(data.x0, data.y0);
    ctx.lineTo(data.x1, data.y1);
    ctx.stroke();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !socket) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const sendDraw = (x0, y0, x1, y1) => {
      socket.emit('whiteboard_draw', {
        roomId: sessionId,
        x0: x0 / scaleX, y0: y0 / scaleY,
        x1: x1 / scaleX, y1: y1 / scaleY,
        color: whiteboardColor,
        width: isEraser ? 20 : 2,
        eraser: isEraser,
      });
    };

    const onPointerDown = (e) => {
      drawingRef.current = true;
      const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
      const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
      lastPosRef.current = { x, y };
      const sx = x * scaleX; const sy = y * scaleY;
      drawStroke(ctx, { x0: sx, y0: sy, x1: sx, y1: sy, color: whiteboardColor, eraser: isEraser, width: isEraser ? 20 : 2 });
    };
    const onPointerMove = (e) => {
      if (!drawingRef.current || !lastPosRef.current) return;
      const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
      const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
      const l = lastPosRef.current;
      drawStroke(ctx, { x0: l.x * scaleX, y0: l.y * scaleY, x1: x * scaleX, y1: y * scaleY, color: whiteboardColor, eraser: isEraser, width: isEraser ? 20 : 2 });
      sendDraw(l.x, l.y, x, y);
      lastPosRef.current = { x, y };
    };
    const onPointerUp = () => {
      drawingRef.current = false;
      lastPosRef.current = null;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerUp);
    };
  }, [sessionId, socket, whiteboardColor, isEraser, drawStroke]);

  useEffect(() => {
    let stream = null;
    let pc = null;
    const init = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });
        pcRef.current = pc;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        pc.ontrack = (e) => setRemoteStream(e.streams[0]);
        pc.onicecandidate = (e) => {
          if (e.candidate) {
            getSocket()?.emit('webrtc_ice', { roomId: sessionId, candidate: e.candidate });
          }
        };
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        getSocket()?.emit('webrtc_offer', { roomId: sessionId, offer });
      } catch (err) {
        console.error('Media init error', err);
      }
    };
    init();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      pc?.close();
      pcRef.current = null;
    };
  }, [sessionId]);

  useEffect(() => {
    if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
  }, [localStream]);
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  const toggleVideo = () => {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoMuted(!videoTrack.enabled);
    }
  };
  const toggleAudio = () => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setAudioMuted(!audioTrack.enabled);
    }
  };
  const shareScreen = async () => {
    if (screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
      if (localStream && pcRef.current) {
        const videoTrack = localStream.getVideoTracks()[0];
        const sender = pcRef.current.getSenders().find((s) => s.track?.kind === 'video');
        if (sender && videoTrack) sender.replaceTrack(videoTrack);
      }
      return;
    }
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenStream(screenStream);
      const sender = pcRef.current?.getSenders().find((s) => s.track?.kind === 'video');
      if (sender && screenStream.getVideoTracks()[0]) sender.replaceTrack(screenStream.getVideoTracks()[0]);
      screenStream.getVideoTracks()[0].onended = () => {
        screenStream.getTracks().forEach((t) => t.stop());
        setScreenStream(null);
      };
    } catch (err) {
      console.error('Screen share error', err);
    }
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !socket) return;
    socket.emit('chat_message', { roomId: sessionId, text: chatInput.trim() });
    setChatInput('');
  };

  const clearWhiteboard = () => {
    if (!canvasRef.current || !socket) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    socket.emit('whiteboard_clear', sessionId);
  };

  const embedImage = () => {
    if (!imageUrl.trim() || !canvasRef.current) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height, 0.5);
      ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
      setImageUrl('');
    };
    img.onerror = () => alert('Could not load image. Use a valid URL.');
    img.src = imageUrl.trim();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const timerStr = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
  const PARTICIPANTS_COUNT = 2;

  return (
    <div className="h-screen max-h-[100vh] bg-gray-900 text-white flex flex-row overflow-hidden">
      {/* Left Section: 70–75% — Whiteboard + Control Bar */}
      <div className="flex-1 flex flex-col min-w-0 w-[70%] max-w-[75%]">
        {/* Top: Whiteboard Section */}
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800/50 border-r border-gray-700">
          {/* Toolbar: Pen, Eraser, Colors, Size, Image, Clear, Save */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700 bg-gray-800 flex-wrap shrink-0">
            <span className="text-xs text-gray-400 mr-1">Pen</span>
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => { setWhiteboardColor(c); setIsEraser(false); }}
                className={`w-7 h-7 rounded-full border-2 shrink-0 ${whiteboardColor === c && !isEraser ? 'border-white ring-1 ring-white' : 'border-gray-600 hover:border-gray-500'}`}
                style={{ backgroundColor: c }}
                title="Color"
              />
            ))}
            <span className="w-px h-6 bg-gray-600 mx-1" aria-hidden />
            <button
              onClick={() => setIsEraser(true)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium shrink-0 ${isEraser ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Eraser
            </button>
            <span className="text-xs text-gray-400 mx-1">Size</span>
            <span className="text-xs text-gray-300 px-2 py-1 rounded bg-gray-700">{isEraser ? '20' : '2'}px</span>
            <span className="w-px h-6 bg-gray-600 mx-1" aria-hidden />
            <div className="flex gap-1 items-center shrink-0">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL"
                className="w-28 px-2 py-1 rounded bg-gray-700 text-white text-xs"
              />
              <button onClick={embedImage} className="px-2 py-1 rounded bg-gray-600 text-xs hover:bg-gray-500">
                Image
              </button>
            </div>
            <span className="w-px h-6 bg-gray-600 mx-1" aria-hidden />
            <button onClick={clearWhiteboard} className="px-2.5 py-1.5 rounded-lg text-xs bg-gray-700 hover:bg-gray-600 shrink-0">
              Clear
            </button>
            <button type="button" className="px-2.5 py-1.5 rounded-lg text-xs bg-gray-700 hover:bg-gray-600 shrink-0" title="Save (placeholder)">
              Save
            </button>
          </div>
          {/* Canvas fills remaining space below toolbar */}
          <div className="flex-1 min-h-0 rounded-b-lg bg-white canvas-container overflow-hidden p-2">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="w-full h-full touch-none cursor-crosshair block"
              style={{ maxHeight: '100%', maxWidth: '100%' }}
            />
          </div>
        </div>
        {/* Bottom: Control Bar — only under whiteboard, centered, same width as whiteboard */}
        <div className="flex items-center justify-center gap-3 px-4 py-3 bg-gray-800 border-t border-r border-gray-700 shrink-0">
          <span className="text-sm tabular-nums text-gray-300 min-w-[3rem]" title="Timer">
            {timerStr}
          </span>
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-full text-sm font-medium ${audioMuted ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
            title={audioMuted ? 'Unmute' : 'Mute'}
          >
            {audioMuted ? 'Unmute' : 'Mic'}
          </button>
          <button
            onClick={toggleVideo}
            className={`p-2 rounded-full text-sm font-medium ${videoMuted ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
            title={videoMuted ? 'Start Video' : 'Stop Video'}
          >
            {videoMuted ? 'Cam Off' : 'Camera'}
          </button>
          <button
            onClick={shareScreen}
            className={`p-2 rounded-full text-sm font-medium ${screenStream ? 'bg-primary-600 hover:bg-primary-500' : 'bg-gray-700 hover:bg-gray-600'}`}
            title={screenStream ? 'Stop Share' : 'Share Screen'}
          >
            {screenStream ? 'Stop Share' : 'Screen'}
          </button>
          <button type="button" className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-sm" title="Settings">
            Settings
          </button>
          <span className="text-xs text-gray-400 px-2 py-1 rounded bg-gray-700" title="Participants">
            {PARTICIPANTS_COUNT} participants
          </span>
          <Link
            to={`/sessions/${sessionId}`}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-500 text-white"
          >
            End Call
          </Link>
        </div>
      </div>

      {/* Right Section: 25–30% — Fixed Sidebar: Videos + Chat */}
      <aside className="w-[30%] min-w-[280px] max-w-[30%] flex flex-col bg-gray-800 border-l border-gray-700 overflow-hidden shrink-0">
        {/* Top: Small stacked video tiles */}
        <div className="flex flex-col gap-2 p-2 border-b border-gray-700 shrink-0">
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover mirror" />
            <span className="absolute bottom-1 left-1 text-xs bg-black/70 px-2 py-0.5 rounded">You</span>
            {videoMuted && <span className="absolute top-1 right-1 text-xs bg-red-600 px-2 py-0.5 rounded">Off</span>}
          </div>
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <span className="absolute bottom-1 left-1 text-xs bg-black/70 px-2 py-0.5 rounded">Peer</span>
          </div>
        </div>
        {/* Bottom: Chat Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-3 py-2 border-b border-gray-700 font-medium text-sm shrink-0">Live Chat</div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
            {chatMessages.map((m) => (
              <div key={m.id || m.at} className="text-sm">
                <span className="text-primary-400 font-medium">{m.username}:</span> {m.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendChat} className="p-2 border-t border-gray-700 flex gap-2 shrink-0">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white text-sm outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button type="submit" className="px-3 py-2 rounded-lg bg-primary-600 text-sm font-medium shrink-0">Send</button>
          </form>
        </div>
      </aside>
    </div>
  );
}
