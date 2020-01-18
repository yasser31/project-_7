$(".fa-microphone").on("click", function startRecording() {
    $("#speech").removeClass("fa-microphone");
    $(".close").animate({
        opacity: 0
    }, 5000);

    $(".minimize").animate({
        opacity: 0
    }, 5000);

    $(".maximize").animate({
        opacity: 0
    }, 5000);

    var input;
    var rec;
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext;
    var constraints = {
        audio: true,
        video: false
    }
    /* We're using the standard promise based getUserMedia()
    
    https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia */

    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
        /* assign to gumStream for later use */
        gumStream = stream;
        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);
        /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
        rec = new Recorder(input, {
            numChannels: 1
        })
        //start the recording process 
        rec.record()
        setTimeout(function () {
            rec.stop(); //stop microphone access 
            gumStream.getAudioTracks()[0].stop();
            rec.exportWAV(function (blob) {
                var formData = new FormData();
                var filename = new Date().toISOString();
                formData.append("audio", blob, filename);
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "/speech/", true);
                xhr.send(formData);
                $(".message_input").val(xhr.responseText);
                });
                
            }, 5000);
    });

});