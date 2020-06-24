// JavaScript Document
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

var minStokeWidth = 1;
var maxStokeWidth = 5;

var currentUpdateMode = 'manuel';
var currentIdZoneSelected = 0;
var currentRegion = '';
var currentItem = '';
var currentItemNum = 20;

var canvas;
var dessin;

var currentAction = '';
var currentStep = '';

var currentStepAddPoi = '';

var svg;

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
var downOnSVG = false;
var downOnSVG_x = 0;
var downOnSVG_y = 0;
var downOnSVG_x_scroll = 0;
var downOnSVG_y_scroll = 0;
var downOnMovable = false;
var movableDown = null;
var currentForbiddenPoints = Array();
var currentAreaPoints = Array();
var currentGommePoints = Array();
var ctrlZ = false;
var previewInProgress = false;
var displayHelpAddShelf = true;

var canChangeMenu = true;

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

var savedCanClose = true;

var indexDockElem = 0;
var indexPoiElem = 0;

var poi_temp_add = {};

var timerCantChange = null;
function AvertCantChange()
{
	$('#install_by_step_edit_map_bModalCancelEdit').click();
}

function CloseSelect()
{
	currentAction = '';
	currentStep = '';
}


function HideCurrentMenu()
{
	/*
	if (currentAction == 'export') CloseExport();
	if (currentAction == 'jobs') CloseJobs();
	if (currentAction == 'select') CloseSelect()
	*/
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	$('body').attr('class', 'no_current');

	currentAction = '';
	currentStep = '';
}


function HideCurrentMenuNotSelect()
{
	if (currentAction == 'select') return;
	
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	$('body').attr('class', 'no_current');
	
	currentAction = '';
	currentStep = '';
}

var historiques = Array();
var historiqueIndex = -1;


function Undo()
{
	savedCanClose = false;
	
	elem = historiques[historiqueIndex];
	switch(elem.action)
	{
		case 'gomme':
			gommes.pop();
			$('#install_by_step_edit_map_svg .gomme_elem_current_'+gommes.length).remove();
			break;
		case 'add_forbidden':
			forbiddens.pop();
			$('#install_by_step_edit_map_svg .forbidden_elem_'+elem.data.id_area).remove();
			break;
		case 'edit_forbidden':
			forbiddens[elem.data.index] = JSON.parse(elem.data.old);
			TraceForbidden(elem.data.index);
			break;
		case 'delete_forbidden':
			forbiddens[elem.data].deleted = false;
			TraceForbidden(elem.data);
			break;
		case 'add_area':
			areas.pop();
			$('#install_by_step_edit_map_svg .area_elem_'+elem.data.id_area).remove();
			break;
		case 'edit_area':
			areas[elem.data.index] = JSON.parse(elem.data.old);
			TraceArea(elem.data.index);
			break;
		case 'delete_area':
			areas[elem.data].deleted = false;
			TraceArea(elem.data);
			break;
		case 'add_dock':
			docks.pop();
			$('#install_by_step_edit_map_svg .dock_elem_'+elem.data.id_docking_station).remove();
			break;
		case 'edit_dock':
			docks[elem.data.index] = JSON.parse(elem.data.old);
			TraceDock(elem.data.index);
			break;
		case 'delete_dock':
			docks[elem.data].deleted = false;
			TraceDock(elem.data);
			break;
		case 'add_poi':
			pois.pop();
			$('#install_by_step_edit_map_svg .poi_elem_'+elem.data.id_poi).remove();
			break;
		case 'edit_poi':
			pois[elem.data.index] = JSON.parse(elem.data.old);
			TracePoi(elem.data.index);
			break;
		case 'delete_poi':
			pois[elem.data].deleted = false;
			TracePoi(elem.data);
			break;
	}
	historiqueIndex--;
	
	RefreshHistorique();
}

function Redo()
{
	savedCanClose = false;
	
	historiqueIndex++;
	
	elem = historiques[historiqueIndex];
	switch(elem.action)
	{
		case 'gomme':
			gommes.push(elem.data);
			TraceCurrentGomme(gommes[gommes.length-1], gommes.length-1)
			break;
		case 'add_forbidden':
			forbiddens.push(elem.data);
			TraceForbidden(forbiddens.length-1);
			break;
		case 'edit_forbidden':
			forbiddens[elem.data.index] = JSON.parse(elem.data.new);
			TraceForbidden(elem.data.index);
			break;
		case 'delete_forbidden':
			forbiddens[elem.data].deleted = true;
			TraceForbidden(elem.data);
			break;
		case 'add_area':
			areas.push(elem.data);
			TraceArea(areas.length-1);
			break;
		case 'edit_area':
			areas[elem.data.index] = JSON.parse(elem.data.new);
			TraceArea(elem.data.index);
			break;
		case 'delete_area':
			areas[elem.data].deleted = true;
			TraceArea(elem.data);
			break;
		case 'add_dock':
			docks.push(elem.data);
			TraceDock(docks.length-1);
			break;
		case 'edit_dock':
			docks[elem.data.index] = JSON.parse(elem.data.new);
			TraceDock(elem.data.index);
			break;
		case 'delete_dock':
			docks[elem.data].deleted = true;
			TraceDock(elem.data);
			break;
		case 'add_poi':
			pois.push(elem.data);
			TracePoi(pois.length-1);
			break;
		case 'edit_poi':
			pois[elem.data.index] = JSON.parse(elem.data.new);
			TracePoi(elem.data.index);
			break;
		case 'delete_poi':
			pois[elem.data].deleted = true;
			TracePoi(elem.data);
			break;
	}
	
	RefreshHistorique();
}

function AddHistorique(elem)
{
	savedCanClose = false;
	
	while (historiqueIndex < historiques.length-1)
		historiques.pop();
	
	historiques.push(elem);
	historiqueIndex++;
	
	RefreshHistorique();
}
function RefreshHistorique()
{
	if (historiqueIndex == -1)
		$('#install_by_step_edit_map_bUndo').addClass('disabled');
	else
		$('#install_by_step_edit_map_bUndo').removeClass('disabled');
	if (historiqueIndex == historiques.length-1)
		$('#install_by_step_edit_map_bRedo').addClass('disabled');
	else
		$('#install_by_step_edit_map_bRedo').removeClass('disabled');
}

function SetModeSelect()
{
	$('body').addClass('select');
	currentAction = 'select';
	currentStep = '';
}

function SaveElementNeeded(need)
{
	canChangeMenu = !need;
	if (need)
	{
		$('#bSaveCurrentElem').show();
		$('#bCancelCurrentElem').show();
	}
	else
	{
		$('#bSaveCurrentElem').hide();
		$('#bCancelCurrentElem').hide();
	}
}

