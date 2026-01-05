import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ghost, Home, Archive, Plus, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/vault', label: 'Ghost Vault', icon: Archive },
  { path: '/ghost', label: 'Ghost a Project', icon: Plus },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border md:hidden"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border z-40 flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Ghost className="w-8 h-8 text-primary transition-all duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 blur-lg bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold neon-text">Ghost Whisperer</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                  isActive
                    ? 'bg-primary/20 text-primary neon-border'
                    : 'text-muted-foreground hover:text-primary hover:bg-sidebar-accent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className={`font-medium ${isActive ? 'neon-text' : ''}`}>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 rounded-full bg-primary"
                    style={{ boxShadow: '0 0 10px hsl(142 71% 45% / 0.8)' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-sidebar-border">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-sidebar-accent">
                <User className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground truncate">{user.email}</span>
              </div>
              <button
                onClick={logOut}
                className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:neon-border-intense transition-all"
            >
              <User className="w-5 h-5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-20 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </motion.aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
