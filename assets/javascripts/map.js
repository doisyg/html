// JavaScript Document
var isDown = false;

var largeurSlam = 0;
var hauteurSlam = 0;
var largeurRos = 0;
var hauteurRos = 0;

var start = true;

function distance(x1, y1, x2, y2)
{
    return Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

function diff(x, y) {
	var centerItem = $('#robotDestination'),Fin
		centerLoc = centerItem.offset();
	var dx = x - (centerLoc.left + (centerItem.width() / 2));
		dy = y - (centerLoc.top + (centerItem.height() / 2));
	return Math.atan2(dy, dx) * (180 / Math.PI);
}

var svgTemp;
var svgData;
var imgForSVG;

var canvas;
var canvasWidth;
var canvasHeight;
var ctx;
var canvasData;
var zoom = 1.5;

var ros_largeur = 0;
var ros_hauteur = 0;
var ros_resolution = 5;

var positions = Array();

var xObject = 0;
var yObject = 0;

var zoom_carte = 1;

var nextIdArea = 300000;
var nextIdDock = 300000;
var nextIdPoi = 300000;
var forbiddens = Array();
var areas = Array();
var gommes = Array();
var docks = Array();
var pois = Array();

var blockZoom = false;

function GetInfosCurrentMap()
{
	$.ajax({
		type: "POST",
		url: 'ajax/install_by_step_get_infos_map.php',
		data: {
			id_map: id_map_last
		},
		dataType: 'json',
		success: function(data) {
			id_map_last = data.id_map;
			id_map = data.id_map;
							
			forbiddens = data.forbiddens;
			areas = data.areas;
			gommes = Array();
			docks = data.docks;
			pois = data.pois;
			
			$('#install_by_step_edit_map_zoom_carte .img-responsive').attr('src', 'data:image/png;base64,'+data.plan.image_tri);
			
			largeurSlam = data.plan.ros_width;
			hauteurSlam = data.plan.ros_height;
			largeurRos = data.plan.ros_width;
			hauteurRos = data.plan.ros_height;
			
			ros_largeur = data.plan.ros_width;
			ros_hauteur = data.plan.ros_height;
			ros_resolution = data.plan.ros_resolution;
			
			$('#install_by_step_edit_map_svg').attr('width', data.plan.ros_width);
			$('#install_by_step_edit_map_svg').attr('height', data.plan.ros_height);
			
			$('#install_by_step_edit_map_image').attr('width', data.plan.ros_width);
			$('#install_by_step_edit_map_image').attr('height', data.plan.ros_height);
			$('#install_by_step_edit_map_image').attr('xlink:href', 'data:image/png;base64,'+data.plan.image_tri);
		  
			$('#install_by_step_mapping_use .bUseThisMapNowYes').show();
			$('#install_by_step_mapping_use .bUseThisMapNowNo').show();
			$('#install_by_step_mapping_use .modalUseThisMapNowTitle1').show();
			$('#install_by_step_mapping_use .modalUseThisMapNowTitle2').hide();
			$('#install_by_step_mapping_use .modalUseThisMapNowContent').hide();
			
			InitMap();
		},
		error: function(e) {
			alert(e.responseText);
		}
	});
}


function DisplayBlockZoom()
{
	if (blockZoom)
	{
		//svgData = new XMLSerializer().serializeToString(svgTemp);
		//imgForSVG.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
		p = document.getElementById("install_by_step_edit_map_svg"); 
		p_prime = p.cloneNode(true);
		p_prime.id = "install_by_step_edit_map_svg_clone";
		$('#zoom_popup_content').html('');
		document.getElementById('zoom_popup_content').appendChild(p_prime);
		
		$('#install_by_step_edit_map_svg_clone').width(ros_largeur);
		$('#install_by_step_edit_map_svg_clone').height(ros_hauteur);
					
		p = $('#install_by_step_edit_map_svg image').position();
		x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
		y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;

		zoom = ros_largeur / $('#svg').width() / window.panZoom.getZoom();
		/*
		$('#img_svg').css('left',(-x*zoom) * 10 + 50);
		$('#img_svg').css('top', (-y*zoom) * 10 + 50);
		*/
		
		$('#install_by_step_edit_map_svg_clone').css('left', -event.targetTouches[0].pageX + 50 + 2);
		$('#install_by_step_edit_map_svg_clone').css('top', -event.targetTouches[0].pageY + 50 + $('#install_by_step_edit_map_container_all').position().top + 23);
		
		l = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) + 50;
		if (l + 101 > $('#install_by_step_edit_map_container_all').width() - 20) l -= 200;
		t = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - 150;
		if (t + 101 > $('body').height() - 20) t -= 100;
		if (t < 20) t = 20;
		$('#zoom_popup').css('left', l);
		$('#zoom_popup').css('top', t);
		$('#zoom_popup').show();
		/*
		
		$('#svg_copy').html($('#svg .svg-pan-zoom_viewport').html());
		
		p = $('#svg image').position();
		x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
		y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
		
		zoom = ros_largeur / $('#svg').width() / window.panZoom.getZoom();
				
		$('#svg_copy').css('left', -x*zoom + 50);
		$('#svg_copy').css('top', -y*zoom + 50);
		
		$('#zoom_popup').css('left', (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) + 50);
		$('#zoom_popup').css('top', (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - 150);
		$('#zoom_popup').show();
		*/
	}
	else
	{
		$('#zoom_popup').hide();
	}
}

