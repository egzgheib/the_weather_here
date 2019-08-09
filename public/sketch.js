

function setup()
{



if ("geolocation" in navigator)
{
    console.log("geolocation is available");
    navigator.geolocation.getCurrentPosition(async position=>
    { 
       console.log(position.coords.latitude);
       console.log(position.coords.longitude);

    let lat,lon,weather,air;

    try
    {

    lat = position.coords.latitude;
    document.getElementById("latitude").textContent = lat.toFixed(2);
    lon = position.coords.longitude;
    document.getElementById("longitude").textContent = lon.toFixed(2);
    
    const api_url = `weather/${lat},${lon}`;
    const response = await fetch(api_url);
    const json = await response.json();
    
    console.log(json);


    weather     = json.weather.currently;
    const temp  = json.weather.currently;
    aq          = json.air_quality.results[0].measurements[0];

    document.getElementById("summary").textContent = weather.summary;
    document.getElementById("temperature").textContent = temp.temperature;
    
    document.getElementById("aq_parameter").textContent = aq.parameter;
    document.getElementById("aq_value").textContent     = aq.value;
    document.getElementById("aq_units").textContent     = aq.unit;
    document.getElementById("aq_date").textContent      = aq.lastUpdated;
    

    }
    catch(error)
    {
        console.log("Something went wrong");
        console.error(error);
        aq = {value: -1};
        document.getElementById("aq_value").textContent     = "NO DATA";

    }


    const data = {latitude: lat , longitude:lon , weather , aq};
    const options = {
            method :'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(data)
        };

    const db_response = await fetch('/api',options);
    const d = await db_response.json();
    console.log(d);


});

}
else
{
    console.log("geolocation is not available");
}






}
