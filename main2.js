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
			
			function flipHorizontallt(img,x,y) {
				//move to x + img.width
				canvas.getContext('2d').translate(x+img.width, y);
				
				//scale x by -1; this trick flips horizontally
				canvas.getContext('2d').scale(-1, 1);
				
			}
			
			navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia || 
                            navigator.msGetUserMedia);

			// Put video listeners into place
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            	/*
				var constraints = {
					advanced: [{
						facingMode: {exact : 'environment'}
					}]
				};
				navigator.mediaDevices
					.getUserMedia({
						video: {
						facingMode: {exact : 'environment'}
					}
					})
					.then(function(mediaStream) {
						window.stream = mediaStream;
						video.src = window.URL.createObjectURL(mediaStream);
						video.play();
					});
				*/
				navigator.mediaDevices.enumerateDevices().then(
					function(devices) {
						let sourceId = null;
						var id_test = 0;
						// enumerate all devices
						for (var device of devices) {
						 // if there is still no video input, or if this is the rear camera
						 if (device.kind == 'videoinput')// &&
						   //(!sourceId || device.label.indexOf('back') !== -1)) 
						   {
						   if(id_test == constraints_ind){sourceId = device.deviceId;}
						   ++id_test;
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
						 .then(handleStream);
						}
					);

            }

            /* Legacy code below! */
            else if(navigator.getUserMedia) { // Standard
				var constraints = {
					advanced: [{
						facingMode: constraints_list[constraints_ind]
					}]
				};
				navigator.getUserMedia(video: {
						facingMode: {exact : 'environment'}
					}, function(localMediaStream) {
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
				//flipHorizontally(video, 0, 0);
				if(detectmob()){
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
				
				//always clean up - reset transformation to default
				canvas.getContext('2d').setTransform(1,0,0,1,0,0);
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