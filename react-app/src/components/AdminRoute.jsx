import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Only allow if user is admin (is_admin === true)
  if (!user || !user.is_admin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-20 h-20 rounded-full bg-red-950/20 border border-red-900/30 flex items-center justify-center text-red-500 mb-6 shadow-lg shadow-red-900/5">
          <span className="material-symbols-outlined text-4xl">block</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-on-surface mb-3">
          403 Access Denied
        </h1>
        <p className="text-on-surface-variant/70 text-sm max-w-md leading-relaxed mb-8">
          You do not have administrative clearance to access this portal. Please contact the club secretary if you believe this is an error.
        </p>
        <a 
          href="/"
          className="px-6 py-2.5 rounded-xl border border-outline-variant/30 text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container-high transition-colors"
        >
          Return to Safety
        </a>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
