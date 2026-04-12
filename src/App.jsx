import { useContext } from "react";
import { GameProvider, GameContext } from "./context/GameContext";
import { NOTE_ICON } from "./components/Icons";
import { styles } from "./constants/theme";

import HomeScreen from "./components/HomeScreen";
import LobbyScreen from "./components/LobbyScreen";
import GameScreen from "./components/GameScreen";

function AppContent() {
  const { screen, roomCode, playerName } = useContext(GameContext);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={styles.app}>
        <div style={styles.grain} />
        {screen !== "home" && (
          <div style={{ ...styles.content, paddingBottom: 0 }}>
            <div style={styles.header}>
              <div style={styles.logo}><NOTE_ICON /></div>
              <span style={styles.title}>FinishDaLyric</span>
              <span style={{ ...styles.badge, marginLeft: "auto" }}>🇳🇬 Afrobeats</span>
              {roomCode && screen !== "home" && (
                <span style={{ ...styles.badge, letterSpacing: 2 }}>#{roomCode}</span>
              )}
              {playerName && <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{playerName}</span>}
            </div>
          </div>
        )}

        {screen === "home" && <HomeScreen />}
        {screen === "lobby" && <LobbyScreen />}
        {screen === "game" && <GameScreen />}
      </div>
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
