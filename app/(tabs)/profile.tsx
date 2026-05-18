import React, { useState } from 'react';
import {
  View, Text, TextInput, Image, StyleSheet,
  TouchableOpacity, ScrollView, Modal, Alert
} from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [loanAmountInput, setLoanAmountInput] = useState('');
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanModal, setLoanModal] = useState(false);
  const [sosModal, setSosModal] = useState(false);
  const [loanPending, setLoanPending] = useState(false);

  const handleLoanRequest = () => {
    if (!loanAmountInput) return;
    setLoanPending(true);
    setTimeout(() => {
      setLoanAmount(prev => prev + parseInt(loanAmountInput));
      setLoanAmountInput('');
      setLoanPending(false);
      setLoanModal(false);
    }, 5000);
  };

  const stats = [
    { label: 'Trips', value: '12' },
    { label: 'Countries', value: '8' },
    { label: 'Places', value: '34' },
  ];

  const menuItems = [
    { icon: 'user-o', label: 'Edit Profile', color: '#C9A84C' },
    { icon: 'history', label: 'Trip History', color: '#378ADD' },
    { icon: 'bell-o', label: 'Notifications', color: '#1D9E75' },
    { icon: 'shield', label: 'Privacy & Security', color: '#7F77DD' },
    { icon: 'question-circle-o', label: 'Help & Support', color: '#D85A30' },
    { icon: 'sign-out', label: 'Logout', color: '#E85454' },
  ];

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
        <View style={styles.avatarWrap}>
          <Image
            source={{ uri: 'https://xsgames.co/randomusers/assets/avatars/male/47.jpg' }}
            style={styles.profileImage}
          />
          <View style={styles.editBadge}>
            <FontAwesome name="camera" size={10} color="#0D0D0F" />
          </View>
        </View>
        <Text style={styles.userName}>Rishu Tripathi</Text>
        <Text style={styles.userSub}>📍 Dehradun, India</Text>
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumText}>✦ Premium Traveller</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {stats.map((stat, idx) => (
          <View key={idx} style={styles.statBox}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Holidate Wallet */}
      <View style={styles.walletCard}>
        <View style={styles.walletLeft}>
          <Text style={styles.walletLabel}>Holidate Wallet 💳</Text>
          <Text style={styles.walletAmount}>
            ₹{loanAmount.toLocaleString()}
          </Text>
          <Text style={styles.walletSub}>Available Balance</Text>
        </View>
        <TouchableOpacity
          style={styles.loanBtn}
          onPress={() => setLoanModal(true)}
        >
          <FontAwesome name="plus" size={13} color="#0D0D0F" />
          <Text style={styles.loanBtnText}>Get Loan</Text>
        </TouchableOpacity>
      </View>

      {/* Emergency SOS */}
      <TouchableOpacity
        style={styles.sosCard}
        onPress={() => setSosModal(true)}
      >
        <View style={styles.sosPulse}>
          <FontAwesome5 name="phone-alt" size={20} color="#fff" />
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

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: item.color + '22' }]}>
              <FontAwesome name={item.icon as any} size={16} color={item.color} />
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
              value={loanAmountInput}
              onChangeText={setLoanAmountInput}
            />

            <TouchableOpacity
              style={[styles.submitBtn, loanPending && { opacity: 0.6 }]}
              onPress={handleLoanRequest}
              disabled={loanPending}
            >
              <Text style={styles.submitText}>
                {loanPending ? 'Processing... ⏳' : 'Request Loan'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              setLoanModal(false)
              setLoanAmountInput('')
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
              <FontAwesome5 name="phone-alt" size={32} color="#fff" />
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
  );
};

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
    borderWidth: 2.5, borderColor: '#C9A84C' },
  editBadge: { position: 'absolute', bottom: 0, right: 0,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#C9A84C', alignItems: 'center',
    justifyContent: 'center', borderWidth: 2, borderColor: '#0D0D0F' },
  userName: { color: '#F0EEE8', fontSize: 20, fontWeight: '700' },
  userSub: { color: '#6A6865', fontSize: 12, marginTop: 4 },
  premiumBadge: { marginTop: 10, backgroundColor: '#C9A84C22',
    borderWidth: 0.5, borderColor: '#C9A84C',
    paddingHorizontal: 14, paddingVertical: 5, borderRadius: 50 },
  premiumText: { color: '#E8C97A', fontSize: 12, fontWeight: '600' },

  statsRow: { flexDirection: 'row', marginHorizontal: 20,
    marginBottom: 20, gap: 10 },
  statBox: { flex: 1, backgroundColor: '#1E1E23', borderRadius: 14,
    padding: 14, alignItems: 'center',
    borderWidth: 0.5, borderColor: '#2A2A30' },
  statValue: { color: '#E8C97A', fontSize: 22, fontWeight: '700' },
  statLabel: { color: '#6A6865', fontSize: 11, marginTop: 2 },

  walletCard: { marginHorizontal: 20, backgroundColor: '#1C1A10',
    borderRadius: 18, padding: 20, borderWidth: 0.5,
    borderColor: '#C9A84C', marginBottom: 12,
    flexDirection: 'row', alignItems: 'center' },
  walletLeft: { flex: 1 },
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
    backgroundColor: '#E85454', alignItems: 'center', justifyContent: 'center' },
  sosTitle: { color: '#F0EEE8', fontSize: 14, fontWeight: '700' },
  sosSub: { color: '#A8A6A0', fontSize: 12, marginTop: 2 },
  sosLive: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sosDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#5DCAA5' },
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
  modalCard: { backgroundColor: '#161619', borderTopLeftRadius: 28,
    borderTopRightRadius: 28, padding: 28,
    borderTopWidth: 0.5, borderColor: '#2A2A30' },
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
    paddingVertical: 14, paddingHorizontal: 40,
    marginTop: 10 },
  sosCallText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default ProfileScreen;