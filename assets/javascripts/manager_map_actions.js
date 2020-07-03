// JavaScript Document
var canvas;
var dessin;

var managerCurrentAction = '';
var currentStep = '';

var currentStepAddPoi = '';

var svgManager;

var timerRotate = null;

var previewDisplayed = false;
var currentForbiddenIndex = -1;
var saveCurrentForbidden = null;
var currentAreaIndex = -1;
var saveCurrentArea = null;
var currentDockIndex = -1;
var saveCurrentDock = null;
var currentPoiIndex = -1;
var saveCurrentPio = null;

var currentDockPose = {};
var currentPoiPose = {};

var downOnZoomClick = false;
var managerDownOnSVG = false;
var managerDownOnSVG_x = 0;
var managerDownOnSVG_y = 0;
var managerDownOnSVG_x_scroll = 0;
var managerDownOnSVG_y_scroll = 0;
var downOnMovable = false;
var movableDown = null;
var currentForbiddenPoints = Array();
var currentAreaPoints = Array();
var currentGommePoints = Array();
var ctrlZ = false;
var previewInProgress = false;
var displayHelpAddShelf = true;

var managerCanChangeMenu = true;

var currentSelectedItem = Array();
var ctrlClickIsPressed = false;
var cPressed = false;

var clickSelectSVG = false;
var clickSelectSVG_x = 0;
var clickSelectSVG_y = 0;
var clickSelectSVG_x_last = -1;
var clickSelectSVG_y_last = -1;

var currentModePath;

var timerSaveUserOptions = null;
var timerOpenInfo = null;
var id_info_to_open = -1;
var info_to_open_x = -1;
var info_to_open_y = -1;

var intervalRefreshConn = null;

var managerSavedCanClose = true;

var indexDockElem = 0;
var indexPoiElem = 0;

var poi_temp_add = {};

