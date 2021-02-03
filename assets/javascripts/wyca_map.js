// JavaScript Document
function GetInfosCurrentMapWyca()
{
	if (wycaApi.websocketAuthed)
	{
		GetInfosCurrentMapDoWyca();
	}
	else
	{
		setTimeout(GetInfosCurrentMapWyca, 500);
	}
}

function GetInfosCurrentMapDoWyca()
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
			landmarks = data.D.landmarks;
			augmented_poses = data.D.augmented_poses;
			
			$('#wyca_edit_map_zoom_carte .img-responsive').attr('src', 'data:image/png;base64,'+data.D.image_tri);
			
			largeurSlam = data.D.ros_width;
			hauteurSlam = data.D.ros_height;
			largeurRos = data.D.ros_width;
			hauteurRos = data.D.ros_height;
			
			ros_largeur = data.D.ros_width;
			ros_hauteur = data.D.ros_height;
			ros_resolution = data.D.ros_resolution;
			
			$('#wyca_edit_map_svg').attr('width', data.D.ros_width);
			$('#wyca_edit_map_svg').attr('height', data.D.ros_height);
			
			$('#wyca_edit_map_image').attr('width', data.D.ros_width);
			$('#wyca_edit_map_image').attr('height', data.D.ros_height);
			$('#wyca_edit_map_image').attr('xlink:href', 'data:image/png;base64,'+data.D.image_tri);
		  
			$('#wyca_mapping_use .bUseThisMapNowYes').show();
			$('#wyca_mapping_use .bUseThisMapNowNo').show();
			$('#wyca_mapping_use .modalUseThisMapNowTitle1').show();
			$('#wyca_mapping_use .modalUseThisMapNowTitle2').hide();
			$('#wyca_mapping_use .modalUseThisMapNowContent').hide();
			
			wycaHistoriques = Array();
			wycaHistoriqueIndex = -1;
			WycaRefreshHistorique();
			
			setTimeout(function(){
				WycaInitMap();
				WycaResizeSVG();
				
				/* REFRESH IDS IF MENU OPEN */
				let actions_searched = ['editPoi','editDock','editAugmentedPose','editForbiddenArea','editArea'];
				let temp = false;
				if(actions_searched.includes(wycaCurrentAction)){
					switch(wycaCurrentAction){
						case 'editPoi' :
							temp = FindElemByName(pois,WycaBufferMapSaveElemName);
							if(temp){
								currentPoiWycaLongTouch = $('#wyca_edit_map_poi_secure_'+temp.id_poi);
								currentPoiWycaLongTouch.data('id_poi',temp.id_poi);
								currentPoiWycaLongTouch.click();
								WycaBufferMapSaveElemName = '';
							}
						break;
						case 'editDock' :
							temp = FindElemByName(docks,WycaBufferMapSaveElemName);
							if(temp){
								currentDockWycaLongTouch = $('#wyca_edit_map_dock_secure_'+temp.id_docking_station);
								currentDockWycaLongTouch.click();
								currentDockWycaLongTouch.data('id_docking_station',temp.id_docking_station);
								WycaBufferMapSaveElemName = '';
							}
						break;
						case 'editAugmentedPose' :
							temp = FindElemByName(augmented_poses,WycaBufferMapSaveElemName);
							if(temp){
								currentAugmentedPoseWycaLongTouch = $('#wyca_edit_map_augmented_pose_secure_'+temp.id_augmented_pose);
								currentAugmentedPoseWycaLongTouch.click();
								currentAugmentedPoseWycaLongTouch.data('id_augmented_pose',temp.id_augmented_pose);
								WycaBufferMapSaveElemName = '';
							}
						break;
						case 'editForbiddenArea' :
							temp = FindElemByName(forbiddens,WycaBufferMapSaveElemName);
							if(temp){
								currentForbiddenWycaLongTouch = $('#wyca_edit_map_forbidden_'+temp.id_area);
								currentForbiddenWycaLongTouch.click();
								currentForbiddenWycaLongTouch.data('id_area',temp.id_area);
								WycaBufferMapSaveElemName = '';
							}
						break;
						case 'editArea' :
							temp = FindElemByName(areas,WycaBufferMapSaveElemName);
							if(temp){
								currentAreaWycaLongTouch = $('#wyca_edit_map_area_'+temp.id_area);
								currentAreaWycaLongTouch.click();
								currentAreaWycaLongTouch.data('id_area',temp.id_area);
								WycaBufferMapSaveElemName = '';
							}
						break;
						default: WycaBufferMapSaveElemName = ''; break;
					}
				}
				$('#wyca_edit_map .modalReloadMap').modal('hide');
				$('#wyca_edit_map .modalReloadMap .btn').removeClass('disabled');
				$('#wyca_edit_map .modalReloadMap .wyca_edit_map_modalReloadMap_loading').hide();
				
				$('#wyca_edit_map .modalConfirmNoReloadMap').modal('hide');
				$('#wyca_edit_map .modalConfirmNoReloadMap .btn').removeClass('disabled');
				$('#wyca_edit_map .modalConfirmNoReloadMap .wyca_edit_map_modalReloadMap_loading').hide();
				
				RemoveClass('#wyca_edit_map_svg .active', 'active');
				RemoveClass('#wyca_edit_map_svg .activ_select', 'activ_select'); 
				RemoveClass('#wyca_edit_map_svg .editing_point', 'editing_point'); 
				
				wycaCanChangeMenu = true;
				wycaCurrentAction = '';
				
				WycaHideMenus();
				
			},500);
			$('#wyca_edit_map .modal').not('.modalReloadMap').each(function(){$(this).modal('hide')});
			$('#bHeaderInfo').attr('onClick',"TogglePopupHelp()");
		}
		else
		{
			ParseAPIAnswerError(data,textErrorGetMap);
		}
	});
}

