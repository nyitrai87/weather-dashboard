const apiKey = '4289b5bf082b4377679d246282c40c0b';
const searchBtn = $('#search-button');

searchBtn.on('click', function (e) {
    e.preventDefault();

    const cityName = $('#search-input').val().trim();

    const geocodingURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    fetch(geocodingURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            const units = 'metric';

            const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
            const currentURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

            fetch(currentURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    const currentWeather = $('#today').removeClass('hidden').addClass('bordered');
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
                })

            fetch(forecastURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    const forecastCards = $('#forecast').removeClass('hidden')
                    const cardEls = $('.card-body');
                    let forecasts = [data.list[7], data.list[15], data.list[23], data.list[31], data.list[39]];
                    console.log(forecasts)

                    cardEls.each(function (i) {
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

            const forecastHeadline = $('<h4>').text('5-Day Forecast:').attr('id', 'forecast-text');
            $('#forecast').prepend(forecastHeadline);
        })
})