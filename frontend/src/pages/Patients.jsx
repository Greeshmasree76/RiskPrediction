import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { PATIENTS_API } from "../utils/api";
import { translations } from "../utils/translations";

export default function Patients({ language }) {
  const t = translations[language];

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  useEffect(() => {
    axios
      .get(PATIENTS_API)
      .then((res) => setPatients(res.data))
      .catch((err) => console.log(err));
  }, []);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = p.patientName
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesRisk =
      riskFilter === "All" ? true : p.outcome === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const downloadPatientPDF = (p) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("SafeBirth AI - Patient Risk Report", 14, 20);

    doc.setFontSize(11);
    doc.text(`Patient Name: ${p.patientName}`, 14, 35);
    doc.text(`Age: ${p.age}`, 14, 43);
    doc.text(`Gestational Age: ${p.gestationalAge}`, 14, 51);
    doc.text(`Robson Group: ${p.robsonGroup || "Not classified"}`, 14, 59);
    doc.text(`Risk Score: ${p.riskScore ?? "-"}`, 14, 67);
    doc.text(`Outcome: ${p.outcome}`, 14, 75);

    autoTable(doc, {
      startY: 88,
      head: [["Field", "Value"]],
      body: [
        ["Number of Fetuses", p.numberOfFetuses || "-"],
        ["Fetal Lie", p.fetalLie || "-"],
        ["Presentation", p.presentation || "-"],
        ["Labour Type", p.labourType || "-"],
        ["Delivery Timing", p.deliveryTiming || "-"],
        ["Robson Description", p.robsonDescription || "-"],
      ],
    });

    doc.save(`${p.patientName}_Risk_Report.pdf`);
  };

  const downloadAllPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("SafeBirth AI - Patient Records Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Name", "Age", "GA", "Robson", "Score", "Outcome"]],
      body: filteredPatients.map((p) => [
        p.patientName,
        p.age,
        p.gestationalAge,
        p.robsonGroup ? `Group ${p.robsonGroup}` : "-",
        p.riskScore ?? "-",
        p.outcome,
      ]),
    });

    doc.save("SafeBirth_All_Patient_Records.pdf");
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {t.patientRecords}
          </h1>

          <p className="text-gray-500">
            Robson group, risk score, and delivery risk prediction records.
          </p>
        </div>

        <button
          onClick={downloadAllPDF}
          className="bg-slate-950 text-white px-5 py-3 rounded-xl font-bold"
        >
          {t.downloadAllPDF}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          placeholder={t.searchPatient}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-100 p-3 rounded-xl outline-none"
        />

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="bg-slate-100 p-3 rounded-xl outline-none"
        >
          <option value="All">{t.all}</option>
          <option value="High C-Section Risk">High C-Section Risk</option>
          <option value="Moderate C-Section Risk">
            Moderate C-Section Risk
          </option>
          <option value="Normal Delivery Likely">Normal Delivery Likely</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Age</th>
              <th className="p-3 text-left">GA</th>
              <th className="p-3 text-left">Robson</th>
              <th className="p-3 text-left">Score</th>
              <th className="p-3 text-left">Outcome</th>
              <th className="p-3 text-left">PDF</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.map((p) => (
              <tr key={p._id} className="border-b hover:bg-slate-50">
                <td className="p-3">{p.patientName}</td>
                <td className="p-3">{p.age}</td>
                <td className="p-3">{p.gestationalAge}</td>
                <td className="p-3 font-bold text-cyan-600">
                  {p.robsonGroup ? `Group ${p.robsonGroup}` : "-"}
                </td>
                <td className="p-3">{p.riskScore ?? "-"}</td>
                <td
                  className={`p-3 font-bold ${
                    p.outcome === "High C-Section Risk"
                      ? "text-red-500"
                      : p.outcome === "Moderate C-Section Risk"
                      ? "text-yellow-600"
                      : "text-emerald-600"
                  }`}
                >
                  {p.outcome}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => downloadPatientPDF(p)}
                    className="bg-cyan-500 text-white px-3 py-2 rounded-lg"
                  >
                    {t.downloadPDF}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}