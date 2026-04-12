import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { styles, ORANGE } from "../constants/theme";
import ChatPanel from "./ChatPanel";
import { LYRICS_DATA } from "../data/lyrics";

export default function LobbyScreen() {
  const { roomCode, players, playerName, isHost, startGame } = useContext(GameContext);

  return (
    <div style={styles.content}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ ...styles.badge, display: "inline-block", fontSize: 16, padding: "8px 20px", letterSpacing: 4, fontWeight: 700, marginBottom: 12 }}>
          {roomCode}
        </div>
        <p style={{ color: "rgba(255,255,255,0.5)", margin: 0, fontSize: 14 }}>Share this code with your friends</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={styles.card}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Players ({players.length})</div>
          {players.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < players.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: ORANGE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                {p.name[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name} {p.name === playerName ? "(you)" : ""}</div>
                {p.isHost && <div style={{ fontSize: 11, color: ORANGE }}>Host</div>}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Game Info</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 2 }}>
            <div>🎵 {LYRICS_DATA.length} rounds</div>
            <div>⏱ 30 seconds per round</div>
            <div>🏆 Points for speed</div>
            <div>🤖 AI judges your lyrics</div>
            <div>💬 Live chat enabled</div>
          </div>
          {isHost && (
            <button style={{ ...styles.btn, width: "100%", marginTop: 16 }} onClick={startGame}>
              🚀 Start Game
            </button>
          )}
          {!isHost && <div style={{ marginTop: 16, textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Waiting for host to start...</div>}
        </div>
      </div>

      <ChatPanel compact />
    </div>
  );
}
