import { useState, useEffect } from 'react'
import { Card, CardContent } from "../components/ui/card"
import { Calendar, Heart, BookOpen, TrendingUp } from 'lucide-react'
import { airtableService } from '../services/airtableConfig'

function ClientDashboard() {
  const CLIENT_ID = '22962269333@c.us' // ID fixe de l'utilisateur à afficher
  const [userCapsules, setUserCapsules] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSessions: 0,
    averageMood: 0,
    progressScore: 0
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      const capsules = await airtableService.getCapsules()
      // Filtrer pour ne garder que les capsules de l'utilisateur spécifique
      const userSpecificCapsules = capsules.filter(capsule => 
        capsule.client_id === CLIENT_ID
      )
      setUserCapsules(userSpecificCapsules)
      calculateStats(userSpecificCapsules)
    } catch (error) {
      console.error('Erreur de chargement:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (capsules) => {
    const moodScores = capsules.map(c => parseInt(c.humeur) || 0)
    const avgMood = moodScores.length 
      ? (moodScores.reduce((a, b) => a + b, 0) / moodScores.length)
      : 0

    setStats({
      totalSessions: capsules.length,
      averageMood: avgMood.toFixed(1),
      progressScore: calculateProgress(capsules)
    })
  }

  const calculateProgress = (capsules) => {
    if (capsules.length < 2) return 0
    const recentMoods = capsules
      .slice(-3)
      .map(c => parseInt(c.humeur) || 0)
    const avgRecentMood = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length
    return Math.min(Math.round((avgRecentMood / 10) * 100), 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">
            Mon Espace Bien-être
          </h1>
          <p className="text-purple-600">Suivi personnel et réflexions</p>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <BookOpen className="h-8 w-8 opacity-80" />
                    <div>
                      <p className="text-sm opacity-80">Séances</p>
                      <p className="text-2xl font-bold">{stats.totalSessions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Heart className="h-8 w-8 opacity-80" />
                    <div>
                      <p className="text-sm opacity-80">Bien-être moyen</p>
                      <p className="text-2xl font-bold">{stats.averageMood}/10</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <TrendingUp className="h-8 w-8 opacity-80" />
                    <div>
                      <p className="text-sm opacity-80">Progression</p>
                      <p className="text-2xl font-bold">{stats.progressScore}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Mes Notes de Bien-être
              </h2>
              
              {userCapsules.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <Heart className="mx-auto h-12 w-12 text-purple-300 mb-4" />
                  <p className="text-gray-600">Aucune note pour le moment</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {userCapsules.map((capsule) => (
                    <Card key={capsule.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="border-b border-gray-100 pb-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Calendar className="h-4 w-4" />
                            <time>{new Date(capsule.date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</time>
                          </div>
                          <div className="flex items-center gap-2">
                            <Heart className={`h-5 w-5 ${
                              parseInt(capsule.humeur) >= 7 ? 'text-green-500' :
                              parseInt(capsule.humeur) >= 4 ? 'text-yellow-500' :
                              'text-red-500'
                            }`} />
                            <span className="font-medium">Niveau de bien-être: {capsule.humeur}/10</span>
                          </div>
                        </div>

                        <div className="grid gap-6">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Activité réalisée</h3>
                            <p className="text-gray-700">{capsule.activite}</p>
                          </div>

                          <div className="bg-purple-50 rounded-lg p-4">
                            <h3 className="font-semibold text-purple-900 mb-2">Ma réflexion</h3>
                            <p className="text-purple-800 whitespace-pre-wrap">{capsule.reflection}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default ClientDashboard