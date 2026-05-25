import { View, Text, ScrollView, TouchableOpacity,
StyleSheet, TextInput, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'

const HOTELS = [
  {
    id: 1, name: 'The Ritz Carlton', city: 'Bali',
    price: 15000, rating: 4.9, emoji: '🏨',
    amenities: ['Pool', 'Spa', 'Gym', 'WiFi'],
    type: 'Luxury', available: true,
    desc: 'Stunning ocean view luxury resort with world-class amenities.'
  },
  {
    id: 2, name: 'Park Hyatt', city: 'Paris',
    price: 22000, rating: 4.8, emoji: '🏩',
    amenities: ['Restaurant', 'Bar', 'Spa', 'WiFi'],
    type: 'Luxury', available: true,
    desc: 'Iconic Parisian luxury hotel near the Eiffel Tower.'
  },
  {
    id: 3, name: 'Kumarakom Lake Resort', city: 'Kerala',
    price: 8500, rating: 4.7, emoji: '🌿',
    amenities: ['Pool', 'Ayurveda', 'Boating', 'WiFi'],
    type: 'Resort', available: true,
    desc: 'Serene backwater resort with traditional Kerala architecture.'
  },
  {
    id: 4, name: 'Burj Al Arab', city: 'Dubai',
    price: 45000, rating: 5.0, emoji: '🌟',
    amenities: ['Private Beach', 'Helipad', 'Butler', 'Pool'],
    type: 'Ultra Luxury', available: true,
    desc: "World's most luxurious hotel with iconic sail-shaped design."
  },
  {
    id: 5, name: 'Aman Tokyo', city: 'Tokyo',
    price: 35000, rating: 4.9, emoji: '🗾',
    amenities: ['Spa', 'Pool', 'Dojo', 'WiFi'],
    type: 'Luxury', available: false,
    desc: 'Contemporary luxury sanctuary in the heart of Tokyo.'
  },
  {
    id: 6, name: 'Marina Bay Sands', city: 'Singapore',
    price: 28000, rating: 4.8, emoji: '🦁',
    amenities: ['Infinity Pool', 'Casino', 'Mall', 'WiFi'],
    type: 'Luxury', available: true,
    desc: 'Iconic hotel with the world-famous rooftop infinity pool.'
  },
  {
    id: 7, name: 'Taj Mahal Palace', city: 'Mumbai',
    price: 12000, rating: 4.8, emoji: '🕌',
    amenities: ['Pool', 'Spa', 'Restaurant', 'WiFi'],
    type: 'Heritage', available: true,
    desc: 'Historic luxury hotel overlooking the Gateway of India.'
  },
  {
    id: 8, name: 'Zostel Backpackers', city: 'Goa',
    price: 800, rating: 4.2, emoji: '🏖️',
    amenities: ['WiFi', 'Common Area', 'Tours', 'Bar'],
    type: 'Budget', available: true,
    desc: 'Fun backpacker hostel perfect for solo travelers.'
  },
]

const CITIES = ['All', 'Bali', 'Paris', 'Kerala', 'Dubai', 'Tokyo', 'Singapore', 'Mumbai', 'Goa']
const TYPES = ['All', 'Luxury', 'Resort', 'Heritage', 'Budget', 'Ultra Luxury']

export default function Hotels() {
  const [search, setSearch] = useState('')
  const [activeCity, setActiveCity] = useState('All')
  const [activeType, setActiveType] = useState('All')
  const [selectedHotel, setSelectedHotel] = useState<any>(null)
  const [bookingModal, setBookingModal] = useState(false)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2')
  const [booking, setBooking] = useState(false)
  const [booked, setBooked] = useState(false)

  const filtered = HOTELS.filter(h => {
    const matchSearch = h.name.toLowerCase()
      .includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase())
    const matchCity = activeCity === 'All' || h.city === activeCity
    const matchType = activeType === 'All' || h.type === activeType
    return matchSearch && matchCity && matchType
  })

  const handleBook = () => {
    if (!checkIn || !checkOut) return
    setBooking(true)
    setTimeout(() => {
      setBooking(false)
      setBooked(true)
    }, 2000)
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Hotel Booking 🏨</Text>
          <Text style={styles.subtitle}>Find your perfect stay</Text>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={14} color="#6A6865" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search hotels or cities..."
            placeholderTextColor="#6A6865"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* City Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
          {CITIES.map((city, idx) => (
            <TouchableOpacity key={idx}
              style={[styles.filterTab,
                activeCity === city && styles.filterTabActive]}
              onPress={() => setActiveCity(city)}>
              <Text style={[styles.filterText,
                activeCity === city && styles.filterTextActive]}>
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Type Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
          {TYPES.map((type, idx) => (
            <TouchableOpacity key={idx}
              style={[styles.typeTab,
                activeType === type && styles.typeTabActive]}
              onPress={() => setActiveType(type)}>
              <Text style={[styles.typeText,
                activeType === type && styles.typeTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        <Text style={styles.resultsText}>
          {filtered.length} hotels found
        </Text>

        {/* Hotel Cards */}
        {filtered.map(hotel => (
          <TouchableOpacity
            key={hotel.id}
            style={styles.hotelCard}
            onPress={() => {
              setSelectedHotel(hotel)
              setBooked(false)
              setBookingModal(true)
            }}>
            {/* Hotel Image Placeholder */}
            <View style={styles.hotelImage}>
              <Text style={styles.hotelEmoji}>{hotel.emoji}</Text>
              <View style={[styles.typeBadge, {
                backgroundColor: hotel.type === 'Budget'
                  ? '#1D9E7522' : '#C9A84C22',
                borderColor: hotel.type === 'Budget'
                  ? '#1D9E75' : '#C9A84C',
              }]}>
                <Text style={[styles.typeBadgeText, {
                  color: hotel.type === 'Budget'
                    ? '#1D9E75' : '#E8C97A'
                }]}>
                  {hotel.type}
                </Text>
              </View>
              {!hotel.available && (
                <View style={styles.unavailableBadge}>
                  <Text style={styles.unavailableText}>Fully Booked</Text>
                </View>
              )}
            </View>

            {/* Hotel Info */}
            <View style={styles.hotelInfo}>
              <View style={styles.hotelHeader}>
                <Text style={styles.hotelName}>{hotel.name}</Text>
                <View style={styles.ratingBox}>
                  <FontAwesome name="star" size={10} color="#C9A84C" />
                  <Text style={styles.ratingText}>{hotel.rating}</Text>
                </View>
              </View>

              <View style={styles.locationRow}>
                <FontAwesome name="map-marker" size={11} color="#6A6865" />
                <Text style={styles.locationText}>{hotel.city}</Text>
              </View>

              <Text style={styles.hotelDesc} numberOfLines={2}>
                {hotel.desc}
              </Text>

              {/* Amenities */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}
                style={{ marginTop: 8 }}
                contentContainerStyle={{ gap: 6 }}>
                {hotel.amenities.map((a, i) => (
                  <View key={i} style={styles.amenityTag}>
                    <Text style={styles.amenityText}>{a}</Text>
                  </View>
                ))}
              </ScrollView>

              {/* Price & Book */}
              <View style={styles.priceRow}>
                <View>
                  <Text style={styles.priceLabel}>Per night</Text>
                  <Text style={styles.priceText}>
                    ₹{hotel.price.toLocaleString()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.bookBtn,
                    !hotel.available && { opacity: 0.5 }]}
                  disabled={!hotel.available}
                  onPress={() => {
                    setSelectedHotel(hotel)
                    setBooked(false)
                    setBookingModal(true)
                  }}>
                  <Text style={styles.bookBtnText}>
                    {hotel.available ? 'Book Now' : 'Unavailable'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Booking Modal */}
      <Modal visible={bookingModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {booked ? (
              // Success Screen
              <View style={styles.successBox}>
                <Text style={styles.successEmoji}>🎉</Text>
                <Text style={styles.successTitle}>Booking Confirmed!</Text>
                <Text style={styles.successText}>
                  {selectedHotel?.name} in {selectedHotel?.city}
                </Text>
                <View style={styles.successDetails}>
                  <Text style={styles.successDetail}>
                    📅 {checkIn} → {checkOut}
                  </Text>
                  <Text style={styles.successDetail}>
                    👥 {guests} Guests
                  </Text>
                  <Text style={styles.successDetail}>
                    💰 ₹{selectedHotel?.price.toLocaleString()}/night
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={() => {
                    setBookingModal(false)
                    setCheckIn('')
                    setCheckOut('')
                    setGuests('2')
                  }}>
                  <Text style={styles.submitText}>Done ✅</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Booking Form
              <>
                <Text style={styles.modalTitle}>
                  Book {selectedHotel?.name} 🏨
                </Text>
                <Text style={styles.modalSubtitle}>
                  {selectedHotel?.city} · ⭐ {selectedHotel?.rating}
                </Text>

                <Text style={styles.inputLabel}>Check-in Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#6A6865"
                  value={checkIn}
                  onChangeText={setCheckIn}
                />

                <Text style={styles.inputLabel}>Check-out Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="#6A6865"
                  value={checkOut}
                  onChangeText={setCheckOut}
                />

                <Text style={styles.inputLabel}>Number of Guests</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2"
                  placeholderTextColor="#6A6865"
                  keyboardType="numeric"
                  value={guests}
                  onChangeText={setGuests}
                />

                {/* Price Summary */}
                <View style={styles.priceSummary}>
                  <Text style={styles.priceSummaryText}>
                    💰 ₹{selectedHotel?.price.toLocaleString()} × 1 night
                  </Text>
                  <Text style={styles.priceSummaryTotal}>
                    Total: ₹{selectedHotel?.price.toLocaleString()}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.submitBtn,
                    (!checkIn || !checkOut || booking) && { opacity: 0.5 }]}
                  onPress={handleBook}
                  disabled={!checkIn || !checkOut || booking}>
                  {booking
                    ? <ActivityIndicator color="#0D0D0F" />
                    : <Text style={styles.submitText}>Confirm Booking 🏨</Text>
                  }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  setBookingModal(false)
                  setCheckIn('')
                  setCheckOut('')
                }}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0F' },
  header: { padding: 20, paddingTop: 60 },
  title: { color: '#F0EEE8', fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#6A6865', fontSize: 13, marginTop: 4 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#1E1E23', marginHorizontal: 20,
    borderRadius: 50, padding: 14,
    borderWidth: 0.5, borderColor: '#2A2A30', marginBottom: 12,
  },
  searchInput: { flex: 1, color: '#F0EEE8', fontSize: 13 },
  filterRow: { marginBottom: 10 },
  filterTab: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 50, backgroundColor: '#1E1E23',
    borderWidth: 0.5, borderColor: '#2A2A30',
  },
  filterTabActive: { backgroundColor: '#C9A84C', borderColor: '#C9A84C' },
  filterText: { color: '#6A6865', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#0D0D0F' },
  typeTab: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 50, backgroundColor: '#1E1E23',
    borderWidth: 0.5, borderColor: '#2A2A30',
  },
  typeTabActive: { backgroundColor: '#378ADD', borderColor: '#378ADD' },
  typeText: { color: '#6A6865', fontSize: 11, fontWeight: '600' },
  typeTextActive: { color: '#fff' },
  resultsText: {
    color: '#6A6865', fontSize: 12,
    paddingHorizontal: 20, marginBottom: 12,
  },
  hotelCard: {
    backgroundColor: '#1E1E23', marginHorizontal: 20,
    borderRadius: 18, marginBottom: 16,
    borderWidth: 0.5, borderColor: '#2A2A30',
    overflow: 'hidden',
  },
  hotelImage: {
    height: 120, backgroundColor: '#26262D',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  hotelEmoji: { fontSize: 48 },
  typeBadge: {
    position: 'absolute', top: 10, left: 10,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 50, borderWidth: 0.5,
  },
  typeBadgeText: { fontSize: 10, fontWeight: '700' },
  unavailableBadge: {
    position: 'absolute', top: 10, right: 10,
    backgroundColor: '#E8545422', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 50,
    borderWidth: 0.5, borderColor: '#E85454',
  },
  unavailableText: { color: '#E85454', fontSize: 10, fontWeight: '700' },
  hotelInfo: { padding: 16 },
  hotelHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 4,
  },
  hotelName: { color: '#F0EEE8', fontSize: 15, fontWeight: '700' },
  ratingBox: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#C9A84C22', paddingHorizontal: 8,
    paddingVertical: 3, borderRadius: 50,
  },
  ratingText: { color: '#E8C97A', fontSize: 11, fontWeight: '700' },
  locationRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 4, marginBottom: 8,
  },
  locationText: { color: '#6A6865', fontSize: 11 },
  hotelDesc: { color: '#A8A6A0', fontSize: 12, lineHeight: 16 },
  amenityTag: {
    backgroundColor: '#26262D', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 50,
    borderWidth: 0.5, borderColor: '#2A2A30',
  },
  amenityText: { color: '#A8A6A0', fontSize: 10 },
  priceRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 12,
    paddingTop: 12, borderTopWidth: 0.5, borderTopColor: '#2A2A30',
  },
  priceLabel: { color: '#6A6865', fontSize: 10 },
  priceText: { color: '#E8C97A', fontSize: 18, fontWeight: '700' },
  bookBtn: {
    backgroundColor: '#C9A84C', paddingHorizontal: 20,
    paddingVertical: 10, borderRadius: 50,
  },
  bookBtnText: { color: '#0D0D0F', fontSize: 13, fontWeight: '700' },
  modalOverlay: {
    flex: 1, backgroundColor: '#00000099',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#161619',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 28, borderTopWidth: 0.5, borderColor: '#2A2A30',
  },
  modalTitle: {
    color: '#F0EEE8', fontSize: 20,
    fontWeight: '700', marginBottom: 4,
  },
  modalSubtitle: { color: '#6A6865', fontSize: 13, marginBottom: 20 },
  inputLabel: {
    color: '#A8A6A0', fontSize: 12,
    fontWeight: '600', marginBottom: 8,
  },
  input: {
    backgroundColor: '#1E1E23', borderRadius: 12,
    padding: 14, color: '#F0EEE8', fontSize: 14,
    borderWidth: 0.5, borderColor: '#2A2A30', marginBottom: 14,
  },
  priceSummary: {
    backgroundColor: '#1C1A10', borderRadius: 12,
    padding: 14, marginBottom: 16,
    borderWidth: 0.5, borderColor: '#C9A84C',
  },
  priceSummaryText: { color: '#A8A6A0', fontSize: 13 },
  priceSummaryTotal: {
    color: '#E8C97A', fontSize: 16,
    fontWeight: '700', marginTop: 6,
  },
  submitBtn: {
    backgroundColor: '#C9A84C', borderRadius: 50,
    padding: 15, alignItems: 'center', marginBottom: 4,
  },
  submitText: { color: '#0D0D0F', fontSize: 15, fontWeight: '700' },
  cancelText: {
    color: '#6A6865', fontSize: 14,
    textAlign: 'center', marginTop: 14,
  },
  successBox: { alignItems: 'center', gap: 12 },
  successEmoji: { fontSize: 52 },
  successTitle: {
    color: '#F0EEE8', fontSize: 22, fontWeight: '700',
  },
  successText: { color: '#6A6865', fontSize: 14 },
  successDetails: {
    backgroundColor: '#1C1A10', borderRadius: 14,
    padding: 16, width: '100%', gap: 8,
    borderWidth: 0.5, borderColor: '#C9A84C',
  },
  successDetail: { color: '#A8A6A0', fontSize: 13 },
})