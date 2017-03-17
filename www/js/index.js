var app = {
	// Application Constructor
	initialize: function() {
		app.updateTimer = function(){
			seconds = app.pomRemainingTime/1000;
			app.minutes = Math.floor(seconds/60);
			app.seconds = seconds-app.minutes*60;
		};
		app.updateTimerUI = function(){
			$('#chrono').html(app.minutes+':'+app.seconds);
		};
		app.countdown = function(){
			app.pomRemainingTime-=1000;
			app.updateTimer();
			app.updateTimerUI();
		};
		$('#newBtn').click(function(e){
			app.pomState = 'running';
			app.pomRemainingTime = 25*60*1000;
			app.countdowner = setInterval(app.countdown,1000);	
		});
		$('#shortPauseBtn').click(function(e){
			console.log(e.currentTarget.id); 	
		});
		$('#longPauseBtn').click(function(e){
			console.log(e.currentTarget.id); 	
		});
		$('#interruptBtn').click(function(e){
			console.log(e.currentTarget.id); 	
		});
		$('#restartBtn').click(function(e){
			console.log(e.currentTarget.id); 	
		});
		$('#parametersBtn').click(function(e){
			console.log(e.currentTarget.id); 	
		});
			//document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	},

	// deviceready Event Handler
	//
	// Bind any cordova events here. Common events are:
	// 'pause', 'resume', etc.
	//onDeviceReady: function() {
	//    this.receivedEvent('deviceready');
	//~ },

	// Update DOM on a Received Event
	//~ receivedEvent: function(id) {
			//~ var parentElement = document.getElementById(id);
			//~ var listeningElement = parentElement.querySelector('.listening');
			//~ var receivedElement = parentElement.querySelector('.received');

			//~ listeningElement.setAttribute('style', 'display:none;');
			//~ receivedElement.setAttribute('style', 'display:block;');

			//~ console.log('Received Event: ' + id);
	//~ }
};

app.initialize();
