//binary Merkle tree 

var SHA256 = require('crypto-js/sha256');
var hashresult = [];

var publicTree = []; //merkle tree which index increase from bottom to top, from right to left
var publicIndex;

var npublicTree = []; //转置之后的树  transpose publicTree to get npublicTree
var path = []; //auxiliary path
var sliceLength;

window.getPreleaves = function() {
    $("#Preleaves").text(hashresult[$("#Challenge_num").val()]);
}

window.getAuxiliarypath = function() {

    var starttime = new Date().getTime();
    console.log("auxiliarypath starttime is " + starttime);

    if ($("#Challenge_num").val() >= sliceLength || $("#Challenge_num").val() < 0) {
        $("#AuxiliaryPath").text("The test num is out of range!");
    } else {
        transArray(publicTree);  //transpose publicTree to get npublicTree
        var n = Math.log(publicTree.length + 1) / Math.log(2); //deep of the tree
        var leavesnum = Math.pow(2, n - 1); //the num of leaves
        var i = Number($("#Challenge_num").val()) + Number(leavesnum); //i is the index on the npublicTree
        console.log(npublicTree);
        var j = 0;
        while (i != 1) {
            if (i % 2 == 0) {
                path[j] = npublicTree[i + 1];
            } else {
                path[j] = npublicTree[i - 1];
            }
            j++;
            i = Math.floor(i / 2);
        }
        console.log(path);
        $("#AuxiliaryPath").text(path); //path[] is the auxiliary path of shard i
    }

    var endtime = new Date().getTime();
    console.log("auxiliarypath endtime is " + endtime);
    console.log("the auxiliarypath time is " + (endtime - starttime));

    return endtime - starttime;
}


function transArray(publicTree) {   //transpose publicTree to get npublicTree
    for (var i = 0, j = publicTree.length; i < publicTree.length; i++, j--) {
        npublicTree[j] = publicTree[i];
    }
    npublicTree[0] = "";
}



window.MerkleRoot = function() {
    //showDataByText();
    showDataByText();
    sliceData();
    hashData();
    var treeroot = merkleRoot();
    $("#MerkleRoot").text(treeroot);
}


window.showDataByText = function() {
    var resultFile = document.getElementById("file_id").files[0];
    // var resultFile = $("#file_id").val();
    if (resultFile) {
        var reader = new FileReader();
        reader.readAsText(resultFile, 'UTF-8');
        reader.onload = function(e) {
            var urlData = this.result;
            $("#result").text(urlData);
        }
    }
}

window.sliceData = function() {
    var str = $("#result").text().trim();
    var arr = getArr(str);
    sliceLength = arr.length;
    console.log(sliceLength);
    $("#sliceData").text(arr);
}

window.sliceData1 = function() {
    var str = $("#result").text().trim();
    getArrtofile(str);
}

/*function getArrtofile(str) {  //slice data to get arr[]

    var fso = new ActiveXObject("Scripting.FileSystemObject");
 //   var fso = new ActiveXObject("Scripting.FileSystemObject");
    var strlen;
    strlen = str.length;
    for (var i = 0, j = 0; i < strlen; i += 2, j++) {
        var tmpstr = str.slice(i, i + 2);

        var f1 = fso.createtextfile("/home/ydd/Documents/blockchain_workspace/Ethereum-IPFS/IPFS-Ethereum-Storage/client/shards/shard"+j+".txt",8,true);
        f1.write(j + tmpstr);
        f1.close();
    }
}*/

function getArr(str) {  //slice data to get arr[]
    var strlen;
    var arr = [];
    strlen = str.length;
    for (var i = 0, j = 0; i < strlen; i += 2, j++) {
        var tmpstr = str.slice(i, i + 2);
        arr.push(j + tmpstr);
    }
    return arr;
}

