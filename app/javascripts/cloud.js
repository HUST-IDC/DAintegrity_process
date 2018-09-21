var SHA256 = require('crypto-js/sha256');

window.computeRoot = function() {

    var shard1=$("#shard").val();
    var auxiliary1=$("#auxiliary").val();
    computeroot(shard1,auxiliary1);

}

function computeroot(shard,auxiliary){  //compute new Merkle tree root
        var preleaf = CryptoJS.SHA256(shard.trim()).toString();
        var leaf =CryptoJS.SHA256(preleaf.trim()).toString();

        var str = new Array();      
        str = auxiliary.split(",");
        var length=str.length;
        console.log(length);

        var hashstring = leaf;
        for (var i = 0; i <length; i++) {
            hashstring = hashstring.concat(str[i]);   //this part should concat leaf and auxiliary path in different way when shard number is different
                                                       //here we only consider shard number is 0 for simple
            hashstring = CryptoJS.SHA256(hashstring.trim()).toString()   
        }

        var newroot = hashstring;
        console.log(newroot);

    }