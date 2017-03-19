var app = {
	// Application Constructor
	initialize: function() {
		app.states = {
			'pomodoro': {'length':25*60*1000,'displayedStatus':'Work hard now !'},
			'shortPause': {'length':5*60*1000,'displayedStatus':'You deserve a short break...'},
			'longPause': {'length':15*60*1000,'displayedStatus':'You deserve a long break...'}
		};
		app.updateTimer = function(){
			seconds = app.remainingTime/1000;
			app.minutes = Math.floor(seconds/60);
			app.seconds = seconds-app.minutes*60;
		};
		app.updateTimerUI = function(){
			seconds = (app.seconds.toString().length>1) ? app.seconds : '0'+app.seconds;
			$('#chrono').html(app.minutes+':'+seconds);
			$('#status').html(app.states[app.state]['displayedStatus']);
		};
		app.countdown = function(){
			app.remainingTime-=1000;
			app.updateTimer();
			app.updateTimerUI();
			if (app.remainingTime<=0){
				app.timeends();
			}
		};
		app.timeends = function(){
			window.clearInterval(app.countdowner);
			app.countdowner= false;
			navigator.vibrate(200);
			navigator.notification.beep(1);
			navigator.notification.alert('Time ends... what to do next ?');
		};
		app.changeState = function(state){
			app.state = state;
			window.clearInterval(app.countdowner);
			app.remainingTime = app.states[state]['length'];
			app.updateTimer();
			app.updateTimerUI();
			app.countdowner = setInterval(app.countdown,1000);
		};
		$('#newBtn').click(function(){app.changeState('pomodoro');});
		$('#shortPauseBtn').click(function(){app.changeState('shortPause');});
		$('#longPauseBtn').click(function(){app.changeState('longPause');});
		$('#interruptBtn').click(function(e){
			$('#interruptBtn > span').toggleClass('glyphicon-pause glyphicon-play');
			if (app.countdowner) {
				window.clearInterval(app.countdowner);
				app.countdowner= false;
			}else{
				app.countdowner = setInterval(app.countdown,1000);
			}
		});
		$('#restartBtn').click(function(e){
			app.remainingTime = app.states[app.state]['length'];
			app.updateTimer();
			app.updateTimerUI();
		});
		$('#parametersBtn').click(function(e){
			navigator.notification.alert('Not yet implemented...',function(){},'WTF?!?');
		});
	},
};

app.initialize();
