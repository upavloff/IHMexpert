const express = require('express');
const Datastore = require('nedb');
require('dotenv').config;
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening at ${port}...`));

/*app.use(cors);*/
app.use(express.static('./'));
//to parse incomming data as json
app.use(express.json( /*{limit:'1mb'} */ ));

const database = new Datastore('database.db');
database.loadDatabase();


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
    console.log('I got a request');
    const data = request.body;
    const timestamp = Date.now();
    data.duration = new Date(timestamp - data.initDate);
    database.insert(data); /*console.log(data);*/

    /* repondre au post */
    response.json({
        status: 'success',
        initDate: data.initDate,
        ipUser: data.ipAdress,
        // facteur : ?
        nbTrials: data.nbTrials,
        formNameTimeline: data.formNameTimeline,
        errors: data.errors,
        unlock: data.unlockState,
        nbClick: data.nbClick,
        duration: data.duration
    });
});