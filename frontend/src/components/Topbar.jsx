import { translations } from "../utils/translations";

export default function Topbar({ language, setLanguage, onLogout }) {
  const t = translations[language];

  return (
    <header className="h-20 bg-white/80 backdrop-blur border-b border-white flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{t.appName}</h2>
        <p className="text-sm text-slate-500">{t.subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <input
          className="w-80 bg-slate-100 rounded-xl px-4 py-3 outline-none"
          placeholder={t.searchPatient}
        />

        <button
          onClick={() => setLanguage(language === "en" ? "te" : "en")}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold"
        >
          {language === "en" ? "తెలుగు" : "English"}
        </button>

        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold"
        >
          {t.logout}
        </button>

        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white flex items-center justify-center font-bold">
          DR
        </div>
      </div>
    </header>
  );
}