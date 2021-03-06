import React, { useState, useEffect } from 'react';
import lottery from 'contracts/lottery';
import web3 from 'contracts/web3';
import JoinLotteryModal from 'components/modal/JoinLotteryModal';
import WrongNetworkWarning from 'components/modal/WrongNetworkWarning';
import NetworkNotIdentified from 'components/modal/NetworkNotIdentified';
import axios from 'axios';

const { default: Resolution } = require('@unstoppabledomains/resolution');
const resolution = new Resolution();

import UAuth from '@uauth/js';
class App extends React.Component {
  state = {
    manager: '',
    players: [],
    uniquePlayers: [],
    balance: '',
    value: '',
    message: '',
    isLoading: false,
    currentAccount: '',
    chainId: '',
    isModalopen: false,
    ethToUsd: 0,
    isLoggedIn: false,
    networkWarning: false,
    networkNotFound: false,

    loginMethod: 'metamask',
  };

  resolve = (domain, currency) => {
    resolution
      .addr(domain, currency)
      .then((address) => console.log(domain, 'resolves to', address))
      .catch(console.error);
  };

  async componentDidMount() {
    this.resolve('uns-devtest-nicosiput-openpond.crypto', 'ETH');
    try {
      document.title = 'Lottery Hive';

      await this.loadData();

      const response = await axios.get(
        'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
      );
      this.setState({ ethToUsd: response.data.USD });

      window.ethereum.on('accountsChanged', async function (accounts) {
        console.log(accounts.length);
        // Time to reload your interface with accounts[0]!
        location.reload();
      });

      window.ethereum.on('chainChanged', (chainId) => {
        console.log('network changed to : ' + chainId);
        localStorage.setItem('chainID', chainId);
        location.reload(true);
      });
    } catch (error) {
      console.log(error);
    }
  }

  loadData = async () => {
    this.setState({ isLoading: true });

    let chainId = await web3.currentProvider.chainId;
    let networkNotFound = false;

    const networkWarning = chainId !== '0x5';

    if (chainId !== null) {
      localStorage.setItem('chainID', chainId);
    } else {
      chainId = localStorage.getItem('chainID');
      if (chainId === null) {
        networkNotFound = true;
      }
    }

    if (networkWarning) {
      this.setState({ networkWarning, networkNotFound });
    } else {
      console.log(this.state.currentAccount);
      // Check unstoppable account
      const uauth = new UAuth({
        clientID: process.env.REACT_APP_UNSTOPPABLE_CLIENT_ID,
        redirectUri: process.env.REACT_APP_UNSTOPPABLE_REDIRECT_URI,
      });

      try {
        const unstoppableAccount = await uauth.user();

        this.setState({ currentAccount: unstoppableAccount.wallet_address });
      } catch (error) {
        console.log(error);
      }

      if (window.ethereum) {
        if (window.ethereum.selectedAddress) {
          this.setState({ isLoggedIn: true });
        } else if (this.state.currentAccount) {
          this.setState({ isLoggedIn: true });
        } else {
          this.setState({ isLoggedIn: false });
        }
      } else {
        alert(
          '???? You must install Metamask into your browser: https://metamask.io/download.html',
        );
      }

      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const lastWinner = await lottery.methods.lastWinner().call();
      let lastPayout = await lottery.methods.lastPayout().call();
      let uniquePlayers = players.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      lastPayout = web3.utils.fromWei(lastPayout, 'ether');
      const balance = await web3.eth.getBalance(lottery.options.address);
      this.setState({
        manager,
        players,
        balance,
        isLoading: false,
        chainId,
        lastWinner,
        lastPayout,
        uniquePlayers,
        networkWarning,
      });

      if (this.state.currentAccount.length === 0) {
        console.log('disini');
        const [currentAccount] = await web3.eth.getAccounts();
        console.log(currentAccount);
        this.setState({ currentAccount });
      }
    }
  };

