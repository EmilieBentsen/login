import express from "express";
const app = express();
import bodyParser from "body-parser"

app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static("public"));

import path from "path";

app.get("/", (req, res) => {
    res.sendFile(path.resolve("public/frontpage.html"));
});
app.get("/login", (req, res) => {
    res.sendFile(path.resolve("public/login.html"));
});

app.post('/login', (req, res) => {
    // Insert Login Code Here
    let username = req.body.username;
    let password = req.body.password;
    res.sendFile(path.resolve("public/usersite.html"));
  });



app.listen(8080, () => {
    console.log("Server is running on port", 8080)
});