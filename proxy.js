const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Включаем CORS для всех запросов
app.use(cors());

// API-ключи
const weatherApiKey =  // Yandex Weather API
const geocodeApiKey =  // 2GIS API

// Маршрут для геокодирования (адрес -> координаты)
app.get("/geocode", async (req, res) => {
  try {
    const { address } = req.query; // Получаем адрес из запроса

    if (!address) {
      return res.status(400).json({ error: "Не указан адрес для геокодирования" });
    }

    // Делаем запрос к API 2GIS для преобразования адреса в координаты
    const geocodeUrl = "https://catalog.api.2gis.com/3.0/items/geocode";
    const response = await axios.get(geocodeUrl, {
      params: {
        q: address, // Передаём адрес
        key: geocodeApiKey,
        fields: "items.point" // Запрашиваем только координаты
      }
    });

    if (response.data.result.items.length === 0) {
      return res.status(404).json({ error: "Адрес не найден" });
    }

    // Получаем координаты (широту и долготу) из ответа API
    const coordinates = response.data.result.items[0].point;
    res.json(coordinates); // Возвращаем координаты клиенту
  } catch (error) {
    console.error("Ошибка при геокодировании:", error.message);
    res.status(500).json({ error: "Ошибка при геокодировании" });
  }
});

// Маршрут для получения погоды (координаты -> погода)
app.get("/api", async (req, res) => {
  try {
    const { lat, lon } = req.query; // Получаем координаты из запроса

    if (!lat || !lon) {
      return res.status(400).json({ error: "Не указаны координаты lat и lon" });
    }

    // Делаем запрос к Yandex Weather API
    const weatherUrl = "https://api.weather.yandex.ru/v2/forecast";
    const response = await axios.get(weatherUrl, {
      headers: {
        "X-Yandex-API-Key": weatherApiKey
      },
      params: {
        lat: lat,
        lon: lon,
        lang: "ru_RU"
      }
    });

    res.json(response.data); // Возвращаем данные клиенту
  } catch (error) {
    console.error("Ошибка при запросе к Yandex API:", error.message);
    res.status(500).json({ error: "Ошибка при запросе к Yandex API" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Прокси-сервер запущен на http://localhost:${PORT}`);
});
