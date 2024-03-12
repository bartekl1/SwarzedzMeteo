const pmUnit = `<div class="frac">
<span>μg</span>
<span class="frac-denominator">m³</span>
</div>`;
var chart;

function getRandomVideo() {
    const min = 1;
    const max = 17;
    const ignore = [11];
    const user = "bartekl1";
    const repo = "SwarzedzMeteoBackgrounds";
    const resolution = 720;

    rand = Math.floor(Math.random() * (max - min + 1)) + min;

    if (!ignore.includes(rand)) {
        return `https://cdn.jsdelivr.net/gh/${user}/${repo}@main/videos/${rand}_${resolution}.mp4`;
    } else {
        return getRandomVideo();
    }
}

function getPWADisplayMode() {
    const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: window-controls-overlay)").matches;
    if (navigator.standalone || isStandalone) {
        return "standalone";
    }
    return "browser";
}

function loadCurrentReadings() {
    fetch("/api/current_readings").then((res) => { return res.json() }).then((json) => {
        if (json.status === "ok") {
            document.querySelector("#temperature").innerHTML = json.temperature !== null ? `${json.temperature}${
                (json.temperature % 1 === 0) ? ".0" : ""
            }°C` : '<i class="bi bi-x-circle text-danger"></i>';
            document.querySelector("#humidity").innerHTML = json.humidity !== null ? `${json.humidity}%`
                : '<i class="bi bi-x-circle text-danger"></i>';
            document.querySelector("#pressure").innerHTML = json.pressure !== null ? `${json.pressure} hPa`
                : '<i class="bi bi-x-circle text-danger"></i>';
            document.querySelector("#dewpoint").innerHTML = json.dewpoint !== null ? `${json.dewpoint}${
                (json.dewpoint % 1 === 0) ? ".0" : ""
            }°C` : '<i class="bi bi-x-circle text-danger"></i>';

            document.querySelector("#pm1-0").innerHTML = json["pm1.0"] !== null ? `${json["pm1.0"]} ${pmUnit}`
                : '<i class="bi bi-x-circle text-danger"></i>';
            document.querySelector("#pm2-5").innerHTML = json["pm2.5"] !== null ? `${json["pm2.5"]} ${pmUnit}`
                : '<i class="bi bi-x-circle text-danger"></i>';
            document.querySelector("#pm10").innerHTML = json["pm10"] !== null ? `${json["pm10"]} ${pmUnit}`
                : '<i class="bi bi-x-circle text-danger"></i>';
            document.querySelector("#aqi").innerHTML = json["aqi"] !== null ? `${json["aqi"]}`
                : '<i class="bi bi-x-circle text-danger"></i>';

            document.querySelector("#loading").classList.add("d-none");
            document.querySelector("#offline").classList.add("d-none");
            document.querySelector("#current-readings-error").classList.add("d-none");
            document.querySelector("#current-readings-container").classList.remove("d-none");
            document.querySelector("#main").classList.remove("d-none");
        } else if (json.status === "error") {
            document.querySelector("#loading").classList.add("d-none");
            document.querySelector("#offline").classList.add("d-none");
            document.querySelector("#current-readings-error").classList.remove("d-none");
            document.querySelector("#current-readings-container").classList.add("d-none");
            document.querySelector("#main").classList.remove("d-none");
        }
        setTimeout(loadCurrentReadings, 30000);
    }).catch((err) => {
        document.querySelector("#loading").classList.add("d-none");
        document.querySelector("#offline").classList.add("d-none");
        document.querySelector("#current-readings-error").classList.remove("d-none");
        document.querySelector("#current-readings-container").classList.add("d-none");
        document.querySelector("#main").classList.remove("d-none");
        
        setTimeout(loadCurrentReadings, 30000);
    });
}

