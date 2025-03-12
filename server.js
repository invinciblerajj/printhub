import express from 'express';
import multer from 'multer';
import path from 'path';
import pg from 'pg';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';



const app = express();
app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        const filename = `${req.body.phone}_${Math.round(Math.random() * 1E4)}_${req.body.date}${path.extname(file.originalname)}`;
        cb(null, filename);
    },
});

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'printhub',
    password: 'Raj',
    port: 5432,
});
db.connect();

const upload = multer({ storage });

let phone,block,file_name,date,color,amount;


async function countPages(filePath) {
    try {
      const pdfBuffer = fs.readFileSync(filePath);
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      return pdfDoc.getPageCount();
    } catch (err) {
      console.error('Error:', err.message);
    }
}

app.post('/upload', upload.array('files'), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded');
    }else{
        file_name=req.files[0].filename;
        phone=req.body.phone;
        block=req.body.block;
        date=req.body.date;
        color=req.body.colour;
        const pages= await countPages(`./uploads/${file_name}`);
        amount= pages*3;
        res.status(200).json({amount});
    }
});

app.post('/confirm', async (req, res) => {
    try {
        if(phone === undefined || block === undefined || file_name === undefined || date === undefined || color ===undefined){
            res.send('Null Values')
        }else{
            await db.query(
                'INSERT INTO oder_cnfm (contact, filename, block, delivery_dt, amount,confirmation,color) VALUES ($1, $2, $3,$4, $5, $6,$7)',
                [phone, file_name, block, date, amount+5, 'Yes',color]
            );
            return res.status(200).send('Order Confirmed');
        }
    } catch (err) {
        console.error(err);    
    }
});

app.get('/admin', async (req, res) => {
    try{
        const data=await db.query('SELECT * FROM oder_cnfm');
        res.status(200).json(data.rows);
        console.log(data.rows);
    }catch(err){
        console.error(err);
    }
})

app.listen(4000, () => {
    console.log('Server running on http://localhost:4000/');
});
