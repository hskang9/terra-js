import * as SHA256 from 'crypto-js/sha256'

export interface Coin {
  denom: string
  amount: string
}

export interface Fee {
  gas: string
  amount: Coin[]
}

export interface InOut {
  address: string
  coins: Coin[]
}

export interface Signature {
  signature: string
  pub_key: {
    type: string
    value: string
  }
}

function normalizeDecimal(decimalNumber: string): string {
  const num = decimalNumber.split('.')
  let result = decimalNumber

  if (num.length === 1) {
    result += '000000000000000000'
  } else {
    const decimalPart = num[1]

    for (let i = 18; i > decimalPart.length; i -= 1) {
      result += '0'
    }
  }

  return result
}

export function generateVoteHash(salt: string, exchangeRate: string, denom: string, voter: string): string {
  const proof = `${salt}:${normalizeDecimal(exchangeRate)}:${denom}:${voter}`
  const hash = SHA256(proof).toString() // hex string

  return hash.slice(0, 40) // 20 prefix bytes
}

export interface StdTxValue {
  fee: Fee
  memo: string
  msg: object[]
  signatures: Signature[]
}

export interface StdTx {
  type: string
  value: StdTxValue
}

export function buildStdTx(msg: object[], fee: Fee, memo: string): StdTx {
  fee.amount.sort((a, b) => {
    if (a.denom < b.denom) return -1
    return 1
  })

  return {
    type: 'core/StdTx',
    value: {
      fee,
      memo,
      msg,
      signatures: []
    }
  }
}

interface MsgExchangeRatePrevote {
  type: string
  value: {
    hash: string
    denom: string
    feeder: string
    validator: string
  }
}

export function buildExchangeRatePrevote(hash: string, denom: string, feeder: string, validator: string): MsgExchangeRatePrevote {
  return {
    type: 'oracle/MsgExchangeRatePrevote',
    value: {
      hash,
      denom,
      feeder,
      validator
    }
  }
}

interface MsgExchangeRateVote {
  type: string
  value: {
    exchange_rate: string
    salt: string
    denom: string
    feeder: string
    validator: string
  }
}

export function buildExchangeRateVote(
  exchangeRate: string,
  salt: string,
  denom: string,
  feeder: string,
  validator: string
): MsgExchangeRateVote {
  return {
    type: 'oracle/MsgExchangeRateVote',
    value: {
      exchange_rate: exchangeRate,
      salt,
      denom,
      feeder,
      validator
    }
  }
}
interface MsgSend {
  type: string
  value: {
    amount: Coin[]
    from_address: string
    to_address: string
  }
}

export function buildSend(amount: Coin[], fromAddress: string, toAddress: string): MsgSend {
  // Sort coins before building msg
  amount.sort((a, b) => {
    if (a.denom < b.denom) return -1
    return 1
  })

  return {
    type: 'bank/MsgSend',
    value: {
      amount,
      from_address: fromAddress,
      to_address: toAddress
    }
  }
}

interface MsgMultiSend {
  type: string
  value: {
    inputs: InOut[]
    outputs: InOut[]
  }
}

export function buildMultiSend(inputs: InOut[], outputs: InOut[]): MsgMultiSend {
  // Sort coins before building msg
  inputs.forEach(o => {
    o.coins.sort((a, b) => {
      if (a < b) return -1
      return 1
    })
  })

  outputs.forEach(o => {
    o.coins.sort((a, b) => {
      if (a < b) return -1
      return 1
    })
  })

  return {
    type: 'bank/MsgMultiSend',
    value: {
      inputs,
      outputs
    }
  }
}

interface MsgSwap {
  type: string
  value: {
    trader: string
    offer_coin: Coin
    ask_denom: string
  }
}

export function buildSwap(trader: string, offerCoin: Coin, askDenom: string): MsgSwap {
  return {
    type: 'market/MsgSwap',
    value: {
      trader,
      offer_coin: offerCoin,
      ask_denom: askDenom
    }
  }
}

interface MsgSetWithdrawAddress {
  type: string
  value: {
    delegator_address: string
    withdraw_address: string
  }
}

export function buildSetWithdrawAddress(delegatorAddress: string, withdrawAddress: string): MsgSetWithdrawAddress {
  return {
    type: 'distribution/MsgModifyWithdrawAddress',
    value: {
      delegator_address: delegatorAddress,
      withdraw_address: withdrawAddress
    }
  }
}

interface MsgWithdrawDelegatorReward {
  type: string
  value: {
    delegator_address: string
    validator_address: string
  }
}

export function buildWithdrawDelegatorReward(
  delegatorAddress: string,
  validatorAddress: string
): MsgWithdrawDelegatorReward {
  return {
    type: 'distribution/MsgWithdrawDelegationReward',
    value: {
      delegator_address: delegatorAddress,
      validator_address: validatorAddress
    }
  }
}

interface MsgDelegate {
  type: string
  value: {
    delegator_address: string
    validator_address: string
    amount: Coin
  }
}

export function buildDelegate(delegatorAddress: string, validatorAddress: string, amount: Coin): MsgDelegate {
  return {
    type: 'staking/MsgDelegate',
    value: {
      delegator_address: delegatorAddress,
      validator_address: validatorAddress,
      amount
    }
  }
}

interface MsgRedelegate {
  type: string
  value: {
    delegator_address: string
    validator_src_address: string
    validator_dst_address: string
    amount: Coin
  }
}

export function buildRedelegate(
  delegatorAddress: string,
  validatorSrcAddress: string,
  validatorDstAddress: string,
  amount: Coin
): MsgRedelegate {
  return {
    type: 'staking/MsgBeginRedelegate',
    value: {
      delegator_address: delegatorAddress,
      validator_src_address: validatorSrcAddress,
      validator_dst_address: validatorDstAddress,
      amount
    }
  }
}

interface MsgUndelegate {
  type: string
  value: {
    delegator_address: string
    validator_address: string
    amount: Coin
  }
}

export function buildUndelegate(delegatorAddress: string, validatorAddress: string, amount: Coin): MsgUndelegate {
  return {
    type: 'staking/MsgUndelegate',
    value: {
      delegator_address: delegatorAddress,
      validator_address: validatorAddress,
      amount
    }
  }
}

interface MsgDeposit {
  type: string
  value: {
    proposal_id: string
    depositor: string
    amount: Coin[]
  }
}

export function buildDeposit(proposalID: string, depositor: string, amount: Coin[]): MsgDeposit {
  return {
    type: 'gov/MsgDeposit',
    value: {
      proposal_id: proposalID,
      depositor,
      amount
    }
  }
}

export enum VoteOption {
  OptionEmpty = 0x00,
  OptionYes = 0x01,
  OptionAbstain = 0x02,
  OptionNo = 0x03,
  OptionNoWithVeto = 0x04
}

interface MsgVote {
  type: string
  value: {
    proposal_id: string
    voter: string
    option: VoteOption
  }
}

export function buildVote(proposalID: string, voter: string, option: VoteOption): MsgVote {
  return {
    type: 'gov/MsgVote',
    value: {
      proposal_id: proposalID,
      voter,
      option
    }
  }
}
