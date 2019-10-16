const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const _ = require('underscore');

const app = express()

const apiKey = 'df894a83bc985240dd3dd7a688eff987';



app_id = "a06ab670"
app_key = " 206a95585a80df582eafcd6f066ab0b0"
language = "en-gb"
//word_id = getRandomWord();
//url = "https://od-api.oxforddictionaries.com:443/api/v2/entries/" + language + "/" + word_id.lower()
//r = requests.get(url, headers={"app_id":  a06ab670, "app_key":  "206a95585a80df582eafcd6f066ab0b0"})




app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
	let word_id = getRandomWord();

	//let url = 'https://wordsapiv1.p.mashape.com/words/${randomWord}/definitions'


  const options = {
    url1: "https://od-api.oxforddictionaries.com:443/api/v2/entries/" + language + "/" + word_id[0],
    url2: "https://od-api.oxforddictionaries.com:443/api/v2/entries/" + language + "/" + word_id[1],
    url3: "https://od-api.oxforddictionaries.com:443/api/v2/entries/" + language + "/" + word_id[2],
    url4: "https://od-api.oxforddictionaries.com:443/api/v2/entries/" + language + "/" + word_id[3],

    headers: {
      "app_id":  "a06ab670", 
      "app_key":  "206a95585a80df582eafcd6f066ab0b0"
    }
  };

  // Simon editing so we can see if we can still commit

 request(options, function (err, response, body) {

    if(err){
      res.render('index', {
      	error: 'Error, please try again get' + err,
      	randomWord: null,
      });
    } else {
      let responseBody = JSON.parse(body)
      console.log(responseBody)
      let wordDefinition1 = "" +responseBody.results[0].lexicalEntries[0].entries[0].senses[0].definitions
      console.log(word_id[0] + ": " + wordDefinition1)

      res.render('index', {
        error: null,
        randomWord: word_id[0],
        wordDefinition: wordDefinition1
      //console.log("responseBody")
      //console.log(responseBody)
      // console.log(responseBody.results)
      //console.log(responseBody.results[0].lexicalEntries)
     });


     // console.log(require('util').inspect(responseBody, true, 10));



      // if(responseBody.main == undefined){
      //   res.render('index', {
      //   	error: 'Error, please try again get 2',
      //   	randomWord: null,

      //   });
      // } else {
      //   res.render('index', {
      //   	error: null,
      //   	//randomWord: getRandomWord(), 
      //   	def: definitions, 
      //   });
      // }
    }
  });
  //res.render('index', {
  //	randomWord: getRandomWord(), 
  //	error: null
  //});

})

function getRandomWord() {
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
  let randomWord = _.sample(validWords,[4]);
  return randomWord;
}

app.post('/', function (req, res) {
  //let city = req.body.city;
  //let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  request(options, function (err, response, body) {

    if(err){
      console.log(err)
      res.render('index', {
      	error: 'Error, please try again post 1' + err,
      	randomWord: null,
      });
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {
        	error: 'Error, please try again post 2',
        	randomWord: null,
        });
      } else {
        res.render('index', {
        	error: null,
        	randomWord: getRandomWord(), 
        });
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

