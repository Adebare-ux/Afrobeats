import { createContext, useState, useEffect, useRef } from "react";
import { LYRICS_DATA } from "../data/lyrics";
import { useSharedState, generateRoomCode, similarity } from "../utils/helpers";
import { WAVEFORM_FRAMES } from "../constants/theme";

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [screen, setScreen] = useState("home");
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useSharedState("afrobeat_room", "");
  const [players, setPlayers] = useSharedState("afrobeat_players", []);
  const [gameState, setGameState] = useSharedState("afrobeat_game", {
    started: false,
    currentIdx: 0,
    scores: {},
    revealed: false,
    timeLeft: 30,
  });
  const [chatMessages, setChatMessages] = useSharedState("afrobeat_chat", []);
  
  const [chatInput, setChatInput] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiComment, setAiComment] = useState(null);
  const [waveFrame, setWaveFrame] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [joined, setJoined] = useState(false);

  const chatEndRef = useRef(null);
  const timerRef = useRef(null);
  const waveRef = useRef(null);

  const currentLyric = LYRICS_DATA[gameState.currentIdx % LYRICS_DATA.length];
  const isHost = players.find((p) => p.name === playerName && p.isHost);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (isPlaying) {
      waveRef.current = setInterval(() => {
        setWaveFrame((f) => (f + 1) % WAVEFORM_FRAMES.length);
      }, 180);
    } else {
      clearInterval(waveRef.current);
    }
    return () => clearInterval(waveRef.current);
  }, [isPlaying]);

  useEffect(() => {
    if (gameState.started && !gameState.revealed) {
      setTimeLeft(30);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setGameState((gs) => ({ ...gs, revealed: true }));
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState.started, gameState.currentIdx, gameState.revealed, setGameState]);

  useEffect(() => {
    if (gameState.started && screen !== "game") setScreen("game");
  }, [gameState.started, screen]);

  function createRoom(nameOverride) {
    const pName = nameOverride || playerName;
    if (!pName.trim()) return;
    const code = generateRoomCode();
    setRoomCode(code);
    setPlayers([{ name: pName, score: 0, isHost: true }]);
    setGameState({ started: false, currentIdx: 0, scores: { [pName]: 0 }, revealed: false });
    setChatMessages([]);
    setScreen("lobby");
    setJoined(true);
  }

  function joinRoom(nameOverride) {
    const pName = nameOverride || playerName;
    if (!pName.trim()) return;
    const existing = players.find((p) => p.name === pName);
    if (!existing) {
      setPlayers((prev) => [...prev, { name: pName, score: 0, isHost: false }]);
      setGameState((gs) => ({
        ...gs,
        scores: { ...gs.scores, [pName]: 0 },
      }));
    }
    setScreen("lobby");
    setJoined(true);
  }

  function startGame() {
    setGameState((gs) => ({ ...gs, started: true, currentIdx: 0, revealed: false }));
    setUserAnswer("");
    setFeedback(null);
    setSubmitted(false);
    setAiComment(null);
    setScreen("game");
  }

  async function fetchAiComment(isCorrect, ans) {
    setAiLoading(true);
    setAiComment(null);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 120,
          system:
            "You are an Afrobeats DJ and music expert from Lagos, Nigeria. You speak with energy, use Naija slang (e.g. 'omo', 'e don do', 'sharp sharp', 'na wa o'). Keep it short and hype. 1-2 sentences max.",
          messages: [
            {
              role: "user",
              content: `The lyric was "${currentLyric.displayLyric}" from ${currentLyric.artist}'s "${currentLyric.song}". The correct answer is "${currentLyric.answer}". The player answered "${ans}" which was ${isCorrect ? "CORRECT" : "WRONG"}. Give a short reaction and announce the correct answer.`,
            },
          ],
        }),
      });
      const data = await resp.json();
      const text = data.content?.find((c) => c.type === "text")?.text || "Omo, nice try sha!";
      setAiComment(text);
    } catch {
      setAiComment(isCorrect ? "Omo you sharp o! That's correct! 🔥" : "Nah fam, that's not it. Better luck next round!");
    }
    setAiLoading(false);
  }

  function submitAnswer() {
    if (!userAnswer.trim() || submitted) return;
    const correct = currentLyric.answer.toLowerCase();
    const mine = userAnswer.toLowerCase().trim();
    const isCorrect = mine.includes(correct) || correct.includes(mine) || similarity(mine, correct) > 0.6;
    setFeedback(isCorrect ? "correct" : "wrong");
    setSubmitted(true);
    if (isCorrect) {
      const pts = Math.max(5, Math.ceil(timeLeft / 3));
      setGameState((gs) => ({
        ...gs,
        scores: { ...gs.scores, [playerName]: (gs.scores[playerName] || 0) + pts },
      }));
      setPlayers((prev) =>
        prev.map((p) => (p.name === playerName ? { ...p, score: (p.score || 0) + pts } : p))
      );
      addChat(`🎯 ${playerName} got it right! +${pts} pts`, "System");
    } else {
      addChat(`❌ ${playerName} missed this one`, "System");
    }
    fetchAiComment(isCorrect, mine);
  }

  function nextRound() {
    setGameState((gs) => ({
      ...gs,
      currentIdx: gs.currentIdx + 1,
      revealed: false,
    }));
    setUserAnswer("");
    setFeedback(null);
    setSubmitted(false);
    setAiComment(null);
    setIsPlaying(false);
  }

  function addChat(msg, sender) {
    const newMsg = {
      id: Date.now(),
      sender: sender || playerName,
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      system: sender === "System",
    };
    setChatMessages((prev) => [...prev.slice(-50), newMsg]);
  }

  function sendChat() {
    if (!chatInput.trim()) return;
    addChat(chatInput, playerName);
    setChatInput("");
  }

  const value = {
    screen, setScreen,
    playerName, setPlayerName,
    roomCode, setRoomCode,
    players, setPlayers,
    gameState, setGameState,
    chatMessages, setChatMessages,
    chatInput, setChatInput,
    userAnswer, setUserAnswer,
    feedback, setFeedback,
    isPlaying, setIsPlaying,
    aiLoading, setAiLoading,
    aiComment, setAiComment,
    waveFrame, setWaveFrame,
    submitted, setSubmitted,
    timeLeft, setTimeLeft,
    joined, setJoined,
    chatEndRef, timerRef, waveRef,
    currentLyric,
    isHost,
    createRoom, joinRoom, startGame,
    submitAnswer, nextRound, addChat, sendChat
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
