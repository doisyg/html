// JavaScript Document
function GetInfosCurrentMapNormal()
{
	if (wycaApi.websocketAuthed)
	{
		GetInfosCurrentMapDoNormal();
	}
	else
	{
		setTimeout(GetInfosCurrentMapNormal, 500);
	}
}

function GetInfosCurrentMapDoNormal()
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
			augmented_poses = data.D.augmented_poses;
			
			$('#install_normal_edit_map_zoom_carte .img-responsive').attr('src', 'data:image/png;base64,'+data.D.image_tri);
			
			largeurSlam = data.D.ros_width;
			hauteurSlam = data.D.ros_height;
			largeurRos = data.D.ros_width;
			hauteurRos = data.D.ros_height;
			
			ros_largeur = data.D.ros_width;
			ros_hauteur = data.D.ros_height;
			ros_resolution = data.D.ros_resolution;
			
			$('#install_normal_edit_map_svg').attr('width', data.D.ros_width);
			$('#install_normal_edit_map_svg').attr('height', data.D.ros_height);
			
			$('#install_normal_edit_map_image').attr('width', data.D.ros_width);
			$('#install_normal_edit_map_image').attr('height', data.D.ros_height);
			$('#install_normal_edit_map_image').attr('xlink:href', 'data:image/png;base64,'+data.D.image_tri);
		  
			$('#install_normal_mapping_use .bUseThisMapNowYes').show();
			$('#install_normal_mapping_use .bUseThisMapNowNo').show();
			$('#install_normal_mapping_use .modalUseThisMapNowTitle1').show();
			$('#install_normal_mapping_use .modalUseThisMapNowTitle2').hide();
			$('#install_normal_mapping_use .modalUseThisMapNowContent').hide();
			
			normalHistoriques = Array();
			normalHistoriqueIndex = -1;
			NormalRefreshHistorique();
			
			setTimeout(function(){
				NormalInitMap();
				NormalResizeSVG();
				
				/* REFRESH IDS IF MENU OPEN */
				let actions_searched = ['editPoi','editDock','editAugmentedPose','editForbiddenArea','editArea'];
				let temp = false;
				if(actions_searched.includes(normalCurrentAction)){
					switch(normalCurrentAction){
						case 'editPoi' :
							temp = FindElemByName(pois,NormalBufferMapSaveElemName);
							if(temp){
								currentPoiNormalLongTouch = $('#install_normal_edit_map_poi_secure_'+temp.id_poi);
								currentPoiNormalLongTouch.data('id_poi',temp.id_poi);
								currentPoiNormalLongTouch.click();
								NormalBufferMapSaveElemName = '';
							}
						break;
						case 'editDock' :
							temp = FindElemByName(docks,NormalBufferMapSaveElemName);
							if(temp){
								currentDockNormalLongTouch = $('#install_normal_edit_map_dock_secure_'+temp.id_docking_station);
								currentDockNormalLongTouch.click();
								currentDockNormalLongTouch.data('id_docking_station',temp.id_docking_station);
								NormalBufferMapSaveElemName = '';
							}
						break;
						case 'editAugmentedPose' :
							temp = FindElemByName(augmented_poses,NormalBufferMapSaveElemName);
							if(temp){
								currentAugmentedPoseNormalLongTouch = $('#install_normal_edit_map_augmented_pose_secure_'+temp.id_augmented_pose);
								currentAugmentedPoseNormalLongTouch.click();
								currentAugmentedPoseNormalLongTouch.data('id_augmented_pose',temp.id_augmented_pose);
								NormalBufferMapSaveElemName = '';
							}
						break;
						case 'editForbiddenArea' :
							temp = FindElemByName(forbiddens,NormalBufferMapSaveElemName);
							if(temp){
								currentForbiddenNormalLongTouch = $('#install_normal_edit_map_forbidden_'+temp.id_area);
								currentForbiddenNormalLongTouch.click();
								currentForbiddenNormalLongTouch.data('id_area',temp.id_area);
								NormalBufferMapSaveElemName = '';
							}
						break;
						case 'editArea' :
							temp = FindElemByName(areas,NormalBufferMapSaveElemName);
							if(temp){
								currentAreaNormalLongTouch = $('#install_normal_edit_map_area_'+temp.id_area);
								currentAreaNormalLongTouch.click();
								currentAreaNormalLongTouch.data('id_area',temp.id_area);
								NormalBufferMapSaveElemName = '';
							}
						break;
						default: NormalBufferMapSaveElemName = ''; break;
					}
				}
			},500);
			$('#bHeaderInfo').attr('onClick',"TogglePopupHelp()");
		}
		else
		{
			alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
		}
	});
}

