export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] border-t border-[#2a2a2a] py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#dc2626]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          06 81 18 18 13 / 06 67 51 14 10
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Branes 1, Lot 583N, 01 Rue 50 RDC - Tanger
        </div>
        <div className="text-gray-500">
          © {new Date().getFullYear()} FIRAS BKA CAR. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
