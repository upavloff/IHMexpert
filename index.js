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

//database of gameParameters
const gameParameters = new Datastore('gameParameters.db');
gameParameters.loadDatabase();


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
        // facteur : ?
        nbTrials: data.nbTrials,
        formNameTimeline: data.formNameTimeline,
        errors: data.errors,
        unlock: data.unlock,
        listNbUnusefulClick: data.listNbUnusefulClick,
        listDuration: data.listDuration,
        nbClick: data.nbClick,
        duration: data.duration
    });
});

app.get('/settings' /*getData*/ , (request, response) => {
    console.log('I got a request to send game parameters');

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
        nbLocks: data.nbLocks,
        blockList: data.blockList,
        nbFiguresByBlock: data.nbFiguresByBlock,
        formList: data.formList,
        easyMode: data.easyMode,
        displayTimeline: data.displayTimeline
    });
});

app.get('/password' /*getData*/ , (request, response) => {
    response.json({
        status: 'success',
        password: 'gilles'
    });
});