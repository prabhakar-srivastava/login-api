const express = require("express");
const mysql = require("mysql");
const cors = require('cors');
const bodyparser = require("body-parser");
const bcrypt = require('bcrypt');
const {sign} = require('jsonwebtoken')
const {validateToken} =require('./middleWare/middleware')
const saltround = 10;

const app = express();


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "register"
});
db.connect(err => {
    
    if (!err) {
        console.log("db connected ")
    }
});

app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));


// test fetching
        
app.post('/api/user',validateToken,(req, res) => {
    const email = req.body.reg
    console.log(email)
    const qwe = "SELECT id,name,bio,date,email FROM reg WHERE email=?;";
    // console.log(qwe);
    db.query(qwe, email, (err, result) => {
        if (err) {
            console.log("error : =>", err)
        }
        console.log(result);
        res.json(result);
    });
    // res.json({error:'user not found'})
});

app.post("/api/update", (req, res) => {
    
    const upName = req.body.upName;
    // console.log(upName);
    const upBio = req.body.upBio;
    const upPassword = req.body.upPassword;
    const upEmail = req.body.upEmail;
    
    bcrypt.hash(upPassword, saltround, (err, hash) => {
        if (err) {
            console.log(err)
        }
        const query = 'UPDATE reg SET name=? , bio=? , password=? WHERE email=?';
        
        db.query(query, [upName, upBio, hash, upEmail],
              (err, result) => {
                  if (err) {
                      console.log("error =>",err);
                    }
                    // res.send(result)
                }
                );
    res.send({ message: "Successfully updates. please go back" })
               
    });
});

app.post("/api/insert", (req, res) => {

    const regName = req.body.regName;
    const regDate = req.body.regDate;
    const regEmail = req.body.regEmail;
    const regPassword = req.body.regPassword;

    bcrypt.hash(regPassword, saltround, (err, hash) => {
        if (err) {
            console.log(err)
        }
        const query = 'INSERT INTO reg (name , date , email , password) VALUES (?,?,?,?);';

        db.query(query, [regName, regDate, regEmail, hash],
            (err, result) => {
                if (err) {
                    consple.log(err);
                }
                console.log(result);
            }
        );
        res.send({ message: "Successfully Register. please go back to login" })
    });
});

app.post("/api/Login", (req, res) => {
    const username = req.body.username;
    // console.log(username);
    const password = req.body.password;
    // console.log(password);
    db.query(
        "SELECT * FROM reg WHERE email = ?;",
        username,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            //checkin user 
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (_error, response) => {
                    if (response) {
                        const jwt = sign({email : result[0].email},"difneijvneicosxmqw13212jn3c9en31")
                        // res.json(jwt)
                        console.log({
                            loggedin :true,
                            email :result[0].email,
                            // jwt:jwt
                        });
                        res.json({
                            loggedin :true,
                            email :result[0].email,
                            jwt:jwt
                        });
                    } else {
                        res.send({ error: "Wrong username/password combination!" });
                    }
                });
            } else {
                res.send({ error: "user doesn't exist" });
            }
        });
});

app.listen(3010, () => {
    console.log("server sunning");
});
