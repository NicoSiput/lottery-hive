import React, { useState, useEffect } from 'react';
import lottery from 'contracts/lottery';
import web3 from 'contracts/web3';
import JoinLotteryModal from 'components/modal/JoinLotteryModal';
import axios from 'axios';
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
    isModalopen: false,
    ethToUsd: 0,
  };

  async componentDidMount() {
    try {
      document.title = 'Lottery Hive DApp';
      await this.loadData();

      const response = await axios.get(
        'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'
      );
      this.setState({ ethToUsd: response.data.USD });

      await ethereum.request({
        method: 'eth_requestAccounts',
      });
      window.ethereum.on('accountsChanged', async function (accounts) {
        // Time to reload your interface with accounts[0]!
        location.reload();
      });

      window.ethereum.on('chainChanged', (chainId) => {
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
    const lastWinner = await lottery.methods.lastWinner().call();
    let lastPayout = await lottery.methods.lastPayout().call();

    lastPayout = web3.utils.fromWei(lastPayout, 'ether');
    const balance = await web3.eth.getBalance(lottery.options.address);
    const [currentAccount] = await web3.eth.getAccounts();

    this.setState({
      manager,
      players,
      balance,
      isLoading: false,
      currentAccount,
      chainId,
      lastWinner,
      lastPayout,
    });
  };

  handlerEnterLottery = async (value) => {
    try {
      this.setState({ isLoading: true });
      const accounts = await web3.eth.getAccounts();
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(value, 'ether'),
      });

      this.setState({ message: 'You have been joined' });
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
      const accounts = await web3.eth.getAccounts();
      await lottery.methods.pickWinner().send({
        from: accounts[0],
      });
      this.setState({ message: 'A winner has been picked' });

      await this.loadData();
    } catch (error) {
      this.setState({ message: 'Transaction error!' });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <main className="relative">
        <div className="absolute image-hive">
          <img
            className="animate-pulse"
            src="/images/honey-bee.png"
            alt="honey"
            width={'50%'}
          />
        </div>
        <div className="absolute top-0 right-0">
          <img
            src="/images/bee.png"
            alt="honey"
            width={'50%'}
            className="animate-bounce"
          />
        </div>

        <div className="prize text-center flex flex-col items-center justify-center z-10">
          {/* NOTE message alert */}
          {this.state.message && (
            <div className="flex bg-modal-header items-center text-white p-3 rounded-lg mb-5 w-1/2">
              <img src="/images/icon-checklist.png" alt="check" width={55} />
              {this.state.message}
            </div>
          )}

          <h2 className="font-bold text-white text-lg">The Lottery Hive</h2>

          {this.state.isLoading ? (
            <div className="loading"></div>
          ) : (
            <h3 className="font-amount-prize mt-3 text-purple-900">
              ${' '}
              {(
                this.state.ethToUsd *
                web3.utils.fromWei(this.state.balance, 'ether')
              ).toFixed(2)}
            </h3>
          )}

          <p className="text-white ">in prizes!</p>

          {!this.state.isLoading && (
            <>
              <button
                onClick={() => this.setState({ isModalopen: true })}
                className=" bg-purple-900 text-white font-bold px-10 py-3 mt-8 rounded-full cursor-pointer transition-all duration-100 hover:px-12 hover:py-5 hover:text-lg"
                disabled={this.state.isLoading}
              >
                {this.state.isLoading ? 'Loading...' : 'Join'}
              </button>

              {this.state.manager === this.state.currentAccount &&
                this.state.balance > 0 && (
                  <button
                    onClick={this.handlerPickWinner}
                    className=" bg-white text-black hover:bg-purple-900 hover:text-white font-bold px-10 py-3 mt-8 rounded-full cursor-pointer transition-all duration-100 w-2/5 mx-auto"
                    disabled={this.state.isLoading}
                  >
                    {this.state.isLoading ? 'Loading...' : 'Draw the lottery'}
                  </button>
                )}
            </>
          )}
        </div>
        <div className="container">
          <div className="w-full">
            <div className="flex items-center justify-between rounded-t-lg bg-modal-header font-bold text-sm text-white border-b p-5">
              <h3 className="text-lg uppercase">Last Royal Jelly Queen</h3>
            </div>

            <div className="rounded-b-lg font-normal bg-modal-body text-white text-sm p-6">
              <div className="container text-modal-text">
                {this.state.isLoading ? (
                  <div className="loading"></div>
                ) : (
                  <>
                    <h3 className="mb-3 inline-block bg-white rounded-lg p-1 w-auto">
                      {this.state.lastWinner}
                    </h3>
                    <h3 className="font-amount-prize mt-5 text-purple-900">
                      ${' '}
                      {(this.state.ethToUsd * this.state.lastPayout).toFixed(2)}
                      <span className="text-base text-white">in payout</span>
                    </h3>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <JoinLotteryModal
          isOpen={this.state.isModalopen}
          shouldCloseOnOverlayClick={true}
          onRequestClose={() => this.setState({ isModalopen: false })}
          data={{
            players: this.state.players,
          }}
          onSubmit={this.handlerEnterLottery}
        />
      </main>
    );
  }
}
export default App;
