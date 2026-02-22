import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const SigninScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signedIn, setSignedIn] = useState(false); // Track sign-in status
  const router = useRouter();

  const handleSignIn = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    Keyboard.dismiss();
    Alert.alert('Success', 'You have signed in successfully!');
    setSignedIn(true);  // Set signed-in state true, show home button
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      Alert.alert('Success', 'Google Sign-in successful!');
      router.replace('/(tabs)/home'); // Navigate to home
    } catch (error) {
      console.error(error);
      Alert.alert('Google Sign-in Error', error.message || 'Something went wrong');
    }
  };

  const handleGoHome = () => {
    router.push('/(tabs)/home'); // Navigate to homepage on button press
  };

  const handleSignUpPress = () => {
    router.push('/signup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>
        Sign in to continue your deep work journey with FocusHub.
      </Text>

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
          autoCorrect={false}
          textContentType="emailAddress"
        />
      </View>

      <Text style={styles.label}>Password</Text>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#000" />
        <TextInput
          style={[styles.input, { marginRight: 8 }]}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          textContentType="password"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'visibility-off' : 'visibility'}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      {!signedIn ? (
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={handleGoHome}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.orText}>- OR -</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <FontAwesome name="google" size={20} color="#000" />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <View style={styles.footerTextContainer}>
        <Text>Don’t have an account?</Text>
        <TouchableOpacity onPress={handleSignUpPress}>
          <Text style={styles.signinLink}> Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
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
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#888',
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  footerTextContainer: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signinLink: {
    color: '#ff4d4d',
    marginLeft: 4,
    fontWeight: 'bold',
  },
});
