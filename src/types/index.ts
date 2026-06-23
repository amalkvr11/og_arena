export interface UploadResult {
  success: boolean
  txHash?: string
  rootHash?: string
  blockExplorerUrl?: string
  storageExplorerUrl?: string
  encrypted?: boolean
  size?: number
  filename?: string
  uploadedAt?: string
  walletAddress?: string
  error?: string
}

export interface DownloadResult {
  success: boolean
  blob?: Blob
  data?: Blob
  error?: string
}

export interface EncryptionStatus {
  encrypted: boolean
  type?: 'aes256' | 'ecies' | 'unknown'
}

export interface VerificationResult {
  verified: boolean
  exists?: boolean
  header?: unknown
  error?: string | unknown
}

export interface NetworkInfo {
  rpcUrl: string
  indexerUrl: string
  blockExplorer: string
  storageExplorer: string
  encryptionEnabled: boolean
}

export interface BalanceInfo {
  balance: string
  balanceEth: number
  error?: string
}

export interface ExplorerUrls {
  blockExplorer: string
  storageExplorer: string | null
}

export interface Memory {
  id: string
  title: string
  content: string
  category: string
  date: string
  encrypted: boolean
  rootHash?: string
  txHash?: string
}

export interface TimeCapsule {
  id: string
  memoryId: string
  unlockDate: string
  created: string
  recipient?: string
}

export interface Beneficiary {
  id: string
  address: string
  name: string
  relationship: string
  addedAt: string
}

export interface Web3ContextValue {
  account: string | null
  isConnected: boolean
  isConnecting: boolean
  chainId: string | null
  balance: string | null
  error: string | null
  walletType: 'metamask' | 'mock' | null
  isCorrectNetwork: boolean
  signer: unknown
  ogIndexer: unknown
  storageReady: boolean
  hasEncryptionKey: boolean
  connectWallet: (preferMock?: boolean) => Promise<string>
  disconnectWallet: () => void
  switchToOGNetwork: () => Promise<void>
  formatAddress: (address: string) => string
  checkMetaMaskInstalled: () => boolean
  getExplorerUrl: (txHash: string) => string
  getStorageExplorerUrl: (rootHash: string) => string
  network: OGNetwork
}

export interface OGNetwork {
  chainId: string
  chainIdHex: string
  chainIdDecimal: number
  name: string
  rpcUrl: string
  blockExplorer: string
  storageExplorer: string
  indexerUrl: string
  faucet: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export interface WalletDerivedKey {
  key: Uint8Array
  derived: boolean
  cached: boolean
}

export type NavIcon = 'home' | 'vault' | 'ai' | 'contract' | 'capsule' | 'legacy' | 'nft' | 'assistant' | 'media' | 'collections' | 'dashboard' | 'pitch'

export interface NavItem {
  path: string
  label: string
  icon: NavIcon
}

export interface DropdownNavItem extends NavItem {
  desc: string
}
