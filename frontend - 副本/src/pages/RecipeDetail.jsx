import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Heart, ShoppingCart, Leaf, ChefHat } from 'lucide-react';
import toast from 'react-hot-toast';
import { recipeAPI, shoppingAPI } from '../utils/apiServices';
import { useRecipeStore } from '../stores';
import LoadingSpinner from '../components/LoadingSpinner';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const favorites = useRecipeStore((state) => state.favorites);
  const addFavorite = useRecipeStore((state) => state.addFavorite);
  const removeFavorite = useRecipeStore((state) => state.removeFavorite);

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingShopping, setGeneratingShopping] = useState(false);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      const res = await recipeAPI.getRecipeById(id);
      if (res.success) {
        setRecipe(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('菜谱不存在');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // 切换收藏
  const handleToggleFavorite = async () => {
    try {
      const isFav = favorites.includes(recipe.id);

      if (isFav) {
        await recipeAPI.removeFavorite(recipe.id);
        removeFavorite(recipe.id);
        toast.success('取消收藏');
      } else {
        await recipeAPI.addFavorite(recipe.id);
        addFavorite(recipe.id);
        toast.success('已收藏');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 生成采购清单
  const handleGenerateShopping = async () => {
    try {
      setGeneratingShopping(true);
      const res = await shoppingAPI.generateFromRecipe(recipe.id);
      if (res.success) {
        toast.success(res.message);
        navigate('/shopping');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGeneratingShopping(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fef7ed] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  const isFavorite = favorites.includes(recipe.id);

  return (
    <div className="min-h-screen bg-[#fef7ed] pb-6">
      {/* 图片区域 */}
      <div className="relative">
        <img
          src={recipe.image || `https://via.placeholder.com/800x400/FF8C38/FFFFFF?text=${recipe.name}`}
          alt={recipe.name}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/800x400/FF8C38/FFFFFF?text=${recipe.name}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* 返回按钮 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        {/* 收藏按钮 */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isFavorite
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
          }`}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* 信息 */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-bold text-white mb-2">{recipe.name}</h1>
          <div className="flex gap-3 text-white/90 text-sm">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {recipe.duration}分钟
            </span>
            <span className={`px-2 py-0.5 rounded-full ${
              recipe.difficulty === '简单' ? 'bg-green-500/80' :
              recipe.difficulty === '中等' ? 'bg-yellow-500/80' :
              'bg-red-500/80'
            }`}>
              {recipe.difficulty}
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} />
              {recipe.servings}人份
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 用料 */}
        <section className="bg-white rounded-card p-4 card-shadow animate-fadeIn">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Leaf size={20} className="text-secondary" />
            <span>用料</span>
            <span className="text-sm text-gray-400 ml-2">({recipe.ingredients?.length || 0}种)</span>
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {recipe.ingredients?.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span className="text-gray-700">{ingredient.name}</span>
                <span className="text-gray-500 text-sm">{ingredient.quantity}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 烹饪步骤 */}
        <section className="bg-white rounded-card p-4 card-shadow animate-fadeIn">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ChefHat size={20} className="text-primary" />
            <span>烹饪步骤</span>
            <span className="text-sm text-gray-400 ml-2">({recipe.steps?.length || 0}步)</span>
          </h2>
          <div className="space-y-4">
            {recipe.steps?.map((step, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-medium">
                  {index + 1}
                </div>
                <p className="text-gray-700 pt-1 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 营养信息 */}
        {recipe.nutrition && (
          <section className="bg-white rounded-card p-4 card-shadow animate-fadeIn">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📊</span>
              <span>营养成分</span>
            </h2>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-2 bg-orange-50 rounded-lg">
                <p className="text-lg font-bold text-primary">{recipe.nutrition.calories || '--'}</p>
                <p className="text-xs text-gray-500">卡路里</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <p className="text-lg font-bold text-secondary">{recipe.nutrition.protein || '--'}</p>
                <p className="text-xs text-gray-500">蛋白质</p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <p className="text-lg font-bold text-yellow-600">{recipe.nutrition.fat || '--'}</p>
                <p className="text-xs text-gray-500">脂肪</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <p className="text-lg font-bold text-blue-600">{recipe.nutrition.carbohydrates || '--'}</p>
                <p className="text-xs text-gray-500">碳水</p>
              </div>
            </div>
          </section>
        )}

        {/* 生成采购清单按钮 */}
        <button
          onClick={handleGenerateShopping}
          disabled={generatingShopping}
          className="w-full bg-secondary text-white py-3 rounded-card font-medium hover:bg-secondary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 card-shadow"
        >
          {generatingShopping ? (
            <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <ShoppingCart size={20} />
              生成采购清单
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default RecipeDetail;