function tryToLoad() {
    if (navigator.onLine) {
        document.querySelector("#loading").classList.add("d-none");
        document.querySelector("#offline").classList.add("d-none");
        document.querySelector("#main").classList.remove("d-none");

        var videoDiv = document.createElement('div');
        videoDiv.innerHTML = '<video id="background-video" autoplay loop muted src="https://cdn.jsdelivr.net/gh/bartekl1/MeteoHomepage@main/videos/2.mp4"></video>';
        document.querySelector('body').appendChild(videoDiv)
    } else {
        document.querySelector("#loading").classList.add("d-none");
        document.querySelector("#offline").classList.remove("d-none");
        setTimeout(tryToLoad, 1000);
    }
}

tryToLoad();
