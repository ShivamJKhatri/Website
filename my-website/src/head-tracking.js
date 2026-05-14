document.addEventListener('mousemove', (e) => {
    console.log(e)

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const anchor = document.getElementById('anchor');
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();

    const anchorX = rect.left + rect.width / 2;
    const anchorY = rect.top + rect.height / 2;

    const angleDegrees = angle(anchorX, anchorY, mouseX, mouseY);

    const head = document.querySelector('.lego-head img');
    if (head) {
        head.style.transform = `rotate(${angleDegrees}deg)`;
    }
});

function angle(x1, y1, x2, y2) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const radians = Math.atan2(deltaY, deltaX);
    const degrees = radians * (180 / Math.PI);
    return degrees;
}