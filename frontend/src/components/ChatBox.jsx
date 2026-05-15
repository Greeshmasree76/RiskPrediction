import { useState } from "react";
import { translations } from "../utils/translations";

export default function ChatBox({ language }) {
  const t = translations[language];

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text:
        language === "te"
          ? "హాయ్! నేను Robson group మరియు risk score గురించి సహాయం చేస్తాను."
          : "Hi! I can help with Robson groups and risk score explanation.",
    },
  ]);

  const [input, setInput] = useState("");

  const getReply = (msg) => {
    const text = msg.toLowerCase();

    if (text.includes("group 5") || text.includes("previous")) {
      return language === "te"
        ? "Group 5 అంటే previous C-section ఉన్న term cephalic pregnancy. ఇది C-section risk ని పెంచుతుంది."
        : "Group 5 means previous C-section with term cephalic pregnancy. It increases C-section risk.";
    }

    if (text.includes("group 9") || text.includes("transverse")) {
      return language === "te"
        ? "Group 9 అంటే transverse లేదా oblique lie. సాధారణంగా C-section risk చాలా ఎక్కువగా ఉంటుంది."
        : "Group 9 means transverse or oblique lie. It usually has very high C-section risk.";
    }

    if (text.includes("risk") || text.includes("score")) {
      return language === "te"
        ? "Risk score Robson group + age + diabetes + hypertension + gestational age ఆధారంగా calculate అవుతుంది."
        : "Risk score is calculated using Robson group, age, diabetes, hypertension, and gestational age.";
    }

    if (text.includes("robson")) {
      return language === "te"
        ? "Robson criteria women ni 10 obstetric groups lo classify chestundi based on parity, previous CS, presentation, gestational age, fetal lie, and labour type."
        : "Robson criteria classifies women into 10 obstetric groups based on parity, previous CS, presentation, gestational age, fetal lie, and labour type.";
    }

    return language === "te"
      ? "Robson group, risk score, previous CS, presentation లేదా patient fields గురించి అడగండి."
      : "Ask me about Robson group, risk score, previous CS, presentation, or patient fields.";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      role: "user",
      text: input,
    };

    const botMsg = {
      role: "bot",
      text: getReply(input),
    };

    setMessages([...messages, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-cyan-500 text-white text-3xl shadow-2xl z-40"
      >
        🤖
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-3xl shadow-2xl z-40 overflow-hidden">
          <div className="bg-slate-950 text-white p-4 font-bold">
            {t.aiAssistant}
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl max-w-[85%] ${
                  m.role === "user"
                    ? "bg-cyan-100 ml-auto"
                    : "bg-slate-100 mr-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.askMe}
              className="flex-1 bg-slate-100 p-3 rounded-xl outline-none"
            />

            <button
              type="button"
              onClick={sendMessage}
              className="bg-cyan-500 text-white px-4 rounded-xl"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}