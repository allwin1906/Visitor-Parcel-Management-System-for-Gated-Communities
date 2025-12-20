import "reflect-metadata";
import { createServer } from "http";
import app from "./app";
import { AppDataSource } from "./config/database";
import { initSocket } from "./services/socket.service";

const PORT = 4000;

const httpServer = createServer(app);

// Initialize Socket.IO
initSocket(httpServer);

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => console.log(error));
