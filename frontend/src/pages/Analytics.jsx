import { useEffect, useState } from "react";
import axios from "axios";

import { PATIENTS_API } from "../utils/api";
import Charts from "../components/Charts";

export default function Analytics() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios
      .get(PATIENTS_API)
      .then((res) => setPatients(res.data))
      .catch((err) => console.log(err));
  }, []);

  const stats = {
    total: patients.length,
    highRisk: patients.filter((p) => p.outcome === "High C-Section Risk")
      .length,
    moderate: patients.filter((p) => p.outcome === "Moderate C-Section Risk")
      .length,
    normal: patients.filter((p) => p.outcome === "Normal Delivery Likely")
      .length,
  };

  const groupCounts = {};

  patients.forEach((p) => {
    const group = p.robsonGroup ? `Group ${p.robsonGroup}` : "Unclassified";
    groupCounts[group] = (groupCounts[group] || 0) + 1;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-slate-800">
        Group-wise Analytics
      </h1>

      <Charts stats={stats} />

      <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6">Robson Group Distribution</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(groupCounts).map(([group, count]) => (
            <div key={group} className="p-5 bg-slate-50 rounded-2xl">
              <h3 className="font-bold text-cyan-600">{group}</h3>
              <p className="text-3xl font-black mt-2">{count}</p>
              <p className="text-sm text-slate-500">patients</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
        <h2 className="text-2xl font-bold mb-4">Risk Score Explanation</h2>

        <div className="space-y-3 text-slate-700">
          <p>
            <b>0–3:</b> Normal Delivery Likely
          </p>
          <p>
            <b>4–6:</b> Moderate C-Section Risk
          </p>
          <p>
            <b>7+:</b> High C-Section Risk
          </p>
          <p className="text-sm text-slate-500">
            Risk score is calculated using Modified Robson Group, previous
            C-section history, fetal presentation, age, gestational age,
            diabetes, and hypertension.
          </p>
        </div>
      </div>
    </div>
  );
}