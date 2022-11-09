//https://goerli.infura.io/v3/12d81d2652574509b991c7f01ffbd77f
const fs =require('fs');
const HDWalletProvider = require('truffle-hdwallet-provier');

const secrets = JSON.parse(fs.readFileSync(',secrets').toString().trim());
// truffle-hdwallet-provier
module.exports = {networks : {
    goerli:{
        provider:() =>
            new HDWalletProvider(
                secrets.seed,
                `https://goerli.infura.io/v3/${secrets.projectId}`

            ),
            network_id :5
            }
        }
    }
