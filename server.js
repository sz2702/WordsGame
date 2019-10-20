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


app.get('/', function (req, res) {
  let randomWords = getRandomWords();
  let definitions = {};

  let urls = ["https://od-api.oxforddictionaries.com:443/api/v2/entries/" + language + "/" + randomWords[0],
              "https://od-api.oxforddictionaries.com:443/api/v2/entries/" + language + "/" + randomWords[1],
              "https://od-api.oxforddictionaries.com:443/api/v2/entries/" + language + "/" + randomWords[2],
              "https://od-api.oxforddictionaries.com:443/api/v2/entries/" + language + "/" + randomWords[3]
             ];
   options_list = []

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

          if (completed_requests == urls.length) {
            console.log('randomWords' + randomWords);
            console.log("get request render:");
            res.render('index', {
                error: null,
                randomWord1: randomWords[0],
                wordDefinition1: definitions[randomWords[0]],
                wordDefinition2: definitions[randomWords[1]],
                wordDefinition3: definitions[randomWords[2]],
                wordDefinition4: definitions[randomWords[3]],
         });
         }
        }
      });

};
  // request(options2, function (err, response, body) {

  //   if(err){
  //     res.render('index', {
  //       error: 'Error, please try again get' + err,
  //       randomWord2: null,
  //       wordDefinition2: null,
  //     });
  //   } else {
  //     let responseBody = JSON.parse(body)
  //     console.log(responseBody)
  //     let wordDefinition2 = "2nd" + responseBody.results[0].lexicalEntries[0].entries[0].senses[0].definitions
  //     console.log(randomWords[1] + ": " + wordDefinition2)

  //     res.render('index', {
  //       error: null,
  //       randomWord2: randomWords2,
  //       wordDefinition2: wordDefinition2,
  //    });
  //   }
  // });


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
  //let city = req.body.city;
  //let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  request(options_list[0], function (err, response, body) {

    if(err){
      console.log(err)
      res.render('index', {
      	error: 'Error, please try again post 1' + err,
      	randomWord1: null,
      });
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {
        	error: 'Error, please try again post 2',
        	randomWord1: null,

        });
      } else {
        console.log("post request render:");

        res.render('index', {
        	error: null,
        	randomWord1: randomWords[0],
            wordDefinition1: definitions[0],
            wordDefinition2: definitions[1],
            wordDefinition3: definitions[2],
            wordDefinition4: definitions[3],

        });
      }
    }
  });

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

