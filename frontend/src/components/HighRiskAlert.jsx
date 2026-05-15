export default function HighRiskAlert({ patient, onClose }) {
  if (!patient) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-t-8 border-red-500">
        <h2 className="text-3xl font-bold text-red-600 mb-3">
          🚨 High Risk Alert
        </h2>

        <p className="text-slate-700 mb-4">
          Patient <b>{patient.patientName}</b> has been classified as high
          C-section risk.
        </p>

        <div className="bg-red-50 p-4 rounded-xl text-red-700 space-y-2">
          <p>
            <b>Robson Group:</b> Group {patient.robsonGroup}
          </p>

          <p>
            <b>Risk Score:</b> {patient.riskScore}
          </p>

          <p>
            <b>Outcome:</b> {patient.outcome}
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-500 text-white p-3 rounded-xl font-bold"
        >
          Acknowledge Alert
        </button>
      </div>
    </div>
  );
}