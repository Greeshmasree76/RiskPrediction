import { translations } from "../utils/translations";

export default function DashboardCards({ stats, language }) {
  const t = translations[language];

  const cards = [
    {
      title: t.totalPatients,
      value: stats.total,
      subtitle: "Registered Cases",
      gradient: "from-cyan-500 to-blue-600",
      icon: "👥",
    },
    {
      title: t.highRisk,
      value: stats.highRisk,
      subtitle: "Critical Cases",
      gradient: "from-red-500 to-pink-600",
      icon: "🚨",
    },
    {
      title: t.moderateRisk,
      value: stats.moderate,
      subtitle: "Needs Monitoring",
      gradient: "from-yellow-400 to-orange-500",
      icon: "⚠️",
    },
    {
      title: t.normal,
      value: stats.normal,
      subtitle: "Stable Cases",
      gradient: "from-emerald-500 to-teal-600",
      icon: "✅",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`bg-gradient-to-br ${card.gradient} rounded-3xl p-6 text-white shadow-xl hover:scale-[1.02] transition`}
        >
          <div className="flex justify-between items-center">
            <p className="text-sm opacity-90">{card.title}</p>
            <span className="text-3xl">{card.icon}</span>
          </div>

          <h2 className="text-4xl font-bold mt-3">{card.value || 0}</h2>

          <p className="mt-4 text-sm opacity-90">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}