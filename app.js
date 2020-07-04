const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require("lodash");

mongoose.connect("mongodb+srv://admin-shashank:<passwordGoesHere>@fruitsdb.zjuhp.mongodb.net/todoListDB", {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs");

var day;

const itemsSchema = new mongoose.Schema({
    name: String
});

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const item = mongoose.model('item', itemsSchema);
const list = mongoose.model('list', listSchema);

// Root route
app.get("/", function(req, res) {
    // Retrieving todos
    item.find({}, function(err, items) {
        if (err) {
            console.log(err);
        } else {
            res.render('list', {day: "Today", newTask: items});
        }
    })
    
});

// Custom route
app.get('/:customListName', function(req, res) {
    const listName = _.capitalize(req.params.customListName);
    // Checking for existence of list
    list.findOne(
        {name: listName},
        function(err, results) {
            if (err) {
                console.log(err);
            } else if (!results) {
                // Create new list
                const newList = new list({
                name: listName,
                items: []
                });
                newList.save();
                res.redirect("/" + listName);
            } else {
                // Display existing list
                res.render('list', {day: results.name, newTask: results.items});
            }
        }
    )
});

app.post("/", function(req, res) {
    const lName = req.body.list;
    const nTask = req.body.newTask;
    var add = new item({
        name: nTask
    })
    if (lName === "Today") {
        // Saving new task
        add.save();
        res.redirect("/");
    } else {
        list.findOne(
            {name: lName},
            function(err, foundList) {
                if (err) {
                    console.log(err);
                } else {
                    foundList.items.push(add);
                    foundList.save();
                    res.redirect('/' + lName);
                }
            }
        )
    }
});

app.post("/delete", function(req, res) {
    // Deleting task
    var id = req.body.checkbox;
    var whichList = req.body.listName;
    if (whichList === "Today") {
        item.deleteOne(
            {_id: id},
            function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Deleted");
                }
            }
        )
        res.redirect('/');
    } else {
        list.findOneAndUpdate(
            {name: whichList},
            {$pull: {items: {_id: id}}},
            {useFindAndModify: false},
            function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/' + whichList);
                }
            }
        )
    }
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started at 3000");
});
