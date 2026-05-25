import { View, Text, ScrollView, TouchableOpacity,
StyleSheet, TextInput, Modal, ActivityIndicator,
Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { collection, addDoc, getDocs, query,
orderBy, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { auth, db } from '@/configs/firebaseConfig'

export default function Social() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [postModal, setPostModal] = useState(false)
  const [postText, setPostText] = useState('')
  const [postLocation, setPostLocation] = useState('')
  const [posting, setPosting] = useState(false)
  const user = auth.currentUser

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      const data: any[] = []
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }))
      setPosts(data)
    } catch (err) {
      console.log('Fetch error:', err)
    }
    setLoading(false)
  }

  const createPost = async () => {
    if (!postText.trim() || !user) return
    setPosting(true)
    try {
      await addDoc(collection(db, 'posts'), {
        text: postText,
        location: postLocation || null,
        userEmail: user.email,
        userName: user.displayName || user.email?.split('@')[0],
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
        emoji: ['🌴', '🗼', '🏖️', '🌍', '✈️', '🏔️', '🌅'][
          Math.floor(Math.random() * 7)
        ],
      })
      setPostText('')
      setPostLocation('')
      setPostModal(false)
      fetchPosts()
    } catch (err) {
      console.log('Post error:', err)
    }
    setPosting(false)
  }

  const toggleLike = async (postId: string, likes: string[]) => {
    if (!user) return
    try {
      const postRef = doc(db, 'posts', postId)
      const liked = likes.includes(user.email!)
      await updateDoc(postRef, {
        likes: liked
          ? arrayRemove(user.email)
          : arrayUnion(user.email)
      })
      fetchPosts()
    } catch (err) {
      console.log('Like error:', err)
    }
  }

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Travel Feed 🌍</Text>
        <TouchableOpacity
          style={styles.newPostBtn}
          onPress={() => setPostModal(true)}>
          <FontAwesome name="plus" size={16} color="#0D0D0F" />
        </TouchableOpacity>
      </View>

      {/* Posts */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#C9A84C" />
          <Text style={styles.loadingText}>Loading feed...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {posts.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>✈️</Text>
              <Text style={styles.emptyTitle}>No posts yet!</Text>
              <Text style={styles.emptyText}>
                Be the first to share your travel experience
              </Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => setPostModal(true)}>
                <Text style={styles.emptyBtnText}>+ Create Post</Text>
              </TouchableOpacity>
            </View>
          )}

          {posts.map(post => {
            const liked = post.likes?.includes(user?.email)
            const initial = post.userName?.charAt(0).toUpperCase()
            return (
              <View key={post.id} style={styles.postCard}>
                {/* Post Header */}
                <View style={styles.postHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initial}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>{post.userName}</Text>
                    <View style={styles.metaRow}>
                      {post.location && (
                        <>
                          <FontAwesome name="map-marker"
                            size={10} color="#C9A84C" />
                          <Text style={styles.metaText}>{post.location}</Text>
                          <Text style={styles.metaDot}>·</Text>
                        </>
                      )}
                      <Text style={styles.metaText}>
                        {getTimeAgo(post.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 24 }}>{post.emoji}</Text>
                </View>

                {/* Post Text */}
                <Text style={styles.postText}>{post.text}</Text>

                {/* Actions */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => toggleLike(post.id, post.likes || [])}>
                    <FontAwesome
                      name={liked ? 'heart' : 'heart-o'}
                      size={16}
                      color={liked ? '#E85454' : '#6A6865'}
                    />
                    <Text style={[styles.actionText,
                      liked && { color: '#E85454' }]}>
                      {post.likes?.length || 0}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtn}>
                    <FontAwesome name="comment-o"
                      size={16} color="#6A6865" />
                    <Text style={styles.actionText}>
                      {post.comments?.length || 0}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtn}>
                    <FontAwesome name="share"
                      size={16} color="#6A6865" />
                    <Text style={styles.actionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          })}

          <View style={{ height: 20 }} />
        </ScrollView>
      )}

      {/* Create Post Modal */}
      <Modal visible={postModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Share Your Journey ✈️</Text>

            {/* User Info */}
            <View style={styles.modalUser}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.displayName?.charAt(0).toUpperCase() ||
                    user?.email?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.modalUserName}>
                {user?.displayName || user?.email?.split('@')[0]}
              </Text>
            </View>

            <TextInput
              style={styles.postInput}
              placeholder="What's your travel story?  ✈️"
              placeholderTextColor="#6A6865"
              value={postText}
              onChangeText={setPostText}
              multiline
              numberOfLines={4}
            />

            <View style={styles.locationInput}>
              <FontAwesome name="map-marker" size={14} color="#C9A84C" />
              <TextInput
                style={styles.locationText}
                placeholder="Add location (optional)"
                placeholderTextColor="#6A6865"
                value={postLocation}
                onChangeText={setPostLocation}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, posting && { opacity: 0.6 }]}
              onPress={createPost}
              disabled={posting}>
              {posting
                ? <ActivityIndicator color="#0D0D0F" />
                : <Text style={styles.submitText}>Post ✈️</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              setPostModal(false)
              setPostText('')
              setPostLocation('')
            }}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0F' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 20, paddingTop: 60,
  },
  title: { color: '#F0EEE8', fontSize: 22, fontWeight: '700' },
  newPostBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#C9A84C', alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBox: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center', gap: 12,
  },
  loadingText: { color: '#6A6865', fontSize: 14 },
  emptyBox: {
    alignItems: 'center', padding: 40, gap: 12,
  },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: {
    color: '#F0EEE8', fontSize: 18, fontWeight: '700',
  },
  emptyText: {
    color: '#6A6865', fontSize: 13, textAlign: 'center',
  },
  emptyBtn: {
    backgroundColor: '#C9A84C', paddingHorizontal: 24,
    paddingVertical: 12, borderRadius: 50, marginTop: 8,
  },
  emptyBtnText: {
    color: '#0D0D0F', fontWeight: '700', fontSize: 14,
  },
  postCard: {
    backgroundColor: '#1E1E23', marginHorizontal: 16,
    borderRadius: 18, padding: 16, marginBottom: 12,
    borderWidth: 0.5, borderColor: '#2A2A30',
  },
  postHeader: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 12,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#C9A84C22', borderWidth: 1,
    borderColor: '#C9A84C', alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#C9A84C', fontSize: 16, fontWeight: '700',
  },
  userName: {
    color: '#F0EEE8', fontSize: 13, fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 4, marginTop: 2,
  },
  metaText: { color: '#6A6865', fontSize: 11 },
  metaDot: { color: '#6A6865', fontSize: 11 },
  postText: {
    color: '#F0EEE8', fontSize: 14,
    lineHeight: 20, marginBottom: 14,
  },
  actions: {
    flexDirection: 'row', gap: 20,
    borderTopWidth: 0.5, borderTopColor: '#2A2A30',
    paddingTop: 12,
  },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  actionText: { color: '#6A6865', fontSize: 12 },
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
    fontWeight: '700', marginBottom: 16,
  },
  modalUser: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 16,
  },
  modalUserName: {
    color: '#F0EEE8', fontSize: 14, fontWeight: '600',
  },
  postInput: {
    backgroundColor: '#1E1E23', borderRadius: 14,
    padding: 14, color: '#F0EEE8', fontSize: 14,
    borderWidth: 0.5, borderColor: '#2A2A30',
    minHeight: 100, textAlignVertical: 'top',
    marginBottom: 12,
  },
  locationInput: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, backgroundColor: '#1E1E23',
    borderRadius: 12, padding: 12,
    borderWidth: 0.5, borderColor: '#2A2A30', marginBottom: 16,
  },
  locationText: {
    flex: 1, color: '#F0EEE8', fontSize: 13,
  },
  submitBtn: {
    backgroundColor: '#C9A84C', borderRadius: 50,
    padding: 15, alignItems: 'center', marginBottom: 4,
  },
  submitText: {
    color: '#0D0D0F', fontSize: 15, fontWeight: '700',
  },
  cancelText: {
    color: '#6A6865', fontSize: 14,
    textAlign: 'center', marginTop: 14,
  },
})