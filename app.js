const http = require('node:http');
const fs = require('node:fs');
var requests = require("requests");

const homefile = fs.readFileSync("app.html", "utf-8");

replaceval = (tempval,originval)=>{

    let temperature = tempval.replace("{%tempval%}",parseInt((originval.main.temp - 273.15))); 
    temperature = temperature.replace("{%humidity%}",originval.main.humidity); 
    temperature = temperature.replace("{%tempmax%}",parseInt((originval.main.temp_max - 273.15))); 
    temperature = temperature.replace("{%location%}",originval.name); 
    temperature = temperature.replace("{%country%}",originval.sys.country); 
    temperature = temperature.replace("{%tempstatus%}",originval.weather[0].main); 
    return temperature;
}

const server = http.createServer((req, res) => {

    if (req.url === "/") {

        requests("https://api.openweathermap.org/data/2.5/weather?q=rawalpindi&appid=3e0225abd74db59cde93f3a8de3157d7")

            .on('data', (chunk)=> {

                // json to object
                const objectdata = JSON.parse(chunk);

                // object to an array
                const arraydata = [objectdata];

                // console.log(arraydata);
                // console.log(arraydata[0].main.temp);

                //  map will return new array 
               const realTimeData = arraydata.map((val)=> replaceval(homefile,val)).join("");

               res.write(realTimeData);

            })
            .on('end', (err)=>{
                if (err) return console.log('connection closed due to errors', err);

                res.end();
            });
    }

});

server.listen(8000,'127.0.0.1');