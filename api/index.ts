import { app, PORT } from "./src/app";
import { connectToDatabase } from "./src/config/database.config";

app.listen(PORT,async ()=>{
    await connectToDatabase()
    console.log(`Server is running on port ${PORT}`)
})