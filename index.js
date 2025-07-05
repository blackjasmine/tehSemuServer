import express from 'express';
import supabase from './db.js';
import cors from 'cors';
import authRoutes from './routes/Auth.js';
const app = express();
import userRoutes from './routes/user.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Folder uploads dibuat otomatis');
}

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/user', userRoutes);

app.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('anggota')
      .select('*');

    if (error) throw error;
    res.json(data);
    console.log(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`server is running in port ${PORT}`)
})