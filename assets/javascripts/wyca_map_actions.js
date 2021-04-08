// JavaScript Document
var svgWyca;
var wycaCurrentAction = '';
var wycaDownOnSVG = false;
var wycaDownOnSVG_x = 0;
var wycaDownOnSVG_y = 0;
var wycaDownOnSVG_x_scroll = 0;
var wycaDownOnSVG_y_scroll = 0;
var wycaCanChangeMenu = true;
var wycaSavedCanClose = true;

var xROSGotoPose = 0 ;
var yROSGotoPose = 0 ;

var xGotoPose = 0 ;
var yGotoPose = 0 ;

function WycaAvertCantChange()
{
	$('#wyca_edit_map_bModalCancelEdit').click();
}

function WycaCloseSelect()
{
	wycaCurrentAction = '';
	currentStep = '';
}

function WycaHideCurrentMenu()
{
	/*
	if (wycaCurrentAction == 'export') CloseExport();
	if (wycaCurrentAction == 'jobs') CloseJobs();
	if (wycaCurrentAction == 'select') WycaCloseSelect()
	*/
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	$('body').attr('class', 'no_current');

	wycaCurrentAction = '';
	wycaCanChangeMenu = true;
	currentStep = '';
	WycaHideMenus();
}

function WycaHideCurrentMenuNotSelect()
{
	if (wycaCurrentAction == 'select') return;
	
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	$('body').attr('class', 'no_current');
	
	wycaCurrentAction = '';
	wycaCanChangeMenu = true;
	currentStep = '';
	WycaHideMenus();
}

var wycaHistoriques = Array();
var wycaHistoriqueIndex = -1;

function WycaUndo()
{
	wycaSavedCanClose = false;
	
	elem = wycaHistoriques[wycaHistoriqueIndex];
	switch(elem.action)
	{
		case 'gomme':
			gommes.pop();
			$('#wyca_edit_map_svg .gomme_elem_current_'+gommes.length).remove();
			break;
		case 'add_forbidden':
			forbiddens.pop();
			f = JSON.parse(elem.data);
			$('#wyca_edit_map_svg .forbidden_elem_'+f.id_area).remove();
			break;
		case 'edit_forbidden':
			forbiddens[elem.data.index] = JSON.parse(elem.data.old);
			WycaTraceForbidden(elem.data.index);
			break;
		case 'delete_forbidden':
			forbiddens[elem.data].deleted = false;
			WycaTraceForbidden(elem.data);
			break;
		case 'add_area':
			areas.pop();
			a = JSON.parse(elem.data);
			$('#wyca_edit_map_svg .area_elem_'+a.id_area).remove();
			break;
		case 'edit_area':
			areas[elem.data.index] = JSON.parse(elem.data.old);
			WycaTraceArea(elem.data.index);
			break;
		case 'delete_area':
			areas[elem.data].deleted = false;
			WycaTraceArea(elem.data);
			break;
		case 'add_dock':
			docks.pop();
			d = JSON.parse(elem.data);
			$('#wyca_edit_map_svg .dock_elem_'+d.id_docking_station).remove();
			break;
		case 'edit_dock':
			docks[elem.data.index] = JSON.parse(elem.data.old);
			WycaTraceDock(elem.data.index);
			break;
		case 'delete_dock':
			docks[elem.data].deleted = false;
			WycaTraceDock(elem.data);
			break;
		case 'add_poi':
			pois.pop();
			p = JSON.parse(elem.data);
			$('#wyca_edit_map_svg .poi_elem_'+p.id_poi).remove();
			break;
		case 'edit_poi':
			pois[elem.data.index] = JSON.parse(elem.data.old);
			WycaTracePoi(elem.data.index);
			break;
		case 'delete_poi':
			pois[elem.data].deleted = false;
			WycaTracePoi(elem.data);
			break;
		case 'add_augmented_pose':
			augmented_poses.pop();
			a = JSON.parse(elem.data);
			$('#wyca_edit_map_svg .augmented_pose_elem_'+a.id_augmented_pose).remove();
			break;
		case 'edit_augmented_pose':
			augmented_poses[elem.data.index] = JSON.parse(elem.data.old);
			WycaTraceAugmentedPose(elem.data.index);
			break;
		case 'delete_augmented_pose':
			augmented_poses[elem.data].deleted = false;
			WycaTraceAugmentedPose(elem.data);
			break;
	}
	wycaHistoriqueIndex--;
	
	WycaRefreshHistorique();
}

function WycaRedo()
{
	wycaSavedCanClose = false;
	
	wycaHistoriqueIndex++;
	
	elem = wycaHistoriques[wycaHistoriqueIndex];
	switch(elem.action)
	{
		case 'gomme':
			gommes.push(elem.data);
			WycaTraceCurrentGomme(gommes[gommes.length-1], gommes.length-1)
			break;
		case 'add_forbidden':
			forbiddens.push(JSON.parse(elem.data));
			WycaTraceForbidden(forbiddens.length-1);
			break;
		case 'edit_forbidden':
			forbiddens[elem.data.index] = JSON.parse(elem.data.new);
			WycaTraceForbidden(elem.data.index);
			break;
		case 'delete_forbidden':
			forbiddens[elem.data].deleted = true;
			WycaTraceForbidden(elem.data);
			break;
		case 'add_area':
			areas.push(JSON.parse(elem.data));
			WycaTraceArea(areas.length-1);
			break;
		case 'edit_area':
			areas[elem.data.index] = JSON.parse(elem.data.new);
			WycaTraceArea(elem.data.index);
			break;
		case 'delete_area':
			areas[elem.data].deleted = true;
			WycaTraceArea(elem.data);
			break;
		case 'add_dock':
			docks.push(elem.data);
			WycaTraceDock(docks.length-1);
			break;
		case 'edit_dock':
			docks[elem.data.index] = JSON.parse(elem.data.new);
			WycaTraceDock(elem.data.index);
			break;
		case 'delete_dock':
			docks[elem.data].deleted = true;
			WycaTraceDock(elem.data);
			break;
		case 'add_poi':
			pois.push(JSON.parse(elem.data));
			WycaTracePoi(pois.length-1);
			break;
		case 'edit_poi':
			pois[elem.data.index] = JSON.parse(elem.data.new);
			WycaTracePoi(elem.data.index);
			break;
		case 'delete_poi':
			pois[elem.data].deleted = true;
			WycaTracePoi(elem.data);
			break;
		case 'add_augmented_pose':
			augmented_poses.push(JSON.parse(elem.data));
			WycaTraceAugmentedPose(augmented_poses.length-1);
			break;
		case 'edit_augmented_pose':
			augmented_poses[elem.data.index] = JSON.parse(elem.data.new);
			WycaTraceAugmentedPose(elem.data.index);
			break;
		case 'delete_augmented_pose':
			augmented_poses[elem.data].deleted = true;
			WycaTraceAugmentedPose(elem.data);
			break;
	}
	
	WycaRefreshHistorique();
}

function WycaAddHistorique(elem)
{
	wycaSavedCanClose = false;
	
	while (wycaHistoriqueIndex < wycaHistoriques.length-1)
		wycaHistoriques.pop();
	
	wycaHistoriques.push(elem);
	wycaHistoriqueIndex++;
	
	WycaRefreshHistorique();
}

function WycaRefreshHistorique()
{
	if (wycaHistoriqueIndex == -1)
		$('#wyca_edit_map_bUndo').addClass('disabled');
	else
		$('#wyca_edit_map_bUndo').removeClass('disabled');
	if (wycaHistoriqueIndex == wycaHistoriques.length-1)
		$('#wyca_edit_map_bRedo').addClass('disabled');
	else
		$('#wyca_edit_map_bRedo').removeClass('disabled');
}

function WycaSetModeSelect()
{
	$('body').addClass('select');
	wycaCurrentAction = 'select';
	currentStep = '';
}

function WycaSaveElementNeeded(need)
{
	wycaCanChangeMenu = !need;
	if (need)
	{
		$('#wyca_edit_map_bSaveCurrentElem').show();
		$('#wyca_edit_map_bCancelCurrentElem').show();
		$('#wyca_edit_map .times_icon_menu').addClass('dnone')
		$('#wyca_edit_map .times_icon_menu').hide()
		if(wycaCurrentAction == "addForbiddenArea"){
			$('#wyca_edit_map .bDeleteForbidden').addClass('disabled');
			$('#wyca_edit_map_bPlusCurrentElem').show();
		}
		if(wycaCurrentAction == "addArea"){
			$('#wyca_edit_map .bConfigArea').addClass('disabled');
			$('#wyca_edit_map .bDeleteArea').addClass('disabled');
		}
	}
	else
	{
		
		if($('#wyca_edit_map .icon_menu:visible').length > 0){
			$('#wyca_edit_map .times_icon_menu').removeClass('dnone')
			$('#wyca_edit_map .times_icon_menu').show('fast')
		}
		$('#wyca_edit_map_bPlusCurrentElem').hide();
		$('#wyca_edit_map_bSaveCurrentElem').hide();
		$('#wyca_edit_map_bCancelCurrentElem').hide();
		if(wycaCurrentAction == "addForbiddenArea"){
			$('#wyca_edit_map .bDeleteForbidden').removeClass('disabled');
		}
		if(wycaCurrentAction == "addArea"){
			$('#wyca_edit_map .bConfigArea').removeClass('disabled');
			$('#wyca_edit_map .bDeleteArea').removeClass('disabled');
		}
	}
}

