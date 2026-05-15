import { useState } from "react";
import { translations } from "../utils/translations";

export default function Login({ onLogin, language, setLanguage }) {
  const t = translations[language];

  const [email, setEmail] = useState("staff@safebirth.ai");
  const [password, setPassword] = useState("staff123");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "staff@safebirth.ai" && password === "staff123") {
      onLogin();
    } else {
      setError("Invalid login details");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-white shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-cyan-400 text-slate-950 flex items-center justify-center mx-auto text-2xl font-black">
            SB
          </div>

          <h1 className="text-3xl font-bold mt-4">{t.appName}</h1>
          <p className="text-cyan-100 mt-2">{t.loginTitle}</p>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setLanguage(language === "en" ? "te" : "en")}
            className="px-4 py-2 bg-white/20 rounded-xl"
          >
            {language === "en" ? "తెలుగు" : "English"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/20 outline-none placeholder:text-white/70"
          />

          <input
            type="password"
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/20 outline-none placeholder:text-white/70"
          />

          {error && <p className="text-red-300 text-sm">{error}</p>}

          <button className="w-full p-3 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300">
            {t.login}
          </button>
        </form>

        <p className="text-xs text-center mt-6 text-white/60">
          Demo login: staff@safebirth.ai / staff123
        </p>
      </div>
    </div>
  );
}