import express from "express";
import bodyParser from "body-parser"
import bcrypt from "bcryptjs"
import path from "path";

const app = express();
app.set('view engine', 'ejs')
app.use(bodyParser.json())
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
let currentUser = {
    id: 0,
    username: "You are not logged in",
    password: 1234
};
let content = [];


app.get("/", (req, res) => {
    //res.sendFile(path.resolve("public/index/index.html"));
    //const user = {name: "Emilie"};
    res.render("index", {
        currentUser
    } )
});
app.get("/login", (req, res) => {
   // res.sendFile(path.resolve("public/login/login.html"));
   //const user = {name: "Emilie"};
    res.render("login", {
        currentUser
    } )
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
            
            currentUser = foundUser;
            console.log(req.body.password);
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password; 
            console.log(storedPass);
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            console.log(passwordMatch);
            if (passwordMatch) {
                //let usrname = foundUser.username;
                //res.render("index/index.pug", {message: "Hi! " + currentUser.username});
                res.render("index", {
                    currentUser
                } );
                //res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`);
            } else {
                res.render("login", {
                    currentUser
                } );;
            }
        }
        else {
    
            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);
            
            res.render("login", {
                currentUser
            } );
        }
    } catch{
        res.send("Internal server error");
    }
});


app.get("/signup", (req, res) => {
    
    //res.sendFile(path.resolve("public/signup/signup.html"));
    //const user = {name: "Emilie"};
    res.render("signup", {
        currentUser
    } )
});
app.post("/signup", async (req, res) => {
    try{
        let foundUser = users.find((user) => req.body.username === user.username);
        console.log(foundUser);
        console.log("TEST");
        console.log(req.body.pswrepeat);
        if (!foundUser) {
            if(req.body.password === req.body.pswrepeat){
                const salt = await bcrypt.genSalt(15)
                let hashPassword = await bcrypt.hash(req.body.password, salt);
        
                let newUser = {
                    id: ++currentId,
                    username: req.body.username,
                    password: hashPassword,
                };
                users.push(newUser);
                console.log('User list', users);
                res.render("login", {
                    currentUser
                } );
                //res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='login/login.html'>login</a></div><br><br><div align='center'><a href='signup/signup.html'>Register another user</a></div>");
            }else{
                //res.send("<div align ='center'><h2>Passwords are not the same</h2></div><br><br><div align='center'><a href='./signup.html'>Register again</a></div>");
                res.render("signup", {
                    currentUser
                } );
            }

        } else {
            //res.send("<div align ='center'><h2>Username already taken</h2></div><br><br><div align='center'><a href='./signup.html'>Register again</a></div>");
            res.render("index", {
                currentUser
            } );
        }
    } catch{
        res.send("Internal server error");
    }
});

app.get("/post", (req, res) => {
    
    //res.sendFile(path.resolve("public/signup/signup.html"));
    //const user = {name: "Emilie"};
    res.render("post", {
        currentUser
    } )
});

app.post("/post", (req, res) =>{

    const post = {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
    }
    content.push(post);
    console.log(post);

    res.render("content", {
        data: content
    } )

});

app.get("/content", (req, res) =>{
    res.render("content", {
        data: content
    } )
});



app.listen(8090, () => {
    console.log("Server is running on port", 8090)
});