function WycaDisplayBlockZoom()
{
	if (blockZoom)
	{
		//svgData = new XMLSerializer().serializeToString(svgTemp);
		//imgForSVG.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
		p = document.getElementById("wyca_edit_map_svg"); 
		p_prime = p.cloneNode(true);
		p_prime.id = "wyca_edit_map_svg_clone";
		$('#wyca_edit_map_zoom_popup_content').html('');
		document.getElementById('wyca_edit_map_zoom_popup_content').appendChild(p_prime);
		
		$('#wyca_edit_map_svg_clone').width(ros_largeur);
		$('#wyca_edit_map_svg_clone').height(ros_hauteur);
					
		p = $('#wyca_edit_map_svg image').position();
		x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) - p.left;
		y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - p.top;

		//zoom = ros_largeur / $('#wyca_edit_map_svg').width() / window.panZoomWyca.getZoom();
		zoom = WycaGetZoom();	
		/*
		$('#wyca_edit_map_img_svg').css('left',(-x*zoom) * 10 + 50);
		$('#wyca_edit_map_img_svg').css('top', (-y*zoom) * 10 + 50);
		*/
		
		//$('#wyca_edit_map_svg_clone').css('left', -event.targetTouches[0].pageX + 50 + 2);
		//$('#wyca_edit_map_svg_clone').css('top', -event.targetTouches[0].pageY + 50 + $('#wyca_edit_map_container_all').position().top + 23);
		
		//x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
		//y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
		
		z = window.panZoomWyca.getZoom();
		x = -x + 50 + 2; // * z;
		y = -y + 50 + 2; // * z;
		
		var obj = $('#wyca_edit_map_svg g');
		var transformMatrix = obj.css("-webkit-transform") ||
		   obj.css("-moz-transform")    ||
		   obj.css("-ms-transform")     ||
		   obj.css("-o-transform")      ||
		   obj.css("transform");
		   
		obj = $('#wyca_edit_map_svg_clone g');
		obj.attr('id', 'wyca_edit_map_svg_clone_g');
		 
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
	
		element = document.getElementById('wyca_edit_map_svg_clone_g');
		element.setAttributeNS(null, "transform", s);
		if ("transform" in element.style) {
		  element.style.transform = s;
		} else if ("-ms-transform" in element.style) {
		  element.style["-ms-transform"] = s;
		} else if ("-webkit-transform" in element.style) {
		  element.style["-webkit-transform"] = s;
		}
		
		l = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) + 50;
		if (l + 101 > $('#wyca_edit_map_container_all').width() - 20) l -= 200;
		t = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - 150;
		if (t + 101 > $('body').height() - 20) t -= 100;
		if (t < 20) t = 20;
		$('#wyca_edit_map_zoom_popup').css('left', l);
		$('#wyca_edit_map_zoom_popup').css('top', t);
		$('#wyca_edit_map_zoom_popup').show();
		
		/*
		
		$('#wyca_edit_map_svg_copy').html($('#wyca_edit_map_svg .svg-pan-zoom_viewport').html());
		
		p = $('#wyca_edit_map_svg image').position();
		x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
		y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
		
		//zoom = ros_largeur / $('#wyca_edit_map_svg').width() / window.panZoomWyca.getZoom();
		zoom = WycaGetZoom();
				
		$('#wyca_edit_map_svg_copy').css('left', -x*zoom + 50);
		$('#wyca_edit_map_svg_copy').css('top', -y*zoom + 50);
		
		$('#wyca_edit_map_zoom_popup').css('left', (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) + 50);
		$('#wyca_edit_map_zoom_popup').css('top', (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - 150);
		$('#wyca_edit_map_zoom_popup').show();
		*/
	}
	else
	{
		$('#wyca_edit_map_zoom_popup').hide();
	}
}

