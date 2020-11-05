// JavaScript Document
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

var minStokeWidth = 1;
var maxStokeWidth = 5;

var canvas;
var dessin;

var bystepCurrentAction = '';
var currentStep = '';

var currentStepAddPoi = '';
var currentStepAddAugmentedPose = '';

var svgByStep;

var timerRotate = null;

var previewDisplayed = false;
var currentForbiddenIndex = -1;
var saveCurrentForbidden = null;
var currentAreaIndex = -1;
var saveCurrentArea = null;
var currentDockIndex = -1;
var saveCurrentDock = null;
var currentPoiIndex = -1;
var saveCurrentPoi = null;
var currentAugmentedPoseIndex = -1;
var saveCurrentAugmentedPose = null;

var currentDockPose = {};
var currentPoiPose = {};
var currentAugmentedPosePose = {};

var downOnZoomClick = false;
var bystepDownOnSVG = false;
var bystepDownOnSVG_x = 0;
var bystepDownOnSVG_y = 0;
var bystepDownOnSVG_x_scroll = 0;
var bystepDownOnSVG_y_scroll = 0;
var downOnMovable = false;
var movableDown = null;
var currentForbiddenPoints = Array();
var currentAreaPoints = Array();
var currentGommePoints = Array();
var ctrlZ = false;
var previewInProgress = false;
var displayHelpAddShelf = true;

var bystepCanChangeMenu = true;

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

var bystepSavedCanClose = true;

var indexDockElem = 0;
var indexPoiElem = 0;
var indexAugmentedPoseElem = 0;

var boolHelpArea=true;
var boolHelpForbidden=true;
var boolHelpGotoPose=true;

var boolGotopoi=true;
var boolGotodock=true;
var boolGotoaugmentedpose=true;

var poi_temp_add = {};
var augmented_pose_temp_add = {};

var timerCantChange = null;
var sizeGomme = 1;

function ByStepAvertCantChange()
{
	$('#install_by_step_edit_map_bModalCancelEdit').click();
}

function ByStepCloseSelect()
{
	bystepCurrentAction = '';
	currentStep = '';
}

function ByStepHideCurrentMenu()
{
	/*
	if (bystepCurrentAction == 'export') CloseExport();
	if (bystepCurrentAction == 'jobs') CloseJobs();
	if (bystepCurrentAction == 'select') ByStepCloseSelect()
	*/
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	$('body').attr('class', 'no_current');

	bystepCurrentAction = '';
	currentStep = '';
	
	ByStepHideMenus();
}

function ByStepHideCurrentMenuNotSelect()
{
	if (bystepCurrentAction == 'select') return;
	
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	$('body').attr('class', 'no_current');
	
	bystepCurrentAction = '';
	currentStep = '';
	
	ByStepHideMenus();
}

var bystepHistoriques = Array();
var bystepHistoriqueIndex = -1;

function ByStepUndo()
{
	bystepSavedCanClose = false;
	
	elem = bystepHistoriques[bystepHistoriqueIndex];
	switch(elem.action)
	{
		case 'gomme':
			gommes.pop();
			$('#install_by_step_edit_map_svg .gomme_elem_current_'+gommes.length).remove();
			break;
		case 'add_forbidden':
			forbiddens.pop();
			f = JSON.parse(elem.data);
			$('#install_by_step_edit_map_svg .forbidden_elem_'+f.id_area).remove();
			break;
		case 'edit_forbidden':
			forbiddens[elem.data.index] = JSON.parse(elem.data.old);
			ByStepTraceForbidden(elem.data.index);
			break;
		case 'delete_forbidden':
			forbiddens[elem.data].deleted = false;
			ByStepTraceForbidden(elem.data);
			break;
		case 'add_area':
			areas.pop();
			a = JSON.parse(elem.data);
			$('#install_by_step_edit_map_svg .area_elem_'+a.id_area).remove();
			break;
		case 'edit_area':
			areas[elem.data.index] = JSON.parse(elem.data.old);
			ByStepTraceArea(elem.data.index);
			break;
		case 'delete_area':
			areas[elem.data].deleted = false;
			ByStepTraceArea(elem.data);
			break;
		case 'add_dock':
			docks.pop();
			d = JSON.parse(elem.data);
			$('#install_by_step_edit_map_svg .dock_elem_'+d.id_docking_station).remove();
			break;
		case 'edit_dock':
			docks[elem.data.index] = JSON.parse(elem.data.old);
			ByStepTraceDock(elem.data.index);
			break;
		case 'delete_dock':
			docks[elem.data].deleted = false;
			ByStepTraceDock(elem.data);
			break;
		case 'add_poi':
			pois.pop();
			p = JSON.parse(elem.data);
			$('#install_by_step_edit_map_svg .poi_elem_'+p.id_poi).remove();
			break;
		case 'edit_poi':
			pois[elem.data.index] = JSON.parse(elem.data.old);
			ByStepTracePoi(elem.data.index);
			break;
		case 'delete_poi':
			pois[elem.data].deleted = false;
			ByStepTracePoi(elem.data);
			break;
		case 'add_augmented_pose':
			augmented_poses.pop();
			a = JSON.parse(elem.data);
			$('#install_by_step_edit_map_svg .augmented_pose_elem_'+a.id_augmented_pose).remove();
			break;
		case 'edit_augmented_pose':
			augmented_poses[elem.data.index] = JSON.parse(elem.data.old);
			ByStepTraceAugmentedPose(elem.data.index);
			break;
		case 'delete_augmented_pose':
			augmented_poses[elem.data].deleted = false;
			ByStepTraceAugmentedPose(elem.data);
			break;
	}
	bystepHistoriqueIndex--;
	
	ByStepRefreshHistorique();
}

function ByStepRedo()
{
	bystepSavedCanClose = false;
	
	bystepHistoriqueIndex++;
	
	elem = bystepHistoriques[bystepHistoriqueIndex];
	switch(elem.action)
	{
		case 'gomme':
			gommes.push(elem.data);
			ByStepTraceCurrentGomme(gommes[gommes.length-1], gommes.length-1)
			break;
		case 'add_forbidden':
			forbiddens.push(JSON.parse(elem.data));
			ByStepTraceForbidden(forbiddens.length-1);
			break;
		case 'edit_forbidden':
			forbiddens[elem.data.index] = JSON.parse(elem.data.new);
			ByStepTraceForbidden(elem.data.index);
			break;
		case 'delete_forbidden':
			forbiddens[elem.data].deleted = true;
			ByStepTraceForbidden(elem.data);
			break;
		case 'add_area':
			areas.push(JSON.parse(elem.data));
			ByStepTraceArea(areas.length-1);
			break;
		case 'edit_area':
			areas[elem.data.index] = JSON.parse(elem.data.new);
			ByStepTraceArea(elem.data.index);
			break;
		case 'delete_area':
			areas[elem.data].deleted = true;
			ByStepTraceArea(elem.data);
			break;
		case 'add_dock':
			docks.push(elem.data);
			ByStepTraceDock(docks.length-1);
			break;
		case 'edit_dock':
			docks[elem.data.index] = JSON.parse(elem.data.new);
			ByStepTraceDock(elem.data.index);
			break;
		case 'delete_dock':
			docks[elem.data].deleted = true;
			ByStepTraceDock(elem.data);
			break;
		case 'add_poi':
			pois.push(JSON.parse(elem.data));
			ByStepTracePoi(pois.length-1);
			break;
		case 'edit_poi':
			pois[elem.data.index] = JSON.parse(elem.data.new);
			ByStepTracePoi(elem.data.index);
			break;
		case 'delete_poi':
			pois[elem.data].deleted = true;
			ByStepTracePoi(elem.data);
			break;
		case 'add_augmented_pose':
			augmented_poses.push(JSON.parse(elem.data));
			ByStepTraceAugmentedPose(augmented_poses.length-1);
			break;
		case 'edit_augmented_pose':
			augmented_poses[elem.data.index] = JSON.parse(elem.data.new);
			ByStepTraceAugmentedPose(elem.data.index);
			break;
		case 'delete_augmented_pose':
			augmented_poses[elem.data].deleted = true;
			ByStepTraceAugmentedPose(elem.data);
			break;
	}
	
	ByStepRefreshHistorique();
}

function ByStepAddHistorique(elem)
{
	bystepSavedCanClose = false;
	
	while (bystepHistoriqueIndex < bystepHistoriques.length-1)
		bystepHistoriques.pop();
	
	bystepHistoriques.push(elem);
	bystepHistoriqueIndex++;
	
	ByStepRefreshHistorique();
}

function ByStepRefreshHistorique()
{
	if (bystepHistoriqueIndex == -1)
		$('#install_by_step_edit_map_bByStepUndo').addClass('disabled');
	else
		$('#install_by_step_edit_map_bByStepUndo').removeClass('disabled');
	if (bystepHistoriqueIndex == bystepHistoriques.length-1)
		$('#install_by_step_edit_map_bByStepRedo').addClass('disabled');
	else
		$('#install_by_step_edit_map_bByStepRedo').removeClass('disabled');
}

function ByStepSetModeSelect()
{
	$('body').addClass('select');
	bystepCurrentAction = 'select';
	currentStep = '';
}

function ByStepSaveElementNeeded(need)
{
	//ADD CODE POUR CROIX SUR ICON_MENU
	bystepCanChangeMenu = !need;
	if (need)
	{
		$('.times_icon_menu').addClass('dnone')
		$('.times_icon_menu').hide()
		$('#install_by_step_edit_map_bSaveCurrentElem').show();
		$('#install_by_step_edit_map_bCancelCurrentElem').show();
	}
	else
	{
		if($('.icon_menu:visible').length > 0){
			$('.times_icon_menu').removeClass('dnone')
			$('.times_icon_menu').show('fast')
		}
		$('#install_by_step_edit_map_bSaveCurrentElem').hide();
		$('#install_by_step_edit_map_bCancelCurrentElem').hide();
	}
}

