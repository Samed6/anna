import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';
import Messages from '../pages/Messages';
import Settings from '../pages/Settings';
import Capsules from '../pages/Capsules'; 

function MainContent() {
  return (
    <main className="ml-20 p-8">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/capsules" element={<Capsules />} /> {/* Ajoutez cette ligne */}
    </Routes>
    </main>
  );
}

export default MainContent;