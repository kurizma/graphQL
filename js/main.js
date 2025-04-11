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
    const xpDiv = document.getElementById('dataInfo');
    xpDiv.innerHTML = `
    <h1>Experience Points</h1>
    <br>
    <p>Total: ${xpSum}</p>
    <br>
    <br>
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

function displayTransactionType(transactionData) {
    const typeCounts = transactionData.reduce((acc, { type }) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const container = document.getElementById('typeFrequency');
    let html = '<h3>Transaction Type Frequency:</h3>';
    
    for (const [type, count] of Object.entries(typeCounts)) {
        html += `<p>${type}: ${count} transactions</p>`;
    }
    
    container.innerHTML += html; 
}



// Fetch user and transaction data from the API
async function fetchAndDisplayUserData() {
    try {
        // Fetch all data using the new modular function
        const { user, xpSum, xpTransaction, typeTransaction } = await fetchAllData();

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
        // displayTransactionSums(xpTransaction);

        // Filter and display detailed transaction data
        const sanitizedTransactions = xpTransaction.map(transaction => ({
            ...transaction,
            path: sanitizePath(transaction.path), // Sanitize paths here
        }));
        displayTransactionData(sanitizedTransactions);


        const upCount = typeTransaction.filter(t => t.type === 'up').length;
        const downCount = typeTransaction.filter(t => t.type === 'down').length;

        createPieChart(upCount, downCount);

        displayTransactionType(typeTransaction);

        fetchAndDisplayGraph();

    } catch (error) {
        console.error('Error fetching or displaying data:', error);
        switchToLoginView(); // Redirect to login view on error
    }
}

// pieChart
function createPieChart(upCount, downCount) {
    const total = upCount + downCount;
    if (total === 0) {
        document.getElementById('graphPie').innerHTML = "<p>No audit data available</p>";
        return;
    }

    const radius = 40;
    const centerX = 50;
    const centerY = 50;

    // Calculate angles
    const upAngle = (upCount / total) * 360;

    // Generate path data
    const upPath = describeArc(centerX, centerY, radius, -90, -90 + upAngle);
    const downPath = describeArc(centerX, centerY, radius, -90 + upAngle, -90 + 360);


    // Build SVG
    const graphPieDiv = document.getElementById('graphPie');

    graphPieDiv.innerHTML = `
        <svg viewBox="0 0 100 100" width="300" height="300">

            <!-- Crust Outline -->
            <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="transparent" stroke="#00FF9B
            " stroke-width="2" />

            <!-- Up Slice (Cheese) -->
            <path d="${upPath}" fill="#D4EAB2" />

            <!-- Down Slice (Pepperoni) -->
            <path d="${downPath}" fill="#B79AE3" />

            <!-- Center Labels -->
            <text x="50" y="45" text-anchor="middle" font-size="6" fill="#4B3B53">
                Up: ${upCount} (${Math.round((upCount/total)*100)}%)
            </text>
            <text x="50" y="55" text-anchor="middle" font-size="6" fill="#4B3B53">
                Down: ${downCount} (${Math.round((downCount/total)*100)}%)
            </text>
        </svg>
    `;
}

// Helper function to create arc paths
function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M", x, y,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "L", x, y, "Z"
    ].join(" ");
}

// Helper function for coordinate conversion
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}



function generateSVGPath(points) {
    let path = `M ${points[0][0]} ${points[0][1]}`; // Start at first point
    for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i][0]} ${points[i][1]}`; // Draw lines to subsequent points
    }
    return path;
}

function createLineGraph(data) {
    const svgWidth = 300;
    const svgHeight = 150;

    // Generate path data for the line graph
    const pathData = generateSVGPath(data.map(d => [d.x, d.y]));

    return `
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
            <!-- Line -->
            <path d="${pathData}" stroke="#007BFF" fill="none" stroke-width="2" />
            <!-- Points -->
            ${data.map(d => `<circle cx="${d.x}" cy="${d.y}" r="3" fill="#FF5733" />`).join('')}
            <!-- X-axis -->
            <line x1="0" y1="${svgHeight}" x2="${svgWidth}" y2="${svgHeight}" stroke="#000" stroke-width="1" />
            <!-- Y-axis -->
            <line x1="0" y1="0" x2="0" y2="${svgHeight}" stroke="#000" stroke-width="1" />
        </svg>
    `;
}


async function fetchAndDisplayGraph() {
    const { xpTransaction } = await fetchAllData();

    // Sort transactions by createdAt date
    const sortedTransactions = xpTransaction.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Normalize dates and amounts
    const minDate = new Date(sortedTransactions[0].createdAt).getTime();
    const maxDate = new Date(sortedTransactions[sortedTransactions.length - 1].createdAt).getTime();
    const minAmount = Math.min(...sortedTransactions.map(t => t.amount));
    const maxAmount = Math.max(...sortedTransactions.map(t => t.amount));

    const normalizedData = sortedTransactions.map(transaction => ({
        x: ((new Date(transaction.createdAt).getTime() - minDate) / (maxDate - minDate)) * 100, // X-axis normalized time
        y: ((transaction.amount - minAmount) / (maxAmount - minAmount)) * 100, // Y-axis normalized XP amount
    }));

    // Generate and display graph
    const graphHTML = createLineGraph(normalizedData);
    document.getElementById('graphExp').innerHTML = graphHTML;
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

