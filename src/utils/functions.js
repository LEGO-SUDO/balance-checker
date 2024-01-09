import { erc20ABI } from './erc20abi'
import Web3 from 'web3'

// Fetches the timestamp of a specific block from the blockchain.
export async function fetchBlockTimestamp(rpcUrl, blockNumber) {
  const web3 = new Web3(rpcUrl)

  try {
    const block = await web3.eth.getBlock(blockNumber)
    return block.timestamp // Returns the timestamp of the specified block.
  } catch (error) {
    console.error('Error fetching block timestamp: ', error)
    return null // Returns null in case of an error.
  }
}

// Calculates the average time between blocks for a given number of blocks.
export async function calculateAverageBlockTime(web3) {
  try {
    const currentBlockNumber = await web3.eth.getBlockNumber()

    // Fetching the current and a past block (1000 blocks ago) to calculate the average block time.
    const currentBlock = await web3.eth.getBlock(currentBlockNumber)
    const pastBlock = await web3.eth.getBlock(Number(currentBlockNumber) - 1000)

    // Parsing timestamps to integers and calculating the average time per block.
    const currentBlockTimestamp = parseInt(currentBlock.timestamp, 10)
    const pastBlockTimestamp = parseInt(pastBlock.timestamp, 10)

    const timeDifference = currentBlockTimestamp - pastBlockTimestamp
    const secondsPerBlock = timeDifference / 1000 // Average block time in seconds.
    return secondsPerBlock
  } catch (error) {
    console.error('Error calculating average block time: ', error)
    throw error // Rethrows the error for handling by the caller.
  }
}

// Fetches the current balance of a native token for a given user address.
export async function fetchNativeTokenBalance(rpcUrl, userAddress) {
  const web3 = new Web3(rpcUrl)
  try {
    const balanceWei = await web3.eth.getBalance(userAddress) // Fetches balance in Wei.
    const balanceEth = web3.utils.fromWei(balanceWei, 'ether') // Converts balance to Ether.
    return balanceEth
  } catch (error) {
    console.error('Error fetching native token balance: ', error)
    return null // Returns null in case of an error.
  }
}

// Fetches the historical balance of a native token for a given user address.
export async function fetchHistoricalNativeTokenBalance(rpcUrl, userAddress) {
  const web3 = new Web3(rpcUrl)
  try {
    const currentBlockNumber = await web3.eth.getBlockNumber()
    const secondsPerBlock = await calculateAverageBlockTime(web3)
    if (isNaN(secondsPerBlock)) {
      throw new Error('Invalid average block time')
    }

    // Calculating the block number from 12 hours ago.
    const blocks12HoursAgo = Math.floor((12 * 60 * 60) / secondsPerBlock)
    const blockNumber12HoursAgo =
      Number(currentBlockNumber) - Number(blocks12HoursAgo)

    // Fetching the balance at the calculated block number.
    const balanceWei = await web3.eth.getBalance(
      userAddress,
      String(blockNumber12HoursAgo)
    )
    const balanceEth = web3.utils.fromWei(balanceWei, 'ether')
    return balanceEth
  } catch (error) {
    console.error('Error fetching historical native token balance: ', error)
    return null // Returns null in case of an error.
  }
}

// Fetches the current balance of an ERC-20 token for a given user address.
export async function fetchERC20TokenBalance(
  rpcUrl,
  contractAddress,
  userAddress
) {
  const web3 = new Web3(rpcUrl)
  const contract = new web3.eth.Contract(erc20ABI, contractAddress)
  try {
    const balanceWei = await contract.methods.balanceOf(userAddress).call()
    const balanceToken = web3.utils.fromWei(balanceWei, 'ether') // Converts balance to token unit.
    return balanceToken
  } catch (error) {
    console.error('Error fetching ERC-20 token balance: ', error)
    return null // Returns null in case of an error.
  }
}

// Fetches the historical balance of an

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
