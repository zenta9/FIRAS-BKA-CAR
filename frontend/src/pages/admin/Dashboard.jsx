import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentes, setRecentes] = useState([]);
  const [revenus, setRevenus] = useState([]);
  const [repartition, setRepartition] = useState([]);
  const [rappels, setRappels] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [statsRes, recentesRes, revenusRes, repartitionRes, rappelsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/reservations-recentes'),
        api.get('/dashboard/revenus'),
        api.get('/dashboard/repartition-vehicules'),
        api.get('/dashboard/rappels'),
      ]);
      setStats(statsRes.data);
      setRecentes(recentesRes.data);
      setRevenus(revenusRes.data);
      setRepartition(repartitionRes.data);
      setRappels(rappelsRes.data);
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
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Réservations totales', value: stats?.total_reservations || 0, icon: '📋', color: 'text-blue-400' },
          { label: 'Véhicules disponibles', value: stats?.vehicules_disponibles || 0, icon: '🚗', color: 'text-green-400' },
          { label: 'Nombre de clients', value: stats?.total_clients || 0, icon: '👥', color: 'text-purple-400' },
          { label: 'Revenus du mois', value: `${(stats?.revenus_mois || 0).toLocaleString()} DH`, icon: '💰', color: 'text-[#dc2626]', sub: stats?.evolution_revenus ? `+${stats.evolution_revenus}% ce mois` : null },
        ].map((s, i) => (
          <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">{s.label}</span>
              <span className="text-2xl">{s.icon}</span>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            {s.sub && <p className="text-green-500 text-xs mt-1">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Reservations */}
        <div className="lg:col-span-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Réservations récentes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-[#2a2a2a]">
                  <th className="text-left py-2">#</th>
                  <th className="text-left py-2">Client</th>
                  <th className="text-left py-2">Véhicule</th>
                  <th className="text-left py-2">Dates</th>
                  <th className="text-left py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentes.map((r) => (
                  <tr key={r.id} className="border-b border-[#2a2a2a] hover:bg-[#0f0f0f]">
                    <td className="py-3 text-white font-mono text-xs">{r.numero}</td>
                    <td className="py-3 text-gray-300">{r.client?.nom_complet}</td>
                    <td className="py-3 text-gray-300">{r.vehicule?.marque} {r.vehicule?.modele}</td>
                    <td className="py-3 text-gray-400 text-xs">
                      {new Date(r.date_debut).toLocaleDateString('fr-FR')} - {new Date(r.date_fin).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3">
                      <span className={`${statutBadge(r.statut)} px-2 py-1 rounded-full text-xs font-medium capitalize`}>
                        {r.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Revenus (mois)</h3>
          <div className="text-center py-8">
            <p className="text-[#dc2626] font-bold text-3xl">{(stats?.revenus_mois || 0).toLocaleString()} DH</p>
            <p className="text-gray-400 text-sm mt-1">+{stats?.evolution_revenus || 0}% par rapport au mois dernier</p>
          </div>
          <div className="space-y-2">
            {revenus.slice(-6).map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-gray-400 text-xs w-8">{['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'][r.mois - 1]}</span>
                <div className="flex-1 bg-[#2a2a2a] rounded-full h-2">
                  <div
                    className="bg-[#dc2626] h-2 rounded-full"
                    style={{ width: `${Math.min(100, (r.total / (stats?.revenus_mois || 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-white text-xs">{r.total.toLocaleString()} DH</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Repartition */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Répartition des véhicules</h3>
          <div className="space-y-3">
            {repartition.map((r, i) => {
              const total = repartition.reduce((acc, v) => acc + v.total, 0);
              const pct = total > 0 ? Math.round((r.total / total) * 100) : 0;
              const colors = { disponible: 'bg-green-500', louee: 'bg-yellow-500', maintenance: 'bg-red-500' };
              const labels = { disponible: 'Disponibles', louee: 'Louées', maintenance: 'Maintenance' };
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{labels[r.statut] || r.statut}</span>
                    <span className="text-white">{r.total} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-[#2a2a2a] rounded-full h-2">
                    <div className={`${colors[r.statut] || 'bg-gray-500'} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rappels */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Rappels & Alertes</h3>
          <div className="space-y-3">
            {rappels?.retours_jour?.length > 0 && rappels.retours_jour.map((r, i) => (
              <div key={i} className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <span className="text-yellow-500">⚠️</span>
                <div>
                  <p className="text-white text-sm">Retour aujourd'hui: {r.vehicule?.marque} {r.vehicule?.modele}</p>
                  <p className="text-gray-400 text-xs">Client: {r.client?.nom_complet}</p>
                </div>
              </div>
            ))}
            {rappels?.maintenance?.length > 0 && rappels.maintenance.map((v, i) => (
              <div key={i} className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <span className="text-red-500">🔧</span>
                <div>
                  <p className="text-white text-sm">En maintenance: {v.marque} {v.modele}</p>
                </div>
              </div>
            ))}
            {(!rappels?.retours_jour?.length && !rappels?.maintenance?.length) && (
              <p className="text-gray-500 text-sm text-center py-4">Aucune alerte pour le moment</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
