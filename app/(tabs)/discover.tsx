import { View, Text, ScrollView, TouchableOpacity,
StyleSheet, TextInput, ActivityIndicator, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { auth, db } from '@/configs/firebaseConfig'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useRouter } from 'expo-router'

const DESTINATIONS = [
  { name: 'Bali', country: 'Indonesia', emoji: '🌴',
    temp: '31°C', rating: '4.9', tag: 'Trending' },
  { name: 'Paris', country: 'France', emoji: '🗼',
    temp: '18°C', rating: '4.8', tag: 'Popular' },
  { name: 'Kerala', country: 'India', emoji: '🌿',
    temp: '28°C', rating: '4.7', tag: 'Nature' },
  { name: 'Dubai', country: 'UAE', emoji: '🏙️',
    temp: '38°C', rating: '4.8', tag: 'Luxury' },
  { name: 'Tokyo', country: 'Japan', emoji: '🗾',
    temp: '22°C', rating: '4.9', tag: 'Culture' },
  { name: 'Singapore', country: 'Singapore', emoji: '🦁',
    temp: '30°C', rating: '4.8', tag: 'Modern' },
  { name: 'Maldives', country: 'Maldives', emoji: '🏝️',
    temp: '29°C', rating: '5.0', tag: 'Beach' },
  { name: 'New York', country: 'USA', emoji: '🗽',
    temp: '15°C', rating: '4.7', tag: 'City' },
]

const CATEGORIES = [
  { label: 'All', emoji: '🌍' },
  { label: 'Beach', emoji: '🏖️' },
  { label: 'Nature', emoji: '🌿' },
  { label: 'City', emoji: '🏙️' },
  { label: 'Culture', emoji: '🛕' },
  { label: 'Luxury', emoji: '💎' },
]

const QUICK_ACTIONS = [
  { label: 'Flights', emoji: '✈️', color: '#C9A84C' },
  { label: 'Hotels', emoji: '🏨', color: '#378ADD' },
  { label: 'Weather', emoji: '🌤️', color: '#1D9E75' },
  { label: 'Budget', emoji: '💰', color: '#D85A30' },
]

