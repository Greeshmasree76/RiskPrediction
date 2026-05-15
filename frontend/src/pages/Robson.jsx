export default function Robson() {
  const groups = [
    [
      1,
      "Nulliparous, single cephalic, term, spontaneous labour",
      "Usually lower C-section risk",
    ],
    [
      2,
      "Nulliparous, single cephalic, term, induced labour or pre-labour CS",
      "Moderate risk due to induction/pre-labour CS",
    ],
    [
      3,
      "Multiparous without previous CS, single cephalic, term, spontaneous labour",
      "Usually lower risk",
    ],
    [
      4,
      "Multiparous without previous CS, single cephalic, term, induced/pre-labour CS",
      "Moderate risk",
    ],
    [
      5,
      "Previous CS, single cephalic, term",
      "High contribution to repeat C-section rates",
    ],
    [6, "Nulliparous breech", "Higher C-section risk"],
    [7, "Multiparous breech", "Higher C-section risk"],
    [8, "Multiple pregnancy", "Moderate to high risk"],
    [9, "Transverse or oblique lie", "Very high C-section risk"],
    [10, "Single cephalic, preterm", "Risk depends on clinical condition"],
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">
        Modified Robson Criteria Explanation
      </h1>

      <p className="text-gray-500 mb-8">
        Robson classification groups pregnant women into 10 obstetric groups
        based on parity, previous C-section, fetal presentation, number of
        fetuses, gestational age, and labour onset.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Group</th>
              <th className="p-3 text-left">Criteria</th>
              <th className="p-3 text-left">Risk Meaning</th>
            </tr>
          </thead>

          <tbody>
            {groups.map(([group, criteria, meaning]) => (
              <tr key={group} className="border-b hover:bg-slate-50">
                <td className="p-3 font-bold text-cyan-600">Group {group}</td>
                <td className="p-3">{criteria}</td>
                <td className="p-3">{meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 bg-cyan-50 p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-2">How risk prediction works</h2>
        <p className="text-slate-700">
          The system first assigns a Modified Robson Group. Then it calculates
          a risk score using Robson group, previous CS count, age, diabetes,
          hypertension, gestational age, and presentation. The final output is
          Normal, Moderate, or High C-section risk.
        </p>
      </div>
    </div>
  );
}