// Login + Credentials
// Using REST API - fetch from signin endpoint

function handleSubmit(event) {
    event.preventDefault();

    const usernameOrEmailInput = document.getElementById('usernameOrEmail');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    // Basic Validation
    if (!usernameOrEmailInput.value || !passwordInput.value) {
        errorMessage.textContent = 'Please fill in both fields.';
        return;
    }

    // Create a base64 encoded credentials
    const credentials = `${usernameOrEmailInput.value}:${passwordInput.value}`;
    const encodedCredentials = btoa(credentials);

    sendLoginRequest(encodedCredentials, errorMessage);
}

async function sendLoginRequest(encodedCredentials, errorMessage) {
    try {
        // Assuming a REST signin endpoint
        const response = await fetch('https://01.gritlab.ax/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${encodedCredentials}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const token = await response.json();
        if (!token) {
            throw new Error('No token received');
        }

        // Store JWT Token
        storeToken(token);

        errorMessage.textContent = '';

        console.log('Logged in successfully:', token);

        fetchAndDisplayUserData();

    } catch (error) {
        console.error('Error logging in:', error);
        errorMessage.textContent = 'Login failed. Please check your credentials.';
    }
}

function storeToken(token) {
    // Using local storage to store token, but consider using secure cookies for better security
    localStorage.setItem('jwtToken', token)
}

// Function to display user data
function displayUserData(userData) {
    if (!userData) return; // Check if userData is empty

    const userDataDiv = document.getElementById('userData');
    userDataDiv.innerHTML = `
        <p>First Name: ${userData.firstName}</p>
        <p>Last Name: ${userData.lastName}</p>
        <p>Username: ${userData.login}</p>
        <p>ID: ${userData.id}</p>
    `;
}

// Function to display transaction data
function displayTransactionData(transactionData) {
    const allDataDiv = document.getElementById('allTransactionData');
    let allDataHtml = '';

    if (Array.isArray(transactionData)) {
        allDataHtml += '<h3>All Transaction Data:</h3>';
        transactionData.forEach((transaction) => {
            if (!transaction.path.includes('/piscine-go/')) {
                allDataHtml += `
                    <p>Type: ${transaction.type}</p>
                    <p>Amount: ${transaction.amount}</p>
                    <p>Path: ${transaction.path}</p>
                `;
            }
        });
    } else {
        allDataHtml += '<h3>All Transaction Data:</h3>';
        allDataHtml += `
            <p>Type: ${transactionData.type}</p>
            <p>Amount: ${transactionData.amount}</p>
            <p>Path: ${transactionData.path}</p>
        `;
    }

    allDataDiv.innerHTML = allDataHtml;
}

// Function to calculate transaction sums
function calculateTransactionSums(transactionData) {
    const sums = {};

    if (Array.isArray(transactionData)) {
        transactionData.forEach((transaction) => {
            const transactionType = transaction.type;
            const amount = transaction.amount;
            if (transactionType in sums) {
                sums[transactionType] += amount;
            } else {
                sums[transactionType] = amount;
            }
        });
    } else {
        const transactionType = transactionData.type;
        const amount = transactionData.amount;
        if (transactionType in sums) {
            sums[transactionType] += amount;
        } else {
            sums[transactionType] = amount;
        }
    }

    return sums;
}

// Function to display transaction sums
function displayTransactionSums(transactionData) {
    const sums = calculateTransactionSums(transactionData);
    const dataBoxDiv = document.getElementById('dataBox');
    let html = '';
    for (const type in sums) {
        html += `<p>Total of ${type}: ${sums[type]}</p>`;
    }

    dataBoxDiv.innerHTML = html;
}

// Function to check if user is logged in and fetch user data
async function checkAndFetchUserData() {
    let userData = {};
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            return; // No token, user is not logged in
        }

        // Fetch user data using the stored token
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
                        transaction {
                            type
                            amount
                            path
                        }
                    }
                `,
            }),
        });

        if (!response.ok) {
            // Token might be invalid, remove it and prompt user to log in
            localStorage.removeItem('jwtToken');
            return;
        }

        const data = await response.json();
        console.log(data)

        userData = data.data.user;
        const transactionData = data.data.transaction;

        if (Array.isArray(userData)) {
            userData = userData[0]; // Access the first element if it's an array
        }

        displayUserData(userData);

        if (Array.isArray(transactionData)) {
            displayTransactionData(transactionData); // Display raw transaction data
            displayTransactionSums(transactionData); // Display transaction sums
        } else {
            displayTransactionData(transactionData); // Handle single transaction data
            displayTransactionSums(transactionData); // Display sums for single transaction
        }

    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Function to fetch and display user data after logging in
async function fetchAndDisplayUserData() {
    await checkAndFetchUserData();
}

// Initialize event listener and check login status
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', handleSubmit);
    checkAndFetchUserData(); // Call this function to check if user is logged in
});

// Initialize event listener
function init() {
    document.getElementById('loginForm').addEventListener('submit', handleSubmit);
}

init();
