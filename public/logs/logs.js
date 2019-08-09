const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileURL, {attribution});
tiles.addTo(mymap);



getData();

async function getData()
{
    const response = await fetch('/api');
    const data = await response.json();
    //console.log(data);

    
    for (item of data)
    {

        const marker = L.marker([item.latitude,item.longitude]).addTo(mymap);   

        let txt = `The weather here at  ${item.latitude}&deg;, ${item.longitude}&deg;
            is ${item.weather.summary} with a temperature of ${item.weather.temperature}&deg; C .
            <br>`;

        if(item.aq.value <1)
        {
           txt += 'No Air quality reading';
        }
        else
        {
            txt += `The concentration of particulate matter (${item.aq.parameter}) is ${item.aq.value}
            ${item.aq.unit} last read on ${item.aq.lastUpdated}`; 
        }
        marker.bindPopup(txt);
    }

}
