const express = require('express');
const Datastore = require('nedb');
require('dotenv').config;
const cors = require('cors');
const nodemailer = require("nodemailer");
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening at ${port}...`));

/*app.use(cors);*/
app.use(express.static('./'));
//to parse incomming data as json
app.use(express.json( /*{limit:'1mb'} */ ));

//database of users informations
const database = new Datastore('database.db');
database.loadDatabase();
//erase database
//database.remove({}, { multi: true }, function(err, numRemoved) {
//    database.loadDatabase(function(err) {});
//});

//database of gameParameters
const gameParameters = new Datastore('gameParameters.db');
gameParameters.loadDatabase();
var betweenElementIndexMemory = [];

app.get('/api' /*getData*/ , (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
});



app.post('/api', (request, response) => {
    console.log('I got a request to log data');
    const data = request.body;
    database.insert(data);
    console.log(data);

    //save which condition just occured
    betweenElementIndexMemory[data.betweenElementIndex] += 1;

    /* repondre au post */
    response.json({
        status: 'success',
        data: data
    });
});

app.get('/gameParameters' /*getData*/ , (request, response) => {
    console.log('I got a request to send game parameters from main page');

    gameParameters.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }

        if (betweenElementIndexMemory.length != data[0]["betweenElements"].length) {
            betweenElementIndexMemory.length = data[0]["betweenElements"].length;
            betweenElementIndexMemory.fill(0);
        }
        currentBetweenElement = argMin(betweenElementIndexMemory);
        const currentBetweenJson = data[0]["betweenElements"][currentBetweenElement];

        data[0]['nbLock'] = currentBetweenJson['nbLock'];
        data[0]['nbSlidesToUnlock'] = currentBetweenJson['nbSlides'];
        data[0]['timeBeforeSliderDisappear'] = currentBetweenJson['timeSlider'];
        data[0]['betweenElementIndex'] = currentBetweenElement;

        console.log(data);
        response.json(data);
    });
});

app.get('/settings', (request, response) => {
    console.log('I got a request to send game parameters from settings page');

    gameParameters.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        console.log(data);
        response.json(data);
    });
});

app.post('/settings', (request, response) => {
    console.log('I got a request to update settings');

    const data = request.body;
    //change database of the game parameters :
    gameParameters.remove({}, { multi: true }, function(err, numRemoved) {
        gameParameters.loadDatabase(function(err) {
            // done
        });
    });
    gameParameters.insert(data);

    /* repondre au post */
    response.json({
        status: 'success',
        data: data
    });
});

app.get('/password' /*getData*/ , (request, response) => {
    response.json({
        status: 'success',
        password: 'gilles'
    });
});

//prepare mail :
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "ihmexpert2020@gmail.com",
        pass: "Gilles2020",
    },
});

app.post('/mail', (request, response) => {
    console.log('I got a request to send mail');
    const mail = request.body;

    // send mail with defined transport object
    //let info = await 
    transporter.sendMail({
        from: '"IHM expert" <ihmexpert2020@gmail.com>', // sender address
        to: "gilles.bailly@sorbonne-universite.fr", // list of receivers
        subject: "Comment", // Subject line
        //text: "Hello world?", // plain text body
        html: mail.content, // html body
    });

    //console.log("Message sent: %s", info.messageId);

    /* repondre au post */
    response.json({
        status: 'success',
        message: 'sent',
    });
});

function argMin(array) {
    return [].map.call(array, (x, i) => [x, i]).reduce((r, a) => (a[0] < r[0] ? a : r))[1];
}