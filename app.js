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
//index route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {blogs:blogs});
        }
    });
});
//new route
app.get("/blogs/new", function(req, res){
    res.render("new");
});
//create route
app.post("/blogs", function(req, res){
    //create blog
    Blog.create(req.body.blogSchema, function(err, newBlog){
            if(err){
                res.render("new");
            } else {
                //then, res.redirect to the index
                res.redirect("/blogs");
            }
    });    
});
//show route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show", {blog: foundBlog});
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});