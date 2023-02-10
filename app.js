//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect({HERE THE URL OF MONGODB ATLAS}, {useNewUrlParser: true});


const itemSchema = {
  name: String
};

const Item = new mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "wake up"
});
const item2 = new Item({
  name: "eat breakfast"
});
const item3 = new Item({
  name: "shit in toilet"
});



const startItem = [item1,item2,item3];
// const workItems = [];






app.get("/", function(req, res) {

  const day = date.getDate();

  Item.find({}, function(err, lola){

    if (lola.length === 0){
      Item.insertMany(startItem, function(err){
        if (!err) {
          console.log(err)
        }else{
          console.log("all item added to the database...");
        }
      });
    } else {
      res.render("list", {listTitle: day, newListItems: lola});
    }

  });




});

app.post("/", function(req, res){

  const item = req.body.newItem;

  const newItemDB = new Item({
    name: item
  });

  newItemDB.save();
  res.redirect("/");

});

app.post("/delete", function(req, res){
  const deleteItem = req.body.checkbox;

  Item.findByIdAndRemove(deleteItem, function(err){
    if (err) {
      console.log(err);
    } else {
      console.log("the item is deleted");
    }
    res.redirect("/");
  });
});

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
