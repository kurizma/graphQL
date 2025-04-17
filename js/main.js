import { handleSubmit, handleLogout, switchToLoginView, switchToMainView } from './auth.js';
import { renderData } from './displayData.js';


document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwtToken');
    
    if (token) {
        switchToMainView();
        renderData();
    } else {
        switchToLoginView(); 
    }


    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        // Prevent dbl submission 
        loginForm.addEventListener('submit', async (e) => {

            const submitBtn = loginForm.querySelector('input[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            const errorMessage = document.getElementById('error-message');
            if (errorMessage) errorMessage.textContent = '';

            await handleSubmit(e);
            console.log("Login Successful")

            if (submitBtn) submitBtn.disabled = false;

            if (localStorage.getItem('jwtToken')) {
                switchToMainView();
                renderData();
            }
        });
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            handleLogout();
            console.log("Logout Successful")
        });
    }
});