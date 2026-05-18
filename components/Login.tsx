import { View, Text, TextInput, StyleSheet, 
TouchableOpacity, ActivityIndicator, KeyboardAvoidingView,
Platform } from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword, 
createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/configs/firebaseConfig'

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please enter email and password!')
      return
    }
    setLoading(true)
    setError('')
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already registered!')
      } else if (err.code === 'auth/wrong-password') {
        setError('Wrong password!')
      } else if (err.code === 'auth/user-not-found') {
        setError('User not found — please Sign Up first!')
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters!')
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email!')
      } else {
        setError('Something went wrong — please try again!')
      }
    }
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Logo */}
      <View style={styles.logoSection}>
        <Text style={styles.logoEmoji}>✈️</Text>
        <Text style={styles.logoText}>Holidate</Text>
        <Text style={styles.tagline}>Your Premium Travel Companion</Text>
      </View>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroEmoji}>🌍</Text>
        <Text style={styles.heroTitle}>Explore the World</Text>
        <Text style={styles.heroSub}>
          Plan trips, track budgets, discover destinations
        </Text>
      </View>

      {/* Features Row */}
      <View style={styles.featuresRow}>
        {[
          { emoji: '🗺️', label: 'AI Trips' },
          { emoji: '💰', label: 'Budget' },
          { emoji: '🌤️', label: 'Weather' },
          { emoji: '👥', label: 'Social' },
        ].map((f, idx) => (
          <View key={idx} style={styles.featureItem}>
            <Text style={styles.featureEmoji}>{f.emoji}</Text>
            <Text style={styles.featureText}>{f.label}</Text>
          </View>
        ))}
      </View>

      {/* Tab Switch */}
      <View style={styles.tabSwitch}>
        <TouchableOpacity
          style={[styles.switchTab, !isSignUp && styles.switchTabActive]}
          onPress={() => { setIsSignUp(false); setError('') }}
        >
          <Text style={[styles.switchText, !isSignUp && styles.switchTextActive]}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchTab, isSignUp && styles.switchTabActive]}
          onPress={() => { setIsSignUp(true); setError('') }}
        >
          <Text style={[styles.switchText, isSignUp && styles.switchTextActive]}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#6A6865"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password (min 6 characters)"
          placeholderTextColor="#6A6865"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Error Message */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.authBtn, loading && { opacity: 0.7 }]}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#0D0D0F" />
            : <Text style={styles.authBtnText}>
                {isSignUp ? '🚀 Create Account' : '✈️ Login'}
              </Text>
          }
        </TouchableOpacity>

        <Text style={styles.switchHint}>
          {isSignUp
            ? 'Already have an account? '
            : "Don't have an account? "}
          <Text
            style={styles.switchLink}
            onPress={() => { setIsSignUp(!isSignUp); setError('') }}
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </Text>
        </Text>
      </View>

      <Text style={styles.terms}>
        By continuing, you agree to our Terms & Privacy Policy
      </Text>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0F',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoEmoji: { fontSize: 44, marginBottom: 6 },
  logoText: {
    color: '#E8C97A',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tagline: { color: '#6A6865', fontSize: 12, marginTop: 4 },
  heroCard: {
    backgroundColor: '#1C1A10',
    borderRadius: 20, padding: 20,
    alignItems: 'center',
    borderWidth: 0.5, borderColor: '#C9A84C',
    marginBottom: 16,
  },
  heroEmoji: { fontSize: 36, marginBottom: 8 },
  heroTitle: {
    color: '#F0EEE8', fontSize: 18,
    fontWeight: '700', marginBottom: 6,
  },
  heroSub: {
    color: '#A8A6A0', fontSize: 12,
    textAlign: 'center', lineHeight: 18,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureItem: {
    flex: 1, alignItems: 'center',
    backgroundColor: '#1E1E23',
    borderRadius: 12, padding: 10,
    marginHorizontal: 3,
    borderWidth: 0.5, borderColor: '#2A2A30',
  },
  featureEmoji: { fontSize: 20, marginBottom: 4 },
  featureText: { color: '#A8A6A0', fontSize: 9, fontWeight: '600' },
  tabSwitch: {
    flexDirection: 'row',
    backgroundColor: '#1E1E23',
    borderRadius: 50, padding: 4,
    marginBottom: 16,
    borderWidth: 0.5, borderColor: '#2A2A30',
  },
  switchTab: {
    flex: 1, paddingVertical: 10,
    borderRadius: 50, alignItems: 'center',
  },
  switchTabActive: { backgroundColor: '#C9A84C' },
  switchText: { color: '#6A6865', fontSize: 14, fontWeight: '600' },
  switchTextActive: { color: '#0D0D0F' },
  form: { gap: 12 },
  input: {
    backgroundColor: '#1E1E23',
    borderRadius: 14, padding: 16,
    color: '#F0EEE8', fontSize: 14,
    borderWidth: 0.5, borderColor: '#2A2A30',
  },
  errorBox: {
    backgroundColor: '#E8545422',
    borderRadius: 10, padding: 12,
    borderWidth: 0.5, borderColor: '#E85454',
  },
  errorText: { color: '#E85454', fontSize: 13 },
  authBtn: {
    backgroundColor: '#C9A84C',
    borderRadius: 50, padding: 16,
    alignItems: 'center', marginTop: 4,
  },
  authBtnText: {
    color: '#0D0D0F',
    fontSize: 15, fontWeight: '700',
  },
  switchHint: {
    color: '#6A6865', fontSize: 13,
    textAlign: 'center', marginTop: 4,
  },
  switchLink: { color: '#C9A84C', fontWeight: '700' },
  terms: {
    color: '#3A3A40', fontSize: 11,
    textAlign: 'center', marginTop: 16,
  },
})