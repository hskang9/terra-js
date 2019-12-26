# Terra Javascript Library
This project provides Javascript & Node.js SDK library for [Core](https://github.com/terra-project/core) of [Terra](https://terra.money).

## Example
```node
const mnemonic = terra.generateMnemonic()
const masterKey = terra.deriveMasterKeySync(mnemonic)
const keypair = terra.deriveKeypair(masterKey)
const accAddr = terra.getAccAddress(keypair.publicKey)

const msgSend = terra.buildSend([
  {
    "amount": "1000000",
    "denom": "uluna"
  }
], accAddr, "terra1ptdx6akgk7wwemlk5j73artt5t6j8am08ql3qv");


const stdTx = terra.buildStdTx([msgSend], {
  "gas": "200000",
  "amount": [
    {
      "amount": "1000",
      "denom": "uluna"
    }
  ]
}, "library test")
const jsonTx = stdTx.value
const txSignature = terra.sign(jsonTx, keypair, {
  sequence: "0",
  account_number: "167",
  chain_id: "soju-0009"
})
const signedTx = terra.createSignedTx(stdTx.value, txSignature)
const broadcastBody = terra.createBroadcastBody(signedTx, "block")

// get txid
stdTx.value = signedTx
const txbytes = terra.getAminoDecodedTxBytes(stdTx)
const txhash = terra.getTxHash(txbytes)

console.log(accAddr, broadcastBody, txhash)
```

## Functions for building various messages
* buildExchangeRatePrevote
* buildExchangeRateVote
* buildSend
* buildMultiSend
* buildSwap
* buildDelegate
* buildRedelegate
* buildSetWithdrawAddress
* buildUndelegate
* buildWithdrawDelegatorReward
* buildDeposit
* buildVote