function loadArchiveReadings() {
    document.querySelector("#archive-readings-loading").classList.remove("d-none");
    document.querySelector("#archive-readings-table-div").classList.add("d-none");
    document.querySelector("#archive-readings-chart").classList.add("d-none");
    document.querySelector("#archive-readings-error").classList.add("d-none");

    fetch("/api/archive_readings?" + new URLSearchParams({
        start_date: document.querySelector("#archive-readings-start-date").value,
        end_date: document.querySelector("#archive-readings-end-date").value,
    })).then((res) => { return res.json() }).then((json) => {
        if (json.status === "ok") {
            var tbody = document.querySelector("#archive-readings-table-div").querySelector("tbody");

            var temperature = document.querySelector("#chart-temperature").checked;
            var humidity = document.querySelector("#chart-humidity").checked;
            var pressure = document.querySelector("#chart-pressure").checked;
            var dewpoint = document.querySelector("#chart-dewpoint").checked;
            var pm1_0 = document.querySelector("#chart-pm1-0").checked;
            var pm2_5 = document.querySelector("#chart-pm2-5").checked;
            var pm10 = document.querySelector("#chart-pm10").checked;
            var aqi = document.querySelector("#chart-aqi").checked;

            var labels = [];
            var temperature_data = [];
            var humidity_data = [];
            var pressure_data = [];
            var dewpoint_data = [];
            var pm1_0_data = [];
            var pm2_5_data = [];
            var pm10_data = [];
            var aqi_data = [];

            tbody.innerHTML = "";

            json.readings.forEach((reading) => {
                var date = new Date(reading.date).toLocaleString(undefined, {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                  })

                var row = document.createElement("tr");
                row.innerHTML = `
                <th scope="row">${date}</th>
                <td>${reading.temperature !== null ? reading.temperature.toFixed(1) + "°C" : '<i class="bi bi-x-circle text-danger"></i>'}</td>
                <td>${reading.humidity !== null ? reading.humidity + "%" : '<i class="bi bi-x-circle text-danger"></i>'}</td>
                <td>${reading.pressure !== null ? reading.pressure + " hPa" : '<i class="bi bi-x-circle text-danger"></i>'}</td>
                <td>${reading.dewpoint !== null ? reading.dewpoint.toFixed(1) + "°C" : '<i class="bi bi-x-circle text-danger"></i>'}</td>
                <td>${reading["pm1.0"] !== null ? reading["pm1.0"] + " " + pmUnit : '<i class="bi bi-x-circle text-danger"></i>'}</td>
                <td>${reading["pm2.5"] !== null ? reading["pm2.5"] + " " + pmUnit : '<i class="bi bi-x-circle text-danger"></i>'}</td>
                <td>${reading["pm10"] !== null ? reading["pm10"] + " " + pmUnit : '<i class="bi bi-x-circle text-danger"></i>'}</td>
                <td>${reading.aqi !== null ? reading.aqi : '<i class="bi bi-x-circle text-danger"></i>'}</td>
                `;
                tbody.append(row);

                labels.push(date);
                
                if (temperature) {
                    temperature_data.push(reading.temperature);
                }
                if (humidity) {
                    humidity_data.push(reading.humidity);
                }
                if (pressure) {
                    pressure_data.push(reading.pressure);
                }
                if (dewpoint) {
                    dewpoint_data.push(reading.dewpoint);
                }
                if (pm1_0) {
                    pm1_0_data.push(reading["pm1.0"]);
                }
                if (pm2_5) {
                    pm2_5_data.push(reading["pm2.5"]);
                }
                if (pm10) {
                    pm10_data.push(reading["pm10"]);
                }
                if (aqi) {
                    aqi_data.push(reading.aqi);
                }
            });

            var ctx = document.querySelector('#archive-readings-chart');

            try { chart.destroy(); } catch {}

            var datasets = [];

            if (temperature) {
                datasets.push({
                    label: window.navigator.language.split("-")[0] == "pl" ? "Temperatura" : "Temperature",
                    data: temperature_data,
                });
            }
            if (humidity) {
                datasets.push({
                    label: window.navigator.language.split("-")[0] == "pl" ? "Wilgotność" : "Humidity",
                    data: humidity_data,
                });
            }
            if (pressure) {
                datasets.push({
                    label: window.navigator.language.split("-")[0] == "pl" ? "Ciśnienie" : "Pressure",
                    data: pressure_data,
                });
            }
            if (dewpoint) {
                datasets.push({
                    label: window.navigator.language.split("-")[0] == "pl" ? "Punkt rosy" : "Dewpoint",
                    data: dewpoint_data,
                });
            }
            if (pm1_0) {
                datasets.push({
                    label: "PM 1.0",
                    data: pm1_0_data,
                });
            }
            if (pm2_5) {
                datasets.push({
                    label: "PM 2.5",
                    data: pm2_5_data,
                });
            }
            if (pm10) {
                datasets.push({
                    label: "PM 10",
                    data: pm10_data,
                });
            }
            if (aqi) {
                datasets.push({
                    label: "AQI",
                    data: aqi_data,
                });
            }

            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: datasets,
                },
                options: { }
            });

            document.querySelector("#archive-readings-table-div").classList.remove("d-none");
            document.querySelector("#archive-readings-chart").classList.remove("d-none");
            document.querySelector("#archive-readings-loading").classList.add("d-none");
        } else if (json.status === "error") {
            document.querySelector("#archive-readings-loading").classList.add("d-none");
            document.querySelector("#archive-readings-error").classList.remove("d-none");
        }
    })
    // .catch((err) => {
    //     document.querySelector("#archive-readings-loading").classList.add("d-none");
    //     document.querySelector("#archive-readings-error").classList.remove("d-none");
    // });
}

