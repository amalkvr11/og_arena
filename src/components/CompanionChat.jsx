import React, { useState, useEffect, useRef } from "react"
import ReactMarkdown from 'react-markdown'

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

I can help you with **real-time information** from the internet:

**🔍 Ask me anything about:**
• **SoulChain & 0G Labs** - Project details, technology
• **Crypto Prices** - "Bitcoin price", "ETH price", "Solana price"
• **Crypto News** - "Latest crypto news", "Bitcoin news today"
• **Blockchain Info** - Any cryptocurrency or project
• **Market Data** - Market cap, rankings, trends
• **General Knowledge** - Any topic from the web

**💡 Example Questions:**
• "What is the price of Bitcoin?"
• "Latest crypto news"
• "Tell me about Ethereum"
• "What is DeFi?"
• "Price of SOL"
• "Crypto market today"
• "News about 0G Labs"

Try asking me anything - I'll search the web for the latest information! 🌐`
}

const CryptoAPI = {
  async getPrice(coin) {
    try {
      const coinIds = {
        'bitcoin': 'bitcoin',
        'btc': 'bitcoin',
        'ethereum': 'ethereum',
        'eth': 'ethereum',
        'solana': 'solana',
        'sol': 'solana',
        'cardano': 'cardano',
        'ada': 'cardano',
        'polkadot': 'polkadot',
        'dot': 'polkadot',
        'ripple': 'ripple',
        'xrp': 'ripple',
        'dogecoin': 'dogecoin',
        'doge': 'dogecoin',
        'shiba': 'shiba-inu',
        'shib': 'shiba-inu',
        'avalanche': 'avalanche-2',
        'avax': 'avalanche-2',
        'chainlink': 'chainlink',
        'link': 'chainlink',
        'polygon': 'matic-network',
        'matic': 'matic-network',
        'binance': 'binancecoin',
        'bnb': 'binancecoin',
        'arbitrum': 'arbitrum',
        'arb': 'arbitrum',
        'optimism': 'optimism',
        'op': 'optimism',
      }
      
      const coinId = coinIds[coin.toLowerCase()] || coin.toLowerCase()
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
      )
      
      if (!response.ok) throw new Error('API error')
      
      const data = await response.json()
      
      if (data[coinId]) {
        const price = data[coinId].usd
        const change = data[coinId].usd_24h_change?.toFixed(2) || 0
        const marketCap = data[coinId].usd_market_cap
        
        const formatPrice = (p) => {
          if (p >= 1) return `$${p.toLocaleString(undefined, {maximumFractionDigits: 2})}`
          if (p >= 0.01) return `$${p.toFixed(4)}`
          return `$${p.toFixed(8)}`
        }
        
        const formatMC = (mc) => {
          if (mc >= 1e12) return `$${(mc/1e12).toFixed(2)}T`
          if (mc >= 1e9) return `$${(mc/1e9).toFixed(2)}B`
          if (mc >= 1e6) return `$${(mc/1e6).toFixed(2)}M`
          return `$${mc.toLocaleString()}`
        }
        
        return `**${coinId.charAt(0).toUpperCase() + coinId.slice(1)} Price** 💰

💵 **Current Price:** ${formatPrice(price)}
📊 **24h Change:** ${change >= 0 ? '🟢' : '🔴'} ${change}%
📈 **Market Cap:** ${formatMC(marketCap)}

_Data sourced from CoinGecko in real-time_`
      }
      
      return null
    } catch (error) {
      return null
    }
  },

  async getMarketData() {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/global'
      )
      
      if (!response.ok) throw new Error('API error')
      
      const data = await response.json()
      const global = data.data
      
      const totalMC = global.total_market_cap.usd
      const change = global.market_cap_change_percentage_24h_usd.toFixed(2)
      const btcDom = global.market_cap_percentage.btc.toFixed(1)
      const ethDom = global.market_cap_percentage.eth.toFixed(1)
      
      const formatMC = (mc) => {
        if (mc >= 1e12) return `$${(mc/1e12).toFixed(2)} Trillion`
        if (mc >= 1e9) return `$${(mc/1e9).toFixed(2)} Billion`
        return `$${mc.toLocaleString()}`
      }
      
      return `**🌍 Global Crypto Market Data**

💰 **Total Market Cap:** ${formatMC(totalMC)}
📊 **24h Change:** ${change >= 0 ? '🟢' : '🔴'} ${change}%

**Dominance:**
🟠 **Bitcoin (BTC):** ${btcDom}%
🔷 **Ethereum (ETH):** ${ethDom}%

**Active Cryptocurrencies:** ${global.active_cryptocurrencies.toLocaleString()}
**Markets:** ${global.markets.toLocaleString()}

_Data updated in real-time from CoinGecko_`
    } catch (error) {
      return null
    }
  },

  async getTrending() {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/search/trending'
      )
      
      if (!response.ok) throw new Error('API error')
      
      const data = await response.json()
      const coins = data.coins.slice(0, 5)
      
      let result = `**🔥 Trending Coins Today**\n\n`
      
      coins.forEach((item, index) => {
        const coin = item.item
        result += `${index + 1}. **${coin.name}** (${coin.symbol.toUpperCase()})\n   Market Cap Rank: #${coin.market_cap_rank || 'N/A'}\n\n`
      })
      
      result += `_Data from CoinGecko_`
      return result
    } catch (error) {
      return null
    }
  },

  async getTopCoins() {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h'
      )
      
      if (!response.ok) throw new Error('API error')
      
      const coins = await response.json()
      
      let result = `**🏆 Top 10 Cryptocurrencies by Market Cap**\n\n`
      result += `| Rank | Name | Price | 24h |\n`
      result += `|------|------|-------|-----|\n`
      
      coins.forEach((coin, index) => {
        const price = coin.current_price >= 1 
          ? `$${coin.current_price.toLocaleString(undefined, {maximumFractionDigits: 2})}`
          : `$${coin.current_price.toFixed(6)}`
        const change = coin.price_change_percentage_24h?.toFixed(2) || 0
        const changeEmoji = change >= 0 ? '🟢' : '🔴'
        
        result += `| ${index + 1} | ${coin.name} | ${price} | ${changeEmoji} ${change}% |\n`
      })
      
      result += `\n_Live data from CoinGecko_`
      return result
    } catch (error) {
      return null
    }
  },

  async getCoinInfo(coin) {
    try {
      const coinIds = {
        'bitcoin': 'bitcoin',
        'btc': 'bitcoin',
        'ethereum': 'ethereum',
        'eth': 'ethereum',
        'solana': 'solana',
        'sol': 'solana',
        'cardano': 'cardano',
        'ada': 'cardano',
        'polkadot': 'polkadot',
        'dot': 'polkadot',
        'ripple': 'ripple',
        'xrp': 'ripple',
        'dogecoin': 'dogecoin',
        'doge': 'dogecoin',
        'shiba': 'shiba-inu',
        'shib': 'shiba-inu',
        'avalanche': 'avalanche-2',
        'avax': 'avalanche-2',
        'chainlink': 'chainlink',
        'link': 'chainlink',
        'polygon': 'matic-network',
        'matic': 'matic-network',
        'binance': 'binancecoin',
        'bnb': 'binancecoin',
      }
      
      const coinId = coinIds[coin.toLowerCase()] || coin.toLowerCase()
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
      )
      
      if (!response.ok) throw new Error('API error')
      
      const data = await response.json()
      
      const formatMC = (mc) => {
        if (!mc) return 'N/A'
        if (mc >= 1e12) return `$${(mc/1e12).toFixed(2)}T`
        if (mc >= 1e9) return `$${(mc/1e9).toFixed(2)}B`
        if (mc >= 1e6) return `$${(mc/1e6).toFixed(2)}M`
        return `$${mc.toLocaleString()}`
      }
      
      let result = `**${data.name} (${data.symbol.toUpperCase()})**\n\n`
      
      if (data.description?.en) {
        const desc = data.description.en
          .replace(/<[^>]*>/g, '')
          .substring(0, 400)
        result += `📖 **About:**\n${desc}...\n\n`
      }
      
      result += `📊 **Key Stats:**\n`
      result += `• **Price:** $${data.market_data?.current_price?.usd?.toLocaleString() || 'N/A'}\n`
      result += `• **Market Cap:** ${formatMC(data.market_data?.market_cap?.usd)}\n`
      result += `• **24h Volume:** ${formatMC(data.market_data?.total_volume?.usd)}\n`
      result += `• **All-Time High:** $${data.market_data?.ath?.usd?.toLocaleString() || 'N/A'}\n`
      result += `• **Circulating Supply:** ${data.market_data?.circulating_supply?.toLocaleString() || 'N/A'} ${data.symbol.toUpperCase()}\n\n`
      
      if (data.links?.homepage?.[0]) {
        result += `🌐 **Website:** ${data.links.homepage[0]}\n`
      }
      
      result += `\n_Live data from CoinGecko_`
      return result
    } catch (error) {
      return null
    }
  },

  async getExchangeRates() {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/exchange_rates'
      )
      
      if (!response.ok) throw new Error('API error')
      
      const data = await response.json()
      const rates = data.rates
      
      return `**💱 Bitcoin Exchange Rates**

• **USD:** $${rates.usd.value.toLocaleString()}
• **EUR:** €${rates.eur.value.toLocaleString()}
• **GBP:** £${rates.gbp.value.toLocaleString()}
• **JPY:** ¥${rates.jpy.value.toLocaleString()}
• **CNY:** ¥${rates.cny.value.toLocaleString()}
• **INR:** ₹${rates.inr.value.toLocaleString()}

_1 BTC = these amounts_`
    } catch (error) {
      return null
    }
  },

  async searchWeb(query) {
    try {
      // Using Wikipedia API for general knowledge
      const searchQuery = encodeURIComponent(query)
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchQuery}&format=json&origin=*`
      )
      
      if (!response.ok) throw new Error('API error')
      
      const data = await response.json()
      
      if (data.query?.search?.length > 0) {
        const topResult = data.query.search[0]
        const pageId = topResult.pageid
        
        // Get the extract
        const extractResponse = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&pageids=${pageId}&format=json&origin=*`
        )
        
        const extractData = await extractResponse.json()
        const extract = extractData.query?.pages?.[pageId]?.extract
        
        if (extract) {
          const summary = extract.substring(0, 600) + (extract.length > 600 ? '...' : '')
          return `**${topResult.title}**\n\n${summary}\n\n_Source: Wikipedia_`
        }
      }
      
      return null
    } catch (error) {
      return null
    }
  }
}

