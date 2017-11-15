pragma solidity ^0.4.2;

contract Ownable {
    address owner;
    modifier isOwned() {
        require(msg.sender == owner);
        _;
    }
    
    function Ownable() {
        owner = msg.sender;
    }
}
