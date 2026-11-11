import express from 'express';
import pool from '../db.js';


const router =express.Router();

router.get('', async(req,res)=>{
    const {faj}= req.query.faj;
    let sql=`SELECT a.id, a.nev, a.faj, a.szuletes, g.nev AS gazda
            FROM allatok a
            JOIN gazdak g ON a.gazda_id = g.id`;
    const lekerdezes=[];
    if(faj){
        sql+=` WHERE a.faj = ?`;
        lekerdezes.push(faj);
    }
    const {eredmeny}= await pool.query(sql,lekerdezes);
    res.json(eredmeny);
})

router.get('/:id', async(req,res)=>{
    const id= req.params.id;
    if(!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ hiba: 'szam kell' });
    }
    let sql= `SELECT a.id, a.nev, a.faj, a.szuletes,
             g.id AS gazda_id, g.nev AS gazda_nev, g.telefon AS gazda_telefon, k.datum, k.leiras, k.dij, SUM(k.dij) AS osszesdij
            FROM allatok a
            INNER JOIN gazdak g ON a.gazda_id = g.id
            INNER JOIN kezelesek k ON a.id = k.allat_id
            WHERE a.id = ?
            ORDER BY k.datum`;
    const {eredmeny}= await pool.query(sql, id);
    res.json(eredmeny);
            
})




router.get('/kezeles-nelkul', async(req,res)=>{
    let sql=`SELECT a.id, a.nev, a.faj, g.nev AS gazda
      FROM allatok a
      JOIN gazdak g ON a.gazda_id = g.id
      LEFT JOIN kezelesek k ON a.id = k.allat_id
      WHERE k.id IS NULL`;
      
      const {eredmeny}= await pool.query(sql);
      res.json(eredmeny);
})


export default router