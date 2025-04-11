export async function fetchAllData() {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) throw new Error('No token available');

        const userData = await executeQuery(USER_QUERY, token);
        console.log(userData);
        const xpSumData = await executeQuery(XP_SUM_QUERY, token);
        console.log(xpSumData);
        const xpTransactionData = await executeQuery(XP_TRANSACTIONS_QUERY, token);
        console.log(xpTransactionData);
        const typeTransactionData = await executeQuery(TYPE_TRANSACTION_QUERY, token);
        console.log(typeTransactionData);

        return {
            user: userData.user[0],
            xpSum: xpSumData.transaction_aggregate.aggregate.sum.amount,
            xpTransaction: xpTransactionData.transaction,
            typeTransaction: typeTransactionData.transaction
        };
    } catch (error) {
        console.error('Error fetching data:', error)
        throw error;
    }
}

async function executeQuery(query, token) {
    const response = await fetch('https://01.gritlab.ax/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
    });

    if (!response.ok) throw new Error('Failed to fetch data');

    const { data } = await response.json();
    return data;
}



const USER_QUERY = `
    query {
        user {
            id
            firstName
            lastName
            login
            campus
            auditRatio
            totalUp
            totalDown
            xps {
                amount
                path
            }
            attrs
        }
    }`;

const XP_SUM_QUERY = `
    query {
        transaction_aggregate(
        where: {_and: [{type: {_eq: "xp"}}, {eventId: {_eq: 104}}]}
        ) {
        aggregate {
            sum {
            amount
            }
        }
    }
}`;

const XP_TRANSACTIONS_QUERY = `
    query {
        transaction(
        order_by: [{ createdAt: desc }]
        where: { type: { _like: "xp" }, eventId: {_eq: 104}}
    ) {
        path
        type
        createdAt
        amount
    }
}`;

const TYPE_TRANSACTION_QUERY = `
    query { 
        transaction(where: {eventId: {_eq: 104}}) {
        type
        }
    }
`




// export const AUDIT_QUERY = `
//     query {
//         audit(where: {_and: [{auditorId: {_eq: `, `}}, {auditedAt: {_is_null: false}}]}) {
//         id
//     }
// }`;
