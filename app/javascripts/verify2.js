//binary Merkle tree

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

import bank_artifacts from '../../build/contracts/Integrity.json';

var Integrity = contract(bank_artifacts);
var account;
var wtoE;
var GAS_AMOUNT = 90000000;
var SHA256 = require('crypto-js/sha256');
//var root1="0x251b09c8c6f9d0e36238d39b087c06d669113d42fd6b65fce7f6331c0a5f5efa";
//root1 is the merkle tree root that received from user
var root1='0x'.concat($.cookie("merkleroot"));

var auxiliarypath = $.cookie("auxiliarypath");
var result = document.getElementById("verify-result");

result.value = result.value + "哈希树根请求验证值（root1）：" + root1 + "\n";

window.modifyRoot = function() {
  result.value = result.value + "\n开始破坏数据:\n";
  result.value = result.value + "原始辅助路径：" + auxiliarypath + "\n";
  auxiliarypath = auxiliarypath.replace(/0/g, '1');
  $.cookie("auxiliarypath",auxiliarypath);
  result.value = result.value + "破坏后辅助路径：" + auxiliarypath + "\n";
}

window.verifyData = function() {
    var starttime= new Date().getTime();
    result.value = result.value + "\n开始验证数据完整性...\n";

    var h1=0;
    var h2=0;
    var challenge = $.cookie("challenge");
    var preleaves = $.cookie("preleaves");
    var leave=CryptoJS.SHA256(preleaves.trim()).toString();
    var publictreelength = $.cookie("publictreelength");
//public tree is the merkle tree which index increase from bottom to top, from right to left

    var path=[];
    while(h2<auxiliarypath.length){   //将辅助路径转换成数组
      path.push(auxiliarypath.substr(h2,64));
      h2+=65;
    }
    result.value = result.value + "辅助路径长度：" + path.length + "\n";
    result.value = result.value + "哈希树节点数：" + publictreelength + "\n";

    var deep = 0;
    var k = 0;
    while (k != publictreelength) { //deep of the tree
        k += Math.pow(2, deep);
        deep++;
    }
    result.value = result.value + "哈希树深度：" + deep + "\n";

    var start = 0;   //i is the challenge's index in npublicTree
    for (var i = 0; i < deep - 1; i++) {
        start += Math.pow(2, i);
    }
    start++;

    var i = Number(challenge) + Number(start); //i is the index of verified shard in npublictree

    //拼接辅助路径，验证的位置不同，拼接的方法不同
    result.value = result.value + "开始拼接辅助路径：\n";
    var j=0;
      while (j < path.length) {
          if (i % 2 == 0) {
            result.value = result.value + "当前拼接节点索引：" + i + "\n";
            console.log(i);
              var digest = leave.concat(path[j]);
              i = i / 2;
              console.log(i);

          } else if (i % 2==1) {
            result.value = result.value + "当前拼接节点索引：" + i + "\n";
              var digest = path[j].concat(leave);
              i = (i - 1)/ 2;
              console.log(i);
          }
          j +=1;
          result.value = result.value + "节点哈希拼接值：" + digest + "\n";
          leave=CryptoJS.SHA256(digest.trim()).toString(); //use auxiliary path to hash to get father leave
          result.value = result.value + "父节点哈希值：" + leave + "\n";
      }

    var root2 = '0x'.concat(leave);  //root2 is the new merkle tree
    result.value = result.value + "新哈希树根生成值（root2）：" + root2 + "\n";

    result.value = result.value + "数据完整性验证结果：";
    if (root1 !== root2) {
      result.value = result.value + "数据完整性被破坏 False（因为 root1 不等于 root2）\n"
    } else {
      result.value = result.value + "数据保持完整 True（因为 root1 等于 root2）\n"
    }
    Integrity.deployed().then(function(contractInstance) {
        contractInstance.compare.call(root2, root1).then(function(result) {
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
