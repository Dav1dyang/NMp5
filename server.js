var Datastore = require('nedb');
var db = new Datastore({ filename: "login.db", autoload: true });
var BFdb = new Datastore({ filename: "BFlogin.db", autoload: true });
const express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const striptags = require("striptags");
const app = express();

app.set('view engine', 'ejs');
app.use(cors());
app.use(express.static('public'));
var urlencodedParser = bodyParser.urlencoded({ extended: true }); // for parsing form data
app.use(urlencodedParser);

var wordsDatabase = [];
var colorDatabase = [];

app.get('/', (req, res) => {
    res.send('<html><body><p> Hello World! Try out some weird stuff by clicking <a href="http://142.93.115.190/woodland" >here </a> </p></html></body>')
});

// Google Sentiment

// const language = require('@google-cloud/language');
// const client = new language.LanguageServiceClient();

async function googleAnalyzeSent(document) {
    const [result] = await client.analyzeSentiment({ document });
    const sentiment = result.documentSentiment;

    return sentiment;
}

// var response = "<html><body><b>Here are all of the previous messages:</b><br />";

app.get('/analyzeWords', (req, res) => {
    res.render('form.ejs', {});
})

app.get('/window', (req, res) => {
    res.render('window.ejs', {});
})

app.post('/result', async (req, res) => {
    const { words } = req.body;
    console.log(words);
    const content = striptags(words);
    const analysis = await googleAnalyzeSent({ content, type: "PLAIN_TEXT" });

    console.log(analysis);

    var color;
    if (analysis.magnitude * analysis.score > 0) {
        color = "blue";
    } else if (analysis.magnitude * analysis.score < 0) {
        color = "red";
    } else if (analysis.magnitude * analysis.score == 0) {
        color = "black";
    }

    wordsDatabase.push(content);
    colorDatabase.push(color);
    var passingData = { words: wordsDatabase, color: colorDatabase }
    res.render('result.ejs', passingData);
    // database.push(`<font size="15" face="helvetica" color="${color}">${words} </font>`);
    // database.forEach(words => response += words + "<br />");
    // response += "</body></html>"
    // res.send(response);
    // console.log(database);
});


// ----- Woodland Midterm -----

function alreadyHaveAccount(uname) {
    return new Promise(resolve => {
        db.find({ username: uname }, function (err, docs) {
            console.log("docs length:" + Object.keys(docs).length);
            if (Object.keys(docs).length == 0) {
                resolve(false);
            } else if (Object.keys(docs).length != 0) {
                resolve(true);
            } else {
                resolve(console.error("db.find"));
            }
        });
    });
}

app.post('/WLSubmit', async (req, res) => {
    console.log("recived Data");
    var login = {
        username: req.body.uname,
        website: req.body.web,
        timestamp: Date.now(),
        trees: req.body.trees
    };
    console.log(login.username + " " + login.website)

    var AHAccount = await alreadyHaveAccount(login.username);
    console.log(AHAccount);
    if (AHAccount == true) {
        db.update({ username: login.username }, { $set: { website: login.website, timestamp: Date.now(), trees: login.trees } }, function (err, numReplaced) {
            console.log(numReplaced);

        });
        db.find({ username: login.username }, function (err, docs) {
            console.log(docs);
        });
        console.log("Have Account = " + login.username);
    } else if (AHAccount == false) {
        db.insert(login, function (err, newDocs) {
            console.log("err: " + err);
            console.log("newDocs: " + newDocs);
        });
        console.log("New Account = " + login.username);
    } else {
        return console.error("already");
    }
    console.log("Test if it work so far");
    //res.redirect('http://google.com');
    res.redirect(`/WLUser?user=${login.username}`);
    //res.redirect('google.com');
})
app.get('/addTree', async (req, res) => {
    var treeData = await findData();
    treeData = JSON.parse(treeData);
    var dataaddpass = { data: treeData };
    res.render("addTree.ejs", { dataaddpass });
})

function countTrees(uname) {
    return new Promise(resolve => {
        db.find({ username: uname }, function (err, docs) {
            resolve(docs.trees);
        });
    });
}

app.post('/WLUser', async (req, res) => {
    var add = {
        username: req.body.uname,
        trees: req.body.tree
    }
    var currentTree = await countTrees(add.username);
    var addedTree = add.trees + currentTree
    db.update({ username: login.username }, { $set: { trees: addedTree } }, function (err, numReplaced) {
        console.log(numReplaced);
    });
})

function findData() {
    return new Promise(resolve => {
        db.find({}, function (err, docs) {
            console.log(JSON.stringify(docs));
            resolve(JSON.stringify(docs));
        });
    });
}

app.get('/WLData', async (req, res) => {
    var data = await findData();
    res.send(
        JSON.parse(data)
    );
})

app.get('/woodland', async (req, res) => {
    var mainData = await findData();
    mainData = JSON.parse(mainData);
    var datatopass = { data: mainData };
    res.render("woodland.ejs", datatopass);
})

app.listen(80, function () {
    console.log('Example app listening on port 80!')
});

//-----Breakfast p5

function BFalreadyHaveAccount(uname) {
    return new Promise(resolve => {
        BFdb.find({ username: uname }, function (err, docs) {
            console.log("docs length:" + Object.keys(docs).length);
            if (Object.keys(docs).length == 0) {
                resolve(false);
            } else if (Object.keys(docs).length != 0) {
                resolve(true);
            } else {
                resolve(console.error("db.find"));
            }
        });
    });
}

app.post('/BFSubmit', async (req, res) => {
    console.log("recived Data");
    var login = {
        username: req.body.uname,
        food: req.body.food,
        timestamp: Date.now(),
    };
    console.log(login.username + " " + login.food)

    var AHAccount = await BFalreadyHaveAccount(login.username);
    console.log(AHAccount);
    if (AHAccount == true) {
        BFdb.update({ username: login.username }, { $set: { food: login.food, timestamp: Date.now() } }, function (err, numReplaced) {
            console.log(numReplaced);

        });
        BFdb.find({ username: login.username }, function (err, docs) {
            console.log(docs);
        });
        console.log("Have Account = " + login.username);
    } else if (AHAccount == false) {
        BFdb.insert(login, function (err, newDocs) {
            console.log("err: " + err);
            console.log("newDocs: " + newDocs);
        });
        console.log("New Account = " + login.username);
    } else {
        return console.error("already");
    }
    console.log("Test if it work so far");
    //res.redirect('http://google.com');
    BFdb.find({}, function (err, docs) {
        res.render('breakfast.ejs', { data: docs })
    })
})

app.get('/breakfast', (req, res) => {
    BFdb.find({}, function (err, docs) {
        res.render('breakfast.ejs', { data: docs })
    })
})

app.get('/BFdata', function (req, res) {
    BFdb.find({}, function (err, docs) {
        //var passData = {data:docs}
        res.send({ data: docs })
    })
})