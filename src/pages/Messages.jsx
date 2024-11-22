import { Brain, Calendar, MessageCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

function Messages() {
  const messages = [
    { 
      id: 1, 
      type: "motivation", 
      content: "Votre productivité est en hausse ! Continuez sur cette lancée 🚀", 
      time: "08:00" 
    },
    { 
      id: 2, 
      type: "agenda", 
      content: "Point important : 3 tâches prioritaires à accomplir", 
      time: "09:00" 
    },
    { 
      id: 3, 
      type: "wellbeing", 
      content: "Pensez à faire une pause pour maintenir votre productivité 🎯", 
      time: "11:00" 
    },
  ];

  const getIconStyle = (type) => {
    switch(type) {
      case 'motivation':
        return {
          bg: 'bg-purple-100',
          icon: <Brain className="h-6 w-6 text-purple-600" />
        };
      case 'agenda':
        return {
          bg: 'bg-pink-100',
          icon: <Calendar className="h-6 w-6 text-pink-600" />
        };
      default:
        return {
          bg: 'bg-blue-100',
          icon: <MessageCircle className="h-6 w-6 text-blue-600" />
        };
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">Notifications importantes</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {messages.map(message => {
              const { bg, icon } = getIconStyle(message.type);
              return (
                <div 
                  key={message.id} 
                  className="flex items-start space-x-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 transform hover:scale-[1.02]"
                >
                  <div className={`p-3 rounded-xl ${bg} shadow-sm`}>
                    {icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-lg">{message.content}</p>
                    <p className="text-sm text-gray-500 mt-2 font-medium">{message.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Messages;