// JavaScript Document

var canvas;
var dessin;

var normalCurrentAction = '';
var currentStep = '';

var currentStepAddPoi = '';
var currentStepAddAugmentedPose = '';

var svgNormal;

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
var normalDownOnSVG = false;
var normalDownOnSVG_x = 0;
var normalDownOnSVG_y = 0;
var normalDownOnSVG_x_scroll = 0;
var normalDownOnSVG_y_scroll = 0;
var downOnMovable = false;
var movableDown = null;
var currentForbiddenPoints = Array();
var currentAreaPoints = Array();
var currentGommePoints = Array();
var ctrlZ = false;
var previewInProgress = false;
var displayHelpAddShelf = true;

var normalCanChangeMenu = true;

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

var normalSavedCanClose = true;

var indexDockElem = 0;
var indexPoiElem = 0;
var indexAugmentedPoseElem = 0;

var augmented_pose_temp_add = {};

var timerCantChange = null;
function NormalAvertCantChange()
{
	$('#install_normal_edit_map_bModalCancelEdit').click();
}

function NormalCloseSelect()
{
	normalCurrentAction = '';
	currentStep = '';
}


function NormalHideCurrentMenu()
{
	/*
	if (normalCurrentAction == 'export') CloseExport();
	if (normalCurrentAction == 'jobs') CloseJobs();
	if (normalCurrentAction == 'select') NormalCloseSelect()
	*/
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	$('body').attr('class', 'no_current');

	normalCurrentAction = '';
	currentStep = '';
}


function NormalHideCurrentMenuNotSelect()
{
	if (normalCurrentAction == 'select') return;
	
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	$('body').attr('class', 'no_current');
	
	normalCurrentAction = '';
	currentStep = '';
}

var normalHistoriques = Array();
var normalHistoriqueIndex = -1;


function NormalUndo()
{
	normalSavedCanClose = false;
	
	elem = normalHistoriques[normalHistoriqueIndex];
	switch(elem.action)
	{
		case 'gomme':
			gommes.pop();
			$('#install_normal_edit_map_svg .gomme_elem_current_'+gommes.length).remove();
			break;
		case 'add_forbidden':
			forbiddens.pop();
			$('#install_normal_edit_map_svg .forbidden_elem_'+elem.data.id_area).remove();
			break;
		case 'edit_forbidden':
			forbiddens[elem.data.index] = JSON.parse(elem.data.old);
			NormalTraceForbidden(elem.data.index);
			break;
		case 'delete_forbidden':
			forbiddens[elem.data].deleted = false;
			NormalTraceForbidden(elem.data);
			break;
		case 'add_area':
			areas.pop();
			$('#install_normal_edit_map_svg .area_elem_'+elem.data.id_area).remove();
			break;
		case 'edit_area':
			areas[elem.data.index] = JSON.parse(elem.data.old);
			NormalTraceArea(elem.data.index);
			break;
		case 'delete_area':
			areas[elem.data].deleted = false;
			NormalTraceArea(elem.data);
			break;
		case 'add_dock':
			docks.pop();
			$('#install_normal_edit_map_svg .dock_elem_'+elem.data.id_docking_station).remove();
			break;
		case 'edit_dock':
			docks[elem.data.index] = JSON.parse(elem.data.old);
			NormalTraceDock(elem.data.index);
			break;
		case 'delete_dock':
			docks[elem.data].deleted = false;
			NormalTraceDock(elem.data);
			break;
		case 'add_poi':
			pois.pop();
			$('#install_normal_edit_map_svg .poi_elem_'+elem.data.id_poi).remove();
			break;
		case 'edit_poi':
			pois[elem.data.index] = JSON.parse(elem.data.old);
			NormalTracePoi(elem.data.index);
			break;
		case 'delete_poi':
			pois[elem.data].deleted = false;
			NormalTracePoi(elem.data);
			break;
		case 'add_augmented_pose':
			augmented_poses.pop();
			$('#install_normal_edit_map_svg .augmented_pose_elem_'+elem.data.id_augmented_pose).remove();
			break;
		case 'edit_augmented_pose':
			augmented_poses[elem.data.index] = JSON.parse(elem.data.old);
			NormalTraceAugmentedPose(elem.data.index);
			break;
		case 'delete_augmented_pose':
			augmented_poses[elem.data].deleted = false;
			NormalTraceAugmentedPose(elem.data);
			break;
	}
	normalHistoriqueIndex--;
	
	NormalRefreshHistorique();
}

function NormalRedo()
{
	normalSavedCanClose = false;
	
	normalHistoriqueIndex++;
	
	elem = normalHistoriques[normalHistoriqueIndex];
	switch(elem.action)
	{
		case 'gomme':
			gommes.push(elem.data);
			NormalTraceCurrentGomme(gommes[gommes.length-1], gommes.length-1)
			break;
		case 'add_forbidden':
			forbiddens.push(elem.data);
			NormalTraceForbidden(forbiddens.length-1);
			break;
		case 'edit_forbidden':
			forbiddens[elem.data.index] = JSON.parse(elem.data.new);
			NormalTraceForbidden(elem.data.index);
			break;
		case 'delete_forbidden':
			forbiddens[elem.data].deleted = true;
			NormalTraceForbidden(elem.data);
			break;
		case 'add_area':
			areas.push(elem.data);
			NormalTraceArea(areas.length-1);
			break;
		case 'edit_area':
			areas[elem.data.index] = JSON.parse(elem.data.new);
			NormalTraceArea(elem.data.index);
			break;
		case 'delete_area':
			areas[elem.data].deleted = true;
			NormalTraceArea(elem.data);
			break;
		case 'add_dock':
			docks.push(elem.data);
			NormalTraceDock(docks.length-1);
			break;
		case 'edit_dock':
			docks[elem.data.index] = JSON.parse(elem.data.new);
			NormalTraceDock(elem.data.index);
			break;
		case 'delete_dock':
			docks[elem.data].deleted = true;
			NormalTraceDock(elem.data);
			break;
		case 'add_poi':
			pois.push(elem.data);
			NormalTracePoi(pois.length-1);
			break;
		case 'edit_poi':
			pois[elem.data.index] = JSON.parse(elem.data.new);
			NormalTracePoi(elem.data.index);
			break;
		case 'delete_poi':
			pois[elem.data].deleted = true;
			NormalTracePoi(elem.data);
			break;
		case 'add_augmented_pose':
			augmented_poses.push(elem.data);
			NormalTraceAugmentedPose(augmented_poses.length-1);
			break;
		case 'edit_augmented_pose':
			augmented_poses[elem.data.index] = JSON.parse(elem.data.new);
			NormalTraceAugmentedPose(elem.data.index);
			break;
		case 'delete_augmented_pose':
			augmented_poses[elem.data].deleted = true;
			NormalTraceAugmentedPose(elem.data);
			break;
	}
	
	NormalRefreshHistorique();
}

function NormalAddHistorique(elem)
{
	normalSavedCanClose = false;
	
	while (normalHistoriqueIndex < normalHistoriques.length-1)
		normalHistoriques.pop();
	
	normalHistoriques.push(elem);
	normalHistoriqueIndex++;
	
	NormalRefreshHistorique();
}
function NormalRefreshHistorique()
{
	if (normalHistoriqueIndex == -1)
		$('#install_normal_edit_map_bNormalUndo').addClass('disabled');
	else
		$('#install_normal_edit_map_bNormalUndo').removeClass('disabled');
	if (normalHistoriqueIndex == normalHistoriques.length-1)
		$('#install_normal_edit_map_bNormalRedo').addClass('disabled');
	else
		$('#install_normal_edit_map_bNormalRedo').removeClass('disabled');
}

function NormalSetModeSelect()
{
	$('body').addClass('select');
	normalCurrentAction = 'select';
	currentStep = '';
}

function NormalSaveElementNeeded(need)
{
	normalCanChangeMenu = !need;
	if (need)
	{
		$('#install_normal_edit_map_bSaveCurrentElem').show();
		$('#install_normal_edit_map_bCancelCurrentElem').show();
	}
	else
	{
		$('#install_normal_edit_map_bSaveCurrentElem').hide();
		$('#install_normal_edit_map_bCancelCurrentElem').hide();
	}
}

