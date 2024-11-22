import { Link, useLocation } from 'react-router-dom';
import { BarChart, Calendar, Settings, Heart } from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', icon: BarChart, label: 'Tableau de bord' },
    { path: '/tasks', icon: Calendar, label: 'Tâches' },
    { path: '/capsules', icon: Heart, label: 'Points Bien-être' }, // Nouveau item
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-20 bg-white shadow-lg flex flex-col items-center py-8 space-y-8">
      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
        A
      </div>
      
      <nav className="flex-1 flex flex-col items-center space-y-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`p-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-400 hover:text-purple-600'
              }`}
            >
              <Icon size={24} />
            </Link>
          );
        })}
      </nav>

      <Link to="/settings" className="p-3 rounded-xl text-gray-400 hover:text-purple-600 transition-colors">
        <Settings size={24} />
      </Link>
    </div>
  );
}

export default Sidebar;