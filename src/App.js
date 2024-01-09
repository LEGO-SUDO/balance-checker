import React, { useState, useEffect } from 'react'
import TokenDisplayComponent from './Components/TokenDisplayComponent'
import { AddToken } from './Components/AddToken'
import ChainSelector from './Components/ChainSelector'

const initialTokens = [
  {
    chainName: 'Mantle',
    tokenType: 'Native',
    tokenAddress: '',
    rpcUrl: 'https://rpc.mantle.xyz',
  },
  {
    chainName: 'Linea',
    tokenType: 'Native',
    tokenAddress: '',
    rpcUrl: 'https://rpc.linea.build',
  },
  {
    chainName: 'Kroma',
    tokenType: 'Native',
    tokenAddress: '',
    rpcUrl: 'https://api.kroma.network',
  },
]

function App() {
  const [address, setAddress] = useState('')
  const [tokens, setTokens] = useState(initialTokens)
  const [selectedChain, setSelectedChain] = useState('All')
  const [showBalance, setShowBalance] = useState(true)

  useEffect(() => {
    const storedTokens = localStorage.getItem('tokens')
    if (storedTokens) {
      setTokens(JSON.parse(storedTokens))
    } else {
      localStorage.setItem('tokens', JSON.stringify(initialTokens))
    }
  }, [])

  const handleChainSelection = (chain) => {
    setSelectedChain(chain)
  }
  const handleAddToken = (newTokenData) => {
    const updatedTokens = [...tokens, newTokenData]
    setTokens(updatedTokens)
    localStorage.setItem('tokens', JSON.stringify(updatedTokens))
  }

  return (
    <div className='relative w-[100vw] h-[100vh]'>
      <div className='absolute w-[30vw] h-[50vh] left-[34%] top-[24%] bg-[#fc72ff] z-0 blur-[100px]' />
      <div className='bg-black absolute left-[30%] top-[20%] min-w-[320px] w-[40vw] h-[60vh] rounded-[2vw] py-[20px] px-[20px] z-50'>
        <div className='w-full py-[10px] flex justify-between items-center'>
          <div className='flex text-[#FAFAFA] '>
            <div
              className={` w-[150px] flex items-center justify-center ${
                showBalance
                  ? 'px-[12px] py-[8px] rounded-[20px] bg-[#fc72ff] hover:bg-[#f892fa]'
                  : 'border-[#202020cc] border-l-[2px] border-y-[2px] px-[8px] py-[8px] rounded-l-[20px] cursor-pointer'
              } `}
              onClick={() => setShowBalance(true)}
            >
              Balance
            </div>
            <div
              className={`py-[8px]  w-[150px] flex items-center justify-center ${
                !showBalance
                  ? 'px-[12px] rounded-[20px] bg-[#fc72ff] hover:bg-[#f892fa]'
                  : 'border-y-[2px] px-[8px] py-[8px] rounded-r-[20px] border-[#202020cc] border-r-[2px] cursor-pointer'
              }`}
              onClick={() => setShowBalance(false)}
            >
              Add NetWork
            </div>
          </div>
          <ChainSelector onChainSelect={handleChainSelection} />
        </div>
        {showBalance && (
          <>
            {' '}
            <div className='flex w-full gap-[12px] items-center justify-center'>
              <input
                type='text'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder='Enter your address 0x...daf'
                className=' w-full bg-[#202020] py-[10px] px-[12px] rounded-[8px] text-[#808080] outline-none'
              />
            </div>
            <TokenDisplayComponent
              userAddress={address}
              tokens={tokens}
              selectedChain={selectedChain}
            />{' '}
          </>
        )}
        {!showBalance && <AddToken onAddToken={handleAddToken} />}
      </div>
    </div>
  )
}

export default App
