// JavaScript Document
function GetInfosCurrentMapWycaByStep()
{
	if (wycaApi.websocketAuthed)
	{
		GetInfosCurrentMapDoWycaByStep();
	}
	else
	{
		setTimeout(GetInfosCurrentMapWycaByStep, 500);
	}
}

function GetInfosCurrentMapDoWycaByStep()
{
	$('#wyca_by_step_edit_map .burger_menu').addClass('updatingMap');
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
			
			$('#wyca_by_step_edit_map_zoom_carte .img-responsive').attr('src', 'data:image/png;base64,'+data.D.image_tri);
			
			largeurSlam = data.D.ros_width;
			hauteurSlam = data.D.ros_height;
			largeurRos = data.D.ros_width;
			hauteurRos = data.D.ros_height;
			
			ros_largeur = data.D.ros_width;
			ros_hauteur = data.D.ros_height;
			ros_resolution = data.D.ros_resolution;
			
			$('#wyca_by_step_edit_map_svg').attr('width', data.D.ros_width);
			$('#wyca_by_step_edit_map_svg').attr('height', data.D.ros_height);
			
			$('#wyca_by_step_edit_map_image').attr('width', data.D.ros_width);
			$('#wyca_by_step_edit_map_image').attr('height', data.D.ros_height);
			$('#wyca_by_step_edit_map_image').attr('xlink:href', 'data:image/png;base64,'+data.D.image_tri);
		  
			$('#wyca_by_step_mapping_use .bUseThisMapNowYes').show();
			$('#wyca_by_step_mapping_use .bUseThisMapNowNo').show();
			$('#wyca_by_step_mapping_use .modalUseThisMapNowTitle1').show();
			$('#wyca_by_step_mapping_use .modalUseThisMapNowTitle2').hide();
			$('#wyca_by_step_mapping_use .modalUseThisMapNowContent').hide();
			
			wyca_bystepHistoriques = Array();
			wyca_bystepHistoriqueIndex = -1;
			WycaByStepRefreshHistorique();
			
			WycaByStepResizeSVG();
			
			setTimeout(function(){
				WycaByStepInitMap();
				WycaByStepResizeSVG();
				
				//currentAugmentedPoseWycaByStepLongTouch = $('#...' + temp.id_augmented_pose
				
				/* REFRESH IDS IF MENU OPEN */
				let actions_searched = ['editPoi','editDock','editAugmentedPose','editForbiddenArea','editArea'];
				let temp = false;
				if(actions_searched.includes(wyca_bystepCurrentAction)){
					switch(wyca_bystepCurrentAction){
						case 'editPoi' :
							temp = FindElemByName(pois,WycaByStepBufferMapSaveElemName);
							if(temp){
								currentPoiWycaByStepLongTouch = $('#wyca_by_step_edit_map_poi_secure_'+temp.id_poi);
								currentPoiWycaByStepLongTouch.data('id_poi',temp.id_poi);
								currentPoiWycaByStepLongTouch.click();
								WycaByStepBufferMapSaveElemName = '';
							}
						break;
						case 'editDock' :
							temp = FindElemByName(docks,WycaByStepBufferMapSaveElemName);
							if(temp){
								currentDockWycaByStepLongTouch = $('#wyca_by_step_edit_map_dock_secure_'+temp.id_docking_station);
								currentDockWycaByStepLongTouch.click();
								currentDockWycaByStepLongTouch.data('id_docking_station',temp.id_docking_station);
								WycaByStepBufferMapSaveElemName = '';
							}
						break;
						case 'editAugmentedPose' :
							temp = FindElemByName(augmented_poses,WycaByStepBufferMapSaveElemName);
							if(temp){
								currentAugmentedPoseWycaByStepLongTouch = $('#wyca_by_step_edit_map_augmented_pose_secure_'+temp.id_augmented_pose);
								currentAugmentedPoseWycaByStepLongTouch.click();
								currentAugmentedPoseWycaByStepLongTouch.data('id_augmented_pose',temp.id_augmented_pose);
								WycaByStepBufferMapSaveElemName = '';
							}
						break;
						case 'editForbiddenArea' :
							temp = FindElemByName(forbiddens,WycaByStepBufferMapSaveElemName);
							if(temp){
								currentForbiddenWycaByStepLongTouch = $('#wyca_by_step_edit_map_forbidden_'+temp.id_area);
								currentForbiddenWycaByStepLongTouch.click();
								currentForbiddenWycaByStepLongTouch.data('id_area',temp.id_area);
								WycaByStepBufferMapSaveElemName = '';
							}
						break;
						case 'editArea' :
							temp = FindElemByName(areas,WycaByStepBufferMapSaveElemName);
							if(temp){
								currentAreaWycaByStepLongTouch = $('#wyca_by_step_edit_map_area_'+temp.id_area);
								currentAreaWycaByStepLongTouch.click();
								currentAreaWycaByStepLongTouch.data('id_area',temp.id_area);
								WycaByStepBufferMapSaveElemName = '';
							}
						break;
						default: WycaByStepBufferMapSaveElemName = ''; break;
					}
				}
				$('#wyca_by_step_edit_map .modalReloadMap').modal('hide');
				$('#wyca_by_step_edit_map .modalReloadMap .btn').removeClass('disabled');
				$('#wyca_by_step_edit_map .modalReloadMap .wyca_by_step_edit_map_modalReloadMap_loading').hide();
				
				$('#wyca_by_step_edit_map .modalConfirmNoReloadMap').modal('hide');
				$('#wyca_by_step_edit_map .modalConfirmNoReloadMap .btn').removeClass('disabled');
				$('#wyca_by_step_edit_map .modalConfirmNoReloadMap .wyca_by_step_edit_map_modalReloadMap_loading').hide();
				
				RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
				RemoveClass('#wyca_by_step_edit_map_svg .activ_select', 'activ_select'); 
				RemoveClass('#wyca_by_step_edit_map_svg .editing_point', 'editing_point'); 
				
				wyca_bystepCanChangeMenu = true;
				wyca_bystepCurrentAction = '';
				WycaByStepSaveElementNeeded(!wyca_bystepCanChangeMenu);
				$('#wyca_by_step_edit_map .burger_menu').removeClass('updatingMap');
				$('#wyca_by_step_edit_map .bSaveEditMap').html(textBtnSaveMap).removeClass('disabled'); // REMOVE SPINNER ON BTN
				WycaByStepHideMenus();
				
			},500); 
			$('#wyca_by_step_edit_map .modal').not('.modalReloadMap').each(function(){$(this).modal('hide')});
			$('#bHeaderInfo').attr('onClick',"TogglePopupHelp()");
			if (gotoTest) InitTest();
			gotoTest = false;
		}
		else
		{
			$('#wyca_by_step_edit_map .burger_menu').removeClass('updatingMap');
			ParseAPIAnswerError(data,textErrorInitMap);
		}
	});
}

