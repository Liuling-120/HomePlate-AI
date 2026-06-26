import { useState, useEffect } from 'react';
import { Refrigerator, Plus, Edit2, Trash2, AlertTriangle, Calendar, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { fridgeAPI } from '../utils/apiServices';
import { useFridgeStore } from '../stores';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import BottomNav from '../components/BottomNav';

function Fridge() {
  const items = useFridgeStore((state) => state.items);
  const setItems = useFridgeStore((state) => state.setItems);
  const addItem = useFridgeStore((state) => state.addItem);
  const updateItem = useFridgeStore((state) => state.updateItem);
  const deleteItem = useFridgeStore((state) => state.deleteItem);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [stats, setStats] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: '个',
    category: 'vegetable',
    expiryDate: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const units = ['个', '克', '千克', '根', '条', '颗', '瓶', '袋', '盒'];
  const categories = [
    { id: 'vegetable', name: '蔬菜', icon: '🥬' },
    { id: 'meat', name: '肉类', icon: '🥩' },
    { id: 'seafood', name: '海鲜', icon: '🦐' },
    { id: 'egg', name: '蛋类', icon: '🥚' },
    { id: 'fruit', name: '水果', icon: '🍎' },
    { id: 'dairy', name: '乳制品', icon: '🧀' },
    { id: 'other', name: '其他', icon: '📦' },
  ];

  useEffect(() => {
    loadItems();
    loadStats();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await fridgeAPI.getItems({ limit: 100 });
      if (res.success) {
        setItems(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await fridgeAPI.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 计算过期状态
  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'unknown', label: '未知', color: 'gray' };

    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: 'expired', label: '已过期', color: 'red' };
    if (diffDays <= 1) return { status: 'urgent', label: '即将过期', color: 'red' };
    if (diffDays <= 3) return { status: 'warning', label: '临期', color: 'orange' };
    return { status: 'fresh', label: '新鲜', color: 'green' };
  };

  // 添加食材
  const handleAddItem = async () => {
    if (!formData.name || !formData.quantity) {
      toast.error('请填写食材名称和数量');
      return;
    }

    try {
      const res = await fridgeAPI.addItem({
        ...formData,
        quantity: parseFloat(formData.quantity),
      });

      if (res.success) {
        addItem(res.data);
        setShowAddModal(false);
        resetForm();
        toast.success('添加成功');
        loadStats();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 更新食材
  const handleUpdateItem = async () => {
    if (!formData.name || !formData.quantity) {
      toast.error('请填写食材名称和数量');
      return;
    }

    try {
      const res = await fridgeAPI.updateItem(editingItem.id, {
        ...formData,
        quantity: parseFloat(formData.quantity),
      });

      if (res.success) {
        updateItem(editingItem.id, res.data);
        setShowAddModal(false);
        setEditingItem(null);
        resetForm();
        toast.success('更新成功');
        loadStats();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 删除食材
  const handleDeleteItem = async (id) => {
    if (!confirm('确定要删除这个食材吗？')) return;

    try {
      const res = await fridgeAPI.deleteItem(id);
      if (res.success) {
        deleteItem(id);
        toast.success('删除成功');
        loadStats();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 编辑食材
  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity.toString(),
      unit: item.unit,
      category: item.category,
      expiryDate: item.expiryDate || '',
      purchaseDate: item.purchaseDate || '',
      notes: item.notes || '',
    });
    setShowAddModal(true);
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: '',
      quantity: '',
      unit: '个',
      category: 'vegetable',
      expiryDate: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  // 过滤食材
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fef7ed] pb-20">
      {/* Header */}
      <header className="p-4 bg-gradient-to-r from-secondary to-secondary-light">
        <h1 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
          <Refrigerator size={24} />
          冰箱库存
        </h1>
        <p className="text-white/80 text-sm">管理你的食材库存</p>
      </header>

      <div className="p-4">
        {/* 搜索栏 */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="搜索食材..."
        />

        {/* 统计卡片 */}
        {stats && (
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-card p-3 text-center card-shadow">
              <Package size={20} className="text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-800">{stats.total}</p>
              <p className="text-xs text-gray-500">总食材</p>
            </div>
            <div className="bg-red-50 rounded-card p-3 text-center">
              <AlertTriangle size={20} className="text-red-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-red-500">{stats.expired}</p>
              <p className="text-xs text-gray-500">已过期</p>
            </div>
            <div className="bg-orange-50 rounded-card p-3 text-center">
              <Calendar size={20} className="text-orange-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-orange-500">{stats.expiringSoon}</p>
              <p className="text-xs text-gray-500">临期</p>
            </div>
            <div className="bg-green-50 rounded-card p-3 text-center">
              <span className="text-2xl">✓</span>
              <p className="text-lg font-bold text-green-500">{stats.total - stats.expired - stats.expiringSoon}</p>
              <p className="text-xs text-gray-500">新鲜</p>
            </div>
          </div>
        )}

        {/* 食材列表 */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredItems.length > 0 ? (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const expiryStatus = getExpiryStatus(item.expiryDate);
              const categoryInfo = categories.find(c => c.id === item.category) || categories[6];

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-card p-4 flex items-center justify-between card-shadow hover:card-shadow-hover transition-all ${
                    expiryStatus.status === 'expired' || expiryStatus.status === 'urgent'
                      ? 'border-2 border-red-300'
                      : expiryStatus.status === 'warning'
                      ? 'border-2 border-orange-300'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{categoryInfo.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          expiryStatus.color === 'red' ? 'bg-red-100 text-red-600' :
                          expiryStatus.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                          expiryStatus.color === 'green' ? 'bg-green-100 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {expiryStatus.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span>数量: {item.quantity} {item.unit}</span>
                        {item.expiryDate && (
                          <span>保质期: {item.expiryDate}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-primary transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon="🧊"
            title="冰箱空空如也"
            description="点击下方按钮添加食材"
            action={{
              label: '添加食材',
              onClick: () => setShowAddModal(true),
            }}
          />
        )}
      </div>

      {/* 添加按钮 */}
      <button
        onClick={() => {
          resetForm();
          setEditingItem(null);
          setShowAddModal(true);
        }}
        className="fixed bottom-24 right-4 w-14 h-14 bg-secondary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-secondary-light transition-colors z-40"
      >
        <Plus size={28} />
      </button>

      {/* 添加/编辑弹窗 */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(null);
          resetForm();
        }}
        title={editingItem ? '编辑食材' : '添加食材'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">食材名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="例如：番茄"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">数量</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="数量"
                min="0"
                step="0.1"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">单位</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">分类</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">保质期</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">购买日期</label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">备注</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="备注信息"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingItem(null);
                resetForm();
              }}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={editingItem ? handleUpdateItem : handleAddItem}
              className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-light transition-colors"
            >
              {editingItem ? '保存' : '添加'}
            </button>
          </div>
        </div>
      </Modal>

      <BottomNav />
    </div>
  );
}

export default Fridge;