import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Heart } from 'lucide-react';

const DEFAULT_PLACEHOLDER = '/images/default-food.jpg';

function RecipeCard({ recipe, isFavorite, onToggleFavorite }) {
  const [imageError, setImageError] = useState(false);

  const getImageSrc = () => {
    if (recipe.name === '番茄炒蛋') {
      return '/images/tomato-egg.jpg';
    } else if (recipe.name === '酸辣土豆丝') {
      return '/images/shredded-potato.jpg';
    } else if (recipe.name === '蒜蓉西兰花') {
      return '/images/broccoli.jpg';
    } else if (recipe.name === '可乐鸡翅') {
      return '/images/cola-chicken.jpg';
    } else if (recipe.name === '红烧肉') {
      return '/images/braised-pork.jpg';
    } else if (recipe.name === '宫保鸡丁') {
      return '/images/kung-pao.jpg';
    } else if (recipe.name === '清蒸鲈鱼') {
      return '/images/steamed-fish.jpg';
    } else if (recipe.name === '蚝油生菜') {
      return '/images/lettuce.jpg';
    } else {
      return DEFAULT_PLACEHOLDER;
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-card overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 animate-fadeIn">
      <div className="relative">
        {imageError ? (
          <div className="w-full h-40 bg-gray-100 flex flex-col items-center justify-center text-gray-500">
            <span className="text-sm">暂无菜品实拍图</span>
          </div>
        ) : (
          <img
            src={getImageSrc()}
            alt={recipe.name}
            className="w-full h-40 object-cover"
            onError={handleImageError}
          />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
            isFavorite
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/90 text-gray-400 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        <div className="absolute top-3 left-3 bg-primary text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
          <Clock size={12} className="inline mr-1" />
          {recipe.duration}分钟
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg mb-2 truncate">{recipe.name}</h3>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              recipe.difficulty === '简单' ? 'bg-green-100 text-green-600' :
              recipe.difficulty === '中等' ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {recipe.difficulty}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} />
            {recipe.servings}人份
          </span>
        </div>

        <Link
          to={`/recipe/${recipe.id}`}
          className="block w-full bg-primary text-white text-center py-2.5 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors"
        >
          查看详情
        </Link>
      </div>
    </div>
  );
}

export default RecipeCard;
