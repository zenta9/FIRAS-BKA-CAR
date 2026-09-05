import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Finalisation() {
  const { vehiculeId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { client } = useAuth();
  const [vehicule, setVehicule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    notes: '',
    mode_paiement: 'especes',
  });

  const [permisFile, setPermisFile] = useState(null);
  const [uploadingPermis, setUploadingPermis] = useState(false);

  const dateDebut = searchParams.get('date_debut') || '';
  const dateFin = searchParams.get('date_fin') || '';

  useEffect(() => {
    if (!client) {
      navigate('/client/login', { state: { from: `/reservation/${vehiculeId}?${searchParams.toString()}` } });
      return;
    }
    fetchVehicule();
  }, [vehiculeId, client]);

  const fetchVehicule = async () => {
    try {
      const { data } = await api.get(`/vehicules/${vehiculeId}`);
      setVehicule(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculerDetails = () => {
    if (!vehicule || !dateDebut || !dateFin) return { jours: 0, sousTotal: 0, assurance: 0, total: 0, acompte: 0 };
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const jours = Math.max(1, Math.ceil((fin - debut) / (1000 * 60 * 60 * 24)));
    const sousTotal = vehicule.prix_jour * jours;
    const assurance = 0;
    const total = sousTotal + assurance;
    const acompte = total * 0.30;
    return { jours, sousTotal, assurance, total, acompte };
  };

  const handleUploadPermis = async () => {
    if (!permisFile) return;
    setUploadingPermis(true);
    try {
      const formData = new FormData();
      formData.append('permis_conduire', permisFile);
      await api.post('/client/permis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      window.location.reload();
    } catch {
      alert('Erreur lors de l\'upload du permis');
    } finally {
      setUploadingPermis(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data } = await api.post('/reservations', {
        vehicule_id: parseInt(vehiculeId),
        date_debut: dateDebut,
        date_fin: dateFin,
        lieu_prise: 'Tanger',
        lieu_retour: 'Tanger',
        mode_paiement: form.mode_paiement,
        notes: form.notes,
      });

      navigate('/confirmation', {
        state: {
          reservation: data,
          vehicule,
          dateDebut,
          dateFin,
        },
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la réservation. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Chargement...</div>;
  if (!vehicule) return <div className="text-center py-20 text-gray-400">Véhicule non trouvé</div>;

  const details = calculerDetails();
  const hasPermis = client?.permis_conduire;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-white">Accueil</Link>
        <span className="mx-2">/</span>
        <Link to="/vehicules" className="hover:text-white">Nos véhicules</Link>
        <span className="mx-2">/</span>
        <span className="text-white">Finaliser la réservation</span>
      </nav>

      <h1 className="text-3xl font-bold text-white mb-8">Finalisez votre réservation</h1>

      {/* Permis Warning */}
      {!hasPermis && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-red-500 text-2xl">⚠️</div>
            <div className="flex-1">
              <h3 className="text-red-500 font-semibold mb-1">Permis de conduire requis</h3>
              <p className="text-gray-400 text-sm mb-3">
                Vous devez télécharger une photo de votre permis de conduire avant de pouvoir réserver.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setPermisFile(e.target.files[0])}
                  className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#dc2626] file:text-white hover:file:bg-[#b91c1c] file:cursor-pointer"
                />
                {permisFile && (
                  <button onClick={handleUploadPermis} disabled={uploadingPermis}
                    className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:bg-gray-600">
                    {uploadingPermis ? 'Envoi...' : 'Uploader le permis'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Info (read-only from account) */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Vos informations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Nom complet</label>
                  <input type="text" value={client?.nom_complet || ''} disabled
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-gray-500 text-sm cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Téléphone</label>
                  <input type="tel" value={client?.telephone || ''} disabled
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-gray-500 text-sm cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Email</label>
                  <input type="email" value={client?.email || ''} disabled
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-gray-500 text-sm cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">CIN</label>
                  <input type="text" value={client?.cin || ''} disabled
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-gray-500 text-sm cursor-not-allowed" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-gray-400 text-xs mb-1 block">Permis de conduire</label>
                  <div className="flex items-center gap-2">
                    {hasPermis ? (
                      <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm">✓ Permis vérifié</span>
                    ) : (
                      <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-sm">✗ Non uploadé</span>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-gray-400 text-xs mb-1 block">Notes (optionnel)</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#dc2626] outline-none resize-none"
                    placeholder="Demandes spéciales, sièges bébé, etc."
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Mode de paiement</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'especes', label: '💵 Espèces', desc: 'Paiement à la prise en charge' },
                  { value: 'visa', label: '💳 Visa', desc: 'Paiement en ligne' },
                  { value: 'mastercard', label: '💳 Mastercard', desc: 'Paiement en ligne' },
                  { value: 'cmi', label: '🏦 CMI', desc: 'Centre Monétique Interbancaire' },
                ].map((m) => (
                  <label
                    key={m.value}
                    className={`border rounded-lg p-3 cursor-pointer transition text-center ${
                      form.mode_paiement === m.value
                        ? 'border-[#dc2626] bg-[#dc2626]/10'
                        : 'border-[#2a2a2a] hover:border-[#444]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="mode_paiement"
                      value={m.value}
                      checked={form.mode_paiement === m.value}
                      onChange={(e) => setForm({ ...form, mode_paiement: e.target.value })}
                      className="sr-only"
                    />
                    <div className="text-sm font-medium text-white">{m.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{m.desc}</div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Résumé de la commande</h2>

              <div className="bg-[#0a0a0a] rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={vehicule.photos?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=200&q=80'}
                    alt={vehicule.modele}
                    className="w-20 h-14 object-cover rounded"
                  />
                  <div>
                    <h4 className="text-white font-medium text-sm">{vehicule.marque} {vehicule.modele}</h4>
                    <p className="text-gray-400 text-xs">{vehicule.transmission} • {vehicule.carburant} • {vehicule.places} places</p>
                    <p className="text-[#dc2626] font-bold text-sm mt-1">{vehicule.prix_jour} DH/jour</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-400">
                  <span>Date de prise en charge</span>
                  <span className="text-white">{dateDebut ? new Date(dateDebut).toLocaleDateString('fr-FR') : '-'}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Date de retour</span>
                  <span className="text-white">{dateFin ? new Date(dateFin).toLocaleDateString('fr-FR') : '-'}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Durée</span>
                  <span className="text-white">{details.jours} jours</span>
                </div>
              </div>

              <div className="border-t border-[#2a2a2a] pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>{vehicule.prix_jour} DH × {details.jours} jours</span>
                  <span className="text-white">{details.sousTotal} DH</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Assurance tous risques</span>
                  <span className="text-green-500">Incluse</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Kilométrage illimité</span>
                  <span className="text-green-500">Inclus</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-[#2a2a2a]">
                  <span>Total</span>
                  <span className="text-[#dc2626]">{details.total} DH</span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>Acompte (30%)</span>
                  <span className="text-[#dc2626] font-semibold">{details.acompte} DH</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !hasPermis}
              className="w-full bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
            >
              {!hasPermis
                ? 'Permis requis pour réserver'
                : submitting
                  ? 'Réservation en cours...'
                  : `Payer l'acompte ${details.acompte} DH`
              }
            </button>

            <p className="text-center text-gray-500 text-xs">
              Acompte de 30% requis pour confirmer la réservation. Le reste est payé à la prise en charge.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