  handlerEnterLottery = async (value) => {
    try {
      this.setState({ isLoading: true });
      // const accounts = await web3.eth.getAccounts();
      // console.log(accounts);
      await lottery.methods.enter().send({
        from: '0xcf2cf040d7a03ff563e65f0ba73686acb00f9811',
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
      console.log(this.state.currentAccount);
      this.setState({ isLoading: true });
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      await lottery.methods.pickWinner().send({
        from: this.state.currentAccount,
      });
      this.setState({ message: 'A winner has been picked' });

      await this.loadData();
    } catch (error) {
      console.log(error);
      this.setState({ message: 'Transaction error!' });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handlerLogin = async () => {
    await ethereum.request({
      method: 'eth_requestAccounts',
    });
    this.setState({ loginMethod: 'metamask' });
  };

  handlerLoginUnstoppable = async () => {
    try {
      const uauth = new UAuth({
        clientID: process.env.REACT_APP_UNSTOPPABLE_CLIENT_ID,
        redirectUri: process.env.REACT_APP_UNSTOPPABLE_REDIRECT_URI,
      });

      const authorization = await uauth.loginWithPopup();
      console.log(authorization);

      // this.setState({
      //   currentAccount: authorization.idToken.wallet_address,
      // });

      this.loadData();
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <main className="relative">
        <div className="absolute image-hive">
          <img
            className="animate-pulse"
            src="images/honey-bee.png"
            alt="honey"
            width={'50%'}
          />
        </div>
        <div className="absolute top-0 right-0">
          <img
            src="images/bee.png"
            alt="honey"
            width={'50%'}
            className="animate-bounce"
          />
        </div>

        <div className="prize text-center flex flex-col items-center justify-center z-10">
          {/* NOTE message alert */}
          {this.state.message && (
            <div className="flex bg-modal-header items-center text-white p-3 rounded-lg mb-5 w-1/2">
              <img src="images/icon-checklist.png" alt="check" width={55} />
              {this.state.message}
            </div>
          )}

          <div className="text-center"></div>
          {this.state.isLoading ? (
            <div className="loading"></div>
          ) : (
            <>
              <div className="subtitle text-center">
                <span className="font-bold text-3xl text-purple-900">
                  {this.state.players.length} Worker Bees,
                </span>
                <br />
                <span className="font-bold text-white text-lg">
                  Have presented their offering for the next
                </span>
                <br />
                <span className="font-bold text-3xl text-purple-900 animate-pulse">
                  Queen Bee
                </span>
              </div>

              <h3 className="font-amount-prize mt-3 text-purple-900">
                ${' '}
                {(
                  this.state.ethToUsd *
                  web3.utils.fromWei(this.state.balance, 'ether')
                ).toFixed(2)}
              </h3>
            </>
          )}

          <p className="text-white ">
            {this.state.isLoading
              ? 'Calculating nectar and pollens ..'
              : 'worth of Royal Jelly !'}
          </p>

          {!this.state.isLoading && (
            <>
              <button
                onClick={() => {
                  if (this.state.isLoggedIn) {
                    this.setState({ isModalopen: true });
                  } else {
                    this.handlerLogin();
                    // this.handlerLoginUnstoppable();
                  }
                }}
                className=" bg-purple-900 text-white font-bold px-10 py-3 mt-8 rounded-full cursor-pointer transition-all duration-100 hover:px-12 hover:py-5 hover:text-lg"
                disabled={this.state.isLoading}
              >
                {this.state.isLoading
                  ? 'Loading...'
                  : this.state.isLoggedIn
                  ? 'Offer a Nectar'
                  : 'Connect'}
              </button>
              {!this.state.isLoggedIn && (
                <button
                  onClick={() => {
                    this.handlerLoginUnstoppable();
                  }}
                  className=" bg-purple-900 text-white font-bold px-10 py-3 mt-8 rounded-full cursor-pointer transition-all duration-100 hover:px-12 hover:py-5 hover:text-lg"
                  disabled={this.state.isLoading}
                >
                  {this.state.isLoading ? 'Loading...' : 'Login With Unstoppable'}
                </button>
              )}

              {this.state.manager.toLowerCase() ===
                this.state.currentAccount?.toLowerCase() &&
                this.state.balance > 0 && (
                  <button
                    onClick={this.handlerPickWinner}
                    className=" bg-white text-black hover:bg-purple-900 hover:text-white font-bold px-10 py-3 mt-8 rounded-full cursor-pointer transition-all duration-100 w-2/5 mx-auto"
                    disabled={this.state.isLoading}
                  >
                    {this.state.isLoading ? 'Loading...' : 'Pick the Next Queen Bee'}
                  </button>
                )}

              {this.state.manager != this.state.currentAccount && (
                <div className="subtitle text-center py-6">
                  <span className="font-bold text-lg text-purple-900">
                    The Next Queen Bee
                  </span>
                  <span className="font-bold text-white text-lg">
                    &nbsp;will be selected on every 10th of every month!
                  </span>
                  <br />
                  <span className="font-bold text-white text-base">
                    Stay tune and join our Discord for other announcements!
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        <div className="container flex justify-between py-6">
          <div className="w-1/2 px-2">
            <div className="flex items-center justify-center rounded-t-lg bg-bee-main font-bold border-b p-5">
              <h3 className="text-lg uppercase text-bee-main">
                Registered Worker Bees
              </h3>
            </div>

            <div className="rounded-b-lg font-normal bg-bee-secondary text-white text-sm p-6">
              <div
                className="container flex justify-center "
                style={{ maxHeight: '20vh', height: '20vh' }}
              >
                <div className="w-full text-bee-main border-separate space-y-6 text-sm">
                  {this.state.isLoading ? (
                    <div className="loading"></div>
                  ) : (
                    this.state.uniquePlayers.map((player, idx) => {
                      return (
                        <div className="flex justify-center bg-white p-3" key={idx}>
                          <p
                            className={
                              'font-bold text-base ' +
                              (player == this.state.currentAccount
                                ? 'text-purple-900'
                                : 'text-bee-main')
                            }
                          >
                            {player}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/2 px-2">
            <div className="flex items-center justify-center rounded-t-lg bg-bee-main font-bold text-sm text-white border-b p-5">
              <h3 className="text-lg text-bee-main uppercase">
                Last Royal Jelly Queen
              </h3>
            </div>

            <div className="rounded-b-lg font-normal bg-bee-secondary text-white shadow-lg text-sm p-6">
              <div
                className="container text-modal-text items-center justify-center"
                style={{ maxHeight: '20vh', height: '20vh' }}
              >
                {this.state.isLoading ? (
                  <div className="loading"></div>
                ) : (
                  <>
                    <h3
                      className={
                        'mb-3 inline-block rounded-lg p-3 w-auto border-bee shadow-lg font-bold text-lg text-center ' +
                        (this.state.lastWinner == this.state.currentAccount
                          ? 'bg-bee-honey text-purple-900'
                          : 'bg-white text-bee-main')
                      }
                    >
                      {this.state.lastWinner !==
                      '0x0000000000000000000000000000000000000000'
                        ? this.state.lastWinner
                        : 'Queen Bee not yet Selected '}
                    </h3>
                    <h3 className="font-amount-prize mt-5 text-purple-900 text-center">
                      $ {(this.state.ethToUsd * this.state.lastPayout).toFixed(2)}
                    </h3>
                    <h3 className="font-bold text-lg mt-5 text-purple-900 text-center">
                      Presented!
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
        <WrongNetworkWarning
          isOpen={!this.state.networkNotFound && this.state.networkWarning}
          shouldCloseOnOverlayClick={false}
        />
        <NetworkNotIdentified
          isOpen={this.state.networkNotFound}
          shouldCloseOnOverlayClick={false}
        />
      </main>
    );
  }
}
export default App;
