import { handleSubmit } from './auth.js';

// Display user data on the dashboard
function displayUserData(userData) {
    if (!userData) return;

    const userDataDiv = document.getElementById('userData');
    userDataDiv.innerHTML = `
        <p>First Name: ${userData.firstName}</p>
        <p>Last Name: ${userData.lastName}</p>
        <p>Username: ${userData.login}</p>
        <p>ID: ${userData.id}</p>
    `;
}

// Display transaction data on the dashboard
function displayTransactionData(transactionData) {
    const allDataDiv = document.getElementById('allTransactionData');
    let allDataHtml = '<h3>All Transaction Data:</h3>';

    transactionData.forEach(transaction => {
        if (!transaction.path.includes('/piscine-go/')) {
            allDataHtml += `
                <p>Type: ${transaction.type}</p>
                <p>Amount: ${transaction.amount}</p>
                <p>Path: ${transaction.path}</p><br>
            `;
        }
    });

    allDataDiv.innerHTML = allDataHtml;
}

// Calculate transaction sums by type
function calculateTransactionSums(transactionData) {
    return transactionData.reduce((sums, transaction) => {
        sums[transaction.type] = (sums[transaction.type] || 0) + transaction.amount;
        return sums;
    }, {});
}

// Display transaction sums on the dashboard
function displayTransactionSums(transactionData) {
    const sums = calculateTransactionSums(transactionData);
    const dataBoxDiv = document.getElementById('dataBox');
    
    let html = '';
    for (const type in sums) {
        html += `<p>Total of ${type}: ${sums[type]}</p>`;
    }

    dataBoxDiv.innerHTML = html;
}

// Fetch user and transaction data from the API
async function fetchAndDisplayUserData() {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) throw new Error('No token available');

        const response = await fetch('https://01.gritlab.ax/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                query: `
                    query {
                        user {
                            firstName
                            lastName
                            login
                            id
                        }
                        transaction(order_by: { createdAt: desc }) {
                            type
                            amount
                            path
                        }
                    }
                `,
            }),
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const { data } = await response.json();
        
        displayUserData(data.user[0]); // Display user info (first user)
        
        const filteredTransactions = data.transaction.filter(t => !t.path.includes('/piscine-go/'));
        
        displayTransactionData(filteredTransactions); // Display transactions
        displayTransactionSums(filteredTransactions); // Display transaction totals

    } catch (error) {
        console.error('Error fetching user data:', error);
        switchToLoginView(); // Redirect to login if there's an issue with the token
    }
}

// Switch between views (login and main)
function switchToMainView() {
    document.getElementById('loginView').style.display = 'none';
    document.getElementById('mainView').style.display = 'block';
}

function switchToLoginView() {
    document.getElementById('loginView').style.display = 'block';
    document.getElementById('mainView').style.display = 'none';
}

// Check login status on page load and initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');
    
    if (token) {
        switchToMainView();
        fetchAndDisplayUserData(); // Load data if token exists
    } else {
        switchToLoginView(); // Ensure login view is shown if no token
    }

    // Attach form submission handler
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        await handleSubmit(e);
        if (localStorage.getItem('jwtToken')) {
            switchToMainView();
            await fetchAndDisplayUserData(); // Load data after successful login
        }
    });
});