export default function Discover() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [tripCount, setTripCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const user = auth.currentUser

  const displayName = user?.displayName ||
    user?.email?.split('@')[0] || 'Traveller'

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  useEffect(() => {
    fetchTripCount()
  }, [])

  const fetchTripCount = async () => {
    if (!user) return
    try {
      const q = query(
        collection(db, 'UserTrips'),
        where('userEmail', '==', user.email)
      )
      const snap = await getDocs(q)
      setTripCount(snap.size)
    } catch (err) {
      console.log('Error:', err)
    }
  }

  const filtered = DESTINATIONS.filter(dest => {
    const matchSearch = dest.name.toLowerCase()
      .includes(search.toLowerCase()) ||
      dest.country.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'All' ||
      dest.tag === activeCategory
    return matchSearch && matchCategory
  })

  const trending = DESTINATIONS.filter(d =>
    d.tag === 'Trending' || d.rating === '5.0' || d.rating === '4.9'
  ).slice(0, 3)

  return (
    <ScrollView style={styles.container}
      showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {getGreeting()} 👋
          </Text>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userSub}>
            {tripCount > 0
              ? `You have ${tripCount} trip${tripCount > 1 ? 's' : ''} planned! ✈️`
              : 'Ready to explore the world? 🌍'}
          </Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <FontAwesome name="bell-o" size={18} color="#C9A84C" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={14} color="#6A6865" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search destinations..."
          placeholderTextColor="#6A6865"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <FontAwesome name="times-circle" size={14} color="#6A6865" />
          </TouchableOpacity>
        )}
      </View>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroContent}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🔥 Trending</Text>
          </View>
          <Text style={styles.heroTitle}>Santorini</Text>
          <Text style={styles.heroSub}>Greece · 24°C · ⭐ 4.9</Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => router.push('/create-trip/search-place')}>
            <Text style={styles.exploreBtnText}>Plan Trip →</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.heroEmoji}>🏛️</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        {QUICK_ACTIONS.map((action, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.quickAction,
              { backgroundColor: action.color + '22',
                borderColor: action.color + '44' }]}
            onPress={() => {
              if (action.label === 'Hotels')
                router.push('/hotels' as any)
              else if (action.label === 'Weather')
                router.push('/(tabs)/weather' as any)
              else if (action.label === 'Budget')
                router.push('/(tabs)/budget' as any)
              else
                router.push('/create-trip/search-place')
            }}>
            <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
            <Text style={[styles.quickActionLabel,
              { color: action.color }]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={styles.categoryRow}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
        {CATEGORIES.map((cat, idx) => (
          <TouchableOpacity key={idx}
            style={[styles.categoryTab,
              activeCategory === cat.label && styles.categoryTabActive]}
            onPress={() => setActiveCategory(cat.label)}>
            <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
            <Text style={[styles.categoryText,
              activeCategory === cat.label && styles.categoryTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Popular Destinations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {search ? 'Search Results' : 'Popular Destinations'} 🌍
          </Text>
          <Text style={styles.sectionCount}>
            {filtered.length} places
          </Text>
        </View>

        {filtered.length === 0 ? (
          <View style={styles.emptySearch}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>
              No destinations found for "{search}"
            </Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}>
            {filtered.map((dest, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.destCard}
                onPress={() => router.push('/create-trip/search-place')}>
                <View style={styles.destEmoji}>
                  <Text style={{ fontSize: 36 }}>{dest.emoji}</Text>
                </View>
                <View style={styles.destBadge}>
                  <Text style={styles.destBadgeText}>{dest.tag}</Text>
                </View>
                <Text style={styles.destName}>{dest.name}</Text>
                <Text style={styles.destCountry}>{dest.country}</Text>
                <View style={styles.destMeta}>
                  <Text style={styles.destTemp}>{dest.temp}</Text>
                  <Text style={styles.destRating}>⭐ {dest.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Trending Now */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Now 🔥</Text>
        {trending.map((dest, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.trendCard}
            onPress={() => router.push('/create-trip/search-place')}>
            <View style={styles.trendEmoji}>
              <Text style={{ fontSize: 28 }}>{dest.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.trendName}>{dest.name}</Text>
              <Text style={styles.trendCountry}>
                {dest.country} · {dest.temp}
              </Text>
              <View style={styles.trendMeta}>
                <FontAwesome name="star" size={10} color="#C9A84C" />
                <Text style={styles.trendRating}>{dest.rating}</Text>
                <View style={styles.trendBadge}>
                  <Text style={styles.trendBadgeText}>{dest.tag}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.planBtn}
              onPress={() => router.push('/create-trip/search-place')}>
              <Text style={styles.planBtnText}>Plan</Text>
            </TouchableOpacity>
          </TouchableOpacity>
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
    alignItems: 'flex-start', padding: 20, paddingTop: 60,
  },
  greeting: { color: '#6A6865', fontSize: 13 },
  userName: {
    color: '#F0EEE8', fontSize: 22,
    fontWeight: '700', marginTop: 2,
  },
  userSub: { color: '#C9A84C', fontSize: 12, marginTop: 4 },
  notifBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#1E1E23', alignItems: 'center',
    justifyContent: 'center', borderWidth: 0.5,
    borderColor: '#2A2A30',
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#1E1E23', marginHorizontal: 20,
    borderRadius: 50, padding: 14,
    borderWidth: 0.5, borderColor: '#2A2A30', marginBottom: 16,
  },
  searchInput: { flex: 1, color: '#F0EEE8', fontSize: 13 },
  heroCard: {
    marginHorizontal: 20, backgroundColor: '#1C1A10',
    borderRadius: 20, padding: 24, borderWidth: 0.5,
    borderColor: '#C9A84C', marginBottom: 20,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroContent: { flex: 1 },
  heroBadge: {
    backgroundColor: '#C9A84C22', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 50,
    borderWidth: 0.5, borderColor: '#C9A84C',
    alignSelf: 'flex-start', marginBottom: 8,
  },
  heroBadgeText: { color: '#E8C97A', fontSize: 11, fontWeight: '600' },
  heroTitle: {
    color: '#F0EEE8', fontSize: 26,
    fontWeight: '800', marginBottom: 4,
  },
  heroSub: { color: '#A8A6A0', fontSize: 12, marginBottom: 16 },
  exploreBtn: {
    backgroundColor: '#C9A84C', paddingHorizontal: 20,
    paddingVertical: 10, borderRadius: 50, alignSelf: 'flex-start',
  },
  exploreBtnText: { color: '#0D0D0F', fontWeight: '700', fontSize: 13 },
  heroEmoji: { fontSize: 64 },
  quickActions: {
    flexDirection: 'row', marginHorizontal: 20,
    gap: 10, marginBottom: 20,
  },
  quickAction: {
    flex: 1, borderRadius: 14, padding: 12,
    alignItems: 'center', gap: 6,
    borderWidth: 0.5,
  },
  quickActionEmoji: { fontSize: 22 },
  quickActionLabel: { fontSize: 10, fontWeight: '700' },
  categoryRow: { marginBottom: 16 },
  categoryTab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 50, backgroundColor: '#1E1E23',
    borderWidth: 0.5, borderColor: '#2A2A30',
  },
  categoryTabActive: {
    backgroundColor: '#C9A84C', borderColor: '#C9A84C',
  },
  categoryEmoji: { fontSize: 14 },
  categoryText: { color: '#6A6865', fontSize: 12, fontWeight: '600' },
  categoryTextActive: { color: '#0D0D0F' },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, marginBottom: 12,
  },
  sectionTitle: {
    color: '#F0EEE8', fontSize: 16, fontWeight: '700',
    paddingHorizontal: 20, marginBottom: 12,
  },
  sectionCount: { color: '#6A6865', fontSize: 12 },
  emptySearch: {
    alignItems: 'center', padding: 30, gap: 8,
  },
  emptyEmoji: { fontSize: 32 },
  emptyText: { color: '#6A6865', fontSize: 13, textAlign: 'center' },
  destCard: {
    width: 150, backgroundColor: '#1E1E23',
    borderRadius: 18, padding: 16,
    borderWidth: 0.5, borderColor: '#2A2A30',
  },
  destEmoji: {
    width: 60, height: 60, borderRadius: 14,
    backgroundColor: '#26262D', alignItems: 'center',
    justifyContent: 'center', marginBottom: 10,
  },
  destBadge: {
    backgroundColor: '#C9A84C22', paddingHorizontal: 8,
    paddingVertical: 3, borderRadius: 50,
    alignSelf: 'flex-start', marginBottom: 6,
    borderWidth: 0.5, borderColor: '#C9A84C44',
  },
  destBadgeText: { color: '#E8C97A', fontSize: 9, fontWeight: '700' },
  destName: {
    color: '#F0EEE8', fontSize: 14,
    fontWeight: '700', marginBottom: 2,
  },
  destCountry: { color: '#6A6865', fontSize: 11, marginBottom: 8 },
  destMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  destTemp: { color: '#A8A6A0', fontSize: 11 },
  destRating: { color: '#C9A84C', fontSize: 11, fontWeight: '600' },
  trendCard: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, backgroundColor: '#1E1E23',
    borderRadius: 14, padding: 14,
    marginHorizontal: 20, marginBottom: 10,
    borderWidth: 0.5, borderColor: '#2A2A30',
  },
  trendEmoji: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: '#26262D', alignItems: 'center',
    justifyContent: 'center',
  },
  trendName: { color: '#F0EEE8', fontSize: 14, fontWeight: '700' },
  trendCountry: { color: '#6A6865', fontSize: 11, marginTop: 2 },
  trendMeta: {
    flexDirection: 'row', alignItems: 'center',
    gap: 4, marginTop: 6,
  },
  trendRating: { color: '#A8A6A0', fontSize: 11 },
  trendBadge: {
    backgroundColor: '#C9A84C22', paddingHorizontal: 8,
    paddingVertical: 2, borderRadius: 50, marginLeft: 6,
    borderWidth: 0.5, borderColor: '#C9A84C44',
  },
  trendBadgeText: { color: '#E8C97A', fontSize: 10, fontWeight: '600' },
  planBtn: {
    backgroundColor: '#C9A84C', paddingHorizontal: 14,
    paddingVertical: 8, borderRadius: 50,
  },
  planBtnText: { color: '#0D0D0F', fontSize: 12, fontWeight: '700' },
})