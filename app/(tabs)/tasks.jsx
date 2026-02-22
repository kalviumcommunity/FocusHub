import { View, Text, StyleSheet, Pressable, FlatList, TextInput, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import BottomNav from "../bottomnav";
import { useAppStore } from "../store/useAppStore";

export default function TasksScreen() {
  const [taskTab, setTaskTab] = useState("Active");
  const [taskTimers, setTaskTimers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Connect to Global Store
  const { activeTasks, completedTasks, addTask, removeTask, completeTask } = useAppStore();

  // Handle Play/Pause
  const toggleTaskTimer = (taskId) => {
    setTaskTimers((prev) => {
      const task = prev[taskId];
      if (task?.running) {
        // ⏹ stop and record endTime
        return {
          ...prev,
          [taskId]: { ...task, running: false, endTime: new Date().toLocaleTimeString() },
        };
      } else {
        const prevElapsed = task?.elapsed || 0;
        const startTime = Date.now() - prevElapsed * 1000;
        return {
          ...prev,
          [taskId]: { running: true, startTime, elapsed: prevElapsed, endTime: null },
        };
      }
    });
  };

  // Timer effect
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
            return { ...prev, [taskId]: { ...t, elapsed } };
          });
        }, 1000);
      }
    });

    return () => Object.values(intervals).forEach(clearInterval);
  }, [taskTimers]);

  // Format time mm:ss
  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Add new task
  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const newTaskObj = {
      id: Date.now().toString(),
      title: newTask,
      progress: "0/1 • 0/60 mins",
      deadlineTime: newTime || "Not Set",
      deadlineDate: newDate || "Not Set"
    };
    addTask(newTaskObj); // Save to Zustand
    setNewTask("");
    setNewDate("");
    setNewTime("");
    setShowModal(false);
  };

  // Delete task
  const handleDeleteTask = (id) => {
    removeTask(id);
    setTaskTimers((prev) => {
      const newTimers = { ...prev };
      delete newTimers[id];
      return newTimers;
    });
  };

  // ✅ Mark as Completed
  const handleMarkCompleted = (id) => {
    completeTask(id);
    setTaskTimers((prev) => {
      const newTimers = { ...prev };
      delete newTimers[id];
      return newTimers;
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {!isSearching ? (
        <View style={styles.header}>
          <Ionicons name="refresh-outline" size={22} color="#FF4749" />
          <Text style={styles.title}>Tasks</Text>
          <View style={styles.headerIcons}>
            <Pressable onPress={() => setIsSearching(true)} style={{ marginRight: 15 }}>
              <Ionicons name="search-outline" size={22} color="black" />
            </Pressable>
            <Ionicons name="ellipsis-vertical" size={22} color="black" />
          </View>
        </View>
      ) : (
        <View style={[styles.header, { backgroundColor: "white", padding: 10, borderRadius: 10 }]}>
          <TextInput
            style={{ flex: 1, fontSize: 16 }}
            placeholder="Search tasks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          <Pressable onPress={() => { setIsSearching(false); setSearchQuery(""); }}>
            <Text style={{ color: "gray", fontWeight: "600", marginLeft: 10 }}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, taskTab === "Active" && styles.activeTab]}
          onPress={() => setTaskTab("Active")}
        >
          <Text style={[styles.tabText, taskTab === "Active" && styles.activeTabText]}>Active</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, taskTab === "Completed" && styles.activeTab]}
          onPress={() => setTaskTab("Completed")}
        >
          <Text style={[styles.tabText, taskTab === "Completed" && styles.activeTabText]}>Completed</Text>
        </Pressable>
      </View>

      {/* Task List */}
      <FlatList
        data={(taskTab === "Active" ? activeTasks : completedTasks).filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const timer = taskTimers[item.id];
          return (
            <View style={styles.taskCard}>
              <Ionicons name="document-text-outline" size={22} color="#FF4749" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskProgress}>
                  {taskTab === "Completed"
                    ? item.progress
                    : timer
                      ? formatTime(timer.elapsed)
                      : item.progress}
                </Text>

                {/* Render Deadlines if they exist */}
                {item.deadlineTime && item.deadlineTime !== "Not Set" && taskTab === "Active" && (
                  <Text style={styles.deadlineText}>⏰ {item.deadlineDate} @ {item.deadlineTime}</Text>
                )}

                {timer?.endTime && (
                  <Text style={styles.taskEndTime}>Ended at {timer.endTime}</Text>
                )}
                {item.completedAt && (
                  <Text style={styles.taskEndTime}>Completed at {item.completedAt}</Text>
                )}
              </View>

              {taskTab === "Active" ? (
                <>
                  {/* Play/Pause */}
                  <Pressable onPress={() => toggleTaskTimer(item.id)} style={{ marginRight: 10 }}>
                    <Ionicons
                      name={timer?.running ? "pause-circle" : "play-circle"}
                      size={28}
                      color="#FF4749"
                    />
                  </Pressable>
                  {/* ✅ Mark Completed */}
                  <Pressable onPress={() => handleMarkCompleted(item.id)} style={{ marginRight: 10 }}>
                    <Ionicons name="checkmark-done-circle-outline" size={26} color="green" />
                  </Pressable>
                </>
              ) : null}

              {/* Delete */}
              <Pressable onPress={() => handleDeleteTask(item.id)}>
                <Ionicons name="trash-outline" size={24} color="gray" />
              </Pressable>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Add Task Button */}
      <Pressable style={styles.addButton} onPress={() => setShowModal(true)}>
        <Ionicons name="add" size={28} color="white" />
      </Pressable>

      {/* Modal for adding task */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter task title"
              value={newTask}
              onChangeText={setNewTask}
            />
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Date (e.g. 12/04)"
                value={newDate}
                onChangeText={setNewDate}
              />
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Time (e.g. 14:30)"
                value={newTime}
                onChangeText={setNewTime}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Pressable style={styles.modalBtn} onPress={() => setShowModal(false)}>
                <Text style={{ color: "#555" }}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: "#FF4749" }]}
                onPress={handleAddTask}
              >
                <Text style={{ color: "white" }}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* BottomNav */}
      <BottomNav currentTab="Tasks" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 25, marginTop: 25 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "700", color: "#222" },
  headerIcons: { flexDirection: "row" },
  tabContainer: { flexDirection: "row", backgroundColor: "#eee", borderRadius: 10, marginBottom: 15 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  activeTab: { backgroundColor: "#FF4749" },
  tabText: { fontSize: 15, fontWeight: "600", color: "gray" },
  activeTabText: { color: "white" },
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
  taskProgress: { fontSize: 13, color: "gray" },
  taskEndTime: { fontSize: 12, color: "gray", marginTop: 2 },
  deadlineText: { fontSize: 12, color: "#FF4749", fontWeight: "600", marginTop: 4 },
  addButton: {
    position: "absolute",
    bottom: 70,
    right: 20,
    backgroundColor: "#FF4749",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: { backgroundColor: "white", padding: 20, borderRadius: 16, width: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10, marginBottom: 15 },
  modalBtn: { padding: 10, borderRadius: 10, minWidth: 80, alignItems: "center" },
});
