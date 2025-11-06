import SDK from '@onekeyfe/hd-common-connect-sdk'
import { getAddress } from 'viem'

await SDK.init({})

const devices = await SDK.searchDevices()
if ('error' in devices.payload) {
  console.error(devices)
  process.exit(-1)
}

const [device] = devices.payload
if (!device?.connectId || !device.deviceId) {
  console.error(device)
  process.exit(-2)
}

export const connectId = device.connectId

export const deviceId = device.deviceId

const { payload: passphraseStatePayload } = await SDK.getPassphraseState(connectId)

export const passphraseState =
  typeof passphraseStatePayload === 'object' ? undefined : passphraseStatePayload

export const path = "m/44'/60'/0'/0/0"

export const { payload: addressPayload } = await SDK.evmGetAddress(connectId, deviceId, {
  path,
  passphraseState,
})

if (typeof addressPayload === 'object' && 'error' in addressPayload) {
  console.error(addressPayload)
  process.exit(-3)
}

export const address = getAddress(addressPayload.address)

console.log(address)

export { SDK }
