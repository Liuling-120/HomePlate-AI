import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 用户状态管理
export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      
      // 登录
      login: (userData, token) => {
        localStorage.setItem('token', token);
        set({
          user: userData,
          token: token,
          isLoggedIn: true,
        });
      },
      
      // 登出
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isLoggedIn: false,
        });
      },
      
      // 更新用户信息
      updateUser: (userData) => {
        set({ user: userData });
      },
      
      // 获取用户信息
      getUser: () => get().user,
      
      // 检查是否登录
      checkLogin: () => get().isLoggedIn,
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

// 菜谱状态管理
export const useRecipeStore = create(
  persist(
    (set, get) => ({
      recipes: [],
      recommendedRecipes: [],
      favorites: [],
      currentRecipe: null,
      categories: [],
      
      // 设置菜谱列表
      setRecipes: (recipes) => set({ recipes }),
      
      // 设置推荐菜谱
      setRecommended: (recipes) => set({ recommendedRecipes: recipes }),
      
      // 设置收藏列表
      setFavorites: (favorites) => set({ favorites }),
      
      // 设置当前菜谱
      setCurrentRecipe: (recipe) => set({ currentRecipe: recipe }),
      
      // 设置分类
      setCategories: (categories) => set({ categories }),
      
      // 添加收藏
      addFavorite: (recipeId) => {
        const favorites = get().favorites;
        if (!favorites.includes(recipeId)) {
          set({ favorites: [...favorites, recipeId] });
        }
      },
      
      // 移除收藏
      removeFavorite: (recipeId) => {
        const favorites = get().favorites;
        set({ favorites: favorites.filter(id => id !== recipeId) });
      },
      
      // 检查是否收藏
      isFavorite: (recipeId) => get().favorites.includes(recipeId),
    }),
    {
      name: 'recipe-storage',
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);

// 冰箱库存状态管理
export const useFridgeStore = create((set, get) => ({
  items: [],
  stats: null,
  
  // 设置食材列表
  setItems: (items) => set({ items }),
  
  // 设置统计信息
  setStats: (stats) => set({ stats }),
  
  // 添加食材
  addItem: (item) => {
    const items = get().items;
    set({ items: [...items, item] });
  },
  
  // 更新食材
  updateItem: (id, updatedItem) => {
    const items = get().items;
    set({
      items: items.map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      ),
    });
  },
  
  // 删除食材
  deleteItem: (id) => {
    const items = get().items;
    set({ items: items.filter(item => item.id !== id) });
  },
  
  // 获取临期食材
  getExpiringItems: () => {
    return get().items.filter(item => {
      if (!item.expiryDate) return false;
      const today = new Date();
      const expiry = new Date(item.expiryDate);
      const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      return diffDays <= 3;
    });
  },
}));

// 采购清单状态管理
export const useShoppingStore = create((set, get) => ({
  items: [],
  stats: null,
  
  // 设置采购清单
  setItems: (items) => set({ items }),
  
  // 设置统计信息
  setStats: (stats) => set({ stats }),
  
  // 添加采购项
  addItem: (item) => {
    const items = get().items;
    set({ items: [...items, item] });
  },
  
  // 更新采购项状态
  updateStatus: (id, status) => {
    const items = get().items;
    set({
      items: items.map(item =>
        item.id === id ? { ...item, status } : item
      ),
    });
  },
  
  // 删除采购项
  deleteItem: (id) => {
    const items = get().items;
    set({ items: items.filter(item => item.id !== id) });
  },
  
  // 清空已购买项
  clearPurchased: () => {
    const items = get().items;
    set({ items: items.filter(item => item.status !== 'purchased') });
  },
  
  // 清空全部
  clearAll: () => set({ items: [] }),
}));