$(document).ready(function()
{
	/* RELOAD MAP */
	
	$('#wyca_edit_map #wyca_edit_map_bAbortReloadMap').click(function(){
		$('.modalConfirmNoReloadMap').modal('show');
	})
	
	$('#wyca_edit_map .modalReloadMap .wyca_edit_map_bReloadMap').click(function(){
		$('#wyca_edit_map .modalReloadMap .btn').addClass('disabled');
		$('#wyca_edit_map .modalReloadMap .wyca_edit_map_modalReloadMap_loading').show();
		GetInfosCurrentMapWyca();
	})
	
	$('#wyca_edit_map .modalConfirmNoReloadMap .wyca_edit_map_bReloadMap').click(function(){
		$('#wyca_edit_map .modalConfirmNoReloadMap .btn').addClass('disabled');
		$('#wyca_edit_map .modalConfirmNoReloadMap .wyca_edit_map_modalReloadMap_loading').show();
		GetInfosCurrentMapWyca();
	})
	
	if($('#wyca_edit_map .select_area_sound').length > 0 && typeof(wycaApi) != 'undefined' && typeof(wycaApi.SOUND) != 'undefined' ){
		for (const [key, value] of Object.entries(wycaApi.SOUND)) {
			$('#wyca_edit_map .select_area_sound').append('<option value="'+value+'">'+key+'</option>')
		}
	}
	
	window.addEventListener('beforeunload', function(e){
		if (!wycaSavedCanClose)
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
	
	svgWyca = document.querySelector('#wyca_edit_map_svg');
	WycaInitSVG();
	
	$('#wyca_edit_map #wyca_edit_map_bEndGomme').click(function(e) {
        e.preventDefault();
		
		wycaCanChangeMenu = true;
		$('#wyca_edit_map_bEndGomme').hide();
		$('#wyca_edit_map_bCancelGomme').hide();
		wycaCurrentAction = '';
		currentStep = '';
		$('body').addClass('no_current');
		blockZoom = false;
		WycaHideMenus();
		WycaSetModeSelect();
		
    });
	
	$('#wyca_edit_map #wyca_edit_map_bCancelGomme').click(function(e) {
        e.preventDefault();
		let lg = gommes.length;
		gommes.pop[lg-1];
		$('#wyca_edit_map_svg .gomme_elem_current_'+(lg-1)).remove();
		
		wycaCanChangeMenu = true;
		$('#wyca_edit_map_bEndGomme').hide();
		$('#wyca_edit_map_bCancelGomme').hide();
		$('#wyca_edit_map .times_icon_menu').show('fast');
		
		sizeGomme = $('#wyca_edit_map_menu_erase .bGommeSize.selected').data('size');
		wycaCurrentAction = 'gomme';	
		currentStep = '';
		
		$('body').removeClass('no_current');
		$('body').addClass('gomme');		
    });
	
	$('#wyca_edit_map #wyca_edit_map_bStop').click(function(e) {
        e.preventDefault();
		
		wycaApi.StopMove();	
    });
	
	$('#wyca_edit_map #wyca_edit_map_bPlusCurrentElem').click(function(e) {
        e.preventDefault();
		
		if (wycaCurrentAction == 'addForbiddenArea' || wycaCurrentAction == 'editForbiddenArea'){
			WycaForbiddenSave('plus');		
			
		}
    });
	
	$('#wyca_edit_map #wyca_edit_map_bSaveCurrentElem').click(function(e) {
        e.preventDefault();
		
		if (wycaCurrentAction == 'addPoi' || wycaCurrentAction == 'editPoi')
			WycaPoiSave();
		else if (wycaCurrentAction == 'addAugmentedPose' || wycaCurrentAction == 'editAugmentedPose')
			WycaAugmentedPoseSave();
		else if (wycaCurrentAction == 'addDock' || wycaCurrentAction == 'editDock')
			WycaDockSave();
		else if (wycaCurrentAction == 'addArea' || wycaCurrentAction == 'editArea')
			WycaAreaSave();
		else if (wycaCurrentAction == 'addForbiddenArea' || wycaCurrentAction == 'editForbiddenArea')
			WycaForbiddenSave();		
    });
	
	$('#wyca_edit_map #wyca_edit_map_bCancelCurrentElem').click(function(e) {
        e.preventDefault();
		WycaHideMenus();
		if (wycaCurrentAction == 'addPoi' || wycaCurrentAction == 'editPoi')
			WycaPoiCancel();
		else if (wycaCurrentAction == 'addAugmentedPose' || wycaCurrentAction == 'editAugmentedPose')
			WycaAugmentedPoseCancel();
		else if (wycaCurrentAction == 'addDock' || wycaCurrentAction == 'editDock')
			WycaDockCancel();
		else if (wycaCurrentAction == 'addArea' || wycaCurrentAction == 'editArea')
			WycaAreaCancel();
		else if (wycaCurrentAction == 'addForbiddenArea' || wycaCurrentAction == 'editForbiddenArea')
			WycaForbiddenCancel();		
		
    });
	
	/* BTNS HISTORIQUE */
	
	$('#wyca_edit_map_bUndo').click(function(e) {
        e.preventDefault();
		if (!$('#wyca_edit_map_bUndo').hasClass('disabled'))
			WycaUndo();
	});
	/*
	$('#wyca_edit_map_bUndo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#wyca_edit_map_bUndo').hasClass('disabled'))
			WycaUndo();
	});
	*/
	$('#wyca_edit_map_bRedo').click(function(e) {
        e.preventDefault();
		if (!$('#wyca_edit_map_bRedo').hasClass('disabled'))
			WycaRedo();
    });
	/*
	$('#wyca_edit_map_bRedo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#wyca_edit_map_bRedo').hasClass('disabled'))
			WycaRedo();
	});
	*/
	$(document).on('touchstart', '#wyca_edit_map_svg .movable', function(e) {
		if (wycaCurrentAction != 'gomme')
		{
			touchStarted = true;
			downOnMovable = true;
			movableDown = $(this);
			//wycaDownOnSVG_x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
			//wycaDownOnSVG_y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
			wycaDownOnSVG_x = parseFloat($(this).attr('x')) + parseFloat($(this).attr('width'))/2;
			wycaDownOnSVG_y = parseFloat($(this).attr('y')) + parseFloat($(this).attr('height'))/2;
			
			p = $('#wyca_edit_map_svg image').position();
			zoom = WycaGetZoom();
			
			wycaDownOnSVG_x = wycaDownOnSVG_x / zoom + p.left;
			wycaDownOnSVG_y = wycaDownOnSVG_y / zoom + p.top;
			
			WycaSaveElementNeeded(true);
			
			blockZoom = true;
		}
    });
	
	$(document).on('touchstart', '#wyca_edit_map_svg .secable', function(e) {
		zoom = WycaGetZoom();
		if (wycaCurrentAction == 'editForbiddenArea' || wycaCurrentAction == 'addForbiddenArea')
		{
			p = $('#wyca_edit_map_svg image').position();
			x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[e.changedTouches.length-1].pageX) : event.pageX ) - p.left;
			y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[e.changedTouches.length-1].pageY) : event.pageY ) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			tailleArea = 1*zoom;
			tailleArea = 1;
			
			
			forbiddens[currentForbiddenIndex].points.splice($(this).data('index_point'), 0, {x:xRos, y:yRos});
			WycaTraceForbidden(currentForbiddenIndex);
			WycaSaveElementNeeded(true);
		}
		else if (wycaCurrentAction == 'editArea' || wycaCurrentAction == 'addArea')
		{
			p = $('#wyca_edit_map_svg image').position();
			x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[e.changedTouches.length-1].pageX) : event.pageX ) - p.left;
			y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[e.changedTouches.length-1].pageY) : event.pageY ) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			tailleArea = 1*zoom;
			tailleArea = 1;
			
			
			areas[currentAreaIndex].points.splice($(this).data('index_point'), 0, {x:xRos, y:yRos});
			WycaTraceArea(currentAreaIndex);
			WycaSaveElementNeeded(true);
		}
    });
	
	/* MENU POINT */
	
	$('#wyca_edit_map_menu_point .bDeletePoint').click(function(e) {
        e.preventDefault();
		WycaHideMenus();
		if (wycaCurrentAction == 'editForbiddenArea' || wycaCurrentAction == 'addForbiddenArea')
		{
			forbiddens[currentForbiddenIndex].points.splice(currentPointWycaLongTouch.data('index_point'), 1);
			currentPointWycaLongTouch = null;
			WycaTraceForbidden(currentForbiddenIndex);
			WycaSaveElementNeeded(false);
			WycaDisplayMenu('wyca_edit_map_menu_forbidden');
		}
		else if (wycaCurrentAction == 'editArea' || wycaCurrentAction == 'addArea')
		{
			areas[currentAreaIndex].points.splice(currentPointWycaLongTouch.data('index_point'), 1);
			currentPointWycaLongTouch = null;
			WycaTraceArea(currentAreaIndex);
			WycaSaveElementNeeded(false);
			WycaDisplayMenu('wyca_edit_map_menu_area');
		}
    });
	
	/* MENU FORBIDDEN */
	
	$('#wyca_edit_map_menu_forbidden .bDeleteForbidden').click(function(e) {
        e.preventDefault();
		//WycaSaveElementNeeded(true);
		WycaHideMenus();
		if (wycaCurrentAction == "select" || wycaCurrentAction == 'editForbiddenArea')
		{
			i = GetForbiddenIndexFromID(currentForbiddenWycaLongTouch.data('id_area'));
			WycaDeleteForbidden(i);	
		}
    });
	
	/* MENU AREA */
	
	$('#wyca_edit_map_menu_area .bDeleteArea').click(function(e) {
        e.preventDefault();
		WycaHideMenus();
		if (wycaCurrentAction == "select" || wycaCurrentAction == 'editArea')
		{
			i = GetAreaIndexFromID(currentAreaWycaLongTouch.data('id_area'));
			WycaDeleteArea(i);	
		}
    });
	
	$('#wyca_edit_map_menu_area .bConfigArea').click(function(e) {
        e.preventDefault();
		//WycaHideMenus();
		if (wycaCurrentAction == "select" || wycaCurrentAction == 'editArea')
		{
			currentAreaIndex = GetAreaIndexFromID(currentAreaWycaLongTouch.data('id_area'));
			area = areas[currentAreaIndex];
			if (area.configs != undefined)
			{
				$('#wyca_edit_map_led_color_mode').val('Automatic');
				$('#wyca_edit_map_led_animation_mode').val('Automatic');
				$('#wyca_edit_map_min_distance_obstacle_mode').val('Automatic');
				$('#wyca_edit_map_max_speed_mode').val('Automatic');
				$('#wyca_edit_map_area_sound').val(-1);
				
				$.each(area.configs, function( indexConfig, config ) {
					switch(config.name)
					{
						case 'led_color_mode': $('#wyca_edit_map_led_color_mode').val(config.value); break;
						case 'led_color': $('#wyca_edit_map_led_color').val(config.value); $('#wyca_edit_map_led_color').keyup(); break;
						case 'led_animation_mode': $('#wyca_edit_map_led_animation_mode').val(config.value); break;
						case 'led_animation': $('#wyca_edit_map_led_animation').val(config.value); break;
						case 'max_speed_mode': $('#wyca_edit_map_max_speed_mode').val(config.value); break;
						case 'max_speed': $('#wyca_edit_map_max_speed').val(config.value); break;
						case 'min_distance_obstacle_mode': $('#wyca_edit_map_min_distance_obstacle_mode').val(config.value); break;
						case 'min_distance_obstacle': $('#wyca_edit_map_min_distance_obstacle').val(config.value*100); break;
						case 'sound': $('#wyca_edit_map_area_sound').val(config.value); break;
					}
				});
			}
			else
			{
				$('#wyca_edit_map_led_color_mode').val('Automatic');
				$('#wyca_edit_map_led_animation_mode').val('Automatic');
				$('#wyca_edit_map_min_distance_obstacle_mode').val('Automatic');
				$('#wyca_edit_map_max_speed_mode').val('Automatic');
				$('#wyca_edit_map_area_sound').val(-1);
			}
			
			$('#wyca_edit_map_area_color').val('rgb('+area.color_r+','+area.color_g+','+area.color_b+')'); $('#wyca_edit_map_area_color').keyup();
			
			if ($('#wyca_edit_map_led_color_mode').val() == 'Automatic') $('#wyca_edit_map_led_color_group').hide(); else  $('#wyca_edit_map_led_color_group').show();
			if ($('#wyca_edit_map_led_animation_mode').val() == 'Automatic') $('#wyca_edit_map_led_animation_group').hide(); else  $('#wyca_edit_map_led_animation_group').show();
			if ($('#wyca_edit_map_min_distance_obstacle_mode').val() == 'Automatic')
				$('#wyca_edit_map_min_distance_obstacle_group').hide(); 
			else 
				$('#wyca_edit_map_min_distance_obstacle_group').show();
			if ($('#wyca_edit_map_max_speed_mode').val() == 'Automatic') $('#wyca_edit_map_max_speed_group').hide(); else  $('#wyca_edit_map_max_speed_group').show();
			$('#wyca_edit_map_container_all .modalAreaOptions').modal('show');
		}
    });
	
	/* MENU DOCK */
	
	$('#wyca_edit_map_menu_dock .bDeleteDock').click(function(e) {
        e.preventDefault();
		WycaHideMenus();
		i = GetDockIndexFromID(currentDockWycaLongTouch.data('id_docking_station'));
		WycaDeleteDock(i);
    });
	
	$('#wyca_edit_map_menu_dock .bConfigDock').click(function(e) {
        e.preventDefault();
		//WycaHideMenus();
		wycaCurrentAction = 'editDock';
	
		currentDockIndex = GetDockIndexFromID(currentDockWycaLongTouch.data('id_docking_station'));
		dock = docks[currentDockIndex];
		$('#wyca_edit_map_dock_is_master').prop('checked', dock.is_master);
		$('#wyca_edit_map_dock_fiducial_number').val(dock.id_fiducial);
		$('#wyca_edit_map_dock_number').val(dock.num);
		$('#wyca_edit_map_dock_name').val(dock.name);
		$('#wyca_edit_map_dock_comment').val(dock.comment);
		
		$('#wyca_edit_map_container_all .modalDockOptions .list_undock_procedure li').remove();
		
		if (dock.undock_path.length > 0)
		{
			$.each(dock.undock_path, function( indexConfig, undock_step ) {
	
				console.log(undock_step);
				indexDockElem++;
				
				if (undock_step.linear_distance != 0)
				{				
					distance = undock_step.linear_distance;
					direction = undock_step.linear_distance > 0 ? 'front':'back';
					
					$('#wyca_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
						'<li id="wyca_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="move" data-distance="' + distance + '">'+
						'	<span>' + (typeof(textUndockPathMove) != 'undefined' ? textUndockPathMove : 'Move') +' '+ ((direction == 'back')?(typeof(textUndockPathback) != 'undefined' ? textUndockPathback : 'back'):(typeof(textUndockPathfront) != 'undefined' ? textUndockPathfront : 'front')) + ' ' + ((direction == 'back')?distance*-1:distance) + 'm</span>'+
						'	<a href="#" class="bWycaUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bWycaUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				else
				{	
					angle = undock_step.angular_distance * 180 / Math.PI;
					angle = Math.round(angle*100)/100;
					
					$('#wyca_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
						'<li id="wyca_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="rotate" data-angle="'+angle+'">'+
						'	<span>' + (typeof(textUndockPathRotate) != 'undefined' ? textUndockPathRotate : 'Rotate') +' '+angle+'°</span>'+
						'	<a href="#" class="bWycaUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bWycaUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				
			});		
		}
		
		$('#wyca_edit_map_container_all .modalDockOptions').modal('show');
    });
	
	$('#wyca_edit_map .bCancelTestDock').click(function(e) {boolGotodock=false});
	
	$('#wyca_edit_map .bTestDock').click(function(e) {
        e.preventDefault();
		
		if (currentDockWycaLongTouch.data('id_docking_station') >= 300000){
			boolGotodock = true;
			statusSavingMapBeforeTestDock=1;
			timerSavingMapBeforeTestDock=0;
			$('#wyca_edit_map_modalDoSaveBeforeTestDock').modal('show');
			TimerSavingMapBeforeTest('dock'); // LAUNCH ANIM PROGRESS BAR
			
			id_dock_test = currentDockWycaLongTouch.data('id_docking_station');
			i = GetDockIndexFromID(currentDockWycaLongTouch.data('id_docking_station'));
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
								
								id_map = data.D.id_map;
								id_map_last = data.D.id_map;
								
								forbiddens = data.D.forbiddens;
								areas = data.D.areas;
								gommes = Array();
								docks = data.D.docks;
								pois = data.D.pois;
								augmented_poses = data.D.augmented_poses;
								/*
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
								*/
								wycaHistoriques = Array();
								wycaHistoriqueIndex = -1;
								WycaRefreshHistorique();
								
								WycaInitMap();
								WycaResizeSVG();
								
								// On recherche le nouveau dock créé avec le bon id
								if (id_dock_test >= 300000)
								{
									$.each(docks, function( index, dock ) {
										
										if (dock.name == name)
										{
											currentDockWycaLongTouch = $('#wyca_edit_map_dock_'+dock.id_docking_station);
											setTimeout(function(){$('#wyca_edit_map_modalDoSaveBeforeTestDock').modal('hide')},1500);
											if(boolGotodock){
												$('#wyca_edit_map .bTestDock').click();
											}
										}
									});
								}
							}
							else
							{
								$('#wyca_edit_map_modalDoSaveBeforeTestDock').modal('hide')
								ParseAPIAnswerError(data,textErrorGetMap);
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
								
								wycaHistoriques = Array();
								wycaHistoriqueIndex = -1;
								WycaRefreshHistorique();
								
								WycaInitMap();
								WycaResizeSVG();
	
								// On recherche le nouveau dock créé avec le bon id
								if (id_dock_test >= 300000)
								{
									$.each(docks, function( index, dock ) {
										
										if (dock.name == name)
										{
											currentDockWycaLongTouch = $('#wyca_edit_map_dock_'+dock.id_docking_station);
											setTimeout(function(){$('#wyca_edit_map_modalDoSaveBeforeTestDock').modal('hide')},1500);
											if(boolGotodock){
												$('#wyca_edit_map .bTestDock').click();
											}
										}
									});
								}
							}
							else
							{
								$('#wyca_edit_map_modalDoSaveBeforeTestDock').modal('hide')
								ParseAPIAnswerError(data,textErrorGetMap);
							}
						});
					}
				}else{
					$('#wyca_edit_map_modalDoSaveBeforeTestDock').modal('hide');
					ParseAPIAnswerError(data,textErrorSetMap);
				}
			});
		}
		else
		{
			//WycaHideMenus();
			
			wycaApi.on('onGoToChargeResult', function (data){
				$('#wyca_edit_map_bStop').hide();
				WycaDisplayApiMessageGoTo(data);
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToChargeResult', onGoToChargeResult);
			});
			wycaApi.GoToCharge(currentDockWycaLongTouch.data('id_docking_station'), function (data){
				
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#wyca_edit_map_bStop').show();
				}
				else
				{
					WycaDisplayApiMessageGoTo(data);
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToChargeResult', onGoToChargeResult);
				}
			});
		}
    });
	
	/* MENU POI */
	
	$('#wyca_edit_map_menu_poi .bDeletePoi').click(function(e) {
        e.preventDefault();
		WycaHideMenus();
		i = GetPoiIndexFromID(currentPoiWycaLongTouch.data('id_poi'));
		WycaDeletePoi(i);
    });
	
	$('#wyca_edit_map_menu_poi .bConfigPoi').click(function(e) {
        e.preventDefault();
		//WycaHideMenus();
		wycaCurrentAction = 'editPoi';
	
		currentPoiIndex = GetPoiIndexFromID(currentPoiWycaLongTouch.data('id_poi'));
		poi = pois[currentPoiIndex];
		
		$('#wyca_edit_map_poi_name').val(poi.name);
		$('#wyca_edit_map_poi_comment').val(poi.comment);
		
		$('#wyca_edit_map_container_all .modalPoiOptions').modal('show');
		
    });
	
	$('#wyca_edit_map .bTestPoi').click(function(e) {
        e.preventDefault();
		
		if (currentPoiWycaLongTouch.data('id_poi') >= 300000)
		{
			boolGotopoi = true;
			statusSavingMapBeforeTestPoi=1;
			timerSavingMapBeforeTestPoi=0;
			$('#wyca_edit_map_modalDoSaveBeforeTestPoi').modal('show');
			TimerSavingMapBeforeTest('poi'); // LAUNCH ANIM PROGRESS BAR
			
			id_poi_test = currentPoiWycaLongTouch.data('id_poi');
			i = GetPoiIndexFromID(currentPoiWycaLongTouch.data('id_poi'));
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
								augmented_poses = data.D.augmented_poses;
								/*
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
								*/
								wycaHistoriques = Array();
								wycaHistoriqueIndex = -1;
								WycaRefreshHistorique();
								
								WycaInitMap();
								WycaResizeSVG();
								
								// On recherche le nouveau poi créé avec le bon id
								if (id_poi_test >= 300000)
								{
									$.each(pois, function( index, poi ) {
										
										if (poi.name == name)
										{
											currentPoiWycaLongTouch = $('#wyca_edit_map_poi_robot_'+poi.id_poi);
											setTimeout(function(){$('#wyca_edit_map_modalDoSaveBeforeTestPoi').modal('hide')},1500);
											if(boolGotopoi){
												$('#wyca_edit_map .bTestPoi').click();
											}
										}
									});
								}
								
							}
							else
							{
								$('#wyca_edit_map_modalDoSaveBeforeTestPoi').modal('hide')
								ParseAPIAnswerError(data,textErrorGetMap);
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
								
								wycaHistoriques = Array();
								wycaHistoriqueIndex = -1;
								WycaRefreshHistorique();
								
								WycaInitMap();
								WycaResizeSVG();
								
								// On recherche le nouveau poi créé avec le bon id
								if (id_poi_test >= 300000)
								{
									$.each(pois, function( index, poi ) {
										
										if (poi.name == name)
										{
											currentPoiWycaLongTouch = $('#wyca_edit_map_poi_robot_'+poi.id_poi);
											setTimeout(function(){$('#wyca_edit_map_modalDoSaveBeforeTestPoi').modal('hide')},1500);
											if(boolGotopoi){
												$('#wyca_edit_map .bTestPoi').click();
											}
										}
									});
								}
								
							}
							else
							{
								$('#wyca_edit_map_modalDoSaveBeforeTestPoi').modal('hide')
								ParseAPIAnswerError(data,textErrorGetMap);
							}
						});
					}
				}else{
					$('#wyca_edit_map_modalDoSaveBeforeTestPoi').modal('hide');
					ParseAPIAnswerError(data,textErrorSetMap);
				}
			});
		}
		else
		{
			//WycaHideMenus();
			wycaApi.on('onGoToPoiResult', function (data){
				$('#wyca_edit_map_bStop').hide();
				
				WycaDisplayApiMessageGoTo(data);
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToPoiResult', onGoToPoiResult);
			
			});
			
			wycaApi.GoToPoi(currentPoiWycaLongTouch.data('id_poi'), function (data){
				
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#wyca_edit_map_bStop').show();
				}
				else
				{
					WycaDisplayApiMessageGoTo(data);
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoiResult', onGoToPoiResult);
				}
			});
		}
    });
    
	/* MENU AUGMENTED POSE */
	
	$('#wyca_edit_map_menu_augmented_pose .bDeleteAugmentedPose').click(function(e) {
        e.preventDefault();
		WycaHideMenus();
		i = GetAugmentedPoseIndexFromID(currentAugmentedPoseWycaLongTouch.data('id_augmented_pose'));
		WycaDeleteAugmentedPose(i);
    });
	
	$('#wyca_edit_map_menu_augmented_pose .bConfigAugmentedPose').click(function(e) {
        e.preventDefault();
		//WycaHideMenus();
		wycaCurrentAction = 'editAugmentedPose';
	
		currentAugmentedPoseIndex = GetAugmentedPoseIndexFromID(currentAugmentedPoseWycaLongTouch.data('id_augmented_pose'));
		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		
		$('#wyca_edit_map_augmented_pose_name').val(augmented_pose.name);
		$('#wyca_edit_map_augmented_pose_fiducial_number').val(augmented_pose.id_fiducial);
		$('#wyca_edit_map_augmented_pose_comment').val(augmented_pose.comment);
		
		$('#wyca_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose li').remove();
		
		if (augmented_pose.undock_path.length > 0)
		{
			$.each(augmented_pose.undock_path, function( indexConfig, undock_step ) {
	
				console.log(undock_step);
				indexAugmentedPoseElem++;
				
				if (undock_step.linear_distance != 0)
				{				
					distance = undock_step.linear_distance;
					direction = undock_step.linear_distance > 0 ? 'front':'back';
					
					$('#wyca_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
						'<li id="wyca_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="move" data-distance="' + distance + '">'+
						'	<span>' + (typeof(textUndockPathMove) != 'undefined' ? textUndockPathMove : 'Move') +' '+ ((direction == 'back')?(typeof(textUndockPathback) != 'undefined' ? textUndockPathback : 'back'):(typeof(textUndockPathfront) != 'undefined' ? textUndockPathfront : 'front')) + ' ' + ((direction == 'back')?distance*-1:distance) + 'm</span>'+
						'	<a href="#" class="bWycaUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bWycaUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				else
				{	
					angle = undock_step.angular_distance * 180 / Math.PI;
					angle = Math.round(angle*100)/100;
					
					$('#wyca_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
						'<li id="wyca_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="rotate" data-angle="'+angle+'">'+
						'	<span>' + (typeof(textUndockPathRotate) != 'undefined' ? textUndockPathRotate : 'Rotate') +' '+angle+'°</span>'+
						'	<a href="#" class="bWycaUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bWycaUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				
			});		
		}
		
		$('#wyca_edit_map_container_all .modalAugmentedPoseOptions').modal('show');
		
    });
	
	$('#wyca_edit_map .bCancelTestAugmentedPose').click(function(e){boolGotoaugmentedpose=false });
	
	$('#wyca_edit_map .bTestAugmentedPose').click(function(e) {
        e.preventDefault();
		
		if (currentAugmentedPoseWycaLongTouch.data('id_augmented_pose') >= 300000)
		{
			boolGotoaugmentedpose = true;
			statusSavingMapBeforeTestAugmentedPose=1;
			timerSavingMapBeforeTestAugmentedPose=0;
			$('#wyca_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('show');
			TimerSavingMapBeforeTest('augmented_pose');  // LAUNCH ANIM PROGRESS BAR
			
			id_augmented_pose_test = currentAugmentedPoseWycaLongTouch.data('id_augmented_pose');
			i = GetAugmentedPoseIndexFromID(currentAugmentedPoseWycaLongTouch.data('id_augmented_pose'));
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
								
								id_map = data.D.id_map;
								id_map_last = data.D.id_map;
								
								forbiddens = data.D.forbiddens;
								areas = data.D.areas;
								gommes = Array();
								docks = data.D.docks;
								pois = data.D.pois;
								augmented_poses = data.D.augmented_poses;
								/*
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
								*/
								wycaHistoriques = Array();
								wycaHistoriqueIndex = -1;
								WycaRefreshHistorique();
								
								WycaInitMap();
								WycaResizeSVG();
								
								// On recherche le nouveau augmented_pose créé avec le bon id
								if (id_augmented_pose_test >= 300000)
								{
									$.each(augmented_poses, function( index, augmented_pose ) {
										
										if (augmented_pose.name == name)
										{
											currentAugmentedPoseWycaLongTouch = $('#wyca_edit_map_augmented_pose_robot_'+augmented_pose.id_augmented_pose);
											setTimeout(function(){$('#wyca_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('hide')},1500);
											if(boolGotoaugmentedpose){
												$('#wyca_edit_map .bTestAugmentedPose').click();
											}
										}
									});
								}
							}
							else
							{
								$('#wyca_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('hide')
								ParseAPIAnswerError(data,textErrorGetMap);
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
								
								wycaHistoriques = Array();
								wycaHistoriqueIndex = -1;
								WycaRefreshHistorique();
								
								WycaInitMap();
								WycaResizeSVG();
								
								// On recherche le nouveau augmented_pose créé avec le bon id
								if (id_augmented_pose_test >= 300000)
								{
									$.each(augmented_poses, function( index, augmented_pose ) {
										
										if (augmented_pose.name == name)
										{
											currentAugmentedPoseWycaLongTouch = $('#wyca_edit_map_augmented_pose_robot_'+augmented_pose.id_augmented_pose);
											setTimeout(function(){$('#wyca_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('hide')},1500);
											if(boolGotoaugmentedpose){
												$('#wyca_edit_map .bTestAugmentedPose').click();
											}
										}
									});
								}
							}
							else
							{
								$('#wyca_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('hide')
								ParseAPIAnswerError(data,textErrorGetMap);
							}
						});
					}		
				}else{
					$('#wyca_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('hide');
					ParseAPIAnswerError(data,textErrorSetMap);
				}
			});
		}
		else
		{
			//WycaHideMenus();
			wycaApi.on('onGoToAugmentedPoseResult', function (data){
				$('#wyca_edit_map_bStop').hide();
				
				WycaDisplayApiMessageGoTo(data);
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
			});
			
			wycaApi.GoToAugmentedPose(currentAugmentedPoseWycaLongTouch.data('id_augmented_pose'), function (data){
				
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#wyca_edit_map_bStop').show();
				}
				else
				{
					
					WycaDisplayApiMessageGoTo(data);
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
				}
			});
		}
    });
	
	$('#wyca_edit_map_svg').on('contextmenu', function (e) {
		
		if (wycaCurrentAction == 'gomme' && currentStep=='trace')
		{
			currentStep = '';
			currentGommePoints.pop(); // Point du curseur
			WycaTraceCurrentGomme(currentGommePoints);
			return false;
			
		}
		/*
		else if (wycaCurrentAction == 'addForbiddenArea' && currentStep=='trace')
		{
			currentStep = '';
			currentForbiddenPoints.pop(); // Point du curseur
			WycaTraceCurrentForbidden(currentForbiddenPoints);
			return false;
		}
		else if (wycaCurrentAction == 'addArea' && currentStep=='trace')
		{
			currentStep = '';
			currentAreaPoints.pop(); // Point du curseur
			WycaTraceCurrentArea(currentAreaPoints);
			return false;
		}
		*/
    });
	
	/**************************/
	/*        ZOOM            */
	/**************************/
	
	$('#wyca_edit_map_zone_zoom_click').mousedown(function(e) {
       e.preventDefault();
	   downOnZoomClick = true;
    });
    
	$('#wyca_edit_map_zone_zoom_click').mousemove(function(e) {
       e.preventDefault();
	   if (downOnZoomClick)
	   {
			w = $('#wyca_edit_map_zoom_carte').width();
			h = $('#wyca_edit_map_zoom_carte').height();
			
			wZoom = $('#wyca_edit_map_zone_zoom').width();
			hZoom = $('#wyca_edit_map_zone_zoom').height();
			
			x = e.offsetX - wZoom / 2;
			y = e.offsetY - hZoom / 2;
					
			//zoom = ros_largeur / $('#wyca_edit_map_svg').width() / window.panZoomWyca.getZoom();
			zoom = WycaGetZoom();
			
			largeur_img = ros_largeur / zoom
			
			x = - x / w * largeur_img;
			y = - y / w * largeur_img;
			
			window.panZoomWyca.pan({'x':x, 'y':y});
	   }
    });
	
	$('#wyca_edit_map_zone_zoom_click').click(function(e) {
		e.preventDefault();
		
		w = $('#wyca_edit_map_zoom_carte').width();
		h = $('#wyca_edit_map_zoom_carte').height();
		
		wZoom = $('#wyca_edit_map_zone_zoom').width();
		hZoom = $('#wyca_edit_map_zone_zoom').height();
		
		x = e.offsetX - wZoom / 2;
		y = e.offsetY - hZoom / 2;
				
		//zoom = ros_largeur / $('#wyca_edit_map_svg').width() / window.panZoomWyca.getZoom();
		zoom = WycaGetZoom();
		
		largeur_img = ros_largeur / zoom
		
		x = - x / w * largeur_img;
		y = - y / w * largeur_img;
		
		window.panZoomWyca.pan({'x':x, 'y':y});
	});
	
	$('#wyca_edit_map_zone_zoom_click').on('touchstart', function(e) {
       e.preventDefault();
	   downOnZoomClick = true;
	   
	    w = $('#wyca_edit_map_zoom_carte').width();
		h = $('#wyca_edit_map_zoom_carte').height();
		
		wZoom = $('#wyca_edit_map_zone_zoom').width();
		hZoom = $('#wyca_edit_map_zone_zoom').height();
		
		r = document.getElementById("wyca_edit_map_zoom_carte_container").getBoundingClientRect();
		
		x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) - r.left;
		y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - r.top;
		
		x = x - wZoom / 2;
		y = y - hZoom / 2;
				
		//zoom = ros_largeur / $('#wyca_edit_map_svg').width() / window.panZoomWyca.getZoom();
		zoom = WycaGetZoom();
		
		largeur_img = ros_largeur / zoom
		
		x = - x / w * largeur_img;
		y = - y / w * largeur_img;
		
		window.panZoomWyca.pan({'x':x, 'y':y});
	   
    });
	
	$('#wyca_edit_map_zone_zoom_click').on('touchend', function(e) {
       e.preventDefault();
	   downOnZoomClick = false;
    });
	
	$('#wyca_edit_map_zone_zoom_click').on('touchmove', function(e) {
       e.preventDefault();
	   if (downOnZoomClick)
	   {
		    w = $('#wyca_edit_map_zoom_carte').width();
			h = $('#wyca_edit_map_zoom_carte').height();
			
			wZoom = $('#wyca_edit_map_zone_zoom').width();
			hZoom = $('#wyca_edit_map_zone_zoom').height();
			
			r = document.getElementById("wyca_edit_map_zoom_carte_container").getBoundingClientRect();
		
			x = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) : event.pageX) - r.left;
			y = (event.targetTouches ? (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) : event.pageY) - r.top;
			
			x = x - wZoom / 2;
			y = y - hZoom / 2;
					
			//zoom = ros_largeur / $('#wyca_edit_map_svg').width() / window.panZoomWyca.getZoom();
			zoom = WycaGetZoom();
			
			largeur_img = ros_largeur / zoom
			
			x = - x / w * largeur_img;
			y = - y / w * largeur_img;
			
			window.panZoomWyca.pan({'x':x, 'y':y});
	   }
    });
	
	/**************************/
	/*  Click on element      */
	/**************************/

	$(document).on('click', '#wyca_edit_map_svg .forbidden_elem', function(e) {
		e.preventDefault();
		
		if ((wycaCurrentAction == 'addArea' || wycaCurrentAction == 'addForbiddenArea') && currentStep == 'trace')
		{
		}
		else if (wycaCurrentAction == 'gomme')
		{
		}
		else if (wycaCanChangeMenu)
		{
			RemoveClass('#wyca_edit_map_svg .active', 'active');
			RemoveClass('#wyca_edit_map_svg .activ_select', 'activ_select'); 
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'forbidden', 'id':$(this).data('id_area')});	
			
			$('#wyca_edit_map_boutonsForbidden').show();
            $('#wyca_edit_map_boutonsStandard').hide();
			
			$('#wyca_edit_map_boutonsForbidden #wyca_edit_map_bForbiddenDelete').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			currentForbiddenWycaLongTouch = $(this);
			//MENU FORBIDDEN DISPLAY
			if (wycaCurrentAction != 'editForbiddenArea' && wycaCurrentAction != 'addForbiddenArea')
			{
				WycaHideCurrentMenuNotSelect();
				WycaDisplayMenu('wyca_edit_map_menu_forbidden');
			}
			
			wycaCurrentAction = 'editForbiddenArea';	
			currentStep = '';
			
			currentForbiddenIndex = GetForbiddenIndexFromID($(this).data('id_area'));
			//DELETE CURRENTPOINT + REDRAW TO PASS OVER SVG
			if(currentPointWycaLongTouch != null)
				currentPointWycaLongTouch.data('index_point',-1);
			currentPointWycaLongTouch = null;
			WycaTraceForbidden(currentForbiddenIndex);
			
			forbidden = forbiddens[currentForbiddenIndex];
			saveCurrentForbidden = JSON.stringify(forbidden);
			
			AddClass('#wyca_edit_map_svg .forbidden_elem_'+forbidden.id_area, 'active');
		}
		else
			WycaAvertCantChange();
	});
	
	$(document).on('click', '#wyca_edit_map_svg .area_elem', function(e) {
		e.preventDefault();
		
		if ((wycaCurrentAction == 'addArea' || wycaCurrentAction == 'addForbiddenArea') && currentStep == 'trace')
		{
		}
		else if (wycaCurrentAction == 'gomme')
		{
		}
		else if (wycaCanChangeMenu)
		{
			RemoveClass('#wyca_edit_map_svg .active', 'active');
			RemoveClass('#wyca_edit_map_svg .activ_select', 'activ_select'); 
			
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'area', 'id':$(this).data('id_area')});	
			
			$('#wyca_edit_map_boutonsArea').show();
            $('#wyca_edit_map_boutonsStandard').hide();
			
			$('#wyca_edit_map_boutonsArea #wyca_edit_map_bAreaDelete').show();
			$('#wyca_edit_map_boutonsArea #wyca_edit_map_bAreaOptions').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			currentAreaWycaLongTouch=$(this);
			//MENU AREA DISPLAY
			if (wycaCurrentAction != 'editArea')
			{
				WycaHideCurrentMenuNotSelect();
				WycaDisplayMenu('wyca_edit_map_menu_area');
			}
			
			wycaCurrentAction = 'editArea';	
			currentStep = '';
			
			currentAreaIndex = GetAreaIndexFromID($(this).data('id_area'));
			//DELETE CURRENTPOINT + REDRAW TO PASS OVER SVG
			if(currentPointWycaLongTouch != null)
				currentPointWycaLongTouch.data('index_point',-1);
			currentPointWycaLongTouch = null;
			WycaTraceArea(currentAreaIndex);
			
			area = areas[currentAreaIndex];
			saveCurrentArea = JSON.stringify(area);
			
			AddClass('#wyca_edit_map_svg .area_elem_'+area.id_area, 'active');
		}
		else
			WycaAvertCantChange();
	});
	
	$(document).on('click', '#wyca_edit_map_svg .dock_elem', function(e) {
		e.preventDefault();
		
		if (wycaCurrentAction == 'addDock')
		{
		}
		else if (wycaCurrentAction == 'gomme')
		{
		}
		else if (wycaCanChangeMenu)
		{
			RemoveClass('#wyca_edit_map_svg .active', 'active');
			RemoveClass('#wyca_edit_map_svg .activ_select', 'activ_select'); 
			
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'dock', 'id':$(this).data('id_docking_station')});	
			
			$('#wyca_edit_map_boutonsDock').show();
            $('#wyca_edit_map_boutonsStandard').hide();
			
			$('#wyca_edit_map_boutonsDock a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			currentDockWycaLongTouch=$(this);
			console.log(wycaCurrentAction);
			//MENU DOCK DISPLAY
			if (wycaCurrentAction != 'editDock' && wycaCurrentAction != 'addDock')
			{
				WycaHideCurrentMenuNotSelect();
				WycaDisplayMenu('wyca_edit_map_menu_dock');
			}
			
			wycaCurrentAction = 'editDock';	
			currentStep = '';
			
			currentDockIndex = GetDockIndexFromID($(this).data('id_docking_station'));
			dock = docks[currentDockIndex];
			saveCurrentDock = JSON.stringify(dock);
			
			AddClass('#wyca_edit_map_svg .dock_elem_'+dock.id_docking_station, 'active');
			//AddClass('#wyca_edit_map_svg .dock_elem_'+dock.id_docking_station, 'movable');	// Dock non movable
			
		}
		else
			WycaAvertCantChange();
	});
	
	$(document).on('click', '#wyca_edit_map_svg .poi_elem', function(e) {
		e.preventDefault();
		
		if (wycaCurrentAction == 'addPoi')
		{
		}
		else if (wycaCurrentAction == 'gomme')
		{
		}
		else if (wycaCanChangeMenu)
		{
			RemoveClass('#wyca_edit_map_svg .active', 'active');
			RemoveClass('#wyca_edit_map_svg .activ_select', 'activ_select'); 
			RemoveClass('#wyca_edit_map_svg .poi_elem', 'movable');
						
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'poi', 'id':$(this).data('id_poi')});	
			
			$('#wyca_edit_map_boutonsPoi').show();
			
            $('#wyca_edit_map_boutonsStandard').hide();
			
			$('#wyca_edit_map_boutonsPoi a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			currentPoiWycaLongTouch = $(this);
			//MENU POI DISPLAY
			if (wycaCurrentAction != 'editPoi' && wycaCurrentAction != 'addPoi')
			{
				WycaHideCurrentMenuNotSelect();
				WycaDisplayMenu('wyca_edit_map_menu_poi');
			}
			
			wycaCurrentAction = 'editPoi';	
			currentStep = '';
			
			currentPoiIndex = GetPoiIndexFromID($(this).data('id_poi'));
			poi = pois[currentPoiIndex];
			saveCurrentPoi = JSON.stringify(poi);
			
			AddClass('#wyca_edit_map_svg .poi_elem_'+poi.id_poi, 'active');
			if (poi.id_fiducial < 1) // Movable que si il n'est pas lié à un reflecteur
				AddClass('#wyca_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		}
		else
			WycaAvertCantChange();
	});
	
	$(document).on('click', '#wyca_edit_map_svg .augmented_pose_elem', function(e) {
		e.preventDefault();
		
		if (wycaCurrentAction == 'addAugmentedPose')
		{
		}
		else if (wycaCurrentAction == 'gomme')
		{
		}
		else if (wycaCanChangeMenu)
		{
			RemoveClass('#wyca_edit_map_svg .active', 'active');
			RemoveClass('#wyca_edit_map_svg .activ_select', 'activ_select'); 
			RemoveClass('#wyca_edit_map_svg .augmented_pose_elem', 'movable');
						
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'augmented_pose', 'id':$(this).data('id_augmented_pose')});	
			
			$('#wyca_edit_map_boutonsAugmentedPose').show();
			
            $('#wyca_edit_map_boutonsStandard').hide();
			
			$('#wyca_edit_map_boutonsAugmentedPose a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			currentAugmentedPoseWycaLongTouch=$(this);
			//MENU AUGMENTED POSE DISPLAY
			if (wycaCurrentAction != 'editAugmentedPose' && wycaCurrentAction != 'addAugmentedPose')
			{
				WycaHideCurrentMenuNotSelect();
				WycaDisplayMenu('wyca_edit_map_menu_augmented_pose');
			}
			
			wycaCurrentAction = 'editAugmentedPose';	
			currentStep = '';
			
			currentAugmentedPoseIndex = GetAugmentedPoseIndexFromID($(this).data('id_augmented_pose'));
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			saveCurrentAugmentedPose = JSON.stringify(augmented_pose);
			
			AddClass('#wyca_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'active');
			if (augmented_pose.id_fiducial < 1) // Movable que si il n'est pas lié à un reflecteur
				AddClass('#wyca_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'movable');
		}
		else
			WycaAvertCantChange();
	});
	
	$('.selectChangeAffGroup').change(function(e) {
        if ($(this).val() == 'Automatic')
			$('#' + $(this).attr('id').replace('mode', 'group')).hide();
		else
			$('#' + $(this).attr('id').replace('mode', 'group')).show();
    });
	
	/**************************/
	/*  Click on element      */
	/**************************/
	
	/* BTN RECOVERY */
	
	$('#wyca_edit_map_modalRecovery .bRecovery').click(function(e) {
        e.preventDefault();
		$('#wyca_edit_map_modalRecovery .bRecovery').addClass('disabled');
		
		/*INIT FEEDBACK DISPLAY*/
		$('#wyca_edit_map_modalRecovery .recovery_feedback .recovery_step').css('opacity','0').hide();
		$('#wyca_edit_map_modalRecovery .recovery_feedback .recovery_step .fa-check').hide();
		$('#wyca_edit_map_modalRecovery .recovery_feedback .recovery_step .fa-pulse').show();
		
		wycaApi.on('onRecoveryFromFiducialFeedback', function(data) {
			if(data.A == wycaApi.AnswerCode.NO_ERROR){
				target = '';
				switch(data.M){
					case 'Scan reflector': 				target = '#wyca_edit_map_modalRecovery .recovery_feedback .recovery_step.RecoveryScan';	break;
					case 'Init pose': 					target = '#wyca_edit_map_modalRecovery .recovery_feedback .recovery_step.RecoveryPose';	break;
					case 'Rotate to check obstacles': 	target = '#wyca_edit_map_modalRecovery .recovery_feedback .recovery_step.RecoveryRotate';	break;
					case 'Start navigation': 			target = '#wyca_edit_map_modalRecovery .recovery_feedback .recovery_step.RecoveryNav';		break;
				}
				
				target = $(target);
				if(target.prevAll('.recovery_step:visible').length > 0){
					target.prevAll('.recovery_step:visible').find('.fa-check').show();
					target.prevAll('.recovery_step:visible').find('.fa-pulse').hide();
				}
				target.css('opacity','1').show();
			}
		});
		
		wycaApi.on('onRecoveryFromFiducialResult', function(data) {
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				
				$('#wyca_edit_map_modalRecovery .recovery_step:visible').find('.fa-check').show();
				$('#wyca_edit_map_modalRecovery .recovery_step:visible').find('.fa-pulse').hide();
				setTimeout(function(){
					$('.ifRecovery').hide();
					$('.ifNRecovery').show();
					$('#wyca_edit_map_modalRecovery .bRecovery').removeClass('disabled');
					success_wyca(textRecoveryDone);
					$('#wyca_edit_map_modalRecovery').modal('hide');
				},500)
			}
			else
			{
				$('.ifRecovery').hide();
				$('.ifNRecovery').show();
				$('#wyca_edit_map_modalRecovery .bRecovery').removeClass('disabled');
				ParseAPIAnswerError(data);
			}
			// On rebranche l'ancienne fonction
			wycaApi.on('onRecoveryFromFiducialResult', onRecoveryFromFiducialResult);
			wycaApi.on('onRecoveryFromFiducialFeedback', onRecoveryFromFiducialFeedback);
		});
		
		wycaApi.RecoveryFromFiducial(function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('.ifRecovery').show();
				$('.ifNRecovery').hide();
			}
			else
			{
				$('.ifRecovery').hide();
				$('.ifNRecovery').show();
				$('#wyca_edit_map_modalRecovery .bRecovery').removeClass('disabled');
				ParseAPIAnswerError(data);
			}
		});
    });
	
	$('#wyca_edit_map_modalRecovery .bCancelRecovery').click(function(e) {
		$('#wyca_edit_map_modalRecovery .bCancelRecovery').addClass('disabled');
		wycaApi.RecoveryFromFiducialCancel(function(data) {
			$('#wyca_edit_map_modalRecovery .bCancelRecovery').removeClass('disabled');
		})
	})
	
	/* BTN GOTOPOSE */
	
	$('#wyca_edit_map_menu .bMoveTo').click(function(e) {
        e.preventDefault();
		WycaHideMenus();
		if (wycaCanChangeMenu)
		{
			//CURRENT ACTION TARGET
			wycaCurrentAction = 'prepareGotoPose';
			wycaCanChangeMenu = false;
			//AJOUT ICON MENU + CROIX
			$('#wyca_edit_map .burger_menu').hide('fast');
			$('#wyca_edit_map .icon_menu[data-menu="wyca_edit_map_menu_gotopose"]').show('fast');
			setTimeout(function(){$('#wyca_edit_map .times_icon_menu').show('fast')},50);
			
			boolHelpGotoPose = getCookie('boolHelpGotoPoseI') != '' ? JSON.parse(getCookie('boolHelpGotoPoseI')) : true; // TRICK JSON.parse STR TO BOOL
			
			if(boolHelpGotoPose){
				$('#wyca_edit_map .modalHelpClickGotoPose').modal('show');
			}			
		}
		else
			WycaAvertCantChange();
		
    });
	
	$('#wyca_edit_map .bHelpClickGotoPoseOk').click(function(){boolHelpGotoPose = !$('#wyca_edit_map .checkboxHelpGotopose').prop('checked');setCookie('boolHelpGotoPoseI',boolHelpGotoPose);});//ADD SAVING BDD / COOKIES ?
		
	/* BTNS GOMME */
	
	$('#wyca_edit_map_menu .bGomme').click(function(e) {
        e.preventDefault();
		WycaHideMenus();
		/*
		if ($('#wyca_edit_map_bGomme').hasClass('btn-primary'))
		{
			blockZoom = false;
			
			WycaHideCurrentMenu();
			
			$('#wyca_edit_map_bGomme').removeClass('btn-primary');
		
			wycaCurrentAction = '';	
			currentStep = '';
			
			$('body').addClass('no_current');
			$('body').removeClass('gomme');
			
			//currentGommePoints = Array();
		
			WycaSaveElementNeeded(true);
		}
		else
		{
			*/
			blockZoom = true;
			
			if (wycaCanChangeMenu)
			{
				WycaHideCurrentMenu();
				WycaDisplayMenu('wyca_edit_map_menu_erase');
				sizeGomme = $('#wyca_edit_map_menu_erase .bGommeSize.selected').data('size');
				wycaCurrentAction = 'gomme';	
				currentStep = '';
				
				$('body').removeClass('no_current');
				$('body').addClass('gomme');
				
			}
			else
				WycaAvertCantChange();
		//}
    });
	
	$('#wyca_edit_map_menu_erase .bGommeSize').click(function(e) {
        e.preventDefault();
		$('#wyca_edit_map_menu_erase .bGommeSize').removeClass('selected');
		sizeGomme = $(this).data('size');
		$(this).addClass('selected');
		
    });
	
	/* BTN MENU FORBIDDEN */
	
	$('#wyca_edit_map_menu .bAddForbiddenArea').click(function(e) {
        e.preventDefault();
		WycaHideMenus();
		if (wycaCanChangeMenu)
		{
			
			//CURRENT ACTION TARGET
			wycaCurrentAction = 'prepareForbiddenArea';
			wycaCanChangeMenu = false;
			//AJOUT ICON MENU + CROIX
			$('#wyca_edit_map .burger_menu').hide('fast');
			$('#wyca_edit_map .icon_menu[data-menu="wyca_edit_map_menu_forbidden"]').show('fast');
			setTimeout(function(){$('#wyca_edit_map .times_icon_menu').show('fast')},50);
			
			boolHelpForbidden = getCookie('boolHelpForbiddenI') != '' ? JSON.parse(getCookie('boolHelpForbiddenI')) : true; // TRICK JSON.parse STR TO BOOL
			
			if(boolHelpForbidden){
				$('#wyca_edit_map .modalHelpClickForbidden').modal('show');
			}			
		}
		else
			WycaAvertCantChange();
	});
	
	$('#wyca_edit_map .bHelpClickForbiddenOk').click(function(){boolHelpForbidden = !$('#wyca_edit_map .checkboxHelpForbidden').prop('checked');setCookie('boolHelpForbiddenI',boolHelpForbidden);});//ADD SAVING BDD / COOKIES ?

	$('#wyca_edit_map_bForbiddenDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this area?'))
		{
			WycaDeleteForbidden(currentForbiddenIndex);
		}
    });
	
	/**************************/
	/*  Click on map	      */
	/**************************/
	$('#wyca_edit_map_svg').click(function(e){
		if(wycaCanChangeMenu == false){
			switch(wycaCurrentAction){
				case 'prepareForbiddenArea':
					//blockZoom = true;
					nextIdArea++;
					
					zoom = WycaGetZoom();
					p = $('#wyca_edit_map_svg image').position();
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
					WycaAddHistorique({'action':'add_forbidden', 'data':JSON.stringify(f)});
					
					forbiddens.push(f);
					WycaTraceForbidden(forbiddens.length-1);
					
					RemoveClass('#wyca_edit_map_svg .active', 'active');
					RemoveClass('#wyca_edit_map_svg .activ_select', 'activ_select'); 
					
					currentSelectedItem = Array();
					currentSelectedItem.push({'type':'forbidden', 'id':nextIdArea});	
					WycaHideCurrentMenuNotSelect();			
					
					$('#wyca_edit_map_boutonsForbidden').show();
					$('#wyca_edit_map_boutonsStandard').hide();
					
					$('#wyca_edit_map_boutonsForbidden #wyca_edit_map_bForbiddenDelete').show();
					
					$('body').removeClass('no_current select');
					$('.select').css("strokeWidth", minStokeWidth);
					
					currentForbiddenWycaLongTouch = $(this);
					//MENU FORBIDDEN DISPLAY
					if (wycaCurrentAction != 'editForbiddenArea' && wycaCurrentAction != 'addForbiddenArea')
					{
						WycaHideCurrentMenuNotSelect();
						WycaDisplayMenu('wyca_edit_map_menu_forbidden');
					}
					
					wycaCurrentAction = 'addForbiddenArea';
					currentStep = '';
					
					currentForbiddenIndex = GetForbiddenIndexFromID(nextIdArea);
					forbidden = forbiddens[currentForbiddenIndex];
					saveCurrentForbidden = JSON.stringify(forbidden);
					
					AddClass('#wyca_edit_map_svg .forbidden_elem_'+forbidden.id_area, 'active');
					
					WycaSaveElementNeeded(true);
					
					$('#wyca_edit_map_boutonsForbidden').show();
					$('#wyca_edit_map_boutonsStandard').hide();
					
					$('#wyca_edit_map_boutonsForbidden #wyca_edit_map_bForbiddenDelete').hide();
					
					wycaCurrentAction = 'addForbiddenArea';	
					currentStep = 'trace';
					
					$('body').removeClass('no_current');
					$('body').addClass('addForbidden');
					
					currentForbiddenPoints = Array();
					currentForbiddenPoints.push({x:0, y:0}); // Point du curseur
					
					
				break;
				
				case 'prepareArea':
							
					
					//blockZoom = true;
					nextIdArea++;
					zoom = WycaGetZoom();
					p = $('#wyca_edit_map_svg image').position();
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
					WycaAddHistorique({'action':'add_area', 'data':JSON.stringify(a)});
					
					areas.push(a);
					WycaTraceArea(areas.length-1);
					
					RemoveClass('#wyca_edit_map_svg .active', 'active');
					RemoveClass('#wyca_edit_map_svg .activ_select', 'activ_select'); 
					
					currentSelectedItem = Array();
					currentSelectedItem.push({'type':'area', 'id':nextIdArea});	
					WycaHideCurrentMenuNotSelect();			
					
					$('#wyca_edit_map_boutonsArea').show();
					$('#wyca_edit_map_boutonsStandard').hide();
					
					$('#wyca_edit_map_boutonsArea #wyca_edit_map_bAreaDelete').show();
					
					$('body').removeClass('no_current select');
					$('.select').css("strokeWidth", minStokeWidth);
					
					currentAreaWycaLongTouch = $(this);
					//MENU FORBIDDEN DISPLAY
					if (wycaCurrentAction != 'editArea' && wycaCurrentAction != 'addArea')
					{
						WycaHideCurrentMenuNotSelect();
						WycaDisplayMenu('wyca_edit_map_menu_area');
					}
					
					wycaCurrentAction = 'addArea';
					currentStep = '';
					
					currentAreaIndex = GetAreaIndexFromID(nextIdArea);
					area = areas[currentAreaIndex];
					saveCurrentArea = JSON.stringify(area);
					
					AddClass('#wyca_edit_map_svg .area_elem_'+area.id_area, 'active');
					
					WycaSaveElementNeeded(true);
				break;
				
				case 'prepareGotoPose':
					
					//WycaHideMenus();
					
					zoom = WycaGetZoom();
					p = $('#wyca_edit_map_svg image').position();
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
					
					xROSGotoPose = xRos;
					yROSGotoPose = yRos;
					$('#wyca_edit_map .modalGoToPose .GetPathOutcome').html('-')
					$('#wyca_edit_map_modalGoToPose_distance').val('-')
					wycaApi.GetPathFromCurrentPose(xROSGotoPose, yROSGotoPose,0,0,function(data){
						if (data.A == wycaApi.AnswerCode.NO_ERROR){
							$('#wyca_edit_map .modalGoToPose .GetPathOutcome').html(data.D.M)
							$('#wyca_edit_map_modalGoToPose_distance').val(data.D.D)
						}else{
							let text = wycaApi.AnswerCodeToString(data.A)+'<br>'+data.D.M;
							$('#wyca_edit_map .modalGoToPose .GetPathOutcome').html(text)
							$('#wyca_edit_map_modalGoToPose_distance').val('-')
						}
					})
					$('#wyca_edit_map .modalGoToPose').modal('show');
					
				break;
				
				default:
				
				break;			
			}
		}
	})
	
	/* BTN MODAL GOTOPOSE */
	
	$('#wyca_edit_map .GoToPoseAbort').click(function(e) {
		WycaHideCurrentMenu();
		$('#wyca_edit_map .modalGoToPose').modal('hide');
		$('#wyca_edit_map .modalGoToPoseFlexible').modal('hide');
	});
	
	$('#wyca_edit_map .modalGoToPose .GoToPoseNormal').click(function(e) {
		WycaGoToPose(0);
	});
	
	$('#wyca_edit_map .modalGoToPose .GoToPoseFlexible').click(function(e) {
		$('#wyca_edit_map .modalGoToPoseFlexible').modal('show');
		
	});
	
	$('#wyca_edit_map .modalGoToPoseFlexible .wyca_edit_map_bGoToPoseFlexible').click(function(e) {
		let aT = ($('#wyca_edit_map #wyca_edit_map_angular_tolerance').val())*1;
		let lT = ($('#wyca_edit_map #wyca_edit_map_linear_tolerance').val())*1;
		
		WycaGoToPose('F',lT,aT);
	});
	
	$('#wyca_edit_map .modalGoToPose .GoToPoseAccurate').click(function(e) {
		WycaGoToPose('A');
	});
	
	
	/* BTN MENU AREA */
	
	$('#wyca_edit_map_menu .bAddArea').click(function(e) {
        e.preventDefault();
		WycaHideMenus();
		if (wycaCanChangeMenu)
		{
			
			//CURRENT ACTION TARGET
			wycaCurrentAction = 'prepareArea';
			wycaCanChangeMenu = false;
			//AJOUT ICON MENU + CROIX
			$('#wyca_edit_map .burger_menu').hide('fast');
			$('#wyca_edit_map .icon_menu[data-menu="wyca_edit_map_menu_area"]').show('fast');
			setTimeout(function(){$('#wyca_edit_map .times_icon_menu').show('fast')},50);

			boolHelpArea = getCookie('boolHelpAreaI') != '' ? JSON.parse(getCookie('boolHelpAreaI')) : true; // TRICK JSON.parse STR TO BOOL
			
			if(boolHelpArea){
				$('#wyca_edit_map .modalHelpClickArea').modal('show');
			}
			
		}
		else
			WycaAvertCantChange();
	});
	
	$('#wyca_edit_map .bHelpClickAreaOk').click(function(){boolHelpArea = !$('#wyca_edit_map .checkboxHelpArea').prop('checked');setCookie('boolHelpAreaI',boolHelpArea);});//ADD SAVING BDD / COOKIES ?
	
	$('#wyca_edit_map_bAreaDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this area?'))
		{
			WycaDeleteArea(currentAreaIndex);
		}
    });
	
	$('#wyca_edit_map_bAreaOptions').click(function(e) {
        area = areas[currentAreaIndex];
		
		$('#wyca_edit_map_area_color_mode').val(rgbToHex(area.color_r, area.color_g, area.color_b));
		
		$('#wyca_edit_map_led_color_mode').val('Automatic');
		$('#wyca_edit_map_led_animation_mode').val('Automatic');
		$('#wyca_edit_map_max_speed_mode').val('Automatic');
		$('#wyca_edit_map_min_distance_obstacle_mode').val('Automatic');
		
		$.each(area.configs, function( indexConfig, config ) {
			switch(config.name)
			{
				case 'led_color_mode': $('#wyca_edit_map_led_color_mode').val(config.value); break;
				case 'led_color': $('#wyca_edit_map_led_color').val(config.value); $('#wyca_edit_map_led_color').keyup(); break;
				case 'led_animation_mode': $('#wyca_edit_map_led_animation_mode').val(config.value); break;
				case 'led_animation': $('#wyca_edit_map_led_animation').val(config.value); break;
				case 'max_speed_mode': $('#wyca_edit_map_max_speed_mode').val(config.value); break;
				case 'max_speed': $('#wyca_edit_map_max_speed').val(config.value); break;
				case 'min_distance_obstacle_mode': $('#wyca_edit_map_min_distance_obstacle_mode').val(config.value); break;
				case 'min_distance_obstacle': $('#wyca_edit_map_min_distance_obstacle').val(config.value*100); break;
				case 'sound': $('#wyca_edit_map_area_sound').val(config.value); break;
			}
		});
		
		if ($('#wyca_edit_map_led_color_mode').val() == 'Automatic') $('#wyca_edit_map_led_color_group').hide(); else  $('#wyca_edit_map_led_color_group').show();
		if ($('#wyca_edit_map_led_animation_mode').val() == 'Automatic') $('#wyca_edit_map_led_animation_group').hide(); else  $('#wyca_edit_map_led_animation_group').show();
		if ($('#wyca_edit_map_max_speed_mode').val() == 'Automatic') $('#wyca_edit_map_max_speed_group').hide(); else  $('#wyca_edit_map_max_speed_group').show();
		if ($('#wyca_edit_map_min_distance_obstacle_mode').val() == 'Automatic') 
			$('#wyca_edit_map_min_distance_obstacle_group').hide(); 
		else
			$('#wyca_edit_map_min_distance_obstacle_group').show();
    });
	
	$('#wyca_edit_map_bAreaSaveConfig').click(function(e) {
		area = areas[currentAreaIndex];
		saveCurrentArea = JSON.stringify(area);
			
		area.configs = Array();
		area.configs.push({'name':'led_color_mode' , 'value':$('#wyca_edit_map_led_color_mode').val()});
		
		if (parseInt($('#wyca_edit_map_min_distance_obstacle').val()) > 68) $('#wyca_edit_map_min_distance_obstacle').val(68);
		if (parseInt($('#wyca_edit_map_min_distance_obstacle').val()) < 5) $('#wyca_edit_map_min_distance_obstacle').val(5);
		
		area.configs.push({'name':'led_color' , 'value':$('#wyca_edit_map_led_color').val()});
		area.configs.push({'name':'led_animation_mode' , 'value':$('#wyca_edit_map_led_animation_mode').val()});
		area.configs.push({'name':'led_animation' , 'value':$('#wyca_edit_map_led_animation').val()});
		area.configs.push({'name':'max_speed_mode' , 'value':$('#wyca_edit_map_max_speed_mode').val()});
		area.configs.push({'name':'max_speed' , 'value':$('#wyca_edit_map_max_speed').val()});
		area.configs.push({'name':'min_distance_obstacle_mode' , 'value':$('#wyca_edit_map_min_distance_obstacle_mode').val()});
		area.configs.push({'name':'min_distance_obstacle' , 'value':$('#wyca_edit_map_min_distance_obstacle').val()/100});
		area.configs.push({'name':'sound' , 'value':$('#wyca_edit_map_area_sound').val()});		
		
		var c = '';
		if( $('#wyca_edit_map_area_color').val().includes('rgb') ){
			c = $('#wyca_edit_map_area_color').val().split("(")[1].split(")")[0];
			c = c.split(",");
			area.color_r = parseInt(c[0]);
			area.color_g = parseInt(c[1]);
			area.color_b = parseInt(c[2]);
		}else{
			c = hexToRgb($('#wyca_edit_map_area_color').val());
			area.color_r = c.r;
			area.color_g = c.g;
			area.color_b = c.b;
		}
		
		areas[currentAreaIndex] = area;
		
		if (wycaCurrentAction == 'editArea')
			WycaAddHistorique({'action':'edit_area', 'data':{'index':currentAreaIndex, 'old':saveCurrentArea, 'new':JSON.stringify(areas[currentAreaIndex])}});
		saveCurrentArea = JSON.stringify(areas[currentAreaIndex]);
		WycaTraceArea(currentAreaIndex);
	});
	
	/* BTN MENU DOCK */
	
	$('#wyca_edit_map_menu .bAddDock').click(function(e) {
        e.preventDefault();
		WycaHideMenus();
		if (wycaCanChangeMenu)
		{
			$('#wyca_edit_map_container_all .texts_add_dock').hide();
			$('#wyca_edit_map_container_all .text_prepare_robot').show();
			
			$('#wyca_edit_map_container_all .modalAddDock .dock').hide();
			$('#wyca_edit_map_container_all .modalAddDock .fiducial_number_wrapper ').html('');
			$('#wyca_edit_map_container_all .modalAddDock').modal('show');
		}
		else
			WycaAvertCantChange();
	});
	
	$('#wyca_edit_map_container_all .modalAddDock .joystickDiv .curseur').on('touchstart', function(e) {
		$('#wyca_edit_map_container_all .modalAddDock .dock').hide();
		$('#wyca_edit_map_container_all .modalAddDock .fiducial_number_wrapper ').html('');
	});
	
	$('#wyca_edit_map_container_all .modalAddDock .bScanAddDock').click(function(e) {
		$('#wyca_edit_map_container_all .modalAddDock .bScanAddDock').addClass('disabled');
		
		wycaApi.GetMapFiducialsVisible(function(data) {
			
			$('#wyca_edit_map_container_all .modalAddDock .bScanAddDock').removeClass('disabled');	
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				console.log(data);
				
				$('#wyca_edit_map_container_all .modalAddDock .dock').hide();
				
				posRobot = $('#wyca_edit_map_container_all .modalAddDock #wyca_edit_map_modalAddDock_robot').offset();
				
				let modalOffset = $('#wyca_edit_map_container_all .modalAddDock .modal-content').offset();
				
				posRobot.left -= modalOffset.left; 
				posRobot.top -= modalOffset.top; 
				
				$('#wyca_edit_map_container_all .texts_add_dock').hide();
				if (data.D.length > 0)
					$('#wyca_edit_map_container_all .text_set_dock').show();
				else
					$('#wyca_edit_map_container_all .text_prepare_robot').show();
				
				$('#wyca_edit_map_container_all .modalAddDock .fiducial_number_wrapper ').html('');
				
				for (i=0; i< data.D.length; i++)
				{
					if (data.D[i].TY == 'Dock' && data.D[i].ID != -1)
					{
						/*
						distance = Math.sqrt((data.D[i].P.X - lastRobotPose.X)*(data.D[i].P.X - lastRobotPose.X) + (data.D[i].P.Y - lastRobotPose.Y)*(data.D[i].P.Y - lastRobotPose.Y));
						x_from_robot = Math.cos(lastRobotPose.T) * distance;
						y_from_robot = Math.sin(lastRobotPose.T) * distance;
						*/
						
						new_point = RotatePoint (data.D[i].P, lastRobotPose, lastRobotPose.T - Math.PI/2);
						x_from_robot = new_point.X - lastRobotPose.X;
						y_from_robot = new_point.Y - lastRobotPose.Y;
						
						
						let x =  posRobot.left + x_from_robot * 100;
						let y =  posRobot.top - y_from_robot * 100;
						let xx = x + 10*Math.sin(0 - (data.D[i].P.T - lastRobotPose.T));
						let yy = y - 10*Math.cos(0 - (data.D[i].P.T - lastRobotPose.T));
						
						angle = 0 - (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
						
						// 1px / cm
						
						$('#wyca_edit_map_container_all .modalAddDock #wyca_edit_map_modalAddDock_dock'+i).show();
						$('#wyca_edit_map_container_all .modalAddDock #wyca_edit_map_modalAddDock_dock'+i).css('left', posRobot.left + x_from_robot * 100); // lidar : y * -1
						$('#wyca_edit_map_container_all .modalAddDock #wyca_edit_map_modalAddDock_dock'+i).css('top', posRobot.top - y_from_robot * 100); // +20 position lidar, - 12.5 pour le centre
						//angle = (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
												
						$('#wyca_edit_map_container_all .modalAddDock #wyca_edit_map_modalAddDock_dock'+i).css({'-webkit-transform' : 'rotate('+ angle +'deg)',
																	 '-moz-transform' : 'rotate('+ angle +'deg)',
																	 '-ms-transform' : 'rotate('+ angle +'deg)',
																	 'transform' : 'rotate('+ angle +'deg)'});
						
						$('#wyca_edit_map_container_all .modalAddDock .fiducial_number_wrapper ').append('<span class="fiducial_number" id="fiducial_number'+i+'" data-id="'+data.D[i].ID+'">'+data.D[i].ID+'</span>');
						
						$('#wyca_edit_map_container_all .modalAddDock #fiducial_number'+i).css('left',xx); // lidar : y * -1
						$('#wyca_edit_map_container_all .modalAddDock #fiducial_number'+i).css('top',yy); // 
						$('#wyca_edit_map_container_all .modalAddDock #fiducial_number'+i).css({'-webkit-transform' : 'rotate('+ angle +'deg)',
																	 '-moz-transform' : 'rotate('+ (angle-180) +'deg)',
																	 '-ms-transform' : 'rotate('+ (angle-180) +'deg)',
																	 'transform' : 'rotate('+ (angle-180) +'deg)'});
																	 
						$('#wyca_edit_map_container_all .modalAddDock #wyca_edit_map_modalAddDock_dock'+i).data('id_fiducial', data.D[i].ID);
						$('#wyca_edit_map_container_all .modalAddDock #wyca_edit_map_modalAddDock_dock'+i).data('x', data.D[i].P.X);
						$('#wyca_edit_map_container_all .modalAddDock #wyca_edit_map_modalAddDock_dock'+i).data('y', data.D[i].P.Y);
						$('#wyca_edit_map_container_all .modalAddDock #wyca_edit_map_modalAddDock_dock'+i).data('theta', data.D[i].P.T);
					}
				}
			}
			else
			{
				ParseAPIAnswerError(data,textErrorGetFiducials);
			}
		});
    });
	
	$('#wyca_edit_map_container_all .modalAddDock .dock').click(function(e) {
        e.preventDefault();
		that = $(this);
		
		distance_centre_robot_fiducial = 0.26;
		distance_approche_robot_fiducial = 0.76;
		
		final_pose_x = $(this).data('x') + Math.cos($(this).data('theta')) * distance_centre_robot_fiducial;
		final_pose_y = $(this).data('y') + Math.sin($(this).data('theta')) * distance_centre_robot_fiducial;
		final_pose_t = $(this).data('theta') + Math.PI;
				
		approch_pose_x = $(this).data('x') + Math.cos($(this).data('theta')) * distance_approche_robot_fiducial;
		approch_pose_y = $(this).data('y') + Math.sin($(this).data('theta')) * distance_approche_robot_fiducial;
		approch_pose_t = $(this).data('theta') + Math.PI;
		
		wycaApi.CheckPosition(approch_pose_x, approch_pose_y, function(data)
		{
			if (data.A == wycaApi.AnswerCode.NO_ERROR && data.D)
			{
				nextIdDock++;
		
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
				d = {'id_docking_station':nextIdDock, 'id_map':id_map, 'id_fiducial':that.data('id_fiducial'), 'final_pose_x':final_pose_x, 'final_pose_y':final_pose_y, 'final_pose_t':final_pose_t, 'approch_pose_x':approch_pose_x, 'approch_pose_y':approch_pose_y, 'approch_pose_t':approch_pose_t, 'num':parseInt(num), 'fiducial_pose_x':that.data('x'), 'fiducial_pose_y':that.data('y'), 'fiducial_pose_t':that.data('theta'), 'name':'Dock '+num, 'comment':'', 'undock_path':[{'linear_distance':-0.4, 'angular_distance':0}], 'is_master':dock_master};
				WycaAddHistorique({'action':'add_dock', 'data':JSON.stringify(d)});
				docks.push(d);
				WycaTraceDock(docks.length-1);
				
				$('#wyca_edit_map_container_all .modalAddDock').modal('hide');
				
				currentDockIndex = docks.length-1;
				dock = docks[currentDockIndex];
				
				$('#wyca_edit_map_dock_name').val(dock.name);
				$('#wyca_edit_map_dock_fiducial_number').val(dock.id_fiducial);
				$('#wyca_edit_map_dock_comment').val(dock.comment);
				$('#wyca_edit_map_dock_number').val(dock.num);
				$('#wyca_edit_map_dock_is_master').prop('checked', dock.is_master);
				
				
				$('#wyca_edit_map_container_all .modalDockOptions .list_undock_procedure li').remove();
				
				indexDockElem++;
				
				$('#wyca_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
					'<li id="wyca_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="move" data-distance="-0.4">'+
					'	<span>'+(typeof(textUndockPathMove) != 'undefined' ? textUndockPathMove : 'Move') + ' ' + (typeof(textUndockPathback) != 'undefined' ? textUndockPathback : 'back') + ' ' + '0.4' + 'm</span>'+
					'	<a href="#" class="bWycaUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bWycaUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
				$('#wyca_edit_map_container_all .modalDockOptions #wyca_edit_map_bDockCancelConfig').addClass('disabled');
				$('#wyca_edit_map_container_all .modalDockOptions').modal('show');
			}
			else
			{
				if (data.A != wycaApi.AnswerCode.NO_ERROR)
				{
					ParseAPIAnswerError(data,textErrorCheckPosition);
				}
				else
				{
					alert_wyca(textInvalidPositionDock);
				}
			}
		})
    });
	
	$('#wyca_edit_map_bDockSaveConfig').click(function(e) {
		if(!CheckName(docks, $('#wyca_edit_map_dock_name').val(), currentDockIndex)){
			firstAction = $('#wyca_edit_map_container_all .modalDockOptions .list_undock_procedure li').first();
			if (firstAction.data('action') == 'rotate')
			{
				e.preventDefault();
				alert_wyca(textNoStartRotation);
			}
			else if (firstAction.data('action') != 'rotate' && firstAction.data('distance') > 0)
			{
				e.preventDefault();
				alert_wyca(textNoStartMovingFoward);
			}
			else
			{
				dock = docks[currentDockIndex];
				saveCurrentDock = JSON.stringify(dock);
						
				dock.name = $('#wyca_edit_map_dock_name').val();
				dock.num = parseInt($('#wyca_edit_map_dock_number').val());
				dock.comment = $('#wyca_edit_map_dock_comment').val();
				if ($('#wyca_edit_map_dock_is_master').prop('checked'))
				{
					// Désactive les autres
					$.each(docks, function( index, dock ) {
						dock.is_master = false;
					});
				}
				dock.is_master = $('#wyca_edit_map_dock_is_master').prop('checked');
					
				dock.undock_path = Array();
				
				$('#wyca_edit_map_container_all .modalDockOptions .list_undock_procedure li').each(function(index, element) {
					if ($(this).data('action') == 'rotate')
					{
						angle_rad = parseFloat($(this).data('angle')) * Math.PI/180;
						dock.undock_path.push({'linear_distance':0, 'angular_distance':angle_rad});
					}
					else
						dock.undock_path.push({'linear_distance':$(this).data('distance'), 'angular_distance':0});
				});
				
				docks[currentDockIndex] = dock;
						
				if (wycaCurrentAction == 'editDock')
					WycaAddHistorique({'action':'edit_dock', 'data':{'index':currentDockIndex, 'old':saveCurrentDock, 'new':JSON.stringify(docks[currentDockIndex])}});
				saveCurrentDock = JSON.stringify(docks[currentDockIndex]);
				WycaTraceDock(currentDockIndex);
				
				$('#wyca_edit_map_container_all .modalDockOptions').modal('hide');
				$('#wyca_edit_map_container_all .modalDockOptions #wyca_edit_map_bDockCancelConfig').removeClass('disabled');
			}
		}else{
			alert_wyca(textNameUsed);
		};
	});
	
	$('#wyca_edit_map_container_all .modalDockOptions .bWycaUndockProcedureAddElem').click(function(e) {
        e.preventDefault();
		
		$('#wyca_edit_map_up_elem_action_move').prop('checked', false);
		$('#wyca_edit_map_up_elem_action_rotate').prop('checked', false);
		
		$('#wyca_edit_map_up_elem_direction_back').prop('checked', true);
		$('#wyca_edit_map_container_all .up_elem_action_move').hide();
		$('#wyca_edit_map_container_all .up_elem_action_rotate').hide();
		
		$('#wyca_edit_map_container_all .modalDockElemOptions').data('index_dock_procedure', -1);
		
		$('#wyca_edit_map_container_all .modalDockElemOptions').modal('show');
    });
	
	$('#wyca_edit_map_container_all .modalDockElemOptions input:radio[name="up_elem_action"]').change(function () {
		action = $("#wyca_edit_map_container_all input[name='up_elem_action']:checked").val()
		$('#wyca_edit_map_container_all .up_elem_action_move').hide();
		$('#wyca_edit_map_container_all .up_elem_action_rotate').hide();
		if (action == 'move') {
			
			$('#wyca_edit_map_container_all .up_elem_action_move').show();
		}
		else if (action == 'rotate') {
			$('#wyca_edit_map_container_all .up_elem_action_rotate').show();
		}
	});
		
	$('#wyca_edit_map_container_all .modalDockElemOptions .bDockElemSave').click(function(e) {
		
		index_dock_procedure = $('#wyca_edit_map_container_all .modalDockElemOptions').data('index_dock_procedure');
		if (index_dock_procedure == -1)
		{
			indexDockElem++;
			
			action = $("#wyca_edit_map_container_all input[name='up_elem_action']:checked").val();
			
			if (action == 'move') {
				
				distance = parseFloat($("#wyca_edit_map_up_elem_move_distance").val());
				direction = $("#wyca_edit_map_container_all input[name='up_elem_direction']:checked").val();
							
				$('#wyca_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
					'<li id="wyca_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="move" data-distance="' + ((direction == 'back')?distance*-1:distance) + '">'+
					'	<span>' + (typeof(textUndockPathMove) != 'undefined' ? textUndockPathMove : 'Move') +' '+ ((direction == 'back')?(typeof(textUndockPathback) != 'undefined' ? textUndockPathback : 'back'):(typeof(textUndockPathfront) != 'undefined' ? textUndockPathfront : 'front')) + ' ' + distance + 'm</span>'+
					'	<a href="#" class="bWycaUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bWycaUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
			else if (action == 'rotate') {
				
				angle = $("#wyca_edit_map_up_elem_rotate_angle").val();
				
				$('#wyca_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
					'<li id="wyca_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="rotate" data-angle="'+angle+'">'+
					'	<span>' + (typeof(textUndockPathRotate) != 'undefined' ? textUndockPathRotate : 'Rotate') +' '+angle+'°</span>'+
					'	<a href="#" class="bWycaUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bWycaUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
		}
		else
		{
			action = $("#wyca_edit_map_container_all input[name='up_elem_action']:checked").val();
			if (action == 'move') {
				
				distance = parseFloat($("#wyca_edit_map_up_elem_move_distance").val());
				direction = $("#wyca_edit_map_container_all input[name='up_elem_direction']:checked").val();
				
				li = $('#wyca_edit_map_list_undock_procedure_elem_'+ index_dock_procedure);
				span = $('#wyca_edit_map_list_undock_procedure_elem_'+ index_dock_procedure + ' span');
				
				li.data('action', 'move');
				li.data('distance', ((direction == 'back')?distance*-1:distance));
				span.html((typeof(textUndockPathMove) != 'undefined' ? textUndockPathMove : 'Move') + ' ' + ((direction == 'back')?(typeof(textUndockPathback) != 'undefined' ? textUndockPathback : 'back'):(typeof(textUndockPathfront) != 'undefined' ? textUndockPathfront : 'front')) + ' ' + distance + 'm');
			}
			else if (action == 'rotate') {
				
				angle = $("#wyca_edit_map_up_elem_rotate_angle").val();
				
				li = $('#wyca_edit_map_list_undock_procedure_elem_'+ index_dock_procedure);
				span = $('#wyca_edit_map_list_undock_procedure_elem_'+ index_dock_procedure + ' span');
				
				li.data('action', 'rotate');
				li.data('angle', angle);
				span.html((typeof(textUndockPathRotate) != 'undefined' ? textUndockPathRotate : 'Rotate') +' '+angle+'°');
			}
		}
    });
	
	$(document).on('click', '#wyca_edit_map_container_all .modalDockOptions .bWycaUndockProcedureDeleteElem', function(e) {
		e.preventDefault();
		
		$(this).closest('li').remove();
	});
	
	$(document).on('click', '#wyca_edit_map_container_all .modalDockOptions .bWycaUndockProcedureEditElem', function(e) {
		e.preventDefault();
		
		$('#wyca_edit_map_up_elem_action_move').prop('checked', false);
		$('#wyca_edit_map_up_elem_action_rotate').prop('checked', false);
		
		$('#wyca_edit_map_container_all .up_elem_action_move').hide();
		$('#wyca_edit_map_container_all .up_elem_action_rotate').hide();
		
		li = $(this).closest('li');
		if (li.data('action') == 'rotate')
		{
			$('#wyca_edit_map_container_all .up_elem_action_rotate').show();
			$('#wyca_edit_map_up_elem_action_rotate').prop('checked', true);
			$("#wyca_edit_map_up_elem_rotate_angle").val(li.data('angle'));
		}
		else
		{
			$('#wyca_edit_map_container_all .up_elem_action_move').show();
			$('#wyca_edit_map_up_elem_action_move').prop('checked', true);
			distance = li.data('distance');
			if (distance < 0)
				$('#wyca_edit_map_up_elem_direction_back').prop('checked', true);
			else
				$('#wyca_edit_map_up_elem_direction_front').prop('checked', true);
			
			$("#wyca_edit_map_up_elem_move_distance").val(Math.abs(distance));
		}
		
		
		$('#wyca_edit_map_container_all .modalDockElemOptions').data('index_dock_procedure', li.data('index_dock_procedure'));
		
		$('#wyca_edit_map_container_all .modalDockElemOptions').modal('show');
		
	});
		
	$('#wyca_edit_map_bDockCreateFromMap').click(function(e) {
        if (wycaCanChangeMenu)
		{
			blockZoom = true;
			
			$('#wyca_edit_map_boutonsDock').show();
            $('#wyca_edit_map_boutonsStandard').hide();
			
			$('#wyca_edit_map_boutonsDock #wyca_edit_map_bDockSave').hide();
			$('#wyca_edit_map_boutonsDock #wyca_edit_map_bDockDelete').hide();
			$('#wyca_edit_map_boutonsDock #wyca_edit_map_bDockDirection').hide();
			
			wycaCurrentAction = 'addDock';	
			currentStep = 'setPose';
			
			$('body').removeClass('no_current');
			$('body').addClass('addDock');
			
			$('#wyca_edit_map_message_aide').html(textClickOnMapPose);
			$('#wyca_edit_map_message_aide').show();
		}
		else
			WycaAvertCantChange();
    });
	
	$('#wyca_edit_map_bDockDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this docking station?'))
		{
			WycaDeleteDock(currentDockIndex);
		}
    });
	
	$('#wyca_edit_map_bDockDirection').click(function(e) {
        e.preventDefault();
		
		if ($('#wyca_edit_map_boutonsRotate').is(':visible'))
		{
			$('#wyca_edit_map_boutonsRotate').hide();
		}
		else
		{
			dock = docks[currentDockIndex];
			
			//zoom = ros_largeur / $('#wyca_edit_map_svg').width() / window.panZoom.getZoom();
			zoom = WycaGetZoom();		
			p = $('#wyca_edit_map_svg image').position();
			
			
			x = dock.approch_pose_x * 100 / 5;
			y = dock.approch_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#wyca_edit_map_boutonsRotate').css('left', x - $('#wyca_edit_map_boutonsRotate').width()/2);
			$('#wyca_edit_map_boutonsRotate').css('top', y - 60);
			$('#wyca_edit_map_boutonsRotate').show();
		}
	});
	
	/* BTN MENU POI */
	
	$('#wyca_edit_map_menu .bAddPOI').click(function(e) {
        e.preventDefault();
		WycaHideMenus();
		if (wycaCanChangeMenu)
		{
			$('#wyca_edit_map_container_all .modalAddPoi').modal('show');
		}
		else
			WycaAvertCantChange();
	});
	
	$('#wyca_edit_map_container_all .modalAddPoi #wyca_edit_map_bModalAddPoiSave').click(function(e) {
        e.preventDefault();
		
		wycaApi.CheckPosition(lastRobotPose.X, lastRobotPose.Y, function(data)
		{
			if (data.A == wycaApi.AnswerCode.NO_ERROR && data.D)
			{
				nextIdPoi++;
				poi_temp_add = {'id_poi':nextIdPoi, 'id_map':id_map, 'final_pose_x':lastRobotPose.X, 'final_pose_y':lastRobotPose.Y, 'final_pose_t':lastRobotPose.T, 'name':'POI', 'comment':'', 'color':'', 'icon':'', 'active':true};
				
				WycaAddHistorique({'action':'add_poi', 'data':JSON.stringify(poi_temp_add)});
				pois.push(poi_temp_add);
				WycaTracePoi(pois.length-1);
						
				$('#wyca_edit_map_container_all .modalAddPoi').modal('hide');
				
				currentPoiIndex = pois.length-1;
				poi = pois[currentPoiIndex];
				
				$('#wyca_edit_map_poi_name').val(poi.name);
				$('#wyca_edit_map_poi_comment').val(poi.comment);
				
				$('#wyca_edit_map_container_all .modalPoiOptions').modal('show');
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
				
				$('#wyca_edit_map_container_all .modalAddPoi').modal('show');
			}
		});
		
		
    });
	
	$('#wyca_edit_map_bPoiSaveConfig').click(function(e) {
		
		if(!CheckName(pois, $('#wyca_edit_map_poi_name').val(), currentPoiIndex)){
			poi = pois[currentPoiIndex];
			saveCurrentPoi = JSON.stringify(poi);
			
			poi.name = $('#wyca_edit_map_poi_name').val();
			poi.comment = $('#wyca_edit_map_poi_comment').val();
			pois[currentPoiIndex] = poi;
			
			$('#wyca_edit_map_bPoiCancelConfig').show();
					
			if (wycaCurrentAction == 'editPoi')
				WycaAddHistorique({'action':'edit_poi', 'data':{'index':currentPoiIndex, 'old':saveCurrentPoi, 'new':JSON.stringify(pois[currentPoiIndex])}});
			saveCurrentPoi = JSON.stringify(pois[currentPoiIndex]);
			WycaTracePoi(currentPoiIndex);
			$('#wyca_edit_map .modal.modalPoiOptions').modal('hide');			
		}else{
			alert_wyca(textNameUsed);
		};
		
	});
	
	$('#wyca_edit_map_bPoiCreateFromPose').click(function(e) {
		nextIdPoi++;
		p = {'id_poi':nextIdPoi, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':lastRobotPose.x, 'final_pose_y':lastRobotPose.y, 'final_pose_t':lastRobotPose.theta, 'approch_pose_x':lastRobotPose.x, 'approch_pose_y':lastRobotPose.y, 'approch_pose_t':lastRobotPose.theta, 'fiducial_pose_x':0, 'fiducial_pose_y':0, 'fiducial_pose_t':0, 'name':'POI', 'comment':'', 'color':'', 'icon':'', 'active':true};
		WycaAddHistorique({'action':'add_poi', 'data':JSON.stringify(p)});
        pois.push(p);
		WycaTracePoi(pois.length-1);
		
		RemoveClass('#wyca_edit_map_svg .active', 'active');
		RemoveClass('#wyca_edit_map_svg .activ_select', 'activ_select'); 
		RemoveClass('#wyca_edit_map_svg .poi_elem', 'movable');
					
		currentSelectedItem = Array();
		currentSelectedItem.push({'type':'poi', 'id':$(this).data('id_poi')});	
		WycaHideCurrentMenuNotSelect();
		
		$('#wyca_edit_map_boutonsPoi').show();
		
		$('#wyca_edit_map_boutonsStandard').hide();
		
		$('#wyca_edit_map_boutonsPoi a').show();
		
		$('body').removeClass('no_current select');
		$('.select').css("strokeWidth", minStokeWidth);
		
		wycaCurrentAction = 'editPoi';	
		currentStep = '';
		
		currentPoiIndex = GetPoiIndexFromID(nextIdPoi);
		poi = pois[currentPoiIndex];
		saveCurrentPoi = JSON.stringify(poi);
		
		AddClass('#wyca_edit_map_svg .poi_elem_'+nextIdPoi, 'active');
		AddClass('#wyca_edit_map_svg .poi_elem_'+nextIdPoi, 'movable');
		
		$('#wyca_edit_map_bPoiEditName').click();
        
    });
	
	$('#wyca_edit_map_bPoiCreateFromMap').click(function(e) {
        if (wycaCanChangeMenu)
		{
			blockZoom = true;
			
			$('#wyca_edit_map_boutonsPoi').show();
            $('#wyca_edit_map_boutonsStandard').hide();
			
			$('#wyca_edit_map_boutonsPoi #wyca_edit_map_bPoiSave').hide();
			$('#wyca_edit_map_boutonsPoi #wyca_edit_map_bPoiDelete').hide();
			$('#wyca_edit_map_boutonsPoi #wyca_edit_map_bPoiDirection').hide();
			$('#wyca_edit_map_boutonsPoi #wyca_edit_map_bPoiEditName').hide();
			
			wycaCurrentAction = 'addPoi';	
			currentStep = 'setPose';
			
			$('body').removeClass('no_current');
			$('body').addClass('addPoi');
			
			$('#wyca_edit_map_message_aide').html(textClickOnMapPose);
			$('#wyca_edit_map_message_aide').show();
		}
		else
			WycaAvertCantChange();
    });
	
	$('#wyca_edit_map_bPoiEditSaveConfig').click(function(e) {
		if (wycaCurrentAction == 'addPoi')
		{
			WycaSaveElementNeeded(false);
			
			nextIdPoi++;
			p = {'id_poi':nextIdPoi, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':currentPoiPose.final_pose_x, 'final_pose_y':currentPoiPose.final_pose_y, 'final_pose_t':currentPoiPose.final_pose_t, 'approch_pose_x':currentPoiPose.approch_pose_x, 'approch_pose_y':currentPoiPose.approch_pose_y, 'approch_pose_t':currentPoiPose.approch_pose_t, 'fiducial_pose_x':currentPoiPose.fiducial_pose_x, 'fiducial_pose_y':currentPoiPose.fiducial_pose_y, 'fiducial_pose_t':currentPoiPose.fiducial_pose_t, 'name':$('#wyca_edit_map_poi_name').val(), 'comment':'', 'icon':'', 'color':'', 'icon':'', 'active':true};
			WycaAddHistorique({'action':'add_poi', 'data':JSON.stringify(p)});
			
			pois.push(p);
			WycaTracePoi(pois.length-1);
			
			$('#wyca_edit_map_svg .poi_elem_current').remove();
			
			RemoveClass('#wyca_edit_map_svg .active', 'active');
			
			wycaCurrentAction = '';
			currentStep = '';
			
			$('#wyca_edit_map_boutonsRotate').hide();
			
			$('#wyca_edit_map_boutonsPoi').hide();
			$('#wyca_edit_map_boutonsStandard').show();
			$('#wyca_edit_map_message_aide').hide();
			blockZoom = false;
			
			$('body').addClass('no_current');
			
			WycaSetModeSelect();
			
			
		}
		else
		{
			poi = pois[currentPoiIndex];
			poi.name = $('#wyca_edit_map_poi_name').val();
			if (poi.name == '') poi.name = 'POI';
		}
		
	});
	
	$('#wyca_edit_map_bPoiDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this POI?'))
		{
			WycaDeletePoi(currentPoiIndex);
		}
    });
	
	$('#wyca_edit_map_bPoiEditName').click(function(e) {
   		poi = pois[currentPoiIndex];
		$('#wyca_edit_map_poi_name').val(poi.name);
	});
	
	$('#wyca_edit_map_bPoiDirection').click(function(e) {
        e.preventDefault();
		
		if ($('#wyca_edit_map_boutonsRotate').is(':visible'))
		{
			$('#wyca_edit_map_boutonsRotate').hide();
		}
		else
		{
			poi = pois[currentPoiIndex];
			
			//zoom = ros_largeur / $('#wyca_edit_map_svg').width() / window.panZoom.getZoom();
			zoom = WycaGetZoom();		
			p = $('#wyca_edit_map_svg image').position();
			
			x = poi.approch_pose_x * 100 / 5;
			y = poi.approch_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#wyca_edit_map_boutonsRotate').css('left', x - $('#wyca_edit_map_boutonsRotate').width()/2);
			$('#wyca_edit_map_boutonsRotate').css('top', y - 60);
			$('#wyca_edit_map_boutonsRotate').show();
		}
	});
	
	/* BTN MENU AUGMENTED POSE */
	
	$('#wyca_edit_map_menu .bAddAugmentedPose').click(function(e) {
        e.preventDefault();
		WycaHideMenus();
		if (wycaCanChangeMenu)
		{
			$('#wyca_edit_map_container_all .modalAddAugmentedPose .augmented_pose').hide();
			$('#wyca_edit_map_container_all .modalAddAugmentedPose .fiducial_number_wrapper ').html('');
			$('#wyca_edit_map_container_all .texts_add_augmented_pose').hide();
			$('#wyca_edit_map_container_all .text_prepare_approch').show();
			currentStepAddAugmentedPose = 'set_approch';
			
			$('#wyca_edit_map_container_all .modalAddAugmentedPose').modal('show');
		}
		else
			WycaAvertCantChange();
	});
	
	$('#wyca_edit_map_container_all .modalAddAugmentedPose .joystickDiv .curseur').on('touchstart', function(e) {
		$('#wyca_edit_map_container_all .modalAddAugmentedPose .augmented_pose').hide();
		$('#wyca_edit_map_container_all .modalAddAugmentedPose .fiducial_number_wrapper ').html('');
	});
	
	$('#wyca_edit_map_container_all .modalAddAugmentedPose .bScanAddAugmentedPose').click(function(e) {
		$('#wyca_edit_map_container_all .modalAddAugmentedPose .bScanAddAugmentedPose').addClass('disabled');
		
		wycaApi.GetMapFiducialsVisible(function(data) {
			
			$('#wyca_edit_map_container_all .modalAddAugmentedPose .bScanAddAugmentedPose').removeClass('disabled');	
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				console.log(data);
				
				$('#wyca_edit_map_container_all .modalAddAugmentedPose .augmented_pose').hide();
				
				posRobot = $('#wyca_edit_map_container_all .modalAddAugmentedPose #wyca_edit_map_modalAddAugmentedPose_robot').offset();
				
				let modalOffset = $('#wyca_edit_map_container_all .modalAddAugmentedPose .modal-content').offset();
				
				posRobot.left -= modalOffset.left; 
				posRobot.top -= modalOffset.top; 
				
				if (data.D.length > 0)
				{
					$('#wyca_edit_map_container_all .texts_add_augmented_pose').hide();
					if (currentStepAddAugmentedPose != 'set_final')
						$('#wyca_edit_map_container_all .text_set_approch').show();
					else
						$('#wyca_edit_map_container_all .text_set_final').show();
				}
				$('#wyca_edit_map_container_all .modalAddAugmentedPose .fiducial_number_wrapper ').html('');
				for (i=0; i< data.D.length; i++)
				{
					if (data.D[i].TY != 'Dock' && data.D[i].ID != -1)
					{
						if (currentStepAddAugmentedPose == 'set_approch' || augmented_pose_temp_add.id_fiducial == data.D[i].ID)
						{
							new_point = RotatePoint (data.D[i].P, lastRobotPose, lastRobotPose.T - Math.PI/2);
							x_from_robot = new_point.X - lastRobotPose.X;
							y_from_robot = new_point.Y - lastRobotPose.Y;
							
							let x =  posRobot.left + x_from_robot * 100;
							let y =  posRobot.top - y_from_robot * 100;
							let xx = x + 10*Math.sin(0 - (data.D[i].P.T - lastRobotPose.T));
							let yy = y - 10*Math.cos(0 - (data.D[i].P.T - lastRobotPose.T));
							
							angle = 0 - (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
							
							// 1px / cm
							
							//FIDUCIAL
							$('#wyca_edit_map_container_all .modalAddAugmentedPose #wyca_edit_map_modalAddAugmentedPose_augmented_pose'+i).show();
							$('#wyca_edit_map_container_all .modalAddAugmentedPose #wyca_edit_map_modalAddAugmentedPose_augmented_pose'+i).css('left', posRobot.left + x_from_robot * 100); // lidar : y * -1
							$('#wyca_edit_map_container_all .modalAddAugmentedPose #wyca_edit_map_modalAddAugmentedPose_augmented_pose'+i).css('top', posRobot.top - y_from_robot * 100); // +20 position lidar, - 12.5 pour le centre
							//angle = (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
														
							$('#wyca_edit_map_container_all .modalAddAugmentedPose #wyca_edit_map_modalAddAugmentedPose_augmented_pose'+i).css({'-webkit-transform' : 'rotate('+ angle +'deg)',
																	 '-moz-transform' : 'rotate('+ angle +'deg)',
																	 '-ms-transform' : 'rotate('+ angle +'deg)',
																	 'transform' : 'rotate('+ angle +'deg)'});
							
							$('#wyca_edit_map_container_all .modalAddAugmentedPose .fiducial_number_wrapper ').append('<span class="fiducial_number" id="fiducial_number'+i+'" data-id="'+data.D[i].ID+'">'+data.D[i].ID+'</span>');
							
							$('#wyca_edit_map_container_all .modalAddAugmentedPose #fiducial_number'+i).css('left',xx); // lidar : y * -1
							$('#wyca_edit_map_container_all .modalAddAugmentedPose #fiducial_number'+i).css('top',yy); // 
							$('#wyca_edit_map_container_all .modalAddAugmentedPose #fiducial_number'+i).css({'-webkit-transform' : 'rotate('+ angle +'deg)',
																	 '-moz-transform' : 'rotate('+ (angle-180) +'deg)',
																	 '-ms-transform' : 'rotate('+ (angle-180) +'deg)',
																	 'transform' : 'rotate('+ (angle-180) +'deg)'});
							
							$('#wyca_edit_map_container_all .modalAddAugmentedPose #wyca_edit_map_modalAddAugmentedPose_augmented_pose'+i).data('id_fiducial', data.D[i].ID);
							$('#wyca_edit_map_container_all .modalAddAugmentedPose #wyca_edit_map_modalAddAugmentedPose_augmented_pose'+i).data('x', data.D[i].P.X);
							$('#wyca_edit_map_container_all .modalAddAugmentedPose #wyca_edit_map_modalAddAugmentedPose_augmented_pose'+i).data('y', data.D[i].P.Y);
							$('#wyca_edit_map_container_all .modalAddAugmentedPose #wyca_edit_map_modalAddAugmentedPose_augmented_pose'+i).data('theta', data.D[i].P.T);
						}
					}
				}
			}
			else
			{
				ParseAPIAnswerError(data,textErrorGetFiducials);
			}
		});
    });
	
	$('#wyca_edit_map_container_all .modalAddAugmentedPose .augmented_pose').click(function(e) {
        e.preventDefault();
		$('#wyca_edit_map_container_all .modalAddAugmentedPose .fiducial_number_wrapper ').html('');
		
		if (currentStepAddAugmentedPose == 'set_approch')
		{
			that = $(this);
			
			wycaApi.CheckPosition(lastRobotPose.X, lastRobotPose.Y, function(data)
			{
				if (data.A == wycaApi.AnswerCode.NO_ERROR && data.D)
				{
			
					nextIdAugmentedPose++;
					
					augmented_pose_temp_add = {'id_augmented_pose':nextIdAugmentedPose, 'id_map':id_map, 'id_fiducial':that.data('id_fiducial'), 'fiducial_pose_x':that.data('x'), 'fiducial_pose_y':that.data('y'), 'fiducial_pose_t':that.data('theta'), 'final_pose_x':lastRobotPose.X, 'final_pose_y':lastRobotPose.Y, 'final_pose_t':lastRobotPose.T, 'approch_pose_x':lastRobotPose.X, 'approch_pose_y':lastRobotPose.Y, 'approch_pose_t':lastRobotPose.T, 'name':'Augmented pose', 'comment':'', 'color':'', 'icon':'', 'active':true};
					
					$('#wyca_edit_map_container_all .modalAddAugmentedPose .augmented_pose').hide();
					
					currentStepAddAugmentedPose = 'set_final';
					$('#wyca_edit_map_container_all .texts_add_augmented_pose').hide();
					$('#wyca_edit_map_container_all .text_prepare_final').show();
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
			})
		}
		else
		{
			augmented_pose_temp_add.final_pose_x = lastRobotPose.X;
			augmented_pose_temp_add.final_pose_y = lastRobotPose.Y;
			augmented_pose_temp_add.final_pose_t = lastRobotPose.T;
			
			WycaAddHistorique({'action':'add_augmented_pose', 'data':JSON.stringify(augmented_pose_temp_add)});
			augmented_poses.push(augmented_pose_temp_add);
			WycaTraceAugmentedPose(augmented_poses.length-1);
					
			$('#wyca_edit_map_container_all .modalAddAugmentedPose').modal('hide');
			
			currentAugmentedPoseIndex = augmented_poses.length-1;
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			
			$('#wyca_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose li').remove();
			
			$('#wyca_edit_map_augmented_pose_name').val(augmented_pose.name);
			$('#wyca_edit_map_augmented_pose_fiducial_number').val(augmented_pose.id_fiducial);
			$('#wyca_edit_map_augmented_pose_comment').val(augmented_pose.comment);
			
			
			indexAugmentedPoseElem++;
			
			$('#wyca_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
				'<li id="wyca_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="move" data-distance="-0.4">'+
				'	<span>'+(typeof(textUndockPathMove) != 'undefined' ? textUndockPathMove : 'Move') + ' ' + (typeof(textUndockPathback) != 'undefined' ? textUndockPathback : 'back') + ' ' + '0.4' + 'm</span>'+
				'	<a href="#" class="bWycaUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
				'	<a href="#" class="bWycaUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
				'</li>'
				);
			
			$('#wyca_edit_map_bAugmentedPoseCancelConfig').addClass('disabled');
			$('#wyca_edit_map_container_all .modalAugmentedPoseOptions').modal('show');
		}
    });
	
	$('#wyca_edit_map_bAugmentedPoseSaveConfig').click(function(e) {
		if(!CheckName(augmented_poses, $('#wyca_edit_map_augmented_pose_name').val(), currentAugmentedPoseIndex)){
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			saveCurrentAugmentedPose = JSON.stringify(augmented_pose);
					
			augmented_pose.name = $('#wyca_edit_map_augmented_pose_name').val();
			augmented_pose.comment = $('#wyca_edit_map_augmented_pose_comment').val();
				
			augmented_pose.undock_path = Array();
			
			$('#wyca_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose li').each(function(index, element) {
				if ($(this).data('action') == 'rotate')
				{
					angle_rad = parseFloat($(this).data('angle')) * Math.PI/180;
					augmented_pose.undock_path.push({'linear_distance':0, 'angular_distance':angle_rad});
				}
				else
					augmented_pose.undock_path.push({'linear_distance':$(this).data('distance'), 'angular_distance':0});
			});
			
			augmented_poses[currentAugmentedPoseIndex] = augmented_pose;
			
			$('#wyca_edit_map_bAugmentedPoseCancelConfig').removeClass('disabled');
					
			if (wycaCurrentAction == 'editAugmentedPose')
				WycaAddHistorique({'action':'edit_augmented_pose', 'data':{'index':currentAugmentedPoseIndex, 'old':saveCurrentAugmentedPose, 'new':JSON.stringify(augmented_poses[currentAugmentedPoseIndex])}});
			saveCurrentAugmentedPose = JSON.stringify(augmented_poses[currentAugmentedPoseIndex]);
			WycaTraceAugmentedPose(currentAugmentedPoseIndex);
			$('#wyca_edit_map .modal.modalAugmentedPoseOptions').modal('hide');
		}else{
			alert_wyca(textNameUsed);
		};
	});
	
	$('#wyca_edit_map_container_all .modalAugmentedPoseOptions .bWycaUndockProcedureAugmentedPoseAddElem').click(function(e) {
        e.preventDefault();
		
		$('#wyca_edit_map_up_augmented_pose_elem_action_move').prop('checked', false);
		$('#wyca_edit_map_up_augmented_pose_elem_action_rotate').prop('checked', false);
		
		$('#wyca_edit_map_up_augmented_pose_elem_direction_back').prop('checked', true);
		$('#wyca_edit_map_container_all .up_augmented_pose_elem_action_move').hide();
		$('#wyca_edit_map_container_all .up_augmented_pose_elem_action_rotate').hide();
		
		$('#wyca_edit_map_container_all .modalAugmentedPoseElemOptions').data('index_augmented_pose_procedure', -1);
		
		$('#wyca_edit_map_container_all .modalAugmentedPoseElemOptions').modal('show');
    });
	
	$('#wyca_edit_map_container_all .modalAugmentedPoseElemOptions input:radio[name="up_augmented_pose_elem_action"]').change(function () {
		action = $("#wyca_edit_map_container_all input[name='up_augmented_pose_elem_action']:checked").val()
		$('#wyca_edit_map_container_all .up_augmented_pose_elem_action_move').hide();
		$('#wyca_edit_map_container_all .up_augmented_pose_elem_action_rotate').hide();
		if (action == 'move') {
			$('#wyca_edit_map_container_all .up_augmented_pose_elem_action_move').show();
		}
		else if (action == 'rotate') {
			$('#wyca_edit_map_container_all .up_augmented_pose_elem_action_rotate').show();
		}
	});
		
	$('#wyca_edit_map_container_all .modalAugmentedPoseElemOptions .bAugmentedPoseElemSave').click(function(e) {
		
		index_augmented_pose_procedure = $('#wyca_edit_map_container_all .modalAugmentedPoseElemOptions').data('index_augmented_pose_procedure');
		if (index_augmented_pose_procedure == -1)
		{
			indexAugmentedPoseElem++;
			
			action = $("#wyca_edit_map_container_all input[name='up_augmented_pose_elem_action']:checked").val();
			
			if (action == 'move') {
				
				distance = parseFloat($("#wyca_edit_map_up_augmented_pose_elem_move_distance").val());
				direction = $("#wyca_edit_map_container_all input[name='up_augmented_pose_elem_direction']:checked").val();
							
				$('#wyca_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
					'<li id="wyca_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="move" data-distance="' + ((direction == 'back')?distance*-1:distance) + '">'+
					'	<span>' + (typeof(textUndockPathMove) != 'undefined' ? textUndockPathMove : 'Move') +' '+ ((direction == 'back')?(typeof(textUndockPathback) != 'undefined' ? textUndockPathback : 'back'):(typeof(textUndockPathfront) != 'undefined' ? textUndockPathfront : 'front')) + ' ' + distance + 'm</span>'+
					'	<a href="#" class="bWycaUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bWycaUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
			else if (action == 'rotate') {
				
				angle = $("#wyca_edit_map_up_augmented_pose_elem_rotate_angle").val();
				
				$('#wyca_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
					'<li id="wyca_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="rotate" data-angle="'+angle+'">'+
					'	<span>' + (typeof(textUndockPathRotate) != 'undefined' ? textUndockPathRotate : 'Rotate') +' '+angle+'°</span>'+
					'	<a href="#" class="bWycaUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bWycaUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
		}
		else
		{
			action = $("#wyca_edit_map_container_all input[name='up_augmented_pose_elem_action']:checked").val();
			if (action == 'move') {
				
				distance = parseFloat($("#wyca_edit_map_up_augmented_pose_elem_move_distance").val());
				direction = $("#wyca_edit_map_container_all input[name='up_augmented_pose_elem_direction']:checked").val();
				
				li = $('#wyca_edit_map_list_undock_procedure_augmented_pose_elem_'+ index_augmented_pose_procedure);
				span = $('#wyca_edit_map_list_undock_procedure_augmented_pose_elem_'+ index_augmented_pose_procedure + ' span');
				
				li.data('action', 'move');
				li.data('distance', ((direction == 'back')?distance*-1:distance));
				span.html((typeof(textUndockPathMove) != 'undefined' ? textUndockPathMove : 'Move') + ' ' + ((direction == 'back')?(typeof(textUndockPathback) != 'undefined' ? textUndockPathback : 'back'):(typeof(textUndockPathfront) != 'undefined' ? textUndockPathfront : 'front')) + ' ' + distance + 'm');
			}
			else if (action == 'rotate') {
				
				angle = $("#wyca_edit_map_up_augmented_pose_elem_rotate_angle").val();
				
				li = $('#wyca_edit_map_list_undock_procedure_augmented_pose_elem_'+ index_augmented_pose_procedure);
				span = $('#wyca_edit_map_list_undock_procedure_augmented_pose_elem_'+ index_augmented_pose_procedure + ' span');
				
				li.data('action', 'rotate');
				li.data('angle', angle);
				span.html((typeof(textUndockPathRotate) != 'undefined' ? textUndockPathRotate : 'Rotate') +' '+angle+'°');
			}
		}
    });
	
	$(document).on('click', '#wyca_edit_map_container_all .modalAugmentedPoseOptions .bWycaUndockProcedureAugmentedPoseDeleteElem', function(e) {
		e.preventDefault();
		
		$(this).closest('li').remove();
	});
	
	$(document).on('click', '#wyca_edit_map_container_all .modalAugmentedPoseOptions .bWycaUndockProcedureAugmentedPoseEditElem', function(e) {
		e.preventDefault();
		
		$('#wyca_edit_map_up_augmented_pose_elem_action_move').prop('checked', false);
		$('#wyca_edit_map_up_augmented_pose_elem_action_rotate').prop('checked', false);
		
		$('#wyca_edit_map_container_all .up_augmented_pose_elem_action_move').hide();
		$('#wyca_edit_map_container_all .up_augmented_pose_elem_action_rotate').hide();
		
		li = $(this).closest('li');
		if (li.data('action') == 'rotate')
		{
			$('#wyca_edit_map_container_all .up_augmented_pose_elem_action_rotate').show();
			$('#wyca_edit_map_up_augmented_pose_elem_action_rotate').prop('checked', true);
			$("#wyca_edit_map_up_augmented_pose_elem_rotate_angle").val(li.data('angle'));
		}
		else
		{
			$('#wyca_edit_map_container_all .up_augmented_pose_elem_action_move').show();
			$('#wyca_edit_map_up_augmented_pose_elem_action_move').prop('checked', true);
			distance = li.data('distance');
			if (distance < 0)
				$('#wyca_edit_map_up_augmented_pose_elem_direction_back').prop('checked', true);
			else
				$('#wyca_edit_map_up_augmented_pose_elem_direction_front').prop('checked', true);
			
			$("#wyca_edit_map_up_augmented_pose_elem_move_distance").val(Math.abs(distance));
		}
		
		
		$('#wyca_edit_map_container_all .modalAugmentedPoseElemOptions').data('index_augmented_pose_procedure', li.data('index_augmented_pose_procedure'));
		
		$('#wyca_edit_map_container_all .modalAugmentedPoseElemOptions').modal('show');
		
	});
	
	$('#wyca_edit_map_bAugmentedPoseCreateFromPose').click(function(e) {
		nextIdAugmentedPose++;
		p = {'id_augmented_pose':nextIdAugmentedPose, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':lastRobotPose.x, 'final_pose_y':lastRobotPose.y, 'final_pose_t':lastRobotPose.theta, 'approch_pose_x':lastRobotPose.x, 'approch_pose_y':lastRobotPose.y, 'approch_pose_t':lastRobotPose.theta, 'fiducial_pose_x':0, 'fiducial_pose_y':0, 'fiducial_pose_t':0, 'name':'Augmented pose', 'comment':'', 'color':'', 'icon':'', 'active':true};
		WycaAddHistorique({'action':'add_augmented_pose', 'data':JSON.stringify(p)});
        augmented_poses.push(p);
		WycaTraceAugmentedPose(augmented_poses.length-1);
		
		RemoveClass('#wyca_edit_map_svg .active', 'active');
		RemoveClass('#wyca_edit_map_svg .activ_select', 'activ_select'); 
		RemoveClass('#wyca_edit_map_svg .augmented_pose_elem', 'movable');
					
		currentSelectedItem = Array();
		currentSelectedItem.push({'type':'augmented_pose', 'id':$(this).data('id_augmented_pose')});	
		WycaHideCurrentMenuNotSelect();
		
		$('#wyca_edit_map_boutonsAugmentedPose').show();
		
		$('#wyca_edit_map_boutonsStandard').hide();
		
		$('#wyca_edit_map_boutonsAugmentedPose a').show();
		
		$('body').removeClass('no_current select');
		$('.select').css("strokeWidth", minStokeWidth);
		
		wycaCurrentAction = 'editAugmentedPose';	
		currentStep = '';
		
		currentAugmentedPoseIndex = GetAugmentedPoseIndexFromID(nextIdAugmentedPose);
		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		saveCurrentAugmentedPose = JSON.stringify(augmented_pose);
		
		AddClass('#wyca_edit_map_svg .augmented_pose_elem_'+nextIdAugmentedPose, 'active');
		AddClass('#wyca_edit_map_svg .augmented_pose_elem_'+nextIdAugmentedPose, 'movable');
		
		$('#wyca_edit_map_bAugmentedPoseEditName').click();
        
    });
	
	$('#wyca_edit_map_bAugmentedPoseCreateFromMap').click(function(e) {
        if (wycaCanChangeMenu)
		{
			blockZoom = true;
			
			$('#wyca_edit_map_boutonsAugmentedPose').show();
            $('#wyca_edit_map_boutonsStandard').hide();
			
			$('#wyca_edit_map_boutonsAugmentedPose #wyca_edit_map_bAugmentedPoseSave').hide();
			$('#wyca_edit_map_boutonsAugmentedPose #wyca_edit_map_bAugmentedPoseDelete').hide();
			$('#wyca_edit_map_boutonsAugmentedPose #wyca_edit_map_bAugmentedPoseDirection').hide();
			$('#wyca_edit_map_boutonsAugmentedPose #wyca_edit_map_bAugmentedPoseEditName').hide();
			
			wycaCurrentAction = 'addAugmentedPose';	
			currentStep = 'setPose';
			
			$('body').removeClass('no_current');
			$('body').addClass('addAugmentedPose');
			
			$('#wyca_edit_map_message_aide').html(textClickOnMapPose);
			$('#wyca_edit_map_message_aide').show();
		}
		else
			WycaAvertCantChange();
    });
	
	$('#wyca_edit_map_bAugmentedPoseEditSaveConfig').click(function(e) {
		if (wycaCurrentAction == 'addAugmentedPose')
		{
			WycaSaveElementNeeded(false);
			
			nextIdAugmentedPose++;
			p = {'id_augmented_pose':nextIdAugmentedPose, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':currentAugmentedPosePose.final_pose_x, 'final_pose_y':currentAugmentedPosePose.final_pose_y, 'final_pose_t':currentAugmentedPosePose.final_pose_t, 'approch_pose_x':currentAugmentedPosePose.approch_pose_x, 'approch_pose_y':currentAugmentedPosePose.approch_pose_y, 'approch_pose_t':currentAugmentedPosePose.approch_pose_t, 'fiducial_pose_x':currentAugmentedPosePose.fiducial_pose_x, 'fiducial_pose_y':currentAugmentedPosePose.fiducial_pose_y, 'fiducial_pose_t':currentAugmentedPosePose.fiducial_pose_t, 'name':$('#wyca_edit_map_augmented_pose_name').val(), 'comment':'', 'icon':'', 'color':'', 'icon':'', 'active':true};
			WycaAddHistorique({'action':'add_augmented_pose', 'data':JSON.stringify(p)});
			
			augmented_poses.push(p);
			WycaTraceAugmentedPose(augmented_poses.length-1);
			
			$('#wyca_edit_map_svg .augmented_pose_elem_current').remove();
			
			RemoveClass('#wyca_edit_map_svg .active', 'active');
			
			wycaCurrentAction = '';
			currentStep = '';
			
			$('#wyca_edit_map_boutonsRotate').hide();
			
			$('#wyca_edit_map_boutonsAugmentedPose').hide();
			$('#wyca_edit_map_boutonsStandard').show();
			$('#wyca_edit_map_message_aide').hide();
			blockZoom = false;
			
			$('body').addClass('no_current');
			
			WycaSetModeSelect();
			
			
		}
		else
		{
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			augmented_pose.name = $('#wyca_edit_map_augmented_pose_name').val();
			if (augmented_pose.name == '') augmented_pose.name = 'Augmented pose';
		}
		
	});
	
	$('#wyca_edit_map_bAugmentedPoseDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this Augmented pose?'))
		{
			WycaDeleteAugmentedPose(currentAugmentedPoseIndex);
		}
    });
	
	$('#wyca_edit_map_bAugmentedPoseEditName').click(function(e) {
   		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		$('#wyca_edit_map_augmented_pose_name').val(augmented_pose.name);
	});
	
	$('#wyca_edit_map_bAugmentedPoseDirection').click(function(e) {
        e.preventDefault();
		
		if ($('#wyca_edit_map_boutonsRotate').is(':visible'))
		{
			$('#wyca_edit_map_boutonsRotate').hide();
		}
		else
		{
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			
			//zoom = ros_largeur / $('#wyca_edit_map_svg').width() / window.panZoom.getZoom();
			zoom = WycaGetZoom();		
			p = $('#wyca_edit_map_svg image').position();
			
			x = augmented_pose.approch_pose_x * 100 / 5;
			y = augmented_pose.approch_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#wyca_edit_map_boutonsRotate').css('left', x - $('#wyca_edit_map_boutonsRotate').width()/2);
			$('#wyca_edit_map_boutonsRotate').css('top', y - 60);
			$('#wyca_edit_map_boutonsRotate').show();
		}
	});
	
	window.oncontextmenu = function(event) {
		 event.preventDefault();
		 event.stopPropagation();
		 return false;
	};
	
	/* BTNS ROTATE */
	
	$(document).on('touchstart', '#wyca_edit_map_bRotateRight', function(e) {
		WycaSaveElementNeeded(true);
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
		timerRotate = setInterval(function() { 
			if (wycaCurrentAction == 'addPoi')
			{
				currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) + Math.PI / 90;
				
				WycaTraceCurrentPoi(currentPoiPose);
			}
			else if (wycaCurrentAction == 'addAugmentedPose')
			{
				currentAugmentedPosePose.approch_pose_t = parseFloat(currentAugmentedPosePose.approch_pose_t) + Math.PI / 90;
				
				WycaTraceCurrentAugmentedPose(currentAugmentedPosePose);
			}
			else if (wycaCurrentAction == 'addDock')
			{
				currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) + Math.PI / 90;
				
				WycaTraceCurrentDock(currentDockPose);
			}
			else if (wycaCurrentAction == 'editPoi')
			{
				poi = pois[currentPoiIndex];
				poi.approch_pose_t = parseFloat(poi.approch_pose_t) + Math.PI / 90;
				WycaTracePoi(currentPoiIndex);			
			}
			else if (wycaCurrentAction == 'editAugmentedPose')
			{
				augmented_pose = augmented_poses[currentAugmentedPoseIndex];
				augmented_pose.approch_pose_t = parseFloat(augmented_pose.approch_pose_t) + Math.PI / 90;
				WycaTraceAugmentedPose(currentAugmentedPoseIndex);			
			}
			else if (wycaCurrentAction == 'editDock')
			{
				dock = docks[currentDockIndex];
				dock.approch_pose_t = parseFloat(dock.approch_pose_t) + Math.PI / 90;
				WycaTraceDock(currentDockIndex);		
			}
		}, 100);
    });
	
	$(document).on('touchend', '#wyca_edit_map_bRotateRight', function(e) {
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
    });
	
	$('#wyca_edit_map_bRotateRight').click(function(e) {
		WycaSaveElementNeeded(true);
		if (wycaCurrentAction == 'addPoi')
		{
			currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) + Math.PI / 90;
			
			WycaTraceCurrentPoi(currentPoiPose);
		}
		else if (wycaCurrentAction == 'addAugmentedPose')
		{
			currentAugmentedPosePose.approch_pose_t = parseFloat(currentAugmentedPosePose.approch_pose_t) + Math.PI / 90;
			
			WycaTraceCurrentAugmentedPose(currentAugmentedPosePose);
		}
		else if (wycaCurrentAction == 'addDock')
		{
			currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) + Math.PI / 90;
			
			WycaTraceCurrentDock(currentDockPose);
		}
		else if (wycaCurrentAction == 'editPoi')
		{
			poi = pois[currentPoiIndex];
			poi.approch_pose_t = parseFloat(poi.approch_pose_t) + Math.PI / 90;
			WycaTracePoi(currentPoiIndex);			
		}
		else if (wycaCurrentAction == 'editAugmentedPose')
		{
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			augmented_pose.approch_pose_t = parseFloat(augmented_pose.approch_pose_t) + Math.PI / 90;
			WycaTraceAugmentedPose(currentAugmentedPoseIndex);			
		}
		else if (wycaCurrentAction == 'editDock')
		{
			dock = docks[currentDockIndex];
			dock.approch_pose_t = parseFloat(dock.approch_pose_t) + Math.PI / 90;
			WycaTraceDock(currentDockIndex);
		}
    });
	
	$(document).on('touchstart', '#wyca_edit_map_bRotateLeft', function(e) {
		WycaSaveElementNeeded(true);
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
		timerRotate = setInterval(function() { 
			if (wycaCurrentAction == 'addPoi')
			{
				currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) - Math.PI / 90;
				
				WycaTraceCurrentPoi(currentPoiPose);
			}
			else if (wycaCurrentAction == 'addAugmentedPose')
			{
				currentAugmentedPosePose.approch_pose_t = parseFloat(currentAugmentedPosePose.approch_pose_t) - Math.PI / 90;
				
				WycaTraceCurrentAugmentedPose(currentAugmentedPosePose);
			}
			else if (wycaCurrentAction == 'addDock')
			{
				currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) - Math.PI / 90;
				
				WycaTraceCurrentDock(currentDockPose);
			}
			else if (wycaCurrentAction == 'editPoi')
			{
				poi = pois[currentPoiIndex];
				poi.approch_pose_t = parseFloat(poi.approch_pose_t) - Math.PI / 90;
				WycaTracePoi(currentPoiIndex);			
			}
			else if (wycaCurrentAction == 'editAugmentedPose')
			{
				augmented_pose = augmented_poses[currentAugmentedPoseIndex];
				augmented_pose.approch_pose_t = parseFloat(augmented_pose.approch_pose_t) - Math.PI / 90;
				WycaTraceAugmentedPose(currentAugmentedPoseIndex);			
			}
			else if (wycaCurrentAction == 'editDock')
			{
				dock = docks[currentDockIndex];
				dock.approch_pose_t = parseFloat(dock.approch_pose_t) - Math.PI / 90;
				WycaTraceDock(currentDockIndex);
			}
		}, 100);
    });
	
	$(document).on('touchend', '#wyca_edit_map_bRotateLeft', function(e) {
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
    });
	
	$('#wyca_edit_map_bRotateLeft').click(function(e) {
		WycaSaveElementNeeded(true);
        if (wycaCurrentAction == 'addPoi')
		{
			currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) - Math.PI / 90;
			
			WycaTraceCurrentPoi(currentPoiPose);
		}
		else if (wycaCurrentAction == 'addAugmentedPose')
		{
			currentAugmentedPosePose.approch_pose_t = parseFloat(currentAugmentedPosePose.approch_pose_t) - Math.PI / 90;
			
			WycaTraceCurrentAugmentedPose(currentAugmentedPosePose);
		}
		else if (wycaCurrentAction == 'addDock')
		{
			currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) - Math.PI / 90;
			
			WycaTraceCurrentDock(currentDockPose);
		}
		else if (wycaCurrentAction == 'editPoi')
		{
			poi = pois[currentPoiIndex];
			poi.approch_pose_t = parseFloat(poi.approch_pose_t) - Math.PI / 90;
			WycaTracePoi(currentPoiIndex);			
		}
		else if (wycaCurrentAction == 'editAugmentedPose')
		{
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			augmented_pose.approch_pose_t = parseFloat(augmented_pose.approch_pose_t) - Math.PI / 90;
			WycaTraceAugmentedPose(currentAugmentedPoseIndex);			
		}
		else if (wycaCurrentAction == 'editDock')
		{
			dock = docks[currentDockIndex];
			dock.approch_pose_t = parseFloat(dock.approch_pose_t) - Math.PI / 90;
			WycaTraceDock(currentDockIndex);
		}        
    });
		
	InitTaille();
    
    var offsetMap;
    
    AppliquerZoom();
	
	WycaSetModeSelect();
	
	/* EVENTS ON MAP */
	
	$('#wyca_edit_map_svg').on('touchstart', function(e) {
		touchStarted = true;
		//zoom = ros_largeur / $('#wyca_edit_map_svg').width() / window.panZoom.getZoom();
		zoom = WycaGetZoom();
		
		if (wycaCurrentAction == 'gomme' && currentStep=='')
		{
			$('#wyca_edit_map .times_icon_menu').hide();
			currentStep='trace';
			if (gommes.length == 0 || Object.keys(gommes[gommes.length-1]).length > 0)
			{
				gommes[gommes.length] = { 'size': sizeGomme, 'points':[] };
				//gommes[gommes.length-1].push({x:0, y:0}); // Point du curseur
				
				p = $('#wyca_edit_map_svg image').position();
				x = (e.originalEvent.targetTouches[0] ? e.originalEvent.targetTouches[0].pageX : e.originalEvent.changedTouches[e.changedTouches.length-1].pageX) - p.left;
				y = (e.originalEvent.targetTouches[0] ? e.originalEvent.targetTouches[0].pageY : e.originalEvent.changedTouches[e.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
								
				gommes[gommes.length-1].points.push({x:xRos, y:yRos});
				gommes[gommes.length-1].points.push({x:xRos+0.01, y:yRos+0.01}); // Point du curseur
				WycaTraceCurrentGomme(gommes[gommes.length-1], gommes.length-1);
				
				wycaCanChangeMenu = false;
				$('#wyca_edit_map_bEndGomme').show();
				$('#wyca_edit_map_bCancelGomme').show();
			}
		}
		else if (wycaCurrentAction == 'addDock' && currentStep=='setPose')
		{
			p = $('#wyca_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approach_pose_x = xRos;
			currentDockPose.approach_pose_y = yRos;
			currentDockPose.approach_pose_t = 0;
			
			WycaTraceCurrentDock(currentDockPose);
		}
		/*
		else if (wycaCurrentAction == 'addDock' && currentStep=='setDir')
		{
			p = $('#wyca_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approch_pose_t = GetAngleRadian(currentDockPose.approch_pose_x, currentDockPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			WycaTraceCurrentDock(currentDockPose);
		}
		*/
		else if (wycaCurrentAction == 'addPoi' && currentStep=='setPose')
		{
			p = $('#wyca_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approch_pose_x = xRos;
			currentPoiPose.approch_pose_y = yRos;
			currentPoiPose.approch_pose_t = 0;
			
			WycaTraceCurrentPoi(currentPoiPose);
		}
		else if (wycaCurrentAction == 'addAugmentedPose' && currentStep=='setPose')
		{
			p = $('#wyca_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentAugmentedPosePose.approch_pose_x = xRos;
			currentAugmentedPosePose.approch_pose_y = yRos;
			currentAugmentedPosePose.approch_pose_t = 0;
			
			WycaTraceCurrentAugmentedPose(currentAugmentedPosePose);
		}

		/*
		else if (wycaCurrentAction == 'addDock' && currentStep=='setDir')
		{
			p = $('#wyca_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approch_pose_t = GetAngleRadian(currentPoiPose.approch_pose_x, currentPoiPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			WycaTraceCurrentPoi(currentPoiPose);
		}
		*/
		/*
		else if (wycaCurrentAction == 'addForbiddenArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#wyca_edit_map_mapBox').height() - e.offsetY;
			p = $('#wyca_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentForbiddenPoints.pop(); // Point du curseur
			currentForbiddenPoints.push({x:xRos, y:yRos});
			//currentForbiddenPoints.push({x:xRos, y:yRos}); // Point du curseur
			WycaTraceCurrentForbidden(currentForbiddenPoints);
		}
		else if (wycaCurrentAction == 'addArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#wyca_edit_map_mapBox').height() - e.offsetY;
			p = $('#wyca_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
		
			currentAreaPoints.pop(); // Point du curseur
			currentAreaPoints.push({x:xRos, y:yRos});
			//currentAreaPoints.push({x:xRos, y:yRos}); // Point du curseur
			WycaTraceCurrentArea(currentAreaPoints);
		}
		*/
	});
	
	$('#wyca_edit_map_svg').on('touchmove', function(e) {
		if ($('#wyca_edit_map_boutonsRotate').is(':visible'))
		{
			//zoom = ros_largeur / $('#wyca_edit_map_svg').width() / window.panZoom.getZoom();
			zoom = WycaGetZoom();
			 if (wycaCurrentAction == 'addDock')
			 {
				p = $('#wyca_edit_map_svg image').position();
				
				x = currentDockPose.approach_pose_x * 100 / 5;
				y = currentDockPose.approach_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#wyca_edit_map_boutonsRotate').css('left', x - $('#wyca_edit_map_boutonsRotate').width()/2);
				$('#wyca_edit_map_boutonsRotate').css('top', y - 60);
				$('#wyca_edit_map_boutonsRotate').show();
			 }
			 else if (wycaCurrentAction == 'addPoi')
			 {
				p = $('#wyca_edit_map_svg image').position();
			
				x = currentPoiPose.approach_pose_x * 100 / 5;
				y = currentPoiPose.approach_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#wyca_edit_map_boutonsRotate').css('left', x - $('#wyca_edit_map_boutonsRotate').width()/2);
				$('#wyca_edit_map_boutonsRotate').css('top', y - 60);
				$('#wyca_edit_map_boutonsRotate').show();
			 }
			 else if (wycaCurrentAction == 'addAugmentedPose')
			 {
				p = $('#wyca_edit_map_svg image').position();
			
				x = currentAugmentedPosePose.approach_pose_x * 100 / 5;
				y = currentAugmentedPosePose.approach_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#wyca_edit_map_boutonsRotate').css('left', x - $('#wyca_edit_map_boutonsRotate').width()/2);
				$('#wyca_edit_map_boutonsRotate').css('top', y - 60);
				$('#wyca_edit_map_boutonsRotate').show();
			 }
			 else if (wycaCurrentAction == 'editDock')
			 {
				dock = docks[currentDockIndex];
				
				p = $('#wyca_edit_map_svg image').position();
				
				
				x = dock.approch_pose_x * 100 / 5;
				y = dock.approch_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#wyca_edit_map_boutonsRotate').css('left', x - $('#wyca_edit_map_boutonsRotate').width()/2);
				$('#wyca_edit_map_boutonsRotate').css('top', y - 60);
				$('#wyca_edit_map_boutonsRotate').show();
			 }
			 else if (wycaCurrentAction == 'editPoi')
			 {
				poi = pois[currentPoiIndex];
				
				p = $('#wyca_edit_map_svg image').position();
				
				
				x = poi.approch_pose_x * 100 / 5;
				y = poi.approch_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#wyca_edit_map_boutonsRotate').css('left', x - $('#wyca_edit_map_boutonsRotate').width()/2);
				$('#wyca_edit_map_boutonsRotate').css('top', y - 60);
				$('#wyca_edit_map_boutonsRotate').show();
			 }
			 else if (wycaCurrentAction == 'editAugmentedPose')
			 {
				augmented_pose = augmented_poses[currentAugmentedPoseIndex];
				
				p = $('#wyca_edit_map_svg image').position();
				
				
				x = augmented_pose.approch_pose_x * 100 / 5;
				y = augmented_pose.approch_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#wyca_edit_map_boutonsRotate').css('left', x - $('#wyca_edit_map_boutonsRotate').width()/2);
				$('#wyca_edit_map_boutonsRotate').css('top', y - 60);
				$('#wyca_edit_map_boutonsRotate').show();
			 }
		}
		
		if (touchStarted)
		{
			//zoom = 1;
			zoom = WycaGetZoom();
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
				  
					$('#wyca_edit_map_dock_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
					$('#wyca_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
				  
					delta = (wycaDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					dock.approch_pose_x = parseFloat(dock.approch_pose_x) - delta;
					delta = (wycaDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					dock.approch_pose_y = parseFloat(dock.approch_pose_y) + delta;
					
					//movableDown.attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					//movableDown.attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 5); 
					
					
					$('#wyca_edit_map_dock_'+movableDown.data('id_docking_station')).attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					$('#wyca_edit_map_dock_'+movableDown.data('id_docking_station')).attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 1); 
					
					$('#wyca_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('x1', dock.approch_pose_x * 100 / ros_resolution - 1);
					$('#wyca_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('y1', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 1); 
					$('#wyca_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('x2', dock.approch_pose_x * 100 / ros_resolution + 1);
					$('#wyca_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('y2', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 1); 
					
					x = dock.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution);	
					angle = 0 - dock.approch_pose_t * 180 / Math.PI - 90;
					
					$('#wyca_edit_map_dock_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					$('#wyca_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					
					//WycaTraceDock(GetDockIndexFromID(movableDown.data('id_docking_station')));
				    
					wycaDownOnSVG_x = pageX;
					wycaDownOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'poi')
			   {
				   e.preventDefault();
				    
				   poi = GetPoiFromID(movableDown.data('id_poi'));
				   
				   pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
				   pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
				  	x = poi.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (poi.approch_pose_y * 100 / ros_resolution);
				  
					$('#wyca_edit_map_poi_sens_'+movableDown.data('id_poi')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
				  
					delta = (wycaDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					poi.approch_pose_x = parseFloat(poi.approch_pose_x) - delta;
					delta = (wycaDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					poi.approch_pose_y = parseFloat(poi.approch_pose_y) + delta;
					
					//movableDown.attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					//movableDown.attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 5); 
					
					x = poi.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (poi.approch_pose_y * 100 / ros_resolution);	
					angle = 0 - poi.approch_pose_t * 180 / Math.PI;
					
					$('#wyca_edit_map_poi_secure_'+movableDown.data('id_poi')).attr('cx', x);
					$('#wyca_edit_map_poi_secure_'+movableDown.data('id_poi')).attr('cy', y); 
					
					$('#wyca_edit_map_poi_robot_'+movableDown.data('id_poi')).attr('cx', x);
					$('#wyca_edit_map_poi_robot_'+movableDown.data('id_poi')).attr('cy', y);
										
					$('#wyca_edit_map_poi_sens_'+movableDown.data('id_poi')).attr('points', (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2));
					$('#wyca_edit_map_poi_sens_'+movableDown.data('id_poi')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					
					//WycaTraceDock(GetDockIndexFromID(movableDown.data('id_docking_station')));
				    
					wycaDownOnSVG_x = pageX;
					wycaDownOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'augmented_pose')
			   {
				   e.preventDefault();
				    
				   augmented_pose = GetAugmentedPoseFromID(movableDown.data('id_augmented_pose'));
				   
				   pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
				   pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
				  	x = augmented_pose.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (augmented_pose.approch_pose_y * 100 / ros_resolution);
				  
					$('#wyca_edit_map_augmented_pose_sens_'+movableDown.data('id_augmented_pose')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
				  
					delta = (wycaDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					augmented_pose.approch_pose_x = parseFloat(augmented_pose.approch_pose_x) - delta;
					delta = (wycaDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					augmented_pose.approch_pose_y = parseFloat(augmented_pose.approch_pose_y) + delta;
					
					//movableDown.attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					//movableDown.attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 5); 
					
					x = augmented_pose.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (augmented_pose.approch_pose_y * 100 / ros_resolution);	
					angle = 0 - augmented_pose.approch_pose_t * 180 / Math.PI;
					
					$('#wyca_edit_map_augmented_pose_secure_'+movableDown.data('id_augmented_pose')).attr('cx', x);
					$('#wyca_edit_map_augmented_pose_secure_'+movableDown.data('id_augmented_pose')).attr('cy', y); 
					
					$('#wyca_edit_map_augmented_pose_robot_'+movableDown.data('id_augmented_pose')).attr('cx', x);
					$('#wyca_edit_map_augmented_pose_robot_'+movableDown.data('id_augmented_pose')).attr('cy', y);
										
					$('#wyca_edit_map_augmented_pose_sens_'+movableDown.data('id_augmented_pose')).attr('points', (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2));
					$('#wyca_edit_map_augmented_pose_sens_'+movableDown.data('id_augmented_pose')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					
					//WycaTraceDock(GetDockIndexFromID(movableDown.data('id_docking_station')));
				    
					wycaDownOnSVG_x = pageX;
					wycaDownOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'forbidden')
			   {
				   e.preventDefault();
				    
				   forbidden = GetForbiddenFromID(movableDown.data('id_area'));
				   
				   pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
				   pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
					delta = (wycaDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					forbidden.points[movableDown.data('index_point')].x = parseFloat(forbidden.points[movableDown.data('index_point')].x) - delta;
					delta = (wycaDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					forbidden.points[movableDown.data('index_point')].y = parseFloat(forbidden.points[movableDown.data('index_point')].y) + delta;
					
					movableDown.attr('x', forbidden.points[movableDown.data('index_point')].x * 100 / ros_resolution - 5);
					movableDown.attr('y', ros_hauteur - (forbidden.points[movableDown.data('index_point')].y * 100 / ros_resolution) - 5); 
				
					WycaTraceForbidden(GetForbiddenIndexFromID(movableDown.data('id_area')));
				    
					wycaDownOnSVG_x = pageX;
					wycaDownOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'area')
			   {
				   e.preventDefault();
				    
				   area = GetAreaFromID(movableDown.data('id_area'));
				   
				   pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
				   pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
					delta = (wycaDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					area.points[movableDown.data('index_point')].x = parseFloat(area.points[movableDown.data('index_point')].x) - delta;
					delta = (wycaDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					area.points[movableDown.data('index_point')].y = parseFloat(area.points[movableDown.data('index_point')].y) + delta;
					
					movableDown.attr('x', area.points[movableDown.data('index_point')].x * 100 / ros_resolution - 5);
					movableDown.attr('y', ros_hauteur - (area.points[movableDown.data('index_point')].y * 100 / ros_resolution) - 5); 
				
					WycaTraceArea(GetAreaIndexFromID(movableDown.data('id_area')));
				    
					wycaDownOnSVG_x = pageX;
					wycaDownOnSVG_y = pageY;
			   }
			}
			else if (clickSelectSVG && wycaCurrentAction == 'select')
			{
				e.preventDefault();
				
				//clickSelectSVG_x_last = e.offsetX;
				//clickSelectSVG_y_last = e.offsetY;
				p = $('#wyca_edit_map_svg image').position();
				clickSelectSVG_x_last = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				clickSelectSVG_y_last = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				
				WycaTraceSection(clickSelectSVG_x, clickSelectSVG_y, clickSelectSVG_x_last, clickSelectSVG_y_last);
			}
			else if (wycaCurrentAction == 'gomme' && (currentStep=='trace' || currentStep=='traced'))
			{
				e.preventDefault();
				currentStep ='traced';
				
				//x = e.offsetX;
				//y = $('#wyca_edit_map_mapBox').height() - e.offsetY;
				p = $('#wyca_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
								
				gommes[gommes.length-1].points.pop(); // Point du curseur
				gommes[gommes.length-1].points.push({x:xRos, y:yRos});
				gommes[gommes.length-1].points.push({x:xRos, y:yRos}); // Point du curseur
				WycaTraceCurrentGomme(gommes[gommes.length-1], gommes.length-1);
			}
			else if (wycaCurrentAction == 'addDock' && currentStep=='setPose')
			{
				p = $('#wyca_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentDockPose.approach_pose_x = xRos;
				currentDockPose.approach_pose_y = yRos;
				currentDockPose.approach_pose_t = 0;
				
				WycaTraceCurrentDock(currentDockPose);
			}
			/*
			else if (wycaCurrentAction == 'addDock' && currentStep=='setDir')
			{
				p = $('#wyca_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentDockPose.approch_pose_t = GetAngleRadian(currentDockPose.approch_pose_x, currentDockPose.approch_pose_y, xRos, yRos) + Math.PI;
								
				WycaTraceCurrentDock(currentDockPose);
			}
			*/
			else if (wycaCurrentAction == 'addPoi' && currentStep=='setPose')
			{
				p = $('#wyca_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentPoiPose.approch_pose_x = xRos;
				currentPoiPose.approch_pose_y = yRos;
				currentPoiPose.approch_pose_t = 0;
				
				WycaTraceCurrentPoi(currentPoiPose);
			}
			else if (wycaCurrentAction == 'addAugmentedPose' && currentStep=='setPose')
			{
				p = $('#wyca_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentAugmentedPosePose.approch_pose_x = xRos;
				currentAugmentedPosePose.approch_pose_y = yRos;
				currentAugmentedPosePose.approch_pose_t = 0;
				
				WycaTraceCurrentAugmentedPose(currentAugmentedPosePose);
			}
			/*
			else if (wycaCurrentAction == 'addPoi' && currentStep=='setDir')
			{
				p = $('#wyca_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentPoiPose.approch_pose_t = GetAngleRadian(currentPoiPose.approch_pose_x, currentPoiPose.approch_pose_y, xRos, yRos) + Math.PI;
								
				WycaTraceCurrentPoi(currentPoiPose);
			}
			*/
			/*
			else if (wycaCurrentAction == 'addForbiddenArea' && currentStep=='trace')
			{
				e.preventDefault();
				
				//x = e.offsetX;
				//y = $('#wyca_edit_map_mapBox').height() - e.offsetY;
				p = $('#wyca_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentForbiddenPoints.pop(); // Point du curseur
				currentForbiddenPoints.push({x:xRos, y:yRos});
				WycaTraceCurrentForbidden(currentForbiddenPoints);
			}
			else if (wycaCurrentAction == 'addArea' && currentStep=='trace')
			{
				e.preventDefault();
				
				//x = e.offsetX;
				//y = $('#wyca_edit_map_mapBox').height() - e.offsetY;
				p = $('#wyca_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentAreaPoints.pop(); // Point du curseur
				currentAreaPoints.push({x:xRos, y:yRos});
				WycaTraceCurrentArea(currentAreaPoints);
			}
			*/
		}
	});
	
	$('#wyca_edit_map_svg').on('touchend', function(e) {
		touchStarted = false;
		zoom = WycaGetZoom();
		if (downOnMovable)
		{
			downOnMovable = false;
			touchStarted = false;
			blockZoom = false;
			
			if (movableDown.data('element_type') == 'forbidden')
			{
				WycaTraceForbidden(GetForbiddenIndexFromID(movableDown.data('id_area')));
			}
			else if (movableDown.data('element_type') == 'area')
			{
				WycaTraceArea(GetAreaIndexFromID(movableDown.data('id_area')));
			}
		}
		if (wycaCurrentAction == 'gomme' && currentStep=='traced')
		{
			currentStep='';
			WycaAddHistorique({'action':'gomme', 'data':gommes[gommes.length-1]});
		}
		else if (wycaCurrentAction == 'addDock' && currentStep=='setPose')
		{
			p = $('#wyca_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approach_pose_x = xRos;
			currentDockPose.approach_pose_y = yRos;
			currentDockPose.approach_pose_t = 0;
			
			WycaTraceCurrentDock(currentDockPose);
			
			
			x = currentDockPose.approach_pose_x * 100 / 5;
			y = currentDockPose.approach_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#wyca_edit_map_boutonsRotate').css('left', x - $('#wyca_edit_map_boutonsRotate').width()/2);
			$('#wyca_edit_map_boutonsRotate').css('top', y - 60);
			$('#wyca_edit_map_boutonsRotate').show();
			$('#wyca_edit_map_bDockSave').show();
			
			//currentStep='setDir';
			//$('#wyca_edit_map_message_aide').html(textClickOnMapDir);
			
		}
		/*
		else if (wycaCurrentAction == 'addDock' && currentStep=='setDir')
		{
			p = $('#wyca_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approch_pose_t = GetAngleRadian(currentDockPose.approch_pose_x, currentDockPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			WycaTraceCurrentDock(currentDockPose);
			
			$('#wyca_edit_map_boutonsDock #wyca_edit_map_bDockSave').show();
		}
		*/
		else if (wycaCurrentAction == 'addPoi' && currentStep=='setPose')
		{
			p = $('#wyca_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approach_pose_x = xRos;
			currentPoiPose.approach_pose_y = yRos;
			currentPoiPose.approach_pose_t = 0;
			
			WycaTraceCurrentPoi(currentPoiPose);
			
			zoom = ros_largeur / $('#wyca_edit_map_svg').width() / window.panZoom.getZoom();		
			p = $('#wyca_edit_map_svg image').position();
			
			
			x = currentPoiPose.approach_pose_x * 100 / 5;
			y = currentPoiPose.approach_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#wyca_edit_map_boutonsRotate').css('left', x - $('#wyca_edit_map_boutonsRotate').width()/2);
			$('#wyca_edit_map_boutonsRotate').css('top', y - 60);
			$('#wyca_edit_map_boutonsRotate').show();
			$('#wyca_edit_map_bPoiSave').show();
			
			//currentStep='setDir';
			//$('#wyca_edit_map_message_aide').html(textClickOnMapDir);
		}
		else if (wycaCurrentAction == 'addAugmentedPose' && currentStep=='setPose')
		{
			p = $('#wyca_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentAugmentedPosePose.approach_pose_x = xRos;
			currentAugmentedPosePose.approach_pose_y = yRos;
			currentAugmentedPosePose.approach_pose_t = 0;
			
			WycaTraceCurrentAugmentedPose(currentAugmentedPosePose);
			
			zoom = ros_largeur / $('#wyca_edit_map_svg').width() / window.panZoom.getZoom();		
			p = $('#wyca_edit_map_svg image').position();
			
			
			x = currentAugmentedPosePose.approach_pose_x * 100 / 5;
			y = currentAugmentedPosePose.approach_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#wyca_edit_map_boutonsRotate').css('left', x - $('#wyca_edit_map_boutonsRotate').width()/2);
			$('#wyca_edit_map_boutonsRotate').css('top', y - 60);
			$('#wyca_edit_map_boutonsRotate').show();
			$('#wyca_edit_map_bAugmentedPoseSave').show();
			
			//currentStep='setDir';
			//$('#wyca_edit_map_message_aide').html(textClickOnMapDir);
		}
		/*
		else if (wycaCurrentAction == 'addPoi' && currentStep=='setDir')
		{
			p = $('#wyca_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approch_pose_t = GetAngleRadian(currentPoiPose.approch_pose_x, currentPoiPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			WycaTraceCurrentPoi(currentPoiPose);
			
			$('#wyca_edit_map_boutonsPoi #wyca_edit_map_bPoiSave').show();
		}
		*/
		/*
		else if (wycaCurrentAction == 'addForbiddenArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#wyca_edit_map_mapBox').height() - e.offsetY;
			p = $('#wyca_edit_map_svg image').position();
			
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;

			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentForbiddenPoints.pop(); // Point du curseur
			currentForbiddenPoints.push({x:xRos, y:yRos});
			currentForbiddenPoints.push({x:xRos, y:yRos}); // Point du curseur
			WycaTraceCurrentForbidden(currentForbiddenPoints);
		}
		else if (wycaCurrentAction == 'addArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#wyca_edit_map_mapBox').height() - e.offsetY;
			p = $('#wyca_edit_map_svg image').position();
			
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;

			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			
			currentAreaPoints.pop(); // Point du curseur
			currentAreaPoints.push({x:xRos, y:yRos});
			currentAreaPoints.push({x:xRos, y:yRos}); // Point du curseur
			WycaTraceCurrentArea(currentAreaPoints);
		}
		*/
	});
});

// POI FUNCS

function WycaPoiSave()
{
	if (wycaCurrentAction == 'addPoi')
	{
		$('#wyca_edit_map_poi_name').val('');
		$('#wyca_edit_map_modalPoiEditName').modal('show');
	}
	else if (wycaCurrentAction == 'editPoi')
	{	
		WycaSaveElementNeeded(false);
		
		poi = pois[currentPoiIndex];
		RemoveClass('#wyca_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		
		WycaAddHistorique({'action':'edit_poi', 'data':{'index':currentPoiIndex, 'old':saveCurrentPoi, 'new':JSON.stringify(pois[currentPoiIndex])}});
		saveCurrentPoi = pois[currentPoiIndex];
		RemoveClass('#wyca_edit_map_svg .active', 'active');
		
		wycaCurrentAction = '';
		currentStep = '';
		
		$('#wyca_edit_map_boutonsRotate').hide();
		
		$('#wyca_edit_map_boutonsPoi').hide();
		$('#wyca_edit_map_boutonsStandard').show();
		$('#wyca_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		WycaSetModeSelect();
	}
}

function WycaPoiCancel()
{
	WycaSaveElementNeeded(false);
	
	$('#wyca_edit_map_svg .poi_elem_current').remove();
	RemoveClass('#wyca_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (wycaCurrentAction == 'addPoi')
	{
		$('#wyca_edit_map_svg .poi_elem_0').remove();
	}
	else if (wycaCurrentAction == 'editPoi')
	{
		poi = pois[currentPoiIndex];
		RemoveClass('#wyca_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		
		pois[currentPoiIndex] = JSON.parse(saveCurrentPoi);
		WycaTracePoi(currentPoiIndex);
	}
	wycaCurrentAction = '';
	currentStep = '';
	
	$('#wyca_edit_map_boutonsRotate').hide();
	
	$('#wyca_edit_map_boutonsPoi').hide();
	$('#wyca_edit_map_boutonsStandard').show();
	$('#wyca_edit_map_message_aide').hide();
	blockZoom = false;
	
	WycaSetModeSelect();
}

function WycaDeletePoi(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	pois[indexInArray].deleted = true;
	
	WycaAddHistorique({'action':'delete_poi', 'data':indexInArray});
	
	data = pois[indexInArray];
	$('#wyca_edit_map_svg .poi_elem_'+data.id_poi).remove();
	
	RemoveClass('#wyca_edit_map_svg .active', 'active');
	
	wycaCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#wyca_edit_map_boutonsPoi').hide();
    $('#wyca_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	WycaSetModeSelect();
}

// AUGMENTED POSE FUNCS

function WycaAugmentedPoseSave()
{
	if (wycaCurrentAction == 'addAugmentedPose')
	{
		$('#wyca_edit_map_augmented_pose_name').val('');
		$('#wyca_edit_map_modalAugmentedPoseEditName').modal('show');
	}
	else if (wycaCurrentAction == 'editAugmentedPose')
	{	
		WycaSaveElementNeeded(false);
		
		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		RemoveClass('#wyca_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'movable');
		
		WycaAddHistorique({'action':'edit_augmented_pose', 'data':{'index':currentAugmentedPoseIndex, 'old':saveCurrentAugmentedPose, 'new':JSON.stringify(augmented_poses[currentAugmentedPoseIndex])}});
		saveCurrentAugmentedPose = JSON.stringify(augmented_poses[currentAugmentedPoseIndex]);
		RemoveClass('#wyca_edit_map_svg .active', 'active');
		
		wycaCurrentAction = '';
		currentStep = '';
		
		$('#wyca_edit_map_boutonsRotate').hide();
		
		$('#wyca_edit_map_boutonsAugmentedPose').hide();
		$('#wyca_edit_map_boutonsStandard').show();
		$('#wyca_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		WycaSetModeSelect();
	}
}

function WycaAugmentedPoseCancel()
{
	WycaSaveElementNeeded(false);
	
	$('#wyca_edit_map_svg .augmented_pose_elem_current').remove();
	RemoveClass('#wyca_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (wycaCurrentAction == 'addAugmentedPose')
	{
		$('#wyca_edit_map_svg .augmented_pose_elem_0').remove();
	}
	else if (wycaCurrentAction == 'editAugmentedPose')
	{
		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		RemoveClass('#wyca_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'movable');
		
		augmented_poses[currentAugmentedPoseIndex] = JSON.parse(saveCurrentAugmentedPose);
		WycaTraceAugmentedPose(currentAugmentedPoseIndex);
	}
	wycaCurrentAction = '';
	currentStep = '';
	
	$('#wyca_edit_map_boutonsRotate').hide();
	
	$('#wyca_edit_map_boutonsAugmentedPose').hide();
	$('#wyca_edit_map_boutonsStandard').show();
	$('#wyca_edit_map_message_aide').hide();
	blockZoom = false;
	
	WycaSetModeSelect();
}

function WycaDeleteAugmentedPose(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	augmented_poses[indexInArray].deleted = true;
	
	WycaAddHistorique({'action':'delete_augmented_pose', 'data':indexInArray});
	
	data = augmented_poses[indexInArray];
	$('#wyca_edit_map_svg .augmented_pose_elem_'+data.id_augmented_pose).remove();
	
	RemoveClass('#wyca_edit_map_svg .active', 'active');
	
	wycaCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#wyca_edit_map_boutonsAugmentedPose').hide();
    $('#wyca_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	WycaSetModeSelect();
}

// DOCK FUNCS

function WycaDockSave()
{
	$('#wyca_edit_map_svg .dock_elem_current').remove();
	
	if (wycaCurrentAction == 'addDock')
	{
		WycaSaveElementNeeded(false);
		
		nextIdDock++;
		num = GetMaxNumDock()+1;
		d = {'id_docking_station':nextIdDock, 'id_map':id_map, 'id_fiducial':$(this).data('id_fiducial'), 'final_pose_x':currentDockPose.final_pose_x, 'final_pose_y':currentDockPose.final_pose_y, 'final_pose_t':currentDockPose.final_pose_t, 'approch_pose_x':currentDockPose.approch_pose_x, 'approch_pose_y':currentDockPose.approch_pose_y, 'approch_pose_t':currentDockPose.approch_pose_t, 'fiducial_pose_x':currentDockPose.fiducial_pose_x, 'fiducial_pose_y':currentDockPose.fiducial_pose_y, 'fiducial_pose_t':currentDockPose.fiducial_pose_t, 'num':parseInt(num), 'name':'Dock '+num, 'comment':''};
		WycaAddHistorique({'action':'add_dock', 'data':JSON.stringify(d)});
		
		docks.push(d);
		WycaTraceDock(docks.length-1);
		
		RemoveClass('#wyca_edit_map_svg .active', 'active');
		
		$('#wyca_edit_map_svg .dock_elem_0').remove();
		$('#wyca_edit_map_svg .dock_elem_current').remove();
		
		wycaCurrentAction = '';
		currentStep = '';
		
		$('#wyca_edit_map_boutonsRotate').hide();
	
		$('#wyca_edit_map_boutonsDock').hide();
		$('#wyca_edit_map_boutonsStandard').show();
		$('#wyca_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		WycaSetModeSelect();
	}
	else if (wycaCurrentAction == 'editDock')
	{	
		WycaSaveElementNeeded(false);
		
		
		dock = docks[currentDockIndex];
		RemoveClass('#wyca_edit_map_svg .dock_elem_'+dock.id_docking_station, 'movable');
		
		WycaAddHistorique({'action':'edit_dock', 'data':{'index':currentDockIndex, 'old':saveCurrentDock, 'new':JSON.stringify(docks[currentDockIndex])}});
		saveCurrentDock = JSON.stringify(docks[currentDockIndex]);
		RemoveClass('#wyca_edit_map_svg .active', 'active');
		
		wycaCurrentAction = '';
		currentStep = '';
		
		$('#wyca_edit_map_boutonsRotate').hide();
		
		$('#wyca_edit_map_boutonsDock').hide();
		$('#wyca_edit_map_boutonsStandard').show();
		$('#wyca_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		WycaSetModeSelect();
	}
}

function WycaDockCancel()
{
	WycaSaveElementNeeded(false);
	
	$('#wyca_edit_map_svg .dock_elem_current').remove();
	RemoveClass('#wyca_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (wycaCurrentAction == 'addDock')
	{
		$('#wyca_edit_map_svg .dock_elem_0').remove();
		$('#wyca_edit_map_svg .dock_elem_current').remove();
	}
	else if (wycaCurrentAction == 'editDock')
	{
		dock = docks[currentDockIndex];
		RemoveClass('#wyca_edit_map_svg .dock_elem_'+dock.id_docking_station, 'movable');
		
		docks[currentDockIndex] = JSON.parse(saveCurrentDock);
		WycaTraceDock(currentDockIndex);
	}
	wycaCurrentAction = '';
	currentStep = '';
	
	$('#wyca_edit_map_boutonsRotate').hide();
	
	$('#wyca_edit_map_boutonsDock').hide();
	$('#wyca_edit_map_boutonsStandard').show();
	$('#wyca_edit_map_message_aide').hide();
	blockZoom = false;
	
	WycaSetModeSelect();
}

function WycaDeleteDock(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	docks[indexInArray].deleted = true;
	
	WycaAddHistorique({'action':'delete_dock', 'data':indexInArray});
	
	data = docks[indexInArray];
	$('#wyca_edit_map_svg .dock_elem_'+data.id_docking_station).remove();
	
	RemoveClass('#wyca_edit_map_svg .active', 'active');
	
	wycaCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#wyca_edit_map_boutonsDock').hide();
    $('#wyca_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	WycaSetModeSelect();
}

// AREA FUNCS

function WycaAreaSave()
{
	$('#wyca_edit_map_svg .area_elem_current').remove();
	
	if (wycaCurrentAction == 'addArea')
	{
		WycaSaveElementNeeded(false);
		
		WycaAddHistorique({'action':'edit_area', 'data':{'index':currentAreaIndex, 'old':saveCurrentArea, 'new':JSON.stringify(areas[currentAreaIndex])}});
		
		saveCurrentArea = JSON.stringify(areas[currentAreaIndex]);
		/*
		RemoveClass('#wyca_edit_map_svg .active', 'active');
		RemoveClass('#wyca_edit_map_svg .activ_select', 'activ_select'); 
			
		
		wycaCurrentAction = '';
		currentStep = '';
		
		$('#wyca_edit_map_boutonsForbidden').hide();
		$('#wyca_edit_map_boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		WycaSetModeSelect();
		*/
		currentAreaWycaLongTouch = $('#wyca_edit_map_area_'+areas[currentAreaIndex].id_area);
		wycaCurrentAction = 'editArea';
		RemoveClass('#wyca_edit_map_svg .editing_point ', 'editing_point ');
		WycaDisplayMenu('wyca_edit_map_menu_area');
	}
	else if (wycaCurrentAction == 'editArea')
	{
		WycaSaveElementNeeded(false);
		
		WycaAddHistorique({'action':'edit_area', 'data':{'index':currentAreaIndex, 'old':saveCurrentArea, 'new':JSON.stringify(areas[currentAreaIndex])}});
		
		saveCurrentArea = JSON.stringify(areas[currentAreaIndex]);
		
		wycaCurrentAction = 'editArea';
		RemoveClass('#wyca_edit_map_svg .editing_point ', 'editing_point ');
		WycaDisplayMenu('wyca_edit_map_menu_area');
		/*
		RemoveClass('#wyca_edit_map_svg .active', 'active');
		
		wycaCurrentAction = '';
		currentStep = '';
		
		$('#wyca_edit_map_boutonsArea').hide();
		$('#wyca_edit_map_boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		WycaSetModeSelect();
		*/
	}
}

function WycaAreaCancel()
{
	WycaSaveElementNeeded(false);
	
	$('#wyca_edit_map_svg .area_elem_current').remove();
	//RemoveClass('#wyca_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	if(currentPointWycaLongTouch != null)
		currentPointWycaLongTouch.data('index_point',-1);
	currentPointWycaLongTouch = null;
	
	if (wycaCurrentAction == 'addArea')
	{
		WycaDeleteArea(currentAreaIndex);
		wycaHistoriques.pop();
		wycaHistoriqueIndex--;
		$('#wyca_edit_map .times_icon_menu').hide();
	}
	else if (wycaCurrentAction == 'editArea')
	{
		areas[currentAreaIndex] = JSON.parse(saveCurrentArea);
		WycaTraceArea(currentAreaIndex);
		wycaCurrentAction = 'editArea';
		WycaDisplayMenu('wyca_edit_map_menu_area');
	}
	
	currentStep = '';
	
	$('#wyca_edit_map_boutonsArea').hide();
	$('#wyca_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	//WycaSetModeSelect();
	
}

function WycaDeleteArea(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	areas[indexInArray].deleted = true;
	
	WycaAddHistorique({'action':'delete_area', 'data':indexInArray});
	
	data = areas[indexInArray];
	$('#wyca_edit_map_svg .area_elem_'+data.id_area).remove();
	
	RemoveClass('#wyca_edit_map_svg .active', 'active');
	
	wycaCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#wyca_edit_map_boutonsArea').hide();
    $('#wyca_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	WycaSetModeSelect();
}

// FORBIDDEN FUNCS

function WycaForbiddenSave(origin = false)
{
	$('#wyca_edit_map_container_all .forbidden_elem_current').remove();
	
	if (wycaCurrentAction == 'addForbiddenArea')
	{
		WycaSaveElementNeeded(false);
		
		WycaAddHistorique({'action':'edit_forbidden', 'data':{'index':currentForbiddenIndex, 'old':saveCurrentForbidden, 'new':JSON.stringify(forbiddens[currentForbiddenIndex])}});
		
		saveCurrentForbidden = JSON.stringify(forbiddens[currentForbiddenIndex]);
		/*
		RemoveClass('#wyca_edit_map_svg .active', 'active');
		RemoveClass('#wyca_edit_map_svg .activ_select', 'activ_select'); 
			
		
		wycaCurrentAction = '';
		currentStep = '';
		
		$('#wyca_edit_map_boutonsForbidden').hide();
		$('#wyca_edit_map_boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		WycaSetModeSelect();
		*/
		currentForbiddenWycaLongTouch = $('#wyca_edit_map_forbidden_'+forbiddens[currentForbiddenIndex].id_area);
		wycaCurrentAction = 'editForbiddenArea';
		RemoveClass('#wyca_edit_map_svg .editing_point ', 'editing_point ');
		if(origin == false)
			WycaDisplayMenu('wyca_edit_map_menu_forbidden');
		else{
			// UNSELECT POINT
			if(currentPointWycaLongTouch != null)
				currentPointWycaLongTouch.data('index_point',-1);
			currentPointWycaLongTouch = null;
			
			RemoveClass('#wyca_edit_map_svg .active', 'active');
			RemoveClass('#wyca_edit_map_svg .activ_select', 'activ_select'); 
			
			$('#wyca_edit_map_menu .bAddForbiddenArea').click();
		}
	}
	else if (wycaCurrentAction == 'editForbiddenArea')
	{	
		WycaSaveElementNeeded(false);
		
		WycaAddHistorique({'action':'edit_forbidden', 'data':{'index':currentForbiddenIndex, 'old':saveCurrentForbidden, 'new':JSON.stringify(forbiddens[currentForbiddenIndex])}});
		
		saveCurrentForbidden = JSON.stringify(forbiddens[currentForbiddenIndex]);
		
		wycaCurrentAction = 'editForbiddenArea';
		RemoveClass('#wyca_edit_map_svg .editing_point ', 'editing_point ');
		if(origin == false)
			WycaDisplayMenu('wyca_edit_map_menu_forbidden');
		else{
			// UNSELECT POINT
			if(currentPointWycaLongTouch != null)
				currentPointWycaLongTouch.data('index_point',-1);
			currentPointWycaLongTouch = null;
			
			RemoveClass('#wyca_edit_map_svg .active', 'active');
			RemoveClass('#wyca_edit_map_svg .activ_select', 'activ_select'); 
			
			$('#wyca_edit_map_menu .bAddForbiddenArea').click();
		}
		/*
		RemoveClass('#wyca_edit_map_svg .active', 'active');
		RemoveClass('#wyca_edit_map_svg .activ_select', 'activ_select'); 
			
		
		wycaCurrentAction = '';
		currentStep = '';
		
		$('#wyca_edit_map_boutonsForbidden').hide();
		$('#wyca_edit_map_boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		WycaSetModeSelect();
		*/
	}
}

function WycaForbiddenCancel()
{
	WycaSaveElementNeeded(false);
	
	$('#wyca_edit_map_svg .forbidden_elem_current').remove();
	//RemoveClass('#wyca_edit_map_svg .active', 'active');
	
	$('body').addClass('no_current');

	if(currentPointWycaLongTouch != null)
		currentPointWycaLongTouch.data('index_point',-1);
	currentPointWycaLongTouch = null;
	
	if (wycaCurrentAction == 'addForbiddenArea')
	{
		WycaDeleteForbidden(currentForbiddenIndex);
		wycaHistoriques.pop();
		wycaHistoriqueIndex--;
		$('#wyca_edit_map .times_icon_menu').hide();
	}
	else if (wycaCurrentAction == 'editForbiddenArea')
	{
		forbiddens[currentForbiddenIndex] = JSON.parse(saveCurrentForbidden);
		WycaTraceForbidden(currentForbiddenIndex);
		wycaCurrentAction = 'editForbiddenArea';
		WycaDisplayMenu('wyca_edit_map_menu_forbidden');
	}
	
	currentStep = '';
	
	$('#wyca_edit_map_boutonsForbidden').hide();
	$('#wyca_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	//WycaSetModeSelect();
}

function WycaDeleteForbidden(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	forbiddens[indexInArray].deleted = true;
	
	WycaAddHistorique({'action':'delete_forbidden', 'data':indexInArray});
	
	data = forbiddens[indexInArray];
	$('#wyca_edit_map_svg .forbidden_elem_'+data.id_area).remove();
	
	RemoveClass('#wyca_edit_map_svg .active', 'active');
	
	wycaCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	
	$('#wyca_edit_map_boutonsForbidden').hide();
    $('#wyca_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	WycaSetModeSelect();
}

// OTHER FUNCS
function WycaGoToPose(option,linear_tol = null,angular_tol = null)
{
	$('#wyca_edit_map .modalGoToPose').modal('hide');
	$('#wyca_edit_map .modalGoToPoseFlexible').modal('hide');
	
	console.log('WycaGoToPose');
	WycaHideCurrentMenu();
	
	$('#wyca_edit_map_bStop').show();
	WycaTraceGoToPose(xGotoPose,yGotoPose);
	
	switch(option){
		case 'A':
			wycaApi.on('onGoToPoseAccurateResult', function (data){
					$('#wyca_edit_map_bStop').hide();
					$('#wyca_edit_map_svg .go_to_pose_elem').remove();
					WycaDisplayApiMessageGoTo(data);
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoseAccurateResult', onGoToPoseAccurateResult);
				});
				
			wycaApi.GoToPoseAccurate(xROSGotoPose, yROSGotoPose, 0, 0, function (data){
				
				if (data.A != wycaApi.AnswerCode.NO_ERROR){
					$('#wyca_edit_map_bStop').hide();
					$('#wyca_edit_map_svg .go_to_pose_elem').remove();
					WycaDisplayApiMessageGoTo(data);
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoseAccurateResult', onGoToPoseAccurateResult);
				}
			});
		break;
		case 'F':
			if(typeof(linear_tol) != 'number' || linear_tol < 0.05 || linear_tol > 10 || typeof(angular_tol) != 'number' || angular_tol < 2 || angular_tol > 360){
				
				$('#wyca_edit_map_bStop').hide();
				$('#wyca_edit_map_svg .go_to_pose_elem').remove();
				wycaApi.on('onGoToPoseFlexibleResult', onGoToPoseFlexibleResult);
				alert_wyca(textErrorInput);
			}else{
				wycaApi.on('onGoToPoseFlexibleResult', function (data){
					$('#wyca_edit_map_bStop').hide();
					$('#wyca_edit_map_svg .go_to_pose_elem').remove();
					WycaDisplayApiMessageGoTo(data);
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoseFlexibleResult', onGoToPoseFlexibleResult);
				});
				angular_tol = angular_tol * Math.PI/180;
				wycaApi.GoToPoseFlexible(xROSGotoPose, yROSGotoPose, 0, linear_tol,angular_tol, function (data){
					if (data.A != wycaApi.AnswerCode.NO_ERROR){
						$('#wyca_edit_map_bStop').hide();
						$('#wyca_edit_map_svg .go_to_pose_elem').remove();
						WycaDisplayApiMessageGoTo(data);
						// On rebranche l'ancienne fonction
						wycaApi.on('onGoToPoseFlexibleResult', onGoToPoseFlexibleResult);
					}
				});
			}
		break;
		default : 
			wycaApi.on('onGoToPoseResult', function (data){
				$('#wyca_edit_map_bStop').hide();
				$('#wyca_edit_map_svg .go_to_pose_elem').remove();
				WycaDisplayApiMessageGoTo(data);
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToPoseResult', onGoToPoseResult);
			});
			
			wycaApi.GoToPose(xROSGotoPose, yROSGotoPose, 0, 0, function (data){
				if (data.A != wycaApi.AnswerCode.NO_ERROR){
					$('#wyca_edit_map_bStop').hide();
					$('#wyca_edit_map_svg .go_to_pose_elem').remove();
					WycaDisplayApiMessageGoTo(data);
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoseResult', onGoToPoseResult);
				}
			});
		break;
	}
}

function WycaDisplayApiMessageGoTo(data)
{

	if (data.A == wycaApi.AnswerCode.NO_ERROR)
	{
		//SI SUCCESS
		wycaApi.PlaySound(wycaApi.SOUND.SUCCESS, 1);
		$('#wyca_edit_map .modalFinTest section.panel-success').show();
		$('#wyca_edit_map .modalFinTest section.panel-danger').hide();
		$('#wyca_edit_map .modalFinTest section.panel-warning').hide();
		
		$('#wyca_edit_map .modalFinTest').modal('show');
	}
	else
	{	
		let html,target;
		if(data.A == wycaApi.AnswerCode.CANCELED){
			//SI CANCELED
			$('#wyca_edit_map .modalFinTest section.panel-success').hide();
			$('#wyca_edit_map .modalFinTest section.panel-danger').hide();
			$('#wyca_edit_map .modalFinTest section.panel-warning').show();
			
			html = typeof(textActionCanceled) != 'undefined' ? textActionCanceled : wycaApi.AnswerCodeToString(data.A);
			target = $('#wyca_edit_map .modalFinTest section.panel-warning span.error_details');
		}else{
			//SI ERROR
			wycaApi.PlaySound(wycaApi.SOUND.ALERT, 1);
			$('#wyca_edit_map .modalFinTest section.panel-success').hide();
			$('#wyca_edit_map .modalFinTest section.panel-danger').show();
			$('#wyca_edit_map .modalFinTest section.panel-warning').hide();
			
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
					html += '<span class="details">'+data.M+'</span>';
				else
					html += '<span>'+data.M+'</span>';
			}
			target = $('#wyca_edit_map .modalFinTest section.panel-danger span.error_details');
		}
		
		target.html(html);
		$('#wyca_edit_map .modalFinTest').modal('show');
	}
	
}

function WycaRefreshAllPath()
{
}

function WycaRefreshZoomView()
{
	pSVG = $('#wyca_edit_map_svg').position();
	pImg = $('#wyca_edit_map_svg image').position();
	pImg.left -= pSVG.left;
	pImg.top -= pSVG.top;
	
	//zoom = ros_largeur / $('#wyca_edit_map_svg').width() / window.panZoom.getZoom();
	zoom = WycaGetZoom();
	
	wZoom = $('#wyca_edit_map_zoom_carte').width();
	hZoom = $('#wyca_edit_map_zoom_carte').height();
	
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
	
	hNew = $('#wyca_edit_map_svg').height() * zoom  / ros_largeur * wZoom;
	wNew = $('#wyca_edit_map_svg').width() * zoom  / ros_largeur * wZoom;
	
	//if (tNew + hNew > hZoom) hNew = hZoom - tNew;
	//if (lNew + wNew > wZoom) wNew = wZoom - lNew;
		
	$('#wyca_edit_map_zone_zoom').width(wNew);
	$('#wyca_edit_map_zone_zoom').height(hNew);
				
	$('#wyca_edit_map_zone_zoom').css('top', tNew - 1);
	$('#wyca_edit_map_zone_zoom').css('left', lNew - 1);
	
}