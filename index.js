const express = require("express")
const app = express()
const path = require("path")
const fs=require("fs");
const { log } = require("console");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    fs.readdir(`./files`, (err, files) => {
        res.render("index",{
          files:files
      })
        
    })

})
app.get("/file/:filename", (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', (err, filedata) => {
        res.render('show', {
            filename: req.params.filename,
            filedata: filedata
        });
    })
})

app.get("/edit/:filename", (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', (err, filedata) => {
          if (err) {
            return res.status(404).send("File not found or cannot be read.");
        }
            res.render("edit", {
                filename: req.params.filename,
                filedata: filedata,
            })
    })
})
app.get("/delete/:filename", (req, res) => {
    fs.unlink(`./files/${req.params.filename}`, (err) => {
        res.redirect("/")
    })
})
app.post("/edit", (req, res) => {
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, (err)=>{
         fs.writeFile(`./files/${req.body.new}`, req.body.newdetails, (err) => {
        res.redirect("/")
    })
    })
   
})
app.post("/create",(req, res)=>{
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err) => {
        res.redirect("/")
    } )
    
})

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
})