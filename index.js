const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();


const app = express();
app.listen(3000,()=>console.log('listening at 3000'));

app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));

const database= new Datastore('database.db');
database.loadDatabase();

app.get('/api',(request,response) => {

    database.find({},(err,data) =>{
        if(err)
        {
            response.end();
            return;
        }
        response.json(data);
    });
});


app.post('/api',(request,response) => {

    console.log(request.body);
    const data = request.body;
    const timestamp = Date.now();

    data.timestamp = timestamp;
    database.insert(data);
    console.log(database);

    response.json(data);
    /*
    response.json({
        status: 'success',
        timestamp:timestamp,
        latitude: request.body.latitude,
        longitude: request.body.longitude

    });*/
});


app.get('/weather/:latlon',async (request,response) => {

    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    const api_key = process.env.API_KEY;
    const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}/?units=si`;    
    const weather_resp = await fetch(weather_url);
    const weather_json = await weather_resp.json();
   
    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    const aq_resp = await fetch(aq_url);
    const aq_json = await aq_resp.json();
   
    const data = 
    {
        weather:weather_json,
        air_quality:aq_json
    };
    response.json(data);


});




