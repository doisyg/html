// JavaScript Document
function GetInfosCurrentMapUser()
{
	if (wycaApi.websocketAuthed)
	{
		GetInfosCurrentMapDoUser();
	}
	else
	{
		setTimeout(GetInfosCurrentMapUser, 500);
	}
}

function GetInfosCurrentMapDoUser()
{
	$('#user_edit_map .burger_menu').addClass('updatingMap');
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
			landmarks = data.D.landmarks;
			augmented_poses = data.D.augmented_poses;
			
			$('#user_edit_map_zoom_carte .img-responsive').attr('src', 'data:image/png;base64,'+data.D.image_tri);
			
			largeurSlam = data.D.ros_width;
			hauteurSlam = data.D.ros_height;
			largeurRos = data.D.ros_width;
			hauteurRos = data.D.ros_height;
			
			ros_largeur = data.D.ros_width;
			ros_hauteur = data.D.ros_height;
			ros_resolution = data.D.ros_resolution;
			
			$('#user_edit_map_svg').attr('width', data.D.ros_width);
			$('#user_edit_map_svg').attr('height', data.D.ros_height);
			
			$('#user_edit_map_image').attr('width', data.D.ros_width);
			$('#user_edit_map_image').attr('height', data.D.ros_height);
			$('#user_edit_map_image').attr('xlink:href', 'data:image/png;base64,'+data.D.image_tri);
		  
			$('#user_mapping_use .bUseThisMapNowYes').show();
			$('#user_mapping_use .bUseThisMapNowNo').show();
			$('#user_mapping_use .modalUseThisMapNowTitle1').show();
			$('#user_mapping_use .modalUseThisMapNowTitle2').hide();
			$('#user_mapping_use .modalUseThisMapNowContent').hide();
			
			userHistoriques = Array();
			userHistoriqueIndex = -1;
			UserRefreshHistorique();
			
			setTimeout(function(){
				UserInitMap();
				UserResizeSVG();
				$('#user_edit_map .modalReloadMap').modal('hide');
				$('#user_edit_map .modalReloadMap .btn').removeClass('disabled');
				$('#user_edit_map .modalReloadMap .user_edit_map_modalReloadMap_loading').hide();
				
				$('#user_edit_map .modalConfirmNoReloadMap').modal('hide');
				$('#user_edit_map .modalConfirmNoReloadMap .btn').removeClass('disabled');
				$('#user_edit_map .modalConfirmNoReloadMap .user_edit_map_modalReloadMap_loading').hide();
				
				RemoveClass('#user_edit_map_svg .active', 'active');
				RemoveClass('#user_edit_map_svg .activ_select', 'activ_select'); 
				RemoveClass('#user_edit_map_svg .editing_point', 'editing_point'); 
				
				userCanChangeMenu = true;
				//userCurrentAction = ''; not needed for user
				$('#user_edit_map .burger_menu').removeClass('updatingMap');
				$('#user_edit_map .bSaveEditMap').html(textBtnSaveMap).removeClass('disabled'); // REMOVE SPINNER ON BTN
				UserHideMenus();
			},500); 
			$('#user_edit_map .modal').not('.modalReloadMap').each(function(){$(this).modal('hide')});
			$('#bHeaderInfo').attr('onClick',"TogglePopupHelp()");
		}
		else
		{
			$('#user_edit_map .burger_menu').removeClass('updatingMap');
			ParseAPIAnswerError(data,textErrorGetMap);
		}
	});
}

