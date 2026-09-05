export default function Services() {
  const services = [
    { icon: '🚗', title: 'Location courte durée', desc: 'Louez pour un jour, un week-end ou une semaine. Idéal pour des trajets ponctuels.' },
    { icon: '📅', title: 'Location longue durée', desc: 'Contrats mensuels avantageux pour les particuliers et les entreprises.' },
    { icon: '✈️', title: 'Transfert aéroport', desc: 'Service de navette entre l\'aéroport de Tanger et votre destination.' },
    { icon: '🔧', title: 'Véhicule de remplacement', desc: 'En cas de panne, nous vous fournissons un véhicule de courtoisie.' },
    { icon: '👶', title: 'Sièges bébé', desc: 'Sièges homologués disponibles gratuitement sur demande.' },
    { icon: '📱', title: 'Réservation en ligne', desc: 'Réservez en quelques clics depuis votre téléphone ou ordinateur.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
      <h1 className="text-3xl font-bold text-white mb-2">Nos services</h1>
      <p className="text-gray-400 mb-8">Des services complets pour une expérience sans stress.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#dc2626] transition">
            <div className="text-3xl mb-3">{s.icon}</div>
            <h3 className="text-white font-semibold mb-2">{s.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
