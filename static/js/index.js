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
