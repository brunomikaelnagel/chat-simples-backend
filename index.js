import http from "http"
import { Server } from "socket.io"

const server = new http.createServer()
const io = new Server(server, { cors: { origin: "*" } })

const PORT = process.env.PORT || 3001;

io.on("connection", (socket) => {
    socket.on("new_user", (username) => {
        socket.data.username = username
        io.emit("receive_message", { type: "join_chat", authorId: socket.id, authorName: socket.data.username, message: "" })
    })

    socket.on("message", (message) => {
        const username = socket.data.username
        io.emit("receive_message", { type: "message", authorId: socket.id, authorName: username, message })
    })

    socket.on('disconnect', (reason) => {
        io.emit("receive_message", { type: "left_chat", authorId: socket.id, authorName: socket.data.username, message: "" })
    });
})

server.listen(PORT)
