import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { BrowserProvider } from 'ethers'
import { getIndexer, getEncryptionKey, getNetworkInfo, checkWalletBalance } from '../utils/ogStorage'

const Web3Context = createContext(null)

const OG_TESTNET = {
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

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [chainId, setChainId] = useState(null)
  const [balance, setBalance] = useState(null)
  const [error, setError] = useState(null)
  const [walletType, setWalletType] = useState(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true)
  const [signer, setSigner] = useState(null)
  const [ogIndexer, setOgIndexer] = useState(null)
  const [storageReady, setStorageReady] = useState(false)
  const [hasEncryptionKey, setHasEncryptionKey] = useState(false)

  const generateMockAddress = () => {
    return '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
  }

  const checkMetaMaskInstalled = useCallback(() => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
  }, [])

  const initializeStorage = async (address, provider) => {
    try {
      const indexer = getIndexer()
      setOgIndexer(indexer)
      
      if (address && walletType === 'metamask') {
        const encryptionKey = getEncryptionKey(address)
        setHasEncryptionKey(!!encryptionKey)
        
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

  const connectRealWallet = async () => {
    if (!checkMetaMaskInstalled()) {
      throw new Error('MetaMask not installed')
    }

    try {
      const provider = new BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const activeSigner = await provider.getSigner()
      
      const address = await activeSigner.getAddress()
      setAccount(address)
      setIsConnected(true)
      setWalletType('metamask')
      setSigner(activeSigner)
      
      const chain = await window.ethereum.request({ method: 'eth_chainId' })
      setChainId(chain)
      setIsCorrectNetwork(chain === OG_TESTNET.chainIdHex)
      
      await initializeStorage(address, provider)
      
      localStorage.setItem('walletConnected', 'true')
      localStorage.setItem('walletAddress', address)
      localStorage.setItem('walletType', 'metamask')
      
      return address
    } catch (err) {
      if (err.code === 4001) {
        throw new Error('Connection rejected by user')
      }
      throw err
    }
  }

  const connectMockWallet = async () => {
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

    localStorage.setItem('walletConnected', 'true')
    localStorage.setItem('walletAddress', mockAddress)
    localStorage.setItem('walletType', 'mock')
    
    return mockAddress
  }

  const connectWallet = async (preferMock = false) => {
    setIsConnecting(true)
    setError(null)
    
    try {
      const hasMetaMask = checkMetaMaskInstalled()
      
      if (hasMetaMask && !preferMock) {
        await connectRealWallet()
      } else {
        await connectMockWallet()
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = useCallback(() => {
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
  }, [])

  const switchToOGNetwork = async () => {
    if (!checkMetaMaskInstalled()) return

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: OG_TESTNET.chainIdHex }]
      })
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: OG_TESTNET.chainIdHex,
              chainName: OG_TESTNET.name,
              nativeCurrency: OG_TESTNET.nativeCurrency,
              rpcUrls: [OG_TESTNET.rpcUrl],
              blockExplorerUrls: [OG_TESTNET.blockExplorer]
            }]
          })
        } catch (addError) {
          setError('Failed to add 0G network')
        }
      }
    }
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getExplorerUrl = (txHash) => {
    return `${OG_TESTNET.blockExplorer}/tx/${txHash}`
  }

  const getStorageExplorerUrl = (rootHash) => {
    return `${OG_TESTNET.storageExplorer}/file/${rootHash}`
  }

  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected')
    const savedAddress = localStorage.getItem('walletAddress')
    const savedWalletType = localStorage.getItem('walletType')

    if (wasConnected === 'true' && savedAddress) {
      setAccount(savedAddress)
      setIsConnected(true)
      setWalletType(savedWalletType || 'mock')
      setChainId(OG_TESTNET.chainIdHex)
      setIsCorrectNetwork(true)
      setBalance(savedWalletType === 'mock' ? '1000.0000' : null)
      setStorageReady(savedWalletType === 'mock')
      
      if (savedAddress) {
        const encryptionKey = getEncryptionKey(savedAddress)
        setHasEncryptionKey(!!encryptionKey)
      }
    }

    if (checkMetaMaskInstalled()) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setAccount(accounts[0])
        }
      })

      window.ethereum.on('chainChanged', (chain) => {
        setChainId(chain)
        setIsCorrectNetwork(chain === OG_TESTNET.chainIdHex)
      })
    }

    return () => {
      if (checkMetaMaskInstalled()) {
        window.ethereum.removeAllListeners?.('accountsChanged')
        window.ethereum.removeAllListeners?.('chainChanged')
      }
    }
  }, [disconnectWallet, checkMetaMaskInstalled])

  const value = {
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

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

export default Web3Context
