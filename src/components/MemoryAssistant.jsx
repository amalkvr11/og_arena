import React, { useState, useEffect, useRef } from 'react'

// In-memory storage for demo (would use 0G in production)
let userMemories = [
  {
    id: 1,
    title: "Project Launch Day",
    content: "Today SoulChain launches. Excited to help preserve memories forever.",
    category: "milestone",
    emotion: "excited",
    date: "2024-06-01",
    tags: ["launch", "blockchain", "0g"]
  },
  {
    id: 2,
    title: "Family Gathering",
    content: "Wonderful Sunday with family. Kids played in the garden all afternoon.",
    category: "family",
    emotion: "happy",
    date: "2024-06-02",
    tags: ["family", "weekend", "kids"]
  },
  {
    id: 3,
    title: "Learning Journey",
    content: "Spent the day studying smart contract development. The future is decentralized.",
    category: "learning",
    emotion: "curious",
    date: "2024-06-03",
    tags: ["learning", "crypto", "development"]
  },
  {
    id: 4,
    title: "Quiet Reflection",
    content: "Rainy afternoon, perfect for introspection. Feeling grateful for this moment of peace.",
    category: "personal",
    emotion: "peaceful",
    date: "2024-06-04",
    tags: ["rain", "peace", "grateful"]
  },
  {
    id: 5,
    title: "Career Milestone",
    content: "Got promoted today! Hard work pays off. Need to celebrate with family.",
    category: "milestone",
    emotion: "excited",
    date: "2024-06-05",
    tags: ["career", "promotion", "success"]
  }
]

const MemoryAnalyzer = {
  search: (query, memories) => {
    const queryLower = query.toLowerCase()
    
    return memories.filter(m => {
      const searchText = `${m.title} ${m.content} ${m.tags.join(' ')} ${m.emotion} ${m.category}`.toLowerCase()
      return searchText.includes(queryLower)
    })
  },

  findByEmotion: (emotion, memories) => {
    return memories.filter(m => m.emotion.toLowerCase().includes(emotion.toLowerCase()))
  },

  findByCategory: (category, memories) => {
    return memories.filter(m => m.category.toLowerCase().includes(category.toLowerCase()))
  },

  findByDateRange: (startYear, endYear, memories) => {
    return memories.filter(m => {
      const year = new Date(m.date).getFullYear()
      return year >= startYear && year <= endYear
    })
  },

  summarize: (memories) => {
    if (!memories.length) return null
    
    const emotionCounts = {}
    const categoryCounts = {}
    
    memories.forEach(m => {
      emotionCounts[m.emotion] = (emotionCounts[m.emotion] || 0) + 1
      categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1
    })

    const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]

    return {
      total: memories.length,
      topEmotion: topEmotion ? { emotion: topEmotion[0], count: topEmotion[1] } : null,
      topCategory: topCategory ? { category: topCategory[0], count: topCategory[1] } : null,
      emotions: emotionCounts,
      categories: categoryCounts
    }
  },

  generateYearInReview: (year, memories) => {
    const yearMemories = memories.filter(m => new Date(m.date).getFullYear() === year)
    if (!yearMemories.length) return "No memories found for that year."
    
    const summary = MemoryAnalyzer.summarize(yearMemories)
    
    return `**${year} Year in Review** 📊

📅 **Total Memories:** ${summary.total}

😊 **Most Common Emotion:** ${summary.topEmotion?.emotion || 'N/A'} (${summary.topEmotion?.count || 0} times)

📂 **Top Category:** ${summary.topCategory?.category || 'N/A'} (${summary.topCategory?.count || 0} entries)

**Memory Highlights:**
${yearMemories.map(m => `• ${m.title} - ${m.emotion}`).join('\n')}

**Emotional Breakdown:**
${Object.entries(summary.emotions).map(([e, c]) => `  ${e}: ${c}`).join('\n')}
`
  }
}

