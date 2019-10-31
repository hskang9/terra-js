import * as terra from '../../src/index'
import * as assert from 'chai'
import { triggerAsyncId } from 'async_hooks';

describe('tx', () => {
  it('signature', async () => {
    const masterKey = await terra.deriveMasterKey(
      'island relax shop such yellow opinion find know caught erode blue dolphin behind coach tattoo light focus snake common size analyst imitate employ walnut'
    )
    const keypair = terra.deriveKeypair(masterKey, 0, 0)
    const accAddr = terra.getAccAddress(keypair.publicKey)
    console.log(accAddr)
    const msgSend = terra.buildSend(
      [
        {
          amount: '100000000',
          denom: 'uluna'
        }
      ], 
      accAddr, 
      'terra1wg2mlrxdmnnkkykgqg4znky86nyrtc45q336yv'
    )

    const stdTx = terra.buildStdTx(
      [msgSend], 
      {
        'gas': '46467',
        'amount': [
          {
            'amount': '698',
            'denom': 'uluna'
          }
        ]
      }, 
      ''
    )

    const jsonTx = stdTx.value
    const txSignature = terra.sign(jsonTx, keypair, {
      sequence: '0',
      account_number: '45',
      chain_id: 'columbus-3-testnet'
    })

    assert
      .expect(txSignature.signature)
      .equal('FJKAXRxNB5ruqukhVqZf3S/muZEUmZD10fVmWycdVIxVWiCXXFsUy2VY2jINEOUGNwfrqEZsT2dUfAvWj8obLg==')
  })

  it('multisig', async () => {
    const receiverAddr = 'terra1ptdx6akgk7wwemlk5j73artt5t6j8am08ql3qv'

    const multisigAddr = 'terra16ddrexknvk2e443jsnle4n6s2ewjc6z3mjcu6d'
    const multisigAccountNumber = '46'
    const multisigSequenceNumber = '0'

    const a1Key = await terra.deriveMasterKey(
      'swamp increase solar renew twelve easily possible pig ostrich harvest more indicate lion denial kind target small dumb mercy under proud arrive gentle field'
    )
    const a1Keypair = terra.deriveKeypair(a1Key, 0, 0)
    const a1AccAddress = terra.getAccAddress(a1Keypair.publicKey)

    assert.expect(a1AccAddress).equal('terra12dazwl3yq6nwrce052ah3fudkarglsgvacyvl9')

    const a2Key = await terra.deriveMasterKey(
      'service frozen keen unveil luggage initial surge name conduct mesh soup escape weather gas clown brand holiday result protect chat plug false pitch little'
    )
    const a2Keypair = terra.deriveKeypair(a2Key, 0, 0)
    const a2AccAddress = terra.getAccAddress(a2Keypair.publicKey)

    assert.expect(a2AccAddress).equal('terra1jqw25580qljucyy2xkpp7j02kd4mwx69wvfgf9')

    const a3Key = await terra.deriveMasterKey(
      'corn peasant blue sight spy three stove confirm night brother vote dish reduce sick observe outside vacant arena laugh devote exotic wasp supply rally'
    )
    const a3Keypair = terra.deriveKeypair(a3Key, 0, 0)
    const a3AccAddress = terra.getAccAddress(a3Keypair.publicKey)

    assert.expect(a3AccAddress).equal('terra13hrg8ul0p7sh85jwalh3leysdrw9swh44dql2h')

    const msgSend = terra.buildSend(
      [
        {
          amount: '100000000',
          denom: 'uluna'
        }
      ], 
      multisigAddr, 
      receiverAddr
    )

    const stdTx = terra.buildStdTx(
      [msgSend], 
      {
        gas: '50000',
        amount: [
          {
            amount: '750',
            denom: 'uluna'
          }
        ]
      }, 
      ''
    )

    const jsonTx = stdTx.value
    const signMeta:terra.SignMetaData = {
      sequence: multisigSequenceNumber,
      account_number: multisigAccountNumber,
      chain_id: 'columbus-3-testnet'
    }
    const a1Signature = terra.sign(jsonTx, a1Keypair, signMeta)

    assert
      .expect(a1Signature.signature)
      .equal('/kIFqGnmgOqMzf7guoe1eDTA1W5TjJcelJSRBdN0CTRyyxTMIbsxd+wL4fatHAq4hYOTf/zxD4l5xyU7/POZyg==')

    const a2Signature = terra.sign(jsonTx, a2Keypair, signMeta)

    assert
      .expect(a2Signature.signature)
      .equal('hEjv9CnXQa89robHVsHS3GDZJiunnNb8xqziWD8D4aAuBXwxDzUXY14IE7q9Z3Qh0VMb3FBHuogHi7QZn2pM9g==')

    const a3Signature = terra.sign(jsonTx, a3Keypair, signMeta)

    assert
      .expect(a3Signature.signature)
      .equal('CwHdmwC9ADtr5cTUdRZEfAcA8d1bgkF8fB+DcbB6MBB6amJz51WQYfVE1VgVTEY8Lyzg8+s8gX6nkqkXPeX72A==')
  })

  it('txid', () => {
    const stdTx = terra.buildStdTx(
      [
        terra.buildSend(
          [{denom: 'uluna', amount: '100000000'}], 
          'terra1wg2mlrxdmnnkkykgqg4znky86nyrtc45q336yv', 
          'terra18h5pmhrz45z2ne7lz4nfd7cdfwl3jfeu99e7a5'  
        )
      ], {
        gas: '54260',
        amount: [
          {
            denom: 'ukrw',
            amount: '814',
          }
        ]
      }, 
      ''
    )

    const signedTx = terra.createSignedTx(stdTx.value, {
      signature: '+SnQyRQZ536m0VLTwWFn6WTlmV0ZP+EI08lIGbZFhvYMLPA+Dld3qaTFKwgJEd7kZrAb5OPWBUhiOc9326daEw==',
      pub_key: {
        type: 'tendermint/PubKeySecp256k1',
        value: 'Ar+guke5UuM2XEZ9/ouPhAQbYs+f7y6jQCtGlI2lj1ZH'
      }
    })

    stdTx.value = signedTx

    const txbytes = terra.getAminoDecodedTxBytes(stdTx)
    const txhash = terra.getTxHash(txbytes)

    assert.expect(txhash).equal('028b2acc80d244241114bf20b2982889201eca42bd400bc8f3a9d2162b5f0a3e')
  })

  it('multisend', () => {
    const masterKey = terra.deriveMasterKeySync('spatial fantasy weekend romance entire million celery final moon solid route theory way hockey north trigger advice balcony melody fabric alter bullet twice push')
    const keypair = terra.deriveKeypair(masterKey, 0, 0)
    const accAddr = terra.getAccAddress(keypair.publicKey)

    const stdTx = terra.buildStdTx(
      [
        terra.buildMultiSend([
          {address: accAddr, coins: [{denom:'uluna', amount: '1000000'}, {denom:'usdr', amount: '1000000'}]},
        ], [
          {address: 'terra12dazwl3yq6nwrce052ah3fudkarglsgvacyvl9', coins: [{denom:'uluna', amount: '500000'}]},
          {address: 'terra1ptdx6akgk7wwemlk5j73artt5t6j8am08ql3qv', coins: [{denom:'uluna', amount: '500000'}, {denom:'usdr', amount: '1000000'}]}
        ])
      ], {
        gas: '100000',
        amount: [{
          denom: 'uluna',
          amount: '1500',
        },{
          denom: 'usdr',
          amount: '1000',
        }]
      }, '1234'
    )

    const jsonTx = stdTx.value
    const txSignature = terra.sign(jsonTx, keypair, {
      sequence: '0',
      account_number: '47',
      chain_id: 'columbus-3-testnet'
    })

    const signedTx = terra.createSignedTx(jsonTx, txSignature)
    assert.expect(signedTx.signatures[0].signature)
    .equal('YA/ToXLxuuAOQlpm5trbIUu2zv5NfBmeHz2jmXgNrt8jP+odukerfri3DUXAJuhETAMHVVV78t7Q4xC0j+CVkA==')
  })

  it('vote', () => {
    const stdTx = terra.buildStdTx(
      [
        terra.buildVote('1', 'terra1wg2mlrxdmnnkkykgqg4znky86nyrtc45q336yv', terra.VoteOption.OptionYes)
      ], {
        gas: '70000',
        amount: [{
          denom: 'uluna',
          amount: '1050',
        }]
      }, ''
    )

    const signedTx = terra.createSignedTx(stdTx.value, {
      signature: 'Xn93OEY/HYXxE2rqL6O5Cj0r/D+GbaPxEgvKM+hMFQJA/95RE4dLPJdLP5HpmeLrBm46GI0V6w27pR1Pq4mH+g==',
      pub_key: {
        type: 'tendermint/PubKeySecp256k1',
        value: 'Ar+guke5UuM2XEZ9/ouPhAQbYs+f7y6jQCtGlI2lj1ZH',
      }
    })

    stdTx.value = signedTx

    const txbytes = terra.getAminoDecodedTxBytes(stdTx)
    const txhash = terra.getTxHash(txbytes)
  
    assert.expect(txhash).equal('f1af6a4193c500578a457dd68ee34131e15d8e1c462bba647c43e882fcd74e57')
  })
})