$(document).ready(function() {

	window.addEventListener('beforeunload', function(e){
		if (!normalSavedCanClose)
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
	
	
	svgNormal = document.querySelector('#install_normal_edit_map_svg');
	NormalInitSVG();
	
	$('#install_normal_edit_map #install_normal_edit_map_bEndGomme').click(function(e) {
        e.preventDefault();
		
		normalCanChangeMenu = true;
		$('#install_normal_edit_map_bEndGomme').hide();
		normalCurrentAction = '';
		currentStep = '';
		$('body').addClass('no_current');
		blockZoom = false;
		NormalSetModeSelect();
		
    });
	
	$('#install_normal_edit_map #install_normal_edit_map_bStop').click(function(e) {
        e.preventDefault();
		
		wycaApi.StopMove();	
    });
	
	$('#install_normal_edit_map #install_normal_edit_map_bSaveCurrentElem').click(function(e) {
        e.preventDefault();
		
		if (normalCurrentAction == 'addPoi' || normalCurrentAction == 'editPoi')
			NormalPoiSave();
		else if (normalCurrentAction == 'addAugmentedPose' || normalCurrentAction == 'editAugmentedPose')
			NormalAugmentedPoseSave();
		else if (normalCurrentAction == 'addDock' || normalCurrentAction == 'editDock')
			NormalDockSave();
		else if (normalCurrentAction == 'addArea' || normalCurrentAction == 'editArea')
			NormalAreaSave();
		else if (normalCurrentAction == 'addForbiddenArea' || normalCurrentAction == 'editForbiddenArea')
			NormalForbiddenSave();		
    });
	
	$('#install_normal_edit_map #install_normal_edit_map_bCancelCurrentElem').click(function(e) {
        e.preventDefault();
		
		if (normalCurrentAction == 'addPoi' || normalCurrentAction == 'editPoi')
			NormalPoiCancel();
		else if (normalCurrentAction == 'addAugmentedPose' || normalCurrentAction == 'editAugmentedPose')
			NormalAugmentedPoseCancel();
		else if (normalCurrentAction == 'addDock' || normalCurrentAction == 'editDock')
			NormalDockCancel();
		else if (normalCurrentAction == 'addArea' || normalCurrentAction == 'editArea')
			NormalAreaCancel();
		else if (normalCurrentAction == 'addForbiddenArea' || normalCurrentAction == 'editForbiddenArea')
			NormalForbiddenCancel();		
    });
	
	$('#install_normal_edit_map_bNormalUndo').click(function(e) {
        e.preventDefault();
		if (!$('#install_normal_edit_map_bNormalUndo').hasClass('disabled'))
			NormalUndo();
	});
	$('#install_normal_edit_map_bNormalUndo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#install_normal_edit_map_bNormalUndo').hasClass('disabled'))
			NormalUndo();
	});
	
	$('#install_normal_edit_map_bNormalRedo').click(function(e) {
        e.preventDefault();
		if (!$('#install_normal_edit_map_bNormalRedo').hasClass('disabled'))
			NormalRedo();
    });
	$('#install_normal_edit_map_bNormalRedo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#install_normal_edit_map_bNormalRedo').hasClass('disabled'))
			NormalRedo();
	});
	
	$(document).on('touchstart', '#install_normal_edit_map_svg .movable', function(e) {
		if (normalCurrentAction != 'gomme')
		{
			touchStarted = true;
			downOnMovable = true;
			movableDown = $(this);
			//normalDownOnSVG_x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
			//normalDownOnSVG_y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
			normalDownOnSVG_x = parseFloat($(this).attr('x')) + parseFloat($(this).attr('width'))/2;
			normalDownOnSVG_y = parseFloat($(this).attr('y')) + parseFloat($(this).attr('height'))/2;
			
			p = $('#install_normal_edit_map_svg image').position();
			zoom = NormalGetZoom();
			
			normalDownOnSVG_x = normalDownOnSVG_x / zoom + p.left;
			normalDownOnSVG_y = normalDownOnSVG_y / zoom + p.top;
			
			NormalSaveElementNeeded(true);
			
			blockZoom = true;
		}
    });
	
	
	$(document).on('touchstart', '#install_normal_edit_map_svg .secable', function(e) {
		zoom = NormalGetZoom();
		if (normalCurrentAction == 'editForbiddenArea' || normalCurrentAction == 'addForbiddenArea')
		{
			p = $('#install_normal_edit_map_svg image').position();
			x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[e.changedTouches.length-1].pageX) : event.pageX ) - p.left;
			y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[e.changedTouches.length-1].pageY) : event.pageY ) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			tailleArea = 1*zoom;
			tailleArea = 1;
			
			
			forbiddens[currentForbiddenIndex].points.splice($(this).data('index_point'), 0, {x:xRos, y:yRos});
			NormalTraceForbidden(currentForbiddenIndex);
		}
		else if (normalCurrentAction == 'editArea' || normalCurrentAction == 'addArea')
		{
			p = $('#install_normal_edit_map_svg image').position();
			x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[e.changedTouches.length-1].pageX) : event.pageX ) - p.left;
			y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[e.changedTouches.length-1].pageY) : event.pageY ) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			tailleArea = 1*zoom;
			tailleArea = 1;
			
			
			areas[currentAreaIndex].points.splice($(this).data('index_point'), 0, {x:xRos, y:yRos});
			NormalTraceArea(currentAreaIndex);
		}
    });
	
	$('#install_normal_edit_map_menu_point .bDeletePoint').click(function(e) {
        e.preventDefault();
		NormalHideMenus();
		if (normalCurrentAction == 'editForbiddenArea' || normalCurrentAction == 'addForbiddenArea')
		{
			forbiddens[currentForbiddenIndex].points.splice(currentPointNormalLongTouch.data('index_point'), 1);
			NormalTraceForbidden(currentForbiddenIndex);
		}
		else if (normalCurrentAction == 'editArea' || normalCurrentAction == 'addArea')
		{
			areas[currentAreaIndex].points.splice(currentPointNormalLongTouch.data('index_point'), 1);
			NormalTraceArea(currentAreaIndex);
		}
    });
	
	$('#install_normal_edit_map_menu_forbidden .bDeleteForbidden').click(function(e) {
        e.preventDefault();
		NormalHideMenus();
		if (normalCurrentAction == "select" || normalCurrentAction == 'editForbiddenArea')
		{
			i = GetForbiddenIndexFromID(currentForbiddenNormalLongTouch.data('id_area'));
			NormalDeleteForbidden(i);	
		}
    });
	
	$('#install_normal_edit_map_menu_area .bDeleteArea').click(function(e) {
        e.preventDefault();
		NormalHideMenus();
		if (normalCurrentAction == "select" || normalCurrentAction == 'editArea')
		{
			i = GetAreaIndexFromID(currentAreaNormalLongTouch.data('id_area'));
			NormalDeleteArea(i);	
		}
    });
	
	$('#install_normal_edit_map_menu_area .bConfigArea').click(function(e) {
        e.preventDefault();
		NormalHideMenus();
		if (normalCurrentAction == "select" || normalCurrentAction == 'editArea')
		{
			currentAreaIndex = GetAreaIndexFromID(currentAreaNormalLongTouch.data('id_area'));
			area = areas[currentAreaIndex];
			if (area.configs != undefined)
			{
				$.each(area.configs, function( indexConfig, config ) {
					switch(config.name)
					{
						case 'led_color_mode': $('#install_normal_edit_map_led_color_mode').val(config.value); break;
						case 'led_color': $('#install_normal_edit_map_led_color').val(config.value); $('#install_normal_edit_map_led_color').keyup(); break;
						case 'led_animation_mode': $('#install_normal_edit_map_led_animation_mode').val(config.value); break;
						case 'led_animation': $('#install_normal_edit_map_led_animation').val(config.value); break;
						case 'max_speed_mode': $('#install_normal_edit_map_max_speed_mode').val(config.value); break;
						case 'max_speed': $('#install_normal_edit_map_max_speed').val(config.value); break;
					}
				});
			}
			else
			{
				$('#install_normal_edit_map_led_color_mode').val('Automatic');
				$('#install_normal_edit_map_led_animation_mode').val('Automatic');
				$('#install_normal_edit_map_max_speed_mode').val('Automatic');
			}
			
			$('#install_normal_edit_map_area_color').val('rgb('+area.color_r+','+area.color_g+','+area.color_b+')'); $('#install_normal_edit_map_area_color').keyup();
			
			if ($('#install_normal_edit_map_led_color_mode').val() == 'Automatic') $('#install_normal_edit_map_led_color_group').hide(); else  $('#install_normal_edit_map_led_color_group').show();
			if ($('#install_normal_edit_map_led_animation_mode').val() == 'Automatic') $('#install_normal_edit_map_led_animation_group').hide(); else  $('#install_normal_edit_map_led_animation_group').show();
			if ($('#install_normal_edit_map_max_speed_mode').val() == 'Automatic') $('#install_normal_edit_map_max_speed_group').hide(); else  $('#install_normal_edit_map_max_speed_group').show();
			$('#install_normal_edit_map_container_all .modalAreaOptions').modal('show');
		}
    });
	
	$('#install_normal_edit_map_menu_dock .bDeleteDock').click(function(e) {
        e.preventDefault();
		NormalHideMenus();
		i = GetDockIndexFromID(currentDockNormalLongTouch.data('id_docking_station'));
		NormalDeleteDock(i);
    });
	
	$('#install_normal_edit_map_menu_dock .bConfigDock').click(function(e) {
        e.preventDefault();
		NormalHideMenus();
		normalCurrentAction = 'editDock';
	
		currentDockIndex = GetDockIndexFromID(currentDockNormalLongTouch.data('id_docking_station'));
		dock = docks[currentDockIndex];
		$('#install_normal_edit_map_dock_is_master').prop('checked', dock.is_master);
		$('#install_normal_edit_map_dock_number').val(dock.num);
		$('#install_normal_edit_map_dock_name').val(dock.name);
		$('#install_normal_edit_map_dock_comment').val(dock.comment);
		
		$('#install_normal_edit_map_container_all .modalDockOptions .list_undock_procedure li').remove();
		
		if (dock.undock_path.length > 0)
		{
			$.each(dock.undock_path, function( indexConfig, undock_step ) {
	
				console.log(undock_step);
				indexDockElem++;
				
				if (undock_step.linear_distance != 0)
				{				
					distance = undock_step.linear_distance;
					direction = undock_step.linear_distance > 0 ? 'front':'back';
					
					$('#install_normal_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
						'<li id="install_normal_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="move" data-distance="' + distance + '">'+
						'	<span>Move ' + ((direction == 'back')?'back':'front') + ' ' + ((direction == 'back')?distance*-1:distance) + 'm</span>'+
						'	<a href="#" class="bNormalUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bNormalUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				else
				{	
					angle = undock_step.angular_distance * 180 / Math.PI;
					angle = Math.round(angle*100)/100;
					
					$('#install_normal_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
						'<li id="install_normal_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="rotate" data-angle="'+angle+'">'+
						'	<span>Rotate '+angle+'°</span>'+
						'	<a href="#" class="bNormalUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bNormalUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				
			});		
		}
		
		$('#install_normal_edit_map_container_all .modalDockOptions').modal('show');
    });
	
	$('#install_normal_edit_map .bTestDock').click(function(e) {
        e.preventDefault();
		
		if (currentDockNormalLongTouch.data('id_docking_station') >= 300000)
		{
			alert_wyca('You must save the map before testing a new docking station');
		}
		else
		{
			NormalHideMenus();
			
			wycaApi.on('onGoToChargeResult', function (data){
				$('#install_normal_edit_map_bStop').hide();
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#install_normal_edit_map .modalFinTest section.panel-success').show();
					$('#install_normal_edit_map .modalFinTest section.panel-danger').hide();
				}
				else
				{
					$('#install_normal_edit_map .modalFinTest section.panel-success').hide();
					$('#install_normal_edit_map .modalFinTest section.panel-danger').show();
					
					if (data.M != '')
						$('#install_normal_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						$('#install_normal_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
				}
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToChargeResult', onGoToChargeResult);
				
				$('#install_normal_edit_map .modalFinTest').modal('show');
			});
			wycaApi.GoToCharge(currentDockNormalLongTouch.data('id_docking_station'), function (data){
				
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#install_normal_edit_map_bStop').show();
				}
				else
				{
					$('#install_normal_edit_map .modalFinTest section.panel-success').hide();
					$('#install_normal_edit_map .modalFinTest section.panel-danger').show();
					
					if (data.M != '')
						$('#install_normal_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						$('#install_normal_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
					
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToChargeResult', onGoToChargeResult);
					
					$('#install_normal_edit_map .modalFinTest').modal('show');
				}
			});
		}
    });
	
	$('#install_normal_edit_map_menu_poi .bDeletePoi').click(function(e) {
        e.preventDefault();
		NormalHideMenus();
		i = GetPoiIndexFromID(currentPoiNormalLongTouch.data('id_poi'));
		NormalDeletePoi(i);
    });
	
	$('#install_normal_edit_map_menu_poi .bConfigPoi').click(function(e) {
        e.preventDefault();
		NormalHideMenus();
		normalCurrentAction = 'editPoi';
	
		currentPoiIndex = GetPoiIndexFromID(currentPoiNormalLongTouch.data('id_poi'));
		poi = pois[currentPoiIndex];
		
		$('#install_normal_edit_map_poi_name').val(poi.name);
		$('#install_normal_edit_map_poi_comment').val(poi.comment);
		
		$('#install_normal_edit_map_container_all .modalPoiOptions').modal('show');
		
    });
	
	$('#install_normal_edit_map .bTestPoi').click(function(e) {
        e.preventDefault();
		
		if (currentPoiNormalLongTouch.data('id_poi') >= 300000)
		{
			alert_wyca('You must save the map before testing a new POI');
		}
		else
		{
			NormalHideMenus();
			wycaApi.on('onGoToPoiResult', function (data){
				$('#install_normal_edit_map_bStop').hide();
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#install_normal_edit_map .modalFinTest section.panel-success').show();
					$('#install_normal_edit_map .modalFinTest section.panel-danger').hide();
				}
				else
				{
					$('#install_normal_edit_map .modalFinTest section.panel-success').hide();
					$('#install_normal_edit_map .modalFinTest section.panel-danger').show();
					
					if (data.M != '')
						$('#install_normal_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						$('#install_normal_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
				}
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToPoiResult', onGoToPoiResult);
			
				$('#install_normal_edit_map .modalFinTest').modal('show');
			});
			
			wycaApi.GoToPoi(currentPoiNormalLongTouch.data('id_poi'), function (data){
				
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#install_normal_edit_map_bStop').show();
				}
				else
				{
					$('#install_normal_edit_map .modalFinTest section.panel-success').hide();
					$('#install_normal_edit_map .modalFinTest section.panel-danger').show();
					
					if (data.M != '')
						$('#install_normal_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						$('#install_normal_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
				
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoiResult', onGoToPoiResult);
					
					$('#install_normal_edit_map .modalFinTest').modal('show');
				}
			});
		}
    });
	
	$('#install_normal_edit_map_menu_augmented_pose .bDeleteAugmentedPose').click(function(e) {
        e.preventDefault();
		NormalHideMenus();
		i = GetAugmentedPoseIndexFromID(currentAugmentedPoseNormalLongTouch.data('id_augmented_pose'));
		NormalDeleteAugmentedPose(i);
    });
	
	$('#install_normal_edit_map_menu_augmented_pose .bConfigAugmentedPose').click(function(e) {
        e.preventDefault();
		NormalHideMenus();
		normalCurrentAction = 'editAugmentedPose';
	
		currentAugmentedPoseIndex = GetAugmentedPoseIndexFromID(currentAugmentedPoseNormalLongTouch.data('id_augmented_pose'));
		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		
		$('#install_normal_edit_map_augmented_pose_name').val(augmented_pose.name);
		$('#install_normal_edit_map_augmented_pose_comment').val(augmented_pose.comment);
		
		$('#install_normal_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose li').remove();
		
		if (augmented_pose.undock_path.length > 0)
		{
			$.each(augmented_pose.undock_path, function( indexConfig, undock_step ) {
	
				console.log(undock_step);
				indexAugmentedPoseElem++;
				
				if (undock_step.linear_distance != 0)
				{				
					distance = undock_step.linear_distance;
					direction = undock_step.linear_distance > 0 ? 'front':'back';
					
					$('#install_normal_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
						'<li id="install_normal_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="move" data-distance="' + distance + '">'+
						'	<span>Move ' + ((direction == 'back')?'back':'front') + ' ' + ((direction == 'back')?distance*-1:distance) + 'm</span>'+
						'	<a href="#" class="bNormalUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bNormalUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				else
				{	
					angle = undock_step.angular_distance * 180 / Math.PI;
					angle = Math.round(angle*100)/100;
					
					$('#install_normal_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
						'<li id="install_normal_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="rotate" data-angle="'+angle+'">'+
						'	<span>Rotate '+angle+'°</span>'+
						'	<a href="#" class="bNormalUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bNormalUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				
			});		
		}
		
		$('#install_normal_edit_map_container_all .modalAugmentedPoseOptions').modal('show');
		
    });
	
	$('#install_normal_edit_map .bTestAugmentedPose').click(function(e) {
        e.preventDefault();
		
		if (currentAugmentedPoseNormalLongTouch.data('id_augmented_pose') >= 300000)
		{
			alert_wyca('You must save the map before testing a new augmented pose');
		}
		else
		{
			NormalHideMenus();
			wycaApi.on('onGoToAugmentedPoseResult', function (data){
				$('#install_normal_edit_map_bStop').hide();
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#install_normal_edit_map .modalFinTest section.panel-success').show();
					$('#install_normal_edit_map .modalFinTest section.panel-danger').hide();
				}
				else
				{
					$('#install_normal_edit_map .modalFinTest section.panel-success').hide();
					$('#install_normal_edit_map .modalFinTest section.panel-danger').show();
					
					if (data.M != '')
						$('#install_normal_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						$('#install_normal_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
				}
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
			
				$('#install_normal_edit_map .modalFinTest').modal('show');
			});
			
			wycaApi.GoToAugmentedPose(currentAugmentedPoseNormalLongTouch.data('id_augmented_pose'), function (data){
				
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#install_normal_edit_map_bStop').show();
				}
				else
				{
					$('#install_normal_edit_map .modalFinTest section.panel-success').hide();
					$('#install_normal_edit_map .modalFinTest section.panel-danger').show();
					
					if (data.M != '')
						$('#install_normal_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						$('#install_normal_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
				
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
					
					$('#install_normal_edit_map .modalFinTest').modal('show');
				}
			});
		}
    });
	
	$('#install_normal_edit_map_svg').on('contextmenu', function (e) {
		
		if (normalCurrentAction == 'gomme' && currentStep=='trace')
		{
			currentStep = '';
			currentGommePoints.pop(); // Point du curseur
			NormalTraceCurrentGomme(currentGommePoints);
			return false;
			
		}
		/*
		else if (normalCurrentAction == 'addForbiddenArea' && currentStep=='trace')
		{
			currentStep = '';
			currentForbiddenPoints.pop(); // Point du curseur
			NormalTraceCurrentForbidden(currentForbiddenPoints);
			return false;
		}
		else if (normalCurrentAction == 'addArea' && currentStep=='trace')
		{
			currentStep = '';
			currentAreaPoints.pop(); // Point du curseur
			NormalTraceCurrentArea(currentAreaPoints);
			return false;
		}
		*/
    });
	
	/**************************/
	/*        ZOOM            */
	/**************************/
	
	$('#install_normal_edit_map_zone_zoom_click').mousedown(function(e) {
       e.preventDefault();
	   downOnZoomClick = true;
    });
	$('#install_normal_edit_map_zone_zoom_click').mousemove(function(e) {
       e.preventDefault();
	   if (downOnZoomClick)
	   {
			w = $('#install_normal_edit_map_zoom_carte').width();
			h = $('#install_normal_edit_map_zoom_carte').height();
			
			wZoom = $('#install_normal_edit_map_zone_zoom').width();
			hZoom = $('#install_normal_edit_map_zone_zoom').height();
			
			x = e.offsetX - wZoom / 2;
			y = e.offsetY - hZoom / 2;
					
			//zoom = ros_largeur / $('#install_normal_edit_map_svg').width() / window.panZoomNormal.getZoom();
			zoom = NormalGetZoom();
			
			largeur_img = ros_largeur / zoom
			
			x = - x / w * largeur_img;
			y = - y / w * largeur_img;
			
			window.panZoomNormal.pan({'x':x, 'y':y});
	   }
    });
	
	$('#install_normal_edit_map_zone_zoom_click').click(function(e) {
		e.preventDefault();
		
		w = $('#install_normal_edit_map_zoom_carte').width();
		h = $('#install_normal_edit_map_zoom_carte').height();
		
		wZoom = $('#install_normal_edit_map_zone_zoom').width();
		hZoom = $('#install_normal_edit_map_zone_zoom').height();
		
		x = e.offsetX - wZoom / 2;
		y = e.offsetY - hZoom / 2;
				
		//zoom = ros_largeur / $('#install_normal_edit_map_svg').width() / window.panZoomNormal.getZoom();
		zoom = NormalGetZoom();
		
		largeur_img = ros_largeur / zoom
		
		x = - x / w * largeur_img;
		y = - y / w * largeur_img;
		
		window.panZoomNormal.pan({'x':x, 'y':y});
	});
	
	$('#install_normal_edit_map_zone_zoom_click').on('touchstart', function(e) {
       e.preventDefault();
	   downOnZoomClick = true;
	   
	    w = $('#install_normal_edit_map_zoom_carte').width();
		h = $('#install_normal_edit_map_zoom_carte').height();
		
		wZoom = $('#install_normal_edit_map_zone_zoom').width();
		hZoom = $('#install_normal_edit_map_zone_zoom').height();
		
		r = document.getElementById("install_normal_edit_map_zoom_carte_container").getBoundingClientRect();
		
		x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) - r.left;
		y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - r.top;
		
		x = x - wZoom / 2;
		y = y - hZoom / 2;
				
		//zoom = ros_largeur / $('#install_normal_edit_map_svg').width() / window.panZoomNormal.getZoom();
		zoom = NormalGetZoom();
		
		largeur_img = ros_largeur / zoom
		
		x = - x / w * largeur_img;
		y = - y / w * largeur_img;
		
		window.panZoomNormal.pan({'x':x, 'y':y});
	   
    });
	$('#install_normal_edit_map_zone_zoom_click').on('touchend', function(e) {
       e.preventDefault();
	   downOnZoomClick = false;
    });
	$('#install_normal_edit_map_zone_zoom_click').on('touchmove', function(e) {
       e.preventDefault();
	   if (downOnZoomClick)
	   {
		    w = $('#install_normal_edit_map_zoom_carte').width();
			h = $('#install_normal_edit_map_zoom_carte').height();
			
			wZoom = $('#install_normal_edit_map_zone_zoom').width();
			hZoom = $('#install_normal_edit_map_zone_zoom').height();
			
			r = document.getElementById("install_normal_edit_map_zoom_carte_container").getBoundingClientRect();
		
			x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) - r.left;
			y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - r.top;
			
			x = x - wZoom / 2;
			y = y - hZoom / 2;
					
			//zoom = ros_largeur / $('#install_normal_edit_map_svg').width() / window.panZoomNormal.getZoom();
			zoom = NormalGetZoom();
			
			largeur_img = ros_largeur / zoom
			
			x = - x / w * largeur_img;
			y = - y / w * largeur_img;
			
			window.panZoomNormal.pan({'x':x, 'y':y});
	   }
    });
	
	/**************************/
	/*  Click on element      */
	/**************************/
	
	$(document).on('click', '#install_normal_edit_map_svg .forbidden_elem', function(e) {
		e.preventDefault();
		
		if ((normalCurrentAction == 'addArea' || normalCurrentAction == 'addForbiddenArea') && currentStep == 'trace')
		{
		}
		else if (normalCurrentAction == 'gomme')
		{
		}
		else if (normalCanChangeMenu)
		{
			RemoveClass('#install_normal_edit_map_svg .active', 'active');
			RemoveClass('#install_normal_edit_map_svg .activ_select', 'activ_select'); 
			
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'forbidden', 'id':$(this).data('id_area')});	
			NormalHideCurrentMenuNotSelect();
			
			$('#install_normal_edit_map_boutonsForbidden').show();
            $('#install_normal_edit_map_boutonsStandard').hide();
			
			$('#install_normal_edit_map_boutonsForbidden #install_normal_edit_map_bForbiddenDelete').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			normalCurrentAction = 'editForbiddenArea';	
			currentStep = '';
			
			currentForbiddenIndex = GetForbiddenIndexFromID($(this).data('id_area'));
			forbidden = forbiddens[currentForbiddenIndex];
			saveCurrentForbidden = JSON.stringify(forbidden);
			
			AddClass('#install_normal_edit_map_svg .forbidden_elem_'+forbidden.id_area, 'active');
		}
		else
			NormalAvertCantChange();
	});
	
	$(document).on('click', '#install_normal_edit_map_svg .area_elem', function(e) {
		e.preventDefault();
		
		if ((normalCurrentAction == 'addArea' || normalCurrentAction == 'addForbiddenArea') && currentStep == 'trace')
		{
		}
		else if (normalCurrentAction == 'gomme')
		{
		}
		else if (normalCanChangeMenu)
		{
			RemoveClass('#install_normal_edit_map_svg .active', 'active');
			RemoveClass('#install_normal_edit_map_svg .activ_select', 'activ_select'); 
			
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'area', 'id':$(this).data('id_area')});	
			NormalHideCurrentMenuNotSelect();
			
			$('#install_normal_edit_map_boutonsArea').show();
            $('#install_normal_edit_map_boutonsStandard').hide();
			
			$('#install_normal_edit_map_boutonsArea #install_normal_edit_map_bAreaDelete').show();
			$('#install_normal_edit_map_boutonsArea #install_normal_edit_map_bAreaOptions').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			normalCurrentAction = 'editArea';	
			currentStep = '';
			
			currentAreaIndex = GetAreaIndexFromID($(this).data('id_area'));
			area = areas[currentAreaIndex];
			saveCurrentArea = JSON.stringify(area);
			
			AddClass('#install_normal_edit_map_svg .area_elem_'+area.id_area, 'active');
		}
		else
			NormalAvertCantChange();
	});
	
	$(document).on('click', '#install_normal_edit_map_svg .dock_elem', function(e) {
		e.preventDefault();
		
		if (normalCurrentAction == 'addDock')
		{
		}
		else if (normalCurrentAction == 'gomme')
		{
		}
		else if (normalCanChangeMenu)
		{
			RemoveClass('#install_normal_edit_map_svg .active', 'active');
			RemoveClass('#install_normal_edit_map_svg .activ_select', 'activ_select'); 
			
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'dock', 'id':$(this).data('id_docking_station')});	
			NormalHideCurrentMenuNotSelect();
			
			$('#install_normal_edit_map_boutonsDock').show();
            $('#install_normal_edit_map_boutonsStandard').hide();
			
			$('#install_normal_edit_map_boutonsDock a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			normalCurrentAction = 'editDock';	
			currentStep = '';
			
			currentDockIndex = GetDockIndexFromID($(this).data('id_docking_station'));
			dock = docks[currentDockIndex];
			saveCurrentDock = JSON.stringify(dock);
			
			AddClass('#install_normal_edit_map_svg .dock_elem_'+dock.id_docking_station, 'active');
			//AddClass('#install_normal_edit_map_svg .dock_elem_'+dock.id_docking_station, 'movable');	// Dock non movable
			
		}
		else
			NormalAvertCantChange();
	});
	
	$(document).on('click', '#install_normal_edit_map_svg .poi_elem', function(e) {
		e.preventDefault();
		
		if (normalCurrentAction == 'addPoi')
		{
		}
		else if (normalCurrentAction == 'gomme')
		{
		}
		else if (normalCanChangeMenu)
		{
			RemoveClass('#install_normal_edit_map_svg .active', 'active');
			RemoveClass('#install_normal_edit_map_svg .activ_select', 'activ_select'); 
			RemoveClass('#install_normal_edit_map_svg .poi_elem', 'movable');
						
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'poi', 'id':$(this).data('id_poi')});	
			NormalHideCurrentMenuNotSelect();
			
			$('#install_normal_edit_map_boutonsPoi').show();
			
            $('#install_normal_edit_map_boutonsStandard').hide();
			
			$('#install_normal_edit_map_boutonsPoi a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			normalCurrentAction = 'editPoi';	
			currentStep = '';
			
			currentPoiIndex = GetPoiIndexFromID($(this).data('id_poi'));
			poi = pois[currentPoiIndex];
			saveCurrentPoi = JSON.stringify(poi);
			
			AddClass('#install_normal_edit_map_svg .poi_elem_'+poi.id_poi, 'active');
			if (poi.id_fiducial < 1) // Movable que si il n'est pas lié à un reflecteur
				AddClass('#install_normal_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		}
		else
			NormalAvertCantChange();
	});
	
	$(document).on('click', '#install_normal_edit_map_svg .augmented_pose_elem', function(e) {
		e.preventDefault();
		
		if (normalCurrentAction == 'addAugmentedPose')
		{
		}
		else if (normalCurrentAction == 'gomme')
		{
		}
		else if (normalCanChangeMenu)
		{
			RemoveClass('#install_normal_edit_map_svg .active', 'active');
			RemoveClass('#install_normal_edit_map_svg .activ_select', 'activ_select'); 
			RemoveClass('#install_normal_edit_map_svg .augmented_pose_elem', 'movable');
						
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'augmented_pose', 'id':$(this).data('id_augmented_pose')});	
			NormalHideCurrentMenuNotSelect();
			
			$('#install_normal_edit_map_boutonsAugmentedPose').show();
			
            $('#install_normal_edit_map_boutonsStandard').hide();
			
			$('#install_normal_edit_map_boutonsAugmentedPose a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			normalCurrentAction = 'editAugmentedPose';	
			currentStep = '';
			
			currentAugmentedPoseIndex = GetAugmentedPoseIndexFromID($(this).data('id_augmented_pose'));
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			saveCurrentAugmentedPose = JSON.stringify(augmented_pose);
			
			AddClass('#install_normal_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'active');
			if (augmented_pose.id_fiducial < 1) // Movable que si il n'est pas lié à un reflecteur
				AddClass('#install_normal_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'movable');
		}
		else
			NormalAvertCantChange();
	});
	
	/**************************/
	/*  Click on element      */
	/**************************/
	$('#install_normal_edit_map_menu .bMoveTo').click(function(e) {
        e.preventDefault();
		
		NormalHideMenus();
		
		zoom = NormalGetZoom();
		p = $('#install_normal_edit_map_svg image').position();
		x = (eventTouchStart.originalEvent.targetTouches ? (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageX : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageX) : eventTouchStart.originalEvent.pageX) - p.left;
		y = (eventTouchStart.originalEvent.targetTouches ? (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageY : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageY) : eventTouchStart.originalEvent.pageY) - p.top;
		x = x * zoom;
		y = ros_hauteur - (y * zoom);
		
		xRos = x * ros_resolution / 100;
		yRos = y * ros_resolution / 100;
		
		wycaApi.on('onGoToPoseResult', function (data){
			$('#install_normal_edit_map_bStop').hide();
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_normal_edit_map .modalFinTest section.panel-success').show();
				$('#install_normal_edit_map .modalFinTest section.panel-danger').hide();
			}
			else
			{
				$('#install_normal_edit_map .modalFinTest section.panel-success').hide();
				$('#install_normal_edit_map .modalFinTest section.panel-danger').show();
				
				if (data.M != '')
					$('#install_normal_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
				else
					$('#install_normal_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
			}
			
			// On rebranche l'ancienne fonction
			wycaApi.on('onGoToAugmentedPoseResult', onGoToPoseResult);
		
			$('#install_normal_edit_map .modalFinTest').modal('show');
		});
		
		console.log('GoToPose', xRos, yRos);
		
		wycaApi.GoToPose(xRos, yRos, 0, function (data){
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_normal_edit_map_bStop').show();
			}
			else
			{
				$('#install_normal_edit_map .modalFinTest section.panel-success').hide();
				$('#install_normal_edit_map .modalFinTest section.panel-danger').show();
				
				if (data.M != '')
					$('#install_normal_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
				else
					$('#install_normal_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
			
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToPoseResult', onGoToPoseResult);
				
				$('#install_normal_edit_map .modalFinTest').modal('show');
			}
		});
		
    });
	
	$('#install_normal_edit_map_menu .bGomme').click(function(e) {
        e.preventDefault();
		NormalHideMenus();
		if ($('#install_normal_edit_map_bGomme').hasClass('btn-primary'))
		{
			blockZoom = false;
			
			NormalHideCurrentMenu();
			
			$('#install_normal_edit_map_bGomme').removeClass('btn-primary');
		
			normalCurrentAction = '';	
			currentStep = '';
			
			$('body').addClass('no_current');
			$('body').removeClass('gomme');
			
			//currentGommePoints = Array();
		
			NormalSaveElementNeeded(true);
		}
		else
		{
			blockZoom = true;
			
			if (normalCanChangeMenu)
			{
				NormalHideCurrentMenu();
				
				$('#install_normal_edit_map_bGomme').addClass('btn-primary');
			
				normalCurrentAction = 'gomme';	
				currentStep = '';
				
				$('body').removeClass('no_current');
				$('body').addClass('gomme');
				
				//currentGommePoints = Array();
				
			}
			else
				NormalAvertCantChange();
		}
    });
	
	$('#install_normal_edit_map_menu .bAddForbiddenArea').click(function(e) {
        e.preventDefault();
		NormalHideMenus();
		if (normalCanChangeMenu)
		{
			//blockZoom = true;
			nextIdArea++;
			
			zoom = NormalGetZoom();
			
			p = $('#install_normal_edit_map_svg image').position();
			x = (eventTouchStart.originalEvent.targetTouches ? (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageX : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageX) : eventTouchStart.originalEvent.pageX) - p.left;
			y = (eventTouchStart.originalEvent.targetTouches ? (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageY : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageY) : eventTouchStart.originalEvent.pageY) - p.top;
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
			NormalAddHistorique({'action':'add_forbidden', 'data':f});
			
			forbiddens.push(f);
			NormalTraceForbidden(forbiddens.length-1);
			
			RemoveClass('#install_normal_edit_map_svg .active', 'active');
			RemoveClass('#install_normal_edit_map_svg .activ_select', 'activ_select'); 
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'forbidden', 'id':nextIdArea});	
			NormalHideCurrentMenuNotSelect();			
			
			$('#install_normal_edit_map_boutonsForbidden').show();
            $('#install_normal_edit_map_boutonsStandard').hide();
			
			$('#install_normal_edit_map_boutonsForbidden #install_normal_edit_map_bForbiddenDelete').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			normalCurrentAction = 'addForbiddenArea';
			currentStep = '';
			
			currentForbiddenIndex = GetForbiddenIndexFromID(nextIdArea);
			forbidden = forbiddens[currentForbiddenIndex];
			saveCurrentForbidden = JSON.stringify(forbidden);
			
			AddClass('#install_normal_edit_map_svg .forbidden_elem_'+forbidden.id_area, 'active');
			
			NormalSaveElementNeeded(true);
			
			/*
			$('#install_normal_edit_map_boutonsForbidden').show();
            $('#install_normal_edit_map_boutonsStandard').hide();
			
			$('#install_normal_edit_map_boutonsForbidden #install_normal_edit_map_bForbiddenDelete').hide();
			
			normalCurrentAction = 'addForbiddenArea';	
			currentStep = 'trace';
			
			$('body').removeClass('no_current');
			$('body').addClass('addForbidden');
			
			currentForbiddenPoints = Array();
			currentForbiddenPoints.push({x:0, y:0}); // Point du curseur
			*/
		}
		else
			NormalAvertCantChange();
	});
	
	$('#install_normal_edit_map_bForbiddenDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this area?'))
		{
			NormaDeleteForbidden(currentForbiddenIndex);
		}
    });
	
	
	$('#install_normal_edit_map_menu .bAddArea').click(function(e) {
        e.preventDefault();
		NormalHideMenus();
		if (normalCanChangeMenu)
		{
			//blockZoom = true;
			nextIdArea++;
			zoom = NormalGetZoom();
			p = $('#install_normal_edit_map_svg image').position();
			x = (eventTouchStart.originalEvent.targetTouches ? (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageX : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageX) : eventTouchStart.originalEvent.pageX) - p.left;
			y = (eventTouchStart.originalEvent.targetTouches ? (eventTouchStart.originalEvent.targetTouches[0] ? eventTouchStart.originalEvent.targetTouches[0].pageY : eventTouchStart.originalEvent.changedTouches[e.changedTouches.length-1].pageY) : eventTouchStart.originalEvent.pageY) - p.top;
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
			NormalAddHistorique({'action':'add_area', 'data':a});
			
			areas.push(a);
			NormalTraceArea(areas.length-1);
			
			RemoveClass('#install_normal_edit_map_svg .active', 'active');
			RemoveClass('#install_normal_edit_map_svg .activ_select', 'activ_select'); 
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'area', 'id':nextIdArea});	
			NormalHideCurrentMenuNotSelect();			
			
			$('#install_normal_edit_map_boutonsArea').show();
            $('#install_normal_edit_map_boutonsStandard').hide();
			
			$('#install_normal_edit_map_boutonsArea #install_normal_edit_map_bAreaDelete').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			normalCurrentAction = 'addArea';
			currentStep = '';
			
			currentAreaIndex = GetAreaIndexFromID(nextIdArea);
			area = areas[currentAreaIndex];
			saveCurrentArea = JSON.stringify(area);
			
			AddClass('#install_normal_edit_map_svg .area_elem_'+area.id_area, 'active');
			
			NormalSaveElementNeeded(true);
		}
		else
			NormalAvertCantChange();
	});
	
	$('#install_normal_edit_map_bAreaDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this area?'))
		{
			NormaDeleteArea(currentAreaIndex);
		}
    });
	
	$('.selectChangeAffGroup').change(function(e) {
        if ($(this).val() == 'Automatic')
			$('#' + $(this).attr('id').replace('mode', 'group')).hide();
		else
			$('#' + $(this).attr('id').replace('mode', 'group')).show();
    });
	
	$('#install_normal_edit_map_bAreaOptions').click(function(e) {
        area = areas[currentAreaIndex];
		
		$('#install_normal_edit_map_area_color_mode').val(rgbToHex(area.color_r, area.color_g, area.color_b));
		
		$.each(area.configs, function( indexConfig, config ) {
			switch(config.name)
			{
				case 'led_color_mode': $('#install_normal_edit_map_led_color_mode').val(config.value); break;
				case 'led_color': $('#install_normal_edit_map_led_color').val(config.value); $('#install_normal_edit_map_led_color').keyup(); break;
				case 'led_animation_mode': $('#install_normal_edit_map_led_animation_mode').val(config.value); break;
				case 'led_animation': $('#install_normal_edit_map_led_animation').val(config.value); break;
				case 'max_speed_mode': $('#install_normal_edit_map_max_speed_mode').val(config.value); break;
				case 'max_speed': $('#install_normal_edit_map_max_speed').val(config.value); break;
			}
		});
		
		if ($('#install_normal_edit_map_led_color_mode').val() == 'Automatic') $('#install_normal_edit_map_led_color_group').hide(); else  $('#install_normal_edit_map_led_color_group').show();
		if ($('#install_normal_edit_map_led_animation_mode').val() == 'Automatic') $('#install_normal_edit_map_led_animation_group').hide(); else  $('#install_normal_edit_map_led_animation_group').show();
		if ($('#install_normal_edit_map_max_speed_mode').val() == 'Automatic') $('#install_normal_edit_map_max_speed_group').hide(); else  $('#install_normal_edit_map_max_speed_group').show();
    });
	
	$('#install_normal_edit_map_bAreaSaveConfig').click(function(e) {
		area = areas[currentAreaIndex];
		saveCurrentArea = JSON.stringify(area);
			
		area.configs = Array();
		area.configs.push({'name':'led_color_mode' , 'value':$('#install_normal_edit_map_led_color_mode').val()});
		
		area.configs.push({'name':'led_color' , 'value':$('#install_normal_edit_map_led_color').val()});
		area.configs.push({'name':'led_animation_mode' , 'value':$('#install_normal_edit_map_led_animation_mode').val()});
		area.configs.push({'name':'led_animation' , 'value':$('#install_normal_edit_map_led_animation').val()});
		area.configs.push({'name':'max_speed_mode' , 'value':$('#install_normal_edit_map_max_speed_mode').val()});
		area.configs.push({'name':'max_speed' , 'value':$('#install_normal_edit_map_max_speed').val()});
		
		var c = $('#install_normal_edit_map_area_color').val().split("(")[1].split(")")[0];
		c = c.split(",");
		area.color_r = parseInt(c[0]);
		area.color_g = parseInt(c[1]);
		area.color_b = parseInt(c[2]);
		
		areas[currentAreaIndex] = area;
		
		if (normalCurrentAction == 'editArea')
			NormalAddHistorique({'action':'edit_area', 'data':{'index':currentAreaIndex, 'old':saveCurrentArea, 'new':JSON.stringify(areas[currentAreaIndex])}});
		
		NormalTraceArea(currentAreaIndex);
	});
		
	$('#install_normal_edit_map_menu .bAddDock').click(function(e) {
        e.preventDefault();
		NormalHideMenus();
		if (normalCanChangeMenu)
		{
			$('#install_normal_edit_map_container_all .texts_add_dock').hide();
			$('#install_normal_edit_map_container_all .text_prepare_robot').show();
			
			$('#install_normal_edit_map_container_all .modalAddDock .dock').hide();
			$('#install_normal_edit_map_container_all .modalAddDock').modal('show');
		}
		else
			NormalAvertCantChange();
	});
	
	$('#install_normal_edit_map_container_all .modalAddDock .joystickDiv .curseur').on('touchstart', function(e) {
		$('#install_normal_edit_map_container_all .modalAddDock .dock').hide();
	});
	
	$('#install_normal_edit_map_container_all .modalAddDock .bScanAddDock').click(function(e) {
		$('#install_normal_edit_map_container_all .modalAddDock .bScanAddDock').addClass('disabled');
		
		wycaApi.GetMapFiducialsVisible(function(data) {
			
			$('#install_normal_edit_map_container_all .modalAddDock .bScanAddDock').removeClass('disabled');	
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				console.log(data);
				
				$('#install_normal_edit_map_container_all .modalAddDock .dock').hide();
				
				posRobot = $('#install_normal_edit_map_container_all .modalAddDock #install_normal_edit_map_modalAddDock_robot').offset();
				
				$('#install_normal_edit_map_container_all .texts_add_dock').hide();
				if (data.D.length > 0)
					$('#install_normal_edit_map_container_all .text_set_dock').show();
				else
					$('#install_normal_edit_map_container_all .text_prepare_robot').show();
				
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
						
						$('#install_normal_edit_map_container_all .modalAddDock #install_normal_edit_map_modalAddDock_dock'+i).show();
						$('#install_normal_edit_map_container_all .modalAddDock #install_normal_edit_map_modalAddDock_dock'+i).css('left', posRobot.left + x_from_robot * 100); // lidar : y * -1
						$('#install_normal_edit_map_container_all .modalAddDock #install_normal_edit_map_modalAddDock_dock'+i).css('top', posRobot.top - y_from_robot * 100); // +20 position lidar, - 12.5 pour le centre
						//angle = (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
						
						angle = 0 - (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
						
						$('#install_normal_edit_map_container_all .modalAddDock #install_normal_edit_map_modalAddDock_dock'+i).css({'-webkit-transform' : 'rotate('+ angle +'deg)',
																	 '-moz-transform' : 'rotate('+ angle +'deg)',
																	 '-ms-transform' : 'rotate('+ angle +'deg)',
																	 'transform' : 'rotate('+ angle +'deg)'});
						
						
						$('#install_normal_edit_map_container_all .modalAddDock #install_normal_edit_map_modalAddDock_dock'+i).data('id_fiducial', data.D[i].ID);
						$('#install_normal_edit_map_container_all .modalAddDock #install_normal_edit_map_modalAddDock_dock'+i).data('x', data.D[i].P.X);
						$('#install_normal_edit_map_container_all .modalAddDock #install_normal_edit_map_modalAddDock_dock'+i).data('y', data.D[i].P.Y);
						$('#install_normal_edit_map_container_all .modalAddDock #install_normal_edit_map_modalAddDock_dock'+i).data('theta', data.D[i].P.T);
					}
				}
			}
			else
			{
				DisplayError(wycaApi.AnswerCodeToString(data.A) + "<br/>" + data.M);
			}
		});
    });
	
	$('#install_normal_edit_map_container_all .modalAddDock .dock').click(function(e) {
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
		NormalAddHistorique({'action':'add_dock', 'data':d});
        docks.push(d);
		NormalTraceDock(docks.length-1);
		
		$('#install_normal_edit_map_container_all .modalAddDock').modal('hide');
		
		currentDockIndex = docks.length-1;
		dock = docks[currentDockIndex];
		
		$('#install_normal_edit_map_dock_name').val(dock.name);
		$('#install_normal_edit_map_dock_comment').val(dock.comment);
		$('#install_normal_edit_map_dock_number').val(dock.num);
		$('#install_normal_edit_map_dock_is_master').prop('checked', dock.is_master);
		
		$('#install_normal_edit_map_container_all .modalDockOptions .list_undock_procedure li').remove();
		
		indexDockElem++;
		
		$('#install_normal_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
			'<li id="install_normal_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="move" data-distance="-0.4">'+
			'	<span>Move back 0.4m</span>'+
			'	<a href="#" class="bNormalUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
			'	<a href="#" class="bNormalUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
			'</li>'
			);
		
		$('#install_normal_edit_map_container_all .modalDockOptions').modal('show');
    });
	
	$('#install_normal_edit_map_bDockSaveConfig').click(function(e) {
		
		firstAction = $('#install_normal_edit_map_container_all .modalDockOptions .list_undock_procedure li').first();
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
					
			dock.name = $('#install_normal_edit_map_dock_name').val();
			dock.num = parseInt($('#install_normal_edit_map_dock_number').val());
			dock.comment = $('#install_normal_edit_map_dock_comment').val();
			if ($('#install_normal_edit_map_dock_is_master').prop('checked'))
			{
				// Désactive les autres
				$.each(docks, function( index, dock ) {
					dock.is_master = false;
				});
			}
			dock.is_master = $('#install_normal_edit_map_dock_is_master').prop('checked');
				
			dock.undock_path = Array();
			
			$('#install_normal_edit_map_container_all .modalDockOptions .list_undock_procedure li').each(function(index, element) {
				if ($(this).data('action') == 'rotate')
				{
					angle_rad = parseFloat($(this).data('angle')) * Math.PI/180;
					dock.undock_path.push({'linear_distance':0, 'angular_distance':angle_rad});
				}
				else
					dock.undock_path.push({'linear_distance':$(this).data('distance'), 'angular_distance':0});
			});
			
			docks[currentDockIndex] = dock;
					
			if (normalCurrentAction == 'editDock')
				NormalAddHistorique({'action':'edit_dock', 'data':{'index':currentDockIndex, 'old':saveCurrentDock, 'new':JSON.stringify(docks[currentDockIndex])}});
			
			NormalTraceDock(currentDockIndex);
			
			$('#install_normal_edit_map_container_all .modalDockOptions').modal('hide');
		}
	});
	
	$('#install_normal_edit_map_container_all .modalDockOptions .bNormalUndockProcedureAddElem').click(function(e) {
        e.preventDefault();
		
		$('#install_normal_edit_map_up_elem_action_move').prop('checked', false);
		$('#install_normal_edit_map_up_elem_action_rotate').prop('checked', false);
		
		$('#install_normal_edit_map_up_elem_direction_back').prop('checked', true);
		$('#install_normal_edit_map_container_all .up_elem_action_move').hide();
		$('#install_normal_edit_map_container_all .up_elem_action_rotate').hide();
		
		$('#install_normal_edit_map_container_all .modalDockElemOptions').data('index_dock_procedure', -1);
		
		$('#install_normal_edit_map_container_all .modalDockElemOptions').modal('show');
    });
	
	$('#install_normal_edit_map_container_all .modalDockElemOptions input:radio[name="up_elem_action"]').change(function () {
		action = $("#install_normal_edit_map_container_all input[name='up_elem_action']:checked").val()
		$('#install_normal_edit_map_container_all .up_elem_action_move').hide();
		$('#install_normal_edit_map_container_all .up_elem_action_rotate').hide();
		if (action == 'move') {
			
			$('#install_normal_edit_map_container_all .up_elem_action_move').show();
		}
		else if (action == 'rotate') {
			$('#install_normal_edit_map_container_all .up_elem_action_rotate').show();
		}
	});
		
	$('#install_normal_edit_map_container_all .modalDockElemOptions .bDockElemSave').click(function(e) {
		
		index_dock_procedure = $('#install_normal_edit_map_container_all .modalDockElemOptions').data('index_dock_procedure');
		if (index_dock_procedure == -1)
		{
			indexDockElem++;
			
			action = $("#install_normal_edit_map_container_all input[name='up_elem_action']:checked").val();
			
			if (action == 'move') {
				
				distance = parseFloat($("#install_normal_edit_map_up_elem_move_distance").val());
				direction = $("#install_normal_edit_map_container_all input[name='up_elem_direction']:checked").val();
							
				$('#install_normal_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
					'<li id="install_normal_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="move" data-distance="' + ((direction == 'back')?distance*-1:distance) + '">'+
					'	<span>Move ' + ((direction == 'back')?'back':'front') + ' ' + distance + 'm</span>'+
					'	<a href="#" class="bNormalUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bNormalUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
			else if (action == 'rotate') {
				
				angle = $("#install_normal_edit_map_up_elem_rotate_angle").val();
				
				$('#install_normal_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
					'<li id="install_normal_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="rotate" data-angle="'+angle+'">'+
					'	<span>Rotate '+angle+'°</span>'+
					'	<a href="#" class="bNormalUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bNormalUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
		}
		else
		{
			action = $("#install_normal_edit_map_container_all input[name='up_elem_action']:checked").val();
			if (action == 'move') {
				
				distance = parseFloat($("#install_normal_edit_map_up_elem_move_distance").val());
				direction = $("#install_normal_edit_map_container_all input[name='up_elem_direction']:checked").val();
				
				li = $('#install_normal_edit_map_list_undock_procedure_elem_'+ index_dock_procedure);
				span = $('#install_normal_edit_map_list_undock_procedure_elem_'+ index_dock_procedure + ' span');
				
				li.data('action', 'move');
				li.data('distance', ((direction == 'back')?distance*-1:distance));
				span.html('Move ' + ((direction == 'back')?'back':'front') + ' ' + distance + 'm');
			}
			else if (action == 'rotate') {
				
				angle = $("#install_normal_edit_map_up_elem_rotate_angle").val();
				
				li = $('#install_normal_edit_map_list_undock_procedure_elem_'+ index_dock_procedure);
				span = $('#install_normal_edit_map_list_undock_procedure_elem_'+ index_dock_procedure + ' span');
				
				li.data('action', 'rotate');
				li.data('angle', angle);
				span.html('Rotate '+angle+'°');
			}
		}
    });
	
	$(document).on('click', '#install_normal_edit_map_container_all .modalDockOptions .bNormalUndockProcedureDeleteElem', function(e) {
		e.preventDefault();
		
		$(this).closest('li').remove();
	});
	
	$(document).on('click', '#install_normal_edit_map_container_all .modalDockOptions .bNormalUndockProcedureEditElem', function(e) {
		e.preventDefault();
		
		$('#install_normal_edit_map_up_elem_action_move').prop('checked', false);
		$('#install_normal_edit_map_up_elem_action_rotate').prop('checked', false);
		
		$('#install_normal_edit_map_container_all .up_elem_action_move').hide();
		$('#install_normal_edit_map_container_all .up_elem_action_rotate').hide();
		
		li = $(this).closest('li');
		if (li.data('action') == 'rotate')
		{
			$('#install_normal_edit_map_container_all .up_elem_action_rotate').show();
			$('#install_normal_edit_map_up_elem_action_rotate').prop('checked', true);
			$("#install_normal_edit_map_up_elem_rotate_angle").val(li.data('angle'));
		}
		else
		{
			$('#install_normal_edit_map_container_all .up_elem_action_move').show();
			$('#install_normal_edit_map_up_elem_action_move').prop('checked', true);
			distance = li.data('distance');
			if (distance < 0)
				$('#install_normal_edit_map_up_elem_direction_back').prop('checked', true);
			else
				$('#install_normal_edit_map_up_elem_direction_front').prop('checked', true);
			
			$("#install_normal_edit_map_up_elem_move_distance").val(Math.abs(distance));
		}
		
		
		$('#install_normal_edit_map_container_all .modalDockElemOptions').data('index_dock_procedure', li.data('index_dock_procedure'));
		
		$('#install_normal_edit_map_container_all .modalDockElemOptions').modal('show');
		
	});
	
	$('#install_normal_edit_map_menu .bAddPOI').click(function(e) {
        e.preventDefault();
		NormalHideMenus();
		if (normalCanChangeMenu)
		{
			$('#install_normal_edit_map_container_all .modalAddPoi').modal('show');
		}
		else
			NormalAvertCantChange();
	});
	
	$('#install_normal_edit_map_container_all .modalAddPoi #install_normal_edit_map_bModalAddPoiSave').click(function(e) {
        e.preventDefault();
		
		nextIdPoi++;
		poi_temp_add = {'id_poi':nextIdPoi, 'id_map':id_map, 'final_pose_x':lastRobotPose.X, 'final_pose_y':lastRobotPose.Y, 'final_pose_t':lastRobotPose.T, 'name':'POI', 'comment':'', 'color':'', 'icon':'', 'active':true};
		
		NormalAddHistorique({'action':'add_poi', 'data':poi_temp_add});
		pois.push(poi_temp_add);
		NormalTracePoi(pois.length-1);
				
		$('#install_normal_edit_map_container_all .modalAddPoi').modal('hide');
		
		currentPoiIndex = pois.length-1;
		poi = pois[currentPoiIndex];
		
		$('#install_normal_edit_map_poi_name').val(poi.name);
		$('#install_normal_edit_map_poi_comment').val(poi.comment);
		
		$('#install_normal_edit_map_container_all .modalPoiOptions').modal('show');
    });
	
	$('#install_normal_edit_map_bPoiSaveConfig').click(function(e) {
		poi = pois[currentPoiIndex];
		saveCurrentPoi = JSON.stringify(poi);
				
		poi.name = $('#install_normal_edit_map_poi_name').val();
		poi.comment = $('#install_normal_edit_map_poi_comment').val();
			
		$('#install_normal_edit_map_container_all .modalPoiOptions .list_undock_procedure_poi li').each(function(index, element) {
			if ($(this).data('action') == 'rotate')
			{
				angle_rad = parseFloat($(this).data('angle')) * Math.PI/180;
				poi.undock_path.push({'linear_distance':0, 'angular_distance':angle_rad});
			}
			else
				poi.undock_path.push({'linear_distance':$(this).data('distance'), 'angular_distance':0});
        });
		
		pois[currentPoiIndex] = poi;
		
		$('#install_normal_edit_map_bPoiCancelConfig').show();
				
		if (normalCurrentAction == 'editPoi')
			NormalAddHistorique({'action':'edit_poi', 'data':{'index':currentPoiIndex, 'old':saveCurrentPoi, 'new':JSON.stringify(pois[currentPoiIndex])}});
		
		NormalTracePoi(currentPoiIndex);
	});
	
	
	$('#install_normal_edit_map_menu .bAddAugmentedPose').click(function(e) {
        e.preventDefault();
		NormalHideMenus();
		if (normalCanChangeMenu)
		{
			$('#install_normal_edit_map_container_all .modalAddAugmentedPose .augmented_pose').hide();
			$('#install_normal_edit_map_container_all .texts_add_augmented_pose').hide();
			$('#install_normal_edit_map_container_all .text_prepare_approch').show();
			currentStepAddAugmentedPose = 'set_approch';
			
			$('#install_normal_edit_map_container_all .modalAddAugmentedPose').modal('show');
		}
		else
			NormalAvertCantChange();
	});
	
	$('#install_normal_edit_map_container_all .modalAddAugmentedPose .joystickDiv .curseur').on('touchstart', function(e) {
		$('#install_normal_edit_map_container_all .modalAddAugmentedPose .augmented_pose').hide();
	});
	
	$('#install_normal_edit_map_container_all .modalAddAugmentedPose .bScanAddAugmentedPose').click(function(e) {
		$('#install_normal_edit_map_container_all .modalAddAugmentedPose .bScanAddAugmentedPose').addClass('disabled');
		
		wycaApi.GetMapFiducialsVisible(function(data) {
			
			$('#install_normal_edit_map_container_all .modalAddAugmentedPose .bScanAddAugmentedPose').removeClass('disabled');	
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				console.log(data);
				
				$('#install_normal_edit_map_container_all .modalAddAugmentedPose .augmented_pose').hide();
				
				posRobot = $('#install_normal_edit_map_container_all .modalAddAugmentedPose #install_normal_edit_map_modalAddAugmentedPose_robot').offset();
				
				if (data.D.length > 0)
				{
					$('#install_normal_edit_map_container_all .texts_add_augmented_pose').hide();
					if (currentStepAddAugmentedPose != 'set_final')
						$('#install_normal_edit_map_container_all .text_set_approch').show();
					else
						$('#install_normal_edit_map_container_all .text_set_final').show();
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
							
							$('#install_normal_edit_map_container_all .modalAddAugmentedPose #install_normal_edit_map_modalAddAugmentedPose_augmented_pose'+i).show();
							$('#install_normal_edit_map_container_all .modalAddAugmentedPose #install_normal_edit_map_modalAddAugmentedPose_augmented_pose'+i).css('left', posRobot.left + x_from_robot * 100); // lidar : y * -1
							$('#install_normal_edit_map_container_all .modalAddAugmentedPose #install_normal_edit_map_modalAddAugmentedPose_augmented_pose'+i).css('top', posRobot.top - y_from_robot * 100); // +20 position lidar, - 12.5 pour le centre
							//angle = (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
							
							angle = 0 - (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
							
							$('#install_normal_edit_map_container_all .modalAddAugmentedPose #install_normal_edit_map_modalAddAugmentedPose_augmented_pose'+i).css({'-webkit-transform' : 'rotate('+ angle +'deg)',
																	 '-moz-transform' : 'rotate('+ angle +'deg)',
																	 '-ms-transform' : 'rotate('+ angle +'deg)',
																	 'transform' : 'rotate('+ angle +'deg)'});
							
							
							$('#install_normal_edit_map_container_all .modalAddAugmentedPose #install_normal_edit_map_modalAddAugmentedPose_augmented_pose'+i).data('id_fiducial', data.D[i].ID);
							$('#install_normal_edit_map_container_all .modalAddAugmentedPose #install_normal_edit_map_modalAddAugmentedPose_augmented_pose'+i).data('x', data.D[i].P.X);
							$('#install_normal_edit_map_container_all .modalAddAugmentedPose #install_normal_edit_map_modalAddAugmentedPose_augmented_pose'+i).data('y', data.D[i].P.Y);
							$('#install_normal_edit_map_container_all .modalAddAugmentedPose #install_normal_edit_map_modalAddAugmentedPose_augmented_pose'+i).data('theta', data.D[i].P.T);
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
	
	$('#install_normal_edit_map_container_all .modalAddAugmentedPose .augmented_pose').click(function(e) {
        e.preventDefault();
		
		if (currentStepAddAugmentedPose == 'set_approch')
		{
			nextIdAugmentedPose++;
			
			augmented_pose_temp_add = {'id_augmented_pose':nextIdAugmentedPose, 'id_map':id_map, 'id_fiducial':$(this).data('id_fiducial'), 'fiducial_pose_x':$(this).data('x'), 'fiducial_pose_y':$(this).data('y'), 'fiducial_pose_t':$(this).data('theta'), 'final_pose_x':lastRobotPose.X, 'final_pose_y':lastRobotPose.Y, 'final_pose_t':lastRobotPose.T, 'approch_pose_x':lastRobotPose.X, 'approch_pose_y':lastRobotPose.Y, 'approch_pose_t':lastRobotPose.T, 'name':'Augmented pose', 'comment':'', 'color':'', 'icon':'', 'active':true};
			
			$('#install_normal_edit_map_container_all .modalAddAugmentedPose .augmented_pose').hide();
			
 			currentStepAddAugmentedPose = 'set_final';
			$('#install_normal_edit_map_container_all .texts_add_augmented_pose').hide();
			$('#install_normal_edit_map_container_all .text_prepare_final').show();
		}
		else
		{
			augmented_pose_temp_add.final_pose_x = lastRobotPose.X;
			augmented_pose_temp_add.final_pose_y = lastRobotPose.Y;
			augmented_pose_temp_add.final_pose_t = lastRobotPose.T;
			
			NormalAddHistorique({'action':'add_augmented_pose', 'data':augmented_pose_temp_add});
			augmented_poses.push(augmented_pose_temp_add);
			NormalTraceAugmentedPose(augmented_poses.length-1);
					
			$('#install_normal_edit_map_container_all .modalAddAugmentedPose').modal('hide');
			
			currentAugmentedPoseIndex = augmented_poses.length-1;
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			
			$('#install_normal_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose li').remove();
			
			$('#install_normal_edit_map_augmented_pose_name').val(augmented_pose.name);
			$('#install_normal_edit_map_augmented_pose_comment').val(augmented_pose.comment);
			
			indexAugmentedPoseElem++;
			
			$('#install_normal_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
				'<li id="install_normal_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="move" data-distance="-0.4">'+
				'	<span>Move back 0.4m</span>'+
				'	<a href="#" class="bNormalUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
				'	<a href="#" class="bNormalUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
				'</li>'
				);
			
			$('#install_normal_edit_map_bAugmentedPoseCancelConfig').hide();
			$('#install_normal_edit_map_container_all .modalAugmentedPoseOptions').modal('show');
		}
    });
	
	$('#install_normal_edit_map_bAugmentedPoseSaveConfig').click(function(e) {
		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		saveCurrentAugmentedPose = JSON.stringify(augmented_pose);
				
		augmented_pose.name = $('#install_normal_edit_map_augmented_pose_name').val();
		augmented_pose.comment = $('#install_normal_edit_map_augmented_pose_comment').val();
			
		augmented_pose.undock_path = Array();
		
		$('#install_normal_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose li').each(function(index, element) {
			if ($(this).data('action') == 'rotate')
			{
				angle_rad = parseFloat($(this).data('angle')) * Math.PI/180;
				augmented_pose.undock_path.push({'linear_distance':0, 'angular_distance':angle_rad});
			}
			else
				augmented_pose.undock_path.push({'linear_distance':$(this).data('distance'), 'angular_distance':0});
        });
		
		augmented_poses[currentAugmentedPoseIndex] = augmented_pose;
		
		$('#install_normal_edit_map_bAugmentedPoseCancelConfig').show();
				
		if (normalCurrentAction == 'editAugmentedPose')
			NormalAddHistorique({'action':'edit_augmented_pose', 'data':{'index':currentAugmentedPoseIndex, 'old':saveCurrentAugmentedPose, 'new':JSON.stringify(augmented_poses[currentAugmentedPoseIndex])}});
		
		NormalTraceAugmentedPose(currentAugmentedPoseIndex);
	});
	
	$('#install_normal_edit_map_container_all .modalAugmentedPoseOptions .bNormalUndockProcedureAugmentedPoseAddElem').click(function(e) {
        e.preventDefault();
		
		$('#install_normal_edit_map_up_augmented_pose_elem_action_move').prop('checked', false);
		$('#install_normal_edit_map_up_augmented_pose_elem_action_rotate').prop('checked', false);
		
		$('#install_normal_edit_map_up_augmented_pose_elem_direction_back').prop('checked', true);
		$('#install_normal_edit_map_container_all .up_augmented_pose_elem_action_move').hide();
		$('#install_normal_edit_map_container_all .up_augmented_pose_elem_action_rotate').hide();
		
		$('#install_normal_edit_map_container_all .modalAugmentedPoseElemOptions').data('index_augmented_pose_procedure', -1);
		
		$('#install_normal_edit_map_container_all .modalAugmentedPoseElemOptions').modal('show');
    });
	
	$('#install_normal_edit_map_container_all .modalAugmentedPoseElemOptions input:radio[name="up_augmented_pose_elem_action"]').change(function () {
		action = $("#install_normal_edit_map_container_all input[name='up_augmented_pose_elem_action']:checked").val()
		$('#install_normal_edit_map_container_all .up_augmented_pose_elem_action_move').hide();
		$('#install_normal_edit_map_container_all .up_augmented_pose_elem_action_rotate').hide();
		if (action == 'move') {
			$('#install_normal_edit_map_container_all .up_augmented_pose_elem_action_move').show();
		}
		else if (action == 'rotate') {
			$('#install_normal_edit_map_container_all .up_augmented_pose_elem_action_rotate').show();
		}
	});
		
	$('#install_normal_edit_map_container_all .modalAugmentedPoseElemOptions .bAugmentedPoseElemSave').click(function(e) {
		
		index_augmented_pose_procedure = $('#install_normal_edit_map_container_all .modalAugmentedPoseElemOptions').data('index_augmented_pose_procedure');
		if (index_augmented_pose_procedure == -1)
		{
			indexAugmentedPoseElem++;
			
			action = $("#install_normal_edit_map_container_all input[name='up_augmented_pose_elem_action']:checked").val();
			
			if (action == 'move') {
				
				distance = parseFloat($("#install_normal_edit_map_up_augmented_pose_elem_move_distance").val());
				direction = $("#install_normal_edit_map_container_all input[name='up_augmented_pose_elem_direction']:checked").val();
							
				$('#install_normal_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
					'<li id="install_normal_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="move" data-distance="' + ((direction == 'back')?distance*-1:distance) + '">'+
					'	<span>Move ' + ((direction == 'back')?'back':'front') + ' ' + distance + 'm</span>'+
					'	<a href="#" class="bNormalUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bNormalUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
			else if (action == 'rotate') {
				
				angle = $("#install_normal_edit_map_up_augmented_pose_elem_rotate_angle").val();
				
				$('#install_normal_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
					'<li id="install_normal_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="rotate" data-angle="'+angle+'">'+
					'	<span>Rotate '+angle+'°</span>'+
					'	<a href="#" class="bNormalUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bNormalUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
		}
		else
		{
			action = $("#install_normal_edit_map_container_all input[name='up_augmented_pose_elem_action']:checked").val();
			if (action == 'move') {
				
				distance = parseFloat($("#install_normal_edit_map_up_augmented_pose_elem_move_distance").val());
				direction = $("#install_normal_edit_map_container_all input[name='up_augmented_pose_elem_direction']:checked").val();
				
				li = $('#install_normal_edit_map_list_undock_procedure_augmented_pose_elem_'+ index_augmented_pose_procedure);
				span = $('#install_normal_edit_map_list_undock_procedure_augmented_pose_elem_'+ index_augmented_pose_procedure + ' span');
				
				li.data('action', 'move');
				li.data('distance', ((direction == 'back')?distance*-1:distance));
				span.html('Move ' + ((direction == 'back')?'back':'front') + ' ' + distance + 'm');
			}
			else if (action == 'rotate') {
				
				angle = $("#install_normal_edit_map_up_augmented_pose_elem_rotate_angle").val();
				
				li = $('#install_normal_edit_map_list_undock_procedure_augmented_pose_elem_'+ index_augmented_pose_procedure);
				span = $('#install_normal_edit_map_list_undock_procedure_augmented_pose_elem_'+ index_augmented_pose_procedure + ' span');
				
				li.data('action', 'rotate');
				li.data('angle', angle);
				span.html('Rotate '+angle+'°');
			}
		}
    });
	
	$(document).on('click', '#install_normal_edit_map_container_all .modalAugmentedPoseOptions .bNormalUndockProcedureAugmentedPoseDeleteElem', function(e) {
		e.preventDefault();
		
		$(this).closest('li').remove();
	});
	
	$(document).on('click', '#install_normal_edit_map_container_all .modalAugmentedPoseOptions .bNormalUndockProcedureAugmentedPoseEditElem', function(e) {
		e.preventDefault();
		
		$('#install_normal_edit_map_up_augmented_pose_elem_action_move').prop('checked', false);
		$('#install_normal_edit_map_up_augmented_pose_elem_action_rotate').prop('checked', false);
		
		$('#install_normal_edit_map_container_all .up_augmented_pose_elem_action_move').hide();
		$('#install_normal_edit_map_container_all .up_augmented_pose_elem_action_rotate').hide();
		
		li = $(this).closest('li');
		if (li.data('action') == 'rotate')
		{
			$('#install_normal_edit_map_container_all .up_augmented_pose_elem_action_rotate').show();
			$('#install_normal_edit_map_up_augmented_pose_elem_action_rotate').prop('checked', true);
			$("#install_normal_edit_map_up_augmented_pose_elem_rotate_angle").val(li.data('angle'));
		}
		else
		{
			$('#install_normal_edit_map_container_all .up_augmented_pose_elem_action_move').show();
			$('#install_normal_edit_map_up_augmented_pose_elem_action_move').prop('checked', true);
			distance = li.data('distance');
			if (distance < 0)
				$('#install_normal_edit_map_up_augmented_pose_elem_direction_back').prop('checked', true);
			else
				$('#install_normal_edit_map_up_augmented_pose_elem_direction_front').prop('checked', true);
			
			$("#install_normal_edit_map_up_augmented_pose_elem_move_distance").val(Math.abs(distance));
		}
		
		
		$('#install_normal_edit_map_container_all .modalAugmentedPoseElemOptions').data('index_augmented_pose_procedure', li.data('index_augmented_pose_procedure'));
		
		$('#install_normal_edit_map_container_all .modalAugmentedPoseElemOptions').modal('show');
		
	});
	
	
	$('#install_normal_edit_map_bDockCreateFromMap').click(function(e) {
        if (normalCanChangeMenu)
		{
			blockZoom = true;
			
			$('#install_normal_edit_map_boutonsDock').show();
            $('#install_normal_edit_map_boutonsStandard').hide();
			
			$('#install_normal_edit_map_boutonsDock #install_normal_edit_map_bDockSave').hide();
			$('#install_normal_edit_map_boutonsDock #install_normal_edit_map_bDockDelete').hide();
			$('#install_normal_edit_map_boutonsDock #install_normal_edit_map_bDockDirection').hide();
			
			normalCurrentAction = 'addDock';	
			currentStep = 'setPose';
			
			$('body').removeClass('no_current');
			$('body').addClass('addDock');
			
			$('#install_normal_edit_map_message_aide').html(textClickOnMapPose);
			$('#install_normal_edit_map_message_aide').show();
		}
		else
			NormalAvertCantChange();
    });
	$('#install_normal_edit_map_bDockDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this docking station?'))
		{
			NormaDeleteDock(currentDockIndex);
		}
    });
	$('#install_normal_edit_map_bDockDirection').click(function(e) {
        e.preventDefault();
		
		if ($('#install_normal_edit_map_boutonsRotate').is(':visible'))
		{
			$('#install_normal_edit_map_boutonsRotate').hide();
		}
		else
		{
			dock = docks[currentDockIndex];
			
			//zoom = ros_largeur / $('#install_normal_edit_map_svg').width() / window.panZoomNormal.getZoom();
			zoom = NormalGetZoom();		
			p = $('#install_normal_edit_map_svg image').position();
			
			
			x = dock.approch_pose_x * 100 / 5;
			y = dock.approch_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#install_normal_edit_map_boutonsRotate').css('left', x - $('#install_normal_edit_map_boutonsRotate').width()/2);
			$('#install_normal_edit_map_boutonsRotate').css('top', y - 60);
			$('#install_normal_edit_map_boutonsRotate').show();
		}
	});
	
	$('#install_normal_edit_map_bPoiCreateFromPose').click(function(e) {
		nextIdPoi++;
		p = {'id_poi':nextIdPoi, 'id_map':id_map,'final_pose_x':lastRobotPose.x, 'final_pose_y':lastRobotPose.y, 'final_pose_t':lastRobotPose.theta, 'name':'POI', 'comment':'', 'color':'', 'icon':'', 'active':true};
		NormalAddHistorique({'action':'add_poi', 'data':p});
        pois.push(p);
		NormalTracePoi(pois.length-1);
		
		RemoveClass('#install_normal_edit_map_svg .active', 'active');
		RemoveClass('#install_normal_edit_map_svg .activ_select', 'activ_select'); 
		RemoveClass('#install_normal_edit_map_svg .poi_elem', 'movable');
					
		currentSelectedItem = Array();
		currentSelectedItem.push({'type':'poi', 'id':$(this).data('id_poi')});	
		NormalHideCurrentMenuNotSelect();
		
		$('#install_normal_edit_map_boutonsPoi').show();
		
		$('#install_normal_edit_map_boutonsStandard').hide();
		
		$('#install_normal_edit_map_boutonsPoi a').show();
		
		$('body').removeClass('no_current select');
		$('.select').css("strokeWidth", minStokeWidth);
		
		normalCurrentAction = 'editPoi';	
		currentStep = '';
		
		currentPoiIndex = GetPoiIndexFromID(nextIdPoi);
		poi = pois[currentPoiIndex];
		saveCurrentPoi = JSON.stringify(poi);
		
		AddClass('#install_normal_edit_map_svg .poi_elem_'+nextIdPoi, 'active');
		AddClass('#install_normal_edit_map_svg .poi_elem_'+nextIdPoi, 'movable');
		
		$('#install_normal_edit_map_bPoiEditName').click();
        
    });
	$('#install_normal_edit_map_bPoiCreateFromMap').click(function(e) {
        if (normalCanChangeMenu)
		{
			blockZoom = true;
			
			$('#install_normal_edit_map_boutonsPoi').show();
            $('#install_normal_edit_map_boutonsStandard').hide();
			
			$('#install_normal_edit_map_boutonsPoi #install_normal_edit_map_bPoiSave').hide();
			$('#install_normal_edit_map_boutonsPoi #install_normal_edit_map_bPoiDelete').hide();
			$('#install_normal_edit_map_boutonsPoi #install_normal_edit_map_bPoiDirection').hide();
			$('#install_normal_edit_map_boutonsPoi #install_normal_edit_map_bPoiEditName').hide();
			
			normalCurrentAction = 'addPoi';	
			currentStep = 'setPose';
			
			$('body').removeClass('no_current');
			$('body').addClass('addPoi');
			
			$('#install_normal_edit_map_message_aide').html(textClickOnMapPose);
			$('#install_normal_edit_map_message_aide').show();
		}
		else
			NormalAvertCantChange();
    });
	
	
	$('#install_normal_edit_map_bPoiEditSaveConfig').click(function(e) {
		if (normalCurrentAction == 'addPoi')
		{
			// TODO check si nom unique.
			// Boucle sur pois
			
			// si existe
			//	alert_wyca("");
			// else
			// {
			NormalSaveElementNeeded(false);
			
			
			nextIdPoi++;
			p = {'id_poi':nextIdPoi, 'id_map':id_map, 'final_pose_x':currentPoiPose.final_pose_x, 'final_pose_y':currentPoiPose.final_pose_y, 'final_pose_t':currentPoiPose.final_pose_t, 'name':$('#install_normal_edit_map_poi_name').val(), 'comment':'', 'icon':'', 'color':'', 'icon':'', 'active':true};
			NormalAddHistorique({'action':'add_poi', 'data':p});
			
			pois.push(p);
			NormalTracePoi(pois.length-1);
			
			$('#install_normal_edit_map_svg .poi_elem_current').remove();
			
			RemoveClass('#install_normal_edit_map_svg .active', 'active');
			
			normalCurrentAction = '';
			currentStep = '';
			
			$('#install_normal_edit_map_boutonsRotate').hide();
			
			$('#install_normal_edit_map_boutonsPoi').hide();
			$('#install_normal_edit_map_boutonsStandard').show();
			$('#install_normal_edit_map_message_aide').hide();
			blockZoom = false;
			
			$('body').addClass('no_current');
			
			NormalSetModeSelect();
			
			// }
			
		}
		else
		{
			poi = pois[currentPoiIndex];
			poi.name = $('#install_normal_edit_map_poi_name').val();
			if (poi.name == '') poi.name = 'POI';
		}
		
	});
	
	$('#install_normal_edit_map_bPoiDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this POI?'))
		{
			NormaDeletePoi(currentPoiIndex);
		}
    });
	$('#install_normal_edit_map_bPoiEditName').click(function(e) {
   		poi = pois[currentPoiIndex];
		$('#install_normal_edit_map_poi_name').val(poi.name);
	});
	$('#install_normal_edit_map_bPoiDirection').click(function(e) {
        e.preventDefault();
		
		if ($('#install_normal_edit_map_boutonsRotate').is(':visible'))
		{
			$('#install_normal_edit_map_boutonsRotate').hide();
		}
		else
		{
			poi = pois[currentPoiIndex];
			
			//zoom = ros_largeur / $('#install_normal_edit_map_svg').width() / window.panZoomNormal.getZoom();
			zoom = NormalGetZoom();		
			p = $('#install_normal_edit_map_svg image').position();
			
			x = poi.approch_pose_x * 100 / 5;
			y = poi.approch_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#install_normal_edit_map_boutonsRotate').css('left', x - $('#install_normal_edit_map_boutonsRotate').width()/2);
			$('#install_normal_edit_map_boutonsRotate').css('top', y - 60);
			$('#install_normal_edit_map_boutonsRotate').show();
		}
	});
	
	$('#install_normal_edit_map_bAugmentedPoseCreateFromPose').click(function(e) {
		nextIdAugmentedPose++;
		p = {'id_augmented_pose':nextIdAugmentedPose, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':lastRobotPose.x, 'final_pose_y':lastRobotPose.y, 'final_pose_t':lastRobotPose.theta, 'approch_pose_x':lastRobotPose.x, 'approch_pose_y':lastRobotPose.y, 'approch_pose_t':lastRobotPose.theta, 'fiducial_pose_x':0, 'fiducial_pose_y':0, 'fiducial_pose_t':0, 'name':'Augmented pose', 'comment':'', 'color':'', 'icon':'', 'active':true};
		NormalAddHistorique({'action':'add_augmented_pose', 'data':p});
        augmented_poses.push(p);
		NormalTraceAugmentedPose(augmented_poses.length-1);
		
		RemoveClass('#install_normal_edit_map_svg .active', 'active');
		RemoveClass('#install_normal_edit_map_svg .activ_select', 'activ_select'); 
		RemoveClass('#install_normal_edit_map_svg .augmented_pose_elem', 'movable');
					
		currentSelectedItem = Array();
		currentSelectedItem.push({'type':'augmented_pose', 'id':$(this).data('id_augmented_pose')});	
		NormalHideCurrentMenuNotSelect();
		
		$('#install_normal_edit_map_boutonsAugmentedPose').show();
		
		$('#install_normal_edit_map_boutonsStandard').hide();
		
		$('#install_normal_edit_map_boutonsAugmentedPose a').show();
		
		$('body').removeClass('no_current select');
		$('.select').css("strokeWidth", minStokeWidth);
		
		normalCurrentAction = 'editAugmentedPose';	
		currentStep = '';
		
		currentAugmentedPoseIndex = GetAugmentedPoseIndexFromID(nextIdAugmentedPose);
		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		saveCurrentAugmentedPose = JSON.stringify(augmented_pose);
		
		AddClass('#install_normal_edit_map_svg .augmented_pose_elem_'+nextIdAugmentedPose, 'active');
		AddClass('#install_normal_edit_map_svg .augmented_pose_elem_'+nextIdAugmentedPose, 'movable');
		
		$('#install_normal_edit_map_bAugmentedPoseEditName').click();
        
    });
	$('#install_normal_edit_map_bAugmentedPoseCreateFromMap').click(function(e) {
        if (normalCanChangeMenu)
		{
			blockZoom = true;
			
			$('#install_normal_edit_map_boutonsAugmentedPose').show();
            $('#install_normal_edit_map_boutonsStandard').hide();
			
			$('#install_normal_edit_map_boutonsAugmentedPose #install_normal_edit_map_bAugmentedPoseSave').hide();
			$('#install_normal_edit_map_boutonsAugmentedPose #install_normal_edit_map_bAugmentedPoseDelete').hide();
			$('#install_normal_edit_map_boutonsAugmentedPose #install_normal_edit_map_bAugmentedPoseDirection').hide();
			$('#install_normal_edit_map_boutonsAugmentedPose #install_normal_edit_map_bAugmentedPoseEditName').hide();
			
			normalCurrentAction = 'addAugmentedPose';	
			currentStep = 'setPose';
			
			$('body').removeClass('no_current');
			$('body').addClass('addAugmentedPose');
			
			$('#install_normal_edit_map_message_aide').html(textClickOnMapPose);
			$('#install_normal_edit_map_message_aide').show();
		}
		else
			NormalAvertCantChange();
    });
	
	
	$('#install_normal_edit_map_bAugmentedPoseEditSaveConfig').click(function(e) {
		if (normalCurrentAction == 'addAugmentedPose')
		{
			NormalSaveElementNeeded(false);
			
			nextIdAugmentedPose++;
			p = {'id_augmented_pose':nextIdAugmentedPose, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':currentAugmentedPosePose.final_pose_x, 'final_pose_y':currentAugmentedPosePose.final_pose_y, 'final_pose_t':currentAugmentedPosePose.final_pose_t, 'approch_pose_x':currentAugmentedPosePose.approch_pose_x, 'approch_pose_y':currentAugmentedPosePose.approch_pose_y, 'approch_pose_t':currentAugmentedPosePose.approch_pose_t, 'fiducial_pose_x':currentAugmentedPosePose.fiducial_pose_x, 'fiducial_pose_y':currentAugmentedPosePose.fiducial_pose_y, 'fiducial_pose_t':currentAugmentedPosePose.fiducial_pose_t, 'name':$('#install_normal_edit_map_augmented_pose_name').val(), 'comment':'', 'icon':'', 'color':'', 'icon':'', 'active':true};
			NormalAddHistorique({'action':'add_augmented_pose', 'data':p});
			
			augmented_poses.push(p);
			NormalTraceAugmentedPose(augmented_poses.length-1);
			
			$('#install_normal_edit_map_svg .augmented_pose_elem_current').remove();
			
			RemoveClass('#install_normal_edit_map_svg .active', 'active');
			
			normalCurrentAction = '';
			currentStep = '';
			
			$('#install_normal_edit_map_boutonsRotate').hide();
			
			$('#install_normal_edit_map_boutonsAugmentedPose').hide();
			$('#install_normal_edit_map_boutonsStandard').show();
			$('#install_normal_edit_map_message_aide').hide();
			blockZoom = false;
			
			$('body').addClass('no_current');
			
			NormalSetModeSelect();
			

			
		}
		else
		{
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			augmented_pose.name = $('#install_normal_edit_map_augmented_pose_name').val();
			if (augmented_pose.name == '') augmented_pose.name = 'Augmented pose';
		}
		
	});
	
	$('#install_normal_edit_map_bAugmentedPoseDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this augmented pose?'))
		{
			NormaDeleteAugmentedPose(currentAugmentedPoseIndex);
		}
    });
	$('#install_normal_edit_map_bAugmentedPoseEditName').click(function(e) {
   		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		$('#install_normal_edit_map_augmented_pose_name').val(augmented_pose.name);
	});
	$('#install_normal_edit_map_bAugmentedPoseDirection').click(function(e) {
        e.preventDefault();
		
		if ($('#install_normal_edit_map_boutonsRotate').is(':visible'))
		{
			$('#install_normal_edit_map_boutonsRotate').hide();
		}
		else
		{
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			
			//zoom = ros_largeur / $('#install_normal_edit_map_svg').width() / window.panZoomNormal.getZoom();
			zoom = NormalGetZoom();		
			p = $('#install_normal_edit_map_svg image').position();
			
			x = augmented_pose.approch_pose_x * 100 / 5;
			y = augmented_pose.approch_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#install_normal_edit_map_boutonsRotate').css('left', x - $('#install_normal_edit_map_boutonsRotate').width()/2);
			$('#install_normal_edit_map_boutonsRotate').css('top', y - 60);
			$('#install_normal_edit_map_boutonsRotate').show();
		}
	});
	
	window.oncontextmenu = function(event) {
		 event.preventDefault();
		 event.stopPropagation();
		 return false;
	};
	
	$(document).on('touchstart', '#install_normal_edit_map_bRotateRight', function(e) {
		NormalSaveElementNeeded(true);
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
		timerRotate = setInterval(function() { 
			if (normalCurrentAction == 'addPoi')
			{
				currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) + Math.PI / 90;
				
				NormalTraceCurrentPoi(currentPoiPose);
			}
			else if (normalCurrentAction == 'addAugmentedPose')
			{
				currentAugmentedPosePose.approch_pose_t = parseFloat(currentAugmentedPosePose.approch_pose_t) + Math.PI / 90;
				
				NormalTraceCurrentAugmentedPose(currentAugmentedPosePose);
			}
			else if (normalCurrentAction == 'addDock')
			{
				currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) + Math.PI / 90;
				
				NormalTraceCurrentDock(currentDockPose);
			}
			else if (normalCurrentAction == 'editPoi')
			{
				poi = pois[currentPoiIndex];
				poi.approch_pose_t = parseFloat(poi.approch_pose_t) + Math.PI / 90;
				NormalTracePoi(currentPoiIndex);			
			}
			else if (normalCurrentAction == 'editAugmentedPose')
			{
				augmented_pose = augmented_poses[currentAugmentedPoseIndex];
				augmented_pose.approch_pose_t = parseFloat(augmented_pose.approch_pose_t) + Math.PI / 90;
				NormalTraceAugmentedPose(currentAugmentedPoseIndex);			
			}
			else if (normalCurrentAction == 'editDock')
			{
				dock = docks[currentDockIndex];
				dock.approch_pose_t = parseFloat(dock.approch_pose_t) + Math.PI / 90;
				NormalTraceDock(currentDockIndex);		
			}
		}, 100);
    });
	$(document).on('touchend', '#install_normal_edit_map_bRotateRight', function(e) {
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
    });
	$('#install_normal_edit_map_bRotateRight').click(function(e) {
		NormalSaveElementNeeded(true);
		if (normalCurrentAction == 'addPoi')
		{
			currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) + Math.PI / 90;
			
			NormalTraceCurrentPoi(currentPoiPose);
		}
		else if (normalCurrentAction == 'addAugmentedPose')
		{
			currentAugmentedPosePose.approch_pose_t = parseFloat(currentAugmentedPosePose.approch_pose_t) + Math.PI / 90;
			
			NormalTraceCurrentAugmentedPose(currentAugmentedPosePose);
		}
		else if (normalCurrentAction == 'addDock')
		{
			currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) + Math.PI / 90;
			
			NormalTraceCurrentDock(currentDockPose);
		}
		else if (normalCurrentAction == 'editPoi')
		{
			poi = pois[currentPoiIndex];
			poi.approch_pose_t = parseFloat(poi.approch_pose_t) + Math.PI / 90;
			NormalTracePoi(currentPoiIndex);			
		}
		else if (normalCurrentAction == 'editAugmentedPose')
		{
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			augmented_pose.approch_pose_t = parseFloat(augmented_pose.approch_pose_t) + Math.PI / 90;
			NormalTraceAugmentedPose(currentAugmentedPoseIndex);			
		}
		else if (normalCurrentAction == 'editDock')
		{
			dock = docks[currentDockIndex];
			dock.approch_pose_t = parseFloat(dock.approch_pose_t) + Math.PI / 90;
			NormalTraceDock(currentDockIndex);
		}
    });
	$(document).on('touchstart', '#install_normal_edit_map_bRotateLeft', function(e) {
		NormalSaveElementNeeded(true);
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
		timerRotate = setInterval(function() { 
			if (normalCurrentAction == 'addPoi')
			{
				currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) - Math.PI / 90;
				
				NormalTraceCurrentPoi(currentPoiPose);
			}
			else if (normalCurrentAction == 'addAugmentedPose')
			{
				currentAugmentedPosePose.approch_pose_t = parseFloat(currentAugmentedPosePose.approch_pose_t) - Math.PI / 90;
				
				NormalTraceCurrentAugmentedPose(currentAugmentedPosePose);
			}
			else if (normalCurrentAction == 'addDock')
			{
				currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) - Math.PI / 90;
				
				NormalTraceCurrentDock(currentDockPose);
			}
			else if (normalCurrentAction == 'editPoi')
			{
				poi = pois[currentPoiIndex];
				poi.approch_pose_t = parseFloat(poi.approch_pose_t) - Math.PI / 90;
				NormalTracePoi(currentPoiIndex);			
			}
			else if (normalCurrentAction == 'editAugmentedPose')
			{
				augmented_pose = augmented_poses[currentAugmentedPoseIndex];
				augmented_pose.approch_pose_t = parseFloat(augmented_pose.approch_pose_t) - Math.PI / 90;
				NormalTraceAugmentedPose(currentAugmentedPoseIndex);			
			}
			else if (normalCurrentAction == 'editDock')
			{
				dock = docks[currentDockIndex];
				dock.approch_pose_t = parseFloat(dock.approch_pose_t) - Math.PI / 90;
				NormalTraceDock(currentDockIndex);
			}
		}, 100);
    });
	$(document).on('touchend', '#install_normal_edit_map_bRotateLeft', function(e) {
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
    });
	$('#install_normal_edit_map_bRotateLeft').click(function(e) {
		NormalSaveElementNeeded(true);
        if (normalCurrentAction == 'addPoi')
		{
			currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) - Math.PI / 90;
			
			NormalTraceCurrentPoi(currentPoiPose);
		}
		else if (normalCurrentAction == 'addAugmentedPose')
		{
			currentAugmentedPosePose.approch_pose_t = parseFloat(currentAugmentedPosePose.approch_pose_t) - Math.PI / 90;
			
			NormalTraceCurrentAugmentedPose(currentAugmentedPosePose);
		}
		else if (normalCurrentAction == 'addDock')
		{
			currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) - Math.PI / 90;
			
			NormalTraceCurrentDock(currentDockPose);
		}
		else if (normalCurrentAction == 'editPoi')
		{
			poi = pois[currentPoiIndex];
			poi.approch_pose_t = parseFloat(poi.approch_pose_t) - Math.PI / 90;
			NormalTracePoi(currentPoiIndex);			
		}
		else if (normalCurrentAction == 'editAugmentedPose')
		{
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			augmented_pose.approch_pose_t = parseFloat(augmented_pose.approch_pose_t) - Math.PI / 90;
			NormalTraceAugmentedPose(currentAugmentedPoseIndex);			
		}
		else if (normalCurrentAction == 'editDock')
		{
			dock = docks[currentDockIndex];
			dock.approch_pose_t = parseFloat(dock.approch_pose_t) - Math.PI / 90;
			NormalTraceDock(currentDockIndex);
		}        
    });
		
	InitTaille();
    
    var offsetMap;
    
    AppliquerZoom();
	
	NormalSetModeSelect();
	
	$('#install_normal_edit_map_svg').on('touchstart', function(e) {
		touchStarted = true;
		
		//zoom = ros_largeur / $('#install_normal_edit_map_svg').width() / window.panZoomNormal.getZoom();
		zoom = NormalGetZoom();
		
		if (normalCurrentAction == 'gomme' && currentStep=='')
		{
			currentStep='trace';
			if (gommes.length == 0 || gommes[gommes.length-1].length > 0)
			{
				gommes[gommes.length] = Array();
				//gommes[gommes.length-1].push({x:0, y:0}); // Point du curseur
				
				p = $('#install_normal_edit_map_svg image').position();
				x = (e.originalEvent.targetTouches ? (e.originalEvent.targetTouches[0] ? e.originalEvent.targetTouches[0].pageX : e.originalEvent.changedTouches[e.changedTouches.length-1].pageX) : e.originalEvent.pageX) - p.left;
				y = (e.originalEvent.targetTouches ? (e.originalEvent.targetTouches[0] ? e.originalEvent.targetTouches[0].pageY : e.originalEvent.changedTouches[e.changedTouches.length-1].pageY) : e.originalEvent.pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
								
				gommes[gommes.length-1].push({x:xRos, y:yRos});
				gommes[gommes.length-1].push({x:xRos+0.01, y:yRos+0.01}); // Point du curseur
				NormalTraceCurrentGomme(gommes[gommes.length-1], gommes.length-1);
				
				normalCanChangeMenu = false;
				$('#install_normal_edit_map_bEndGomme').show();
			}
		}
		else if (normalCurrentAction == 'addDock' && currentStep=='setPose')
		{
			p = $('#install_normal_edit_map_svg image').position();
			x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) - p.left;
			y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approach_pose_x = xRos;
			currentDockPose.approach_pose_y = yRos;
			currentDockPose.approach_pose_t = 0;
			
			NormalTraceCurrentDock(currentDockPose);
		}
		/*
		else if (normalCurrentAction == 'addDock' && currentStep=='setDir')
		{
			p = $('#install_normal_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approch_pose_t = GetAngleRadian(currentDockPose.approch_pose_x, currentDockPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			NormalTraceCurrentDock(currentDockPose);
		}
		*/
		else if (normalCurrentAction == 'addPoi' && currentStep=='setPose')
		{
			p = $('#install_normal_edit_map_svg image').position();
			x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) - p.left;
			y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approch_pose_x = xRos;
			currentPoiPose.approch_pose_y = yRos;
			currentPoiPose.approch_pose_t = 0;
			
			NormalTraceCurrentPoi(currentPoiPose);
		}
		else if (normalCurrentAction == 'addAugmentedPose' && currentStep=='setPose')
		{
			p = $('#install_normal_edit_map_svg image').position();
			x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) - p.left;
			y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentAugmentedPosePose.approch_pose_x = xRos;
			currentAugmentedPosePose.approch_pose_y = yRos;
			currentAugmentedPosePose.approch_pose_t = 0;
			
			NormalTraceCurrentAugmentedPose(currentAugmentedPosePose);
		}
		/*
		else if (normalCurrentAction == 'addDock' && currentStep=='setDir')
		{
			p = $('#install_normal_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approch_pose_t = GetAngleRadian(currentPoiPose.approch_pose_x, currentPoiPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			NormalTraceCurrentPoi(currentPoiPose);
		}
		*/
		/*
		else if (normalCurrentAction == 'addForbiddenArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#install_normal_edit_map_mapBox').height() - e.offsetY;
			p = $('#install_normal_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentForbiddenPoints.pop(); // Point du curseur
			currentForbiddenPoints.push({x:xRos, y:yRos});
			//currentForbiddenPoints.push({x:xRos, y:yRos}); // Point du curseur
			NormalTraceCurrentForbidden(currentForbiddenPoints);
		}
		else if (normalCurrentAction == 'addArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#install_normal_edit_map_mapBox').height() - e.offsetY;
			p = $('#install_normal_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
		
			currentAreaPoints.pop(); // Point du curseur
			currentAreaPoints.push({x:xRos, y:yRos});
			//currentAreaPoints.push({x:xRos, y:yRos}); // Point du curseur
			NormalTraceCurrentArea(currentAreaPoints);
		}
		*/
	});
	
	$('#install_normal_edit_map_svg').on('touchmove', function(e) {
		
		if ($('#install_normal_edit_map_boutonsRotate').is(':visible'))
		{
			//zoom = ros_largeur / $('#install_normal_edit_map_svg').width() / window.panZoomNormal.getZoom();
			zoom = NormalGetZoom();
			 if (normalCurrentAction == 'addDock')
			 {
				p = $('#install_normal_edit_map_svg image').position();
				
				x = currentDockPose.approach_pose_x * 100 / 5;
				y = currentDockPose.approach_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#install_normal_edit_map_boutonsRotate').css('left', x - $('#install_normal_edit_map_boutonsRotate').width()/2);
				$('#install_normal_edit_map_boutonsRotate').css('top', y - 60);
				$('#install_normal_edit_map_boutonsRotate').show();
			 }
			 else if (normalCurrentAction == 'addPoi')
			 {
				p = $('#install_normal_edit_map_svg image').position();
			
				x = currentPoiPose.approach_pose_x * 100 / 5;
				y = currentPoiPose.approach_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#install_normal_edit_map_boutonsRotate').css('left', x - $('#install_normal_edit_map_boutonsRotate').width()/2);
				$('#install_normal_edit_map_boutonsRotate').css('top', y - 60);
				$('#install_normal_edit_map_boutonsRotate').show();
			 }
			 else if (normalCurrentAction == 'addAugmentedPose')
			 {
				p = $('#install_normal_edit_map_svg image').position();
			
				x = currentAugmentedPosePose.approach_pose_x * 100 / 5;
				y = currentAugmentedPosePose.approach_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#install_normal_edit_map_boutonsRotate').css('left', x - $('#install_normal_edit_map_boutonsRotate').width()/2);
				$('#install_normal_edit_map_boutonsRotate').css('top', y - 60);
				$('#install_normal_edit_map_boutonsRotate').show();
			 }
			 else if (normalCurrentAction == 'editDock')
			 {
				dock = docks[currentDockIndex];
				
				p = $('#install_normal_edit_map_svg image').position();
				
				
				x = dock.approch_pose_x * 100 / 5;
				y = dock.approch_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#install_normal_edit_map_boutonsRotate').css('left', x - $('#install_normal_edit_map_boutonsRotate').width()/2);
				$('#install_normal_edit_map_boutonsRotate').css('top', y - 60);
				$('#install_normal_edit_map_boutonsRotate').show();
			 }
			 else if (normalCurrentAction == 'editPoi')
			 {
				poi = pois[currentPoiIndex];
				
				p = $('#install_normal_edit_map_svg image').position();
				
				
				x = poi.approch_pose_x * 100 / 5;
				y = poi.approch_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#install_normal_edit_map_boutonsRotate').css('left', x - $('#install_normal_edit_map_boutonsRotate').width()/2);
				$('#install_normal_edit_map_boutonsRotate').css('top', y - 60);
				$('#install_normal_edit_map_boutonsRotate').show();
			 }
			 else if (normalCurrentAction == 'editAugmentedPose')
			 {
				augmented_pose = augmented_poses[currentAugmentedPoseIndex];
				
				p = $('#install_normal_edit_map_svg image').position();
				
				
				x = augmented_pose.approch_pose_x * 100 / 5;
				y = augmented_pose.approch_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#install_normal_edit_map_boutonsRotate').css('left', x - $('#install_normal_edit_map_boutonsRotate').width()/2);
				$('#install_normal_edit_map_boutonsRotate').css('top', y - 60);
				$('#install_normal_edit_map_boutonsRotate').show();
			 }
		}
		
		if (touchStarted)
		{
			//zoom = 1;
			zoom = NormalGetZoom();
			if (downOnMovable)
			{
			   if (movableDown.data('element_type') == 'dock')
			   {
				   e.preventDefault();
				    
				   dock = GetDockFromID(movableDown.data('id_docking_station'));
				   
				   pageX = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX);
				   pageY = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY);
				  
				  	x = dock.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution);
				  
					$('#install_normal_edit_map_dock_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
					$('#install_normal_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
				  
					delta = (normalDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					dock.approch_pose_x = parseFloat(dock.approch_pose_x) - delta;
					delta = (normalDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					dock.approch_pose_y = parseFloat(dock.approch_pose_y) + delta;
					
					//movableDown.attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					//movableDown.attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 5); 
					
					
					$('#install_normal_edit_map_dock_'+movableDown.data('id_docking_station')).attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					$('#install_normal_edit_map_dock_'+movableDown.data('id_docking_station')).attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 1); 
					
					$('#install_normal_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('x1', dock.approch_pose_x * 100 / ros_resolution - 1);
					$('#install_normal_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('y1', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 1); 
					$('#install_normal_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('x2', dock.approch_pose_x * 100 / ros_resolution + 1);
					$('#install_normal_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('y2', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 1); 
					
					x = dock.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution);	
					angle = 0 - dock.approch_pose_t * 180 / Math.PI - 90;
					
					$('#install_normal_edit_map_dock_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					$('#install_normal_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					
					//NormalTraceDock(GetDockIndexFromID(movableDown.data('id_docking_station')));
				    
					normalDownOnSVG_x = pageX;
					normalDownOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'poi')
			   {
				   e.preventDefault();
				    
				   poi = GetPoiFromID(movableDown.data('id_poi'));
				   
				   pageX = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX);
				   pageY = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY);
				  
				  	x = poi.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (poi.approch_pose_y * 100 / ros_resolution);
				  
					$('#install_normal_edit_map_poi_sens_'+movableDown.data('id_poi')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
				  
					delta = (normalDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					poi.approch_pose_x = parseFloat(poi.approch_pose_x) - delta;
					delta = (normalDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					poi.approch_pose_y = parseFloat(poi.approch_pose_y) + delta;
					
					//movableDown.attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					//movableDown.attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 5); 
					
					x = poi.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (poi.approch_pose_y * 100 / ros_resolution);	
					angle = 0 - poi.approch_pose_t * 180 / Math.PI;
					
					$('#install_normal_edit_map_poi_secure_'+movableDown.data('id_poi')).attr('cx', x);
					$('#install_normal_edit_map_poi_secure_'+movableDown.data('id_poi')).attr('cy', y); 
					
					$('#install_normal_edit_map_poi_robot_'+movableDown.data('id_poi')).attr('cx', x);
					$('#install_normal_edit_map_poi_robot_'+movableDown.data('id_poi')).attr('cy', y);
										
					$('#install_normal_edit_map_poi_sens_'+movableDown.data('id_poi')).attr('points', (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2));
					$('#install_normal_edit_map_poi_sens_'+movableDown.data('id_poi')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					
					//NormalTraceDock(GetDockIndexFromID(movableDown.data('id_docking_station')));
				    
					normalDownOnSVG_x = pageX;
					normalDownOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'augmented_pose')
			   {
				   e.preventDefault();
				    
				   augmented_pose = GetAugmentedPoseFromID(movableDown.data('id_augmented_pose'));
				   
				   pageX = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX);
				   pageY = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY);
				  
				  	x = augmented_pose.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (augmented_pose.approch_pose_y * 100 / ros_resolution);
				  
					$('#install_normal_edit_map_augmented_pose_sens_'+movableDown.data('id_augmented_pose')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
				  
					delta = (normalDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					augmented_pose.approch_pose_x = parseFloat(augmented_pose.approch_pose_x) - delta;
					delta = (normalDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					augmented_pose.approch_pose_y = parseFloat(augmented_pose.approch_pose_y) + delta;
					
					//movableDown.attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					//movableDown.attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 5); 
					
					x = augmented_pose.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (augmented_pose.approch_pose_y * 100 / ros_resolution);	
					angle = 0 - augmented_pose.approch_pose_t * 180 / Math.PI;
					
					$('#install_normal_edit_map_augmented_pose_secure_'+movableDown.data('id_augmented_pose')).attr('cx', x);
					$('#install_normal_edit_map_augmented_pose_secure_'+movableDown.data('id_augmented_pose')).attr('cy', y); 
					
					$('#install_normal_edit_map_augmented_pose_robot_'+movableDown.data('id_augmented_pose')).attr('cx', x);
					$('#install_normal_edit_map_augmented_pose_robot_'+movableDown.data('id_augmented_pose')).attr('cy', y);
										
					$('#install_normal_edit_map_augmented_pose_sens_'+movableDown.data('id_augmented_pose')).attr('points', (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2));
					$('#install_normal_edit_map_augmented_pose_sens_'+movableDown.data('id_augmented_pose')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					
					//NormalTraceDock(GetDockIndexFromID(movableDown.data('id_docking_station')));
				    
					normalDownOnSVG_x = pageX;
					normalDownOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'forbidden')
			   {
				   e.preventDefault();
				    
				   forbidden = GetForbiddenFromID(movableDown.data('id_area'));
				   
				   pageX = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX);
				   pageY = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY);
				  
					delta = (normalDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					forbidden.points[movableDown.data('index_point')].x = parseFloat(forbidden.points[movableDown.data('index_point')].x) - delta;
					delta = (normalDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					forbidden.points[movableDown.data('index_point')].y = parseFloat(forbidden.points[movableDown.data('index_point')].y) + delta;
					
					movableDown.attr('x', forbidden.points[movableDown.data('index_point')].x * 100 / ros_resolution - 5);
					movableDown.attr('y', ros_hauteur - (forbidden.points[movableDown.data('index_point')].y * 100 / ros_resolution) - 5); 
				
					NormalTraceForbidden(GetForbiddenIndexFromID(movableDown.data('id_area')));
				    
					normalDownOnSVG_x = pageX;
					normalDownOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'area')
			   {
				   e.preventDefault();
				    
				   area = GetAreaFromID(movableDown.data('id_area'));
				   
				   pageX = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX);
				   pageY = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY);
				  
					delta = (normalDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					area.points[movableDown.data('index_point')].x = parseFloat(area.points[movableDown.data('index_point')].x) - delta;
					delta = (normalDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					area.points[movableDown.data('index_point')].y = parseFloat(area.points[movableDown.data('index_point')].y) + delta;
					
					movableDown.attr('x', area.points[movableDown.data('index_point')].x * 100 / ros_resolution - 5);
					movableDown.attr('y', ros_hauteur - (area.points[movableDown.data('index_point')].y * 100 / ros_resolution) - 5); 
				
					NormalTraceArea(GetAreaIndexFromID(movableDown.data('id_area')));
				    
					normalDownOnSVG_x = pageX;
					normalDownOnSVG_y = pageY;
			   }
			}
			else if (clickSelectSVG && normalCurrentAction == 'select')
			{
				e.preventDefault();
				
				//clickSelectSVG_x_last = e.offsetX;
				//clickSelectSVG_y_last = e.offsetY;
				p = $('#install_normal_edit_map_svg image').position();
				clickSelectSVG_x_last = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) - p.left;
				clickSelectSVG_y_last = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - p.top;
				
				NormalTraceSection(clickSelectSVG_x, clickSelectSVG_y, clickSelectSVG_x_last, clickSelectSVG_y_last);
			}
			else if (normalCurrentAction == 'gomme' && (currentStep=='trace' || currentStep=='traced'))
			{
				e.preventDefault();
				currentStep ='traced';
				
				//x = e.offsetX;
				//y = $('#install_normal_edit_map_mapBox').height() - e.offsetY;
				p = $('#install_normal_edit_map_svg image').position();
				x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) - p.left;
				y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
								
				gommes[gommes.length-1].pop(); // Point du curseur
				gommes[gommes.length-1].push({x:xRos, y:yRos});
				gommes[gommes.length-1].push({x:xRos, y:yRos}); // Point du curseur
				NormalTraceCurrentGomme(gommes[gommes.length-1], gommes.length-1);
			}
			else if (normalCurrentAction == 'addDock' && currentStep=='setPose')
			{
				p = $('#install_normal_edit_map_svg image').position();
				x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) - p.left;
				y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentDockPose.approach_pose_x = xRos;
				currentDockPose.approach_pose_y = yRos;
				currentDockPose.approach_pose_t = 0;
				
				NormalTraceCurrentDock(currentDockPose);
			}
			/*
			else if (normalCurrentAction == 'addDock' && currentStep=='setDir')
			{
				p = $('#install_normal_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentDockPose.approch_pose_t = GetAngleRadian(currentDockPose.approch_pose_x, currentDockPose.approch_pose_y, xRos, yRos) + Math.PI;
								
				NormalTraceCurrentDock(currentDockPose);
			}
			*/
			else if (normalCurrentAction == 'addPoi' && currentStep=='setPose')
			{
				p = $('#install_normal_edit_map_svg image').position();
				x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) - p.left;
				y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentPoiPose.approch_pose_x = xRos;
				currentPoiPose.approch_pose_y = yRos;
				currentPoiPose.approch_pose_t = 0;
				
				NormalTraceCurrentPoi(currentPoiPose);
			}
			else if (normalCurrentAction == 'addAugmentedPose' && currentStep=='setPose')
			{
				p = $('#install_normal_edit_map_svg image').position();
				x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) - p.left;
				y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentAugmentedPosePose.approch_pose_x = xRos;
				currentAugmentedPosePose.approch_pose_y = yRos;
				currentAugmentedPosePose.approch_pose_t = 0;
				
				NormalTraceCurrentAugmentedPose(currentAugmentedPosePose);
			}
			/*
			else if (normalCurrentAction == 'addPoi' && currentStep=='setDir')
			{
				p = $('#install_normal_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentPoiPose.approch_pose_t = GetAngleRadian(currentPoiPose.approch_pose_x, currentPoiPose.approch_pose_y, xRos, yRos) + Math.PI;
								
				NormalTraceCurrentPoi(currentPoiPose);
			}
			*/
			/*
			else if (normalCurrentAction == 'addForbiddenArea' && currentStep=='trace')
			{
				e.preventDefault();
				
				//x = e.offsetX;
				//y = $('#install_normal_edit_map_mapBox').height() - e.offsetY;
				p = $('#install_normal_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentForbiddenPoints.pop(); // Point du curseur
				currentForbiddenPoints.push({x:xRos, y:yRos});
				NormalTraceCurrentForbidden(currentForbiddenPoints);
			}
			else if (normalCurrentAction == 'addArea' && currentStep=='trace')
			{
				e.preventDefault();
				
				//x = e.offsetX;
				//y = $('#install_normal_edit_map_mapBox').height() - e.offsetY;
				p = $('#install_normal_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentAreaPoints.pop(); // Point du curseur
				currentAreaPoints.push({x:xRos, y:yRos});
				NormalTraceCurrentArea(currentAreaPoints);
			}
			*/
		}
	});
	
	$('#install_normal_edit_map_svg').on('touchend', function(e) {
		touchStarted = false;
		zoom = NormalGetZoom();
		if (downOnMovable)
		{
			downOnMovable = false;
			touchStarted = false;
			blockZoom = false;
			
			if (movableDown.data('element_type') == 'forbidden')
			{
				NormalTraceForbidden(GetForbiddenIndexFromID(movableDown.data('id_area')));
			}
			else if (movableDown.data('element_type') == 'area')
			{
				NormalTraceArea(GetAreaIndexFromID(movableDown.data('id_area')));
			}
		}
		if (normalCurrentAction == 'gomme' && currentStep=='traced')
		{
			currentStep='';
			NormalAddHistorique({'action':'gomme', 'data':gommes[gommes.length-1]});
		}
		else if (normalCurrentAction == 'addDock' && currentStep=='setPose')
		{
			p = $('#install_normal_edit_map_svg image').position();
			x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) - p.left;
			y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approach_pose_x = xRos;
			currentDockPose.approach_pose_y = yRos;
			currentDockPose.approach_pose_t = 0;
			
			NormalTraceCurrentDock(currentDockPose);
			
			
			x = currentDockPose.approach_pose_x * 100 / 5;
			y = currentDockPose.approach_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#install_normal_edit_map_boutonsRotate').css('left', x - $('#install_normal_edit_map_boutonsRotate').width()/2);
			$('#install_normal_edit_map_boutonsRotate').css('top', y - 60);
			$('#install_normal_edit_map_boutonsRotate').show();
			$('#install_normal_edit_map_bDockSave').show();
			
			//currentStep='setDir';
			//$('#install_normal_edit_map_message_aide').html(textClickOnMapDir);
			
		}
		/*
		else if (normalCurrentAction == 'addDock' && currentStep=='setDir')
		{
			p = $('#install_normal_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approch_pose_t = GetAngleRadian(currentDockPose.approch_pose_x, currentDockPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			NormalTraceCurrentDock(currentDockPose);
			
			$('#install_normal_edit_map_boutonsDock #install_normal_edit_map_bDockSave').show();
		}
		*/
		else if (normalCurrentAction == 'addPoi' && currentStep=='setPose')
		{
			p = $('#install_normal_edit_map_svg image').position();
			x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) - p.left;
			y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approach_pose_x = xRos;
			currentPoiPose.approach_pose_y = yRos;
			currentPoiPose.approach_pose_t = 0;
			
			NormalTraceCurrentPoi(currentPoiPose);
			
			zoom = ros_largeur / $('#install_normal_edit_map_svg').width() / window.panZoomNormal.getZoom();		
			p = $('#install_normal_edit_map_svg image').position();
			
			
			x = currentPoiPose.approach_pose_x * 100 / 5;
			y = currentPoiPose.approach_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#install_normal_edit_map_boutonsRotate').css('left', x - $('#install_normal_edit_map_boutonsRotate').width()/2);
			$('#install_normal_edit_map_boutonsRotate').css('top', y - 60);
			$('#install_normal_edit_map_boutonsRotate').show();
			$('#install_normal_edit_map_bPoiSave').show();
			
			//currentStep='setDir';
			//$('#install_normal_edit_map_message_aide').html(textClickOnMapDir);
		}
		else if (normalCurrentAction == 'addAugmentedPose' && currentStep=='setPose')
		{
			p = $('#install_normal_edit_map_svg image').position();
			x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) - p.left;
			y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentAugmentedPosePose.approach_pose_x = xRos;
			currentAugmentedPosePose.approach_pose_y = yRos;
			currentAugmentedPosePose.approach_pose_t = 0;
			
			NormalTraceCurrentAugmentedPose(currentAugmentedPosePose);
			
			zoom = ros_largeur / $('#install_normal_edit_map_svg').width() / window.panZoomNormal.getZoom();		
			p = $('#install_normal_edit_map_svg image').position();
			
			
			x = currentAugmentedPosePose.approach_pose_x * 100 / 5;
			y = currentAugmentedPosePose.approach_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#install_normal_edit_map_boutonsRotate').css('left', x - $('#install_normal_edit_map_boutonsRotate').width()/2);
			$('#install_normal_edit_map_boutonsRotate').css('top', y - 60);
			$('#install_normal_edit_map_boutonsRotate').show();
			$('#install_normal_edit_map_bAugmentedPoseSave').show();
			
			//currentStep='setDir';
			//$('#install_normal_edit_map_message_aide').html(textClickOnMapDir);
		}
		/*
		else if (normalCurrentAction == 'addPoi' && currentStep=='setDir')
		{
			p = $('#install_normal_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approch_pose_t = GetAngleRadian(currentPoiPose.approch_pose_x, currentPoiPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			NormalTraceCurrentPoi(currentPoiPose);
			
			$('#install_normal_edit_map_boutonsPoi #install_normal_edit_map_bPoiSave').show();
		}
		*/
		/*
		else if (normalCurrentAction == 'addForbiddenArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#install_normal_edit_map_mapBox').height() - e.offsetY;
			p = $('#install_normal_edit_map_svg image').position();
			
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;

			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentForbiddenPoints.pop(); // Point du curseur
			currentForbiddenPoints.push({x:xRos, y:yRos});
			currentForbiddenPoints.push({x:xRos, y:yRos}); // Point du curseur
			NormalTraceCurrentForbidden(currentForbiddenPoints);
		}
		else if (normalCurrentAction == 'addArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#install_normal_edit_map_mapBox').height() - e.offsetY;
			p = $('#install_normal_edit_map_svg image').position();
			
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;

			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			
			currentAreaPoints.pop(); // Point du curseur
			currentAreaPoints.push({x:xRos, y:yRos});
			currentAreaPoints.push({x:xRos, y:yRos}); // Point du curseur
			NormalTraceCurrentArea(currentAreaPoints);
		}
		*/
	});
});

