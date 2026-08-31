import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Home,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  Target,
  Scaling,
  RefreshCw,
  Crop,
  FileArchive,
  FileText,
  Wrench
} from 'lucide-react';
import { checkServerHealth } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverStatus, setServerStatus] = useState('online');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const verifyBackend = async () => {
      const result = await checkServerHealth();
      if (isMounted) {
        setServerStatus(result.isOnline ? 'online' : 'offline');
      }
    };
    verifyBackend();
    const interval = setInterval(verifyBackend, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Handle Logo & Home clicks (Navigates to / and resets the upload box if already on /)
  const handleHomeClick = (e) => {
    window.dispatchEvent(new CustomEvent('imageinkb:reset-home'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Compress', path: '/compress', icon: Target },
    { name: 'Resize', path: '/resize', icon: Scaling },
    { name: 'Convert', path: '/convert', icon: RefreshCw },
    { name: 'Img to PDF', path: '/image-to-pdf', icon: FileText },
    { name: 'Editor', path: '/editor', icon: Crop },
    { name: 'ZipImg', path: '/zipimg', icon: FileArchive },
    { name: 'All Tools', path: '/tools', icon: Wrench }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo (Image In Kb) - Always clickable to go Home and reset */}
        <Link
          to="/"
          onClick={handleHomeClick}
          className="flex items-center gap-2.5 group cursor-pointer"
          title="Image In Kb - Go to Home Page"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform bg-slate-900 border border-slate-700/50 flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="Image In Kb" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Image In <span className="text-indigo-600 dark:text-indigo-400">Kb</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isHome = link.path === '/';
            const isActive = link.path === '/zipimg'
              ? location.pathname === '/zipimg' || location.pathname === '/batch'
              : location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={isHome ? handleHomeClick : undefined}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Theme Toggle, Auth & Mobile Hamburger */}
        <div className="flex items-center gap-2">
          
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Desktop User / Auth */}
          {isAuthenticated ? (
            <div className="hidden sm:block relative">
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-medium text-slate-900 dark:text-white transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center font-bold text-[10px] text-white">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="truncate max-w-[80px]">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1 z-50 text-xs animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] px-4 py-4 space-y-3 animate-fade-in shadow-xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isHome = link.path === '/';
              const isActive = link.path === '/zipimg'
                ? location.pathname === '/zipimg' || location.pathname === '/batch'
                : location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={isHome ? handleHomeClick : () => setIsMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold flex items-center justify-between"
                >
                  <span>My Dashboard ({user?.name})</span>
                  <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-between cursor-pointer"
                >
                  <span>Sign Out</span>
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold text-center border border-slate-200 dark:border-slate-800"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold text-center shadow-sm"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

    </header>
  );
}