window.hashData = function() {  //slice and hash data to get hashresult[]
    var str = $("#result").text().trim();
    var arr = getArr(str);

    for (var i = 0; i < arr.length; i++) {
        var hashresulti = CryptoJS.SHA256(arr[i].trim());
        hashresult.push(hashresulti);
    }
    $("#hashData").text(hashresult);
}


window.merkleRoot = function() {
    var merkleRoot = merkle_tree(hashresult);
    $("#merkleRoot").text(merkleRoot);
    return merkleRoot;
}
window.publicTree = function() {

    var starttime = new Date().getTime();
    console.log("publicTree starttime is " + starttime);

    merkle_tree(hashresult);
    $("#publicTree").text(publicTree);

    var endtime = new Date().getTime();
    console.log("publicTree endtime is " + endtime);
    console.log("the publicTree time is " + (endtime - starttime));

    return endtime - starttime;
}

function merkle_tree(txList) {  //use hashresult to genarate merkle tree
    var tempTxList = [];
    for (i = 0; i < txList.length; i++) {
        tempTxList.push(txList[i].toString());
    }
    var newTxList = pregetNewTxList(tempTxList);  //the first layer of merkle tree, that is pre-leaves

    while (newTxList.length != 1) {
        newTxList = getNewTxList(newTxList);  //the other layers
    }
    publicIndex = publicTree.length;
    publicTree[publicIndex++] = (newTxList[0].toString());  //the merkle tree root
    console.log(publicTree);
    console.log(publicTree.length);
    return newTxList[0].toString();
}

function pregetNewTxList(tempTxList) {   //the first layer of merkle tree, that is pre-leaves
    var newTxList = [];
    var index = 0;
    var index1 = 0;
    var index2 = 0;
    var prepublicTree = [];

    publicIndex = Number(tempTxList.length) - Number(1);
    while (index2 < tempTxList.length) { // transpose tempTxList to prepublicTree
        var preleave = tempTxList[index2].toString();
        var leave = CryptoJS.SHA256(preleave.trim()).toString();
        prepublicTree[publicIndex] = (leave);
        publicIndex--;
        index2++;
    }
    while (index < tempTxList.length) {  //hash this layer to get father layer
        // left        
        var preleft = tempTxList[index].toString();
        var left = CryptoJS.SHA256(preleft.trim()).toString();

        index++;
        // right
        var preright = "";
        var right = "";
        if (index != tempTxList.length) {
            preright = tempTxList[index].toString();
            right = CryptoJS.SHA256(preright.trim()).toString();
        }

        // sha2 hex value
        var leaves = (left + right).trim();
        var sha256Value = CryptoJS.SHA256(leaves);

        newTxList[index1] = (sha256Value);
        index1++;
        index++;
    }
    publicTree = prepublicTree;  //use prepublicTree to set publicTree
    console.log(publicTree);
    return newTxList;
}

function getNewTxList(tempTxList) {  //the other layers of merkle tree
    var newTxList = [];
    var index = 0;
    var index1 = 0;
    var index2 = 0;
    var prepublicTree = [];
    publicIndex = Number(tempTxList.length) - Number(1);
    //  console.log(publicIndex);
    while (index2 < tempTxList.length) {  // transpose tempTxList to prepublicTree
        var leave = tempTxList[index2].toString();
        prepublicTree[publicIndex] = (leave);
        publicIndex--;
        index2++;
    }

    while (index < tempTxList.length) {  //hash this layer to get father layer
        console.log(publicTree.length);

        var left = tempTxList[index].toString();
        index++;

        var right = "";
        if (index != tempTxList.length) {
            right = tempTxList[index].toString();
        }

        var leaves = (left + right).trim();
        var sha256Value = CryptoJS.SHA256(leaves);

        newTxList[index1] = (sha256Value);
        index1++;
        index++;
    }
    publicTree = publicTree.concat(prepublicTree); //add prepublicTree to publicTree
    //  console.log(prepublicTree);
    console.log(publicTree);
    return newTxList;
}