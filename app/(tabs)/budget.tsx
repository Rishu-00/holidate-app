import { View, Text, ScrollView, 
TouchableOpacity, StyleSheet, Modal,
TextInput } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'

const categories = [
  { label: 'Flights', color: '#C9A84C', emoji: '✈️', amount: 24500 },
  { label: 'Hotels', color: '#378ADD', emoji: '🏨', amount: 14200 },
  { label: 'Food', color: '#1D9E75', emoji: '🍽️', amount: 5800 },
  { label: 'Activities', color: '#D85A30', emoji: '🎯', amount: 3700 },
  { label: 'Transport', color: '#7F77DD', emoji: '🚗', amount: 0 },
]

export default function Budget() {
  const [modal, setModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [expenses, setExpenses] = useState([
    { id: 1, label: 'Flight DEL→DPS', amount: 24500, emoji: '✈️', date: 'Dec 20' },
    { id: 2, label: 'Mulia Resort', amount: 14200, emoji: '🏨', date: 'Dec 20' },
    { id: 3, label: 'Warung Mak Beng', amount: 850, emoji: '🍽️', date: 'Dec 21' },
    { id: 4, label: 'Ubud Rafting', amount: 3700, emoji: '🎯', date: 'Dec 22' },
  ])

  const total = 70000
  const spent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const remaining = total - spent
  const percent = Math.round((spent / total) * 100)

  const addExpense = () => {
    if (!amount) return
    setExpenses(prev => [...prev, {
      id: Date.now(),
      label: note || 'New Expense',
      amount: parseInt(amount),
      emoji: '💸',
      date: 'Today'
    }])
    setAmount('')
    setNote('')
    setModal(false)
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Budget Tracker 💰</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModal(true)}>
          <FontAwesome name="plus" size={16} color="#0D0D0F" />
        </TouchableOpacity>
      </View>

      {/* Total Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Spent</Text>
        <Text style={styles.totalAmount}>₹{spent.toLocaleString()}</Text>
        <Text style={styles.totalSub}>of ₹{total.toLocaleString()} budget · Bali Trip</Text>

        {/* Progress Bar */}
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${percent}%` }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLeft}>{percent}% used</Text>
          <Text style={styles.progressRight}>₹{remaining.toLocaleString()} left</Text>
        </View>
      </View>

      {/* Category Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>By Category</Text>
        {categories.map((cat, idx) => (
          <View key={idx} style={styles.catRow}>
            <View style={[styles.catDot, { backgroundColor: cat.color }]} />
            <Text style={styles.catEmoji}>{cat.emoji}</Text>
            <Text style={styles.catLabel}>{cat.label}</Text>
            <View style={styles.catBarBg}>
              <View style={[styles.catBarFill, {
                width: cat.amount > 0 ? `${Math.round((cat.amount / spent) * 100)}%` : '0%',
                backgroundColor: cat.color
              }]} />
            </View>
            <Text style={styles.catAmount}>
              {cat.amount > 0 ? `₹${cat.amount.toLocaleString()}` : '—'}
            </Text>
          </View>
        ))}
      </View>

      {/* Recent Expenses */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        {expenses.map((exp) => (
          <View key={exp.id} style={styles.expenseCard}>
            <View style={styles.expenseIcon}>
              <Text style={{ fontSize: 20 }}>{exp.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.expenseLabel}>{exp.label}</Text>
              <Text style={styles.expenseDate}>{exp.date}</Text>
            </View>
            <Text style={styles.expenseAmount}>₹{exp.amount.toLocaleString()}</Text>
          </View>
        ))}
      </View>

      <View style={{ height: 20 }} />

      {/* Add Expense Modal */}
      <Modal visible={modal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Log Expense</Text>

            <TextInput
              style={styles.input}
              placeholder="Amount (₹)"
              placeholderTextColor="#6A6865"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <TextInput
              style={styles.input}
              placeholder="Note (optional)"
              placeholderTextColor="#6A6865"
              value={note}
              onChangeText={setNote}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={addExpense}>
              <Text style={styles.submitText}>Add Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModal(false)}>
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
  title: { color: '#F0EEE8', fontSize: 22, fontWeight: '700' },
  addBtn: { width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#C9A84C', alignItems: 'center', justifyContent: 'center' },
  totalCard: { marginHorizontal: 20, backgroundColor: '#1C1A10',
    borderRadius: 20, padding: 24, borderWidth: 0.5,
    borderColor: '#C9A84C', marginBottom: 24 },
  totalLabel: { color: '#A8A6A0', fontSize: 13, textAlign: 'center' },
  totalAmount: { color: '#E8C97A', fontSize: 42, fontWeight: '700',
    textAlign: 'center', marginTop: 4 },
  totalSub: { color: '#6A6865', fontSize: 12, textAlign: 'center', marginTop: 4 },
  progressBg: { height: 6, backgroundColor: '#26262D',
    borderRadius: 4, marginTop: 20, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4,
    backgroundColor: '#C9A84C' },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  progressLeft: { color: '#A8A6A0', fontSize: 11 },
  progressRight: { color: '#5DCAA5', fontSize: 11 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { color: '#F0EEE8', fontSize: 15, fontWeight: '600', marginBottom: 14 },
  catRow: { flexDirection: 'row', alignItems: 'center',
    gap: 8, marginBottom: 14 },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  catEmoji: { fontSize: 16 },
  catLabel: { color: '#A8A6A0', fontSize: 12, width: 70 },
  catBarBg: { flex: 1, height: 4, backgroundColor: '#26262D',
    borderRadius: 2, overflow: 'hidden' },
  catBarFill: { height: '100%', borderRadius: 2 },
  catAmount: { color: '#F0EEE8', fontSize: 12,
    fontWeight: '600', width: 70, textAlign: 'right' },
  expenseCard: { flexDirection: 'row', alignItems: 'center',
    gap: 12, backgroundColor: '#1E1E23', borderRadius: 14,
    padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: '#2A2A30' },
  expenseIcon: { width: 44, height: 44, borderRadius: 10,
    backgroundColor: '#26262D', alignItems: 'center', justifyContent: 'center' },
  expenseLabel: { color: '#F0EEE8', fontSize: 13, fontWeight: '500' },
  expenseDate: { color: '#6A6865', fontSize: 11, marginTop: 2 },
  expenseAmount: { color: '#E8C97A', fontSize: 14, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: '#00000088',
    justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#161619', borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 28,
    borderTopWidth: 0.5, borderColor: '#2A2A30' },
  modalTitle: { color: '#F0EEE8', fontSize: 18,
    fontWeight: '700', marginBottom: 20 },
  input: { backgroundColor: '#1E1E23', borderRadius: 12,
    padding: 14, color: '#F0EEE8', fontSize: 14,
    borderWidth: 0.5, borderColor: '#2A2A30', marginBottom: 12 },
  submitBtn: { backgroundColor: '#C9A84C', borderRadius: 50,
    padding: 14, alignItems: 'center', marginTop: 8 },
  submitText: { color: '#0D0D0F', fontSize: 15, fontWeight: '700' },
  cancelText: { color: '#6A6865', fontSize: 14,
    textAlign: 'center', marginTop: 14 },
})