import { useState, useEffect } from 'react';
import { Search, Calendar, Clock, CheckCircle, Loader, ArrowRight, Filter, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { airtableService } from '../services/airtableConfig';

function ClientTasks() {
  const [taskFilter, setTaskFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [clientInfo, setClientInfo] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const CLIENT_ID = '22962526964@c.us';

  useEffect(() => {
    loadClientData();
  }, []);

  const loadClientData = async () => {
    try {
      setIsLoading(true);
      
      const client = await airtableService.getClientByTel(CLIENT_ID);
      if (client) {
        setClientInfo({
          nom_client: client.nom_client,
          niveau: client.niveau,
          etoiles: client.etoiles,
          objectif: client.objectif
        });
      }

      const allTasks = await airtableService.getTaches();
      const clientTasks = allTasks.filter(task => task.client_id === CLIENT_ID);

      const formattedTasks = clientTasks.map(task => ({
        id: task.id,
        title: task.nom,
        status: task.status,
        priority: task.priorite,
        date: new Date(task.created_at).toLocaleDateString('fr-FR'),
        time: new Date(task.created_at).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        category: task.categorie
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'travail', label: 'Travail' },
    { id: 'personnel', label: 'Personnel' },
    { id: 'sante', label: 'Santé' },
    { id: 'education', label: 'Éducation' }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Loader className="w-4 h-4" />;
      case 'upcoming': return <ArrowRight className="w-4 h-4" />;
      default: return null;
    }
  };

  const getPriorityStars = (priority) => {
    const stars = priority === 'haute' ? 3 : priority === 'moyenne' ? 2 : 1;
    return Array(stars).fill(0).map((_, index) => (
      <Star key={index} className="w-4 h-4 fill-current" />
    ));
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Terminée';
      case 'pending': return 'En cours';
      case 'upcoming': return 'À venir';
      default: return status;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatusFilter = taskFilter === 'all' || task.status === taskFilter;
    const matchesCategoryFilter = categoryFilter === 'all' || task.category === categoryFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatusFilter && matchesCategoryFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Card className="shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <div className="flex flex-col space-y-2">
              <CardTitle className="text-2xl font-bold">
                Tâches de {clientInfo?.nom_client}
              </CardTitle>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array(parseInt(clientInfo?.etoiles || 0)).fill(0).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    Niveau {clientInfo?.niveau}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    Objectif: {clientInfo?.objectif}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="border-b border-gray-200">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <CardTitle className="text-2xl font-bold">Liste des tâches</CardTitle>
                <button 
                  className="md:hidden p-2 rounded-lg bg-gray-100 self-end"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter size={20} />
                </button>
              </div>
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${isFilterOpen ? 'block' : 'hidden md:grid'}`}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher une tâche..."
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                  value={taskFilter}
                  onChange={(e) => setTaskFilter(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="completed">Terminées</option>
                  <option value="pending">En cours</option>
                  <option value="upcoming">À venir</option>
                </select>
                <select
                  className="w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">Aucune tâche trouvée</p>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="bg-white rounded-lg border border-gray-100 hover:shadow transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg shrink-0 ${
                          task.status === 'completed' ? 'bg-green-100' :
                          task.status === 'pending' ? 'bg-yellow-100' :
                          'bg-blue-100'
                        }`}>
                          <div className={
                            task.status === 'completed' ? 'text-green-600' :
                            task.status === 'pending' ? 'text-yellow-600' :
                            'text-blue-600'
                          }>
                            {getStatusIcon(task.status)}
                          </div>
                        </div>
                        <h3 className="font-medium text-sm flex-1 truncate">
                          {task.title}
                        </h3>
                        <div className="flex items-center text-yellow-500">
                          {getPriorityStars(task.priority)}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex items-center gap-3 text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span className="text-xs">{task.date}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            <span className="text-xs">{task.time}</span>
                          </span>
                        </div>

                        <div className="flex gap-2 sm:ml-auto">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                            {categories.find(c => c.id === task.category)?.label || task.category}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            task.status === 'completed' ? 'bg-green-100 text-green-600' :
                            task.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {getStatusText(task.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ClientTasks;