/**
 *   @author Jarvenpaa, Josiah (josiahjarvenpaa@live.com)
 *   @version 0.0.1
 *   @summary ATM Project || created: 11.15.2016
 *   @todo
 */

"use strict";
const PROMPT = require('readline-sync');
const IO = require('fs');  // For file I/O
const  VIEW = 1, WITHDRAW = 2, DEPOSIT = 3, TRANSFER = 4, CHECKINGS_ONLY = 1, NUM_ACCOUNTS = 4, CHECKING_BALANCE = 5, SAVINGS_BALANCE = 6, CARD_NUMBER = 0;

let continueResponse, cardNumber, pinNumber, userChoice;
let accounts = [];
let currentUser = [];

function main() {
    let infinite = 0;
    populateAccounts();
    setContinueResponse();
    while (infinite === 0) {
        userChoice = -1;
        insertCardNumber();
        makePersonalArray();
        setPIN();
        setUserMenu();
        if (userChoice == VIEW) {
            displayBalance();
            setContinueResponse();
        } else if (userChoice == WITHDRAW) {
            withdraw();
            setContinueResponse();
        } else if (userChoice == DEPOSIT) {
            deposit();
            setContinueResponse();
        } else {
            transfer();
            setContinueResponse();
        }
        writeUserData();
    }
}

main();

function setContinueResponse() {
    if (continueResponse) {
        continueResponse = -1;
        while (continueResponse !== 0 && continueResponse !== 1) {
            continueResponse = Number(PROMPT.question(`\nDo you want to continue? [0=no, 1=yes]: `));
        }
    } else {
        continueResponse = 1;
    }
}

function populateAccounts() {
    let fileContents = IO.readFileSync(`data.csv`, 'utf8');
    let lines = fileContents.toString().split(/\r?\n/); // Automatically creates SD array on newlines
    for (let i = 0; i < lines.length; i++) {
        accounts.push(lines[i].toString().split(/,/));
    }
}

function insertCardNumber() { //Couldn't wrap with "Number()" on line 69 without overloading & breaking program
    const CARD_NUMBER = 0;
    let found = 0;
    while (cardNumber == null || !/^[0-9]{4}$/.test(cardNumber)) {
        cardNumber = PROMPT.question(`\n Please enter your four-digit card number: `);
    }
    for (let i = 0; i < accounts.length; i++) {
        if (cardNumber === accounts[i][CARD_NUMBER]) {
            found = 1;
            break;
        }
    }
    if (found === 0) {
        return insertCardNumber();
    }
}

function setPIN() { //Couldn't wrap with "Number()" on line 86 without overloading & subsequently breaking program
    const PIN_NUMBER = 1;
    let found = 0;
    while (pinNumber == null || !/^[0-9]{4}$/.test(pinNumber)) {
        pinNumber = PROMPT.question(`\n Please enter your four-digit PIN: `);
    }
    for (let i = 0; i < accounts.length; i++) {
        if (pinNumber === accounts[i][PIN_NUMBER]) {
            found = 1;
            break;
        }
    }
    if (found === 0) {
        return setPIN();
    }
}

function makePersonalArray() {
    for(let i = 0; i < accounts.length; i++) {
        if(cardNumber == accounts [i][CARD_NUMBER]) {
            currentUser = accounts[i];
            //return accounts[i];
        }
    }
}

function setUserMenu() {
    const CHECKING_ACCOUNT_ONLY = 1;
    if (currentUser[NUM_ACCOUNTS] == CHECKING_ACCOUNT_ONLY) {
        console.log (`\n 1) View Account Balance \n 2) Withdraw Money \n 3) Deposit Money`);
        while ((typeof userChoice === `undefined` || isNaN(userChoice)) || (userChoice !== VIEW && userChoice !== DEPOSIT && userChoice !== WITHDRAW)) {
            userChoice = Number(PROMPT.question(`\nPlease select an option:`));
        }
    } else {
        console.log(`\n 1) View Account Balance \n 2) Withdraw Money \n 3) Deposit Money \n 4) Transfer Money Between Accounts`);
        while ((typeof userChoice === `undefined` || isNaN(userChoice)) || (userChoice !== VIEW && userChoice !== DEPOSIT && userChoice !== WITHDRAW && userChoice !== TRANSFER)) {
            userChoice = Number(PROMPT.question(`\nPlease select an option:`));
        }
    }
}

function displayBalance() {
    if (currentUser[NUM_ACCOUNTS] == CHECKINGS_ONLY) {
        console.log(`\n Your checking balance is equal to ${currentUser[CHECKING_BALANCE]} dollars.`);
    } else {
        console.log(`\n Your checking balance is equal to ${currentUser[CHECKING_BALANCE]} dollars. \n Your savings balance is equal to ${currentUser[SAVINGS_BALANCE]} dollars.`);
    }
}

