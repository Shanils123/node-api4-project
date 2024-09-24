require('dotenv').config();
const express = require('express');
const cors = require('cors');

const server = express();
const PORT = process.env.PORT || 9000;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

let users = []; 


server.get('/', (req, res) => {
    res.send(`
        <div style="background-color: #cdb9ec; height: 100vh; display: flex; justify-content: center; align-items: center; font-family: Arial, sans-serif;">
            <div style="background-color: #e2d7ef; padding: 40px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: 300px; text-align: center;">
                <h1 style="font-size: 24px; margin-bottom: 20px; color: #9f8dbc;">Login</h1>
                <form action="/login" method="POST">
                    <div style="margin-bottom: 15px;">
                        <label for="username" style="display: block; text-align: left; font-weight: bold; color: #9f8dbc;">Username</label>
                        <input type="text" id="username" name="username" required style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label for="password" style="display: block; text-align: left; font-weight: bold; color: #9f8dbc;">Password</label>
                        <input type="password" id="password" name="password" required style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;">
                    </div>
                    <button type="submit" style="width: 100%; padding: 12px; background-color: #c6adb5; color: white; border: none; border-radius: 5px; font-size: 18px; cursor: pointer;">
                        Submit
                    </button>
                </form>
                <p style="margin-top: 20px;">Don't have an account? <a href="/register" style="color: #9f8dbc;">Create one</a></p>
            </div>
        </div>
    `);
});


server.get('/register', (req, res) => {
    res.send(`
        <div style="background-color: #cdb9ec; height: 100vh; display: flex; justify-content: center; align-items: center; font-family: Arial, sans-serif;">
            <div style="background-color: #e2d7ef; padding: 40px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: 300px; text-align: center;">
                <h1 style="font-size: 24px; margin-bottom: 20px; color: #9f8dbc;">Create an Account</h1>
                <form action="/create-user" method="POST">
                    <div style="margin-bottom: 15px;">
                        <label for="username" style="display: block; text-align: left; font-weight: bold; color: #9f8dbc;">Username</label>
                        <input type="text" id="username" name="username" required style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label for="password" style="display: block; text-align: left; font-weight: bold; color: #9f8dbc;">Password</label>
                        <input type="password" id="password" name="password" required style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;">
                    </div>
                    <button type="submit" style="width: 100%; padding: 12px; background-color: #c6adb5; color: white; border: none; border-radius: 5px; font-size: 18px; cursor: pointer;">
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    `);
});

server.post('/create-user', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Username and password are required!");
    }


    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).send("Username already taken!");
    }

    users.push({ username, password });

    res.send(`
        <div style="background-color: #f0f0f0; height: 100vh; display: flex; justify-content: center; align-items: center; font-family: Arial, sans-serif;">
            <div style="background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: 300px; text-align: center;">
                <h1>Account Created!</h1>
                <p>Welcome, ${username}!</p>
                <a href="/">Go to login</a>
            </div>
        </div>
    `);
});


server.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.send(`
            <div style="background-color: #f0f0f0; height: 100vh; display: flex; justify-content: center; align-items: center; font-family: Arial, sans-serif;">
                <div style="background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: 300px; text-align: center;">
                    <h1>Welcome, ${username}!</h1>
                    <p>Login successful! You are now redirected to the dashboard...</p>
                    <script>
                        setTimeout(function() {
                            window.location.href = "/dashboard?username=${username}";
                        }, 3000);
                    </script>
                </div>
            </div>
        `);
    } else {
        res.status(401).send(`
            <div style="background-color: #f0f0f0; height: 100vh; display: flex; justify-content: center; align-items: center; font-family: Arial, sans-serif;">
                <div style="background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: 300px; text-align: center;">
                    <h1>Invalid credentials!</h1>
                    <a href="/">Try again</a>
                </div>
            </div>
        `);
    }
});


server.get('/api/users', (req, res) => {
    const usersList = users.map(user => ({ username: user.username }));
    res.status(200).json(usersList);
});


server.get('/dashboard', (req, res) => {
    res.send(`
        <div style="background-color: #f0f0f0; height: 100vh; display: flex; justify-content: center; align-items: center; font-family: Arial, sans-serif;">
            <div style="background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: 300px; text-align: center;">
                <h1>Dashboard</h1>
                <p>Welcome to your dashboard, ${req.query.username || 'User'}!</p>
            </div>
        </div>
    `);
});


server.use((err, req, res, next) => { // eslint-disable-line
    res.status(500).json({
        message: err.message,
        stack: err.stack,
    });
});


server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
