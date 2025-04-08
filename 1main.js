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
        // Assuing a REST signin endpoint
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
        // console.log('Received token:', token);

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
        errorMessage.textContent = 'Login failed. Please check your credntials.';
    }
}

function storeToken(token) {
    // Using local storage to store token, but consider using secure cookes for better security
    localStorage.setItem('jwtToken', token)
}

// ....Fetching Data from graphQL endpoint.....

// Initialize event listener and check login status
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', handleSubmit);
    checkAndFetchUserData(); // Call this function to check if user is logged in
});

// Function to check if user is logged in and fetch user data
async function checkAndFetchUserData() {
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
 

        const userData = data.data.user;
        const transactionData = data.data.transaction;


        // Display user data
        displayUserData(userData, transactionData);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Function to display user data
function displayUserData(userData, transactionData) {
    if (!userData || !userData.length) return; // Check if userData is an empty array
    console.log("UserData", userData);

    const userDataDiv = document.getElementById('userData');
    const user = userData[0]; 

    userDataDiv.innerHTML = `
        <p>First Name: ${user.firstName}</p>
        <p>Last Name: ${user.lastName}</p>
        <p>Username: ${user.login}</p>
        <p>ID: ${user.id}</p>
    `;

    const sums = calculateSums(transactionData);
    const dataBoxDiv = document.getElementById('dataBox')
    
    // Round up to one decimal place
    const roundedRatio = sums.upDownRatio === null ? 'N/A' : Math.ceil(sums.upDownRatio * 10) / 10;

    dataBoxDiv.innerHTML = `
        <p>Total of All Types: ${sums.total}</p>
        <p>Total of XP: ${sums.xp}</p>
        <p>Total of Type Up XP: ${sums.up}</p>
        <p>Total of Type Down XP: ${sums.down}</p>
        <p>UP to DOWN Ratio: ${roundedRatio}</p>  
    `;

    const allDataDiv = document.getElementById('allTransactionData');
    let allDataHtml = '';

    if (transactionData) {
        allDataHtml += '<h3>All Transaction Data:</h3>';
        allDataHtml += `
            <p>Type: ${transactionData.type}</p>
            <p>Amount: ${transactionData.amount}</p>
            <p>Path: ${transactionData.path}</p>
        `;
    } else {
        allDataHtml = 'No transaction data available.';
    }

    allDataDiv.innerHTML = allDataHtml;
}

function calculateSums(transactionData) {
    const sums = {
        total: 0,
        xp: 0,
        up: 0,
        down: 0,
    };

    if (transactionData) {
        switch (transactionData.type) {
            case 'xp':
                sums.xp += transactionData.amount;
                break;
            case 'up':
                sums.up += transactionData.amount;
                break;
            case 'down':
                sums.down += transactionData.amount;
                break;
            default:
                console.log(`Unknown transaction type: ${transactionData.type}`);
        }
        sums.total += transactionData.amount;
    }

    let upDownRatio;
    if (sums.down !== 0) {
        upDownRatio = sums.up / sums.down;
    } else {
        upDownRatio = null; // Handle division by zero
    }

    // Add the ratio to the sums object
    sums.upDownRatio = upDownRatio;

    return sums;
}



async function fetchAndDisplayUserData() {
    await checkAndFetchUserData();
}

// .............. 

// Initialize event listener
function init() {
    document.getElementById('loginForm').addEventListener('submit', handleSubmit);
}

init();

// // Call fetchUserData after logging in
// sendLoginRequest(encodedCredentials, errorMessage).then(() => {
//     fetchUserData().then(userData => displayUserData(userData));
// });




//// 

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




// --- Populating ---

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

    if (transactionData) {
        allDataHtml += '<h3>All Transaction Data:</h3>';
        allDataHtml += `
            <p>Type: ${transactionData.type}</p>
            <p>Amount: ${transactionData.amount}</p>
            <p>Path: ${transactionData.path}</p>
        `;
    } else {
        // allDataHtml = 'No transaction data available.';
        allDataHtml += '<h3>All Transaction Data:</h3>';
        allDataHtml += `
            <p>Type: ${transactionData.type}</p>
            <p>Amount: ${transactionData.amount}</p>
            <p>Path: ${transactionData.path}</p>
        `;
    }

    allDataDiv.innerHTML = allDataHtml;

    // Display transaction sums
    const sums = calculateSums(transactionData);
    const dataBoxDiv = document.getElementById('dataBox');
    
    // Round up to one decimal place
    const roundedRatio = sums.upDownRatio === null ? 'N/A' : Math.ceil(sums.upDownRatio * 10) / 10;

    dataBoxDiv.innerHTML = `
        <p>Total of All Types: ${sums.total}</p>
        <p>Total of XP: ${sums.xp}</p>
        <p>Total of Type Up XP: ${sums.up}</p>
        <p>Total of Type Down XP: ${sums.down}</p>
        <p>UP to DOWN Ratio: ${roundedRatio}</p>  
    `;
}

// Function to calculate transaction sums
function calculateSums(transactionData) {
    const sums = {
        total: 0,
        xp: 0,
        up: 0,
        down: 0,
    };

    if (transactionData) {
        switch (transactionData.type) {
            case 'xp':
                sums.xp += transactionData.amount;
                break;
            case 'up':
                sums.up += transactionData.amount;
                break;
            case 'down':
                sums.down += transactionData.amount;
                break;
            default:
                console.log(`Unknown transaction type: ${transactionData.type}`);
        }
        sums.total += transactionData.amount;
    }

    let upDownRatio;
    if (sums.down !== 0) {
        upDownRatio = sums.up / sums.down;
    } else {
        upDownRatio = null; // Handle division by zero
    }

    // Add the ratio to the sums object
    sums.upDownRatio = upDownRatio;

    return sums;
}

// Function to check if user is logged in and fetch user data
async function checkAndFetchUserData() {
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

        const userData = data.data.user;
        const transactionData = data.data.transaction;

        if (Array.isArray(userData)) {
            userData = userData[0];
        }
        displayUserData(userData);

        if (Array.isArray(transactionData)) {
            displayTransactionData(transactionData); // Pass transactionData to displayTransactionData
        } else {
            displayTransactionData(transactionData); // Handle single transaction data
        }

        displayTransactionData(transactionData);

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
