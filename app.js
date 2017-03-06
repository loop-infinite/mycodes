var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
//var bodyParser = require('body-parser'); // parser for post requests
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk

//var app = express();

// Bootstrap application settings
//app.use(express.static('./public')); // load UI from public folder
//app.use(bodyParser.json());

// Create the service wrapper
var conversation = new Conversation({
  // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
  username: '26d16713-14a3-490d-a27a-044f259b2375',
  password: 'Jo1vYiOVW4vv',
  url: 'https://gateway.watsonplatform.net/conversation/api',
  version_date: '2016-10-21',
  version: 'v1'
});

//app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// This code is called only when subscribing the webhook //
app.get('/webhook/', function (req, res) {
    if (data.contextreq.query['hub.verify_token'] === 'mySecretAccessToken') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
})

var contextt={};
// Incoming messages reach this end point //
app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text) {
            text = event.message.text;
// Calling the Weather App. Change the address below to the url of your Weather app. Response is sent back to the user via the sendMessage function //
           
  //var workspace ='3ace8ebb-e806-4c98-aa4b-70b183ed5e6b';
  var workspace ='fc3baa65-036f-4ea6-89e7-a11986acc04d';

  // if (!workspace || workspace === '3ace8ebb-e806-4c98-aa4b-70b183ed5e6b') {
  //   return res.json({
  //     'output': {
  //       'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
  //     }
  //   });
  // }
   var payload = { 
    //workspace_id: '3ace8ebb-e806-4c98-aa4b-70b183ed5e6b',
    workspace_id: 'fc3baa65-036f-4ea6-89e7-a11986acc04d',
    input: {'text': text},
    context: contextt || {}
   };

  // Send the input to the conversation service
  conversation.message(payload, function(err, data) {
   if (err) {
    	sendMessage(sender, err.code);
      
    }
    datum=JSON.stringify(data.output.text[0]);
    contextt=data.context;
    sendMessage(sender, datum);
    //sendMessage(sender, datum);
   });

//   conversation.message({
//   workspace_id: '25dfa8a0-0263-471b-8980-317e68c30488',
//   input: {'text': 'Turn on the lights'},
//   context: {}
// },  function(err, response) {
//   if (err)
//    sendMessage(sender, err.code);
//   else
//    sendMessage(sender,JSON.stringify(response, null, 2));
// });







               
            
        }
    }
    res.sendStatus(200);
});


// This function receives the response text and sends it back to the user //
function sendMessage(sender,text) {
    messageData = {
        text: text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: 'EAARWy23WQqkBALUnfoI4G35kZAMSjW680djZCyXIEjvGicG3VPNMRH8zZA2haOUP9Pz8cUgbcAL4mdmMkLQWDg8SbsL0KqjJNd5ssqvryImRHC12hdp3pVJKpdqhZCmemyUNHZARZCLtZA9x0vZCn22GuZCr1SAoa4Fww2Hv8P3EhogZDZD'},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

var token = "EAARWy23WQqkBALUnfoI4G35kZAMSjW680djZCyXIEjvGicG3VPNMRH8zZA2haOUP9Pz8cUgbcAL4mdmMkLQWDg8SbsL0KqjJNd5ssqvryImRHC12hdp3pVJKpdqhZCmemyUNHZARZCLtZA9x0vZCn22GuZCr1SAoa4Fww2Hv8P3EhogZDZD";
var host = (process.env.VCAP_APP_HOST || 'localhost');
var port = (process.env.VCAP_APP_PORT || 3000);
app.listen(port, host);