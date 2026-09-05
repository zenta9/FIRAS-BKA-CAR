import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ClientProfil() {
  const { client, logout, updateProfile, uploadPermis } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom_complet: client?.nom_complet || '',
    telephone: client?.telephone || '',
    email: client?.email || '',
    cin: client?.cin || '',
    adresse: client?.adresse || '',
  });
  const [permisFile, setPermisFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await updateProfile(form);
      setMsg('Profil mis à jour !');
    } catch {
      setMsg('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPermis = async () => {
    if (!permisFile) return;
    setLoading(true);
    setMsg('');
    try {
      await uploadPermis(permisFile);
      setMsg('Permis uploadé avec succès !');
      setPermisFile(null);
    } catch {
      setMsg('Erreur lors de l\'upload du permis');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Mon profil</h1>
        <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 text-sm">
          Déconnexion
        </button>
      </div>

      {msg && (
        <div className={`text-sm px-4 py-2 rounded-lg mb-4 ${
          msg.includes('Erreur') ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
        }`}>
          {msg}
        </div>
      )}

      {/* Permis */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-3">Permis de conduire</h2>
        <p className="text-gray-400 text-sm mb-4">
          Vous devez télécharger une photo de votre permis pour pouvoir réserver.
        </p>
        {client?.permis_conduire ? (
          <div className="flex items-center gap-3">
            <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm">✓ Permis uploadé</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-sm">✗ Permis non uploadé</span>
          </div>
        )}
        <div className="mt-4 flex items-center gap-3">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setPermisFile(e.target.files[0])}
            className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#dc2626] file:text-white hover:file:bg-[#b91c1c] file:cursor-pointer"
          />
          {permisFile && (
            <button onClick={handleUploadPermis} disabled={loading}
              className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:bg-gray-600">
              {loading ? 'Envoi...' : 'Uploader'}
            </button>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleUpdate} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Mes informations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Nom complet</label>
            <input type="text" value={form.nom_complet}
              onChange={(e) => setForm({ ...form, nom_complet: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#dc2626] outline-none" />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Téléphone</label>
            <input type="tel" value={form.telephone}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#dc2626] outline-none" />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Email</label>
            <input type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#dc2626] outline-none" />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">CIN</label>
            <input type="text" value={form.cin}
              onChange={(e) => setForm({ ...form, cin: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#dc2626] outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="text-gray-400 text-xs mb-1 block">Adresse</label>
            <input type="text" value={form.adresse}
              onChange={(e) => setForm({ ...form, adresse: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm focus:border-[#dc2626] outline-none" />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="mt-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-2 rounded-lg text-sm font-medium transition disabled:bg-gray-600">
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>

      <div className="mt-6">
        <Link to="/" className="text-[#dc2626] hover:underline text-sm">← Retour à l'accueil</Link>
      </div>
    </div>
  );
}
