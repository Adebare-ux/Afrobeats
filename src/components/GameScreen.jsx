import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { styles, ORANGE, WAVEFORM_FRAMES } from "../constants/theme";
import { PLAY_ICON, PAUSE_ICON, SKIP_ICON } from "./Icons";
import { LYRICS_DATA } from "../data/lyrics";
import ScoreBoard from "./ScoreBoard";
import ChatPanel from "./ChatPanel";

export default function GameScreen() {
  const {
    gameState,
    playerName,
    timeLeft,
    currentLyric,
    waveFrame,
    isPlaying,
    setIsPlaying,
    nextRound,
    submitted,
    userAnswer,
    setUserAnswer,
    submitAnswer,
    feedback,
    aiLoading,
    aiComment,
    isHost
  } = useContext(GameContext);

  const lyric = currentLyric;
  const bars = WAVEFORM_FRAMES[waveFrame];

  return (
    <div style={styles.content}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
          Round {(gameState.currentIdx % LYRICS_DATA.length) + 1} / {LYRICS_DATA.length}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: `3px solid ${timeLeft < 10 ? "#ef4444" : ORANGE}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: timeLeft < 10 ? "#ef4444" : ORANGE, transition: "all 0.3s" }}>
            {timeLeft}
          </div>
        </div>
        <div style={{ ...styles.badge }}>🏆 {gameState.scores[playerName] || 0} pts</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <div>
          <div style={{ ...styles.card, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{lyric.artist}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>{lyric.song} · {lyric.genre}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setIsPlaying(!isPlaying)} style={{ width: 40, height: 40, borderRadius: "50%", background: ORANGE, border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isPlaying ? <PAUSE_ICON /> : <PLAY_ICON />}
                </button>
                <button onClick={nextRound} style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <SKIP_ICON />
                </button>
              </div>
            </div>

            <div style={{ height: 56, display: "flex", alignItems: "center", gap: 3, padding: "0 4px", background: "rgba(0,0,0,0.3)", borderRadius: 10, marginBottom: 16 }}>
              {(isPlaying ? bars : Array(12).fill(4)).map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h * 3}px`, background: isPlaying ? ORANGE : "rgba(249,115,22,0.3)", borderRadius: 3, transition: "height 0.15s ease" }} />
              ))}
            </div>

            <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 8, letterSpacing: 1 }}>FINISH THE LYRIC</div>
              <div style={{ fontSize: 18, lineHeight: 1.6, fontWeight: 500 }}>
                {lyric.displayLyric}{" "}
                <span style={{ display: "inline-block", minWidth: 160, height: 24, background: "rgba(249,115,22,0.25)", borderRadius: 6, border: `1px dashed ${ORANGE}`, verticalAlign: "middle" }} />
              </div>
              <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>💡 Hint: {lyric.hint}</div>
            </div>

            {!submitted ? (
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type the missing lyrics..."
                  style={{ ...styles.input, flex: 1 }}
                  onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                />
                <button onClick={submitAnswer} style={{ ...styles.btn, whiteSpace: "nowrap" }}>Submit</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: feedback === "correct" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", border: `1px solid ${feedback === "correct" ? "#22c55e" : "#ef4444"}`, borderRadius: 12, padding: "14px 18px" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: feedback === "correct" ? "#22c55e" : "#ef4444", marginBottom: 4 }}>
                    {feedback === "correct" ? "✅ Correct! Sharp sharp!" : "❌ Not quite! E no be dat"}
                  </div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
                    Full lyric: <em>"{lyric.fullLine}"</em>
                  </div>
                </div>

                {(aiLoading || aiComment) && (
                  <div style={{ background: "rgba(249,115,22,0.1)", border: `1px solid rgba(249,115,22,0.3)`, borderRadius: 12, padding: "14px 18px" }}>
                    <div style={{ fontSize: 12, color: ORANGE, marginBottom: 6, letterSpacing: 1 }}>🤖 AI DJ COMMENT</div>
                    {aiLoading ? (
                      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Dj is cooking... 🎤</div>
                    ) : (
                      <div style={{ fontSize: 14, lineHeight: 1.6 }}>{aiComment}</div>
                    )}
                  </div>
                )}

                {isHost && (
                  <button onClick={nextRound} style={{ ...styles.btn, alignSelf: "flex-start" }}>
                    Next Round →
                  </button>
                )}
                {!isHost && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Waiting for host to continue...</div>}
              </div>
            )}
          </div>

          <ScoreBoard />
        </div>

        <div>
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
