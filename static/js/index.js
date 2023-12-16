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
            document.querySelector("#temperature").innerHTML = `${json.temperature}${
                (json.temperature % 1 === 0) ? ".0" : ""
            }℃`;
            document.querySelector("#humidity").innerHTML = `${json.humidity}%`;
            document.querySelector("#pressure").innerHTML = `${json.pressure} hPa`;
            document.querySelector("#dewpoint").innerHTML = `${json.dewpoint}${
                (json.dewpoint % 1 === 0) ? ".0" : ""
            }℃`;

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

function tryToLoad() {
    if (navigator.onLine) {
        loadCurrentReadings();

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
