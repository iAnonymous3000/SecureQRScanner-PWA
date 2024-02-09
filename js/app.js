document.addEventListener('DOMContentLoaded', () => {
    const video = document.createElement('video');
    const canvasElement = document.getElementById('scanner');
    const canvas = canvasElement.getContext('2d');

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // prevent fullscreen on iOS
        video.play();
        requestAnimationFrame(tick);
    });

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.hidden = false;
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            var code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code) {
                console.log("Found QR code", code.data);
                alert(`QR Code detected: ${code.data}`);
                // You can add additional code here to handle the QR code content,
                // such as redirecting the user or displaying more information.
            } else {
                requestAnimationFrame(tick); // Keep trying to read QR codes
            }
        } else {
            requestAnimationFrame(tick);
        }
    }
});