var touchStarted = false;

function NormalPoiSave()
{
	if (normalCurrentAction == 'addPoi')
	{
		$('#install_normal_edit_map_poi_name').val('');
		$('#install_normal_edit_map_modalPoiEditName').modal('show');
	}
	else if (normalCurrentAction == 'editPoi')
	{	
		NormalSaveElementNeeded(false);
		
		poi = pois[currentPoiIndex];
		RemoveClass('#install_normal_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		
		NormalAddHistorique({'action':'edit_poi', 'data':{'index':currentPoiIndex, 'old':saveCurrentPoi, 'new':JSON.stringify(pois[currentPoiIndex])}});
		
		RemoveClass('#install_normal_edit_map_svg .active', 'active');
		
		normalCurrentAction = '';
		currentStep = '';
		
		$('#install_normal_edit_map_boutonsRotate').hide();
		
		$('#install_normal_edit_map_boutonsPoi').hide();
		$('#install_normal_edit_map_boutonsStandard').show();
		$('#install_normal_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		NormalSetModeSelect();
	}
}
function NormalPoiCancel()
{
	NormalSaveElementNeeded(false);
	
	$('#install_normal_edit_map_svg .poi_elem_current').remove();
	RemoveClass('#install_normal_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (normalCurrentAction == 'addPoi')
	{
		$('#install_normal_edit_map_svg .poi_elem_0').remove();
	}
	else if (normalCurrentAction == 'editPoi')
	{
		poi = pois[currentPoiIndex];
		RemoveClass('#install_normal_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		
		pois[currentPoiIndex] = JSON.parse(saveCurrentPoi);
		NormalTracePoi(currentPoiIndex);
	}
	normalCurrentAction = '';
	currentStep = '';
	
	$('#install_normal_edit_map_boutonsRotate').hide();
	
	$('#install_normal_edit_map_boutonsPoi').hide();
	$('#install_normal_edit_map_boutonsStandard').show();
	$('#install_normal_edit_map_message_aide').hide();
	blockZoom = false;
	
	NormalSetModeSelect();
}
function NormalAugmentedPoseSave()
{
	if (normalCurrentAction == 'addAugmentedPose')
	{
		$('#install_normal_edit_map_augmented_pose_name').val('');
		$('#install_normal_edit_map_modalAugmentedPoseEditName').modal('show');
	}
	else if (normalCurrentAction == 'editAugmentedPose')
	{	
		NormalSaveElementNeeded(false);
		
		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		RemoveClass('#install_normal_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'movable');
		
		NormalAddHistorique({'action':'edit_augmented_pose', 'data':{'index':currentAugmentedPoseIndex, 'old':saveCurrentAugmentedPose, 'new':JSON.stringify(augmented_poses[currentAugmentedPoseIndex])}});
		
		RemoveClass('#install_normal_edit_map_svg .active', 'active');
		
		normalCurrentAction = '';
		currentStep = '';
		
		$('#install_normal_edit_map_boutonsRotate').hide();
		
		$('#install_normal_edit_map_boutonsAugmentedPose').hide();
		$('#install_normal_edit_map_boutonsStandard').show();
		$('#install_normal_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		NormalSetModeSelect();
	}
}
function NormalAugmentedPoseCancel()
{
	NormalSaveElementNeeded(false);
	
	$('#install_normal_edit_map_svg .augmented_pose_elem_current').remove();
	RemoveClass('#install_normal_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (normalCurrentAction == 'addAugmentedPose')
	{
		$('#install_normal_edit_map_svg .augmented_pose_elem_0').remove();
	}
	else if (normalCurrentAction == 'editAugmentedPose')
	{
		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		RemoveClass('#install_normal_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'movable');
		
		augmented_posed[currentAugmentedPoseIndex] = JSON.parse(saveCurrentAugmentedPose);
		NormalTraceAugmentedPose(currentAugmentedPoseIndex);
	}
	normalCurrentAction = '';
	currentStep = '';
	
	$('#install_normal_edit_map_boutonsRotate').hide();
	
	$('#install_normal_edit_map_boutonsAugmentedPose').hide();
	$('#install_normal_edit_map_boutonsStandard').show();
	$('#install_normal_edit_map_message_aide').hide();
	blockZoom = false;
	
	NormalSetModeSelect();
}
function NormalDockSave()
{
	$('#install_normal_edit_map_svg .dock_elem_current').remove();
	
	if (normalCurrentAction == 'addDock')
	{
		NormalSaveElementNeeded(false);
		
		nextIdDock++;
		num = GetMaxNumDock()+1;
		d = {'id_docking_station':nextIdDock, 'id_map':id_map, 'id_fiducial':$(this).data('id_fiducial'), 'final_pose_x':currentDockPose.final_pose_x, 'final_pose_y':currentDockPose.final_pose_y, 'final_pose_t':currentDockPose.final_pose_t, 'approch_pose_x':currentDockPose.approch_pose_x, 'approch_pose_y':currentDockPose.approch_pose_y, 'approch_pose_t':currentDockPose.approch_pose_t, 'fiducial_pose_x':currentDockPose.fiducial_pose_x, 'fiducial_pose_y':currentDockPose.fiducial_pose_y, 'fiducial_pose_t':currentDockPose.fiducial_pose_t, 'num':parseInt(num), 'name':'Dock '+num, 'comment':''};
		NormalAddHistorique({'action':'add_dock', 'data':d});
		
		docks.push(d);
		NormalTraceDock(docks.length-1);
		
		RemoveClass('#install_normal_edit_map_svg .active', 'active');
		
		$('#install_normal_edit_map_svg .dock_elem_0').remove();
		$('#install_normal_edit_map_svg .dock_elem_current').remove();
		
		normalCurrentAction = '';
		currentStep = '';
		
		$('#install_normal_edit_map_boutonsRotate').hide();
	
		$('#install_normal_edit_map_boutonsDock').hide();
		$('#install_normal_edit_map_boutonsStandard').show();
		$('#install_normal_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		NormalSetModeSelect();
	}
	else if (normalCurrentAction == 'editDock')
	{	
		NormalSaveElementNeeded(false);
		
		
		dock = docks[currentDockIndex];
		RemoveClass('#install_normal_edit_map_svg .dock_elem_'+dock.id_docking_station, 'movable');
		
		NormalAddHistorique({'action':'edit_dock', 'data':{'index':currentDockIndex, 'old':saveCurrentDock, 'new':JSON.stringify(docks[currentDockIndex])}});
		
		RemoveClass('#install_normal_edit_map_svg .active', 'active');
		
		normalCurrentAction = '';
		currentStep = '';
		
		$('#install_normal_edit_map_boutonsRotate').hide();
		
		$('#install_normal_edit_map_boutonsDock').hide();
		$('#install_normal_edit_map_boutonsStandard').show();
		$('#install_normal_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		NormalSetModeSelect();
	}
}
function NormalDockCancel()
{
	NormalSaveElementNeeded(false);
	
	$('#install_normal_edit_map_svg .dock_elem_current').remove();
	RemoveClass('#install_normal_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (normalCurrentAction == 'addDock')
	{
		$('#install_normal_edit_map_svg .dock_elem_0').remove();
		$('#install_normal_edit_map_svg .dock_elem_current').remove();
	}
	else if (normalCurrentAction == 'editDock')
	{
		dock = docks[currentDockIndex];
		RemoveClass('#install_normal_edit_map_svg .dock_elem_'+dock.id_docking_station, 'movable');
		
		docks[currentDockIndex] = JSON.parse(saveCurrentDock);
		NormalTraceDock(currentDockIndex);
	}
	normalCurrentAction = '';
	currentStep = '';
	
	$('#install_normal_edit_map_boutonsRotate').hide();
	
	$('#install_normal_edit_map_boutonsDock').hide();
	$('#install_normal_edit_map_boutonsStandard').show();
	$('#install_normal_edit_map_message_aide').hide();
	blockZoom = false;
	
	NormalSetModeSelect();
}
function NormalAreaSave()
{
	$('#install_normal_edit_map_svg .area_elem_current').remove();
	
	if (normalCurrentAction == 'addArea')
	{
		NormalSaveElementNeeded(false);
		
		NormalAddHistorique({'action':'add_area', 'data':{'index':currentAreaIndex, 'old':saveCurrentArea, 'new':JSON.stringify(areas[currentAreaIndex])}});
		
		RemoveClass('#install_normal_edit_map_svg .active', 'active');
		RemoveClass('#install_normal_edit_map_svg .activ_select', 'activ_select'); 
			
		
		normalCurrentAction = '';
		currentStep = '';
		
		$('#install_normal_edit_map_boutonsForbidden').hide();
		$('#install_normal_edit_map_boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		NormalSetModeSelect();
	}
	else if (normalCurrentAction == 'editArea')
	{
		NormalSaveElementNeeded(false);
		
		NormalAddHistorique({'action':'edit_area', 'data':{'index':currentAreaIndex, 'old':saveCurrentArea, 'new':JSON.stringify(areas[currentAreaIndex])}});
		
		RemoveClass('#install_normal_edit_map_svg .active', 'active');
		
		normalCurrentAction = '';
		currentStep = '';
		
		$('#install_normal_edit_map_boutonsArea').hide();
		$('#install_normal_edit_map_boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		NormalSetModeSelect();
	}
}
function NormalAreaCancel()
{
	NormalSaveElementNeeded(false);
	
	$('#install_normal_edit_map_svg .area_elem_current').remove();
	RemoveClass('#install_normal_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (normalCurrentAction == 'addArea')
	{
		NormalDeleteArea(currentAreaIndex);
		normalHistoriques.pop();
	}
	else if (normalCurrentAction == 'editArea')
	{
		areas[currentAreaIndex] = JSON.parse(saveCurrentArea);
		NormalTraceArea(currentAreaIndex);
	}
	normalCurrentAction = '';
	currentStep = '';
	
	$('#install_normal_edit_map_boutonsArea').hide();
	$('#install_normal_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	NormalSetModeSelect();
}
function NormalForbiddenSave()
{
	$('#install_normal_edit_map_svg .forbidden_elem_current').remove();
	
	if (normalCurrentAction == 'addForbiddenArea')
	{
		NormalSaveElementNeeded(false);
		
		NormalAddHistorique({'action':'add_forbidden', 'data':{'index':currentForbiddenIndex, 'old':saveCurrentForbidden, 'new':JSON.stringify(forbiddens[currentForbiddenIndex])}});
		
		RemoveClass('#install_normal_edit_map_svg .active', 'active');
		RemoveClass('#install_normal_edit_map_svg .activ_select', 'activ_select'); 
			
		
		normalCurrentAction = '';
		currentStep = '';
		
		$('#install_normal_edit_map_boutonsForbidden').hide();
		$('#install_normal_edit_map_boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		NormalSetModeSelect();
	}
	else if (normalCurrentAction == 'editForbiddenArea')
	{	
		NormalSaveElementNeeded(false);
		
		NormalAddHistorique({'action':'edit_forbidden', 'data':{'index':currentForbiddenIndex, 'old':saveCurrentForbidden, 'new':JSON.stringify(forbiddens[currentForbiddenIndex])}});
		
		RemoveClass('#install_normal_edit_map_svg .active', 'active');
		RemoveClass('#install_normal_edit_map_svg .activ_select', 'activ_select'); 
			
		
		normalCurrentAction = '';
		currentStep = '';
		
		$('#install_normal_edit_map_boutonsForbidden').hide();
		$('#install_normal_edit_map_boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		NormalSetModeSelect();
	}
}
function NormalForbiddenCancel()
{
	NormalSaveElementNeeded(false);
	
	$('#install_normal_edit_map_svg .forbidden_elem_current').remove();
	RemoveClass('#install_normal_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (normalCurrentAction == 'addForbiddenArea')
	{
		NormaDeleteForbidden(currentForbiddenIndex);
		normalHistoriques.pop();
	}
	else if (normalCurrentAction == 'editForbiddenArea')
	{
		forbiddens[currentForbiddenIndex] = JSON.parse(saveCurrentForbidden);
		NormalTraceForbidden(currentForbiddenIndex);
	}
	normalCurrentAction = '';
	currentStep = '';
	
	$('#install_normal_edit_map_boutonsForbidden').hide();
	$('#install_normal_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	NormalSetModeSelect();
}

function NormalRefreshZoomView()
{
	pSVG = $('#install_normal_edit_map_svg').position();
	pImg = $('#install_normal_edit_map_svg image').position();
	pImg.left -= pSVG.left;
	pImg.top -= pSVG.top;
	
	//zoom = ros_largeur / $('#install_normal_edit_map_svg').width() / window.panZoomNormal.getZoom();
	zoom = NormalGetZoom();
	
	wZoom = $('#install_normal_edit_map_zoom_carte').width();
	hZoom = $('#install_normal_edit_map_zoom_carte').height();
	
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
	
	hNew = $('#install_normal_edit_map_svg').height() * zoom  / ros_largeur * wZoom;
	wNew = $('#install_normal_edit_map_svg').width() * zoom  / ros_largeur * wZoom;
	
	//if (tNew + hNew > hZoom) hNew = hZoom - tNew;
	//if (lNew + wNew > wZoom) wNew = wZoom - lNew;
		
	$('#install_normal_edit_map_zone_zoom').width(wNew);
	$('#install_normal_edit_map_zone_zoom').height(hNew);
				
	$('#install_normal_edit_map_zone_zoom').css('top', tNew - 1);
	$('#install_normal_edit_map_zone_zoom').css('left', lNew - 1);
	
}

function NormalDeleteForbidden(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	forbiddens[indexInArray].deleted = true;
	
	NormalAddHistorique({'action':'delete_forbidden', 'data':indexInArray});
	
	data = forbiddens[indexInArray];
	$('#install_normal_edit_map_svg .forbidden_elem_'+data.id_area).remove();
	
	RemoveClass('#install_normal_edit_map_svg .active', 'active');
	
	normalCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	
	$('#install_normal_edit_map_boutonsForbidden').hide();
    $('#install_normal_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	NormalSetModeSelect();
}
function NormalDeleteArea(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	areas[indexInArray].deleted = true;
	
	NormalAddHistorique({'action':'delete_area', 'data':indexInArray});
	
	data = areas[indexInArray];
	$('#install_normal_edit_map_svg .area_elem_'+data.id_area).remove();
	
	RemoveClass('#install_normal_edit_map_svg .active', 'active');
	
	normalCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#install_normal_edit_map_boutonsArea').hide();
    $('#install_normal_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	NormalSetModeSelect();
}

function NormalDeleteDock(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	docks[indexInArray].deleted = true;
	
	NormalAddHistorique({'action':'delete_dock', 'data':indexInArray});
	
	data = docks[indexInArray];
	$('#install_normal_edit_map_svg .dock_elem_'+data.id_docking_station).remove();
	
	RemoveClass('#install_normal_edit_map_svg .active', 'active');
	
	normalCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#install_normal_edit_map_boutonsDock').hide();
    $('#install_normal_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	NormalSetModeSelect();
}

function NormalDeleteAugmentedPose(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	augmented_poses[indexInArray].deleted = true;
	
	NormalAddHistorique({'action':'delete_augmented_pose', 'data':indexInArray});
	
	data = augmented_poses[indexInArray];
	$('#install_normal_edit_map_svg .augmented_pose_elem_'+data.id_augmented_pose).remove();
	
	RemoveClass('#install_normal_edit_map_svg .active', 'active');
	
	normalCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#install_normal_edit_map_boutonsAugmentedPose').hide();
    $('#install_normal_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	NormalSetModeSelect();
}