import React, { useState, useEffect } from 'react';
import lottery from 'contracts/lottery';
import web3 from 'contracts/web3';

class App extends React.Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
    isLoading: false,
    currentAccount: '',
    chainId: '',
  };

  async componentDidMount() {
    try {
      await this.loadData();
      window.ethereum.on('accountsChanged', async function (accounts) {
        // Time to reload your interface with accounts[0]!
        location.reload();
      });

      ethereum.on('chainChanged', (chainId) => {
        console.log(chainId);
        location.reload();
      });
    } catch (error) {
      console.log(error);
    }
  }

  callThis = async () => {
    console.log('heree');
  };

  loadData = async () => {
    this.setState({ isLoading: true });

    const chainId = await web3.currentProvider.chainId;

    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const [currentAccount] = await web3.eth.getAccounts();

    this.setState({
      manager,
      players,
      balance,
      isLoading: false,
      currentAccount,
      chainId,
    });
  };

  handlerEnterLottery = async (event) => {
    try {
      this.setState({ isLoading: true });
      const accounts = await web3.eth.getAccounts();

      this.setState({ message: 'Waiting on transaction success...' });

      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether'),
      });

      this.setState({ message: 'You have been entered!' });
      await this.loadData();
    } catch (error) {
      this.setState({ message: error.message });
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handlerPickWinner = async () => {
    try {
      this.setState({ isLoading: true });
      const accounts = await web3.eth.getAccounts();

      this.setState({ message: 'Waiting on transaction success...' });
      await lottery.methods.pickWinner().send({
        from: accounts[0],
      });
      this.setState({ message: 'A winner has been picked!' });

      await this.loadData();
    } catch (error) {
      this.setState({ message: 'Transaction error!' });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <main>
        {this.state.message !== '' && (
          <div className="bg-white border rounded-md shadow-md mb-5 container p-3 text-center">
            {this.state.message}
          </div>
        )}

        <div className="bg-orange-200 py-5 px-3 container rounded-md">
          <div className="container grid grid-cols-3 gap-x-4">
            <div className=" bg-white rounded mt-3 p-3">
              <h2 className="border-b-2 text-gray-300">Contract Owner</h2>
              <p className="text-gray-500 font-medium mt-2 text-ellipsis overflow-hidden">
                {this.state.isLoading ? 'loading...' : this.state.manager}
              </p>
            </div>
            <div className=" bg-white rounded mt-3 p-3">
              <h2 className="border-b-2 text-gray-300">Players</h2>
              <p className="text-gray-500 font-medium mt-2 text-ellipsis overflow-hidden">
                {this.state.isLoading
                  ? 'loading...'
                  : `${this.state.players.length} people`}
              </p>
            </div>
            <div className=" bg-white rounded mt-3 p-3">
              <h2 className="border-b-2 text-gray-300">
                Available ether for competing
              </h2>
              <p className="text-gray-500 font-medium mt-2 text-ellipsis overflow-hidden">
                {this.state.isLoading
                  ? 'loading...'
                  : `${web3.utils.fromWei(this.state.balance, 'ether')} ETH`}
              </p>
            </div>
          </div>

          <div className="container bg-white mt-5 p-3 rounded shadow-md">
            <h2 className="text-base">Let's try your luck!</h2>
            <div className="mt-3">
              <div className="flex">
                <span className="text-sm  border-2 rounded-l px-4 py-2 bg-gray-300 whitespace-no-wrap">
                  ETH
                </span>
                <input
                  type="number"
                  id="search"
                  className="border border-gray-300  text-sm rounded-md block w-full focus:border-black focus-visible:outline-none py-2 px-4 "
                  placeholder="Enter amount of ETH"
                  onChange={(event) =>
                    this.setState({ value: event.target.value })
                  }
                />
              </div>
              <p className="text-red-200 text-xs font-bold">
                NOTE: Minimum 0.01 eth for join the lottery
              </p>

              <button
                onClick={this.handlerEnterLottery}
                className="px-8 py-2 border rounded-md text-sm mt-3 hover:bg-orange-400 hover:text-white transition-all duration-300"
                disabled={this.state.isLoading}
              >
                {this.state.isLoading ? 'Please wait...' : 'Have a try'}
              </button>
            </div>
          </div>

          {this.state.manager === this.state.currentAccount ? (
            <div className="container bg-white mt-5 p-3 rounded shadow-md">
              <h2 className="text-base">Let's pick a winner!</h2>
              <div className="mt-3">
                <button
                  onClick={this.handlerPickWinner}
                  className="w-full px-8 py-2 border rounded-md text-sm bg-orange-400 hover:bg-orange-500 text-white transition-all duration-300 "
                  disabled={this.state.isLoading}
                >
                  {this.state.isLoading ? 'Please wait...' : 'Spin the wheel!'}
                </button>
              </div>
            </div>
          ) : (
            <div className="container bg-white mt-5 p-3 rounded shadow-md">
              <h2 className="text-base">
                The owner will start random pick later
              </h2>
            </div>
          )}
        </div>
      </main>
    );
  }
}
export default App;
