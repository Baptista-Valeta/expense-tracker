import mongoose from 'mongoose';

// Url do banco com o respectivo nome
const uri = "mongodb://127.0.0.1:27017/expenseTracker";

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB conectado com sucesso.");
  }catch (error) {
    console.error("Erro ao conectar com MongoDB", error.message);
    process.exit(1);
  }
};