function InitTest()
{
	$('#wyca_by_step_test_map .list_test li').remove();
	$('#wyca_by_step_test_map .wyca_by_step_test_map_loading').hide();
	
	var indexLi = 0;
	
	if (pois.length > 0)
	{
		$.each(pois, function(indexInArray, poi){
			indexLi++;
			$('#wyca_by_step_test_map .list_test').append('' +
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
			$('#wyca_by_step_test_map .list_test').append('' +
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
			$('#wyca_by_step_test_map .list_test').append('' +
				'<li id="list_test_'+indexLi+'" data-index_li="'+indexLi+'" data-type="Dock" data-id="' + dock.id_docking_station + '">'+
				'	<span>' + dock.name + '</span>'+
				'	<a href="#" class="bExecuteTest btn btn-sm btn-circle btn-warning pull-right"><i class="fa fa-play"></i></a>'+
				'</li>'
				);
		});
	}
}

function WycaByStepDisplayBlockZoom()
{
	if (blockZoom)
	{
		//svgData = new XMLSerializer().serializeToString(svgTemp);
		//imgForSVG.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
		p = document.getElementById("wyca_by_step_edit_map_svg"); 
		p_prime = p.cloneNode(true);
		p_prime.id = "wyca_by_step_edit_map_svg_clone";
		$('#wyca_by_step_edit_map_zoom_popup_content').html('');
		document.getElementById('wyca_by_step_edit_map_zoom_popup_content').appendChild(p_prime);
		
		$('#wyca_by_step_edit_map_svg_clone').width(ros_largeur);
		$('#wyca_by_step_edit_map_svg_clone').height(ros_hauteur);
					
		p = $('#wyca_by_step_edit_map_svg image').position();
		x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
		y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;

		//zoom = ros_largeur / $('#wyca_by_step_edit_map_svg').width() / window.panZoom.getZoom();
		zoom = WycaByStepGetZoom();	
		/*
		$('#wyca_by_step_edit_map_img_svg').css('left',(-x*zoom) * 10 + 50);
		$('#wyca_by_step_edit_map_img_svg').css('top', (-y*zoom) * 10 + 50);
		*/
		
		//$('#wyca_by_step_edit_map_svg_clone').css('left', -event.targetTouches[0].pageX + 50 + 2);
		//$('#wyca_by_step_edit_map_svg_clone').css('top', -event.targetTouches[0].pageY + 50 + $('#wyca_by_step_edit_map_container_all').position().top + 23);
		
		//x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
		//y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
		
		z = window.panZoom.getZoom();
		x = -x + 50 + 2; // * z;
		y = -y + 50 + 2; // * z;
		
		var obj = $('#wyca_by_step_edit_map_svg g');
		var transformMatrix = obj.css("-webkit-transform") ||
		   obj.css("-moz-transform")    ||
		   obj.css("-ms-transform")     ||
		   obj.css("-o-transform")      ||
		   obj.css("transform");
		   
		obj = $('#wyca_by_step_edit_map_svg_clone g');
		obj.attr('id', 'wyca_by_step_edit_map_svg_clone_g');
		 
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
	
		element = document.getElementById('wyca_by_step_edit_map_svg_clone_g');
		element.setAttributeNS(null, "transform", s);
		if ("transform" in element.style) {
		  element.style.transform = s;
		} else if ("-ms-transform" in element.style) {
		  element.style["-ms-transform"] = s;
		} else if ("-webkit-transform" in element.style) {
		  element.style["-webkit-transform"] = s;
		}
		
		l = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) + 50;
		if (l + 101 > $('#wyca_by_step_edit_map_container_all').width() - 20) l -= 200;
		t = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - 150;
		if (t + 101 > $('body').height() - 20) t -= 100;
		if (t < 20) t = 20;
		$('#wyca_by_step_edit_map_zoom_popup').css('left', l);
		$('#wyca_by_step_edit_map_zoom_popup').css('top', t);
		if(!(typeof(showPopupZoom) != 'undefined' && !showPopupZoom))
			$('#wyca_by_step_edit_map_zoom_popup').show();
		
		/*
		
		$('#wyca_by_step_edit_map_svg_copy').html($('#wyca_by_step_edit_map_svg .svg-pan-zoom_viewport').html());
		
		p = $('#wyca_by_step_edit_map_svg image').position();
		x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
		y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
		
		//zoom = ros_largeur / $('#wyca_by_step_edit_map_svg').width() / window.panZoom.getZoom();
		zoom = WycaByStepGetZoom();
				
		$('#wyca_by_step_edit_map_svg_copy').css('left', -x*zoom + 50);
		$('#wyca_by_step_edit_map_svg_copy').css('top', -y*zoom + 50);
		
		$('#wyca_by_step_edit_map_zoom_popup').css('left', (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) + 50);
		$('#wyca_by_step_edit_map_zoom_popup').css('top', (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - 150);
		$('#wyca_by_step_edit_map_zoom_popup').show();
		*/
	}
	else
	{
		$('#wyca_by_step_edit_map_zoom_popup').hide();
	}
}

var timerWycaByStepLongPress = null;
var timerWycaByStepVeryLongPress = null;
var eventTouchStart = null;
var currentPointWycaByStepLongTouch = null;
var currentForbiddenWycaByStepLongTouch = null;
var currentAreaWycaByStepLongTouch = null;
var currentDockWycaByStepLongTouch = null;
var currentPoiWycaByStepLongTouch = null;
var currentAugmentedPoseWycaByStepLongTouch = null;

$(document).ready(function(e) {
	$('#wyca_by_step_edit_map .modal').on('shown.bs.modal', function () {
		do_refresh = true;
	});
	
	$('#wyca_by_step_edit_map_svg').on('touchend', function(e) { 
		$('#wyca_by_step_edit_map_zoom_popup').hide();
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
	});
	
	$('#wyca_by_step_edit_map_svg').on('touchstart', function(e) {
		WycaByStepDisplayBlockZoom();
	});
	
	/*
	$('#wyca_by_step_edit_map_svg').on('touchstart', function(e) {
		
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
		
		if (wyca_bystepCanChangeMenu)
		{
			timerWycaByStepLongPress = setTimeout(WycaByStepLongPressSVG, 500);
			timerWycaByStepVeryLongPress = setTimeout(WycaByStepLongVeryPressSVG, 1500);
			eventTouchStart = e;
		}
		WycaByStepDisplayBlockZoom();
		
		WycaByStepHideMenus();
		
	});
	*/
   
	$('#wyca_by_step_edit_map_svg').on('touchmove', function(e) {
		//WycaByStepHideMenus();
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
		WycaByStepDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#wyca_by_step_edit_map_svg .point_deletable', function(e) {
		$('#wyca_by_step_edit_map_zoom_popup').hide();
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
	});
	
	$(document).on('touchstart', '#wyca_by_step_edit_map_svg .point_deletable', function(e) {
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
		
		if (wyca_bystepCanChangeMenu || wyca_bystepCurrentAction == 'addForbiddenArea' || wyca_bystepCurrentAction == 'addArea' || wyca_bystepCurrentAction == 'editForbiddenArea' || wyca_bystepCurrentAction == 'editArea')
		{
			//timerWycaByStepLongPress = setTimeout(WycaByStepLongPressPointDeletable, 100);
			timerWycaByStepLongPress = WycaByStepLongPressPointDeletable();
			//timerWycaByStepVeryLongPress = setTimeout(WycaByStepLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentPointWycaByStepLongTouch = $(this);
		}
		//WycaByStepDisplayBlockZoom();
		//WycaByStepHideMenus();
		
	});
	
	$(document).on('touchmove', '#wyca_by_step_edit_map_svg .point_deletable', function(e) {
    	//WycaByStepHideMenus();
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
		//WycaByStepDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#wyca_by_step_edit_map_svg .forbidden_root', function(e) {
		$('#wyca_by_step_edit_map_zoom_popup').hide();
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#wyca_by_step_edit_map_svg .forbidden_root', function(e) {
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
		
		if (wyca_bystepCanChangeMenu || wyca_bystepCurrentAction == 'editForbiddenArea' || wyca_bystepCurrentAction == 'addForbiddenArea')
		{
			timerWycaByStepLongPress = setTimeout(WycaByStepLongPressForbidden, 500);
			//timerWycaByStepVeryLongPress = setTimeout(WycaByStepLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentForbiddenWycaByStepLongTouch = $(this);
		}
		WycaByStepDisplayBlockZoom();
		
		WycaByStepHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#wyca_by_step_edit_map_svg .forbidden_root', function(e) {
    	//WycaByStepHideMenus();
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
		//WycaByStepDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#wyca_by_step_edit_map_svg .area_root', function(e) {
		$('#wyca_by_step_edit_map_zoom_popup').hide();
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#wyca_by_step_edit_map_svg .area_root', function(e) {
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
		
		if (wyca_bystepCanChangeMenu || wyca_bystepCurrentAction == 'editArea' || wyca_bystepCurrentAction == 'addArea')
		{
			timerWycaByStepLongPress = setTimeout(WycaByStepLongPressArea, 500);
			//timerWycaByStepVeryLongPress = setTimeout(WycaByStepLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentAreaWycaByStepLongTouch = $(this);
		}
		WycaByStepDisplayBlockZoom();
		
		WycaByStepHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#wyca_by_step_edit_map_svg .area_root', function(e) {
    	//WycaByStepHideMenus();
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
		//WycaByStepDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#wyca_by_step_edit_map_svg .dock_elem', function(e) {
		$('#wyca_by_step_edit_map_zoom_popup').hide();
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#wyca_by_step_edit_map_svg .dock_elem', function(e) {
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
		
		if (wyca_bystepCanChangeMenu)
		{
			timerWycaByStepLongPress = setTimeout(WycaByStepLongPressDock, 500);
			//timerWycaByStepVeryLongPress = setTimeout(WycaByStepLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentDockWycaByStepLongTouch = $(this);
		}
		WycaByStepDisplayBlockZoom();
		
		WycaByStepHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#wyca_by_step_edit_map_svg .dock_elem', function(e) {
    	//WycaByStepHideMenus();
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
		//WycaByStepDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#wyca_by_step_edit_map_svg .poi_elem', function(e) {
		$('#wyca_by_step_edit_map_zoom_popup').hide();
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#wyca_by_step_edit_map_svg .poi_elem', function(e) {
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
		
		if (wyca_bystepCanChangeMenu)
		{
			timerWycaByStepLongPress = setTimeout(WycaByStepLongPressPoi, 500);
			//timerWycaByStepVeryLongPress = setTimeout(WycaByStepLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentPoiWycaByStepLongTouch = $(this);
		}
		WycaByStepDisplayBlockZoom();
		
		WycaByStepHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#wyca_by_step_edit_map_svg .poi_elem', function(e) {
    	//WycaByStepHideMenus();
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
		//WycaByStepDisplayBlockZoom();
	});
	
	$(document).on('touchend', '#wyca_by_step_edit_map_svg .augmented_pose_elem', function(e) {
		$('#wyca_by_step_edit_map_zoom_popup').hide();
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
	});
	
	/*
	$(document).on('touchstart', '#wyca_by_step_edit_map_svg .augmented_pose_elem', function(e) {
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
		
		if (wyca_bystepCanChangeMenu)
		{
			timerWycaByStepLongPress = setTimeout(WycaByStepLongPressAugmentedPose, 500);
			//timerWycaByStepVeryLongPress = setTimeout(WycaByStepLongVeryPressSVG, 1500);
			eventTouchStart = e;
			currentAugmentedPoseWycaByStepLongTouch = $(this);
		}
		WycaByStepDisplayBlockZoom();
		
		WycaByStepHideMenus();
		
	});
	*/
	
	$(document).on('touchmove', '#wyca_by_step_edit_map_svg .augmented_pose_elem', function(e) {
    	//WycaByStepHideMenus();
		if (timerWycaByStepLongPress != null)
		{
			clearTimeout(timerWycaByStepLongPress);
			timerWycaByStepLongPress = null;
		}
		if (timerWycaByStepVeryLongPress != null)
		{
			clearTimeout(timerWycaByStepVeryLongPress);
			timerWycaByStepVeryLongPress = null;
		}
		//WycaByStepDisplayBlockZoom();
	});
	
	$('#wyca_by_step_edit_map .burger_menu').on('click', function(e) {
		if($(this).hasClass('burger_menu_open')){
			WycaByStepHideMenus()
		}else{
			WycaByStepDisplayMenu($(this).data('open'))
		}
	});
	
	$('#wyca_by_step_edit_map .icon_menu').on('click', function(e) {
		
		switch(wyca_bystepCurrentAction){
			case 'prepareArea': 
			case 'prepareForbiddenArea': 
			case 'prepareGotoPose': 
				wyca_bystepCurrentAction='';
				wyca_bystepCanChangeMenu = true;
			break;
		}
		if (wyca_bystepCanChangeMenu)
		{
			WycaByStepHideMenus();
			
			if($(this).data('menu') == 'wyca_by_step_edit_map_menu_point')
			{
				if (wyca_bystepCurrentAction == 'editForbiddenArea' || wyca_bystepCurrentAction == 'addbiddenArea')
				{
					RemoveClass('#wyca_by_step_edit_map_svg .point_deletable', 'editing_point');
					WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_forbidden');
				}
				else if (wyca_bystepCurrentAction == 'editArea' || wyca_bystepCurrentAction == 'addArea')
				{
					RemoveClass('#wyca_by_step_edit_map_svg .point_deletable', 'editing_point');
					WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_area');
				}
			}
			else
			{
				RemoveClass('#wyca_by_step_edit_map_svg .moving', 'moving');
				RemoveClass('#wyca_by_step_edit_map_svg .editing_point', 'editing_point');
				RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
				RemoveClass('#wyca_by_step_edit_map_svg .activ_select', 'activ_select'); 
				WycaByStepResizeSVG();
				currentSelectedItem = Array();
				wyca_bystepCurrentAction='';
				$('body').removeClass('no_current select');
				$('.select').css("strokeWidth", minStokeWidth);
			}
		}
	});
	
	$('#wyca_by_step_edit_map .times_icon_menu').click(function(){
		$('#wyca_by_step_edit_map .icon_menu:visible').click();
	})
});

function WycaByStepHideMenus()
{
	$('#wyca_by_step_edit_map .times_icon_menu').hide()
	$('#wyca_by_step_edit_map_menu li').hide();
	$('#wyca_by_step_edit_map_menu_point li').hide();
	$('#wyca_by_step_edit_map_menu_forbidden li').hide();
	$('#wyca_by_step_edit_map_menu_area li').hide();
	$('#wyca_by_step_edit_map_menu_dock li').hide();
	$('#wyca_by_step_edit_map_menu_poi li').hide();
	$('#wyca_by_step_edit_map_menu_augmented_pose li').hide();
	$('#wyca_by_step_edit_map_menu_landmark li').hide();
	$('#wyca_by_step_edit_map_menu_erase li').hide();
	$('#wyca_by_step_edit_map .popupHelp').hide();
	
	$('#wyca_by_step_edit_map .burger_menu_open').removeClass('burger_menu_open');
	
	$('#wyca_by_step_edit_map .burger_menu').css('display','flex');
	
	$('#wyca_by_step_edit_map .icon_menu').hide('fast');
}

function WycaByStepDisplayMenu(id_menu)
{
	WycaByStepHideMenus();
		
		
		let idxH = 1;
		let idxV = 1;
		let idxD = 1;
		console.log(id_menu);
		
		//ICONE CORRESPONDANTE INSTEAD BURGER MENU
		let icon_menu = $('#wyca_by_step_edit_map .icon_menu[data-menu="'+id_menu+'"]');
		if(icon_menu.lentgh != 0){
			if(id_menu == 'wyca_by_step_edit_map_menu_forbidden' || id_menu == 'wyca_by_step_edit_map_menu_area'){
				icon_menu.show('fast');
			}else{		
				icon_menu.show('fast');
			}
		}
		if(id_menu != 'wyca_by_step_edit_map_menu_point')
			RemoveClass('#wyca_by_step_edit_map_svg .point_deletable', 'editing_point');
		if(id_menu != 'wyca_by_step_edit_map_menu_area' && id_menu != 'wyca_by_step_edit_map_menu_forbidden')
			RemoveClass('#wyca_by_step_edit_map_svg .point_deletable', 'active');
		
		
		if(id_menu != 'wyca_by_step_edit_map_menu'){
			$('#wyca_by_step_edit_map .burger_menu').hide('fast');
			setTimeout(function(){$('#wyca_by_step_edit_map .times_icon_menu').show('fast')},50);
		}else{
			$('#wyca_by_step_edit_map .burger_menu').addClass('burger_menu_open');
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

function WycaByStepLongPressForbidden()
{
	timerWycaByStepLongPress = null;
	//WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_forbidden');
}

function WycaByStepLongPressArea()
{
	timerWycaByStepLongPress = null;
	WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_area');
}

function WycaByStepLongPressDock()
{
	timerWycaByStepLongPress = null;
	WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_dock');
}

function WycaByStepLongPressLandmark()
{
	timerWycaByStepLongPress = null;
	WycaByStepDisplayMenu('wyca_by_step_map_menu_landmark');
}

function WycaByStepLongPressPoi()
{
	timerWycaByStepLongPress = null;
	WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_poi');
}

function WycaByStepLongPressAugmentedPose()
{
	timerWycaByStepLongPress = null;
	WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_augmented_pose');
}

function WycaByStepLongPressPointDeletable()
{
	timerWycaByStepLongPress = null;
	//if point menu not opened
	if($('#wyca_by_step_edit_map .icon_menu[data-menu="wyca_by_step_edit_map_menu_point"]:visible').length == 0 && (wyca_bystepCurrentAction == 'addForbiddenArea' || wyca_bystepCurrentAction == 'addArea' || wyca_bystepCurrentAction == 'editForbiddenArea' || wyca_bystepCurrentAction == 'editArea') )
		WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_point');
}

function WycaByStepLongVeryPressSVG()
{
	timerWycaByStepVeryLongPress = null;
	$('#wyca_by_step_edit_map_container_all .popupHelp').show(200);	
}

function WycaByStepLongPressSVG()
{
	timerWycaByStepLongPress = null;
	WycaByStepDisplayMenu('wyca_by_step_edit_map_menu');
}

var resetPan = false;

$(document).ready(function(e) {
    $('#wyca_by_step_edit_map_svg').on('touchend', function(e) {
		resetPan = true;
	});
	$('#wyca_by_step_edit_map_svg').on('touchstart', function(e) {
		resetPan = true;
	});
});

function WycaByStepInitMap()
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
	
	window.panZoom = svgPanZoom('#wyca_by_step_edit_map_svg', {
	  zoomEnabled: true
	, controlIconsEnabled: false
	, maxZoom: 20
	, fit: 1
	, center: 1
	, customEventsHandler: eventsHandler
	, RefreshMap: function() { setTimeout(RefreshZoomView, 10); }
	});
	
	if(init_zoom){
		//WORKING ON CONSOLE 
		window.panZoom.resize();
		window.panZoom.updateBBox();
		window.panZoom.fit();
		window.panZoom.center();
	}
	
	svgWycaByStep = document.querySelector('#wyca_by_step_edit_map_svg .svg-pan-zoom_viewport');
	
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
		$('.wyca_by_step_edit_map_loading').hide();
	},200);
}

function WycaByStepShakeActiveElement()
{
	if(!wyca_bystepCanChangeMenu){
		let ca = wyca_bystepCurrentAction;
		let target = '';
		if(ca == 'addForbiddenArea' || ca == 'editForbiddenArea' || ca == 'editArea' || ca == 'addArea' || ca == 'moveArea'){
			//SHAKE BTN BLEU ORANGE
			target = $('#wyca_by_step_edit_map .btnSaveElem');
		}else if(ca == 'prepareArea' || ca == 'prepareGotoPose' || ca == 'prepareForbiddenArea'){
			target = $('#wyca_by_step_edit_map .btn-circle.icon_menu:visible');
			setTimeout(function(){$('#wyca_by_step_edit_map .times_icon_menu').toggleClass('shake')},100);
			setTimeout(function(){$('#wyca_by_step_edit_map .times_icon_menu').toggleClass('shake')},3000);
		}else if(ca == 'gomme'){
			target = $('#wyca_by_step_edit_map_bEndGomme');
		}
		if(target != ''){
			setTimeout(function(){target.toggleClass('shake')},100);
			setTimeout(function(){target.toggleClass('shake')},3000);
		}
	}	
}
