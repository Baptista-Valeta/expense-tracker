import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb://127.0.0.1:27017"; 

const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

export const connectDB = async () => {
  try {
    await client.connect();
    console.log("MongoDB conectado com sucesso!");
  }catch (error) {
    console.error('Erro ao conectar com MongoDB');
    process.exit;
  }
}
run().catch(console.dir);

export default client;