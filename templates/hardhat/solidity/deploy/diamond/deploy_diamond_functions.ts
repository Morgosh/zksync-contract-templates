/* global ethers */
/* eslint prefer-const: "off" */
import hre from "hardhat";
import { ethers } from "hardhat";


import { getSelectors, FacetCutAction } from './libraries/diamond'
import { deployContract, getDefaultWallet } from "../utils";

async function deployDiamond () {
  const contractOwner = await getDefaultWallet()

  // Deploy DiamondInit
  // DiamondInit provides a function that is called when the diamond is upgraded or deployed to initialize state variables
  // Read about how the diamondCut function works in the EIP2535 Diamonds standard
  const diamondInitContract = await deployContract("DiamondInit", [])
  console.log('DiamondInit deployed:', await diamondInitContract.getAddress())

  // deployed Libs
  // const sharedStorageContract = await deployContract("SharedStorage", [])
  // console.log(`SharedStorage deployed to: ${await sharedStorageContract.getAddress()}`);

  // Deploy facets and set the `facetCuts` variable
  console.log('')
  console.log('Deploying facets')
  // const FacetNames = [
  //   'DiamondCutFacet',
  //   'DiamondLoupeFacet',
  //   'OwnershipFacet',
  //   'ManagementFacet',
  //   'TransactFacet',
  // ]

  const facets: { name: string, libraries?: any }[] = [
    {
      name: 'DiamondCutFacet',
    },
    {
      name: 'DiamondLoupeFacet',
    },
    {
      name: 'OwnershipFacet',
    },
  ]

  // The `facetCuts` variable is the FacetCut[] that contains the functions to add during diamond deployment
  const facetCuts: any = []
  for (const facetObj of facets) {
    // const Facet = await ethers.getContractFactory(facetObj.name, {
    //   libraries: facetObj.libraries,
    // })
    // const facet = await Facet.deploy()
    // await facet.waitForDeployment()
    const options = facetObj.libraries ? { libraries: facetObj.libraries } : {}
    const facetContract = await deployContract(facetObj.name, [], options)
    console.log(`${facetObj.name} deployed: ${await facetContract.getAddress()}`)
    facetCuts.push({
      facetAddress: await facetContract.getAddress(),
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facetContract)
    })
  }

  // Creating a function call
  // This call gets executed during deployment and can also be executed in upgrades
  // It is executed with delegatecall on the DiamondInit address.
  let functionCall = diamondInitContract.interface.encodeFunctionData('init')

  // Setting arguments that will be used in the diamond constructor
  const diamondArgs = {
    owner: contractOwner.address,
    init: await diamondInitContract.getAddress(),
    initCalldata: functionCall,
    // add any other custom arguments here
  }

  // deploy Diamond
  // const Diamond = await ethers.getContractFactory('Diamond')
  // const diamond = await Diamond.deploy(facetCuts, diamondArgs)
  // await diamond.waitForDeployment()
  const diamondContract = await deployContract('Diamond', [facetCuts, diamondArgs])
  console.log()
  console.log('Diamond deployed:', await diamondContract.getAddress())

  // returning the address of the diamond
  return await diamondContract
}

export {deployDiamond}
