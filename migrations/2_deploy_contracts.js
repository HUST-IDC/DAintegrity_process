var CrowdBank = artifacts.require("./CrowdBank.sol");
var Mortgage = artifacts.require("./Mortgage.sol");
var Integrity = artifacts.require("./Integrity.sol");
module.exports = function(deployer) {
  deployer.deploy(CrowdBank);
  deployer.deploy(Mortgage);
  deployer.deploy(Integrity);
};
