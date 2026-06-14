import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("MongoDB conectado com sucesso.");
  }catch (error) {
    console.error("Erro ao conectar com MongoDB", error.message);
    process.exit(1);
  }
};