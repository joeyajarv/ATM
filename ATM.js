/**
 *   @author Jarvenpaa, Josiah (josiahjarvenpaa@live.com)
 *   @version 0.0.1
 *   @summary ATM Project || created: 11.15.2016
 *   @todo
 */

"use strict";
const PROMPT = require('readline-sync');
const IO = require('fs');  // For file I/O
const  VIEW = 1, WITHDRAW = 2, DEPOSIT = 3, TRANSFER = 4, CHECKINGS_ONLY = 1, NUM_ACCOUNTS = 5, CHECKING_BALANCE = 6, SAVINGS_BALANCE = 7;

let continueResponse, cardNumber, pinNumber, userChoice;
let accounts = [];
let currentUser = [];

function main() {
    let infinite = 0;
    populateAccounts();
    while (infinite === 0) {
        insertCardNumber();
        setPIN();
        makePersonalArray();
        setUserMenu();
        if (userChoice = VIEW) {
            displayBalance();
            setContinueResponse();
        } else if (userChoice = WITHDRAW) {
            withdraw();
            setContinueResponse();
        } else if (userChoice = DEPOSIT) {
            deposit();
            setContinueResponse();
        } else {
            transfer();
            setContinueResponse();
        }

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

function insertCardNumber() {
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

function setPIN() {
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
        console.log(pinNumber);
        return setPIN();
    }
}

function makePersonalArray() {
    currentUser = accounts[cardNumber];
}

function setUserMenu() {
    const CHECKING_ACCOUNT_ONLY = 1, VIEW = 1, WITHDRAW = 2, DEPOSIT = 3, TRANSFER = 4;
    if (accounts[NUM_ACCOUNTS] == CHECKING_ACCOUNT_ONLY) {
        console.log (`\n 1) View Account Balance \n 2) Withdraw Money \n 3) Deposit Money`);
        userChoice = PROMPT.question(`\nPlease select an action:`)
    } else {
        console.log (`\n 1) View Account Balance \n 2) Withdraw Money \n 3) Deposit Money \n 4) Transfer Money Between Accounts`);
        userChoice = PROMPT.question(`\nPlease select an action:`)
    }
}

function displayBalance() {
    if (accounts[NUM_ACCOUNTS] = CHECKINGS_ONLY) {
        console.log(`\n Your checking balance is equal to ${accounts[CHECKING_BALANCE]} dollars.`);
    } else {
        console.log(`\n Your checking balance is equal to ${accounts[CHECKING_BALANCE]} dollars. \n Your savings balance is equal to ${accounts[SAVINGS_BALANCE]} dollars.`);
    }
}

function withdraw() {
    let withdrawal, whichAccount;
    const CHECKING_ACCOUNT = 1;
    if (accounts[NUM_ACCOUNTS] = CHECKINGS_ONLY) {
        withdrawal = PROMPT.question(`\nHow much money would you like to withdraw from your checking account? `);
        accounts[CHECKING_BALANCE] = accounts[CHECKING_BALANCE] - withdrawal;
    } else {
        whichAccount = PROMPT.question(`Which account would you like to withdraw from: Checking (1) or Savings (2)? `);
        withdrawal = PROMPT.question(`How much money would you like to withdraw? `);
        if (whichAccount == CHECKING_ACCOUNT) {
            accounts[CHECKING_BALANCE] = accounts[CHECKING_BALANCE] - withdrawal;
        } else {
            accounts[SAVINGS_BALANCE] = accounts[SAVINGS_BALANCE] - withdrawal;
        }
    }
}

function deposit() {
    let deposit, whichAccount;
    const CHECKING_ACCOUNT = 1;
    if (accounts[NUM_ACCOUNTS] === CHECKINGS_ONLY) {
        deposit = PROMPT.question(`\nHow much would you like to deposit into your checking account?`);
        accounts[CHECKING_BALANCE] = accounts[CHECKING_BALANCE] + deposit;
    } else {
        whichAccount = PROMPT.question(`\nWhich account would you like to deposit into, checking (1), or savings (2)? `);
        deposit = PROMPT.question(`How much money would you like to deposit?`);
        if (whichAccount == CHECKING_ACCOUNT) {
            accounts[CHECKING_BALANCE] = accounts[CHECKING_BALANCE] + deposit;
        } else {
            accounts[SAVINGS_BALANCE] = accounts[SAVINGS_BALANCE] + deposit;
        }
    }
}

function transfer() {
    let transfer, transferAmount;
    transfer = PROMPT.question(`\nWould you like to 1) transfer from savings to checking, or 2) transfer from checkings to savings?`);
    if (transfer === 1) {
        transferAmount = (`\nHow much would you like to move from your savings to your checkings?`);
        accounts[CHECKING_BALANCE] = accounts[CHECKING_BALANCE] + transferAmount;
        accounts[SAVINGS_BALANCE] = accounts[SAVINGS_BALANCE] - transferAmount;
    } else {
        transferAmount = (`\nHow much would you like to move from your checkings to your savings?`);
        accounts[CHECKING_BALANCE] = accounts[CHECKING_BALANCE] - transferAmount;
        accounts[SAVINGS_BALANCE] = accounts[SAVINGS_BALANCE] + transferAmount;
    }
}