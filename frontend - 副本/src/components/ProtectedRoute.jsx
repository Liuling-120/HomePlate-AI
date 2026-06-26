import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../stores';

function ProtectedRoute({ children }) {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const location = useLocation();

  if (!isLoggedIn) {
    // 未登录，跳转到登录页，保存当前位置
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;