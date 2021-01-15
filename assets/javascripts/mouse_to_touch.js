// JavaScript Document
var mouseDownActive = false;

function mouseHandler(event)
{
	if (event.target.tagName == 'SELECT') return;
	if (event.target.tagName == 'INPUT') return;
	if (event.target.tagName == 'TEXTAREA') return;
	
	let cn = event.target.className.split(' ');
    if(cn.includes('ui-slider-handle')) return;
	
	var touches = event.changedTouches,
		eventType = "";
	switch(event.type)
	{
		case "mousedown": mouseDownActive = true; eventType = "touchstart"; break;
		case "mousemove": if(!mouseDownActive) return;  eventType = "touchmove"; break;        
		case "mouseup": mouseDownActive = false;   eventType = "touchend";   break;
		default:           return;
	}
	
	if (typeof(Touch) != 'undefined')
	{
		const touchObj = new Touch({
			identifier: Date.now(),
			target: event.target,
			clientX: event.clientX,
			clientY: event.clientY,
			screenX: event.screenX,
			screenY: event.screenY,
			pageX: event.pageX,
			pageY: event.pageY,
			radiusX: 2.5,
			radiusY: 2.5,
			rotationAngle: 10,
			force: 0.5,
		  });
		  
		   const touchEvent = new TouchEvent(eventType, {
			cancelable: true,
			bubbles: true,
			touches: [touchObj],
			targetTouches: [touchObj],
			changedTouches: [touchObj],
			shiftKey: false,
		  });
		
		  event.target.dispatchEvent(touchEvent);
		event.preventDefault();
	}
	else
	{
		const touchObj = {
			identifier: Date.now(),
			target: event.target,
			clientX: event.clientX,
			clientY: event.clientY,
			screenX: event.screenX,
			screenY: event.screenY,
			pageX: event.pageX,
			pageY: event.pageY,
			radiusX: 2.5,
			radiusY: 2.5,
			rotationAngle: 10,
			force: 0.5,
		  };
		  
		   const touchEvent = new Event(eventType, {
			cancelable: true,
			bubbles: true,
			touches: [touchObj],
			targetTouches: [touchObj],
			changedTouches: [touchObj],
			shiftKey: false,
		  });
		  
		  touchEvent.touches = [touchObj];
	      touchEvent.targetTouches = [touchObj];
		  touchEvent.changedTouches = [touchObj];
		
		  event.target.dispatchEvent(touchEvent);
		event.preventDefault();
	}
		 
	
}

function initMouseEventListener() 
{
	document.addEventListener("mousedown", mouseHandler, true);
	document.addEventListener("mousemove", mouseHandler, true);
	document.addEventListener("mouseup", mouseHandler, true);
}


$(document).ready(function(e) {
    initMouseEventListener();
});