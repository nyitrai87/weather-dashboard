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
                    console.log(data)
                })
        })
})