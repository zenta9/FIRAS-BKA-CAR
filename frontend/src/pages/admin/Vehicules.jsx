import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminVehicules() {
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editVehicule, setEditVehicule] = useState(null);

  const [form, setForm] = useState({
    marque: '',
    modele: '',
    categorie: 'Berline',
    annee: 2024,
    transmission: 'automatique',
    carburant: 'essence',
    places: 5,
    puissance: '',
    kilometrage: 0,
    prix_jour: 0,
    statut: 'disponible',
    populaire: false,
  });

  useEffect(() => {
    fetchVehicules();
  }, []);

  const fetchVehicules = async () => {
    try {
      const { data } = await api.get('/vehicules');
      setVehicules(data.vehicules);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (v = null) => {
    if (v) {
      setEditVehicule(v);
      setForm({
        marque: v.marque,
        modele: v.modele,
        categorie: v.categorie,
        annee: v.annee,
        transmission: v.transmission,
        carburant: v.carburant,
        places: v.places,
        puissance: v.puissance || '',
        kilometrage: v.kilometrage || 0,
        prix_jour: v.prix_jour,
        statut: v.statut,
        populaire: v.populaire,
      });
    } else {
      setEditVehicule(null);
      setForm({
        marque: '', modele: '', categorie: 'Berline', annee: 2024,
        transmission: 'automatique', carburant: 'essence', places: 5,
        puissance: '', kilometrage: 0, prix_jour: 0, statut: 'disponible', populaire: false,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editVehicule) {
        await api.put(`/vehicules-admin/${editVehicule.id}`, form);
      } else {
        await api.post('/vehicules-admin', form);
      }
      setShowModal(false);
      fetchVehicules();
    } catch (err) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce véhicule ?')) return;
    try {
      await api.delete(`/vehicules-admin/${id}`);
      fetchVehicules();
    } catch (err) {
      console.error(err);
    }
  };

  const statutColor = (s) => {
    const c = { disponible: 'text-green-400', louee: 'text-yellow-400', maintenance: 'text-red-400' };
    return c[s] || 'text-gray-400';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-semibold text-lg">Véhicules</h2>
        <button
          onClick={() => openModal()}
          className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          + Ajouter
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Chargement...</div>
      ) : (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-[#2a2a2a] bg-[#0f0f0f]">
                <th className="text-left py-3 px-4">Véhicule</th>
                <th className="text-left py-3 px-4">Catégorie</th>
                <th className="text-left py-3 px-4">Année</th>
                <th className="text-left py-3 px-4">Prix/Jour</th>
                <th className="text-left py-3 px-4">Statut</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicules.map((v) => (
                <tr key={v.id} className="border-b border-[#2a2a2a] hover:bg-[#0f0f0f]">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={v.photos?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=100&q=80'}
                        alt={v.modele}
                        className="w-12 h-8 object-cover rounded"
                      />
                      <div>
                        <p className="text-white font-medium">{v.marque} {v.modele}</p>
                        <p className="text-gray-500 text-xs">{v.transmission} • {v.carburant} • {v.places}p</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{v.categorie}</td>
                  <td className="py-3 px-4 text-gray-300">{v.annee}</td>
                  <td className="py-3 px-4 text-[#dc2626] font-semibold">{v.prix_jour} DH</td>
                  <td className="py-3 px-4">
                    <span className={`${statutColor(v.statut)} text-sm font-medium capitalize`}>{v.statut}</span>
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <button onClick={() => openModal(v)} className="text-blue-400 hover:text-blue-300 text-xs">Modifier</button>
                    <button onClick={() => handleDelete(v.id)} className="text-red-400 hover:text-red-300 text-xs">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-semibold text-lg mb-4">
              {editVehicule ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Marque *</label>
                  <input required value={form.marque} onChange={(e) => setForm({ ...form, marque: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:border-[#dc2626] outline-none" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Modèle *</label>
                  <input required value={form.modele} onChange={(e) => setForm({ ...form, modele: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:border-[#dc2626] outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Catégorie</label>
                  <select value={form.categorie} onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:border-[#dc2626] outline-none">
                    <option>Berline</option>
                    <option>Compacte</option>
                    <option>SUV</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Année</label>
                  <input type="number" value={form.annee} onChange={(e) => setForm({ ...form, annee: parseInt(e.target.value) })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:border-[#dc2626] outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Transmission</label>
                  <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:border-[#dc2626] outline-none">
                    <option value="automatique">Automatique</option>
                    <option value="manuelle">Manuelle</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Carburant</label>
                  <select value={form.carburant} onChange={(e) => setForm({ ...form, carburant: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:border-[#dc2626] outline-none">
                    <option value="essence">Essence</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybride">Hybride</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Places</label>
                  <input type="number" value={form.places} onChange={(e) => setForm({ ...form, places: parseInt(e.target.value) })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:border-[#dc2626] outline-none" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Prix/Jour (DH)</label>
                  <input type="number" value={form.prix_jour} onChange={(e) => setForm({ ...form, prix_jour: parseFloat(e.target.value) })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:border-[#dc2626] outline-none" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Statut</label>
                  <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:border-[#dc2626] outline-none">
                    <option value="disponible">Disponible</option>
                    <option value="louee">Louée</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={form.populaire} onChange={(e) => setForm({ ...form, populaire: e.target.checked })}
                  className="accent-[#dc2626]" />
                Populaire
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white py-2 rounded-lg text-sm font-medium transition">
                  {editVehicule ? 'Modifier' : 'Ajouter'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-[#2a2a2a] text-gray-300 py-2 rounded-lg text-sm hover:bg-[#333] transition">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
