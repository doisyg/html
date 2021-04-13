// JavaScript Document
function GetInfosCurrentMapByStep()
{
	if (wycaApi.websocketAuthed)
	{
		GetInfosCurrentMapDoByStep();
	}
	else
	{
		setTimeout(GetInfosCurrentMapByStep, 500);
	}
}

function GetInfosCurrentMapDoByStep()
{
	$('#install_by_step_edit_map .burger_menu').addClass('updatingMap');
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
			
			$('#install_by_step_edit_map_zoom_carte .img-responsive').attr('src', 'data:image/png;base64,'+data.D.image_tri);
			
			largeurSlam = data.D.ros_width;
			hauteurSlam = data.D.ros_height;
			largeurRos = data.D.ros_width;
			hauteurRos = data.D.ros_height;
			
			ros_largeur = data.D.ros_width;
			ros_hauteur = data.D.ros_height;
			ros_resolution = data.D.ros_resolution;
			
			$('#install_by_step_edit_map_svg').attr('width', data.D.ros_width);
			$('#install_by_step_edit_map_svg').attr('height', data.D.ros_height);
			
			$('#install_by_step_edit_map_image').attr('width', data.D.ros_width);
			$('#install_by_step_edit_map_image').attr('height', data.D.ros_height);
			$('#install_by_step_edit_map_image').attr('xlink:href', 'data:image/png;base64,'+data.D.image_tri);
		  
			$('#install_by_step_mapping_use .bUseThisMapNowYes').show();
			$('#install_by_step_mapping_use .bUseThisMapNowNo').show();
			$('#install_by_step_mapping_use .modalUseThisMapNowTitle1').show();
			$('#install_by_step_mapping_use .modalUseThisMapNowTitle2').hide();
			$('#install_by_step_mapping_use .modalUseThisMapNowContent').hide();
			
			bystepHistoriques = Array();
			bystepHistoriqueIndex = -1;
			ByStepRefreshHistorique();
			
			ByStepResizeSVG();
			
			setTimeout(function(){
				ByStepInitMap();
				ByStepResizeSVG();
				
				//currentAugmentedPoseByStepLongTouch = $('#...' + temp.id_augmented_pose
				
				/* REFRESH IDS IF MENU OPEN */
				let actions_searched = ['editPoi','editDock','editAugmentedPose','editForbiddenArea','editArea'];
				let temp = false;
				if(actions_searched.includes(bystepCurrentAction)){
					switch(bystepCurrentAction){
						case 'editPoi' :
							temp = FindElemByName(pois,ByStepBufferMapSaveElemName);
							if(temp){
								currentPoiByStepLongTouch = $('#install_by_step_edit_map_poi_secure_'+temp.id_poi);
								currentPoiByStepLongTouch.data('id_poi',temp.id_poi);
								currentPoiByStepLongTouch.click();
								ByStepBufferMapSaveElemName = '';
							}
						break;
						case 'editDock' :
							temp = FindElemByName(docks,ByStepBufferMapSaveElemName);
							if(temp){
								currentDockByStepLongTouch = $('#install_by_step_edit_map_dock_secure_'+temp.id_docking_station);
								currentDockByStepLongTouch.click();
								currentDockByStepLongTouch.data('id_docking_station',temp.id_docking_station);
								ByStepBufferMapSaveElemName = '';
							}
						break;
						case 'editAugmentedPose' :
							temp = FindElemByName(augmented_poses,ByStepBufferMapSaveElemName);
							if(temp){
								currentAugmentedPoseByStepLongTouch = $('#install_by_step_edit_map_augmented_pose_secure_'+temp.id_augmented_pose);
								currentAugmentedPoseByStepLongTouch.click();
								currentAugmentedPoseByStepLongTouch.data('id_augmented_pose',temp.id_augmented_pose);
								ByStepBufferMapSaveElemName = '';
							}
						break;
						case 'editForbiddenArea' :
							temp = FindElemByName(forbiddens,ByStepBufferMapSaveElemName);
							if(temp){
								currentForbiddenByStepLongTouch = $('#install_by_step_edit_map_forbidden_'+temp.id_area);
								currentForbiddenByStepLongTouch.click();
								currentForbiddenByStepLongTouch.data('id_area',temp.id_area);
								ByStepBufferMapSaveElemName = '';
							}
						break;
						case 'editArea' :
							temp = FindElemByName(areas,ByStepBufferMapSaveElemName);
							if(temp){
								currentAreaByStepLongTouch = $('#install_by_step_edit_map_area_'+temp.id_area);
								currentAreaByStepLongTouch.click();
								currentAreaByStepLongTouch.data('id_area',temp.id_area);
								ByStepBufferMapSaveElemName = '';
							}
						break;
						default: ByStepBufferMapSaveElemName = ''; break;
					}
				}
				$('#install_by_step_edit_map .modalReloadMap').modal('hide');
				$('#install_by_step_edit_map .modalReloadMap .btn').removeClass('disabled');
				$('#install_by_step_edit_map .modalReloadMap .install_by_step_edit_map_modalReloadMap_loading').hide();
				
				$('#install_by_step_edit_map .modalConfirmNoReloadMap').modal('hide');
				$('#install_by_step_edit_map .modalConfirmNoReloadMap .btn').removeClass('disabled');
				$('#install_by_step_edit_map .modalConfirmNoReloadMap .install_by_step_edit_map_modalReloadMap_loading').hide();
				
				RemoveClass('#install_by_step_edit_map_svg .active', 'active');
				RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
				RemoveClass('#install_by_step_edit_map_svg .editing_point', 'editing_point'); 
				
				bystepCanChangeMenu = true;
				bystepCurrentAction = '';
				ByStepSaveElementNeeded(!bystepCanChangeMenu);
				$('#install_by_step_edit_map .burger_menu').removeClass('updatingMap');
				ByStepHideMenus();
				
			},500); 
			$('#install_by_step_edit_map .modal').not('.modalReloadMap').each(function(){$(this).modal('hide')});
			$('#bHeaderInfo').attr('onClick',"TogglePopupHelp()");
			if (gotoTest) InitTest();
			gotoTest = false;
		}
		else
		{
			$('#install_by_step_edit_map .burger_menu').removeClass('updatingMap');
			ParseAPIAnswerError(data,textErrorInitMap);
		}
	});
}

