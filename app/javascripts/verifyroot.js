// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

import bank_artifacts from '../../build/contracts/Integrity.json';

var Integrity = contract(bank_artifacts);
var account;
var wtoE;
var GAS_AMOUNT = 90000000;
var SHA256 = require('crypto-js/sha256');
/*var root2="0x7e3266cd5aadb9e8c4a26abec162b7c8b0c85104438b5b89a5036043763b8472";*/
var root1="Qma4j56GHhzkax7GBTCTXuN5nMeAmaLau3No6hzTeKeWhG";


window.verifyData = function() {
   var sliceroot1=root1.substr(2,32);  //because the maximum bytes of contract is 32,
                                      //so we need to select 32 characte of root 

   var sixroot1=strToHexCharCode(sliceroot1);  //change string to 16进制,
                                               //as bytes32 is equal to 64位的16进制， 32*8=64*4


    var root2 = $('#file-hash').val();
    var sliceroot2=root2.substr(2,32);
    var sixroot2=strToHexCharCode(sliceroot2);


    console.log(root2 == root1);
    console.log(sixroot2 == sixroot1);
   
    Integrity.deployed().then(function(contractInstance) {
        contractInstance.compare.call(sixroot2, sixroot1).then(function(result) {
            console.log(result.valueOf());
            if (result.valueOf() == 2) {
                $('#verify-result').val("False!");
            } else {
                $('#verify-result').val("True!");
            }
        });
    });
}

function strToHexCharCode(str) {  //change string to 16进制
　　if(str === "")
　　　　return "";
　　var hexCharCode = [];
　　hexCharCode.push("0x"); 
　　for(var i = 0; i < str.length; i++) {
　　　　hexCharCode.push((str.charCodeAt(i)).toString(16));
　　}
　　return hexCharCode.join("");
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