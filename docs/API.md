# Documentazione API

## Endpoint utilizzato

[Open-Meteo Forecast API](https://open-meteo.com/en/docs) — nessuna API key richiesta.

Base URL: `https://api.open-meteo.com/v1/forecast`

## Parametri della richiesta

| Parametro   | Tipo   | Obbligatorio | Descrizione                                              |
|-------------|--------|--------------|-----------------------------------------------------------|
| `latitude`  | number | Sì           | Latitudine della località (-90, 90)                        |
| `longitude` | number | Sì           | Longitudine della località (-180, 180)                     |
| `current`   | string | Sì           | Elenco, separato da virgole, dei campi meteo correnti da restituire |

Esempio di chiamata effettuata dall'app (`WeatherService.fetchWeather`):
GET https://api.open-meteo.com/v1/forecast?latitude=46.0679&longitude=11.1211&current=temperature_2m,relative_humidity_2m,precipitation,rain,cloud_cover,wind_speed_10m,weather_code

## Struttura della risposta

```json
{
  "latitude": 46.04,
  "longitude": 11.119999,
  "generationtime_ms": 0.0652,
  "utc_offset_seconds": 0,
  "timezone": "GMT",
  "timezone_abbreviation": "GMT",
  "elevation": 204.0,
  "current_units": {
    "time": "iso8601",
    "temperature_2m": "°C",
    "relative_humidity_2m": "%",
    "precipitation": "mm",
    "rain": "mm",
    "cloud_cover": "%",
    "wind_speed_10m": "km/h",
    "weather_code": "wmo code"
  },
  "current": {
    "time": "2025-03-29T19:15",
    "interval": 900,
    "temperature_2m": 11.9,
    "relative_humidity_2m": 54,
    "precipitation": 0.0,
    "rain": 0.0,
    "cloud_cover": 100,
    "wind_speed_10m": 9.8,
    "weather_code": 3
  }
}
```

### Campo `current`

| Campo                   | Tipo   | Unità       | Descrizione                              |
|-------------------------|--------|-------------|-------------------------------------------|
| `time`                  | string | ISO 8601    | Timestamp della rilevazione               |
| `interval`               | number | secondi     | Intervallo di aggiornamento del dato      |
| `temperature_2m`         | number | °C          | Temperatura a 2 metri dal suolo           |
| `relative_humidity_2m`   | number | %           | Umidità relativa                          |
| `precipitation`          | number | mm          | Precipitazione totale                     |
| `rain`                   | number | mm          | Pioggia                                   |
| `cloud_cover`            | number | %           | Copertura nuvolosa                        |
| `wind_speed_10m`         | number | km/h        | Velocità del vento a 10 metri             |
| `weather_code`           | number | codice WMO  | Condizione meteo (vedi tabella sotto)     |

### `weather_code` — WMO Weather interpretation codes

Il campo segue lo standard [WMO](https://www.wmo.int/) e viene tradotto in etichetta + icona dalla funzione `describeWeatherCode()` (`src/app/utils/weather-code.util.ts`).

| Codice | Descrizione                       | Icona |
|--------|-------------------------------------|-------|
| 0      | Cielo sereno                        | ☀️    |
| 1      | Prevalentemente sereno              | 🌤️    |
| 2      | Parzialmente nuvoloso               | ⛅    |
| 3      | Nuvoloso                            | ☁️    |
| 45     | Nebbia                              | 🌫️    |
| 48     | Nebbia con brina                    | 🌫️    |
| 51     | Pioviggine leggera                  | 🌦️    |
| 53     | Pioviggine moderata                 | 🌦️    |
| 55     | Pioviggine intensa                  | 🌧️    |
| 61     | Pioggia leggera                     | 🌧️    |
| 63     | Pioggia moderata                    | 🌧️    |
| 65     | Pioggia intensa                     | 🌧️    |
| 71     | Nevicata leggera                    | 🌨️    |
| 73     | Nevicata moderata                   | 🌨️    |
| 75     | Nevicata intensa                    | ❄️    |
| 80     | Rovesci leggeri                     | 🌦️    |
| 81     | Rovesci moderati                    | 🌧️    |
| 82     | Rovesci violenti                    | ⛈️    |
| 95     | Temporale                           | ⛈️    |
| 96     | Temporale con grandine leggera      | ⛈️    |
| 99     | Temporale con grandine forte        | ⛈️    |

Qualsiasi codice non presente in tabella restituisce la descrizione di default `Condizione sconosciuta` ❓.

## Utilizzo interno

- `WeatherService.fetchWeather(params)` — costruisce l'URL con tutti i campi `current`, esegue la GET, aggiorna i signal `weatherData`/`loading`/`error` e salva il risultato in `localStorage`.
- `WeatherService.checkCoordinatesValid(lat, lon)` — chiamata leggera (solo `temperature_2m`) usata dall'`AsyncValidator` del form per verificare in tempo reale che le coordinate siano risolvibili.

## Gestione errori

Se la chiamata fallisce (rete assente, coordinate non valide), il signal `error` viene valorizzato con un messaggio e il form segnala `coordinatesUnreachable` tramite l'`AsyncValidator`, impedendo l'invio.