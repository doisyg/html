// JavaScript Document
var boolModalGoToAugmentedPose = true;
var boolModalGoToDock = true;
var managerCurrentAction = '';
var svgManager;

var managerDownOnSVG = false;
var managerDownOnSVG_x = 0;
var managerDownOnSVG_y = 0;
var managerDownOnSVG_x_scroll = 0;
var managerDownOnSVG_y_scroll = 0;
var managerCanChangeMenu = true;
var managerSavedCanClose = true;

var xGotoPose = 0 ;
var yGotoPose = 0 ;

function ManagerAvertCantChange()
{
	$('#manager_edit_map_bModalCancelEdit').click();
}

function ManagerCloseSelect()
{
	managerCurrentAction = '';
	currentStep = '';
}

function ManagerHideCurrentMenu()
{
	/*
	if (managerCurrentAction == 'export') CloseExport();
	if (managerCurrentAction == 'jobs') CloseJobs();
	if (managerCurrentAction == 'select') ManagerCloseSelect()
	*/
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	$('body').attr('class', 'no_current');

	managerCurrentAction = '';
	currentStep = '';
}

function ManagerHideCurrentMenuNotSelect()
{
	if (managerCurrentAction == 'select') return;
	
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	$('body').attr('class', 'no_current');
	
	managerCurrentAction = '';
	currentStep = '';
}

var managerHistoriques = Array();

var managerHistoriqueIndex = -1;

function ManagerUndo()
{
	managerSavedCanClose = false;
	
	elem = managerHistoriques[managerHistoriqueIndex];
	switch(elem.action)
	{
		case 'add_poi':
			pois.pop();
			$('#manager_edit_map_svg .poi_elem_'+elem.data.id_poi).remove();
			break;
		case 'edit_poi':
			pois[elem.data.index] = JSON.parse(elem.data.old);
			ManagerTracePoi(elem.data.index);
			break;
		case 'delete_poi':
			pois[elem.data].deleted = false;
			ManagerTracePoi(elem.data);
			break;
	}
	managerHistoriqueIndex--;
	
	ManagerRefreshHistorique();
}

function ManagerRedo()
{
	managerSavedCanClose = false;
	
	managerHistoriqueIndex++;
	
	elem = managerHistoriques[managerHistoriqueIndex];
	switch(elem.action)
	{
		case 'add_poi':
			pois.push(elem.data);
			ManagerTracePoi(pois.length-1);
			break;
		case 'edit_poi':
			pois[elem.data.index] = JSON.parse(elem.data.new);
			ManagerTracePoi(elem.data.index);
			break;
		case 'delete_poi':
			pois[elem.data].deleted = true;
			ManagerTracePoi(elem.data);
			break;
	}
	
	ManagerRefreshHistorique();
}

function ManagerAddHistorique(elem)
{
	managerSavedCanClose = false;
	
	while (managerHistoriqueIndex < managerHistoriques.length-1)
		managerHistoriques.pop();
	
	managerHistoriques.push(elem);
	managerHistoriqueIndex++;
	
	ManagerRefreshHistorique();
}

function ManagerRefreshHistorique()
{
	if (managerHistoriqueIndex == -1)
		$('#manager_edit_map_bUndo').addClass('disabled');
	else
		$('#manager_edit_map_bUndo').removeClass('disabled');
	if (managerHistoriqueIndex == managerHistoriques.length-1)
		$('#manager_edit_map_bRedo').addClass('disabled');
	else
		$('#manager_edit_map_bRedo').removeClass('disabled');
}

function ManagerSetModeSelect()
{
	$('body').addClass('select');
	managerCurrentAction = 'select';
	currentStep = '';
}

function ManagerSaveElementNeeded(need)
{
	managerCanChangeMenu = !need;
	if (need)
	{
		$('#manager_edit_map_bSaveCurrentElem').show();
		$('#manager_edit_map_bCancelCurrentElem').show();
	}
	else
	{
		$('#manager_edit_map_bSaveCurrentElem').hide();
		$('#manager_edit_map_bCancelCurrentElem').hide();
	}
}