function NormalDisplayBlockZoom()
{
	if (blockZoom)
	{
		//svgData = new XMLSerializer().serializeToString(svgTemp);
		//imgForSVG.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
		p = document.getElementById("install_normal_edit_map_svg"); 
		p_prime = p.cloneNode(true);
		p_prime.id = "install_normal_edit_map_svg_clone";
		$('#install_normal_edit_map_zoom_popup_content').html('');
		document.getElementById('install_normal_edit_map_zoom_popup_content').appendChild(p_prime);
		
		$('#install_normal_edit_map_svg_clone').width(ros_largeur);
		$('#install_normal_edit_map_svg_clone').height(ros_hauteur);
					
		p = $('#install_normal_edit_map_svg image').position();
		x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) - p.left;
		y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - p.top;

		//zoom = ros_largeur / $('#install_normal_edit_map_svg').width() / window.panZoomNormal.getZoom();
		zoom = NormalGetZoom();	
		/*
		$('#install_normal_edit_map_img_svg').css('left',(-x*zoom) * 10 + 50);
		$('#install_normal_edit_map_img_svg').css('top', (-y*zoom) * 10 + 50);
		*/
		
		//$('#install_normal_edit_map_svg_clone').css('left', -event.targetTouches[0].pageX + 50 + 2);
		//$('#install_normal_edit_map_svg_clone').css('top', -event.targetTouches[0].pageY + 50 + $('#install_normal_edit_map_container_all').position().top + 23);
		
		//x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
		//y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
		
		z = window.panZoomNormal.getZoom();
		x = -x + 50 + 2; // * z;
		y = -y + 50 + 2; // * z;
		
		var obj = $('#install_normal_edit_map_svg g');
		var transformMatrix = obj.css("-webkit-transform") ||
		   obj.css("-moz-transform")    ||
		   obj.css("-ms-transform")     ||
		   obj.css("-o-transform")      ||
		   obj.css("transform");
		   
		obj = $('#install_normal_edit_map_svg_clone g');
		obj.attr('id', 'install_normal_edit_map_svg_clone_g');
		 
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
	
		element = document.getElementById('install_normal_edit_map_svg_clone_g');
		element.setAttributeNS(null, "transform", s);
		if ("transform" in element.style) {
		  element.style.transform = s;
		} else if ("-ms-transform" in element.style) {
		  element.style["-ms-transform"] = s;
		} else if ("-webkit-transform" in element.style) {
		  element.style["-webkit-transform"] = s;
		}
		
		l = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) + 50;
		if (l + 101 > $('#install_normal_edit_map_container_all').width() - 20) l -= 200;
		t = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - 150;
		if (t + 101 > $('body').height() - 20) t -= 100;
		if (t < 20) t = 20;
		$('#install_normal_edit_map_zoom_popup').css('left', l);
		$('#install_normal_edit_map_zoom_popup').css('top', t);
		$('#install_normal_edit_map_zoom_popup').show();
		
		/*
		
		$('#install_normal_edit_map_svg_copy').html($('#install_normal_edit_map_svg .svg-pan-zoom_viewport').html());
		
		p = $('#install_normal_edit_map_svg image').position();
		x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
		y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
		
		//zoom = ros_largeur / $('#install_normal_edit_map_svg').width() / window.panZoomNormal.getZoom();
		zoom = NormalGetZoom();
				
		$('#install_normal_edit_map_svg_copy').css('left', -x*zoom + 50);
		$('#install_normal_edit_map_svg_copy').css('top', -y*zoom + 50);
		
		$('#install_normal_edit_map_zoom_popup').css('left', (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) + 50);
		$('#install_normal_edit_map_zoom_popup').css('top', (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - 150);
		$('#install_normal_edit_map_zoom_popup').show();
		*/
	}
	else
	{
		$('#install_normal_edit_map_zoom_popup').hide();
	}
}

