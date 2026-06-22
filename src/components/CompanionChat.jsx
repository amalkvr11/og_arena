import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import ReactMarkdown from 'react-markdown'
import { getAIResponse, checkAIAvailability, shouldSuggestMemory } from '../utils/aiService'
import { saveMessage, getConversationHistory, clearConversation } from '../utils/conversationDB'
import { useToast } from './Layout/Toast'

const NOVA_KNOWLEDGE = {
  soulchain: {
    overview: `SoulChain is a revolutionary blockchain project built on 0G Network that combines permanent memory storage with AI companionship. It allows users to preserve their most precious memories, thoughts, and digital legacies forever on a decentralized network.

**Core Features:**
• Memory Vault - Store memories permanently with AES-256 encryption
• AI Companion (me!) - An intelligent assistant that helps you manage and interact with your stored memories
• Smart Contracts - SoulChain NFTs that can have memories "activated" on-chain
• 0G Storage Integration - Decentralized, permanent storage network`,

    howItWorks: `**How SoulChain Works:**

1. **Write Your Memory** - Use the Memory Vault to write any thought, story, or moment you want to preserve

2. **Encrypt & Upload** - Your memory is encrypted with military-grade AES-256 encryption and uploaded to 0G's decentralized storage network

3. **Permanent Storage** - Your memory lives forever on the blockchain, immutable and accessible

4. **AI Integration** - I (Nova) can help you recall, organize, and interact with your stored memories

5. **NFT Activation** - Optionally, activate memories on SoulChain NFTs, creating on-chain proof of your digital legacy`,
  },

  help: `**Hi! I'm Nova, your AI Companion** 👋

I have **two modes** of intelligence:

**🤖 AI Mode (Primary):**
Powered by GPT-4 for natural conversations, memory analysis, and contextual help.

**🌐 Real-Time Data:**
• Crypto prices - "Bitcoin price", "ETH price"
• Market data - "Crypto market today"
• Trending - "Trending coins"

**💭 Memory Features:**
• "Help me write a memory"
• "Analyze my memory"
• "What should I store today?"

**📚 Learn About:**
• SoulChain features
• 0G Storage technology
• Blockchain concepts

Try asking me anything! I remember our conversation and learn about you.`
}