function loadAnnouncements() {
    fetch("/api/announcements").then((res) => { return res.json() }).then((json) => {
        if (json.status === "ok") {
            json.announcements.forEach((a) => {
                var converter = new showdown.Converter();
                var content = converter.makeHtml(a.message);

                var announcement = document.createElement("div");
                announcement.classList.add("announcement");
                announcement.setAttribute("announcement-id", a.id);
                announcement.innerHTML = `
                <div class="alert alert-${a.style} d-flex mb-3">
                    <div class="fs-2">
                        <i class="bi bi-${a.icon}"></i>
                    </div>
                    <div class="ms-3 fs-6">
                        ${content}
                    </div>
                </div>`;

                document.querySelector("#announcements-content").append(announcement);
            });

            if (json.announcements.length !== 0) {
                if (localStorage.getItem("last-seen-announcement-id") !== json.announcements[0].id) {
                    if (localStorage.getItem("last-seen-announcement-id") === null) {
                        document.querySelector("#new-announcements").innerHTML = "";
                    } else {
                        document.querySelector("#new-announcements").innerHTML = json.announcements.length;
                        for (var i = 0; i < json.announcements.length; i++) {
                            if (localStorage.getItem("last-seen-announcement-id") === json.announcements[i].id) {
                                document.querySelector("#new-announcements").innerHTML = i;
                                break;
                            }
                        }
                    }

                    if (document.querySelector("#new-announcements").innerHTML > 99) {
                        document.querySelector("#new-announcements").innerHTML = "99+";
                    }
                }

                document.querySelector("#announcements-tab-button").addEventListener("click", () => {
                    localStorage.setItem("last-seen-announcement-id", document.querySelector(".announcement").getAttribute("announcement-id"));
                    document.querySelector("#new-announcements").innerHTML = "";
                });

                if (document.querySelector("#new-announcements").innerHTML === "") {
                    localStorage.setItem("last-seen-announcement-id", document.querySelector(".announcement").getAttribute("announcement-id"));
                }
            }

            document.querySelector("#announcements-loading").classList.add("d-none");
        } else if (json.status === "error") {
            document.querySelector("#announcements-loading").classList.add("d-none");
            document.querySelector("#announcements-error").classList.remove("d-none");
        }
    }).catch((err) => {
        document.querySelector("#announcements-loading").classList.add("d-none");
        document.querySelector("#announcements-error").classList.remove("d-none");
    });
}

function tryToLoad() {
    if (navigator.onLine) {
        loadCurrentReadings();
        loadAnnouncements();

        setTimeout(() => {
            var videoDiv = document.createElement("div");
            videoDiv.innerHTML = `<video id="background-video" autoplay loop muted src="${getRandomVideo()}"></video>`;
            document.querySelector("body").appendChild(videoDiv);
        }, 100);
    } else {
        document.querySelector("#loading").classList.add("d-none");
        document.querySelector("#offline").classList.remove("d-none");
        setTimeout(tryToLoad, 1000);
    }
}

tryToLoad();

document.querySelectorAll("input[name=tab]").forEach((e) => {
    e.addEventListener("click", () => {
        document.querySelectorAll(".tab-label").forEach((e2) => {
            e2.classList.remove("btn-primary", "btn-secondary");
        });

        document
            .querySelectorAll(
                `.tab-label:not([for=${
                    document.querySelector(
                        "input[name=tab]:checked"
                    ).id
                }])`
            )
            .forEach((e2) => {
                e2.classList.add("btn-secondary");
            });

        document
            .querySelector(
                `.tab-label[for=${
                    document.querySelector(
                        "input[name=tab]:checked"
                    ).id
                }]`
            )
            .classList.add("btn-primary");

        document.querySelector(document.querySelector("input[name=tab]:checked").getAttribute("target")).classList.remove("d-none");

        document.querySelectorAll("input[name=tab]:not(:checked)").forEach((e2) => {
            document.querySelector(e2.getAttribute("target")).classList.add("d-none");
        })
    });
});

