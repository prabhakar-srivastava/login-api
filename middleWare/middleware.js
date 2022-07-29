const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
const jwt = req.header("jwt");
console.log(jwt)

if (!jwt){
 return res.json({ error: "User not logged in!" });
    
}


try {
const validToken = verify (jwt, "difneijvneicosxmqw13212jn3c9en31");
    if (validToken) {
        return next();
    }
} catch (err) {
return res.json({ error: "User Not Found" });
}
}

module.exports={validateToken };