const CryptoAPI = {
  async getPrice(coin) {
    try {
      const coinIds = {
        'bitcoin': 'bitcoin', 'btc': 'bitcoin', 'ethereum': 'ethereum', 'eth': 'ethereum',
        'solana': 'solana', 'sol': 'solana', 'cardano': 'cardano', 'ada': 'cardano',
        'polkadot': 'polkadot', 'dot': 'polkadot', 'ripple': 'ripple', 'xrp': 'ripple',
        'dogecoin': 'dogecoin', 'doge': 'dogecoin', '0g': '0g-ai-fka-zero-gravity', '0g.ai': '0g-ai-fka-zero-gravity'
      }
      
      const coinId = coinIds[coin.toLowerCase()] || coin.toLowerCase()
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`)
      
      if (!response.ok) throw new Error('API error')
      const data = await response.json()
      
      if (data[coinId]) {
        const price = data[coinId].usd
        const change = data[coinId].usd_24h_change?.toFixed(2) || 0
        const formatPrice = (p) => p >= 1 ? `$${p.toLocaleString(undefined, {maximumFractionDigits: 2})}` : `$${p.toFixed(6)}`
        return `**${coinId.toUpperCase()} Price** 💰\n\n💵 **Price:** ${formatPrice(price)}\n📊 **24h:** ${change >= 0 ? '🟢' : '🔴'} ${change}%\n\n_Live from CoinGecko_`
      }
      return null
    } catch (error) { return null }
  },

  async getMarketData() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/global')
      if (!response.ok) throw new Error('API error')
      const data = await response.json()
      const global = data.data
      const totalMC = global.total_market_cap.usd
      const change = global.market_cap_change_percentage_24h_usd.toFixed(2)
      const formatMC = (mc) => mc >= 1e12 ? `$${(mc/1e12).toFixed(2)}T` : `$${(mc/1e9).toFixed(2)}B`
      return `**🌍 Crypto Market**\n\n💰 **Market Cap:** ${formatMC(totalMC)}\n📊 **24h:** ${change >= 0 ? '🟢' : '🔴'} ${change}%\n\n_Live data_`
    } catch (error) { return null }
  },

  async getTopCoins() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1')
      if (!response.ok) throw new Error('API error')
      const coins = await response.json()
      let result = '**🏆 Top 5 Crypto**\n\n'
      coins.forEach((coin, i) => {
        const change = coin.price_change_percentage_24h?.toFixed(2) || 0
        result += `${i+1}. **${coin.name}** - $${coin.current_price.toLocaleString()} ${change >= 0 ? '🟢' : '🔴'} ${change}%\n`
      })
      return result + '\n_Live data_'
    } catch (error) { return null }
  }
}

export const CompanionChat = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [aiAvailable, setAiAvailable] = useState(null)
  const [showMemorySuggestion, setShowMemorySuggestion] = useState(false)
  const messagesEndRef = useRef(null)
  const toast = useToast()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const init = async () => {
      const available = await checkAIAvailability()
      setAiAvailable(available)
      
      const history = await getConversationHistory()
      if (history.length > 0) {
        setMessages(history.map(m => ({
          text: m.content,
          sender: m.role === 'user' ? 'user' : 'companion',
          timestamp: new Date(m.timestamp).getTime()
        })))
      }
    }
    init()
  }, [])

  const handleCryptoQuery = async (lower) => {
    if (lower.includes('price') || lower.includes('how much')) {
      const coins = ['bitcoin', 'btc', 'ethereum', 'eth', 'solana', 'sol', '0g']
      for (const coin of coins) {
        if (lower.includes(coin)) {
          const priceData = await CryptoAPI.getPrice(coin)
          if (priceData) return priceData
        }
      }
    }
    
    if (lower.includes('market') || lower.includes('crypto today')) {
      const marketData = await CryptoAPI.getMarketData()
      if (marketData) return marketData
    }
    
    if (lower.includes('top') && (lower.includes('coin') || lower.includes('crypto'))) {
      const topCoins = await CryptoAPI.getTopCoins()
      if (topCoins) return topCoins
    }
    
    return null
  }

  const getResponse = async (userInput) => {
    const lower = userInput.toLowerCase().trim()
    
    if (lower === 'help' || lower === '?') {
      return NOVA_KNOWLEDGE.help
    }
    
    const cryptoResponse = await handleCryptoQuery(lower)
    if (cryptoResponse) return cryptoResponse
    
    if (lower.includes('soulchain') && lower.includes('how')) {
      return NOVA_KNOWLEDGE.soulchain.howItWorks
    }
    
    if (lower.includes('soulchain') || lower.includes('this project')) {
      return NOVA_KNOWLEDGE.soulchain.overview
    }
    
    if (aiAvailable) {
      const history = messages.slice(-10).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }))
      
      const result = await getAIResponse(userInput, history)
      
      if (shouldSuggestMemory(userInput)) {
        setShowMemorySuggestion(true)
      }
      
      return result.content
    }
    
    return getFallbackResponse(lower)
  }

  const getFallbackResponse = (lower) => {
    if (/^(hi|hello|hey)/.test(lower)) {
      return "Hello! I'm Nova, your AI companion for SoulChain. How can I help you preserve your memories today? ✨"
    }
    
    if (lower.includes('memory') || lower.includes('store')) {
      return "**Memory Vault** 💭\n\nStore your precious memories permanently:\n• AES-256 encryption\n• 0G decentralized storage\n• Forever accessible\n\nGo to Memory Vault to save your first memory!"
    }
    
    if (lower.includes('thank')) {
      return "You're welcome! Feel free to ask me anything about SoulChain, memories, or just chat! 💙"
    }
    
    return "I'm here to help with SoulChain! Ask me about:\n• Storing memories\n• 0G Storage\n• Time Capsules\n• How SoulChain works\n\nOr just share a story - I'd love to listen!"
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    const userMessage = { text: input, sender: "user", timestamp: Date.now() }
    setMessages(prev => [...prev, userMessage])
    
    const userInput = input
    setInput("")

    try {
      await saveMessage('user', userInput)
      
      const response = await getResponse(userInput)
      const aiMessage = { text: response, sender: "companion", timestamp: Date.now() }
      setMessages(prev => [...prev, aiMessage])
      
      await saveMessage('assistant', response)
    } catch (error) {
      console.error('Chat error:', error)
      toast?.error('Failed to get response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = async () => {
    await clearConversation()
    setMessages([])
    toast?.success('Conversation cleared')
  }

  return (
    <div className="companion-chat">
      <div className="chat-container">
        <div className="ai-avatar-section">
          <div className="ai-avatar">
            <div className="avatar-glow"></div>
            <div className="avatar-core">
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" stroke="url(#avatarGrad)" strokeWidth="2"/>
                <circle cx="50" cy="50" r="30" fill="url(#avatarGrad)" fillOpacity="0.1"/>
                <circle cx="50" cy="50" r="8" fill="url(#avatarGrad)"/>
                <defs>
                  <linearGradient id="avatarGrad" x1="0" y1="0" x2="100" y2="100">
                    <stop stopColor="#00f5ff"/>
                    <stop offset="1" stopColor="#7c3aed"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className={`avatar-pulse ${isLoading ? 'active' : ''}`}></div>
          </div>
          <div className="ai-info">
            <span className="ai-name">Nova</span>
            <span className="ai-status">
              <span className="status-dot"></span>
              {aiAvailable === null ? '🔄 Connecting...' : aiAvailable ? '🤖 AI Enhanced' : '🌐 Online'}
            </span>
          </div>
          {messages.length > 0 && (
            <button onClick={handleClearChat} className="clear-chat-btn" title="Clear conversation">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          )}
        </div>

        <div className="messages-container">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <p className="empty-title">Hello, I'm Nova! 🌟</p>
              <p className="empty-subtitle">
                {aiAvailable ? "I'm powered by GPT-4 for natural conversations. Ask me anything about SoulChain, memories, or life!" : "I'm here to help with SoulChain! Ask me about memories, storage, or explore features."}
              </p>
              <div className="quick-questions">
                <button onClick={() => setInput("Help me write a memory")} className="quick-btn">💭 Memory prompt</button>
                <button onClick={() => setInput("What is SoulChain?")} className="quick-btn">📚 About</button>
                <button onClick={() => setInput("Bitcoin price")} className="quick-btn">💰 Crypto</button>
                <button onClick={() => setInput("help")} className="quick-btn">❓ Help</button>
              </div>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}>
              {msg.sender === 'companion' && (
                <div className="message-avatar">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <circle cx="10" cy="10" r="8" fill="url(#miniGrad)"/>
                    <defs>
                      <linearGradient id="miniGrad" x1="0" y1="0" x2="20" y2="20">
                        <stop stopColor="#00f5ff"/>
                        <stop offset="1" stopColor="#7c3aed"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}
              <div className="message-bubble">
                <div className="message-text">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <span className="message-time">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>
          ))}
          
          {showMemorySuggestion && (
            <div className="memory-suggestion">
              <p>💡 Would you like to save this as a memory?</p>
              <Link to="/memory-vault" className="save-memory-btn" onClick={() => setShowMemorySuggestion(false)}>
                Save to Memory Vault
              </Link>
              <button className="dismiss-btn" onClick={() => setShowMemorySuggestion(false)}>Maybe later</button>
            </div>
          )}
          
          {isLoading && (
            <div className="message ai-message">
              <div className="message-avatar">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <circle cx="10" cy="10" r="8" fill="url(#miniGrad)"/>
                </svg>
              </div>
              <div className="message-bubble typing">
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-section">
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder={aiAvailable ? "Talk to Nova... (Powered by GPT-4)" : "Ask about SoulChain..."}
              disabled={isLoading}
            />
            <button 
              onClick={sendMessage} 
              disabled={isLoading || !input.trim()}
              className="send-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
          <div className="input-hint">
            <span>{aiAvailable ? '🤖 AI Enhanced' : '🌐 SoulChain Guide'}</span>
            <span className="separator">|</span>
            <span>Type "help" for features</span>
          </div>
        </div>
      </div>
    </div>
  )
}
