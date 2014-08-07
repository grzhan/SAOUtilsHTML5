$=jQuery;
var debug = false;
var dcount = 0;

var dStartPosX = 0;
var dStartPosY = 0;


Hammer($('body')[0], {
	behavior: {
		userSelect:true
	}
}).on("dragstart", function(event) {
	if (event.gesture.touches[0].ctrlKey){
		$('body').css('-webkit-user-select','none');
		$('body').css('-moz-user-select','none');
		$('body').css('-ms-user-select','none');
		dStartPosX = event.gesture.center.clientX;
		dStartPosY = event.gesture.center.clientY;
	}
});

Hammer($('body')[0], {
	behavior: {
		userSelect:true
	}
}).on("dragend", function(event) {
	$('body').css('-webkit-user-select','auto');
	$('body').css('-moz-user-select','auto');
	$('body').css('-ms-user-select','auto');
	if (event.gesture.touches[0].ctrlKey
	&& event.gesture.direction === "down"
	&& event.gesture.distance > 100) {
    	// sao_overlay_toggle();
    	Menu.toggle();
	}
	if (debug) {
		dragendEventDebug(event.gesture);
	}
});

function dragendEventDebug(gesture) {
	dcount += 1;
	console.log('=====================================');
	console.log('('+ dcount + ')' + 'DRAGEND Event Triggered: ');
	console.log("Delta Time: " + gesture.deltaTime);
	console.log("Distance: " + gesture.distance);
	console.log("Direction: " + gesture.direction);
	console.log("Delta X: " + gesture.deltaX);
	console.log("Delta Y: " + gesture.deltaY);
	console.log("dStartPosX: " + dStartPosX);
	console.log("dStartPosY: " + dStartPosY);
	console.log(gesture);
}
