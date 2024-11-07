const readline = require('readline');

// Simulated user data
let user = {
    phoneNumber: null,
    balance: 1000,
    pin: null,
    transactions: [],
    dailyLimit: null,
    loan: 0
};

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getDateTime() {
    const now = new Date();
    return now.toLocaleString();
}

// Function to register a 10-digit phone number
function registerNumber() {
    rl.question('Enter your 10-digit phone number to register: ', (number) => {
        if (number.length === 10 && /^[0-9]+$/.test(number)) {
            user.phoneNumber = number;
            console.log(`Phone number registered: ${user.phoneNumber}`);
            setPin();
        } else {
            console.log('Invalid phone number. Please enter a valid 10-digit number.');
            registerNumber();
        }
    });
}

// Function to set a 4-digit PIN
function setPin() {
    rl.question('Set a 4-digit PIN: ', (pin) => {
        if (pin.length === 4 && /^[0-9]+$/.test(pin)) {
            user.pin = pin;
            console.log('PIN set successfully.');
            mainMenu();
        } else {
            console.log('Invalid PIN. Try again.');
            setPin();
        }
    });
}

// Function to display account information
function accountInformation() {
    console.log('\n--- Account Information ---');
    console.log(`Phone Number: ${user.phoneNumber}`);
    console.log(`PIN: ****`); // Masked for security
    mainMenu();
}

// Function to set or change daily limit
function setDailyLimit() {
    rl.question('Enter daily spending limit: ', (limit) => {
        limit = parseFloat(limit);
        if (!isNaN(limit) && limit > 0) {
            user.dailyLimit = limit;
            console.log(`Daily limit set to $${user.dailyLimit}.`);
        } else {
            console.log('Invalid limit. Please enter a positive number.');
        }
        mainMenu();
    });
}

// Function to send money
function sendMoney() {
    rl.question('Enter recipient phone number (10 digits): ', (recipientNumber) => {
        if (recipientNumber === user.phoneNumber) {
            console.log("You can't send money to your own registered number.");
            mainMenu();
        } else if (recipientNumber.length === 10 && /^[0-9]+$/.test(recipientNumber)) {
            rl.question('Enter amount to send: ', (amount) => {
                amount = parseFloat(amount);
                if (amount > 0 && amount <= user.balance) {
                    if (user.dailyLimit && amount > user.dailyLimit) {
                        console.log(`Amount exceeds daily limit of $${user.dailyLimit}.`);
                        mainMenu();
                    } else {
                        rl.question('Enter your PIN: ', (enteredPin) => {
                            if (enteredPin === user.pin) {
                                user.balance -= amount;
                                let dateTime = getDateTime();
                                user.transactions.push({
                                    type: 'Sent',
                                    to: recipientNumber,
                                    amount: amount,
                                    date: dateTime
                                });
                                console.log(`Successfully sent $${amount} to ${recipientNumber} on ${dateTime}.`);
                                console.log(`Your new balance is $${user.balance}.`);
                            } else {
                                console.log('Incorrect PIN.');
                            }
                            mainMenu();
                        });
                    }
                } else {
                    console.log('Insufficient balance or invalid amount.');
                    mainMenu();
                }
            });
        } else {
            console.log('Invalid recipient number. Please enter a valid 10-digit number.');
            mainMenu();
        }
    });
}

// Function to repay loan
function repayLoan() {
    if (user.loan > 0) {
        rl.question(`Enter amount to repay (Outstanding loan: $${user.loan}): `, (amount) => {
            amount = parseFloat(amount);
            if (amount > 0 && amount <= user.balance && amount <= user.loan) {
                user.balance -= amount;
                user.loan -= amount;
                let dateTime = getDateTime();
                user.transactions.push({
                    type: 'Loan Repayment',
                    amount: amount,
                    date: dateTime
                });
                console.log(`Successfully repaid $${amount}. Outstanding loan: $${user.loan}.`);
                console.log(`Remaining balance: $${user.balance}`);
            } else {
                console.log('Invalid repayment amount.');
            }
            mainMenu();
        });
    } else {
        console.log('No outstanding loan to repay.');
        mainMenu();
    }
}

// Function to view transaction history (last 3 transactions)
function viewTransactions() {
    console.log('\n--- Transaction History ---');
    const transactionsToShow = user.transactions.slice(-3); // Get last 3 transactions
    if (transactionsToShow.length > 0) {
        transactionsToShow.reverse().forEach((transaction, index) => {
            console.log(`${index + 1}. ${transaction.type} - $${transaction.amount} - ${transaction.date} - ${transaction.to || ''}`);
        });
    } else {
        console.log('No transactions available.');
    }
    mainMenu();
}

// Main menu
function mainMenu() {
    console.log('\n--- Main Menu ---');
    console.log('1. Send Money');
    console.log('2. Pay Bill');
    console.log('3. Request Loan');
    console.log('4. Account Summary');
    console.log('5. Check Balance');
    console.log('6. Set Daily Limit');
    console.log('7. Repay Loan');
    console.log('8. View Last 3 Transactions');
    console.log('9. Account Information');
    console.log('10. Exit');
    rl.question('Choose an option: ', (choice) => {
        switch (choice) {
            case '1':
                sendMoney();
                break;
            case '2':
                payBill();
                break;
            case '3':
                requestLoan();
                break;
            case '4':
                accountSummary();
                break;
            case '5':
                checkBalance();
                break;
            case '6':
                setDailyLimit();
                break;
            case '7':
                repayLoan();
                break;
            case '8':
                viewTransactions();
                break;
            case '9':
                accountInformation();
                break;
            case '10':
                console.log('Exiting...');
                rl.close();
                break;
            default:
                console.log('Invalid option. Try again.');
                mainMenu();
        }
    });
}

// Function to check balance
function checkBalance() {
    rl.question('Enter your PIN to check balance: ', (enteredPin) => {
        if (enteredPin === user.pin) {
            console.log(`Your balance is $${user.balance}.`);
        } else {
            console.log('Incorrect PIN.');
        }
        mainMenu();
    });
}

// Start the program by registering the user
registerNumber();
