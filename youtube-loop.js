var vc_youtubeLoop = vc_youtubeLoop || {

	timeSpan:null,
	playButton:null,
	vctimer:null,
	vcToBeTimer:null,
	vcChangeDetector:null,
	videoUrl:null,


	click: function () {
		if(this.vctimer){
			this.stopLoop();
			this.stopChangeDetector();
		}
		else{
			this.startLoop();
			this.startChangeDetector();
		}
	},

	initiateProperties: function () {
		try{
			var duration = document.getElementsByClassName("ytp-time-duration")[0].innerHTML;
			var timeSpan = (+(duration.split(':')[0]*60)+ (+duration.split(':')[1]))*1000 + 2000;
			var playButton = document.getElementsByClassName("ytp-play-button ytp-button")[0];
			var videoUrl = document.getElementById('player').getElementsByTagName('video')[0].getAttribute('src');
			this.timeSpan = timeSpan;
			this.playButton=playButton;
			this.videoUrl=videoUrl;
		}
		catch(e){};
	},
	stopLoop: function () {
		if(this.vctimer){
			clearInterval(this.vctimer);
			this.vctimer=null;
		}
	},

	startLoop: function () {
		this.stopLoop();
		this.initiateProperties();
		if(!this.timeSpan || !this.playButton){
			this.displayError();
			return;
		}

		if(this.playButton.getAttribute('title') == "Replay"){
			console.log("replay visible");
			this.playButton.click();
			this.setLoop(this.timeSpan);
		}
		else{
			var currentDuration = document.getElementsByClassName("ytp-time-current")[0].innerHTML;
			var timeSpan = this.timeSpan - (+(currentDuration.split(':')[0]*60)+ (+currentDuration.split(':')[1]))*1000;
			if(this.vcToBeTimer)
				clearTimeout(this.vcToBeTimer);
			console.log("setTimeout timeSpan "+ timeSpan);
			this.vcToBeTimer = setTimeout(function () {
				console.log("setTimeout triggered");
				this.playButton.click();
				this.setLoop(this.timeSpan);
			}.bind(this),timeSpan);
		}
	},

	setLoop: function (timeSpan) {
		this.vctimer = setInterval(function () {
			this.loop();
		}.bind(this),timeSpan);
	},
	loop: function () {
		var videoUrl = document.getElementById('player').getElementsByTagName('video')[0].getAttribute('src');
		if(videoUrl==this.videoUrl)
			this.playButton.click();
		else
			this.startLoop();
	},

	startChangeDetector: function () {
		this.stopChangeDetector();
		this.vcChangeDetector = setInterval(function () {
			var videoUrl = document.getElementById('player').getElementsByTagName('video')[0].getAttribute('src');
			if(videoUrl!=this.videoUrl){
				this.videoUrl=videoUrl;
				this.startLoop();
			}
		}.bind(this),15000);
	},
	stopChangeDetector:function () {
		if(this.vcChangeDetector)
			clearInterval(this.vcChangeDetector);
	},

	displayError: function () {
		var errorStr = "Probably because of some changes in youtube, this bookmarklet is not working. Please visit VoidCanvas.com for latest code. Visit Now?";
		var url = "http://voidcanvas.com/repeat-youtube-in-loop/";
		if(confirm(errorStr)){
			window.location.href=url;
		}
	}
};
vc_youtubeLoop.click();
