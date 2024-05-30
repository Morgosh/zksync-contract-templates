
import * as ethers from "ethers";
import { Wallet, Contract, utils, Provider } from 'zksync-ethers';
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { deployDiamond } from "./deploy_diamond_functions";

export default async function (hre: HardhatRuntimeEnvironment) {  
  let marketplaceContract = await deployDiamond()
  let diamondAddress = await marketplaceContract.getAddress()
  // lets redifine the contract with all the facets
  // marketplaceContract = new Contract(await marketplaceContract.getAddress(), diamondAbi, provider)
  // let diamondCutFacet = await hardhatEthers.getContractAt('DiamondCutFacet', diamondAddress)
  // let diamondLoupeFacet = await hardhatEthers.getContractAt('DiamondLoupeFacet', diamondAddress)
  // let ownershipFacet = await hardhatEthers.getContractAt('OwnershipFacet', diamondAddress)
}