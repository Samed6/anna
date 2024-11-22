import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Star, Target, TrendingUp, ListTodo } from 'lucide-react';
import { airtableService } from '../services/airtableConfig';

function ClientProgressDashboard() {
  const CLIENT_ID = '22962526964@c.us';
  const [clientInfo, setClientInfo] = useState(null);
  const [taskStats, setTaskStats] = useState({
    completedToday: 0,
    total: 0,
    weeklyTasks: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [client, tasks] = await Promise.all([
        airtableService.getClientByTel(CLIENT_ID),
        airtableService.getTaches()
      ]);

      if (client) {
        setClientInfo({
          prenom: client.nom_client,
          niveau: client.niveau_tache,
          etoiles: client.etoiles_client,
          objectif: client.objectif
        });

        // Filtrer les tâches du client
        const clientTasks = tasks.filter(t => t.client_id === CLIENT_ID);
        processTaskStats(clientTasks);
      }

    } catch (error) {
      console.error('Erreur détaillée:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processTaskStats = (tasks) => {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = tasks.filter(t => 
      t.created_at?.split('T')[0] === today && 
      t.status === 'completed'
    ).length;

    const weeklyTaskData = Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayTasks = tasks.filter(t => 
        t.created_at?.split('T')[0] === date.toISOString().split('T')[0]
      ).length;

      return {
        name: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][date.getDay()],
        taches: dayTasks
      };
    }).reverse();

    setTaskStats({
      completedToday,
      total: tasks.length,
      weeklyTasks: weeklyTaskData
    });
  };

  // Rest of the component remains the same...
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-2 sm:p-4 md:p-6">
      <Card className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border-none">
        <CardContent className="py-6 md:py-10 flex flex-col items-center text-center">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-1 md:mb-2">
            Progression de {clientInfo?.prenom || 'Client'}
          </h2>
          <div className="flex justify-center gap-1 md:gap-2">
            {[...Array(parseInt(clientInfo?.etoiles || 0))].map((_, i) => (
                <Star 
                key={i} 
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400" 
                fill="currentColor"
                strokeWidth={1}
                />
            ))}
            </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card className="transform hover:scale-105 transition-all duration-200">
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="p-2 md:p-3 rounded-lg bg-yellow-100">
                <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">Niveau actuel</p>
                <div className="text-2xl md:text-4xl font-bold text-yellow-600">
                  {clientInfo?.niveau || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transform hover:scale-105 transition-all duration-200">
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="p-2 md:p-3 rounded-lg bg-purple-100">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">Objectif</p>
                <div className="text-lg md:text-xl font-bold text-purple-600 line-clamp-2">
                  {clientInfo?.objectif || 'Non défini'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transform hover:scale-105 transition-all duration-200">
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="p-2 md:p-3 rounded-lg bg-blue-100">
                <ListTodo className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">Tâches aujourd'hui</p>
                <div className="text-2xl md:text-4xl font-bold text-blue-600">
                  {taskStats.completedToday}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transform hover:scale-105 transition-all duration-200">
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="p-2 md:p-3 rounded-lg bg-indigo-100">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">Total tâches</p>
                <div className="text-2xl md:text-4xl font-bold text-indigo-600">
                  {taskStats.total}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl font-bold">Tâches de la semaine</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] md:h-[400px] pt-2 md:pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={taskStats.weeklyTasks}
              margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                width={30}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="taches" 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]}
                barSize={20}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default ClientProgressDashboard;