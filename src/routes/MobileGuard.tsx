import { useIsMobile } from '@/hooks/useIsMobile';
import { Navigate, Outlet } from 'react-router-dom';

const MobileGuard = () => {
  const isMobile = useIsMobile()

  if (!isMobile) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export default MobileGuard;