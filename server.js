const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const _ = require('underscore');

const app = express()
const apiKey = 'df894a83bc985240dd3dd7a688eff987';
app_id = "a06ab670"
app_key = " 206a95585a80df582eafcd6f066ab0b0"
language = "en-gb"

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

    let definitions;
    let options_list;
    let randomWords;
    let randomIndex;
    let correct_or_not;

app.get('/', function (req, res) {
    randomWords = getRandomWords();
    definitions = {};
    options_list = [];
  let urls = ["https://od-api.oxforddictionaries.com:443/api/v2/entries/" + language + "/" + randomWords[0],
              "https://od-api.oxforddictionaries.com:443/api/v2/entries/" + language + "/" + randomWords[1],
              "https://od-api.oxforddictionaries.com:443/api/v2/entries/" + language + "/" + randomWords[2],
              "https://od-api.oxforddictionaries.com:443/api/v2/entries/" + language + "/" + randomWords[3]
             ];


   for (i in urls) {
     let new_option = {
        url: urls[i],
        headers: {
            "app_id":  "a06ab670",
            "app_key":  "206a95585a80df582eafcd6f066ab0b0"
        }
    };
    options_list.push(new_option);
   }

    let completed_requests = 0;
    for (let i in urls) {
     request(options_list[i], function (err, response, body) {

        if(err){
          res.render('index', {
            error: 'Error, please try again get' + err,
            randomWord1: null,
            answer: null,
            wordDefinition1: null,
            wordDefinition2: null,
            wordDefinition3: null,
            wordDefinition4: null,
          });
        } else {
          let responseBody = JSON.parse(body)
          //console.log(responseBody)
          definitions[randomWords[i]] = ""+ responseBody.results[0].lexicalEntries[0].entries[0].senses[0].definitions;
          completed_requests++;
          console.log(definitions);

          console.log(completed_requests + " out of " + urls.length)

          randomIndex = _.sample([0,1,2,3]);

          if (completed_requests == urls.length) {
            console.log('randomWords' + randomWords);
            console.log("get request render:");
            console.log("get random index: "+ randomIndex);
            res.render('index', {
                error: null,
                answer: null,
                randomWord1: randomWords[randomIndex],
                wordDefinition1: definitions[randomWords[0]],
                wordDefinition2: definitions[randomWords[1]],
                wordDefinition3: definitions[randomWords[2]],
                wordDefinition4: definitions[randomWords[3]],
         });
         }
        }
      });

};

})

function getRandomWords() {
  let validWords = [

  	'solar',
    'sustainability',
  	'hydroelectric',
  	'biomass',
  	'generator',
  	'nuclear',
  	'electricity',
  	'power',
  	'compost',
  	'recycle'
  ];

  //chooses a random word from validWords with the underscore function/library
  let randomWords = _.sample(validWords,[4]);
  return randomWords;
}

app.post('/', function (req, res) {
  request(options_list[0], function (err, response, body) {
    let answer = req.body.choice;

    if(err){
      console.log(err)
      res.render('index', {
      	error: 'Error, please try again post 1' + err,
      	randomWord1: null,
      	wordDefinition1: null,
        wordDefinition2: null,
        wordDefinition3: null,
        wordDefinition4: null,
        answer: null,
      });
    } else {

        console.log("post request render:");
        console.log("post random index: "+ randomIndex);
        if(answer == randomIndex) {
          correct_or_not = "Correct";
        } else {
          correct_or_not = "Incorrect, try again";
        }

        res.render('index', {
        	error: null,
        	randomWord1: randomWords[randomIndex],
            wordDefinition1: definitions[randomWords[0]],
            wordDefinition2: definitions[randomWords[1]],
            wordDefinition3: definitions[randomWords[2]],
            wordDefinition4: definitions[randomWords[3]],
            answer: correct_or_not,
        });
      }
    }
  )})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

