# ![Icon](.github/img/icon30.png) Swarzędz Meteo

Amatorska stacja meteo w Swarzędzu

![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m796142229-4aa21855eb01f1ddd0b04e07?style=flat-square)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/bartekl1/SwarzedzMeteo?style=flat-square)
![GitHub Repo stars](https://img.shields.io/github/stars/bartekl1/SwarzedzMeteo?style=flat-square)
![GitHub watchers](https://img.shields.io/github/watchers/bartekl1/SwarzedzMeteo?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/bartekl1/SwarzedzMeteo?style=flat-square)

[🌐 Strona internetowa](https://swarzedzmeteo.pythonanywhere.com/)
[📖 Dokumentacja](https://github.com/bartekl1/SwarzedzMeteo/wiki)
[🕑 Rejestr zmian](CHANGELOG_PL.md)
[🎁 Podziękowania](ACKNOWLEDGEMENTS_PL.md)

![Baner](.github/img/baner.png)

## Sprzęt

Amatorska stacja meteo zamontowana na balkonie. \
Stacja meteo działa na mikrokomputerze Raspberry Pi Zero W. \
Do pomiaru temperatury wykorzystany został czujnik DS18B20, do pomiaru wilgotności i ciśnienia czujnik BME280, a do pomiaru jakości powietrza czujnik PMS5003.

## Dostępne pomiary

- temperatura
- wilgotność
- ciśnienie
- punkt rosy (obliczany z temperatury i wilgotności)
- PM 1.0
- PM 2.5
- PM 10
- AQI (obliczany z PM 10 i PM 2.5)

## Dostępne funkcje

- Bieżące odczyty
- Archiwalne odczyty
    - Tabela
    - Wykres
    - Pobieranie - JSON, CSV, SQL, YAML, XML, Excel
- API - bieżące odczyty, archiwalne odczyty
- Widżet - bieżące odczyty
