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
        const userData = data.data.user;

        // Display user data
        displayUserData(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Function to display user data
function displayUserData(userData) {
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
}


async function fetchAndDisplayUserData() {
    const userData = await fetchUserData();
    displayUserData(userData);
}

// .............. 

// Initialize event listener
function init() {
    document.getElementById('loginForm').addEventListener('submit', handleSubmit);
}

// Call init function
init();

// // Call fetchUserData after logging in
// sendLoginRequest(encodedCredentials, errorMessage).then(() => {
//     fetchUserData().then(userData => displayUserData(userData));
// });










