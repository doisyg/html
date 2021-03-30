// JavaScript Document
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
	$('#manager_edit_map .burger_menu').addClass('updatingMap');
	wycaApi.GetCurrentMapComplete(function(data) {
		if (data.A == wycaApi.AnswerCode.NO_ERROR)
		{
			
			id_map = data.D.id_map;
			id_map_last = data.D.id_map;
			
			forbiddens = data.D.forbiddens;
			areas = data.D.areas;
			gommes = Array();
			docks = data.D.docks;
			pois = data.D.pois;
			augmented_poses = data.D.augmented_poses;
			
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
				
				$('#manager_edit_map .modalReloadMap').modal('hide');
				$('#manager_edit_map .modalReloadMap .btn').removeClass('disabled');
				$('#manager_edit_map .modalReloadMap .manager_edit_map_modalReloadMap_loading').hide();
				
				$('#manager_edit_map .modalConfirmNoReloadMap').modal('hide');
				$('#manager_edit_map .modalConfirmNoReloadMap .btn').removeClass('disabled');
				$('#manager_edit_map .modalConfirmNoReloadMap .manager_edit_map_modalReloadMap_loading').hide();
				
				RemoveClass('#manager_edit_map_svg .active', 'active');
				RemoveClass('#manager_edit_map_svg .activ_select', 'activ_select'); 
				RemoveClass('#manager_edit_map_svg .editing_point', 'editing_point'); 
				
				managerCanChangeMenu = true;
				managerCurrentAction = '';
				
				ManagerHideMenus();
			},500);
			$('#manager_edit_map .modal').not('.modalReloadMap').each(function(){$(this).modal('hide')});
			$('#bHeaderInfo').attr('onClick',"TogglePopupHelp()");
		}
		else
		{
			$('#manager_edit_map .burger_menu').removeClass('updatingMap');
			ParseAPIAnswerError(data,textErrorGetMap);
		}
	});
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
var currentAugmentedPoseManagerLongTouch = null;

