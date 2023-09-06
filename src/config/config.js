import dotenv from "dotenv"

dotenv.config()
const CONFIG={
    MONGO_URI: process.env.MONGO_URL  ||"",
    PORT: process.env.PORT || "3000"
}
export default CONFIG