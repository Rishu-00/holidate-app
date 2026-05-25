import { View, Text, ScrollView, TouchableOpacity,
StyleSheet, Modal, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { collection, addDoc, getDocs, query, 
where, deleteDoc, doc } from 'firebase/firestore'
import { auth, db } from '@/configs/firebaseConfig'

const categories = [
  { label: 'Flights', color: '#C9A84C', emoji: '✈️' },
  { label: 'Hotels', color: '#378ADD', emoji: '🏨' },
  { label: 'Food', color: '#1D9E75', emoji: '🍽️' },
  { label: 'Activities', color: '#D85A30', emoji: '🎯' },
  { label: 'Transport', color: '#7F77DD', emoji: '🚗' },
  { label: 'Shopping', color: '#E85454', emoji: '🛍️' },
  { label: 'Other', color: '#A8A6A0', emoji: '💸' },
]

export default function Budget() {
  const [modal, setModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [selectedCat, setSelectedCat] = useState(categories[0])
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [totalBudget] = useState(70000)
  const user = auth.currentUser

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    if (!user) return
    setLoading(true)
    try {
      const q = query(
        collection(db, 'expenses'),
        where('userEmail', '==', user.email)
      )
      const snapshot = await getDocs(q)
      const data: any[] = []
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }))
      setExpenses(data)
    } catch (err) {
      console.log('Fetch error:', err)
    }
    setLoading(false)
  }

  const addExpense = async () => {
    if (!amount || !user) return
    setLoading(true)
    try {
      await addDoc(collection(db, 'expenses'), {
        userEmail: user.email,
        amount: parseInt(amount),
        note: note || selectedCat.label,
        category: selectedCat.label,
        emoji: selectedCat.emoji,
        color: selectedCat.color,
        date: new Date().toLocaleDateString('en-IN', 
          { day: 'numeric', month: 'short' }),
        createdAt: new Date().toISOString(),
      })
      setAmount('')
      setNote('')
      setModal(false)
      fetchExpenses()
    } catch (err) {
      console.log('Add error:', err)
    }
    setLoading(false)
  }

  const deleteExpense = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'expenses', id))
      fetchExpenses()
    } catch (err) {
      console.log('Delete error:', err)
    }
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const remaining = totalBudget - totalSpent
  const percent = Math.min(Math.round((totalSpent / totalBudget) * 100), 100)

  const getCategoryTotal = (label: string) =>
    expenses.filter(e => e.category === label)
      .reduce((sum, e) => sum + e.amount, 0)

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Budget Tracker 💰</Text>
        <TouchableOpacity style={styles.addBtn}
          onPress={() => setModal(true)}>
          <FontAwesome name="plus" size={16} color="#0D0D0F" />
        </TouchableOpacity>
      </View>

      {/* Total Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Spent</Text>
        <Text style={styles.totalAmount}>
          ₹{totalSpent.toLocaleString()}
        </Text>
        <Text style={styles.totalSub}>
          of ₹{totalBudget.toLocaleString()} budget
        </Text>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill,
            { width: `${percent}%` as any,
              backgroundColor: percent > 90 ? '#E85454' : '#C9A84C' }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLeft}>{percent}% used</Text>
          <Text style={[styles.progressRight,
            { color: remaining < 0 ? '#E85454' : '#5DCAA5' }]}>
            {remaining < 0
              ? `₹${Math.abs(remaining).toLocaleString()} over!`
              : `₹${remaining.toLocaleString()} left`}
          </Text>
        </View>
      </View>

      {/* Category Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>By Category</Text>
        {categories.map((cat, idx) => {
          const catTotal = getCategoryTotal(cat.label)
          const catPercent = totalSpent > 0
            ? Math.round((catTotal / totalSpent) * 100) : 0
          return (
            <View key={idx} style={styles.catRow}>
              <View style={[styles.catDot,
                { backgroundColor: cat.color }]} />
              <Text style={styles.catEmoji}>{cat.emoji}</Text>
              <Text style={styles.catLabel}>{cat.label}</Text>
              <View style={styles.catBarBg}>
                <View style={[styles.catBarFill, {
                  width: `${catPercent}%` as any,
                  backgroundColor: cat.color
                }]} />
              </View>
              <Text style={styles.catAmount}>
                {catTotal > 0
                  ? `₹${catTotal.toLocaleString()}` : '—'}
              </Text>
            </View>
          )
        })}
      </View>

      {/* Recent Expenses */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Recent Expenses ({expenses.length})
        </Text>
        {loading && (
          <ActivityIndicator color="#C9A84C" style={{ marginTop: 20 }} />
        )}
        {!loading && expenses.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              No expenses yet — add your first one! 💸
            </Text>
          </View>
        )}
        {expenses
          .sort((a, b) => new Date(b.createdAt).getTime() 
            - new Date(a.createdAt).getTime())
          .map((exp) => (
          <View key={exp.id} style={styles.expenseCard}>
            <View style={[styles.expenseIcon,
              { backgroundColor: exp.color + '22' }]}>
              <Text style={{ fontSize: 20 }}>{exp.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.expenseLabel}>{exp.note}</Text>
              <Text style={styles.expenseDate}>
                {exp.category} · {exp.date}
              </Text>
            </View>
            <Text style={styles.expenseAmount}>
              ₹{exp.amount.toLocaleString()}
            </Text>
            <TouchableOpacity
              onPress={() => deleteExpense(exp.id)}
              style={styles.deleteBtn}>
              <FontAwesome name="trash-o" size={14} color="#E85454" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={{ height: 20 }} />

      {/* Add Expense Modal */}
      <Modal visible={modal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Log Expense 💸</Text>

            {/* Category Selector */}
            <Text style={styles.modalLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 14 }}
              contentContainerStyle={{ gap: 8 }}>
              {categories.map((cat, idx) => (
                <TouchableOpacity key={idx}
                  style={[styles.catChip,
                    selectedCat.label === cat.label && {
                      backgroundColor: cat.color,
                      borderColor: cat.color
                    }]}
                  onPress={() => setSelectedCat(cat)}>
                  <Text style={{ fontSize: 16 }}>{cat.emoji}</Text>
                  <Text style={[styles.catChipText,
                    selectedCat.label === cat.label 
                      && { color: '#0D0D0F' }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.modalLabel}>Amount (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="#6A6865"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.modalLabel}>Note (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Flight to Bali"
              placeholderTextColor="#6A6865"
              value={note}
              onChangeText={setNote}
            />

            <TouchableOpacity
              style={[styles.submitBtn,
                loading && { opacity: 0.6 }]}
              onPress={addExpense}
              disabled={loading}>
              {loading
                ? <ActivityIndicator color="#0D0D0F" />
                : <Text style={styles.submitText}>Add Expense</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              setModal(false)
              setAmount('')
              setNote('')
            }}>
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
    backgroundColor: '#C9A84C', alignItems: 'center',
    justifyContent: 'center' },
  totalCard: { marginHorizontal: 20, backgroundColor: '#1C1A10',
    borderRadius: 20, padding: 24, borderWidth: 0.5,
    borderColor: '#C9A84C', marginBottom: 24 },
  totalLabel: { color: '#A8A6A0', fontSize: 13, textAlign: 'center' },
  totalAmount: { color: '#E8C97A', fontSize: 42,
    fontWeight: '700', textAlign: 'center', marginTop: 4 },
  totalSub: { color: '#6A6865', fontSize: 12,
    textAlign: 'center', marginTop: 4 },
  progressBg: { height: 6, backgroundColor: '#26262D',
    borderRadius: 4, marginTop: 20, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressLabels: { flexDirection: 'row',
    justifyContent: 'space-between', marginTop: 8 },
  progressLeft: { color: '#A8A6A0', fontSize: 11 },
  progressRight: { fontSize: 11, fontWeight: '600' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { color: '#F0EEE8', fontSize: 15,
    fontWeight: '600', marginBottom: 14 },
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
  emptyBox: { backgroundColor: '#1E1E23', borderRadius: 14,
    padding: 20, alignItems: 'center',
    borderWidth: 0.5, borderColor: '#2A2A30' },
  emptyText: { color: '#6A6865', fontSize: 13, textAlign: 'center' },
  expenseCard: { flexDirection: 'row', alignItems: 'center',
    gap: 12, backgroundColor: '#1E1E23', borderRadius: 14,
    padding: 14, marginBottom: 10,
    borderWidth: 0.5, borderColor: '#2A2A30' },
  expenseIcon: { width: 44, height: 44, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center' },
  expenseLabel: { color: '#F0EEE8', fontSize: 13, fontWeight: '500' },
  expenseDate: { color: '#6A6865', fontSize: 11, marginTop: 2 },
  expenseAmount: { color: '#E8C97A', fontSize: 14, fontWeight: '700' },
  deleteBtn: { padding: 4 },
  modalOverlay: { flex: 1, backgroundColor: '#00000088',
    justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#161619',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 28, borderTopWidth: 0.5, borderColor: '#2A2A30' },
  modalTitle: { color: '#F0EEE8', fontSize: 20,
    fontWeight: '700', marginBottom: 16 },
  modalLabel: { color: '#A8A6A0', fontSize: 12,
    marginBottom: 8, fontWeight: '600' },
  catChip: { flexDirection: 'row', alignItems: 'center',
    gap: 6, backgroundColor: '#1E1E23', borderRadius: 50,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 0.5, borderColor: '#2A2A30' },
  catChipText: { color: '#A8A6A0', fontSize: 12 },
  input: { backgroundColor: '#1E1E23', borderRadius: 12,
    padding: 14, color: '#F0EEE8', fontSize: 14,
    borderWidth: 0.5, borderColor: '#2A2A30', marginBottom: 14 },
  submitBtn: { backgroundColor: '#C9A84C', borderRadius: 50,
    padding: 15, alignItems: 'center', marginBottom: 4 },
  submitText: { color: '#0D0D0F', fontSize: 15, fontWeight: '700' },
  cancelText: { color: '#6A6865', fontSize: 14,
    textAlign: 'center', marginTop: 14 },
})