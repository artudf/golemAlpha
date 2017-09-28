function eyesColor(val)
{
	document.getElementById("leftEye").style.backgroundColor = val;
	document.getElementById("rightEye").style.backgroundColor = val;
    setTimeout(function(){
        document.getElementById("leftEye").style.backgroundColor = "white";
	    document.getElementById("rightEye").style.backgroundColor = "white";
    }, 5000)		
}

