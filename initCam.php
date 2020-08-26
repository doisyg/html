<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Document sans titre</title>
<script language="JavaScript" src="assets/vendor/jquery/jquery.js"></script>
<script>

// Multiple video
var videoElement = null;
var videoCamHaut = null;
var videoCamBas = null;
var videoCamView = null;
$(document).ready(function(e) {
	videoElement = document.querySelector('video');
	videoCamHaut = document.querySelector('select#cam_haut');
	videoCamBas = document.querySelector('select#cam_bas');
	videoCamView = document.querySelector('select#cam_view');
	
	$('select#cam_view').change(function(e) {
		start();
	});
	
	navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
	
	start();
	
	$('#refresh').click(function(e){
	
		e.preventDefault();
		navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
	});
	
});



function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}

function start() {
  if (window.stream) {
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  var videoSource = videoCamView.value;
  var constraints = {
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  navigator.mediaDevices.getUserMedia(constraints).
      then(gotStream);
}

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  while (videoCamHaut.firstChild) { videoCamHaut.removeChild(videoCamHaut.firstChild); }
  while (videoCamBas.firstChild) { videoCamBas.removeChild(videoCamBas.firstChild); }
  while (videoCamView.firstChild) { videoCamView.removeChild(videoCamView.firstChild); }

  for (var i = 0; i !== deviceInfos.length; ++i) {
	var deviceInfo = deviceInfos[i];
	var option = document.createElement('option');
	option.value = deviceInfo.deviceId;
	if (deviceInfo.kind === 'videoinput') {
	  option.text = deviceInfo.label || 'camera ' + (videoCamHaut.length + 1);
	  videoCamHaut.appendChild(option);
	}
  }
  
  for (var i = 0; i !== deviceInfos.length; ++i) {
	var deviceInfo = deviceInfos[i];
	var option = document.createElement('option');
	option.value = deviceInfo.deviceId;
	if (deviceInfo.kind === 'videoinput') {
	  option.text = deviceInfo.label || 'camera ' + (videoCamBas.length + 1);
	  videoCamBas.appendChild(option);
	}
  }
  
  var option = document.createElement('option');
  option.value = '';
  option.text = 'None';
  videoCamView.appendChild(option);

  
  for (var i = 0; i !== deviceInfos.length; ++i) {
	var deviceInfo = deviceInfos[i];
	var option = document.createElement('option');
	option.value = deviceInfo.deviceId;
	if (deviceInfo.kind === 'videoinput') {
	  option.text = deviceInfo.label || 'camera ' + (videoCamView.length + 1);
	  videoCamView.appendChild(option);
	}
  }
  
}

				
function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

</script>
</head>

<body>


<form method="post">
<p>
<label for="cam_haut">Caméra client</label>
<select id="cam_haut" name="cam_haut"></select>
</p>

<p>
<label for="cam_bas">Caméra navigation</label>
<select id="cam_bas" name="cam_bas"></select>
</p>

<p><input type="submit" value="Sauver" /></p>

<p><a href="#" id="refresh">Refresh</a></p>

</form>

<div>

<p>
<label for="cam_view">Visualisation des caméras</label>
<select id="cam_view" name="cam_view"></select>
</p>

<video autoplay="" id="video"></video>

</div>

</body>
</html>

