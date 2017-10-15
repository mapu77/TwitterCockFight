var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Sentencer = require('sentencer');
var unirest = require('unirest');
var Promise = require("promise");
var Bluebird = require("bluebird");

// configure body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var custom_noun = "";
const API_KEY = "a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";

// login to wordnik
unirest.get("http://api.wordnik.com:80/v4/account.json/authenticate/jnssterrass%40gmail.com?password=pandoras\n")
    .header("api_key", API_KEY)
    .end(function (result) {
        //console.log(result);
        console.log(result.body);
    });

var patterns = [
    {
        template: "I´m the {{ custom_noun }} and only that makes you {{ adjective }}." +
        "I´m the {{ custom_noun }} and only that beats the {{ nouns }} {{ adjective }}.",
        description: "Anáfora",
        base: "File"
    },
    {
        template: "Don´t fuck with me. you mad fella." +
        "Don´t mess with miss. you poor lie-“tella”.",
        description: "Paralelismo",
        base: "Noow"
    },
    {
        template: "If you are on fire, we´ll let you burn." +
        "We´ll build the pyre, we´ll let you burn.",
        description: "Epífora",
        base: "Crash"
    },
    {
        template: "My tongue cuts the air, so sharped, sharped." +
        "You should be aware, I fire, fire.",
        description: "Reduplicación",
        base: "Noow"
    },
    {
        template: "Ring the long run the gong tics it´s song." +
        "Melodies sung should boost this sun gang.",
        description: "Aliteración",
        base: "Noow"
    },
    {
        template: "I can feel your fear, sweat, blood and tears." +
        "Tears that fall in deep, like you, ¡dirty shit!",
        description: "Anadiplosis",
        base: "Noow"
    },
    {
        template: "Shy guy why you are out there hiding." +
        "Think shrink ink before the tide gets higher.",
        description: "Homeoteuleton",
        base: "Noow"
    },
    {
        template: "Your steps back now you sure put." +
        "Else you´ll end out in my hood.",
        description: "Hipérbaton",
        base: "Noow"
    }

];

// Sentencer
var configure_options = {
    nounList: [],
    //adjectiveList: ["hard","soft"],
    actions: {
        custom_noun: function () {
            return custom_noun;
        },
        custom_adjective: function () {
            unirest.get("localhost/rhymes/" + custom_noun)
                .end(function (result) {
                    var adjetive = Sentencer.make("{{ adjective }}"); // base

                    var rhymes = res.json(result.body);

                    return adjetive;
                });
        }
    }
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
    unirest.get("https://wordsapiv1.p.mashape.com/words/" + word + "/rhymes")
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
    return patterns[getRandomInt(0, patterns.length)];
}

function generateCustomItems() {
    custom_noun = Sentencer.make("{{ noun }}");
}


function getDescriptionOf(word) {
    return new Promise(function (resolve, reject) {
        unirest.get("http://api.wordnik.com:80/v4/word.json/" + word + "/definitions")
            .send('limit=1')
            .send('partOfSpeech=adjective')
            .send('includeTags=false')
            .send('useCanonical=false')
            .header("api_key", API_KEY)
            .end(function (result, error) {
                if (error) reject(result.body[0]);
                else resolve(result.body[0]);
            })
    });
}

function classify(keywords) {
    var promisesArray = [];
    var classified_keywords = {
        push: function(description) {
            switch (description.partOfSpeech ) {
                case "noun":
                    this.nouns.push(description);
                    break;
                case "adjective":
                    this.adjectives.push(description);
                    break;
                default:
                    this.other.push(description);
            }

        },
        nouns: [],
        adjectives: [],
        other: []
    };

    for (var i in keywords) {
        var promise = getDescriptionOf(keywords[i]);
        promise.then(function (res) {
            classified_keywords.push(res);
        }, function (error) {
            console.log(error);
        });
        promisesArray.push(promise);
    }

    Promise.all(promisesArray).then(function () {
        console.log(classified_keywords);
    }, function (reason) {
        console.log(reason)
    });
}

app.post('/rap', function (req, res) {
    var keywords = req.body.words;

    var classified_keywords = classify(keywords);

    // configure Sentencer
    configure_options.nounList = keywords;
    Sentencer.configure(configure_options);

    // generate sentence
    generateCustomItems();
    var pattern = pickRandomPattern();
    var generated_sentence = Sentencer.make(pattern.template);

    res.json({
        rap: generated_sentence,
        words: keywords,
        description: pattern.description
    });
});

app.listen(80, function () {
    console.log('TwitterCockFight listening on port 80!');
});