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
var custom_rel_adjective = "";
var custom_rhyme_word = "";
var custom_related_rhyme = "";

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
        template: "I´m the {{ custom_noun }} and only that makes you feel like {{ rel_adjective }}." +
        "I´m the {{ custom_noun }} and only that beats the {{ adjective }} {{ rhyme_word }}.",
        description: "Anáfora",
        base: "File"
    },
    {
        template: "Don´t fuck with me. you mad {{ custom_noun }}." +
        "Don´t mess with miss. you poor {{ rhyme_word }}.",
        description: "Paralelismo",
        base: "Noow"
    },
    {
        template: "If you are on {{ custom_noun }}, we´ll let you {{ noun }} {{rel_adjective}} ." +
        "We´ll build the {{ rhyme_word }}, we´ll let you {{ rhyme_word }}.",
        description: "Epífora",
        base: "Crash"
    },
    {
        template: "My tongue cuts the air, so {{ rhyme_word }}, {{ rhyme_word }}." +
        "You should be aware, I {{ custom_noun }}, {{ custom_noun }}.",
        description: "Reduplicación",
        base: "Noow"
    },
    {
        template: "Ring the {{ custom_noun }} run the gong tics it´s {{ rhyme_word }}." +
        "Melodies {{ rhyme_word }} should boost this sun {{ rhyme_word }}.",
        description: "Aliteración",
        base: "Noow"
    },
    {
        template: "I can feel your {{ custom_noun }}, sweat, blood and {{ rhyme_word }}." +
        "Tears that fall in {{rel_adjective}}, like you, ¡{{rel_adjective}}!",
        description: "Anadiplosis",
        base: "Noow"
    },
    {
        template: "Shy guy why you are out there {{ custom_noun }}." +
        "Think shrink ink before the tide gets {{rel_adjective}}.",
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
    adjectiveList: [],
    actions: {
        custom_noun: function () {
            return custom_noun.word;
        },
        rel_adjective: function () {
            return custom_rel_adjective.word;
        },
        rhyme_word: function () {
            return custom_rhyme_word.word;
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

function pickRandomIn(elements) {
    elements.push({word: "fun"});
    return elements[getRandomInt(0, patterns.length)];
}

function generateCustomItems(most_relevant_keyword_noun, most_relevant_keyword_adjective, related_rhyme_words, rhyme_words, suitable_adjetives) {
    custom_noun = most_relevant_keyword_noun;
    custom_rel_adjective = pickRandomIn([most_relevant_keyword_adjective]);
    custom_rhyme_word = pickRandomIn(rhyme_words);
    custom_related_rhyme = pickRandomIn(related_rhyme_words);
}

function getDescriptionOf(wordObject) {
    return new Promise(function (resolve, reject) {
        unirest.get("http://api.wordnik.com:80/v4/word.json/" + wordObject.word + "/definitions")
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

function getWordsWithRhymeAndRelatedTo(rhymesWith, relatedWord) {
    return new Promise(function (resolve, reject) {
        unirest.get("https://api.datamuse.com/words?ml="+relatedWord.word+"&rel_rhy="+rhymesWith.word+"&max=1000")
            .end(function (result, error) {
                if (error) reject(error);
                else resolve(result.body);
            })
    });
}

function getWordsThatRhymesWith(rhymesWith) {
    return new Promise(function (resolve, reject) {
        unirest.get("https://api.datamuse.com/words?rel_rhy="+rhymesWith.word+"&max=1000")
            .end(function (result, error) {
                if (error) reject(error);
                else resolve(result.body);
            })
    });
}

function getAdjetivesUsedToDescribe(word) {
    return new Promise(function (resolve, reject) {
        unirest.get("https://api.datamuse.com/words?rel_jjb=ocean="+word.word+"&max=1000")
            .end(function (result, error) {
                if (error) reject(error);
                else resolve(result.body);
            })
    });
}

function classify(keywords) {
    return new Promise(function (resolve, reject) {
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
            resolve(classified_keywords);
            //console.log(classified_keywords);
        }, function (error) {
            reject(error);
            console.log(error)
        });
    });
}

function getMostRelevantFrom(words) {
    var max = null;
    for (var i in words) {
        var word = words[i];
        if(max === null) max = word;
        if(max.count < word.count ) max = word;
    }
    return max;
}

app.post('/rap', function (req, res) {
    var keywords = req.body.words;

    var promise = classify(keywords);
    promise.then(function (classified_keywords) {
        // configure Sentencer
        configure_options.nounList = classified_keywords.nouns;
        configure_options.adjectives = classified_keywords.adjectives;
        Sentencer.configure(configure_options);
        var promisesArray = [];

        // generate sentence
        var most_relevant_keyword_noun = getMostRelevantFrom(classified_keywords.nouns);
        var most_relevant_keyword_adjective = getMostRelevantFrom(classified_keywords.adjectives);
        var related_rhyme_words = [];
        var rhyme_words = [];
        var suitable_adjetives = [];

        var promise = getWordsWithRhymeAndRelatedTo(most_relevant_keyword_noun,most_relevant_keyword_adjective);
        promise.then(function (res) {
            related_rhyme_words = res;
            console.log(res)
        }, function (error) {
            console.log(error);
        });
        promisesArray.push(promise);

        var promise2 = getWordsThatRhymesWith(most_relevant_keyword_adjective);
        promise2.then(function (res) {
            rhyme_words = res;
            console.log(res)
        }, function (error) {
            console.log(error);
        });
        promisesArray.push(promise2);

        var promise3 = getAdjetivesUsedToDescribe(most_relevant_keyword_noun);
        promise3.then(function (res) {
            suitable_adjetives = res;
            console.log(res)
        }, function (error) {
            console.log(error);
        });
        promisesArray.push(promise3);

        Promise.all(promisesArray).then(function () {
            generateCustomItems(
                most_relevant_keyword_noun,
                most_relevant_keyword_adjective,
                related_rhyme_words,
                rhyme_words,
                suitable_adjetives);

            var pattern = pickRandomPattern();
            var generated_sentence = Sentencer.make(pattern.template);

            res.json({
                rap: generated_sentence,
                //words: keywords,
                //classified_keywords: classified_keywords,
                description: pattern.description
            });
        }, function (error) {
            console.log(error)
        });
    }, function (error) {
        res.end();
        console.log(error);
    });
});

app.listen(80, function () {
    console.log('TwitterCockFight listening on port 80!');
});