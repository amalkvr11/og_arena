export const sampleMemories = [
  {
    id: 1,
    title: "First Day at University",
    content: "September 15, 2015. Walking through the campus gates, I felt a mix of nervousness and excitement. My parents helped me move into the dorms. Room 302B would be my home for the next year. I met my roommate Jake - a biology major from Seattle. We stayed up until 3 AM talking about everything and nothing. Tomorrow, my first class begins.",
    tags: ["milestone", "education", "family", "friends"],
    category: "personal",
    date: "2015-09-15T10:30:00Z",
    encrypted: true,
    size: 389,
    hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef12345678"
  },
  {
    id: 2,
    title: "Grandma's 80th Birthday",
    content: "The whole family gathered at the old house by the lake. Grandma wore her favorite blue dress and had tears in her eyes when she saw all 23 of us there. Dad grilled steaks. Mom made her famous potato salad. We took a family photo on the porch - the same spot where grandpa proposed to grandma 56 years ago. These are the moments that matter.",
    tags: ["family", "celebration", "love", "memories"],
    category: "family",
    date: "2018-07-22T18:00:00Z",
    encrypted: true,
    size: 456,
    hash: "0x2b3c4d5e6f78901abcdef1234567890abcdef1234567890abcdef123456789"
  },
  {
    id: 3,
    title: "Startup Launch Day",
    content: "After 18 months of blood, sweat, and caffeine, we finally launched. I remember checking GitHub at 2 AM, fixing the final bugs. Our first customer signed up at 9:23 AM. I screamed. The team gathered around my laptop, watching the user count tick up. 10 users... 50 users... 100 users by end of day. This is why we build.",
    tags: ["career", "achievement", "team", "milestone"],
    category: "career",
    date: "2022-01-15T14:30:00Z",
    encrypted: true,
    size: 512,
    hash: "0x3c4d5e6f789012abcdef1234567890abcdef1234567890abcdef1234567890"
  },
  {
    id: 4,
    title: "Wedding Vows",
    content: "Standing there, heart pounding, watching her walk down the aisle. The sunlight caught the diamonds in her dress. I couldn't breathe. Our eyes met and suddenly nothing else existed. I promised to love her forever. And I meant it. Every single word. 'In sickness and in health, for better or worse.' The ring fits perfectly.",
    tags: ["love", "wedding", "commitment", "family"],
    category: "personal",
    date: "2020-06-20T16:00:00Z",
    encrypted: true,
    size: 367,
    hash: "0x4d5e6f7890123abcdef1234567890abcdef1234567890abcdef12345678901"
  },
  {
    id: 5,
    title: "Trip to Tokyo",
    content: "First time in Japan. The lights of Shibuya crossing at night were overwhelming. We got lost trying to find the ramen shop but ended up at this tiny izakaya where the owner spoke no English but insisted on buying us drinks. We ate the best sushi of our lives at Tsukiji at 5 AM. Cherry blossoms in Ueno Park. I want to go back.",
    tags: ["travel", "adventure", "culture", "food"],
    category: "travel",
    date: "2019-04-10T20:45:00Z",
    encrypted: true,
    size: 445,
    hash: "0x5e6f78901234abcdef1234567890abcdef1234567890abcdef123456789012"
  }
]

export const sampleTimeCapsules = [
  {
    id: 101,
    title: "Letter to My 30-Year-Old Self",
    content: "Dear Future Me, If you're reading this, you're 30 now. I hope you still remember your dreams - the real ones, not the ones others wanted for you. Remember when we used to stay up until 4 AM coding? I hope you still have that passion. I hope you found what makes you happy. I hope you're proud of the person you've become.",
    unlockDate: "2030-06-15",
    beneficiary: "Self",
    createdAt: "2023-06-15T00:00:00Z",
    status: "locked",
    hash: "0xcapsule001abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
  },
  {
    id: 102,
    title: "First Child's 18th Birthday",
    content: "To my beautiful child on your 18th birthday. I wrote this when you were just learning to walk. I wanted you to know how much joy you brought into my life from your very first breath. You changed everything for me. You taught me what unconditional love means. I'm so proud of who you've become. Go change the world.",
    unlockDate: "2040-03-20",
    beneficiary: "0x1234567890abcdef1234567890abcdef12345678",
    createdAt: "2022-03-20T00:00:00Z",
    status: "locked",
    hash: "0xcapsule002abcdef1234567890abcdef1234567890abcdef1234567890abcde"
  },
  {
    id: 103,
    title: "Silver Anniversary Surprise",
    content: "My dearest love, 25 years ago we made a promise. We were young and naive, believing love would be enough. Turns out we were right. Through job losses, health scares, financial stress, and raising three kids, we never let go of each other's hand. I'd choose you again in every lifetime. Here's to the next 25 years.",
    unlockDate: "2045-06-20",
    beneficiary: "0x2345678901abcdef1234567890abcdef1234567890abcdef1234567890ab",
    createdAt: "2020-06-20T00:00:00Z",
    status: "locked",
    hash: "0xcapsule003abcdef1234567890abcdef1234567890abcdef1234567890abcd"
  }
]

