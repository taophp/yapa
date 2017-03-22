var app = {
	initialize: function() {
		app.config = {
			'workflow':'pspspspl',
			'pomodoroDuration':.25,
			'shortPauseDuration':.25,
			'longPauseDuration':.15
		};
		app.states = {
			'pomodoro': {'length':app.config.pomodoroDuration*60*1000,'displayedStatus':'Work hard now !','nextStepMsgs':'Working hard !'},
			'shortPause': {'length':app.config.shortPauseDuration*60*1000,'displayedStatus':'You deserve a short break...','nextStepMsg':'Take a short break ?'},
			'longPause': {'length':app.config.longPauseDuration*60*1000,'displayedStatus':'You deserve a long break...','nextStepMsg':'Take a LONG break !'}
		};
		app.workflowPosition = 0;
		app.state = 'pomodoro';
		app.nextMsg = '';
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
		subWorkflow = app.config['workflow'].substring(0,app.workflowPosition);
		navigator.notification.alert(subWorkflow);
		navigator.vibrate(200);
		navigator.notification.beep(1);
		navigator.notification.alert('Time ends... what to do next ?');
		app.workflowPositionIncrement();
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
				break;
			case 's':
				$('#shortPauseBtn').addClass('next');
				break;
			case 'l':
				$('#LongPauseBtn').addClass('next');
				break;
			default:
				throw "Workflow broken, undefined state.";
				break;
		}
	}
};
app.initialize();
