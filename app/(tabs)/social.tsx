import { View, Text, ScrollView, 
TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'

const posts = [
  {
    id: 1, user: 'Priya Sharma', location: 'Bali, Indonesia',
    time: '2h ago', caption: 'Sunrise at Tanah Lot is something else 🌅 Absolutely magical!',
    likes: 148, comments: 24, emoji: '🌴'
  },
  {
    id: 2, user: 'Rahul Mehta', location: 'Paris, France',
    time: '1d ago', caption: 'Eiffel Tower at night hits different 🗼✨ Paris, you have stolen my heart.',
    likes: 312, comments: 47, emoji: '🗼'
  },
  {
    id: 3, user: 'Sneha Gupta', location: 'Kerala, India',
    time: '2d ago', caption: 'Backwaters of Kerala — pure bliss 🌿🚣 Nothing like this anywhere!',
    likes: 205, comments: 31, emoji: '🌿'
  },
]

export default function Social() {
  const [liked, setLiked] = useState<number[]>([])

  const toggleLike = (id: number) => {
    setLiked(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Travel Feed 🌍</Text>
        <TouchableOpacity style={styles.addBtn}>
          <FontAwesome name="plus" size={16} color="#0D0D0F" />
        </TouchableOpacity>
      </View>

      {/* Posts */}
      {posts.map(post => (
        <View key={post.id} style={styles.postCard}>
          {/* Post Header */}
          <View style={styles.postHead}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {post.user.charAt(0)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{post.user}</Text>
              <Text style={styles.postMeta}>
                📍 {post.location} · {post.time}
              </Text>
            </View>
            <FontAwesome name="ellipsis-h" size={16} color="#6A6865" />
          </View>

          {/* Post Image Placeholder */}
          <View style={styles.postImg}>
            <Text style={styles.postEmoji}>{post.emoji}</Text>
          </View>

          {/* Actions */}
          <View style={styles.postActions}>
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => toggleLike(post.id)}
            >
              <FontAwesome 
                name={liked.includes(post.id) ? "heart" : "heart-o"} 
                size={18} 
                color={liked.includes(post.id) ? "#E85454" : "#A8A6A0"} 
              />
              <Text style={styles.actionText}>
                {liked.includes(post.id) ? post.likes + 1 : post.likes}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <FontAwesome name="comment-o" size={18} color="#A8A6A0" />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <FontAwesome name="share" size={18} color="#A8A6A0" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Caption */}
          <View style={styles.caption}>
            <Text style={styles.captionText}>
              <Text style={styles.userName}>{post.user} </Text>
              {post.caption}
            </Text>
          </View>
        </View>
      ))}

      <View style={{ height: 20 }} />
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
  postCard: { backgroundColor: '#161619', marginBottom: 12,
    borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#2A2A30' },
  postHead: { flexDirection: 'row', alignItems: 'center',
    gap: 10, padding: 14 },
  avatar: { width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#C9A84C22', borderWidth: 1, borderColor: '#C9A84C',
    alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#C9A84C', fontSize: 16, fontWeight: '700' },
  userName: { color: '#F0EEE8', fontSize: 13, fontWeight: '600' },
  postMeta: { color: '#6A6865', fontSize: 11, marginTop: 1 },
  postImg: { height: 220, backgroundColor: '#1E1E23',
    alignItems: 'center', justifyContent: 'center' },
  postEmoji: { fontSize: 80 },
  postActions: { flexDirection: 'row', gap: 20, padding: 12, paddingHorizontal: 14 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { color: '#A8A6A0', fontSize: 13 },
  caption: { paddingHorizontal: 14, paddingBottom: 14 },
  captionText: { color: '#A8A6A0', fontSize: 13, lineHeight: 20 },
})