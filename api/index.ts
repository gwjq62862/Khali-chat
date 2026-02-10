import { app, PORT } from "./src/app";
import { connectToDatabase } from "./src/config/database.config";
import { createServer } from "http";
import { initializeSocket } from "./src/utils/socket";

const httpServer=createServer(app)




const startServer = async () => {
    await connectToDatabase();
    initializeSocket(httpServer)
   httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
