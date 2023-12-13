function loadTheme() {
    var theme;
    if (localStorage.getItem("theme") !== null) {
        theme = localStorage.getItem("theme");
    } else {
        theme =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
    }

    document.querySelector("html").setAttribute("data-bs-theme", theme);
}

// function loadThemeButton() {
//     var iconHTML;
//     switch (localStorage.getItem("theme")) {
//         case "light":
//             iconHTML = '<i class="bi bi-sun-fill"></i>';
//             break;

//         case "dark":
//             iconHTML = '<i class="bi bi-moon-stars-fill"></i>';
//             break;

//         default:
//             iconHTML = '<i class="bi bi-circle-half"></i>';
//             break;
//     }
//     document.querySelector("#theme-button").innerHTML = iconHTML;

//     document.querySelectorAll(".theme-button").forEach((e) => {
//         e.classList.remove("active");
//         e.querySelector(".bi-check2").classList.add("d-none");
//     });

//     var themeButton = document.querySelector(
//         `.theme-button[theme-value=${
//             localStorage.getItem("theme") !== null
//                 ? localStorage.getItem("theme")
//                 : "auto"
//         }]`
//     );

//     themeButton.classList.add("active");
//     themeButton.querySelector(".bi-check2").classList.remove("d-none");
// }

window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
        loadTheme();
    });

loadTheme();

// addEventListener("load", () => {
//     loadThemeButton();

//     document.querySelectorAll(".theme-button").forEach((e) => {
//         e.addEventListener("click", (e) => {
//             if (e.currentTarget.getAttribute("theme-value") !== "auto") {
//                 localStorage.setItem(
//                     "theme",
//                     e.currentTarget.getAttribute("theme-value")
//                 );
//             } else {
//                 localStorage.removeItem("theme");
//             }

//             loadTheme();
//             loadThemeButton();
//         });
//     });
// });