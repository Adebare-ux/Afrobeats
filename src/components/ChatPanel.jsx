import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { styles, ORANGE } from "../constants/theme";

export default function ChatPanel({ compact } = {}) {
  const { chatMessages, playerName, chatInput, setChatInput, sendChat, chatEndRef } = useContext(GameContext);

  return (
    <div style={{ ...styles.card, height: compact ? "auto" : 400, display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: 1, textTransform: "uppercase", flexShrink: 0 }}>
        💬 Live Chat
      </div>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: 12, maxHeight: compact ? 160 : "none" }}>
        {chatMessages.length === 0 && (
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textAlign: "center", paddingTop: 20 }}>No messages yet...</div>
        )}
        {chatMessages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: 8 }}>
            {msg.system ? (
              <div style={{ fontSize: 12, color: ORANGE, textAlign: "center", padding: "4px 0" }}>{msg.text}</div>
            ) : (
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: msg.sender === playerName ? ORANGE : "rgba(255,255,255,0.7)" }}>{msg.sender}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: 6 }}>{msg.time}</span>
                <div style={{ fontSize: 14, marginTop: 2, color: "rgba(255,255,255,0.85)", wordBreak: "break-word" }}>{msg.text}</div>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Say something..."
          style={{ ...styles.input, flex: 1, padding: "9px 12px", fontSize: 14 }}
          onKeyDown={(e) => e.key === "Enter" && sendChat()}
        />
        <button onClick={sendChat} style={{ ...styles.btn, padding: "9px 16px", fontSize: 14 }}>
          →
        </button>
      </div>
    </div>
  );
}
