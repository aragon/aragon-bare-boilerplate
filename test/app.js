/* global artifacts contract beforeEach it assert */

const { assertRevert } = require('@aragon/test-helpers/assertThrow')
const { getEventArgument } = require('@aragon/test-helpers/events')
const { hash } = require('eth-ens-namehash')
const deployDAO = require('./helpers/deployDAO')

const App = artifacts.require('App.sol')

const ANY_ADDRESS = '0xffffffffffffffffffffffffffffffffffffffff'

contract('App', ([appManager, user]) => {
  let app

  beforeEach('deploy dao and app', async () => {
    const { dao, acl } = await deployDAO(appManager)

    // Deploy the app's base contract.
    const appBase = await App.new()

    // Instantiate a proxy for the app, using the base contract as its logic implementation.
    const instanceReceipt = await dao.newAppInstance(
      hash('app.aragonpm.test'), // appId - Unique identifier for each app installed in the DAO; can be any bytes32 string in the tests.
      appBase.address, // appBase - Location of the app's base implementation.
      '0x', // initializePayload - Used to instantiate and initialize the proxy in the same call (if given a non-empty bytes string).
      false, // setDefault - Whether the app proxy is the default proxy.
      { from: appManager }
    )
    app = App.at(
      getEventArgument(instanceReceipt, 'NewAppProxy', 'proxy')
    )

    // Set up the app's permissions.
    // await acl.createPermission(
    //   ANY_ADDRESS, // entity (who?) - The entity or address that will have the permission.
    //   app.address, // app (where?) - The app that holds the role involved in this permission.
    //   await app.INCREMENT_ROLE(), // role (what?) - The particular role that the entity is being assigned to in this permission.
    //   appManager, // manager - Can grant/revoke further permissions for this role.
    //   { from: appManager }
    // )

    await app.initialize()
  })

  it('app should be deployed', async () => {
    assert.equal(web3.isAddress(app.address), true)
  })

  it('app should be initialized', async () => {
    assert.notEqual(await app.getInitializationBlock(), 0)
  })
})
