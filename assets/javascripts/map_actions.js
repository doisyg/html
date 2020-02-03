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



var timerCantChange = null;
function AvertCantChange()
{
	$('#bModalCancelEdit').click();
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
			$('#svg .gomme_elem_current_'+gommes.length).remove();
			break;
		case 'add_forbidden':
			forbiddens.pop();
			$('#svg .forbidden_elem_'+elem.data.id_area).remove();
			break;
		case 'edit_forbidden':
			forbiddens[elem.data.index] = JSON.parse(elem.data.old);
			TraceForbidden(elem.data.index);
			break;
		case 'delete_forbidden':
			forbiddens[elem.data].deleted = 0;
			TraceForbidden(elem.data);
			break;
		case 'add_area':
			areas.pop();
			$('#svg .area_elem_'+elem.data.id_area).remove();
			break;
		case 'edit_area':
			areas[elem.data.index] = JSON.parse(elem.data.old);
			TraceArea(elem.data.index);
			break;
		case 'delete_area':
			areas[elem.data].deleted = 0;
			TraceArea(elem.data);
			break;
		case 'add_dock':
			docks.pop();
			$('#svg .dock_elem_'+elem.data.id_station_recharge).remove();
			break;
		case 'edit_dock':
			docks[elem.data.index] = JSON.parse(elem.data.old);
			TraceDock(elem.data.index);
			break;
		case 'delete_dock':
			docks[elem.data].deleted = 0;
			TraceDock(elem.data);
			break;
		case 'add_poi':
			pois.pop();
			$('#svg .poi_elem_'+elem.data.id_poi).remove();
			break;
		case 'edit_poi':
			pois[elem.data.index] = JSON.parse(elem.data.old);
			TracePoi(elem.data.index);
			break;
		case 'delete_poi':
			pois[elem.data].deleted = 0;
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
			forbiddens[elem.data].deleted = 1;
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
			areas[elem.data].deleted = 1;
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
			docks[elem.data].deleted = 1;
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
			pois[elem.data].deleted = 1;
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
		$('#bUndo').addClass('disabled');
	else
		$('#bUndo').removeClass('disabled');
	if (historiqueIndex == historiques.length-1)
		$('#bRedo').addClass('disabled');
	else
		$('#bRedo').removeClass('disabled');
}

