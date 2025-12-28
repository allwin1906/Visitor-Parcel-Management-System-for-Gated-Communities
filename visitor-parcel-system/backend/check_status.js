const API_URL = 'http://localhost:4000';

async function check() {
    try {
        const loginReq = await fetch(API_URL + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'security@example.com', password: 'password' })
        });
        const login = await loginReq.json();
        const token = login.token;

        const itemsReq = await fetch(API_URL + '/items', {
            headers: { Authorization: 'Bearer ' + token }
        });
        const items = await itemsReq.json();

        const visitor = items.find(i => i.name === 'Subagent Visitor');
        console.log('Visitor Status:', visitor ? visitor.status : 'Not Found');

    } catch (e) {
        console.error(e);
    }
}

check();
