document.getElementById('startScan').addEventListener('click', function() {
    const video = document.createElement('video');
    const canvasElement = document.getElementById('scanner');
    const canvas = canvasElement.getContext('2d');
    const startScanButton = document.getElementById('startScan');
    const videoFeedPlaceholder = document.getElementById('video-feed-placeholder');

    // Hide the button and show the placeholder when scan starts
    startScanButton.style.display = 'none';
    videoFeedPlaceholder.style.display = 'block';
    canvasElement.style.display = 'block';

    // Constraints for the video stream
    const constraints = { video: { facingMode: "environment" } };

    // Activate the webcam stream
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // prevent fullscreen on iOS
            video.play();
            requestAnimationFrame(tick);
        })
        .catch(function(error) {
            console.error("Camera access denied or not available:", error);
            alert("Camera access denied or not available. Please check camera permissions and try again.");
            videoFeedPlaceholder.style.display = 'none';
            startScanButton.style.display = 'block';
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
                // Stop scanning once a QR code is found
                video.pause();
                video.srcObject.getTracks().forEach(track => track.stop());
                videoFeedPlaceholder.style.display = 'none';
            } else {
                requestAnimationFrame(tick); // Keep trying to read QR codes
            }
        } else {
            requestAnimationFrame(tick);
        }
    }
});