export const sampleBeneficiaries = [
  {
    id: 201,
    name: "Sarah Johnson",
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    relationship: "Spouse",
    percentage: 40,
    category: "all",
    status: "active",
    addedAt: "2022-01-15T00:00:00Z"
  },
  {
    id: 202,
    name: "Michael Johnson",
    address: "0xbcdef1234567890abcdef1234567890abcdef123",
    relationship: "Child",
    percentage: 30,
    category: "personal",
    status: "pending",
    addedAt: "2022-01-15T00:00:00Z"
  },
  {
    id: 203,
    name: "Emma Johnson",
    address: "0xcdef12345678901abcdef1234567890abcdef1234",
    relationship: "Child",
    percentage: 30,
    category: "personal",
    status: "pending",
    addedAt: "2022-01-15T00:00:00Z"
  }
]

export const networkStats = {
  totalMemories: 2847,
  totalBytes: 1256000000,
  activeUsers: 1256,
  timeCapsulesPending: 342,
  networkStatus: "operational",
  blockHeight: 12845623,
  avgBlockTime: "2.1s",
  lastUpdated: new Date().toISOString()
}

export const useCases = [
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Family Legacy",
    description: "Preserve family stories, photos, and videos for future generations",
    category: "Personal",
    stats: "45% of users"
  },
  {
    icon: "💼",
    title: "Professional Archive",
    description: "Store career milestones, projects, and professional achievements",
    category: "Business",
    stats: "28% of users"
  },
  {
    icon: "📚",
    title: "Creative Portfolio",
    description: "Artists and creators storing their life's work permanently",
    category: "Creative",
    stats: "18% of users"
  },
  {
    icon: "⚖️",
    title: "Legal Estate Planning",
    description: "Law firms managing digital assets for clients' estates",
    category: "Institutional",
    stats: "9% of users"
  }
]

export const testimonials = [
  {
    quote: "SoulChain gave me peace of mind knowing my children will have access to our family's most precious memories, even decades from now.",
    author: "Sarah M.",
    role: "Mother of 3",
    avatar: "S"
  },
  {
    quote: "As a filmmaker, my work is my legacy. Having it stored permanently on 0G Network means it will outlive me and continue inspiring others.",
    author: "Marcus T.",
    role: "Documentary Filmmaker",
    avatar: "M"
  },
  {
    quote: "We recommend SoulChain to our estate planning clients as a secure way to manage digital inheritance.",
    author: "Jennifer L.",
    role: "Estate Attorney",
    avatar: "J"
  }
]

export const pitchContent = {
  problem: {
    title: "The Problem",
    description: "Digital memories are fragile. Cloud services delete inactive accounts. Hard drives fail. Privacy is compromised. What happens to your digital life when you're gone?",
    statistics: [
      { value: "2.5B", label: "Photos lost yearly to account closures" },
      { value: "87%", label: "People have no digital inheritance plan" },
      { value: "$7.8T", label: "Digital assets at risk globally" }
    ]
  },
  solution: {
    title: "The Solution",
    description: "SoulChain combines military-grade encryption, decentralized storage on 0G Network, and smart contract automation to ensure your memories last forever.",
    features: ["AES-256 Encryption", "0G Decentralized Storage", "Smart Contract Inheritance", "AI Memory Assistant"]
  },
  market: {
    title: "Market Opportunity",
    tam: "$12.5B",
    sam: "$4.2B",
    som: "$840M",
    growth: "23% CAGR"
  },
  businessModel: {
    title: "Business Model",
    tiers: [
      { name: "Free", price: "$0", features: ["5 memories", "Basic encryption", "1 beneficiary"] },
      { name: "Family", price: "$9/mo", features: ["Unlimited memories", "Priority storage", "5 beneficiaries", "Time capsules"] },
      { name: "Institutional", price: "$99/mo", features: ["Enterprise features", "API access", "White-label", "SLA"] }
    ]
  },
  roadmap: [
    { quarter: "Q1 2024", milestone: "Beta Launch & 0G Integration" },
    { quarter: "Q2 2024", milestone: "Mobile App & Wallet Connect" },
    { quarter: "Q3 2024", milestone: "Enterprise Partnerships" },
    { quarter: "Q4 2024", milestone: "10,000 Active Users Target" },
    { quarter: "2025", milestone: "Series A & Global Expansion" }
  ]
}

let hasLoadedSampleData = false

export const initializeSampleData = () => {
  if (hasLoadedSampleData) return
  hasLoadedSampleData = true

  const existingMemories = localStorage.getItem('soulchain_memories')
  if (!existingMemories) {
    localStorage.setItem('soulchain_memories', JSON.stringify(sampleMemories.map(m => ({
      ...m,
      uploadedAt: m.date,
      userIdentification: 'demo_user'
    }))))
  }

  const existingCapsules = localStorage.getItem('soulchain_capsules')
  if (!existingCapsules) {
    localStorage.setItem('soulchain_capsules', JSON.stringify(sampleTimeCapsules))
  }

  const existingBeneficiaries = localStorage.getItem('soulchain_beneficiaries')
  if (!existingBeneficiaries) {
    localStorage.setItem('soulchain_beneficiaries', JSON.stringify(sampleBeneficiaries))
  }

  localStorage.setItem('soulchain_initialized', 'true')
}

export const getSampleMemories = () => sampleMemories
export const getSampleCapsules = () => sampleTimeCapsules
export const getSampleBeneficiaries = () => sampleBeneficiaries
export const getNetworkStats = () => networkStats
export const getUseCases = () => useCases
export const getTestimonials = () => testimonials
export const getPitchContent = () => pitchContent