export const CompanionChat = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getResponse = async (input) => {
    const lower = input.toLowerCase().trim()
    
    // Help command
    if (lower === 'help' || lower === '?' || lower === 'commands') {
      return NOVA_KNOWLEDGE.help
    }
    
    // Greetings
    if (lower.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
      const greetings = [
        "Hello! I'm Nova, your AI companion with **real-time web access**. Ask me about crypto prices, market data, news, or any topic! Type 'help' for all capabilities. 🌐",
        "Hey there! 👋 I'm Nova with live internet access! I can fetch crypto prices, market data, and info from the web. What would you like to know?",
        "Hi! Welcome to SoulChain. I'm Nova - I can access real-time data from the internet. Ask me about crypto, prices, news, or any topic! 🚀",
      ]
      return greetings[Math.floor(Math.random() * greetings.length)]
    }
    
    // Crypto price queries
    if (lower.includes('price') || lower.includes('how much') || lower.includes('worth')) {
      const coinMap = ['bitcoin', 'btc', 'ethereum', 'eth', 'solana', 'sol', 'cardano', 'ada', 
                       'polkadot', 'dot', 'ripple', 'xrp', 'dogecoin', 'doge', 'shiba', 'shib',
                       'avalanche', 'avax', 'chainlink', 'link', 'polygon', 'matic', 'binance', 'bnb']
      
      for (const coin of coinMap) {
        if (lower.includes(coin)) {
          const priceData = await CryptoAPI.getPrice(coin)
          if (priceData) return priceData
        }
      }
      
      // If "price" mentioned but no specific coin, show top coins
      if (lower.includes('price')) {
        return await CryptoAPI.getTopCoins() || "Let me fetch the top crypto prices..."
      }
    }
    
    // Market data
    if (lower.includes('market') || lower.includes('global') || lower.includes('total market') || lower.includes('crypto today')) {
      const marketData = await CryptoAPI.getMarketData()
      if (marketData) return marketData
    }
    
    // Trending
    if (lower.includes('trending') || lower.includes('hot') || lower.includes('popular coins')) {
      const trending = await CryptoAPI.getTrending()
      if (trending) return trending
    }
    
    // Top coins
    if (lower.includes('top 10') || lower.includes('top coins') || lower.includes('ranking') || lower.includes('biggest crypto')) {
      const topCoins = await CryptoAPI.getTopCoins()
      if (topCoins) return topCoins
    }
    
    // Exchange rates
    if (lower.includes('exchange rate') || lower.includes('btc to') || lower.includes('bitcoin rate')) {
      const rates = await CryptoAPI.getExchangeRates()
      if (rates) return rates
    }
    
    // Detailed coin info
    if (lower.includes('tell me about') || lower.includes('what is') || lower.includes('info about') || lower.includes('explain')) {
      const coinMap = ['bitcoin', 'btc', 'ethereum', 'eth', 'solana', 'sol', 'cardano', 'ada', 
                       'polkadot', 'dot', 'ripple', 'xrp', 'dogecoin', 'doge']
      
      for (const coin of coinMap) {
        if (lower.includes(coin)) {
          const coinInfo = await CryptoAPI.getCoinInfo(coin)
          if (coinInfo) return coinInfo
        }
      }
    }
    
    // SoulChain specific
    if (lower.includes('soulchain') || lower.includes('this project') || lower.includes('your project')) {
      if (lower.includes('how') && (lower.includes('work') || lower.includes('use'))) {
        return NOVA_KNOWLEDGE.soulchain.howItWorks
      }
      return NOVA_KNOWLEDGE.soulchain.overview
    }
    
    // 0G Labs
    if (lower.includes('0g') || lower.includes('zero gravity') || lower.includes('og lab')) {
      return `**0G Labs (Zero Gravity Labs)** 🚀

0G Labs is building the first modular AI blockchain with built-in data availability. Here's what you need to know:

**🏗️ Technology:**
• **0G Storage** - Decentralized, permanent file storage
• **0G DA Layer** - Data availability for blockchain
• **0G Chain** - High-throughput modular blockchain

**💡 Key Features:**
• AI-optimized infrastructure
• Up to 100x cheaper than alternatives
• Fast retrieval speeds
• Censorship-resistant

**🔗 SoulChain Connection:**
SoulChain uses 0G Storage to preserve your memories forever!

_Learn more at 0g.ai_`
    }
    
    // DeFi explanation
    if (lower.includes('defi') || lower.includes('decentralized finance')) {
      const searchResult = await CryptoAPI.searchWeb('Decentralized finance DeFi')
      if (searchResult) return `**DeFi (Decentralized Finance)**\n\n` + searchResult
    }
    
    // NFT
    if (lower.includes('nft') && !lower.includes('soulchain')) {
      const searchResult = await CryptoAPI.searchWeb('Non-fungible token NFT')
      if (searchResult) return searchResult
    }
    
    // Web3
    if (lower.includes('web3') || lower.includes('web 3')) {
      const searchResult = await CryptoAPI.searchWeb('Web3')
      if (searchResult) return searchResult
    }
    
    // Ethereum
    if (lower.includes('ethereum') && !lower.includes('price')) {
      const coinInfo = await CryptoAPI.getCoinInfo('ethereum')
      if (coinInfo) return coinInfo
    }
    
    // Bitcoin
    if ((lower.includes('bitcoin') || lower.includes('btc')) && !lower.includes('price') && !lower.includes('rate')) {
      const coinInfo = await CryptoAPI.getCoinInfo('bitcoin')
      if (coinInfo) return coinInfo
    }
    
    // Blockchain
    if (lower.includes('blockchain') && !lower.includes('soulchain')) {
      const searchResult = await CryptoAPI.searchWeb('Blockchain')
      if (searchResult) return searchResult
    }
    
    // Smart contracts
    if (lower.includes('smart contract')) {
      const searchResult = await CryptoAPI.searchWeb('Smart contract blockchain')
      if (searchResult) return searchResult
    }
    
    // General web search for other topics
    const searchTerms = lower
      .replace(/what is|who is|tell me about|explain|how does|when did|where is|why is/gi, '')
      .trim()
    
    if (searchTerms.length > 3 && !lower.includes('price') && !lower.includes('market')) {
      const webResult = await CryptoAPI.searchWeb(searchTerms)
      if (webResult) {
        return `**Web Search Results:**\n\n${webResult}\n\n💡 Ask me about crypto prices, market data, or any topic!`
      }
    }
    
    // Thank you
    if (lower.includes('thank')) {
      const thanks = [
        "You're welcome! I can fetch live data anytime. Try asking about crypto prices or market stats! 🚀",
        "Happy to help! I've got real-time access to crypto data and web info. Ask me anything! 🌐",
        "My pleasure! Remember - I can give you live prices, market data, and web info anytime. 💫",
      ]
      return thanks[Math.floor(Math.random() * thanks.length)]
    }
    
    // Memory-related
    if (lower.includes('memory') || lower.includes('remember') || lower.includes('store')) {
      return `**Memory Vault Feature** 💭

Store your memories permanently on SoulChain:

• **AES-256 Encryption** - Military-grade security
• **0G Storage** - Decentralized, permanent
• **Forever Access** - Retrieve anytime

**Tips for Writing Memories:**
• Include dates, places, people
• Add emotions and sensory details
• Be authentic - no need for perfect grammar

Ready to store a memory? Use the Memory Vault! 📝`
    }
    
    // Emotional support
    if (lower.includes('sad') || lower.includes('lonely') || lower.includes('depressed') || lower.includes('anxious')) {
      return `I hear you. 💙 

Sometimes life is challenging. Here's what SoulChain offers:

• **Preserve precious moments** - Store good memories to revisit
• **Digital legacy** - Your story continues forever
• **Private & secure** - Only you control your memories

Would you like to store a memory, or would you prefer to chat about something else to lift your spirits?`
    }
    
    // Default - show capabilities
    return `I'm not sure about that specific query, but I can help with:

**🌐 Real-Time Data:**
• "Bitcoin price" / "ETH price"
• "Crypto market today"
• "Top 10 cryptocurrencies"
• "Trending coins"

**📚 Information:**
• "What is DeFi?"
• "Tell me about Ethereum"
• "Explain NFTs"
• "What is Web3?"

**🔍 Web Search:**
• Ask about any topic and I'll search Wikipedia

**Project Info:**
• "Tell me about SoulChain"
• "What is 0G Labs?"

Type **"help"** for all my capabilities! 🚀`
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    const userMessage = { text: input, sender: "user", timestamp: Date.now() }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    
    try {
      const response = await getResponse(input)
      setMessages(prev => [...prev, { text: response, sender: "companion", timestamp: Date.now() }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "I encountered an error fetching that data. Please try again or ask something else!", 
        sender: "companion", 
        timestamp: Date.now() 
      }])
    } finally {
      setIsLoading(false)
    }
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
                <path d="M50 25L35 50H65L50 25Z" fill="url(#avatarGrad)" fillOpacity="0.8"/>
                <path d="M50 75L35 50H65L50 75Z" fill="url(#avatarGrad)" fillOpacity="0.5"/>
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
              {isLoading ? '🌐 Fetching live data...' : '🌐 Online with web access'}
            </span>
          </div>
        </div>

        <div className="messages-container">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <p className="empty-title">Hello, I'm Nova! 🌐</p>
              <p className="empty-subtitle">I have real-time web access! Ask me about crypto prices, market data, or any topic. Type "help" for all features.</p>
              <div className="quick-questions">
                <button onClick={() => setInput("Bitcoin price")} className="quick-btn">Bitcoin price</button>
                <button onClick={() => setInput("Crypto market today")} className="quick-btn">Market data</button>
                <button onClick={() => setInput("Top 10 crypto")} className="quick-btn">Top 10 coins</button>
                <button onClick={() => setInput("Trending coins")} className="quick-btn">Trending</button>
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
              placeholder="Ask anything... prices, markets, web search..."
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
            <span>🌐 Real-time data</span>
            <span className="separator">|</span>
            <span>Type "help" for features</span>
          </div>
        </div>
      </div>
    </div>
  )
}
