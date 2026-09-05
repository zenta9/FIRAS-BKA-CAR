import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/AuthLayout';

const IC = {
  eye: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  eyeOff: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>,
  spinner: <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>,
  check: <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>,
  alert: <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>,
  success: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

function PasswordInput({ id, label, value, onChange, placeholder, show, onToggle, autoFocus }) {
  return (
    <div>
      <label htmlFor={id} className="text-white/50 text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          required
          minLength={6}
          autoComplete="new-password"
          autoFocus={autoFocus}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-2.5 pr-11 text-white text-sm placeholder:text-white/20 focus:border-[#dc2626]/50 focus:ring-1 focus:ring-[#dc2626]/20 outline-none transition-all"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors p-0.5"
          aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          {show ? IC.eyeOff : IC.eye}
        </button>
      </div>
    </div>
  );
}

function StrengthIndicator({ strength }) {
  const config = {
    weak: { label: 'Faible', color: 'bg-[#dc2626]', text: 'text-[#dc2626]', width: 'w-1/3' },
    medium: { label: 'Moyen', color: 'bg-amber-500', text: 'text-amber-500', width: 'w-2/3' },
    strong: { label: 'Fort', color: 'bg-emerald-500', text: 'text-emerald-500', width: 'w-full' },
  };
  if (!strength) return null;
  const s = config[strength];
  return (
    <div className="mt-2">
      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <div className={`h-full ${s.color} ${s.width} rounded-full transition-all duration-500`} />
      </div>
      <p className={`text-[11px] mt-1 ${s.text} font-medium`}>Force : {s.label}</p>
    </div>
  );
}

export default function ClientRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    nom_complet: '', email: '', telephone: '',
    password: '', password_confirmation: '',
    cin: '', adresse: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [showPwConf, setShowPwConf] = useState(false);
  const [cgu, setCgu] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setFieldErrors(p => ({ ...p, [key]: '' }));
  };

  const passwordStrength = useMemo(() => {
    const p = form.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return 'weak';
    if (score <= 2) return 'medium';
    return 'strong';
  }, [form.password]);

  const passwordsMatch = form.password && form.password_confirmation && form.password === form.password_confirmation;
  const passwordsMismatch = form.password_confirmation && form.password !== form.password_confirmation;

  const phoneError = useMemo(() => {
    if (!form.telephone) return '';
    if (!/^(06|07)\d{8}$/.test(form.telephone)) return 'Format invalide (06XXXXXXXX ou 07XXXXXXXX)';
    return '';
  }, [form.telephone]);

  const cinError = useMemo(() => {
    if (!form.cin) return '';
    if (!/^\d{8}$/.test(form.cin)) return 'Le CIN doit contenir 8 chiffres';
    return '';
  }, [form.cin]);

  const isValid = form.nom_complet && form.email && form.telephone && form.password.length >= 6
    && form.password === form.password_confirmation && cgu && !phoneError && !cinError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setError('');
    setFieldErrors({});
    setLoading(true);
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate('/client/login'), 2500);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setFieldErrors(data.errors);
      } else {
        setError(data?.message || 'Erreur lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Inscription réussie" subtitle="Redirection vers la connexion...">
        <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            {IC.success}
          </div>
          <h2 className="text-white font-semibold text-lg mb-2">Compte créé avec succès</h2>
          <p className="text-white/40 text-sm">Vous allez être redirigé vers la page de connexion.</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Créer un compte" subtitle="Rejoignez-nous pour réserver votre voiture" image="/images/photo2.jpg">
      <form onSubmit={handleSubmit} className="bg-[#111] border border-white/[0.06] rounded-2xl p-6 sm:p-7">
        {error && (
          <div role="alert" className="flex items-start gap-2.5 bg-[#dc2626]/10 border border-[#dc2626]/20 text-[#dc2626] text-sm px-4 py-3 rounded-xl mb-5">
            {IC.alert}
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Nom complet */}
          <div>
            <label htmlFor="reg-nom" className="text-white/50 text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
              Nom complet *
            </label>
            <input
              id="reg-nom"
              type="text"
              required
              autoFocus
              autoComplete="name"
              value={form.nom_complet}
              onChange={(e) => update('nom_complet', e.target.value)}
              className={`w-full bg-[#0a0a0a] border rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 outline-none transition-all ${
                fieldErrors.nom_complet ? 'border-[#dc2626]/50 focus:border-[#dc2626]/50 focus:ring-[#dc2626]/20' : 'border-white/[0.08] focus:border-[#dc2626]/50 focus:ring-[#dc2626]/20'
              }`}
            />
            {fieldErrors.nom_complet && (
              <p className="text-[#dc2626] text-xs mt-1" role="alert">{fieldErrors.nom_complet}</p>
            )}
          </div>

          {/* Email + Téléphone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-email" className="text-white/50 text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
                Email *
              </label>
              <input
                id="reg-email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className={`w-full bg-[#0a0a0a] border rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 outline-none transition-all ${
                  fieldErrors.email ? 'border-[#dc2626]/50 focus:border-[#dc2626]/50 focus:ring-[#dc2626]/20' : 'border-white/[0.08] focus:border-[#dc2626]/50 focus:ring-[#dc2626]/20'
                }`}
              />
              {fieldErrors.email && (
                <p className="text-[#dc2626] text-xs mt-1" role="alert">{fieldErrors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="reg-tel" className="text-white/50 text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
                Téléphone *
              </label>
              <input
                id="reg-tel"
                type="tel"
                required
                autoComplete="tel"
                value={form.telephone}
                onChange={(e) => update('telephone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="06XXXXXXXX"
                className={`w-full bg-[#0a0a0a] border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:ring-1 outline-none transition-all ${
                  phoneError || fieldErrors.telephone ? 'border-[#dc2626]/50 focus:border-[#dc2626]/50 focus:ring-[#dc2626]/20' : 'border-white/[0.08] focus:border-[#dc2626]/50 focus:ring-[#dc2626]/20'
                }`}
              />
              {(phoneError || fieldErrors.telephone) && (
                <p className="text-[#dc2626] text-xs mt-1" role="alert">{fieldErrors.telephone || phoneError}</p>
              )}
            </div>
          </div>

          {/* Password */}
          <PasswordInput
            id="reg-pw"
            label="Mot de passe *"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="Min. 6 caractères"
            show={showPw}
            onToggle={() => setShowPw(!showPw)}
          />
          <StrengthIndicator strength={passwordStrength} />

          {/* Password confirmation */}
          <div>
            <PasswordInput
              id="reg-pw-conf"
              label="Confirmer le mot de passe *"
              value={form.password_confirmation}
              onChange={(e) => update('password_confirmation', e.target.value)}
              placeholder="Retapez le mot de passe"
              show={showPwConf}
              onToggle={() => setShowPwConf(!showPwConf)}
            />
            {passwordsMismatch && (
              <p className="text-[#dc2626] text-xs mt-1.5 flex items-center gap-1" role="alert">
                {IC.alert}
                Les mots de passe ne correspondent pas
              </p>
            )}
            {passwordsMatch && (
              <p className="text-emerald-400 text-xs mt-1.5 flex items-center gap-1">
                {IC.check}
                Les mots de passe correspondent
              </p>
            )}
          </div>

          {/* CIN + Adresse */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-cin" className="text-white/50 text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
                CIN
              </label>
              <input
                id="reg-cin"
                type="text"
                autoComplete="off"
                value={form.cin}
                onChange={(e) => update('cin', e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="12345678"
                className={`w-full bg-[#0a0a0a] border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:ring-1 outline-none transition-all ${
                  cinError || fieldErrors.cin ? 'border-[#dc2626]/50 focus:border-[#dc2626]/50 focus:ring-[#dc2626]/20' : 'border-white/[0.08] focus:border-[#dc2626]/50 focus:ring-[#dc2626]/20'
                }`}
              />
              {(cinError || fieldErrors.cin) && (
                <p className="text-[#dc2626] text-xs mt-1" role="alert">{fieldErrors.cin || cinError}</p>
              )}
            </div>
            <div>
              <label htmlFor="reg-adresse" className="text-white/50 text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
                Adresse
              </label>
              <input
                id="reg-adresse"
                type="text"
                autoComplete="street-address"
                value={form.adresse}
                onChange={(e) => update('adresse', e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:border-[#dc2626]/50 focus:ring-1 focus:ring-[#dc2626]/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* CGU */}
          <label className="flex items-start gap-3 cursor-pointer group/cgu pt-1">
            <span className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 ${
              cgu
                ? 'bg-[#dc2626] border-[#dc2626]'
                : 'border-white/20 group-hover/cgu:border-white/40'
            }`}>
              {cgu && IC.check}
            </span>
            <input
              type="checkbox"
              checked={cgu}
              onChange={(e) => setCgu(e.target.checked)}
              className="sr-only"
            />
            <span className="text-white/50 text-[13px] leading-relaxed group-hover/cgu:text-white/70 transition-colors">
              J'accepte les{' '}
              <a href="/cgu" target="_blank" rel="noopener noreferrer" className="text-[#dc2626] hover:underline">
                conditions générales d'utilisation
              </a>
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !isValid}
          className="w-full bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-white/[0.06] disabled:text-white/30 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 mt-6 flex items-center justify-center gap-2"
        >
          {loading && IC.spinner}
          {loading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>

        {/* Login link */}
        <p className="text-center text-white/30 text-sm mt-5">
          Déjà un compte ?{' '}
          <Link to="/client/login" className="text-[#dc2626] hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
