import { MongoClient, ServerApiVersion } from "mongodb";

class MongoManager {
    constructor() {
        const mongoUri = "mongodb+srv://nexachallenge:KIhKC3F6xpxuMExa@cluster0.t4rv0q4.mongodb.net/?retryWrites=true&w=majority";

        this.client = new MongoClient(mongoUri, {serverApi: ServerApiVersion.v1, maxPoolSize: 20 });
    }

    async init() {
        try {
            await this.client.connect();

            this.db = this.client.db("nexachallenge");
        } catch (err) {
            console.error(err);
        }
    }
}

export default new MongoManager();