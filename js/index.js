//To change the color of the eyes
function eyesColor(val)
{
	document.getElementById("leftEye").style.backgroundColor = val;
	document.getElementById("rightEye").style.backgroundColor = val;
    setTimeout(function(){
        document.getElementById("leftEye").style.backgroundColor = "white";
	    document.getElementById("rightEye").style.backgroundColor = "white";
    }, 5000)		
}

//Init the recognition interface
function startRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = function(event) {
        respond(messageRecording);
        updateRec();
    };
    recognition.onresult = function(event) {
        recognition.onend = null;
        var text = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
        }
        setInput(text);
        stopRecognition();
    };
    recognition.onend = function() {
        respond(messageCouldntHear);
        stopRecognition();
    };
    recognition.lang = "en-US";
    recognition.start();
}
  
function stopRecognition() {
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
      updateRec();
}

function switchRecognition() {
    if (recognition) {
      stopRecognition();
    } else {
      startRecognition();
    }
}

function setInput(text) {
    $speechInput.val(text);
	send();
}

function updateRec() {
    $recBtn.text(recognition ? "Stop" : "Speak");
}

function send() {
    var text = $speechInput.val();
    $.ajax({
        type: "POST",
        url: baseUrl + "query",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({query: text, lang: "en", sessionId: "yaydevdiner"}),
        success: function(data) {
            prepareResponse(data);
        },
        error: function() {
            respond(messageInternalError);
        }
    });
}

function prepareResponse(val) {
    var debugJSON = JSON.stringify(val, undefined, 2),
    spokenResponse = val.result.speech;
    respond(spokenResponse);
    debugRespond(debugJSON);
}

function debugRespond(val) {
    $("#response").text(val);
}

function respond(val) {
    if (val == "") {
        eyesColor("red");
        val = messageSorry;
    }
	eyesColor("green");
    
	if (val !== messageRecording) {
        var msg = new SpeechSynthesisUtterance();
        msg.voiceURI = "native";
        msg.text = val;
        msg.lang = "en-US";
        window.speechSynthesis.speak(msg);
    }
    
	$("#spokenResponse").addClass("is-active").find(".spoken-response__text").html(val);
}