import { app, PORT } from "./src/app";
import { connectToDatabase } from "./src/config/database.config";







const startServer = async () => {
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
