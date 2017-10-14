var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var Sentencer   = require('sentencer');
var unirest     = require('unirest');

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var patterns = [
    {
        template:   "I´m the {{ noun }} and only that makes you {{ adjective }} and {{ adjective }}." +
                    "I´m the {{ noun }} and only that beats the {{ nouns }} {{ adjective }}.",
        description: "Anáfora",
        base: "File"
    },
    {
        template:   "Don´t fuck with me. you mad fella." +
                    "Don´t mess with miss. you poor lie-“tella”.",
        description: "Paralelismo",
        base: "Noow"
    },
    {
        template:   "If you are on fire, we´ll let you burn."+
                    "We´ll build the pyre, we´ll let you burn.",
        description: "Epífora",
        base: "Crash"
    },
    {   template:   "My tongue cuts the air, so sharped, sharped." +
                    "You should be aware, I fire, fire.",
        description: "Reduplicación",
        base: "Noow"
    },
    {   template:   "Ring the long run the gong tics it´s song." +
                    "Melodies sung should boost this sun gang.",
        description: "Aliteración",
        base: "Noow"
    },
    {   template:   "I can feel your fear, sweat, blood and tears." +
                    "Tears that fall in deep, like you, ¡dirty shit!",
        description: "Anadiplosis",
        base: "Noow"
    },
    {   template:   "Shy guy why you are out there hiding." +
                    "Think shrink ink before the tide gets higher.",
        description: "Homeoteuleton",
        base: "Noow"
    },
    {   template:   "Your steps back now you sure put." +
                    "Else you´ll end out in my hood.",
        description: "Hipérbaton",
        base: "Noow"
    }

];

// Sentencer
var configure_options = {
    nounList: [],
    adjectiveList: ["hard","soft"],

    // additional actions for the template engine to use.
    // you can also redefine the preset actions here if you need to.
    // See the "Add your own actions" section below.
    /*actions: {
        my_action: function(){
            return "something";
        }
    }*/
};

//console.log(Sentencer.make());

app.get('/', function (req, res) {
    res.json({
        available_routes: [
            '/rap',
            '/rhymes/:word',
        ]
    });
});

app.get('/rhymes/:word', function (req, res) {
    var word = req.params.word;
    unirest.get("https://wordsapiv1.p.mashape.com/words/"+ word +"/rhymes")
        .header("X-Mashape-Key", "AVKRxUWLc8mshXb9sEfDGRZ75q3Ep1xUtmfjsnUmWCDEOTvd6j")
        .header("Accept", "application/json")
        .end(function (result) {
            res.json(result.body);
        });
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function pickRandomPattern() {
    return patterns[getRandomInt(0,patterns.length)];
}

app.post('/rap', function (req, res) {
    var words = req.body.words;

    // configure Sentencer
    configure_options.nounList = words;
    Sentencer.configure(configure_options);

    // generate sentence
    var pattern = pickRandomPattern();
    var generated_sentence = Sentencer.make(pattern.template);

    res.json({
        rap: generated_sentence,
        words: words,
        description: pattern.description
    });
});

app.listen(80, function () {
    console.log('TwitterCockFight listening on port 80!');
});