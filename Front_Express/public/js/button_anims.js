function animateIcon(icon) {
    icon.classList.add("fa-spin");
    setTimeout(function() {
        icon.classList.remove("fa-spin");
    }, 2000);
}

function animateButtonClick(icon) {
    icon.classList.add("button-click-animation");
    setTimeout(function() {
        icon.classList.remove("button-click-animation");
    }, 1000);
}