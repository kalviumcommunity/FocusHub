import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reports</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Focus Time */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Focus Time Overview</Text>
          <Text style={styles.metricText}>Total Hours: <Text style={styles.bold}>{reportData.focusTime.totalHours} hr</Text></Text>
          <Text style={styles.metricText}>Avg Daily: <Text style={styles.bold}>{reportData.focusTime.avgHours} hr</Text></Text>
          <Text style={styles.metricText}>Total Sessions: <Text style={styles.bold}>{reportData.focusTime.totalSessions}</Text></Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Daily Breakdown (Last 7 Days)</Text>
          {reportData.focusTime.data.map((item, index) => (
            <View key={index} style={styles.rowItem}>
              <Text style={styles.rowLabel}>Day {item.day}</Text>
              <View style={styles.barBackground}>
                <View style={[styles.barFill, { width: `${(item.hours / 8) * 100}%` }]} />
              </View>
              <Text style={styles.rowValue}>{item.hours} hr</Text>
            </View>
          ))}
        </View>

        {/* Project Time Distribution */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Project Distribution</Text>
          <Text style={styles.metricText}>Total Project Hours: <Text style={styles.bold}>{reportData.projectDistribution.totalHours} hr</Text></Text>

          <View style={styles.divider} />

          {reportData.projectDistribution.data.map((entry, index) => (
            <View key={index} style={styles.rowItem}>
              <Text style={[styles.rowLabel, { flex: 2 }]}>{entry.name}</Text>
              <Text style={styles.rowValue}>{entry.hours} hr</Text>
              <Text style={styles.rowPercentage}>
                {Math.round((entry.hours / reportData.projectDistribution.totalHours) * 100)}%
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNav currentTab="Reports" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 15, paddingTop: 40 },
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
  sectionTitle: { fontSize: 14, fontWeight: "600", color: "#666", marginBottom: 10 },
  metricText: { fontSize: 14, color: "#444", marginBottom: 4 },
  bold: { fontWeight: "bold", color: "#222" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 15 },
  rowItem: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  rowLabel: { width: 60, fontSize: 13, color: "#555" },
  rowValue: { width: 50, fontSize: 13, fontWeight: "600", textAlign: "right" },
  rowPercentage: { width: 40, fontSize: 13, color: "#FF4749", textAlign: "right", fontWeight: "bold" },
  barBackground: { flex: 1, height: 8, backgroundColor: "#eee", borderRadius: 4, marginHorizontal: 10, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: "#FF4749", borderRadius: 4 },
});