function InitTest()
{
	$('#install_by_step_test_map .list_test li').remove();
	$('#install_by_step_test_map .install_by_step_test_map_loading').hide();
	
	var indexLi = 0;
	
	if (pois.length > 0)
	{
		$.each(pois, function(indexInArray, poi){
			indexLi++;
			$('#install_by_step_test_map .list_test').append('' +
				'<li id="list_test_'+indexLi+'" data-index_li="'+indexLi+'" data-type="Poi" data-id="' + poi.id_poi + '">'+
				'	<span>' + poi.name + '</span>'+
				'	<a href="#" class="bExecuteTest btn btn-sm btn-circle btn-warning pull-right"><i class="fa fa-play"></i></a>'+
				'</li>'
				);
		});
	}
	
	if (augmented_poses.length > 0)
	{
		$.each(augmented_poses, function(indexInArray, augmented_pose){
			indexLi++;
			$('#install_by_step_test_map .list_test').append('' +
				'<li id="list_test_'+indexLi+'" data-index_li="'+indexLi+'" data-type="AugmentedPose" data-id="' + augmented_pose.id_augmented_pose + '">'+
				'	<span>' + augmented_pose.name + '</span>'+
				'	<a href="#" class="bExecuteTest btn btn-sm btn-circle btn-warning pull-right"><i class="fa fa-play"></i></a>'+
				'</li>'
				);
		});
	}
	
	if (docks.length > 0)
	{
		$.each(docks, function(indexInArray, dock){
			indexLi++;
			$('#install_by_step_test_map .list_test').append('' +
				'<li id="list_test_'+indexLi+'" data-index_li="'+indexLi+'" data-type="Dock" data-id="' + dock.id_docking_station + '">'+
				'	<span>' + dock.name + '</span>'+
				'	<a href="#" class="bExecuteTest btn btn-sm btn-circle btn-warning pull-right"><i class="fa fa-play"></i></a>'+
				'</li>'
				);
		});
	}
}

