// services/airtableConfig.js
import Airtable from 'airtable';

const AIRTABLE_API = 'patqPw5nUNQ6dWDef.dc936fec94bcf0d4943c80f7c9c8deb17a49ad40938a69387c9623ca332f757b';
const base = new Airtable({ apiKey: AIRTABLE_API }).base('appAkNrBg4s6gURcn');

export const tables = {
  CHATS_PRIVEES: 'Chats_privees',
  TACHES_PRIVEES: 'Taches_privees',
  CAPSULES: 'Capsules',
  TACHES_EMPLOI: 'Taches_emploi'
};

// Service principal pour les interactions avec Airtable
export const airtableService = {
  // Services pour Chats_privees (Clients)
  async getClients() {
    try {
      const records = await base(tables.CHATS_PRIVEES).select().all();
      return records.map(record => ({
        id: record.id,
        tel_client: record.fields.tel_client,
        niveau: record.fields.niveau,
        etoiles: record.fields.etoiles,
        objectif: record.fields.objectif,
        progression: record.fields.progression
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      throw error;
    }
  },

  async getClientByTel(telClient) {
    try {
      const records = await base(tables.CHATS_PRIVEES)
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
  },

  // Services pour Taches_emploi
  async getTaches() {
    try {
      const records = await base(tables.TACHES_EMPLOI).select().all();
      return records.map(record => ({
        id: record.id,
        nom: record.fields.nom,
        categorie: record.fields.categorie,
        priorite: record.fields.priorite,
        status: record.fields.status,
        date: record.fields.date,
        // Ajoutez d'autres champs selon votre structure
        ...record.fields
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      throw error;
    }
  },

  async getTachesParCategorie(categorie) {
    try {
      const records = await base(tables.TACHES_EMPLOI)
        .select({
          filterByFormula: `{categorie} = '${categorie}'`
        })
        .all();
      
      return records.map(record => ({
        id: record.id,
        ...record.fields
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches par catégorie:', error);
      throw error;
    }
  },

  // Services pour Capsules (Points bien-être)
  async getCapsules() {
    try {
      const records = await base(tables.CAPSULES).select().all();
      return records.map(record => ({
        id: record.id,
        ...record.fields
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des capsules:', error);
      throw error;
    }
  },

  // Méthodes utilitaires pour les statistiques
  async getStatistiquesGlobales() {
    try {
      const [taches, clients] = await Promise.all([
        this.getTaches(),
        this.getClients()
      ]);

      const today = new Date().toISOString().split('T')[0];
      
      return {
        tachesTermineesAujourdhui: taches.filter(
          tache => tache.status === 'completed' && tache.date === today
        ).length,
        tachesTotales: taches.length,
        clientsActifs: clients.length,
        // Ajoutez d'autres statistiques pertinentes
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      throw error;
    }
  },

  async getStatistiquesHebdomadaires() {
    try {
      const taches = await this.getTaches();
      const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
      
      return weekDays.map(day => ({
        name: day,
        taches: taches.filter(tache => {
          if (!tache.date) return false;
          const taskDate = new Date(tache.date);
          return taskDate.toLocaleDateString('fr-FR', { weekday: 'short' }) === day;
        }).length
      }));
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques hebdomadaires:', error);
      throw error;
    }
  }
};
