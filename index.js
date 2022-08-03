const express = require("express");
const mysql = require("mysql");
const cors = require('cors');
const bodyparser = require("body-parser");
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken')
const { validateToken } = require('./middleWare/middleware')
const saltround = 10;
const PORT = process.env.PORT || 3010

const app = express();


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "traner"
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

app.get("/", (req, res) => {
    res.send("work");
});

app.post('/api/user', validateToken, (req, res) => {
    const email = req.body.reg
    console.log(email)
    const qwe = "SELECT * FROM trainer WHERE email=?;";
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

app.post('/api/adminuser', validateToken, (req, res) => {
    const email = req.body.ad
    console.log(email)
    const qwe = "SELECT * FROM admin WHERE email=?;";
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

app.get('/api/admin', (req, res) => {
    const qwe = "SELECT * FROM trainer"
    // console.log(qwe);
    db.query(qwe, (err, result) => {
        if (err) {
            console.log("error : =>", err)
        }
        console.log(result);
        res.json(result);
    });

});

app.post("/api/update", (req, res) => {

    const upName = req.body.upName;
    console.log(upName);
    const upBio = req.body.upBio;
    const upPassword = req.body.upPassword;
    const upEmail = req.body.upEmail;
    console.log(upEmail);
    const upSkill1 = req.body.upSkill1;
    const upSkill2 = req.body.upSkill2;
    const upSkill3 = req.body.upSkill3;
    const upSkill4 = req.body.upSkill4;
    const upSkill5 = req.body.upSkill5;

    bcrypt.hash(upPassword, saltround, (err, hash) => {
        if (err) {
            console.log(err)
        }
        const query = 'UPDATE trainer SET name=? , bio=? , password=? ,skill1=? , skill2=? , skill3=? , skill4=? , skill5=? WHERE email=?';

        db.query(query, [upName, upBio, hash, upSkill1, upSkill2, upSkill3, upSkill4, upSkill5,upEmail],
            (err, result) => {
                if (err) {
                    console.log("error =>", err);
                }else{
                    // console.log(result)
                    res.send({ message: "Successfully updates. please go back" })
                }
                // res.send(result)

            }
        );

    });
});

app.post("/api/insert", (req, res) => {

    const regName = req.body.regName;
    const regDate = req.body.regDate;
    const regEmail = req.body.regEmail;
    const regPassword = req.body.regPassword;
    const regSkill1 = req.body.regSkill1;
    const regSkill2 = req.body.regSkill2;
    const regSkill3 = req.body.regSkill3;
    const regSkill4 = req.body.regSkill4;
    const regSkill5 = req.body.regSkill5;

    bcrypt.hash(regPassword, saltround, (err, hash) => {
        if (err) {
            console.log(err)
        }
        const query = 'INSERT INTO trainer (name , date , email , password,skill1,skill2,skill3,skill4,skill5) VALUES (?,?,?,?,?,?,?,?,?);';

        db.query(query, [regName, regDate, regEmail, hash, regSkill1, regSkill2, regSkill3, regSkill4, regSkill5],
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

app.post("/api/login", (req, res) => {
    const username = req.body.username;
    // console.log(username);
    const password = req.body.password;
    // console.log(password);
    db.query(
        "SELECT * FROM trainer WHERE email = ?;",
        username,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            //checkin user 
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (_error, response) => {
                    if (response) {
                        const jwt = sign({ email: result[0].email }, "difneijvneicosxmqw13212jn3c9en31")
                        // res.json(jwt)
                        console.log({
                            loggedin: true,
                            email: result[0].email,
                            // jwt:jwt
                        });
                        res.json({
                            loggedin: true,
                            email: result[0].email,
                            jwt: jwt
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

app.post("/api/adminlogin", (req, res) => {
    const username = req.body.username;
    // console.log(username);
    const password = req.body.password;
    // console.log(password);
    db.query(
        "SELECT * FROM admin WHERE email = ? AND password=?;",
        [username, password],
        (err, result) => {
            if (err) {
                console.log("error :", err);
            }
            // console.log(result.length)
            if (result.length > 0) {
                const jwt = sign({ email: result[0].email }, "difneijvneicosxmqw13212jn3c9en31");
                console.log(result)
                res.json({
                    admin: true,
                    email: result[0].email,
                    jwt: jwt
                });
            } else {
                res.send({ error: "Wrong username/password combination!" });
                // console.log({ error: "Wrong username/password combination!" });

            }

        });

});

app.listen(PORT, (err) => {
    if (err) {
        console.log("err ", err)
    }
    console.log("server running");
});