var timerLongPress = null;
var timerVeryLongPress = null;
var eventTouchStart = null;
var currentPointLongTouch = null;

$(document).ready(function(e) {
	$('.popupHelp').click(function(e) {
        e.preventDefault();
		$(this).hide(200);
    });
	$('#install_by_step_edit_map_svg').on('touchend', function(e) { 
		$('#zoom_popup').hide();
		if (timerLongPress != null)
		{
			clearTimeout(timerLongPress);
			timerLongPress = null;
		}
		if (timerVeryLongPress != null)
		{
			clearTimeout(timerVeryLongPress);
			timerVeryLongPress = null;
		}
	});
	$('#install_by_step_edit_map_svg').on('touchstart', function(e) {
		
		if (timerLongPress != null)
		{
			clearTimeout(timerLongPress);
			timerLongPress = null;
		}
		if (timerVeryLongPress != null)
		{
			clearTimeout(timerVeryLongPress);
			timerVeryLongPress = null;
		}
		
		if (canChangeMenu)
		{
			timerLongPress = setTimeout(LongPressSVG, 500);
			timerVeryLongPress = setTimeout(LongVeryPressSVG, 1500);
			eventTouchStart = e;
		}
		DisplayBlockZoom();
		
		HideMenus();
		
	});
    $('#install_by_step_edit_map_svg').on('touchmove', function(e) {
		HideMenus();
		if (timerLongPress != null)
		{
			clearTimeout(timerLongPress);
			timerLongPress = null;
		}
		if (timerVeryLongPress != null)
		{
			clearTimeout(timerVeryLongPress);
			timerVeryLongPress = null;
		}
		DisplayBlockZoom();
	});
	
	
	$(document).on('touchend', '#install_by_step_edit_map_svg .point_deletable', function(e) {
		$('#zoom_popup').hide();
		if (timerLongPress != null)
		{
			clearTimeout(timerLongPress);
			timerLongPress = null;
		}
		if (timerVeryLongPress != null)
		{
			clearTimeout(timerVeryLongPress);
			timerVeryLongPress = null;
		}
	});
	$(document).on('touchstart', '#install_by_step_edit_map_svg .point_deletable', function(e) {
		if (timerLongPress != null)
		{
			clearTimeout(timerLongPress);
			timerLongPress = null;
		}
		if (timerVeryLongPress != null)
		{
			clearTimeout(timerVeryLongPress);
			timerVeryLongPress = null;
		}
		
		if (canChangeMenu || currentAction == 'editForbiddenArea' || currentAction == 'editArea')
		{
			timerLongPress = setTimeout(LongPressPointDeletable, 500);
			//timerVeryLongPress = setTimeout(LongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentPointLongTouch = $(this);
		}
		DisplayBlockZoom();
		
		HideMenus();
		
	});
	$(document).on('touchmove', '#install_by_step_edit_map_svg .point_deletable', function(e) {
    	HideMenus();
		if (timerLongPress != null)
		{
			clearTimeout(timerLongPress);
			timerLongPress = null;
		}
		if (timerVeryLongPress != null)
		{
			clearTimeout(timerVeryLongPress);
			timerVeryLongPress = null;
		}
		DisplayBlockZoom();
	});
});

function HideMenus()
{
	$('#install_by_step_edit_map_menu li').hide();
	$('#install_by_step_edit_map_menu_point li').hide();
	$('.popupHelp').hide();
}

