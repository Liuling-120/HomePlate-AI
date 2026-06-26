import { useState, useEffect } from 'react';
import { ShoppingCart, Check, Trash2, Plus, BookOpen, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { shoppingAPI, recipeAPI } from '../utils/apiServices';
import { useShoppingStore } from '../stores';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import BottomNav from '../components/BottomNav';

function Shopping() {
  const items = useShoppingStore((state) => state.items);
  const setItems = useShoppingStore((state) => state.setItems);
  const updateStatus = useShoppingStore((state) => state.updateStatus);
  const deleteItem = useShoppingStore((state) => state.deleteItem);
  const clearPurchased = useShoppingStore((state) => state.clearPurchased);
  const clearAll = useShoppingStore((state) => state.clearAll);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  useEffect(() => {
    loadShoppingList();
    loadRecipes();
  }, []);

  const loadShoppingList = async () => {
    try {
      setLoading(true);
      const res = await shoppingAPI.getList();
      if (res.success) {
        setItems(res.data.items);
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecipes = async () => {
    try {
      const res = await recipeAPI.getRecipes({ limit: 20 });
      if (res.success) {
        setRecipes(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 根据菜谱生成采购清单
  const handleGenerateFromRecipes = async () => {
    if (selectedRecipes.length === 0) {
      toast.error('请选择至少一个菜谱');
      return;
    }

    try {
      setLoading(true);
      
      if (selectedRecipes.length === 1) {
        const res = await shoppingAPI.generateFromRecipe(selectedRecipes[0]);
        if (res.success) {
          toast.success(res.message);
          loadShoppingList();
        }
      } else {
        const res = await shoppingAPI.generateFromMultiple(selectedRecipes);
        if (res.success) {
          toast.success(res.message);
          loadShoppingList();
        }
      }
      
      setShowRecipeModal(false);
      setSelectedRecipes([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 切换采购状态
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'purchased' ? 'pending' : 'purchased';
    
    try {
      const res = await shoppingAPI.updateStatus(id, newStatus);
      if (res.success) {
        updateStatus(id, newStatus);
        toast.success(newStatus === 'purchased' ? '已购买 ✓' : '取消购买');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 删除采购项
  const handleDeleteItem = async (id) => {
    try {
      const res = await shoppingAPI.deleteItem(id);
      if (res.success) {
        deleteItem(id);
        toast.success('删除成功');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 清空已购买
  const handleClearPurchased = async () => {
    if (!confirm('确定要清空已购买的采购项吗？')) return;

    try {
      const res = await shoppingAPI.clearPurchased();
      if (res.success) {
        clearPurchased();
        toast.success(res.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 清空全部
  const handleClearAll = async () => {
    if (!confirm('确定要清空全部采购清单吗？')) return;

    try {
      const res = await shoppingAPI.clearAll();
      if (res.success) {
        clearAll();
        toast.success(res.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 添加自定义采购项
  const handleAddCustomItem = async () => {
    const name = prompt('请输入食材名称：');
    if (!name) return;

    const quantity = prompt('请输入数量：') || '1';

    try {
      const res = await shoppingAPI.addItem({
        name,
        quantity,
        category: 'other',
        status: 'pending',
      });

      if (res.success) {
        loadShoppingList();
        toast.success('添加成功');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 选择菜谱
  const handleSelectRecipe = (recipeId) => {
    if (selectedRecipes.includes(recipeId)) {
      setSelectedRecipes(selectedRecipes.filter(id => id !== recipeId));
    } else {
      setSelectedRecipes([...selectedRecipes, recipeId]);
    }
  };

  // 分类显示采购项
  const pendingItems = items.filter(item => item.status === 'pending');
  const purchasedItems = items.filter(item => item.status === 'purchased');

  return (
    <div className="min-h-screen bg-[#fef7ed] pb-20">
      {/* Header */}
      <header className="p-4 bg-gradient-to-r from-primary to-primary-light">
        <h1 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
          <ShoppingCart size={24} />
          智能采购清单
        </h1>
        <p className="text-white/80 text-sm">根据菜谱自动生成采购清单</p>
      </header>

      <div className="p-4">
        {/* 生成按钮 */}
        <button
          onClick={() => setShowRecipeModal(true)}
          className="w-full bg-secondary text-white py-3 rounded-card font-medium hover:bg-secondary-light transition-colors mb-6 flex items-center justify-center gap-2 card-shadow"
        >
          <BookOpen size={20} />
          选择菜谱生成清单
        </button>

        {/* 进度统计 */}
        {stats && items.length > 0 && (
          <div className="bg-white rounded-card p-4 mb-6 card-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">
                已购买: {stats.purchased}/{stats.total}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleClearPurchased}
                  className="text-xs text-gray-400 hover:text-primary transition-colors"
                >
                  清空已购买
                </button>
                <button
                  onClick={handleClearAll}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  清空全部
                </button>
              </div>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary transition-all duration-300"
                style={{ width: `${(stats.purchased / stats.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* 采购清单 */}
        {loading ? (
          <LoadingSpinner />
        ) : items.length > 0 ? (
          <div className="space-y-6">
            {/* 待购买 */}
            {pendingItems.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full" />
                  待购买 ({pendingItems.length})
                </h3>
                <div className="space-y-2">
                  {pendingItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-card p-4 flex items-center justify-between card-shadow animate-fadeIn"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleStatus(item.id, item.status)}
                          className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-secondary transition-colors"
                        >
                          <Check size={16} className="text-transparent hover:text-secondary" />
                        </button>
                        <div>
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-500">
                            需要: {item.quantity}
                            {item.recipe && (
                              <span className="ml-2 text-xs text-primary">
                                ({item.recipe.name})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 已购买 */}
            {purchasedItems.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                  已购买 ({purchasedItems.length})
                </h3>
                <div className="space-y-2">
                  {purchasedItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-green-50 rounded-card p-4 flex items-center justify-between opacity-60 animate-fadeIn"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-600 line-through">{item.name}</h4>
                          <p className="text-sm text-gray-400">{item.quantity}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        className="text-xs text-gray-400 hover:text-primary transition-colors"
                      >
                        撤销
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            icon="📝"
            title="暂无采购清单"
            description="点击上方按钮选择菜谱生成"
            action={{
              label: '生成清单',
              onClick: () => setShowRecipeModal(true),
            }}
          />
        )}
      </div>

      {/* 添加自定义项按钮 */}
      <button
        onClick={handleAddCustomItem}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-light transition-colors z-40"
      >
        <Plus size={28} />
      </button>

      {/* 选择菜谱弹窗 */}
      <Modal
        isOpen={showRecipeModal}
        onClose={() => {
          setShowRecipeModal(false);
          setSelectedRecipes([]);
        }}
        title="选择菜谱"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            选择菜谱后，系统将自动对比你的冰箱库存，生成缺少食材的采购清单
          </p>

          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {recipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => handleSelectRecipe(recipe.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                  selectedRecipes.includes(recipe.id)
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                }`}
              >
                <img
                  src={recipe.image || `https://via.placeholder.com/60x60/FF8C38/FFFFFF?text=${recipe.name}`}
                  alt={recipe.name}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/60x60/FF8C38/FFFFFF?text=${recipe.name}`;
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-medium">{recipe.name}</h4>
                  <p className={`text-sm ${
                    selectedRecipes.includes(recipe.id) ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {recipe.duration}分钟 · {recipe.difficulty}
                  </p>
                </div>
                {selectedRecipes.includes(recipe.id) && (
                  <Check size={20} />
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={() => {
                setShowRecipeModal(false);
                setSelectedRecipes([]);
              }}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleGenerateFromRecipes}
              disabled={selectedRecipes.length === 0 || loading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <>
                  <RefreshCw size={16} />
                  生成清单 ({selectedRecipes.length})
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      <BottomNav />
    </div>
  );
}

export default Shopping;