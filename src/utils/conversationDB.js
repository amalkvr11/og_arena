import { openDB } from 'idb'

const DB_NAME = 'soulchain_conversations'
const DB_VERSION = 1
const STORE_NAME = 'messages'

let dbPromise = null

const getDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
          store.createIndex('sessionId', 'sessionId')
          store.createIndex('timestamp', 'timestamp')
        }
      }
    })
  }
  return dbPromise
}

export const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const getCurrentSessionId = () => {
  let sessionId = localStorage.getItem('currentChatSession')
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem('currentChatSession', sessionId)
  }
  return sessionId
}

export const saveMessage = async (role, content, sessionId = null) => {
  try {
    const db = await getDB()
    const activeSessionId = sessionId || getCurrentSessionId()
    
    const message = {
      sessionId: activeSessionId,
      role,
      content,
      timestamp: new Date().toISOString()
    }
    
    const id = await db.put(STORE_NAME, message)
    return { ...message, id }
  } catch (e) {
    console.error('Failed to save message:', e)
    return null
  }
}

export const getConversationHistory = async (sessionId = null, limit = 50) => {
  try {
    const db = await getDB()
    const activeSessionId = sessionId || getCurrentSessionId()
    
    const allMessages = await db.getAll(STORE_NAME)
    const sessionMessages = allMessages
      .filter(m => m.sessionId === activeSessionId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(-limit)
    
    return sessionMessages
  } catch (e) {
    console.error('Failed to get conversation history:', e)
    return []
  }
}

export const clearConversation = async (sessionId = null) => {
  try {
    const db = await getDB()
    const activeSessionId = sessionId || getCurrentSessionId()
    
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const index = store.index('sessionId')
    
    let cursor = await index.openCursor(activeSessionId)
    while (cursor) {
      await cursor.delete()
      cursor = await cursor.continue()
    }
    
    localStorage.removeItem('currentChatSession')
    return true
  } catch (e) {
    console.error('Failed to clear conversation:', e)
    return false
  }
}

export const getAllSessions = async () => {
  try {
    const db = await getDB()
    const allMessages = await db.getAll(STORE_NAME)
    
    const sessions = {}
    allMessages.forEach(m => {
      if (!sessions[m.sessionId]) {
        sessions[m.sessionId] = {
          id: m.sessionId,
          messageCount: 0,
          firstMessage: m.timestamp,
          lastMessage: m.timestamp
        }
      }
      sessions[m.sessionId].messageCount++
      sessions[m.sessionId].lastMessage = m.timestamp
    })
    
    return Object.values(sessions).sort((a, b) => 
      new Date(b.lastMessage) - new Date(a.lastMessage)
    )
  } catch (e) {
    console.error('Failed to get sessions:', e)
    return []
  }
}

export const getMessageCount = async (sessionId = null) => {
  const messages = await getConversationHistory(sessionId)
  return messages.length
}

export default {
  generateSessionId,
  getCurrentSessionId,
  saveMessage,
  getConversationHistory,
  clearConversation,
  getAllSessions,
  getMessageCount
}