const tooltipTriggerList = Array.from(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new bootstrap.Tooltip(tooltipTriggerEl);
});

fetch(
    window.navigator.language.split("-")[0] == "pl"
        ? "https://raw.githubusercontent.com/bartekl1/SwarzedzMeteo/main/CHANGELOG_PL.md"
        : "https://raw.githubusercontent.com/bartekl1/SwarzedzMeteo/main/CHANGELOG.md"
)
    .then((response) => {
        return response.text();
    })
    .then((md) => {
        md = md.split("\n").slice(1).join("\n");
        var converter = new showdown.Converter();
        var html = converter.makeHtml(md);
        document.querySelector("#info-changelog").innerHTML = html;
    });

fetch(
    window.navigator.language.split("-")[0] == "pl"
        ? "https://raw.githubusercontent.com/bartekl1/SwarzedzMeteo/main/ACKNOWLEDGEMENTS_PL.md"
        : "https://raw.githubusercontent.com/bartekl1/SwarzedzMeteo/main/ACKNOWLEDGEMENTS.md"
)
    .then((response) => {
        return response.text();
    })
    .then((md) => {
        md = md.split("\n").slice(1).join("\n");
        var converter = new showdown.Converter();
        var html = converter.makeHtml(md);
        document.querySelector("#info-acknowledgements").innerHTML = html;
        document
            .querySelector("#info-acknowledgements")
            .querySelectorAll("a")
            .forEach((e) => {
                e.rel = "noopener";
                e.target = "_blank";
            });
    });

if (navigator.canShare) {
    document.querySelector("#share").addEventListener("click", () => {
        navigator.share({
            title: "Swarzędz Meteo",
            text:
                window.navigator.language.split("-")[0] === "pl"
                    ? "Amatorska stacja meteo w Swarzędzu"
                    : "Amateur meteorological station in Swarzedz",
            url: window.location.href,
        });
    });

    document.querySelector("#share").classList.remove("d-none");
}

var deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
    deferredPrompt = e;

    if (getPWADisplayMode() == "browser") {
        document.querySelector("#install").classList.remove("d-none");
    }
});

document.querySelector("#install").addEventListener("click", async () => {
    if (deferredPrompt !== null) {
        deferredPrompt.prompt();
        // const { outcome } = await deferredPrompt.userChoice;
        // if (outcome === "accepted") {
        //     deferredPrompt = null;
        // }
    }
});

window.addEventListener("appinstalled", () => {
    console.log("PWA was installed");

    document.querySelector("#install").classList.add("d-none");
});

var url = new URL(window.location.href);

document.querySelectorAll(".api-url").forEach((e) => {
    e.value = url.origin + e.value;
});

document.querySelector(".iframe-code").value = `<iframe src="${url.origin}/widget" frameBorder="0" height="340" width="500"></iframe>`;

document.querySelectorAll(".copy-api").forEach((e) => {
    e.addEventListener("click", (evt) => {
        navigator.clipboard.writeText(
            evt.currentTarget.parentElement.querySelector("input").value
        );

        evt.currentTarget.innerHTML = '<i class="bi bi-clipboard-check"></i>';

        setTimeout(
            (el) => {
                el.innerHTML = '<i class="bi bi-clipboard"></i>';
            },
            2000,
            evt.currentTarget
        );
    });
});

document.querySelector("#archive-readings-start-date").valueAsDate = new Date();
document.querySelector("#archive-readings-end-date").valueAsDate = new Date();

[
    "#archive-readings-start-date",
    "#archive-readings-end-date",
    "#chart-temperature",
    "#chart-humidity",
    "#chart-pressure",
    "#chart-dewpoint",
    "#chart-pm1-0",
    "#chart-pm2-5",
    "#chart-pm10",
    "#chart-aqi"
].forEach((e) => {
    document.querySelector(e).addEventListener("change", loadArchiveReadings);
});

loadArchiveReadings();
