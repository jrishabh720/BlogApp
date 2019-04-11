var bodyparser  = require("body-parser"),
methodOverride = require("method-override"),
mongoose        = require("mongoose"),
express         = require("express"),
app             = express();
mongoose.connect("mongodb://localhost:27017/BlogApp", {
  useNewUrlParser: true
});
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended : true}));
app.use(methodOverride("_method"));

var blogbody = new mongoose.Schema({
  title : String ,
  image : String ,//{ type: String , default: placeholderimage.jpg} ,
  body  : String ,
  created : { type: Date , default: Date.now}
});

// here blogbody is the name of schema
var Blog = new mongoose.model("Blog",blogbody);

// This is used when we need to add the data to db which is named as BlogApp and name of collection is Blogs
// Blog.create({
//    title : "Test Blog",
//    image : "3.jpg" ,
//    body  : "This is the Test Blog"
// });

app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err,yes)
  {
    if(err){
      console.log(err);
    }else{
      res.render("index",{ yes:yes });
    }
  });
});

app.get("/blogs/new",function(req,res){
    res.render("new");
});

app.post("/blogs/new",function(req,res){
  var title = req.body.title;
  var image = req.body.image;
  var desc = req.body.desc
  var newblog = {
    title: title,
    image: image,
    body: desc
  };
  Blog.create(newblog,function(err,newblog) {
     if(err){
       console.log(err);
     }else{
       console.log(newblog);
       res.redirect("/blogs");
     }
  });
});

app.get("/blogs/:id",function(req,res){
  Blog.findById(req.params.id,function(err,no){
    if(err){
      console.log(err);
    }else{
      res.render("detail", { no : no });
    }
  })
  // res.render("detail");
});

app.get("/blogs/edit/:id", function(req,res){

  Blog.findById(req.params.id,function(err,no){
    if(err){
      console.log(err);
    }else{
      res.render("edit" , { yess : no });
    }
  })
});

app.delete("/blogs/delete/:id",function(req,res){
  Blog.findByIdAndRemove(req.params.id , function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/blogs");
    }
  })
  //res.send("DELETED");
});

app.put("/blogs/:id" , function( req , res){
    //res.send("Hey You Got That");
    Blog.findByIdAndUpdate(req.params.id , req.body.a , function(err,updatedblog){

      if(err){
        res.redirect("/blogs");
      }else{
        res.redirect("/blogs/" + req.params.id);
      }

    })
});

app.listen( //process.env.PORT , process.env.IP
  3000, function(){
  console.log("Server Linked to AWS");
});
