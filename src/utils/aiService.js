import { SOULCHAIN_SYSTEM_PROMPT, MEMORY_ANALYSIS_PROMPT, PATTERNS_SUGGEST_MEMORY } from './aiPrompts'

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini'
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

let isAvailable = null

export const checkAIAvailability = async () => {
  if (isAvailable !== null) return isAvailable
  
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_key_here') {
    console.warn('OpenAI API key not configured')
    isAvailable = false
    return false
  }
  
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5
      })
    })
    
    isAvailable = response.ok
    return isAvailable
  } catch (e) {
    console.error('AI availability check failed:', e)
    isAvailable = false
    return false
  }
}

export const getAIResponse = async (userMessage, conversationHistory = []) => {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_key_here') {
    return getMockResponse(userMessage)
  }
  
  const messages = [
    { role: 'system', content: SOULCHAIN_SYSTEM_PROMPT },
    ...conversationHistory.map(m => ({
      role: m.role,
      content: m.content
    })),
    { role: 'user', content: userMessage }
  ]
  
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        max_tokens: 500,
        temperature: 0.8
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error)
      throw new Error(error.error?.message || 'AI request failed')
    }
    
    const data = await response.json()
    return {
      success: true,
      content: data.choices[0].message.content,
      model: data.model,
      usage: data.usage
    }
  } catch (e) {
    console.error('AI response error:', e)
    return {
      success: false,
      content: getMockResponse(userMessage),
      error: e.message
    }
  }
}

export const analyzeMemory = async (content) => {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_key_here') {
    return getMockAnalysis(content)
  }
  
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: MEMORY_ANALYSIS_PROMPT },
          { role: 'user', content }
        ],
        max_tokens: 200,
        temperature: 0.3,
        response_format: { type: 'json_object' }
      })
    })
    
    if (!response.ok) {
      throw new Error('Analysis failed')
    }
    
    const data = await response.json()
    return {
      success: true,
      analysis: JSON.parse(data.choices[0].message.content)
    }
  } catch (e) {
    return {
      success: false,
      analysis: getMockAnalysis(content)
    }
  }
}

export const shouldSuggestMemory = (message) => {
  return PATTERNS_SUGGEST_MEMORY.some(pattern => pattern.test(message))
}

export const getMockResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase()
  
  const responses = {
    greeting: [
      "Hello! I'm Nova, your AI companion for SoulChain. How can I help you preserve your memories today?",
      "Hi there! I'm here to help you store your precious memories on the blockchain. What's on your mind?",
      "Welcome! I'm Nova. I'd love to hear about a memory you'd like to preserve forever."
    ],
    memory: [
      "That sounds like a beautiful memory! Would you like to save it in your Memory Vault so it's preserved forever on the 0G blockchain?",
      "What a wonderful story. I can help you store this memory permanently with encryption. Would you like me to help you save it?",
      "Memories like these are precious. Would you like to create a permanent record of this on SoulChain?"
    ],
    help: [
      "I can help you with: storing memories, creating time capsules, setting up beneficiaries, or explaining how 0G blockchain storage works. What interests you?",
      "SoulChain lets you store memories permanently on a decentralized network. I can guide you through any feature - what would you like to know?",
      "Here's what I can help with:\n• Memory Vault - store text, images, thoughts\n• Time Capsules - schedule future releases\n• Beneficiaries - designate who receives your memories\n\nWhat would you like to explore?"
    ],
    storing: [
      "To store a memory, go to the Memory Vault page, type your memory, and click 'Upload to 0G'. You'll need to connect your wallet first.",
      "Storing is simple! Connect your wallet, write your memory in the Memory Vault, and it'll be encrypted and stored permanently on 0G Storage.",
      "I can guide you! First, connect your wallet, then head to Memory Vault. Your memories will be encrypted and stored on the blockchain."
    ],
    storage: [
      "0G Storage is a decentralized storage network. Your data is split, encrypted, and stored across multiple nodes - making it permanent and censorship-resistant.",
      "Think of 0G like a permanent digital vault. Once stored, your data can't be deleted or modified, and you get cryptographic proof it's there.",
      "0G uses blockchain technology to ensure your memories are stored forever. Each file gets a unique hash that proves it hasn't been tampered with."
    ],
    time_capsule: [
      "Time Capsules let you schedule memories to be released on a specific future date - like a message to your future self or loved ones.",
      "You can create a Time Capsule that unlocks on a date you choose. Perfect for birthdays, anniversaries, or messages to your future self!",
      "Time Capsules are digital time machines. Store a memory now, set a release date, and it'll be delivered when the time comes."
    ],
    default: [
      "That's interesting! Tell me more - I'd love to understand better.",
      "I appreciate you sharing that. What else would you like to explore?",
      "Thank you for sharing. Is there anything specific I can help you preserve?",
      "I'm listening. What matters most to you right now?",
      "That resonates. Would you like to capture this moment as a memory?"
    ]
  }
  
  let category = 'default'
  
  if (/^(hi|hello|hey|greetings)/i.test(lowerMessage)) {
    category = 'greeting'
  } else if (/(memory|remember|story|when I|back in|childhood|growing up)/i.test(lowerMessage)) {
    category = 'memory'
  } else if (/help|what can you|how do|guide|explain/i.test(lowerMessage)) {
    category = 'help'
  } else if (/store|save|upload|how.*memory vault/i.test(lowerMessage)) {
    category = 'storing'
  } else if (/(0g|blockchain|storage|decentralized|chain)/i.test(lowerMessage)) {
    category = 'storage'
  } else if (/(time capsule|capsule|future|schedule)/i.test(lowerMessage)) {
    category = 'time_capsule'
  }
  
  const options = responses[category]
  return options[Math.floor(Math.random() * options.length)]
}

export const getMockAnalysis = (content) => {
  const words = content.split(/\s+/)
  const title = words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '')
  
  return {
    title,
    tags: ['memory', 'personal', 'reflection', 'life', 'moments'].slice(0, 3),
    sentiment: 'neutral',
    sentimentReason: 'Content appears to be a typical memory reflection',
    summary: `A memory about ${words.slice(0, 10).join(' ')}...`
  }
}

export default {
  checkAIAvailability,
  getAIResponse,
  analyzeMemory,
  shouldSuggestMemory,
  getMockResponse,
  getMockAnalysis
}
