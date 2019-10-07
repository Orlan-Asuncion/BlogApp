var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var express = require("express");
var app = express();

mongoose.connect("mongodb://localhost:/BlogApp");
app.set("view engine", "ejs");
app.use(express.static("/public"));
app.use(bodyParser.urlencoded({extended: true}));

//mongoose/model config
var blogSchema = new mongoose.Schema({
    tiltle: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

//restful routes
app.get("/", function(req, res){
res.redirect("/blogs");
});
app.get("/blogs", function(req, res){
    res.render("index");
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});