function UserDisplayBlockZoom()
{
	if (blockZoom)
	{
		p = document.getElementById("user_edit_map_svg"); 
		p_prime = p.cloneNode(true);
		p_prime.id = "user_edit_map_svg_clone";
		$('#user_edit_map_zoom_popup_content').html('');
		document.getElementById('user_edit_map_zoom_popup_content').appendChild(p_prime);
		
		$('#user_edit_map_svg_clone').width(ros_largeur);
		$('#user_edit_map_svg_clone').height(ros_hauteur);
					
		p = $('#user_edit_map_svg image').position();
		x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
		y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;

		zoom = UserGetZoom();	
		
		z = window.panZoomUser.getZoom();
		x = -x + 50 + 2; // * z;
		y = -y + 50 + 2; // * z;
		
		var obj = $('#user_edit_map_svg g');
		var transformMatrix = obj.css("-webkit-transform") ||
		   obj.css("-moz-transform")    ||
		   obj.css("-ms-transform")     ||
		   obj.css("-o-transform")      ||
		   obj.css("transform");
		   
		obj = $('#user_edit_map_svg_clone g');
		obj.attr('id', 'user_edit_map_svg_clone_g');
		 
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
	
		element = document.getElementById('user_edit_map_svg_clone_g');
		element.setAttributeNS(null, "transform", s);
		if ("transform" in element.style) {
		  element.style.transform = s;
		} else if ("-ms-transform" in element.style) {
		  element.style["-ms-transform"] = s;
		} else if ("-webkit-transform" in element.style) {
		  element.style["-webkit-transform"] = s;
		}
		
		l = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) + 50;
		if (l + 101 > $('#user_edit_map_container_all').width() - 20) l -= 200;
		t = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - 150;
		if (t + 101 > $('body').height() - 20) t -= 100;
		if (t < 20) t = 20;
		$('#user_edit_map_zoom_popup').css('left', l);
		$('#user_edit_map_zoom_popup').css('top', t);
		$('#user_edit_map_zoom_popup').show();
	}
	else
	{
		$('#user_edit_map_zoom_popup').hide();
	}
}

var timerUserLongPress = null;
var timerUserVeryLongPress = null;
var eventTouchStart = null;
var currentPointUserLongTouch = null;
var currentForbiddenUserLongTouch = null;
var currentAreaUserLongTouch = null;
var currentDockUserLongTouch = null;
var currentPoiUserLongTouch = null;
var currentAugmentedPoseUserLongTouch = null;

$(document).ready(function(e) {
	$('.popupHelp').click(function(e) {
        e.preventDefault();
		$(this).hide(200);
    });
	$('#user_edit_map_svg').on('touchend', function(e) { 
		$('#user_edit_map_zoom_popup').hide();
		if (timerUserLongPress != null)
		{
			clearTimeout(timerUserLongPress);
			timerUserLongPress = null;
		}
		if (timerUserVeryLongPress != null)
		{
			clearTimeout(timerUserVeryLongPress);
			timerUserVeryLongPress = null;
		}
	});
	$('#user_edit_map_svg').on('touchstart', function(e) {
		
		if (timerUserLongPress != null)
		{
			clearTimeout(timerUserLongPress);
			timerUserLongPress = null;
		}
		if (timerUserVeryLongPress != null)
		{
			clearTimeout(timerUserVeryLongPress);
			timerUserVeryLongPress = null;
		}
		
		if (userCanChangeMenu)
		{
			timerUserLongPress = setTimeout(UserLongPressSVG, 500);
			timerUserVeryLongPress = setTimeout(UserLongVeryPressSVG, 1500);
			eventTouchStart = e;
		}
		UserDisplayBlockZoom();
		
		UserHideMenus();
		
	});
    $('#user_edit_map_svg').on('touchmove', function(e) {
		UserHideMenus();
		if (timerUserLongPress != null)
		{
			clearTimeout(timerUserLongPress);
			timerUserLongPress = null;
		}
		if (timerUserVeryLongPress != null)
		{
			clearTimeout(timerUserVeryLongPress);
			timerUserVeryLongPress = null;
		}
		UserDisplayBlockZoom();
	});
	
	
	$(document).on('touchend', '#user_edit_map_svg .dock_elem', function(e) {
		$('#user_edit_map_zoom_popup').hide();
		if (timerUserLongPress != null)
		{
			clearTimeout(timerUserLongPress);
			timerUserLongPress = null;
		}
		if (timerUserVeryLongPress != null)
		{
			clearTimeout(timerUserVeryLongPress);
			timerUserVeryLongPress = null;
		}
	});
	$(document).on('touchstart', '#user_edit_map_svg .dock_elem', function(e) {
		if (timerUserLongPress != null)
		{
			clearTimeout(timerUserLongPress);
			timerUserLongPress = null;
		}
		if (timerUserVeryLongPress != null)
		{
			clearTimeout(timerUserVeryLongPress);
			timerUserVeryLongPress = null;
		}
		
		if (userCanChangeMenu)
		{
			timerUserLongPress = setTimeout(UserLongPressDock, 500);
			//timerUserVeryLongPress = setTimeout(UserLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentDockUserLongTouch = $(this);
		}
		UserDisplayBlockZoom();
		
		UserHideMenus();
		
	});
	$(document).on('touchmove', '#user_edit_map_svg .dock_elem', function(e) {
    	UserHideMenus();
		if (timerUserLongPress != null)
		{
			clearTimeout(timerUserLongPress);
			timerUserLongPress = null;
		}
		if (timerUserVeryLongPress != null)
		{
			clearTimeout(timerUserVeryLongPress);
			timerUserVeryLongPress = null;
		}
		UserDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#user_edit_map_svg .poi_elem', function(e) {
		$('#user_edit_map_zoom_popup').hide();
		if (timerUserLongPress != null)
		{
			clearTimeout(timerUserLongPress);
			timerUserLongPress = null;
		}
		if (timerUserVeryLongPress != null)
		{
			clearTimeout(timerUserVeryLongPress);
			timerUserVeryLongPress = null;
		}
	});
	$(document).on('touchstart', '#user_edit_map_svg .poi_elem', function(e) {
		if (timerUserLongPress != null)
		{
			clearTimeout(timerUserLongPress);
			timerUserLongPress = null;
		}
		if (timerUserVeryLongPress != null)
		{
			clearTimeout(timerUserVeryLongPress);
			timerUserVeryLongPress = null;
		}
		
		if (userCanChangeMenu)
		{
			timerUserLongPress = setTimeout(UserLongPressPoi, 500);
			//timerUserVeryLongPress = setTimeout(UserLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentPoiUserLongTouch = $(this);
		}
		UserDisplayBlockZoom();
		
		UserHideMenus();
		
	});
	$(document).on('touchmove', '#user_edit_map_svg .poi_elem', function(e) {
    	UserHideMenus();
		if (timerUserLongPress != null)
		{
			clearTimeout(timerUserLongPress);
			timerUserLongPress = null;
		}
		if (timerUserVeryLongPress != null)
		{
			clearTimeout(timerUserVeryLongPress);
			timerUserVeryLongPress = null;
		}
		UserDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#user_edit_map_svg .augmented_pose_elem', function(e) {
		$('#user_edit_map_zoom_popup').hide();
		if (timerUserLongPress != null)
		{
			clearTimeout(timerUserLongPress);
			timerUserLongPress = null;
		}
		if (timerUserVeryLongPress != null)
		{
			clearTimeout(timerUserVeryLongPress);
			timerUserVeryLongPress = null;
		}
	});
	$(document).on('touchstart', '#user_edit_map_svg .augmented_pose_elem', function(e) {
		if (timerUserLongPress != null)
		{
			clearTimeout(timerUserLongPress);
			timerUserLongPress = null;
		}
		if (timerUserVeryLongPress != null)
		{
			clearTimeout(timerUserVeryLongPress);
			timerUserVeryLongPress = null;
		}
		
		if (userCanChangeMenu)
		{
			timerUserLongPress = setTimeout(UserLongPressAugmentedPose, 500);
			//timerUserVeryLongPress = setTimeout(UserLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentAugmentedPoseUserLongTouch = $(this);
		}
		UserDisplayBlockZoom();
		
		UserHideMenus();
		
	});
	$(document).on('touchmove', '#user_edit_map_svg .augmented_pose_elem', function(e) {
    	UserHideMenus();
		if (timerUserLongPress != null)
		{
			clearTimeout(timerUserLongPress);
			timerUserLongPress = null;
		}
		if (timerUserVeryLongPress != null)
		{
			clearTimeout(timerUserVeryLongPress);
			timerUserVeryLongPress = null;
		}
		UserDisplayBlockZoom();
	});
});

function UserHideMenus()
{
	//$('#user_edit_map_menu li').hide();
	$('#user_edit_map_menu_point li').hide();
	$('#user_edit_map_menu_forbidden li').hide();
	$('#user_edit_map_menu_area li').hide();
	$('#user_edit_map_menu_dock li').hide();
	$('#user_edit_map_menu_poi li').hide();
	$('#user_edit_map_menu_augmented_pose li').hide();
	$('#user_edit_map_menu .popupHelp').hide();
	$('#user_edit_map .times_icon_menu').hide();
}

