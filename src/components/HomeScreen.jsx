import { useContext, useState } from "react";
import { GameContext } from "../context/GameContext";
import { styles, ORANGE } from "../constants/theme";

export default function HomeScreen() {
  const { setPlayerName, createRoom, joinRoom, roomCode } = useContext(GameContext);
  const [tab, setTab] = useState("create");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  return (
    <div style={{ ...styles.content, paddingTop: 40 }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🎵</div>
        <h1 style={{ fontSize: 38, fontWeight: 800, margin: "0 0 8px", letterSpacing: -1.5, background: `linear-gradient(135deg, #fff 30%, ${ORANGE})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Finish The Lyric
        </h1>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, margin: 0 }}>Afrobeats Edition 🇳🇬</p>
      </div>

      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 4 }}>
          {["create", "join"].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 9, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 14, background: tab === t ? ORANGE : "transparent", color: tab === t ? "#fff" : "rgba(255,255,255,0.6)", transition: "all 0.2s" }}>
              {t === "create" ? "Create Room" : "Join Room"}
            </button>
          ))}
        </div>

        <div style={{ ...styles.card }}>
          <label style={styles.label}>Your Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name..." style={{ ...styles.input, marginBottom: 16 }} onKeyDown={(e) => e.key === "Enter" && (tab === "create" ? (setPlayerName(name), createRoom(name)) : null)} />

          {tab === "join" && (
            <>
              <label style={styles.label}>Room Code</label>
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Enter room code..." style={{ ...styles.input, marginBottom: 16, letterSpacing: 3, fontWeight: 700 }} maxLength={6} />
            </>
          )}

          <button
            style={{ ...styles.btn, width: "100%" }}
            onClick={() => {
              if (!name.trim()) return;
              setPlayerName(name);
              if (tab === "create") createRoom(name);
              else {
                if (code !== roomCode) {
                  alert("Room not found!");
                  return;
                }
                joinRoom(name);
              }
            }}
          >
            {tab === "create" ? "🎉 Create Room" : "🔗 Join Room"}
          </button>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
              {tab === "create" ? "Start a new game and invite your friends" : "Enter a room code from a friend"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
