(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

// for toggle the password
document.querySelectorAll(".toggle-password").forEach(btn => {
    btn.addEventListener("click", () => {
        const input = btn.previousElementSibling;
        const icon = btn.querySelector("i");

        if (input.type === "password") {
            input.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        }
    });
});

// Close navbar when clicking outside (mobile)
document.addEventListener("click", (e) => {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    const navbarToggler = document.querySelector(".navbar-toggler");

    if (
        navbarCollapse.classList.contains("show") &&
        !navbarCollapse.contains(e.target) &&
        !navbarToggler.contains(e.target)
    ) {
        bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
    }
});


// for dark-mode
const themeBtn = document.getElementById("themeToggle");

if (themeBtn) {

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeBtn.innerHTML = 'Light Mode';
    }

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        if (window.map) {

    const style = document.body.classList.contains("dark-mode")
        ? `https://api.maptiler.com/maps/${maptilersdk.MapStyle.STREETS.DARK.id}/style.json?key=${mapApiKey}`
        : `https://api.maptiler.com/maps/${maptilersdk.MapStyle.STREETS.id}/style.json?key=${mapApiKey}`;

   window.map.setStyle(style);

    window.map = new maptilersdk.Map({
        container: "map",
        style: style,
        center: coordinates,
        zoom: 9
    });

    const popup = new maptilersdk.Popup({
    offset: 25
}).setHTML(`
    <h6 style="color: red ">${listingTitle}</h6>
`);

const marker = new maptilersdk.Marker({
    color: "#fe424d"
})
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(window.map);

window.map.once("load", () => {
    marker.togglePopup();
});
}

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            themeBtn.innerHTML = 'Light Mode';
        } else {
            localStorage.setItem("theme", "light");
            themeBtn.innerHTML = 'Dark Mode';
        }
    });
}

