import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import BottomNav from "../bottomnav";

// 🔹 Dummy Backend Function
const fetchReportsData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        focusTime: {
          totalHours: 46.2,
          avgHours: 6.6,
          totalSessions: 109,
          data: [
            { day: 14, hours: 7.2 },
            { day: 15, hours: 5.8 },
            { day: 16, hours: 7.0 },
            { day: 17, hours: 6.2 },
            { day: 18, hours: 6.0 },
            { day: 19, hours: 5.4 },
            { day: 20, hours: 4.8 },
          ],
        },
        projectDistribution: {
          totalHours: 210,
          data: [
            { name: "Formbuilder App", hours: 73.5 },
            { name: "E-Commerce App", hours: 42 },
            { name: "Social & Charity", hours: 31.5 },
            { name: "AI Chatbot App", hours: 25.2 },
            { name: "Dating App", hours: 21 },
            { name: "Finance App", hours: 16.8 },
          ],
        },
      });
    }, 1000); // simulate network delay
  });
};

export default function ReportsScreen() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchReportsData().then((data) => {
      setReportData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />;
  }

  const COLORS = ["#FF4749", "#FF8A65", "#FFD54F", "#4FC3F7", "#81C784", "#BA68C8"];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reports</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Focus Time */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Focus Time</Text>
          <Text>Total: {reportData.focusTime.totalHours} hr</Text>
          <Text>Avg: {reportData.focusTime.avgHours} hr</Text>
          <Text>Sessions: {reportData.focusTime.totalSessions}</Text>

          <BarChart width={300} height={200} data={reportData.focusTime.data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="hours" fill="#FF4749" radius={[8, 8, 0, 0]} />
          </BarChart>
        </View>

        {/* Project Time Distribution */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Project Time Distribution</Text>
          <Text>Total: {reportData.projectDistribution.totalHours} hr</Text>

          <PieChart width={300} height={250}>
            <Pie
              data={reportData.projectDistribution.data}
              dataKey="hours"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {reportData.projectDistribution.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </View>
      </ScrollView>

      <BottomNav currentTab="Reports" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 15 },
  header: { fontSize: 20, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
});