function ByStepDisplayBlockZoom()
{
	if (blockZoom)
	{
		//svgData = new XMLSerializer().serializeToString(svgTemp);
		//imgForSVG.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
		p = document.getElementById("install_by_step_edit_map_svg"); 
		p_prime = p.cloneNode(true);
		p_prime.id = "install_by_step_edit_map_svg_clone";
		$('#install_by_step_edit_map_zoom_popup_content').html('');
		document.getElementById('install_by_step_edit_map_zoom_popup_content').appendChild(p_prime);
		
		$('#install_by_step_edit_map_svg_clone').width(ros_largeur);
		$('#install_by_step_edit_map_svg_clone').height(ros_hauteur);
					
		p = $('#install_by_step_edit_map_svg image').position();
		x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
		y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;

		//zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
		zoom = ByStepGetZoom();	
		/*
		$('#install_by_step_edit_map_img_svg').css('left',(-x*zoom) * 10 + 50);
		$('#install_by_step_edit_map_img_svg').css('top', (-y*zoom) * 10 + 50);
		*/
		
		//$('#install_by_step_edit_map_svg_clone').css('left', -event.targetTouches[0].pageX + 50 + 2);
		//$('#install_by_step_edit_map_svg_clone').css('top', -event.targetTouches[0].pageY + 50 + $('#install_by_step_edit_map_container_all').position().top + 23);
		
		//x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
		//y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
		
		z = window.panZoom.getZoom();
		x = -x + 50 + 2; // * z;
		y = -y + 50 + 2; // * z;
		
		var obj = $('#install_by_step_edit_map_svg g');
		var transformMatrix = obj.css("-webkit-transform") ||
		   obj.css("-moz-transform")    ||
		   obj.css("-ms-transform")     ||
		   obj.css("-o-transform")      ||
		   obj.css("transform");
		   
		obj = $('#install_by_step_edit_map_svg_clone g');
		obj.attr('id', 'install_by_step_edit_map_svg_clone_g');
		 
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
	
		element = document.getElementById('install_by_step_edit_map_svg_clone_g');
		element.setAttributeNS(null, "transform", s);
		if ("transform" in element.style) {
		  element.style.transform = s;
		} else if ("-ms-transform" in element.style) {
		  element.style["-ms-transform"] = s;
		} else if ("-webkit-transform" in element.style) {
		  element.style["-webkit-transform"] = s;
		}
		
		l = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) + 50;
		if (l + 101 > $('#install_by_step_edit_map_container_all').width() - 20) l -= 200;
		t = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - 150;
		if (t + 101 > $('body').height() - 20) t -= 100;
		if (t < 20) t = 20;
		$('#install_by_step_edit_map_zoom_popup').css('left', l);
		$('#install_by_step_edit_map_zoom_popup').css('top', t);
		if(!(typeof(showPopupZoom) != 'undefined' && !showPopupZoom))
			$('#install_by_step_edit_map_zoom_popup').show();
		
		/*
		
		$('#install_by_step_edit_map_svg_copy').html($('#install_by_step_edit_map_svg .svg-pan-zoom_viewport').html());
		
		p = $('#install_by_step_edit_map_svg image').position();
		x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
		y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
		
		//zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
		zoom = ByStepGetZoom();
				
		$('#install_by_step_edit_map_svg_copy').css('left', -x*zoom + 50);
		$('#install_by_step_edit_map_svg_copy').css('top', -y*zoom + 50);
		
		$('#install_by_step_edit_map_zoom_popup').css('left', (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) + 50);
		$('#install_by_step_edit_map_zoom_popup').css('top', (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - 150);
		$('#install_by_step_edit_map_zoom_popup').show();
		*/
	}
	else
	{
		$('#install_by_step_edit_map_zoom_popup').hide();
	}
}

var timerByStepLongPress = null;
var timerByStepVeryLongPress = null;
var eventTouchStart = null;
var currentPointByStepLongTouch = null;
var currentForbiddenByStepLongTouch = null;
var currentAreaByStepLongTouch = null;
var currentDockByStepLongTouch = null;
var currentPoiByStepLongTouch = null;
var currentAugmentedPoseByStepLongTouch = null;