var timerWycaLongPress = null;
var timerWycaVeryLongPress = null;
var eventTouchStart = null;
var currentPointWycaLongTouch = null;
var currentForbiddenWycaLongTouch = null;
var currentAreaWycaLongTouch = null;
var currentDockWycaLongTouch = null;
var currentPoiWycaLongTouch = null;
var currentAugmentedPoseWycaLongTouch = null;
var currentLandmarkWycaLongTouch = null;

$(document).ready(function(e) {
	
	$('#wyca_edit_map_svg').on('touchend', function(e) { 
		$('#wyca_edit_map_zoom_popup').hide();
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
	});
	
	$('#wyca_edit_map_svg').on('touchstart', function(e) {
		WycaDisplayBlockZoom();
	});
    
	/*
	$('#wyca_edit_map_svg').on('touchstart', function(e) {
		
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
		
		if (wycaCanChangeMenu)
		{
			timerWycaLongPress = setTimeout(WycaLongPressSVG, 500);
			timerWycaVeryLongPress = setTimeout(WycaLongVeryPressSVG, 1500);
			eventTouchStart = e;
		}
		WycaDisplayBlockZoom();
		
		WycaHideMenus();
		
	});
	*/
	
	
	$('#wyca_edit_map_svg').on('touchmove', function(e) {
		//WycaHideMenus();
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
		WycaDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#wyca_edit_map_svg .point_deletable', function(e) {
		$('#wyca_edit_map_zoom_popup').hide();
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
	});
	
	$(document).on('touchstart', '#wyca_edit_map_svg .point_deletable', function(e) {
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
		
		if (wycaCanChangeMenu || wycaCurrentAction == 'addForbiddenArea' || wycaCurrentAction == 'addArea' || wycaCurrentAction == 'editForbiddenArea' || wycaCurrentAction == 'editArea')
		{
			//timerWycaLongPress = setTimeout(WycaLongPressPointDeletable, 500);
			timerWycaLongPress = WycaLongPressPointDeletable();
			//timerWycaVeryLongPress = setTimeout(WycaLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentPointWycaLongTouch = $(this);
		}
		WycaDisplayBlockZoom();
		
		//WycaHideMenus();
		
	});
	
	$(document).on('touchmove', '#wyca_edit_map_svg .point_deletable', function(e) {
    	//WycaHideMenus();
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
		//WycaDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#wyca_edit_map_svg .forbidden_root', function(e) {
		$('#wyca_edit_map_zoom_popup').hide();
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
	});
	
	/* USEFULL ?
	$(document).on('touchstart', '#wyca_edit_map_svg .forbidden_root', function(e) {
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
		
		if (wycaCanChangeMenu || wycaCurrentAction == 'editForbiddenArea' || wycaCurrentAction == 'addForbiddenArea')
		{
			timerWycaLongPress = setTimeout(WycaLongPressForbidden, 500);
			//timerWycaVeryLongPress = setTimeout(WycaLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentForbiddenWycaLongTouch = $(this);
		}
		WycaDisplayBlockZoom();
		
		WycaHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#wyca_edit_map_svg .forbidden_root', function(e) {
    	//WycaHideMenus();
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
		//WycaDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#wyca_edit_map_svg .area_root', function(e) {
		$('#wyca_edit_map_zoom_popup').hide();
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#wyca_edit_map_svg .area_root', function(e) {
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
		
		if (wycaCanChangeMenu || wycaCurrentAction == 'editArea' || wycaCurrentAction == 'addArea')
		{
			timerWycaLongPress = setTimeout(WycaLongPressArea, 500);
			//timerWycaVeryLongPress = setTimeout(WycaLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentAreaWycaLongTouch = $(this);
		}
		WycaDisplayBlockZoom();
		
		WycaHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#wyca_edit_map_svg .area_root', function(e) {
    	//WycaHideMenus();
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
		//WycaDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#wyca_edit_map_svg .dock_elem', function(e) {
		$('#wyca_edit_map_zoom_popup').hide();
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#wyca_edit_map_svg .dock_elem', function(e) {
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
		
		if (wycaCanChangeMenu)
		{
			timerWycaLongPress = setTimeout(WycaLongPressDock, 500);
			//timerWycaVeryLongPress = setTimeout(WycaLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentDockWycaLongTouch = $(this);
		}
		WycaDisplayBlockZoom();
		
		WycaHideMenus();
		
	});
	*/
	
	$(document).on('touchend', '#wyca_edit_map_svg .landmark_elem', function(e) {
		$('#wyca_edit_map_zoom_popup').hide();
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#wyca_edit_map_svg .landmark_elem', function(e) {
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
		
		if (wycaCanChangeMenu)
		{
			timerWycaLongPress = setTimeout(WycaLongPressDock, 500);
			//timerWycaVeryLongPress = setTimeout(WycaLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentDockWycaLongTouch = $(this);
		}
		WycaDisplayBlockZoom();
		
		WycaHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#wyca_edit_map_svg .landmark_elem', function(e) {
    	//WycaHideMenus();
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
		//WycaDisplayBlockZoom();
	});
	
	$(document).on('touchmove', '#wyca_edit_map_svg .dock_elem', function(e) {
    	//WycaHideMenus();
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
		//WycaDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#wyca_edit_map_svg .poi_elem', function(e) {
		$('#wyca_edit_map_zoom_popup').hide();
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#wyca_edit_map_svg .poi_elem', function(e) {
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
		
		if (wycaCanChangeMenu)
		{
			timerWycaLongPress = setTimeout(WycaLongPressPoi, 500);
			//timerWycaVeryLongPress = setTimeout(WycaLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentPoiWycaLongTouch = $(this);
		}
		WycaDisplayBlockZoom();
		
		WycaHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#wyca_edit_map_svg .poi_elem', function(e) {
    	//WycaHideMenus();
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
		//WycaDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#wyca_edit_map_svg .augmented_pose_elem', function(e) {
		$('#wyca_edit_map_zoom_popup').hide();
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#wyca_edit_map_svg .augmented_pose_elem', function(e) {
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
		
		if (wycaCanChangeMenu)
		{
			timerWycaLongPress = setTimeout(WycaLongPressAugmentedPose, 500);
			//timerWycaVeryLongPress = setTimeout(WycaLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentAugmentedPoseWycaLongTouch = $(this);
		}
		WycaDisplayBlockZoom();
		
		WycaHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#wyca_edit_map_svg .augmented_pose_elem', function(e) {
    	WycaHideMenus();
		if (timerWycaLongPress != null)
		{
			clearTimeout(timerWycaLongPress);
			timerWycaLongPress = null;
		}
		if (timerWycaVeryLongPress != null)
		{
			clearTimeout(timerWycaVeryLongPress);
			timerWycaVeryLongPress = null;
		}
		WycaDisplayBlockZoom();
	});
	
	$('#wyca_edit_map .burger_menu').on('click', function(e) {
		if($(this).hasClass('burger_menu_open')){
			WycaHideMenus()
		}else{
			WycaDisplayMenu($(this).data('open'))
		}
	});
	
	$('#wyca_edit_map .icon_menu').on('click', function(e) {
		
		switch(wycaCurrentAction){
			case 'prepareArea': 
			case 'prepareForbiddenArea': 
			case 'prepareGotoPose': 
				wycaCurrentAction='';
				wycaCanChangeMenu = true;
			break;
		}
		if (wycaCanChangeMenu)
		{
			WycaHideMenus();
			
			if($(this).data('menu') == 'wyca_edit_map_menu_point')
			{
				if (wycaCurrentAction == 'editForbiddenArea' || wycaCurrentAction == 'addbiddenArea')
				{
					RemoveClass('#wyca_edit_map_svg .point_deletable', 'editing_point');
					WycaDisplayMenu('wyca_edit_map_menu_forbidden');
				}
				else if (wycaCurrentAction == 'editArea' || wycaCurrentAction == 'addArea')
				{
					RemoveClass('#wyca_edit_map_svg .point_deletable', 'editing_point');
					WycaDisplayMenu('wyca_edit_map_menu_area');
				}
			}
			else
			{
				
				RemoveClass('#wyca_edit_map_svg .active', 'active');
				RemoveClass('#wyca_edit_map_svg .activ_select', 'activ_select'); 
				
				currentSelectedItem = Array();
				wycaCurrentAction='';
				$('body').removeClass('no_current select');
				$('.select').css("strokeWidth", minStokeWidth);
			}
		}
	});
	
	$('#wyca_edit_map .times_icon_menu').click(function(){
		$('#wyca_edit_map .icon_menu:visible').click();
	})
});

