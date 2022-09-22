import express from "express";
import bodyParser from "body-parser"
import bcrypt from "bcryptjs"
import path from "path";

const app = express();

app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static("public"));



const salt1 = await bcrypt.genSalt(15)
const newHashedPassword1 = await bcrypt.hash("Superlim", salt1)
const salt2 = await bcrypt.genSalt(15)
const newHashedPassword2 = await bcrypt.hash("Kagemand", salt2)
const salt3 = await bcrypt.genSalt(15)
const newHashedPassword3 = await bcrypt.hash("Andedam", salt3)

let users = [
    {
        id: 1,
        username: "jabba",
        password: newHashedPassword1
    },
    {
        id: 2,
        username: "lassie",
        password: newHashedPassword2
    },
    {
        id: 3,
        username: "gandalf",
        password: newHashedPassword3
    }
]

let currentId = 3;

app.get("/", (req, res) => {
    res.sendFile(path.resolve("public/index.html"));
});
app.get("/login", (req, res) => {
    res.sendFile(path.resolve("public/login.html"));
});

app.post('/login', async (req, res) => {
    // Insert Login Code Here
    //let username = req.body.username;
    //let password = req.body.password;
    try{
        let foundUser = users.find((user) => req.body.username === user.username);
        console.log(req.body.username);
        console.log(foundUser);
        if (foundUser) {
            
            console.log(req.body.password);
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password; 
            console.log(storedPass);
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            console.log(passwordMatch);
            if (passwordMatch) {
                let usrname = foundUser.username;
                res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`);
            } else {
                res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
            }
        }
        else {
    
            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);
    
            res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>");
        }
    } catch{
        res.send("Internal server error");
    }
});

app.get("/signup", (req, res) => {


    res.sendFile(path.resolve("public/signup.html"));
});
app.post("/signup", async (req, res) => {
    try{
        let foundUser = users.find((user) => req.body.username === user.username);
        console.log(foundUser);
        if (!foundUser) {
            const salt = await bcrypt.genSalt(15)
            let hashPassword = await bcrypt.hash(req.body.password, salt);
    
            let newUser = {
                id: ++currentId,
                username: req.body.username,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User list', users);
    
            res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./signup.html'>Register another user</a></div>");
        } else {
            res.send("<div align ='center'><h2>Username already taken</h2></div><br><br><div align='center'><a href='./signup.html'>Register again</a></div>");
        }
    } catch{
        res.send("Internal server error");
    }
});




app.listen(8080, () => {
    console.log("Server is running on port", 8080)
});