import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800&q=80';

const IC = {
  calendar: (cls) => <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
  gauge: (cls) => <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
  cog: (cls) => <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  droplet: (cls) => <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg>,
  bolt: (cls) => <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  users: (cls) => <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
  check: (cls) => <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>,
  clock: (cls) => <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  whatsapp: (cls) => <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>,
  chevronL: (cls) => <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>,
  chevronR: (cls) => <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>,
};

function Thumbnail({ src, alt, active, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={`Voir ${alt}`}
      className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:ring-offset-2 focus:ring-offset-black ${
        active ? 'border-[#dc2626] shadow-lg shadow-[#dc2626]/20' : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/20'
      }`}
    >
      {!loaded && !err && <div className="absolute inset-0 bg-white/[0.04] animate-pulse" />}
      <img
        src={err ? FALLBACK_IMG : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setErr(true)}
        className={`w-full h-full object-cover transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </button>
  );
}

function DatePicker({ label, id, value, onChange, min }) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value + 'T00:00:00') : new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const dayNames = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  const selectDay = (d) => {
    const selected = new Date(year, month, d);
    const iso = selected.toISOString().split('T')[0];
    onChange(iso);
    setOpen(false);
  };

  return (
    <div className="relative">
      <label htmlFor={id} className="text-white/50 text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
        {label}
      </label>
      <button
        id={id}
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-left text-sm transition-all hover:border-white/15 focus:border-[#dc2626]/50 focus:ring-1 focus:ring-[#dc2626]/20 outline-none flex items-center justify-between"
      >
        <span className={value ? 'text-white' : 'text-white/30'}>{value || 'Sélectionner'}</span>
        <span className="text-white/30">{IC.calendar('w-4 h-4')}</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-2 bg-[#111] border border-white/[0.1] rounded-2xl p-4 shadow-2xl shadow-black/60 w-72">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setViewDate(new Date(year, month - 1))} className="text-white/40 hover:text-white p-1 transition-colors" aria-label="Mois précédent">
              {IC.chevronL('w-4 h-4')}
            </button>
            <span className="text-white text-sm font-medium">{monthNames[month]} {year}</span>
            <button onClick={() => setViewDate(new Date(year, month + 1))} className="text-white/40 hover:text-white p-1 transition-colors" aria-label="Mois suivant">
              {IC.chevronR('w-4 h-4')}
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {dayNames.map(d => (
              <div key={d} className="text-center text-[10px] text-white/30 font-medium py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d, i) => {
              if (d === null) return <div key={`e-${i}`} />;
              const cellDate = new Date(year, month, d);
              const isPast = cellDate < today;
              const isSelected = value === cellDate.toISOString().split('T')[0];
              const isToday = cellDate.getTime() === today.getTime();
              return (
                <button
                  key={d}
                  type="button"
                  disabled={isPast}
                  onClick={() => selectDay(d)}
                  className={`h-9 rounded-lg text-xs font-medium transition-all ${
                    isPast ? 'text-white/15 cursor-not-allowed' :
                    isSelected ? 'bg-[#dc2626] text-white shadow-lg shadow-[#dc2626]/30' :
                    isToday ? 'bg-white/10 text-white' :
                    'text-white/60 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MiniCalendar({ bookedDates = [] }) {
  const now = new Date();
  const [view, setView] = useState(new Date(now.getFullYear(), now.getMonth()));
  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  const isBooked = (d) => {
    if (!d) return false;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return bookedDates.some(bd => {
      const start = bd.date_debut?.split(' ')[0] || bd.date_debut;
      const end = bd.date_fin?.split(' ')[0] || bd.date_fin;
      return dateStr >= start && dateStr <= end;
    });
  };

  return (
    <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setView(new Date(year, month - 1))} className="text-white/40 hover:text-white p-1 transition-colors" aria-label="Mois précédent">
          {IC.chevronL('w-4 h-4')}
        </button>
        <span className="text-white text-sm font-medium">{monthNames[month]} {year}</span>
        <button onClick={() => setView(new Date(year, month + 1))} className="text-white/40 hover:text-white p-1 transition-colors" aria-label="Mois suivant">
          {IC.chevronR('w-4 h-4')}
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(d => (
          <div key={d} className="text-center text-[10px] text-white/30 font-medium py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          if (d === null) return <div key={`e-${i}`} />;
          const booked = isBooked(d);
          const isToday = new Date(year, month, d).getTime() === new Date().setHours(0,0,0,0);
          return (
            <div
              key={d}
              className={`h-8 rounded-lg text-xs flex items-center justify-center font-medium ${
                booked ? 'bg-[#dc2626]/20 text-[#dc2626] line-through' :
                isToday ? 'bg-white/10 text-white' :
                'text-white/50'
              }`}
            >
              {d}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2 text-[11px] text-white/40">
          <span className="w-2.5 h-2.5 rounded bg-[#dc2626]/30 border border-[#dc2626]/50" />
          Réservé
        </div>
        <div className="flex items-center gap-2 text-[11px] text-white/40">
          <span className="w-2.5 h-2.5 rounded bg-white/10 border border-white/20" />
          Aujourd'hui
        </div>
      </div>
    </div>
  );
}

export default function VehiculeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicule, setVehicule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [dates, setDates] = useState({ dateDebut: '', heureDebut: '10:00', dateFin: '', heureFin: '10:00' });
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    fetchVehicule();
    setActiveImg(0);
    setImgLoaded(false);
  }, [id]);

  const fetchVehicule = async () => {
    try {
      const { data } = await api.get(`/vehicules/${id}`);
      setVehicule(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const images = vehicule?.photos?.length ? vehicule.photos : [FALLBACK_IMG];
  const hasDates = dates.dateDebut && dates.dateFin;

  const { duree, total } = useMemo(() => {
    if (!hasDates || !vehicule) return { duree: null, total: null };
    const debut = new Date(`${dates.dateDebut}T${dates.heureDebut}`);
    const fin = new Date(`${dates.dateFin}T${dates.heureFin}`);
    const j = Math.max(1, Math.ceil((fin - debut) / (1000 * 60 * 60 * 24)));
    return { duree: j, total: vehicule.prix_jour * j };
  }, [dates.dateDebut, dates.dateFin, dates.heureDebut, dates.heureFin, vehicule]);

  const handleReserver = () => {
    navigate(`/reservation/${vehicule.id}?date_debut=${dates.dateDebut} ${dates.heureDebut}&date_fin=${dates.dateFin} ${dates.heureFin}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-white/[0.06] rounded w-64" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-white/[0.04] rounded-2xl" />
                <div className="h-6 bg-white/[0.06] rounded w-1/2" />
                <div className="h-40 bg-white/[0.04] rounded-2xl" />
              </div>
              <div className="h-80 bg-white/[0.04] rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicule) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-full bg-white/[0.04] flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-white text-xl font-semibold mb-2">Véhicule non trouvé</h2>
        <p className="text-white/40 text-sm mb-6">Ce véhicule n'existe pas ou a été supprimé.</p>
        <Link to="/vehicules" className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="text-[13px] text-white/30 mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
            <li>{IC.chevronR('w-3.5 h-3.5')}</li>
            <li><Link to="/vehicules" className="hover:text-white transition-colors">Nos véhicules</Link></li>
            <li>{IC.chevronR('w-3.5 h-3.5')}</li>
            <li className="text-white/70">{vehicule.marque} {vehicule.modele}</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 min-w-0">
            {/* Main Image */}
            <div className="relative bg-[#111] border border-white/[0.06] rounded-2xl overflow-hidden mb-4">
              {!imgLoaded && <div className="absolute inset-0 bg-white/[0.03] animate-pulse" />}
              <img
                src={images[activeImg]}
                alt={`${vehicule.marque} ${vehicule.modele} — vue ${activeImg + 1}`}
                onLoad={() => setImgLoaded(true)}
                onError={(e) => { e.target.src = FALLBACK_IMG; setImgLoaded(true); }}
                className={`w-full h-[280px] sm:h-[400px] lg:h-[460px] object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => { setActiveImg(i => (i - 1 + images.length) % images.length); setImgLoaded(false); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all focus:outline-none focus:ring-2 focus:ring-white/30"
                    aria-label="Image précédente"
                  >
                    {IC.chevronL('w-5 h-5')}
                  </button>
                  <button
                    onClick={() => { setActiveImg(i => (i + 1) % images.length); setImgLoaded(false); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all focus:outline-none focus:ring-2 focus:ring-white/30"
                    aria-label="Image suivante"
                  >
                    {IC.chevronR('w-5 h-5')}
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((src, i) => (
                  <Thumbnail
                    key={i}
                    src={src}
                    alt={`${vehicule.marque} ${vehicule.modele} vue ${i + 1}`}
                    active={i === activeImg}
                    onClick={() => { setActiveImg(i); setImgLoaded(false); }}
                  />
                ))}
              </div>
            )}

            {/* Title & Tags */}
            <div className="mt-6 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                {vehicule.marque} {vehicule.modele}
              </h1>
              <div className="flex flex-wrap gap-2 mb-3">
                {[vehicule.transmission === 'automatique' ? 'Automatique' : 'Manuelle', vehicule.carburant, `${vehicule.places} places`].map((tag, i) => (
                  <span key={i} className="bg-white/[0.06] text-white/60 text-[12px] px-3 py-1 rounded-full border border-white/[0.06]">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[#dc2626] font-bold text-3xl">{vehicule.prix_jour}</span>
                <span className="text-white/30 text-sm font-normal">DH / jour</span>
              </div>
              <p className="text-white/40 text-sm mt-3 max-w-xl leading-relaxed">
                Berline élégante, confortable et performante. Idéale pour vos déplacements professionnels ou personnels à Tanger.
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-5 mb-6">
              <h3 className="text-white font-semibold mb-4">Spécifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { icon: IC.calendar, label: 'Année', value: vehicule.annee },
                  { icon: IC.gauge, label: 'Kilométrage', value: `${vehicule.kilometrage?.toLocaleString()} km` },
                  { icon: IC.cog, label: 'Transmission', value: vehicule.transmission === 'automatique' ? 'Automatique' : 'Manuelle' },
                  { icon: IC.droplet, label: 'Carburant', value: vehicule.carburant },
                  { icon: IC.bolt, label: 'Puissance', value: vehicule.puissance },
                  { icon: IC.users, label: 'Places', value: vehicule.places },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/[0.02] rounded-xl px-4 py-3 border border-white/[0.04]">
                    <div className="w-8 h-8 rounded-lg bg-[#dc2626]/10 flex items-center justify-center shrink-0">
                      {s.icon('w-4 h-4 text-[#dc2626]')}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white/40 text-[11px] uppercase tracking-wider">{s.label}</div>
                      <div className="text-white text-sm font-medium truncate">{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Équipements */}
            <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-5 mb-6">
              <h3 className="text-white font-semibold mb-4">Équipements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(vehicule.equipements || []).map((eq, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/[0.02] rounded-xl px-4 py-2.5 border border-white/[0.04]">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      {IC.check('w-3 h-3 text-emerald-400')}
                    </div>
                    <span className="text-white/70 text-sm">{eq}</span>
                  </div>
                ))}
                {(!vehicule.equipements || vehicule.equipements.length === 0) && (
                  <p className="text-white/30 text-sm col-span-full">Aucun équipement renseigné.</p>
                )}
              </div>
            </div>

            {/* Disponibilité */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                {IC.calendar('w-5 h-5 text-[#dc2626]')}
                Disponibilité
              </h3>
              <MiniCalendar bookedDates={vehicule.reservations || []} />
            </div>
          </div>

          {/* Right Column — Booking Widget */}
          <aside className="w-full lg:w-96 shrink-0">
            <div className="lg:sticky lg:top-28">
              <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                  {IC.calendar('w-5 h-5 text-[#dc2626]')}
                  Réserver ce véhicule
                </h3>

                <div className="space-y-3 mb-5">
                  <DatePicker
                    label="Date de prise en charge"
                    id="date-debut"
                    value={dates.dateDebut}
                    onChange={(v) => setDates(p => ({ ...p, dateDebut: v }))}
                  />
                  <div>
                    <label htmlFor="heure-debut" className="text-white/50 text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
                      Heure
                    </label>
                    <input
                      id="heure-debut"
                      type="time"
                      value={dates.heureDebut}
                      onChange={(e) => setDates(p => ({ ...p, heureDebut: e.target.value }))}
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#dc2626]/50 focus:ring-1 focus:ring-[#dc2626]/20 outline-none transition-all"
                    />
                  </div>
                  <DatePicker
                    label="Date de retour"
                    id="date-fin"
                    value={dates.dateFin}
                    onChange={(v) => setDates(p => ({ ...p, dateFin: v }))}
                  />
                  <div>
                    <label htmlFor="heure-fin" className="text-white/50 text-[11px] font-medium uppercase tracking-wider mb-1.5 block">
                      Heure
                    </label>
                    <input
                      id="heure-fin"
                      type="time"
                      value={dates.heureFin}
                      onChange={(e) => setDates(p => ({ ...p, heureFin: e.target.value }))}
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#dc2626]/50 focus:ring-1 focus:ring-[#dc2626]/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Price Summary */}
                <div className="border-t border-white/[0.06] pt-4 mb-5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Prix / jour</span>
                    <span className="text-white font-medium">{vehicule.prix_jour} DH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40 flex items-center gap-1.5">
                      {IC.clock('w-3.5 h-3.5')}
                      Durée
                    </span>
                    <span className={`font-medium transition-all duration-300 ${duree ? 'text-white' : 'text-white/20'}`}>
                      {duree ? `${duree} jour${duree > 1 ? 's' : ''}` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-white/[0.06]">
                    <span className="text-white font-semibold">Total</span>
                    <span className={`text-2xl font-bold transition-all duration-300 ${total ? 'text-[#dc2626] scale-100' : 'text-white/20'}`}>
                      {total ? `${total} DH` : '—'}
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <button
                  onClick={handleReserver}
                  disabled={!hasDates}
                  className={`w-full font-semibold py-3.5 rounded-xl transition-all duration-300 mb-3 ${
                    hasDates
                      ? 'bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-lg shadow-[#dc2626]/20 hover:shadow-[#dc2626]/30'
                      : 'bg-white/[0.06] text-white/30 cursor-not-allowed'
                  }`}
                >
                  Réserver maintenant
                </button>
                {!hasDates && (
                  <p className="text-center text-white/25 text-xs mb-3">Sélectionnez vos dates pour réserver</p>
                )}

                <a
                  href={`https://wa.me/212681181813?text=Je suis intéressé par le ${vehicule.marque} ${vehicule.modele}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#1da851] text-white font-semibold py-3.5 rounded-xl transition-colors"
                >
                  {IC.whatsapp('w-5 h-5')}
                  Contacter par WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
