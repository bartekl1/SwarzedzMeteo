const textTranslations = [
    "Website uses cookies for statistical purposes.",
    "You are offline",
    "Temperature",
    "Humidity",
    "Pressure",
    "Dew point",
    "An error occurred",
    "Current readings",
    "Information",
    "General",
    "Changelog",
    "Acknowledgements",
    "Version",
    "GitHub repository",
    "Report bug",
    "Request new feature",
    "Before you report a bug or suggest new feature, please read",
    "this information",
    "This is an amateur weather station mounted on a balcony.",
    "The weather station runs on a Raspberry Pi Zero W microcomputer.",
    "A DS18B20 sensor was used to measure temperature, and a BME280 sensor was used to measure humidity and pressure.",
];

const titleTranslations = {};

const placeholdersTranslations = {};

const alternativeTextTranslations = {};

const elementsTitlesTranslations = {};

const dataBSTranslations = {
    "Strona internetowa": "Website",
    "Profil GitHub": "GitHub profile",
    "Bieżące odczyty": "Current readings",
    Informacje: "Information",
    Udostępnij: "Share",
    Zainstaluj: "Install",
};

if (window.navigator.language.split("-")[0] !== "pl") {
    document.querySelector("html").lang = "en";

    document.querySelector("link[rel=manifest]").href = "/manifest_en.json";

    // document.querySelector("title").innerHTML =
    //     titleTranslations[document.querySelector("title").innerHTML];

    document.querySelectorAll("[text-id]").forEach((e) => {
        e.innerHTML = textTranslations[e.getAttribute("text-id")];
    });

    document.querySelectorAll("[placeholder]").forEach((e) => {
        e.placeholder = placeholdersTranslations[e.placeholder];
    });

    document.querySelectorAll("[alt]").forEach((e) => {
        e.alt = alternativeTextTranslations[e.alt];
    });

    document.querySelectorAll("[title]").forEach((e) => {
        e.title = elementsTitlesTranslations[e.title];
    });

    document.querySelectorAll("[data-bs-original-title]").forEach((e) => {
        e.setAttribute(
            "data-bs-original-title",
            dataBSTranslations[e.getAttribute("data-bs-original-title")]
        );
    });
}
