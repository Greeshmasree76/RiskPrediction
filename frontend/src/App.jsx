import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Analytics from "./pages/Analytics";
import Robson from "./pages/Robson";
import Settings from "./pages/Settings";
import ChatBox from "./components/ChatBox";

function App() {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleLogin = () => {
    localStorage.setItem("loggedIn", "true");
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <Login
        onLogin={handleLogin}
        language={language}
        setLanguage={handleLanguageChange}
      />
    );
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-blue-100">
        <Sidebar language={language} />

        <div className="flex-1">
          <Topbar
            language={language}
            setLanguage={handleLanguageChange}
            onLogout={handleLogout}
          />

          <main className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard language={language} />} />
              <Route
                path="/patients"
                element={<Patients language={language} />}
              />
              <Route
                path="/analytics"
                element={<Analytics language={language} />}
              />
              <Route path="/robson" element={<Robson language={language} />} />
              <Route
                path="/settings"
                element={<Settings language={language} />}
              />
            </Routes>
          </main>
        </div>

        <ChatBox language={language} />
      </div>
    </BrowserRouter>
  );
}

export default App;