$(document).ready(function(e) {
	$('#install_by_step_edit_map .modal').on('shown.bs.modal', function () {
		do_refresh = true;
	});
	
	$('#install_by_step_edit_map_svg').on('touchend', function(e) { 
		$('#install_by_step_edit_map_zoom_popup').hide();
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
	});
	
	$('#install_by_step_edit_map_svg').on('touchstart', function(e) {
		ByStepDisplayBlockZoom();
	});
	
	/*
	$('#install_by_step_edit_map_svg').on('touchstart', function(e) {
		
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
		
		if (bystepCanChangeMenu)
		{
			timerByStepLongPress = setTimeout(ByStepLongPressSVG, 500);
			timerByStepVeryLongPress = setTimeout(ByStepLongVeryPressSVG, 1500);
			eventTouchStart = e;
		}
		ByStepDisplayBlockZoom();
		
		ByStepHideMenus();
		
	});
	*/
   
	$('#install_by_step_edit_map_svg').on('touchmove', function(e) {
		//ByStepHideMenus();
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
		ByStepDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#install_by_step_edit_map_svg .point_deletable', function(e) {
		$('#install_by_step_edit_map_zoom_popup').hide();
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
	});
	
	$(document).on('touchstart', '#install_by_step_edit_map_svg .point_deletable', function(e) {
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
		
		if (bystepCanChangeMenu || bystepCurrentAction == 'addForbiddenArea' || bystepCurrentAction == 'addArea' || bystepCurrentAction == 'editForbiddenArea' || bystepCurrentAction == 'editArea')
		{
			//timerByStepLongPress = setTimeout(ByStepLongPressPointDeletable, 100);
			timerByStepLongPress = ByStepLongPressPointDeletable();
			//timerByStepVeryLongPress = setTimeout(ByStepLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentPointByStepLongTouch = $(this);
		}
		//ByStepDisplayBlockZoom();
		//ByStepHideMenus();
		
	});
	
	$(document).on('touchmove', '#install_by_step_edit_map_svg .point_deletable', function(e) {
    	//ByStepHideMenus();
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
		//ByStepDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#install_by_step_edit_map_svg .forbidden_root', function(e) {
		$('#install_by_step_edit_map_zoom_popup').hide();
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#install_by_step_edit_map_svg .forbidden_root', function(e) {
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
		
		if (bystepCanChangeMenu || bystepCurrentAction == 'editForbiddenArea' || bystepCurrentAction == 'addForbiddenArea')
		{
			timerByStepLongPress = setTimeout(ByStepLongPressForbidden, 500);
			//timerByStepVeryLongPress = setTimeout(ByStepLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentForbiddenByStepLongTouch = $(this);
		}
		ByStepDisplayBlockZoom();
		
		ByStepHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#install_by_step_edit_map_svg .forbidden_root', function(e) {
    	//ByStepHideMenus();
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
		//ByStepDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#install_by_step_edit_map_svg .area_root', function(e) {
		$('#install_by_step_edit_map_zoom_popup').hide();
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#install_by_step_edit_map_svg .area_root', function(e) {
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
		
		if (bystepCanChangeMenu || bystepCurrentAction == 'editArea' || bystepCurrentAction == 'addArea')
		{
			timerByStepLongPress = setTimeout(ByStepLongPressArea, 500);
			//timerByStepVeryLongPress = setTimeout(ByStepLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentAreaByStepLongTouch = $(this);
		}
		ByStepDisplayBlockZoom();
		
		ByStepHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#install_by_step_edit_map_svg .area_root', function(e) {
    	//ByStepHideMenus();
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
		//ByStepDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#install_by_step_edit_map_svg .dock_elem', function(e) {
		$('#install_by_step_edit_map_zoom_popup').hide();
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#install_by_step_edit_map_svg .dock_elem', function(e) {
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
		
		if (bystepCanChangeMenu)
		{
			timerByStepLongPress = setTimeout(ByStepLongPressDock, 500);
			//timerByStepVeryLongPress = setTimeout(ByStepLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentDockByStepLongTouch = $(this);
		}
		ByStepDisplayBlockZoom();
		
		ByStepHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#install_by_step_edit_map_svg .dock_elem', function(e) {
    	//ByStepHideMenus();
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
		//ByStepDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#install_by_step_edit_map_svg .poi_elem', function(e) {
		$('#install_by_step_edit_map_zoom_popup').hide();
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#install_by_step_edit_map_svg .poi_elem', function(e) {
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
		
		if (bystepCanChangeMenu)
		{
			timerByStepLongPress = setTimeout(ByStepLongPressPoi, 500);
			//timerByStepVeryLongPress = setTimeout(ByStepLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentPoiByStepLongTouch = $(this);
		}
		ByStepDisplayBlockZoom();
		
		ByStepHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#install_by_step_edit_map_svg .poi_elem', function(e) {
    	//ByStepHideMenus();
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
		//ByStepDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#install_by_step_edit_map_svg .augmented_pose_elem', function(e) {
		$('#install_by_step_edit_map_zoom_popup').hide();
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#install_by_step_edit_map_svg .augmented_pose_elem', function(e) {
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
		
		if (bystepCanChangeMenu)
		{
			timerByStepLongPress = setTimeout(ByStepLongPressAugmentedPose, 500);
			//timerByStepVeryLongPress = setTimeout(ByStepLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentAugmentedPoseByStepLongTouch = $(this);
		}
		ByStepDisplayBlockZoom();
		
		ByStepHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#install_by_step_edit_map_svg .augmented_pose_elem', function(e) {
    	//ByStepHideMenus();
		if (timerByStepLongPress != null)
		{
			clearTimeout(timerByStepLongPress);
			timerByStepLongPress = null;
		}
		if (timerByStepVeryLongPress != null)
		{
			clearTimeout(timerByStepVeryLongPress);
			timerByStepVeryLongPress = null;
		}
		//ByStepDisplayBlockZoom();
	});
	
	$('#install_by_step_edit_map .burger_menu').on('click', function(e) {
		if($(this).hasClass('burger_menu_open')){
			ByStepHideMenus()
		}else{
			ByStepDisplayMenu($(this).data('open'))
		}
	});
	
	$('#install_by_step_edit_map .icon_menu').on('click', function(e) {
		
		switch(bystepCurrentAction){
			case 'prepareArea': 
			case 'prepareForbiddenArea': 
			case 'prepareGotoPose': 
				bystepCurrentAction='';
				bystepCanChangeMenu = true;
			break;
		}
		if (bystepCanChangeMenu)
		{
			ByStepHideMenus();
			
			if($(this).data('menu') == 'install_by_step_edit_map_menu_point')
			{
				if (bystepCurrentAction == 'editForbiddenArea' || bystepCurrentAction == 'addbiddenArea')
				{
					RemoveClass('#install_by_step_edit_map_svg .point_deletable', 'editing_point');
					ByStepDisplayMenu('install_by_step_edit_map_menu_forbidden');
				}
				else if (bystepCurrentAction == 'editArea' || bystepCurrentAction == 'addArea')
				{
					RemoveClass('#install_by_step_edit_map_svg .point_deletable', 'editing_point');
					ByStepDisplayMenu('install_by_step_edit_map_menu_area');
				}
			}
			else
			{
				$('#install_by_step_edit_map .burger_menu').removeClass('burger_menu_open');
				RemoveClass('#install_by_step_edit_map_svg .moving', 'moving');
				RemoveClass('#install_by_step_edit_map_svg .editing_point', 'editing_point');
				RemoveClass('#install_by_step_edit_map_svg .active', 'active');
				RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
				ByStepResizeSVG();
				currentSelectedItem = Array();
				bystepCurrentAction='';
				$('body').removeClass('no_current select');
				$('.select').css("strokeWidth", minStokeWidth);
			}
		}
	});
	
	$('#install_by_step_edit_map .times_icon_menu').click(function(){
		$('#install_by_step_edit_map .icon_menu:visible').click();
	})
});

function ByStepHideMenus()
{
	$('#install_by_step_edit_map .times_icon_menu').hide()
	$('#install_by_step_edit_map_menu li').hide();
	$('#install_by_step_edit_map_menu_point li').hide();
	$('#install_by_step_edit_map_menu_forbidden li').hide();
	$('#install_by_step_edit_map_menu_area li').hide();
	$('#install_by_step_edit_map_menu_dock li').hide();
	$('#install_by_step_edit_map_menu_poi li').hide();
	$('#install_by_step_edit_map_menu_augmented_pose li').hide();
	$('#install_by_step_edit_map_menu_erase li').hide();
	$('#install_by_step_edit_map .popupHelp').hide();
	
	$('#install_by_step_edit_map .burger_menu_open').removeClass('burger_menu_open');
	
	$('#install_by_step_edit_map .burger_menu').css('display','flex');
	
	$('#install_by_step_edit_map .icon_menu').hide('fast');
}

function ByStepDisplayMenu(id_menu)
{
	ByStepHideMenus();
		
		
		let idxH = 1;
		let idxV = 1;
		let idxD = 1;
		console.log(id_menu);
		
		//ICONE CORRESPONDANTE INSTEAD BURGER MENU
		let icon_menu = $('#install_by_step_edit_map .icon_menu[data-menu="'+id_menu+'"]');
		if(icon_menu.lentgh != 0){
			if(id_menu == 'install_by_step_edit_map_menu_forbidden' || id_menu == 'install_by_step_edit_map_menu_area'){
				icon_menu.show('fast');
			}else{		
				icon_menu.show('fast');
			}
		}
		if(id_menu != 'install_by_step_edit_map_menu_point')
			RemoveClass('#install_by_step_edit_map_svg .point_deletable', 'editing_point');
		if(id_menu != 'install_by_step_edit_map_menu_area' && id_menu != 'install_by_step_edit_map_menu_forbidden')
			RemoveClass('#install_by_step_edit_map_svg .point_deletable', 'active');
		
		
		if(id_menu != 'install_by_step_edit_map_menu'){
			$('#install_by_step_edit_map .burger_menu').hide('fast');
			setTimeout(function(){$('#install_by_step_edit_map .times_icon_menu').show('fast')},50);
		}else{
			$('#install_by_step_edit_map .burger_menu').addClass('burger_menu_open');
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

function ByStepLongPressForbidden()
{
	timerByStepLongPress = null;
	//ByStepDisplayMenu('install_by_step_edit_map_menu_forbidden');
}

function ByStepLongPressArea()
{
	timerByStepLongPress = null;
	ByStepDisplayMenu('install_by_step_edit_map_menu_area');
}

function ByStepLongPressDock()
{
	timerByStepLongPress = null;
	ByStepDisplayMenu('install_by_step_edit_map_menu_dock');
}

function ByStepLongPressPoi()
{
	timerByStepLongPress = null;
	ByStepDisplayMenu('install_by_step_edit_map_menu_poi');
}

function ByStepLongPressAugmentedPose()
{
	timerByStepLongPress = null;
	ByStepDisplayMenu('install_by_step_edit_map_menu_augmented_pose');
}

function ByStepLongPressPointDeletable()
{
	timerByStepLongPress = null;
	//if point menu not opened
	if($('#install_by_step_edit_map .icon_menu[data-menu="install_by_step_edit_map_menu_point"]:visible').length == 0 && (bystepCurrentAction == 'addForbiddenArea' || bystepCurrentAction == 'addArea' || bystepCurrentAction == 'editForbiddenArea' || bystepCurrentAction == 'editArea') )
		ByStepDisplayMenu('install_by_step_edit_map_menu_point');
}

function ByStepLongVeryPressSVG()
{
	timerByStepVeryLongPress = null;
	$('#install_by_step_edit_map_container_all .popupHelp').show(200);	
}

function ByStepLongPressSVG()
{
	timerByStepLongPress = null;
	ByStepDisplayMenu('install_by_step_edit_map_menu');
}

var resetPan = false;

$(document).ready(function(e) {
    $('#install_by_step_edit_map_svg').on('touchend', function(e) {
		resetPan = true;
	});
	$('#install_by_step_edit_map_svg').on('touchstart', function(e) {
		resetPan = true;
	});
});

function ByStepInitMap()
{
	
	
	var eventsHandler;

	eventsHandler = {
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
		if(typeof(window.panZoom) != 'undefined')
			window.panZoom.destroy();
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
	
	svgByStep = document.querySelector('#install_by_step_edit_map_svg .svg-pan-zoom_viewport');
	
	//window.panZoom = {};
	//window.panZoom.getZoom = function () { return 1; }
	RefreshZoomView();
	
	setTimeout(function(){
		if(init_zoom){
			//WORKING ON CONSOLE 
			window.panZoom.resize();
			window.panZoom.updateBBox();
			window.panZoom.fit();
			window.panZoom.center();
		}
		$('.install_by_step_edit_map_loading').hide();
	},100);
}

function ByStepShakeActiveElement()
{
	if(!bystepCanChangeMenu){
		let ca = bystepCurrentAction;
		let target = '';
		if(ca == 'addForbiddenArea' || ca == 'editForbiddenArea' || ca == 'editArea' || ca == 'addArea' || ca == 'moveArea'){
			//SHAKE BTN BLEU ORANGE
			target = $('#install_by_step_edit_map .btnSaveElem');
		}else if(ca == 'prepareArea' || ca == 'prepareGotoPose' || ca == 'prepareForbiddenArea'){
			target = $('#install_by_step_edit_map .btn-circle.icon_menu:visible');
			setTimeout(function(){$('#install_by_step_edit_map .times_icon_menu').toggleClass('shake')},100);
			setTimeout(function(){$('#install_by_step_edit_map .times_icon_menu').toggleClass('shake')},3000);
		}else if(ca == 'gomme'){
			target = $('#install_by_step_edit_map_bEndGomme');
		}
		if(target != ''){
			setTimeout(function(){target.toggleClass('shake')},100);
			setTimeout(function(){target.toggleClass('shake')},3000);
		}
	}	
}
