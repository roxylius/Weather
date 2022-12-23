const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const path = require('path');
require("dotenv").config();

const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));
app.use('/css', express.static(__dirname + 'static/css'));
app.use('/images', express.static(__dirname + 'static/images'));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    let query = req.query.location || "London";
    const apiKey = process.env.API_KEY;
    const unit = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&lang=en&units=${unit}&appid=${apiKey}`;

    https.get(url, function (response) {

        console.log(response.statusCode);

        if (response.statusCode == 404) {
            res.render('404');
        } else {
            response.on('data', function (data) {
                const weatherData = JSON.parse(data);
                const temprature = Math.floor(weatherData.main.temp);
                const temp = temprature.toString();
                const humidity = weatherData.main.humidity;
                var miniDescription = weatherData.weather[0].main;
                const icon = weatherData.weather[0].icon;
                const windSpeed = Math.round(weatherData.wind.speed);
                const clouds = weatherData.clouds.all;
                const pressure = weatherData.main.pressure;
                const dateAndTime = dateTime();
                const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
                query = cityName(query);

                res.render('index', { imgSrc: iconUrl, title: query, temp: `${temp}`, city: query, dateAndTime: dateAndTime, weather: miniDescription, cloudPercentage: `${clouds}%`, humidity: `${humidity}%`, windSpeed: `${windSpeed}m/s`, pressure: `${pressure}hPa` })
            });
        }

    })
});

//Accessing Form data using get request so no need for post request

// app.post('/', function (req, res) {
//     const query = req.body.location;
//     const apiKey = process.env.API_KEY;
//     const unit = "metric";
//     const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&lang=en&units=${unit}&appid=${apiKey}`;

//     https.get(url, function (response) {

//         console.log(response.statusCode);

//         response.on('data', function (data) {
//             const weatherData = JSON.parse(data);
//             const temprature = weatherData.main.temp.toString();
//             const temp = `${temprature[0]}${temprature[1]}`;
//             const humidity = weatherData.main.humidity;
//             var miniDescription = weatherData.weather[0].main;
//             const icon = weatherData.weather[0].icon;
//             const windSpeed = Math.round(weatherData.wind.speed);
//             const clouds = weatherData.clouds.all;
//             const pressure = weatherData.main.pressure;
//             const dateAndTime = dateTime();
//             const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

//             res.render('index', { imgSrc: iconUrl, title: query, temp: `${temp}`, city: query, dateAndTime: dateAndTime, weather: miniDescription, cloudPercentage: `${clouds}%`, humidity: `${humidity}%`, windSpeed: `${windSpeed}m/s`, pressure: `${pressure}hPa` })
//         });

//     })
// })

function cityName(city) {
    let name = city[0].toUpperCase();
    const length = city.length - 1;
    for (let i = 1; i <= length; i++) {
        name = name + city[i];
    }
    return name;
}

function dateTime() {
    const date = new Date();
    const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const year = date.getFullYear().toString()
    const timeAndDate = `${date.getHours()}:${date.getMinutes()} - ${day[date.getDay()]}, ${date.getDate()} ${month[date.getMonth()]} '${year[2]}${year[3]}`
    return timeAndDate;
}




app.listen(port, function () {
    console.log(`Server is listening on PORT ${port}....`);
})