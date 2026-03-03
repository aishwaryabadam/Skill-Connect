import { useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 I’m SkillConnect Assistant. Ask me anything!" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");

    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();

    setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
  };

  return (
    <div className="fixed left-6 bottom-6 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-cyan-500 text-black font-bold"
      >
        💬
      </button>

      {open && (
        <div className="mt-4 w-80 h-96 bg-black border border-cyan-400 rounded-xl flex flex-col">
          <div className="p-3 text-cyan-400 font-bold border-b">
            SkillConnect Bot
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] ${
                  m.from === "user"
                    ? "ml-auto bg-cyan-500 text-black"
                    : "bg-gray-800 text-white"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="p-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-gray-900 text-white p-2 rounded"
              placeholder="Ask about SkillConnect..."
            />
            <button
              onClick={sendMessage}
              className="bg-pink-500 px-3 rounded font-bold"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}