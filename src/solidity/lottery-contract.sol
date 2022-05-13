pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address public lastWinner;
    uint public lastPayout;
    address[] public players;

    function Lottery() public {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .001 ether);

        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
    }

    function pickWinner() public restricted {
        uint index = random() % players.length;
        uint totalBalance = this.balance;
        uint taxWinner = totalBalance * 25 / 1000;



        manager.transfer(taxWinner);

        lastPayout = totalBalance;

        players[index].transfer(totalBalance - taxWinner);
        lastWinner = players[index];

        // restating array to null
        players = new address[](0);
    }

    modifier restricted() {
        require(msg.sender == manager, "only owner can do this function");
        _;
    }

    function getPlayers() public view returns (address[]){
        return players;
    }

    function getLastWinner() public view returns (address){
        return lastWinner;
    }

}