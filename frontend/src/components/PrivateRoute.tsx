import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './PrivateRoute.styles';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <p style={styles.loadingText}>로딩 중...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
