import React, { useState, useEffect } from 'react'
import TokenDisplayComponent from './Components/TokenDisplayComponent'
import { AddToken } from './Components/AddToken'
import ChainSelector from './Components/ChainSelector'

// Initial token data for display
const initialTokens = [
  // Add other initial tokens as needed
]

function App() {
  // State for storing user's Ethereum address
  const [address, setAddress] = useState('')

  // State for storing tokens
  const [tokens, setTokens] = useState(initialTokens)

  // State for storing the currently selected blockchain chain
  const [selectedChain, setSelectedChain] = useState('All')

  // State to toggle between showing balances and adding a new token/network
  const [showBalance, setShowBalance] = useState(true)

  // Load tokens from localStorage or initialize with default tokens
  useEffect(() => {
    const storedTokens = localStorage.getItem('tokens')
    if (storedTokens) {
      setTokens(JSON.parse(storedTokens))
    } else {
      localStorage.setItem('tokens', JSON.stringify(initialTokens))
    }
  }, [])

  // Handler for changing the selected blockchain chain
  const handleChainSelection = (chain) => {
    setSelectedChain(chain)
  }

  // Handler for adding a new token
  const handleAddToken = (newTokenData) => {
    const updatedTokens = [...tokens, newTokenData]
    setTokens(updatedTokens)
    localStorage.setItem('tokens', JSON.stringify(updatedTokens))
  }

  return (
    <div className='relative w-[100vw] h-[100vh]'>
      {/* Background and styling */}
      <div className='bg-black absolute left-[30%] top-[20%] min-w-[320px] w-[40vw] h-[60vh] rounded-[2vw] py-[20px] px-[20px] z-50'>
        {/* Header section for balance and add network */}
        <div className='w-full py-[10px] flex justify-between items-center'>
          {/* Balance and Add Network toggle buttons */}
        </div>

        {/* Conditionally render TokenDisplayComponent or AddToken based on toggle state */}
        {showBalance ? (
          <>
            {/* User address input field */}
            <TokenDisplayComponent
              userAddress={address}
              tokens={tokens}
              selectedChain={selectedChain}
            />
          </>
        ) : (
          <AddToken onAddToken={handleAddToken} />
        )}
      </div>
    </div>
  )
}

export default App
