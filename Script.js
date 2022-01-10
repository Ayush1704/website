const timeEl=document.getElementById('time');
const dateEl=document.getElementById('date');
const currentWeatherItemsEl=document.getElementById('current-weather-items');
const timezoneEl=document.getElementById('timezone');
const countryEl=document.getElementById('country');
const weatherForecastEl=document.getElementById('weather-forecast');
const todayTempEl=document.getElementById('today-temp');


const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];

const API_KEY='f74302afc8a30cca325a1325eb663d0c';
setInterval(() => {
    const time= new Date();
    const month= time.getMonth();
    const date= time.getDate();
    const day= time.getDay();
    const hour= time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12 : hour
    const minutes= time.getMinutes();
    const ampm= hour >= 12 ? 'PM': 'AM';
    
    timeEl.innerHTML= (hoursIn12HrFormat<10?'0'+hoursIn12HrFormat:hoursIn12HrFormat) +':' + (minutes<10?'0'+minutes:minutes)+ ' '+`<span id="am-pm">${ampm}
    </span>`
    
    dateEl.innerHTML= days[day]+ ',' + date + ' ' + months[month];
},1000);

getWeatherData();
function getWeatherData()
{
    navigator.geolocation.getCurrentPosition((success) => {
        
        let{latitude , longitude}=success.coords;
        fetch( `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res=>res.json()).then(data=>{
            console.log(data);
            showWeatherData(data)
        })
    })
}
function showWeatherData(data)
{
    let {humidity, pressure, sunrise, sunset, wind_speed }= data.current;

    timezoneEl.innerHTML=data.timezone;
    countryEl.innerHTML=data.lat+'N'+' '+data.lon+'E';

    currentWeatherItemsEl.innerHTML= `<div class="weather-item">
    <div>Humidity</div>
    <div>${humidity}</div>
    </div>
<div class="weather-item">
    <div>Pressure</div>
    <div>${pressure}</div>
</div>
<div class="weather-item">
    <div>Wind-Speed(mph)</div>
    <div>${wind_speed}</div>
</div>
<div class="weather-item">
    <div>Sunrise</div>
    <div>${window.moment(sunrise*1000).format('HH:mm a')}</div>
</div>
<div class="weather-item">
    <div>Sunset</div>
    <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
</div>
`;   
    let otherDayForecast=''
    data.daily.forEach((day, idx)=>
    {
        if(idx==0)
        {
            todayTempEl.innerHTML=
            `<img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w icon">
            <div class="box">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
            <div class="temp">Max-${day.temp.max}&#176;C</div>
            <div class="temp">Min-${day.temp.min}&#176;C</div>
            </div> `
        }
        else
        {
            otherDayForecast += `
            <div class="forecast-item">
                    <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w icon">
                    <div class="temp">Max-${day.temp.max}&#176;C</div>
                    <div class="temp">Min-${day.temp.min}&#176;C</div>
                </div>
            `;
        }
    })
    weatherForecastEl.innerHTML= otherDayForecast;

    let main= data.current.weather[0].main;
    switch(main){
        case"Clear":
            document.getElementById("bg").style.backgroundImage="url(':/clear.gif')";
            break;
        case"Clouds":
            document.getElementById("bg").style.backgroundImage="url(':/clouds.gif')";
            break;
        case"Rain": 
            document.getElementById("bg").style.backgroundImage="url(':/rain.gif')";
            break;
        case"Snow":
            document.getElementById("bg").style.backgroundImage="url(':/snow.gif')";
            break;
        case"Thunderstorm":
            document.getElementById("bg").style.backgroundImage="url(':/thunderstorm.gif')";
            break;
        default:
            document.getElementById("bg").style.backgroundImage="url(':/snow.gif')";
            break;
    }
}
