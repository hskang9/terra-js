import * as terra from '../../src/index'
import * as assert from 'chai'

describe('tx', () => { 
  it('signature', async () => {
    const masterKey = await terra.deriveMasterKey('spatial fantasy weekend romance entire million celery final moon solid route theory way hockey north trigger advice balcony melody fabric alter bullet twice push')
    const keypair = terra.deriveKeypair(masterKey, 0, 0)
    const accAddr= terra.getAccAddress(keypair.publicKey)

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
})