function SetModeSelect()
{
	$('body').addClass('select');
	currentAction = 'select';
	currentStep = '';
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
	
	
	svg = document.querySelector('#svg');
	InitSVG();
	
	$('#bUndo').click(function(e) {
        e.preventDefault();
		if (!$('#bUndo').hasClass('disabled'))
			Undo();
	});
	$('#bUndo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#bUndo').hasClass('disabled'))
			Undo();
	});
	
	$('#bRedo').click(function(e) {
        e.preventDefault();
		if (!$('#bRedo').hasClass('disabled'))
			Redo();
    });
	$('#bRedo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#bRedo').hasClass('disabled'))
			Redo();
	});
	
	$(document).on('touchstart', '#svg .movable', function(e) {
		if (currentAction != 'gomme')
		{
			console.log('touchstart movable');
			touchStarted = true;
			downOnMovable = true;
			movableDown = $(this);
			downOnSVG_x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
			downOnSVG_y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
			
			canChangeMenu = false;
			
			blockZoom = true;
		}
    });
	
	$('#svg').on('contextmenu', function (e) {
		
		if (currentAction == 'gomme' && currentStep=='trace')
		{
			currentStep = '';
			currentGommePoints.pop(); // Point du curseur
			TraceCurrentGomme(currentGommePoints);
			return false;
			
		}
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
    });
	
	$('#zone_zoom_click').mousedown(function(e) {
       e.preventDefault();
	   downOnZoomClick = true;
    });
	$('#zone_zoom_click').mousemove(function(e) {
       e.preventDefault();
	   if (downOnZoomClick)
	   {
			w = $('#zoom_carte').width();
			h = $('#zoom_carte').height();
			
			wZoom = $('#zone_zoom').width();
			hZoom = $('#zone_zoom').height();
			
			x = e.offsetX - wZoom / 2;
			y = e.offsetY - hZoom / 2;
					
			zoom = ros_largeur / $('#svg').width() / window.panZoom.getZoom();
			
			largeur_img = ros_largeur / zoom
			
			x = - x / w * largeur_img;
			y = - y / w * largeur_img;
			
			window.panZoom.pan({'x':x, 'y':y});
	   }
    });
	
	$('#zone_zoom_click').click(function(e) {
		e.preventDefault();
		
		w = $('#zoom_carte').width();
		h = $('#zoom_carte').height();
		
		wZoom = $('#zone_zoom').width();
		hZoom = $('#zone_zoom').height();
		
		x = e.offsetX - wZoom / 2;
		y = e.offsetY - hZoom / 2;
				
		zoom = ros_largeur / $('#svg').width() / window.panZoom.getZoom();
		
		largeur_img = ros_largeur / zoom
		
		x = - x / w * largeur_img;
		y = - y / w * largeur_img;
		
		window.panZoom.pan({'x':x, 'y':y});
	});
	
	$('#zone_zoom_click').on('touchstart', function(e) {
       e.preventDefault();
	   downOnZoomClick = true;
    });
	$('#zone_zoom_click').on('touchend', function(e) {
       e.preventDefault();
	   downOnZoomClick = false;
    });
	$('#zone_zoom_click').on('touchmove', function(e) {
       e.preventDefault();
	   if (downOnZoomClick)
	   {
		   w = $('#zoom_carte').width();
			h = $('#zoom_carte').height();
			
			wZoom = $('#zone_zoom').width();
			hZoom = $('#zone_zoom').height();
			
			p = $('#zoom_carte_container').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left + 15;
			p = $('#container_all').position();
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top - 6;
						
			x = x - wZoom / 2;
			y = y - hZoom / 2;
					
			zoom = ros_largeur / $('#svg').width() / window.panZoom.getZoom();
			
			largeur_img = ros_largeur / zoom
			
			x = - x / w * largeur_img;
			y = - y / w * largeur_img;
			
			window.panZoom.pan({'x':x, 'y':y});
	   }
    });
	
	$(document).on('click', '#svg .forbidden_elem', function(e) {
		e.preventDefault();
		
		if ((currentAction == 'addArea' || currentAction == 'addForbiddenArea') && currentStep == 'trace')
		{
		}
		else if (currentAction == 'gomme')
		{
		}
		else if (canChangeMenu)
		{
			RemoveClass('#svg .active', 'active');
			RemoveClass('#svg .activ_select', 'activ_select'); 
			
			
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
			
			AddClass('#svg .forbidden_elem_'+forbidden.id_area, 'active');
		}
		else
			AvertCantChange();
	});
	
	$(document).on('click', '#svg .area_elem', function(e) {
		e.preventDefault();
		
		if ((currentAction == 'addArea' || currentAction == 'addForbiddenArea') && currentStep == 'trace')
		{
		}
		else if (currentAction == 'gomme')
		{
		}
		else if (canChangeMenu)
		{
			RemoveClass('#svg .active', 'active');
			RemoveClass('#svg .activ_select', 'activ_select'); 
			
			
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
			
			AddClass('#svg .area_elem_'+area.id_area, 'active');
		}
		else
			AvertCantChange();
	});
	
	$(document).on('click', '#svg .dock_elem', function(e) {
		e.preventDefault();
		
		if (currentAction == 'addDock')
		{
		}
		else if (currentAction == 'gomme')
		{
		}
		else if (canChangeMenu)
		{
			RemoveClass('#svg .active', 'active');
			RemoveClass('#svg .activ_select', 'activ_select'); 
			
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'dock', 'id':$(this).data('id_station_recharge')});	
			HideCurrentMenuNotSelect();
			
			$('#boutonsDock').show();
            $('#boutonsStandard').hide();
			
			$('#boutonsDock a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			currentAction = 'editDock';	
			currentStep = '';
			
			currentDockIndex = GetDockIndexFromID($(this).data('id_station_recharge'));
			dock = docks[currentDockIndex];
			saveCurrentDock = JSON.stringify(dock);
			
			AddClass('#svg .dock_elem_'+dock.id_station_recharge, 'active');
			AddClass('#svg .dock_elem_'+dock.id_station_recharge, 'movable');
			
		}
		else
			AvertCantChange();
	});
	
	
	$(document).on('click', '#svg .poi_elem', function(e) {
		e.preventDefault();
		
		if (currentAction == 'addPoi')
		{
		}
		else if (currentAction == 'gomme')
		{
		}
		else if (canChangeMenu)
		{
			RemoveClass('#svg .active', 'active');
			RemoveClass('#svg .activ_select', 'activ_select'); 
			RemoveClass('#svg .poi_elem', 'movable');
						
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
			
			AddClass('#svg .poi_elem_'+poi.id_poi, 'active');
			AddClass('#svg .poi_elem_'+poi.id_poi, 'movable');
		}
		else
			AvertCantChange();
	});
	
	
	$('#bGomme').click(function(e) {
        e.preventDefault();
		
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
			
			canChangeMenu = true;
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
	
	$('#bAddForbiddenArea').click(function(e) {
        e.preventDefault();
		if (canChangeMenu)
		{
			blockZoom = true;
			
			$('#boutonsForbidden').show();
            $('#boutonsStandard').hide();
			
			$('#boutonsForbidden #bForbiddenDelete').hide();
			
			currentAction = 'addForbiddenArea';	
			currentStep = 'trace';
			
			$('body').removeClass('no_current');
			$('body').addClass('addForbidden');
			
			currentForbiddenPoints = Array();
			currentForbiddenPoints.push({x:0, y:0}); // Point du curseur
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
	$('#bForbiddenSave').click(function(e) {
        e.preventDefault();
		
		$('.forbidden_elem_current').remove();
		
		if (currentAction == 'addForbiddenArea')
		{
			canChangeMenu = true;
			
			nextIdArea++;
			
			currentForbiddenPoints.pop();
			
			f = {'id_area':nextIdArea, 'id_plan':id_plan, 'nom':'', 'comment':'', 'is_forbidden':1, 'couleur_r':0, 'couleur_g':0, 'couleur_b':0, 'deleted':0, 'points':currentForbiddenPoints};
			AddHistorique({'action':'add_forbidden', 'data':f});
			
			forbiddens.push(f);
			TraceForbidden(forbiddens.length-1);
			
			RemoveClass('#svg .active', 'active');
			
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
			canChangeMenu = true;
			
			AddHistorique({'action':'edit_forbidden', 'data':{'index':currentForbiddenIndex, 'old':saveCurrentForbidden, 'new':JSON.stringify(forbiddens[currentForbiddenIndex])}});
			
			RemoveClass('#svg .active', 'active');
			
			currentAction = '';
			currentStep = '';
			
			$('#boutonsForbidden').hide();
			$('#boutonsStandard').show();
			blockZoom = false;
			
			$('body').addClass('no_current');
			
			SetModeSelect();
		}
    });
	$('#bForbiddenCancel').click(function(e) {
        e.preventDefault();
		
		canChangeMenu = true;
		
		$('#svg .forbidden_elem_current').remove();
		RemoveClass('#svg .active', 'active');
	
		$('body').addClass('no_current');
		
		if (currentAction == 'addForbiddenArea')
		{
			$('#svg .forbidden_elem_0').remove();
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
	});
	
	
	$('#bAddArea').click(function(e) {
        e.preventDefault();
		if (canChangeMenu)
		{
			blockZoom = true;
			
			$('#boutonsArea').show();
            $('#boutonsStandard').hide();
			
			$('#boutonsArea #bAreaDelete').hide();
			$('#boutonsArea #bAreaOptions').hide();
			
			currentAction = 'addArea';	
			currentStep = 'trace';
			
			$('body').removeClass('no_current');
			$('body').addClass('addArea');
			
			currentAreaPoints = Array();
			currentAreaPoints.push({x:0, y:0}); // Point du curseur
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
		area.configs = Array();
		area.configs.push({'name':'led_color_mode' , 'value':$('#led_color_mode').val()});
		area.configs.push({'name':'led_color' , 'value':$('#led_color').val()});
		area.configs.push({'name':'led_animation_mode' , 'value':$('#led_animation_mode').val()});
		area.configs.push({'name':'led_animation' , 'value':$('#led_animation').val()});
		area.configs.push({'name':'max_speed_mode' , 'value':$('#max_speed_mode').val()});
		area.configs.push({'name':'max_speed' , 'value':$('#max_speed').val()});
		
	});
		
	$('#bAreaSave').click(function(e) {
        e.preventDefault();
		
		$('#svg .area_elem_current').remove();
		
		if (currentAction == 'addArea')
		{
			canChangeMenu = true;
			
			nextIdArea++;
			
			currentAreaPoints.pop();
			a = {'id_area':nextIdArea, 'id_plan':id_plan, 'nom':'', 'comment':'', 'is_forbidden':0, 'couleur_r':87, 'couleur_g':159, 'couleur_b':177, 'deleted':0, 'points':currentAreaPoints, 'configs':Array()};
			AddHistorique({'action':'add_area', 'data':a});
			
			areas.push(a);
			TraceArea(areas.length-1);
			
			RemoveClass('#svg .active', 'active');
			
			currentAction = '';
			currentStep = '';
			
			$('#boutonsArea').hide();
			$('#boutonsStandard').show();
			blockZoom = false;
			
			$('body').addClass('no_current');
			
			SetModeSelect();
		}
		else if (currentAction == 'editArea')
		{
			canChangeMenu = true;
			
			AddHistorique({'action':'edit_area', 'data':{'index':currentAreaIndex, 'old':saveCurrentArea, 'new':JSON.stringify(areas[currentAreaIndex])}});
			
			RemoveClass('#svg .active', 'active');
			
			currentAction = '';
			currentStep = '';
			
			$('#boutonsArea').hide();
			$('#boutonsStandard').show();
			blockZoom = false;
			
			$('body').addClass('no_current');
			
			SetModeSelect();
		}
    });
	$('#bAreaCancel').click(function(e) {
        e.preventDefault();
		
		canChangeMenu = true;
		
		$('#svg .area_elem_current').remove();
		RemoveClass('#svg .active', 'active');
	
		$('body').addClass('no_current');
		
		if (currentAction == 'addArea')
		{
			$('#svg .area_elem_0').remove();
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
	});
	
	$('#bSaveMap').click(function(e) {
        
		jQuery.ajax({
				url: 'ajax/saveMap.php',
				type: "post",
				dataType: "json",
				data: { 
						'id_plan':id_plan,
						'gommes':JSON.stringify(gommes),
						'forbiddens':JSON.stringify(forbiddens),
						'areas':JSON.stringify(areas),
						'docks':JSON.stringify(docks),
						'pois':JSON.stringify(pois)
					},
				error: function(jqXHR, textStatus, errorThrown) {
					},
				success: function(data, textStatus, jqXHR) {
						savedCanClose = true;
						if (navLaunched && id_plan == current_id_plan)
						{
							wycaApi.NavigationReloadMaps(function(e) { if (!e.success) console.error(e.error); });	
						}
					}
			});
		
    });
	
	$('#bDockCreateFromPose').click(function(e) {
		nextIdDock++;
		
		dockPosition = GetDockPosition(lastRobotPose);
		
		d = {'id_station_recharge':nextIdDock, 'id_plan':id_plan, 'x_ros':dockPosition.x, 'y_ros':dockPosition.y, 't_ros':dockPosition.theta, 'num':0};
		AddHistorique({'action':'add_dock', 'data':d});
        docks.push(d);
		TraceDock(docks.length-1);
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
	$('#bDockSave').click(function(e) {
        e.preventDefault();
		
		$('#svg .dock_elem_current').remove();
		
		if (currentAction == 'addDock')
		{
			canChangeMenu = true;
			
			nextIdDock++;
			d = {'id_station_recharge':nextIdDock, 'id_plan':id_plan, 'x_ros':currentDockPose.x_ros, 'y_ros':currentDockPose.y_ros, 't_ros':currentDockPose.t_ros, 'num':0};
			AddHistorique({'action':'add_dock', 'data':d});
			
			docks.push(d);
			TraceDock(docks.length-1);
			
			RemoveClass('#svg .active', 'active');
			
			$('#svg .dock_elem_0').remove();
			$('#svg .dock_elem_current').remove();
			
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
			canChangeMenu = true;
			
			
			dock = docks[currentDockIndex];
			RemoveClass('#svg .dock_elem_'+dock.id_station_recharge, 'movable');
			
			AddHistorique({'action':'edit_dock', 'data':{'index':currentDockIndex, 'old':saveCurrentDock, 'new':JSON.stringify(docks[currentDockIndex])}});
			
			RemoveClass('#svg .active', 'active');
			
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
    });
	$('#bDockCancel').click(function(e) {
        e.preventDefault();
		
		canChangeMenu = true;
		
		$('#svg .dock_elem_current').remove();
		RemoveClass('#svg .active', 'active');
	
		$('body').addClass('no_current');
		
		if (currentAction == 'addDock')
		{
			$('#svg .dock_elem_0').remove();
			$('#svg .dock_elem_current').remove();
		}
		else if (currentAction == 'editDock')
		{
			dock = docks[currentDockIndex];
			RemoveClass('#svg .dock_elem_'+dock.id_station_recharge, 'movable');
			
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
			
			zoom = ros_largeur / $('#svg').width() / window.panZoom.getZoom();		
			p = $('#svg image').position();
			
			
			x = dock.x_ros * 100 / 5;
			y = dock.y_ros * 100 / 5;
			
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
		p = {'id_poi':nextIdPoi, 'id_plan':id_plan, 'x_ros':lastRobotPose.x, 'y_ros':lastRobotPose.y, 't_ros':lastRobotPose.theta, 'name':'POI'};
		AddHistorique({'action':'add_poi', 'data':p});
        pois.push(p);
		TracePoi(pois.length-1);
        
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
			canChangeMenu = true;
			
			nextIdPoi++;
			p = {'id_poi':nextIdPoi, 'id_plan':id_plan, 'x_ros':currentPoiPose.x_ros, 'y_ros':currentPoiPose.y_ros, 't_ros':currentPoiPose.t_ros, 'name':$('#poi_name').val()};
			AddHistorique({'action':'add_poi', 'data':p});
			
			pois.push(p);
			TracePoi(pois.length-1);
			
			$('#svg .poi_elem_current').remove();
			
			RemoveClass('#svg .active', 'active');
			
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
	
	$('#bPoiSave').click(function(e) {
        e.preventDefault();
		
		if (currentAction == 'addPoi')
		{
			$('#poi_name').val('');
			$('#modalPoiEditName').modal('show');
		}
		else if (currentAction == 'editPoi')
		{	
			canChangeMenu = true;
			
			poi = pois[currentPoiIndex];
			RemoveClass('#svg .poi_elem_'+poi.id_poi, 'movable');
			
			AddHistorique({'action':'edit_poi', 'data':{'index':currentPoiIndex, 'old':saveCurrentPoi, 'new':JSON.stringify(pois[currentPoiIndex])}});
			
			RemoveClass('#svg .active', 'active');
			
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
    });
	$('#bPoiCancel').click(function(e) {
        e.preventDefault();
		
		canChangeMenu = true;
		
		$('#svg .poi_elem_current').remove();
		RemoveClass('#svg .active', 'active');
	
		$('body').addClass('no_current');
		
		if (currentAction == 'addPoi')
		{
			$('#svg .poi_elem_0').remove();
		}
		else if (currentAction == 'editPoi')
		{
			poi = pois[currentPoiIndex];
			RemoveClass('#svg .poi_elem_'+poi.id_poi, 'movable');
			
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
			
			zoom = ros_largeur / $('#svg').width() / window.panZoom.getZoom();		
			p = $('#svg image').position();
			console.log('p', p);
			
			x = poi.x_ros * 100 / 5;
			y = poi.y_ros * 100 / 5;
			
			
			console.log('x1', x);
			
			x = x / zoom;
			
			console.log('x2', x);
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			
			console.log('x3', x);
			console.log('x3', x- $('#boutonsRotate').width()/2);
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
		canChangeMenu = false;
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
		timerRotate = setInterval(function() { 
			if (currentAction == 'addPoi')
			{
				currentPoiPose.t_ros = parseFloat(currentPoiPose.t_ros) + Math.PI / 90;;
				
				TraceCurrentPoi(currentPoiPose);
			}
			else if (currentAction == 'addDock')
			{
				currentDockPose.t_ros = parseFloat(currentDockPose.t_ros) + Math.PI / 90;;
				
				TraceCurrentDock(currentDockPose);
			}
			else if (currentAction == 'editPoi')
			{
				poi = pois[currentPoiIndex];
				poi.t_ros = parseFloat(poi.t_ros) + Math.PI / 90;
				TracePoi(currentPoiIndex);			
			}
			else if (currentAction == 'editDock')
			{
				dock = docks[currentDockIndex];
				dock.t_ros = parseFloat(dock.t_ros) + Math.PI / 90;
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
		canChangeMenu = false;
		if (currentAction == 'addPoi')
		{
			currentPoiPose.t_ros = parseFloat(currentPoiPose.t_ros) + Math.PI / 90;;
			
			TraceCurrentPoi(currentPoiPose);
		}
		else if (currentAction == 'addDock')
		{
			currentDockPose.t_ros = parseFloat(currentDockPose.t_ros) + Math.PI / 90;;
			
			TraceCurrentDock(currentDockPose);
		}
		else if (currentAction == 'editPoi')
		{
			poi = pois[currentPoiIndex];
			poi.t_ros = parseFloat(poi.t_ros) + Math.PI / 90;
			TracePoi(currentPoiIndex);			
		}
		else if (currentAction == 'editDock')
		{
			dock = docks[currentDockIndex];
			dock.t_ros = parseFloat(dock.t_ros) + Math.PI / 90;
			TraceDock(currentDockIndex);
		}
    });
	$(document).on('touchstart', '#bRotateLeft', function(e) {
		canChangeMenu = false;
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
		timerRotate = setInterval(function() { 
			if (currentAction == 'addPoi')
			{
				currentPoiPose.t_ros = parseFloat(currentPoiPose.t_ros) - Math.PI / 90;;
				
				TraceCurrentPoi(currentPoiPose);
			}
			else if (currentAction == 'addDock')
			{
				currentDockPose.t_ros = parseFloat(currentDockPose.t_ros) - Math.PI / 90;;
				
				TraceCurrentDock(currentDockPose);
			}
			else if (currentAction == 'editPoi')
			{
				poi = pois[currentPoiIndex];
				poi.t_ros = parseFloat(poi.t_ros) - Math.PI / 90;
				TracePoi(currentPoiIndex);			
			}
			else if (currentAction == 'editDock')
			{
				dock = docks[currentDockIndex];
				dock.t_ros = parseFloat(dock.t_ros) - Math.PI / 90;
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
		canChangeMenu = false;
        if (currentAction == 'addPoi')
		{
			currentPoiPose.t_ros = parseFloat(currentPoiPose.t_ros) - Math.PI / 90;;
			
			TraceCurrentPoi(currentPoiPose);
		}
		else if (currentAction == 'addDock')
		{
			currentDockPose.t_ros = parseFloat(currentDockPose.t_ros) - Math.PI / 90;;
			
			TraceCurrentDock(currentDockPose);
		}
		else if (currentAction == 'editPoi')
		{
			poi = pois[currentPoiIndex];
			poi.t_ros = parseFloat(poi.t_ros) - Math.PI / 90;
			TracePoi(currentPoiIndex);			
		}
		else if (currentAction == 'editDock')
		{
			dock = docks[currentDockIndex];
			dock.t_ros = parseFloat(dock.t_ros) - Math.PI / 90;
			TraceDock(currentDockIndex);
		}        
    });
		
	InitTaille();
    
    var offsetMap;
    
    AppliquerZoom();
	
	SetModeSelect();
	
	$('#svg').on('touchstart', function(e) {
		touchStarted = true;
		
		zoom = ros_largeur / $('#svg').width() / window.panZoom.getZoom();
		
		if (currentAction == 'gomme' && currentStep=='')
		{
			currentStep='trace';
			if (gommes.length == 0 || gommes[gommes.length-1].length > 0)
			{
				gommes[gommes.length] = Array();
				//gommes[gommes.length-1].push({x:0, y:0}); // Point du curseur
				
				p = $('#svg image').position();
				x = (e.originalEvent.targetTouches[0] ? e.originalEvent.targetTouches[0].pageX : e.originalEvent.changedTouches[e.changedTouches.length-1].pageX) - p.left;
				y = (e.originalEvent.targetTouches[0] ? e.originalEvent.targetTouches[0].pageY : e.originalEvent.changedTouches[e.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
								
				gommes[gommes.length-1].push({x:xRos, y:yRos});
				gommes[gommes.length-1].push({x:xRos+0.01, y:yRos+0.01}); // Point du curseur
				TraceCurrentGomme(gommes[gommes.length-1], gommes.length-1);
				
			}
		}
		else if (currentAction == 'addDock' && currentStep=='setPose')
		{
			p = $('#svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.x_ros = xRos;
			currentDockPose.y_ros = yRos;
			currentDockPose.t_ros = 0;
			
			TraceCurrentDock(currentDockPose);
		}
		/*
		else if (currentAction == 'addDock' && currentStep=='setDir')
		{
			p = $('#svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.t_ros = GetAngleRadian(currentDockPose.x_ros, currentDockPose.y_ros, xRos, yRos) + Math.PI;
							
			TraceCurrentDock(currentDockPose);
		}
		*/
		else if (currentAction == 'addPoi' && currentStep=='setPose')
		{
			p = $('#svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.x_ros = xRos;
			currentPoiPose.y_ros = yRos;
			currentPoiPose.t_ros = 0;
			
			TraceCurrentPoi(currentPoiPose);
		}
		/*
		else if (currentAction == 'addDock' && currentStep=='setDir')
		{
			p = $('#svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.t_ros = GetAngleRadian(currentPoiPose.x_ros, currentPoiPose.y_ros, xRos, yRos) + Math.PI;
							
			TraceCurrentPoi(currentPoiPose);
		}
		*/
		else if (currentAction == 'addForbiddenArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#mapBox').height() - e.offsetY;
			p = $('#svg image').position();
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
			p = $('#svg image').position();
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
	});
	
	$('#svg').on('touchmove', function(e) {
		
		if ($('#boutonsRotate').is(':visible'))
		{
			 if (currentAction == 'addDock')
			 {
				zoom = ros_largeur / $('#svg').width() / window.panZoom.getZoom();		
				p = $('#svg image').position();
				
				
				x = currentDockPose.x_ros * 100 / 5;
				y = currentDockPose.y_ros * 100 / 5;
				
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
				zoom = ros_largeur / $('#svg').width() / window.panZoom.getZoom();		
				p = $('#svg image').position();
				
				
				x = currentPoiPose.x_ros * 100 / 5;
				y = currentPoiPose.y_ros * 100 / 5;
				
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
				
				zoom = ros_largeur / $('#svg').width() / window.panZoom.getZoom();		
				p = $('#svg image').position();
				
				
				x = dock.x_ros * 100 / 5;
				y = dock.y_ros * 100 / 5;
				
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
				
				zoom = ros_largeur / $('#svg').width() / window.panZoom.getZoom();		
				p = $('#svg image').position();
				
				
				x = poi.x_ros * 100 / 5;
				y = poi.y_ros * 100 / 5;
				
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
			zoom = ros_largeur / $('#svg').width() / window.panZoom.getZoom();
			if (downOnMovable)
			{
				console.log('touchmove mobable', movableDown.data('element_type'));
			   if (movableDown.data('element_type') == 'dock')
			   {
				   e.preventDefault();
				    
				   dock = GetDockFromID(movableDown.data('id_station_recharge'));
				   
				   pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
				   pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
				  	x = dock.x_ros * 100 / ros_resolution;
					y = ros_hauteur - (dock.y_ros * 100 / ros_resolution);
				  
					$('#dock_'+movableDown.data('id_station_recharge')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
					$('#dock_connect_'+movableDown.data('id_station_recharge')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
				  
					delta = (downOnSVG_x - pageX) * zoom * ros_resolution / 100;
					dock.x_ros = parseFloat(dock.x_ros) - delta;
					delta = (downOnSVG_y - pageY) * zoom * ros_resolution / 100;
					dock.y_ros = parseFloat(dock.y_ros) + delta;
					
					//movableDown.attr('x', dock.x_ros * 100 / ros_resolution - 5);
					//movableDown.attr('y', ros_hauteur - (dock.y_ros * 100 / ros_resolution) - 5); 
					
					
					$('#dock_'+movableDown.data('id_station_recharge')).attr('x', dock.x_ros * 100 / ros_resolution - 5);
					$('#dock_'+movableDown.data('id_station_recharge')).attr('y', ros_hauteur - (dock.y_ros * 100 / ros_resolution) - 1); 
					
					$('#dock_connect_'+movableDown.data('id_station_recharge')).attr('x1', dock.x_ros * 100 / ros_resolution - 1);
					$('#dock_connect_'+movableDown.data('id_station_recharge')).attr('y1', ros_hauteur - (dock.y_ros * 100 / ros_resolution) - 1); 
					$('#dock_connect_'+movableDown.data('id_station_recharge')).attr('x2', dock.x_ros * 100 / ros_resolution + 1);
					$('#dock_connect_'+movableDown.data('id_station_recharge')).attr('y2', ros_hauteur - (dock.y_ros * 100 / ros_resolution) - 1); 
					
					x = dock.x_ros * 100 / ros_resolution;
					y = ros_hauteur - (dock.y_ros * 100 / ros_resolution);	
					angle = 0 - dock.t_ros * 180 / Math.PI - 90;
					
					$('#dock_'+movableDown.data('id_station_recharge')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					$('#dock_connect_'+movableDown.data('id_station_recharge')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					
					//TraceDock(GetDockIndexFromID(movableDown.data('id_station_recharge')));
				    
					downOnSVG_x = pageX;
					downOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'poi')
			   {
				   e.preventDefault();
				    
				   poi = GetPoiFromID(movableDown.data('id_poi'));
				   
				   pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
				   pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
				  	x = poi.x_ros * 100 / ros_resolution;
					y = ros_hauteur - (poi.y_ros * 100 / ros_resolution);
				  
					$('#poi_sens_'+movableDown.data('id_poi')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
				  
					delta = (downOnSVG_x - pageX) * zoom * ros_resolution / 100;
					poi.x_ros = parseFloat(poi.x_ros) - delta;
					delta = (downOnSVG_y - pageY) * zoom * ros_resolution / 100;
					poi.y_ros = parseFloat(poi.y_ros) + delta;
					
					//movableDown.attr('x', dock.x_ros * 100 / ros_resolution - 5);
					//movableDown.attr('y', ros_hauteur - (dock.y_ros * 100 / ros_resolution) - 5); 
					
					x = poi.x_ros * 100 / ros_resolution;
					y = ros_hauteur - (poi.y_ros * 100 / ros_resolution);	
					angle = 0 - poi.t_ros * 180 / Math.PI;
					
					$('#poi_secure_'+movableDown.data('id_poi')).attr('cx', x);
					$('#poi_secure_'+movableDown.data('id_poi')).attr('cy', y); 
					
					$('#poi_robot_'+movableDown.data('id_poi')).attr('cx', x);
					$('#poi_robot_'+movableDown.data('id_poi')).attr('cy', y);
										
					$('#poi_sens_'+movableDown.data('id_poi')).attr('points', (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2));
					$('#poi_sens_'+movableDown.data('id_poi')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					
					//TraceDock(GetDockIndexFromID(movableDown.data('id_station_recharge')));
				    
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
				p = $('#svg image').position();
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
				p = $('#svg image').position();
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
				p = $('#svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentDockPose.x_ros = xRos;
				currentDockPose.y_ros = yRos;
				currentDockPose.t_ros = 0;
				
				TraceCurrentDock(currentDockPose);
			}
			/*
			else if (currentAction == 'addDock' && currentStep=='setDir')
			{
				p = $('#svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentDockPose.t_ros = GetAngleRadian(currentDockPose.x_ros, currentDockPose.y_ros, xRos, yRos) + Math.PI;
								
				TraceCurrentDock(currentDockPose);
			}
			*/
			else if (currentAction == 'addPoi' && currentStep=='setPose')
			{
				p = $('#svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentPoiPose.x_ros = xRos;
				currentPoiPose.y_ros = yRos;
				currentPoiPose.t_ros = 0;
				
				TraceCurrentPoi(currentPoiPose);
			}
			/*
			else if (currentAction == 'addPoi' && currentStep=='setDir')
			{
				p = $('#svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentPoiPose.t_ros = GetAngleRadian(currentPoiPose.x_ros, currentPoiPose.y_ros, xRos, yRos) + Math.PI;
								
				TraceCurrentPoi(currentPoiPose);
			}
			*/
			else if (currentAction == 'addForbiddenArea' && currentStep=='trace')
			{
				e.preventDefault();
				
				//x = e.offsetX;
				//y = $('#mapBox').height() - e.offsetY;
				p = $('#svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				/*
				currentGommePoints[currentGommePoints.length-1].x = xRos;
				currentGommePoints[currentGommePoints.length-1].y = yRos;
				TraceCurrentGomme(currentGommePoints);
				*/
				
				currentForbiddenPoints.pop(); // Point du curseur
				currentForbiddenPoints.push({x:xRos, y:yRos});
				TraceCurrentForbidden(currentForbiddenPoints);
			}
			else if (currentAction == 'addArea' && currentStep=='trace')
			{
				e.preventDefault();
				
				//x = e.offsetX;
				//y = $('#mapBox').height() - e.offsetY;
				p = $('#svg image').position();
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
		}
	});
	
	$('#svg').on('touchend', function(e) {
		touchStarted = false;
		if (downOnMovable)
		{
			downOnMovable = false;
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
			p = $('#svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.x_ros = xRos;
			currentDockPose.y_ros = yRos;
			currentDockPose.t_ros = 0;
			
			TraceCurrentDock(currentDockPose);
			
			
			x = currentDockPose.x_ros * 100 / 5;
			y = currentDockPose.y_ros * 100 / 5;
			
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
			p = $('#svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.t_ros = GetAngleRadian(currentDockPose.x_ros, currentDockPose.y_ros, xRos, yRos) + Math.PI;
							
			TraceCurrentDock(currentDockPose);
			
			$('#boutonsDock #bDockSave').show();
		}
		*/
		else if (currentAction == 'addPoi' && currentStep=='setPose')
		{
			p = $('#svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.x_ros = xRos;
			currentPoiPose.y_ros = yRos;
			currentPoiPose.t_ros = 0;
			
			TraceCurrentPoi(currentPoiPose);
			
			zoom = ros_largeur / $('#svg').width() / window.panZoom.getZoom();		
			p = $('#svg image').position();
			
			
			x = currentPoiPose.x_ros * 100 / 5;
			y = currentPoiPose.y_ros * 100 / 5;
			
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
			p = $('#svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.t_ros = GetAngleRadian(currentPoiPose.x_ros, currentPoiPose.y_ros, xRos, yRos) + Math.PI;
							
			TraceCurrentPoi(currentPoiPose);
			
			$('#boutonsPoi #bPoiSave').show();
		}
		*/
		else if (currentAction == 'addForbiddenArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#mapBox').height() - e.offsetY;
			p = $('#svg image').position();
			
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
			p = $('#svg image').position();
			
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
	});
});

var touchStarted = false;


function InitTaille()
{
}

function RefreshAllPath()
{
}

function RefreshZoomView()
{
	pSVG = $('#svg').position();
	pImg = $('#svg image').position();
	pImg.left -= pSVG.left;
	pImg.top -= pSVG.top;
	
	zoom = ros_largeur / $('#svg').width() / window.panZoom.getZoom();
	
	wZoom = $('#zoom_carte').width();
	hZoom = $('#zoom_carte').height();
	
	wNew = 0;
	hNew = 0;
	tNew = 0;
	lNew = 0;
	
	if (pImg.left > 0)
		lNew = 0;
	else
		lNew = -(pImg.left*zoom) / ros_largeur * wZoom;
	if (pImg.top > 0)
		tNew = 0;
	else
		tNew = -(pImg.top*zoom) / ros_largeur * wZoom;
	
	hNew = $('#svg').height() * zoom  / ros_largeur * wZoom;
	wNew = $('#svg').width() * zoom  / ros_largeur * wZoom;
	
	if (tNew + hNew > hZoom) hNew = hZoom - tNew;
	if (lNew + wNew > wZoom) wNew = wZoom - lNew;
		
	$('#zone_zoom').width(wNew);
	$('#zone_zoom').height(hNew);
				
	$('#zone_zoom').css('top', tNew - 1);
	$('#zone_zoom').css('left', lNew - 1);
	
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
	
	forbiddens[indexInArray].deleted = 1;
	
	AddHistorique({'action':'delete_forbidden', 'data':indexInArray});
	
	data = forbiddens[indexInArray];
	$('#svg .forbidden_elem_'+data.id_area).remove();
	
	RemoveClass('#svg .active', 'active');
	
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
	
	areas[indexInArray].deleted = 1;
	
	AddHistorique({'action':'delete_area', 'data':indexInArray});
	
	data = areas[indexInArray];
	$('#svg .area_elem_'+data.id_area).remove();
	
	RemoveClass('#svg .active', 'active');
	
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
	
	docks[indexInArray].deleted = 1;
	
	AddHistorique({'action':'delete_dock', 'data':indexInArray});
	
	data = docks[indexInArray];
	$('#svg .dock_elem_'+data.id_station_recharge).remove();
	
	RemoveClass('#svg .active', 'active');
	
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
		if (dock.id_station_recharge == id)
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
		if (dock.id_station_recharge == id)
		{
			ret = indexInArray;
			return ret;
		}
	});
	return ret;
}

function DeletePoi(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	pois[indexInArray].deleted = 1;
	
	AddHistorique({'action':'delete_poi', 'data':indexInArray});
	
	data = pois[indexInArray];
	$('#svg .poi_elem_'+data.id_poi).remove();
	
	RemoveClass('#svg .active', 'active');
	
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