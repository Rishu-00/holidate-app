import { View, Text, ScrollView, TouchableOpacity,
StyleSheet, ActivityIndicator, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { WebView } from 'react-native-webview'

const filters = ['All', 'Temple', 'Park', 'Food', 'Hotel', 'Museum']

export default function MapScreen() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [saved, setSaved] = useState<number[]>([])
  const [location, setLocation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cityName, setCityName] = useState('Getting location...')
  const [searchText, setSearchText] = useState('')
  const [searching, setSearching] = useState(false)
  const [mapKey, setMapKey] = useState(0)
  const [places, setPlaces] = useState<any[]>([])
  const [placesLoading, setPlacesLoading] = useState(false)

  useEffect(() => {
    getLocation()
  }, [])

  const getLocation = async () => {
    setLoading(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setLoading(false)
        return
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      })
      setLocation(loc.coords)

      const geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      })
      if (geocode[0]) {
        const city = geocode[0].city || geocode[0].district || 'Current Location'
        const country = geocode[0].country || ''
        setCityName(`${city}, ${country}`)
      }

      fetchNearbyPlaces(loc.coords.latitude, loc.coords.longitude)
    } catch (err) {
      console.log('Location error:', err)
    }
    setLoading(false)
  }

 const fetchNearbyPlaces = async (lat: number, lng: number) => {
  setPlacesLoading(true)
  try {
    const categories = [
      { q: 'restaurant', type: 'Food', emoji: '🍽️' },
      { q: 'temple', type: 'Temple', emoji: '🛕' },
      { q: 'park', type: 'Park', emoji: '🌳' },
      { q: 'museum', type: 'Museum', emoji: '🏛️' },
      { q: 'hotel', type: 'Hotel', emoji: '🏨' },
      { q: 'market', type: 'Shopping', emoji: '🛍️' },
    ]

    const allPlaces: any[] = []

    for (const cat of categories) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${cat.q}&format=json&limit=3&lat=${lat}&lon=${lng}&bounded=0&viewbox=${lng-0.05},${lat+0.05},${lng+0.05},${lat-0.05}`,
          { headers: { 'User-Agent': 'HolidateApp/1.0' } }
        )
        const data = await res.json()

        data.forEach((place: any, idx: number) => {
          if (!place.display_name) return

          const pLat = parseFloat(place.lat)
          const pLng = parseFloat(place.lon)
          const R = 6371
          const dLat = (pLat - lat) * Math.PI / 180
          const dLon = (pLng - lng) * Math.PI / 180
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat * Math.PI / 180) * Math.cos(pLat * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
          const distance = (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1)

          const name = place.display_name.split(',')[0]
          if (name && parseFloat(distance) < 10) {
            allPlaces.push({
              id: allPlaces.length,
              name,
              type: cat.type,
              emoji: cat.emoji,
              distance: `${distance} km`,
              rating: (3.5 + Math.random() * 1.5).toFixed(1),
              open: Math.random() > 0.3,
              lat: pLat,
              lng: pLng,
            })
          }
        })
      } catch (e) {
        console.log('Category fetch error:', e)
      }
    }

    const unique = allPlaces
      .filter((v, i, a) => a.findIndex(t => t.name === v.name) === i)
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
      .slice(0, 15)

    setPlaces(unique)
  } catch (err) {
    console.log('Places error:', err)
  }
  setPlacesLoading(false)
}

  const searchLocation = async () => {
    if (!searchText.trim()) return
    setSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchText)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'HolidateApp/1.0' } }
      )
      const data = await response.json()
      if (data.length > 0) {
        const newLat = parseFloat(data[0].lat)
        const newLng = parseFloat(data[0].lon)
        setLocation({ latitude: newLat, longitude: newLng })
        setCityName(data[0].display_name.split(',').slice(0, 2).join(',').trim())
        setMapKey(prev => prev + 1)
        fetchNearbyPlaces(newLat, newLng)
      }
    } catch (err) {
      console.log('Search error:', err)
    }
    setSearching(false)
  }

  const toggleSave = (id: number) => {
    setSaved(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const filtered = activeFilter === 'All'
    ? places
    : places.filter((p: any) => p.type === activeFilter)

  const getMapHTML = (lat: number, lng: number) => {
    const markersJS = places.map(p => `
      L.marker([${p.lat}, ${p.lng}], {icon: blueIcon})
        .addTo(map)
        .bindPopup('<b>${p.emoji} ${p.name}</b><br>${p.type} · ${p.distance}');
    `).join('\n')

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          #map { width: 100vw; height: 100vh; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', {
            zoomControl: false,
            attributionControl: false
          }).setView([${lat}, ${lng}], 14);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(map);

          var goldIcon = L.divIcon({
            html: '<div style="background:#C9A84C;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(201,168,76,0.8)"></div>',
            iconSize: [18, 18],
            className: ''
          });

          var blueIcon = L.divIcon({
            html: '<div style="background:#378ADD;width:12px;height:12px;border-radius:50%;border:2px solid white;"></div>',
            iconSize: [12, 12],
            className: ''
          });

          L.marker([${lat}, ${lng}], {icon: goldIcon})
            .addTo(map)
            .bindPopup('<b>📍 You are here!</b>')
            .openPopup();

          ${markersJS}
        </script>
      </body>
      </html>
    `
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore Map 🗺️</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={getLocation}>
          <FontAwesome name="crosshairs" size={16} color="#C9A84C" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={15} color="#6A6865" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search any city..."
          placeholderTextColor="#6A6865"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={searchLocation}
          returnKeyType="search"
        />
        {searching
          ? <ActivityIndicator size="small" color="#C9A84C" />
          : <TouchableOpacity onPress={searchLocation}>
              <FontAwesome name="arrow-right" size={15} color="#C9A84C" />
            </TouchableOpacity>
        }
      </View>

      {/* Map */}
      <View style={styles.mapBox}>
        {loading && (
          <View style={styles.mapLoading}>
            <ActivityIndicator size="large" color="#C9A84C" />
            <Text style={styles.mapLoadingText}>Getting location... 📍</Text>
          </View>
        )}

        {!loading && location && (
          <WebView
            key={mapKey}
            source={{ html: getMapHTML(location.latitude, location.longitude) }}
            style={styles.webMap}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scrollEnabled={false}
          />
        )}

        {!loading && !location && (
          <View style={styles.mapLoading}>
            <Text style={{ fontSize: 32 }}>📍</Text>
            <Text style={styles.mapLoadingText}>Location unavailable</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={getLocation}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {location && (
          <View style={styles.mapLabel}>
            <FontAwesome name="map-marker" size={12} color="#C9A84C" />
            <Text style={styles.mapLabelText}>{cityName}</Text>
          </View>
        )}
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
        {filters.map(f => (
          <TouchableOpacity key={f}
            style={[styles.filterTab,
              activeFilter === f && styles.filterTabActive]}
            onPress={() => setActiveFilter(f)}>
            <Text style={[styles.filterText,
              activeFilter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Nearby Places */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Nearby Attractions ({filtered.length})
        </Text>

        {placesLoading && (
          <View style={styles.placesLoading}>
            <ActivityIndicator size="small" color="#C9A84C" />
            <Text style={styles.placesLoadingText}>
              Finding nearby places... 🔍
            </Text>
          </View>
        )}

        {!placesLoading && filtered.length === 0 && (
          <View style={styles.emptyPlaces}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No places found nearby</Text>
          </View>
        )}

        {!placesLoading && filtered.map((place: any) => (
          <View key={place.id} style={styles.placeCard}>
            <View style={styles.placeIcon}>
              <Text style={{ fontSize: 24 }}>{place.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.placeName} numberOfLines={1}>
                {place.name}
              </Text>
              <Text style={styles.placeMeta}>
                {place.type} · {place.distance} away
              </Text>
              <View style={styles.ratingRow}>
                <FontAwesome name="star" size={10} color="#C9A84C" />
                <Text style={styles.ratingText}>{place.rating}</Text>
                <View style={[styles.openBadge,
                  { backgroundColor: place.open ? '#1D9E7522' : '#D85A3022' }]}>
                  <Text style={[styles.openText,
                    { color: place.open ? '#5DCAA5' : '#D85A30' }]}>
                    {place.open ? 'Open' : 'Closed'}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={() => toggleSave(place.id)}>
              <FontAwesome
                name={saved.includes(place.id) ? 'bookmark' : 'bookmark-o'}
                size={20}
                color={saved.includes(place.id) ? '#C9A84C' : '#6A6865'}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0F' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 20, paddingTop: 60,
  },
  title: { color: '#F0EEE8', fontSize: 22, fontWeight: '700' },
  refreshBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#1E1E23', alignItems: 'center',
    justifyContent: 'center', borderWidth: 0.5, borderColor: '#2A2A30',
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#1E1E23', marginHorizontal: 20,
    borderRadius: 50, padding: 14,
    borderWidth: 0.5, borderColor: '#2A2A30', marginBottom: 16,
  },
  searchInput: { flex: 1, color: '#F0EEE8', fontSize: 13 },
  mapBox: {
    marginHorizontal: 20, height: 220,
    backgroundColor: '#1A1A20', borderRadius: 20,
    borderWidth: 0.5, borderColor: '#2A2A30',
    marginBottom: 16, overflow: 'hidden', position: 'relative',
  },
  webMap: { flex: 1 },
  mapLoading: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center', gap: 10,
  },
  mapLoadingText: { color: '#6A6865', fontSize: 13 },
  retryBtn: {
    backgroundColor: '#C9A84C', paddingHorizontal: 20,
    paddingVertical: 8, borderRadius: 50, marginTop: 8,
  },
  retryText: { color: '#0D0D0F', fontWeight: '700', fontSize: 13 },
  mapLabel: {
    position: 'absolute', bottom: 12, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#161619ee', paddingHorizontal: 14,
    paddingVertical: 6, borderRadius: 50,
    borderWidth: 0.5, borderColor: '#C9A84C',
  },
  mapLabelText: { color: '#E8C97A', fontSize: 12, fontWeight: '600' },
  filterRow: { marginBottom: 16 },
  filterTab: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 50, backgroundColor: '#1E1E23',
    borderWidth: 0.5, borderColor: '#2A2A30',
  },
  filterTabActive: { backgroundColor: '#C9A84C', borderColor: '#C9A84C' },
  filterText: { color: '#6A6865', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#0D0D0F' },
  section: { paddingHorizontal: 20 },
  sectionTitle: {
    color: '#F0EEE8', fontSize: 15,
    fontWeight: '600', marginBottom: 12,
  },
  placesLoading: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, padding: 16, justifyContent: 'center',
  },
  placesLoadingText: { color: '#6A6865', fontSize: 13 },
  emptyPlaces: {
    alignItems: 'center', padding: 30, gap: 8,
  },
  emptyEmoji: { fontSize: 32 },
  emptyText: { color: '#6A6865', fontSize: 13 },
  placeCard: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, backgroundColor: '#1E1E23',
    borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 0.5, borderColor: '#2A2A30',
  },
  placeIcon: {
    width: 50, height: 50, borderRadius: 12,
    backgroundColor: '#26262D',
    alignItems: 'center', justifyContent: 'center',
  },
  placeName: { color: '#F0EEE8', fontSize: 13, fontWeight: '600' },
  placeMeta: { color: '#6A6865', fontSize: 11, marginTop: 2 },
  ratingRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 4, marginTop: 6,
  },
  ratingText: { color: '#A8A6A0', fontSize: 11 },
  openBadge: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 20, marginLeft: 6,
  },
  openText: { fontSize: 10, fontWeight: '600' },
})