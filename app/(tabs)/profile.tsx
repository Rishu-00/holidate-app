import { View, Text, StyleSheet, TouchableOpacity,
ScrollView, Modal, TextInput, ActivityIndicator,
Alert, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { auth, db } from '@/configs/firebaseConfig'
import { signOut, updateProfile } from 'firebase/auth'
import { collection, getDocs, query, where,
addDoc, updateDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import { useRouter } from 'expo-router'

export default function Profile() {
  const [loanModal, setLoanModal] = useState(false)
  const [sosModal, setSosModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [loanAmount, setLoanAmount] = useState(0)
  const [loanInput, setLoanInput] = useState('')
  const [loanPending, setLoanPending] = useState(false)
  const [tripCount, setTripCount] = useState(0)
  const [expenseCount, setExpenseCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [newName, setNewName] = useState('')
  const router = useRouter()
  const user = auth.currentUser

  useEffect(() => {
    fetchUserData()
    setDisplayName(user?.displayName || user?.email?.split('@')[0] || 'Traveller')
  }, [])

  const fetchUserData = async () => {
    if (!user) return
    setLoading(true)
    try {
      // Fetch trips count
      const tripsQ = query(
        collection(db, 'UserTrips'),
        where('userEmail', '==', user.email)
      )
      const tripsSnap = await getDocs(tripsQ)
      setTripCount(tripsSnap.size)

      // Fetch expenses count
      const expQ = query(
        collection(db, 'expenses'),
        where('userEmail', '==', user.email)
      )
      const expSnap = await getDocs(expQ)
      setExpenseCount(expSnap.size)

      // Fetch wallet balance
      const walletRef = doc(db, 'wallets', user.uid)
      const walletSnap = await getDoc(walletRef)
      if (walletSnap.exists()) {
        setLoanAmount(walletSnap.data().balance || 0)
      }
    } catch (err) {
      console.log('Fetch error:', err)
    }
    setLoading(false)
  }

  const handleLoanRequest = async () => {
    if (!loanInput || !user) return
    setLoanPending(true)
    setTimeout(async () => {
      try {
        const newBalance = loanAmount + parseInt(loanInput)
        await setDoc(doc(db, 'wallets', user.uid), {
          balance: newBalance,
          userEmail: user.email,
          updatedAt: new Date().toISOString(),
        })
        setLoanAmount(newBalance)
        setLoanInput('')
        setLoanModal(false)
      } catch (err) {
        console.log('Loan error:', err)
      }
      setLoanPending(false)
    }, 3000)
  }

  const handleUpdateName = async () => {
    if (!newName.trim() || !user) return
    try {
      await updateProfile(user, { displayName: newName })
      setDisplayName(newName)
      setNewName('')
      setEditModal(false)
    } catch (err) {
      console.log('Update error:', err)
    }
  }

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut(auth)
            router.replace('/')
          }
        }
      ]
    )
  }

  const menuItems = [
    { icon: 'user-o', label: 'Edit Profile',
      color: '#C9A84C', onPress: () => setEditModal(true) },
    { icon: 'history', label: 'Trip History',
      color: '#378ADD', onPress: () => {} },
    { icon: 'bell-o', label: 'Notifications',
      color: '#1D9E75', onPress: () => {} },
    { icon: 'shield', label: 'Privacy & Security',
      color: '#7F77DD', onPress: () => {} },
    { icon: 'question-circle-o', label: 'Help & Support',
      color: '#D85A30', onPress: () => {} },
    { icon: 'sign-out', label: 'Logout',
      color: '#E85454', onPress: handleLogout },
  ]

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <FontAwesome name="cog" size={20} color="#A8A6A0" />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <TouchableOpacity style={styles.avatarWrap}
          onPress={() => setEditModal(true)}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }}
              style={styles.profileImage} />
          ) : (
            <View style={styles.profileImage}>
              <Text style={styles.avatarInitial}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.editBadge}>
            <FontAwesome name="camera" size={10} color="#0D0D0F" />
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{displayName}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumText}>✦ Premium Traveller</Text>
        </View>
      </View>

      {/* Stats */}
      {loading ? (
        <ActivityIndicator color="#C9A84C" style={{ marginBottom: 20 }} />
      ) : (
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{tripCount}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{expenseCount}</Text>
            <Text style={styles.statLabel}>Expenses</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime)
                    .toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
                : 'New'}
            </Text>
            <Text style={styles.statLabel}>Joined</Text>
          </View>
        </View>
      )}

      {/* Wallet */}
      <View style={styles.walletCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.walletLabel}>Holidate Wallet 💳</Text>
          <Text style={styles.walletAmount}>
            ₹{loanAmount.toLocaleString()}
          </Text>
          <Text style={styles.walletSub}>Available Balance</Text>
        </View>
        <TouchableOpacity style={styles.loanBtn}
          onPress={() => setLoanModal(true)}>
          <FontAwesome name="plus" size={13} color="#0D0D0F" />
          <Text style={styles.loanBtnText}>Get Loan</Text>
        </TouchableOpacity>
      </View>

      {/* SOS */}
      <TouchableOpacity style={styles.sosCard}
        onPress={() => setSosModal(true)}>
        <View style={styles.sosPulse}>
          <FontAwesome name="phone" size={20} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.sosTitle}>Emergency SOS</Text>
          <Text style={styles.sosSub}>Tap to call · 112</Text>
        </View>
        <View style={styles.sosLive}>
          <View style={styles.sosDot} />
          <Text style={styles.sosLiveText}>Active</Text>
        </View>
      </TouchableOpacity>

      {/* Menu */}
      <View style={styles.menuSection}>
        {menuItems.map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.menuItem}
            onPress={item.onPress}>
            <View style={[styles.menuIcon,
              { backgroundColor: item.color + '22' }]}>
              <FontAwesome name={item.icon as any}
                size={16} color={item.color} />
            </View>
            <Text style={[styles.menuLabel,
              item.label === 'Logout' && { color: '#E85454' }]}>
              {item.label}
            </Text>
            <FontAwesome name="chevron-right" size={12} color="#2A2A30" />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.version}>Holidate v1.0.0 · Made with ❤️</Text>
      <View style={{ height: 30 }} />

      {/* Edit Profile Modal */}
      <Modal visible={editModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profile ✏️</Text>
            <Text style={styles.modalSub}>Update your display name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new name"
              placeholderTextColor="#6A6865"
              value={newName}
              onChangeText={setNewName}
            />
            <TouchableOpacity style={styles.submitBtn}
              onPress={handleUpdateName}>
              <Text style={styles.submitText}>Update Name</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Loan Modal */}
      <Modal visible={loanModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>💳 Get Travel Loan</Text>
            <Text style={styles.modalSub}>
              Amount will be credited to your Holidate Wallet
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter loan amount (₹)"
              placeholderTextColor="#6A6865"
              keyboardType="numeric"
              value={loanInput}
              onChangeText={setLoanInput}
            />
            <TouchableOpacity
              style={[styles.submitBtn, loanPending && { opacity: 0.6 }]}
              onPress={handleLoanRequest}
              disabled={loanPending}>
              <Text style={styles.submitText}>
                {loanPending ? 'Processing... ⏳' : 'Request Loan'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setLoanModal(false)
              setLoanInput('')
            }}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SOS Modal */}
      <Modal visible={sosModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { alignItems: 'center' }]}>
            <View style={styles.sosIconBig}>
              <FontAwesome name="phone" size={32} color="#fff" />
            </View>
            <Text style={styles.modalTitle}>Emergency SOS</Text>
            <Text style={styles.modalSub}>
              This will call emergency services immediately
            </Text>
            <Text style={styles.sosNumberBig}>112</Text>
            <TouchableOpacity style={styles.sosCallBtn}
              onPress={() => {
                setSosModal(false)
                Alert.alert('SOS', 'Calling 112...')
              }}>
              <Text style={styles.sosCallText}>📞 Call Now</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSosModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0F' },
  header: { flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 20, paddingTop: 60 },
  headerTitle: { color: '#F0EEE8', fontSize: 22, fontWeight: '700' },
  settingsBtn: { width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#1E1E23', alignItems: 'center',
    justifyContent: 'center', borderWidth: 0.5, borderColor: '#2A2A30' },
  profileCard: { alignItems: 'center', paddingVertical: 20 },
  avatarWrap: { position: 'relative', marginBottom: 14 },
  profileImage: { width: 90, height: 90, borderRadius: 45,
    borderWidth: 2.5, borderColor: '#C9A84C',
    backgroundColor: '#C9A84C22', alignItems: 'center',
    justifyContent: 'center' },
  avatarInitial: { color: '#C9A84C', fontSize: 36, fontWeight: '700' },
  editBadge: { position: 'absolute', bottom: 0, right: 0,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#C9A84C', alignItems: 'center',
    justifyContent: 'center', borderWidth: 2, borderColor: '#0D0D0F' },
  userName: { color: '#F0EEE8', fontSize: 20, fontWeight: '700' },
  userEmail: { color: '#6A6865', fontSize: 12, marginTop: 4 },
  premiumBadge: { marginTop: 10, backgroundColor: '#C9A84C22',
    borderWidth: 0.5, borderColor: '#C9A84C',
    paddingHorizontal: 14, paddingVertical: 5, borderRadius: 50 },
  premiumText: { color: '#E8C97A', fontSize: 12, fontWeight: '600' },
  statsRow: { flexDirection: 'row', marginHorizontal: 20,
    marginBottom: 20, gap: 10 },
  statBox: { flex: 1, backgroundColor: '#1E1E23', borderRadius: 14,
    padding: 14, alignItems: 'center',
    borderWidth: 0.5, borderColor: '#2A2A30' },
  statValue: { color: '#E8C97A', fontSize: 18, fontWeight: '700' },
  statLabel: { color: '#6A6865', fontSize: 11, marginTop: 2 },
  walletCard: { marginHorizontal: 20, backgroundColor: '#1C1A10',
    borderRadius: 18, padding: 20, borderWidth: 0.5,
    borderColor: '#C9A84C', marginBottom: 12,
    flexDirection: 'row', alignItems: 'center' },
  walletLabel: { color: '#A8A6A0', fontSize: 12 },
  walletAmount: { color: '#E8C97A', fontSize: 30,
    fontWeight: '700', marginTop: 4 },
  walletSub: { color: '#6A6865', fontSize: 11, marginTop: 2 },
  loanBtn: { flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#C9A84C', paddingHorizontal: 14,
    paddingVertical: 10, borderRadius: 50 },
  loanBtnText: { color: '#0D0D0F', fontSize: 13, fontWeight: '700' },
  sosCard: { marginHorizontal: 20, backgroundColor: '#2A0A0A',
    borderRadius: 18, padding: 18, borderWidth: 0.5,
    borderColor: '#E85454', marginBottom: 20,
    flexDirection: 'row', alignItems: 'center', gap: 14 },
  sosPulse: { width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#E85454', alignItems: 'center',
    justifyContent: 'center' },
  sosTitle: { color: '#F0EEE8', fontSize: 14, fontWeight: '700' },
  sosSub: { color: '#A8A6A0', fontSize: 12, marginTop: 2 },
  sosLive: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sosDot: { width: 7, height: 7, borderRadius: 4,
    backgroundColor: '#5DCAA5' },
  sosLiveText: { color: '#5DCAA5', fontSize: 11, fontWeight: '600' },
  menuSection: { marginHorizontal: 20, backgroundColor: '#161619',
    borderRadius: 18, borderWidth: 0.5,
    borderColor: '#2A2A30', overflow: 'hidden', marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center',
    gap: 14, padding: 16,
    borderBottomWidth: 0.5, borderBottomColor: '#2A2A30' },
  menuIcon: { width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, color: '#F0EEE8', fontSize: 14 },
  version: { color: '#2A2A30', fontSize: 11,
    textAlign: 'center', marginBottom: 10 },
  modalOverlay: { flex: 1, backgroundColor: '#00000099',
    justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#161619',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 28, borderTopWidth: 0.5, borderColor: '#2A2A30' },
  modalTitle: { color: '#F0EEE8', fontSize: 20,
    fontWeight: '700', marginBottom: 6 },
  modalSub: { color: '#6A6865', fontSize: 13, marginBottom: 20 },
  input: { backgroundColor: '#1E1E23', borderRadius: 12,
    padding: 14, color: '#F0EEE8', fontSize: 14,
    borderWidth: 0.5, borderColor: '#2A2A30', marginBottom: 14 },
  submitBtn: { backgroundColor: '#C9A84C', borderRadius: 50,
    padding: 15, alignItems: 'center', marginBottom: 4 },
  submitText: { color: '#0D0D0F', fontSize: 15, fontWeight: '700' },
  cancelText: { color: '#6A6865', fontSize: 14,
    textAlign: 'center', marginTop: 14 },
  sosIconBig: { width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#E85454', alignItems: 'center',
    justifyContent: 'center', marginBottom: 16 },
  sosNumberBig: { color: '#E85454', fontSize: 48,
    fontWeight: '800', marginVertical: 10 },
  sosCallBtn: { backgroundColor: '#E85454', borderRadius: 50,
    paddingVertical: 14, paddingHorizontal: 40, marginTop: 10 },
  sosCallText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})