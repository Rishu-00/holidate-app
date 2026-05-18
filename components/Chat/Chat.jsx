import { View, Text, ScrollView, TouchableOpacity,
StyleSheet, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useRef } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { chatBotSession } from '@/configs/AIModelConfig'

const initialMessages = [
  {
    id: 1,
    text: "Hi! I'm your AI Travel Assistant ✈️\n\nAsk me anything about:\n🌍 Destinations\n🏨 Hotels\n🗺️ Itineraries\n💰 Budget tips\n🌤️ Weather",
    sender: 'bot',
  }
]

export default function Chat() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg = {
      id: Date.now(),
      text: input,
      sender: 'me',
      time: new Date().toLocaleTimeString([],
        { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const result = await chatBotSession.sendMessage(input)
      const botReply = result.response.text()

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: botReply,
        sender: 'bot',
        time: new Date().toLocaleTimeString([],
          { hour: '2-digit', minute: '2-digit' })
      }])
    } catch (err) {
      console.log('Error:', err)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Something went wrong. Please try again!",
        sender: 'bot',
      }])
    }

    setLoading(false)
    scrollRef.current?.scrollToEnd({ animated: true })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.botAvatar}>
          <Text style={{ fontSize: 22 }}>🤖</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>AI Travel Assistant</Text>
          <Text style={styles.headerSub}>Powered by Gemini AI ✨</Text>
        </View>
        <View style={styles.onlineDot} />
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(msg => (
          <View key={msg.id} style={[
            styles.bubbleWrap,
            msg.sender === 'me' && { alignItems: 'flex-end' }
          ]}>
            {msg.sender === 'bot' && (
              <View style={styles.botAvatarSmall}>
                <Text style={{ fontSize: 14 }}>🤖</Text>
              </View>
            )}
            <View style={[
              styles.bubble,
              msg.sender === 'me' ? styles.myBubble : styles.botBubble
            ]}>
              <Text style={[
                styles.bubbleText,
                msg.sender === 'me' && { color: '#0D0D0F' }
              ]}>
                {msg.text}
              </Text>
              {msg.time && (
                <Text style={[
                  styles.bubbleTime,
                  msg.sender === 'me' && { color: '#0D0D0F99' }
                ]}>
                  {msg.time}
                </Text>
              )}
            </View>
          </View>
        ))}

        {loading && (
          <View style={styles.bubbleWrap}>
            <View style={styles.botAvatarSmall}>
              <Text style={{ fontSize: 14 }}>🤖</Text>
            </View>
            <View style={styles.botBubble}>
              <ActivityIndicator size="small" color="#C9A84C" />
            </View>
          </View>
        )}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={styles.suggestionsRow}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
        {['Best places in Bali 🌴', 'Budget trip to Europe 💶',
          'Best time to visit Kerala 🌿', 'Visa for Thailand 🛂'].map((s, i) => (
          <TouchableOpacity key={i} style={styles.suggestion}
            onPress={() => setInput(s)}>
            <Text style={styles.suggestionText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask about any destination..."
          placeholderTextColor="#6A6865"
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, loading && { opacity: 0.5 }]}
          onPress={sendMessage}
          disabled={loading}
        >
          <FontAwesome name="send" size={16} color="#0D0D0F" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0F' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, paddingTop: 56, backgroundColor: '#161619',
    borderBottomWidth: 0.5, borderBottomColor: '#2A2A30' },
  botAvatar: { width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#C9A84C22', borderWidth: 1, borderColor: '#C9A84C',
    alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#F0EEE8', fontSize: 15, fontWeight: '700' },
  headerSub: { color: '#6A6865', fontSize: 11, marginTop: 2 },
  onlineDot: { width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#5DCAA5' },
  messagesContainer: { flex: 1 },
  bubbleWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  botAvatarSmall: { width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#C9A84C22', borderWidth: 1, borderColor: '#C9A84C',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  bubble: { maxWidth: '75%', borderRadius: 18, padding: 12 },
  myBubble: { backgroundColor: '#C9A84C', borderBottomRightRadius: 4 },
  botBubble: { backgroundColor: '#1E1E23', borderBottomLeftRadius: 4,
    borderWidth: 0.5, borderColor: '#2A2A30' },
  bubbleText: { color: '#F0EEE8', fontSize: 14, lineHeight: 20 },
  bubbleTime: { color: '#A8A6A099', fontSize: 10,
    marginTop: 6, alignSelf: 'flex-end' },
  suggestionsRow: { maxHeight: 44, marginVertical: 8 },
  suggestion: { backgroundColor: '#1E1E23', borderRadius: 50,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 0.5, borderColor: '#C9A84C' },
  suggestionText: { color: '#C9A84C', fontSize: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    padding: 12, backgroundColor: '#161619',
    borderTopWidth: 0.5, borderTopColor: '#2A2A30' },
  input: { flex: 1, backgroundColor: '#1E1E23', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10,
    color: '#F0EEE8', fontSize: 14, maxHeight: 100,
    borderWidth: 0.5, borderColor: '#2A2A30' },
  sendBtn: { width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#C9A84C', alignItems: 'center', justifyContent: 'center' },
})