function WycaHideMenus()
{
	$('#wyca_edit_map .times_icon_menu').hide()
	$('#wyca_edit_map_menu li').hide();
	$('#wyca_edit_map_menu_point li').hide();
	$('#wyca_edit_map_menu_forbidden li').hide();
	$('#wyca_edit_map_menu_area li').hide();
	$('#wyca_edit_map_menu_dock li').hide();
	$('#wyca_edit_map_menu_poi li').hide();
	$('#wyca_edit_map_menu_augmented_pose li').hide();
	$('#wyca_edit_map_menu_landmark li').hide();
	$('#wyca_edit_map_menu_erase li').hide();
	$('#wyca_edit_map .popupHelp').hide();
	
	$('#wyca_edit_map .burger_menu_open').removeClass('burger_menu_open');
	
	$('#wyca_edit_map .burger_menu').css('display','flex');
	
	$('#wyca_edit_map .icon_menu').hide('fast');
}

function WycaDisplayMenu(id_menu)
{
	WycaHideMenus();
	
	let idxH = 1;
	let idxV = 1;
	let idxD = 1;
	console.log(id_menu);
	
	//ICONE CORRESPONDANTE INSTEAD BURGER MENU
	let icon_menu = $('#wyca_edit_map .icon_menu[data-menu="'+id_menu+'"]');

	if(icon_menu.lentgh != 0){
		if(id_menu == 'wyca_edit_map_menu_forbidden' || id_menu == 'wyca_edit_map_menu_area'){
			icon_menu.show('fast');
		}else{		
			icon_menu.show('fast');
		}
	}
	
	if(id_menu != 'wyca_edit_map_menu'){
		$('#wyca_edit_map .burger_menu').hide('fast');
		setTimeout(function(){$('#wyca_edit_map .times_icon_menu').show('fast')},50);
	}else{
		$('#wyca_edit_map .burger_menu').addClass('burger_menu_open');
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
function WycaHideMenus()
{
	$('#wyca_edit_map_menu li').hide();
	$('#wyca_edit_map_menu_point li').hide();
	$('#wyca_edit_map_menu_forbidden li').hide();
	$('#wyca_edit_map_menu_area li').hide();
	$('#wyca_edit_map_menu_dock li').hide();
	$('#wyca_edit_map_menu_poi li').hide();
	$('#wyca_edit_map_menu_augmented_pose li').hide();
	$('.popupHelp').hide();
}

function WycaDisplayMenu(id_menu)
{
	$('#'+id_menu+' li').hide();
	$('#'+id_menu).show();

	topCenter = (eventTouchStart.originalEvent.targetTouches ? eventTouchStart.originalEvent.targetTouches[0].clientY : eventTouchStart.originalEvent.clientY) - $('#wyca_edit_map_container_all').offset().top;
	leftCenter = (eventTouchStart.originalEvent.targetTouches ? eventTouchStart.originalEvent.targetTouches[0].clientX : eventTouchStart.originalEvent.clientX) - $('#wyca_edit_map_container_all').offset().left;
	
	$('#'+id_menu).css({top: topCenter, left: leftCenter});
	
	rayon = 80;
	
	decallageX = 0;
	decallageY = 0;
	angleDep = 21;
	
	if (leftCenter > $('#wyca_edit_map_container_all').width() - 100)
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
	if (leftCenter + maxLeft + 50 > $('#wyca_edit_map_container_all').width() - 20)
		decallageX = ($('#wyca_edit_map_container_all').width() - 20) - (leftCenter + maxLeft + 50);
	
	if (topCenter + minTop < 20)
		decallageY = 20 - (topCenter + minTop);
	if (topCenter + maxTop + 50 > $('#wyca_edit_map_container_all').height() - 20)
		decallageY = ($('#wyca_edit_map_container_all').height() - 20) - (topCenter + maxTop + 50);
		
	if (decallageX != 0 || decallageY != 0)
	{
		$('#'+id_menu+' li').each(function(index, element) {
			$(this).css({left: '+='+decallageX, top: '+='+decallageY});
    	});
	}
}
*/

function WycaLongPressForbidden()
{
	timerWycaLongPress = null;
	WycaDisplayMenu('wyca_edit_map_menu_forbidden');
}

function WycaLongPressArea()
{
	timerWycaLongPress = null;
	WycaDisplayMenu('wyca_edit_map_menu_area');
}

function WycaLongPressDock()
{
	timerWycaLongPress = null;
	WycaDisplayMenu('wyca_edit_map_menu_dock');
}

function WycaLongPressLandmark()
{
	timerWycaLongPress = null;
	WycaDisplayMenu('wyca_edit_map_menu_landmark');
}

function WycaLongPressPoi()
{
	timerWycaLongPress = null;
	WycaDisplayMenu('wyca_edit_map_menu_poi');
}

function WycaLongPressAugmentedPose()
{
	timerWycaLongPress = null;
	WycaDisplayMenu('wyca_edit_map_menu_augmented_pose');
}

function WycaLongPressPointDeletable()
{
	timerWycaLongPress = null;
	if($('#wyca_edit_map .icon_menu[data-menu="wyca_edit_map_menu_point"]:visible').length == 0 && (wycaCurrentAction == 'addForbiddenArea' || wycaCurrentAction == 'addArea' || wycaCurrentAction == 'editForbiddenArea' || wycaCurrentAction == 'editArea') )
		WycaDisplayMenu('wyca_edit_map_menu_point');
}

function WycaLongVeryPressSVG()
{
	timerWycaVeryLongPress = null;
	
	$('#wyca_edit_map_container_all .popupHelp').show(200);	
}

function WycaLongPressSVG()
{
	timerWycaLongPress = null;
	WycaDisplayMenu('wyca_edit_map_menu');
}

var resetPan = false;

$(document).ready(function(e) {
    $('#wyca_edit_map_svg').on('touchend', function(e) {
		resetPan = true;
	});
	$('#wyca_edit_map_svg').on('touchstart', function(e) {
		resetPan = true;
	});
});

function WycaInitMap()
{
	var eventsHandlerWyca;

	eventsHandlerWyca = {
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
	
	window.panZoomWyca = svgPanZoom('#wyca_edit_map_svg', {
	  zoomEnabled: true
	, controlIconsEnabled: false
	, maxZoom: 20
	, fit: 1
	, center: 1
	, customEventsHandler: eventsHandlerWyca
	, RefreshMap: function() { setTimeout(WycaRefreshZoomView, 10); }
	});
	
	svgWyca = document.querySelector('#wyca_edit_map_svg .svg-pan-zoom_viewport');
	
	//window.panZoomWyca = {};
	//window.panZoomWyca.getZoom = function () { return 1; }
	WycaRefreshZoomView();
	
	$('.wyca_edit_map_loading').hide();
}

function WycaShakeActiveElement()
{
	if(!wycaCanChangeMenu){
		let ca = wycaCurrentAction;
		let target = '';
		if(ca == 'addForbiddenArea' || ca == 'editForbiddenArea' || ca == 'editArea' || ca == 'addArea'){
			//SHAKE BTN BLEU ORANGE
			target = $('#wyca_edit_map .btnSaveElem');
		}else if(ca == 'prepareArea' || ca == 'prepareGotoPose' || ca == 'prepareForbiddenArea'){
			target = $('#wyca_edit_map .btn-circle.icon_menu:visible');
			setTimeout(function(){$('#wyca_edit_map .times_icon_menu').toggleClass('shake')},1000);
			setTimeout(function(){$('#wyca_edit_map .times_icon_menu').toggleClass('shake')},3000);
		}else if(ca == 'gomme'){
			target = $('#wyca_edit_map_bEndGomme');
		}
		if(target != ''){
			setTimeout(function(){target.toggleClass('shake')},1000);
			setTimeout(function(){target.toggleClass('shake')},3000);
		}
	}	
}