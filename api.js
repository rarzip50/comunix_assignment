const express = require('express');
const { Server } = require("socket.io");
const http = require('http');
const dotenv = require('dotenv');
const { json } = require('express');
const db = require('./db/dbHandling')
const utils = require('./db/utils')

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}
const PORT = parseInt(process.env.PORT, 10);

const app = express();
app.use(json())
const server = http.createServer(app);
const io = new Server(server);

//api routes

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await db.fetch("users", { Uemail: email, Upassword: password })
        if (user.length === 1) {
            res.send(200)
            //send cookie
        } else if (user.length === 0) {
            throw new Error('No users found')
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
});

app.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body
        await db.add("users", { Uemail: email, Upassword: password })
        res.send(200)
    } catch (e) {
        res.status(500).send(e.message)
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit('authentication process')
    //check if registred
    //if yes - let him connect
    //else - need to signup
});

io.on('connection', (socket) => {
    socket.on('spin', async (msg) => {
        //send to random user
        const allUsers = await db.fetch('users')
        const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
        console.log(randomUser.UsocketId)
        io.to(randomUser.UsocketId).emit('chat message', msg)
        // io.emit('chat message', msg + " spin");
    });
    socket.on('wild', (msg) => {
        //send to X random users
        io.emit('chat message', msg + " wild");
    });
    socket.on('blast', (msg) => {
        //send to all users - broadcast
        socket.broadcast.emit("chat message", msg + " blast")
    });
});

//save the socketid to db for further usage - once logged in
io.on('connection', (socket) => {
    socket.on('setSocketId', async (data) => {
        await db.update('users', { UsocketId: data.socketId }, { Uemail: data.email })
        console.log({ data })
    })
})

//set socket id to 0 once disconnected
io.on('connection', (socket) => {
    socket.on('disconnect', async function () {
        await db.update('users', { UsocketId: '0' }, { UsocketId: socket.id })
    })
})

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});