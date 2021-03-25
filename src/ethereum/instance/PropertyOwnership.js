import PropertyOwnershipJson from '../build/PropertyOwnership.json';

function PropertyOwnership(web3, addressOfDeployedContract) { // address of deployed contract on the blockchain network.
  return new web3.eth.Contract(PropertyOwnershipJson.abi, addressOfDeployedContract);
}

export default PropertyOwnership;
