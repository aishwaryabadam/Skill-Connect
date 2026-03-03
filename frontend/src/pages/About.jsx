import { Link } from 'react-router-dom';

export default function About() {
  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Community First',
      desc: 'We believe in the power of human connection and mutual growth. Every interaction strengthens our community.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Empower Learning',
      desc: 'Knowledge should be accessible to everyone. We remove barriers and create opportunities for continuous learning.',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Global Impact',
      desc: 'Skills know no borders. Our platform connects learners and teachers across the world, breaking geographical limitations.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Quality & Trust',
      desc: 'We maintain high standards through verified profiles, transparent reviews, and a commitment to excellence.',
      gradient: 'from-purple-500 to-violet-500'
    },
  ];

  const features = [
    {
      title: 'Verified Profiles',
      desc: 'Every member is verified to ensure a safe and trustworthy community. Know exactly who you\'re learning from or teaching.',
    },
    {
      title: 'Flexible Scheduling',
      desc: 'Choose between online sessions via Google Meet or in-person meetings. Learn at your own pace and on your own terms.',
    },
    {
      title: 'Real Reviews',
      desc: 'Transparent feedback system helps build trust. See what others have learned and share your own experiences.',
    },
    {
      title: 'No Hidden Fees',
      desc: 'Completely free platform. Exchange skills directly without intermediaries or payment barriers.',
    },
    {
      title: 'Global Network',
      desc: 'Connect with learners and teachers from 150+ countries. Access diverse perspectives and expertise.',
    },
    {
      title: 'Progress Tracking',
      desc: 'Track your learning journey with tests, certificates, and session history. Measure your growth.',
    },
  ];

  const impacts = [
    {
      title: 'Democratizing Education',
      desc: 'We\'ve eliminated financial barriers to learning, making quality education accessible to everyone regardless of economic background.',
      color: 'cyan'
    },
    {
      title: 'Building Connections',
      desc: 'Our platform has facilitated meaningful connections between millions of learners and teachers, creating lasting relationships and networks.',
      color: 'pink'
    },
    {
      title: 'Empowering Communities',
      desc: 'Local communities have leveraged SkillSwap to share cultural knowledge, professional skills, and personal development opportunities.',
      color: 'purple'
    },
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,0,255,0.1),transparent_50%)]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center py-20">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-black mb-8 tracking-tight leading-none">
            ABOUT
            <span className="block mt-2 neon-text-gradient-dark">
              SKILLCONNECT
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
            We're building a world where knowledge flows freely, where expertise is shared generously, and where anyone can learn anything from anyone. 
            <span className="block mt-4 text-black font-bold">SkillSwap is more than a platform—it's a movement toward equitable, accessible learning.</span>
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-green-600 to-emerald-600 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-5xl sm:text-6xl font-black text-white mb-8 tracking-tight">
                OUR MISSION
              </h2>
              <div className="space-y-6 text-lg text-white/90 leading-relaxed">
                <p className="font-medium">
                  To create a global community where knowledge is the currency, where every person has the opportunity to teach and learn, and where barriers to education are eliminated.
                </p>
                <p>
                  We believe that the best learning happens through direct human connection, peer-to-peer exchange, and mutual respect. By removing financial barriers, we unlock the potential in every individual.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                  alt="Team collaboration"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden bg-pastel-waves">
        {/* Animated Gradient Waves Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="wave-layer wave-layer-1"></div>
          <div className="wave-layer wave-layer-2"></div>
          <div className="wave-layer wave-layer-3"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-black mb-6 tracking-tight">
              OUR VALUES
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              These principles guide every decision we make and every feature we build.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <div
                key={i}
                className="group relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/60 hover:border-transparent transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2"
              >
                {/* Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} text-white items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    {value.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-black text-black mb-4">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-700 leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose SkillSwap Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-black mb-6 tracking-tight">
              WHY CHOOSE{' '}
              <span className="neon-text-gradient-dark">
                SKILLSWAP?
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              We've designed every aspect of our platform to make skill exchange seamless, rewarding, and meaningful.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-cyan-400 transition-all duration-500 hover:shadow-xl transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-black text-black mb-3 group-hover:text-cyan-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-black mb-6 tracking-tight">
              OUR IMPACT
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              Since our launch, SkillSwap has transformed how people learn and connect globally.
            </p>
          </div>

          <div className="space-y-12">
            {impacts.map((impact, i) => (
              <div
                key={i}
                className="group relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-10 border-l-8 transition-all duration-500 hover:shadow-xl transform hover:-translate-x-2"
                style={{
                  borderColor: impact.color === 'cyan' ? '#00FFFF' :
                               impact.color === 'pink' ? '#FF00FF' : '#A855F7'
                }}
              >
                <h3 className="text-3xl font-black text-black mb-4">
                  {impact.title}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed max-w-4xl">
                  {impact.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Image Placeholder */}
          <div className="mt-16 flex justify-center">
            <img 
              src="/skillmapimage.png" 
              alt="SkillConnect Ecosystem"
              className="w-2/3 max-w-5xl h-auto rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-black to-gray-900 relative overflow-hidden">
        {/* Neon Glow Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-cyan-500 opacity-10 blur-[150px]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-pink-500 opacity-10 blur-[150px]"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl sm:text-6xl font-black text-white mb-6 tracking-tight">
            Join the{' '}
            <span className="neon-text-gradient">
              Movement
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-medium">
            Be part of a global community that's redefining education. 
            <span className="block mt-2 text-white font-bold">Start sharing your skills today.</span>
          </p>
          
          <Link 
            to="/signup" 
            className="group inline-flex items-center gap-3 px-12 py-6 rounded-full bg-gradient-to-r from-cyan-500 via-pink-500 to-blue-500 text-black font-black text-lg shadow-[0_0_40px_rgba(0,255,255,0.5)] hover:shadow-[0_0_60px_rgba(255,0,255,0.7)] transform hover:scale-105 transition-all duration-300"
          >
            Get Started Free
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </Link>
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes wave-animation {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-25%) translateY(-5%); }
          100% { transform: translateX(-50%) translateY(0); }
        }

        @keyframes wave-animation-reverse {
          0% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-25%) translateY(5%); }
          100% { transform: translateX(0) translateY(0); }
        }

        /* Pastel Gradient Wave Backgrounds */
        .bg-pastel-waves {
          background: linear-gradient(135deg, 
            rgba(224, 231, 255, 0.4) 0%,
            rgba(252, 231, 243, 0.4) 25%,
            rgba(237, 233, 254, 0.4) 50%,
            rgba(255, 237, 237, 0.4) 75%,
            rgba(224, 242, 254, 0.4) 100%
          );
        }

        /* Wave Layers */
        .wave-layer {
          position: absolute;
          width: 200%;
          height: 100%;
          opacity: 0.3;
        }

        .wave-layer-1 {
          background: linear-gradient(90deg, 
            transparent,
            rgba(147, 197, 253, 0.3),
            rgba(251, 207, 232, 0.3),
            rgba(196, 181, 253, 0.3),
            transparent
          );
          animation: wave-animation 20s ease-in-out infinite;
        }

        .wave-layer-2 {
          background: linear-gradient(90deg, 
            transparent,
            rgba(252, 165, 165, 0.3),
            rgba(224, 242, 254, 0.3),
            rgba(254, 240, 138, 0.3),
            transparent
          );
          animation: wave-animation-reverse 25s ease-in-out infinite;
          animation-delay: -5s;
        }

        .wave-layer-3 {
          background: linear-gradient(90deg, 
            transparent,
            rgba(216, 180, 254, 0.3),
            rgba(165, 243, 252, 0.3),
            rgba(254, 202, 202, 0.3),
            transparent
          );
          animation: wave-animation 30s ease-in-out infinite;
          animation-delay: -10s;
        }

        /* Neon Text Effects */
        .neon-text-gradient {
          background: linear-gradient(90deg, #00FFFF 0%, #FF00FF 50%, #3B82F6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.5)) drop-shadow(0 0 40px rgba(255, 0, 255, 0.3));
        }

        .neon-text-gradient-dark {
          background: linear-gradient(90deg, #00FFFF 0%, #FF00FF 50%, #3B82F6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.4)) drop-shadow(0 0 20px rgba(255, 0, 255, 0.3));
        }
      `}</style>
    </div>
  );
}