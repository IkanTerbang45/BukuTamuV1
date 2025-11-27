require("dotenv").config()
const jswebtoken = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const CookieParser = require("cookie-parser")
const express = require("express")
const path = require('path')
const db = require("better-sqlite3")("BackendTgs.db")
db.pragma("journal_mode = WAL")
const app = express()
app.use(express.urlencoded({extended : false}))
app.use(express.json())
app.use(express.static("public"))
app.use(CookieParser())

app.use(function (req, res, next){
    res.locals.errors = [];


    //Decode Cookies
    try {
    const decoded = jswebtoken.verify(req.cookies.SimpleCookie, process.env.JWTOKENSECRET)
    req.user = decoded
    } catch (err){
    req.user = false
    }  
    res.locals.user = req.user
    console.log(req.user)
    next();
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/absen", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/absen', (req, res) => {
    // Accept form submissions in either JSON or urlencoded form
    const data = req.body || {};
    const { fullname, phone, address, pekerjaan } = data;
    console.log('Absensi received:', { fullname, phone, address, pekerjaan });

    // TODO: Save the absensi data to DB
    // For now, return a simple JSON response if requested, otherwise redirect back with a query string
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
        // If AJAX, return json so client can redirect
        return res.json({ success: true, message: 'Absen berhasil!' });
    }
    // For normal form submit, redirect to WhatsApp number with prefilled text
    const whatsappNumber = '6283862276293';
    const msg = `Panti Asuhan Muhammadiyah KH Achmad Dahlan\nBuku Tamu\nBazzar Milad Ke 113 Muhammadiyah\n\nNama : ${fullname}\nPekerjaan : ${pekerjaan}\nAlamat : ${address}\nNo. WA : ${phone}`;
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    res.redirect(waUrl);
});



app.listen("3000", () => {
    console.log("Server's Up and Running");
});