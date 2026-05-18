import { View, Text, ScrollView,
TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'

const places = [
  { id: 1, name: 'Tanah Lot Temple', type: 'Landmark',
    distance: '2.4 km', rating: '4.8', emoji: '🛕', open: true },
  { id: 2, name: 'Sacred Spring', type: 'Cultural',
    distance: '5.1 km', rating: '4.2', emoji: '💧', open: true },
  { id: 3, name: 'Seminyak Beach', type: 'Beach',
    distance: '3.8 km', rating: '4.6', emoji: '🏖️', open: true },
  { id: 4, name: 'Ubud Market', type: 'Shopping',
    distance: '12 km', rating: '4.1', emoji: '🛍️', open: false },
  { id: 5, name: 'Kuta Night Market', type: 'Food',
    distance: '6.2 km', rating: '4.4', emoji: '🍜', open: true },
]

const filters = ['All', 'Landmark', 'Beach', 'Food', 'Shopping', 'Cultural']

const pins = [
  { top: 60, left: 60, emoji: '🛕' },
  { top: 100, left: 180, emoji: '🏖️' },
  { top: 50, left: 260, emoji: '💧' },
  { top: 150, left: 100, emoji: '🍜' },
  { top: 130, left: 230, emoji: '🛍️' },
]

export default function MapScreen() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [saved, setSaved] = useState<number[]>([])

  const toggleSave = (id: number) => {
    setSaved(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const filtered = activeFilter === 'All'
    ? places
    : places.filter(p => p.type === activeFilter)

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore Map 🗺️</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={15} color="#6A6865" />
        <Text style={styles.searchText}>Search places nearby...</Text>
        <FontAwesome name="sliders" size={15} color="#C9A84C" />
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapBox}>
        {/* Grid lines */}
        <View style={styles.mapGrid} />

        {/* Location pins */}
        {pins.map((pin, idx) => (
          <View key={idx} style={[styles.pin, { top: pin.top, left: pin.left }]}>
            <View style={styles.pinBubble}>
              <Text style={{ fontSize: 14 }}>{pin.emoji}</Text>
            </View>
            <View style={styles.pinTail} />
          </View>
        ))}

        {/* Current location */}
        <View style={styles.currentLoc}>
          <View style={styles.currentDot} />
          <View style={styles.currentRing} />
        </View>

        {/* Map label */}
        <View style={styles.mapLabel}>
          <FontAwesome name="map-marker" size={12} color="#C9A84C" />
          <Text style={styles.mapLabelText}>Bali, Indonesia</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
        {filters.map(f => (
          <TouchableOpacity key={f}
            style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
            onPress={() => setActiveFilter(f)}>
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
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
        {filtered.map(place => (
          <View key={place.id} style={styles.placeCard}>
            <View style={styles.placeIcon}>
              <Text style={{ fontSize: 24 }}>{place.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.placeName}>{place.name}</Text>
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
  header: { padding: 20, paddingTop: 60 },
  title: { color: '#F0EEE8', fontSize: 22, fontWeight: '700' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#1E1E23', marginHorizontal: 20, borderRadius: 50,
    padding: 14, borderWidth: 0.5, borderColor: '#2A2A30', marginBottom: 16 },
  searchText: { color: '#6A6865', fontSize: 13, flex: 1 },
  mapBox: { marginHorizontal: 20, height: 220, backgroundColor: '#1A1A20',
    borderRadius: 20, borderWidth: 0.5, borderColor: '#2A2A30',
    marginBottom: 16, overflow: 'hidden', position: 'relative' },
  mapGrid: { position: 'absolute', inset: 0,
    borderWidth: 0, backgroundColor: 'transparent' },
  pin: { position: 'absolute', alignItems: 'center' },
  pinBubble: { backgroundColor: '#1E1E23', borderRadius: 10,
    padding: 6, borderWidth: 1, borderColor: '#C9A84C' },
  pinTail: { width: 2, height: 6, backgroundColor: '#C9A84C' },
  currentLoc: { position: 'absolute', bottom: 60,
    left: 150, alignItems: 'center', justifyContent: 'center' },
  currentDot: { width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#C9A84C', position: 'absolute', zIndex: 2 },
  currentRing: { width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#C9A84C33', borderWidth: 1, borderColor: '#C9A84C66' },
  mapLabel: { position: 'absolute', bottom: 12, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#1E1E23', paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 50, borderWidth: 0.5, borderColor: '#C9A84C' },
  mapLabelText: { color: '#E8C97A', fontSize: 12, fontWeight: '600' },
  filterRow: { marginBottom: 16 },
  filterTab: { paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 50, backgroundColor: '#1E1E23',
    borderWidth: 0.5, borderColor: '#2A2A30' },
  filterTabActive: { backgroundColor: '#C9A84C', borderColor: '#C9A84C' },
  filterText: { color: '#6A6865', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#0D0D0F' },
  section: { paddingHorizontal: 20 },
  sectionTitle: { color: '#F0EEE8', fontSize: 15,
    fontWeight: '600', marginBottom: 12 },
  placeCard: { flexDirection: 'row', alignItems: 'center',
    gap: 12, backgroundColor: '#1E1E23', borderRadius: 14,
    padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: '#2A2A30' },
  placeIcon: { width: 50, height: 50, borderRadius: 12,
    backgroundColor: '#26262D', alignItems: 'center', justifyContent: 'center' },
  placeName: { color: '#F0EEE8', fontSize: 13, fontWeight: '600' },
  placeMeta: { color: '#6A6865', fontSize: 11, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center',
    gap: 4, marginTop: 6 },
  ratingText: { color: '#A8A6A0', fontSize: 11 },
  openBadge: { paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 20, marginLeft: 6 },
  openText: { fontSize: 10, fontWeight: '600' },
})
