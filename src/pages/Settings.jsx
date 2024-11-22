import { useState, useEffect } from 'react';
import { Card, CardTitle, CardContent } from "../components/ui/card";
import { airtableService } from '../services/airtableConfig';
import Airtable from 'airtable';

const AIRTABLE_API = 'patqPw5nUNQ6dWDef.dc936fec94bcf0d4943c80f7c9c8deb17a49ad40938a69387c9623ca332f757b';
const base = new Airtable({ apiKey: AIRTABLE_API }).base('appAkNrBg4s6gURcn');

function Settings() {
  const CLIENT_ID = '22962526964@c.us';
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [clientInfo, setClientInfo] = useState({
    nom_client: '',
    email: '',
    notifications_email: false,
    notifications_push: true
  });

  useEffect(() => {
    loadClientData();
  }, []);

  const loadClientData = async () => {
    try {
      setIsLoading(true);
      const client = await getClientByTel(CLIENT_ID);
      if (client) {
        setClientInfo({
          nom_client: client.nom_client || '',
          email: client.email || '',
          notifications_email: client.notifications_email || false,
          notifications_push: client.notifications_push || true
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getClientByTel = async (telClient) => {
    try {
      const records = await base('Chats_privees')
        .select({
          filterByFormula: `{tel_client} = '${telClient}'`
        })
        .firstPage();
      
      if (records.length === 0) return null;
      
      const record = records[0];
      return {
        id: record.id,
        ...record.fields
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du client:', error);
      throw error;
    }
  };

  const updateClient = async (clientId, updateData) => {
    try {
      const records = await base('Chats_privees')
        .select({
          filterByFormula: `{tel_client} = '${clientId}'`
        })
        .firstPage();
      
      if (records.length === 0) {
        throw new Error('Client non trouvé');
      }
      
      const recordId = records[0].id;
      
      await base('Chats_privees').update([
        {
          id: recordId,
          fields: {
            nom_client: updateData.nom_client,
            email: updateData.email,
            notifications_email: updateData.notifications_email,
            notifications_push: updateData.notifications_push
          }
        }
      ]);

      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateClient(CLIENT_ID, clientInfo);
      // Afficher un message de succès
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      // Afficher un message d'erreur
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="bg-white shadow-lg">
        <CardContent className="p-8">
          <CardTitle className="text-2xl font-bold mb-8 text-gray-800">
            Paramètres
          </CardTitle>
          
          <form onSubmit={handleSubmit}>
            {/* Section Profil */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-6 text-gray-700">Profil</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d'utilisateur
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    value={clientInfo.nom_client}
                    onChange={(e) => setClientInfo({...clientInfo, nom_client: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    value={clientInfo.email}
                    onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Section Notifications */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-6 text-gray-700">Notifications</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                  <div>
                    <span className="font-medium text-gray-700">Notifications email</span>
                    <p className="text-sm text-gray-500 mt-1">Recevoir les mises à jour par email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={clientInfo.notifications_email}
                      onChange={(e) => setClientInfo({...clientInfo, notifications_email: e.target.checked})}
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                  <div>
                    <span className="font-medium text-gray-700">Notifications push</span>
                    <p className="text-sm text-gray-500 mt-1">Recevoir les alertes sur le bureau</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={clientInfo.notifications_push}
                      onChange={(e) => setClientInfo({...clientInfo, notifications_push: e.target.checked})}
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Bouton Sauvegarder */}
            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Sauvegarde en cours...' : 'Sauvegarder les modifications'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Settings;