$(document).ready(function(e) {
	$('#manager_edit_map .modal').on('shown.bs.modal', function () {
		do_refresh = true;
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
		ManagerDisplayBlockZoom();
	});
	
	/*
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
		
	});*/
	
    $('#manager_edit_map_svg').on('touchmove', function(e) {
		//ManagerHideMenus();
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
	
	$(document).on('touchend', '#manager_edit_map_svg .augmented_pose_elem', function(e) {
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
	
	$(document).on('touchstart', '#manager_edit_map_svg .augmented_pose_elem', function(e) {
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
			timerManagerLongPress = setTimeout(ManagerLongPressAugmentedPose, 500);
			//timerManagerVeryLongPress = setTimeout(ManagerLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentAugmentedPoseManagerLongTouch = $(this);
		}
		ManagerDisplayBlockZoom();
		
		ManagerHideMenus();
		
	});
	
	$(document).on('touchmove', '#manager_edit_map_svg .augmented_pose_elem', function(e) {
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

	$('#manager_edit_map .burger_menu').on('click', function(e) {
		if($(this).hasClass('burger_menu_open')){
			ManagerHideMenus()
		}else{
			ManagerDisplayMenu($(this).data('open'))
		}
	});
	
	$('#manager_edit_map .icon_menu').on('click', function(e) {
		
		switch(managerCurrentAction){
			case 'prepareArea': 
			case 'prepareForbiddenArea': 
			case 'prepareGotoPose': 
				managerCurrentAction='';
				managerCanChangeMenu = true;
			break;
		}
		if (managerCanChangeMenu)
		{
			ManagerHideMenus();
			
			if($(this).data('menu') == 'manager_edit_map_menu_point')
			{
				if (managerCurrentAction == 'editForbiddenArea' || managerCurrentAction == 'addbiddenArea')
				{
					ManagerDisplayMenu('manager_edit_map_menu_forbidden');
				}
				else if (managerCurrentAction == 'editArea' || managerCurrentAction == 'addArea')
				{
					ManagerDisplayMenu('manager_edit_map_menu_area');
				}
			}
			else
			{
				
				RemoveClass('#manager_edit_map_svg .active', 'active');
				RemoveClass('#manager_edit_map_svg .activ_select', 'activ_select'); 
				ManagerResizeSVG();
				currentSelectedItem = Array();
				managerCurrentAction='';
				$('body').removeClass('no_current select');
				$('.select').css("strokeWidth", minStokeWidth);
			}
		}
	});
	
	$('#manager_edit_map .times_icon_menu').click(function(){
		$('#manager_edit_map .icon_menu:visible').click();
	})

});

function ManagerHideMenus()
{
	$('#manager_edit_map .times_icon_menu').hide()
	$('#manager_edit_map_menu li').hide();
	$('#manager_edit_map_menu_point li').hide();
	$('#manager_edit_map_menu_forbidden li').hide();
	$('#manager_edit_map_menu_area li').hide();
	$('#manager_edit_map_menu_dock li').hide();
	$('#manager_edit_map_menu_poi li').hide();
	$('#manager_edit_map_menu_augmented_pose li').hide();
	$('#manager_edit_map_menu_erase li').hide();
	$('#manager_edit_map .popupHelp').hide();
	
	$('#manager_edit_map .burger_menu_open').removeClass('burger_menu_open');
	
	$('#manager_edit_map .burger_menu').css('display','flex');
	
	$('#manager_edit_map .icon_menu').hide('fast');
}

function ManagerDisplayMenu(id_menu)
{
	ManagerHideMenus();
		
		
		let idxH = 1;
		let idxV = 1;
		let idxD = 1;
		console.log(id_menu);
		
		//ICONE CORRESPONDANTE INSTEAD BURGER MENU
		let icon_menu = $('#manager_edit_map .icon_menu[data-menu="'+id_menu+'"]');
		if(icon_menu.lentgh != 0){
			if(id_menu == 'manager_edit_map_menu_forbidden' || id_menu == 'manager_edit_map_menu_area'){
				icon_menu.show('fast');
			}else{		
				icon_menu.show('fast');
			}
		}
		if(id_menu != 'manager_edit_map_menu_point')
			RemoveClass('#manager_edit_map_svg .point_deletable', 'editing_point');
		if(id_menu != 'manager_edit_map_menu_area' && id_menu != 'manager_edit_map_menu_forbidden')
			RemoveClass('#manager_edit_map_svg .point_deletable', 'active');
		
		
		if(id_menu != 'manager_edit_map_menu'){
			$('#manager_edit_map .burger_menu').hide('fast');
			setTimeout(function(){$('#manager_edit_map .times_icon_menu').show('fast')},50);
		}else{
			$('#manager_edit_map .burger_menu').addClass('burger_menu_open');
		}
		
		$('#'+id_menu+' li').hide();
		$('#'+id_menu).show();

		topMenu = 7.5; //px
		leftMenu = 7.5; //px
		
		decallageY = 45;
		decallageX = 45;
		
		
		$('#'+id_menu).css({top: topMenu, left: leftMenu});
		
		$('#'+id_menu+' li').each(function(index, element) {
			let orientation = $(element).find('a.btn-menu').data('orientation');
			switch(orientation){
				case 'V' : 
					l = leftMenu;
					t = topMenu + (idxH * decallageY+10)
					idxH++; 
				break;
				case 'H' :  
					l = leftMenu + (idxV * decallageX+10)
					t = topMenu ;
					idxV++;
				break;
				case 'D' : 
					l = leftMenu + (idxD * decallageX+10)
					t = topMenu + (idxD * decallageY+10) ;
					idxD++;
				break;
				default:
					l = leftMenu;
					t = topMenu + (idxH * decallageY+10)
					idxH++; 
				break;
			}
			l = l+'px';
			t = t+'px';
			$(this).css({left: l, top: t});
			delay = 15 * index + 25;
			$(this).delay(delay).fadeIn();
		});
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
	ManagerDisplayMenu('manager_edit_map_menu_poi');
}

function ManagerLongPressAugmentedPose()
{
	timerManagerLongPress = null;
	ManagerDisplayMenu('manager_edit_map_menu_augmented_pose');
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

var resetPan = false;

$(document).ready(function(e) {
    $('#manager_edit_map_svg').on('touchend', function(e) {
		resetPan = true;
	});
	$('#manager_edit_map_svg').on('touchstart', function(e) {
		resetPan = true;
	});
});

function ManagerInitMap()
{
	var eventsHandlerManager;

	eventsHandlerManager = {
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
	let init_zoom = false;
	if(id_map_zoom != id_map){
		init_zoom = true;
		id_map_zoom = id_map;
		if(typeof(window.panZoomManager) != 'undefined')
			window.panZoomManager.destroy();
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
	
	setTimeout(function(){
		if(init_zoom){
			//WORKING ON CONSOLE 
			window.panZoomManager.resize();
			window.panZoomManager.updateBBox();
			window.panZoomManager.fit();
			window.panZoomManager.center();
		}
		$('.manager_edit_map_loading').hide();
	},100);
}