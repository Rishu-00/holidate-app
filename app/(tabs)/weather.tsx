import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'

const forecast = [
  { day: 'Mon', icon: '☀️', temp: '33°' },
  { day: 'Tue', icon: '🌧️', temp: '28°' },
  { day: 'Wed', icon: '☀️', temp: '34°' },
  { day: 'Thu', icon: '⛅', temp: '30°' },
  { day: 'Fri', icon: '☀️', temp: '35°' },
]

const conditions = [
  { icon: '☂️', title: 'Low rain chance', desc: 'Best time to explore beaches & temples', status: 'Great', color: '#5DCAA5' },
  { icon: '🌊', title: 'Calm sea conditions', desc: 'Ideal for water sports & diving', status: 'Good', color: '#5DCAA5' },
  { icon: '💨', title: 'Mild winds', desc: '12 km/h — comfortable for outdoor activities', status: 'Fine', color: '#C9A84C' },
]

export default function Weather() {
  const [selectedCity, setSelectedCity] = useState('Bali')
  const cities = ['Bali', 'Paris', 'Kerala', 'Santorini']

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Weather 🌤️</Text>
      </View>

      {/* City Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={styles.cityRow} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
        {cities.map(city => (
          <TouchableOpacity key={city}
            style={[styles.cityTab, selectedCity === city && styles.cityTabActive]}
            onPress={() => setSelectedCity(city)}>
            <Text style={[styles.cityTabText, selectedCity === city && styles.cityTabTextActive]}>
              {city}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Main Weather Card */}
      <View style={styles.mainCard}>
        <View style={styles.mainRow}>
          <View>
            <Text style={styles.tempText}>31<Text style={styles.tempDeg}>°C</Text></Text>
            <Text style={styles.conditionText}>Partly Cloudy</Text>
            <Text style={styles.locationText}>📍 {selectedCity} · Now</Text>
          </View>
          <View style={styles.weatherIconBox}>
            <Text style={styles.weatherEmoji}>⛅</Text>
            <Text style={styles.feelsLike}>Feels like 34°C</Text>
          </View>
        </View>
      </View>

      {/* 5 Day Forecast */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5-Day Forecast</Text>
        <View style={styles.forecastRow}>
          {forecast.map((item, idx) => (
            <View key={idx} style={styles.forecastCard}>
              <Text style={styles.forecastDay}>{item.day}</Text>
              <Text style={styles.forecastIcon}>{item.icon}</Text>
              <Text style={styles.forecastTemp}>{item.temp}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Travel Conditions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Travel Conditions</Text>
        {conditions.map((item, idx) => (
          <View key={idx} style={styles.conditionCard}>
            <View style={styles.conditionIcon}>
              <Text style={{ fontSize: 22 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.conditionTitle}>{item.title}</Text>
              <Text style={styles.conditionDesc}>{item.desc}</Text>
            </View>
            <Text style={[styles.conditionStatus, { color: item.color }]}>
              {item.status}
            </Text>
          </View>
        ))}
      </View>

      {/* Extra Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Details</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>💧</Text>
            <Text style={styles.statValue}>78%</Text>
            <Text style={styles.statLabel}>Humidity</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>👁️</Text>
            <Text style={styles.statValue}>10 km</Text>
            <Text style={styles.statLabel}>Visibility</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🌅</Text>
            <Text style={styles.statValue}>6:12 AM</Text>
            <Text style={styles.statLabel}>Sunrise</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🌇</Text>
            <Text style={styles.statValue}>6:48 PM</Text>
            <Text style={styles.statLabel}>Sunset</Text>
          </View>
        </View>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0F' },
  header: { padding: 20, paddingTop: 60 },
  title: { color: '#F0EEE8', fontSize: 22, fontWeight: '700' },
  cityRow: { marginBottom: 16 },
  cityTab: { paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 50, backgroundColor: '#1E1E23',
    borderWidth: 0.5, borderColor: '#2A2A30' },
  cityTabActive: { backgroundColor: '#C9A84C', borderColor: '#C9A84C' },
  cityTabText: { color: '#6A6865', fontSize: 12, fontWeight: '600' },
  cityTabTextActive: { color: '#0D0D0F' },
  mainCard: { marginHorizontal: 20, backgroundColor: '#1C1A10',
    borderRadius: 20, padding: 24, borderWidth: 0.5,
    borderColor: '#C9A84C', marginBottom: 24 },
  mainRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tempText: { color: '#F0EEE8', fontSize: 64, fontWeight: '300', lineHeight: 70 },
  tempDeg: { fontSize: 28, color: '#A8A6A0' },
  conditionText: { color: '#A8A6A0', fontSize: 14, marginTop: 4 },
  locationText: { color: '#6A6865', fontSize: 12, marginTop: 6 },
  weatherIconBox: { alignItems: 'center' },
  weatherEmoji: { fontSize: 60 },
  feelsLike: { color: '#6A6865', fontSize: 11, marginTop: 6 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { color: '#F0EEE8', fontSize: 15, fontWeight: '600', marginBottom: 12 },
  forecastRow: { flexDirection: 'row', gap: 8 },
  forecastCard: { flex: 1, backgroundColor: '#1E1E23', borderRadius: 12,
    padding: 12, alignItems: 'center', gap: 6,
    borderWidth: 0.5, borderColor: '#2A2A30' },
  forecastDay: { color: '#A8A6A0', fontSize: 11 },
  forecastIcon: { fontSize: 22 },
  forecastTemp: { color: '#F0EEE8', fontSize: 13, fontWeight: '600' },
  conditionCard: { flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#1E1E23', borderRadius: 14, padding: 14,
    marginBottom: 10, borderWidth: 0.5, borderColor: '#2A2A30' },
  conditionIcon: { width: 44, height: 44, borderRadius: 10,
    backgroundColor: '#26262D', alignItems: 'center', justifyContent: 'center' },
  conditionTitle: { color: '#F0EEE8', fontSize: 13, fontWeight: '600' },
  conditionDesc: { color: '#6A6865', fontSize: 11, marginTop: 2 },
  conditionStatus: { fontSize: 12, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: '47%', backgroundColor: '#1E1E23', borderRadius: 14,
    padding: 16, alignItems: 'center', gap: 6,
    borderWidth: 0.5, borderColor: '#2A2A30' },
  statEmoji: { fontSize: 26 },
  statValue: { color: '#F0EEE8', fontSize: 16, fontWeight: '700' },
  statLabel: { color: '#6A6865', fontSize: 11 },
})