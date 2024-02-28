const pmUnit = `<div class="frac">
<span>μg</span>
<span class="frac-denominator">m³</span>
</div>`;

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

            var url = new URL(window.location.href);

            url.searchParams.get("temperature") === "false" ? document.querySelector("#temperature-div").classList.add("d-none") : document.querySelector("#temperature-div").classList.remove("d-none");
            url.searchParams.get("humidity") === "false" ? document.querySelector("#humidity-div").classList.add("d-none") : document.querySelector("#humidity-div").classList.remove("d-none");
            url.searchParams.get("pressure") === "false" ? document.querySelector("#pressure-div").classList.add("d-none") : document.querySelector("#pressure-div").classList.remove("d-none");
            url.searchParams.get("dewpoint") === "false" ? document.querySelector("#dewpoint-div").classList.add("d-none") : document.querySelector("#dewpoint-div").classList.remove("d-none");
            url.searchParams.get("pm1.0") === "false" ? document.querySelector("#pm1-0-div").classList.add("d-none") : document.querySelector("#pm1-0-div").classList.remove("d-none");
            url.searchParams.get("pm2.5") === "false" ? document.querySelector("#pm2-5-div").classList.add("d-none") : document.querySelector("#pm2-5-div").classList.remove("d-none");
            url.searchParams.get("pm10") === "false" ? document.querySelector("#pm10-div").classList.add("d-none") : document.querySelector("#pm10-div").classList.remove("d-none");
            url.searchParams.get("aqi") === "false" ? document.querySelector("#aqi-div").classList.add("d-none") : document.querySelector("#aqi-div").classList.remove("d-none");

            document.querySelector("#loading").classList.add("d-none");
            document.querySelector("#current-readings-error").classList.add("d-none");
            document.querySelector("#current-readings-container").classList.remove("d-none");
        } else if (json.status === "error") {
            document.querySelector("#loading").classList.add("d-none");
            document.querySelector("#current-readings-error").classList.remove("d-none");
            document.querySelector("#current-readings-container").classList.add("d-none");
        }
        setTimeout(loadCurrentReadings, 30000);
    }).catch((err) => {
        console.error(err)

        document.querySelector("#loading").classList.add("d-none");
        document.querySelector("#current-readings-error").classList.remove("d-none");
        document.querySelector("#current-readings-container").classList.add("d-none");
        
        setTimeout(loadCurrentReadings, 30000);
    });
}

loadCurrentReadings();
