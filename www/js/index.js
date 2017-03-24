var app = {
	config: {
			'workflow':'pspspspl',
			'pomodoroDuration':25,
			'shortPauseDuration':5,
			'longPauseDuration':15
	},
	initialize: function() {
		app.states = {
			'pomodoro': {'length':app.config.pomodoroDuration*60*1000,'displayedStatus':'Work hard now !','nextStepMsgs':'Working hard !'},
			'shortPause': {'length':app.config.shortPauseDuration*60*1000,'displayedStatus':'You deserve a short break...','nextStepMsg':'Take a short break ?'},
			'longPause': {'length':app.config.longPauseDuration*60*1000,'displayedStatus':'You deserve a long break...','nextStepMsg':'Take a LONG break !'}
		};
		app.workflowPosition = 0;
		app.state = 'pomodoro';
		app.nextMsg = '';
		numberOfPom = (app.config.workflow.match(/p/g) || []).length;
		pomsHtml='';
		for(i=1;i<=numberOfPom;i++) {
			pomsHtml+='<span id="pomo'+i+'" class="green pomodoro glyphicon glyphicon-apple" aria-label="Pomodoro"></span>';
		}
		$('#littlePoms').html(pomsHtml);
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
		$('#newBtn').focus();
	},
	getNextStateChar: function(position){
		if (position >= app.config.workflow.length) {
			position=0;
		}
		return app.config.workflow.charAt(position);
	},
	changeState: function(state){
		app.state = state;
		window.clearInterval(app.countdowner);
		app.remainingTime = app.states[state]['length'];
		app.updateTimer();
		app.updateTimerUI();
		app.countdowner = setInterval(app.countdown,1000);
	},
	updateTimer: function(){
		seconds = app.remainingTime/1000;
		app.minutes = Math.floor(seconds/60);
		app.seconds = seconds-app.minutes*60;
	},
	updateTimerUI: function(){
		seconds = (app.seconds.toString().length>1) ? app.seconds : '0'+app.seconds;
		$('#chrono').html(app.minutes+':'+seconds);
		document.title = app.minutes+':'+seconds;
		$('#status').html(app.states[app.state]['displayedStatus']);
		green = Math.floor(app.remainingTime/app.states[app.state]['length']*100);
		red = 100-green;
		$('#mainpomodoro').css('color','rgb('+red+'%,'+green+'%,0%)');
	},
	countdown: function(){
		app.remainingTime-=1000;
		app.updateTimer();
		app.updateTimerUI();
		if (app.remainingTime<=0){
			app.timeends();
		}
	},
	timeends: function(){
		window.clearInterval(app.countdowner);
		app.countdowner= false;
		app.workflowPositionIncrement();
		$('#status').html(app.states[app.state]['displayedStatus']);
		subWorkflow = app.config['workflow'].substring(0,app.workflowPosition);
		numberOfPom = (subWorkflow.match(/p/g) || []).length;
		$('.pomodoro').removeClass('red');
		$('.pomodoro').addClass('green');
		for (i=1;i<=numberOfPom;i++) {
			$('#pomo'+i).removeClass('green');
			$('#pomo'+i).addClass('red');
		}
		navigator.vibrate(200);
		navigator.notification.beep(1);
		navigator.notification.alert('Time ends... what to do next ?');
	},
	workflowPositionIncrement: function(){
		app.workflowPosition++;
		if (app.workflowPosition >= app.config.workflow.length) {
			app.workflowPosition = 0;
		}
		app.setWorkflowState(app.config.workflow.charAt(app.workflowPosition));
	},
	setWorkflowState: function(state){
		$('.buttons button').removeClass('next');
		switch(state){
			case 'p':
				$('#newBtn').addClass('next');
				$('#newBtn').focus();
				break;
			case 's':
				$('#shortPauseBtn').addClass('next');
				$('#shortPauseBtn').focus();
				break;
			case 'l':
				$('#longPauseBtn').addClass('next');
				$('#longPauseBtn').focus();
				break;
			default:
				throw "Workflow broken, undefined state.";
				break;
		}
	}
};
app.initialize();

if (typeof navigator.notification == 'undefined') {
	navigator.notification = {
		'alert': function(arg){alert(arg);},
		'beep': function(arg){console.log('Beep: '+arg);}
	}
}
if (typeof navigator.vibrate == 'undefined') {
	navigator.vibrate = function(arg){console.log('Vibrate: '+arg);};
}
