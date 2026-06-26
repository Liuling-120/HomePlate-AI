function CategoryTabs({ categories, activeCategory, onCategoryChange }) {
  const defaultCategories = [
    { id: 'all', name: '全部', icon: '🍳' },
    { id: 'meat', name: '肉类', icon: '🥩' },
    { id: 'vegetable', name: '素菜', icon: '🥬' },
    { id: 'seafood', name: '海鲜', icon: '🦐' },
    { id: 'soup', name: '汤品', icon: '🥣' },
    { id: 'dessert', name: '甜点', icon: '🍰' },
  ];

  const displayCategories = categories || defaultCategories;

  return (
    <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
      {displayCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            activeCategory === category.id
              ? 'bg-primary text-white shadow-md scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
          }`}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;