$(document).ready(function() {
	/* RELOAD MAP */
	
	$('#manager_edit_map #manager_edit_map_bAbortReloadMap').click(function(){
		$('#manager_edit_map .modalConfirmNoReloadMap').modal('show');
	})
	
	$('#manager_edit_map .modalReloadMap .manager_edit_map_bReloadMap').click(function(){
		$('#manager_edit_map .modalReloadMap .btn').addClass('disabled');
		$('#manager_edit_map .modalReloadMap .manager_edit_map_modalReloadMap_loading').show();
		GetInfosCurrentMapManager();
	})
	
	$('#manager_edit_map .modalConfirmNoReloadMap .manager_edit_map_bReloadMap').click(function(){
		$('#manager_edit_map .modalConfirmNoReloadMap .btn').addClass('disabled');
		$('#manager_edit_map .modalConfirmNoReloadMap .manager_edit_map_modalReloadMap_loading').show();
		GetInfosCurrentMapManager();
	})
	
	window.addEventListener('beforeunload', function(e){
		if (!managerSavedCanClose)
		{
			(e || window.event).returnValue = 'Are you sure you want to leave?';
			return 'Are you sure you want to leave?';
		}
	});
	
	if ($( window ).width() > 1920)
	{
		minStokeWidth = 3;
		maxStokeWidth = 7;
	}
		
	$('body').addClass('no_current');
	
	svgManager = document.querySelector('#manager_edit_map_svg');
	ManagerInitSVG();
	
	$('#manager_edit_map #manager_edit_map_bStop').click(function(e) {
        e.preventDefault();
		
		wycaApi.StopMove();	
    });
	
	$('#manager_edit_map #manager_edit_map_bSaveCurrentElem').click(function(e) {
        e.preventDefault();
		
		if (managerCurrentAction == 'addPoi' || managerCurrentAction == 'editPoi')
			ManagerPoiSave();
		else if (managerCurrentAction == 'addDock' || managerCurrentAction == 'editDock')
			ManagerDockSave();
		else if (managerCurrentAction == 'addArea' || managerCurrentAction == 'editArea')
			ManagerAreaSave();
		else if (managerCurrentAction == 'addForbiddenArea' || managerCurrentAction == 'editForbiddenArea')
			ManagerForbiddenSave();		
    });
	
	$('#manager_edit_map #manager_edit_map_bCancelCurrentElem').click(function(e) {
        e.preventDefault();
		
		if (managerCurrentAction == 'addPoi' || managerCurrentAction == 'editPoi')
			ManagerPoiCancel();
		else if (managerCurrentAction == 'addDock' || managerCurrentAction == 'editDock')
			ManagerDockCancel();
		else if (managerCurrentAction == 'addArea' || managerCurrentAction == 'editArea')
			ManagerAreaCancel();
		else if (managerCurrentAction == 'addForbiddenArea' || managerCurrentAction == 'editForbiddenArea')
			ManagerForbiddenCancel();		
    });
	
	$('#manager_edit_map_bUndo').click(function(e) {
        e.preventDefault();
		if (!$('#manager_edit_map_bUndo').hasClass('disabled'))
			ManagerUndo();
	});
	/*
	$('#manager_edit_map_bUndo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#manager_edit_map_bUndo').hasClass('disabled'))
			ManagerUndo();
	});
	*/
	$('#manager_edit_map_bRedo').click(function(e) {
        e.preventDefault();
		if (!$('#manager_edit_map_bRedo').hasClass('disabled'))
			ManagerRedo();
    });
	/*
	$('#manager_edit_map_bRedo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#manager_edit_map_bRedo').hasClass('disabled'))
			ManagerRedo();
	});
	*/
	
	/* MENU POI */
	
	$('#manager_edit_map_menu_poi .bDeletePoi').click(function(e) {
        e.preventDefault();
		ManagerHideMenus();
		i = GetPoiIndexFromID(currentPoiManagerLongTouch.data('id_poi'));
		ManagerDeletePoi(i);
    });
	
	$('#manager_edit_map_menu_poi .bConfigPoi').click(function(e) {
        e.preventDefault();
		//ManagerHideMenus();
		managerCurrentAction = 'editPoi';
	
		currentPoiIndex = GetPoiIndexFromID(currentPoiManagerLongTouch.data('id_poi'));
		poi = pois[currentPoiIndex];
		
		$('#manager_edit_map_poi_name').val(poi.name);
		$('#manager_edit_map_poi_comment').val(poi.comment);
		
		$('#manager_edit_map_container_all .modalPoiOptions').modal('show');
		
    });
	
	$('#manager_edit_map .bCancelTestPoi').click(function(e) {boolGotopoi=false});
	
	$('#manager_edit_map .bTestPoi').click(function(e) {
        e.preventDefault();
		
		if (currentPoiManagerLongTouch.data('id_poi') >= 300000)
		{
			boolGotopoi = true;
			statusSavingMapBeforeTestPoi=1;
			timerSavingMapBeforeTestPoi=0;
			$('#manager_edit_map_modalDoSaveBeforeTestPoi').modal('show');
			TimerSavingMapBeforeTest('poi'); // LAUNCH ANIM PROGRESS BAR
			
			id_poi_test = currentPoiManagerLongTouch.data('id_poi');
			i = GetPoiIndexFromID(currentPoiManagerLongTouch.data('id_poi'));
			name = pois[i].name;
			
			data = GetDataMapToSave();
			gotoTest = false;
			
			wycaApi.SetCurrentMapData(data, function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){	
					if (gommes.length == 0){	
						wycaApi.GetCurrentMapData(function(data) {
							if (data.A == wycaApi.AnswerCode.NO_ERROR){
								console.log('Map Data Saved');
								statusSavingMapBeforeTestPoi=2; //STOP ANIM PROGRESS BAR
								
								id_map = data.D.id_map;
								id_map_last = data.D.id_map;
								
								forbiddens = data.D.forbiddens;
								areas = data.D.areas;
								gommes = Array();
								docks = data.D.docks;
								pois = data.D.pois;
								landmarks = data.D.landmarks;
								augmented_poses = data.D.augmented_poses;
								/*
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
								*/
								managerHistoriques = Array();
								managerHistoriqueIndex = -1;
								ManagerRefreshHistorique();
								
								ManagerInitMap();
								ManagerResizeSVG();
								
								// On recherche le nouveau poi créé avec le bon id
								if (id_poi_test >= 300000)
								{
									$.each(pois, function( index, poi ) {
										
										if (poi.name == name)
										{
											currentPoiManagerLongTouch = $('#manager_edit_map_poi_robot_'+poi.id_poi);
											setTimeout(function(){$('#manager_edit_map_modalDoSaveBeforeTestPoi').modal('hide')},1500);
											if(boolGotopoi){
												$('#manager_edit_map .bTestPoi').click();
											}
										}
									});
								}
								
							}
							else
							{
								$('#manager_edit_map_modalDoSaveBeforeTestPoi').modal('hide')
								ParseAPIAnswerError(data,textErrorGetMap);
							}
						});
					}else{
						// SI GOMMES TO SAVE
						wycaApi.GetCurrentMapComplete(function(data) {
							if (data.A == wycaApi.AnswerCode.NO_ERROR){
								statusSavingMapBeforeTestPoi=2; //STOP ANIM PROGRESS BAR
								
								id_map = data.D.id_map;
								id_map_last = data.D.id_map;
								
								forbiddens = data.D.forbiddens;
								areas = data.D.areas;
								gommes = Array();
								docks = data.D.docks;
								pois = data.D.pois;
								landmarks = data.D.landmarks;
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
								
								managerHistoriques = Array();
								managerHistoriqueIndex = -1;
								ManagerRefreshHistorique();
								
								ManagerInitMap();
								ManagerResizeSVG();
								
								// On recherche le nouveau poi créé avec le bon id
								if (id_poi_test >= 300000)
								{
									$.each(pois, function( index, poi ) {
										
										if (poi.name == name)
										{
											currentPoiManagerLongTouch = $('#manager_edit_map_poi_robot_'+poi.id_poi);
											setTimeout(function(){$('#manager_edit_map_modalDoSaveBeforeTestPoi').modal('hide')},1500);
											if(boolGotopoi){
												$('#manager_edit_map .bTestPoi').click();
											}
										}
									});
								}
								
							}
							else
							{
								$('#manager_edit_map_modalDoSaveBeforeTestPoi').modal('hide')
								ParseAPIAnswerError(data,textErrorGetMap);
							}
						});
					}
				}else{
					$('#manager_edit_map_modalDoSaveBeforeTestPoi').modal('hide');
					ParseAPIAnswerError(data,textErrorSetMap);
				}
			});

		}
		else
		{
			//ManagerHideMenus();
			
			wycaApi.on('onGoToPoiResult', function (data){
				$('#manager_edit_map_bStop').hide();
				ManagerDisplayApiMessageGoTo(data);
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToPoiResult', onGoToPoiResult);
			
				$('#manager_edit_map .modalFinTest').modal('show');
			});
			
			wycaApi.GoToPoi(currentPoiManagerLongTouch.data('id_poi'), function (data){
				
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#manager_edit_map_bStop').show();
				}
				else
				{
					ManagerDisplayApiMessageGoTo(data);
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoiResult', onGoToPoiResult);
				}
			});
		}
    });
	
	/*
	
	$('#manager_edit_map .bTestPoi').click(function(e) {
        e.preventDefault();
		
		if (currentPoiManagerLongTouch.data('id_poi') >= 300000)
		{
			alert_wyca('You must save the map before testing a new POI');
		}
		else
		{
			ManagerHideMenus();
			
			wycaApi.on('onGoToPoiResult', function (data){
				$('#manager_edit_map_bStop').hide();
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#manager_edit_map .modalFinTest section.panel-success').show();
					$('#manager_edit_map .modalFinTest section.panel-danger').hide();
				}
				else
				{
					$('#manager_edit_map .modalFinTest section.panel-success').hide();
					$('#manager_edit_map .modalFinTest section.panel-danger').show();
					
					if (data.M != '')
						$('#manager_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						$('#manager_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
				}
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToPoiResult', onGoToPoiResult);
			
				$('#manager_edit_map .modalFinTest').modal('show');
			});
			
			wycaApi.GoToPoi(currentPoiManagerLongTouch.data('id_poi'), function (data){
				
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#manager_edit_map_bStop').show();
				}
				else
				{
					$('#manager_edit_map .modalFinTest section.panel-success').hide();
					$('#manager_edit_map .modalFinTest section.panel-danger').show();
					
					if (data.M != '')
						$('#manager_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						$('#manager_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
				
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoiResult', onGoToPoiResult);
					
					$('#manager_edit_map .modalFinTest').modal('show');
				}
			});
		}
    });
	*/
	
	/* AUGMENTED POSE */
	
	$('#manager_edit_map .bTestAugmentedPose').click(function(e) {
        e.preventDefault();
		RemoveClass('#manager_edit_map_svg .augmented_pose_elem', 'active');
		wycaApi.on('onGoToAugmentedPoseResult', function (data){
			$('#manager_edit_map_bStop').hide();
			ManagerDisplayApiMessageGoTo(data);
			// On rebranche l'ancienne fonction
			wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
		
		});
		
		wycaApi.GoToAugmentedPose(currentAugmentedPoseManagerLongTouch.data('id_augmented_pose'), function (data){
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#manager_edit_map_bStop').show();
			}
			else
			{
				ManagerDisplayApiMessageGoTo(data);
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
				
			}
		});
	
    });
	
	$('#manager_edit_map .bModalGoToAugmentedPose').click(function(e){
		e.preventDefault();
		$('#manager_edit_map .bTestAugmentedPose').click();
		boolModalGoToAugmentedPose = !$('#manager_edit_map .checkboxGotoaugmentedpose').prop('checked'); //ADD SAVING BDD / COOKIES ?
	})
	
	$('#manager_edit_map .bModalCancelGoToAugmentedPose').click(function(){
		boolModalGoToAugmentedPose = !$('#manager_edit_map .checkboxGotoaugmentedpose').prop('checked'); //ADD SAVING BDD / COOKIES ?
		RemoveClass('#manager_edit_map_svg .active', 'active'); 
	});
	
	/* DOCK */
	
	$('#manager_edit_map .bModalGoToDock').click(function(){
		$('#manager_edit_map .bTestDock').click();
		boolModalGoToDock = !$('#manager_edit_map .checkboxGotodock').prop('checked'); //ADD SAVING BDD / COOKIES ?
	});
	
	$('#manager_edit_map .bModalCancelGoToDock').click(function(){
		boolModalGoToDock = !$('#manager_edit_map .checkboxGotodock').prop('checked'); //ADD SAVING BDD / COOKIES ?
		RemoveClass('#manager_edit_map_svg .active', 'active');
	});
	
	$('#manager_edit_map .bTestDock').click(function(e) {
        e.preventDefault();
		RemoveClass('#manager_edit_map_svg .dock_elem', 'active');
		wycaApi.on('onGoToChargeResult', function (data){
			$('#manager_edit_map_bStop').hide();
			ManagerDisplayApiMessageGoTo(data);
			// On rebranche l'ancienne fonction
			wycaApi.on('onGoToChargeResult', onGoToChargeResult);
		});
		
		wycaApi.GoToCharge(currentDockManagerLongTouch.data('id_docking_station'), function (data){
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#manager_edit_map_bStop').show();
			}
			else
			{
				ManagerDisplayApiMessageGoTo(data);
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToChargeResult', onGoToChargeResult);
			}
		});
    });
	
	/**************************/
	/*        ZOOM            */
	/**************************/
	
	$('#manager_edit_map_zone_zoom_click').mousedown(function(e) {
       e.preventDefault();
	   downOnZoomClick = true;
    });
	
	$('#manager_edit_map_zone_zoom_click').mousemove(function(e) {
       e.preventDefault();
	   if (downOnZoomClick)
	   {
			w = $('#manager_edit_map_zoom_carte').width();
			h = $('#manager_edit_map_zoom_carte').height();
			
			wZoom = $('#manager_edit_map_zone_zoom').width();
			hZoom = $('#manager_edit_map_zone_zoom').height();
			
			x = e.offsetX - wZoom / 2;
			y = e.offsetY - hZoom / 2;
					
			//zoom = ros_largeur / $('#manager_edit_map_svg').width() / window.panZoomManager.getZoom();
			zoom = ManagerGetZoom();
			
			largeur_img = ros_largeur / zoom
			
			x = - x / w * largeur_img;
			y = - y / w * largeur_img;
			
			window.panZoomManager.pan({'x':x, 'y':y});
	   }
    });
	
	$('#manager_edit_map_zone_zoom_click').click(function(e) {
		e.preventDefault();
		
		w = $('#manager_edit_map_zoom_carte').width();
		h = $('#manager_edit_map_zoom_carte').height();
		
		wZoom = $('#manager_edit_map_zone_zoom').width();
		hZoom = $('#manager_edit_map_zone_zoom').height();
		
		x = e.offsetX - wZoom / 2;
		y = e.offsetY - hZoom / 2;
				
		//zoom = ros_largeur / $('#manager_edit_map_svg').width() / window.panZoomManager.getZoom();
		zoom = ManagerGetZoom();
		
		largeur_img = ros_largeur / zoom
		
		x = - x / w * largeur_img;
		y = - y / w * largeur_img;
		
		window.panZoomManager.pan({'x':x, 'y':y});
	});
	
	$('#manager_edit_map_zone_zoom_click').on('touchstart', function(e) {
       e.preventDefault();
	   downOnZoomClick = true;
	   
	    w = $('#manager_edit_map_zoom_carte').width();
		h = $('#manager_edit_map_zoom_carte').height();
		
		wZoom = $('#manager_edit_map_zone_zoom').width();
		hZoom = $('#manager_edit_map_zone_zoom').height();
		
		r = document.getElementById("manager_edit_map_zoom_carte_container").getBoundingClientRect();
		
		x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - r.left;
		y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - r.top;
		
		x = x - wZoom / 2;
		y = y - hZoom / 2;
				
		//zoom = ros_largeur / $('#manager_edit_map_svg').width() / window.panZoomManager.getZoom();
		zoom = ManagerGetZoom();
		
		largeur_img = ros_largeur / zoom
		
		x = - x / w * largeur_img;
		y = - y / w * largeur_img;
		
		window.panZoomManager.pan({'x':x, 'y':y});
	   
    });
	
	$('#manager_edit_map_zone_zoom_click').on('touchend', function(e) {
       e.preventDefault();
	   downOnZoomClick = false;
    });
	
	$('#manager_edit_map_zone_zoom_click').on('touchmove', function(e) {
       e.preventDefault();
	   if (downOnZoomClick)
	   {
		    w = $('#manager_edit_map_zoom_carte').width();
			h = $('#manager_edit_map_zoom_carte').height();
			
			wZoom = $('#manager_edit_map_zone_zoom').width();
			hZoom = $('#manager_edit_map_zone_zoom').height();
			
			r = document.getElementById("manager_edit_map_zoom_carte_container").getBoundingClientRect();
		
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - r.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - r.top;
			
			x = x - wZoom / 2;
			y = y - hZoom / 2;
					
			//zoom = ros_largeur / $('#manager_edit_map_svg').width() / window.panZoomManager.getZoom();
			zoom = ManagerGetZoom();
			
			largeur_img = ros_largeur / zoom
			
			x = - x / w * largeur_img;
			y = - y / w * largeur_img;
			
			window.panZoomManager.pan({'x':x, 'y':y});
	   }
    });
	
	/**************************/
	/*  Click on element      */
	/**************************/
	
	$(document).on('click', '#manager_edit_map_svg .dock_elem', function(e) {
		e.preventDefault();
		
		if (managerCurrentAction == 'addDock')
		{
		}
		else if (managerCurrentAction == 'gomme')
		{
		}
		else if (managerCanChangeMenu)
		{
			RemoveClass('#manager_edit_map_svg .active', 'active');
			RemoveClass('#manager_edit_map_svg .activ_select', 'activ_select'); 
			
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'dock', 'id':$(this).data('id_docking_station')});	
			ManagerHideCurrentMenuNotSelect();
			
			$('#manager_edit_map_boutonsDock').show();
            $('#manager_edit_map_boutonsStandard').hide();
			
			$('#manager_edit_map_boutonsDock a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			managerCurrentAction = 'editDock';	
			currentStep = '';
			
			currentDockIndex = GetDockIndexFromID($(this).data('id_docking_station'));
			dock = docks[currentDockIndex];
			saveCurrentDock = JSON.stringify(dock);
			
			AddClass('#manager_edit_map_svg .dock_elem_'+dock.id_docking_station, 'active');
			//AddClass('#manager_edit_map_svg .dock_elem_'+dock.id_docking_station, 'movable');	// Dock non movable
			
			if(boolModalGoToDock)
				$('#manager_edit_map_modalGoToDock').modal('show');
			else
				$('#manager_edit_map .bTestDock').click();
			
		}
		else
			ManagerAvertCantChange();
	});
	
	$(document).on('click', '#manager_edit_map_svg .poi_elem', function(e) {
		e.preventDefault();
		
		if (managerCurrentAction == 'addPoi')
		{
		}
		else if (managerCurrentAction == 'gomme')
		{
		}
		else if (managerCanChangeMenu)
		{
			RemoveClass('#manager_edit_map_svg .active', 'active');
			RemoveClass('#manager_edit_map_svg .activ_select', 'activ_select'); 
			RemoveClass('#manager_edit_map_svg .poi_elem', 'movable');
						
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'poi', 'id':$(this).data('id_poi')});	
			ManagerHideCurrentMenuNotSelect();
			
			$('#manager_edit_map_boutonsPoi').show();
			
            $('#manager_edit_map_boutonsStandard').hide();
			
			$('#manager_edit_map_boutonsPoi a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			currentPoiManagerLongTouch = $(this);
			//MENU POI DISPLAY
			if (managerCurrentAction != 'editPoi' && managerCurrentAction != 'addPoi')
			{
				ManagerHideCurrentMenuNotSelect();
				ManagerDisplayMenu('manager_edit_map_menu_poi');
			}
			
			managerCurrentAction = 'editPoi';	
			currentStep = '';
			
			currentPoiIndex = GetPoiIndexFromID($(this).data('id_poi'));
			poi = pois[currentPoiIndex];
			saveCurrentPoi = JSON.stringify(poi);
			
			AddClass('#manager_edit_map_svg .poi_elem_'+poi.id_poi, 'active');
			if (poi.id_fiducial < 1) // Movable que si il n'est pas lié à un reflecteur
				AddClass('#manager_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		}
		else
			ManagerAvertCantChange();
	});
	
	$(document).on('click', '#manager_edit_map_svg .augmented_pose_elem', function(e) {
		e.preventDefault();
		
		if (managerCurrentAction == 'gomme')
		{
		}
		else if (managerCanChangeMenu)
		{
			RemoveClass('#manager_edit_map_svg .active', 'active');
			RemoveClass('#manager_edit_map_svg .activ_select', 'activ_select'); 
			RemoveClass('#manager_edit_map_svg .augmented_pose_elem', 'movable');
						
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'augmented_pose', 'id':$(this).data('id_augmented_pose')});	
			ManagerHideCurrentMenuNotSelect();
			
			$('#manager_edit_map_boutonsAugmentedPose').show();
			
            $('#manager_edit_map_boutonsStandard').hide();
			
			$('#manager_edit_map_boutonsAugmentedPose a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			managerCurrentAction = 'editAugmentedPose';	
			currentStep = '';
			
			currentAugmentedPoseIndex = GetAugmentedPoseIndexFromID($(this).data('id_augmented_pose'));
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			saveCurrentAugmentedPose = JSON.stringify(augmented_pose);
			
			AddClass('#manager_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'active');
			
			if(boolModalGoToAugmentedPose)
				$('#manager_edit_map_modalGoToAugmentedPose').modal('show');
			else
				$('#manager_edit_map .bTestAugmentedPose').click();
		}
		else
			ManagerAvertCantChange();
	});
	
	/**************************/
	/*  Click on element      */
	/**************************/
	
	/* BTN GOTOPOSE */
	
	$('#manager_edit_map_menu .bMoveTo').click(function(e) {
        e.preventDefault();
		ManagerHideMenus();
		if (managerCanChangeMenu)
		{
			//CURRENT ACTION TARGET
			managerCurrentAction = 'prepareGotoPose';
			managerCanChangeMenu = false;
			//AJOUT ICON MENU + CROIX
			$('#manager_edit_map .burger_menu').hide('fast');
			$('#manager_edit_map .icon_menu[data-menu="manager_edit_map_menu_gotopose"]').show('fast');
			setTimeout(function(){$('#manager_edit_map .times_icon_menu').show('fast')},50);
			
			boolHelpGotoPose = getCookie('boolHelpGotoPoseM') != '' ? JSON.parse(getCookie('boolHelpGotoPoseM')) : true; // TRICK JSON.parse STR TO BOOL
			
			if(boolHelpGotoPose){
				$('#manager_edit_map .modalHelpClickGotoPose').modal('show');
			}			
		}
		else
			ManagerAvertCantChange();
		
    });
	
	$('#manager_edit_map .bHelpClickGotoPoseOk').click(function(){boolHelpGotoPose = !$('#manager_edit_map .checkboxHelpGotopose').prop('checked');setCookie('boolHelpGotoPoseM',boolHelpGotoPose);});//ADD SAVING BDD / COOKIES ?
	
	/* BTN MENU POI */
		
	$('#manager_edit_map_bPoiDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this POI?'))
		{
			DeletePoi(currentPoiIndex);
		}
    });
	
	$('#manager_edit_map_menu .bAddPOI').click(function(e) {
        e.preventDefault();
		ManagerHideMenus();
		if (managerCanChangeMenu)
		{
			$('#manager_edit_map_container_all .modalAddPoi').modal('show');
		}
		else
			ManagerAvertCantChange();
	});
	
	$('#manager_edit_map_container_all .modalAddPoi #manager_edit_map_bModalAddPoiSave').click(function(e) {
		e.preventDefault();
		
		wycaApi.CheckPosition(lastRobotPose.X, lastRobotPose.Y, function(data)
		{
			if (data.A == wycaApi.AnswerCode.NO_ERROR && data.D){
				nextIdPoi++;
					
				poi_temp_add = {'id_poi':nextIdPoi, 'id_map':id_map, 'id_fiducial':-1, 'fiducial_pose_x':-1, 'fiducial_pose_y':-1, 'fiducial_pose_t':-1, 'final_pose_x':lastRobotPose.X, 'final_pose_y':lastRobotPose.Y, 'final_pose_t':lastRobotPose.T, 'approch_pose_x':-1, 'approch_pose_y':-1, 'approch_pose_t':-1, 'name':'POI', 'comment':'', 'color':'', 'icon':'', 'active':true};
				
				ManagerAddHistorique({'action':'add_poi', 'data':poi_temp_add});
				pois.push(poi_temp_add);
				ManagerTracePoi(pois.length-1);
						
				$('#manager_edit_map_container_all .modalAddPoi').modal('hide');
				
				currentPoiIndex = pois.length-1;
				poi = pois[currentPoiIndex];
				
				$('#manager_edit_map_poi_name').val(poi.name);
				$('#manager_edit_map_poi_comment').val(poi.comment);
				
				$('#manager_edit_map_container_all .modalAddPoi').modal('hide');
				$('#manager_edit_map_container_all .modalPoiOptions').modal('show');
			}
			else
			{
				if (data.A != wycaApi.AnswerCode.NO_ERROR)
				{
					ParseAPIAnswerError(data,textErrorCheckPosition);
				}
				else
				{
					alert_wyca(textInvalidPositionRobot);
				}
				
			}
		});
	});
	
	$('#manager_edit_map_bPoiSaveConfig').click(function(e) {
		if(!CheckName(pois, $('#manager_edit_map_poi_name').val(), currentPoiIndex)){
			poi = pois[currentPoiIndex];
			saveCurrentPoi = JSON.stringify(poi);
					
			poi.name = $('#manager_edit_map_poi_name').val();
			poi.comment = $('#manager_edit_map_poi_comment').val();
			pois[currentPoiIndex] = poi;
			
			$('#manager_edit_map_bPoiCancelConfig').show();
			
			if (managerCurrentAction == 'editPoi')
				ManagerAddHistorique({'action':'edit_poi', 'data':{'index':currentPoiIndex, 'old':saveCurrentPoi, 'new':JSON.stringify(pois[currentPoiIndex])}});
			saveCurrentPoi = JSON.stringify(pois[currentPoiIndex]);
			ManagerTracePoi(currentPoiIndex);
			$('#manager_edit_map .modal.modalPoiOptions').modal('hide');	
		}else{
			alert_wyca(textNameUsed);
		};
	});
	
	$('#manager_edit_map_bPoiEditSaveConfig').click(function(e) {
		if (managerCurrentAction == 'addPoi')
		{
			ManagerSaveElementNeeded(false);
			
			nextIdPoi++;
			p = {'id_poi':nextIdPoi, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':currentPoiPose.final_pose_x, 'final_pose_y':currentPoiPose.final_pose_y, 'final_pose_t':currentPoiPose.final_pose_t, 'approch_pose_x':currentPoiPose.approch_pose_x, 'approch_pose_y':currentPoiPose.approch_pose_y, 'approch_pose_t':currentPoiPose.approch_pose_t, 'fiducial_pose_x':currentPoiPose.fiducial_pose_x, 'fiducial_pose_y':currentPoiPose.fiducial_pose_y, 'fiducial_pose_t':currentPoiPose.fiducial_pose_t, 'name':$('#manager_edit_map_poi_name').val(), 'comment':'', 'icon':'', 'color':'', 'icon':'', 'active':true};
			ManagerAddHistorique({'action':'add_poi', 'data':p});
			
			pois.push(p);
			ManagerTracePoi(pois.length-1);
			
			$('#manager_edit_map_svg .poi_elem_current').remove();
			
			RemoveClass('#manager_edit_map_svg .active', 'active');
			
			managerCurrentAction = '';
			currentStep = '';
			
			$('#manager_edit_map_boutonsRotate').hide();
			
			$('#manager_edit_map_boutonsPoi').hide();
			$('#manager_edit_map_boutonsStandard').show();
			$('#manager_edit_map_message_aide').hide();
			blockZoom = false;
			
			$('body').addClass('no_current');
			
			ManagerSetModeSelect();
		}
		else
		{
			poi = pois[currentPoiIndex];
			poi.name = $('#manager_edit_map_poi_name').val();
			if (poi.name == '') poi.name = 'POI';
		}
		
	});
	
	$('#manager_edit_map_bPoiDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this POI?'))
		{
			ManagerDeletePoi(currentPoiIndex);
		}
    });
	
	$('#manager_edit_map_bPoiEditName').click(function(e) {
   		poi = pois[currentPoiIndex];
		$('#manager_edit_map_poi_name').val(poi.name);
	});
		
	InitTaille();
    
    var offsetMap;
    
    AppliquerZoom();
	
	ManagerSetModeSelect();
	
	$('#manager_edit_map_svg').click(function(e){
		if(managerCanChangeMenu == false){
			if(managerCurrentAction == 'prepareGotoPose'){
	
				//ManagerHideMenus();
				
				zoom = ManagerGetZoom();
				p = $('#manager_edit_map_svg image').position();
				/*x = (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageX : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageX) - p.left;
				y = (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageY : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				*/
				
				x = e.pageX - p.left;
				y = e.pageY - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xGotoPose = x ;
				yGotoPose = ros_hauteur - y;
					
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				wycaApi.on('onGoToPoseResult', function (data){
					$('#manager_edit_map_svg .go_to_pose_elem').remove();
					$('#manager_edit_map_bStop').hide();
					
					ManagerDisplayApiMessageGoTo(data);
					
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoseResult', onGoToPoseResult);
				});
				
				console.log('GoToPose', xRos, yRos);
				
				wycaApi.GoToPose(xRos, yRos, 0, 0, function (data){
					$('#manager_edit_map .icon_menu').click(); // POUR SORTIR DU MENU GOTOPOSE
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						$('#manager_edit_map_bStop').show();
						ManagerTraceGoToPose(xGotoPose,yGotoPose);
					}
					else
					{
						$('#manager_edit_map_svg .go_to_pose_elem').remove();
						
						ManagerDisplayApiMessageGoTo(data);
						
						// On rebranche l'ancienne fonction
						wycaApi.on('onGoToPoseResult', onGoToPoseResult);
					}
				});
			}
		}
	})
	
});