$(document).ready(function() {

	window.addEventListener('beforeunload', function(e){
		if (!savedCanClose)
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
	
	
	svg = document.querySelector('#install_by_step_edit_map_svg');
	InitSVG();
	
	$('#install_by_step_edit_map #bEndGomme').click(function(e) {
        e.preventDefault();
		$('#bEndGomme').hide();
		currentAction = '';
		currentStep = '';
		$('body').addClass('no_current');
    });
	
	$('#install_by_step_edit_map #bSaveCurrentElem').click(function(e) {
        e.preventDefault();
		
		if (currentAction == 'addPoi' || currentAction == 'editPoi')
			PoiSave();
		else if (currentAction == 'addDock' || currentAction == 'editDock')
			DockSave();
		else if (currentAction == 'addArea' || currentAction == 'editArea')
			AreaSave();
		else if (currentAction == 'addForbiddenArea' || currentAction == 'editForbiddenArea')
			ForbiddenSave();		
    });
	
	$('#install_by_step_edit_map #bCancelCurrentElem').click(function(e) {
        e.preventDefault();
		
		if (currentAction == 'addPoi' || currentAction == 'editPoi')
			PoiCancel();
		else if (currentAction == 'addDock' || currentAction == 'editDock')
			DockCancel();
		else if (currentAction == 'addArea' || currentAction == 'editArea')
			AreaCancel();
		else if (currentAction == 'addForbiddenArea' || currentAction == 'editForbiddenArea')
			ForbiddenCancel();		
    });
	
	$('#install_by_step_edit_map_bUndo').click(function(e) {
        e.preventDefault();
		if (!$('#bUndo').hasClass('disabled'))
			Undo();
	});
	$('#install_by_step_edit_map_bUndo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#bUndo').hasClass('disabled'))
			Undo();
	});
	
	$('#install_by_step_edit_map_bRedo').click(function(e) {
        e.preventDefault();
		if (!$('#bRedo').hasClass('disabled'))
			Redo();
    });
	$('#install_by_step_edit_map_bRedo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#bRedo').hasClass('disabled'))
			Redo();
	});
	
	$(document).on('touchstart', '#install_by_step_edit_map_svg .movable', function(e) {
		if (currentAction != 'gomme')
		{
			touchStarted = true;
			downOnMovable = true;
			movableDown = $(this);
			downOnSVG_x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
			downOnSVG_y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
			
			SaveElementNeeded(true);
			
			blockZoom = true;
		}
    });
	
	
	$(document).on('touchstart', '#install_by_step_edit_map_svg .secable', function(e) {
		if (currentAction == 'editForbiddenArea')
		{
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[e.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[e.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			tailleArea = 1*zoom;
			tailleArea = 1;
			
			
			forbiddens[currentForbiddenIndex].points.splice($(this).data('index_point'), 0, {x:xRos, y:yRos});
			TraceForbidden(currentForbiddenIndex);
		}
		else if (currentAction == 'editArea')
		{
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[e.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[e.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			tailleArea = 1*zoom;
			tailleArea = 1;
			
			
			areas[currentAreaIndex].points.splice($(this).data('index_point'), 0, {x:xRos, y:yRos});
			TraceArea(currentAreaIndex);
		}
    });
	
	$('#install_by_step_edit_map_menu_point .bDeletePoint').click(function(e) {
        e.preventDefault();
		HideMenus();
		if (currentAction == 'editForbiddenArea')
		{
			forbiddens[currentForbiddenIndex].points.splice(currentPointLongTouch.data('index_point'), 1);
			TraceForbidden(currentForbiddenIndex);
		}
		else if (currentAction == 'editArea')
		{
			areas[currentAreaIndex].points.splice(currentPointLongTouch.data('index_point'), 1);
			TraceArea(currentAreaIndex);
		}
    });
	
	$('#install_by_step_edit_map_menu_forbidden .bDeleteForbidden').click(function(e) {
        e.preventDefault();
		HideMenus();
		if (currentAction == "select" || currentAction == 'editForbiddenArea')
		{
			i = GetForbiddenIndexFromID(currentForbiddenLongTouch.data('id_area'));
			DeleteForbidden(i);	
		}
    });
	
	$('#install_by_step_edit_map_menu_area .bDeleteArea').click(function(e) {
        e.preventDefault();
		HideMenus();
		if (currentAction == "select" || currentAction == 'editArea')
		{
			i = GetAreaIndexFromID(currentAreaLongTouch.data('id_area'));
			DeleteArea(i);	
		}
    });
	
	$('#install_by_step_edit_map_menu_area .bConfigArea').click(function(e) {
        e.preventDefault();
		HideMenus();
		if (currentAction == "select" || currentAction == 'editArea')
		{
			currentAreaIndex = GetAreaIndexFromID(currentAreaLongTouch.data('id_area'));
			area = areas[currentAreaIndex];
			if (area.configs != undefined)
			{
				$.each(area.configs, function( indexConfig, config ) {
					switch(config.name)
					{
						case 'led_color_mode': $('#led_color_mode').val(config.value); break;
						case 'led_color': $('#led_color').val(config.value); $('#led_color').keyup(); break;
						case 'led_animation_mode': $('#led_animation_mode').val(config.value); break;
						case 'led_animation': $('#led_animation').val(config.value); break;
						case 'max_speed_mode': $('#max_speed_mode').val(config.value); break;
						case 'max_speed': $('#max_speed').val(config.value); break;
					}
				});
			}
			else
			{
				$('#led_color_mode').val('Automatic');
				$('#led_animation_mode').val('Automatic');
				$('#max_speed_mode').val('Automatic');
			}
			
			$('#area_color').val('rgb('+area.color_r+','+area.color_g+','+area.color_b+')'); $('#area_color').keyup();
			
			if ($('#led_color_mode').val() == 'Automatic') $('#led_color_group').hide(); else  $('#led_color_group').show();
			if ($('#led_animation_mode').val() == 'Automatic') $('#led_animation_group').hide(); else  $('#led_animation_group').show();
			if ($('#max_speed_mode').val() == 'Automatic') $('#max_speed_group').hide(); else  $('#max_speed_group').show();
			$('#install_by_step_edit_map_container_all .modalAreaOptions').modal('show');
		}
    });
	
	$('#install_by_step_edit_map_menu_dock .bDeleteDock').click(function(e) {
        e.preventDefault();
		HideMenus();
		i = GetDockIndexFromID(currentDockLongTouch.data('id_docking_station'));
		DeleteDock(i);
    });
	
	$('#install_by_step_edit_map_menu_dock .bConfigDock').click(function(e) {
        e.preventDefault();
		HideMenus();
		currentAction = 'editDock';
	
		currentDockIndex = GetDockIndexFromID(currentDockLongTouch.data('id_docking_station'));
		dock = docks[currentDockIndex];
		
		$('#dock_number').val(dock.num);
		$('#dock_name').val(dock.name);
		$('#dock_comment').val(dock.comment);
		
		$('.modalDockOptions .list_undock_procedure li').remove();
		
		$.each(dock.undock_path, function( indexConfig, undock_step ) {

			console.log(undock_step);
			indexDockElem++;
			
			if (undock_step.linear_distance != 0)
			{				
				distance = undock_step.linear_distance;
				direction = undock_step.linear_distance > 0 ? 'front':'back';
				
				$('.modalDockOptions .list_undock_procedure').append('' +
					'<li id="list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="move" data-distance="' + distance + '">'+
					'	<span>Move ' + ((direction == 'back')?'back':'front') + ' ' + ((direction == 'back')?distance*-1:distance) + 'm</span>'+
					'	<a href="#" class="bUndockProcedureDeleteElem btn btn-xs btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bUndockProcedureEditElem btn btn-xs btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
			else
			{	
				angle = undock_step.angular_distance * 180 / Math.PI;
				angle = Math.round(angle*100)/100;
				
				$('.modalDockOptions .list_undock_procedure').append('' +
					'<li id="list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="rotate" data-angle="'+angle+'">'+
					'	<span>Rotate '+angle+'°</span>'+
					'	<a href="#" class="bUndockProcedureDeleteElem btn btn-xs btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bUndockProcedureEditElem btn btn-xs btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
			
		});		
		
		
		$('#install_by_step_edit_map_container_all .modalDockOptions').modal('show');
    });
	
	$('#install_by_step_edit_map_menu_poi .bDeletePoi').click(function(e) {
        e.preventDefault();
		HideMenus();
		i = GetPoiIndexFromID(currentPoiLongTouch.data('id_poi'));
		DeletePoi(i);
    });
	
	$('#install_by_step_edit_map_menu_poi .bConfigPoi').click(function(e) {
        e.preventDefault();
		HideMenus();
		currentAction = 'editPoi';
	
		currentPoiIndex = GetPoiIndexFromID(currentPoiLongTouch.data('id_poi'));
		poi = pois[currentPoiIndex];
		
		$('#poi_name').val(poi.name);
		$('#poi_comment').val(poi.comment);
		
		$('.modalPoiOptions .list_undock_procedure_poi li').remove();
		
		$.each(poi.undock_path, function( indexConfig, undock_step ) {

			console.log(undock_step);
			indexPoiElem++;
			
			if (undock_step.linear_distance != 0)
			{				
				distance = undock_step.linear_distance;
				direction = undock_step.linear_distance > 0 ? 'front':'back';
				
				$('.modalPoiOptions .list_undock_procedure_poi').append('' +
					'<li id="list_undock_procedure_poi_elem_'+indexPoiElem+'" data-index_poi_procedure="'+indexPoiElem+'" data-action="move" data-distance="' + distance + '">'+
					'	<span>Move ' + ((direction == 'back')?'back':'front') + ' ' + ((direction == 'back')?distance*-1:distance) + 'm</span>'+
					'	<a href="#" class="bUndockProcedurePoiDeleteElem btn btn-xs btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bUndockProcedurePoiEditElem btn btn-xs btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
			else
			{	
				angle = undock_step.angular_distance * 180 / Math.PI;
				angle = Math.round(angle*100)/100;
				
				$('.modalPoiOptions .list_undock_procedure_poi').append('' +
					'<li id="list_undock_procedure_poi_elem_'+indexPoiElem+'" data-index_poi_procedure="'+indexPoiElem+'" data-action="rotate" data-angle="'+angle+'">'+
					'	<span>Rotate '+angle+'°</span>'+
					'	<a href="#" class="bUndockProcedurePoiDeleteElem btn btn-xs btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bUndockProcedurePoiEditElem btn btn-xs btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
			
		});		
		
		$('#install_by_step_edit_map_container_all .modalPoiOptions').modal('show');
		
    });
	
	$('#install_by_step_edit_map_svg').on('contextmenu', function (e) {
		
		if (currentAction == 'gomme' && currentStep=='trace')
		{
			currentStep = '';
			currentGommePoints.pop(); // Point du curseur
			TraceCurrentGomme(currentGommePoints);
			return false;
			
		}
		/*
		else if (currentAction == 'addForbiddenArea' && currentStep=='trace')
		{
			currentStep = '';
			currentForbiddenPoints.pop(); // Point du curseur
			TraceCurrentForbidden(currentForbiddenPoints);
			return false;
		}
		else if (currentAction == 'addArea' && currentStep=='trace')
		{
			currentStep = '';
			currentAreaPoints.pop(); // Point du curseur
			TraceCurrentArea(currentAreaPoints);
			return false;
		}
		*/
    });
	
	/**************************/
	/*        ZOOM            */
	/**************************/
	
	$('#install_by_step_edit_map_zone_zoom_click').mousedown(function(e) {
       e.preventDefault();
	   downOnZoomClick = true;
    });
	$('#install_by_step_edit_map_zone_zoom_click').mousemove(function(e) {
       e.preventDefault();
	   if (downOnZoomClick)
	   {
			w = $('#install_by_step_edit_map_zoom_carte').width();
			h = $('#install_by_step_edit_map_zoom_carte').height();
			
			wZoom = $('#install_by_step_edit_map_zone_zoom').width();
			hZoom = $('#install_by_step_edit_map_zone_zoom').height();
			
			x = e.offsetX - wZoom / 2;
			y = e.offsetY - hZoom / 2;
					
			zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
			
			largeur_img = ros_largeur / zoom
			
			x = - x / w * largeur_img;
			y = - y / w * largeur_img;
			
			window.panZoom.pan({'x':x, 'y':y});
	   }
    });
	
	$('#install_by_step_edit_map_zone_zoom_click').click(function(e) {
		e.preventDefault();
		
		w = $('#install_by_step_edit_map_zoom_carte').width();
		h = $('#install_by_step_edit_map_zoom_carte').height();
		
		wZoom = $('#install_by_step_edit_map_zone_zoom').width();
		hZoom = $('#install_by_step_edit_map_zone_zoom').height();
		
		x = e.offsetX - wZoom / 2;
		y = e.offsetY - hZoom / 2;
				
		zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
		
		largeur_img = ros_largeur / zoom
		
		x = - x / w * largeur_img;
		y = - y / w * largeur_img;
		
		window.panZoom.pan({'x':x, 'y':y});
	});
	
	$('#install_by_step_edit_map_zone_zoom_click').on('touchstart', function(e) {
       e.preventDefault();
	   downOnZoomClick = true;
	   
	    w = $('#install_by_step_edit_map_zoom_carte').width();
		h = $('#install_by_step_edit_map_zoom_carte').height();
		
		wZoom = $('#install_by_step_edit_map_zone_zoom').width();
		hZoom = $('#install_by_step_edit_map_zone_zoom').height();
		
		r = document.getElementById("install_by_step_edit_map_zoom_carte_container").getBoundingClientRect();
		
		x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - r.left;
		y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - r.top;
		
		x = x - wZoom / 2;
		y = y - hZoom / 2;
				
		zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
		
		largeur_img = ros_largeur / zoom
		
		x = - x / w * largeur_img;
		y = - y / w * largeur_img;
		
		window.panZoom.pan({'x':x, 'y':y});
	   
    });
	$('#install_by_step_edit_map_zone_zoom_click').on('touchend', function(e) {
       e.preventDefault();
	   downOnZoomClick = false;
    });
	$('#install_by_step_edit_map_zone_zoom_click').on('touchmove', function(e) {
       e.preventDefault();
	   if (downOnZoomClick)
	   {
		    w = $('#install_by_step_edit_map_zoom_carte').width();
			h = $('#install_by_step_edit_map_zoom_carte').height();
			
			wZoom = $('#install_by_step_edit_map_zone_zoom').width();
			hZoom = $('#install_by_step_edit_map_zone_zoom').height();
			
			r = document.getElementById("install_by_step_edit_map_zoom_carte_container").getBoundingClientRect();
		
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - r.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - r.top;
			
			x = x - wZoom / 2;
			y = y - hZoom / 2;
					
			zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
			
			largeur_img = ros_largeur / zoom
			
			x = - x / w * largeur_img;
			y = - y / w * largeur_img;
			
			window.panZoom.pan({'x':x, 'y':y});
	   }
    });
	
	/**************************/
	/*  Click on element      */
	/**************************/
	
	$(document).on('click', '#install_by_step_edit_map_svg .forbidden_elem', function(e) {
		e.preventDefault();
		
		if ((currentAction == 'addArea' || currentAction == 'addForbiddenArea') && currentStep == 'trace')
		{
		}
		else if (currentAction == 'gomme')
		{
		}
		else if (canChangeMenu)
		{
			RemoveClass('#install_by_step_edit_map_svg .active', 'active');
			RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'forbidden', 'id':$(this).data('id_area')});	
			HideCurrentMenuNotSelect();
			
			$('#boutonsForbidden').show();
            $('#boutonsStandard').hide();
			
			$('#boutonsForbidden #bForbiddenDelete').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			currentAction = 'editForbiddenArea';	
			currentStep = '';
			
			currentForbiddenIndex = GetForbiddenIndexFromID($(this).data('id_area'));
			forbidden = forbiddens[currentForbiddenIndex];
			saveCurrentForbidden = JSON.stringify(forbidden);
			
			AddClass('#install_by_step_edit_map_svg .forbidden_elem_'+forbidden.id_area, 'active');
		}
		else
			AvertCantChange();
	});
	
	$(document).on('click', '#install_by_step_edit_map_svg .area_elem', function(e) {
		e.preventDefault();
		
		if ((currentAction == 'addArea' || currentAction == 'addForbiddenArea') && currentStep == 'trace')
		{
		}
		else if (currentAction == 'gomme')
		{
		}
		else if (canChangeMenu)
		{
			RemoveClass('#install_by_step_edit_map_svg .active', 'active');
			RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'area', 'id':$(this).data('id_area')});	
			HideCurrentMenuNotSelect();
			
			$('#boutonsArea').show();
            $('#boutonsStandard').hide();
			
			$('#boutonsArea #bAreaDelete').show();
			$('#boutonsArea #bAreaOptions').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			currentAction = 'editArea';	
			currentStep = '';
			
			currentAreaIndex = GetAreaIndexFromID($(this).data('id_area'));
			area = areas[currentAreaIndex];
			saveCurrentArea = JSON.stringify(area);
			
			AddClass('#install_by_step_edit_map_svg .area_elem_'+area.id_area, 'active');
		}
		else
			AvertCantChange();
	});
	
	$(document).on('click', '#install_by_step_edit_map_svg .dock_elem', function(e) {
		e.preventDefault();
		
		if (currentAction == 'addDock')
		{
		}
		else if (currentAction == 'gomme')
		{
		}
		else if (canChangeMenu)
		{
			RemoveClass('#install_by_step_edit_map_svg .active', 'active');
			RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'dock', 'id':$(this).data('id_docking_station')});	
			HideCurrentMenuNotSelect();
			
			$('#boutonsDock').show();
            $('#boutonsStandard').hide();
			
			$('#boutonsDock a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			currentAction = 'editDock';	
			currentStep = '';
			
			currentDockIndex = GetDockIndexFromID($(this).data('id_docking_station'));
			dock = docks[currentDockIndex];
			saveCurrentDock = JSON.stringify(dock);
			
			AddClass('#install_by_step_edit_map_svg .dock_elem_'+dock.id_docking_station, 'active');
			//AddClass('#install_by_step_edit_map_svg .dock_elem_'+dock.id_docking_station, 'movable');	// Dock non movable
			
		}
		else
			AvertCantChange();
	});
	
	$(document).on('click', '#install_by_step_edit_map_svg .poi_elem', function(e) {
		e.preventDefault();
		
		if (currentAction == 'addPoi')
		{
		}
		else if (currentAction == 'gomme')
		{
		}
		else if (canChangeMenu)
		{
			RemoveClass('#install_by_step_edit_map_svg .active', 'active');
			RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
			RemoveClass('#install_by_step_edit_map_svg .poi_elem', 'movable');
						
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'poi', 'id':$(this).data('id_poi')});	
			HideCurrentMenuNotSelect();
			
			$('#boutonsPoi').show();
			
            $('#boutonsStandard').hide();
			
			$('#boutonsPoi a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			currentAction = 'editPoi';	
			currentStep = '';
			
			currentPoiIndex = GetPoiIndexFromID($(this).data('id_poi'));
			poi = pois[currentPoiIndex];
			saveCurrentPoi = JSON.stringify(poi);
			
			AddClass('#install_by_step_edit_map_svg .poi_elem_'+poi.id_poi, 'active');
			if (poi.id_fiducial < 1) // Movable que si il n'est pas lié à un reflecteur
				AddClass('#install_by_step_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		}
		else
			AvertCantChange();
	});
	
	/**************************/
	/*  Click on element      */
	/**************************/
		
	$('#install_by_step_edit_map_menu .bGomme').click(function(e) {
        e.preventDefault();
		HideMenus();
		if ($('#bGomme').hasClass('btn-primary'))
		{
			blockZoom = false;
			
			HideCurrentMenu();
			
			$('#bGomme').removeClass('btn-primary');
		
			currentAction = '';	
			currentStep = '';
			
			$('body').addClass('no_current');
			$('body').removeClass('gomme');
			
			//currentGommePoints = Array();
		
			SaveElementNeeded(true);
		}
		else
		{
			blockZoom = true;
			
			if (canChangeMenu)
			{
				HideCurrentMenu();
				
				$('#bGomme').addClass('btn-primary');
			
				currentAction = 'gomme';	
				currentStep = '';
				
				$('body').removeClass('no_current');
				$('body').addClass('gomme');
				
				//currentGommePoints = Array();
				
			}
			else
				AvertCantChange();
		}
    });
	
	$('#install_by_step_edit_map_menu .bAddForbiddenArea').click(function(e) {
        e.preventDefault();
		HideMenus();
		if (canChangeMenu)
		{
			//blockZoom = true;
			nextIdArea++;
			
			p = $('#install_by_step_edit_map_svg image').position();
			x = (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageX : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageX) - p.left;
			y = (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageY : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			tailleArea = 1*zoom;
			tailleArea = 1;
			
			currentForbiddenPoints = Array();
			currentForbiddenPoints.push({x:xRos - tailleArea, y:yRos - tailleArea});
			currentForbiddenPoints.push({x:xRos + tailleArea, y:yRos - tailleArea});
			currentForbiddenPoints.push({x:xRos + tailleArea, y:yRos + tailleArea});
			currentForbiddenPoints.push({x:xRos - tailleArea, y:yRos + tailleArea});
			
			f = {'id_area':nextIdArea, 'id_map':id_map, 'name':'', 'comment':'', 'is_forbidden':true, 'color_r':0, 'color_g':0, 'color_b':0, 'deleted':false, 'points':currentForbiddenPoints};
			AddHistorique({'action':'add_forbidden', 'data':f});
			
			forbiddens.push(f);
			TraceForbidden(forbiddens.length-1);
			
			RemoveClass('#install_by_step_edit_map_svg .active', 'active');
			RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'forbidden', 'id':nextIdArea});	
			HideCurrentMenuNotSelect();			
			
			$('#boutonsForbidden').show();
            $('#boutonsStandard').hide();
			
			$('#boutonsForbidden #bForbiddenDelete').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			currentAction = 'addForbiddenArea';
			currentStep = '';
			
			currentForbiddenIndex = GetForbiddenIndexFromID(nextIdArea);
			forbidden = forbiddens[currentForbiddenIndex];
			saveCurrentForbidden = JSON.stringify(forbidden);
			
			AddClass('#install_by_step_edit_map_svg .forbidden_elem_'+forbidden.id_area, 'active');
			
			SaveElementNeeded(true);
			
			/*
			$('#boutonsForbidden').show();
            $('#boutonsStandard').hide();
			
			$('#boutonsForbidden #bForbiddenDelete').hide();
			
			currentAction = 'addForbiddenArea';	
			currentStep = 'trace';
			
			$('body').removeClass('no_current');
			$('body').addClass('addForbidden');
			
			currentForbiddenPoints = Array();
			currentForbiddenPoints.push({x:0, y:0}); // Point du curseur
			*/
		}
		else
			AvertCantChange();
	});
	
	$('#bForbiddenDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this area?'))
		{
			DeleteForbidden(currentForbiddenIndex);
		}
    });
	
	
	$('#install_by_step_edit_map_menu .bAddArea').click(function(e) {
        e.preventDefault();
		HideMenus();
		if (canChangeMenu)
		{
			//blockZoom = true;
			nextIdArea++;
			
			p = $('#install_by_step_edit_map_svg image').position();
			x = (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageX : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageX) - p.left;
			y = (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageY : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			tailleArea = 1*zoom;
			tailleArea = 1;
			
			currentAreaPoints = Array();
			currentAreaPoints.push({x:xRos - tailleArea, y:yRos - tailleArea});
			currentAreaPoints.push({x:xRos + tailleArea, y:yRos - tailleArea});
			currentAreaPoints.push({x:xRos + tailleArea, y:yRos + tailleArea});
			currentAreaPoints.push({x:xRos - tailleArea, y:yRos + tailleArea});

			a = {'id_area':nextIdArea, 'id_map':id_map, 'name':'', 'comment':'', 'is_forbidden':false, 'color_r':87, 'color_g':159, 'color_b':177, 'deleted':false, 'points':currentAreaPoints, 'configs':Array()};
			AddHistorique({'action':'add_area', 'data':a});
			
			areas.push(a);
			TraceArea(areas.length-1);
			
			RemoveClass('#install_by_step_edit_map_svg .active', 'active');
			RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'area', 'id':nextIdArea});	
			HideCurrentMenuNotSelect();			
			
			$('#boutonsArea').show();
            $('#boutonsStandard').hide();
			
			$('#boutonsArea #bAreaDelete').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			currentAction = 'addArea';
			currentStep = '';
			
			currentAreaIndex = GetAreaIndexFromID(nextIdArea);
			area = areas[currentAreaIndex];
			saveCurrentArea = JSON.stringify(area);
			
			AddClass('#install_by_step_edit_map_svg .area_elem_'+area.id_area, 'active');
			
			SaveElementNeeded(true);
		}
		else
			AvertCantChange();
	});
	
	$('#bAreaDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this area?'))
		{
			DeleteArea(currentAreaIndex);
		}
    });
	
	$('.selectChangeAffGroup').change(function(e) {
        if ($(this).val() == 'Automatic')
			$('#' + $(this).attr('id').replace('mode', 'group')).hide();
		else
			$('#' + $(this).attr('id').replace('mode', 'group')).show();
    });
	
	$('#bAreaOptions').click(function(e) {
        area = areas[currentAreaIndex];
		
		$('#area_color_mode').val(rgbToHex(area.color_r, area.color_g, area.color_b));
		
		$.each(area.configs, function( indexConfig, config ) {
			switch(config.name)
			{
				case 'led_color_mode': $('#led_color_mode').val(config.value); break;
				case 'led_color': $('#led_color').val(config.value); $('#led_color').keyup(); break;
				case 'led_animation_mode': $('#led_animation_mode').val(config.value); break;
				case 'led_animation': $('#led_animation').val(config.value); break;
				case 'max_speed_mode': $('#max_speed_mode').val(config.value); break;
				case 'max_speed': $('#max_speed').val(config.value); break;
			}
		});
		
		if ($('#led_color_mode').val() == 'Automatic') $('#led_color_group').hide(); else  $('#led_color_group').show();
		if ($('#led_animation_mode').val() == 'Automatic') $('#led_animation_group').hide(); else  $('#led_animation_group').show();
		if ($('#max_speed_mode').val() == 'Automatic') $('#max_speed_group').hide(); else  $('#max_speed_group').show();
    });
	
	$('#bAreaSaveConfig').click(function(e) {
		area = areas[currentAreaIndex];
		saveCurrentArea = JSON.stringify(area);
			
		area.configs = Array();
		area.configs.push({'name':'led_color_mode' , 'value':$('#led_color_mode').val()});
		
		area.configs.push({'name':'led_color' , 'value':$('#led_color').val()});
		area.configs.push({'name':'led_animation_mode' , 'value':$('#led_animation_mode').val()});
		area.configs.push({'name':'led_animation' , 'value':$('#led_animation').val()});
		area.configs.push({'name':'max_speed_mode' , 'value':$('#max_speed_mode').val()});
		area.configs.push({'name':'max_speed' , 'value':$('#max_speed').val()});
		
		var c = $('#area_color').val().split("(")[1].split(")")[0];
		c = c.split(",");
		area.color_r = parseInt(c[0]);
		area.color_g = parseInt(c[1]);
		area.color_b = parseInt(c[2]);
		
		areas[currentAreaIndex] = area;
		
		if (currentAction == 'editArea')
			AddHistorique({'action':'edit_area', 'data':{'index':currentAreaIndex, 'old':saveCurrentArea, 'new':JSON.stringify(areas[currentAreaIndex])}});
		
		TraceArea(currentAreaIndex);
	});
		
	$('#install_by_step_edit_map_menu .bAddDock').click(function(e) {
        e.preventDefault();
		HideMenus();
		if (canChangeMenu)
		{
			$('#install_by_step_edit_map_container_all .modalAddDock').modal('show');
		}
		else
			AvertCantChange();
	});
	$('.modalAddDock .bScanAddDock').click(function(e) {
		$('.modalAddDock .bScanAddDock').addClass('disabled');
		
		wycaApi.GetMapFiducialsVisible(function(data) {
			
			$('.modalAddDock .bScanAddDock').removeClass('disabled');	
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				console.log(data);
				
				$('.modalAddDock .dock').hide();
				
				posRobot = $('.modalAddDock #modalAddDock_robot').offset();
				
				for (i=0; i< data.D.length; i++)
				{
					if (data.D[i].TY == 'Dock')
					{
						/*
						distance = Math.sqrt((data.D[i].P.X - lastRobotPose.X)*(data.D[i].P.X - lastRobotPose.X) + (data.D[i].P.Y - lastRobotPose.Y)*(data.D[i].P.Y - lastRobotPose.Y));
						x_from_robot = Math.cos(lastRobotPose.T) * distance;
						y_from_robot = Math.sin(lastRobotPose.T) * distance;
						*/
						
						new_point = RotatePoint (data.D[i].P, lastRobotPose, lastRobotPose.T - Math.PI/2);
						x_from_robot = new_point.X - lastRobotPose.X;
						y_from_robot = new_point.Y - lastRobotPose.Y;
						
						// 1px / cm
						
						$('.modalAddDock #modalAddDock_dock'+i).show();
						$('.modalAddDock #modalAddDock_dock'+i).css('left', posRobot.left + x_from_robot * 100); // lidar : y * -1
						$('.modalAddDock #modalAddDock_dock'+i).css('top', posRobot.top - y_from_robot * 100); // +20 position lidar, - 12.5 pour le centre
						//angle = (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
						
						angle = 0 - (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
						
						$('.modalAddDock #modalAddDock_dock'+i).css({'-webkit-transform' : 'rotate('+ angle +'deg)',
																	 '-moz-transform' : 'rotate('+ angle +'deg)',
																	 '-ms-transform' : 'rotate('+ angle +'deg)',
																	 'transform' : 'rotate('+ angle +'deg)'});
						
						
						$('.modalAddDock #modalAddDock_dock'+i).data('id_fiducial', data.D[i].ID);
						$('.modalAddDock #modalAddDock_dock'+i).data('x', data.D[i].P.X);
						$('.modalAddDock #modalAddDock_dock'+i).data('y', data.D[i].P.Y);
						$('.modalAddDock #modalAddDock_dock'+i).data('theta', data.D[i].P.T);
					}
				}
			}
			else
			{
				DisplayError(wycaApi.AnswerCodeToString(data.A) + "<br/>" + data.M);
			}
		});
    });
	
	$('.modalAddDock .dock').click(function(e) {
        e.preventDefault();
		
		nextIdDock++;
		
		distance_centre_robot_fiducial = 0.26;
		distance_approche_robot_fiducial = 0.76;
		
		final_pose_x = $(this).data('x') + Math.cos($(this).data('theta')) * distance_centre_robot_fiducial;
		final_pose_y = $(this).data('y') + Math.sin($(this).data('theta')) * distance_centre_robot_fiducial;
		final_pose_t = $(this).data('theta') + Math.PI;
				
		approch_pose_x = $(this).data('x') + Math.cos($(this).data('theta')) * distance_approche_robot_fiducial;
		approch_pose_y = $(this).data('y') + Math.sin($(this).data('theta')) * distance_approche_robot_fiducial;
		approch_pose_t = $(this).data('theta') + Math.PI;
		
		num = GetMaxNumDock()+1;
		d = {'id_docking_station':nextIdDock, 'id_map':id_map, 'id_fiducial':$(this).data('id_fiducial'), 'final_pose_x':final_pose_x, 'final_pose_y':final_pose_y, 'final_pose_t':final_pose_t, 'approch_pose_x':approch_pose_x, 'approch_pose_y':approch_pose_y, 'approch_pose_t':approch_pose_t, 'num':parseInt(num), 'fiducial_pose_x':$(this).data('x'), 'fiducial_pose_y':$(this).data('y'), 'fiducial_pose_t':$(this).data('theta'), 'name':'Dock '+num, 'comment':'', 'advanced':true, 'undock_path':[{'linear_distance':-0.3, 'angular_distance':0}]};
		AddHistorique({'action':'add_dock', 'data':d});
        docks.push(d);
		TraceDock(docks.length-1);
		
		$('#install_by_step_edit_map_container_all .modalAddDock').modal('hide');
		
		currentDockIndex = docks.length-1;
		dock = docks[currentDockIndex];
		
		$('#dock_number').val(dock.num);
		
		$('.modalDockOptions .list_undock_procedure li').remove();
		
		indexDockElem++;
		
		$('.modalDockOptions .list_undock_procedure').append('' +
			'<li id="list_undock_procedure_elem_'+indexDockElem+'" data-index_dock="'+indexDockElem+'" data-action="move" data-distance="-0.3">'+
			'	<span>Move back 0.3m</span>'+
			'	<a href="#" class="bUndockProcedureDeleteElem btn btn-xs btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
			'	<a href="#" class="bUndockProcedureEditElem btn btn-xs btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
			'</li>'
			);
		
		$('#install_by_step_edit_map_container_all .modalDockOptions').modal('show');
    });
	
	$('#bDockSaveConfig').click(function(e) {
		dock = docks[currentDockIndex];
		saveCurrentDock = JSON.stringify(dock);
				
		dock.name = $('#dock_name').val();
		dock.num = parseInt($('#dock_number').val());
		dock.comment = $('#dock_comment').val();
			
		dock.undock_path = Array();
		
		$('.modalDockOptions .list_undock_procedure li').each(function(index, element) {
			if ($(this).data('action') == 'rotate')
			{
				angle_rad = parseFloat($(this).data('angle')) * Math.PI/180;
				dock.undock_path.push({'linear_distance':0, 'angular_distance':angle_rad});
			}
			else
				dock.undock_path.push({'linear_distance':$(this).data('distance'), 'angular_distance':0});
        });
		
		docks[currentDockIndex] = dock;
				
		if (currentAction == 'editDock')
			AddHistorique({'action':'edit_dock', 'data':{'index':currentDockIndex, 'old':saveCurrentDock, 'new':JSON.stringify(docks[currentDockIndex])}});
		
		TraceDock(currentDockIndex);
	});
	
	$('.modalDockOptions .bUndockProcedureAddElem').click(function(e) {
        e.preventDefault();
		
		$('#up_elem_action_move').prop('checked', false);
		$('#up_elem_action_rotate').prop('checked', false);
		
		$('#up_elem_direction_back').prop('checked', true);
		$('.up_elem_action_move').hide();
		$('.up_elem_action_rotate').hide();
		
		$('#install_by_step_edit_map_container_all .modalDockElemOptions').data('index_dock_procedure', -1);
		
		$('#install_by_step_edit_map_container_all .modalDockElemOptions').modal('show');
    });
	
	$('.modalDockElemOptions input:radio[name="up_elem_action"]').change(function () {
		action = $("input[name='up_elem_action']:checked").val()
		$('.up_elem_action_move').hide();
		$('.up_elem_action_rotate').hide();
		if (action == 'move') {
			
			$('.up_elem_action_move').show();
		}
		else if (action == 'rotate') {
			$('.up_elem_action_rotate').show();
		}
	});
		
	$('.modalDockElemOptions .bDockElemSave').click(function(e) {
		
		index_dock_procedure = $('#install_by_step_edit_map_container_all .modalDockElemOptions').data('index_dock_procedure');
		if (index_dock_procedure == -1)
		{
			indexDockElem++;
			
			action = $("input[name='up_elem_action']:checked").val();
			
			if (action == 'move') {
				
				distance = parseFloat($("#up_elem_move_distance").val());
				direction = $("input[name='up_elem_direction']:checked").val();
							
				$('.modalDockOptions .list_undock_procedure').append('' +
					'<li id="list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="move" data-distance="' + ((direction == 'back')?distance*-1:distance) + '">'+
					'	<span>Move ' + ((direction == 'back')?'back':'front') + ' ' + distance + 'm</span>'+
					'	<a href="#" class="bUndockProcedureDeleteElem btn btn-xs btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bUndockProcedureEditElem btn btn-xs btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
			else if (action == 'rotate') {
				
				angle = $("#up_elem_rotate_angle").val();
				
				$('.modalDockOptions .list_undock_procedure').append('' +
					'<li id="list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="rotate" data-angle="'+angle+'">'+
					'	<span>Rotate '+angle+'°</span>'+
					'	<a href="#" class="bUndockProcedureDeleteElem btn btn-xs btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bUndockProcedureEditElem btn btn-xs btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
		}
		else
		{
			action = $("input[name='up_elem_action']:checked").val();
			if (action == 'move') {
				
				distance = parseFloat($("#up_elem_move_distance").val());
				direction = $("input[name='up_elem_direction']:checked").val();
				
				li = $('#list_undock_procedure_elem_'+ index_dock_procedure);
				span = $('#list_undock_procedure_elem_'+ index_dock_procedure + ' span');
				
				li.data('action', 'move');
				li.data('distance', ((direction == 'back')?distance*-1:distance));
				span.html('Move ' + ((direction == 'back')?'back':'front') + ' ' + distance + 'm');
			}
			else if (action == 'rotate') {
				
				angle = $("#up_elem_rotate_angle").val();
				
				li = $('#list_undock_procedure_elem_'+ index_dock_procedure);
				span = $('#list_undock_procedure_elem_'+ index_dock_procedure + ' span');
				
				li.data('action', 'rotate');
				li.data('angle', angle);
				span.html('Rotate '+angle+'°');
			}
		}
    });
	
	$(document).on('click', '.modalDockOptions .bUndockProcedureDeleteElem', function(e) {
		e.preventDefault();
		
		$(this).closest('li').remove();
	});
	
	$(document).on('click', '.modalDockOptions .bUndockProcedureEditElem', function(e) {
		e.preventDefault();
		
		$('#up_elem_action_move').prop('checked', false);
		$('#up_elem_action_rotate').prop('checked', false);
		
		$('.up_elem_action_move').hide();
		$('.up_elem_action_rotate').hide();
		
		li = $(this).closest('li');
		if (li.data('action') == 'rotate')
		{
			$('.up_elem_action_rotate').show();
			$('#up_elem_action_rotate').prop('checked', true);
			$("#up_elem_rotate_angle").val(li.data('angle'));
		}
		else
		{
			$('.up_elem_action_move').show();
			$('#up_elem_action_move').prop('checked', true);
			distance = li.data('distance');
			if (distance < 0)
				$('#up_elem_direction_back').prop('checked', true);
			else
				$('#up_elem_direction_front').prop('checked', true);
			
			$("#up_elem_move_distance").val(Math.abs(distance));
		}
		
		
		$('#install_by_step_edit_map_container_all .modalDockElemOptions').data('index_dock_procedure', li.data('index_dock_procedure'));
		
		$('#install_by_step_edit_map_container_all .modalDockElemOptions').modal('show');
		
	});
	
	$('#install_by_step_edit_map_menu .bAddPOI').click(function(e) {
        e.preventDefault();
		HideMenus();
		if (canChangeMenu)
		{
			$('.texts_add_poi').hide();
			$('.text_prepare_approch').show();
			currentStepAddPoi = 'set_approch';
			
			$('#install_by_step_edit_map_container_all .modalAddPoi').modal('show');
		}
		else
			AvertCantChange();
	});
	$('.modalAddPoi .bScanAddPoi').click(function(e) {
		$('.modalAddPoi .bScanAddPoi').addClass('disabled');
		
		wycaApi.GetMapFiducialsVisible(function(data) {
			
			$('.modalAddPoi .bScanAddPoi').removeClass('disabled');	
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				console.log(data);
				
				$('.modalAddPoi .poi').hide();
				
				posRobot = $('.modalAddPoi #modalAddPoi_robot').offset();
				
				if (data.D.length > 0)
				{
					$('.texts_add_poi').hide();
					if (currentStepAddPoi != 'set_final')
						$('.text_set_approch').show();
					else
						$('.text_set_final').show();
				}
				
				for (i=0; i< data.D.length; i++)
				{
					if (data.D[i].TY != 'Dock')
					{
						new_point = RotatePoint (data.D[i].P, lastRobotPose, lastRobotPose.T - Math.PI/2);
						x_from_robot = new_point.X - lastRobotPose.X;
						y_from_robot = new_point.Y - lastRobotPose.Y;
						
						// 1px / cm
						
						$('.modalAddPoi #modalAddPoi_poi'+i).show();
						$('.modalAddPoi #modalAddPoi_poi'+i).css('left', posRobot.left + x_from_robot * 100); // lidar : y * -1
						$('.modalAddPoi #modalAddPoi_poi'+i).css('top', posRobot.top - y_from_robot * 100); // +20 position lidar, - 12.5 pour le centre
						//angle = (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
						
						angle = 0 - (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
						
						$('.modalAddPoi #modalAddPoi_poi'+i).css({'-webkit-transform' : 'rotate('+ angle +'deg)',
																 '-moz-transform' : 'rotate('+ angle +'deg)',
																 '-ms-transform' : 'rotate('+ angle +'deg)',
																 'transform' : 'rotate('+ angle +'deg)'});
						
						
						$('.modalAddPoi #modalAddPoi_poi'+i).data('id_fiducial', data.D[i].ID);
						$('.modalAddPoi #modalAddPoi_poi'+i).data('x', data.D[i].P.X);
						$('.modalAddPoi #modalAddPoi_poi'+i).data('y', data.D[i].P.Y);
						$('.modalAddPoi #modalAddPoi_poi'+i).data('theta', data.D[i].P.T);
					}
				}
			}
			else
			{
				DisplayError(wycaApi.AnswerCodeToString(data.A) + "<br/>" + data.M);
			}
		});
    });
	
	$('.modalAddPoi .poi').click(function(e) {
        e.preventDefault();
		
		if (currentStepAddPoi == 'set_approch')
		{
			nextIdPoi++;
			
			poi_temp_add = {'id_poi':nextIdPoi, 'id_map':id_map, 'id_fiducial':$(this).data('id_fiducial'), 'fiducial_pose_x':$(this).data('x'), 'fiducial_pose_y':$(this).data('y'), 'fiducial_pose_t':$(this).data('theta'), 'final_pose_x':lastRobotPose.X, 'final_pose_y':lastRobotPose.Y, 'final_pose_t':lastRobotPose.T, 'approch_pose_x':lastRobotPose.X, 'approch_pose_y':lastRobotPose.Y, 'approch_pose_t':lastRobotPose.T, 'name':'POI', 'comment':'', 'icon':'', 'active':true};
			
			$('.modalAddPoi .poi').hide();
			
 			currentStepAddPoi = 'set_final';
			$('.texts_add_poi').hide();
			$('.text_prepare_final').show();
		}
		else
		{
			poi_temp_add.final_pose_x = lastRobotPose.X;
			poi_temp_add.final_pose_y = lastRobotPose.Y;
			poi_temp_add.final_pose_t = lastRobotPose.T;
			
			AddHistorique({'action':'add_poi', 'data':poi_temp_add});
			pois.push(poi_temp_add);
			TracePoi(pois.length-1);
					
			$('#install_by_step_edit_map_container_all .modalAddPoi').modal('hide');
			
			currentPoiIndex = pois.length-1;
			poi = pois[currentPoiIndex];
			
			$('.modalPoiOptions .list_undock_procedure_poi li').remove();
			
			indexPoiElem++;
			
			$('.modalPoiOptions .list_undock_procedure_poi').append('' +
				'<li id="list_undock_procedure_poi_elem_'+indexPoiElem+'" data-index_poi="'+indexPoiElem+'" data-action="move" data-distance="-0.3">'+
				'	<span>Move back 0.3m</span>'+
				'	<a href="#" class="bUndockProcedurePoiDeleteElem btn btn-xs btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
				'	<a href="#" class="bUndockProcedurePoiEditElem btn btn-xs btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
				'</li>'
				);
			
			$('#install_by_step_edit_map_container_all .modalPoiOptions').modal('show');
		}
    });
	
	$('#bPoiSaveConfig').click(function(e) {
		poi = pois[currentPoiIndex];
		saveCurrentPoi = JSON.stringify(poi);
				
		poi.name = $('#poi_name').val();
		poi.comment = $('#poi_comment').val();
			
		poi.undock_path = Array();
		
		$('.modalPoiOptions .list_undock_procedure_poi li').each(function(index, element) {
			if ($(this).data('action') == 'rotate')
			{
				angle_rad = parseFloat($(this).data('angle')) * Math.PI/180;
				poi.undock_path.push({'linear_distance':0, 'angular_distance':angle_rad});
			}
			else
				poi.undock_path.push({'linear_distance':$(this).data('distance'), 'angular_distance':0});
        });
		
		pois[currentPoiIndex] = poi;
				
		if (currentAction == 'editPoi')
			AddHistorique({'action':'edit_poi', 'data':{'index':currentPoiIndex, 'old':saveCurrentPoi, 'new':JSON.stringify(pois[currentPoiIndex])}});
		
		TracePoi(currentPoiIndex);
	});
	
	$('.modalPoiOptions .bUndockProcedurePoiAddElem').click(function(e) {
        e.preventDefault();
		
		$('#up_poi_elem_action_move').prop('checked', false);
		$('#up_poi_elem_action_rotate').prop('checked', false);
		
		$('#up_poi_elem_direction_back').prop('checked', true);
		$('.up_poi_elem_action_move').hide();
		$('.up_poi_elem_action_rotate').hide();
		
		$('#install_by_step_edit_map_container_all .modalPoiElemOptions').data('index_poi_procedure', -1);
		
		$('#install_by_step_edit_map_container_all .modalPoiElemOptions').modal('show');
    });
	
	$('.modalPoiElemOptions input:radio[name="up_poi_elem_action"]').change(function () {
		action = $("input[name='up_poi_elem_action']:checked").val()
		$('.up_poi_elem_action_move').hide();
		$('.up_poi_elem_action_rotate').hide();
		if (action == 'move') {
			$('.up_poi_elem_action_move').show();
		}
		else if (action == 'rotate') {
			$('.up_poi_elem_action_rotate').show();
		}
	});
		
	$('.modalPoiElemOptions .bPoiElemSave').click(function(e) {
		
		index_poi_procedure = $('#install_by_step_edit_map_container_all .modalPoiElemOptions').data('index_poi_procedure');
		if (index_poi_procedure == -1)
		{
			indexPoiElem++;
			
			action = $("input[name='up_poi_elem_action']:checked").val();
			
			if (action == 'move') {
				
				distance = parseFloat($("#up_poi_elem_move_distance").val());
				direction = $("input[name='up_poi_elem_direction']:checked").val();
							
				$('.modalPoiOptions .list_undock_procedure_poi').append('' +
					'<li id="list_undock_procedure_poi_elem_'+indexPoiElem+'" data-index_poi_procedure="'+indexPoiElem+'" data-action="move" data-distance="' + ((direction == 'back')?distance*-1:distance) + '">'+
					'	<span>Move ' + ((direction == 'back')?'back':'front') + ' ' + distance + 'm</span>'+
					'	<a href="#" class="bUndockProcedurePoiDeleteElem btn btn-xs btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bUndockProcedurePoiEditElem btn btn-xs btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
			else if (action == 'rotate') {
				
				angle = $("#up_poi_elem_rotate_angle").val();
				
				$('.modalPoiOptions .list_undock_procedure_poi').append('' +
					'<li id="list_undock_procedure_poi_elem_'+indexPoiElem+'" data-index_poi_procedure="'+indexPoiElem+'" data-action="rotate" data-angle="'+angle+'">'+
					'	<span>Rotate '+angle+'°</span>'+
					'	<a href="#" class="bUndockProcedurePoiDeleteElem btn btn-xs btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bUndockProcedurePoiEditElem btn btn-xs btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
		}
		else
		{
			action = $("input[name='up_poi_elem_action']:checked").val();
			if (action == 'move') {
				
				distance = parseFloat($("#up_poi_elem_move_distance").val());
				direction = $("input[name='up_poi_elem_direction']:checked").val();
				
				li = $('#list_undock_procedure_poi_elem_'+ index_poi_procedure);
				span = $('#list_undock_procedure_poi_elem_'+ index_poi_procedure + ' span');
				
				li.data('action', 'move');
				li.data('distance', ((direction == 'back')?distance*-1:distance));
				span.html('Move ' + ((direction == 'back')?'back':'front') + ' ' + distance + 'm');
			}
			else if (action == 'rotate') {
				
				angle = $("#up_poi_elem_rotate_angle").val();
				
				li = $('#list_undock_procedure_poi_elem_'+ index_poi_procedure);
				span = $('#list_undock_procedure_poi_elem_'+ index_poi_procedure + ' span');
				
				li.data('action', 'rotate');
				li.data('angle', angle);
				span.html('Rotate '+angle+'°');
			}
		}
    });
	
	$(document).on('click', '.modalPoiOptions .bUndockProcedurePoiDeleteElem', function(e) {
		e.preventDefault();
		
		$(this).closest('li').remove();
	});
	
	$(document).on('click', '.modalPoiOptions .bUndockProcedurePoiEditElem', function(e) {
		e.preventDefault();
		
		$('#up_poi_elem_action_move').prop('checked', false);
		$('#up_poi_elem_action_rotate').prop('checked', false);
		
		$('.up_poi_elem_action_move').hide();
		$('.up_poi_elem_action_rotate').hide();
		
		li = $(this).closest('li');
		if (li.data('action') == 'rotate')
		{
			$('.up_poi_elem_action_rotate').show();
			$('#up_poi_elem_action_rotate').prop('checked', true);
			$("#up_poi_elem_rotate_angle").val(li.data('angle'));
		}
		else
		{
			$('.up_poi_elem_action_move').show();
			$('#up_poi_elem_action_move').prop('checked', true);
			distance = li.data('distance');
			if (distance < 0)
				$('#up_poi_elem_direction_back').prop('checked', true);
			else
				$('#up_poi_elem_direction_front').prop('checked', true);
			
			$("#up_poi_elem_move_distance").val(Math.abs(distance));
		}
		
		
		$('#install_by_step_edit_map_container_all .modalPoiElemOptions').data('index_poi_procedure', li.data('index_poi_procedure'));
		
		$('#install_by_step_edit_map_container_all .modalPoiElemOptions').modal('show');
		
	});
	
	
	$('#bDockCreateFromMap').click(function(e) {
        if (canChangeMenu)
		{
			blockZoom = true;
			
			$('#boutonsDock').show();
            $('#boutonsStandard').hide();
			
			$('#boutonsDock #bDockSave').hide();
			$('#boutonsDock #bDockDelete').hide();
			$('#boutonsDock #bDockDirection').hide();
			
			currentAction = 'addDock';	
			currentStep = 'setPose';
			
			$('body').removeClass('no_current');
			$('body').addClass('addDock');
			
			$('#message_aide').html(textClickOnMapPose);
			$('#message_aide').show();
		}
		else
			AvertCantChange();
    });
	$('#bDockDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this docking station?'))
		{
			DeleteDock(currentDockIndex);
		}
    });
	$('#bDockDirection').click(function(e) {
        e.preventDefault();
		
		if ($('#boutonsRotate').is(':visible'))
		{
			$('#boutonsRotate').hide();
		}
		else
		{
			dock = docks[currentDockIndex];
			
			zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();		
			p = $('#install_by_step_edit_map_svg image').position();
			
			
			x = dock.approch_pose_x * 100 / 5;
			y = dock.approch_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#boutonsRotate').css('left', x - $('#boutonsRotate').width()/2);
			$('#boutonsRotate').css('top', y - 60);
			$('#boutonsRotate').show();
		}
	});
	
	$('#bPoiCreateFromPose').click(function(e) {
		nextIdPoi++;
		p = {'id_poi':nextIdPoi, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':lastRobotPose.x, 'final_pose_y':lastRobotPose.y, 'final_pose_t':lastRobotPose.theta, 'approch_pose_x':lastRobotPose.x, 'approch_pose_y':lastRobotPose.y, 'approch_pose_t':lastRobotPose.theta, 'fiducial_pose_x':0, 'fiducial_pose_y':0, 'fiducial_pose_t':0, 'name':'POI', 'comment':'', 'icon':'', 'active':true};
		AddHistorique({'action':'add_poi', 'data':p});
        pois.push(p);
		TracePoi(pois.length-1);
		
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
		RemoveClass('#install_by_step_edit_map_svg .poi_elem', 'movable');
					
		currentSelectedItem = Array();
		currentSelectedItem.push({'type':'poi', 'id':$(this).data('id_poi')});	
		HideCurrentMenuNotSelect();
		
		$('#boutonsPoi').show();
		
		$('#boutonsStandard').hide();
		
		$('#boutonsPoi a').show();
		
		$('body').removeClass('no_current select');
		$('.select').css("strokeWidth", minStokeWidth);
		
		currentAction = 'editPoi';	
		currentStep = '';
		
		currentPoiIndex = GetPoiIndexFromID(nextIdPoi);
		poi = pois[currentPoiIndex];
		saveCurrentPoi = JSON.stringify(poi);
		
		AddClass('#install_by_step_edit_map_svg .poi_elem_'+nextIdPoi, 'active');
		AddClass('#install_by_step_edit_map_svg .poi_elem_'+nextIdPoi, 'movable');
		
		$('#bPoiEditName').click();
        
    });
	$('#bPoiCreateFromMap').click(function(e) {
        if (canChangeMenu)
		{
			blockZoom = true;
			
			$('#boutonsPoi').show();
            $('#boutonsStandard').hide();
			
			$('#boutonsPoi #bPoiSave').hide();
			$('#boutonsPoi #bPoiDelete').hide();
			$('#boutonsPoi #bPoiDirection').hide();
			$('#boutonsPoi #bPoiEditName').hide();
			
			currentAction = 'addPoi';	
			currentStep = 'setPose';
			
			$('body').removeClass('no_current');
			$('body').addClass('addPoi');
			
			$('#message_aide').html(textClickOnMapPose);
			$('#message_aide').show();
		}
		else
			AvertCantChange();
    });
	
	
	$('#bPoiEditSaveConfig').click(function(e) {
		if (currentAction == 'addPoi')
		{
			SaveElementNeeded(false);
			
			nextIdPoi++;
			p = {'id_poi':nextIdPoi, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':currentPoiPose.final_pose_x, 'final_pose_y':currentPoiPose.final_pose_y, 'final_pose_t':currentPoiPose.final_pose_t, 'approch_pose_x':currentPoiPose.approch_pose_x, 'approch_pose_y':currentPoiPose.approch_pose_y, 'approch_pose_t':currentPoiPose.approch_pose_t, 'fiducial_pose_x':currentPoiPose.fiducial_pose_x, 'fiducial_pose_y':currentPoiPose.fiducial_pose_y, 'fiducial_pose_t':currentPoiPose.fiducial_pose_t, 'name':$('#poi_name').val(), 'comment':'', 'icon':'', 'active':true};
			AddHistorique({'action':'add_poi', 'data':p});
			
			pois.push(p);
			TracePoi(pois.length-1);
			
			$('#install_by_step_edit_map_svg .poi_elem_current').remove();
			
			RemoveClass('#install_by_step_edit_map_svg .active', 'active');
			
			currentAction = '';
			currentStep = '';
			
			$('#boutonsRotate').hide();
			
			$('#boutonsPoi').hide();
			$('#boutonsStandard').show();
			$('#message_aide').hide();
			blockZoom = false;
			
			$('body').addClass('no_current');
			
			SetModeSelect();
			
			
		}
		else
		{
			poi = pois[currentPoiIndex];
			poi.name = $('#poi_name').val();
			if (poi.name == '') poi.name = 'POI';
		}
		
	});
	
	$('#bPoiDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this POI?'))
		{
			DeletePoi(currentPoiIndex);
		}
    });
	$('#bPoiEditName').click(function(e) {
   		poi = pois[currentPoiIndex];
		$('#poi_name').val(poi.name);
	});
	$('#bPoiDirection').click(function(e) {
        e.preventDefault();
		
		if ($('#boutonsRotate').is(':visible'))
		{
			$('#boutonsRotate').hide();
		}
		else
		{
			poi = pois[currentPoiIndex];
			
			zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();		
			p = $('#install_by_step_edit_map_svg image').position();
			
			x = poi.approch_pose_x * 100 / 5;
			y = poi.approch_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#boutonsRotate').css('left', x - $('#boutonsRotate').width()/2);
			$('#boutonsRotate').css('top', y - 60);
			$('#boutonsRotate').show();
		}
	});
	
	window.oncontextmenu = function(event) {
		 event.preventDefault();
		 event.stopPropagation();
		 return false;
	};
	
	$(document).on('touchstart', '#bRotateRight', function(e) {
		SaveElementNeeded(true);
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
		timerRotate = setInterval(function() { 
			if (currentAction == 'addPoi')
			{
				currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) + Math.PI / 90;
				
				TraceCurrentPoi(currentPoiPose);
			}
			else if (currentAction == 'addDock')
			{
				currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) + Math.PI / 90;
				
				TraceCurrentDock(currentDockPose);
			}
			else if (currentAction == 'editPoi')
			{
				poi = pois[currentPoiIndex];
				poi.approch_pose_t = parseFloat(poi.approch_pose_t) + Math.PI / 90;
				TracePoi(currentPoiIndex);			
			}
			else if (currentAction == 'editDock')
			{
				dock = docks[currentDockIndex];
				dock.approch_pose_t = parseFloat(dock.approch_pose_t) + Math.PI / 90;
				TraceDock(currentDockIndex);		
			}
		}, 100);
    });
	$(document).on('touchend', '#bRotateRight', function(e) {
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
    });
	$('#bRotateRight').click(function(e) {
		SaveElementNeeded(true);
		if (currentAction == 'addPoi')
		{
			currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) + Math.PI / 90;
			
			TraceCurrentPoi(currentPoiPose);
		}
		else if (currentAction == 'addDock')
		{
			currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) + Math.PI / 90;
			
			TraceCurrentDock(currentDockPose);
		}
		else if (currentAction == 'editPoi')
		{
			poi = pois[currentPoiIndex];
			poi.approch_pose_t = parseFloat(poi.approch_pose_t) + Math.PI / 90;
			TracePoi(currentPoiIndex);			
		}
		else if (currentAction == 'editDock')
		{
			dock = docks[currentDockIndex];
			dock.approch_pose_t = parseFloat(dock.approch_pose_t) + Math.PI / 90;
			TraceDock(currentDockIndex);
		}
    });
	$(document).on('touchstart', '#bRotateLeft', function(e) {
		SaveElementNeeded(true);
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
		timerRotate = setInterval(function() { 
			if (currentAction == 'addPoi')
			{
				currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) - Math.PI / 90;
				
				TraceCurrentPoi(currentPoiPose);
			}
			else if (currentAction == 'addDock')
			{
				currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) - Math.PI / 90;
				
				TraceCurrentDock(currentDockPose);
			}
			else if (currentAction == 'editPoi')
			{
				poi = pois[currentPoiIndex];
				poi.approch_pose_t = parseFloat(poi.approch_pose_t) - Math.PI / 90;
				TracePoi(currentPoiIndex);			
			}
			else if (currentAction == 'editDock')
			{
				dock = docks[currentDockIndex];
				dock.approch_pose_t = parseFloat(dock.approch_pose_t) - Math.PI / 90;
				TraceDock(currentDockIndex);
			}
		}, 100);
    });
	$(document).on('touchend', '#bRotateLeft', function(e) {
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
    });
	$('#bRotateLeft').click(function(e) {
		SaveElementNeeded(true);
        if (currentAction == 'addPoi')
		{
			currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) - Math.PI / 90;
			
			TraceCurrentPoi(currentPoiPose);
		}
		else if (currentAction == 'addDock')
		{
			currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) - Math.PI / 90;
			
			TraceCurrentDock(currentDockPose);
		}
		else if (currentAction == 'editPoi')
		{
			poi = pois[currentPoiIndex];
			poi.approch_pose_t = parseFloat(poi.approch_pose_t) - Math.PI / 90;
			TracePoi(currentPoiIndex);			
		}
		else if (currentAction == 'editDock')
		{
			dock = docks[currentDockIndex];
			dock.approch_pose_t = parseFloat(dock.approch_pose_t) - Math.PI / 90;
			TraceDock(currentDockIndex);
		}        
    });
		
	InitTaille();
    
    var offsetMap;
    
    AppliquerZoom();
	
	SetModeSelect();
	
	$('#install_by_step_edit_map_svg').on('touchstart', function(e) {
		touchStarted = true;
		
		zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
		
		if (currentAction == 'gomme' && currentStep=='')
		{
			currentStep='trace';
			if (gommes.length == 0 || gommes[gommes.length-1].length > 0)
			{
				gommes[gommes.length] = Array();
				//gommes[gommes.length-1].push({x:0, y:0}); // Point du curseur
				
				p = $('#install_by_step_edit_map_svg image').position();
				x = (e.originalEvent.targetTouches[0] ? e.originalEvent.targetTouches[0].pageX : e.originalEvent.changedTouches[e.changedTouches.length-1].pageX) - p.left;
				y = (e.originalEvent.targetTouches[0] ? e.originalEvent.targetTouches[0].pageY : e.originalEvent.changedTouches[e.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
								
				gommes[gommes.length-1].push({x:xRos, y:yRos});
				gommes[gommes.length-1].push({x:xRos+0.01, y:yRos+0.01}); // Point du curseur
				TraceCurrentGomme(gommes[gommes.length-1], gommes.length-1);
				
				$('#bEndGomme').show();
			}
		}
		else if (currentAction == 'addDock' && currentStep=='setPose')
		{
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approach_pose_x = xRos;
			currentDockPose.approach_pose_y = yRos;
			currentDockPose.approach_pose_t = 0;
			
			TraceCurrentDock(currentDockPose);
		}
		/*
		else if (currentAction == 'addDock' && currentStep=='setDir')
		{
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approch_pose_t = GetAngleRadian(currentDockPose.approch_pose_x, currentDockPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			TraceCurrentDock(currentDockPose);
		}
		*/
		else if (currentAction == 'addPoi' && currentStep=='setPose')
		{
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approch_pose_x = xRos;
			currentPoiPose.approch_pose_y = yRos;
			currentPoiPose.approch_pose_t = 0;
			
			TraceCurrentPoi(currentPoiPose);
		}
		/*
		else if (currentAction == 'addDock' && currentStep=='setDir')
		{
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approch_pose_t = GetAngleRadian(currentPoiPose.approch_pose_x, currentPoiPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			TraceCurrentPoi(currentPoiPose);
		}
		*/
		/*
		else if (currentAction == 'addForbiddenArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#mapBox').height() - e.offsetY;
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentForbiddenPoints.pop(); // Point du curseur
			currentForbiddenPoints.push({x:xRos, y:yRos});
			//currentForbiddenPoints.push({x:xRos, y:yRos}); // Point du curseur
			TraceCurrentForbidden(currentForbiddenPoints);
		}
		else if (currentAction == 'addArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#mapBox').height() - e.offsetY;
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
		
			currentAreaPoints.pop(); // Point du curseur
			currentAreaPoints.push({x:xRos, y:yRos});
			//currentAreaPoints.push({x:xRos, y:yRos}); // Point du curseur
			TraceCurrentArea(currentAreaPoints);
		}
		*/
	});
	
	$('#install_by_step_edit_map_svg').on('touchmove', function(e) {
		
		if ($('#boutonsRotate').is(':visible'))
		{
			 if (currentAction == 'addDock')
			 {
				zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();		
				p = $('#install_by_step_edit_map_svg image').position();
				
				
				x = currentDockPose.approach_pose_x * 100 / 5;
				y = currentDockPose.approach_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#boutonsRotate').css('left', x - $('#boutonsRotate').width()/2);
				$('#boutonsRotate').css('top', y - 60);
				$('#boutonsRotate').show();
			 }
			 else if (currentAction == 'addPoi')
			 {
				zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();		
				p = $('#install_by_step_edit_map_svg image').position();
				
				
				x = currentPoiPose.approach_pose_x * 100 / 5;
				y = currentPoiPose.approach_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#boutonsRotate').css('left', x - $('#boutonsRotate').width()/2);
				$('#boutonsRotate').css('top', y - 60);
				$('#boutonsRotate').show();
			 }
			 else if (currentAction == 'editDock')
			 {
				dock = docks[currentDockIndex];
				
				zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();		
				p = $('#install_by_step_edit_map_svg image').position();
				
				
				x = dock.approch_pose_x * 100 / 5;
				y = dock.approch_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#boutonsRotate').css('left', x - $('#boutonsRotate').width()/2);
				$('#boutonsRotate').css('top', y - 60);
				$('#boutonsRotate').show();
			 }
			 else if (currentAction == 'editPoi')
			 {
				poi = pois[currentPoiIndex];
				
				zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();		
				p = $('#install_by_step_edit_map_svg image').position();
				
				
				x = poi.approch_pose_x * 100 / 5;
				y = poi.approch_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#boutonsRotate').css('left', x - $('#boutonsRotate').width()/2);
				$('#boutonsRotate').css('top', y - 60);
				$('#boutonsRotate').show();
			 }
		}
		
		if (touchStarted)
		{
			//zoom = 1;
			zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
			if (downOnMovable)
			{
			   if (movableDown.data('element_type') == 'dock')
			   {
				   e.preventDefault();
				    
				   dock = GetDockFromID(movableDown.data('id_docking_station'));
				   
				   pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
				   pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
				  	x = dock.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution);
				  
					$('#dock_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
					$('#dock_connect_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
				  
					delta = (downOnSVG_x - pageX) * zoom * ros_resolution / 100;
					dock.approch_pose_x = parseFloat(dock.approch_pose_x) - delta;
					delta = (downOnSVG_y - pageY) * zoom * ros_resolution / 100;
					dock.approch_pose_y = parseFloat(dock.approch_pose_y) + delta;
					
					//movableDown.attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					//movableDown.attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 5); 
					
					
					$('#dock_'+movableDown.data('id_docking_station')).attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					$('#dock_'+movableDown.data('id_docking_station')).attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 1); 
					
					$('#dock_connect_'+movableDown.data('id_docking_station')).attr('x1', dock.approch_pose_x * 100 / ros_resolution - 1);
					$('#dock_connect_'+movableDown.data('id_docking_station')).attr('y1', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 1); 
					$('#dock_connect_'+movableDown.data('id_docking_station')).attr('x2', dock.approch_pose_x * 100 / ros_resolution + 1);
					$('#dock_connect_'+movableDown.data('id_docking_station')).attr('y2', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 1); 
					
					x = dock.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution);	
					angle = 0 - dock.approch_pose_t * 180 / Math.PI - 90;
					
					$('#dock_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					$('#dock_connect_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					
					//TraceDock(GetDockIndexFromID(movableDown.data('id_docking_station')));
				    
					downOnSVG_x = pageX;
					downOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'poi')
			   {
				   e.preventDefault();
				    
				   poi = GetPoiFromID(movableDown.data('id_poi'));
				   
				   pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
				   pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
				  	x = poi.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (poi.approch_pose_y * 100 / ros_resolution);
				  
					$('#poi_sens_'+movableDown.data('id_poi')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
				  
					delta = (downOnSVG_x - pageX) * zoom * ros_resolution / 100;
					poi.approch_pose_x = parseFloat(poi.approch_pose_x) - delta;
					delta = (downOnSVG_y - pageY) * zoom * ros_resolution / 100;
					poi.approch_pose_y = parseFloat(poi.approch_pose_y) + delta;
					
					//movableDown.attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					//movableDown.attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 5); 
					
					x = poi.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (poi.approch_pose_y * 100 / ros_resolution);	
					angle = 0 - poi.approch_pose_t * 180 / Math.PI;
					
					$('#poi_secure_'+movableDown.data('id_poi')).attr('cx', x);
					$('#poi_secure_'+movableDown.data('id_poi')).attr('cy', y); 
					
					$('#poi_robot_'+movableDown.data('id_poi')).attr('cx', x);
					$('#poi_robot_'+movableDown.data('id_poi')).attr('cy', y);
										
					$('#poi_sens_'+movableDown.data('id_poi')).attr('points', (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2));
					$('#poi_sens_'+movableDown.data('id_poi')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					
					//TraceDock(GetDockIndexFromID(movableDown.data('id_docking_station')));
				    
					downOnSVG_x = pageX;
					downOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'forbidden')
			   {
				   e.preventDefault();
				    
				   forbidden = GetForbiddenFromID(movableDown.data('id_area'));
				   
				   pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
				   pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
					delta = (downOnSVG_x - pageX) * zoom * ros_resolution / 100;
					forbidden.points[movableDown.data('index_point')].x = parseFloat(forbidden.points[movableDown.data('index_point')].x) - delta;
					delta = (downOnSVG_y - pageY) * zoom * ros_resolution / 100;
					forbidden.points[movableDown.data('index_point')].y = parseFloat(forbidden.points[movableDown.data('index_point')].y) + delta;
					
					movableDown.attr('x', forbidden.points[movableDown.data('index_point')].x * 100 / ros_resolution - 5);
					movableDown.attr('y', ros_hauteur - (forbidden.points[movableDown.data('index_point')].y * 100 / ros_resolution) - 5); 
				
					TraceForbidden(GetForbiddenIndexFromID(movableDown.data('id_area')));
				    
					downOnSVG_x = pageX;
					downOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'area')
			   {
				   e.preventDefault();
				    
				   area = GetAreaFromID(movableDown.data('id_area'));
				   
				   pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
				   pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
					delta = (downOnSVG_x - pageX) * zoom * ros_resolution / 100;
					area.points[movableDown.data('index_point')].x = parseFloat(area.points[movableDown.data('index_point')].x) - delta;
					delta = (downOnSVG_y - pageY) * zoom * ros_resolution / 100;
					area.points[movableDown.data('index_point')].y = parseFloat(area.points[movableDown.data('index_point')].y) + delta;
					
					movableDown.attr('x', area.points[movableDown.data('index_point')].x * 100 / ros_resolution - 5);
					movableDown.attr('y', ros_hauteur - (area.points[movableDown.data('index_point')].y * 100 / ros_resolution) - 5); 
				
					TraceArea(GetAreaIndexFromID(movableDown.data('id_area')));
				    
					downOnSVG_x = pageX;
					downOnSVG_y = pageY;
			   }
			}
			else if (clickSelectSVG && currentAction == 'select')
			{
				e.preventDefault();
				
				//clickSelectSVG_x_last = e.offsetX;
				//clickSelectSVG_y_last = e.offsetY;
				p = $('#install_by_step_edit_map_svg image').position();
				clickSelectSVG_x_last = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				clickSelectSVG_y_last = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				
				TraceSection(clickSelectSVG_x, clickSelectSVG_y, clickSelectSVG_x_last, clickSelectSVG_y_last);
			}
			else if (currentAction == 'gomme' && (currentStep=='trace' || currentStep=='traced'))
			{
				e.preventDefault();
				currentStep ='traced';
				
				//x = e.offsetX;
				//y = $('#mapBox').height() - e.offsetY;
				p = $('#install_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
								
				gommes[gommes.length-1].pop(); // Point du curseur
				gommes[gommes.length-1].push({x:xRos, y:yRos});
				gommes[gommes.length-1].push({x:xRos, y:yRos}); // Point du curseur
				TraceCurrentGomme(gommes[gommes.length-1], gommes.length-1);
			}
			else if (currentAction == 'addDock' && currentStep=='setPose')
			{
				p = $('#install_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentDockPose.approach_pose_x = xRos;
				currentDockPose.approach_pose_y = yRos;
				currentDockPose.approach_pose_t = 0;
				
				TraceCurrentDock(currentDockPose);
			}
			/*
			else if (currentAction == 'addDock' && currentStep=='setDir')
			{
				p = $('#install_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentDockPose.approch_pose_t = GetAngleRadian(currentDockPose.approch_pose_x, currentDockPose.approch_pose_y, xRos, yRos) + Math.PI;
								
				TraceCurrentDock(currentDockPose);
			}
			*/
			else if (currentAction == 'addPoi' && currentStep=='setPose')
			{
				p = $('#install_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentPoiPose.approch_pose_x = xRos;
				currentPoiPose.approch_pose_y = yRos;
				currentPoiPose.approch_pose_t = 0;
				
				TraceCurrentPoi(currentPoiPose);
			}
			/*
			else if (currentAction == 'addPoi' && currentStep=='setDir')
			{
				p = $('#install_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentPoiPose.approch_pose_t = GetAngleRadian(currentPoiPose.approch_pose_x, currentPoiPose.approch_pose_y, xRos, yRos) + Math.PI;
								
				TraceCurrentPoi(currentPoiPose);
			}
			*/
			/*
			else if (currentAction == 'addForbiddenArea' && currentStep=='trace')
			{
				e.preventDefault();
				
				//x = e.offsetX;
				//y = $('#mapBox').height() - e.offsetY;
				p = $('#install_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentForbiddenPoints.pop(); // Point du curseur
				currentForbiddenPoints.push({x:xRos, y:yRos});
				TraceCurrentForbidden(currentForbiddenPoints);
			}
			else if (currentAction == 'addArea' && currentStep=='trace')
			{
				e.preventDefault();
				
				//x = e.offsetX;
				//y = $('#mapBox').height() - e.offsetY;
				p = $('#install_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentAreaPoints.pop(); // Point du curseur
				currentAreaPoints.push({x:xRos, y:yRos});
				TraceCurrentArea(currentAreaPoints);
			}
			*/
		}
	});
	
	$('#install_by_step_edit_map_svg').on('touchend', function(e) {
		touchStarted = false;
		if (downOnMovable)
		{
			downOnMovable = false;
			touchStarted = false;
			blockZoom = false;
			
			if (movableDown.data('element_type') == 'forbidden')
			{
				TraceForbidden(GetForbiddenIndexFromID(movableDown.data('id_area')));
			}
			else if (movableDown.data('element_type') == 'area')
			{
				TraceArea(GetAreaIndexFromID(movableDown.data('id_area')));
			}
		}
		if (currentAction == 'gomme' && currentStep=='traced')
		{
			currentStep='';
			AddHistorique({'action':'gomme', 'data':gommes[gommes.length-1]});
		}
		else if (currentAction == 'addDock' && currentStep=='setPose')
		{
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approach_pose_x = xRos;
			currentDockPose.approach_pose_y = yRos;
			currentDockPose.approach_pose_t = 0;
			
			TraceCurrentDock(currentDockPose);
			
			
			x = currentDockPose.approach_pose_x * 100 / 5;
			y = currentDockPose.approach_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#boutonsRotate').css('left', x - $('#boutonsRotate').width()/2);
			$('#boutonsRotate').css('top', y - 60);
			$('#boutonsRotate').show();
			$('#bDockSave').show();
			
			//currentStep='setDir';
			//$('#message_aide').html(textClickOnMapDir);
			
		}
		/*
		else if (currentAction == 'addDock' && currentStep=='setDir')
		{
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approch_pose_t = GetAngleRadian(currentDockPose.approch_pose_x, currentDockPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			TraceCurrentDock(currentDockPose);
			
			$('#boutonsDock #bDockSave').show();
		}
		*/
		else if (currentAction == 'addPoi' && currentStep=='setPose')
		{
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approach_pose_x = xRos;
			currentPoiPose.approach_pose_y = yRos;
			currentPoiPose.approach_pose_t = 0;
			
			TraceCurrentPoi(currentPoiPose);
			
			zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();		
			p = $('#install_by_step_edit_map_svg image').position();
			
			
			x = currentPoiPose.approach_pose_x * 100 / 5;
			y = currentPoiPose.approach_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#boutonsRotate').css('left', x - $('#boutonsRotate').width()/2);
			$('#boutonsRotate').css('top', y - 60);
			$('#boutonsRotate').show();
			$('#bPoiSave').show();
			
			//currentStep='setDir';
			//$('#message_aide').html(textClickOnMapDir);
		}
		/*
		else if (currentAction == 'addPoi' && currentStep=='setDir')
		{
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approch_pose_t = GetAngleRadian(currentPoiPose.approch_pose_x, currentPoiPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			TraceCurrentPoi(currentPoiPose);
			
			$('#boutonsPoi #bPoiSave').show();
		}
		*/
		/*
		else if (currentAction == 'addForbiddenArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#mapBox').height() - e.offsetY;
			p = $('#install_by_step_edit_map_svg image').position();
			
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;

			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentForbiddenPoints.pop(); // Point du curseur
			currentForbiddenPoints.push({x:xRos, y:yRos});
			currentForbiddenPoints.push({x:xRos, y:yRos}); // Point du curseur
			TraceCurrentForbidden(currentForbiddenPoints);
		}
		else if (currentAction == 'addArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#mapBox').height() - e.offsetY;
			p = $('#install_by_step_edit_map_svg image').position();
			
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;

			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			
			currentAreaPoints.pop(); // Point du curseur
			currentAreaPoints.push({x:xRos, y:yRos});
			currentAreaPoints.push({x:xRos, y:yRos}); // Point du curseur
			TraceCurrentArea(currentAreaPoints);
		}
		*/
	});
});

var touchStarted = false;

function PoiSave()
{
	if (currentAction == 'addPoi')
	{
		$('#poi_name').val('');
		$('#modalPoiEditName').modal('show');
	}
	else if (currentAction == 'editPoi')
	{	
		SaveElementNeeded(false);
		
		poi = pois[currentPoiIndex];
		RemoveClass('#install_by_step_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		
		AddHistorique({'action':'edit_poi', 'data':{'index':currentPoiIndex, 'old':saveCurrentPoi, 'new':JSON.stringify(pois[currentPoiIndex])}});
		
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		
		currentAction = '';
		currentStep = '';
		
		$('#boutonsRotate').hide();
		
		$('#boutonsPoi').hide();
		$('#boutonsStandard').show();
		$('#message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		SetModeSelect();
	}
}
function PoiCancel()
{
	SaveElementNeeded(false);
	
	$('#install_by_step_edit_map_svg .poi_elem_current').remove();
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (currentAction == 'addPoi')
	{
		$('#install_by_step_edit_map_svg .poi_elem_0').remove();
	}
	else if (currentAction == 'editPoi')
	{
		poi = pois[currentPoiIndex];
		RemoveClass('#install_by_step_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		
		pois[currentPoiIndex] = JSON.parse(saveCurrentPoi);
		TracePoi(currentPoiIndex);
	}
	currentAction = '';
	currentStep = '';
	
	$('#boutonsRotate').hide();
	
	$('#boutonsPoi').hide();
	$('#boutonsStandard').show();
	$('#message_aide').hide();
	blockZoom = false;
	
	SetModeSelect();
}
function DockSave()
{
	$('#install_by_step_edit_map_svg .dock_elem_current').remove();
	
	if (currentAction == 'addDock')
	{
		SaveElementNeeded(false);
		
		nextIdDock++;
		num = GetMaxNumDock()+1;
		d = {'id_docking_station':nextIdDock, 'id_map':id_map, 'id_fiducial':$(this).data('id_fiducial'), 'final_pose_x':currentDockPose.final_pose_x, 'final_pose_y':currentDockPose.final_pose_y, 'final_pose_t':currentDockPose.final_pose_t, 'approch_pose_x':currentDockPose.approch_pose_x, 'approch_pose_y':currentDockPose.approch_pose_y, 'approch_pose_t':currentDockPose.approch_pose_t, 'fiducial_pose_x':currentDockPose.fiducial_pose_x, 'fiducial_pose_y':currentDockPose.fiducial_pose_y, 'fiducial_pose_t':currentDockPose.fiducial_pose_t, 'num':parseInt(num), 'name':'Dock '+num, 'comment':''};
		AddHistorique({'action':'add_dock', 'data':d});
		
		docks.push(d);
		TraceDock(docks.length-1);
		
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		
		$('#install_by_step_edit_map_svg .dock_elem_0').remove();
		$('#install_by_step_edit_map_svg .dock_elem_current').remove();
		
		currentAction = '';
		currentStep = '';
		
		$('#boutonsRotate').hide();
	
		$('#boutonsDock').hide();
		$('#boutonsStandard').show();
		$('#message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		SetModeSelect();
	}
	else if (currentAction == 'editDock')
	{	
		SaveElementNeeded(false);
		
		
		dock = docks[currentDockIndex];
		RemoveClass('#install_by_step_edit_map_svg .dock_elem_'+dock.id_docking_station, 'movable');
		
		AddHistorique({'action':'edit_dock', 'data':{'index':currentDockIndex, 'old':saveCurrentDock, 'new':JSON.stringify(docks[currentDockIndex])}});
		
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		
		currentAction = '';
		currentStep = '';
		
		$('#boutonsRotate').hide();
		
		$('#boutonsDock').hide();
		$('#boutonsStandard').show();
		$('#message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		SetModeSelect();
	}
}
function DockCancel()
{
	SaveElementNeeded(false);
	
	$('#install_by_step_edit_map_svg .dock_elem_current').remove();
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (currentAction == 'addDock')
	{
		$('#install_by_step_edit_map_svg .dock_elem_0').remove();
		$('#install_by_step_edit_map_svg .dock_elem_current').remove();
	}
	else if (currentAction == 'editDock')
	{
		dock = docks[currentDockIndex];
		RemoveClass('#install_by_step_edit_map_svg .dock_elem_'+dock.id_docking_station, 'movable');
		
		docks[currentDockIndex] = JSON.parse(saveCurrentDock);
		TraceDock(currentDockIndex);
	}
	currentAction = '';
	currentStep = '';
	
	$('#boutonsRotate').hide();
	
	$('#boutonsDock').hide();
	$('#boutonsStandard').show();
	$('#message_aide').hide();
	blockZoom = false;
	
	SetModeSelect();
}
function AreaSave()
{
	$('#install_by_step_edit_map_svg .area_elem_current').remove();
	
	if (currentAction == 'addArea')
	{
		SaveElementNeeded(false);
		
		AddHistorique({'action':'add_area', 'data':{'index':currentAreaIndex, 'old':saveCurrentArea, 'new':JSON.stringify(areas[currentAreaIndex])}});
		
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
		
		currentAction = '';
		currentStep = '';
		
		$('#boutonsForbidden').hide();
		$('#boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		SetModeSelect();
	}
	else if (currentAction == 'editArea')
	{
		SaveElementNeeded(false);
		
		AddHistorique({'action':'edit_area', 'data':{'index':currentAreaIndex, 'old':saveCurrentArea, 'new':JSON.stringify(areas[currentAreaIndex])}});
		
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		
		currentAction = '';
		currentStep = '';
		
		$('#boutonsArea').hide();
		$('#boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		SetModeSelect();
	}
}
function AreaCancel()
{
	SaveElementNeeded(false);
	
	$('#install_by_step_edit_map_svg .area_elem_current').remove();
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (currentAction == 'addArea')
	{
		DeleteArea(currentAreaIndex);
		historiques.pop();
	}
	else if (currentAction == 'editArea')
	{
		areas[currentAreaIndex] = JSON.parse(saveCurrentArea);
		TraceArea(currentAreaIndex);
	}
	currentAction = '';
	currentStep = '';
	
	$('#boutonsArea').hide();
	$('#boutonsStandard').show();
	blockZoom = false;
	
	SetModeSelect();
}
function ForbiddenSave()
{
	$('.forbidden_elem_current').remove();
	
	if (currentAction == 'addForbiddenArea')
	{
		SaveElementNeeded(false);
		
		AddHistorique({'action':'add_forbidden', 'data':{'index':currentForbiddenIndex, 'old':saveCurrentForbidden, 'new':JSON.stringify(forbiddens[currentForbiddenIndex])}});
		
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
		
		currentAction = '';
		currentStep = '';
		
		$('#boutonsForbidden').hide();
		$('#boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		SetModeSelect();
	}
	else if (currentAction == 'editForbiddenArea')
	{	
		SaveElementNeeded(false);
		
		AddHistorique({'action':'edit_forbidden', 'data':{'index':currentForbiddenIndex, 'old':saveCurrentForbidden, 'new':JSON.stringify(forbiddens[currentForbiddenIndex])}});
		
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
		
		currentAction = '';
		currentStep = '';
		
		$('#boutonsForbidden').hide();
		$('#boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		SetModeSelect();
	}
}
function ForbiddenCancel()
{
	SaveElementNeeded(false);
	
	$('#install_by_step_edit_map_svg .forbidden_elem_current').remove();
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (currentAction == 'addForbiddenArea')
	{
		DeleteForbidden(currentForbiddenIndex);
		historiques.pop();
	}
	else if (currentAction == 'editForbiddenArea')
	{
		forbiddens[currentForbiddenIndex] = JSON.parse(saveCurrentForbidden);
		TraceForbidden(currentForbiddenIndex);
	}
	currentAction = '';
	currentStep = '';
	
	$('#boutonsForbidden').hide();
	$('#boutonsStandard').show();
	blockZoom = false;
	
	SetModeSelect();
}

function InitTaille()
{
}

function RefreshAllPath()
{
}

function RefreshZoomView()
{
	pSVG = $('#install_by_step_edit_map_svg').position();
	pImg = $('#install_by_step_edit_map_svg image').position();
	pImg.left -= pSVG.left;
	pImg.top -= pSVG.top;
	
	zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
	
	wZoom = $('#install_by_step_edit_map_zoom_carte').width();
	hZoom = $('#install_by_step_edit_map_zoom_carte').height();
	
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
	
	hNew = $('#install_by_step_edit_map_svg').height() * zoom  / ros_largeur * wZoom;
	wNew = $('#install_by_step_edit_map_svg').width() * zoom  / ros_largeur * wZoom;
	
	//if (tNew + hNew > hZoom) hNew = hZoom - tNew;
	//if (lNew + wNew > wZoom) wNew = wZoom - lNew;
		
	$('#install_by_step_edit_map_zone_zoom').width(wNew);
	$('#install_by_step_edit_map_zone_zoom').height(hNew);
				
	$('#install_by_step_edit_map_zone_zoom').css('top', tNew - 1);
	$('#install_by_step_edit_map_zone_zoom').css('left', lNew - 1);
	
}

function RemoveClass(query_element, class_to_delete)
{
	$(query_element).each(function(index, element) {
		if ($(this).attr('class') != undefined)
	        $(this).attr('class',  $(this).attr('class').replace(class_to_delete, ''));
    });
}
function AddClass(query_element, class_to_add)
{
	$(query_element).each(function(index, element) {
		if ($(this).attr('class') != undefined)
	        $(this).attr('class',  $(this).attr('class') + ' ' + class_to_add);
		else
	        $(this).attr('class',  class_to_add);
    });
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function sortUL(selector) {
    $(selector).children("li").sort(function(a, b) {
        var upA = $(a).text().toUpperCase();
        var upB = $(b).text().toUpperCase();
        return (upA < upB) ? -1 : (upA > upB) ? 1 : 0;
    }).appendTo(selector);
}


function DeleteForbidden(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	forbiddens[indexInArray].deleted = true;
	
	AddHistorique({'action':'delete_forbidden', 'data':indexInArray});
	
	data = forbiddens[indexInArray];
	$('#install_by_step_edit_map_svg .forbidden_elem_'+data.id_area).remove();
	
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');
	
	currentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	
	$('#boutonsForbidden').hide();
    $('#boutonsStandard').show();
	blockZoom = false;
	
	SetModeSelect();
}
function GetForbiddenFromID(id)
{
	ret = null;
	$.each(forbiddens, function(indexInArray, forbidden){
		if (forbidden.id_area == id)
		{
			ret = forbidden;
			return ret;
		}
	});
	return ret;
}
function GetForbiddenIndexFromID(id)
{
	ret = null;
	$.each(forbiddens, function(indexInArray, forbidden){
		if (forbidden.id_area == id)
		{
			ret = indexInArray;
			return ret;
		}
	});
	return ret;
}

function DeleteArea(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	areas[indexInArray].deleted = true;
	
	AddHistorique({'action':'delete_area', 'data':indexInArray});
	
	data = areas[indexInArray];
	$('#install_by_step_edit_map_svg .area_elem_'+data.id_area).remove();
	
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');
	
	currentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#boutonsArea').hide();
    $('#boutonsStandard').show();
	blockZoom = false;
	
	SetModeSelect();
}
function GetAreaFromID(id)
{
	ret = null;
	$.each(areas, function(indexInArray, area){
		if (area.id_area == id)
		{
			ret = area;
			return ret;
		}
	});
	return ret;
}
function GetAreaIndexFromID(id)
{
	ret = null;
	$.each(areas, function(indexInArray, area){
		if (area.id_area == id)
		{
			ret = indexInArray;
			return ret;
		}
	});
	return ret;
}

function DeleteDock(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	docks[indexInArray].deleted = true;
	
	AddHistorique({'action':'delete_dock', 'data':indexInArray});
	
	data = docks[indexInArray];
	$('#install_by_step_edit_map_svg .dock_elem_'+data.id_docking_station).remove();
	
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');
	
	currentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#boutonsDock').hide();
    $('#boutonsStandard').show();
	blockZoom = false;
	
	SetModeSelect();
}
function GetDockFromID(id)
{
	ret = null;
	$.each(docks, function(indexInArray, dock){
		if (dock.id_docking_station == id)
		{
			ret = dock;
			return ret;
		}
	});
	return ret;
}
function GetDockIndexFromID(id)
{
	ret = null;
	$.each(docks, function(indexInArray, dock){
		if (dock.id_docking_station == id)
		{
			ret = indexInArray;
			return ret;
		}
	});
	return ret;
}
function GetMaxNumDock()
{
	ret = 0;
	$.each(docks, function(indexInArray, dock){
		if (dock.num > ret)
			ret = dock.num;
	});
	return ret;
}

function DeletePoi(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	pois[indexInArray].deleted = true;
	
	AddHistorique({'action':'delete_poi', 'data':indexInArray});
	
	data = pois[indexInArray];
	$('#install_by_step_edit_map_svg .poi_elem_'+data.id_poi).remove();
	
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');
	
	currentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#boutonsPoi').hide();
    $('#boutonsStandard').show();
	blockZoom = false;
	
	SetModeSelect();
}
function GetPoiFromID(id)
{
	ret = null;
	$.each(pois, function(indexInArray, poi){
		if (poi.id_poi == id)
		{
			ret = poi;
			return ret;
		}
	});
	return ret;
}
function GetPoiIndexFromID(id)
{
	ret = null;
	$.each(pois, function(indexInArray, poi){
		if (poi.id_poi == id)
		{
			ret = indexInArray;
			return ret;
		}
	});
	return ret;
}

function GetAngleRadian(x1, y1, x2, y2) {
	var dx = x2 - x1;
	var dy = y2 - y1;
	return Math.atan2(dy, dx);
}
function GetAngleDegre(x1, y1, x2, y2) {
	return GetAngleRadian(x1, y1, x2, y2) * (180 / Math.PI);
}

function GetDockPosition(pose)
{
	dockPose = {'x': pose.x + Math.cos(pose.theta) * 0.26 , 'y': pose.y + Math.sin(pose.theta) * 0.26, 'theta':pose.theta};
	
	return dockPose;
}

function RotatePoint (M, O, angle) {
    var xM, yM, x, y;
    //angle *= Math.PI / 180;
    xM = M.X - O.X;
    yM = M.Y - O.Y;
    x = xM * Math.cos (angle) + yM * Math.sin (angle) + O.X;
    y = - xM * Math.sin (angle) + yM * Math.cos (angle) + O.Y;
    return ({X:Math.round (x*100)/100, Y:Math.round (y*100)/100});
}