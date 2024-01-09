import React, { useState, useEffect } from 'react'
import {
  fetchNativeTokenBalance,
  fetchHistoricalNativeTokenBalance,
  fetchERC20TokenBalance,
  fetchHistoricalERC20TokenBalance,
} from '../utils/functions'
import { Toast } from './NotificationToast'

function TokenDisplayComponent({ tokens, userAddress, selectedChain }) {
  const [tokenData, setTokenData] = useState([])
  const [toasts, setToasts] = useState([])

  const calculatePercentageChange = (currentBalance, historicalBalance) => {
    if (historicalBalance === 0) {
      return 'N/A' // To handle divide by zero
    }
    return (
      ((currentBalance - historicalBalance) / historicalBalance) *
      100
    ).toFixed(2)
  }

  const addToast = (message) => {
    setToasts((toasts) => [...toasts, message])
  }

  useEffect(() => {
    const filteredTokens =
      selectedChain === 'All'
        ? tokens
        : tokens.filter((token) => token.chainName === selectedChain)

    setTokenData(
      filteredTokens.map((token) => ({
        ...token,
        balance: 'Loading...',
        balanceChange: 'Loading...',
      }))
    )

    filteredTokens.forEach(async (token, index) => {
      let currentBalance = 'Error'
      let historicalBalance = 'Error'

      try {
        if (token.tokenType === 'Native' && userAddress) {
          currentBalance = await fetchNativeTokenBalance(
            token.rpcUrl,
            userAddress
          )
          historicalBalance = await fetchHistoricalNativeTokenBalance(
            token.rpcUrl,
            userAddress
          )
        } else if (token.tokenType === 'ERC-20') {
          currentBalance = await fetchERC20TokenBalance(
            token.rpcUrl,
            token.tokenAddress,
            userAddress
          )
          historicalBalance = await fetchHistoricalERC20TokenBalance(
            token.rpcUrl,
            token.tokenAddress,
            userAddress
          )
        }

        const balanceChange = calculatePercentageChange(
          parseFloat(currentBalance),
          parseFloat(historicalBalance)
        )
        if (balanceChange < 10) {
          addToast(
            `Token ${token.chainName}: Balance decreased by more than 10 in the last 12 hours.`
          )
        }
        setTokenData((currentData) =>
          currentData.map((item, idx) =>
            idx === index
              ? { ...item, balance: currentBalance, balanceChange }
              : item
          )
        )
      } catch (error) {
        console.error(`Error fetching balance for ${token.tokenName}: `, error)
      }
    })
  }, [tokens, userAddress, selectedChain])
  const removeToast = (id) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id))
  }

  useEffect(() => {
    console.log(toasts)
  }, [toasts])
  return (
    <div className='flex flex-col h-[40vh] px-[20px] py-[20px] gap-[8px]'>
      <div className='flex justify-between'>
        <p className='text-[#FAFAFA] text-[20px] font-[600] uppercase'>
          ChainName
        </p>
        <p className='text-[#FAFAFA] text-[20px] font-[600] uppercase'>
          Balance (Change %)
        </p>
      </div>
      <div className='overflow-auto'>
        {tokenData.map((token, index) => (
          <div
            key={index}
            className='bg-black hover:bg-[#202020] py-[12px] px-[8px] rounded-[8px] flex item-center justify-between'
          >
            <h3 className='text-[#FAFAFA] uppercase text-[16px] font-[600]'>
              {token.chainName}
            </h3>
            <div className='text-[#909090] text-[14px] font-[600]'>
              <p>
                {isNaN(parseFloat(token.balance))
                  ? '--.--'
                  : parseFloat(token.balance).toFixed(5)}
              </p>
              <p
                className={`text-end ${
                  token.balanceChange > 0
                    ? 'text-green-500'
                    : token.balanceChange < 0
                    ? 'text-red-500'
                    : ''
                }`}
              >
                {token.balanceChange !== 'Loading...' &&
                !isNaN(token.balanceChange)
                  ? `${token.balanceChange}%`
                  : '0%'}
              </p>
            </div>
          </div>
        ))}
      </div>
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast}
          onClose={() => removeToast(toast.id)}
          style={{ top: `${20 + index * 60}px` }}
        />
      ))}
    </div>
  )
}

export default TokenDisplayComponent
