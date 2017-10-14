var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var Sentencer   = require('sentencer');



/*
// Sentencer
Sentencer.configure({
    // the list of nouns to use. Sentencer provides its own if you don't have one!
    nounList: [],

    // the list of adjectives to use. Again, Sentencer comes with one!
    adjectiveList: [],

    // additional actions for the template engine to use.
    // you can also redefine the preset actions here if you need to.
    // See the "Add your own actions" section below.
    actions: {
        my_action: function(){
            return "something";
        }
    }
});
*/
console.log(Sentencer.make("This sentence has {{ a_noun }} and {{ an_adjective }} {{ noun }} in it."));


app.get('/', function (req, res) {
    res.send('available routes: /rap');
});

app.get('/rap', function (req, res) {
    res.send('madafaka!');
});

app.listen(80, function () {
    console.log('Example app listening on port 80!');
});