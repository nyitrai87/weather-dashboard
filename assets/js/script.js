const apiKey = '4289b5bf082b4377679d246282c40c0b';
const searchBtn = $('#search-button');
const historyBtns = document.getElementsByClassName('history-button');
const historyDiv = document.getElementById('history');

console.log(historyDiv)

// Loading search history from localStorage and render associated buttons
let history = [];
let storedHistory = JSON.parse(localStorage.getItem('searchHistory'));

if (storedHistory === null) {
    storedHistory = [];
} else {
    storedHistory.forEach(city => {
        history.push(city);
    });
}

history.forEach(cityName => {
    const historyBtn = document.createElement('button');
    historyBtn.classList.add('capital', 'btn', 'search-button', 'history-button');
    historyBtn.textContent = cityName;
    historyDiv.append(historyBtn);
});

// Handling click event on the search button
searchBtn.on('click', function (e) {
    e.preventDefault();

    const cityName = $('#search-input').val().trim().toLowerCase();

    if (cityName !== '') {
        $('#search-input').val('');

        renderCurrentWeather(cityName);
        renderForecast(cityName);
    }
    else {
        alert('Please input a city name!');
    }
})

// Handling click event on a search history button
for (let i = 0; i < historyBtns.length; i++) {
    historyBtns[i].addEventListener('click', function () {
        const cityName = historyBtns[i].textContent;
        renderCurrentWeather(cityName);
        renderForecast(cityName);
    })
};

// Rendering the current weather data of a city
function renderCurrentWeather(city) {
    const geocodingURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    fetch(geocodingURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            const units = 'metric';

            const currentURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

            fetch(currentURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    const currentWeather = $('#today').removeClass('hidden').addClass('bordered').text('');
                    const dateEl = dayjs().format('D/M/YYYY');
                    const locationData = data.name;
                    const iconUrl = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
                    const tempData = data.main.temp;
                    const windData = data.wind.speed;
                    const humidityData = data.main.humidity;

                    const locationAndDateEl = $('<h2>').attr('id', 'location-date').text(locationData + ' (' + dateEl + ')');
                    const weatherIcon = $('<img>').attr('src', iconUrl).attr('id', 'current-icon');
                    locationAndDateEl.append(weatherIcon);
                    const tempEl = $('<p>').text(`Temp: ${tempData} °C`);
                    const windEl = $('<p>').text(`Wind: ${windData} KPH`);
                    const humidityEl = $('<p>').text(`Humidity: ${humidityData}%`);
                    currentWeather.append(locationAndDateEl, tempEl, windEl, humidityEl);
                    createHistoryButtons(city);
                })
        })
        .catch(function (err) {
            alert('This city cannot be found. Please enter an existing city name!');
        });
}

//Rendering 5 days forecast of a city
function renderForecast(city) {
    const geocodingURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    fetch(geocodingURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            const units = 'metric';

            const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

            fetch(forecastURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    const forecastCards = $('#forecast').removeClass('hidden')
                    const cardEls = $('.card-body');
                    let forecasts = [data.list[7], data.list[15], data.list[23], data.list[31], data.list[39]];

                    cardEls.each(function (i) {
                        $(this).text('');
                        const date = forecasts[i].dt_txt.split(' ');
                        const dateEl = $('<p>').text(dayjs(date[0]).format('D/M/YYYY')).addClass('forecast-date');
                        const iconUrl = `http://openweathermap.org/img/w/${forecasts[i].weather[0].icon}.png`;
                        const weatherIcon = $('<img>').attr('src', iconUrl);
                        const tempEl = $('<p>').text(`Temp: ${forecasts[i].main.temp} °C`)
                        const windEl = $('<p>').text(`Wind: ${forecasts[i].wind.speed} KPH`);
                        const humidityEl = $('<p>').text(`Humidity: ${forecasts[i].main.humidity}%`);
                        $(this).append(dateEl, weatherIcon, tempEl, windEl, humidityEl);
                        i++;
                    })
                })
        })
}

// Generating button for a city if there's no button yet and adding the city name to the array of cities stored in the localStorage
function createHistoryButtons(city) {
    if ($.inArray(city, history) === -1) {
        history.push(city);
        const historyBtn = $('<button>').text(city).addClass('capital btn search-button history-button');

        //Adding event listener to the button, so if it's clicked, the weather for the associated city will be presented
        historyBtn.on('click', function (e) {
            e.preventDefault();

            renderCurrentWeather(city);
            renderForecast(city);
        })

        $('#history').append(historyBtn);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
}