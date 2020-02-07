const express = require('express');
const Datastore = require('nedb');
require('dotenv').config;
const cors = require('cors')
const app = express();
const port = 3000;
app.listen(port, () => console.log(`listening at ${port}...`));
app.use(express.static('./'));
app.use(cors);
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
    const timestamp = Date.now();
    const data = request.body;
    data.timestamp = timestamp;
    database.insert(data);
    /*console.log(data);*/
    /* repondre au post */
    response.json({
        status: 'success',
        x: data.x,
        y: data.y,
        timestamp: timestamp
    });
});