'use strict';

// Отправляем адрес для геокодирования и затем получаем погоду
function getWeatherByAddress(address) {
    return fetch(`http://localhost:3000/geocode?address=${encodeURIComponent(address)}`)
      .then(res => res.json())
      .then(coordinates => {
        const { lat, lon } = coordinates;
  
        // Запрос к /api для получения погоды по координатам
        return fetch(`http://localhost:3000/api?lat=${lat}&lon=${lon}`);
      })
      .then(res => res.json())
      .catch(error => {
        console.error("Ошибка:", error);
        throw new Error("Не удалось получить погоду.");
      });
  }
document.querySelector('.image-bg-body').playbackRate = 0.9;
const temp = document.querySelector('.temp');
const form = document.getElementById('data');
const hours = document.querySelector('.hours')
const day = document.querySelector('.daytime')
const wind = document.querySelector('.wind-speed')
form.addEventListener('submit', (event) =>{
    event.preventDefault()
    const formData = new FormData(form) 
    const name = formData.get('address')
    getWeatherByAddress(name)
    .then(weather => {
      console.log(weather)
        temp.innerHTML = (`Температура: ${weather.fact.temp}&#176;`);
        hours.innerHTML = (`Осадки: ${weather.fact.condition}`);
        if (weather.fact.daytime == "d"){
          day.innerHTML = (`День`)
        }
        if (weather.fact.daytime == "n"){
          day.innerHTML = (`Ночь`)
        }
        wind.innerHTML = (`Скорость ветра: ${weather.fact.wind_speed}км/ч <br></br> Направление ветра: ${weather.fact.wind_dir} `)
    })
})
// Пример использования:
