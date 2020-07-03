// JavaScript Document
var isDown = false;

var largeurSlam = 0;
var hauteurSlam = 0;
var largeurRos = 0;
var hauteurRos = 0;

var start = true;

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
var gotoTest = false;

function GetInfosCurrentMapManager()
{
	if (wycaApi.websocketAuthed)
	{
		GetInfosCurrentMapDoManager();
	}
	else
	{
		setTimeout(GetInfosCurrentMapManager, 500);
	}
}

function GetInfosCurrentMapDoManager()
{
	wycaApi.GetCurrentMapComplete(function(data) {
		if (data.A == wycaApi.AnswerCode.NO_ERROR)
		{
			console.log(data.D); 
			id_map = data.D.id_map;
			id_map_last = data.D.id_map;
			
			forbiddens = data.D.forbiddens;
			areas = data.D.areas;
			gommes = Array();
			docks = data.D.docks;
			pois = data.D.pois;
			
			$('#manager_edit_map_zoom_carte .img-responsive').attr('src', 'data:image/png;base64,'+data.D.image_tri);
			
			largeurSlam = data.D.ros_width;
			hauteurSlam = data.D.ros_height;
			largeurRos = data.D.ros_width;
			hauteurRos = data.D.ros_height;
			
			ros_largeur = data.D.ros_width;
			ros_hauteur = data.D.ros_height;
			ros_resolution = data.D.ros_resolution;
			
			$('#manager_edit_map_svg').attr('width', data.D.ros_width);
			$('#manager_edit_map_svg').attr('height', data.D.ros_height);
			
			$('#manager_edit_map_image').attr('width', data.D.ros_width);
			$('#manager_edit_map_image').attr('height', data.D.ros_height);
			$('#manager_edit_map_image').attr('xlink:href', 'data:image/png;base64,'+data.D.image_tri);
		  
			$('#manager_mapping_use .bUseThisMapNowYes').show();
			$('#manager_mapping_use .bUseThisMapNowNo').show();
			$('#manager_mapping_use .modalUseThisMapNowTitle1').show();
			$('#manager_mapping_use .modalUseThisMapNowTitle2').hide();
			$('#manager_mapping_use .modalUseThisMapNowContent').hide();
			
			managerHistoriques = Array();
			managerHistoriqueIndex = -1;
			ManagerRefreshHistorique();
			
			setTimeout(function(){
				ManagerInitMap();
				ManagerResizeSVG();			
			},500); 
			
			
			if (gotoTest) InitTest();
			
			gotoTest = false;
		}
		else
		{
			alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
		}
	});
}

function GetDataMapToSave()
{
	data = {};
	
	data.forbiddens = forbiddens;
	$.each(data.forbiddens, function(indexInArray, forbidden){
		if (forbidden.id_area >= 300000)
		{
			data.forbiddens[indexInArray].id_area = -1;
		}
	});
	data.areas = areas;
	$.each(data.areas, function(indexInArray, area){
		if (area.id_area >= 300000)
		{
			data.areas[indexInArray].id_area = -1;
		}
	});
	data.gommes = gommes;
	data.docks = docks;
	$.each(data.docks, function(indexInArray, dock){
		if (dock.id_docking_station >= 300000)
		{
			data.docks[indexInArray].id_docking_station = -1;
		}
	});
	data.pois = pois;
	$.each(data.pois, function(indexInArray, poi){
		if (poi.id_poi >= 300000)
		{
			data.pois[indexInArray].id_poi = -1;
		}
	});
	
	return data;
}

function ManagerDisplayBlockZoom()
{
	if (blockZoom)
	{
		p = document.getElementById("manager_edit_map_svg"); 
		p_prime = p.cloneNode(true);
		p_prime.id = "manager_edit_map_svg_clone";
		$('#manager_edit_map_zoom_popup_content').html('');
		document.getElementById('manager_edit_map_zoom_popup_content').appendChild(p_prime);
		
		$('#manager_edit_map_svg_clone').width(ros_largeur);
		$('#manager_edit_map_svg_clone').height(ros_hauteur);
					
		p = $('#manager_edit_map_svg image').position();
		x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
		y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;

		zoom = ManagerGetZoom();	
		
		z = window.panZoomManager.getZoom();
		x = -x + 50 + 2; // * z;
		y = -y + 50 + 2; // * z;
		
		var obj = $('#manager_edit_map_svg g');
		var transformMatrix = obj.css("-webkit-transform") ||
		   obj.css("-moz-transform")    ||
		   obj.css("-ms-transform")     ||
		   obj.css("-o-transform")      ||
		   obj.css("transform");
		   
		obj = $('#manager_edit_map_svg_clone g');
		obj.attr('id', 'manager_edit_map_svg_clone_g');
		 
		 var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
		
		s =
			"matrix(" +
			matrix[0] +
			"," +
			matrix[1] +
			"," +
			matrix[2] +
			"," +
			matrix[3] +
			"," +
			x +
			"," +
			y +
			")";
	
		element = document.getElementById('manager_edit_map_svg_clone_g');
		element.setAttributeNS(null, "transform", s);
		if ("transform" in element.style) {
		  element.style.transform = s;
		} else if ("-ms-transform" in element.style) {
		  element.style["-ms-transform"] = s;
		} else if ("-webkit-transform" in element.style) {
		  element.style["-webkit-transform"] = s;
		}
		
		l = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) + 50;
		if (l + 101 > $('#manager_edit_map_container_all').width() - 20) l -= 200;
		t = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - 150;
		if (t + 101 > $('body').height() - 20) t -= 100;
		if (t < 20) t = 20;
		$('#manager_edit_map_zoom_popup').css('left', l);
		$('#manager_edit_map_zoom_popup').css('top', t);
		$('#manager_edit_map_zoom_popup').show();
	}
	else
	{
		$('#manager_edit_map_zoom_popup').hide();
	}
}

var timerManagerLongPress = null;
var timerManagerVeryLongPress = null;
var eventTouchStart = null;
var currentPointManagerLongTouch = null;
var currentForbiddenManagerLongTouch = null;
var currentAreaManagerLongTouch = null;
var currentDockManagerLongTouch = null;
var currentPoiManagerLongTouch = null;

$(document).ready(function(e) {
	$('.popupHelp').click(function(e) {
        e.preventDefault();
		$(this).hide(200);
    });
	$('#manager_edit_map_svg').on('touchend', function(e) { 
		$('#manager_edit_map_zoom_popup').hide();
		if (timerManagerLongPress != null)
		{
			clearTimeout(timerManagerLongPress);
			timerManagerLongPress = null;
		}
		if (timerManagerVeryLongPress != null)
		{
			clearTimeout(timerManagerVeryLongPress);
			timerManagerVeryLongPress = null;
		}
	});
	$('#manager_edit_map_svg').on('touchstart', function(e) {
		
		if (timerManagerLongPress != null)
		{
			clearTimeout(timerManagerLongPress);
			timerManagerLongPress = null;
		}
		if (timerManagerVeryLongPress != null)
		{
			clearTimeout(timerManagerVeryLongPress);
			timerManagerVeryLongPress = null;
		}
		
		if (managerCanChangeMenu)
		{
			timerManagerLongPress = setTimeout(ManagerLongPressSVG, 500);
			timerManagerVeryLongPress = setTimeout(ManagerLongVeryPressSVG, 1500);
			eventTouchStart = e;
		}
		ManagerDisplayBlockZoom();
		
		ManagerHideMenus();
		
	});
    $('#manager_edit_map_svg').on('touchmove', function(e) {
		ManagerHideMenus();
		if (timerManagerLongPress != null)
		{
			clearTimeout(timerManagerLongPress);
			timerManagerLongPress = null;
		}
		if (timerManagerVeryLongPress != null)
		{
			clearTimeout(timerManagerVeryLongPress);
			timerManagerVeryLongPress = null;
		}
		ManagerDisplayBlockZoom();
	});
	
	
	$(document).on('touchend', '#manager_edit_map_svg .dock_elem', function(e) {
		$('#manager_edit_map_zoom_popup').hide();
		if (timerManagerLongPress != null)
		{
			clearTimeout(timerManagerLongPress);
			timerManagerLongPress = null;
		}
		if (timerManagerVeryLongPress != null)
		{
			clearTimeout(timerManagerVeryLongPress);
			timerManagerVeryLongPress = null;
		}
	});
	$(document).on('touchstart', '#manager_edit_map_svg .dock_elem', function(e) {
		if (timerManagerLongPress != null)
		{
			clearTimeout(timerManagerLongPress);
			timerManagerLongPress = null;
		}
		if (timerManagerVeryLongPress != null)
		{
			clearTimeout(timerManagerVeryLongPress);
			timerManagerVeryLongPress = null;
		}
		
		if (managerCanChangeMenu)
		{
			timerManagerLongPress = setTimeout(ManagerLongPressDock, 500);
			//timerManagerVeryLongPress = setTimeout(ManagerLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentDockManagerLongTouch = $(this);
		}
		ManagerDisplayBlockZoom();
		
		ManagerHideMenus();
		
	});
	$(document).on('touchmove', '#manager_edit_map_svg .dock_elem', function(e) {
    	ManagerHideMenus();
		if (timerManagerLongPress != null)
		{
			clearTimeout(timerManagerLongPress);
			timerManagerLongPress = null;
		}
		if (timerManagerVeryLongPress != null)
		{
			clearTimeout(timerManagerVeryLongPress);
			timerManagerVeryLongPress = null;
		}
		ManagerDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#manager_edit_map_svg .poi_elem', function(e) {
		$('#manager_edit_map_zoom_popup').hide();
		if (timerManagerLongPress != null)
		{
			clearTimeout(timerManagerLongPress);
			timerManagerLongPress = null;
		}
		if (timerManagerVeryLongPress != null)
		{
			clearTimeout(timerManagerVeryLongPress);
			timerManagerVeryLongPress = null;
		}
	});
	$(document).on('touchstart', '#manager_edit_map_svg .poi_elem', function(e) {
		if (timerManagerLongPress != null)
		{
			clearTimeout(timerManagerLongPress);
			timerManagerLongPress = null;
		}
		if (timerManagerVeryLongPress != null)
		{
			clearTimeout(timerManagerVeryLongPress);
			timerManagerVeryLongPress = null;
		}
		
		if (managerCanChangeMenu)
		{
			timerManagerLongPress = setTimeout(ManagerLongPressPoi, 500);
			//timerManagerVeryLongPress = setTimeout(ManagerLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentPoiManagerLongTouch = $(this);
		}
		ManagerDisplayBlockZoom();
		
		ManagerHideMenus();
		
	});
	$(document).on('touchmove', '#manager_edit_map_svg .poi_elem', function(e) {
    	ManagerHideMenus();
		if (timerManagerLongPress != null)
		{
			clearTimeout(timerManagerLongPress);
			timerManagerLongPress = null;
		}
		if (timerManagerVeryLongPress != null)
		{
			clearTimeout(timerManagerVeryLongPress);
			timerManagerVeryLongPress = null;
		}
		ManagerDisplayBlockZoom();
	});
});