var touchStarted = false;

function ManagerPoiSave()
{
	if (managerCurrentAction == 'addPoi')
	{
		$('#manager_edit_map_poi_name').val('');
		$('#manager_edit_map_modalPoiEditName').modal('show');
	}
	else if (managerCurrentAction == 'editPoi')
	{	
		ManagerSaveElementNeeded(false);
		
		poi = pois[currentPoiIndex];
		RemoveClass('#manager_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		
		ManagerAddHistorique({'action':'edit_poi', 'data':{'index':currentPoiIndex, 'old':saveCurrentPoi, 'new':JSON.stringify(pois[currentPoiIndex])}});
		
		RemoveClass('#manager_edit_map_svg .active', 'active');
		
		managerCurrentAction = '';
		currentStep = '';
		
		$('#manager_edit_map_boutonsRotate').hide();
		
		$('#manager_edit_map_boutonsPoi').hide();
		$('#manager_edit_map_boutonsStandard').show();
		$('#manager_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		ManagerSetModeSelect();
	}
}

function ManagerPoiCancel()
{
	ManagerSaveElementNeeded(false);
	
	$('#manager_edit_map_svg .poi_elem_current').remove();
	RemoveClass('#manager_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (managerCurrentAction == 'addPoi')
	{
		$('#manager_edit_map_svg .poi_elem_0').remove();
	}
	else if (managerCurrentAction == 'editPoi')
	{
		poi = pois[currentPoiIndex];
		RemoveClass('#manager_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		
		pois[currentPoiIndex] = JSON.parse(saveCurrentPoi);
		ManagerTracePoi(currentPoiIndex);
	}
	managerCurrentAction = '';
	currentStep = '';
	
	$('#manager_edit_map_boutonsRotate').hide();
	
	$('#manager_edit_map_boutonsPoi').hide();
	$('#manager_edit_map_boutonsStandard').show();
	$('#manager_edit_map_message_aide').hide();
	blockZoom = false;
	
	ManagerSetModeSelect();
}

function ManagerRefreshZoomView()
{
	pSVG = $('#manager_edit_map_svg').position();
	pImg = $('#manager_edit_map_svg image').position();
	pImg.left -= pSVG.left;
	pImg.top -= pSVG.top;
	
	//zoom = ros_largeur / $('#manager_edit_map_svg').width() / window.panZoomManager.getZoom();
	zoom = ManagerGetZoom();
	
	wZoom = $('#manager_edit_map_zoom_carte').width();
	hZoom = $('#manager_edit_map_zoom_carte').height();
	
	wNew = 0;
	hNew = 0;
	tNew = 0;
	lNew = 0;
	
	if (false && pImg.left > 0)
		lNew = 0;
	else
		lNew = -(pImg.left*zoom) / ros_largeur * wZoom;
	if (false && pImg.top > 0)
		tNew = 0;
	else
		tNew = -(pImg.top*zoom) / ros_largeur * wZoom;
	
	hNew = $('#manager_edit_map_svg').height() * zoom  / ros_largeur * wZoom;
	wNew = $('#manager_edit_map_svg').width() * zoom  / ros_largeur * wZoom;
	
	//if (tNew + hNew > hZoom) hNew = hZoom - tNew;
	//if (lNew + wNew > wZoom) wNew = wZoom - lNew;
		
	$('#manager_edit_map_zone_zoom').width(wNew);
	$('#manager_edit_map_zone_zoom').height(hNew);
				
	$('#manager_edit_map_zone_zoom').css('top', tNew - 1);
	$('#manager_edit_map_zone_zoom').css('left', lNew - 1);
	
}

function ManagerDeletePoi(indexInArray)
{

	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	pois[indexInArray].deleted = true;
	
	ManagerAddHistorique({'action':'delete_poi', 'data':indexInArray});
	
	data = pois[indexInArray];
	$('#manager_edit_map_svg .poi_elem_'+data.id_poi).remove();
	
	RemoveClass('#manager_edit_map_svg .active', 'active');
	
	managerCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#manager_edit_map_boutonsPoi').hide();
    $('#manager_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	ManagerSetModeSelect();
}

function ManagerDisplayApiMessageGoTo(data)
{

	if (data.A == wycaApi.AnswerCode.NO_ERROR)
	{
		//SI SUCCESS
		wycaApi.PlaySound(wycaApi.SOUND.SUCCESS, 1);
		$('#manager_edit_map .modalFinTest section.panel-success').show();
		$('#manager_edit_map .modalFinTest section.panel-danger').hide();
		$('#manager_edit_map .modalFinTest section.panel-warning').hide();
		
		$('#manager_edit_map .modalFinTest').modal('show');
	}
	else
	{	
		let html,target;
		if(data.A == wycaApi.AnswerCode.CANCELED){
			//SI CANCEL
			$('#manager_edit_map .modalFinTest section.panel-success').hide();
			$('#manager_edit_map .modalFinTest section.panel-danger').hide();
			$('#manager_edit_map .modalFinTest section.panel-warning').show();
			
			html = typeof(textActionCanceled) != 'undefined' ? textActionCanceled : wycaApi.AnswerCodeToString(data.A);
			target = $('#manager_edit_map .modalFinTest section.panel-warning span.error_details');
		}else{
			//SI ERROR
			wycaApi.PlaySound(wycaApi.SOUND.ALERT, 1);
			$('#manager_edit_map .modalFinTest section.panel-success').hide();
			$('#manager_edit_map .modalFinTest section.panel-danger').show();
			$('#manager_edit_map .modalFinTest section.panel-warning').hide();
			
			if(data.A == wycaApi.AnswerCode.DETAILS_IN_MESSAGE){
				html  = typeof(textDetailsInMessage) != 'undefined' ? textDetailsInMessage : wycaApi.AnswerCodeToString(data.A);
				html += '<span class="toggle_details" onClick="$(\'span.error_details span.details\').toggle();"><i class="fas fa-plus-circle"></i> ';
				html += typeof(textSeeMoreDetails) != 'undefined' ? textSeeMoreDetails : 'See more details' ;
				html += '</span>' ;
			}else{
				html = wycaApi.AnswerCodeToString(data.A);
			}
			
			if (data.M != ''){
				if( data.A == wycaApi.AnswerCode.DETAILS_IN_MESSAGE )
					html += '<span class="details" style="display:none">'+data.M+'</span>';
				else
					html += '<span>'+data.M+'</span>';
			}
			target = $('#manager_edit_map .modalFinTest section.panel-danger span.error_details');
		}
		
		target.html(html);
		$('#manager_edit_map .modalFinTest').modal('show');
	}
	
}