function DisplayMenu(id_menu)
{
	$('#'+id_menu+' li').hide();
	$('#'+id_menu).show();

	topCenter = eventTouchStart.originalEvent.targetTouches[0].clientY - $('#install_by_step_edit_map_container_all').offset().top;
	leftCenter = eventTouchStart.originalEvent.targetTouches[0].clientX - $('#install_by_step_edit_map_container_all').offset().left;
	
	$('#'+id_menu).css({top: topCenter, left: leftCenter});
	
	rayon = 70;
	
	decallageX = 0;
	decallageY = 0;
	angleDep = 21;
	
	if (leftCenter > $('#install_by_step_edit_map_container_all').width() - 100)
		angleDep += 180;
	
	minLeft = 10000;
	maxLeft = -100;
	minTop = 10000;
	maxTop = -100;
	
	$('#'+id_menu+' li').each(function(index, element) {
		angle = (angleDep + 48*index) * Math.PI/180;
		// x = rsin(θ), y = rcos(θ)
		l = rayon * Math.sin(angle) - 25;
		t = rayon * Math.cos(angle) - 25;
		
		if (l < minLeft) minLeft = l;
		if (l > maxLeft) maxLeft = l;
		if (t < minTop) minTop = t;
		if (t > maxTop) maxTop = t;
		
		$(this).css({left: l, top: t});
		$(this).delay(100*index).fadeIn();
    });
		
	if (leftCenter - 25 + minLeft < 20)
		decallageX = 20 - (leftCenter - 25 + minLeft);
	if (leftCenter + maxLeft + 50 > $('#install_by_step_edit_map_container_all').width() - 20)
		decallageX = ($('#install_by_step_edit_map_container_all').width() - 20) - (leftCenter + maxLeft + 50);
	
	if (topCenter + minTop < 20)
		decallageY = 20 - (topCenter + minTop);
	if (topCenter + maxTop + 50 > $('#install_by_step_edit_map_container_all').height() - 20)
		decallageY = ($('#install_by_step_edit_map_container_all').height() - 20) - (topCenter + maxTop + 50);
		
	if (decallageX != 0 || decallageY != 0)
	{
		$('#'+id_menu+' li').each(function(index, element) {
			$(this).css({left: '+='+decallageX, top: '+='+decallageY});
    	});
	}
}

function LongPressPointDeletable()
{
	timerLongPress = null;
	DisplayMenu('install_by_step_edit_map_menu_point');
}

function LongVeryPressSVG()
{
	timerVeryLongPress = null;
	
	$('#install_by_step_edit_map_container_all .popupHelp').show(200);	
}

function LongPressSVG()
{
	timerLongPress = null;
	DisplayMenu('install_by_step_edit_map_menu');
}

function InitMap()
{
	var eventsHandler;

	eventsHandler = {
	  haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel']
	, init: function(options) {
		var instance = options.instance
		  , initialScale = 1
		  , pannedX = 0
		  , pannedY = 0

		// Init Hammer
		// Listen only for pointer and touch events
		this.hammer = Hammer(options.svgElement, {
		  inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
		})

		// Enable pinch
		this.hammer.get('pinch').set({enable: true})

		// Handle double tap
		this.hammer.on('doubletap', function(ev){
		  instance.zoomIn()
		})

		// Handle pan
		this.hammer.on('panstart panmove', function(ev){
		  // On pan start reset panned variables
		  if (ev.type === 'panstart') {
			pannedX = 0
			pannedY = 0
		  }

		  // Pan only the difference
		  instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY})
		  pannedX = ev.deltaX
		  pannedY = ev.deltaY
		})

		// Handle pinch
		this.hammer.on('pinchstart pinchmove', function(ev){
		  // On pinch start remember initial zoom
		  if (ev.type === 'pinchstart') {
			initialScale = instance.getZoom()
			instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y})
		  }

		  instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y})
		})
		// Prevent moving the page on some devices when panning over SVG
		options.svgElement.addEventListener('touchmove', function(e){ /*e.preventDefault(); */ });
	  }

	, destroy: function(){
		this.hammer.destroy()
	  }
	}

	// Expose to window namespace for testing purposes
	
	window.panZoom = svgPanZoom('#install_by_step_edit_map_svg', {
	  zoomEnabled: true
	, controlIconsEnabled: false
	, maxZoom: 20
	, fit: 1
	, center: 1
	, customEventsHandler: eventsHandler
	, RefreshMap: function() { setTimeout(RefreshZoomView, 10); }
	});
	
	svg = document.querySelector('.svg-pan-zoom_viewport');
	
	//window.panZoom = {};
	//window.panZoom.getZoom = function () { return 1; }
	RefreshZoomView();
}