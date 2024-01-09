import { erc20ABI } from './erc20abi'
import Web3 from 'web3'

export async function fetchBlockTimestamp(rpcUrl, blockNumber) {
  const web3 = new Web3(rpcUrl)

  try {
    const block = await web3.eth.getBlock(blockNumber)
    return block.timestamp
  } catch (error) {
    console.error('Error fetching block timestamp: ', error)
    return null
  }
}

export async function calculateAverageBlockTime(web3) {
  try {
    const currentBlockNumber = await web3.eth.getBlockNumber()

    const currentBlock = await web3.eth.getBlock(currentBlockNumber)
    const pastBlock = await web3.eth.getBlock(Number(currentBlockNumber) - 1000)

    const currentBlockTimestamp = parseInt(currentBlock.timestamp, 10)
    const pastBlockTimestamp = parseInt(pastBlock.timestamp, 10)

    const timeDifference = currentBlockTimestamp - pastBlockTimestamp
    const secondsPerBlock = timeDifference / 1000
    return secondsPerBlock
  } catch (error) {
    console.error('Error calculating average block time: ', error)
    throw error
  }
}

export async function fetchNativeTokenBalance(rpcUrl, userAddress) {
  const web3 = new Web3(rpcUrl)
  try {
    const balanceWei = await web3.eth.getBalance(userAddress)
    const balanceEth = web3.utils.fromWei(balanceWei, 'ether')
    return balanceEth
  } catch (error) {
    console.error('Error fetching native token balance: ', error)
    return null
  }
}
export async function fetchHistoricalNativeTokenBalance(rpcUrl, userAddress) {
  const web3 = new Web3(rpcUrl)
  try {
    const currentBlockNumber = await web3.eth.getBlockNumber()
    const secondsPerBlock = await calculateAverageBlockTime(web3)
    if (isNaN(secondsPerBlock)) {
      throw new Error('Invalid average block time')
    }

    const blocks12HoursAgo = Math.floor((12 * 60 * 60) / secondsPerBlock)
    const blockNumber12HoursAgo =
      Number(currentBlockNumber) - Number(blocks12HoursAgo)
    console.log(blockNumber12HoursAgo)
    const balanceWei = await web3.eth.getBalance(
      userAddress,
      String(blockNumber12HoursAgo)
    )
    const balanceEth = web3.utils.fromWei(balanceWei, 'ether')
    return balanceEth
  } catch (error) {
    console.error('Error fetching historical native token balance: ', error)
    return null
  }
}

export async function fetchERC20TokenBalance(
  rpcUrl,
  contractAddress,
  userAddress
) {
  const web3 = new Web3(rpcUrl)
  const contract = new web3.eth.Contract(erc20ABI, contractAddress)
  try {
    const balanceWei = await contract.methods.balanceOf(userAddress).call()
    const balanceToken = web3.utils.fromWei(balanceWei, 'ether')
    return balanceToken
  } catch (error) {
    console.error('Error fetching ERC-20 token balance: ', error)
    return null
  }
}

export async function fetchHistoricalERC20TokenBalance(
  rpcUrl,
  contractAddress,
  userAddress
) {
  const web3 = new Web3(rpcUrl)
  const contract = new web3.eth.Contract(erc20ABI, contractAddress)
  try {
    const secondsPerBlock = await calculateAverageBlockTime(web3)
    const currentBlockNumber = await web3.eth.getBlockNumber()
    const blocks12HoursAgo = Math.floor((12 * 60 * 60) / secondsPerBlock)
    const blockNumber12HoursAgo =
      Number(currentBlockNumber) - Number(blocks12HoursAgo)

    const balanceWei = await contract.methods
      .balanceOf(userAddress)
      .call({}, blockNumber12HoursAgo)
    return web3.utils.fromWei(balanceWei, 'ether')
  } catch (error) {
    console.error('Error fetching historical ERC-20 token balance: ', error)
    return null
  }
}
