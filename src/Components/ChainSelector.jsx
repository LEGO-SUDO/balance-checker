import { useEffect, useState } from 'react'

export function ChainSelector({ onChainSelect }) {
  const [chains, setChains] = useState([])
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('tokens'))
    const arr = ['All']
    data.map((item) => {
      arr.push(item?.chainName)
      return null
    })
    setChains(arr)
  }, [])

  return (
    <select
      onChange={(e) => onChainSelect(e.target.value)}
      className='bg-transparent outline-none border-[#202020cc] border rounded-[4px] text-[#FAFAFA] text-[14px] px-[12px] py-[4px]'
    >
      {chains.map((chain, index) => (
        <option key={index} value={chain}>
          {chain}
        </option>
      ))}
    </select>
  )
}

export default ChainSelector
