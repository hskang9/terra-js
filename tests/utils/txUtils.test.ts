import * as terra from '../../src/index'
import * as assert from 'chai'

describe('tx', () => { 
  it('signature', async () => {
    const masterKey = await terra.deriveMasterKey('spatial fantasy weekend romance entire million celery final moon solid route theory way hockey north trigger advice balcony melody fabric alter bullet twice push')
    const keypair = terra.deriveKeypair(masterKey, 0, 0)
    const accAddr = terra.getAccAddress(keypair.publicKey)

    const msgSend = terra.buildSend([
      {
        amount: '1000000',
        denom: 'uluna'
      }
    ], accAddr, 'terra1ptdx6akgk7wwemlk5j73artt5t6j8am08ql3qv')

    const stdTx = terra.buildStdTx([msgSend], {
      'gas': '200000',
      'amount': [
        {
          'amount': '1000',
          'denom': 'uluna'
        }
      ]
    }, 'library test')

    const jsonTx = stdTx.value
    const txSignature = terra.sign(jsonTx, keypair, {
      sequence: '0',
      account_number: '167',
      chain_id: 'soju-0009'
    })

    assert.expect(txSignature.signature).equal('Jxa82cR2/LBSRqHulnwsOhEE5EyMH16/X/y66PlJBK0Kq4RUHqsCvj9g6qg/wwcu7p+pF6yJ3pdmSc+A3x0zCg==')
  })

  it('multisig', async () => {
    const receiverAddr = 'terra1ptdx6akgk7wwemlk5j73artt5t6j8am08ql3qv'
    
    const multisigAddr = 'terra16ddrexknvk2e443jsnle4n6s2ewjc6z3mjcu6d'
    const multisigAccountNumber = '197'
    const multisigSequenceNumber = '0'

    const a1Key = await terra.deriveMasterKey('swamp increase solar renew twelve easily possible pig ostrich harvest more indicate lion denial kind target small dumb mercy under proud arrive gentle field')
    const a1Keypair = terra.deriveKeypair(a1Key, 0, 0)
    const a1AccAddress = terra.getAccAddress(a1Keypair.publicKey)

    assert.expect(a1AccAddress).equal('terra12dazwl3yq6nwrce052ah3fudkarglsgvacyvl9')

    const a2Key = await terra.deriveMasterKey('service frozen keen unveil luggage initial surge name conduct mesh soup escape weather gas clown brand holiday result protect chat plug false pitch little')
    const a2Keypair = terra.deriveKeypair(a2Key, 0, 0)
    const a2AccAddress = terra.getAccAddress(a2Keypair.publicKey)

    assert.expect(a2AccAddress).equal('terra1jqw25580qljucyy2xkpp7j02kd4mwx69wvfgf9')

    const a3Key = await terra.deriveMasterKey('corn peasant blue sight spy three stove confirm night brother vote dish reduce sick observe outside vacant arena laugh devote exotic wasp supply rally')
    const a3Keypair = terra.deriveKeypair(a3Key, 0, 0)
    const a3AccAddress = terra.getAccAddress(a3Keypair.publicKey)

    assert.expect(a3AccAddress).equal('terra13hrg8ul0p7sh85jwalh3leysdrw9swh44dql2h')

    const msgSend = terra.buildSend([{
      amount: '1000000',
      denom: 'uluna'
    }], multisigAddr, receiverAddr)

    const stdTx = terra.buildStdTx([msgSend], {
      gas: '50000',
      amount: [
        {
          amount: '750',
          denom: 'uluna'
        }
      ]
    }, 'memo')

    const jsonTx = stdTx.value
    const signMeta:terra.SignMetaData = {
      sequence: multisigSequenceNumber,
      account_number: multisigAccountNumber,
      chain_id: 'soju-0009'
    }
    const a1Signature = terra.sign(jsonTx, a1Keypair, signMeta)

    assert.expect(a1Signature.signature).equal('89zFkGLoBpqiTOicd5QaU7Ulch5TMjsZhdubgZyetttXN9LCqyrPobw4aeROt5fXWZv58LwVR+dC5fVEPLNu3Q==')

    const a2Signature = terra.sign(jsonTx, a2Keypair, signMeta)

    assert.expect(a2Signature.signature).equal('T3IMCxFt8+bYiRLnK40qdIXarSHvTqMujGDqRpeaEkMR21YMkd2us5Ml9wYR9pTiknF+6s1HBT6JD7wFSwEciw==')

    const a3Signature = terra.sign(jsonTx, a3Keypair, signMeta)

    assert.expect(a3Signature.signature).equal('04Edd3+oKM1lAcRzw5N7uYpjXFxgOEJ5aiEMR2FrNM8dE0sM07ECs/CRh0uJzL8o7VkyauGQLADfmd4yR6Ypcw==')
  })
})