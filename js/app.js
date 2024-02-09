document.addEventListener('DOMContentLoaded', () => {
    const video = document.createElement('video');
    const canvasElement = document.getElementById('scanner');
    const canvas = canvasElement.getContext('2d');

    // Try to get access to the camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Using the rear camera if available, or any camera otherwise
        const constraints = { video: { facingMode: "environment", width: 640, height: 480 } };

        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            // Set the video stream as the source for the video element
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // prevent fullscreen on iOS
            video.play();
            requestAnimationFrame(tick);
        }).catch(function(error) {
            // Handle the error case
            console.error("Camera access denied or not available:", error);
            alert("Camera access denied or not available. Please check camera permissions and try again.");
        });
    } else {
        alert("Camera access is not supported by your browser.");
    }

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
                // Display code.data in a user-friendly manner
                alert(`QR Code detected: ${code.data}`);
                // Stop scanning once a QR code is found
                video.pause();
                video.srcObject.getTracks().forEach(track => track.stop());
            } else {
                requestAnimationFrame(tick); // Keep trying to read QR codes
            }
        } else {
            requestAnimationFrame(tick);
        }
    }
});
