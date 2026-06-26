import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ChefHat } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../utils/apiServices';
import { useUserStore } from '../stores';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useUserStore((state) => state.login);

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // 登录
        const res = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });

        if (res.success) {
          login(res.data.user, res.data.token);
          toast.success('登录成功！');
          navigate(from, { replace: true });
        }
      } else {
        // 注册
        if (formData.password !== formData.confirmPassword) {
          toast.error('两次密码不一致');
          setLoading(false);
          return;
        }

        const res = await authAPI.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        if (res.success) {
          login(res.data.user, res.data.token);
          toast.success('注册成功！');
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 text-center animate-fadeIn">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <ChefHat size={40} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">HomePlate-AI</h1>
        <p className="text-gray-500 text-sm mt-1">智能菜谱管理助手</p>
      </div>

      {/* 表单卡片 */}
      <div className="w-full max-w-md bg-white rounded-card card-shadow p-6 animate-fadeIn">
        {/* Tab切换 */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              isLogin 
                ? 'bg-primary text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              !isLogin 
                ? 'bg-primary text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            注册
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="用户名"
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          )}

          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="邮箱"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="密码"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full pl-12 pr-12 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {!isLogin && (
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="确认密码"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
                minLength={6}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              isLogin ? '登录' : '注册'
            )}
          </button>
        </form>

        {/* 测试账户提示 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500 text-center">
            测试账户：test@example.com / test123
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;