import * as readline from 'readline-sync';
import data from './data.json';
import { Budget, CardDetails, Expense, PaymentMethod, User } from './interfaces';

const users: User[] = data as User[];

const user: User = users[0];

let running: boolean = true;

do {
    let choice = readline.question('Choose an action[add] expense, [browse] expenses, [exit]: ');

    if (choice.toLowerCase() === "add") {
        
        let description = readline.question('Enter description: ');
        let amount = readline.questionFloat('Enter amount: ');
        let currency = readline.question('Enter currency (e.g., USD, EUR): ');

        let paymentMethodChoice = readline.question('Enter payment method (Credit Card/Bank Transfer): ');
        let paymentMethod: PaymentMethod;

      
        if (paymentMethodChoice.toLowerCase() === 'credit card') {
            let cardNumber = readline.question('Enter card number: ');
            let expiryDate = readline.question('Enter card expiry date (MM/YY): ');

            paymentMethod = {
                method: 'Credit Card', 
                cardDetails: { cardNumber, expiryDate }
            };
        } else if (paymentMethodChoice.toLowerCase() === 'bank transfer') {
            let bankAccountNumber = readline.question('Enter bank account number: ');

            paymentMethod = {
                 method: 'Bank Transfer', 
                bankAccountNumber
            };
        } else {
            paymentMethod =  { method: 'Cash' };
        }

        
        let isIncome = readline.question('Is this income? (yes/no): ').toLowerCase() === 'yes';
        let category = readline.question('Enter category: ');
        let tags = readline.question('Enter tags (comma separated): ').split(', ').map(tag => tag.trim());
        let isPaid = readline.question('Is this expense paid? (yes/no): ').toLowerCase() === 'yes';

        
        const newExpense: Expense = {
            id: (user.expenses.length + 1).toString(),
            description,
            amount,
            currency,
            paymentMethod,
            isIncoming: isIncome,
            category,
            tags,
            isPaid,
            date: new Date().toISOString()
        };

        
        user.expenses.push(newExpense);

        console.log('Expense added successfully!');
    }

    
    if (choice.toLowerCase() === 'browse') {
        console.log(`Expenses for ${user.name}:`);
        user.expenses.forEach(expense => {
            console.log(` ${expense.id}. -  ${expense.description} - ${expense.amount} ${expense.currency}`);
            console.log(`Date: ${expense.date}`)
            console.log(`Paid: ${expense.isPaid}`)
            console.log(`Category: ${expense.category}`)
            console.log(`Tags: ${expense.tags}`)
            console.log(`---`)
        });
    }
    else{
        running = false
    }


} while (running);
