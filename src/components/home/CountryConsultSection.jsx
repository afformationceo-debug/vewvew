import { useUIStore } from '../../store/useUIStore';

const flags = ['🇺🇸', '🇯🇵', '🇨🇳', '🇹🇭', '🇸🇦', '🇰🇷', '🇬🇧', '🇦🇺'];

export default function CountryConsultSection() {
  const openConsultModal = useUIStore((s) => s.openConsultModal);

  return (
    <div
      onClick={() => openConsultModal()}
      className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
    >
      <span className="text-2xl">🌏</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">24/7 Multilingual Consult</p>
        <div className="flex items-center gap-1 mt-0.5">
          {flags.map((flag, i) => (
            <span key={i} className="text-sm">{flag}</span>
          ))}
        </div>
      </div>
      <button className="shrink-0 text-xs font-semibold text-primary-600 bg-white px-3 py-1.5 rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors">
        Chat &rarr;
      </button>
    </div>
  );
}
