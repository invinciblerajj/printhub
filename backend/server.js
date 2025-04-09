import express from 'express';
import multer from 'multer';
import path from 'path';
import pg from 'pg';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';



const app = express();
app.use(cors());
dotenv.config();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        const filename = `${req.body.phone}_${Math.round(Math.random() * 1E4)}_${req.body.date}${path.extname(file.originalname)}`;
        cb(null, filename);
    },
});

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.COMPANY_MAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

const db = new pg.Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT, 
});
db.connect();

const upload = multer({ storage });

let phone,block,file_name,date,color,amount,mail;


async function countPages(filePath) {
    try {
      const pdfBuffer = fs.readFileSync(filePath);
      const pdfDoc = await PDFDocument.load(pdfBuffer,{ignoreEncryption: true});
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
        mail=req.body.mail;
        const pages= await countPages(`./uploads/${file_name}`);
        amount= pages*3;
        res.status(200).json({amount});
    }
});

app.post('/confirm', async (req, res) => {
    const { phone, block, file_name, date, color, amount, mail } = req.body;

    try {
        if (!phone || !block || !file_name || !date || !color || !mail || !amount) {
            return res.status(400).send('Null Values');
        }

        await db.query(
            'INSERT INTO oder_cnfm (contact, filename, block, delivery_dt, amount, confirmation, color) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [phone, file_name, block, date, parseInt(amount) + 5, 'Yes', color]
        );

        transporter.sendMail({
            from: process.env.COMPANY_MAIL,
            to: mail,
            subject: 'Order Confirmation',
            text: `🎉 Your order has been confirmed! 🎉
Details:
📄 File Name: ${file_name}
📞 Contact: ${phone}
🏢 Block: ${block}
📅 Delivery Date: ${date}
💰 Amount: ₹${parseInt(amount) + 5}

Thank you for choosing us!
- Team PrintHub`
        }, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        return res.status(200).send('Order Confirmed');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
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
