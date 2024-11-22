import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Calendar() {
  const [currentMonth] = useState(new Date());

  // Format the month and year
  const monthYear = currentMonth.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  });

  // Example events
  const events = [
    { date: '2024-11-20', title: 'Réunion équipe', time: '10:00' },
    { date: '2024-11-22', title: 'Présentation client', time: '14:30' },
    { date: '2024-11-25', title: 'Formation', time: '09:00' },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête du calendrier */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold capitalize">{monthYear}</h2>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Liste des événements */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Événements à venir</h3>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="flex items-center p-4 border rounded-lg">
                <div className="flex-shrink-0 w-16 text-center">
                  <span className="text-sm font-medium text-gray-600">
                    {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                  <div className="text-sm text-gray-500">{event.time}</div>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">{event.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;