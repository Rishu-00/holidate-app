import { View, Text, ScrollView, TouchableOpacity, 
Image, StyleSheet } from 'react-native'
import React from 'react'
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons'

export default function Discover() {
  const destinations = [
    { id: 1, name: 'Bali, Indonesia', price: '₹45,000', rating: '4.2', icon: '🌴' },
    { id: 2, name: 'Paris, France', price: '₹1,10,000', rating: '4.8', icon: '🗼' },
    { id: 3, name: 'Kerala, India', price: '₹18,000', rating: '4.5', icon: '🌿' },
    { id: 4, name: 'Santorini, Greece', price: '₹82,000', rating: '4.7', icon: '🏛️' },
  ]

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning ✦</Text>
          <Text style={styles.title}>Where to next?</Text>
        </View>
        <View style={styles.avatar}>
          <FontAwesome name="user" size={20} color="#C9A84C" />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={16} color="#6A6865" />
        <Text style={styles.searchText}>Search destinations...</Text>
      </View>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTag}>✦ Trending</Text>
        <Text style={styles.heroTitle}>Santorini, Greece 🏛️</Text>
        <Text style={styles.heroSub}>Europe · From ₹82,000 · 5 days avg</Text>
      </View>

      {/* Popular Destinations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {destinations.map((dest) => (
            <TouchableOpacity key={dest.id} style={styles.destCard}>
              <View style={styles.destCardImg}>
                <Text style={styles.destEmoji}>{dest.icon}</Text>
              </View>
              <View style={styles.destCardBody}>
                <Text style={styles.destName}>{dest.name}</Text>
                <Text style={styles.destPrice}>From {dest.price}</Text>
                <Text style={styles.destRating}>⭐ {dest.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>✈️</Text>
            <Text style={styles.actionLabel}>Flights</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>🏨</Text>
            <Text style={styles.actionLabel}>Hotels</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>🗺️</Text>
            <Text style={styles.actionLabel}>Maps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>🌤️</Text>
            <Text style={styles.actionLabel}>Weather</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0F' },
  header: { flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', padding: 20, paddingTop: 60 },
  greeting: { color: '#A8A6A0', fontSize: 13 },
  title: { color: '#F0EEE8', fontSize: 22, fontWeight: '700', marginTop: 2 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#1E1E23',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#C9A84C' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#1E1E23', marginHorizontal: 20, borderRadius: 50,
    padding: 14, borderWidth: 0.5, borderColor: '#2A2A30', marginBottom: 16 },
  searchText: { color: '#6A6865', fontSize: 13 },
  heroCard: { marginHorizontal: 20, backgroundColor: '#1C1A10', borderRadius: 16,
    padding: 20, borderWidth: 0.5, borderColor: '#C9A84C', marginBottom: 24 },
  heroTag: { color: '#C9A84C', fontSize: 11, marginBottom: 8 },
  heroTitle: { color: '#F0EEE8', fontSize: 20, fontWeight: '700' },
  heroSub: { color: '#A8A6A0', fontSize: 12, marginTop: 4 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { color: '#F0EEE8', fontSize: 15, fontWeight: '600' },
  sectionLink: { color: '#C9A84C', fontSize: 12 },
  destCard: { width: 140, backgroundColor: '#1E1E23', borderRadius: 14,
    marginRight: 12, borderWidth: 0.5, borderColor: '#2A2A30', overflow: 'hidden' },
  destCardImg: { height: 90, backgroundColor: '#26262D', alignItems: 'center', justifyContent: 'center' },
  destEmoji: { fontSize: 40 },
  destCardBody: { padding: 10 },
  destName: { color: '#F0EEE8', fontSize: 12, fontWeight: '600' },
  destPrice: { color: '#A8A6A0', fontSize: 10, marginTop: 2 },
  destRating: { fontSize: 10, marginTop: 4, color: '#A8A6A0' },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, backgroundColor: '#1E1E23', borderRadius: 12,
    padding: 14, alignItems: 'center', borderWidth: 0.5, borderColor: '#2A2A30' },
  actionIcon: { fontSize: 24, marginBottom: 6 },
  actionLabel: { color: '#A8A6A0', fontSize: 11, fontWeight: '500' },
})