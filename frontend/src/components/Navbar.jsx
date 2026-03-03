import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/browse', label: 'Browse Profiles' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/about', label: 'About' },
  { to: '/how-it-works', label: 'How It Works' },
];

const authLinks = [
  { to: '/requests', label: 'Requests' },
  { to: '/sessions', label: 'Sessions' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const token = useAuthStore((s) => s.token);
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdown(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              SkillConnect
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-4 py-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition"
              >
                {label}
              </Link>
            ))}
            {token && authLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-4 py-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {token ? (
              <div className="relative">
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium text-gray-700"
                >
                  <span className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold">
                    {(profile?.name || 'U').charAt(0).toUpperCase()}
                  </span>
                  {profile?.name || 'Profile'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-xl shadow-card-hover border border-gray-100 z-20">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-primary-50"
                        onClick={() => setDropdown(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/notifications"
                        className="block px-4 py-2 text-gray-700 hover:bg-primary-50"
                        onClick={() => setDropdown(false)}
                      >
                        Notifications
                      </Link>
                      <Link
                        to="/reviews"
                        className="block px-4 py-2 text-gray-700 hover:bg-primary-50"
                        onClick={() => setDropdown(false)}
                      >
                        My Reviews
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl font-medium text-primary-600 hover:bg-primary-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg hover:bg-primary-50 text-gray-700">
                  {label}
                </Link>
              ))}
              {token && authLinks.map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg hover:bg-primary-50 text-gray-700">
                  {label}
                </Link>
              ))}
              {token ? (
                <button onClick={handleLogout} className="px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50">
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg hover:bg-primary-50">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="px-4 py-3 btn-primary mx-4 text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
