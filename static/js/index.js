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

function tryToLoad() {
    if (navigator.onLine) {
        document.querySelector("#loading").classList.add("d-none");
        document.querySelector("#offline").classList.add("d-none");
        document.querySelector("#main").classList.remove("d-none");

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
