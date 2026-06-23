import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { BrowserProvider, Signer } from 'ethers'
import { getIndexer, getNetworkInfo, checkWalletBalance, checkEncryptionKeyCached, clearWalletEncryptionKey } from '../utils/ogStorage'
import { SIGNATURE_PROMPT_MESSAGE } from '../utils/walletKeyDerivation'
import type { Web3ContextValue, OGNetwork } from '../types'

const Web3Context = createContext<Web3ContextValue | null>(null)

const OG_TESTNET: OGNetwork = {
  chainId: '0x40DA',
  chainIdHex: '0x40DA',
  chainIdDecimal: 16602,
  name: '0G Testnet',
  rpcUrl: import.meta.env.VITE_0G_RPC_URL || 'https://evmrpc-testnet.0g.ai',
  blockExplorer: import.meta.env.VITE_0G_BLOCK_EXPLORER || 'https://scan-testnet.0g.ai',
  storageExplorer: import.meta.env.VITE_0G_STORAGE_EXPLORER || 'https://storagescan.0g.ai',
  indexerUrl: import.meta.env.VITE_0G_INDEXER_URL || 'https://indexer-storage-testnet-turbo.0g.ai',
  faucet: 'https://faucet.0g.ai',
  nativeCurrency: { name: '0G', symbol: '0G', decimals: 18 }
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, callback: (...args: unknown[]) => void) => void
      removeAllListeners?: (event: string) => void
    }
  }
}

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [chainId, setChainId] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<'metamask' | 'mock' | null>(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true)
  const [signer, setSigner] = useState<Signer | null>(null)
  const [ogIndexer, setOgIndexer] = useState<unknown>(null)
  const [storageReady, setStorageReady] = useState(false)
  const [hasEncryptionKey, setHasEncryptionKey] = useState(false)

  const generateMockAddress = (): string => {
    return '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
  }

  const checkMetaMaskInstalled = useCallback((): boolean => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
  }, [])

  const initializeStorage = async (address: string, provider: BrowserProvider, walletSigner: Signer | null) => {
    try {
      const indexer = getIndexer()
      setOgIndexer(indexer)
      
      if (address && walletType === 'metamask' && walletSigner) {
        const hasKey = checkEncryptionKeyCached(address)
        setHasEncryptionKey(hasKey)
        
        const balanceInfo = await checkWalletBalance(address, provider)
        setBalance(balanceInfo.balanceEth?.toFixed(4) || '0')
        
        setStorageReady(true)
      } else {
        setStorageReady(walletType === 'mock')
      }
    } catch (e) {
      console.error('Failed to initialize storage:', e)
      setStorageReady(false)
    }
  }

  const connectRealWallet = async (): Promise<string> => {
    if (!checkMetaMaskInstalled()) {
      throw new Error('MetaMask not installed')
    }

    const provider = new BrowserProvider(window.ethereum!)
    await provider.send('eth_requestAccounts', [])
    const activeSigner = await provider.getSigner()
    
    const address = await activeSigner.getAddress()
    setAccount(address)
    setIsConnected(true)
    setWalletType('metamask')
    setSigner(activeSigner)
    
    const chain = await window.ethereum!.request({ method: 'eth_chainId' }) as string
    setChainId(chain)
    setIsCorrectNetwork(chain === OG_TESTNET.chainIdHex)
    
    await initializeStorage(address, provider, activeSigner)
    
    localStorage.setItem('walletConnected', 'true')
    localStorage.setItem('walletAddress', address)
    localStorage.setItem('walletType', 'metamask')
    
    return address
  }

  const connectMockWallet = async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockAddress = generateMockAddress()
    setAccount(mockAddress)
    setIsConnected(true)
    setWalletType('mock')
    setChainId(OG_TESTNET.chainIdHex)
    setIsCorrectNetwork(true)
    setBalance('1000.0000')
    setSigner(null)
    setStorageReady(true)
    setHasEncryptionKey(false)

    localStorage.setItem('walletConnected', 'true')
    localStorage.setItem('walletAddress', mockAddress)
    localStorage.setItem('walletType', 'mock')
    
    return mockAddress
  }

  const connectWallet = async (preferMock = false): Promise<string> => {
    setIsConnecting(true)
    setError(null)
    
    try {
      const hasMetaMask = checkMetaMaskInstalled()
      
      if (hasMetaMask && !preferMock) {
        return await connectRealWallet()
      } else {
        return await connectMockWallet()
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      if ((err as { code?: number }).code === 4001) {
        throw new Error('Connection rejected by user')
      }
      setError(errorMsg)
      throw err
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = useCallback(() => {
    if (account) {
      clearWalletEncryptionKey(account)
    }
    setAccount(null)
    setIsConnected(false)
    setChainId(null)
    setBalance(null)
    setWalletType(null)
    setError(null)
    setSigner(null)
    setOgIndexer(null)
    setStorageReady(false)
    setHasEncryptionKey(false)
    
    localStorage.removeItem('walletConnected')
    localStorage.removeItem('walletAddress')
    localStorage.removeItem('walletType')
  }, [account])

  const switchToOGNetwork = async (): Promise<void> => {
    if (!checkMetaMaskInstalled()) return

    try {
      await window.ethereum!.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: OG_TESTNET.chainIdHex }]
      })
    } catch (switchError) {
      if ((switchError as { code?: number }).code === 4902) {
        try {
          await window.ethereum!.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: OG_TESTNET.chainIdHex,
              chainName: OG_TESTNET.name,
              nativeCurrency: OG_TESTNET.nativeCurrency,
              rpcUrls: [OG_TESTNET.rpcUrl],
              blockExplorerUrls: [OG_TESTNET.blockExplorer]
            }]
          })
        } catch {
          setError('Failed to add 0G network')
        }
      }
    }
  }

  const requestEncryptionSignature = async (): Promise<boolean> => {
    if (!signer || walletType !== 'metamask') {
      return false
    }
    
    try {
      const signature = await signer.signMessage(SIGNATURE_PROMPT_MESSAGE)
      setHasEncryptionKey(true)
      return !!signature
    } catch (err) {
      console.error('Signature request failed:', err)
      return false
    }
  }

  const formatAddress = (address: string): string => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getExplorerUrl = (txHash: string): string => {
    return `${OG_TESTNET.blockExplorer}/tx/${txHash}`
  }

  const getStorageExplorerUrl = (rootHash: string): string => {
    return `${OG_TESTNET.storageExplorer}/file/${rootHash}`
  }

  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected')
    const savedAddress = localStorage.getItem('walletAddress')
    const savedWalletType = localStorage.getItem('walletType') as 'metamask' | 'mock' | null

    if (wasConnected === 'true' && savedAddress) {
      setAccount(savedAddress)
      setIsConnected(true)
      setWalletType(savedWalletType || 'mock')
      setChainId(OG_TESTNET.chainIdHex)
      setIsCorrectNetwork(true)
      setBalance(savedWalletType === 'mock' ? '1000.0000' : null)
      setStorageReady(savedWalletType === 'mock')
      
      if (savedAddress) {
        const hasKey = checkEncryptionKeyCached(savedAddress)
        setHasEncryptionKey(hasKey)
      }
    }

    if (checkMetaMaskInstalled() && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: unknown) => {
        const accountsArray = accounts as string[]
        if (accountsArray.length === 0) {
          disconnectWallet()
        } else {
          setAccount(accountsArray[0])
        }
      })

      window.ethereum.on('chainChanged', (chain: unknown) => {
        const chainStr = chain as string
        setChainId(chainStr)
        setIsCorrectNetwork(chainStr === OG_TESTNET.chainIdHex)
      })
    }

    return () => {
      if (checkMetaMaskInstalled() && window.ethereum?.removeAllListeners) {
        window.ethereum.removeAllListeners('accountsChanged')
        window.ethereum.removeAllListeners('chainChanged')
      }
    }
  }, [disconnectWallet, checkMetaMaskInstalled])

  const value: Web3ContextValue = {
    account,
    isConnected,
    isConnecting,
    chainId,
    balance,
    error,
    walletType,
    isCorrectNetwork,
    signer,
    ogIndexer,
    storageReady,
    hasEncryptionKey,
    connectWallet,
    disconnectWallet,
    switchToOGNetwork,
    formatAddress,
    checkMetaMaskInstalled,
    getExplorerUrl,
    getStorageExplorerUrl,
    network: OG_TESTNET
  }

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3 = (): Web3ContextValue => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

export { requestEncryptionSignature }

export default Web3Context
