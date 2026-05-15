import { translations } from "../utils/translations";

export default function Settings({ language }) {
  const t = translations[language];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">
        {t.settings}
      </h1>

      <div className="space-y-4">
        <div className="p-5 bg-slate-50 rounded-2xl">
          <h2 className="font-bold">Hospital System</h2>
          <p>SafeBirth AI Dashboard</p>
        </div>

        <div className="p-5 bg-slate-50 rounded-2xl">
          <h2 className="font-bold">Prediction Mode</h2>
          <p>Modified Robson Criteria + Rule-Based Risk Scoring</p>
        </div>

        <div className="p-5 bg-slate-50 rounded-2xl">
          <h2 className="font-bold">Next Upgrade</h2>
          <p>Real hospital dataset + ML model training</p>
        </div>

        <div className="p-5 bg-red-50 rounded-2xl text-red-700">
          <h2 className="font-bold">Clinical Disclaimer</h2>
          <p>
            This prototype is for academic and decision-support demonstration.
            It is not a replacement for doctor judgment.
          </p>
        </div>
      </div>
    </div>
  );
}