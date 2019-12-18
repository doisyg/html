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
	elem = historiques[historiqueIndex];
	switch(elem.action)
	{
		case 'gomme':
			gommes.pop();
			$('.gomme_elem_current_'+gommes.length).remove();
			break;
		case 'add_forbidden':
			forbiddens.pop();
			$('.forbidden_elem_'+elem.data.id_area).remove();
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
			$('.area_elem_'+elem.data.id_area).remove();
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
			$('.dock_elem_'+elem.data.id_station_recharge).remove();
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
			$('.poi_elem_'+elem.data.id_poi).remove();
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
	
	$(document).on('touchstart', '.movable', function(e) {
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
	
	$(document).on('click', '.forbidden_elem', function(e) {
		e.preventDefault();
		
		if ((currentAction == 'addArea' || currentAction == 'addForbiddenArea') && currentStep == 'trace')
		{
		}
		else if (currentAction == 'gomme')
		{
		}
		else if (canChangeMenu)
		{
			RemoveClass('.active', 'active');
			RemoveClass('.activ_select', 'activ_select'); 
			
			
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
			
			AddClass('.forbidden_elem_'+forbidden.id_area, 'active');
		}
		else
			AvertCantChange();
	});
	
	$(document).on('click', '.area_elem', function(e) {
		e.preventDefault();
		
		if ((currentAction == 'addArea' || currentAction == 'addForbiddenArea') && currentStep == 'trace')
		{
		}
		else if (currentAction == 'gomme')
		{
		}
		else if (canChangeMenu)
		{
			RemoveClass('.active', 'active');
			RemoveClass('.activ_select', 'activ_select'); 
			
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'area', 'id':$(this).data('id_area')});	
			HideCurrentMenuNotSelect();
			
			$('#boutonsArea').show();
            $('#boutonsStandard').hide();
			
			$('#boutonsArea #bAreaDelete').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			currentAction = 'editArea';	
			currentStep = '';
			
			currentAreaIndex = GetAreaIndexFromID($(this).data('id_area'));
			area = areas[currentAreaIndex];
			saveCurrentArea = JSON.stringify(area);
			
			AddClass('.area_elem_'+area.id_area, 'active');
		}
		else
			AvertCantChange();
	});
	
	$(document).on('click', '.dock_elem', function(e) {
		e.preventDefault();
		
		if (currentAction == 'addDock')
		{
		}
		else if (currentAction == 'gomme')
		{
		}
		else if (canChangeMenu)
		{
			RemoveClass('.active', 'active');
			RemoveClass('.activ_select', 'activ_select'); 
			
			
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
			
			AddClass('.dock_elem_'+dock.id_station_recharge, 'active');
			AddClass('.dock_elem_'+dock.id_station_recharge, 'movable');
			
		}
		else
			AvertCantChange();
	});
	
	
	$(document).on('click', '.poi_elem', function(e) {
		e.preventDefault();
		
		if (currentAction == 'addPoi')
		{
		}
		else if (currentAction == 'gomme')
		{
		}
		else if (canChangeMenu)
		{
			RemoveClass('.active', 'active');
			RemoveClass('.activ_select', 'activ_select'); 
			
			
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
			
			AddClass('.poi_elem_'+poi.id_poi, 'active');
			AddClass('.poi_elem_'+poi.id_poi, 'movable');
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
			
			RemoveClass('.active', 'active');
			
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
			
			RemoveClass('.active', 'active');
			
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
		
		$('.forbidden_elem_current').remove();
		RemoveClass('.active', 'active');
	
		$('body').addClass('no_current');
		
		if (currentAction == 'addForbiddenArea')
		{
			$('.forbidden_elem_0').remove();
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
		
		$('.area_elem_current').remove();
		
		if (currentAction == 'addArea')
		{
			canChangeMenu = true;
			
			nextIdArea++;
			
			currentAreaPoints.pop();
			a = {'id_area':nextIdArea, 'id_plan':id_plan, 'nom':'', 'comment':'', 'is_forbidden':0, 'couleur_r':87, 'couleur_g':159, 'couleur_b':177, 'deleted':0, 'points':currentAreaPoints};
			AddHistorique({'action':'add_area', 'data':a});
			
			areas.push(a);
			TraceArea(areas.length-1);
			
			RemoveClass('.active', 'active');
			
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
			
			RemoveClass('.active', 'active');
			
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
		
		$('.area_elem_current').remove();
		RemoveClass('.active', 'active');
	
		$('body').addClass('no_current');
		
		if (currentAction == 'addArea')
		{
			$('.area_elem_0').remove();
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
					
					}
			});
		
    });
	
	$('#bDockCreateFromPose').click(function(e) {
		nextIdDock++;
		
		d = {'id_station_recharge':nextIdDock, 'id_plan':id_plan, 'x_ros':0, 'y_ros':0, 't_ros':0, 'num':0};
		AddHistorique({'action':'add_dock', 'data':d});
        docks.push(d);
		TraceDock(docks.length-1);
		console.error('Create dock: get real pose of robot');
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
		
		$('.dock_elem_current').remove();
		
		if (currentAction == 'addDock')
		{
			canChangeMenu = true;
			
			nextIdDock++;
			d = {'id_station_recharge':nextIdDock, 'id_plan':id_plan, 'x_ros':currentDockPose.x_ros, 'y_ros':currentDockPose.y_ros, 't_ros':currentDockPose.t_ros, 'num':0};
			AddHistorique({'action':'add_dock', 'data':d});
			
			docks.push(d);
			TraceDock(docks.length-1);
			
			RemoveClass('.active', 'active');
			
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
			RemoveClass('.dock_elem_'+dock.id_station_recharge, 'movable');
			
			AddHistorique({'action':'edit_dock', 'data':{'index':currentDockIndex, 'old':saveCurrentDock, 'new':JSON.stringify(docks[currentDockIndex])}});
			
			RemoveClass('.active', 'active');
			
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
		
		$('.dock_elem_current').remove();
		RemoveClass('.active', 'active');
	
		$('body').addClass('no_current');
		
		if (currentAction == 'addDock')
		{
			$('.dock_elem_0').remove();
		}
		else if (currentAction == 'editDock')
		{
			dock = docks[currentDockIndex];
			RemoveClass('.dock_elem_'+dock.id_station_recharge, 'movable');
			
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
		p = {'id_poi':nextIdPoi, 'id_plan':id_plan, 'x_ros':0, 'y_ros':0, 't_ros':0, 'name':'POI'};
		AddHistorique({'action':'add_poi', 'data':p});
        pois.push(p);
		TracePoi(pois.length-1);
		console.error('Create POI: get real pose of robot');
        
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
	$('#bPoiSave').click(function(e) {
        e.preventDefault();
		
		if (currentAction == 'addPoi')
		{
			canChangeMenu = true;
			
			nextIdPoi++;
			p = {'id_poi':nextIdPoi, 'id_plan':id_plan, 'x_ros':currentDockPose.x_ros, 'y_ros':currentDockPose.y_ros, 't_ros':currentDockPose.y_ros, 'name':'POI'};
			AddHistorique({'action':'add_poi', 'data':p});
			
			pois.push(d);
			TracePoi(pois.length-1);
			
			RemoveClass('.active', 'active');
			
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
		else if (currentAction == 'editPoi')
		{	
			canChangeMenu = true;
			
			poi = pois[currentPoiIndex];
			RemoveClass('.poi_elem_'+poi.id_poi, 'movable');
			
			AddHistorique({'action':'edit_poi', 'data':{'index':currentPoiIndex, 'old':saveCurrentPoi, 'new':JSON.stringify(pois[currentPoiIndex])}});
			
			RemoveClass('.active', 'active');
			
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
		
		$('.poi_elem_current').remove();
		RemoveClass('.active', 'active');
	
		$('body').addClass('no_current');
		
		if (currentAction == 'addPoi')
		{
			$('.poi_elem_0').remove();
		}
		else if (currentAction == 'editPoi')
		{
			poi = pois[currentPoiIndex];
			RemoveClass('.poi_elem_'+poi.id_poi, 'movable');
			
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
			if (currentAction == 'editPoi')
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
		 if (currentAction == 'editPoi')
		{
			poi = pois[currentPoiIndex];
			poi.t_ros = parseFlot(poi.t_ros) + Math.PI / 90;
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
			if (currentAction == 'editPoi')
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
        if (currentAction == 'editPoi')
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
				gommes[gommes.length-1].push({x:0, y:0}); // Point du curseur
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
			
			currentStep='setDir';
			$('#message_aide').html(textClickOnMapDir);
			
		}
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
			
			currentStep='setDir';
			$('#message_aide').html(textClickOnMapDir);
		}
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
	$('.forbidden_elem_'+data.id_area).remove();
	
	RemoveClass('.active', 'active');
	
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
	$('.area_elem_'+data.id_area).remove();
	
	RemoveClass('.active', 'active');
	
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
	$('.dock_elem_'+data.id_station_recharge).remove();
	
	RemoveClass('.active', 'active');
	
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
	$('.poi_elem_'+data.id_poi).remove();
	
	RemoveClass('.active', 'active');
	
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