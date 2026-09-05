import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchReservations();
  }, [filter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const params = filter ? { statut: filter } : {};
      const { data } = await api.get('/reservations', { params });
      setReservations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnnuler = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;
    try {
      await api.put(`/reservations/${id}/annuler`);
      fetchReservations();
    } catch (err) {
      console.error(err);
    }
  };

  const statutBadge = (statut) => {
    const colors = {
      confirmee: 'bg-blue-500/20 text-blue-400',
      en_cours: 'bg-yellow-500/20 text-yellow-400',
      terminee: 'bg-green-500/20 text-green-400',
      annulee: 'bg-red-500/20 text-red-400',
    };
    return colors[statut] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-semibold text-lg">Réservations</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:border-[#dc2626] outline-none"
        >
          <option value="">Tous les statuts</option>
          <option value="confirmee">Confirmée</option>
          <option value="en_cours">En cours</option>
          <option value="terminee">Terminée</option>
          <option value="annulee">Annulée</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Chargement...</div>
      ) : (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#2a2a2a] bg-[#0f0f0f]">
                <th className="text-left py-3 px-4">N° Réservation</th>
                <th className="text-left py-3 px-4">Client</th>
                <th className="text-left py-3 px-4">Véhicule</th>
                <th className="text-left py-3 px-4">Dates</th>
                <th className="text-left py-3 px-4">Montant</th>
                <th className="text-left py-3 px-4">Statut</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-b border-[#2a2a2a] hover:bg-[#0f0f0f]">
                  <td className="py-3 px-4 text-white font-mono text-xs">{r.numero}</td>
                  <td className="py-3 px-4 text-gray-300">{r.client?.nom_complet}</td>
                  <td className="py-3 px-4 text-gray-300">{r.vehicule?.marque} {r.vehicule?.modele}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {new Date(r.date_debut).toLocaleDateString('fr-FR')} - {new Date(r.date_fin).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 px-4 text-[#dc2626] font-semibold">{r.prix_total} DH</td>
                  <td className="py-3 px-4">
                    <span className={`${statutBadge(r.statut)} px-2 py-1 rounded-full text-xs font-medium capitalize`}>
                      {r.statut}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {r.statut !== 'annulee' && r.statut !== 'terminee' && (
                      <button
                        onClick={() => handleAnnuler(r.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Annuler
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
