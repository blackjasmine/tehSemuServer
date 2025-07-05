import supabase from '../db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const register = async (req, res) => {
  const {nama, email, password} = req.body;
  // const checkEmail = 'SELECT * FROM anggota WHERE email = ?';
  // db.query(checkEmail, [email], (err, result) => {
  //   if (err) return res.status(500).json({error: 'Database error'});
  //   if (result.length > 0) return res.status(400).json({error: 'Email sudah terdaftar'});
  const { data, error } = await supabase
    .from('anggota')
    .select('*')
    .eq('email', email);
  if (error) return res.status(500).json({error: 'Database error'});
  if (data.length > 0) return res.status(400).json({error: 'Email sudah terdaftar'});

  //   const q = 'INSERT INTO anggota (nama, email, password) VALUES (?, ?, ?)';
  //   db.query(q, [nama, email, password], (err, results) => {
  //     if (err) return res.status(500).json({error: 'Gagal daftar'});
  //     return res.status(201).json({message: 'Berhasil daftar'});
  //   });
  // });
  const { data: dat, error: err } = await supabase
    .from('anggota')
    .insert([{ nama, email, password }]);
  if (err) return res.status(500).json({error: 'Gagal daftar'});
  res.status(201).json({message: 'Berhasil daftar', dat});
};

export const login = async (req, res) => {
  const {email, password} = req.body;
  // const q = 'SELECT * FROM anggota WHERE email = ?';
  // db.query(q, [email], (err, data) => {
  //   if (err) return res.status(500).json({error: 'Database error'});
  //   if (data.length === 0) return res.status(404).json({error: 'User tidak ditemukan'});
  const { data, error } = await supabase
    .from('anggota')
    .select('*')
    .eq('email', email);
  if (error) return res.status(500).json({error: 'Database error'});
  if (data.length === 0) return res.status(404).json({error: 'User tidak ditemukan'});

  const user = data[0];
  if (!user.password) return res.status(401).json({error: 'Password salah'});
  const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: "1d"});
  const {password: _, ...userData} = user;
  res.json({message: 'Berhasil login!', token, user: userData});
  // });
};