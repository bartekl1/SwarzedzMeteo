if (navigator.onLine) {
    document.querySelector("#loading").classList.add("d-none");
    document.querySelector("#main").classList.remove("d-none");
} else {
    document.querySelector("#loading").classList.add("d-none");
    document.querySelector("#offline").classList.remove("d-none");
}