$(document).ready(function() {

	window.addEventListener('beforeunload', function(e){
		if (!bystepSavedCanClose)
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
	
	svgByStep = document.querySelector('#install_by_step_edit_map_svg');
	InitSVG();
	
	$('#install_by_step_edit_map #install_by_step_edit_map_bEndGomme').click(function(e) {
        e.preventDefault();
		
		bystepCanChangeMenu = true;
		$('#install_by_step_edit_map_bEndGomme').hide();
		bystepCurrentAction = '';
		currentStep = '';
		$('body').addClass('no_current');
		blockZoom = false;
		ByStepHideMenus();
		ByStepSetModeSelect();
		
    });
	
	$('#install_by_step_edit_map #install_by_step_edit_map_bStop').click(function(e) {
        e.preventDefault();
		
		wycaApi.StopMove();	
    });
	
	$('#install_by_step_edit_map #install_by_step_edit_map_bSaveCurrentElem').click(function(e) {
        e.preventDefault();
		
		if (bystepCurrentAction == 'addPoi' || bystepCurrentAction == 'editPoi')
			PoiSave();
		else if (bystepCurrentAction == 'addAugmentedPose' || bystepCurrentAction == 'editAugmentedPose')
			AugmentedPoseSave();
		else if (bystepCurrentAction == 'addDock' || bystepCurrentAction == 'editDock')
			DockSave();
		else if (bystepCurrentAction == 'addArea' || bystepCurrentAction == 'editArea')
			AreaSave();
		else if (bystepCurrentAction == 'addForbiddenArea' || bystepCurrentAction == 'editForbiddenArea')
			ForbiddenSave();
		
    });
	
	$('#install_by_step_edit_map #install_by_step_edit_map_bCancelCurrentElem').click(function(e) {
        e.preventDefault();
		
		if (bystepCurrentAction == 'addPoi' || bystepCurrentAction == 'editPoi')
			PoiCancel();
		else if (bystepCurrentAction == 'addAugmentedPose' || bystepCurrentAction == 'editAugmentedPose')
			AugmentedPoseCancel();
		else if (bystepCurrentAction == 'addDock' || bystepCurrentAction == 'editDock')
			DockCancel();
		else if (bystepCurrentAction == 'addArea' || bystepCurrentAction == 'editArea')
			AreaCancel();
		else if (bystepCurrentAction == 'addForbiddenArea' || bystepCurrentAction == 'editForbiddenArea')
			ForbiddenCancel();	
		ByStepHideMenus();
    });
	
	$('#install_by_step_edit_map_bByStepUndo').click(function(e) {
        e.preventDefault();
		if (!$('#install_by_step_edit_map_bByStepUndo').hasClass('disabled'))
			ByStepUndo();
	});
	
	$('#install_by_step_edit_map_bByStepUndo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#install_by_step_edit_map_bByStepUndo').hasClass('disabled'))
			ByStepUndo();
	});
	
	$('#install_by_step_edit_map_bByStepRedo').click(function(e) {
        e.preventDefault();
		if (!$('#install_by_step_edit_map_bByStepRedo').hasClass('disabled'))
			ByStepRedo();
    });
	
	$('#install_by_step_edit_map_bByStepRedo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#install_by_step_edit_map_bByStepRedo').hasClass('disabled'))
			ByStepRedo();
	});
	
	$(document).on('touchstart', '#install_by_step_edit_map_svg .movable', function(e) {
		if (bystepCurrentAction != 'gomme')
		{
			touchStarted = true;
			downOnMovable = true;
			movableDown = $(this);
			//bystepDownOnSVG_x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
			//bystepDownOnSVG_y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
			bystepDownOnSVG_x = parseFloat($(this).attr('x')) + parseFloat($(this).attr('width'))/2;
			bystepDownOnSVG_y = parseFloat($(this).attr('y')) + parseFloat($(this).attr('height'))/2;
			
			p = $('#install_by_step_edit_map_svg image').position();
			zoom = ByStepGetZoom();
			
			bystepDownOnSVG_x = bystepDownOnSVG_x / zoom + p.left;
			bystepDownOnSVG_y = bystepDownOnSVG_y / zoom + p.top;
			
			ByStepSaveElementNeeded(true);
			
			blockZoom = true;
		}
    });
	
	$(document).on('touchstart', '#install_by_step_edit_map_svg .secable', function(e) {
		zoom = ByStepGetZoom();
		if (bystepCurrentAction == 'editForbiddenArea' || bystepCurrentAction == 'addForbiddenArea')
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
			ByStepTraceForbidden(currentForbiddenIndex);
			ByStepSaveElementNeeded(true);
		}
		else if (bystepCurrentAction == 'editArea' || bystepCurrentAction == 'addArea')
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
			ByStepTraceArea(currentAreaIndex);
			ByStepSaveElementNeeded(true);
		}
    });
	
	$('#install_by_step_edit_map_menu_point .bDeletePoint').click(function(e) {
        e.preventDefault();
		ByStepHideMenus();
		if (bystepCurrentAction == 'editForbiddenArea' || bystepCurrentAction == 'addbiddenArea')
		{
			forbiddens[currentForbiddenIndex].points.splice(currentPointByStepLongTouch.data('index_point'), 1);
			ByStepTraceForbidden(currentForbiddenIndex);
			ByStepDisplayMenu('install_by_step_edit_map_menu_forbidden');
		}
		else if (bystepCurrentAction == 'editArea' || bystepCurrentAction == 'addArea')
		{
			areas[currentAreaIndex].points.splice(currentPointByStepLongTouch.data('index_point'), 1);
			ByStepTraceArea(currentAreaIndex);
			ByStepDisplayMenu('install_by_step_edit_map_menu_area');
		}
    });
	
	$('#install_by_step_edit_map_menu_forbidden .bDeleteForbidden').click(function(e) {
        e.preventDefault();
		
		ByStepSaveElementNeeded(false);
		ByStepHideMenus();
		if (bystepCurrentAction == "select" || bystepCurrentAction == 'editForbiddenArea')
		{
			i = GetForbiddenIndexFromID(currentForbiddenByStepLongTouch.data('id_area'));
			DeleteForbidden(i);	
		}
    });
	
	$('#install_by_step_edit_map_menu_area .bDeleteArea').click(function(e) {
        e.preventDefault();
		ByStepHideMenus();
		if (bystepCurrentAction == "select" || bystepCurrentAction == 'editArea')
		{
			i = GetAreaIndexFromID(currentAreaByStepLongTouch.data('id_area'));
			DeleteArea(i);	
		}
    });
	
	$('#install_by_step_edit_map_menu_area .bConfigArea').click(function(e) {
        e.preventDefault();
		//ByStepHideMenus();
		if (bystepCurrentAction == "select" || bystepCurrentAction == 'editArea')
		{
			currentAreaIndex = GetAreaIndexFromID(currentAreaByStepLongTouch.data('id_area'));
			area = areas[currentAreaIndex];
			if (area.configs != undefined)
			{
				$.each(area.configs, function( indexConfig, config ) {
					switch(config.name)
					{
						case 'led_color_mode': $('#install_by_step_edit_map_led_color_mode').val(config.value); break;
						case 'led_color': $('#install_by_step_edit_map_led_color').val(config.value); $('#install_by_step_edit_map_led_color').keyup(); break;
						case 'led_animation_mode': $('#install_by_step_edit_map_led_animation_mode').val(config.value); break;
						case 'led_animation': $('#install_by_step_edit_map_led_animation').val(config.value); break;
						case 'max_speed_mode': $('#install_by_step_edit_map_max_speed_mode').val(config.value); break;
						case 'max_speed': $('#install_by_step_edit_map_max_speed').val(config.value); break;
					}
				});
			}
			else
			{
				$('#install_by_step_edit_map_led_color_mode').val('Automatic');
				$('#install_by_step_edit_map_led_animation_mode').val('Automatic');
				$('#install_by_step_edit_map_max_speed_mode').val('Automatic');
			}
			
			$('#install_by_step_edit_map_area_color').val('rgb('+area.color_r+','+area.color_g+','+area.color_b+')'); $('#install_by_step_edit_map_area_color').keyup();
			
			if ($('#install_by_step_edit_map_led_color_mode').val() == 'Automatic') $('#install_by_step_edit_map_led_color_group').hide(); else  $('#install_by_step_edit_map_led_color_group').show();
			if ($('#install_by_step_edit_map_led_animation_mode').val() == 'Automatic') $('#install_by_step_edit_map_led_animation_group').hide(); else  $('#install_by_step_edit_map_led_animation_group').show();
			if ($('#install_by_step_edit_map_max_speed_mode').val() == 'Automatic') $('#install_by_step_edit_map_max_speed_group').hide(); else  $('#install_by_step_edit_map_max_speed_group').show();
			$('#install_by_step_edit_map_container_all .modalAreaOptions').modal('show');
		}
    });
	
	$('#install_by_step_edit_map_menu_dock .bDeleteDock').click(function(e) {
        e.preventDefault();
		ByStepHideMenus();
		i = GetDockIndexFromID(currentDockByStepLongTouch.data('id_docking_station'));
		DeleteDock(i);
    });
	
	$('#install_by_step_edit_map_menu_dock .bConfigDock').click(function(e) {
        e.preventDefault();
		//ByStepHideMenus();
		bystepCurrentAction = 'editDock';
	
		currentDockIndex = GetDockIndexFromID(currentDockByStepLongTouch.data('id_docking_station'));
		dock = docks[currentDockIndex];
		$('#install_by_step_edit_map_dock_is_master').prop('checked', dock.is_master);
		$('#install_by_step_edit_map_dock_number').val(dock.num);
		$('#install_by_step_edit_map_dock_name').val(dock.name);
		$('#install_by_step_edit_map_dock_comment').val(dock.comment);
		
		$('#install_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure li').remove();
		
		if (dock.undock_path.length > 0)
		{
			$.each(dock.undock_path, function( indexConfig, undock_step ) {
	
				console.log(undock_step);
				indexDockElem++;
				
				if (undock_step.linear_distance != 0)
				{				
					distance = undock_step.linear_distance;
					direction = undock_step.linear_distance > 0 ? 'front':'back';
					
					$('#install_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
						'<li id="install_by_step_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="move" data-distance="' + distance + '">'+
						'	<span>Move ' + ((direction == 'back')?'back':'front') + ' ' + ((direction == 'back')?distance*-1:distance) + 'm</span>'+
						'	<a href="#" class="bByStepUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bByStepUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				else
				{	
					angle = undock_step.angular_distance * 180 / Math.PI;
					angle = Math.round(angle*100)/100;
					
					$('#install_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
						'<li id="install_by_step_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="rotate" data-angle="'+angle+'">'+
						'	<span>Rotate '+angle+'°</span>'+
						'	<a href="#" class="bByStepUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bByStepUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				
			});		
		}
		
		$('#install_by_step_edit_map_container_all .modalDockOptions').modal('show');
    });
	
	$('#install_by_step_edit_map .bCancelTestDock').click(function(e) {boolGotodock=false});
	
	$('#install_by_step_edit_map .bTestDock').click(function(e) {
        e.preventDefault();
		
		if (currentDockByStepLongTouch.data('id_docking_station') >= 300000){
			boolGotodock = true;
			statusSavingMapBeforeTestDock=1;
			timerSavingMapBeforeTestDock=0;
			$('#install_by_step_edit_map_modalDoSaveBeforeTestDock').modal('show');
			TimerSavingMapBeforeTest('dock'); // LAUNCH ANIM PROGRESS BAR
			
			id_dock_test = currentDockByStepLongTouch.data('id_docking_station');
			i = GetDockIndexFromID(currentDockByStepLongTouch.data('id_docking_station'));
			name = docks[i].name;
			
			data = GetDataMapToSave();
			gotoTest = false;
			
			wycaApi.SetCurrentMapData(data, function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					if(gommes.length == 0){
						wycaApi.GetCurrentMapData(function(data) {
							if (data.A == wycaApi.AnswerCode.NO_ERROR){
								console.log('Map Data Saved');
								statusSavingMapBeforeTestDock=2; //STOP ANIM PROGRESS BAR
								/*
								id_map = data.D.id_map;
								id_map_last = data.D.id_map;
								*/
								forbiddens = data.D.forbiddens;
								areas = data.D.areas;
								gommes = Array();
								docks = data.D.docks;
								pois = data.D.pois;
								augmented_poses = data.D.augmented_poses;
								/*
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
								*/
								bystepHistoriques = Array();
								bystepHistoriqueIndex = -1;
								ByStepRefreshHistorique();
								
								ByStepInitMap();
								ByStepResizeSVG();
								
								// On recherche le nouveau dock créé avec le bon id
								if (id_dock_test >= 300000)
								{
									$.each(docks, function( index, dock ) {
										
										if (dock.name == name)
										{
											currentDockByStepLongTouch = $('#install_by_step_edit_map_dock_'+dock.id_docking_station);
											setTimeout(function(){$('#install_by_step_edit_map_modalDoSaveBeforeTestDock').modal('hide')},1500);
											if(boolGotodock){
												$('#install_by_step_edit_map .bTestDock').click();
											}
										}
									});
								}
							}
							else
							{
								$('#install_by_step_edit_map_modalDoSaveBeforeTestDock').modal('hide')
								alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
							}
						});
					}else{ 
						// SI GOMMES TO SAVE
						wycaApi.GetCurrentMapComplete(function(data) {
							if (data.A == wycaApi.AnswerCode.NO_ERROR){
								console.log('Map Complete Saved');
								statusSavingMapBeforeTestDock=2; //STOP ANIM PROGRESS BAR
								
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
								
								bystepHistoriques = Array();
								bystepHistoriqueIndex = -1;
								ByStepRefreshHistorique();
								
								ByStepInitMap();
								ByStepResizeSVG();
								
								// On recherche le nouveau dock créé avec le bon id
								if (id_dock_test >= 300000)
								{
									$.each(docks, function( index, dock ) {
										
										if (dock.name == name)
										{
											currentDockByStepLongTouch = $('#install_by_step_edit_map_dock_'+dock.id_docking_station);
											setTimeout(function(){$('#install_by_step_edit_map_modalDoSaveBeforeTestDock').modal('hide')},1500);
											if(boolGotodock){
												$('#install_by_step_edit_map .bTestDock').click();
											}
										}
									});
								}
							}
							else
							{
								$('#install_by_step_edit_map_modalDoSaveBeforeTestDock').modal('hide')
								alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
							}
						});
					}
				}else{
					$('#install_by_step_edit_map_modalDoSaveBeforeTestDock').modal('hide');
					alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
				}
			});

		}
		else
		{
			//ByStepHideMenus();
			
			wycaApi.on('onGoToChargeResult', function (data){
				$('#install_by_step_edit_map_bStop').hide();
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#install_by_step_edit_map .modalFinTest section.panel-success').show();
					$('#install_by_step_edit_map .modalFinTest section.panel-danger').hide();
					$('#install_by_step_edit_map .modalFinTest section.panel-warning').hide();
				}
				else
				{	
					if(data.A == wycaApi.AnswerCode.CANCELED){
						$('#install_by_step_edit_map .modalFinTest section.panel-success').hide();
						$('#install_by_step_edit_map .modalFinTest section.panel-danger').hide();
						$('#install_by_step_edit_map .modalFinTest section.panel-warning').show();
						
						$('#install_by_step_edit_map .modalFinTest section.panel-warning .error_details').html(wycaApi.AnswerCodeToString(data.A));
					}else{
						
						$('#install_by_step_edit_map .modalFinTest section.panel-success').hide();
						$('#install_by_step_edit_map .modalFinTest section.panel-danger').show();
						$('#install_by_step_edit_map .modalFinTest section.panel-warning').hide();
						
						if (data.M != '')
							if(data.M.length > 50)
								$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br><span>' +data.M+ '</span>');
							else
								$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
						else
							$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
					}
				}
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToChargeResult', onGoToChargeResult);
				
				$('#install_by_step_edit_map .modalFinTest').modal('show');
			});
			wycaApi.GoToCharge(currentDockByStepLongTouch.data('id_docking_station'), function (data){
				
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#install_by_step_edit_map_bStop').show();
				}
				else
				{
					
					$('#install_by_step_edit_map .modalFinTest section.panel-success').hide();
					$('#install_by_step_edit_map .modalFinTest section.panel-warning').hide();
					$('#install_by_step_edit_map .modalFinTest section.panel-danger').show();
					
					if (data.M != '')
						$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
					
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToChargeResult', onGoToChargeResult);
					
					$('#install_by_step_edit_map .modalFinTest').modal('show');
				}
			});
		}
    });
	
	$('#install_by_step_edit_map_menu_poi .bDeletePoi').click(function(e) {
        e.preventDefault();
		ByStepHideMenus();
		i = GetPoiIndexFromID(currentPoiByStepLongTouch.data('id_poi'));
		DeletePoi(i);
    });
	
	$('#install_by_step_edit_map_menu_poi .bConfigPoi').click(function(e) {
        e.preventDefault();
		//ByStepHideMenus();
		bystepCurrentAction = 'editPoi';
	
		currentPoiIndex = GetPoiIndexFromID(currentPoiByStepLongTouch.data('id_poi'));
		poi = pois[currentPoiIndex];
		
		$('#install_by_step_edit_map_poi_name').val(poi.name);
		$('#install_by_step_edit_map_poi_comment').val(poi.comment);
		
		$('#install_by_step_edit_map_container_all .modalPoiOptions .list_undock_procedure_poi li').remove();
		
		/* POI PAS UNDOCK PATH
		if (poi.undock_path.length > 0)
		{
			$.each(poi.undock_path, function( indexConfig, undock_step ) {
	
				console.log(undock_step);
				indexPoiElem++;
				
				if (undock_step.linear_distance != 0)
				{				
					distance = undock_step.linear_distance;
					direction = undock_step.linear_distance > 0 ? 'front':'back';
					
					$('#install_by_step_edit_map_container_all .modalPoiOptions .list_undock_procedure_poi').append('' +
						'<li id="install_by_step_edit_map_list_undock_procedure_poi_elem_'+indexPoiElem+'" data-index_poi_procedure="'+indexPoiElem+'" data-action="move" data-distance="' + distance + '">'+
						'	<span>Move ' + ((direction == 'back')?'back':'front') + ' ' + ((direction == 'back')?distance*-1:distance) + 'm</span>'+
						'	<a href="#" class="bByStepUndockProcedurePoiDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bByStepUndockProcedurePoiEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				else
				{	
					angle = undock_step.angular_distance * 180 / Math.PI;
					angle = Math.round(angle*100)/100;
					
					$('#install_by_step_edit_map_container_all .modalPoiOptions .list_undock_procedure_poi').append('' +
						'<li id="install_by_step_edit_map_list_undock_procedure_poi_elem_'+indexPoiElem+'" data-index_poi_procedure="'+indexPoiElem+'" data-action="rotate" data-angle="'+angle+'">'+
						'	<span>Rotate '+angle+'°</span>'+
						'	<a href="#" class="bByStepUndockProcedurePoiDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bByStepUndockProcedurePoiEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				
			});
		}
		*/
		$('#install_by_step_edit_map_container_all .modalPoiOptions').modal('show');
		
    });
	
	$('#install_by_step_edit_map .bCancelTestPoi').click(function(e) {boolGotopoi=false});
	
	$('#install_by_step_edit_map .bTestPoi').click(function(e) {
        e.preventDefault();
		
		if (currentPoiByStepLongTouch.data('id_poi') >= 300000){
			boolGotopoi = true;
			statusSavingMapBeforeTestPoi=1;
			timerSavingMapBeforeTestPoi=0;
			$('#install_by_step_edit_map_modalDoSaveBeforeTestPoi').modal('show');
			TimerSavingMapBeforeTest('poi'); // LAUNCH ANIM PROGRESS BAR
			
			id_poi_test = currentPoiByStepLongTouch.data('id_poi');
			i = GetPoiIndexFromID(currentPoiByStepLongTouch.data('id_poi'));
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
								/*
								id_map = data.D.id_map;
								id_map_last = data.D.id_map;
								*/
								forbiddens = data.D.forbiddens;
								areas = data.D.areas;
								gommes = Array();
								docks = data.D.docks;
								pois = data.D.pois;
								augmented_poses = data.D.augmented_poses;
								/*
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
								*/
								bystepHistoriques = Array();
								bystepHistoriqueIndex = -1;
								ByStepRefreshHistorique();
								
								ByStepInitMap();
								ByStepResizeSVG();
								
								// On recherche le nouveau poi créé avec le bon id
								if (id_poi_test >= 300000)
								{
									$.each(pois, function( index, poi ) {
										
										if (poi.name == name)
										{
											currentPoiByStepLongTouch = $('#install_by_step_edit_map_poi_robot_'+poi.id_poi);
											setTimeout(function(){$('#install_by_step_edit_map_modalDoSaveBeforeTestPoi').modal('hide')},1500);
											if(boolGotopoi){
												$('#install_by_step_edit_map .bTestPoi').click();
											}
										}
									});
								}
								
							}
							else
							{
								$('#install_by_step_edit_map_modalDoSaveBeforeTestPoi').modal('hide')
								alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
							}
						});
					}else{
						// SI GOMMES TO SAVE
						wycaApi.GetCurrentMapComplete(function(data) {
							if (data.A == wycaApi.AnswerCode.NO_ERROR){
								console.log('Map Complete Saved');
								statusSavingMapBeforeTestPoi=2; //STOP ANIM PROGRESS BAR
								
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
								
								bystepHistoriques = Array();
								bystepHistoriqueIndex = -1;
								ByStepRefreshHistorique();
								
								ByStepInitMap();
								ByStepResizeSVG();
								
								// On recherche le nouveau poi créé avec le bon id
								if (id_poi_test >= 300000)
								{
									$.each(pois, function( index, poi ) {
										
										if (poi.name == name)
										{
											currentPoiByStepLongTouch = $('#install_by_step_edit_map_poi_robot_'+poi.id_poi);
											setTimeout(function(){$('#install_by_step_edit_map_modalDoSaveBeforeTestPoi').modal('hide')},1500);
											if(boolGotopoi){
												$('#install_by_step_edit_map .bTestPoi').click();
											}
										}
									});
								}
								
							}
							else
							{
								$('#install_by_step_edit_map_modalDoSaveBeforeTestPoi').modal('hide')
								alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
							}
						});
					}
				}else{
					$('#install_by_step_edit_map_modalDoSaveBeforeTestPoi').modal('hide');
					alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
				}
			});

		}
		else
		{
			//ByStepHideMenus();
			
			wycaApi.on('onGoToPoiResult', function (data){
				$('#install_by_step_edit_map_bStop').hide();
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#install_by_step_edit_map .modalFinTest section.panel-success').show();
					$('#install_by_step_edit_map .modalFinTest section.panel-danger').hide();
					$('#install_by_step_edit_map .modalFinTest section.panel-warning').hide();
				}
				else
				{	
					if(data.A == wycaApi.AnswerCode.CANCELED){
						$('#install_by_step_edit_map .modalFinTest section.panel-success').hide();
						$('#install_by_step_edit_map .modalFinTest section.panel-danger').hide();
						$('#install_by_step_edit_map .modalFinTest section.panel-warning').show();
						
						$('#install_by_step_edit_map .modalFinTest section.panel-warning .error_details').html(wycaApi.AnswerCodeToString(data.A));
					}else{
						
						$('#install_by_step_edit_map .modalFinTest section.panel-success').hide();
						$('#install_by_step_edit_map .modalFinTest section.panel-danger').show();
						$('#install_by_step_edit_map .modalFinTest section.panel-warning').hide();
						
						if (data.M != '')
							if(data.M.length > 50)
								$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br><span>' +data.M+ '</span>');
							else
								$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
						else
							$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
					}
				}
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToPoiResult', onGoToPoiResult);
			
				$('#install_by_step_edit_map .modalFinTest').modal('show');
			});
			
			wycaApi.GoToPoi(currentPoiByStepLongTouch.data('id_poi'), function (data){
				
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#install_by_step_edit_map_bStop').show();
				}
				else
				{
					$('#install_by_step_edit_map .modalFinTest section.panel-success').hide();
					$('#install_by_step_edit_map .modalFinTest section.panel-danger').show();
					$('#install_by_step_edit_map .modalFinTest section.panel-warning').hide();
					
					if (data.M != '')
						$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
				
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoiResult', onGoToPoiResult);
					
					$('#install_by_step_edit_map .modalFinTest').modal('show');
				}
			});
		}
    });
	
	$('#install_by_step_edit_map_menu_augmented_pose .bDeleteAugmentedPose').click(function(e) {
        e.preventDefault();
		ByStepHideMenus();
		i = GetAugmentedPoseIndexFromID(currentAugmentedPoseByStepLongTouch.data('id_augmented_pose'));
		DeleteAugmentedPose(i);
    });
	
	$('#install_by_step_edit_map_menu_augmented_pose .bConfigAugmentedPose').click(function(e) {
        e.preventDefault();
		//ByStepHideMenus();
		bystepCurrentAction = 'editAugmentedPose';
	
		currentAugmentedPoseIndex = GetAugmentedPoseIndexFromID(currentAugmentedPoseByStepLongTouch.data('id_augmented_pose'));
		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		
		$('#install_by_step_edit_map_augmented_pose_name').val(augmented_pose.name);
		$('#install_by_step_edit_map_augmented_pose_comment').val(augmented_pose.comment);
		
		$('#install_by_step_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose li').remove();
		
		if (augmented_pose.undock_path.length > 0)
		{
			$.each(augmented_pose.undock_path, function( indexConfig, undock_step ) {
	
				console.log(undock_step);
				indexAugmentedPoseElem++;
				
				if (undock_step.linear_distance != 0)
				{				
					distance = undock_step.linear_distance;
					direction = undock_step.linear_distance > 0 ? 'front':'back';
					
					$('#install_by_step_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
						'<li id="install_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="move" data-distance="' + distance + '">'+
						'	<span>Move ' + ((direction == 'back')?'back':'front') + ' ' + ((direction == 'back')?distance*-1:distance) + 'm</span>'+
						'	<a href="#" class="bByStepUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bByStepUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				else
				{	
					angle = undock_step.angular_distance * 180 / Math.PI;
					angle = Math.round(angle*100)/100;
					
					$('#install_by_step_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
						'<li id="install_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="rotate" data-angle="'+angle+'">'+
						'	<span>Rotate '+angle+'°</span>'+
						'	<a href="#" class="bByStepUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bByStepUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				
			});
		}
		
		$('#install_by_step_edit_map_container_all .modalAugmentedPoseOptions').modal('show');
		
    });
	
	$('#install_by_step_edit_map .bCancelTestAugmentedPose').click(function(e){boolGotoaugmentedpose=false });
	
	$('#install_by_step_edit_map .bTestAugmentedPose').click(function(e) {
        e.preventDefault();
		
		if (currentAugmentedPoseByStepLongTouch.data('id_augmented_pose') >= 300000){
			boolGotoaugmentedpose = true;
			statusSavingMapBeforeTestAugmentedPose=1;
			timerSavingMapBeforeTestAugmentedPose=0;
			$('#install_by_step_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('show');
			TimerSavingMapBeforeTest('augmented_pose');  // LAUNCH ANIM PROGRESS BAR
			
			id_augmented_pose_test = currentAugmentedPoseByStepLongTouch.data('id_augmented_pose');
			i = GetAugmentedPoseIndexFromID(currentAugmentedPoseByStepLongTouch.data('id_augmented_pose'));
			name = augmented_poses[i].name;
			
			data = GetDataMapToSave();
			gotoTest = false;
			
			wycaApi.SetCurrentMapData(data, function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){	
					if(gommes.length == 0){
						wycaApi.GetCurrentMapData(function(data) {
							if (data.A == wycaApi.AnswerCode.NO_ERROR){
								console.log('Map Data Saved');
								statusSavingMapBeforeTestAugmentedPose=2; //STOP ANIM PROGRESS BAR
								/*
								id_map = data.D.id_map;
								id_map_last = data.D.id_map;
								*/
								forbiddens = data.D.forbiddens;
								areas = data.D.areas;
								gommes = Array();
								docks = data.D.docks;
								pois = data.D.pois;
								augmented_poses = data.D.augmented_poses;
								/*
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
								*/
								bystepHistoriques = Array();
								bystepHistoriqueIndex = -1;
								ByStepRefreshHistorique();
								
								ByStepInitMap();
								ByStepResizeSVG();
								
								// On recherche le nouveau augmented_pose créé avec le bon id
								if (id_augmented_pose_test >= 300000)
								{
									$.each(augmented_poses, function( index, augmented_pose ) {
										
										if (augmented_pose.name == name)
										{
											currentAugmentedPoseByStepLongTouch = $('#install_by_step_edit_map_augmented_pose_robot_'+augmented_pose.id_augmented_pose);
											setTimeout(function(){$('#install_by_step_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('hide')},1500);
											if(boolGotoaugmentedpose){
												$('#install_by_step_edit_map .bTestAugmentedPose').click();
											}
										}
									});
								}
							}
							else
							{
								$('#install_by_step_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('hide')
								alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
							}
						});
					}else{
						// SI GOMMES TO SAVE
						wycaApi.GetCurrentMapComplete(function(data) {
							if (data.A == wycaApi.AnswerCode.NO_ERROR){
								console.log('Map Complete Saved');
								statusSavingMapBeforeTestAugmentedPose=2; //STOP ANIM PROGRESS BAR
								
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
								
								bystepHistoriques = Array();
								bystepHistoriqueIndex = -1;
								ByStepRefreshHistorique();
								
								ByStepInitMap();
								ByStepResizeSVG();
								
								// On recherche le nouveau augmented_pose créé avec le bon id
								if (id_augmented_pose_test >= 300000)
								{
									$.each(augmented_poses, function( index, augmented_pose ) {
										
										if (augmented_pose.name == name)
										{
											currentAugmentedPoseByStepLongTouch = $('#install_by_step_edit_map_augmented_pose_robot_'+augmented_pose.id_augmented_pose);
											setTimeout(function(){$('#install_by_step_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('hide')},1500);
											if(boolGotoaugmentedpose){
												$('#install_by_step_edit_map .bTestAugmentedPose').click();
											}
										}
									});
								}
							}
							else
							{
								$('#install_by_step_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('hide')
								alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
							}
						});
					}		
				}else{
					$('#install_by_step_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('hide');
					alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
				}
			});
			
		}
		else
		{
			//ByStepHideMenus();
			
			wycaApi.on('onGoToAugmentedPoseResult', function (data){
				$('#install_by_step_edit_map_bStop').hide();
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#install_by_step_edit_map .modalFinTest section.panel-success').show();
					$('#install_by_step_edit_map .modalFinTest section.panel-danger').hide();
					$('#install_by_step_edit_map .modalFinTest section.panel-warning').hide();
				}
				else
				{	
					if(data.A == wycaApi.AnswerCode.CANCELED){
						$('#install_by_step_edit_map .modalFinTest section.panel-success').hide();
						$('#install_by_step_edit_map .modalFinTest section.panel-danger').hide();
						$('#install_by_step_edit_map .modalFinTest section.panel-warning').show();
						
						$('#install_by_step_edit_map .modalFinTest section.panel-warning .error_details').html(wycaApi.AnswerCodeToString(data.A));
					}else{
						
						$('#install_by_step_edit_map .modalFinTest section.panel-success').hide();
						$('#install_by_step_edit_map .modalFinTest section.panel-danger').show();
						$('#install_by_step_edit_map .modalFinTest section.panel-warning').hide();
						
						if (data.M != '')
							if(data.M.length > 50)
								$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br><span>' +data.M+ '</span>');
							else
								$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
						else
							$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
					}
				}
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
			
				$('#install_by_step_edit_map .modalFinTest').modal('show');
			});
			
			wycaApi.GoToAugmentedPose(currentAugmentedPoseByStepLongTouch.data('id_augmented_pose'), function (data){
				
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#install_by_step_edit_map_bStop').show();
				}
				else
				{
					$('#install_by_step_edit_map .modalFinTest section.panel-success').hide();
					$('#install_by_step_edit_map .modalFinTest section.panel-warning').hide();
					$('#install_by_step_edit_map .modalFinTest section.panel-danger').show();
					
					if (data.M != '')
						$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
				
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
					
					$('#install_by_step_edit_map .modalFinTest').modal('show');
				}
			});
		}
    });
	
	$('#install_by_step_edit_map_svg').on('contextmenu', function (e) {
		
		if (bystepCurrentAction == 'gomme' && currentStep=='trace')
		{
			currentStep = '';
			currentGommePoints.pop(); // Point du curseur
			ByStepTraceCurrentGomme(currentGommePoints);
			return false;
			
		}
		/*
		else if (bystepCurrentAction == 'addForbiddenArea' && currentStep=='trace')
		{
			currentStep = '';
			currentForbiddenPoints.pop(); // Point du curseur
			ByStepTraceCurrentForbidden(currentForbiddenPoints);
			return false;
		}
		else if (bystepCurrentAction == 'addArea' && currentStep=='trace')
		{
			currentStep = '';
			currentAreaPoints.pop(); // Point du curseur
			ByStepTraceCurrentArea(currentAreaPoints);
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
					
			//zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
			zoom = ByStepGetZoom();
			
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
				
		//zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
		zoom = ByStepGetZoom();
		
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
				
		//zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
		zoom = ByStepGetZoom();
		
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
					
			//zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
			zoom = ByStepGetZoom();
			
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
		
		if ((bystepCurrentAction == 'addArea' || bystepCurrentAction == 'addForbiddenArea') && currentStep == 'trace')
		{
		}
		else if (bystepCurrentAction == 'gomme')
		{
		}
		else if (bystepCanChangeMenu)
		{
			RemoveClass('#install_by_step_edit_map_svg .active', 'active');
			RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'forbidden', 'id':$(this).data('id_area')});	
			
			$('#install_by_step_edit_map_boutonsForbidden').show();
            $('#install_by_step_edit_map_boutonsStandard').hide();
			
			$('#install_by_step_edit_map_boutonsForbidden #install_by_step_edit_map_bForbiddenDelete').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			currentForbiddenByStepLongTouch = $(this);
			//MENU FORBIDDEN DISPLAY
			if (bystepCurrentAction != 'editForbiddenArea' && bystepCurrentAction != 'addForbiddenArea')
			{
				ByStepHideCurrentMenuNotSelect();
				ByStepDisplayMenu('install_by_step_edit_map_menu_forbidden');
			}
			
			bystepCurrentAction = 'editForbiddenArea';	
			currentStep = '';
			
			currentForbiddenIndex = GetForbiddenIndexFromID($(this).data('id_area'));
			forbidden = forbiddens[currentForbiddenIndex];
			saveCurrentForbidden = JSON.stringify(forbidden);
			
			AddClass('#install_by_step_edit_map_svg .forbidden_elem_'+forbidden.id_area, 'active');
		}
		else
			ByStepAvertCantChange();
	});
	
	$(document).on('click', '#install_by_step_edit_map_svg .area_elem', function(e) {
		e.preventDefault();
		
		if ((bystepCurrentAction == 'addArea' || bystepCurrentAction == 'addForbiddenArea') && currentStep == 'trace')
		{
		}
		else if (bystepCurrentAction == 'gomme')
		{
		}
		else if (bystepCanChangeMenu)
		{
			RemoveClass('#install_by_step_edit_map_svg .active', 'active');
			RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'area', 'id':$(this).data('id_area')});	
			
			$('#install_by_step_edit_map_boutonsArea').show();
            $('#install_by_step_edit_map_boutonsStandard').hide();
			
			$('#install_by_step_edit_map_boutonsArea #install_by_step_edit_map_bAreaDelete').show();
			$('#install_by_step_edit_map_boutonsArea #install_by_step_edit_map_bAreaOptions').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			currentAreaByStepLongTouch=$(this);
			//MENU AREA DISPLAY
			if (bystepCurrentAction != 'editArea')
			{
				ByStepHideCurrentMenuNotSelect();
				ByStepDisplayMenu('install_by_step_edit_map_menu_area');
			}
			
			bystepCurrentAction = 'editArea';	
			currentStep = '';
			
			currentAreaIndex = GetAreaIndexFromID($(this).data('id_area'));
			area = areas[currentAreaIndex];
			saveCurrentArea = JSON.stringify(area);
			
			AddClass('#install_by_step_edit_map_svg .area_elem_'+area.id_area, 'active');
		}
		else
			ByStepAvertCantChange();
	});
	
	$(document).on('click', '#install_by_step_edit_map_svg .dock_elem', function(e) {
		e.preventDefault();
		
		if (bystepCurrentAction == 'addDock')
		{
		}
		else if (bystepCurrentAction == 'gomme')
		{
		}
		else if (bystepCanChangeMenu)
		{
			RemoveClass('#install_by_step_edit_map_svg .active', 'active');
			RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'dock', 'id':$(this).data('id_docking_station')});	
			
			$('#install_by_step_edit_map_boutonsDock').show();
            $('#install_by_step_edit_map_boutonsStandard').hide();
			
			$('#install_by_step_edit_map_boutonsDock a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			currentDockByStepLongTouch=$(this);
			console.log(bystepCurrentAction);
			//MENU DOCK DISPLAY
			if (bystepCurrentAction != 'editDock' && bystepCurrentAction != 'addDock')
			{
				ByStepHideCurrentMenuNotSelect();
				ByStepDisplayMenu('install_by_step_edit_map_menu_dock');
			}
			
			bystepCurrentAction = 'editDock';	
			currentStep = '';
			
			currentDockIndex = GetDockIndexFromID($(this).data('id_docking_station'));
			dock = docks[currentDockIndex];
			saveCurrentDock = JSON.stringify(dock);
			
			AddClass('#install_by_step_edit_map_svg .dock_elem_'+dock.id_docking_station, 'active');
			//AddClass('#install_by_step_edit_map_svg .dock_elem_'+dock.id_docking_station, 'movable');	// Dock non movable
			
		}
		else
			ByStepAvertCantChange();
	});
	
	$(document).on('click', '#install_by_step_edit_map_svg .poi_elem', function(e) {
		e.preventDefault();
		
		if (bystepCurrentAction == 'addPoi')
		{
		}
		else if (bystepCurrentAction == 'gomme')
		{
		}
		else if (bystepCanChangeMenu)
		{
			RemoveClass('#install_by_step_edit_map_svg .active', 'active');
			RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
			RemoveClass('#install_by_step_edit_map_svg .poi_elem', 'movable');
						
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'poi', 'id':$(this).data('id_poi')});	
			
			$('#install_by_step_edit_map_boutonsPoi').show();
			
            $('#install_by_step_edit_map_boutonsStandard').hide();
			
			$('#install_by_step_edit_map_boutonsPoi a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			currentPoiByStepLongTouch = $(this);
			//MENU POI DISPLAY
			if (bystepCurrentAction != 'editPoi' && bystepCurrentAction != 'addPoi')
			{
				ByStepHideCurrentMenuNotSelect();
				ByStepDisplayMenu('install_by_step_edit_map_menu_poi');
			}
			
			bystepCurrentAction = 'editPoi';	
			currentStep = '';
			
			currentPoiIndex = GetPoiIndexFromID($(this).data('id_poi'));
			poi = pois[currentPoiIndex];
			saveCurrentPoi = JSON.stringify(poi);
			
			AddClass('#install_by_step_edit_map_svg .poi_elem_'+poi.id_poi, 'active');
			if (poi.id_fiducial < 1) // Movable que si il n'est pas lié à un reflecteur
				AddClass('#install_by_step_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		}
		else
			ByStepAvertCantChange();
	});
	
	$(document).on('click', '#install_by_step_edit_map_svg .augmented_pose_elem', function(e) {
		e.preventDefault();
		
		if (bystepCurrentAction == 'addAugmentedPose')
		{
		}
		else if (bystepCurrentAction == 'gomme')
		{
		}
		else if (bystepCanChangeMenu)
		{
			RemoveClass('#install_by_step_edit_map_svg .active', 'active');
			RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
			RemoveClass('#install_by_step_edit_map_svg .augmented_pose_elem', 'movable');
						
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'augmented_pose', 'id':$(this).data('id_augmented_pose')});	
			
			$('#install_by_step_edit_map_boutonsAugmentedPose').show();
			
            $('#install_by_step_edit_map_boutonsStandard').hide();
			
			$('#install_by_step_edit_map_boutonsAugmentedPose a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			currentAugmentedPoseByStepLongTouch=$(this);
			//MENU AUGMENTED POSE DISPLAY
			if (bystepCurrentAction != 'editAugmentedPose' && bystepCurrentAction != 'addAugmentedPose')
			{
				ByStepHideCurrentMenuNotSelect();
				ByStepDisplayMenu('install_by_step_edit_map_menu_augmented_pose');
			}
			
			bystepCurrentAction = 'editAugmentedPose';	
			currentStep = '';
			
			currentAugmentedPoseIndex = GetAugmentedPoseIndexFromID($(this).data('id_augmented_pose'));
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			saveCurrentAugmentedPose = JSON.stringify(augmented_pose);
			
			AddClass('#install_by_step_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'active');
			if (augmented_pose.id_fiducial < 1) // Movable que si il n'est pas lié à un reflecteur
				AddClass('#install_by_step_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'movable');
		}
		else
			ByStepAvertCantChange();
	});
	
	/**************************/
	/*  Click on element      */
	/**************************/
	$('#install_by_step_edit_map_menu .bMoveTo').click(function(e) {
        e.preventDefault();
		ByStepHideMenus();
		if (bystepCanChangeMenu)
		{
			//CURRENT ACTION TARGET
			bystepCurrentAction = 'prepareGotoPose';
			bystepCanChangeMenu = false;
			//AJOUT ICON MENU + CROIX
			$('.burger_menu').hide('fast');
			$('.icon_menu[data-menu="install_by_step_edit_map_menu_gotopose"]').show('fast');
			setTimeout(function(){$('.times_icon_menu').show('fast')},50);
			
			if(boolHelpGotoPose){
				$('.modalHelpClickGotoPose').modal('show');
			}			
		}
		else
			ByStepAvertCantChange();
		
    });
	
	$('#install_by_step_edit_map .bHelpClickGotoPoseOk').click(function(){boolHelpGotoPose = !$('#checkboxHelpGotopose').prop('checked')});//ADD SAVING BDD / COOKIES ?
	
	$('#install_by_step_edit_map_menu .bGomme').click(function(e) {
        e.preventDefault();
		ByStepHideMenus();
		/*
		if ($('#install_by_step_edit_map_bGomme').hasClass('btn-primary'))
		{
			blockZoom = false;
			
			ByStepHideCurrentMenu();
			
			$('#install_by_step_edit_map_bGomme').removeClass('btn-primary');
		
			bystepCurrentAction = '';	
			currentStep = '';
			
			$('body').addClass('no_current');
			$('body').removeClass('gomme');
			
			//currentGommePoints = Array();
		
			ByStepSaveElementNeeded(true);
		}
		else
		{
			*/
			blockZoom = true;
			
			if (bystepCanChangeMenu)
			{
				ByStepHideCurrentMenu();
				ByStepDisplayMenu('install_by_step_edit_map_menu_erase');
				sizeGomme = $('#install_by_step_edit_map_menu_erase .bGommeSize.selected').data('size');
				bystepCurrentAction = 'gomme';	
				currentStep = '';
				
				$('body').removeClass('no_current');
				$('body').addClass('gomme');
				
			}
			else
				ByStepAvertCantChange();
		//}
    });
	
	$('#install_by_step_edit_map_menu_erase .bGommeSize').click(function(e) {
        e.preventDefault();
		$('#install_by_step_edit_map_menu_erase .bGommeSize').removeClass('selected');
		sizeGomme = $(this).data('size');
		$(this).addClass('selected');
		
    });
	
	$('#install_by_step_edit_map_menu .bAddForbiddenArea').click(function(e) {
        e.preventDefault();
		ByStepHideMenus();
		if (bystepCanChangeMenu)
		{
			
			//CURRENT ACTION TARGET
			bystepCurrentAction = 'prepareForbiddenArea';
			bystepCanChangeMenu = false;
			//AJOUT ICON MENU + CROIX
			$('.burger_menu').hide('fast');
			$('.icon_menu[data-menu="install_by_step_edit_map_menu_forbidden"]').show('fast');
			setTimeout(function(){$('.times_icon_menu').show('fast')},50);
			
			if(boolHelpForbidden){
				$('.modalHelpClickForbidden').modal('show');
			}			
		}
		else
			ByStepAvertCantChange();
	});
	
	$('#install_by_step_edit_map .bHelpClickForbiddenOk').click(function(){boolHelpForbidden = !$('#checkboxHelpForbidden').prop('checked')});//ADD SAVING BDD / COOKIES ?

	$('#install_by_step_edit_map_bForbiddenDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this area?'))
		{
			DeleteForbidden(currentForbiddenIndex);
		}
    });
	
	$('#install_by_step_edit_map_svg').click(function(e){
		if(bystepCanChangeMenu == false){
			switch(bystepCurrentAction){
				case 'prepareForbiddenArea':
					//blockZoom = true;
					nextIdArea++;
					
					zoom = ByStepGetZoom();
					p = $('#install_by_step_edit_map_svg image').position();
					/*x = (e.originalEvent.targetTouches[0] ? e.originalEvent.targetTouches[0].pageX : e.originalEvent.changedTouches[e.changedTouches.length-1].pageX) - p.left;
					y = (e.originalEvent.targetTouches[0] ? e.originalEvent.targetTouches[0].pageY : e.originalEvent.changedTouches[e.changedTouches.length-1].pageY) - p.top;*/
					x = e.pageX - p.left;
					y = e.pageY - p.top;
					x = x * zoom;
					y = ros_hauteur - (y * zoom);
					
					xRos = x * ros_resolution / 100;
					yRos = y * ros_resolution / 100;
					
					tailleArea = 1*zoom;
					tailleArea = 1;
					
					currentForbiddenPoints = Array();
					//AIM CENTER AREA
					/* 
					currentForbiddenPoints.push({x:xRos - tailleArea, y:yRos - tailleArea});
					currentForbiddenPoints.push({x:xRos + tailleArea, y:yRos - tailleArea});
					currentForbiddenPoints.push({x:xRos + tailleArea, y:yRos + tailleArea});
					currentForbiddenPoints.push({x:xRos - tailleArea, y:yRos + tailleArea});
					*/
					
					//AIM TOP LEFT CORNER
					currentForbiddenPoints.push({x:xRos, y:yRos});
					currentForbiddenPoints.push({x:xRos + 2*tailleArea, y:yRos});
					currentForbiddenPoints.push({x:xRos + 2*tailleArea, y:yRos - 2*tailleArea});
					currentForbiddenPoints.push({x:xRos, y:yRos - 2*tailleArea});
					
					f = {'id_area':nextIdArea, 'id_map':id_map, 'name':'', 'comment':'', 'is_forbidden':true, 'color_r':0, 'color_g':0, 'color_b':0, 'deleted':false, 'points':currentForbiddenPoints};
					ByStepAddHistorique({'action':'add_forbidden', 'data':JSON.stringify(f)});
					
					forbiddens.push(f);
					ByStepTraceForbidden(forbiddens.length-1);
					
					RemoveClass('#install_by_step_edit_map_svg .active', 'active');
					RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
					
					currentSelectedItem = Array();
					currentSelectedItem.push({'type':'forbidden', 'id':nextIdArea});	
					ByStepHideCurrentMenuNotSelect();			
					
					$('#install_by_step_edit_map_boutonsForbidden').show();
					$('#install_by_step_edit_map_boutonsStandard').hide();
					
					$('#install_by_step_edit_map_boutonsForbidden #install_by_step_edit_map_bForbiddenDelete').show();
					
					$('body').removeClass('no_current select');
					$('.select').css("strokeWidth", minStokeWidth);
					
					currentForbiddenByStepLongTouch = $(this);
					//MENU FORBIDDEN DISPLAY
					if (bystepCurrentAction != 'editForbiddenArea' && bystepCurrentAction != 'addForbiddenArea')
					{
						ByStepHideCurrentMenuNotSelect();
						ByStepDisplayMenu('install_by_step_edit_map_menu_forbidden');
					}
					
					bystepCurrentAction = 'addForbiddenArea';
					currentStep = '';
					
					currentForbiddenIndex = GetForbiddenIndexFromID(nextIdArea);
					forbidden = forbiddens[currentForbiddenIndex];
					saveCurrentForbidden = JSON.stringify(forbidden);
					
					AddClass('#install_by_step_edit_map_svg .forbidden_elem_'+forbidden.id_area, 'active');
					
					ByStepSaveElementNeeded(true);
					
					$('#install_by_step_edit_map_boutonsForbidden').show();
					$('#install_by_step_edit_map_boutonsStandard').hide();
					
					$('#install_by_step_edit_map_boutonsForbidden #install_by_step_edit_map_bForbiddenDelete').hide();
					
					bystepCurrentAction = 'addForbiddenArea';	
					currentStep = 'trace';
					
					$('body').removeClass('no_current');
					$('body').addClass('addForbidden');
					
					currentForbiddenPoints = Array();
					currentForbiddenPoints.push({x:0, y:0}); // Point du curseur
					
					
				break;
				
				case 'prepareArea':
							
					
					//blockZoom = true;
					nextIdArea++;
					zoom = ByStepGetZoom();
					p = $('#install_by_step_edit_map_svg image').position();
					/*x = (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageX : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageX) - p.left;
					y = (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageY : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageY) - p.top;
					x = x * zoom;
					y = ros_hauteur - (y * zoom);
					*/
					
					x = e.pageX - p.left;
					y = e.pageY - p.top;
					x = x * zoom;
					y = ros_hauteur - (y * zoom);
					
					xRos = x * ros_resolution / 100;
					yRos = y * ros_resolution / 100;
					
					tailleArea = 1*zoom;
					tailleArea = 1;
					
					//AIM CENTER AREA
					/* 
					currentAreaPoints = Array();
					currentAreaPoints.push({x:xRos - tailleArea, y:yRos - tailleArea});
					currentAreaPoints.push({x:xRos + tailleArea, y:yRos - tailleArea});
					currentAreaPoints.push({x:xRos + tailleArea, y:yRos + tailleArea});
					currentAreaPoints.push({x:xRos - tailleArea, y:yRos + tailleArea});
					*/
					
					//AIM TOP LEFT CORNER
					
					currentAreaPoints = Array();
					currentAreaPoints.push({x:xRos , y:yRos});
					currentAreaPoints.push({x:xRos + 2*tailleArea, y:yRos});
					currentAreaPoints.push({x:xRos + 2*tailleArea, y:yRos - 2*tailleArea});
					currentAreaPoints.push({x:xRos, y:yRos - 2*tailleArea});

					a = {'id_area':nextIdArea, 'id_map':id_map, 'name':'', 'comment':'', 'is_forbidden':false, 'color_r':87, 'color_g':159, 'color_b':177, 'deleted':false, 'points':currentAreaPoints, 'configs':Array()};
					ByStepAddHistorique({'action':'add_area', 'data':JSON.stringify(a)});
					
					areas.push(a);
					ByStepTraceArea(areas.length-1);
					
					RemoveClass('#install_by_step_edit_map_svg .active', 'active');
					RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
					
					currentSelectedItem = Array();
					currentSelectedItem.push({'type':'area', 'id':nextIdArea});	
					ByStepHideCurrentMenuNotSelect();			
					
					$('#install_by_step_edit_map_boutonsArea').show();
					$('#install_by_step_edit_map_boutonsStandard').hide();
					
					$('#install_by_step_edit_map_boutonsArea #install_by_step_edit_map_bAreaDelete').show();
					
					$('body').removeClass('no_current select');
					$('.select').css("strokeWidth", minStokeWidth);
					
					currentAreaByStepLongTouch = $(this);
					//MENU FORBIDDEN DISPLAY
					if (bystepCurrentAction != 'editArea' && bystepCurrentAction != 'addArea')
					{
						ByStepHideCurrentMenuNotSelect();
						ByStepDisplayMenu('install_by_step_edit_map_menu_area');
					}
					
					bystepCurrentAction = 'addArea';
					currentStep = '';
					
					currentAreaIndex = GetAreaIndexFromID(nextIdArea);
					area = areas[currentAreaIndex];
					saveCurrentArea = JSON.stringify(area);
					
					AddClass('#install_by_step_edit_map_svg .area_elem_'+area.id_area, 'active');
					
					ByStepSaveElementNeeded(true);
				break;
				
				case 'prepareGotoPose':
		
					//ByStepHideMenus();
					
					zoom = ByStepGetZoom();
					p = $('#install_by_step_edit_map_svg image').position();
					/*x = (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageX : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageX) - p.left;
					y = (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageY : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageY) - p.top;
					x = x * zoom;
					y = ros_hauteur - (y * zoom);
					*/
					
					x = e.pageX - p.left;
					y = e.pageY - p.top;
					x = x * zoom;
					y = ros_hauteur - (y * zoom);
					
					xRos = x * ros_resolution / 100;
					yRos = y * ros_resolution / 100;
					
					wycaApi.on('onGoToPoseResult', function (data){
						$('#install_by_step_edit_map_bStop').hide();
						if (data.A == wycaApi.AnswerCode.NO_ERROR)
						{
							$('#install_by_step_edit_map .modalFinTest section.panel-success').show();
							$('#install_by_step_edit_map .modalFinTest section.panel-danger').hide();
							$('#install_by_step_edit_map .modalFinTest section.panel-warning').hide();
						}
						else
						{	
							if(data.A == wycaApi.AnswerCode.CANCELED){
								$('#install_by_step_edit_map .modalFinTest section.panel-success').hide();
								$('#install_by_step_edit_map .modalFinTest section.panel-danger').hide();
								$('#install_by_step_edit_map .modalFinTest section.panel-warning').show();
								
								$('#install_by_step_edit_map .modalFinTest section.panel-warning .error_details').html(wycaApi.AnswerCodeToString(data.A));
							}else{
								
								$('#install_by_step_edit_map .modalFinTest section.panel-success').hide();
								$('#install_by_step_edit_map .modalFinTest section.panel-danger').show();
								$('#install_by_step_edit_map .modalFinTest section.panel-warning').hide();
								
								if (data.M != '')
									if(data.M.length > 50)
										$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br><span>' +data.M+ '</span>');
									else
										$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
									
								else
									$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
							}
						}
						$('.icon_menu').click(); // POUR SORTIR DU MENU GOTOPOSE
						// On rebranche l'ancienne fonction
						wycaApi.on('onGoToPoseResult', onGoToPoseResult);
					
						$('#install_by_step_edit_map .modalFinTest').modal('show');
					});
					
					console.log('GoToPose', xRos, yRos);
					
					wycaApi.GoToPose(xRos, yRos, 0, 0, function (data){
						
						if (data.A == wycaApi.AnswerCode.NO_ERROR)
						{
							$('#install_by_step_edit_map_bStop').show();
						}
						else
						{
							$('#install_by_step_edit_map .modalFinTest section.panel-success').hide();
							$('#install_by_step_edit_map .modalFinTest section.panel-warning').hide();
							$('#install_by_step_edit_map .modalFinTest section.panel-danger').show();
							
							if (data.M != '')
								$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
							else
								$('#install_by_step_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
						
							// On rebranche l'ancienne fonction
							wycaApi.on('onGoToPoseResult', onGoToPoseResult);
							
							$('#install_by_step_edit_map .modalFinTest').modal('show');
						}
					});
					
					
				break;
				
				default:
				
				break;			
			}
		}
	})
	
	$('#install_by_step_edit_map_menu .bAddArea').click(function(e) {
        e.preventDefault();
		ByStepHideMenus();
		if (bystepCanChangeMenu)
		{
			
			//CURRENT ACTION TARGET
			bystepCurrentAction = 'prepareArea';
			bystepCanChangeMenu = false;
			//AJOUT ICON MENU + CROIX
			$('.burger_menu').hide('fast');
			$('.icon_menu[data-menu="install_by_step_edit_map_menu_area"]').show('fast');
			setTimeout(function(){$('.times_icon_menu').show('fast')},50);
			
			if(boolHelpForbidden){
				$('.modalHelpClickArea').modal('show');
			}
			
		}
		else
			ByStepAvertCantChange();
	});
	
	$('#install_by_step_edit_map .bHelpClickAreaOk').click(function(){boolHelpArea = !$('#checkboxHelpArea').prop('checked')});//ADD SAVING BDD / COOKIES ?
	
	$('#install_by_step_edit_map_bAreaDelete').click(function(e) {
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
	
	$('#install_by_step_edit_map_bAreaOptions').click(function(e) {
        area = areas[currentAreaIndex];
		
		$('#install_by_step_edit_map_area_color_mode').val(rgbToHex(area.color_r, area.color_g, area.color_b));
		
		$.each(area.configs, function( indexConfig, config ) {
			switch(config.name)
			{
				case 'led_color_mode': $('#install_by_step_edit_map_led_color_mode').val(config.value); break;
				case 'led_color': $('#install_by_step_edit_map_led_color').val(config.value); $('#install_by_step_edit_map_led_color').keyup(); break;
				case 'led_animation_mode': $('#install_by_step_edit_map_led_animation_mode').val(config.value); break;
				case 'led_animation': $('#install_by_step_edit_map_led_animation').val(config.value); break;
				case 'max_speed_mode': $('#install_by_step_edit_map_max_speed_mode').val(config.value); break;
				case 'max_speed': $('#install_by_step_edit_map_max_speed').val(config.value); break;
			}
		});
		
		if ($('#install_by_step_edit_map_led_color_mode').val() == 'Automatic') $('#install_by_step_edit_map_led_color_group').hide(); else  $('#install_by_step_edit_map_led_color_group').show();
		if ($('#install_by_step_edit_map_led_animation_mode').val() == 'Automatic') $('#install_by_step_edit_map_led_animation_group').hide(); else  $('#install_by_step_edit_map_led_animation_group').show();
		if ($('#install_by_step_edit_map_max_speed_mode').val() == 'Automatic') $('#install_by_step_edit_map_max_speed_group').hide(); else  $('#install_by_step_edit_map_max_speed_group').show();
    });
	
	$('#install_by_step_edit_map_bAreaSaveConfig').click(function(e) {
		area = areas[currentAreaIndex];
		saveCurrentArea = JSON.stringify(area);
			
		area.configs = Array();
		area.configs.push({'name':'led_color_mode' , 'value':$('#install_by_step_edit_map_led_color_mode').val()});
		
		area.configs.push({'name':'led_color' , 'value':$('#install_by_step_edit_map_led_color').val()});
		area.configs.push({'name':'led_animation_mode' , 'value':$('#install_by_step_edit_map_led_animation_mode').val()});
		area.configs.push({'name':'led_animation' , 'value':$('#install_by_step_edit_map_led_animation').val()});
		area.configs.push({'name':'max_speed_mode' , 'value':$('#install_by_step_edit_map_max_speed_mode').val()});
		area.configs.push({'name':'max_speed' , 'value':$('#install_by_step_edit_map_max_speed').val()});
		
		var c = $('#install_by_step_edit_map_area_color').val().split("(")[1].split(")")[0];
		c = c.split(",");
		area.color_r = parseInt(c[0]);
		area.color_g = parseInt(c[1]);
		area.color_b = parseInt(c[2]);
		
		areas[currentAreaIndex] = area;
		
		if (bystepCurrentAction == 'editArea')
			ByStepAddHistorique({'action':'edit_area', 'data':{'index':currentAreaIndex, 'old':saveCurrentArea, 'new':JSON.stringify(areas[currentAreaIndex])}});
		saveCurrentArea = JSON.stringify(areas[currentAreaIndex]);
		ByStepTraceArea(currentAreaIndex);
	});
		
	$('#install_by_step_edit_map_menu .bAddDock').click(function(e) {
        e.preventDefault();
		ByStepHideMenus();
		if (bystepCanChangeMenu)
		{
			$('#install_by_step_edit_map_container_all .texts_add_dock').hide();
			$('#install_by_step_edit_map_container_all .text_prepare_robot').show();
			
			$('#install_by_step_edit_map_container_all .modalAddDock .dock').hide();
			$('#install_by_step_edit_map_container_all .modalAddDock').modal('show');
		}
		else
			ByStepAvertCantChange();
	});
	
	$('#install_by_step_edit_map_container_all .modalAddDock .joystickDiv .curseur').on('touchstart', function(e) {
		$('#install_by_step_edit_map_container_all .modalAddDock .dock').hide();
	});
	
	$('#install_by_step_edit_map_container_all .modalAddDock .bScanAddDock').click(function(e) {
		$('#install_by_step_edit_map_container_all .modalAddDock .bScanAddDock').addClass('disabled');
		
		wycaApi.GetMapFiducialsVisible(function(data) {
			
			$('#install_by_step_edit_map_container_all .modalAddDock .bScanAddDock').removeClass('disabled');	
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				console.log(data);
				
				$('#install_by_step_edit_map_container_all .modalAddDock .dock').hide();
				
				posRobot = $('#install_by_step_edit_map_container_all .modalAddDock #install_by_step_edit_map_modalAddDock_robot').offset();
				
				$('#install_by_step_edit_map_container_all .texts_add_dock').hide();
				if (data.D.length > 0)
					$('#install_by_step_edit_map_container_all .text_set_dock').show();
				else
					$('#install_by_step_edit_map_container_all .text_prepare_robot').show();
				
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
						
						$('#install_by_step_edit_map_container_all .modalAddDock #install_by_step_edit_map_modalAddDock_dock'+i).show();
						$('#install_by_step_edit_map_container_all .modalAddDock #install_by_step_edit_map_modalAddDock_dock'+i).css('left', posRobot.left + x_from_robot * 100); // lidar : y * -1
						$('#install_by_step_edit_map_container_all .modalAddDock #install_by_step_edit_map_modalAddDock_dock'+i).css('top', posRobot.top - y_from_robot * 100); // +20 position lidar, - 12.5 pour le centre
						//angle = (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
						
						angle = 0 - (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
						
						$('#install_by_step_edit_map_container_all .modalAddDock #install_by_step_edit_map_modalAddDock_dock'+i).css({'-webkit-transform' : 'rotate('+ angle +'deg)',
																	 '-moz-transform' : 'rotate('+ angle +'deg)',
																	 '-ms-transform' : 'rotate('+ angle +'deg)',
																	 'transform' : 'rotate('+ angle +'deg)'});
						
						
						$('#install_by_step_edit_map_container_all .modalAddDock #install_by_step_edit_map_modalAddDock_dock'+i).data('id_fiducial', data.D[i].ID);
						$('#install_by_step_edit_map_container_all .modalAddDock #install_by_step_edit_map_modalAddDock_dock'+i).data('x', data.D[i].P.X);
						$('#install_by_step_edit_map_container_all .modalAddDock #install_by_step_edit_map_modalAddDock_dock'+i).data('y', data.D[i].P.Y);
						$('#install_by_step_edit_map_container_all .modalAddDock #install_by_step_edit_map_modalAddDock_dock'+i).data('theta', data.D[i].P.T);
					}
				}
			}
			else
			{
				DisplayError(wycaApi.AnswerCodeToString(data.A) + "<br/>" + data.M);
			}
		});
    });
	
	$('#install_by_step_edit_map_container_all .modalAddDock .dock').click(function(e) {
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
		
		dock_master = false;
		if (docks.length == 0)
		{
			// First dock
			dock_master = true;
		}
		if (!dock_master && docks.length > 0)
		{
			dock_master = true;
			$.each(docks, function( index, dock ) {
				if (dock.is_master && (dock.deleted == undefined || !dock.deleted))
					dock_master = false;
			});
		}
		
		num = GetMaxNumDock()+1;
		d = {'id_docking_station':nextIdDock, 'id_map':id_map, 'id_fiducial':$(this).data('id_fiducial'), 'final_pose_x':final_pose_x, 'final_pose_y':final_pose_y, 'final_pose_t':final_pose_t, 'approch_pose_x':approch_pose_x, 'approch_pose_y':approch_pose_y, 'approch_pose_t':approch_pose_t, 'num':parseInt(num), 'fiducial_pose_x':$(this).data('x'), 'fiducial_pose_y':$(this).data('y'), 'fiducial_pose_t':$(this).data('theta'), 'name':'Dock '+num, 'comment':'', 'undock_path':[{'linear_distance':-0.4, 'angular_distance':0}], 'is_master':dock_master};
		ByStepAddHistorique({'action':'add_dock', 'data':JSON.stringify(d)});
        docks.push(d);
		ByStepTraceDock(docks.length-1);
		
		$('#install_by_step_edit_map_container_all .modalAddDock').modal('hide');
		
		currentDockIndex = docks.length-1;
		dock = docks[currentDockIndex];
		
		$('#install_by_step_edit_map_dock_name').val(dock.name);
		$('#install_by_step_edit_map_dock_comment').val(dock.comment);
		$('#install_by_step_edit_map_dock_number').val(dock.num);
		$('#install_by_step_edit_map_dock_is_master').prop('checked', dock.is_master);
		
		
		$('#install_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure li').remove();
		
		indexDockElem++;
		
		$('#install_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
			'<li id="install_by_step_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="move" data-distance="-0.4">'+
			'	<span>Move back 0.4m</span>'+
			'	<a href="#" class="bByStepUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
			'	<a href="#" class="bByStepUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
			'</li>'
			);
		$('#install_by_step_edit_map_container_all .modalDockOptions #install_by_step_edit_map_bDockCancelConfig').addClass('disabled');
		$('#install_by_step_edit_map_container_all .modalDockOptions').modal('show');
		
    });
	
	$('#install_by_step_edit_map_bDockSaveConfig').click(function(e) {
		if(!CheckName(docks, $('#install_by_step_edit_map_dock_name').val(), currentDockIndex)){
			firstAction = $('#install_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure li').first();
			if (firstAction.data('action') == 'rotate')
			{
				e.preventDefault();
				alert_wyca('You cannot start with a rotation');
			}
			else if (firstAction.data('action') != 'rotate' && firstAction.data('distance') > 0)
			{
				e.preventDefault();
				alert_wyca('You cannot start with moving forward');
			}
			else
			{
				dock = docks[currentDockIndex];
				saveCurrentDock = JSON.stringify(dock);
						
				dock.name = $('#install_by_step_edit_map_dock_name').val();
				dock.num = parseInt($('#install_by_step_edit_map_dock_number').val());
				dock.comment = $('#install_by_step_edit_map_dock_comment').val();
				if ($('#install_by_step_edit_map_dock_is_master').prop('checked'))
				{
					// Désactive les autres
					$.each(docks, function( index, dock ) {
						dock.is_master = false;
					});
				}
				dock.is_master = $('#install_by_step_edit_map_dock_is_master').prop('checked');
					
				dock.undock_path = Array();
				
				$('#install_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure li').each(function(index, element) {
					if ($(this).data('action') == 'rotate')
					{
						angle_rad = parseFloat($(this).data('angle')) * Math.PI/180;
						dock.undock_path.push({'linear_distance':0, 'angular_distance':angle_rad});
					}
					else
						dock.undock_path.push({'linear_distance':$(this).data('distance'), 'angular_distance':0});
				});
				
				docks[currentDockIndex] = dock;
						
				if (bystepCurrentAction == 'editDock')
					ByStepAddHistorique({'action':'edit_dock', 'data':{'index':currentDockIndex, 'old':saveCurrentDock, 'new':JSON.stringify(docks[currentDockIndex])}});
				saveCurrentDock = JSON.stringify(docks[currentDockIndex]);
				ByStepTraceDock(currentDockIndex);
				
				$('#install_by_step_edit_map_container_all .modalDockOptions').modal('hide');
				$('#install_by_step_edit_map_container_all .modalDockOptions #install_by_step_edit_map_bDockCancelConfig').removeClass('disabled');
			}
		}else{
			alert_wyca(textNameUsed);
		};
	});
	
	$('#install_by_step_edit_map_container_all .modalDockOptions .bByStepUndockProcedureAddElem').click(function(e) {
        e.preventDefault();
		
		$('#install_by_step_edit_map_up_elem_action_move').prop('checked', false);
		$('#install_by_step_edit_map_up_elem_action_rotate').prop('checked', false);
		
		$('#install_by_step_edit_map_up_elem_direction_back').prop('checked', true);
		$('#install_by_step_edit_map_container_all .up_elem_action_move').hide();
		$('#install_by_step_edit_map_container_all .up_elem_action_rotate').hide();
		
		$('#install_by_step_edit_map_container_all .modalDockElemOptions').data('index_dock_procedure', -1);
		
		$('#install_by_step_edit_map_container_all .modalDockElemOptions').modal('show');
    });
	
	$('#install_by_step_edit_map_container_all .modalDockElemOptions input:radio[name="up_elem_action"]').change(function () {
		action = $("#install_by_step_edit_map_container_all input[name='up_elem_action']:checked").val()
		$('#install_by_step_edit_map_container_all .up_elem_action_move').hide();
		$('#install_by_step_edit_map_container_all .up_elem_action_rotate').hide();
		if (action == 'move') {
			
			$('#install_by_step_edit_map_container_all .up_elem_action_move').show();
		}
		else if (action == 'rotate') {
			$('#install_by_step_edit_map_container_all .up_elem_action_rotate').show();
		}
	});
		
	$('#install_by_step_edit_map_container_all .modalDockElemOptions .bDockElemSave').click(function(e) {
		
		index_dock_procedure = $('#install_by_step_edit_map_container_all .modalDockElemOptions').data('index_dock_procedure');
		if (index_dock_procedure == -1)
		{
			indexDockElem++;
			
			action = $("#install_by_step_edit_map_container_all input[name='up_elem_action']:checked").val();
			
			if (action == 'move') {
				
				distance = parseFloat($("#install_by_step_edit_map_up_elem_move_distance").val());
				direction = $("#install_by_step_edit_map_container_all input[name='up_elem_direction']:checked").val();
							
				$('#install_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
					'<li id="install_by_step_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="move" data-distance="' + ((direction == 'back')?distance*-1:distance) + '">'+
					'	<span>Move ' + ((direction == 'back')?'back':'front') + ' ' + distance + 'm</span>'+
					'	<a href="#" class="bByStepUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bByStepUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
			else if (action == 'rotate') {
				
				angle = $("#install_by_step_edit_map_up_elem_rotate_angle").val();
				
				$('#install_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
					'<li id="install_by_step_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="rotate" data-angle="'+angle+'">'+
					'	<span>Rotate '+angle+'°</span>'+
					'	<a href="#" class="bByStepUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bByStepUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
		}
		else
		{
			action = $("#install_by_step_edit_map_container_all input[name='up_elem_action']:checked").val();
			if (action == 'move') {
				
				distance = parseFloat($("#install_by_step_edit_map_up_elem_move_distance").val());
				direction = $("#install_by_step_edit_map_container_all input[name='up_elem_direction']:checked").val();
				
				li = $('#install_by_step_edit_map_list_undock_procedure_elem_'+ index_dock_procedure);
				span = $('#install_by_step_edit_map_list_undock_procedure_elem_'+ index_dock_procedure + ' span');
				
				li.data('action', 'move');
				li.data('distance', ((direction == 'back')?distance*-1:distance));
				span.html('Move ' + ((direction == 'back')?'back':'front') + ' ' + distance + 'm');
			}
			else if (action == 'rotate') {
				
				angle = $("#install_by_step_edit_map_up_elem_rotate_angle").val();
				
				li = $('#install_by_step_edit_map_list_undock_procedure_elem_'+ index_dock_procedure);
				span = $('#install_by_step_edit_map_list_undock_procedure_elem_'+ index_dock_procedure + ' span');
				
				li.data('action', 'rotate');
				li.data('angle', angle);
				span.html('Rotate '+angle+'°');
			}
		}
    });
	
	$(document).on('click', '#install_by_step_edit_map_container_all .modalDockOptions .bByStepUndockProcedureDeleteElem', function(e) {
		e.preventDefault();
		
		$(this).closest('li').remove();
	});
	
	$(document).on('click', '#install_by_step_edit_map_container_all .modalDockOptions .bByStepUndockProcedureEditElem', function(e) {
		e.preventDefault();
		
		$('#install_by_step_edit_map_up_elem_action_move').prop('checked', false);
		$('#install_by_step_edit_map_up_elem_action_rotate').prop('checked', false);
		
		$('#install_by_step_edit_map_container_all .up_elem_action_move').hide();
		$('#install_by_step_edit_map_container_all .up_elem_action_rotate').hide();
		
		li = $(this).closest('li');
		if (li.data('action') == 'rotate')
		{
			$('#install_by_step_edit_map_container_all .up_elem_action_rotate').show();
			$('#install_by_step_edit_map_up_elem_action_rotate').prop('checked', true);
			$("#install_by_step_edit_map_up_elem_rotate_angle").val(li.data('angle'));
		}
		else
		{
			$('#install_by_step_edit_map_container_all .up_elem_action_move').show();
			$('#install_by_step_edit_map_up_elem_action_move').prop('checked', true);
			distance = li.data('distance');
			if (distance < 0)
				$('#install_by_step_edit_map_up_elem_direction_back').prop('checked', true);
			else
				$('#install_by_step_edit_map_up_elem_direction_front').prop('checked', true);
			
			$("#install_by_step_edit_map_up_elem_move_distance").val(Math.abs(distance));
		}
		
		
		$('#install_by_step_edit_map_container_all .modalDockElemOptions').data('index_dock_procedure', li.data('index_dock_procedure'));
		
		$('#install_by_step_edit_map_container_all .modalDockElemOptions').modal('show');
		
	});
	
	$('#install_by_step_edit_map_menu .bAddPOI').click(function(e) {
        e.preventDefault();
		ByStepHideMenus();
		if (bystepCanChangeMenu)
		{
			$('#install_by_step_edit_map_container_all .modalAddPoi').modal('show');
		}
		else
			ByStepAvertCantChange();
	});
	
	$('#install_by_step_edit_map_container_all .modalAddPoi #install_by_step_edit_map_bModalAddPoiSave').click(function(e) {
        e.preventDefault();
		nextIdPoi++;
		poi_temp_add = {'id_poi':nextIdPoi, 'id_map':id_map, 'final_pose_x':lastRobotPose.X, 'final_pose_y':lastRobotPose.Y, 'final_pose_t':lastRobotPose.T, 'name':'POI', 'comment':'', 'color':'', 'icon':'', 'active':true};
		
		ByStepAddHistorique({'action':'add_poi', 'data':JSON.stringify(poi_temp_add)});
		pois.push(poi_temp_add);
		ByStepTracePoi(pois.length-1);
				
		$('#install_by_step_edit_map_container_all .modalAddPoi').modal('hide');
		
		currentPoiIndex = pois.length-1;
		poi = pois[currentPoiIndex];
		
		$('#install_by_step_edit_map_poi_name').val(poi.name);
		$('#install_by_step_edit_map_poi_comment').val(poi.comment);
		
		$('#install_by_step_edit_map_container_all .modalPoiOptions').modal('show');
    });
	
	$('#install_by_step_edit_map_bPoiSaveConfig').click(function(e) {
		
		if(!CheckName(pois, $('#install_by_step_edit_map_poi_name').val(), currentPoiIndex)){
			poi = pois[currentPoiIndex];
			saveCurrentPoi = JSON.stringify(poi);
			
			poi.name = $('#install_by_step_edit_map_poi_name').val();
			poi.comment = $('#install_by_step_edit_map_poi_comment').val();
			pois[currentPoiIndex] = poi;
			
			$('#install_by_step_edit_map_bPoiCancelConfig').show();
					
			if (bystepCurrentAction == 'editPoi')
				ByStepAddHistorique({'action':'edit_poi', 'data':{'index':currentPoiIndex, 'old':saveCurrentPoi, 'new':JSON.stringify(pois[currentPoiIndex])}});
			saveCurrentPoi = JSON.stringify(pois[currentPoiIndex]);
			ByStepTracePoi(currentPoiIndex);
			$('.modal.modalPoiOptions').modal('hide');			
		}else{
			alert_wyca(textNameUsed);
		};
		
	});
	
	$('#install_by_step_edit_map_menu .bAddAugmentedPose').click(function(e) {
        e.preventDefault();
		ByStepHideMenus();
		if (bystepCanChangeMenu)
		{
			$('#install_by_step_edit_map_container_all .modalAddAugmentedPose .augmented_pose').hide();
			$('#install_by_step_edit_map_container_all .texts_add_augmented_pose').hide();
			$('#install_by_step_edit_map_container_all .text_prepare_approch').show();
			currentStepAddAugmentedPose = 'set_approch';
			
			$('#install_by_step_edit_map_container_all .modalAddAugmentedPose').modal('show');
		}
		else
			ByStepAvertCantChange();
	});
	
	$('#install_by_step_edit_map_container_all .modalAddAugmentedPose .joystickDiv .curseur').on('touchstart', function(e) {
		$('#install_by_step_edit_map_container_all .modalAddAugmentedPose .augmented_pose').hide();
	});
	
	$('#install_by_step_edit_map_container_all .modalAddAugmentedPose .bScanAddAugmentedPose').click(function(e) {
		$('#install_by_step_edit_map_container_all .modalAddAugmentedPose .bScanAddAugmentedPose').addClass('disabled');
		
		wycaApi.GetMapFiducialsVisible(function(data) {
			
			$('#install_by_step_edit_map_container_all .modalAddAugmentedPose .bScanAddAugmentedPose').removeClass('disabled');	
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				console.log(data);
				
				$('#install_by_step_edit_map_container_all .modalAddAugmentedPose .augmented_pose').hide();
				
				posRobot = $('#install_by_step_edit_map_container_all .modalAddAugmentedPose #install_by_step_edit_map_modalAddAugmentedPose_robot').offset();
				
				if (data.D.length > 0)
				{
					$('#install_by_step_edit_map_container_all .texts_add_augmented_pose').hide();
					if (currentStepAddAugmentedPose != 'set_final')
						$('#install_by_step_edit_map_container_all .text_set_approch').show();
					else
						$('#install_by_step_edit_map_container_all .text_set_final').show();
				}
				
				for (i=0; i< data.D.length; i++)
				{
					if (data.D[i].TY != 'Dock')
					{
						if (currentStepAddAugmentedPose == 'set_approch' || augmented_pose_temp_add.id_fiducial == data.D[i].ID)
						{
							new_point = RotatePoint (data.D[i].P, lastRobotPose, lastRobotPose.T - Math.PI/2);
							x_from_robot = new_point.X - lastRobotPose.X;
							y_from_robot = new_point.Y - lastRobotPose.Y;
							
							// 1px / cm
							
							$('#install_by_step_edit_map_container_all .modalAddAugmentedPose #install_by_step_edit_map_modalAddAugmentedPose_augmented_pose'+i).show();
							$('#install_by_step_edit_map_container_all .modalAddAugmentedPose #install_by_step_edit_map_modalAddAugmentedPose_augmented_pose'+i).css('left', posRobot.left + x_from_robot * 100); // lidar : y * -1
							$('#install_by_step_edit_map_container_all .modalAddAugmentedPose #install_by_step_edit_map_modalAddAugmentedPose_augmented_pose'+i).css('top', posRobot.top - y_from_robot * 100); // +20 position lidar, - 12.5 pour le centre
							//angle = (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
							
							angle = 0 - (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
							
							$('#install_by_step_edit_map_container_all .modalAddAugmentedPose #install_by_step_edit_map_modalAddAugmentedPose_augmented_pose'+i).css({'-webkit-transform' : 'rotate('+ angle +'deg)',
																	 '-moz-transform' : 'rotate('+ angle +'deg)',
																	 '-ms-transform' : 'rotate('+ angle +'deg)',
																	 'transform' : 'rotate('+ angle +'deg)'});
							
							
							$('#install_by_step_edit_map_container_all .modalAddAugmentedPose #install_by_step_edit_map_modalAddAugmentedPose_augmented_pose'+i).data('id_fiducial', data.D[i].ID);
							$('#install_by_step_edit_map_container_all .modalAddAugmentedPose #install_by_step_edit_map_modalAddAugmentedPose_augmented_pose'+i).data('x', data.D[i].P.X);
							$('#install_by_step_edit_map_container_all .modalAddAugmentedPose #install_by_step_edit_map_modalAddAugmentedPose_augmented_pose'+i).data('y', data.D[i].P.Y);
							$('#install_by_step_edit_map_container_all .modalAddAugmentedPose #install_by_step_edit_map_modalAddAugmentedPose_augmented_pose'+i).data('theta', data.D[i].P.T);
						}
					}
				}
			}
			else
			{
				DisplayError(wycaApi.AnswerCodeToString(data.A) + "<br/>" + data.M);
			}
		});
    });
	
	$('#install_by_step_edit_map_container_all .modalAddAugmentedPose .augmented_pose').click(function(e) {
        e.preventDefault();
		
		if (currentStepAddAugmentedPose == 'set_approch')
		{
			nextIdAugmentedPose++;
			
			augmented_pose_temp_add = {'id_augmented_pose':nextIdAugmentedPose, 'id_map':id_map, 'id_fiducial':$(this).data('id_fiducial'), 'fiducial_pose_x':$(this).data('x'), 'fiducial_pose_y':$(this).data('y'), 'fiducial_pose_t':$(this).data('theta'), 'final_pose_x':lastRobotPose.X, 'final_pose_y':lastRobotPose.Y, 'final_pose_t':lastRobotPose.T, 'approch_pose_x':lastRobotPose.X, 'approch_pose_y':lastRobotPose.Y, 'approch_pose_t':lastRobotPose.T, 'name':'Augmented pose', 'comment':'', 'color':'', 'icon':'', 'active':true};
			
			$('#install_by_step_edit_map_container_all .modalAddAugmentedPose .augmented_pose').hide();
			
 			currentStepAddAugmentedPose = 'set_final';
			$('#install_by_step_edit_map_container_all .texts_add_augmented_pose').hide();
			$('#install_by_step_edit_map_container_all .text_prepare_final').show();
		}
		else
		{
			augmented_pose_temp_add.final_pose_x = lastRobotPose.X;
			augmented_pose_temp_add.final_pose_y = lastRobotPose.Y;
			augmented_pose_temp_add.final_pose_t = lastRobotPose.T;
			
			ByStepAddHistorique({'action':'add_augmented_pose', 'data':JSON.stringify(augmented_pose_temp_add)});
			augmented_poses.push(augmented_pose_temp_add);
			ByStepTraceAugmentedPose(augmented_poses.length-1);
					
			$('#install_by_step_edit_map_container_all .modalAddAugmentedPose').modal('hide');
			
			currentAugmentedPoseIndex = augmented_poses.length-1;
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			
			$('#install_by_step_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose li').remove();
			
			$('#install_by_step_edit_map_augmented_pose_name').val(augmented_pose.name);
			$('#install_by_step_edit_map_augmented_pose_comment').val(augmented_pose.comment);
			
			
			indexAugmentedPoseElem++;
			
			$('#install_by_step_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
				'<li id="install_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="move" data-distance="-0.4">'+
				'	<span>Move back 0.4m</span>'+
				'	<a href="#" class="bByStepUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
				'	<a href="#" class="bByStepUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
				'</li>'
				);
			
			$('#install_by_step_edit_map_bAugmentedPoseCancelConfig').addClass('disabled');
			$('#install_by_step_edit_map_container_all .modalAugmentedPoseOptions').modal('show');
		}
    });
	
	$('#install_by_step_edit_map_bAugmentedPoseSaveConfig').click(function(e) {
		if(!CheckName(augmented_poses, $('#install_by_step_edit_map_augmented_pose_name').val(), currentAugmentedPoseIndex)){
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			saveCurrentAugmentedPose = JSON.stringify(augmented_pose);
					
			augmented_pose.name = $('#install_by_step_edit_map_augmented_pose_name').val();
			augmented_pose.comment = $('#install_by_step_edit_map_augmented_pose_comment').val();
				
			augmented_pose.undock_path = Array();
			
			$('#install_by_step_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose li').each(function(index, element) {
				if ($(this).data('action') == 'rotate')
				{
					angle_rad = parseFloat($(this).data('angle')) * Math.PI/180;
					augmented_pose.undock_path.push({'linear_distance':0, 'angular_distance':angle_rad});
				}
				else
					augmented_pose.undock_path.push({'linear_distance':$(this).data('distance'), 'angular_distance':0});
			});
			
			augmented_poses[currentAugmentedPoseIndex] = augmented_pose;
			
			$('#install_by_step_edit_map_bAugmentedPoseCancelConfig').removeClass('disabled');
					
			if (bystepCurrentAction == 'editAugmentedPose')
				ByStepAddHistorique({'action':'edit_augmented_pose', 'data':{'index':currentAugmentedPoseIndex, 'old':saveCurrentAugmentedPose, 'new':JSON.stringify(augmented_poses[currentAugmentedPoseIndex])}});
			saveCurrentAugmentedPose = JSON.stringify(augmented_poses[currentAugmentedPoseIndex]);
			ByStepTraceAugmentedPose(currentAugmentedPoseIndex);
			$('.modal.modalAugmentedPoseOptions').modal('hide');
		}else{
			alert_wyca(textNameUsed);
		};
	});
	
	$('#install_by_step_edit_map_container_all .modalAugmentedPoseOptions .bByStepUndockProcedureAugmentedPoseAddElem').click(function(e) {
        e.preventDefault();
		
		$('#install_by_step_edit_map_up_augmented_pose_elem_action_move').prop('checked', false);
		$('#install_by_step_edit_map_up_augmented_pose_elem_action_rotate').prop('checked', false);
		
		$('#install_by_step_edit_map_up_augmented_pose_elem_direction_back').prop('checked', true);
		$('#install_by_step_edit_map_container_all .up_augmented_pose_elem_action_move').hide();
		$('#install_by_step_edit_map_container_all .up_augmented_pose_elem_action_rotate').hide();
		
		$('#install_by_step_edit_map_container_all .modalAugmentedPoseElemOptions').data('index_augmented_pose_procedure', -1);
		
		$('#install_by_step_edit_map_container_all .modalAugmentedPoseElemOptions').modal('show');
    });
	
	$('#install_by_step_edit_map_container_all .modalAugmentedPoseElemOptions input:radio[name="up_augmented_pose_elem_action"]').change(function () {
		action = $("#install_by_step_edit_map_container_all input[name='up_augmented_pose_elem_action']:checked").val()
		$('#install_by_step_edit_map_container_all .up_augmented_pose_elem_action_move').hide();
		$('#install_by_step_edit_map_container_all .up_augmented_pose_elem_action_rotate').hide();
		if (action == 'move') {
			$('#install_by_step_edit_map_container_all .up_augmented_pose_elem_action_move').show();
		}
		else if (action == 'rotate') {
			$('#install_by_step_edit_map_container_all .up_augmented_pose_elem_action_rotate').show();
		}
	});
		
	$('#install_by_step_edit_map_container_all .modalAugmentedPoseElemOptions .bAugmentedPoseElemSave').click(function(e) {
		
		index_augmented_pose_procedure = $('#install_by_step_edit_map_container_all .modalAugmentedPoseElemOptions').data('index_augmented_pose_procedure');
		if (index_augmented_pose_procedure == -1)
		{
			indexAugmentedPoseElem++;
			
			action = $("#install_by_step_edit_map_container_all input[name='up_augmented_pose_elem_action']:checked").val();
			
			if (action == 'move') {
				
				distance = parseFloat($("#install_by_step_edit_map_up_augmented_pose_elem_move_distance").val());
				direction = $("#install_by_step_edit_map_container_all input[name='up_augmented_pose_elem_direction']:checked").val();
							
				$('#install_by_step_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
					'<li id="install_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="move" data-distance="' + ((direction == 'back')?distance*-1:distance) + '">'+
					'	<span>Move ' + ((direction == 'back')?'back':'front') + ' ' + distance + 'm</span>'+
					'	<a href="#" class="bByStepUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bByStepUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
			else if (action == 'rotate') {
				
				angle = $("#install_by_step_edit_map_up_augmented_pose_elem_rotate_angle").val();
				
				$('#install_by_step_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
					'<li id="install_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="rotate" data-angle="'+angle+'">'+
					'	<span>Rotate '+angle+'°</span>'+
					'	<a href="#" class="bByStepUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bByStepUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
		}
		else
		{
			action = $("#install_by_step_edit_map_container_all input[name='up_augmented_pose_elem_action']:checked").val();
			if (action == 'move') {
				
				distance = parseFloat($("#install_by_step_edit_map_up_augmented_pose_elem_move_distance").val());
				direction = $("#install_by_step_edit_map_container_all input[name='up_augmented_pose_elem_direction']:checked").val();
				
				li = $('#install_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+ index_augmented_pose_procedure);
				span = $('#install_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+ index_augmented_pose_procedure + ' span');
				
				li.data('action', 'move');
				li.data('distance', ((direction == 'back')?distance*-1:distance));
				span.html('Move ' + ((direction == 'back')?'back':'front') + ' ' + distance + 'm');
			}
			else if (action == 'rotate') {
				
				angle = $("#install_by_step_edit_map_up_augmented_pose_elem_rotate_angle").val();
				
				li = $('#install_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+ index_augmented_pose_procedure);
				span = $('#install_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+ index_augmented_pose_procedure + ' span');
				
				li.data('action', 'rotate');
				li.data('angle', angle);
				span.html('Rotate '+angle+'°');
			}
		}
    });
	
	$(document).on('click', '#install_by_step_edit_map_container_all .modalAugmentedPoseOptions .bByStepUndockProcedureAugmentedPoseDeleteElem', function(e) {
		e.preventDefault();
		
		$(this).closest('li').remove();
	});
	
	$(document).on('click', '#install_by_step_edit_map_container_all .modalAugmentedPoseOptions .bByStepUndockProcedureAugmentedPoseEditElem', function(e) {
		e.preventDefault();
		
		$('#install_by_step_edit_map_up_augmented_pose_elem_action_move').prop('checked', false);
		$('#install_by_step_edit_map_up_augmented_pose_elem_action_rotate').prop('checked', false);
		
		$('#install_by_step_edit_map_container_all .up_augmented_pose_elem_action_move').hide();
		$('#install_by_step_edit_map_container_all .up_augmented_pose_elem_action_rotate').hide();
		
		li = $(this).closest('li');
		if (li.data('action') == 'rotate')
		{
			$('#install_by_step_edit_map_container_all .up_augmented_pose_elem_action_rotate').show();
			$('#install_by_step_edit_map_up_augmented_pose_elem_action_rotate').prop('checked', true);
			$("#install_by_step_edit_map_up_augmented_pose_elem_rotate_angle").val(li.data('angle'));
		}
		else
		{
			$('#install_by_step_edit_map_container_all .up_augmented_pose_elem_action_move').show();
			$('#install_by_step_edit_map_up_augmented_pose_elem_action_move').prop('checked', true);
			distance = li.data('distance');
			if (distance < 0)
				$('#install_by_step_edit_map_up_augmented_pose_elem_direction_back').prop('checked', true);
			else
				$('#install_by_step_edit_map_up_augmented_pose_elem_direction_front').prop('checked', true);
			
			$("#install_by_step_edit_map_up_augmented_pose_elem_move_distance").val(Math.abs(distance));
		}
		
		
		$('#install_by_step_edit_map_container_all .modalAugmentedPoseElemOptions').data('index_augmented_pose_procedure', li.data('index_augmented_pose_procedure'));
		
		$('#install_by_step_edit_map_container_all .modalAugmentedPoseElemOptions').modal('show');
		
	});
	
	$('#install_by_step_edit_map_bDockCreateFromMap').click(function(e) {
        if (bystepCanChangeMenu)
		{
			blockZoom = true;
			
			$('#install_by_step_edit_map_boutonsDock').show();
            $('#install_by_step_edit_map_boutonsStandard').hide();
			
			$('#install_by_step_edit_map_boutonsDock #install_by_step_edit_map_bDockSave').hide();
			$('#install_by_step_edit_map_boutonsDock #install_by_step_edit_map_bDockDelete').hide();
			$('#install_by_step_edit_map_boutonsDock #install_by_step_edit_map_bDockDirection').hide();
			
			bystepCurrentAction = 'addDock';	
			currentStep = 'setPose';
			
			$('body').removeClass('no_current');
			$('body').addClass('addDock');
			
			$('#install_by_step_edit_map_message_aide').html(textClickOnMapPose);
			$('#install_by_step_edit_map_message_aide').show();
		}
		else
			ByStepAvertCantChange();
    });
	
	$('#install_by_step_edit_map_bDockDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this docking station?'))
		{
			DeleteDock(currentDockIndex);
		}
    });
	
	$('#install_by_step_edit_map_bDockDirection').click(function(e) {
        e.preventDefault();
		
		if ($('#install_by_step_edit_map_boutonsRotate').is(':visible'))
		{
			$('#install_by_step_edit_map_boutonsRotate').hide();
		}
		else
		{
			dock = docks[currentDockIndex];
			
			//zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
			zoom = ByStepGetZoom();		
			p = $('#install_by_step_edit_map_svg image').position();
			
			
			x = dock.approch_pose_x * 100 / 5;
			y = dock.approch_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#install_by_step_edit_map_boutonsRotate').css('left', x - $('#install_by_step_edit_map_boutonsRotate').width()/2);
			$('#install_by_step_edit_map_boutonsRotate').css('top', y - 60);
			$('#install_by_step_edit_map_boutonsRotate').show();
		}
	});
	
	$('#install_by_step_edit_map_bPoiCreateFromPose').click(function(e) {
		nextIdPoi++;
		p = {'id_poi':nextIdPoi, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':lastRobotPose.x, 'final_pose_y':lastRobotPose.y, 'final_pose_t':lastRobotPose.theta, 'approch_pose_x':lastRobotPose.x, 'approch_pose_y':lastRobotPose.y, 'approch_pose_t':lastRobotPose.theta, 'fiducial_pose_x':0, 'fiducial_pose_y':0, 'fiducial_pose_t':0, 'name':'POI', 'comment':'', 'color':'', 'icon':'', 'active':true};
		ByStepAddHistorique({'action':'add_poi', 'data':JSON.stringify(p)});
        pois.push(p);
		ByStepTracePoi(pois.length-1);
		
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
		RemoveClass('#install_by_step_edit_map_svg .poi_elem', 'movable');
					
		currentSelectedItem = Array();
		currentSelectedItem.push({'type':'poi', 'id':$(this).data('id_poi')});	
		ByStepHideCurrentMenuNotSelect();
		
		$('#install_by_step_edit_map_boutonsPoi').show();
		
		$('#install_by_step_edit_map_boutonsStandard').hide();
		
		$('#install_by_step_edit_map_boutonsPoi a').show();
		
		$('body').removeClass('no_current select');
		$('.select').css("strokeWidth", minStokeWidth);
		
		bystepCurrentAction = 'editPoi';	
		currentStep = '';
		
		currentPoiIndex = GetPoiIndexFromID(nextIdPoi);
		poi = pois[currentPoiIndex];
		saveCurrentPoi = JSON.stringify(poi);
		
		AddClass('#install_by_step_edit_map_svg .poi_elem_'+nextIdPoi, 'active');
		AddClass('#install_by_step_edit_map_svg .poi_elem_'+nextIdPoi, 'movable');
		
		$('#install_by_step_edit_map_bPoiEditName').click();
        
    });
	
	$('#install_by_step_edit_map_bPoiCreateFromMap').click(function(e) {
        if (bystepCanChangeMenu)
		{
			blockZoom = true;
			
			$('#install_by_step_edit_map_boutonsPoi').show();
            $('#install_by_step_edit_map_boutonsStandard').hide();
			
			$('#install_by_step_edit_map_boutonsPoi #install_by_step_edit_map_bPoiSave').hide();
			$('#install_by_step_edit_map_boutonsPoi #install_by_step_edit_map_bPoiDelete').hide();
			$('#install_by_step_edit_map_boutonsPoi #install_by_step_edit_map_bPoiDirection').hide();
			$('#install_by_step_edit_map_boutonsPoi #install_by_step_edit_map_bPoiEditName').hide();
			
			bystepCurrentAction = 'addPoi';	
			currentStep = 'setPose';
			
			$('body').removeClass('no_current');
			$('body').addClass('addPoi');
			
			$('#install_by_step_edit_map_message_aide').html(textClickOnMapPose);
			$('#install_by_step_edit_map_message_aide').show();
		}
		else
			ByStepAvertCantChange();
    });
	
	$('#install_by_step_edit_map_bPoiEditSaveConfig').click(function(e) {
		if (bystepCurrentAction == 'addPoi')
		{
			ByStepSaveElementNeeded(false);
			
			nextIdPoi++;
			p = {'id_poi':nextIdPoi, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':currentPoiPose.final_pose_x, 'final_pose_y':currentPoiPose.final_pose_y, 'final_pose_t':currentPoiPose.final_pose_t, 'approch_pose_x':currentPoiPose.approch_pose_x, 'approch_pose_y':currentPoiPose.approch_pose_y, 'approch_pose_t':currentPoiPose.approch_pose_t, 'fiducial_pose_x':currentPoiPose.fiducial_pose_x, 'fiducial_pose_y':currentPoiPose.fiducial_pose_y, 'fiducial_pose_t':currentPoiPose.fiducial_pose_t, 'name':$('#install_by_step_edit_map_poi_name').val(), 'comment':'', 'icon':'', 'color':'', 'icon':'', 'active':true};
			ByStepAddHistorique({'action':'add_poi', 'data':JSON.stringify(p)});
			
			pois.push(p);
			ByStepTracePoi(pois.length-1);
			
			$('#install_by_step_edit_map_svg .poi_elem_current').remove();
			
			RemoveClass('#install_by_step_edit_map_svg .active', 'active');
			
			bystepCurrentAction = '';
			currentStep = '';
			
			$('#install_by_step_edit_map_boutonsRotate').hide();
			
			$('#install_by_step_edit_map_boutonsPoi').hide();
			$('#install_by_step_edit_map_boutonsStandard').show();
			$('#install_by_step_edit_map_message_aide').hide();
			blockZoom = false;
			
			$('body').addClass('no_current');
			
			ByStepSetModeSelect();
			
			
		}
		else
		{
			poi = pois[currentPoiIndex];
			poi.name = $('#install_by_step_edit_map_poi_name').val();
			if (poi.name == '') poi.name = 'POI';
		}
		
	});
	
	$('#install_by_step_edit_map_bPoiDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this POI?'))
		{
			DeletePoi(currentPoiIndex);
		}
    });
	
	$('#install_by_step_edit_map_bPoiEditName').click(function(e) {
   		poi = pois[currentPoiIndex];
		$('#install_by_step_edit_map_poi_name').val(poi.name);
	});
	
	$('#install_by_step_edit_map_bPoiDirection').click(function(e) {
        e.preventDefault();
		
		if ($('#install_by_step_edit_map_boutonsRotate').is(':visible'))
		{
			$('#install_by_step_edit_map_boutonsRotate').hide();
		}
		else
		{
			poi = pois[currentPoiIndex];
			
			//zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
			zoom = ByStepGetZoom();		
			p = $('#install_by_step_edit_map_svg image').position();
			
			x = poi.approch_pose_x * 100 / 5;
			y = poi.approch_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#install_by_step_edit_map_boutonsRotate').css('left', x - $('#install_by_step_edit_map_boutonsRotate').width()/2);
			$('#install_by_step_edit_map_boutonsRotate').css('top', y - 60);
			$('#install_by_step_edit_map_boutonsRotate').show();
		}
	});
	
	$('#install_by_step_edit_map_bAugmentedPoseCreateFromPose').click(function(e) {
		nextIdAugmentedPose++;
		p = {'id_augmented_pose':nextIdAugmentedPose, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':lastRobotPose.x, 'final_pose_y':lastRobotPose.y, 'final_pose_t':lastRobotPose.theta, 'approch_pose_x':lastRobotPose.x, 'approch_pose_y':lastRobotPose.y, 'approch_pose_t':lastRobotPose.theta, 'fiducial_pose_x':0, 'fiducial_pose_y':0, 'fiducial_pose_t':0, 'name':'Augmented pose', 'comment':'', 'color':'', 'icon':'', 'active':true};
		ByStepAddHistorique({'action':'add_augmented_pose', 'data':JSON.stringify(p)});
        augmented_poses.push(p);
		ByStepTraceAugmentedPose(augmented_poses.length-1);
		
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
		RemoveClass('#install_by_step_edit_map_svg .augmented_pose_elem', 'movable');
					
		currentSelectedItem = Array();
		currentSelectedItem.push({'type':'augmented_pose', 'id':$(this).data('id_augmented_pose')});	
		ByStepHideCurrentMenuNotSelect();
		
		$('#install_by_step_edit_map_boutonsAugmentedPose').show();
		
		$('#install_by_step_edit_map_boutonsStandard').hide();
		
		$('#install_by_step_edit_map_boutonsAugmentedPose a').show();
		
		$('body').removeClass('no_current select');
		$('.select').css("strokeWidth", minStokeWidth);
		
		bystepCurrentAction = 'editAugmentedPose';	
		currentStep = '';
		
		currentAugmentedPoseIndex = GetAugmentedPoseIndexFromID(nextIdAugmentedPose);
		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		saveCurrentAugmentedPose = JSON.stringify(augmented_pose);
		
		AddClass('#install_by_step_edit_map_svg .augmented_pose_elem_'+nextIdAugmentedPose, 'active');
		AddClass('#install_by_step_edit_map_svg .augmented_pose_elem_'+nextIdAugmentedPose, 'movable');
		
		$('#install_by_step_edit_map_bAugmentedPoseEditName').click();
        
    });
	
	$('#install_by_step_edit_map_bAugmentedPoseCreateFromMap').click(function(e) {
        if (bystepCanChangeMenu)
		{
			blockZoom = true;
			
			$('#install_by_step_edit_map_boutonsAugmentedPose').show();
            $('#install_by_step_edit_map_boutonsStandard').hide();
			
			$('#install_by_step_edit_map_boutonsAugmentedPose #install_by_step_edit_map_bAugmentedPoseSave').hide();
			$('#install_by_step_edit_map_boutonsAugmentedPose #install_by_step_edit_map_bAugmentedPoseDelete').hide();
			$('#install_by_step_edit_map_boutonsAugmentedPose #install_by_step_edit_map_bAugmentedPoseDirection').hide();
			$('#install_by_step_edit_map_boutonsAugmentedPose #install_by_step_edit_map_bAugmentedPoseEditName').hide();
			
			bystepCurrentAction = 'addAugmentedPose';	
			currentStep = 'setPose';
			
			$('body').removeClass('no_current');
			$('body').addClass('addAugmentedPose');
			
			$('#install_by_step_edit_map_message_aide').html(textClickOnMapPose);
			$('#install_by_step_edit_map_message_aide').show();
		}
		else
			ByStepAvertCantChange();
    });
	
	$('#install_by_step_edit_map_bAugmentedPoseEditSaveConfig').click(function(e) {
		if (bystepCurrentAction == 'addAugmentedPose')
		{
			ByStepSaveElementNeeded(false);
			
			nextIdAugmentedPose++;
			p = {'id_augmented_pose':nextIdAugmentedPose, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':currentAugmentedPosePose.final_pose_x, 'final_pose_y':currentAugmentedPosePose.final_pose_y, 'final_pose_t':currentAugmentedPosePose.final_pose_t, 'approch_pose_x':currentAugmentedPosePose.approch_pose_x, 'approch_pose_y':currentAugmentedPosePose.approch_pose_y, 'approch_pose_t':currentAugmentedPosePose.approch_pose_t, 'fiducial_pose_x':currentAugmentedPosePose.fiducial_pose_x, 'fiducial_pose_y':currentAugmentedPosePose.fiducial_pose_y, 'fiducial_pose_t':currentAugmentedPosePose.fiducial_pose_t, 'name':$('#install_by_step_edit_map_augmented_pose_name').val(), 'comment':'', 'icon':'', 'color':'', 'icon':'', 'active':true};
			ByStepAddHistorique({'action':'add_augmented_pose', 'data':JSON.stringify(p)});
			
			augmented_poses.push(p);
			ByStepTraceAugmentedPose(augmented_poses.length-1);
			
			$('#install_by_step_edit_map_svg .augmented_pose_elem_current').remove();
			
			RemoveClass('#install_by_step_edit_map_svg .active', 'active');
			
			bystepCurrentAction = '';
			currentStep = '';
			
			$('#install_by_step_edit_map_boutonsRotate').hide();
			
			$('#install_by_step_edit_map_boutonsAugmentedPose').hide();
			$('#install_by_step_edit_map_boutonsStandard').show();
			$('#install_by_step_edit_map_message_aide').hide();
			blockZoom = false;
			
			$('body').addClass('no_current');
			
			ByStepSetModeSelect();
			
			
		}
		else
		{
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			augmented_pose.name = $('#install_by_step_edit_map_augmented_pose_name').val();
			if (augmented_pose.name == '') augmented_pose.name = 'Augmented pose';
		}
		
	});
	
	$('#install_by_step_edit_map_bAugmentedPoseDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this Augmented pose?'))
		{
			DeleteAugmentedPose(currentAugmentedPoseIndex);
		}
    });
	
	$('#install_by_step_edit_map_bAugmentedPoseEditName').click(function(e) {
   		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		$('#install_by_step_edit_map_augmented_pose_name').val(augmented_pose.name);
	});
	
	$('#install_by_step_edit_map_bAugmentedPoseDirection').click(function(e) {
        e.preventDefault();
		
		if ($('#install_by_step_edit_map_boutonsRotate').is(':visible'))
		{
			$('#install_by_step_edit_map_boutonsRotate').hide();
		}
		else
		{
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			
			//zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
			zoom = ByStepGetZoom();		
			p = $('#install_by_step_edit_map_svg image').position();
			
			x = augmented_pose.approch_pose_x * 100 / 5;
			y = augmented_pose.approch_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#install_by_step_edit_map_boutonsRotate').css('left', x - $('#install_by_step_edit_map_boutonsRotate').width()/2);
			$('#install_by_step_edit_map_boutonsRotate').css('top', y - 60);
			$('#install_by_step_edit_map_boutonsRotate').show();
		}
	});
	
	window.oncontextmenu = function(event) {
		 event.preventDefault();
		 event.stopPropagation();
		 return false;
	};
	
	$(document).on('touchstart', '#install_by_step_edit_map_bRotateRight', function(e) {
		ByStepSaveElementNeeded(true);
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
		timerRotate = setInterval(function() { 
			if (bystepCurrentAction == 'addPoi')
			{
				currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) + Math.PI / 90;
				
				ByStepTraceCurrentPoi(currentPoiPose);
			}
			else if (bystepCurrentAction == 'addAugmentedPose')
			{
				currentAugmentedPosePose.approch_pose_t = parseFloat(currentAugmentedPosePose.approch_pose_t) + Math.PI / 90;
				
				ByStepTraceCurrentAugmentedPose(currentAugmentedPosePose);
			}
			else if (bystepCurrentAction == 'addDock')
			{
				currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) + Math.PI / 90;
				
				ByStepTraceCurrentDock(currentDockPose);
			}
			else if (bystepCurrentAction == 'editPoi')
			{
				poi = pois[currentPoiIndex];
				poi.approch_pose_t = parseFloat(poi.approch_pose_t) + Math.PI / 90;
				ByStepTracePoi(currentPoiIndex);			
			}
			else if (bystepCurrentAction == 'editAugmentedPose')
			{
				augmented_pose = augmented_poses[currentAugmentedPoseIndex];
				augmented_pose.approch_pose_t = parseFloat(augmented_pose.approch_pose_t) + Math.PI / 90;
				ByStepTraceAugmentedPose(currentAugmentedPoseIndex);			
			}
			else if (bystepCurrentAction == 'editDock')
			{
				dock = docks[currentDockIndex];
				dock.approch_pose_t = parseFloat(dock.approch_pose_t) + Math.PI / 90;
				ByStepTraceDock(currentDockIndex);		
			}
		}, 100);
    });
	
	$(document).on('touchend', '#install_by_step_edit_map_bRotateRight', function(e) {
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
    });
	
	$('#install_by_step_edit_map_bRotateRight').click(function(e) {
		ByStepSaveElementNeeded(true);
		if (bystepCurrentAction == 'addPoi')
		{
			currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) + Math.PI / 90;
			
			ByStepTraceCurrentPoi(currentPoiPose);
		}
		else if (bystepCurrentAction == 'addAugmentedPose')
		{
			currentAugmentedPosePose.approch_pose_t = parseFloat(currentAugmentedPosePose.approch_pose_t) + Math.PI / 90;
			
			ByStepTraceCurrentAugmentedPose(currentAugmentedPosePose);
		}
		else if (bystepCurrentAction == 'addDock')
		{
			currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) + Math.PI / 90;
			
			ByStepTraceCurrentDock(currentDockPose);
		}
		else if (bystepCurrentAction == 'editPoi')
		{
			poi = pois[currentPoiIndex];
			poi.approch_pose_t = parseFloat(poi.approch_pose_t) + Math.PI / 90;
			ByStepTracePoi(currentPoiIndex);			
		}
		else if (bystepCurrentAction == 'editAugmentedPose')
		{
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			augmented_pose.approch_pose_t = parseFloat(augmented_pose.approch_pose_t) + Math.PI / 90;
			ByStepTraceAugmentedPose(currentAugmentedPoseIndex);			
		}
		else if (bystepCurrentAction == 'editDock')
		{
			dock = docks[currentDockIndex];
			dock.approch_pose_t = parseFloat(dock.approch_pose_t) + Math.PI / 90;
			ByStepTraceDock(currentDockIndex);
		}
    });
	
	$(document).on('touchstart', '#install_by_step_edit_map_bRotateLeft', function(e) {
		ByStepSaveElementNeeded(true);
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
		timerRotate = setInterval(function() { 
			if (bystepCurrentAction == 'addPoi')
			{
				currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) - Math.PI / 90;
				
				ByStepTraceCurrentPoi(currentPoiPose);
			}
			else if (bystepCurrentAction == 'addAugmentedPose')
			{
				currentAugmentedPosePose.approch_pose_t = parseFloat(currentAugmentedPosePose.approch_pose_t) - Math.PI / 90;
				
				ByStepTraceCurrentAugmentedPose(currentAugmentedPosePose);
			}
			else if (bystepCurrentAction == 'addDock')
			{
				currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) - Math.PI / 90;
				
				ByStepTraceCurrentDock(currentDockPose);
			}
			else if (bystepCurrentAction == 'editPoi')
			{
				poi = pois[currentPoiIndex];
				poi.approch_pose_t = parseFloat(poi.approch_pose_t) - Math.PI / 90;
				ByStepTracePoi(currentPoiIndex);			
			}
			else if (bystepCurrentAction == 'editAugmentedPose')
			{
				augmented_pose = augmented_poses[currentAugmentedPoseIndex];
				augmented_pose.approch_pose_t = parseFloat(augmented_pose.approch_pose_t) - Math.PI / 90;
				ByStepTraceAugmentedPose(currentAugmentedPoseIndex);			
			}
			else if (bystepCurrentAction == 'editDock')
			{
				dock = docks[currentDockIndex];
				dock.approch_pose_t = parseFloat(dock.approch_pose_t) - Math.PI / 90;
				ByStepTraceDock(currentDockIndex);
			}
		}, 100);
    });
	
	$(document).on('touchend', '#install_by_step_edit_map_bRotateLeft', function(e) {
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
    });
	
	$('#install_by_step_edit_map_bRotateLeft').click(function(e) {
		ByStepSaveElementNeeded(true);
        if (bystepCurrentAction == 'addPoi')
		{
			currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) - Math.PI / 90;
			
			ByStepTraceCurrentPoi(currentPoiPose);
		}
		else if (bystepCurrentAction == 'addAugmentedPose')
		{
			currentAugmentedPosePose.approch_pose_t = parseFloat(currentAugmentedPosePose.approch_pose_t) - Math.PI / 90;
			
			ByStepTraceCurrentAugmentedPose(currentAugmentedPosePose);
		}
		else if (bystepCurrentAction == 'addDock')
		{
			currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) - Math.PI / 90;
			
			ByStepTraceCurrentDock(currentDockPose);
		}
		else if (bystepCurrentAction == 'editPoi')
		{
			poi = pois[currentPoiIndex];
			poi.approch_pose_t = parseFloat(poi.approch_pose_t) - Math.PI / 90;
			ByStepTracePoi(currentPoiIndex);			
		}
		else if (bystepCurrentAction == 'editAugmentedPose')
		{
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			augmented_pose.approch_pose_t = parseFloat(augmented_pose.approch_pose_t) - Math.PI / 90;
			ByStepTraceAugmentedPose(currentAugmentedPoseIndex);			
		}
		else if (bystepCurrentAction == 'editDock')
		{
			dock = docks[currentDockIndex];
			dock.approch_pose_t = parseFloat(dock.approch_pose_t) - Math.PI / 90;
			ByStepTraceDock(currentDockIndex);
		}        
    });
		
	InitTaille();
    
    var offsetMap;
    
    AppliquerZoom();
	
	ByStepSetModeSelect();
	
	$('#install_by_step_edit_map_svg').on('touchstart', function(e) {
		touchStarted = true;
		//zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
		zoom = ByStepGetZoom();
		
		if (bystepCurrentAction == 'gomme' && currentStep=='')
		{
			$('.times_icon_menu').hide();
			currentStep='trace';
			if (gommes.length == 0 || Object.keys(gommes[gommes.length-1]).length > 0)
			{
				gommes[gommes.length] = { 'size': sizeGomme, 'points':[] };
				//gommes[gommes.length-1].push({x:0, y:0}); // Point du curseur
				
				p = $('#install_by_step_edit_map_svg image').position();
				x = (e.originalEvent.targetTouches[0] ? e.originalEvent.targetTouches[0].pageX : e.originalEvent.changedTouches[e.changedTouches.length-1].pageX) - p.left;
				y = (e.originalEvent.targetTouches[0] ? e.originalEvent.targetTouches[0].pageY : e.originalEvent.changedTouches[e.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
								
				gommes[gommes.length-1].points.push({x:xRos, y:yRos});
				gommes[gommes.length-1].points.push({x:xRos+0.01, y:yRos+0.01}); // Point du curseur
				ByStepTraceCurrentGomme(gommes[gommes.length-1], gommes.length-1);
				
				bystepCanChangeMenu = false;
				$('#install_by_step_edit_map_bEndGomme').show();
			}
		}
		else if (bystepCurrentAction == 'addDock' && currentStep=='setPose')
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
			
			ByStepTraceCurrentDock(currentDockPose);
		}
		/*
		else if (bystepCurrentAction == 'addDock' && currentStep=='setDir')
		{
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approch_pose_t = GetAngleRadian(currentDockPose.approch_pose_x, currentDockPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			ByStepTraceCurrentDock(currentDockPose);
		}
		*/
		else if (bystepCurrentAction == 'addPoi' && currentStep=='setPose')
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
			
			ByStepTraceCurrentPoi(currentPoiPose);
		}
		else if (bystepCurrentAction == 'addAugmentedPose' && currentStep=='setPose')
		{
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentAugmentedPosePose.approch_pose_x = xRos;
			currentAugmentedPosePose.approch_pose_y = yRos;
			currentAugmentedPosePose.approch_pose_t = 0;
			
			ByStepTraceCurrentAugmentedPose(currentAugmentedPosePose);
		}

		/*
		else if (bystepCurrentAction == 'addDock' && currentStep=='setDir')
		{
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approch_pose_t = GetAngleRadian(currentPoiPose.approch_pose_x, currentPoiPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			ByStepTraceCurrentPoi(currentPoiPose);
		}
		*/
		/*
		else if (bystepCurrentAction == 'addForbiddenArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#install_by_step_edit_map_mapBox').height() - e.offsetY;
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
			ByStepTraceCurrentForbidden(currentForbiddenPoints);
		}
		else if (bystepCurrentAction == 'addArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#install_by_step_edit_map_mapBox').height() - e.offsetY;
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
			ByStepTraceCurrentArea(currentAreaPoints);
		}
		*/
	});
	
	$('#install_by_step_edit_map_svg').on('touchmove', function(e) {
		
		if ($('#install_by_step_edit_map_boutonsRotate').is(':visible'))
		{
			//zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
			zoom = ByStepGetZoom();
			 if (bystepCurrentAction == 'addDock')
			 {
				p = $('#install_by_step_edit_map_svg image').position();
				
				x = currentDockPose.approach_pose_x * 100 / 5;
				y = currentDockPose.approach_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#install_by_step_edit_map_boutonsRotate').css('left', x - $('#install_by_step_edit_map_boutonsRotate').width()/2);
				$('#install_by_step_edit_map_boutonsRotate').css('top', y - 60);
				$('#install_by_step_edit_map_boutonsRotate').show();
			 }
			 else if (bystepCurrentAction == 'addPoi')
			 {
				p = $('#install_by_step_edit_map_svg image').position();
			
				x = currentPoiPose.approach_pose_x * 100 / 5;
				y = currentPoiPose.approach_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#install_by_step_edit_map_boutonsRotate').css('left', x - $('#install_by_step_edit_map_boutonsRotate').width()/2);
				$('#install_by_step_edit_map_boutonsRotate').css('top', y - 60);
				$('#install_by_step_edit_map_boutonsRotate').show();
			 }
			 else if (bystepCurrentAction == 'addAugmentedPose')
			 {
				p = $('#install_by_step_edit_map_svg image').position();
			
				x = currentAugmentedPosePose.approach_pose_x * 100 / 5;
				y = currentAugmentedPosePose.approach_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#install_by_step_edit_map_boutonsRotate').css('left', x - $('#install_by_step_edit_map_boutonsRotate').width()/2);
				$('#install_by_step_edit_map_boutonsRotate').css('top', y - 60);
				$('#install_by_step_edit_map_boutonsRotate').show();
			 }
			 else if (bystepCurrentAction == 'editDock')
			 {
				dock = docks[currentDockIndex];
				
				p = $('#install_by_step_edit_map_svg image').position();
				
				
				x = dock.approch_pose_x * 100 / 5;
				y = dock.approch_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#install_by_step_edit_map_boutonsRotate').css('left', x - $('#install_by_step_edit_map_boutonsRotate').width()/2);
				$('#install_by_step_edit_map_boutonsRotate').css('top', y - 60);
				$('#install_by_step_edit_map_boutonsRotate').show();
			 }
			 else if (bystepCurrentAction == 'editPoi')
			 {
				poi = pois[currentPoiIndex];
				
				p = $('#install_by_step_edit_map_svg image').position();
				
				
				x = poi.approch_pose_x * 100 / 5;
				y = poi.approch_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#install_by_step_edit_map_boutonsRotate').css('left', x - $('#install_by_step_edit_map_boutonsRotate').width()/2);
				$('#install_by_step_edit_map_boutonsRotate').css('top', y - 60);
				$('#install_by_step_edit_map_boutonsRotate').show();
			 }
			 else if (bystepCurrentAction == 'editAugmentedPose')
			 {
				augmented_pose = augmented_poses[currentAugmentedPoseIndex];
				
				p = $('#install_by_step_edit_map_svg image').position();
				
				
				x = augmented_pose.approch_pose_x * 100 / 5;
				y = augmented_pose.approch_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#install_by_step_edit_map_boutonsRotate').css('left', x - $('#install_by_step_edit_map_boutonsRotate').width()/2);
				$('#install_by_step_edit_map_boutonsRotate').css('top', y - 60);
				$('#install_by_step_edit_map_boutonsRotate').show();
			 }
		}
		
		if (touchStarted)
		{
			//zoom = 1;
			zoom = ByStepGetZoom();
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
				  
					$('#install_by_step_edit_map_dock_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
					$('#install_by_step_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
				  
					delta = (bystepDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					dock.approch_pose_x = parseFloat(dock.approch_pose_x) - delta;
					delta = (bystepDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					dock.approch_pose_y = parseFloat(dock.approch_pose_y) + delta;
					
					//movableDown.attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					//movableDown.attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 5); 
					
					
					$('#install_by_step_edit_map_dock_'+movableDown.data('id_docking_station')).attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					$('#install_by_step_edit_map_dock_'+movableDown.data('id_docking_station')).attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 1); 
					
					$('#install_by_step_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('x1', dock.approch_pose_x * 100 / ros_resolution - 1);
					$('#install_by_step_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('y1', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 1); 
					$('#install_by_step_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('x2', dock.approch_pose_x * 100 / ros_resolution + 1);
					$('#install_by_step_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('y2', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 1); 
					
					x = dock.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution);	
					angle = 0 - dock.approch_pose_t * 180 / Math.PI - 90;
					
					$('#install_by_step_edit_map_dock_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					$('#install_by_step_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					
					//ByStepTraceDock(GetDockIndexFromID(movableDown.data('id_docking_station')));
				    
					bystepDownOnSVG_x = pageX;
					bystepDownOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'poi')
			   {
				   e.preventDefault();
				    
				   poi = GetPoiFromID(movableDown.data('id_poi'));
				   
				   pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
				   pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
				  	x = poi.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (poi.approch_pose_y * 100 / ros_resolution);
				  
					$('#install_by_step_edit_map_poi_sens_'+movableDown.data('id_poi')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
				  
					delta = (bystepDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					poi.approch_pose_x = parseFloat(poi.approch_pose_x) - delta;
					delta = (bystepDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					poi.approch_pose_y = parseFloat(poi.approch_pose_y) + delta;
					
					//movableDown.attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					//movableDown.attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 5); 
					
					x = poi.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (poi.approch_pose_y * 100 / ros_resolution);	
					angle = 0 - poi.approch_pose_t * 180 / Math.PI;
					
					$('#install_by_step_edit_map_poi_secure_'+movableDown.data('id_poi')).attr('cx', x);
					$('#install_by_step_edit_map_poi_secure_'+movableDown.data('id_poi')).attr('cy', y); 
					
					$('#install_by_step_edit_map_poi_robot_'+movableDown.data('id_poi')).attr('cx', x);
					$('#install_by_step_edit_map_poi_robot_'+movableDown.data('id_poi')).attr('cy', y);
										
					$('#install_by_step_edit_map_poi_sens_'+movableDown.data('id_poi')).attr('points', (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2));
					$('#install_by_step_edit_map_poi_sens_'+movableDown.data('id_poi')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					
					//ByStepTraceDock(GetDockIndexFromID(movableDown.data('id_docking_station')));
				    
					bystepDownOnSVG_x = pageX;
					bystepDownOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'augmented_pose')
			   {
				   e.preventDefault();
				    
				   augmented_pose = GetAugmentedPoseFromID(movableDown.data('id_augmented_pose'));
				   
				   pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
				   pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
				  	x = augmented_pose.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (augmented_pose.approch_pose_y * 100 / ros_resolution);
				  
					$('#install_by_step_edit_map_augmented_pose_sens_'+movableDown.data('id_augmented_pose')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
				  
					delta = (bystepDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					augmented_pose.approch_pose_x = parseFloat(augmented_pose.approch_pose_x) - delta;
					delta = (bystepDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					augmented_pose.approch_pose_y = parseFloat(augmented_pose.approch_pose_y) + delta;
					
					//movableDown.attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					//movableDown.attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 5); 
					
					x = augmented_pose.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (augmented_pose.approch_pose_y * 100 / ros_resolution);	
					angle = 0 - augmented_pose.approch_pose_t * 180 / Math.PI;
					
					$('#install_by_step_edit_map_augmented_pose_secure_'+movableDown.data('id_augmented_pose')).attr('cx', x);
					$('#install_by_step_edit_map_augmented_pose_secure_'+movableDown.data('id_augmented_pose')).attr('cy', y); 
					
					$('#install_by_step_edit_map_augmented_pose_robot_'+movableDown.data('id_augmented_pose')).attr('cx', x);
					$('#install_by_step_edit_map_augmented_pose_robot_'+movableDown.data('id_augmented_pose')).attr('cy', y);
										
					$('#install_by_step_edit_map_augmented_pose_sens_'+movableDown.data('id_augmented_pose')).attr('points', (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2));
					$('#install_by_step_edit_map_augmented_pose_sens_'+movableDown.data('id_augmented_pose')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					
					//ByStepTraceDock(GetDockIndexFromID(movableDown.data('id_docking_station')));
				    
					bystepDownOnSVG_x = pageX;
					bystepDownOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'forbidden')
			   {
				   e.preventDefault();
				    
				   forbidden = GetForbiddenFromID(movableDown.data('id_area'));
				   
				   pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
				   pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
					delta = (bystepDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					forbidden.points[movableDown.data('index_point')].x = parseFloat(forbidden.points[movableDown.data('index_point')].x) - delta;
					delta = (bystepDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					forbidden.points[movableDown.data('index_point')].y = parseFloat(forbidden.points[movableDown.data('index_point')].y) + delta;
					
					movableDown.attr('x', forbidden.points[movableDown.data('index_point')].x * 100 / ros_resolution - 5);
					movableDown.attr('y', ros_hauteur - (forbidden.points[movableDown.data('index_point')].y * 100 / ros_resolution) - 5); 
				
					ByStepTraceForbidden(GetForbiddenIndexFromID(movableDown.data('id_area')));
				    
					bystepDownOnSVG_x = pageX;
					bystepDownOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'area')
			   {
				   e.preventDefault();
				    
				   area = GetAreaFromID(movableDown.data('id_area'));
				   
				   pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
				   pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
					delta = (bystepDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					area.points[movableDown.data('index_point')].x = parseFloat(area.points[movableDown.data('index_point')].x) - delta;
					delta = (bystepDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					area.points[movableDown.data('index_point')].y = parseFloat(area.points[movableDown.data('index_point')].y) + delta;
					
					movableDown.attr('x', area.points[movableDown.data('index_point')].x * 100 / ros_resolution - 5);
					movableDown.attr('y', ros_hauteur - (area.points[movableDown.data('index_point')].y * 100 / ros_resolution) - 5); 
				
					ByStepTraceArea(GetAreaIndexFromID(movableDown.data('id_area')));
				    
					bystepDownOnSVG_x = pageX;
					bystepDownOnSVG_y = pageY;
			   }
			}
			else if (clickSelectSVG && bystepCurrentAction == 'select')
			{
				e.preventDefault();
				
				//clickSelectSVG_x_last = e.offsetX;
				//clickSelectSVG_y_last = e.offsetY;
				p = $('#install_by_step_edit_map_svg image').position();
				clickSelectSVG_x_last = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				clickSelectSVG_y_last = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				
				ByStepTraceSection(clickSelectSVG_x, clickSelectSVG_y, clickSelectSVG_x_last, clickSelectSVG_y_last);
			}
			else if (bystepCurrentAction == 'gomme' && (currentStep=='trace' || currentStep=='traced'))
			{
				e.preventDefault();
				currentStep ='traced';
				
				//x = e.offsetX;
				//y = $('#install_by_step_edit_map_mapBox').height() - e.offsetY;
				p = $('#install_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
								
				gommes[gommes.length-1].points.pop(); // Point du curseur
				gommes[gommes.length-1].points.push({x:xRos, y:yRos});
				gommes[gommes.length-1].points.push({x:xRos, y:yRos}); // Point du curseur
				ByStepTraceCurrentGomme(gommes[gommes.length-1], gommes.length-1);
			}
			else if (bystepCurrentAction == 'addDock' && currentStep=='setPose')
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
				
				ByStepTraceCurrentDock(currentDockPose);
			}
			/*
			else if (bystepCurrentAction == 'addDock' && currentStep=='setDir')
			{
				p = $('#install_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentDockPose.approch_pose_t = GetAngleRadian(currentDockPose.approch_pose_x, currentDockPose.approch_pose_y, xRos, yRos) + Math.PI;
								
				ByStepTraceCurrentDock(currentDockPose);
			}
			*/
			else if (bystepCurrentAction == 'addPoi' && currentStep=='setPose')
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
				
				ByStepTraceCurrentPoi(currentPoiPose);
			}
			else if (bystepCurrentAction == 'addAugmentedPose' && currentStep=='setPose')
			{
				p = $('#install_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentAugmentedPosePose.approch_pose_x = xRos;
				currentAugmentedPosePose.approch_pose_y = yRos;
				currentAugmentedPosePose.approch_pose_t = 0;
				
				ByStepTraceCurrentAugmentedPose(currentAugmentedPosePose);
			}
			/*
			else if (bystepCurrentAction == 'addPoi' && currentStep=='setDir')
			{
				p = $('#install_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentPoiPose.approch_pose_t = GetAngleRadian(currentPoiPose.approch_pose_x, currentPoiPose.approch_pose_y, xRos, yRos) + Math.PI;
								
				ByStepTraceCurrentPoi(currentPoiPose);
			}
			*/
			/*
			else if (bystepCurrentAction == 'addForbiddenArea' && currentStep=='trace')
			{
				e.preventDefault();
				
				//x = e.offsetX;
				//y = $('#install_by_step_edit_map_mapBox').height() - e.offsetY;
				p = $('#install_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentForbiddenPoints.pop(); // Point du curseur
				currentForbiddenPoints.push({x:xRos, y:yRos});
				ByStepTraceCurrentForbidden(currentForbiddenPoints);
			}
			else if (bystepCurrentAction == 'addArea' && currentStep=='trace')
			{
				e.preventDefault();
				
				//x = e.offsetX;
				//y = $('#install_by_step_edit_map_mapBox').height() - e.offsetY;
				p = $('#install_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentAreaPoints.pop(); // Point du curseur
				currentAreaPoints.push({x:xRos, y:yRos});
				ByStepTraceCurrentArea(currentAreaPoints);
			}
			*/
		}
	});
	
	$('#install_by_step_edit_map_svg').on('touchend', function(e) {
		touchStarted = false;
		zoom = ByStepGetZoom();
		if (downOnMovable)
		{
			downOnMovable = false;
			touchStarted = false;
			blockZoom = false;
			
			if (movableDown.data('element_type') == 'forbidden')
			{
				ByStepTraceForbidden(GetForbiddenIndexFromID(movableDown.data('id_area')));
			}
			else if (movableDown.data('element_type') == 'area')
			{
				ByStepTraceArea(GetAreaIndexFromID(movableDown.data('id_area')));
			}
		}
		if (bystepCurrentAction == 'gomme' && currentStep=='traced')
		{
			currentStep='';
			ByStepAddHistorique({'action':'gomme', 'data':gommes[gommes.length-1]});
		}
		else if (bystepCurrentAction == 'addDock' && currentStep=='setPose')
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
			
			ByStepTraceCurrentDock(currentDockPose);
			
			
			x = currentDockPose.approach_pose_x * 100 / 5;
			y = currentDockPose.approach_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#install_by_step_edit_map_boutonsRotate').css('left', x - $('#install_by_step_edit_map_boutonsRotate').width()/2);
			$('#install_by_step_edit_map_boutonsRotate').css('top', y - 60);
			$('#install_by_step_edit_map_boutonsRotate').show();
			$('#install_by_step_edit_map_bDockSave').show();
			
			//currentStep='setDir';
			//$('#install_by_step_edit_map_message_aide').html(textClickOnMapDir);
			
		}
		/*
		else if (bystepCurrentAction == 'addDock' && currentStep=='setDir')
		{
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approch_pose_t = GetAngleRadian(currentDockPose.approch_pose_x, currentDockPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			ByStepTraceCurrentDock(currentDockPose);
			
			$('#install_by_step_edit_map_boutonsDock #install_by_step_edit_map_bDockSave').show();
		}
		*/
		else if (bystepCurrentAction == 'addPoi' && currentStep=='setPose')
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
			
			ByStepTraceCurrentPoi(currentPoiPose);
			
			zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();		
			p = $('#install_by_step_edit_map_svg image').position();
			
			
			x = currentPoiPose.approach_pose_x * 100 / 5;
			y = currentPoiPose.approach_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#install_by_step_edit_map_boutonsRotate').css('left', x - $('#install_by_step_edit_map_boutonsRotate').width()/2);
			$('#install_by_step_edit_map_boutonsRotate').css('top', y - 60);
			$('#install_by_step_edit_map_boutonsRotate').show();
			$('#install_by_step_edit_map_bPoiSave').show();
			
			//currentStep='setDir';
			//$('#install_by_step_edit_map_message_aide').html(textClickOnMapDir);
		}
		else if (bystepCurrentAction == 'addAugmentedPose' && currentStep=='setPose')
		{
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentAugmentedPosePose.approach_pose_x = xRos;
			currentAugmentedPosePose.approach_pose_y = yRos;
			currentAugmentedPosePose.approach_pose_t = 0;
			
			ByStepTraceCurrentAugmentedPose(currentAugmentedPosePose);
			
			zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();		
			p = $('#install_by_step_edit_map_svg image').position();
			
			
			x = currentAugmentedPosePose.approach_pose_x * 100 / 5;
			y = currentAugmentedPosePose.approach_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#install_by_step_edit_map_boutonsRotate').css('left', x - $('#install_by_step_edit_map_boutonsRotate').width()/2);
			$('#install_by_step_edit_map_boutonsRotate').css('top', y - 60);
			$('#install_by_step_edit_map_boutonsRotate').show();
			$('#install_by_step_edit_map_bAugmentedPoseSave').show();
			
			//currentStep='setDir';
			//$('#install_by_step_edit_map_message_aide').html(textClickOnMapDir);
		}
		/*
		else if (bystepCurrentAction == 'addPoi' && currentStep=='setDir')
		{
			p = $('#install_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approch_pose_t = GetAngleRadian(currentPoiPose.approch_pose_x, currentPoiPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			ByStepTraceCurrentPoi(currentPoiPose);
			
			$('#install_by_step_edit_map_boutonsPoi #install_by_step_edit_map_bPoiSave').show();
		}
		*/
		/*
		else if (bystepCurrentAction == 'addForbiddenArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#install_by_step_edit_map_mapBox').height() - e.offsetY;
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
			ByStepTraceCurrentForbidden(currentForbiddenPoints);
		}
		else if (bystepCurrentAction == 'addArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#install_by_step_edit_map_mapBox').height() - e.offsetY;
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
			ByStepTraceCurrentArea(currentAreaPoints);
		}
		*/
	});
});

var touchStarted = false;

var statusSavingMapBeforeTestPoi = 0 ;
var timerSavingMapBeforeTestPoi = 0 ;

var statusSavingMapBeforeTestDock = 0 ;
var timerSavingMapBeforeTestDock = 0 ;

var statusSavingMapBeforeTestAugmentedPose = 0 ;
var timerSavingMapBeforeTestAugmentedPose = 0 ;

function TimerSavingMapBeforeTest(element){
	switch(element){
		case 'dock' : 
			if(statusSavingMapBeforeTestAugmentedPose == 2 && timerSavingMapBeforeTestAugmentedPose==100){
				statusSavingMapBeforeTestAugmentedPose=0;
				timerSavingMapBeforeTestAugmentedPose=0;
			}else{
				delay = statusSavingMapBeforeTestAugmentedPose == 2 ? 1 : 200;
				timerSavingMapBeforeTestAugmentedPose++;
				if(timerSavingMapBeforeTestAugmentedPose == 101)timerSavingMapBeforeTestAugmentedPose=0;
				$('.SaveBeforeTestDockProgress .progress-bar').css('width', timerSavingMapBeforeTestAugmentedPose+'%').attr('aria-valuenow', timerSavingMapBeforeTestAugmentedPose); 
				setTimeout(TimerSavingMapBeforeTest,delay,element);
			}
		
		break;
		case 'poi' : 
			if(statusSavingMapBeforeTestPoi == 2 && timerSavingMapBeforeTestPoi==100){
				statusSavingMapBeforeTestPoi=0;
				timerSavingMapBeforeTestPoi=0;
			}else{
				delay = statusSavingMapBeforeTestPoi == 2 ? 1 : 200;
				timerSavingMapBeforeTestPoi++;
				if(timerSavingMapBeforeTestPoi == 101)timerSavingMapBeforeTestPoi=0;
				$('.SaveBeforeTestPoiProgress .progress-bar').css('width', timerSavingMapBeforeTestPoi+'%').attr('aria-valuenow', timerSavingMapBeforeTestPoi); 
				setTimeout(TimerSavingMapBeforeTest,delay,element);
			}
		break;
		case 'augmented_pose' : 
			if(statusSavingMapBeforeTestDock == 2 && timerSavingMapBeforeTestDock==100){
				statusSavingMapBeforeTestDock=0;
				timerSavingMapBeforeTestDock=0;
			}else{
				delay = statusSavingMapBeforeTestDock == 2 ? 1 : 200;
				timerSavingMapBeforeTestDock++;
				if(timerSavingMapBeforeTestDock == 101)timerSavingMapBeforeTestDock=0;
				$('.SaveBeforeTestAugmentedPoseProgress .progress-bar').css('width', timerSavingMapBeforeTestDock+'%').attr('aria-valuenow', timerSavingMapBeforeTestDock); 
				setTimeout(TimerSavingMapBeforeTest,delay,element);
			}
		break;
		
	}
}

function PoiSave()
{
	if (bystepCurrentAction == 'addPoi')
	{
		$('#install_by_step_edit_map_poi_name').val('');
		$('#install_by_step_edit_map_modalPoiEditName').modal('show');
	}
	else if (bystepCurrentAction == 'editPoi')
	{	
		ByStepSaveElementNeeded(false);
		
		poi = pois[currentPoiIndex];
		RemoveClass('#install_by_step_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		
		ByStepAddHistorique({'action':'edit_poi', 'data':{'index':currentPoiIndex, 'old':saveCurrentPoi, 'new':JSON.stringify(pois[currentPoiIndex])}});
		saveCurrentPoi = pois[currentPoiIndex];
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		
		bystepCurrentAction = '';
		currentStep = '';
		
		$('#install_by_step_edit_map_boutonsRotate').hide();
		
		$('#install_by_step_edit_map_boutonsPoi').hide();
		$('#install_by_step_edit_map_boutonsStandard').show();
		$('#install_by_step_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		ByStepSetModeSelect();
	}
}

function PoiCancel()
{
	ByStepSaveElementNeeded(false);
	
	$('#install_by_step_edit_map_svg .poi_elem_current').remove();
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (bystepCurrentAction == 'addPoi')
	{
		$('#install_by_step_edit_map_svg .poi_elem_0').remove();
	}
	else if (bystepCurrentAction == 'editPoi')
	{
		poi = pois[currentPoiIndex];
		RemoveClass('#install_by_step_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		
		pois[currentPoiIndex] = JSON.parse(saveCurrentPoi);
		ByStepTracePoi(currentPoiIndex);
	}
	bystepCurrentAction = '';
	currentStep = '';
	
	$('#install_by_step_edit_map_boutonsRotate').hide();
	
	$('#install_by_step_edit_map_boutonsPoi').hide();
	$('#install_by_step_edit_map_boutonsStandard').show();
	$('#install_by_step_edit_map_message_aide').hide();
	blockZoom = false;
	
	ByStepSetModeSelect();
}

function AugmentedPoseSave()
{
	if (bystepCurrentAction == 'addAugmentedPose')
	{
		$('#install_by_step_edit_map_augmented_pose_name').val('');
		$('#install_by_step_edit_map_modalAugmentedPoseEditName').modal('show');
	}
	else if (bystepCurrentAction == 'editAugmentedPose')
	{	
		ByStepSaveElementNeeded(false);
		
		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		RemoveClass('#install_by_step_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'movable');
		
		ByStepAddHistorique({'action':'edit_augmented_pose', 'data':{'index':currentAugmentedPoseIndex, 'old':saveCurrentAugmentedPose, 'new':JSON.stringify(augmented_poses[currentAugmentedPoseIndex])}});
		saveCurrentAugmentedPose = JSON.stringify(augmented_poses[currentAugmentedPoseIndex]);
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		
		bystepCurrentAction = '';
		currentStep = '';
		
		$('#install_by_step_edit_map_boutonsRotate').hide();
		
		$('#install_by_step_edit_map_boutonsAugmentedPose').hide();
		$('#install_by_step_edit_map_boutonsStandard').show();
		$('#install_by_step_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		ByStepSetModeSelect();
	}
}

function AugmentedPoseCancel()
{
	ByStepSaveElementNeeded(false);
	
	$('#install_by_step_edit_map_svg .augmented_pose_elem_current').remove();
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (bystepCurrentAction == 'addAugmentedPose')
	{
		$('#install_by_step_edit_map_svg .augmented_pose_elem_0').remove();
	}
	else if (bystepCurrentAction == 'editAugmentedPose')
	{
		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		RemoveClass('#install_by_step_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'movable');
		
		augmented_poses[currentAugmentedPoseIndex] = JSON.parse(saveCurrentAugmentedPose);
		ByStepTraceAugmentedPose(currentAugmentedPoseIndex);
	}
	bystepCurrentAction = '';
	currentStep = '';
	
	$('#install_by_step_edit_map_boutonsRotate').hide();
	
	$('#install_by_step_edit_map_boutonsAugmentedPose').hide();
	$('#install_by_step_edit_map_boutonsStandard').show();
	$('#install_by_step_edit_map_message_aide').hide();
	blockZoom = false;
	
	ByStepSetModeSelect();
}

function DockSave()
{
	$('#install_by_step_edit_map_svg .dock_elem_current').remove();
	
	if (bystepCurrentAction == 'addDock')
	{
		ByStepSaveElementNeeded(false);
		
		nextIdDock++;
		num = GetMaxNumDock()+1;
		d = {'id_docking_station':nextIdDock, 'id_map':id_map, 'id_fiducial':$(this).data('id_fiducial'), 'final_pose_x':currentDockPose.final_pose_x, 'final_pose_y':currentDockPose.final_pose_y, 'final_pose_t':currentDockPose.final_pose_t, 'approch_pose_x':currentDockPose.approch_pose_x, 'approch_pose_y':currentDockPose.approch_pose_y, 'approch_pose_t':currentDockPose.approch_pose_t, 'fiducial_pose_x':currentDockPose.fiducial_pose_x, 'fiducial_pose_y':currentDockPose.fiducial_pose_y, 'fiducial_pose_t':currentDockPose.fiducial_pose_t, 'num':parseInt(num), 'name':'Dock '+num, 'comment':''};
		ByStepAddHistorique({'action':'add_dock', 'data':JSON.stringify(d)});
		
		docks.push(d);
		ByStepTraceDock(docks.length-1);
		
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		
		$('#install_by_step_edit_map_svg .dock_elem_0').remove();
		$('#install_by_step_edit_map_svg .dock_elem_current').remove();
		
		bystepCurrentAction = '';
		currentStep = '';
		
		$('#install_by_step_edit_map_boutonsRotate').hide();
	
		$('#install_by_step_edit_map_boutonsDock').hide();
		$('#install_by_step_edit_map_boutonsStandard').show();
		$('#install_by_step_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		ByStepSetModeSelect();
	}
	else if (bystepCurrentAction == 'editDock')
	{	
		ByStepSaveElementNeeded(false);
		
		
		dock = docks[currentDockIndex];
		RemoveClass('#install_by_step_edit_map_svg .dock_elem_'+dock.id_docking_station, 'movable');
		
		ByStepAddHistorique({'action':'edit_dock', 'data':{'index':currentDockIndex, 'old':saveCurrentDock, 'new':JSON.stringify(docks[currentDockIndex])}});
		saveCurrentDock = JSON.stringify(docks[currentDockIndex]);
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		
		bystepCurrentAction = '';
		currentStep = '';
		
		$('#install_by_step_edit_map_boutonsRotate').hide();
		
		$('#install_by_step_edit_map_boutonsDock').hide();
		$('#install_by_step_edit_map_boutonsStandard').show();
		$('#install_by_step_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		ByStepSetModeSelect();
	}
}

function DockCancel()
{
	ByStepSaveElementNeeded(false);
	
	$('#install_by_step_edit_map_svg .dock_elem_current').remove();
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (bystepCurrentAction == 'addDock')
	{
		$('#install_by_step_edit_map_svg .dock_elem_0').remove();
		$('#install_by_step_edit_map_svg .dock_elem_current').remove();
	}
	else if (bystepCurrentAction == 'editDock')
	{
		dock = docks[currentDockIndex];
		RemoveClass('#install_by_step_edit_map_svg .dock_elem_'+dock.id_docking_station, 'movable');
		
		docks[currentDockIndex] = JSON.parse(saveCurrentDock);
		ByStepTraceDock(currentDockIndex);
	}
	bystepCurrentAction = '';
	currentStep = '';
	
	$('#install_by_step_edit_map_boutonsRotate').hide();
	
	$('#install_by_step_edit_map_boutonsDock').hide();
	$('#install_by_step_edit_map_boutonsStandard').show();
	$('#install_by_step_edit_map_message_aide').hide();
	blockZoom = false;
	
	ByStepSetModeSelect();
}

function AreaSave()
{
	$('#install_by_step_edit_map_svg .area_elem_current').remove();
	
	if (bystepCurrentAction == 'addArea')
	{
		ByStepSaveElementNeeded(false);
		
		ByStepAddHistorique({'action':'edit_area', 'data':{'index':currentAreaIndex, 'old':saveCurrentArea, 'new':JSON.stringify(areas[currentAreaIndex])}});
		
		saveCurrentArea = JSON.stringify(areas[currentAreaIndex]);
		/*
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
		
		bystepCurrentAction = '';
		currentStep = '';
		
		$('#install_by_step_edit_map_boutonsForbidden').hide();
		$('#install_by_step_edit_map_boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		ByStepSetModeSelect();
		*/
		currentAreaByStepLongTouch = $('#install_by_step_edit_map_area_'+areas[currentAreaIndex].id_area);
		bystepCurrentAction = 'editArea';
	}
	else if (bystepCurrentAction == 'editArea')
	{
		ByStepSaveElementNeeded(false);
		
		ByStepAddHistorique({'action':'edit_area', 'data':{'index':currentAreaIndex, 'old':saveCurrentArea, 'new':JSON.stringify(areas[currentAreaIndex])}});
		
		saveCurrentArea = JSON.stringify(areas[currentAreaIndex]);
		/*
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		
		bystepCurrentAction = '';
		currentStep = '';
		
		$('#install_by_step_edit_map_boutonsArea').hide();
		$('#install_by_step_edit_map_boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		ByStepSetModeSelect();
		*/
	}
}

function AreaCancel()
{
	ByStepSaveElementNeeded(false);
	
	$('#install_by_step_edit_map_svg .area_elem_current').remove();
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (bystepCurrentAction == 'addArea')
	{
		DeleteArea(currentAreaIndex);
		bystepHistoriques.pop();
		bystepHistoriqueIndex--;
	}
	else if (bystepCurrentAction == 'editArea')
	{
		areas[currentAreaIndex] = JSON.parse(saveCurrentArea);
		ByStepTraceArea(currentAreaIndex);
	}
	bystepCurrentAction = '';
	currentStep = '';
	
	$('#install_by_step_edit_map_boutonsArea').hide();
	$('#install_by_step_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	ByStepSetModeSelect();
}

function ForbiddenSave()
{
	$('#install_by_step_edit_map_container_all .forbidden_elem_current').remove();
	
	if (bystepCurrentAction == 'addForbiddenArea')
	{
		ByStepSaveElementNeeded(false);
		
		ByStepAddHistorique({'action':'edit_forbidden', 'data':{'index':currentForbiddenIndex, 'old':saveCurrentForbidden, 'new':JSON.stringify(forbiddens[currentForbiddenIndex])}});
		
		saveCurrentForbidden = JSON.stringify(forbiddens[currentForbiddenIndex]);
		/*
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
		
		bystepCurrentAction = '';
		currentStep = '';
		
		$('#install_by_step_edit_map_boutonsForbidden').hide();
		$('#install_by_step_edit_map_boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		ByStepSetModeSelect();
		*/
		currentForbiddenByStepLongTouch = $('#install_by_step_edit_map_forbidden_'+forbiddens[currentForbiddenIndex].id_area);
		bystepCurrentAction = 'editForbiddenArea';
	}
	else if (bystepCurrentAction == 'editForbiddenArea')
	{	
		ByStepSaveElementNeeded(false);
		
		ByStepAddHistorique({'action':'edit_forbidden', 'data':{'index':currentForbiddenIndex, 'old':saveCurrentForbidden, 'new':JSON.stringify(forbiddens[currentForbiddenIndex])}});
		
		saveCurrentForbidden = JSON.stringify(forbiddens[currentForbiddenIndex]);
		
		/*
		RemoveClass('#install_by_step_edit_map_svg .active', 'active');
		RemoveClass('#install_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
		
		bystepCurrentAction = '';
		currentStep = '';
		
		$('#install_by_step_edit_map_boutonsForbidden').hide();
		$('#install_by_step_edit_map_boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		ByStepSetModeSelect();
		*/
	}
}

function ForbiddenCancel()
{
	ByStepSaveElementNeeded(false);
	
	$('#install_by_step_edit_map_svg .forbidden_elem_current').remove();
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (bystepCurrentAction == 'addForbiddenArea')
	{
		DeleteForbidden(currentForbiddenIndex);
		bystepHistoriques.pop();
		bystepHistoriqueIndex--;
	}
	else if (bystepCurrentAction == 'editForbiddenArea')
	{
		forbiddens[currentForbiddenIndex] = JSON.parse(saveCurrentForbidden);
		ByStepTraceForbidden(currentForbiddenIndex);
	}
	bystepCurrentAction = '';
	currentStep = '';
	
	$('#install_by_step_edit_map_boutonsForbidden').hide();
	$('#install_by_step_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	ByStepSetModeSelect();
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
	
	//zoom = ros_largeur / $('#install_by_step_edit_map_svg').width() / window.panZoom.getZoom();
	zoom = ByStepGetZoom();
	
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
	
	ByStepAddHistorique({'action':'delete_forbidden', 'data':indexInArray});
	
	data = forbiddens[indexInArray];
	$('#install_by_step_edit_map_svg .forbidden_elem_'+data.id_area).remove();
	
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');
	
	bystepCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	
	$('#install_by_step_edit_map_boutonsForbidden').hide();
    $('#install_by_step_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	ByStepSetModeSelect();
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
	console.log('Delete Area');
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	areas[indexInArray].deleted = true;
	
	ByStepAddHistorique({'action':'delete_area', 'data':indexInArray});
	
	data = areas[indexInArray];
	$('#install_by_step_edit_map_svg .area_elem_'+data.id_area).remove();
	
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');
	
	bystepCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#install_by_step_edit_map_boutonsArea').hide();
    $('#install_by_step_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	ByStepSetModeSelect();
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
	
	ByStepAddHistorique({'action':'delete_dock', 'data':indexInArray});
	
	data = docks[indexInArray];
	$('#install_by_step_edit_map_svg .dock_elem_'+data.id_docking_station).remove();
	
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');
	
	bystepCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#install_by_step_edit_map_boutonsDock').hide();
    $('#install_by_step_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	ByStepSetModeSelect();
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
	
	ByStepAddHistorique({'action':'delete_poi', 'data':indexInArray});
	
	data = pois[indexInArray];
	$('#install_by_step_edit_map_svg .poi_elem_'+data.id_poi).remove();
	
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');
	
	bystepCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#install_by_step_edit_map_boutonsPoi').hide();
    $('#install_by_step_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	ByStepSetModeSelect();
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

function DeleteAugmentedPose(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	augmented_poses[indexInArray].deleted = true;
	
	ByStepAddHistorique({'action':'delete_augmented_pose', 'data':indexInArray});
	
	data = augmented_poses[indexInArray];
	$('#install_by_step_edit_map_svg .augmented_pose_elem_'+data.id_augmented_pose).remove();
	
	RemoveClass('#install_by_step_edit_map_svg .active', 'active');
	
	bystepCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#install_by_step_edit_map_boutonsAugmentedPose').hide();
    $('#install_by_step_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	ByStepSetModeSelect();
}

function GetAugmentedPoseFromID(id)
{
	ret = null;
	$.each(augmented_poses, function(indexInArray, augmented_pose){
		if (augmented_pose.id_augmented_pose == id)
		{
			ret = augmented_pose;
			return ret;
		}
	});
	return ret;
}

function GetAugmentedPoseIndexFromID(id)
{
	ret = null;
	$.each(augmented_poses, function(indexInArray, augmented_pose){
		if (augmented_pose.id_augmented_pose == id)
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