function withdraw() {
    let withdrawal, whichAccount;
    const CHECKING_ACCOUNT = 1, SAVINGS_ACCOUNT = 2;
    if (currentUser[NUM_ACCOUNTS] === CHECKINGS_ONLY) {
        while ((typeof withdrawal === `undefined` || isNaN(withdrawal)) || (withdrawal > currentUser[CHECKING_BALANCE])) {
            withdrawal = Number(PROMPT.question(`\nHow much money would you like to withdraw from your checking account? `));
        }
        currentUser[CHECKING_BALANCE] = currentUser[CHECKING_BALANCE] - withdrawal;
    } else {
        while ((typeof whichAccount === `undefined` || isNaN(whichAccount)) || (whichAccount != CHECKING_ACCOUNT && whichAccount != SAVINGS_ACCOUNT)) {
            whichAccount = Number(PROMPT.question(`Which account would you like to withdraw from: Checking (1) or Savings (2)? `));
        }
        if (whichAccount == CHECKING_ACCOUNT) {
            while ((typeof withdrawal === `undefined` || isNaN(withdrawal)) || (withdrawal > currentUser[CHECKING_BALANCE])) {
                withdrawal = Number(PROMPT.question(`How much money would you like to withdraw? `));
                currentUser[CHECKING_BALANCE] = currentUser[CHECKING_BALANCE] - withdrawal;
            }
        } else {
            while ((typeof withdrawal === `undefined` || isNaN(withdrawal)) || (withdrawal > currentUser[SAVINGS_BALANCE])) {
                withdrawal = Number(PROMPT.question(`How much money would you like to withdraw? `));
                currentUser[SAVINGS_BALANCE] = currentUser[SAVINGS_BALANCE] - withdrawal;
            }
        }
    }
}

function deposit() {
    let deposit, whichAccount;
    const CHECKING_ACCOUNT = 1, SAVINGS_ACCOUNT = 2, MIN_DEPOSIT = 0;
    if (currentUser[NUM_ACCOUNTS] === CHECKINGS_ONLY) {
        while ((typeof deposit === `undefined` || isNaN(deposit)) || (deposit < MIN_DEPOSIT)) {
            deposit = Number(PROMPT.question(`\nHow much would you like to deposit into your checking account?`));
        }
        currentUser[CHECKING_BALANCE] = parseInt(currentUser[CHECKING_BALANCE]) + parseInt(deposit);
    } else {
        while ((typeof whichAccount === `undefined` || isNaN(whichAccount)) || (whichAccount != CHECKING_ACCOUNT && whichAccount != SAVINGS_ACCOUNT)) {
            whichAccount = Number(PROMPT.question(`\nWhich account would you like to deposit into, checking (1), or savings (2)? `));
        }
        while ((typeof deposit === `undefined` || isNaN(deposit)) || (deposit < MIN_DEPOSIT)) {
            deposit = Number(PROMPT.question(`How much money would you like to deposit?`));
        }
        if (whichAccount == CHECKING_ACCOUNT) {
            currentUser[CHECKING_BALANCE] = parseInt(currentUser[CHECKING_BALANCE]) + parseInt(deposit);
        } else {
            currentUser[SAVINGS_BALANCE] = parseInt(currentUser[SAVINGS_BALANCE]) + parseInt(deposit);
        }
    }
}

function transfer() {
    let transfer, transferAmount;
    const SAVINGS_ACCOUNT = 1, CHECKING_ACCOUNT = 2;
    while ((typeof transfer === `undefined` || isNaN(transfer)) || (transfer != CHECKING_ACCOUNT && transfer != SAVINGS_ACCOUNT)) {
        transfer = Number(PROMPT.question(`\nWould you like to 1) transfer from savings to checking, or 2) transfer from checkings to savings?`));
    }
    if (transfer === 1) {
        while ((typeof transferAmount === `undefined` || isNaN(transferAmount)) || (transferAmount > currentUser[SAVINGS_BALANCE])) {
            transferAmount = Number(PROMPT.question(`\nHow much would you like to move from your savings to your checkings?`));
        }
        currentUser[CHECKING_BALANCE] = currentUser[CHECKING_BALANCE] + transferAmount;
        currentUser[SAVINGS_BALANCE] = currentUser[SAVINGS_BALANCE] - transferAmount;
    } else {
        while ((typeof transferAmount === `undefined` || isNaN(transferAmount)) || (transferAmount > currentUser[CHECKING_BALANCE])) {
            transferAmount = Number(PROMPT.question(`\nHow much would you like to move from your checkings to your savings?`));
        }
        currentUser[CHECKING_BALANCE] = currentUser[CHECKING_BALANCE] - transferAmount;
        currentUser[SAVINGS_BALANCE] = currentUser[SAVINGS_BALANCE] + transferAmount;
    }
}

function writeUserData() {
    let userData = "";
    for (let i = 0; i < currentUser.length; i++) {
        if (i < currentUser.length - 1) {
            userData += currentUser[i] + ',';
        } else {
            userData += currentUser[i];
        }
    }
    let data = IO.readFileSync('data.csv', 'utf8');
    let result = data.replace(new RegExp('^' + userData.slice(0,4) + '.*'), userData);
    console.log('writing: ' + result);
    IO.writeFileSync('data.csv', result, 'utf8');
}