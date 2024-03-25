# ![Icon](.github/img/icon30.png) Swarzędz Meteo

Amateur meteorological station in Swarzędz

![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m796142229-4aa21855eb01f1ddd0b04e07?style=flat-square)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/bartekl1/SwarzedzMeteo?style=flat-square)
![GitHub Repo stars](https://img.shields.io/github/stars/bartekl1/SwarzedzMeteo?style=flat-square)
![GitHub watchers](https://img.shields.io/github/watchers/bartekl1/SwarzedzMeteo?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/bartekl1/SwarzedzMeteo?style=flat-square)

[🌐 Website](https://swarzedzmeteo.pythonanywhere.com/)
[📖 Documentation](https://github.com/bartekl1/SwarzedzMeteo/wiki)
[🕑 Changelog](CHANGELOG.md)
[🎁 Acknowledgements](ACKNOWLEDGEMENTS.md)
[🇵🇱 Polish version of README](README_PL.md)

![Baner](.github/img/baner.png)

## Hardware

Amateur meteo station installed on the balcony. \
The weather station works on a Raspberry Pi Zero W microcomputer. \
A DS18B20 sensor was used to measure temperature, a BME280 sensor was used to measure humidity and pressure, and a PMS5003 sensor was used to measure air quality.

## Available measurements

- temperature
- humidity
- pressure
- dew point (calculated from temperature and humidity)
- PM 1.0
- PM 2.5
- PM 10
- AQI (calculated from PM 10 and PM 2.5)

## Available features

- Current readings
- Archive readings
    - Table
    - Chart
    - Download - JSON, CSV, SQL, YAML, XML, Excel
- API - current readings, archive readings
- Widget - current readings
