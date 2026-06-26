import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, Calendar, ChefHat, Leaf, ShoppingCart } from 'lucide-react';
import { fridgeAPI, recipeAPI, shoppingAPI } from '../utils/apiServices';
import { useUserStore } from '../stores';
import LoadingSpinner from '../components/LoadingSpinner';

function Stats() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    fridge: null,
    recipes: null,
    shopping: null,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);

      // 加载冰箱统计
      const fridgeRes = await fridgeAPI.getStats();
      if (fridgeRes.success) {
        setStats(prev => ({ ...prev, fridge: fridgeRes.data }));
      }

      // 加载菜谱统计
      const recipesRes = await recipeAPI.getRecipes({ limit: 100 });
      if (recipesRes.success) {
        const recipes = recipesRes.data;
        const categories = {};
        recipes.forEach(r => {
          categories[r.category] = (categories[r.category] || 0) + 1;
        });
        setStats(prev => ({
          ...prev,
          recipes: {
            total: recipes.length,
            categories,
            recommended: recipes.filter(r => r.isRecommended).length,
          }
        }));
      }

      // 加载采购统计
      const shoppingRes = await shoppingAPI.getList();
      if (shoppingRes.success) {
        setStats(prev => ({
          ...prev,
          shopping: shoppingRes.data.stats
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 模拟每周饮食数据（实际项目中应从后端获取）
  const weeklyData = [
    { day: '周一', dishes: 3, calories: 1800 },
    { day: '周二', dishes: 2, calories: 1500 },
    { day: '周三', dishes: 4, calories: 2200 },
    { day: '周四', dishes: 2, calories: 1400 },
    { day: '周五', dishes: 3, calories: 1900 },
    { day: '周六', dishes: 5, calories: 2500 },
    { day: '周日', dishes: 4, calories: 2100 },
  ];

  const categoryLabels = {
    meat: { name: '肉类', icon: '🥩', color: 'bg-red-100 text-red-600' },
    vegetable: { name: '素菜', icon: '🥬', color: 'bg-green-100 text-green-600' },
    seafood: { name: '海鲜', icon: '🦐', color: 'bg-blue-100 text-blue-600' },
    soup: { name: '汤品', icon: '🥣', color: 'bg-yellow-100 text-yellow-600' },
    dessert: { name: '甜点', icon: '🍰', color: 'bg-pink-100 text-pink-600' },
    other: { name: '其他', icon: '🍽️', color: 'bg-gray-100 text-gray-600' },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fef7ed] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef7ed] pb-6">
      {/* Header */}
      <header className="p-4 bg-gradient-to-r from-primary to-primary-light">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white mb-2"
        >
          <ArrowLeft size={20} />
          返回
        </button>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 size={24} />
          每周饮食统计
        </h1>
        <p className="text-white/80 text-sm mt-1">了解你的饮食习惯</p>
      </header>

      <div className="p-4 space-y-6">
        {/* 本周概览 */}
        <section className="bg-white rounded-card p-4 card-shadow animate-fadeIn">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-primary" />
            本周概览
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-orange-50 rounded-lg">
              <ChefHat size={24} className="text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">
                {weeklyData.reduce((sum, d) => sum + d.dishes, 0)}
              </p>
              <p className="text-xs text-gray-500">烹饪次数</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Leaf size={24} className="text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-secondary">
                {stats.fridge?.total || 0}
              </p>
              <p className="text-xs text-gray-500">食材种类</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <ShoppingCart size={24} className="text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-500">
                {stats.shopping?.purchased || 0}
              </p>
              <p className="text-xs text-gray-500">采购完成</p>
            </div>
          </div>
        </section>

        {/* 每日烹饪统计 */}
        <section className="bg-white rounded-card p-4 card-shadow animate-fadeIn">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-secondary" />
            每日烹饪统计
          </h2>
          <div className="space-y-3">
            {weeklyData.map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-sm text-gray-500 w-12">{data.day}</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(data.dishes / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 w-8">
                    {data.dishes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 菜谱分类统计 */}
        {stats.recipes && (
          <section className="bg-white rounded-card p-4 card-shadow animate-fadeIn">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📊</span>
              菜谱分类分布
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(stats.recipes.categories).map(([category, count]) => {
                const info = categoryLabels[category] || categoryLabels.other;
                return (
                  <div key={category} className={`p-3 rounded-lg ${info.color}`}>
                    <span className="text-xl">{info.icon}</span>
                    <p className="text-lg font-bold mt-1">{count}</p>
                    <p className="text-xs">{info.name}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 冰箱库存状态 */}
        {stats.fridge && (
          <section className="bg-white rounded-card p-4 card-shadow animate-fadeIn">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Leaf size={20} className="text-secondary" />
              冰箱库存状态
            </h2>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-2 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-gray-800">{stats.fridge.total}</p>
                <p className="text-xs text-gray-500">总食材</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <p className="text-xl font-bold text-red-500">{stats.fridge.expired}</p>
                <p className="text-xs text-gray-500">已过期</p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <p className="text-xl font-bold text-orange-500">{stats.fridge.expiringSoon}</p>
                <p className="text-xs text-gray-500">临期</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <p className="text-xl font-bold text-green-500">
                  {stats.fridge.total - stats.fridge.expired - stats.fridge.expiringSoon}
                </p>
                <p className="text-xs text-gray-500">新鲜</p>
              </div>
            </div>
          </section>
        )}

        {/* 健康建议 */}
        <section className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-card p-4 card-shadow animate-fadeIn">
          <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>💡</span>
            健康饮食建议
          </h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-secondary">✓</span>
              <span>本周烹饪次数良好，继续保持均衡饮食</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>建议增加蔬菜类菜谱，补充维生素</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>冰箱中有{stats.fridge?.expiringSoon || 0}种食材即将过期，请尽快使用</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Stats;