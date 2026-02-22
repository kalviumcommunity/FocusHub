import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter,Link } from "expo-router"; // ✅ Needed for back navigation

export default function HelpSupport() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Link href='/profile'>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      </Link>

      <Text style={styles.title}>Help & Support</Text>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.text}>FAQs</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.text}>Contact Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.text}>Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.text}>Terms of Service</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 16 // iOS-style blue
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  text: {
    fontSize: 16,
  },
});
