import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useUserStore } from './stores';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Fridge from './pages/Fridge';
import Shopping from './pages/Shopping';
import RecipeDetail from './pages/RecipeDetail';
import Profile from './pages/Profile';
import Stats from './pages/Stats';

function App() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  return (
    <Router>
      {/* Toast通知 */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '16px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#2E7D32',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF8C38',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* 登录页 */}
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} 
        />

        {/* 需要认证的页面 */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/fridge" element={<ProtectedRoute><Fridge /></ProtectedRoute>} />
        <Route path="/shopping" element={<ProtectedRoute><Shopping /></ProtectedRoute>} />
        <Route path="/recipe/:id" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />

        {/* 默认重定向 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;