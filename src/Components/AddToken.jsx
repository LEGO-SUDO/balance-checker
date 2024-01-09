import { useState } from 'react'

export function AddToken({ onAddToken }) {
  const [newToken, setNewToken] = useState({
    chainName: '',
    tokenType: '',
    tokenAddress: '',
    rpcUrl: '',
  })

  const handleChange = (e) => {
    setNewToken({ ...newToken, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddToken(newToken)
    setNewToken({ chainName: '', tokenType: '', tokenAddress: '', rpcUrl: '' })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full h-full flex flex-col px-[12px] py-[12px] gap-[12px]'
    >
      <input
        name='chainName'
        value={newToken.chainName}
        onChange={handleChange}
        placeholder='Chain Name'
        className=' w-full bg-[#202020] py-[10px] px-[12px] rounded-[8px] text-[#808080] outline-none'
      />
      <input
        name='tokenType'
        value={newToken.tokenType}
        onChange={handleChange}
        placeholder='Token Type (Native/ERC-20)'
        className=' w-full bg-[#202020] py-[10px] px-[12px] rounded-[8px] text-[#808080] outline-none'
      />
      <input
        name='tokenAddress'
        value={newToken.tokenAddress}
        onChange={handleChange}
        placeholder='Token Address (for ERC-20)'
        className=' w-full bg-[#202020] py-[10px] px-[12px] rounded-[8px] text-[#808080] outline-none'
      />
      <input
        name='rpcUrl'
        value={newToken.rpcUrl}
        onChange={handleChange}
        placeholder='RPC URL'
        className=' w-full bg-[#202020] py-[10px] px-[12px] rounded-[8px] text-[#808080] outline-none'
      />
      <button
        type='submit'
        className='bg-[#fc72ff] hover:bg-[#f892fa] px-[12px] py-[8px] text-[20px] text-[#FAFAFA] placeholder:text-[#FAFAFA] font-[600] rounded-[12px]'
      >
        Add Token
      </button>
    </form>
  )
}
