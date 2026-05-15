import { NavLink } from "react-router-dom";
import { translations } from "../utils/translations";

export default function Sidebar({ language }) {
  const t = translations[language];

  const links = [
    { name: t.dashboard, path: "/", icon: "📊" },
    { name: t.patients, path: "/patients", icon: "👥" },
    { name: t.analytics, path: "/analytics", icon: "📈" },
    { name: t.robson, path: "/robson", icon: "📘" },
    { name: t.settings, path: "/settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-72 min-h-screen bg-slate-950 text-white p-6 sticky top-0">
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 font-black text-xl">
            SB
          </div>

          <div>
            <h1 className="text-2xl font-bold text-cyan-300">{t.appName}</h1>
            <p className="text-xs text-slate-400">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <nav className="space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-4 rounded-2xl transition ${
                isActive
                  ? "bg-cyan-400 text-slate-950 font-bold shadow-lg"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <span>{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-10 p-4 rounded-3xl bg-slate-900 border border-slate-800">
        <p className="text-sm text-slate-400">System Mode</p>
        <p className="font-bold text-cyan-300 mt-1">Robson + Risk Scoring</p>
      </div>
    </aside>
  );
}