var timerNormalLongPress = null;
var timerNormalVeryLongPress = null;
var eventTouchStart = null;
var currentPointNormalLongTouch = null;
var currentForbiddenNormalLongTouch = null;
var currentAreaNormalLongTouch = null;
var currentDockNormalLongTouch = null;
var currentPoiNormalLongTouch = null;
var currentAugmentedPoseNormalLongTouch = null;

$(document).ready(function(e) {
	
	$('#install_normal_edit_map_svg').on('touchend', function(e) { 
		$('#install_normal_edit_map_zoom_popup').hide();
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
	});
	
	$('#install_normal_edit_map_svg').on('touchstart', function(e) {
		NormalDisplayBlockZoom();
	});
    
	/*
	$('#install_normal_edit_map_svg').on('touchstart', function(e) {
		
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
		
		if (normalCanChangeMenu)
		{
			timerNormalLongPress = setTimeout(NormalLongPressSVG, 500);
			timerNormalVeryLongPress = setTimeout(NormalLongVeryPressSVG, 1500);
			eventTouchStart = e;
		}
		NormalDisplayBlockZoom();
		
		NormalHideMenus();
		
	});
	*/
	
	
	$('#install_normal_edit_map_svg').on('touchmove', function(e) {
		//NormalHideMenus();
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
		NormalDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#install_normal_edit_map_svg .point_deletable', function(e) {
		$('#install_normal_edit_map_zoom_popup').hide();
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
	});
	
	$(document).on('touchstart', '#install_normal_edit_map_svg .point_deletable', function(e) {
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
		
		if (normalCanChangeMenu || normalCurrentAction == 'addForbiddenArea' || normalCurrentAction == 'addArea' || normalCurrentAction == 'editForbiddenArea' || normalCurrentAction == 'editArea')
		{
			//timerNormalLongPress = setTimeout(NormalLongPressPointDeletable, 500);
			timerNormalLongPress = NormalLongPressPointDeletable();
			//timerNormalVeryLongPress = setTimeout(NormalLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentPointNormalLongTouch = $(this);
		}
		NormalDisplayBlockZoom();
		
		//NormalHideMenus();
		
	});
	
	$(document).on('touchmove', '#install_normal_edit_map_svg .point_deletable', function(e) {
    	//NormalHideMenus();
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
		//NormalDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#install_normal_edit_map_svg .forbidden_root', function(e) {
		$('#install_normal_edit_map_zoom_popup').hide();
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
	});
	
	/* USEFULL ?
	$(document).on('touchstart', '#install_normal_edit_map_svg .forbidden_root', function(e) {
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
		
		if (normalCanChangeMenu || normalCurrentAction == 'editForbiddenArea' || normalCurrentAction == 'addForbiddenArea')
		{
			timerNormalLongPress = setTimeout(NormalLongPressForbidden, 500);
			//timerNormalVeryLongPress = setTimeout(NormalLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentForbiddenNormalLongTouch = $(this);
		}
		NormalDisplayBlockZoom();
		
		NormalHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#install_normal_edit_map_svg .forbidden_root', function(e) {
    	//NormalHideMenus();
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
		//NormalDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#install_normal_edit_map_svg .area_root', function(e) {
		$('#install_normal_edit_map_zoom_popup').hide();
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#install_normal_edit_map_svg .area_root', function(e) {
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
		
		if (normalCanChangeMenu || normalCurrentAction == 'editArea' || normalCurrentAction == 'addArea')
		{
			timerNormalLongPress = setTimeout(NormalLongPressArea, 500);
			//timerNormalVeryLongPress = setTimeout(NormalLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentAreaNormalLongTouch = $(this);
		}
		NormalDisplayBlockZoom();
		
		NormalHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#install_normal_edit_map_svg .area_root', function(e) {
    	//NormalHideMenus();
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
		//NormalDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#install_normal_edit_map_svg .dock_elem', function(e) {
		$('#install_normal_edit_map_zoom_popup').hide();
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#install_normal_edit_map_svg .dock_elem', function(e) {
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
		
		if (normalCanChangeMenu)
		{
			timerNormalLongPress = setTimeout(NormalLongPressDock, 500);
			//timerNormalVeryLongPress = setTimeout(NormalLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentDockNormalLongTouch = $(this);
		}
		NormalDisplayBlockZoom();
		
		NormalHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#install_normal_edit_map_svg .dock_elem', function(e) {
    	//NormalHideMenus();
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
		//NormalDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#install_normal_edit_map_svg .poi_elem', function(e) {
		$('#install_normal_edit_map_zoom_popup').hide();
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#install_normal_edit_map_svg .poi_elem', function(e) {
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
		
		if (normalCanChangeMenu)
		{
			timerNormalLongPress = setTimeout(NormalLongPressPoi, 500);
			//timerNormalVeryLongPress = setTimeout(NormalLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentPoiNormalLongTouch = $(this);
		}
		NormalDisplayBlockZoom();
		
		NormalHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#install_normal_edit_map_svg .poi_elem', function(e) {
    	//NormalHideMenus();
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
		//NormalDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#install_normal_edit_map_svg .augmented_pose_elem', function(e) {
		$('#install_normal_edit_map_zoom_popup').hide();
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#install_normal_edit_map_svg .augmented_pose_elem', function(e) {
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
		
		if (normalCanChangeMenu)
		{
			timerNormalLongPress = setTimeout(NormalLongPressAugmentedPose, 500);
			//timerNormalVeryLongPress = setTimeout(NormalLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentAugmentedPoseNormalLongTouch = $(this);
		}
		NormalDisplayBlockZoom();
		
		NormalHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#install_normal_edit_map_svg .augmented_pose_elem', function(e) {
    	NormalHideMenus();
		if (timerNormalLongPress != null)
		{
			clearTimeout(timerNormalLongPress);
			timerNormalLongPress = null;
		}
		if (timerNormalVeryLongPress != null)
		{
			clearTimeout(timerNormalVeryLongPress);
			timerNormalVeryLongPress = null;
		}
		NormalDisplayBlockZoom();
	});
	
	$('#install_normal_edit_map .burger_menu').on('click', function(e) {
		if($(this).hasClass('burger_menu_open')){
			NormalHideMenus()
		}else{
			NormalDisplayMenu($(this).data('open'))
		}
	});
	
	$('#install_normal_edit_map .icon_menu').on('click', function(e) {
		
		switch(normalCurrentAction){
			case 'prepareArea': 
			case 'prepareForbiddenArea': 
			case 'prepareGotoPose': 
				normalCurrentAction='';
				normalCanChangeMenu = true;
			break;
		}
		if (normalCanChangeMenu)
		{
			NormalHideMenus();
			
			if($(this).data('menu') == 'install_normal_edit_map_menu_point')
			{
				if (normalCurrentAction == 'editForbiddenArea' || normalCurrentAction == 'addbiddenArea')
				{
					NormalDisplayMenu('install_normal_edit_map_menu_forbidden');
				}
				else if (normalCurrentAction == 'editArea' || normalCurrentAction == 'addArea')
				{
					NormalDisplayMenu('install_normal_edit_map_menu_area');
				}
			}
			else
			{
				
				RemoveClass('#install_normal_edit_map_svg .active', 'active');
				RemoveClass('#install_normal_edit_map_svg .activ_select', 'activ_select'); 
				
				currentSelectedItem = Array();
				normalCurrentAction='';
				$('body').removeClass('no_current select');
				$('.select').css("strokeWidth", minStokeWidth);
			}
		}
	});
	
	$('#install_normal_edit_map .times_icon_menu').click(function(){
		$('#install_normal_edit_map .icon_menu').click();
	})
});

function NormalHideMenus()
{
	$('#install_normal_edit_map .times_icon_menu').hide()
	$('#install_normal_edit_map_menu li').hide();
	$('#install_normal_edit_map_menu_point li').hide();
	$('#install_normal_edit_map_menu_forbidden li').hide();
	$('#install_normal_edit_map_menu_area li').hide();
	$('#install_normal_edit_map_menu_dock li').hide();
	$('#install_normal_edit_map_menu_poi li').hide();
	$('#install_normal_edit_map_menu_augmented_pose li').hide();
	$('#install_normal_edit_map_menu_erase li').hide();
	$('#install_normal_edit_map .popupHelp').hide();
	
	$('#install_normal_edit_map .burger_menu_open').removeClass('burger_menu_open');
	
	$('#install_normal_edit_map .burger_menu').css('display','flex');
	
	$('#install_normal_edit_map .icon_menu').hide('fast');
}

function NormalDisplayMenu(id_menu)
{
	NormalHideMenus();
	
	let idxH = 1;
	let idxV = 1;
	let idxD = 1;
	console.log(id_menu);
	
	//ICONE CORRESPONDANTE INSTEAD BURGER MENU
	let icon_menu = $('#install_normal_edit_map .icon_menu[data-menu="'+id_menu+'"]');

	if(icon_menu.lentgh != 0){
		if(id_menu == 'install_normal_edit_map_menu_forbidden' || id_menu == 'install_normal_edit_map_menu_area'){
			icon_menu.show('fast');
		}else{		
			icon_menu.show('fast');
		}
	}
	
	if(id_menu != 'install_normal_edit_map_menu'){
		$('#install_normal_edit_map .burger_menu').hide('fast');
		setTimeout(function(){$('#install_normal_edit_map .times_icon_menu').show('fast')},50);
	}else{
		$('#install_normal_edit_map .burger_menu').addClass('burger_menu_open');
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

/*
function NormalHideMenus()
{
	$('#install_normal_edit_map_menu li').hide();
	$('#install_normal_edit_map_menu_point li').hide();
	$('#install_normal_edit_map_menu_forbidden li').hide();
	$('#install_normal_edit_map_menu_area li').hide();
	$('#install_normal_edit_map_menu_dock li').hide();
	$('#install_normal_edit_map_menu_poi li').hide();
	$('#install_normal_edit_map_menu_augmented_pose li').hide();
	$('.popupHelp').hide();
}

function NormalDisplayMenu(id_menu)
{
	$('#'+id_menu+' li').hide();
	$('#'+id_menu).show();

	topCenter = (eventTouchStart.originalEvent.targetTouches ? eventTouchStart.originalEvent.targetTouches[0].clientY : eventTouchStart.originalEvent.clientY) - $('#install_normal_edit_map_container_all').offset().top;
	leftCenter = (eventTouchStart.originalEvent.targetTouches ? eventTouchStart.originalEvent.targetTouches[0].clientX : eventTouchStart.originalEvent.clientX) - $('#install_normal_edit_map_container_all').offset().left;
	
	$('#'+id_menu).css({top: topCenter, left: leftCenter});
	
	rayon = 80;
	
	decallageX = 0;
	decallageY = 0;
	angleDep = 21;
	
	if (leftCenter > $('#install_normal_edit_map_container_all').width() - 100)
		angleDep += 180;
	
	minLeft = 10000;
	maxLeft = -100;
	minTop = 10000;
	maxTop = -100;
	
	$('#'+id_menu+' li').each(function(index, element) {
		angle = (angleDep + 45*index) * Math.PI/180;
		// x = rsin(??), y = rcos(??)
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
	if (leftCenter + maxLeft + 50 > $('#install_normal_edit_map_container_all').width() - 20)
		decallageX = ($('#install_normal_edit_map_container_all').width() - 20) - (leftCenter + maxLeft + 50);
	
	if (topCenter + minTop < 20)
		decallageY = 20 - (topCenter + minTop);
	if (topCenter + maxTop + 50 > $('#install_normal_edit_map_container_all').height() - 20)
		decallageY = ($('#install_normal_edit_map_container_all').height() - 20) - (topCenter + maxTop + 50);
		
	if (decallageX != 0 || decallageY != 0)
	{
		$('#'+id_menu+' li').each(function(index, element) {
			$(this).css({left: '+='+decallageX, top: '+='+decallageY});
    	});
	}
}
*/

function NormalLongPressForbidden()
{
	timerNormalLongPress = null;
	NormalDisplayMenu('install_normal_edit_map_menu_forbidden');
}

function NormalLongPressArea()
{
	timerNormalLongPress = null;
	NormalDisplayMenu('install_normal_edit_map_menu_area');
}

function NormalLongPressDock()
{
	timerNormalLongPress = null;
	NormalDisplayMenu('install_normal_edit_map_menu_dock');
}

function NormalLongPressPoi()
{
	timerNormalLongPress = null;
	NormalDisplayMenu('install_normal_edit_map_menu_poi');
}

function NormalLongPressAugmentedPose()
{
	timerNormalLongPress = null;
	NormalDisplayMenu('install_normal_edit_map_menu_augmented_pose');
}

function NormalLongPressPointDeletable()
{
	timerNormalLongPress = null;
	NormalDisplayMenu('install_normal_edit_map_menu_point');
}

function NormalLongVeryPressSVG()
{
	timerNormalVeryLongPress = null;
	
	$('#install_normal_edit_map_container_all .popupHelp').show(200);	
}

function NormalLongPressSVG()
{
	timerNormalLongPress = null;
	NormalDisplayMenu('install_normal_edit_map_menu');
}

var resetPan = false;
$(document).ready(function(e) {
    $('#install_normal_edit_map_svg').on('touchend', function(e) {
		resetPan = true;
	});
	$('#install_normal_edit_map_svg').on('touchstart', function(e) {
		resetPan = true;
	});
});
function NormalInitMap()
{
	var eventsHandlerNormal;

	eventsHandlerNormal = {
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
	
	window.panZoomNormal = svgPanZoom('#install_normal_edit_map_svg', {
	  zoomEnabled: true
	, controlIconsEnabled: false
	, maxZoom: 20
	, fit: 1
	, center: 1
	, customEventsHandler: eventsHandlerNormal
	, RefreshMap: function() { setTimeout(NormalRefreshZoomView, 10); }
	});
	
	svgNormal = document.querySelector('#install_normal_edit_map_svg .svg-pan-zoom_viewport');
	
	//window.panZoomNormal = {};
	//window.panZoomNormal.getZoom = function () { return 1; }
	NormalRefreshZoomView();
}

function NormalShakeActiveElement()
{
	if(!normalCanChangeMenu){
		let ca = normalCurrentAction;
		let target = '';
		if(ca == 'addForbiddenArea' || ca == 'editForbiddenArea' || ca == 'editArea' || ca == 'addArea'){
			//SHAKE BTN BLEU ORANGE
			target = $('#install_normal_edit_map .btnSaveElem');
		}else if(ca == 'prepareArea' || ca == 'prepareGotoPose' || ca == 'prepareForbiddenArea'){
			target = $('#install_normal_edit_map .btn-circle.icon_menu:visible');
			setTimeout(function(){$('#install_normal_edit_map .times_icon_menu').toggleClass('shake')},1000);
			setTimeout(function(){$('#install_normal_edit_map .times_icon_menu').toggleClass('shake')},3000);
		}else if(ca == 'gomme'){
			target = $('#install_normal_edit_map_bEndGomme');
		}
		if(target != ''){
			setTimeout(function(){target.toggleClass('shake')},1000);
			setTimeout(function(){target.toggleClass('shake')},3000);
		}
	}	
}