var timerCantChange = null;
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
		$('#manager_edit_map_bManagerUndo').addClass('disabled');
	else
		$('#manager_edit_map_bManagerUndo').removeClass('disabled');
	if (managerHistoriqueIndex == managerHistoriques.length-1)
		$('#manager_edit_map_bManagerRedo').addClass('disabled');
	else
		$('#manager_edit_map_bManagerRedo').removeClass('disabled');
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
	
	$('#manager_edit_map_bManagerUndo').click(function(e) {
        e.preventDefault();
		if (!$('#manager_edit_map_bManagerUndo').hasClass('disabled'))
			ManagerUndo();
	});
	$('#manager_edit_map_bManagerUndo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#manager_edit_map_bManagerUndo').hasClass('disabled'))
			ManagerUndo();
	});
	
	$('#manager_edit_map_bManagerRedo').click(function(e) {
        e.preventDefault();
		if (!$('#manager_edit_map_bManagerRedo').hasClass('disabled'))
			ManagerRedo();
    });
	$('#manager_edit_map_bManagerRedo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#manager_edit_map_bManagerRedo').hasClass('disabled'))
			ManagerRedo();
	});
	
	$('#manager_edit_map .bTestDock').click(function(e) {
        e.preventDefault();
		ManagerHideMenus();
		
		wycaApi.on('onGoToChargeResult', function (data){
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
			wycaApi.on('onGoToChargeResult', onGoToChargeResult);
			
			$('#manager_edit_map .modalFinTest').modal('show');
		});
		wycaApi.GoToCharge(currentDockManagerLongTouch.data('id_docking_station'), function (data){
			
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
				wycaApi.on('onGoToChargeResult', onGoToChargeResult);
				
				$('#manager_edit_map .modalFinTest').modal('show');
			}
		});
    });
	
	$('#manager_edit_map_menu_poi .bDeletePoi').click(function(e) {
        e.preventDefault();
		ManagerHideMenus();
		i = GetPoiIndexFromID(currentPoiManagerLongTouch.data('id_poi'));
		ManagerDeletePoi(i);
    });
	
	$('#manager_edit_map_menu_poi .bConfigPoi').click(function(e) {
        e.preventDefault();
		ManagerHideMenus();
		managerCurrentAction = 'editPoi';
	
		currentPoiIndex = GetPoiIndexFromID(currentPoiManagerLongTouch.data('id_poi'));
		poi = pois[currentPoiIndex];
		
		$('#manager_edit_map_poi_name').val(poi.name);
		$('#manager_edit_map_poi_comment').val(poi.comment);
		
		$('#manager_edit_map_container_all .modalPoiOptions').modal('show');
		
    });
	
	$('#manager_edit_map .bTestPoi').click(function(e) {
        e.preventDefault();
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
	
	/**************************/
	/*  Click on element      */
	/**************************/
	$('#manager_edit_map_menu .bMoveTo').click(function(e) {
        e.preventDefault();
		
		ManagerHideMenus();
		
		zoom = ManagerGetZoom();
		p = $('#manager_edit_map_svg image').position();
		x = (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageX : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageX) - p.left;
		y = (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageY : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageY) - p.top;
		x = x * zoom;
		y = ros_hauteur - (y * zoom);
		
		xRos = x * ros_resolution / 100;
		yRos = y * ros_resolution / 100;
		
		wycaApi.on('onGoToPoseResult', function (data){
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
			wycaApi.on('onGoToPoiResult', onGoToPoseResult);
		
			$('#manager_edit_map .modalFinTest').modal('show');
		});
		
		console.log('GoToPose', xRos, yRos);
		
		wycaApi.GoToPose(xRos, yRos, 0, function (data){
			
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
				wycaApi.on('onGoToPoseResult', onGoToPoseResult);
				
				$('#manager_edit_map .modalFinTest').modal('show');
			}
		});
		
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
	
	$('.modalAddPoi .bAddPoiAtCurrentPose').click(function(e) {
		
		nextIdPoi++;
			
		poi_temp_add = {'id_poi':nextIdPoi, 'id_map':id_map, 'id_fiducial':-1, 'fiducial_pose_x':-1, 'fiducial_pose_y':-1, 'fiducial_pose_t':-1, 'final_pose_x':lastRobotPose.X, 'final_pose_y':lastRobotPose.Y, 'final_pose_t':lastRobotPose.T, 'approch_pose_x':-1, 'approch_pose_y':-1, 'approch_pose_t':-1, 'name':'POI', 'comment':'', 'color':'', 'advanced':false, 'icon':'', 'active':true};
		
		ManagerAddHistorique({'action':'add_poi', 'data':poi_temp_add});
		pois.push(poi_temp_add);
		ManagerTracePoi(pois.length-1);
				
		$('#manager_edit_map_container_all .modalAddPoi').modal('hide');
		
		currentPoiIndex = pois.length-1;
		poi = pois[currentPoiIndex];
		
		$('#manager_edit_map_container_all .modalPoiOptions').modal('show');
	});
	
	
	$('#manager_edit_map_bPoiSaveConfig').click(function(e) {
		poi = pois[currentPoiIndex];
		saveCurrentPoi = JSON.stringify(poi);
				
		poi.name = $('#manager_edit_map_poi_name').val();
		poi.comment = $('#manager_edit_map_poi_comment').val();
			
		pois[currentPoiIndex] = poi;
				
		if (managerCurrentAction == 'editPoi')
			ManagerAddHistorique({'action':'edit_poi', 'data':{'index':currentPoiIndex, 'old':saveCurrentPoi, 'new':JSON.stringify(pois[currentPoiIndex])}});
		
		ManagerTracePoi(currentPoiIndex);
	});
	
	$('#manager_edit_map_bPoiEditSaveConfig').click(function(e) {
		if (managerCurrentAction == 'addPoi')
		{
			ManagerSaveElementNeeded(false);
			
			nextIdPoi++;
			p = {'id_poi':nextIdPoi, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':currentPoiPose.final_pose_x, 'final_pose_y':currentPoiPose.final_pose_y, 'final_pose_t':currentPoiPose.final_pose_t, 'approch_pose_x':currentPoiPose.approch_pose_x, 'approch_pose_y':currentPoiPose.approch_pose_y, 'approch_pose_t':currentPoiPose.approch_pose_t, 'fiducial_pose_x':currentPoiPose.fiducial_pose_x, 'fiducial_pose_y':currentPoiPose.fiducial_pose_y, 'fiducial_pose_t':currentPoiPose.fiducial_pose_t, 'name':$('#manager_edit_map_poi_name').val(), 'comment':'', 'icon':'', 'color':'', 'advanced':true, 'icon':'', 'active':true};
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
			NormaDeletePoi(currentPoiIndex);
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
	
	if (!pois[indexInArray].advanced)
	{
		pois[indexInArray].deleted = true;
		
		ManagerAddHistorique({'action':'delete_poi', 'data':indexInArray});
		
		data = pois[indexInArray];
		$('#manager_edit_map_svg .poi_elem_'+data.id_poi).remove();
		
		RemoveClass('#manager_edit_map_svg .active', 'active');
	}
	
	managerCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#manager_edit_map_boutonsPoi').hide();
    $('#manager_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	ManagerSetModeSelect();
}