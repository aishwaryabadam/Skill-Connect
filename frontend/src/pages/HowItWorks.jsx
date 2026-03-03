import { Link } from "react-router-dom";

export default function HowItWorks() {
  const steps = [
    {
      title: "Create Your Profile",
      desc: "Sign up and build your profile with skills you teach and learn. Add social links and availability to stand out.",
      icon: "👤",
      gradient: "from-pink-400 to-rose-400",
    },
    {
      title: "Browse & Get Matched",
      desc: "Discover smart match recommendations based on skill compatibility and match score.",
      icon: "🎯",
      gradient: "from-purple-400 to-indigo-400",
    },
    {
      title: "Send a Request",
      desc: "Send a skill swap request. Tutors can accept, reject, or reschedule sessions easily.",
      icon: "✉️",
      gradient: "from-blue-400 to-cyan-400",
    },
    {
      title: "Session Creation",
      desc: "Schedule online or offline sessions with proper date, time, and duration settings.",
      icon: "📅",
      gradient: "from-emerald-400 to-teal-400",
    },
    {
      title: "Join the Classroom",
      desc: "Experience live video, chat, screen sharing, and collaborative whiteboard in one place.",
      icon: "🎓",
      gradient: "from-amber-400 to-orange-400",
    },
    {
      title: "Tests & Reviews",
      desc: "Take structured tests after sessions and get auto-evaluated results. Leave meaningful reviews.",
      icon: "⭐",
      gradient: "from-violet-400 to-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden py-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-cyan-100 to-purple-100 border-2 border-cyan-300 text-cyan-700 font-bold text-sm">
            HOW IT WORKS
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            Your Journey to Skill Exchange
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A seamless journey from creating your profile to learning, teaching, and growing together. Follow these simple steps to unlock endless possibilities.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="group backdrop-blur-sm bg-white/90 border border-gray-200 rounded-3xl p-8 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-200/50 transition-all duration-500 hover:scale-[1.02] relative"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Step Number */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-100 border-2 border-gray-200 shadow-lg flex items-center justify-center">
                <span className={`text-lg font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                  {idx + 1}
                </span>
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-4xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {step.icon}
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-gray-800 text-center mb-3">
                {step.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-center leading-relaxed">
                {step.desc}
              </p>

              {/* Bottom Accent */}
              <div className={`mt-6 h-1 bg-gradient-to-r ${step.gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center`} />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="backdrop-blur-sm bg-white/80 border-2 border-gray-200 rounded-3xl p-12 text-center shadow-xl">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-extrabold mb-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              Join thousands of learners and teachers exchanging skills every day.
            </p>
            <Link
              to="/browse"
              className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-purple-300/50 transform hover:scale-105 transition-all duration-300"
            >
              Get Started Now →
            </Link>
          </div>
        </div>
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