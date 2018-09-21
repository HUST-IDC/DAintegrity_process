// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

import bank_artifacts from '../../build/contracts/Integrity.json';

var Integrity = contract(bank_artifacts);
var account;
var wtoE;
var GAS_AMOUNT = 90000000;
var SHA256 = require('crypto-js/sha256');
var root1="0x7e3266cd5aadb9e8c4a26abec162b7c8b0c85104438b5b89a5036043763b8472";
/*var root1="0xQma4j56GHhzkax7GBTCTXuN5nMeAmaLau3No6hzTeKeWhG";*/
/*var root1="0xcd6c890d9318bc690f59b26c30b13db9dcdf082f38c42389481ba1ae52655455";
*/
window.verifyData = function() {
  
    var predigest = $('#file-hash').val();
    console.log(predigest);
    var digest = '0x'.concat(SHA256(predigest));
    console.log(digest);
    console.log(root1);
    console.log(digest == root1);
    Integrity.deployed().then(function(contractInstance) {
        contractInstance.compare.call(digest, root1).then(function(result) {
            console.log(result.valueOf());
            if (result.valueOf() == 2) {
                $('#verify-result').val("False!");
            } else {
                $('#verify-result').val("True!");
            }
        });
    });
}

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  web3.eth.getAccounts(function(err, accs) {
    account = accs[0];
    wtoE = web3.toWei(1,'ether');
  });

  Integrity.setProvider(web3.currentProvider);
});