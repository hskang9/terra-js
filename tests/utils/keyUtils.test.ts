import * as terra from '../../src/index'
import * as assert from 'chai'

describe('key', () => {
  it('address', async () => {
    const masterKey = await terra.deriveMasterKey(
      'spatial fantasy weekend romance entire million celery final moon solid route theory way hockey north trigger advice balcony melody fabric alter bullet twice push'
    )
    const keyPair = terra.deriveKeypair(masterKey, 0, 0)
    const address = terra.getAccAddress(keyPair.publicKey)

    assert.expect(address).equal('terra1gn37dh0jl4zu4fp48d8y4c0hqs9cel83x7st7v')
  })
})
