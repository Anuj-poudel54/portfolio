
let r = 240, g = 248, b = 255;

setInterval(() => {
    r = ((r + 1) % 256 + 230); g = ((g + 1) % 255 + 230);
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}, 1000);
