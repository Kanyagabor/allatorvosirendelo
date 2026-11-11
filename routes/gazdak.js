import express from 'express';
import pool from '../db.js';


const router =express.Router();

router.get('', async(req,res)=>{
    let {varos}= req.query.varos;
    let sql=`SELECT g.id, g.nev, g.varos, COUNT(a.id) AS allatDb
            FROM gazdak g
            INNER JOIN allatok a ON g.id = a.gazda_id
            GROUP BY g.id
            ORDER BY g.nev ASC;`;

    const lekerdezes=[];
    if(varos){
        sql+=` WHERE g.varos= ?`;
        lekerdezes.push(varos);
    }
    sql+= ` GROUP BY g.id ORDER BY g.nev ASC`;
    const {eredmeny}= await pool.query(sql,lekerdezes);
    res.json(eredmeny);
})


router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ hiba: 'szam kell' });
    }
    let sql=`SELECT *,a.id,a.nev,a.faj,a.szuletes FROM gazdak 
    INNER JOIN allatok AS a ON gazdak.id= a.gazda_id
    WHERE gazdak.id = ?'`;
    const {eredmeny}= await pool.query(sql,id);
    res.json(eredmeny);
})

export default router