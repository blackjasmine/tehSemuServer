import express from 'express';
const router = express.Router();
import supabase from '../db.js';
import verifyToken from '../middleware/verifyToken.js';
import upload from '../middleware/upload.js';

router.get('/profile', verifyToken, async (req, res) => {
    const userId = req.user.id;

    // const q = 'SELECT id, nama, profile_picture AS profilePicture FROM anggota WHERE id = ?';
    // db.query(q, [userId], (err, result) => {
    //     if (err) return res.status(500).json(err);
    //     res.json(result[0]);
    // });
    const { data, error } = await supabase
        .from('anggota')
        .select('id, nama, profilepicture')
        .eq('id', userId);
    if (error) return res.status(500).json(err);
    res.json(data[0]);
});

router.post('/upload-profile', verifyToken, upload.single('profile'), async (req, res) => {
    const userId = req.user.id;
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log('File diterima:', req.file);
    console.log('User ID:', req.user.id);

    // const q = 'UPDATE anggota SET profile_picture = ? WHERE id = ?';
    // db.query(q, [fileUrl, userId], (err) => {
    //     if (err) return res.status(500).json(err);
    const { data, error } = await supabase
        .from('anggota')
        .update({profilepicture: fileUrl})
        .eq('id', userId);
    if (error) return res.status(500).json(error);
        
    //     const q2 = 'SELECT id, nama, profile_picture AS profilePicture FROM anggota WHERE id = ?';
    //     db.query(q2, [userId], (err, result) => {
    //         if (err) return res.status(500).json(err);
    //         res.json(result[0]);
    //     });
    // });
    const { data: dat, error: err } = await supabase
        .from('anggota')
        .select('id, nama, profilepicture')
        .eq('id', userId);
    if (err) return res.status(500).json(err);
    res.json(dat[0]);
});;

export default router;