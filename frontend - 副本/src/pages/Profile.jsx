import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart, Settings, Bell, Moon, LogOut, ChevronRight, BarChart3, ChefHat } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI, recipeAPI } from '../utils/apiServices';
import { useUserStore, useRecipeStore } from '../stores';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import BottomNav from '../components/BottomNav';

function Profile() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const favorites = useRecipeStore((state) => state.favorites);

  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    autoSuggest: true,
  });

  // 加载收藏菜谱
  const loadFavorites = async () => {
    try {
      setLoadingFavorites(true);
      const res = await recipeAPI.getFavorites({ limit: 20 });
      if (res.success) {
        setFavoriteRecipes(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingFavorites(false);
    }
  };

  useEffect(() => {
    if (showFavoritesModal) {
      loadFavorites();
    }
  }, [showFavoritesModal]);

  // 登出
  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      logout();
      toast.success('已退出登录');
      navigate('/login');
    }
  };

  // 切换设置
  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
    toast.success(settings[key] ? '已关闭' : '已开启');
  };

  const menuItems = [
    { 
      icon: Heart, 
      label: '我的收藏', 
      onClick: () => setShowFavoritesModal(true), 
      badge: favorites.length,
      color: 'text-red-500'
    },
    { 
      icon: BarChart3, 
      label: '每周饮食统计', 
      onClick: () => navigate('/stats'),
      badge: null,
      color: 'text-primary'
    },
    { 
      icon: Bell, 
      label: '消息通知', 
      onClick: () => toast.success('功能开发中'), 
      badge: 3,
      color: 'text-blue-500'
    },
    { 
      icon: Moon, 
      label: '深色模式', 
      onClick: () => toast.success('功能开发中'), 
      badge: null,
      color: 'text-purple-500'
    },
    { 
      icon: Settings, 
      label: '设置', 
      onClick: () => toast.success('功能开发中'), 
      badge: null,
      color: 'text-gray-500'
    },
    { 
      icon: LogOut, 
      label: '退出登录', 
      onClick: handleLogout, 
      badge: null,
      color: 'text-red-500'
    },
  ];

  return (
    <div className="min-h-screen bg-[#fef7ed] pb-20">
      {/* Header */}
      <header className="p-4 bg-gradient-to-r from-primary to-primary-light">
        <h1 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
          <User size={24} />
          个人中心
        </h1>
        <p className="text-white/80 text-sm">管理你的账户和偏好</p>
      </header>

      <div className="p-4">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-card p-6 flex items-center gap-4 mb-6 card-shadow animate-fadeIn">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-400 rounded-full flex items-center justify-center text-3xl shadow-md">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              '👨‍🍳'
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-800 text-lg">{user?.nickname || '美食达人'}</h2>
            <p className="text-gray-500 text-sm">{user?.email || 'user@example.com'}</p>
            <p className="text-primary text-xs mt-1">
              已收藏 {favorites.length} 道菜谱
            </p>
          </div>
          <button
            onClick={() => toast.success('功能开发中')}
            className="text-primary text-sm hover:underline"
          >
            编辑资料
          </button>
        </div>

        {/* 菜单列表 */}
        <div className="bg-white rounded-card overflow-hidden card-shadow animate-fadeIn">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <Icon size={20} className={item.color} />
                <span className="flex-1 text-left text-gray-800">{item.label}</span>
                {item.badge !== null && (
                  <span className="bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            );
          })}
        </div>

        {/* 偏好设置 */}
        <div className="bg-white rounded-card p-4 mt-6 card-shadow animate-fadeIn">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Settings size={20} className="text-gray-500" />
            偏好设置
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">接收通知</p>
                <p className="text-sm text-gray-500">接收菜谱推荐和食材提醒</p>
              </div>
              <button
                onClick={() => toggleSetting('notifications')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.notifications ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">智能推荐</p>
                <p className="text-sm text-gray-500">根据库存自动推荐菜谱</p>
              </div>
              <button
                onClick={() => toggleSetting('autoSuggest')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.autoSuggest ? 'bg-secondary' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.autoSuggest ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 版本信息 */}
        <div className="text-center text-gray-400 text-xs mt-8">
          <p>HomePlate-AI v1.0.0</p>
          <p className="mt-1">© 2024 智能菜谱助手</p>
        </div>
      </div>

      {/* 收藏弹窗 */}
      <Modal
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        title="我的收藏"
        size="lg"
      >
        {loadingFavorites ? (
          <LoadingSpinner />
        ) : favoriteRecipes.length > 0 ? (
          <div className="space-y-3">
            {favoriteRecipes.map((fav) => (
              <div
                key={fav.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={fav.recipe?.image || `https://via.placeholder.com/60x60/FF8C38/FFFFFF?text=${fav.recipe?.name}`}
                  alt={fav.recipe?.name}
                  className="w-16 h-16 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/60x60/FF8C38/FFFFFF?text=${fav.recipe?.name}`;
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{fav.recipe?.name}</h4>
                  <p className="text-sm text-gray-500">
                    {fav.recipe?.duration}分钟 · {fav.recipe?.difficulty}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigate(`/recipe/${fav.recipeId}`);
                    setShowFavoritesModal(false);
                  }}
                  className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary-light transition-colors"
                >
                  查看
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🤍"
            title="暂无收藏"
            description="去首页收藏喜欢的菜谱吧"
          />
        )}
      </Modal>

      <BottomNav />
    </div>
  );
}

export default Profile;