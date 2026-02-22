import { View, Text, StyleSheet, Pressable, ActivityIndicator, Dimensions, ScrollView, TextInput, Image } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BottomNav from "../bottomnav";
import { useAppStore } from "../store/useAppStore";
import Svg, { Circle } from 'react-native-svg';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get("window");

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  // Global Store
  const { user, activeTasks, recentSessions, addSession } = useAppStore();

  // New Pomodoro states
  const [selectedDuration, setSelectedDuration] = useState(25); // Default 25 mins

  // Timer states
  const [showCelebration, setShowCelebration] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0); // in seconds
  const [focusProgress, setFocusProgress] = useState(1); // 1 = full, 0 = empty
  const [sessionDuration, setSessionDuration] = useState(0); // store total duration

  // Search & Notifications
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  const router = useRouter();

  // ---- DUMMY BACKEND ----
  const mockBackend = {
    startSession: async (duration) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const endTime = new Date(Date.now() + duration * 60 * 1000);
          resolve({ endTime: endTime.toISOString(), durationSeconds: duration * 60 });
        }, 1000);
      });
    }
  };
  // ------------------------

  const startSession = async () => {
    setLoading(true);
    setShowCelebration(false);
    try {
      const data = await mockBackend.startSession(selectedDuration);
      setSession(data);
      setSessionTimeLeft(data.durationSeconds);
      setSessionDuration(data.durationSeconds);
      setFocusProgress(1); // reset circle
    } catch (err) {
      console.error("Error starting session", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Check for approaching deadlines (Dummy logic simulation)
  useEffect(() => {
    // In a real app, this would fetch from global state or AsyncStorage
    // Simulating an active task deadline approaching:
    const checkDeadlines = () => {
      const now = new Date();
      const mockDeadline = new Date(now.getTime() + 15 * 60000); // 15 mins from now

      // If we haven't shown a toast yet, simulate detecting a 15-min warning
      if (!toastMessage) {
        setToastMessage(`⚠️ Task "Client Presentation" is due in 15 minutes!`);

        // Auto-hide toast after 5 seconds
        setTimeout(() => {
          setToastMessage(null);
        }, 5000);
      }
    };

    // Run check once on mount for demo
    const timer = setTimeout(checkDeadlines, 2000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Circle logic for current session
  useEffect(() => {
    let focusInterval;
    if (session && sessionTimeLeft > 0 && !showCelebration) {
      focusInterval = setInterval(() => {
        setSessionTimeLeft((prevLeft) => {
          const newLeft = prevLeft - 1;
          setFocusProgress(newLeft / sessionDuration);

          if (newLeft <= 0) {
            clearInterval(focusInterval);
            setSession(null);
            setShowCelebration(true); // 🎉 Trigger the finish animation!
            return 0;
          }
          return newLeft;
        });
      }, 1000);
    }
    return () => clearInterval(focusInterval);
  }, [session, sessionTimeLeft, showCelebration, sessionDuration]);

  const handleFinishSession = () => {
    setShowCelebration(false);
    addSession({
      id: Date.now().toString(),
      title: `${sessionDuration / 60} Min Focus Session`,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: "time-outline"
    });
  };



  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // 🔍 Calculate Dynamic Stats
  const totalFocusedMinutes = recentSessions.reduce((acc, curr) => acc + (parseInt(curr.title) || 0), 0);
  const totalFocusedHours = (totalFocusedMinutes / 60).toFixed(1);
  const totalTasksDone = useAppStore(state => state.completedTasks.length);

  // 🔍 Check Search
  const filteredSessions = recentSessions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredTasks = activeTasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const isSearchingContext = searchQuery.length > 0;

  return (
    <View style={styles.mainWrapper}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Greeting Header */}
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.username}>👋 {getGreeting()}, {user.name.split(' ')[0]}</Text>
            <Text style={styles.subtitle}>Let’s crush your goals today!</Text>
          </View>
          <Pressable onPress={() => router.push('/profile')} style={{ overflow: "hidden", width: 50, height: 50, borderRadius: 25, backgroundColor: "#FFE5E5" }}>
            <Image source={{ uri: user.avatar }} style={{ width: "100%", height: "100%" }} />
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="gray" style={{ marginLeft: 15 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks, sessions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} style={{ marginRight: 15 }}>
              <Ionicons name="close-circle" size={20} color="gray" />
            </Pressable>
          )}
        </View>

        {/* Toast Notification */}
        {toastMessage && (
          <View style={styles.toastContainer}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        {/* Quick Stats Dashboard */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>⏱️</Text>
            <Text style={styles.statValue}>{totalFocusedHours}h</Text>
            <Text style={styles.statLabel}>Focused</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={styles.statValue}>{totalTasksDone}</Text>
            <Text style={styles.statLabel}>Tasks Done</Text>
          </View>
        </View>

        {/* Focus Session Section */}
        <View style={styles.sessionSection}>
          {showCelebration && (
            <LottieView
              source={{ uri: "https://lottie.host/5a2d67a1-94bd-4e9f-8566-5bc1de024f2b/oJq1vR3WpI.json" }}
              autoPlay
              loop={false}
              style={styles.lottieBg}
            />
          )}
          {!session && !loading && !showCelebration && (
            <View style={styles.preSessionContainer}>
              <Text style={styles.selectDurationText}>Select Duration</Text>
              <View style={styles.durationRow}>
                {[5, 10, 15, 25, 45, 60].map((min) => (
                  <Pressable
                    key={min}
                    style={[styles.durationChip, selectedDuration === min && styles.durationChipActive]}
                    onPress={() => setSelectedDuration(min)}
                  >
                    <Text style={[styles.durationText, selectedDuration === min && styles.durationTextActive]}>{min}m</Text>
                  </Pressable>
                ))}
              </View>

              <Pressable style={styles.startButton} onPress={startSession}>
                <Ionicons name="play" size={28} color="white" />
                <Text style={styles.startText}>Start Focus Session</Text>
              </Pressable>
            </View>
          )}

          {loading && <ActivityIndicator size="large" color="#FF4749" />}

          {session && !showCelebration && (
            <View style={styles.sessionCard}>
              <Text style={styles.sessionTitle}>🚀 Focus Session</Text>
              <View style={{ alignItems: "center", justifyContent: "center", marginVertical: 15 }}>
                <Svg width="140" height="140" viewBox="0 0 140 140">
                  {/* Background Track */}
                  <Circle cx="70" cy="70" r="60" stroke="#FFE5E5" strokeWidth="10" fill="none" />
                  {/* Animated Progress Circle */}
                  <Circle
                    cx="70"
                    cy="70"
                    r="60"
                    stroke="#FF4749"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - focusProgress)}`}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="70, 70"
                  />
                </Svg>
                <Text style={styles.timeRemainingText}>{formatTime(sessionTimeLeft)}</Text>
              </View>
              <Text style={styles.sessionTime}>
                Ends at {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          )}

          {/* Celebration State */}
          {showCelebration && (
            <View style={styles.celebrationCard}>
              <Text style={{ fontSize: 40 }}>🎉</Text>
              <Text style={styles.celebrationTitle}>Session Complete!</Text>
              <Text style={styles.celebrationSubtitle}>Amazing work! You crushed it.</Text>
              <Pressable
                style={styles.doneButton}
                onPress={handleFinishSession}
              >
                <Text style={styles.doneButtonText}>Log Session & Finish</Text>
              </Pressable>
            </View>
          )}
        </View>

        {isSearchingContext && filteredTasks.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.recentTitle}>Found Tasks</Text>
            {filteredTasks.map(item => (
              <View key={item.id} style={styles.taskCard}>
                <Ionicons name="document-text-outline" size={22} color="#FF4749" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.taskTitle}>{item.title}</Text>
                  <Text style={styles.taskProgress}>{item.progress}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="gray" />
              </View>
            ))}
          </View>
        )}

        {/* Motivation Line */}
        <Text style={styles.motivation}>
          🍅 Boost productivity with the <Text style={{ fontWeight: "bold" }}>Pomodoro Technique</Text>
        </Text>

        {/* Recent Sessions Section */}
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>{isSearchingContext ? "Found Sessions" : "Recent Sessions"}</Text>
        </View>

        {filteredSessions.length === 0 ? (
          <Text style={{ color: "gray", textAlign: "center", marginTop: 20 }}>{isSearchingContext ? "No sessions match search." : "No sessions logged yet."}</Text>
        ) : (
          filteredSessions.map((item) => (
            <View key={item.id} style={styles.taskCard}>
              <Ionicons name={item.icon} size={22} color="#FF4749" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskProgress}>Completed at {item.date}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
          ))
        )}

      </ScrollView>

      {/* BottomNav */}
      <BottomNav currentTab="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: "#FAFAFA" },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  username: { fontSize: 24, fontWeight: "800", color: "#222" },
  subtitle: { fontSize: 15, color: "gray", marginTop: 4 },
  profilePicPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#FFE5E5", justifyContent: "center", alignItems: "center" },

  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "white", borderRadius: 12, marginBottom: 20, height: 50, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 5, elevation: 2 },
  searchInput: { flex: 1, height: "100%", paddingHorizontal: 10, fontSize: 15 },

  toastContainer: { backgroundColor: "#FFF3CD", padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: "#FFEEBA" },
  toastText: { color: "#856404", fontWeight: "600", fontSize: 14, textAlign: "center" },

  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
  statBox: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3
  },
  statEmoji: { fontSize: 22, marginBottom: 5 },
  statValue: { fontSize: 18, fontWeight: "700", color: "#222" },
  statLabel: { fontSize: 12, color: "gray", marginTop: 2 },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  taskTitle: { fontWeight: "600", fontSize: 16, color: "#222" },
  taskProgress: { fontSize: 13, color: "gray", marginTop: 2 },
  sessionSection: { alignItems: "center", marginVertical: 20 },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF4749",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: "#FF4749",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    marginTop: 10,
  },
  startText: { color: "white", fontSize: 17, fontWeight: "700", marginLeft: 10 },
  sessionCard: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 24, // softer edges for premium feel
    alignItems: "center",
    shadowColor: "#FF4749",
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5,
    width: "100%",
  },
  sessionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 5, color: "#FF4749" },
  sessionTime: { fontSize: 14, color: "gray" },
  motivation: {
    textAlign: "center",
    fontSize: 15,
    color: "#FF4749",
    fontWeight: "600",
    marginVertical: 15,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  recentTitle: { fontSize: 17, fontWeight: "700" },
  timerText: { color: "#FF4749", fontWeight: "600", fontSize: 15 },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 12, marginTop: 4 },
  timeRemainingText: {
    position: "absolute",
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
  },
  celebrationCard: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    width: "100%",
  },
  celebrationTitle: { fontSize: 22, fontWeight: "800", color: "#FF4749", marginVertical: 10 },
  celebrationSubtitle: { fontSize: 16, color: "gray", textAlign: "center", marginBottom: 20 },
  doneButton: {
    backgroundColor: "#FF4749",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  doneButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  lottieBg: {
    position: 'absolute',
    width: width,
    height: width,
    top: -50,
    pointerEvents: 'none',
    zIndex: 10,
  },
  preSessionContainer: { width: "100%", alignItems: "center" },
  selectDurationText: { fontSize: 16, fontWeight: "600", color: "#444", marginBottom: 15 },
  durationRow: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", marginBottom: 25, gap: 10 },
  durationChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: "#eee" },
  durationChipActive: { backgroundColor: "#FFE5E5", borderColor: "#FF4749", borderWidth: 1 },
  durationText: { fontSize: 14, fontWeight: "600", color: "gray" },
  durationTextActive: { color: "#FF4749" }
});
