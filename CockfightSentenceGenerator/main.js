var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var Sentencer   = require('sentencer');
var unirest     = require('unirest');

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

nounList = [
    "Laura", "Juan", "Edu"
];

adjectiveList = [

];

// Sentencer
Sentencer.configure({
    // the list of nouns to use. Sentencer provides its own if you don't have one!
    //nounList: nounList,

    // the list of adjectives to use. Again, Sentencer comes with one!
    //adjectiveList: [],

    // additional actions for the template engine to use.
    // you can also redefine the preset actions here if you need to.
    // See the "Add your own actions" section below.
    /*actions: {
        my_action: function(){
            return "something";
        }
    }*/
});

console.log(Sentencer.make("This sentence is from {{ noun }} and {{ an_adjective }} {{ noun }} in it."));


app.get('/', function (req, res) {
    res.send('available routes: /rap');
});

app.get('/rhymes/:word', function (req, res) {
    var word = req.params.word;
    unirest.get("https://wordsapiv1.p.mashape.com/words/"+ word +"/rhymes")
        .header("X-Mashape-Key", "AVKRxUWLc8mshXb9sEfDGRZ75q3Ep1xUtmfjsnUmWCDEOTvd6j")
        .header("Accept", "application/json")
        .end(function (result) {
            //console.log(result.status, result.headers, result.body);
            res.json(result.body);
        });

});

app.post('/rap', function (req, res) {
    var wordList = req.body.words;

    res.json({
        rap: 'pronto funcionará! trusme ;)',
        words: wordList
    });
});

app.listen(80, function () {
    console.log('TwitterCockFight listening on port 80!');
});