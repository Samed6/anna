import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Statistics() {
  // Données exemple
  const data = [
    { name: 'Lun', taches: 12 },
    { name: 'Mar', taches: 19 },
    { name: 'Mer', taches: 15 },
    { name: 'Jeu', taches: 22 },
    { name: 'Ven', taches: 18 },
    { name: 'Sam', taches: 8 },
    { name: 'Dim', taches: 5 },
  ];

  const stats = [
    { title: 'Tâches cette semaine', value: '89' },
    { title: 'Moyenne par jour', value: '12.7' },
    { title: 'Taux de complétion', value: '94%' },
    { title: 'Temps moyen par tâche', value: '45min' },
  ];

  return (
    <div className="space-y-6">
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600">{stat.title}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Graphique */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Tâches par jour</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="taches" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Statistics;