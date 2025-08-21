import { View, Text, StyleSheet, Pressable, FlatList, TextInput, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import BottomNav from "../bottomnav";

export default function TasksScreen() {
  const [taskTab, setTaskTab] = useState("Active");
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [taskTimers, setTaskTimers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState("");

  // Dummy backend
  const mockBackend = {
    fetchTasks: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            active: [
              { id: "1", title: "Create a React app", progress: "4/6 • 100/150 mins" },
              { id: "2", title: "Market Research & Analysis", progress: "3/5 • 80/120 mins" },
            ],
            completed: [
              { id: "3", title: "UI Design for Dashboard", progress: "Done" },
              { id: "4", title: "Client Presentation", progress: "Done" },
            ],
          });
        }, 1000);
      });
    },
  };

  // Load tasks
  useEffect(() => {
    const loadTasks = async () => {
      const data = await mockBackend.fetchTasks();
      setActiveTasks(data.active);
      setCompletedTasks(data.completed);
    };
    loadTasks();
  }, []);

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
    };
    setActiveTasks((prev) => [...prev, newTaskObj]);
    setNewTask("");
    setShowModal(false);
  };

  // Delete task
  const handleDeleteTask = (id) => {
    setActiveTasks((prev) => prev.filter((t) => t.id !== id));
    setCompletedTasks((prev) => prev.filter((t) => t.id !== id));
    setTaskTimers((prev) => {
      const newTimers = { ...prev };
      delete newTimers[id];
      return newTimers;
    });
  };

  // ✅ Mark as Completed
  const handleMarkCompleted = (id) => {
    const task = activeTasks.find((t) => t.id === id);
    if (task) {
      setActiveTasks((prev) => prev.filter((t) => t.id !== id));
      setCompletedTasks((prev) => [
        ...prev,
        { ...task, progress: "Done", completedAt: new Date().toLocaleTimeString() },
      ]);
      setTaskTimers((prev) => {
        const newTimers = { ...prev };
        delete newTimers[id];
        return newTimers;
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="refresh-outline" size={22} color="#FF4749" />
        <Text style={styles.title}>Tasks</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search-outline" size={22} color="black" style={{ marginRight: 15 }} />
          <Ionicons name="ellipsis-vertical" size={22} color="black" />
        </View>
      </View>

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
        data={taskTab === "Active" ? activeTasks : completedTasks}
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
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 15 },
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
