var express = require('express');
let {PythonShell} = require('python-shell');
var fs = require('fs');

var app = express();
var jsonContent;

module.exports = function(app) {
// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {var emot=`Please search SomeThing`;
   console.log("Got a GET request for the homepage");
   res.render('index',{  title: 'Sentiment Analysis', emot:emot});
})

app.post('/', (req, res) => {var emot=`Please search SomeThing`;
 var value=req.body.query;
   var dataToSend;
   // spawn new child process to call the python script
   //const python = spawn('python', ['twitter_nltk.py',`${value}`]);
   console.log(req.body.query);
   

   let options = {
    mode: 'text',
    
    pythonOptions: ['-u'],
    scriptPath: './',
    args: [`${value}`]
  };
   
  PythonShell.run('twitter_nltk.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log('results: %j', results);
    dataToSend = results.toString();
    console.log(dataToSend);
    if(dataToSend.includes("Negative"))
    {
          emot="Negative";dataToSend=dataToSend.replace(",Negative", "");
    }else if(dataToSend.includes("Positive"))
    {emot="Positive";
    dataToSend=dataToSend.replace(",Positive", "");
    }else if(dataToSend.includes("Neutral"))
    {emot="Neutral";dataToSend=dataToSend.replace(",Neutral", "");
    }
    dataToSend=dataToSend.substr(7);
    dataToSend=dataToSend.replace("(", "[");
    dataToSend=dataToSend.replace(")", "]");
    dataToSend=dataToSend.replace(/,/g, "},{");
    dataToSend=dataToSend.replace(/:/g, `, "units":`);
    dataToSend=dataToSend.replace(/{/g, `{"beh":`);
    dataToSend=dataToSend.replace(/'/g, `"`);
    
    
     //console.log(dataToSend);
    d();
  });
   

   function d(){
      
   jsonContent= JSON.stringify(dataToSend);
   console.log(jsonContent);
   fs.writeFile("./public/data.json", dataToSend, function (err) {
      if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
      }
   
      console.log("JSON file has been saved.");
      console.log(emot)
      //res.redirect(req.get('/test'));
        //res.redirect(307, '/');
        res.render('index',{  title: 'Sentiment Analysis', emot:emot});
  })
  
};

  })
  
}
