var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer= require("express-sanitizer");

var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
// mongoose.connect("mongodb://localhost:27017/BlogApp", {useNewUrlParser: true});
var mongoose   = require("mongoose");
      DATABASE_NAME = 'BlogApp',
      mongoURI = `mongodb://localhost:27017/${DATABASE_NAME};`    
//Set up promises with mongoose
mongoose.Promise = Promise; 
//if there's a shell environment variable named MONGODB_URI (deployed), use it; otherwise, connect to localhost
var dbUrl = process.env.MONGODB_URI || mongoURI;
// mongoose.connect(MONGOLAB_URI || mongoURI, { useNewUrlParser: true });
mongoose.connect(dbUrl, { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

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
    req.body.blog.body = req.sanitize(req.body.blog.body);
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

//edit route
app.get("/blogs/:id/edit", function (req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs"); 
        }else {
            res.render("edit",{blog: foundBlog});
        }
    });   
});
//update route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      } else {
            res.redirect("/blogs/" + req.params.id);
      }
  });
});
//delete route
app.delete("/blogs/:id", function(req, res){
    //destroy
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");  
        } else {
           res.redirect("/blogs"); 
        }
    });    
});

app.listen(port, process.env.IP, function(){
    console.log("Server is running");
});