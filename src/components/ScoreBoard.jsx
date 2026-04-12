import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { styles, ORANGE } from "../constants/theme";

export default function ScoreBoard() {
  const { players, playerName } = useContext(GameContext);
  const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div style={styles.card}>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Leaderboard</div>
      {sorted.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < sorted.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
          <div style={{ fontSize: 16, width: 24, textAlign: "center" }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}</div>
          <div style={{ flex: 1, fontSize: 14, fontWeight: p.name === playerName ? 700 : 400, color: p.name === playerName ? ORANGE : "#fff" }}>{p.name}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: ORANGE }}>{p.score || 0} pts</div>
        </div>
      ))}
    </div>
  );
}
