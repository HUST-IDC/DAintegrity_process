//eight-branching Merkle tree 


// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

import bank_artifacts from '../../build/contracts/Integrity.json';

var Integrity = contract(bank_artifacts);
var account;
var wtoE;
var GAS_AMOUNT = 90000000;
var SHA256 = require('crypto-js/sha256');
var root1="0xf5bc75c0b4ee0951d8de20c2ed302929488c4386e8bcbeebc181bc753cb5fbb0";
//root1 is the merkle tree root that received from user

window.verifyData = function() {


    var starttime= new Date().getTime();
    console.log("starttime is " + starttime);
   
    var h1=0;
    var h2=0;
    var challenge = $.cookie("challenge");
    var preleaves = $.cookie("preleaves"); 
    var leave=CryptoJS.SHA256(preleaves.trim()).toString();
    var auxiliarypath = $.cookie("auxiliarypath"); 
    var publictreelength = $.cookie("publictreelength"); 

    var path=[];
    while(h2<auxiliarypath.length){   //将辅助路径转换成数组
      path.push(auxiliarypath.substr(h2,64));
      h2+=65;
    }

    var deep = 0;
    var k = 0;
    while (k != publictreelength) { //deep of the tree
        k += Math.pow(8, deep);
        deep++;
    }

    var start = 0;
    for (var i = 0; i < deep - 1; i++) {
        start += Math.pow(8, i);
    }
    start++;

    var i = Number(challenge) + Number(start); //i is the index of verified shard in publictree

    //拼接辅助路径，验证的位置不同，拼接的方法不同
    var j=0;
      while (j < path.length) {
          if (i % 8 == 2) {
              var digest = leave.concat(path[j], path[j + 1], path[j + 2], path[j + 3], path[j + 4], path[j + 5], path[j + 6]);          
              i = (i + 6) / 8;
          } else if (i % 8 == 3) {
              var digest = path[j].concat(leave, path[j + 1], path[j + 2], path[j + 3], path[j + 4], path[j + 5], path[j + 6]);          
              i = (i + 5) / 8;
          } else if (i % 8 == 4) {
             var digest = path[j].concat(path[j+1], leave, path[j + 2], path[j + 3], path[j + 4], path[j + 5], path[j + 6]);          
              i = (i + 4) / 8;

          } else if (i % 8 == 5) {
             var digest = path[j].concat(path[j+1], path[j + 2], leave, path[j + 3], path[j + 4], path[j + 5], path[j + 6]);          
              i = (i + 3) / 8;
          }
          else if (i % 8 == 6) {
             var digest = path[j].concat(path[j+1], path[j + 2], path[j + 3], leave, path[j + 4], path[j + 5], path[j + 6]);          
              i = (i + 2) / 8;
          }
          else if (i % 8 == 7) {
             var digest = path[j].concat(path[j+1], path[j + 2], path[j + 3], path[j + 4], leave, path[j + 5], path[j + 6]);          
              i = (i + 1) / 8;
          }
          else if (i % 8 == 0) {
             var digest = path[j].concat(path[j+1], path[j + 2], path[j + 3], path[j + 4], path[j + 5], leave, path[j + 6]);          
              i = i / 8;
          }
          else if (i % 8 == 1) {
             var digest = path[j].concat(path[j+1], path[j + 2], path[j + 3], path[j + 4], path[j + 5], path[j + 6], leave);          
              i = (i - 1) / 8;
          }
          j += 7;
          leave=CryptoJS.SHA256(digest.trim()).toString();
      }
   
    var root2 = '0x'.concat(leave);  // root2 is the new merkle tree root
      
    console.log(root2);
    console.log(root2 == root1);
    Integrity.deployed().then(function(contractInstance) {
        contractInstance.compare.call(root2, root1).then(function(result) {
            console.log(result.valueOf());

            if (result.valueOf() == 2) {
                $('#verify-result').val("False!");
            } else {
                $('#verify-result').val("True!");
            }
        });
    });

    var endtime= new Date().getTime();
    console.log("endtime is " + endtime);
    console.log("the running time is " + (endtime - starttime));
    return endtime - starttime;
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