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

            function detectmob() { 
				 if( navigator.userAgent.match(/Android/i)
				 || navigator.userAgent.match(/webOS/i)
				 || navigator.userAgent.match(/iPhone/i)
				 || navigator.userAgent.match(/iPad/i)
				 || navigator.userAgent.match(/iPod/i)
				 || navigator.userAgent.match(/BlackBerry/i)
				 || navigator.userAgent.match(/Windows Phone/i)
				 ){
					return true;
				  }
				 else {
					return false;
				  }
			}

			
			navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia || 
                            navigator.msGetUserMedia);

			//chrome on android
			/*
			if(detectmob() && navigator.userAgent.toLowerCase().indexOf('chrome') >= 0){
				let handleStream = s => {
					document.body.append(
						Object.assign(document.createElement('video'), {
							autoplay: true,
							mozSrcObject: s,
							srcObject: s
						})
					);
				}
				navigator.mediaDevices.enumerateDevices().then(
					function(devices) {
						let sourceId = null;
						// enumerate all devices
						for (var device of devices) {
						 // if there is still no video input, or if this is the rear camera
						 if (device.kind == 'videoinput' &&
						   (!sourceId || device.label.indexOf('back') !== -1)) {
						   sourceId = device.deviceId;
						 }
						}
						// we didn't find any video input
						if (!sourceId) {
						 throw 'no video input';
						}
						let constraints = {
						 video: {
						   sourceId: sourceId
						 }
						};
						navigator.mediaDevices.getUserMedia(constraints)
						 .then(handleStream){
						window.stream = handleStream;
						video.src = window.URL.createObjectURL(handleStream);
						video.play();
						}
					}
				);

			}
			*/

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
				if(detectmob() && navigator.userAgent.toLowerCase().indexOf('firefox') >= 0){//} && navigator.userAgent.toLowerCase().indexOf('firefox') >= 0){
					//flipHorizontally(video, 0, 0);
					//move to x + img.width
					canvas.getContext('2d').translate(0, video.height);
				
					//scale x by -1; this trick flips horizontally
					canvas.getContext('2d').scale(1,-1);
				}
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
			/*
			function flipHorizontally(img,x,y) {
				//move to x + img.width
				canvas.getContext('2d').translate(x+img.width, y);
				
				//scale x by -1; this trick flips horizontally
				canvas.getContext('2d').scale(-1, 1);
				
			}
			*/
		}, false);
		
		function change_camera() {
		    constraints_ind = ++constraints_ind % 2;
		}