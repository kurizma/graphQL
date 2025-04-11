const API_BASE_URL = 'https://01.gritlab.ax/api/auth/signin';

export async function handleSubmit(event) {
    event.preventDefault();

    const usernameOrEmailInput = document.getElementById('usernameOrEmail');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    // Basic validation
    if (!usernameOrEmailInput.value || !passwordInput.value) {
        errorMessage.textContent = 'Please fill in both fields.';
        return;
    }

    // Encode credentials
    const credentials = `${usernameOrEmailInput.value}:${passwordInput.value}`;
    const encodedCredentials = btoa(credentials);

    // Send login request
    await sendLoginRequest(encodedCredentials, errorMessage);
}

// Send login request to the API
async function sendLoginRequest(encodedCredentials, errorMessage) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${encodedCredentials}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const token = await response.json();
        if (!token) throw new Error('No token received');

        storeToken(token); 
        errorMessage.textContent = ''; 
        return true;

    } catch (error) {
        console.error('Error logging in:', error);
        errorMessage.textContent = 'Login failed. Please check your credentials.';
        return false;
    }
}

// Store JWT token securely in localStorage
function storeToken(token) {
    localStorage.setItem('jwtToken', token);
}

// Logout

export function handleLogout() {
    localStorage.removeItem('jwtToken'); 
    switchToLoginView(); 
}

export function switchToMainView() {
    document.getElementById('loginView').style.display = 'none';
    document.getElementById('mainView').style.display = 'flex';
}

export function switchToLoginView() {
    document.getElementById('loginView').style.display = 'flex';
    document.getElementById('mainView').style.display = 'none';
}