function UserDisplayMenu(id_menu)
{
	$('#'+id_menu+' li').hide();
	$('#'+id_menu).show();

	topCenter = eventTouchStart.originalEvent.targetTouches[0].clientY - $('#user_edit_map_container_all').offset().top;
	leftCenter = eventTouchStart.originalEvent.targetTouches[0].clientX - $('#user_edit_map_container_all').offset().left;
	
	$('#'+id_menu).css({top: topCenter, left: leftCenter});
	
	rayon = 80;
	
	decallageX = 0;
	decallageY = 0;
	angleDep = 21;
	
	if (leftCenter > $('#user_edit_map_container_all').width() - 100)
		angleDep += 180;
	
	minLeft = 10000;
	maxLeft = -100;
	minTop = 10000;
	maxTop = -100;
	
	$('#'+id_menu+' li').each(function(index, element) {
		angle = (angleDep + 45*index) * Math.PI/180;
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
	if (leftCenter + maxLeft + 50 > $('#user_edit_map_container_all').width() - 20)
		decallageX = ($('#user_edit_map_container_all').width() - 20) - (leftCenter + maxLeft + 50);
	
	if (topCenter + minTop < 20)
		decallageY = 20 - (topCenter + minTop);
	if (topCenter + maxTop + 50 > $('#user_edit_map_container_all').height() - 20)
		decallageY = ($('#user_edit_map_container_all').height() - 20) - (topCenter + maxTop + 50);
		
	if (decallageX != 0 || decallageY != 0)
	{
		$('#'+id_menu+' li').each(function(index, element) {
			$(this).css({left: '+='+decallageX, top: '+='+decallageY});
    	});
	}
}

function UserLongPressForbidden()
{
	timerUserLongPress = null;
	UserDisplayMenu('user_edit_map_menu_forbidden');
}

function UserLongPressArea()
{
	timerUserLongPress = null;
	UserDisplayMenu('user_edit_map_menu_area');
}

function UserLongPressDock()
{
	timerUserLongPress = null;
	UserDisplayMenu('user_edit_map_menu_dock');
}
function UserLongPressPoi()
{
	timerUserLongPress = null;
	
	currentPoiIndex = GetPoiIndexFromID(currentPoiUserLongTouch.data('id_poi'));
	$('#user_edit_map_menu_poi .bDeletePoi').addClass('disabled');
	
	UserDisplayMenu('user_edit_map_menu_poi');
}

function UserLongPressAugmentedPose()
{
	timerUserLongPress = null;
	
	currentAugmentedPoseIndex = GetAugmentedPoseIndexFromID(currentAugmentedPoseUserLongTouch.data('id_augmented_pose'));
	
	UserDisplayMenu('user_edit_map_menu_augmented_pose');
}

function UserLongPressPointDeletable()
{
	timerUserLongPress = null;
	UserDisplayMenu('user_edit_map_menu_point');
}

function UserLongVeryPressSVG()
{
	timerUserVeryLongPress = null;
	
	//$('#user_edit_map_container_all .popupHelp').show(200);	
}

function UserLongPressSVG()
{
	timerUserLongPress = null;
	//UserDisplayMenu('user_edit_map_menu');
}

var resetPan = false;

$(document).ready(function(e) {
    $('#user_edit_map_svg').on('touchend', function(e) {
		resetPan = true;
	});
	
	$('#user_edit_map_svg').on('touchstart', function(e) {
		resetPan = true;
	});
});

function UserInitMap()
{
	var eventsHandlerUser;

	eventsHandlerUser = {
	  haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel', 'mousemove', 'mouseup', 'mousedown']
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
		  if (ev.type === 'panstart' || resetPan) {
			pannedX = 0;
			pannedY = 0;
			resetPan = false;
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
	
	window.panZoomUser = svgPanZoom('#user_edit_map_svg', {
	  zoomEnabled: true
	, controlIconsEnabled: false
	, maxZoom: 20
	, fit: 1
	, center: 1
	, customEventsHandler: eventsHandlerUser
	, RefreshMap: function() { setTimeout(UserRefreshZoomView, 10); }
	});
	
	svgUser = document.querySelector('#user_edit_map_svg .svg-pan-zoom_viewport');
	
	//window.panZoomUser = {};
	//window.panZoomUser.getZoom = function () { return 1; }
	UserRefreshZoomView();
	
	
	$('.user_edit_map_loading').hide();
}