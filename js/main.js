import { handleSubmit, handleLogout, switchToLoginView, switchToMainView } from './auth.js';
import { fetchAllData } from './fetchData.js';



function updateNavbar(user) {
    const usernameSpan = document.getElementById('username');
    usernameSpan.textContent = user.login;
}

// Display user data on the dashboard
function displayUserData(userData) {
    if (!userData) return;

    const userDataDiv = document.getElementById('userData');
    userDataDiv.innerHTML = `
        <p>Name: ${userData.firstName} ${userData.lastName}</p>
        <p>LoginID: ${userData.login}</p>
        <p>ID: ${userData.id}</p>
    `;
}

function displayAuditInfo(user) {
    const auditDiv = document.getElementById('auditData');

    const roundedAuditRatio = parseFloat(user.auditRatio).toFixed(1);  

    auditDiv.innerHTML = `
        <p>Audit Ratio: ${roundedAuditRatio}</p>
        <p>Audit Done XP: ${user.totalUp}</p>
        <p>Audit Received XP: ${user.totalDown}</p>
    `;
}


function displayTotalXP(xpSum) {
    const xpDiv = document.getElementById('totalXpData');
    xpDiv.innerHTML = `<h3>Total XP: ${xpSum}</h3>`;
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


function sanitizePath(path) {
    return path.replace(/.*\/projects\//, 'Project: ');
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
        // Fetch all data using the new modular function
        const { user, xpSum, xpTransaction } = await fetchAllData();

        updateNavbar(user);

        // Display user information
        displayUserData(user);

        // Display audit ratio, total upvotes, and total downvotes
        displayAuditInfo(user);

        // Display total XP sum
        displayTotalXP(xpSum);

        // Display detailed transaction data
        displayTransactionData(xpTransaction);

        // Display transaction sums
        displayTransactionSums(xpTransaction);

        // Filter and display detailed transaction data
        const sanitizedTransactions = xpTransaction.map(transaction => ({
            ...transaction,
            path: sanitizePath(transaction.path), // Sanitize paths here
        }));
        displayTransactionData(sanitizedTransactions);

    } catch (error) {
        console.error('Error fetching or displaying data:', error);
        switchToLoginView(); // Redirect to login view on error
    }
}


// Start

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');
    
    if (token) {
        switchToMainView();
        fetchAndDisplayUserData(); 
    } else {
        switchToLoginView(); 
    }


    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        await handleSubmit(e);
        if (localStorage.getItem('jwtToken')) {
            switchToMainView();
            await fetchAndDisplayUserData(); // Load data after successful login
        }
    });

    document.getElementById('logout-button').addEventListener('click', () => {
        handleLogout();
    });
});







// Calculate transaction sums by type
function calculateTransactionSums(transactionData) {
    return transactionData.reduce((sums, transaction) => {
        sums[transaction.type] = (sums[transaction.type] || 0) + transaction.amount;
        return sums;
    }, {});
}

