import { deployDiamond } from '../../deploy/diamond/deploy_diamond_functions'
import chai, { expect, assert } from "chai";
// import ethers
import hre, {ethers as hardhatEthers} from "hardhat";
import { TypedDataDomain, ethers, Contract} from 'ethers'
import { deployContract, getRichWallets, getProvider } from '../../deploy/utils';
// import diamondAbi from '../abis/Diamond.abi.json'
// import ERC20ABI from '../abis/ERC20Template.abi.json'
// import { getOrderEIP712Data } from '../../dapp/global/interactGetters';

declare global {
  namespace Chai {
    interface Assertion {
      lteBigInt(value: bigint): Assertion;
    }
  }
}

chai.Assertion.addMethod('lteBigInt', function (this: any, upper: bigint) {
  const obj = this._obj as bigint;
  this.assert(
    obj <= upper,
    'expected #{this} to be less than or equal to #{exp}',
    'expected #{this} to be above #{exp}',
    upper.toString(),
    obj.toString()
  );
});


describe('DiamondTest', async function () {
  let diamondAddress: string
  let diamondContract: Contract

  let wallets: any[]
  let provider: any

  // let accounts: any[];
  // accounts = await ethers.getSigners()

  before(async function () {
    provider = getProvider()
    diamondContract = await deployDiamond()
  })

  // it('should have 5 facets -- call to facetAddresses function', async () => {
  //   for (const address of await diamondLoupeFacet.facetAddresses() ) {
  //     diamondAddresses.push(address)
  //   }
  //   assert.equal(diamondAddresses.length, 5)
  // })

  it("deploy should work", async () => {
    // expect true to be true
    expect(true).to.eq(true)
  });
})