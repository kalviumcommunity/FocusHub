import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignUp = () => {
    if (!name || !email || !password || !role) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    Alert.alert('Success', 'You have signed up successfully!');
    // Add API call here
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      

      <Text style={styles.title}>Join FocusHub Today!</Text>
      <Text style={styles.subtitle}>
        Join thousands who are turning distractions into deep work.
      </Text>

      {/* Name */}
      <Text style={styles.label}>Name</Text>
      <View style={styles.inputContainer}>
        <Icon name="person" size={20} color="#000" />
        <TextInput
          style={styles.input}
          placeholder="Andrew Ainsley"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color="#000" />
        <TextInput
          style={styles.input}
          placeholder="andrew.ainsley@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#000" />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'visibility-off' : 'visibility'}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      {/* Role Dropdown */}
      <Text style={styles.label}>Role</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Role" value="" />
          <Picker.Item label="Manager" value="Manager" />
          <Picker.Item label="Professional" value="professional" />
  
        </Picker>
      </View>

      {/* Sign up button */}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      {/* Sign in link */}
      <View style={styles.footerTextContainer}>
        <Text>Already have an account?</Text>
        <a href="/signin">
        <TouchableOpacity onPress={() => router.push('/signin')}>
          <Text style={styles.signinLink}> Sign in</Text>
        </TouchableOpacity>
        </a>
      </View>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 24,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 60,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 24,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 6,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 44,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerTextContainer: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signinLink: {
    color: '#ff4d4d',
  },
});
