import '../style.scss';
import Weather from './weather';
import Search from './Search';
import News from './news'
import AstronomyForecast from './astronomyForecast.js';
import {initCurrency, getConvertedCurrency} from './currency'
import {TimeInPlace, getTimeZone} from './time'
import {getUserLocation} from './userLocation'
import Forecast from './forecast';

let defCity = {
    "country": "PL",
    "name": "Warsaw",
    "lat": "52.22977",
    "lng": "21.01178"
};

const search = new Search("searchForm", "mySelect", "myInput", defCity);

let city = search.getSelectedCity();
let news = new News(city.country, 'en');
let day = 0; // 0 - current day
let astronomyForecast = new AstronomyForecast(city.name, day);

// Default current weather data
let weather = new Weather(city.lat, city.lng);
weather.apiCall(weather.setURL());

let forecast = new Forecast (city.lat, city.lng);
forecast.apiCall(forecast.setURL());

news.getNewsByCountry(news.setNewsUrl());
astronomyForecast.getAstronomyForecast(astronomyForecast.setUrl());
astronomyForecast.buttonStyle();

// // Show info when the user clicks the button
// document.getElementById('getText')
// .addEventListener('click', () => {
//     sunTime.getSunsetSunrise(city.country, city.name); 
// });

getUserLocation()
    .then((data) => {
        let c = search.getCityByName(...data);
        if(c !== null) {
            search.setCity(c);
            city = c;
            reset(city);
        }
    })
    .catch((err) => {
    });

//reset
function reset(city) {
    news.getCountry(city.country, 'en');
    weather.getCoordinates(city.lat, city.lng);
    forecast.getCoordinates(city.lat, city.lng);
    astronomyForecast.getCity(city.name, day);
    
}

document.getElementById("myInput").addEventListener("keydown", function(event){
    if(event.keyCode === 13){
        city = search.getSelectedCity();
        reset(city);
    }
})

document.getElementById("sugestion").addEventListener("click", function(){
    city = search.getSelectedCity();
    reset(city);
})

document.getElementById('previousDay').addEventListener('click', function() {
    if(day > 0) {
        day--;
        reset(city);
    }
})

document.getElementById('nextDay').addEventListener('click', function() {
    if(day < 7) {
        day++;
        reset(city);
    }
})

function insertCurrency(warp,cName,cCode,cSymbol,convertedC){
    wrap.innerHTML = `<h3>Currency in searching city:</h3>
    <b>${cName}</b>: 1 ${cCode}[1 ${cSymbol}]
    <b>${convertedC.currency_name}</b> ${convertedC.rate}`
}
function insertTime(wrap,tHour,tMinut,t2Hour,t2Minut){
    wrap.innerHTML = `<h3>Time:</h3>
    ${tHour}:${tMinut}
    <h3>Time in searching city:</h3>
    ${t2Hour}:${t2Minut}`
}
const wrap = document.getElementById('time-currency');

const t = new TimeInPlace();
t.updateTimeIOP('16:26:34');

setInterval(() => {
    t.countTime();
    insertTime(wrap,t.currentTime.hours,t.currentTime.minutes,t.inOtherPlace.hours,t.inOtherPlace.minutes);
}, 60000); 

// const convertedCurrency = getConvertedCurrency('pln','eur');
const currency = initCurrency('de');
const convertedC = getConvertedCurrency('pln','eur');

currency.then(c => { insertCurrency(wrap,c.name,c.code,c.symbol,convertedC) });

// t.printInConsole();
// getTimeZone('DE');
