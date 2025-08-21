import { View, Text, StyleSheet, Pressable, ActivityIndicator, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link } from "expo-router";

// Dummy tasks
const dummyTasks = [
  { id: "1", title: "Designing Brand Logos", progress: "4/6 • 100/150 mins", icon: "color-palette-outline" },
  { id: "2", title: "Study React Native", progress: "2/4 • 60/120 mins", icon: "book-outline" },
  { id: "3", title: "Client Meeting Notes", progress: "1/1 • 30/30 mins", icon: "briefcase-outline" },
];

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState("Home");
  const [taskTimers, setTaskTimers] = useState({}); // track timers per task
  const [taskList, setTaskList] = useState(dummyTasks);

  const router = useRouter();

  // ---- DUMMY BACKEND ----
  const mockBackend = {
    startSession: async (duration = 25) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const endTime = new Date(Date.now() + duration * 60 * 1000);
          resolve({ endTime: endTime.toISOString() });
        }, 1000);
      });
    },
    checkSession: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (session) {
            const stillActive = new Date(session.endTime) > new Date();
            resolve({ active: stillActive, endTime: session.endTime });
          } else {
            resolve({ active: false });
          }
        }, 500);
      });
    },
  };
  // ------------------------

  const startSession = async () => {
    setLoading(true);
    try {
      const data = await mockBackend.startSession(25);
      setSession(data);
    } catch (err) {
      console.error("Error starting session", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const intervals = {};

  Object.keys(taskTimers).forEach((taskId) => {
    const task = taskTimers[taskId];
    if (task.running) {
      intervals[taskId] = setInterval(() => {
        setTaskTimers((prev) => {
          const t = prev[taskId];
          if (!t?.running) return prev;

          const elapsed = Math.floor((Date.now() - t.startTime) / 1000);

          if (elapsed >= 60) {
            clearInterval(intervals[taskId]);
            return {
              ...prev,
              [taskId]: { ...t, running: false, elapsed: 60 },
            };
          }

          return {
            ...prev,
            [taskId]: { ...t, elapsed },
          };
        });
      }, 1000);
    }
  });

  return () => {
    Object.values(intervals).forEach(clearInterval);
  };
}, [taskTimers]);


  // ✅ handle tab press
  const handleTabPress = (tab, route) => {
    setActiveTab(tab);
    router.push(route);
  };

  // ✅ handle starting timer for a specific task (limit = 1 minute)
  const handleTaskStart = (taskId) => {
  const prevElapsed = taskTimers[taskId]?.elapsed || 0;
  const startTime = Date.now() - prevElapsed * 1000;

  setTaskTimers((prev) => ({
    ...prev,
    [taskId]: { running: true, startTime, elapsed: prevElapsed },
  }));
};



  // ✅ format time mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <View style={styles.container}>
      {/* Greeting */}
      <Text style={styles.username}>👋 Hey Andrew</Text>
      <Text style={styles.subtitle}>Let’s stay productive today!</Text>

      {/* Current Task */}
      <View style={styles.taskCard}>
        <Ionicons name="alarm-outline" size={22} color="#FF4749" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.taskTitle}>Create a React App</Text>
          <Text style={styles.taskProgress}>4/6 • 100/150 mins</Text>
        </View>
        <Ionicons name="chevron-down" size={22} color="gray" />
      </View>

      {/* Focus Session Section */}
      <View style={styles.sessionSection}>
        {!session && !loading && (
          <Pressable style={styles.startButton} onPress={startSession}>
            <Ionicons name="play" size={28} color="white" />
            <Text style={styles.startText}>Start Focus Session</Text>
          </Pressable>
        )}
        {loading && <ActivityIndicator size="large" color="#FF4749" />}
        {session && (
          <View style={styles.sessionCard}>
            <Text style={styles.sessionTitle}>🚀 Focus Session in Progress</Text>
            <Text style={styles.sessionTime}>
              Ends at: {new Date(session.endTime).toLocaleTimeString()}
            </Text>
          </View>
        )}
      </View>

      {/* Motivation Line */}
      <Text style={styles.motivation}>
        🍅 Boost productivity with the <Text style={{ fontWeight: "bold" }}>Pomodoro Technique</Text>
      </Text>

      {/* Recent Tasks Section */}
      <View style={styles.recentHeader}>
        <Text style={styles.recentTitle}>Recent Tasks</Text>
      </View>
      <FlatList
  data={taskList} // ✅ use taskList instead of dummyTasks
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => {
    const task = taskTimers[item.id];
    const LIMIT = 60; // 1 min limit in seconds

    return (
      <View style={styles.taskCard}>
        <Ionicons name={item.icon} size={22} color="#FF4749" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskProgress}>{item.progress}</Text>
        </View>

        {/* Timer running or has elapsed */}
        {task ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.timerText}>
              {formatTime(task.elapsed || 0)} / {formatTime(LIMIT)}
            </Text>

            {/* Pause/Resume button */}
            <Pressable
              onPress={() => {
                setTaskTimers((prev) => {
                  const current = prev[item.id];
                  // Toggle running state
                  return {
                    ...prev,
                    [item.id]: { ...current, running: !current.running },
                  };
                });
              }}
              style={{ marginLeft: 10 }}
            >
              <Ionicons
                name={task.running ? "pause-circle" : "play-circle"}
                size={26}
                color={task.running ? "orange" : "#FF4749"}
              />
            </Pressable>

            {/* Delete button */}
            <Pressable
              onPress={() => {
                // Filter out the deleted task
                const updatedTasks = taskList.filter((t) => t.id !== item.id);
                setTaskList(updatedTasks);

                // Remove timer entry
                setTaskTimers((prev) => {
                  const copy = { ...prev };
                  delete copy[item.id];
                  return copy;
                });
              }}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="trash-outline" size={26} color="red" />
            </Pressable>
          </View>
        ) : (
          // Start button (first time)
          <Pressable onPress={() => handleTaskStart(item.id)}>
            <Ionicons name="play-circle" size={28} color="#FF4749" />
          </Pressable>
        )}
      </View>
    );
  }}
/>




      {/* ✅ Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { tab: "Home", icon: "home", route: "/home" },
          { tab: "Tasks", icon: "document-text-outline", route: "/tasks" },
          { tab: "Teams", icon: "people-outline", route: "/teams" },
          { tab: "Reports", icon: "stats-chart-outline", route: "/reports" },
          { tab: "Profile", icon: "person-outline", route: "/profile" },
        ].map(({ tab, icon, route }) => (
          <Link href={route} key={tab}>
            <Pressable style={styles.navItem} onPress={() => handleTabPress(tab, route)}>
              <Ionicons
                name={icon}
                size={22}
                color={activeTab === tab ? "#FF4749" : "gray"}
              />
              <Text
                style={[
                  styles.navText,
                  { color: activeTab === tab ? "#FF4749" : "gray" },
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 20 },
  username: { fontSize: 22, fontWeight: "700", color: "#222" },
  subtitle: { fontSize: 15, color: "gray", marginBottom: 20 },
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
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    shadowColor: "#FF4749",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  startText: { color: "white", fontSize: 16, fontWeight: "600", marginLeft: 10 },
  sessionCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
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
});
