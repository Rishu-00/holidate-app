import { View, Text, ScrollView, TouchableOpacity, 
StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FontAwesome } from '@expo/vector-icons'

const API_KEY = '071d5a65ae65fc937e4b5033f7d27d0a'

const cities = [
  { name: 'Roorkee', country: 'IN' },
  { name: 'Bali', country: 'ID' },
  { name: 'Paris', country: 'FR' },
  { name: 'Kerala', country: 'IN' },
]

const getWeatherEmoji = (code: number) => {
  if (code >= 200 && code < 300) return '⛈️'
  if (code >= 300 && code < 400) return '🌧️'
  if (code >= 500 && code < 600) return '🌧️'
  if (code >= 600 && code < 700) return '❄️'
  if (code >= 700 && code < 800) return '🌫️'
  if (code === 800) return '☀️'
  if (code > 800) return '⛅'
  return '🌤️'
}

export default function Weather() {
  const [selectedCity, setSelectedCity] = useState(cities[0])
  const [weather, setWeather] = useState<any>(null)
  const [forecast, setForecast] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchWeather()
  }, [selectedCity])

  const fetchWeather = async () => {
    setLoading(true)
    try {
      // Current weather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity.name}&appid=${API_KEY}&units=metric`
      )
      const data = await res.json()
      setWeather(data)

      // 5 day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity.name}&appid=${API_KEY}&units=metric&cnt=5`
      )
      const forecastData = await forecastRes.json()
      setForecast(forecastData.list || [])
    } catch (err) {
      console.log('Weather Error:', err)
    }
    setLoading(false)
  }

  const getDayName = (timestamp: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[new Date(timestamp * 1000).getDay()]
  }

  const getSunTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], 
      { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Weather 🌤️</Text>
        <TouchableOpacity onPress={fetchWeather} style={styles.refreshBtn}>
          <FontAwesome name="refresh" size={16} color="#C9A84C" />
        </TouchableOpacity>
      </View>

      {/* City Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={styles.cityRow}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
        {cities.map((city, idx) => (
          <TouchableOpacity key={idx}
            style={[styles.cityTab, 
              selectedCity.name === city.name && styles.cityTabActive]}
            onPress={() => setSelectedCity(city)}>
            <Text style={[styles.cityTabText,
              selectedCity.name === city.name && styles.cityTabTextActive]}>
              {city.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#C9A84C" />
          <Text style={styles.loadingText}>Fetching weather...</Text>
        </View>
      )}

      {/* Main Weather Card */}
      {!loading && weather && weather.main && (
        <>
          <View style={styles.mainCard}>
            <View style={styles.mainRow}>
              <View>
                <Text style={styles.tempText}>
                  {Math.round(weather.main.temp)}
                  <Text style={styles.tempDeg}>°C</Text>
                </Text>
                <Text style={styles.conditionText}>
                  {weather.weather[0].description
                    .charAt(0).toUpperCase() + 
                    weather.weather[0].description.slice(1)}
                </Text>
                <Text style={styles.locationText}>
                  📍 {weather.name} · Now
                </Text>
              </View>
              <View style={styles.weatherIconBox}>
                <Text style={styles.weatherEmoji}>
                  {getWeatherEmoji(weather.weather[0].id)}
                </Text>
                <Text style={styles.feelsLike}>
                  Feels like {Math.round(weather.main.feels_like)}°C
                </Text>
              </View>
            </View>
          </View>

          {/* 5 Day Forecast */}
          {forecast.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5-Day Forecast</Text>
              <View style={styles.forecastRow}>
                {forecast.map((item, idx) => (
                  <View key={idx} style={styles.forecastCard}>
                    <Text style={styles.forecastDay}>
                      {getDayName(item.dt)}
                    </Text>
                    <Text style={styles.forecastIcon}>
                      {getWeatherEmoji(item.weather[0].id)}
                    </Text>
                    <Text style={styles.forecastTemp}>
                      {Math.round(item.main.temp)}°
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Today's Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Details</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>💧</Text>
                <Text style={styles.statValue}>{weather.main.humidity}%</Text>
                <Text style={styles.statLabel}>Humidity</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>👁️</Text>
                <Text style={styles.statValue}>
                  {(weather.visibility / 1000).toFixed(1)} km
                </Text>
                <Text style={styles.statLabel}>Visibility</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>🌅</Text>
                <Text style={styles.statValue}>
                  {getSunTime(weather.sys.sunrise)}
                </Text>
                <Text style={styles.statLabel}>Sunrise</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>🌇</Text>
                <Text style={styles.statValue}>
                  {getSunTime(weather.sys.sunset)}
                </Text>
                <Text style={styles.statLabel}>Sunset</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>💨</Text>
                <Text style={styles.statValue}>
                  {weather.wind.speed} m/s
                </Text>
                <Text style={styles.statLabel}>Wind</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statEmoji}>🌡️</Text>
                <Text style={styles.statValue}>
                  {Math.round(weather.main.pressure)} hPa
                </Text>
                <Text style={styles.statLabel}>Pressure</Text>
              </View>
            </View>
          </View>

          {/* Travel Conditions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Travel Conditions</Text>
            <View style={styles.conditionCard}>
              <View style={styles.conditionIcon}>
                <Text style={{ fontSize: 22 }}>
                  {weather.main.humidity > 80 ? '☂️' : '☀️'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.conditionTitle}>
                  {weather.main.humidity > 80 
                    ? 'High humidity' : 'Good conditions'}
                </Text>
                <Text style={styles.conditionDesc}>
                  {weather.main.humidity > 80 
                    ? 'Carry an umbrella just in case'
                    : 'Great time to explore outdoors!'}
                </Text>
              </View>
              <Text style={[styles.conditionStatus, 
                { color: weather.main.humidity > 80 
                  ? '#C9A84C' : '#5DCAA5' }]}>
                {weather.main.humidity > 80 ? 'Caution' : 'Great'}
              </Text>
            </View>
            <View style={styles.conditionCard}>
              <View style={styles.conditionIcon}>
                <Text style={{ fontSize: 22 }}>💨</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.conditionTitle}>
                  {weather.wind.speed > 10 
                    ? 'Strong winds' : 'Calm winds'}
                </Text>
                <Text style={styles.conditionDesc}>
                  {weather.wind.speed} m/s — 
                  {weather.wind.speed > 10 
                    ? ' Be careful outdoors'
                    : ' Comfortable for outdoor activities'}
                </Text>
              </View>
              <Text style={[styles.conditionStatus,
                { color: weather.wind.speed > 10 
                  ? '#D85A30' : '#5DCAA5' }]}>
                {weather.wind.speed > 10 ? 'Windy' : 'Good'}
              </Text>
            </View>
          </View>
        </>
      )}

      {/* Error state */}
      {!loading && weather && weather.cod === '404' && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            City not found! Please try again.
          </Text>
        </View>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0F' },
  header: { flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 20, paddingTop: 60 },
  title: { color: '#F0EEE8', fontSize: 22, fontWeight: '700' },
  refreshBtn: { width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#1E1E23', alignItems: 'center',
    justifyContent: 'center', borderWidth: 0.5, borderColor: '#2A2A30' },
  cityRow: { marginBottom: 16 },
  cityTab: { paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 50, backgroundColor: '#1E1E23',
    borderWidth: 0.5, borderColor: '#2A2A30' },
  cityTabActive: { backgroundColor: '#C9A84C', borderColor: '#C9A84C' },
  cityTabText: { color: '#6A6865', fontSize: 12, fontWeight: '600' },
  cityTabTextActive: { color: '#0D0D0F' },
  loadingBox: { flex: 1, alignItems: 'center',
    justifyContent: 'center', padding: 40, gap: 12 },
  loadingText: { color: '#6A6865', fontSize: 14 },
  mainCard: { marginHorizontal: 20, backgroundColor: '#1C1A10',
    borderRadius: 20, padding: 24, borderWidth: 0.5,
    borderColor: '#C9A84C', marginBottom: 24 },
  mainRow: { flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center' },
  tempText: { color: '#F0EEE8', fontSize: 64,
    fontWeight: '300', lineHeight: 70 },
  tempDeg: { fontSize: 28, color: '#A8A6A0' },
  conditionText: { color: '#A8A6A0', fontSize: 14, marginTop: 4 },
  locationText: { color: '#6A6865', fontSize: 12, marginTop: 6 },
  weatherIconBox: { alignItems: 'center' },
  weatherEmoji: { fontSize: 60 },
  feelsLike: { color: '#6A6865', fontSize: 11, marginTop: 6 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { color: '#F0EEE8', fontSize: 15,
    fontWeight: '600', marginBottom: 12 },
  forecastRow: { flexDirection: 'row', gap: 8 },
  forecastCard: { flex: 1, backgroundColor: '#1E1E23',
    borderRadius: 12, padding: 12, alignItems: 'center',
    gap: 6, borderWidth: 0.5, borderColor: '#2A2A30' },
  forecastDay: { color: '#A8A6A0', fontSize: 11 },
  forecastIcon: { fontSize: 22 },
  forecastTemp: { color: '#F0EEE8', fontSize: 13, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: '47%', backgroundColor: '#1E1E23',
    borderRadius: 14, padding: 16, alignItems: 'center',
    gap: 6, borderWidth: 0.5, borderColor: '#2A2A30' },
  statEmoji: { fontSize: 26 },
  statValue: { color: '#F0EEE8', fontSize: 16, fontWeight: '700' },
  statLabel: { color: '#6A6865', fontSize: 11 },
  conditionCard: { flexDirection: 'row', alignItems: 'center',
    gap: 12, backgroundColor: '#1E1E23', borderRadius: 14,
    padding: 14, marginBottom: 10,
    borderWidth: 0.5, borderColor: '#2A2A30' },
  conditionIcon: { width: 44, height: 44, borderRadius: 10,
    backgroundColor: '#26262D', alignItems: 'center',
    justifyContent: 'center' },
  conditionTitle: { color: '#F0EEE8', fontSize: 13, fontWeight: '600' },
  conditionDesc: { color: '#6A6865', fontSize: 11, marginTop: 2 },
  conditionStatus: { fontSize: 12, fontWeight: '600' },
  errorBox: { margin: 20, backgroundColor: '#E8545422',
    borderRadius: 14, padding: 16,
    borderWidth: 0.5, borderColor: '#E85454' },
  errorText: { color: '#E85454', fontSize: 14, textAlign: 'center' },
})