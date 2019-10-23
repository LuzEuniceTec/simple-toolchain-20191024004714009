const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');


//////////////////////////////////////////////////////////////////////////////


// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('uuid');

// Create an S3 client
var s3 = new AWS.S3();

var bucketName = 'node-sdk-sample-' + uuid.v4();

var datelocal = new Date().toISOString();

///////////////////////////////////////////////////////////////////////////////


var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var fs = require('fs');
var Estructurador = require('./Estructurador');

//set IBM cloud credentials in this section
var personalityInsights = new PersonalityInsightsV3({
  version_date: '2017-10-13',
  username: 'apikey',
  password: '6m4VFKirgTcnOp10YWzFPzPO9yKv2ygsYxMM5FIVOF7i'
  
});

var urlencodedParser = bodyParser.urlencoded({ extended: false });
// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.get('/upload', (req, res) => {
res.render('upload', {qs: req.query});
});
var x;
app.post('/upload', urlencodedParser ,(req, res) => {
  //here we already have req.body data
  // console.log(req.body);
  // console.log(typeof req.body);
  // console.log(JSON.stringify(req.body));
  // console.log(typeof JSON.stringify(typeof req.body));

var cont = JSON.stringify(req.body.p1 + req.body.p2 + req.body.p3 + req.body.p4 + req.body.p5);

var keyName = req.body.p2+'-'+ datelocal+'.txt';



var audaciaN;
//console.log(cont);
  var profileParams = {
    // Get the content from the JSON file.

    content: cont,
    content_type: 'text/plain',
    consumption_preferences: true,
    content_language: 'es',
    accept_language: 'es',
    raw_scores: true
  };
  personalityInsights.profile(profileParams, function(error, profile) {
  if (error) {
    console.log(error);
  } else {
    //console.log(JSON.stringify(profile, null, 2));
    x = profile;
	
    var audaciaN = JSON.stringify(x.personality[0].children[0].name, null, 2);
    var audaciaP = JSON.stringify(x.personality[0].children[0].percentile, null, 2);
    
    var inAr = JSON.stringify(x.personality[0].children[1].name, null, 2);
    var inArP = JSON.stringify(x.personality[0].children[1].percentile, null, 2);
    var emocional = JSON.stringify(x.personality[1].children[2].name, null, 2);
    var emocionalP = JSON.stringify(x.personality[1].children[2].percentile, null, 2);
    var imagin = JSON.stringify(x.personality[0].children[3].name, null, 2);
    var imaginP = JSON.stringify(x.personality[0].children[3].percentile, null, 2);
    var intelec = JSON.stringify(x.personality[0].children[4].name, null, 2);
    var intelecP = JSON.stringify(x.personality[0].children[4].percentile, null, 2);
    var y=Estructurador.cleansing(x,req.body.p2);
    //console.log(x);
	//console.log(y);
	//////////////////////////////////////////////////////////////////////////////////////////////


///{"Apertura a experiencias":{"N":"0.9879391276813483"}
var bucketName = 'pruebasinsight/Estructurador' ;
 // var params = {Bucket: bucketName, Key: keyName, Body: '"Nombre":'+'{"N":"'+req.body.p2+'"},' +JSON.stringify(y)};
  var params = {Bucket: bucketName, Key: keyName, Body: JSON.stringify(y)};
  s3.putObject(params, function(err, data) {
    if (err)
      console.log(err)
    else
      console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
  });
  
  
  ///{"Apertura a experiencias":{"N":"0.9879391276813483"}
var bucketName = 'pruebasinsight/Original' ;
  var params = {Bucket: bucketName, Key: keyName, Body: JSON.stringify(x)};
  s3.putObject(params, function(err, data) {
    if (err)
      console.log(err)
    else
      console.log("Successfully uploaded data to " + bucketName  + keyName);
  });

////////////////////////////////////////////////////////////////////////////////////////////////

  }
  res.render('profile', {
  au: audaciaN,
  aup: audaciaP,
  inar: inAr,
  inarp: inArP,
  emo: emocional,
  emoP:emocionalP,
  ima:imagin,
  imaP:imaginP,
  inte:intelec,
  intep:intelecP

    });//este es el view que se carga
});


});

const port = 8080;

app.listen(port, () => console.log(`Server started on port ${port}`));
