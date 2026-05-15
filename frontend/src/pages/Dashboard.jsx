import { useEffect, useState } from "react";
import axios from "axios";

import { PATIENTS_API } from "../utils/api";
import { translations } from "../utils/translations";

import DashboardCards from "../components/DashboardCards";
import Charts from "../components/Charts";
import HighRiskAlert from "../components/HighRiskAlert";

export default function Dashboard({ language }) {
  const t = translations[language];

  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    weight: "",
    height: "",
    gravida: "",
    parity: "",
    previousLSCS: false,
    previousCSCount: 0,
    gestationalAge: "",
    numberOfFetuses: "",
    fetalLie: "",
    presentation: "",
    labourType: "",
    deliveryTiming: "",
    diabetes: false,
    hypertension: false,
  });

  const [patients, setPatients] = useState([]);
  const [result, setResult] = useState(null);
  const [alertPatient, setAlertPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  const stats = {
    total: patients.length,
    highRisk: patients.filter((p) => p.outcome === "High C-Section Risk")
      .length,
    moderate: patients.filter((p) => p.outcome === "Moderate C-Section Risk")
      .length,
    normal: patients.filter((p) => p.outcome === "Normal Delivery Likely")
      .length,
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(PATIENTS_API);
      setPatients(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      patientName: "",
      age: "",
      weight: "",
      height: "",
      gravida: "",
      parity: "",
      previousLSCS: false,
      previousCSCount: 0,
      gestationalAge: "",
      numberOfFetuses: "",
      fetalLie: "",
      presentation: "",
      labourType: "",
      deliveryTiming: "",
      diabetes: false,
      hypertension: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(PATIENTS_API, formData);

      setResult(res.data);

      if (res.data.outcome === "High C-Section Risk") {
        setAlertPatient(res.data);
      }

      await fetchPatients();
      resetForm();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div>
      <HighRiskAlert
        patient={alertPatient}
        onClose={() => setAlertPatient(null)}
      />

      <h1 className="text-4xl font-bold text-slate-800">{t.welcome}</h1>

      <p className="text-gray-500 mb-8">{t.welcomeSub}</p>

      <DashboardCards stats={stats} language={language} />

      <Charts stats={stats} />

      <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">
          {t.newPrediction}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {[
            ["patientName", t.patientName, "text"],
            ["age", t.age, "number"],
            ["weight", t.weight, "number"],
            ["height", t.height, "number"],
            ["gravida", t.gravida, "number"],
            ["parity", t.parity, "number"],
            ["previousCSCount", t.previousCSCount, "number"],
            ["gestationalAge", t.gestationalAge, "number"],
          ].map(([name, placeholder, type]) => (
            <input
              key={name}
              name={name}
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              className="border bg-slate-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-400"
              required={name !== "previousCSCount"}
            />
          ))}

          <select
            name="numberOfFetuses"
            value={formData.numberOfFetuses}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl"
            required
          >
            <option value="">{t.numberOfFetuses}</option>
            <option value="Single">Single</option>
            <option value="Multiple">Multiple</option>
          </select>

          <select
            name="fetalLie"
            value={formData.fetalLie}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl"
            required
          >
            <option value="">{t.fetalLie}</option>
            <option value="Longitudinal">Longitudinal</option>
            <option value="Transverse">Transverse</option>
            <option value="Oblique">Oblique</option>
          </select>

          <select
            name="presentation"
            value={formData.presentation}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl"
            required
          >
            <option value="">{t.presentation}</option>
            <option value="Cephalic">Cephalic</option>
            <option value="Breech">Breech</option>
            <option value="Transverse">Transverse</option>
            <option value="Oblique">Oblique</option>
          </select>

          <select
            name="labourType"
            value={formData.labourType}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl"
            required
          >
            <option value="">{t.labourType}</option>
            <option value="Spontaneous">Spontaneous</option>
            <option value="Induced">Induced</option>
            <option value="No Labour">No Labour</option>
          </select>

          <select
            name="deliveryTiming"
            value={formData.deliveryTiming}
            onChange={handleChange}
            className="border bg-slate-50 p-3 rounded-xl"
            required
          >
            <option value="">{t.deliveryTiming}</option>
            <option value="In Labour">In Labour</option>
            <option value="Pre Labour CS">Pre Labour CS</option>
          </select>

          {[
            ["previousLSCS", t.previousLSCS],
            ["diabetes", t.diabetes],
            ["hypertension", t.hypertension],
          ].map(([name, label]) => (
            <label
              key={name}
              className="flex gap-2 items-center bg-slate-50 p-3 rounded-xl"
            >
              <input
                type="checkbox"
                name={name}
                checked={formData[name]}
                onChange={handleChange}
              />
              {label}
            </label>
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`p-3 rounded-xl text-white font-bold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.01]"
            }`}
          >
            {loading ? t.predicting : t.predict}
          </button>
        </form>

        {result && (
          <div
            className={`mt-6 p-6 rounded-2xl text-center ${
              result.outcome === "High C-Section Risk"
                ? "bg-red-100 text-red-700"
                : result.outcome === "Moderate C-Section Risk"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            <h2 className="text-2xl font-bold">{t.predictionResult}</h2>

            <p className="text-lg mt-2">
              {t.robsonGroup}:{" "}
              <span className="font-bold">Group {result.robsonGroup}</span>
            </p>

            <p className="text-sm mt-2">{result.robsonDescription}</p>

            <p className="text-lg mt-2">
              {t.riskScore}: <b>{result.riskScore}</b>
            </p>

            <p className="text-xl mt-2 font-bold">{result.outcome}</p>
          </div>
        )}
      </div>
    </div>
  );
}