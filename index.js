const express = require('express');
const Datastore = require('nedb');
require('dotenv').config;
const cors = require('cors');
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
var currentNbLocks = 1;

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
    //new Date(timestamp - data.initDate);
    database.insert(data);
    console.log(data);

    /* repondre au post */
    response.json({
        status: 'success',
        initDate: data.initDate,
        ipUser: data.ipAdress,
        nbTrials: data.nbTrials,
        nbFormsByBlock: data.nbFormsByBlock,
        formNameTimeline: data.formNameTimeline,
        errors: data.errors,
        unlock: data.unlock,
        listNbUnusefulClick: data.listNbUnusefulClick,
        listDuration: data.listDuration,
        nbClick: data.nbClick,
        duration: data.duration
    });
});

app.get('/gameParameters' /*getData*/ , (request, response) => {
    console.log('I got a request to send game parameters from main page');

    gameParameters.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        //console.log("currentNbLocks is " + currentNbLocks);
        //console.log('data[0]["nbLocksMax"] is ' + data[0]["nbLocksMax"]);
        //console.log('data[0]["nbLocksMin"] is ' + data[0]["nbLocksMin"]);
        //currentNbLocks = currentNbLocks % (data[0]["nbLocksMax"] - data[0]["nbLocksMin"]) + data[0]["nbLocksMin"] + 1;
        //console.log("currentNbLocks is " + currentNbLocks);
        currentNbLocks++;
        if (currentNbLocks > data[0]["nbLocksMax"]) {
            currentNbLocks = data[0]["nbLocksMin"];
        }
        data[0]['currentNbLocks'] = currentNbLocks;
        console.log(data);
        response.json(data);
    });
});

app.get('/settings' /*getData*/ , (request, response) => {
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
        nbBlocksToDo: data.nbBlocksToDo,
        nbFormsByBlock: data.nbFormsByBlock,
        formsFrequence: data.formsFrequence,
        formList: data.formList,
        nbLocksMin: data.nbLocksMin,
        nbLocksMax: data.nbLocksMax,
        displayTimeline: data.displayTimeline
    });
});

app.get('/password' /*getData*/ , (request, response) => {
    response.json({
        status: 'success',
        password: 'gilles'
    });
});