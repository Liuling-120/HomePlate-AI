import { Link, useLocation } from 'react-router-dom';
import { Home, Refrigerator, ShoppingCart, User } from 'lucide-react';

function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/fridge', label: '冰箱', icon: Refrigerator },
    { path: '/shopping', label: '采购', icon: ShoppingCart },
    { path: '/profile', label: '我的', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-100">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
                isActive 
                  ? 'text-primary scale-105' 
                  : 'text-gray-400 hover:text-primary'
              }`}
            >
              <Icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? 'mb-1' : ''}
              />
              <span className={`text-xs font-medium ${
                isActive ? 'text-primary' : ''
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;