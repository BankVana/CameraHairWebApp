var constraints_ind = 0;
var constraints_list = ['environment','user'];

// Put event listeners into place
		window.addEventListener("DOMContentLoaded", function() {
			// Grab elements, create settings, etc.
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            var video = document.getElementById('video');
            var mediaConfig =  { video: true };
            var errBack = function(e) {
            	console.log('An error has occurred!', e)
            };
			
			navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia || 
                            navigator.msGetUserMedia);

			// Put video listeners into place
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
				var constraints = {
					advanced: [{
						facingMode: constraints_list[constraints_ind]
					}]
				};
				navigator.mediaDevices
					.getUserMedia({
						video: constraints
					})
					.then(function(mediaStream) {
						window.stream = mediaStream;
						video.src = window.URL.createObjectURL(mediaStream);
						video.play();
					});
            }

            /* Legacy code below! */
            else if(navigator.getUserMedia) { // Standard
				var constraints = {
					advanced: [{
						facingMode: constraints_list[constraints_ind]
					}]
				};
				navigator.getUserMedia(mediaConfig, function(localMediaStream) {
					video.src = window.URL.createObjectURL(localMediaStream);
					video.play();
				}, errBack);
			} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
				navigator.webkitGetUserMedia(mediaConfig, function(stream){
					video.src = window.webkitURL.createObjectURL(stream);
					video.play();
				}, errBack);
			} else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
				navigator.mozGetUserMedia(mediaConfig, function(stream){
					video.src = window.URL.createObjectURL(stream);
					video.play();
				}, errBack);
			}
			else {
				alert('Sorry, your browser does not support getUserMedia');
			}

			// Trigger photo take
			document.getElementById('snap').addEventListener('click', function() {
				var canvas = document.createElement("canvas");
				canvas.width = video.width;
				canvas.height = video.height;
				canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
				var pngList = document.getElementById("pngHolder");
				if (pngList.hasChildNodes()){
					pngList.removeChild(pngList.firstChild);
				}
				document.getElementById("pngHolder").appendChild(convertCanvasToImage(canvas));
			});
			
			// Converts canvas to an image
			function convertCanvasToImage(canvas) {
				var image = new Image();
				image.src = canvas.toDataURL("image/png");
				return image;
			}
		}, false);
		
		function change_camera() {
		    constraints_ind = ++constraints_ind % 2;
		}