export const MemoryAssistant = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getMemoryResponse = async (input) => {
    const lower = input.toLowerCase()

    // Search memories
    if (lower.includes('show') || lower.includes('search') || lower.includes('find') || lower.includes('what') || lower.includes('any memory')) {
      
      // By emotion
      const emotions = ['happy', 'sad', 'excited', 'peaceful', 'grateful', 'curious', 'anxious']
      for (const emotion of emotions) {
        if (lower.includes(emotion)) {
          const found = MemoryAnalyzer.findByEmotion(emotion, userMemories)
          if (found.length) {
            return `**Found ${found.length} memory(ies) where you felt ${emotion}:**\n\n` +
              found.map(m => `• **${m.title}** (${m.date})\n  "${m.content.substring(0, 100)}..."`).join('\n\n')
          }
          return `No memories found where you felt ${emotion}. Try storing some!`
        }
      }

      // By category
      const categories = ['family', 'milestone', 'personal', 'learning', 'career', 'travel']
      for (const cat of categories) {
        if (lower.includes(cat)) {
          const found = MemoryAnalyzer.findByCategory(cat, userMemories)
          if (found.length) {
            return `**Found ${found.length} memory(ies) in "${cat}" category:**\n\n` +
              found.map(m => `• **${m.title}** (${m.date})\n  "${m.content.substring(0, 100)}..."`).join('\n\n')
          }
          return `No "${cat}" memories found. Would you like to add one?`
        }
      }

      // By year
      const yearMatch = lower.match(/\b(20\d{2})\b/)
      if (yearMatch && (lower.includes('year') || lower.includes('in review') || lower.includes('what happened'))) {
        return MemoryAnalyzer.generateYearInReview(parseInt(yearMatch[1]), userMemories)
      }

      // General search
      const searchTerms = lower.replace(/show|search|find|my|memories|about|me/gi, '').trim()
      if (searchTerms.length > 2) {
        const found = MemoryAnalyzer.search(searchTerms, userMemories)
        if (found.length) {
          return `**Found ${found.length} matching memory(ies):**\n\n` +
            found.map(m => `• **${m.title}** (${m.date})\n  "${m.content.substring(0, 100)}..."`).join('\n\n')
        }
      }
    }

    // Summary/stats
    if (lower.includes('summar') || lower.includes('overview') || lower.includes('statistics') || lower.includes('stats')) {
      const summary = MemoryAnalyzer.summarize(userMemories)
      return `**Your Memory Statistics** 📊

📚 **Total Memories:** ${summary.total}

😊 **Top Emotion:** ${summary.topEmotion?.emotion || 'N/A'}
📂 **Top Category:** ${summary.topCategory?.category || 'N/A'}

**All Emotions:**
${Object.entries(summary.emotions).map(([e, c]) => `  ${e}: ${c}`).join('\n')}

**Categories:**
${Object.entries(summary.categories).map(([c, n]) => `  ${c}: ${n}`).join('\n')}

_Tip: Ask me to search by emotion, category, or year!_`
    }

    // Year in review
    if (lower.includes('year in review') || lower.includes('annual summary')) {
      const currentYear = new Date().getFullYear()
      return MemoryAnalyzer.generateYearInReview(currentYear, userMemories)
    }

    // Add memory command
    if (lower.includes('add memory') || lower.includes('save memory') || lower.includes('store') || lower.includes('remember this')) {
      const content = input.replace(/add memory|save memory|store|remember this/gi, '').trim()
      if (content.length > 10) {
        const newMemory = {
          id: Date.now(),
          title: `Memory ${userMemories.length + 1}`,
          content,
          category: 'personal',
          emotion: 'neutral',
          date: new Date().toISOString().split('T')[0],
          tags: ['user-added']
        }
        userMemories.push(newMemory)
        return `✅ **Memory saved!**\n\n"${content.substring(0, 100)}..."\n\nYour memory has been stored. I can now help you recall it anytime!`
      }
    }

    // Help
    if (lower === 'help' || lower === '?' || lower === 'commands') {
      return `**AI Memory Assistant - Commands** 🔍

**Search:**
• "Show happy memories"
• "Find memories about family"
• "What happened in 2024?"
• "Search [keyword]"

**Analyze:**
• "Summarize my memories"
• "Year in review"
• "Memory statistics"

**Store:**
• "Save memory: [your content]"
• "Add memory: [your content]"

**Examples:**
• "Show me my happy moments"
• "Find family memories"
• "What was I doing in 2024?"
• "Summarize all my memories"
• "Save memory: Today I felt grateful..."`
    }

    // Default
    return `I can help you with your stored memories! Try:

• **"Show happy memories"** - Find by emotion
• **"Find family memories"** - Find by category  
• **"What happened in 2024?"** - Year review
• **"Summarize my memories"** - Get stats
• **"Save memory: [text]"** - Add new memory

Type **"help"** for all commands! 📚`
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    const userMessage = { text: input, sender: "user", timestamp: Date.now() }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const response = await getMemoryResponse(input)
    setMessages(prev => [...prev, { text: response, sender: "companion", timestamp: Date.now() }])
    setIsLoading(false)
  }

  return (
    <div className="ai-memory-assistant">
      <div className="chat-container">
        <div className="ai-avatar-section">
          <div className="ai-avatar">
            <div className="avatar-glow"></div>
            <div className="avatar-core">
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" stroke="url(#avatarGrad)" strokeWidth="2"/>
                <circle cx="50" cy="50" r="30" fill="url(#avatarGrad)" fillOpacity="0.1"/>
                <path d="M50 25L35 50H65L50 25Z" fill="url(#avatarGrad)" fillOpacity="0.8"/>
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
            <span className="ai-name">Nova Memory AI</span>
            <span className="ai-status">
              <span className="status-dot"></span>
              {isLoading ? 'Searching memories...' : `${userMemories.length} memories stored`}
            </span>
          </div>
        </div>

        <div className="messages-container">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <p className="empty-title">Memory Assistant Ready!</p>
              <p className="empty-subtitle">Ask me to search, summarize, or analyze your stored memories</p>
              <div className="quick-commands">
                <button onClick={() => setInput("Summarize my memories")} className="quick-btn">Summarize</button>
                <button onClick={() => setInput("Show happy memories")} className="quick-btn">Happy memories</button>
                <button onClick={() => setInput("Year in review")} className="quick-btn">Year review</button>
                <button onClick={() => setInput("Help")} className="quick-btn">Help</button>
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
                <p>{msg.text}</p>
                <span className="message-time">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>
          ))}
          
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
              placeholder="Search memories, ask for summaries..."
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
        </div>
      </div>
    </div>
  )
}
