import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

dotenv.config();

const port = Number(process.env.PORT ?? 3000);

async function start() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Sunucu http://localhost:${port} üzerinde çalışıyor`);
      console.log(`Swagger dokümantasyonu: http://localhost:${port}/api-docs`);
    });
  } catch (err) {
    console.error('Başlatma hatası:', err);
    process.exit(1);
  }
}

start();