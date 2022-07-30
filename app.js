const API_KEY = '644f6ce0ca9e401ebb891832211707';
const searchInput = document.querySelector('#search_input');
const form = document.querySelector('form');
const mainLocation = document.querySelector('.main_location > h1');
const clearIcon = document.querySelector('#clear');
const dayDiv = document.querySelector('.days_weather');
const mainContainer = document.querySelector('.main_container');
const CountryH1 = document.querySelector('.general_location > p');
const main_Temp = document.querySelector('.main_temp');
const main_TempH1 = document.querySelector('.main_temp > h1');
const main_Calendar = document.querySelector('.main_calendar');
const main_CalendarP = document.querySelector('.main_calendar > p');
const main_Condition = document.querySelector('.main_condition');
const main_ConditionIMG = document.querySelector('.main_condition > img');
const main_ConditionP = document.querySelector('.main_condition > p');
const Globe_Icon = document.querySelector('.fa-globe-europe');


async function LoadData() {
    try {
        await axios(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${searchInput.value ? searchInput.value : 'Namangan'}&days=7&aqi=yes&alerts=yes`)
            .then(response => getData(response.data))
            .catch(err => console.log(err))
    }
    catch (err) {
        console.log(err);
    }
}

LoadData()
form.addEventListener('submit', (e) => {
    e.preventDefault();
    LoadData()
    dayDiv.innerHTML = ''

})

function getData(data) {
    let dayTemp = data.forecast.forecastday[0].hour.map(h => h.temp_c);
    let dayHours = data.forecast.forecastday[0].hour.map(h => h.time.split(' ')[1])
    let localTime = data.location.localtime.split(' ')[0]
    let name = data.location.name.split(' ')

    console.log(data);
    mainLocation.innerHTML = data.location.name;
    CountryH1.innerHTML = `${data.location.region} | ${data.location.country}`
    main_TempH1.innerHTML = `${data.current.temp_c}°C`
    main_CalendarP.innerHTML = `${data.location.localtime}`
    main_ConditionIMG.setAttribute("src", data.current.condition.icon)
    main_ConditionP.innerHTML = `${data.current.condition.text}`
    if (name.length > 3) {
        mainLocation.style.fontSize = '20px'
        Globe_Icon.style.fontSize = '40px'
    }
    else if (name.length >= 3) {
        mainLocation.style.marginTop = '3px'
        mainLocation.style.fontSize = '25px'
    }
    else {
        mainLocation.style.fontSize = '30px'
        Globe_Icon.style.fontSize = '30px'
    }



    data.forecast.forecastday.forEach(i => {
        const wind_km = i.hour.map(h => h.wind_kph).reduce((a, b) => a + b, 0)
        let div = document.createElement('div')
        div.className = 'DaysDiv'
        div.innerHTML = `
            <h1>${i.date}</h1>


            <p> Average temprature in this day </p>
            <div class="average_div">
                <div class="circle" style="transform: translateX(${i.day.avgtemp_c}px)">
                    <p class="temp_n">${i.day.avgtemp_c}°C</p>
                </div>
            </div>

            <div class="option_day">

                <div class="option">
                        <div class="circle_diagramm">
                            <div class="percent_show"> <h1 class="humidity_perc">${i.day.avghumidity}%</h1></div>
                            <div class="diagramm_filter" style="height: ${i.day.avghumidity}%"></div>
                        </div>
                </div>

                

                <div class="option">
                    <p class="pressure">${i.hour[0].pressure_mb} hPa</p>
                </div>


                <div class="option">
                    <div class="speed_metr">${Math.floor(wind_km / 24)} km/h</div>
                    <div class="arrow" style="transform: rotate(${i.hour[0].wind_degree}deg)"></div>
                </div>
                     </div>
                <div class="additional_info">
                    <img class="img" src="img/sunrise.svg">&nbsp;&nbsp;&nbsp;<p>${i.astro.sunrise}</p>
                    <img class="img" src="img/sunset.svg">&nbsp;&nbsp;&nbsp;<p>${i.astro.sunset}</p>
                </div> 
        `

        dayDiv.appendChild(div)
    })
    if (data.current.condition.text === 'Clear') {
        document.body.style.backgroundImage = "url(./clearmoon.jpg)"
    }
    else if (data.current.condition.text === 'Partly cloudy') {
        document.body.style.backgroundImage = "url(./img/cloudy.jpg)"
    }
    else if (data.current.condition.text === 'Cloudy') {
        document.body.style.backgroundImage = "url(./img/cloudy.jpg)"
    }
    else if (data.current.condition.text === 'Overcast') {
        document.body.style.backgroundImage = "url(./img/cloudy.jpg)"
    }
    else if (data.current.condition.text === 'Sunny') {
        document.body.style.backgroundImage = "url(./img/sunny.jpg)"
    }
    else if (data.current.condition.text === 'Light rain shower') {
        document.body.style.backgroundImage = "url(./img/rain-nature.jpg)"
    }
    else if (data.current.condition.text === 'Light rain') {
        document.body.style.backgroundImage = "url(./img/rain-nature.jpg)"
    }
    else if (data.current.condition.text === 'Light snow') {
        document.body.style.backgroundImage = "url(./img/snowfall.jpeg)"
    }
    else if (data.current.condition.text === 'Mist') {
        document.body.style.backgroundImage = "url(./img/mist.jpg)"
    }
    else if (data.current.condition.text === 'Fog') {
        document.body.style.backgroundImage = "url(./img/mist.jpg)"
    }
    else if (data.current.condition.text === 'Freezing fog') {
        document.body.style.backgroundImage = "url(./img/freezingFog.jpg)"
    }


    Highcharts.chart('container', {
        chart: {
            type: 'spline'
        },
        title: {
            text: `${localTime} Average Temaprature In ${data.location.name}`
        },
        subtitle: {
            text: 'Weather Application By Obidxon'
        },
        xAxis: {
            categories: dayHours
        },
        yAxis: {
            title: {
                text: 'Temperature'
            },
            labels: {
                formatter: function () {
                    return this.value + '°C';
                }
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#000',
                    lineWidth: 2
                }
            }
        },
        series: [{
            name: data.location.name,
            marker: {
                symbol: 'cicrle'
            },
            data: dayTemp

        }]
    });
}

clearIcon.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
})


