import { useState, useEffect } from 'react';
import { ChefHat, Sparkles, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { recipeAPI, fridgeAPI, aiAPI } from '../utils/apiServices';
import { useRecipeStore, useUserStore } from '../stores';
import RecipeCard from '../components/RecipeCard';
import CategoryTabs from '../components/CategoryTabs';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import BottomNav from '../components/BottomNav';

function Home() {
  const user = useUserStore((state) => state.user);
  const favorites = useRecipeStore((state) => state.favorites);
  const addFavorite = useRecipeStore((state) => state.addFavorite);
  const removeFavorite = useRecipeStore((state) => state.removeFavorite);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  // 加载推荐菜谱和全部菜谱
  useEffect(() => {
    loadRecipes();
    loadAiRecommendations();
  }, []);

  // 根据搜索和分类过滤菜谱
  useEffect(() => {
    if (searchQuery || activeCategory !== 'all') {
      loadFilteredRecipes();
    }
  }, [searchQuery, activeCategory]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      
      // 加载推荐菜谱
      const recommendedRes = await recipeAPI.getRecommended({ limit: 6 });
      if (recommendedRes.success) {
        setRecommendedRecipes(recommendedRes.data);
      }

      // 加载全部菜谱
      const allRes = await recipeAPI.getRecipes({ limit: 20 });
      if (allRes.success) {
        setAllRecipes(allRes.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredRecipes = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 20,
        keyword: searchQuery,
        category: activeCategory !== 'all' ? activeCategory : undefined,
      };
      
      const res = await recipeAPI.getRecipes(params);
      if (res.success) {
        setAllRecipes(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // AI智能推荐
  const loadAiRecommendations = async () => {
    try {
      setAiLoading(true);
      
      // 先获取用户冰箱食材
      const fridgeRes = await fridgeAPI.getItems({ limit: 50 });
      
      if (fridgeRes.success && fridgeRes.data.length > 0) {
        const ingredients = fridgeRes.data.map(item => item.name);
        
        // 调用AI推荐接口
        const aiRes = await aiAPI.recommendRecipes({
          ingredients,
          preference: '',
        });
        
        if (aiRes.success) {
          setAiRecommendations(aiRes.data);
        }
      }
    } catch (error) {
      // AI服务可能未配置，静默处理
      console.log('AI推荐暂不可用');
    } finally {
      setAiLoading(false);
    }
  };

  // 切换收藏
  const handleToggleFavorite = async (recipeId) => {
    try {
      const isFav = favorites.includes(recipeId);
      
      if (isFav) {
        await recipeAPI.removeFavorite(recipeId);
        removeFavorite(recipeId);
        toast.success('取消收藏');
      } else {
        await recipeAPI.addFavorite(recipeId);
        addFavorite(recipeId);
        toast.success('已收藏');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fef7ed] pb-20">
      {/* Header */}
      <header className="p-4 bg-gradient-to-r from-primary to-primary-light">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <ChefHat size={24} />
              HomePlate-AI
            </h1>
            <p className="text-white/80 text-sm mt-1">
              {user?.nickname || '美食达人'}，今天想吃什么？
            </p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">👨‍🍳</span>
          </div>
        </div>
        
        {/* 搜索栏 */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="搜索菜谱..."
        />
      </header>

      <div className="p-4">
        {/* AI智能推荐 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            <span>AI智能推荐</span>
            <span className="text-xs text-gray-400 ml-2">基于你的库存食材</span>
          </h2>
          
          {aiLoading ? (
            <div className="bg-white rounded-card p-6 card-shadow">
              <LoadingSpinner size={24} text="AI正在分析..." />
            </div>
          ) : aiRecommendations.length > 0 ? (
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-card p-4 card-shadow">
              <div className="space-y-3">
                {aiRecommendations.map((rec, index) => (
                  <div key={index} className="bg-white rounded-lg p-3">
                    <h4 className="font-medium text-gray-800">{rec.recipeName || rec.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{rec.reason || rec.description}</p>
                    <div className="flex gap-2 mt-2 text-xs text-gray-400">
                      <span>难度: {rec.difficulty}</span>
                      <span>时间: {rec.estimatedTime || rec.duration}分钟</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-card p-4 card-shadow text-center">
              <p className="text-gray-400 text-sm">
                添加冰箱食材后，AI将为你智能推荐菜谱
              </p>
            </div>
          )}
        </section>

        {/* 今日推荐 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-secondary" />
            <span>今日推荐</span>
          </h2>
          
          {loading ? (
            <LoadingSpinner />
          ) : recommendedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={favorites.includes(recipe.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🍽️"
              title="暂无推荐菜谱"
              description="稍后再来看看"
            />
          )}
        </section>

        {/* 全部菜谱 */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📚</span>
            <span>全部菜谱</span>
          </h2>
          
          {/* 分类标签 */}
          <div className="mb-4">
            <CategoryTabs
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : allRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={favorites.includes(recipe.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🔍"
              title="未找到相关菜谱"
              description="换个关键词试试"
            />
          )}
        </section>
      </div>

      <BottomNav />
    </div>
  );
}

export default Home;