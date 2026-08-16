const { faker } = require("@faker-js/faker");
const mySQL = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const port = 8080;


app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));


//Function to create connection btw node and SQL
const connection = mySQL.createConnection({
    host: "localhost",
    user: "root",
    database: "delta_app",
    password: "Abhinav@2007"
});

//Home Page route
app.get("/", (req, res) => {
    let q = "SELECT count(*) FROM user";
    try {
        connection.query(q, (error, result) => {
            if (error) throw error
            let count = result[0]["count(*)"];
            res.render("home.ejs", { count });
        })
    } catch (error) {
        console.log(error);
        res.send("Some error occured in database");
    }
});

//Show Users route
app.get("/users", (req, res) => {
    let q = "SELECT * FROM user";
    try {
        connection.query(q, (error, users) => {
            if (error) throw error
            res.render("showusers.ejs", { users });
        })
    } catch (error) {
        console.log(error);
        res.send("Some error occured in database");
    }
});

//Edit route
app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id=${id}`;
    try {
        connection.query(q, (error, result) => {
            if (error) throw error
            let userdata = result[0];
            res.render("edit.ejs", { userdata });
        })
    } catch (error) {
        console.log(error);
        res.send("Some error occured in database");
    }
});

//Update (Database) route
app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    let { username: newusername, password: formpass } = req.body;
    let q = `SELECT * FROM user WHERE id=${id}`;
    try {
        connection.query(q, (error, result) => {
            if (error) throw error
            let userdata = result[0];
            if (formpass != userdata.password) {
                res.send("Wrong password please try again");
            } else {
                let q2 = `UPDATE user SET username='${newusername}'WHERE id='${id}'`
                connection.query(q2, (error, result) => {
                    if (error) throw error
                    res.redirect("/users");
                })
            }
        })
    } catch (error) {
        console.log(error);
        res.send("Some error occured in database");
    }

});

//Create a user form to enter details 
app.post("/user/new", (req, res) => {
    res.render("adduser.ejs");
});

//Add user in Database
app.post("/user",(req,res)=>{
    let { id, username, email, password } = req.body;
    let q = `INSERT INTO user(id, username, email, password) VALUES (?, ?, ?, ?)`;
    try{
        connection.query(q, [id, username, email, password], (err, result) => {
        if (err) throw err;
        res.redirect("/users");
    });
    } catch (err) {
        res.send("Some error occured in database");
        console.log(err);
    }
})

//Create a delete form to enter details
app.delete("/user/delete" ,(req,res)=>{
    res.render("deleteform.ejs")
});

//Delete route to delete details of user from database
app.post("/userdata/delete",(req,res)=>{
    let {email , password} = req.body;
    try{
        let q = `DELETE FROM user WHERE email='${email}' AND password='${password}'`;
        connection.query(q,(error,result)=>{
            if (error) throw error
            res.redirect("/users");
        })
    }catch(error){
        res.render("Wrong Password");
        console.log(err);
    }
})


app.listen(port, (req, res) => {
    console.log("Server is listening for the port 8080");
});
