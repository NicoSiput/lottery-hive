import web3 from './web3';

// const address = '0xBAb11F58d7b13bc0860d7e30dF290EF752940B33';
const address = '0xf10788958C1f5A225f0B51fb282bA184dCf5f1be';
// const abi = [
//   {
//     inputs: [],
//     stateMutability: 'nonpayable',
//     type: 'constructor',
//     signature: 'constructor',
//   },
//   {
//     inputs: [],
//     name: 'enter',
//     outputs: [],
//     stateMutability: 'payable',
//     type: 'function',
//     payable: true,
//     signature: '0xe97dcb62',
//   },
//   {
//     inputs: [],
//     name: 'getPlayers',
//     outputs: [
//       { internalType: 'address payable[]', name: '', type: 'address[]' },
//     ],
//     stateMutability: 'view',
//     type: 'function',
//     constant: true,
//     signature: '0x8b5b9ccc',
//   },
//   {
//     inputs: [],
//     name: 'manager',
//     outputs: [{ internalType: 'address', name: '', type: 'address' }],
//     stateMutability: 'view',
//     type: 'function',
//     constant: true,
//     signature: '0x481c6a75',
//   },
//   {
//     inputs: [],
//     name: 'pickWinner',
//     outputs: [],
//     stateMutability: 'nonpayable',
//     type: 'function',
//     signature: '0x5d495aea',
//   },
//   {
//     inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//     name: 'players',
//     outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
//     stateMutability: 'view',
//     type: 'function',
//     constant: true,
//     signature: '0xf71d96cb',
//   },
// ];

const abi = [
  {
    constant: false,
    inputs: [],
    name: 'enter',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'pickWinner',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    constant: true,
    inputs: [],
    name: 'getPlayers',
    outputs: [
      {
        name: '',
        type: 'address[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'manager',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    name: 'players',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

export default new web3.eth.Contract(abi, address);
