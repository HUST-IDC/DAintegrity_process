pragma solidity ^0.4.4;
contract Integrity {    
  uint result;

  function compare(bytes32 root1 , bytes32 root2) constant returns(uint){
   
    if(root1 == root2){
      result=1;
    }
    else{
      result=2;
    }
    return result;
  }
  
}