import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Chatbot from "../components/Chatbot";

export default function Home() {
  const token = useAuthStore((s) => s.token);

  const features = [
    { 
      icon: '🎯', 
      title: 'Smart Matching', 
      desc: 'AI-powered match score based on skills you offer and need.',
      neonColor: 'cyan',
      glowColor: 'rgba(0, 255, 255, 0.5)'
    },
    { 
      icon: '📹', 
      title: 'Built-in Classroom', 
      desc: 'Video, chat, whiteboard—all in one seamless platform.',
      neonColor: 'pink',
      glowColor: 'rgba(255, 0, 255, 0.5)'
    },
    { 
      icon: '📝', 
      title: 'Tests & Reviews', 
      desc: 'Assess learning progress and rate your sessions.',
      neonColor: 'blue',
      glowColor: 'rgba(59, 130, 246, 0.5)'
    },
    { 
      icon: '🔒', 
      title: 'Secure & Private', 
      desc: 'JWT authentication with enterprise-grade security.',
      neonColor: 'purple',
      glowColor: 'rgba(168, 85, 247, 0.5)'
    },
  ];

  const steps = [
    { 
      step: '01', 
      title: 'Create Profile', 
      desc: 'Add skills you can teach and skills you want to learn. Build your learning identity.',
      to: '/signup',
      neonColor: '#FF00FF'
    },
    { 
      step: '02', 
      title: 'Get Matched', 
      desc: 'See smart recommendations based on your skills. Find your perfect learning partner.',
      to: '/browse',
      neonColor: '#00FFFF'
    },
    { 
      step: '03', 
      title: 'Swap & Learn', 
      desc: 'Send requests, join live sessions, and grow together in real-time.',
      to: '/how-it-works',
      neonColor: '#3B82F6'
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section - Dark with Neon Accents */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Neon Glow Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse-slow"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse-slow animation-delay-4000"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Neon Badge */}
            

            {/* Main Heading with Neon Text */}
            <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black text-white mb-8 leading-tight tracking-tighter">
              Learn & Teach Skills{' '}
              <span className="block mt-4 neon-text-gradient">
                Together
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-8 text-xl sm:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
              Connect with peers who want to share what they know. 
              <span className="block mt-2 font-bold text-white">Swap skills—no cost, just exchange.</span>
            </p>

            {/* Neon CTA Buttons */}
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <Link 
                to="/browse" 
                className="group relative px-10 py-5 bg-cyan-500 text-black font-black rounded-full text-lg overflow-hidden transition-all duration-300 hover:scale-105 neon-glow-cyan"
              >
                <span className="relative z-10">Browse Profiles</span>
                <span className="inline-block ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
              </Link>
              {!token && (
                <Link 
                  to="/signup" 
                  className="group px-10 py-5 bg-transparent border-2 border-pink-500 text-pink-500 font-black rounded-full text-lg hover:bg-pink-500 hover:text-black transition-all duration-300 neon-border-pink hover:scale-105"
                >
                  Get Started Free
                </Link>
              )}
              {token && (
                <Link 
                  to="/requests" 
                  className="group px-10 py-5 bg-transparent border-2 border-pink-500 text-pink-500 font-black rounded-full text-lg hover:bg-pink-500 hover:text-black transition-all duration-300 neon-border-pink hover:scale-105"
                >
                  My Requests
                </Link>
              )}
            </div>

            {/* Neon Stats */}
            <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              {[
                { number: '10K+', label: 'Active Users', color: 'cyan' },
                { number: '50K+', label: 'Skills Exchanged', color: 'pink' },
                { number: '95%', label: 'Success Rate', color: 'blue' },
              ].map((stat, i) => (
                <div key={i} className="text-center group cursor-pointer">
                  <div className={`text-4xl sm:text-5xl font-black mb-2 ${
                    stat.color === 'cyan' ? 'text-cyan-400 neon-text-cyan' :
                    stat.color === 'pink' ? 'text-pink-400 neon-text-pink' :
                    'text-blue-400 neon-text-blue'
                  } group-hover:scale-110 transition-transform duration-300`}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-500 uppercase tracking-widest font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center animate-bounce neon-border-cyan">
            <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* How It Works Section - White with Dark Accents */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.05),transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-2 bg-black rounded-full mb-6 border border-cyan-500 neon-border-cyan">
              <span className="text-cyan-400 font-black text-sm uppercase tracking-widest">How It Works</span>
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-black mb-6 tracking-tight">
              Start Learning in{' '}
              <span className="neon-text-gradient-static">
                3 Simple Steps
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Create a profile, list what you can teach and what you want to learn. We match you with peers for skill swaps.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map(({ step, title, desc, to, neonColor }, i) => (
              <Link 
                key={step} 
                to={to} 
                className="group relative"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-transparent transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,0,0,0.1)] transform hover:-translate-y-4 h-full group-hover:bg-black">
                  {/* Neon Border on Hover */}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ 
                      boxShadow: `0 0 30px ${neonColor}, inset 0 0 30px ${neonColor}20`,
                      border: `2px solid ${neonColor}`
                    }}
                  ></div>

                  <div className="relative z-10">
                    {/* Step Number with Neon */}
                    <div 
                      className="inline-flex w-20 h-20 rounded-2xl items-center justify-center mb-6 font-black text-2xl transition-all duration-500 border-2"
                      style={{ 
                        backgroundColor: 'black',
                        color: neonColor,
                        borderColor: neonColor,
                        boxShadow: `0 0 20px ${neonColor}80`
                      }}
                    >
                      {step}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-black text-black group-hover:text-white mb-4 transition-colors duration-300">
                      {title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 group-hover:text-gray-300 leading-relaxed mb-6 transition-colors duration-300">
                      {desc}
                    </p>

                    {/* Arrow with Neon Color */}
                    <div 
                      className="flex items-center font-black group-hover:translate-x-2 transition-transform duration-300"
                      style={{ color: neonColor }}
                    >
                      Learn More
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Light Gray with Neon Cards */}
      <section className="py-24 lg:py-32 bg-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-2 bg-black rounded-full mb-6 border border-pink-500 neon-border-pink">
              <span className="text-pink-400 font-black text-sm uppercase tracking-widest">Why SkillConnect?</span>
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-black mb-6 tracking-tight">
              Everything You Need to{' '}
              <span className="neon-text-gradient-static">
                Succeed
              </span>
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon, title, desc, neonColor }, i) => (
              <div
                key={title}
                className="group relative bg-black rounded-3xl p-8 border-2 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 overflow-hidden"
                style={{ 
                  borderColor: neonColor === 'cyan' ? '#00ffff34' : 
                               neonColor === 'pink' ? '#FF00FF' : 
                               neonColor === 'blue' ? '#3B82F6' : '#A855F7'
                }}
              >
                {/* Neon Glow on Hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
                  style={{ 
                    backgroundColor: neonColor === 'cyan' ? '#00FFFF' : 
                                    neonColor === 'pink' ? '#FF00FF' : 
                                    neonColor === 'blue' ? '#3B82F6' : '#A855F7'
                  }}
                ></div>

                <div className="relative z-10">
                  {/* Icon Container */}
                  <div 
                    className="inline-flex w-20 h-20 rounded-2xl items-center justify-center text-4xl mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 border-2"
                    style={{ 
                      borderColor: neonColor === 'cyan' ? '#00FFFF' : 
                                   neonColor === 'pink' ? '#FF00FF' : 
                                   neonColor === 'blue' ? '#3B82F6' : '#A855F7',
                      boxShadow: `0 0 20px ${neonColor === 'cyan' ? '#00FFFF80' : 
                                             neonColor === 'pink' ? '#FF00FF80' : 
                                             neonColor === 'blue' ? '#3B82F680' : '#A855F780'}`
                    }}
                  >
                    {icon}
                  </div>

                  {/* Title */}
                  <h3 
                    className="text-xl font-black mb-3"
                    style={{ 
                      color: neonColor === 'cyan' ? '#00FFFF' : 
                             neonColor === 'pink' ? '#FF00FF' : 
                             neonColor === 'blue' ? '#3B82F6' : '#A855F7'
                    }}
                  >
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed font-medium">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Dark with Vibrant Neon */}
      <section className="py-24 bg-black relative overflow-hidden">
        {/* Neon Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-cyan-500 opacity-10 blur-[150px]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-pink-500 opacity-10 blur-[150px]"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
            Ready to{' '}
            <span className="neon-text-gradient">
              Swap Skills?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-medium">
            Join SkillConnect and start learning from peers today. 
            <span className="block mt-2 text-white font-bold">No credit card required.</span>
          </p>
          
          {!token && (
            <Link 
              to="/signup" 
              className="group inline-flex items-center gap-3 px-12 py-6 rounded-full bg-gradient-to-r from-cyan-500 via-pink-500 to-blue-500 text-black font-black text-lg shadow-[0_0_40px_rgba(0,255,255,0.5)] hover:shadow-[0_0_60px_rgba(255,0,255,0.7)] transform hover:scale-105 transition-all duration-300"
            >
              Create Free Account
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          )}
        </div>
      </section>

      {/* Custom Neon Styles */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Neon Text Effects */
        .neon-text-gradient {
          background: linear-gradient(90deg, #00FFFF 0%, #FF00FF 50%, #3B82F6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.5)) drop-shadow(0 0 40px rgba(255, 0, 255, 0.3));
        }

        .neon-text-gradient-static {
          background: linear-gradient(90deg, #00FFFF 0%, #FF00FF 50%, #3B82F6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .neon-text-cyan {
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.5);
        }

        .neon-text-pink {
          text-shadow: 0 0 10px rgba(255, 0, 255, 0.8), 0 0 20px rgba(255, 0, 255, 0.5);
        }

        .neon-text-blue {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.5);
        }

        /* Neon Border Effects */
        .neon-border-cyan {
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.5), inset 0 0 10px rgba(0, 255, 255, 0.2);
        }

        .neon-border-pink {
          box-shadow: 0 0 10px rgba(255, 0, 255, 0.5), inset 0 0 10px rgba(255, 0, 255, 0.2);
        }

        /* Neon Glow Effects */
        .neon-glow-cyan {
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3);
        }

        .neon-glow-cyan:hover {
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.5);
        }
      `}</style>
      <Chatbot />
    </div>
  );
}