function ManagerHideMenus()
{
	$('#manager_edit_map_menu li').hide();
	$('#manager_edit_map_menu_point li').hide();
	$('#manager_edit_map_menu_forbidden li').hide();
	$('#manager_edit_map_menu_area li').hide();
	$('#manager_edit_map_menu_dock li').hide();
	$('#manager_edit_map_menu_poi li').hide();
	$('.popupHelp').hide();
}

function ManagerDisplayMenu(id_menu)
{
	$('#'+id_menu+' li').hide();
	$('#'+id_menu).show();

	topCenter = eventTouchStart.originalEvent.targetTouches[0].clientY - $('#manager_edit_map_container_all').offset().top;
	leftCenter = eventTouchStart.originalEvent.targetTouches[0].clientX - $('#manager_edit_map_container_all').offset().left;
	
	$('#'+id_menu).css({top: topCenter, left: leftCenter});
	
	rayon = 70;
	
	decallageX = 0;
	decallageY = 0;
	angleDep = 21;
	
	if (leftCenter > $('#manager_edit_map_container_all').width() - 100)
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
	if (leftCenter + maxLeft + 50 > $('#manager_edit_map_container_all').width() - 20)
		decallageX = ($('#manager_edit_map_container_all').width() - 20) - (leftCenter + maxLeft + 50);
	
	if (topCenter + minTop < 20)
		decallageY = 20 - (topCenter + minTop);
	if (topCenter + maxTop + 50 > $('#manager_edit_map_container_all').height() - 20)
		decallageY = ($('#manager_edit_map_container_all').height() - 20) - (topCenter + maxTop + 50);
		
	if (decallageX != 0 || decallageY != 0)
	{
		$('#'+id_menu+' li').each(function(index, element) {
			$(this).css({left: '+='+decallageX, top: '+='+decallageY});
    	});
	}
}

function ManagerLongPressForbidden()
{
	timerManagerLongPress = null;
	ManagerDisplayMenu('manager_edit_map_menu_forbidden');
}
function ManagerLongPressArea()
{
	timerManagerLongPress = null;
	ManagerDisplayMenu('manager_edit_map_menu_area');
}
function ManagerLongPressDock()
{
	timerManagerLongPress = null;
	ManagerDisplayMenu('manager_edit_map_menu_dock');
}
function ManagerLongPressPoi()
{
	timerManagerLongPress = null;
	
	currentPoiIndex = GetPoiIndexFromID(currentPoiManagerLongTouch.data('id_poi'));
	if (pois[currentPoiIndex].advanced)
		$('#manager_edit_map_menu_poi .bDeletePoi').addClass('disabled');
	else
		$('#manager_edit_map_menu_poi .bDeletePoi').removeClass('disabled');
	
	ManagerDisplayMenu('manager_edit_map_menu_poi');
}

function ManagerLongPressPointDeletable()
{
	timerManagerLongPress = null;
	ManagerDisplayMenu('manager_edit_map_menu_point');
}

function ManagerLongVeryPressSVG()
{
	timerManagerVeryLongPress = null;
	
	$('#manager_edit_map_container_all .popupHelp').show(200);	
}

function ManagerLongPressSVG()
{
	timerManagerLongPress = null;
	ManagerDisplayMenu('manager_edit_map_menu');
}

function ManagerInitMap()
{
	var eventsHandlerManager;

	eventsHandlerManager = {
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
	
	window.panZoomManager = svgPanZoom('#manager_edit_map_svg', {
	  zoomEnabled: true
	, controlIconsEnabled: false
	, maxZoom: 20
	, fit: 1
	, center: 1
	, customEventsHandler: eventsHandlerManager
	, RefreshMap: function() { setTimeout(ManagerRefreshZoomView, 10); }
	});
	
	svgManager = document.querySelector('#manager_edit_map_svg .svg-pan-zoom_viewport');
	
	//window.panZoomManager = {};
	//window.panZoomManager.getZoom = function () { return 1; }
	ManagerRefreshZoomView();
}