import Web3 from 'web3';
import Crud from '../build/contracts/Crud.json';

let web3;
let crud;

const initWeb3 = () => {
  return new Promise((resolve, reject) => {
     //case 1- New Metamask is present 
    if(typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
       //ask user to connect Metamask 
      window.ethereum.enable()
        .then(() => {
          resolve(
            new Web3(window.ethereum)
          );
        })
        .catch(e => {
          reject(e);
        });
      return;
    }
     //case 2-Old Metamask is present 
    if(typeof window.web3 !== 'undefined') {
      return resolve(
        new Web3(window.web3.currentProvider)
      );
    }
    //case 3- no metamasak.use Ganache 
    resolve(new Web3('http://localhost:9545'));
  });
};

//Pointer to deploy instance of the contract to interact
//import the Crud object from Abi and address 
const initContract = () => {
  const deploymentKey = Object.keys(Crud.networks)[0];
    // instiantiate the web3 contract instance 
  return new web3.eth.Contract(
    Crud.abi, 
    Crud
      .networks[deploymentKey]
      .address
  );
};

//Business logic for the code 
const initApp = () => {
  //Two pointers for create function 
  const $create = document.getElementById('create');
  const $createResult = document.getElementById('create-result');

    //Two pointers for read function 
  const $read = document.getElementById('read');
  const $readResult = document.getElementById('read-result');

  //Two Pointers for update function 
  const $edit = document.getElementById('edit');
  const $editResult = document.getElementById('edit-result');

   //Two Pointers for Destroy function 
  const $delete = document.getElementById('delete');
  const $deleteResult = document.getElementById('delete-result');

  //In order to javascript code intearact with accounts from metamask 
  let accounts = [];

  web3.eth.getAccounts()
  .then(_accounts => {
    accounts = _accounts;
  });

  //add Event Litener to create form and wait for event submitted
  $create.addEventListener('submit', (e) => {
      //to stop default reloading 
    e.preventDefault();
    //extract the value of name input
    const name = e.target.elements[0].value;
    //trigger the create method on smartcontract 
    crud.methods
    .create(name)
    .send({from: accounts[0]})

    //we wait for completion of this promise 
    .then(result => {
      $createResult.innerHTML = `New user ${name} successfully created !`;
    })
    .catch(_e => {
      $createResult.innerHTML = `Ooops... there was an error while trying to create a new user...`;
    });
  });

  //Read function
  $read.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    crud.methods.read(id).call()
    .then(result => {
      $readResult.innerHTML = `Id: ${result[0]} Name: ${result[1]}`;
    })
    .catch(_e => {
      $readResult.innerHTML = `Ooops... there was an error while trying to read user ${id}`;
    });
  });

  //Update function
  $edit.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    const name = e.target.elements[1].value;
    crud.methods.update(id, name).send({from: accounts[0]})
    .then(result => {
      $editResult.innerHTML = `Changed name of user ${id} to ${name}`;
    })
    .catch(_e => {
      $editResult.innerHTML = `Ooops... there was an error while trying to update name of user ${id} to ${name}`;
    });
  });

  //Delete function
  $delete.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    crud.methods.deletes(id).send({from: accounts[0]})
    .then(result => {
      $deleteResult.innerHTML = `Deleted user ${id}`;
    })
    .catch(_e => {
      $deleteResult.innerHTML = `Ooops... there was an error while trying to delete user ${id}`;
    });
  });
};

//wait for HTML page load and execute web3() ,initContract () functions  
document.addEventListener('DOMContentLoaded', () => {
  initWeb3()
    .then(_web3 => {
      web3 = _web3;
      crud = initContract();
      initApp(); 
    })
    .catch(e => console.log(e.message));
});
