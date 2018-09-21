//four-branching Merkle tree 


var SHA256 = require('crypto-js/sha256');
var hashresult = [];

var publicTree = [];
var publicIndex;

var npublicTree = [];
var path = [];
var sliceLength;

window.getPreleaves = function() {
     $("#Preleaves").text(hashresult[$("#Challenge_num").val()]); 
}


window.getAuxiliarypath = function() {
    var starttime= new Date().getTime();
    console.log("auxiliarypath starttime is " + starttime);
   
    if ($("#Challenge_num").val() >= sliceLength || $("#Challenge_num").val() < 0) {
        $("#AuxiliaryPath").text("The test num is out of range!");
    } else {
        transArray(publicTree);
        var deep = 0;
        var k = 0;
        while (k != publicTree.length) { //deep of the tree
            k += Math.pow(4, deep);
            deep++;
        }
      
        var start = 0;
        for (var i = 0; i < deep - 1; i++) {
            start += Math.pow(4, i);
        }
        start++;
        var i = Number($("#Challenge_num").val()) + Number(start); //the index of verified shard on npublictree
        console.log(npublicTree);
        var j = 0;
        while (i != 1) {   //get auxiliary path, path[]
            if (i % 4 == 0) {
                path[j] = npublicTree[i -2];
                j++;
                path[j] = npublicTree[i - 1];
                j++;
                path[j] = npublicTree[i + 1];
                i = i / 4;
            } else if (i % 4 == 1) {
                path[j] = npublicTree[i - 3];
                j++;
                path[j] = npublicTree[i - 2];
                j++;
                path[j] = npublicTree[i - 1];
                i = (i - 1) / 4;
            } else if (i % 4 == 2) {
                path[j] = npublicTree[i + 1];
                j++;
                path[j] = npublicTree[i + 2];
                j++;
                path[j] = npublicTree[i + 3];
                i = (i + 2) / 4;
            } else if (i % 4 == 3) {
                path[j] = npublicTree[i - 1];
                j++;
                path[j] = npublicTree[i + 1];
                j++;
                path[j] = npublicTree[i + 2];
                i = (i + 1) / 4;
            }
            j++;
        }
        console.log(path);
        $("#AuxiliaryPath").text(path); //path on the npublicTree
    }
    var endtime= new Date().getTime();
    console.log("auxiliarypath endtime is " + endtime);
    console.log("the auxiliarypath time is " + (endtime - starttime));

    return endtime - starttime;
   
}


function transArray(publicTree) {
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

function getArr(str) {
    var strlen;
    var arr = [];
    strlen = str.length;
    for (var i = 0, j = 0; i < strlen; i += 2, j++) {
        var tmpstr = str.slice(i, i + 2);
        arr.push(j + tmpstr);
    }
    return arr;
}

window.hashData = function() {

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
    var starttime= new Date().getTime();
    console.log("publicTree starttime is " + starttime);
   

    merkle_tree(hashresult);
    $("#publicTree").text(publicTree);

    var endtime= new Date().getTime();
    console.log("publicTree endtime is " + endtime);
    console.log("the publicTree time is " + (endtime - starttime));
    return endtime - starttime;
}

function merkle_tree(txList) {
    var tempTxList = [];
    for (i = 0; i < txList.length; i++) {
        tempTxList.push(txList[i].toString());
    }
    var newTxList = pregetNewTxList(tempTxList);

    while (newTxList.length != 1) {
        newTxList = getNewTxList(newTxList);
    }
    publicIndex = publicTree.length;
    publicTree[publicIndex++] = (newTxList[0].toString());
    console.log(publicTree);
    console.log(publicTree.length);
    return newTxList[0].toString();
}

function pregetNewTxList(tempTxList) {
    var newTxList = [];
    var index = 0;
    var index1 = 0;
    var index2 = 0;
    var prepublicTree = [];

    publicIndex = Number(tempTxList.length) - Number(1);
    while (index2 < tempTxList.length) { //transposition tempTxList to prepublicTree
        var preleave = tempTxList[index2].toString();
        var leave = CryptoJS.SHA256(preleave.trim()).toString();
        prepublicTree[publicIndex] = (leave);
        publicIndex--;
        index2++;
    }
    while (index < tempTxList.length) { //hash this layer to get father layer
        var prechild = [];
        var child = [];

        // child1        
        prechild[0] = tempTxList[index].toString();
        child[0] = CryptoJS.SHA256(prechild[0].trim()).toString();

        //child2,child3,child4
        for (var i = 1; i < 4; i++) {
            index++;
            prechild[i] = "";
            child[i] = "";
            if (index != tempTxList.length) {
                prechild[i] = tempTxList[index].toString();
                child[i] = CryptoJS.SHA256(prechild[i].trim()).toString();
            }
        }

        // sha2 hex value
        var leaves = (child[0] + child[1] + child[2] + child[3]).trim();
        var sha256Value = CryptoJS.SHA256(leaves);

        newTxList[index1] = (sha256Value);
        index1++;
        index++;
    }
    publicTree = prepublicTree;
    console.log(publicTree);
    return newTxList;
}

function getNewTxList(tempTxList) {
    var newTxList = [];
    var index = 0;
    var index1 = 0;
    var index2 = 0;
    var prepublicTree = [];
    publicIndex = Number(tempTxList.length) - Number(1);
    //  console.log(publicIndex);
    while (index2 < tempTxList.length) { //transposition tempTxList to prepublicTree
        var leave = tempTxList[index2].toString();
        prepublicTree[publicIndex] = (leave);
        publicIndex--;
        index2++;
    }

    while (index < tempTxList.length) { //hash this layer to get father layer
        //  console.log(publicTree.length);
        var child = [];

        // child1  
        child[0] = tempTxList[index].toString();
        //child2,child3,child4
        for (var i = 1; i < 4; i++) {
            index++;
            child[i] = "";
            if (index != tempTxList.length) {
                child[i] = tempTxList[index].toString();
            }
        }

        // sha2 hex value
        var leaves = (child[0] + child[1] + child[2] + child[3]).trim();
        var sha256Value = CryptoJS.SHA256(leaves);

        newTxList[index1] = (sha256Value);
        index1++;
        index++;
    }
    publicTree = publicTree.concat(prepublicTree);
    console.log(prepublicTree);
    console.log(publicTree);
    return newTxList;
}