import { Link } from 'react-router-dom';
import { useAppSelector } from '../store';
import LogoutButton from '../components/Auth/LogoutButton';
import { APP_ROUTES } from '../constants/routes';
import { ImageGallery } from '../components/Image/ImageGallery';

export const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">StockImagePlatform</div>
        </div>
        <nav className="sidebar-nav">
          <Link to={APP_ROUTES.DASHBOARD} className="sidebar-link active">
            Dashboard
          </Link>
        </nav>
      </aside>

      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Navbar */}
        <header className="navbar">
          <div className="navbar-title">Dashboard Overview</div>
          <div className="navbar-actions">
            <div className="user-info">
              {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'User'}
            </div>
            <LogoutButton />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="main-content">
          <div className="auth-card" style={{ maxWidth: '100%' }}>
            <h2 className="auth-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>
              Welcome back, {user?.firstName || 'Creator'}!
            </h2>
            <p className="auth-subtitle" style={{ textAlign: 'left', marginBottom: '2rem' }}>
              Here is what's happening with your account today.
            </p>
            
            <ImageGallery />
          </div>
        </main>
      </div>
    </div>
  );
};
