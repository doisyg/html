// JavaScript Document
var svgWycaByStep;
var wyca_bystepCurrentAction = '';
var wyca_bystepDownOnSVG = false;
var wyca_bystepDownOnSVG_x = 0;
var wyca_bystepDownOnSVG_y = 0;
var wyca_bystepDownOnSVG_x_scroll = 0;
var wyca_bystepDownOnSVG_y_scroll = 0;
var wyca_bystepCanChangeMenu = true;
var wyca_bystepSavedCanClose = true;

var xGotoPose = 0 ;
var yGotoPose = 0 ;

function WycaByStepAvertCantChange()
{
	$('#wyca_by_step_edit_map_bModalCancelEdit').click();
}

function WycaByStepCloseSelect()
{
	wyca_bystepCurrentAction = '';
	currentStep = '';
}

function WycaByStepHideCurrentMenu()
{
	/*
	if (wyca_bystepCurrentAction == 'export') CloseExport();
	if (wyca_bystepCurrentAction == 'jobs') CloseJobs();
	if (wyca_bystepCurrentAction == 'select') WycaByStepCloseSelect()
	*/
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	$('body').attr('class', 'no_current');

	wyca_bystepCurrentAction = '';
	currentStep = '';
	
	WycaByStepHideMenus();
}

function WycaByStepHideCurrentMenuNotSelect()
{
	if (wyca_bystepCurrentAction == 'select') return;
	
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	$('body').attr('class', 'no_current');
	
	wyca_bystepCurrentAction = '';
	currentStep = '';
	
	WycaByStepHideMenus();
}

var wyca_bystepHistoriques = Array();
var wyca_bystepHistoriqueIndex = -1;

function WycaByStepUndo()
{
	wyca_bystepSavedCanClose = false;
	
	elem = wyca_bystepHistoriques[wyca_bystepHistoriqueIndex];
	switch(elem.action)
	{
		case 'gomme':
			gommes.pop();
			$('#wyca_by_step_edit_map_svg .gomme_elem_current_'+gommes.length).remove();
			break;
		case 'add_forbidden':
			forbiddens.pop();
			f = JSON.parse(elem.data);
			$('#wyca_by_step_edit_map_svg .forbidden_elem_'+f.id_area).remove();
			break;
		case 'edit_forbidden':
			forbiddens[elem.data.index] = JSON.parse(elem.data.old);
			WycaByStepTraceForbidden(elem.data.index);
			break;
		case 'delete_forbidden':
			forbiddens[elem.data].deleted = false;
			WycaByStepTraceForbidden(elem.data);
			break;
		case 'add_area':
			areas.pop();
			a = JSON.parse(elem.data);
			$('#wyca_by_step_edit_map_svg .area_elem_'+a.id_area).remove();
			break;
		case 'edit_area':
			areas[elem.data.index] = JSON.parse(elem.data.old);
			WycaByStepTraceArea(elem.data.index);
			break;
		case 'delete_area':
			areas[elem.data].deleted = false;
			WycaByStepTraceArea(elem.data);
			break;
		case 'add_dock':
			docks.pop();
			d = JSON.parse(elem.data);
			$('#wyca_by_step_edit_map_svg .dock_elem_'+d.id_docking_station).remove();
			break;
		case 'edit_dock':
			docks[elem.data.index] = JSON.parse(elem.data.old);
			WycaByStepTraceDock(elem.data.index);
			break;
		case 'delete_dock':
			docks[elem.data].deleted = false;
			WycaByStepTraceDock(elem.data);
			break;
		case 'add_poi':
			pois.pop();
			p = JSON.parse(elem.data);
			$('#wyca_by_step_edit_map_svg .poi_elem_'+p.id_poi).remove();
			break;
		case 'edit_poi':
			pois[elem.data.index] = JSON.parse(elem.data.old);
			WycaByStepTracePoi(elem.data.index);
			break;
		case 'delete_poi':
			pois[elem.data].deleted = false;
			WycaByStepTracePoi(elem.data);
			break;
		case 'add_augmented_pose':
			augmented_poses.pop();
			a = JSON.parse(elem.data);
			$('#wyca_by_step_edit_map_svg .augmented_pose_elem_'+a.id_augmented_pose).remove();
			break;
		case 'edit_augmented_pose':
			augmented_poses[elem.data.index] = JSON.parse(elem.data.old);
			WycaByStepTraceAugmentedPose(elem.data.index);
			break;
		case 'delete_augmented_pose':
			augmented_poses[elem.data].deleted = false;
			WycaByStepTraceAugmentedPose(elem.data);
			break;
	}
	wyca_bystepHistoriqueIndex--;
	
	WycaByStepRefreshHistorique();
}

function WycaByStepRedo()
{
	wyca_bystepSavedCanClose = false;
	
	wyca_bystepHistoriqueIndex++;
	
	elem = wyca_bystepHistoriques[wyca_bystepHistoriqueIndex];
	switch(elem.action)
	{
		case 'gomme':
			gommes.push(elem.data);
			WycaByStepTraceCurrentGomme(gommes[gommes.length-1], gommes.length-1)
			break;
		case 'add_forbidden':
			forbiddens.push(JSON.parse(elem.data));
			WycaByStepTraceForbidden(forbiddens.length-1);
			break;
		case 'edit_forbidden':
			forbiddens[elem.data.index] = JSON.parse(elem.data.new);
			WycaByStepTraceForbidden(elem.data.index);
			break;
		case 'delete_forbidden':
			forbiddens[elem.data].deleted = true;
			WycaByStepTraceForbidden(elem.data);
			break;
		case 'add_area':
			areas.push(JSON.parse(elem.data));
			WycaByStepTraceArea(areas.length-1);
			break;
		case 'edit_area':
			areas[elem.data.index] = JSON.parse(elem.data.new);
			WycaByStepTraceArea(elem.data.index);
			break;
		case 'delete_area':
			areas[elem.data].deleted = true;
			WycaByStepTraceArea(elem.data);
			break;
		case 'add_dock':
			docks.push(elem.data);
			WycaByStepTraceDock(docks.length-1);
			break;
		case 'edit_dock':
			docks[elem.data.index] = JSON.parse(elem.data.new);
			WycaByStepTraceDock(elem.data.index);
			break;
		case 'delete_dock':
			docks[elem.data].deleted = true;
			WycaByStepTraceDock(elem.data);
			break;
		case 'add_poi':
			pois.push(JSON.parse(elem.data));
			WycaByStepTracePoi(pois.length-1);
			break;
		case 'edit_poi':
			pois[elem.data.index] = JSON.parse(elem.data.new);
			WycaByStepTracePoi(elem.data.index);
			break;
		case 'delete_poi':
			pois[elem.data].deleted = true;
			WycaByStepTracePoi(elem.data);
			break;
		case 'add_augmented_pose':
			augmented_poses.push(JSON.parse(elem.data));
			WycaByStepTraceAugmentedPose(augmented_poses.length-1);
			break;
		case 'edit_augmented_pose':
			augmented_poses[elem.data.index] = JSON.parse(elem.data.new);
			WycaByStepTraceAugmentedPose(elem.data.index);
			break;
		case 'delete_augmented_pose':
			augmented_poses[elem.data].deleted = true;
			WycaByStepTraceAugmentedPose(elem.data);
			break;
	}
	
	WycaByStepRefreshHistorique();
}

function WycaByStepAddHistorique(elem)
{
	wyca_bystepSavedCanClose = false;
	
	while (wyca_bystepHistoriqueIndex < wyca_bystepHistoriques.length-1)
		wyca_bystepHistoriques.pop();
	
	wyca_bystepHistoriques.push(elem);
	wyca_bystepHistoriqueIndex++;
	
	WycaByStepRefreshHistorique();
}

function WycaByStepRefreshHistorique()
{
	if (wyca_bystepHistoriqueIndex == -1)
		$('#wyca_by_step_edit_map_bUndo').addClass('disabled');
	else
		$('#wyca_by_step_edit_map_bUndo').removeClass('disabled');
	if (wyca_bystepHistoriqueIndex == wyca_bystepHistoriques.length-1)
		$('#wyca_by_step_edit_map_bRedo').addClass('disabled');
	else
		$('#wyca_by_step_edit_map_bRedo').removeClass('disabled');
}

function WycaByStepSetModeSelect()
{
	$('body').addClass('select');
	wyca_bystepCurrentAction = 'select';
	currentStep = '';
}

function WycaByStepSaveElementNeeded(need)
{
	//ADD CODE POUR CROIX SUR ICON_MENU
	wyca_bystepCanChangeMenu = !need;
	if (need)
	{
		$('#wyca_by_step_edit_map .times_icon_menu').addClass('dnone')
		$('#wyca_by_step_edit_map .times_icon_menu').hide()
		$('#wyca_by_step_edit_map_bSaveCurrentElem').show();
		$('#wyca_by_step_edit_map_bCancelCurrentElem').show();
		if(wyca_bystepCurrentAction == "addForbiddenArea" || wyca_bystepCurrentAction == "editForbiddenArea"){
			$('#wyca_by_step_edit_map .bDeleteForbidden').addClass('disabled');
			$('#wyca_by_step_edit_map_bPlusCurrentElem').show();
		}
		if(wyca_bystepCurrentAction == "addArea" || wyca_bystepCurrentAction == "editArea" || wyca_bystepCurrentAction == "moveArea"){
			$('#wyca_by_step_edit_map #wyca_by_step_edit_map_menu_area .btn-menu').addClass('disabled');
			$('#wyca_by_step_edit_map #wyca_by_step_edit_map_menu_area .btn-menu[data-orientation="H"]').hide();
		}
	}
	else
	{
		if($('#wyca_by_step_edit_map .icon_menu:visible').length > 0){
			$('#wyca_by_step_edit_map .times_icon_menu').removeClass('dnone')
			$('#wyca_by_step_edit_map .times_icon_menu').show('fast')
		}
		$('#wyca_by_step_edit_map_bPlusCurrentElem').hide();
		$('#wyca_by_step_edit_map_bSaveCurrentElem').hide();
		$('#wyca_by_step_edit_map_bCancelCurrentElem').hide();
		if(wyca_bystepCurrentAction == "addForbiddenArea" || wyca_bystepCurrentAction == "editForbiddenArea"){
			$('#wyca_by_step_edit_map .bDeleteForbidden').removeClass('disabled');
		}
		if(wyca_bystepCurrentAction == "addArea" || wyca_bystepCurrentAction == "editArea" || wyca_bystepCurrentAction == "moveArea"){
			$('#wyca_by_step_edit_map #wyca_by_step_edit_map_menu_area .btn-menu').removeClass('disabled');
			$('#wyca_by_step_edit_map #wyca_by_step_edit_map_menu_area .btn-menu[data-orientation="H"]').show();
		}
	}
}

$(document).ready(function() {
	/* RELOAD MAP */
	
	$('#wyca_by_step_edit_map #wyca_by_step_edit_map_bAbortReloadMap').click(function(){
		$('#wyca_by_step_edit_map .modalConfirmNoReloadMap').modal('show');
	})
	
	$('#wyca_by_step_edit_map .modalReloadMap .wyca_by_step_edit_map_bReloadMap').click(function(){
		$('#wyca_by_step_edit_map .modalReloadMap .btn').addClass('disabled');
		$('#wyca_by_step_edit_map .modalReloadMap .wyca_by_step_edit_map_modalReloadMap_loading').show();
		GetInfosCurrentMapWycaByStep();
	})
	
	$('#wyca_by_step_edit_map .modalConfirmNoReloadMap .wyca_by_step_edit_map_bReloadMap').click(function(){
		$('#wyca_by_step_edit_map .modalConfirmNoReloadMap .btn').addClass('disabled');
		$('#wyca_by_step_edit_map .modalConfirmNoReloadMap .wyca_by_step_edit_map_modalReloadMap_loading').show();
		GetInfosCurrentMapWycaByStep();
	})
	
	if($('#wyca_by_step_edit_map .select_area_sound').length > 0 && typeof(wycaApi) != 'undefined' && typeof(wycaApi.SOUND) != 'undefined' ){
		for (const [key, value] of Object.entries(wycaApi.SOUND)) {
			$('#wyca_by_step_edit_map .select_area_sound').append('<option value="'+value+'">'+key+'</option>')
		}
	}
	
	window.addEventListener('beforeunload', function(e){
		if (!wyca_bystepSavedCanClose)
		{
			(e || window.event).returnValue = (typeof(textAreYouSureToLeave) !='undefined' ? textAreYouSureToLeave : 'Are you sure you want to leave?');
			return (typeof(textAreYouSureToLeave) !='undefined' ? textAreYouSureToLeave : 'Are you sure you want to leave?');
		}
	});
	
	if ($( window ).width() > 1920)
	{
		minStokeWidth = 3;
		maxStokeWidth = 7;
	}
	
	$('body').addClass('no_current');
	
	svgWycaByStep = document.querySelector('#wyca_by_step_edit_map_svg');
	InitSVG();
	
	$('#wyca_by_step_edit_map #wyca_by_step_edit_map_bEndGomme').click(function(e) {
        e.preventDefault();
		
		wyca_bystepCanChangeMenu = true;
		$('#wyca_by_step_edit_map_bEndGomme').hide();
		$('#wyca_by_step_edit_map_bCancelGomme').hide();
		wyca_bystepCurrentAction = '';
		currentStep = '';
		$('body').addClass('no_current');
		blockZoom = false;
		WycaByStepHideMenus();
		WycaByStepSetModeSelect();
		
    });
	
	$('#wyca_by_step_edit_map #wyca_by_step_edit_map_bCancelGomme').click(function(e) {
        e.preventDefault();
		
		let lg = gommes.length;
		gommes.pop[lg-1];
		$('#wyca_by_step_edit_map_svg .gomme_elem_current_'+(lg-1)).remove();
		
		wyca_bystepCanChangeMenu = true;
		$('#wyca_by_step_edit_map_bEndGomme').hide();
		$('#wyca_by_step_edit_map_bCancelGomme').hide();
		$('.times_icon_menu').show('fast');
		
		sizeGomme = $('#wyca_by_step_edit_map_menu_erase .bGommeSize.selected').data('size');
		wyca_bystepCurrentAction = 'gomme';
		currentStep = '';
		
		$('body').removeClass('no_current');
		$('body').addClass('gomme');
    });
	
	$('#wyca_by_step_edit_map #wyca_by_step_edit_map_bStop').click(function(e) {
        e.preventDefault();
		
		wycaApi.StopMove();	
    });
	
	$('#wyca_by_step_edit_map #wyca_by_step_edit_map_bPlusCurrentElem').click(function(e) {
        e.preventDefault();
		if (wyca_bystepCurrentAction == 'addForbiddenArea' || wyca_bystepCurrentAction == 'editForbiddenArea')
			ForbiddenSave('plus');
    });
	
	$('#wyca_by_step_edit_map #wyca_by_step_edit_map_bSaveCurrentElem').click(function(e) {
        e.preventDefault();
		
		if (wyca_bystepCurrentAction == 'addPoi' || wyca_bystepCurrentAction == 'editPoi')
			PoiSave();
		else if (wyca_bystepCurrentAction == 'addAugmentedPose' || wyca_bystepCurrentAction == 'editAugmentedPose')
			AugmentedPoseSave();
		else if (wyca_bystepCurrentAction == 'addDock' || wyca_bystepCurrentAction == 'editDock')
			DockSave();
		else if (wyca_bystepCurrentAction == 'addArea')
			AreaSave('save');
		else if (wyca_bystepCurrentAction == 'editArea')
			AreaSave();
		else if (wyca_bystepCurrentAction == 'moveArea')
			AreaSave();
		else if (wyca_bystepCurrentAction == 'addForbiddenArea' || wyca_bystepCurrentAction == 'editForbiddenArea')
			ForbiddenSave();
		
    });
	
	$('#wyca_by_step_edit_map #wyca_by_step_edit_map_bCancelCurrentElem').click(function(e) {
        e.preventDefault();
		WycaByStepHideMenus();
		if (wyca_bystepCurrentAction == 'addPoi' || wyca_bystepCurrentAction == 'editPoi')
			PoiCancel();
		else if (wyca_bystepCurrentAction == 'addAugmentedPose' || wyca_bystepCurrentAction == 'editAugmentedPose')
			AugmentedPoseCancel();
		else if (wyca_bystepCurrentAction == 'addDock' || wyca_bystepCurrentAction == 'editDock')
			DockCancel();
		else if (wyca_bystepCurrentAction == 'addArea' || wyca_bystepCurrentAction == 'editArea' || wyca_bystepCurrentAction == 'moveArea')
			AreaCancel();
		else if (wyca_bystepCurrentAction == 'addForbiddenArea' || wyca_bystepCurrentAction == 'editForbiddenArea')
			ForbiddenCancel();	
		
    });
	
	/* BTNS HISTORIQUE */
	
	$('#wyca_by_step_edit_map_bUndo').click(function(e) {
        e.preventDefault();
		if(!wyca_bystepCanChangeMenu)
			WycaByStepShakeActiveElement()
		else
			if (!$('#wyca_by_step_edit_map_bUndo').hasClass('disabled'))
				WycaByStepUndo();
	});
	/*
	$('#wyca_by_step_edit_map_bUndo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#wyca_by_step_edit_map_bUndo').hasClass('disabled'))
			WycaByStepUndo();
	});
	*/
	$('#wyca_by_step_edit_map_bRedo').click(function(e) {
        e.preventDefault();
		if(!wyca_bystepCanChangeMenu)
			WycaByStepShakeActiveElement()
		else
			if (!$('#wyca_by_step_edit_map_bRedo').hasClass('disabled'))
				WycaByStepRedo();
    });
	/*
	$('#wyca_by_step_edit_map_bRedo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#wyca_by_step_edit_map_bRedo').hasClass('disabled'))
			WycaByStepRedo();
	});
	*/
	$(document).on('touchstart', '#wyca_by_step_edit_map_svg .movable', function(e) {
		if (wyca_bystepCurrentAction != 'gomme')
		{
			touchStarted = true;
			downOnMovable = true;
			movableDown = $(this);
			//console.log('breakpoint');
			
			if($(this).attr('x') == $(this).attr('y') && $(this).attr('y') == undefined){
				//MOVING POLYGON
				showPopupZoom = false;
					
				wyca_bystepDownOnSVG_x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
				wyca_bystepDownOnSVG_y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
			}else{	
				showPopupZoom = true;
				wyca_bystepDownOnSVG_x = parseFloat($(this).attr('x')) + parseFloat($(this).attr('width'))/2;
				wyca_bystepDownOnSVG_y = parseFloat($(this).attr('y')) + parseFloat($(this).attr('height'))/2;
				
				p = $('#wyca_by_step_edit_map_svg image').position();
				zoom = WycaByStepGetZoom();
				
				wyca_bystepDownOnSVG_x = wyca_bystepDownOnSVG_x / zoom + p.left;
				wyca_bystepDownOnSVG_y = wyca_bystepDownOnSVG_y / zoom + p.top;
				
			}
			
			WycaByStepSaveElementNeeded(true);
			
			blockZoom = true;
		}
    });
	
	$(document).on('touchstart', '#wyca_by_step_edit_map_svg .secable', function(e) {
		zoom = WycaByStepGetZoom();
		if (wyca_bystepCurrentAction == 'editForbiddenArea' || wyca_bystepCurrentAction == 'addForbiddenArea')
		{
			p = $('#wyca_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[e.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[e.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			tailleArea = 1*zoom;
			tailleArea = 1;
			
			
			forbiddens[currentForbiddenIndex].points.splice($(this).data('index_point'), 0, {x:xRos, y:yRos});
			WycaByStepTraceForbidden(currentForbiddenIndex);
			WycaByStepSaveElementNeeded(true);
		}
		else if (wyca_bystepCurrentAction == 'editArea' || wyca_bystepCurrentAction == 'addArea')
		{
			p = $('#wyca_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[e.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[e.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			tailleArea = 1*zoom;
			tailleArea = 1;
			
			
			areas[currentAreaIndex].points.splice($(this).data('index_point'), 0, {x:xRos, y:yRos});
			WycaByStepTraceArea(currentAreaIndex);
			WycaByStepSaveElementNeeded(true);
		}
    });
	
	/* MENU POINT */
	
	$('#wyca_by_step_edit_map_menu_point .bDeletePoint').click(function(e) {
        e.preventDefault();
		WycaByStepHideMenus();
		if (wyca_bystepCurrentAction == 'editForbiddenArea' || wyca_bystepCurrentAction == 'addForbiddenArea')
		{
			forbiddens[currentForbiddenIndex].points.splice(currentPointWycaByStepLongTouch.data('index_point'), 1);
			
			currentPointWycaByStepLongTouch = null;
			WycaByStepTraceForbidden(currentForbiddenIndex);
			WycaByStepSaveElementNeeded(false);
			WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_forbidden');
		}
		else if (wyca_bystepCurrentAction == 'editArea' || wyca_bystepCurrentAction == 'addArea')
		{
			areas[currentAreaIndex].points.splice(currentPointWycaByStepLongTouch.data('index_point'), 1);
			currentPointWycaByStepLongTouch = null;
			WycaByStepTraceArea(currentAreaIndex);
			WycaByStepSaveElementNeeded(false);
			WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_area');
		}
    });
	
	/* MENU FORBIDDEN */
	
	$('#wyca_by_step_edit_map_menu_forbidden .bDeleteForbidden').click(function(e) {
        e.preventDefault();
		WycaByStepSaveElementNeeded(false);
		WycaByStepHideMenus();
		if (wyca_bystepCurrentAction == "select" || wyca_bystepCurrentAction == 'editForbiddenArea')
		{
			i = GetForbiddenIndexFromID(currentForbiddenWycaByStepLongTouch.data('id_area'));
			DeleteForbidden(i);	
		}
    });
	
	/* MENU AREA */
	
	$('#wyca_by_step_edit_map_menu_area .bDeleteArea').click(function(e) {
        e.preventDefault();
		WycaByStepHideMenus();
		if (wyca_bystepCurrentAction == "select" || wyca_bystepCurrentAction == 'editArea')
		{
			i = GetAreaIndexFromID(currentAreaWycaByStepLongTouch.data('id_area'));
			DeleteArea(i);	
		}
    });
	
	$('#wyca_by_step_edit_map_menu_area .bConfigArea').click(function(e) {
        e.preventDefault();
		//WycaByStepHideMenus();
		if (wyca_bystepCurrentAction == "select" || wyca_bystepCurrentAction == 'editArea')
		{
			currentAreaIndex = GetAreaIndexFromID(currentAreaWycaByStepLongTouch.data('id_area'));
			area = areas[currentAreaIndex];
			
			//INIT AREA CONFIGS
			$('#wyca_by_step_edit_map_area_name').val('');
			$('#wyca_by_step_edit_map_led_color_mode').val('Automatic');
			$('#wyca_by_step_edit_map_led_animation_mode').val('Automatic');
			$('#wyca_by_step_edit_map_min_distance_obstacle_mode').val('Automatic');
			$('#wyca_by_step_edit_map_max_speed_mode').val('Automatic');
			$('#wyca_by_step_edit_map_area_sound').val(-1);
				
			if (area.configs != undefined && area.configs.length > 0)
			{
				
				$.each(area.configs, function( indexConfig, config ) {
					switch(config.name)
					{
						case 'name': $('#wyca_by_step_edit_map_area_name').val(config.value); break;
						case 'led_color_mode': $('#wyca_by_step_edit_map_led_color_mode').val(config.value); break;
						case 'led_color': $('#wyca_by_step_edit_map_led_color').val(config.value); break;
						case 'led_animation_mode': $('#wyca_by_step_edit_map_led_animation_mode').val(config.value); break;
						case 'led_animation': $('#wyca_by_step_edit_map_led_animation').val(config.value); break;
						case 'max_speed_mode': $('#wyca_by_step_edit_map_max_speed_mode').val(config.value); break;
						case 'max_speed': $('#wyca_by_step_edit_map_max_speed').val(config.value); break;
						case 'min_distance_obstacle_mode': $('#wyca_by_step_edit_map_min_distance_obstacle_mode').val(config.value); break;
						case 'min_distance_obstacle': $('#wyca_by_step_edit_map_min_distance_obstacle').val(config.value*100); break;
						case 'sound': $('#wyca_by_step_edit_map_area_sound').val(config.value); break;
					}
				});
			}
			
			$('#wyca_by_step_edit_map_area_color').val('rgb('+area.color_r+','+area.color_g+','+area.color_b+')');
			
			if ($('#wyca_by_step_edit_map_led_color_mode').val() == 'Automatic') $('#wyca_by_step_edit_map_led_color_group').hide(); else  $('#wyca_by_step_edit_map_led_color_group').show();
			if ($('#wyca_by_step_edit_map_led_animation_mode').val() == 'Automatic') $('#wyca_by_step_edit_map_led_animation_group').hide(); else  $('#wyca_by_step_edit_map_led_animation_group').show();
			if ($('#wyca_by_step_edit_map_max_speed_mode').val() == 'Automatic') $('#wyca_by_step_edit_map_max_speed_group').hide(); else  $('#wyca_by_step_edit_map_max_speed_group').show();
			if ($('#wyca_by_step_edit_map_min_distance_obstacle_mode').val() == 'Automatic') $('#wyca_by_step_edit_map_min_distance_obstacle_group').hide(); else  $('#wyca_by_step_edit_map_min_distance_obstacle_group').show();
			
			$('#wyca_by_step_edit_map_container_all .modalAreaOptions .preview_color').click();
			$('#wyca_by_step_edit_map_container_all .modalAreaOptions .iro-colorpicker').hide();
			
			$('#wyca_by_step_edit_map_container_all .modalAreaOptions').modal('show');
		}
    });
	
	$('#wyca_by_step_edit_map_menu_area .bCopyArea').click(function(e) {
        e.preventDefault();
		//WycaByStepHideMenus();
		if (wyca_bystepCurrentAction == "select" || wyca_bystepCurrentAction == 'editArea')
		{
			currentAreaIndex = GetAreaIndexFromID(currentAreaWycaByStepLongTouch.data('id_area'));
			area = areas[currentAreaIndex];
			tempAreaCopy = JSON.stringify(area);
			WycaByStepHideMenus();
			if (wyca_bystepCanChangeMenu)
			{
				//CURRENT ACTION TARGET
				wyca_bystepCurrentAction = 'prepareArea';
				wyca_bystepCanChangeMenu = false;
				//AJOUT ICON MENU + CROIX
				$('#wyca_by_step_edit_map .burger_menu').hide('fast');
				$('#wyca_by_step_edit_map .icon_menu[data-menu="wyca_by_step_edit_map_menu_area"]').show('fast');
				setTimeout(function(){$('#wyca_by_step_edit_map .times_icon_menu').show('fast')},50);
			}
		}
    });
	
	$('#wyca_by_step_edit_map_menu_area .bMoveArea').click(function(e) {
        e.preventDefault();
		//WycaByStepHideMenus();
		
		if (wyca_bystepCanChangeMenu && wyca_bystepCurrentAction == 'editArea' && currentSelectedItem.length == 1 && currentSelectedItem[0].type == 'area' )
		{
			currentAreaIndex = GetAreaIndexFromID(currentAreaWycaByStepLongTouch.data('id_area'));
			area = areas[currentAreaIndex];
			WycaByStepHideMenus();
			$('#wyca_by_step_edit_map .burger_menu').hide();
			$('#wyca_by_step_edit_map .icon_menu[data-menu="wyca_by_step_edit_map_menu_area"]').show('fast');
			WycaByStepSaveElementNeeded(true);
			wyca_bystepCanChangeMenu = false;
			wyca_bystepCurrentAction = 'moveArea';
			AddClass('#wyca_by_step_edit_map_svg .area_elem_'+currentSelectedItem[0].id, 'moving');
			AddClass('#wyca_by_step_edit_map_svg polygon.area_elem_'+currentSelectedItem[0].id, 'movable');
		}
    });
	
	/* MENU DOCK */
	
	$('#wyca_by_step_edit_map_menu_dock .bDeleteDock').click(function(e) {
        e.preventDefault();
		WycaByStepHideMenus();
		i = GetDockIndexFromID(currentDockWycaByStepLongTouch.data('id_docking_station'));
		DeleteDock(i);
    });
	
	$('#wyca_by_step_edit_map_menu_dock .bConfigDock').click(function(e) {
        e.preventDefault();
		//WycaByStepHideMenus();
		wyca_bystepCurrentAction = 'editDock';
	
		currentDockIndex = GetDockIndexFromID(currentDockWycaByStepLongTouch.data('id_docking_station'));
		dock = docks[currentDockIndex];
		$('#wyca_by_step_edit_map_dock_is_master').prop('checked', dock.is_master);
		$('#wyca_by_step_edit_map_dock_fiducial_number').val(dock.id_fiducial);
		$('#wyca_by_step_edit_map_dock_number').val(dock.num);
		$('#wyca_by_step_edit_map_dock_name').val(dock.name);
		$('#wyca_by_step_edit_map_dock_comment').val(dock.comment);
		
		$('#wyca_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure li').remove();
		
		if (dock.undock_path.length > 0)
		{
			$.each(dock.undock_path, function( indexConfig, undock_step ) {
	
				//console.log(undock_step);
				indexDockElem++;
				
				if (undock_step.linear_distance != 0)
				{				
					distance = undock_step.linear_distance;
					direction = undock_step.linear_distance > 0 ? 'front':'back';
					
					$('#wyca_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
						'<li id="wyca_by_step_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="move" data-distance="' + distance + '">'+
						'	<span>' + (typeof(textUndockPathMove) != 'undefined' ? textUndockPathMove : 'Move') + ((direction == 'back')?'back':'front') + ' ' + ((direction == 'back')?distance*-1:distance) + 'm</span>'+
						'	<a href="#" class="bWycaByStepUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bWycaByStepUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				else
				{	
					angle = undock_step.angular_distance * 180 / Math.PI;
					angle = Math.round(angle*100)/100;
					
					$('#wyca_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
						'<li id="wyca_by_step_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="rotate" data-angle="'+angle+'">'+
						'	<span>' + (typeof(textUndockPathRotate) != 'undefined' ? textUndockPathRotate : 'Rotate')+' '+angle+'°</span>'+
						'	<a href="#" class="bWycaByStepUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bWycaByStepUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				
			});		
		}
		
		$('#wyca_by_step_edit_map_container_all .modalDockOptions').modal('show');
    });
	
	$('#wyca_by_step_edit_map .bCancelTestDock').click(function(e) {boolGotodock=false});
	
	$('#wyca_by_step_edit_map .bTestDock').click(function(e) {
        e.preventDefault();
		
		if (currentDockWycaByStepLongTouch.data('id_docking_station') >= 300000){
			boolGotodock = true;
			statusSavingMapBeforeTestDock=1;
			timerSavingMapBeforeTestDock=0;
			$('#wyca_by_step_edit_map_modalDoSaveBeforeTestDock').modal('show');
			TimerSavingMapBeforeTest('dock'); // LAUNCH ANIM PROGRESS BAR
			
			id_dock_test = currentDockWycaByStepLongTouch.data('id_docking_station');
			i = GetDockIndexFromID(currentDockWycaByStepLongTouch.data('id_docking_station'));
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
								*/
								wyca_bystepHistoriques = Array();
								wyca_bystepHistoriqueIndex = -1;
								WycaByStepRefreshHistorique();
								
								WycaByStepInitMap();
								WycaByStepResizeSVG();
								
								// On recherche le nouveau dock créé avec le bon id
								if (id_dock_test >= 300000)
								{
									$.each(docks, function( index, dock ) {
										
										if (dock.name == name)
										{
											currentDockWycaByStepLongTouch = $('#wyca_by_step_edit_map_dock_'+dock.id_docking_station);
											setTimeout(function(){$('#wyca_by_step_edit_map_modalDoSaveBeforeTestDock').modal('hide')},1500);
											if(boolGotodock){
												$('#wyca_by_step_edit_map .bTestDock').click();
											}
										}
									});
								}
							}
							else
							{
								$('#wyca_by_step_edit_map_modalDoSaveBeforeTestDock').modal('hide')
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
								
								wyca_bystepHistoriques = Array();
								wyca_bystepHistoriqueIndex = -1;
								WycaByStepRefreshHistorique();
								
								WycaByStepInitMap();
								WycaByStepResizeSVG();
								
								// On recherche le nouveau dock créé avec le bon id
								if (id_dock_test >= 300000)
								{
									$.each(docks, function( index, dock ) {
										
										if (dock.name == name)
										{
											currentDockWycaByStepLongTouch = $('#wyca_by_step_edit_map_dock_'+dock.id_docking_station);
											setTimeout(function(){$('#wyca_by_step_edit_map_modalDoSaveBeforeTestDock').modal('hide')},1500);
											if(boolGotodock){
												$('#wyca_by_step_edit_map .bTestDock').click();
											}
										}
									});
								}
							}
							else
							{
								$('#wyca_by_step_edit_map_modalDoSaveBeforeTestDock').modal('hide')
								ParseAPIAnswerError(data,textErrorGetMap);
							}
						});
					}
				}else{
					$('#wyca_by_step_edit_map_modalDoSaveBeforeTestDock').modal('hide');
					ParseAPIAnswerError(data,textErrorSetMap);
				}
			});

		}
		else
		{
			//WycaByStepHideMenus();
			
			wycaApi.on('onGoToChargeResult', function (data){
				$('#wyca_by_step_edit_map_bStop').hide();
				WycaByStepDisplayApiMessageGoTo(data);
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToChargeResult', onGoToChargeResult);
			});
			wycaApi.GoToCharge(currentDockWycaByStepLongTouch.data('id_docking_station'), function (data){
				
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#wyca_by_step_edit_map_bStop').show();
				}
				else
				{
					
					WycaByStepDisplayApiMessageGoTo(data);
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToChargeResult', onGoToChargeResult);
				}
			});
		}
    });
	
	/* MENU POI */
	
	$('#wyca_by_step_edit_map_menu_poi .bDeletePoi').click(function(e) {
        e.preventDefault();
		WycaByStepHideMenus();
		i = GetPoiIndexFromID(currentPoiWycaByStepLongTouch.data('id_poi'));
		DeletePoi(i);
    });
	
	$('#wyca_by_step_edit_map_menu_poi .bConfigPoi').click(function(e) {
        e.preventDefault();
		//WycaByStepHideMenus();
		wyca_bystepCurrentAction = 'editPoi';
	
		currentPoiIndex = GetPoiIndexFromID(currentPoiWycaByStepLongTouch.data('id_poi'));
		poi = pois[currentPoiIndex];
		
		$('#wyca_by_step_edit_map_poi_name').val(poi.name);
		$('#wyca_by_step_edit_map_poi_comment').val(poi.comment);
		
		$('#wyca_by_step_edit_map_container_all .modalPoiOptions .list_undock_procedure_poi li').remove();
		
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
					
					$('#wyca_by_step_edit_map_container_all .modalPoiOptions .list_undock_procedure_poi').append('' +
						'<li id="wyca_by_step_edit_map_list_undock_procedure_poi_elem_'+indexPoiElem+'" data-index_poi_procedure="'+indexPoiElem+'" data-action="move" data-distance="' + distance + '">'+
						'	<span>' + (typeof(textUndockPathMove) != 'undefined' ? textUndockPathMove : 'Move') + ((direction == 'back')?'back':'front') + ' ' + ((direction == 'back')?distance*-1:distance) + 'm</span>'+
						'	<a href="#" class="bWycaByStepUndockProcedurePoiDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bWycaByStepUndockProcedurePoiEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				else
				{	
					angle = undock_step.angular_distance * 180 / Math.PI;
					angle = Math.round(angle*100)/100;
					
					$('#wyca_by_step_edit_map_container_all .modalPoiOptions .list_undock_procedure_poi').append('' +
						'<li id="wyca_by_step_edit_map_list_undock_procedure_poi_elem_'+indexPoiElem+'" data-index_poi_procedure="'+indexPoiElem+'" data-action="rotate" data-angle="'+angle+'">'+
						'	<span>' + (typeof(textUndockPathRotate) != 'undefined' ? textUndockPathRotate : 'Rotate')+' '+angle+'°</span>'+
						'	<a href="#" class="bWycaByStepUndockProcedurePoiDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bWycaByStepUndockProcedurePoiEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				
			});
		}
		*/
		$('#wyca_by_step_edit_map_container_all .modalPoiOptions').modal('show');
		
    });
	
	$('#wyca_by_step_edit_map .bCancelTestPoi').click(function(e) {boolGotopoi=false});
	
	$('#wyca_by_step_edit_map .bTestPoi').click(function(e) {
        e.preventDefault();
		
		if (currentPoiWycaByStepLongTouch.data('id_poi') >= 300000)
		{
			boolGotopoi = true;
			statusSavingMapBeforeTestPoi=1;
			timerSavingMapBeforeTestPoi=0;
			$('#wyca_by_step_edit_map_modalDoSaveBeforeTestPoi').modal('show');
			TimerSavingMapBeforeTest('poi'); // LAUNCH ANIM PROGRESS BAR
			
			id_poi_test = currentPoiWycaByStepLongTouch.data('id_poi');
			i = GetPoiIndexFromID(currentPoiWycaByStepLongTouch.data('id_poi'));
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
								*/
								wyca_bystepHistoriques = Array();
								wyca_bystepHistoriqueIndex = -1;
								WycaByStepRefreshHistorique();
								
								WycaByStepInitMap();
								WycaByStepResizeSVG();
								
								// On recherche le nouveau poi créé avec le bon id
								if (id_poi_test >= 300000)
								{
									$.each(pois, function( index, poi ) {
										
										if (poi.name == name)
										{
											currentPoiWycaByStepLongTouch = $('#wyca_by_step_edit_map_poi_robot_'+poi.id_poi);
											setTimeout(function(){$('#wyca_by_step_edit_map_modalDoSaveBeforeTestPoi').modal('hide')},1500);
											if(boolGotopoi){
												$('#wyca_by_step_edit_map .bTestPoi').click();
											}
										}
									});
								}
								
							}
							else
							{
								$('#wyca_by_step_edit_map_modalDoSaveBeforeTestPoi').modal('hide')
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
								
								wyca_bystepHistoriques = Array();
								wyca_bystepHistoriqueIndex = -1;
								WycaByStepRefreshHistorique();
								
								WycaByStepInitMap();
								WycaByStepResizeSVG();
								
								// On recherche le nouveau poi créé avec le bon id
								if (id_poi_test >= 300000)
								{
									$.each(pois, function( index, poi ) {
										
										if (poi.name == name)
										{
											currentPoiWycaByStepLongTouch = $('#wyca_by_step_edit_map_poi_robot_'+poi.id_poi);
											setTimeout(function(){$('#wyca_by_step_edit_map_modalDoSaveBeforeTestPoi').modal('hide')},1500);
											if(boolGotopoi){
												$('#wyca_by_step_edit_map .bTestPoi').click();
											}
										}
									});
								}
								
							}
							else
							{
								$('#wyca_by_step_edit_map_modalDoSaveBeforeTestPoi').modal('hide')
								ParseAPIAnswerError(data,textErrorGetMap);
							}
						});
					}
				}else{
					$('#wyca_by_step_edit_map_modalDoSaveBeforeTestPoi').modal('hide');
					ParseAPIAnswerError(data,textErrorSetMap);
				}
			});

		}
		else
		{
			//WycaByStepHideMenus();
			
			wycaApi.on('onGoToPoiResult', function (data){
				$('#wyca_by_step_edit_map_bStop').hide();
				WycaByStepDisplayApiMessageGoTo(data);
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToPoiResult', onGoToPoiResult);
			
			});
			
			wycaApi.GoToPoi(currentPoiWycaByStepLongTouch.data('id_poi'), function (data){
				
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#wyca_by_step_edit_map_bStop').show();
				}
				else
				{
					WycaByStepDisplayApiMessageGoTo(data);
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoiResult', onGoToPoiResult);
				}
			});
		}
    });
	
	/* MENU AUGMENTED POSE */
	
	$('#wyca_by_step_edit_map_menu_augmented_pose .bDeleteAugmentedPose').click(function(e) {
        e.preventDefault();
		WycaByStepHideMenus();
		i = GetAugmentedPoseIndexFromID(currentAugmentedPoseWycaByStepLongTouch.data('id_augmented_pose'));
		DeleteAugmentedPose(i);
    });
	
	$('#wyca_by_step_edit_map_menu_augmented_pose .bConfigAugmentedPose').click(function(e) {
        e.preventDefault();
		//WycaByStepHideMenus();
		wyca_bystepCurrentAction = 'editAugmentedPose';
	
		currentAugmentedPoseIndex = GetAugmentedPoseIndexFromID(currentAugmentedPoseWycaByStepLongTouch.data('id_augmented_pose'));
		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		
		$('#wyca_by_step_edit_map_augmented_pose_name').val(augmented_pose.name);
		$('#wyca_by_step_edit_map_augmented_pose_fiducial_number').val(augmented_pose.id_fiducial);
		$('#wyca_by_step_edit_map_augmented_pose_comment').val(augmented_pose.comment);
		
		$('#wyca_by_step_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose li').remove();
		
		if (augmented_pose.undock_path.length > 0)
		{
			$.each(augmented_pose.undock_path, function( indexConfig, undock_step ) {
	
				//console.log(undock_step);
				indexAugmentedPoseElem++;
				
				if (undock_step.linear_distance != 0)
				{				
					distance = undock_step.linear_distance;
					direction = undock_step.linear_distance > 0 ? 'front':'back';
					
					$('#wyca_by_step_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
						'<li id="wyca_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="move" data-distance="' + distance + '">'+
						'	<span>' + (typeof(textUndockPathMove) != 'undefined' ? textUndockPathMove : 'Move') + ' ' + ((direction == 'back')? (typeof(textUndockPathback) != 'undefined' ? textUndockPathback : 'back') : (typeof(textUndockPathfront) != 'undefined' ? textUndockPathfront : 'front')) + ' ' + ((direction == 'back')?distance*-1:distance) + 'm</span>'+
						'	<a href="#" class="bWycaByStepUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bWycaByStepUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				else
				{	
					angle = undock_step.angular_distance * 180 / Math.PI;
					angle = Math.round(angle*100)/100;
					
					$('#wyca_by_step_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
						'<li id="wyca_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="rotate" data-angle="'+angle+'">'+
						'	<span>' + (typeof(textUndockPathRotate) != 'undefined' ? textUndockPathRotate : 'Rotate')+' '+angle+'°</span>'+
						'	<a href="#" class="bWycaByStepUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bWycaByStepUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
				
			});
		}
		
		$('#wyca_by_step_edit_map_container_all .modalAugmentedPoseOptions').modal('show');
		
    });
	
	$('#wyca_by_step_edit_map .bCancelTestAugmentedPose').click(function(e){boolGotoaugmentedpose=false });
	
	$('#wyca_by_step_edit_map .bTestAugmentedPose').click(function(e) {
        e.preventDefault();
		
		if (currentAugmentedPoseWycaByStepLongTouch.data('id_augmented_pose') >= 300000){
			boolGotoaugmentedpose = true;
			statusSavingMapBeforeTestAugmentedPose=1;
			timerSavingMapBeforeTestAugmentedPose=0;
			$('#wyca_by_step_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('show');
			TimerSavingMapBeforeTest('augmented_pose');  // LAUNCH ANIM PROGRESS BAR
			
			id_augmented_pose_test = currentAugmentedPoseWycaByStepLongTouch.data('id_augmented_pose');
			i = GetAugmentedPoseIndexFromID(currentAugmentedPoseWycaByStepLongTouch.data('id_augmented_pose'));
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
								*/
								wyca_bystepHistoriques = Array();
								wyca_bystepHistoriqueIndex = -1;
								WycaByStepRefreshHistorique();
								
								WycaByStepInitMap();
								WycaByStepResizeSVG();
								
								// On recherche le nouveau augmented_pose créé avec le bon id
								if (id_augmented_pose_test >= 300000)
								{
									$.each(augmented_poses, function( index, augmented_pose ) {
										
										if (augmented_pose.name == name)
										{
											currentAugmentedPoseWycaByStepLongTouch = $('#wyca_by_step_edit_map_augmented_pose_robot_'+augmented_pose.id_augmented_pose);
											setTimeout(function(){$('#wyca_by_step_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('hide')},1500);
											if(boolGotoaugmentedpose){
												$('#wyca_by_step_edit_map .bTestAugmentedPose').click();
											}
										}
									});
								}
							}
							else
							{
								$('#wyca_by_step_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('hide')
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
								
								wyca_bystepHistoriques = Array();
								wyca_bystepHistoriqueIndex = -1;
								WycaByStepRefreshHistorique();
								
								WycaByStepInitMap();
								WycaByStepResizeSVG();
								
								// On recherche le nouveau augmented_pose créé avec le bon id
								if (id_augmented_pose_test >= 300000)
								{
									$.each(augmented_poses, function( index, augmented_pose ) {
										
										if (augmented_pose.name == name)
										{
											currentAugmentedPoseWycaByStepLongTouch = $('#wyca_by_step_edit_map_augmented_pose_robot_'+augmented_pose.id_augmented_pose);
											setTimeout(function(){$('#wyca_by_step_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('hide')},1500);
											if(boolGotoaugmentedpose){
												$('#wyca_by_step_edit_map .bTestAugmentedPose').click();
											}
										}
									});
								}
							}
							else
							{
								$('#wyca_by_step_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('hide')
								ParseAPIAnswerError(data,textErrorGetMap);
							}
						});
					}		
				}else{
					$('#wyca_by_step_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('hide');
					ParseAPIAnswerError(data,textErrorSetMap);
				}
			});
			
		}
		else
		{
			//WycaByStepHideMenus();
			
			wycaApi.on('onGoToAugmentedPoseResult', function (data){
				$('#wyca_by_step_edit_map_bStop').hide();
				WycaByStepDisplayApiMessageGoTo(data);
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
			});
			
			wycaApi.GoToAugmentedPose(currentAugmentedPoseWycaByStepLongTouch.data('id_augmented_pose'), function (data){
				
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#wyca_by_step_edit_map_bStop').show();
				}
				else
				{
					WycaByStepDisplayApiMessageGoTo(data);
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
				}
			});
		}
    });
	
	$('#wyca_by_step_edit_map_svg').on('contextmenu', function (e) {
		
		if (wyca_bystepCurrentAction == 'gomme' && currentStep=='trace')
		{
			currentStep = '';
			currentGommePoints.pop(); // Point du curseur
			WycaByStepTraceCurrentGomme(currentGommePoints);
			return false;
			
		}
		/*
		else if (wyca_bystepCurrentAction == 'addForbiddenArea' && currentStep=='trace')
		{
			currentStep = '';
			currentForbiddenPoints.pop(); // Point du curseur
			WycaByStepTraceCurrentForbidden(currentForbiddenPoints);
			return false;
		}
		else if (wyca_bystepCurrentAction == 'addArea' && currentStep=='trace')
		{
			currentStep = '';
			currentAreaPoints.pop(); // Point du curseur
			WycaByStepTraceCurrentArea(currentAreaPoints);
			return false;
		}
		*/
    });
	
	/**************************/
	/*        ZOOM            */
	/**************************/
	
	$('#wyca_by_step_edit_map_zone_zoom_click').mousedown(function(e) {
       e.preventDefault();
	   downOnZoomClick = true;
    });
	
	$('#wyca_by_step_edit_map_zone_zoom_click').mousemove(function(e) {
       e.preventDefault();
	   if (downOnZoomClick)
	   {
			w = $('#wyca_by_step_edit_map_zoom_carte').width();
			h = $('#wyca_by_step_edit_map_zoom_carte').height();
			
			wZoom = $('#wyca_by_step_edit_map_zone_zoom').width();
			hZoom = $('#wyca_by_step_edit_map_zone_zoom').height();
			
			x = e.offsetX - wZoom / 2;
			y = e.offsetY - hZoom / 2;
					
			//zoom = ros_largeur / $('#wyca_by_step_edit_map_svg').width() / window.panZoom.getZoom();
			zoom = WycaByStepGetZoom();
			
			largeur_img = ros_largeur / zoom
			
			x = - x / w * largeur_img;
			y = - y / w * largeur_img;
			
			window.panZoom.pan({'x':x, 'y':y});
	   }
    });
	
	$('#wyca_by_step_edit_map_zone_zoom_click').click(function(e) {
		e.preventDefault();
		
		w = $('#wyca_by_step_edit_map_zoom_carte').width();
		h = $('#wyca_by_step_edit_map_zoom_carte').height();
		
		wZoom = $('#wyca_by_step_edit_map_zone_zoom').width();
		hZoom = $('#wyca_by_step_edit_map_zone_zoom').height();
		
		x = e.offsetX - wZoom / 2;
		y = e.offsetY - hZoom / 2;
				
		//zoom = ros_largeur / $('#wyca_by_step_edit_map_svg').width() / window.panZoom.getZoom();
		zoom = WycaByStepGetZoom();
		
		largeur_img = ros_largeur / zoom
		
		x = - x / w * largeur_img;
		y = - y / w * largeur_img;
		
		window.panZoom.pan({'x':x, 'y':y});
	});
	
	$('#wyca_by_step_edit_map_zone_zoom_click').on('touchstart', function(e) {
       e.preventDefault();
	   downOnZoomClick = true;
	   
	    w = $('#wyca_by_step_edit_map_zoom_carte').width();
		h = $('#wyca_by_step_edit_map_zoom_carte').height();
		
		wZoom = $('#wyca_by_step_edit_map_zone_zoom').width();
		hZoom = $('#wyca_by_step_edit_map_zone_zoom').height();
		
		r = document.getElementById("wyca_by_step_edit_map_zoom_carte_container").getBoundingClientRect();
		
		x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - r.left;
		y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - r.top;
		
		x = x - wZoom / 2;
		y = y - hZoom / 2;
				
		//zoom = ros_largeur / $('#wyca_by_step_edit_map_svg').width() / window.panZoom.getZoom();
		zoom = WycaByStepGetZoom();
		
		largeur_img = ros_largeur / zoom
		
		x = - x / w * largeur_img;
		y = - y / w * largeur_img;
		
		window.panZoom.pan({'x':x, 'y':y});
	   
    });
	
	$('#wyca_by_step_edit_map_zone_zoom_click').on('touchend', function(e) {
       e.preventDefault();
	   downOnZoomClick = false;
    });
	
	$('#wyca_by_step_edit_map_zone_zoom_click').on('touchmove', function(e) {
       e.preventDefault();
	   if (downOnZoomClick)
	   {
		    w = $('#wyca_by_step_edit_map_zoom_carte').width();
			h = $('#wyca_by_step_edit_map_zoom_carte').height();
			
			wZoom = $('#wyca_by_step_edit_map_zone_zoom').width();
			hZoom = $('#wyca_by_step_edit_map_zone_zoom').height();
			
			r = document.getElementById("wyca_by_step_edit_map_zoom_carte_container").getBoundingClientRect();
		
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - r.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - r.top;
			
			x = x - wZoom / 2;
			y = y - hZoom / 2;
					
			//zoom = ros_largeur / $('#wyca_by_step_edit_map_svg').width() / window.panZoom.getZoom();
			zoom = WycaByStepGetZoom();
			
			largeur_img = ros_largeur / zoom
			
			x = - x / w * largeur_img;
			y = - y / w * largeur_img;
			
			window.panZoom.pan({'x':x, 'y':y});
	   }
    });
	
	/**************************/
	/*  Click on element      */
	/**************************/
	
	$(document).on('click', '#wyca_by_step_edit_map_svg .forbidden_elem', function(e) {
		e.preventDefault();
		
		if ((wyca_bystepCurrentAction == 'addArea' || wyca_bystepCurrentAction == 'addForbiddenArea') && currentStep == 'trace')
		{
		}
		else if (wyca_bystepCurrentAction == 'gomme')
		{
		}
		else if (wyca_bystepCanChangeMenu)
		{
			RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
			RemoveClass('#wyca_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'forbidden', 'id':$(this).data('id_area')});	
			
			$('#wyca_by_step_edit_map_boutonsForbidden').show();
            $('#wyca_by_step_edit_map_boutonsStandard').hide();
			
			$('#wyca_by_step_edit_map_boutonsForbidden #wyca_by_step_edit_map_bForbiddenDelete').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			currentForbiddenWycaByStepLongTouch = $(this);
			//MENU FORBIDDEN DISPLAY
			if (wyca_bystepCurrentAction != 'editForbiddenArea' && wyca_bystepCurrentAction != 'addForbiddenArea')
			{
				WycaByStepHideCurrentMenuNotSelect();
				WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_forbidden');
			}
			
			wyca_bystepCurrentAction = 'editForbiddenArea';	
			currentStep = '';
			
			currentForbiddenIndex = GetForbiddenIndexFromID($(this).data('id_area'));
			//DELETE CURRENTPOINT + REDRAW TO PASS OVER SVG
			if(currentPointWycaByStepLongTouch != null)
				currentPointWycaByStepLongTouch.data('index_point',-1);
			currentPointWycaByStepLongTouch = null;
			WycaByStepTraceForbidden(currentForbiddenIndex);
			
			forbidden = forbiddens[currentForbiddenIndex];
			saveCurrentForbidden = JSON.stringify(forbidden);
			
			AddClass('#wyca_by_step_edit_map_svg .forbidden_elem_'+forbidden.id_area, 'active');
		}
		else
			WycaByStepAvertCantChange();
	});
	
	$(document).on('click', '#wyca_by_step_edit_map_svg .area_elem', function(e) {
		e.preventDefault();
		
		if ((wyca_bystepCurrentAction == 'addArea' || wyca_bystepCurrentAction == 'addForbiddenArea') && currentStep == 'trace')
		{
		}
		else if (wyca_bystepCurrentAction == 'gomme')
		{
		}
		else if (wyca_bystepCanChangeMenu)
		{
			RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
			RemoveClass('#wyca_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'area', 'id':$(this).data('id_area')});	
			
			$('#wyca_by_step_edit_map_boutonsArea').show();
            $('#wyca_by_step_edit_map_boutonsStandard').hide();
			
			$('#wyca_by_step_edit_map_boutonsArea #wyca_by_step_edit_map_bAreaDelete').show();
			$('#wyca_by_step_edit_map_boutonsArea #wyca_by_step_edit_map_bAreaOptions').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			
			currentAreaWycaByStepLongTouch=$(this);
			//MENU AREA DISPLAY
			if (wyca_bystepCurrentAction != 'editArea')
			{
				WycaByStepHideCurrentMenuNotSelect();
				WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_area');
			}
			
			wyca_bystepCurrentAction = 'editArea';	
			currentStep = '';
			
			currentAreaIndex = GetAreaIndexFromID($(this).data('id_area'));
			//DELETE CURRENTPOINT + REDRAW TO PASS OVER SVG
			if(currentPointWycaByStepLongTouch != null)
				currentPointWycaByStepLongTouch.data('index_point',-1);
			currentPointWycaByStepLongTouch = null;
			WycaByStepTraceArea(currentAreaIndex);
			
			area = areas[currentAreaIndex];
			saveCurrentArea = JSON.stringify(area);
			
			AddClass('#wyca_by_step_edit_map_svg .area_elem_'+area.id_area, 'active');
		}
		else
			WycaByStepAvertCantChange();
	});
	
	$(document).on('click', '#wyca_by_step_edit_map_svg .dock_elem', function(e) {
		e.preventDefault();
		
		if (wyca_bystepCurrentAction == 'addDock')
		{
		}
		else if (wyca_bystepCurrentAction == 'gomme')
		{
		}
		else if (wyca_bystepCanChangeMenu)
		{
			RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
			RemoveClass('#wyca_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
			
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'dock', 'id':$(this).data('id_docking_station')});	
			
			$('#wyca_by_step_edit_map_boutonsDock').show();
            $('#wyca_by_step_edit_map_boutonsStandard').hide();
			
			$('#wyca_by_step_edit_map_boutonsDock a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			currentDockWycaByStepLongTouch=$(this);
			//console.log(wyca_bystepCurrentAction);
			//MENU DOCK DISPLAY
			if (wyca_bystepCurrentAction != 'editDock' && wyca_bystepCurrentAction != 'addDock')
			{
				WycaByStepHideCurrentMenuNotSelect();
				WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_dock');
			}
			
			wyca_bystepCurrentAction = 'editDock';	
			currentStep = '';
			
			currentDockIndex = GetDockIndexFromID($(this).data('id_docking_station'));
			dock = docks[currentDockIndex];
			saveCurrentDock = JSON.stringify(dock);
			
			AddClass('#wyca_by_step_edit_map_svg .dock_elem_'+dock.id_docking_station, 'active');
			//AddClass('#wyca_by_step_edit_map_svg .dock_elem_'+dock.id_docking_station, 'movable');	// Dock non movable
			
		}
		else
			WycaByStepAvertCantChange();
	});
	
	$(document).on('click', '#wyca_by_step_edit_map_svg .poi_elem', function(e) {
		e.preventDefault();
		
		if (wyca_bystepCurrentAction == 'addPoi')
		{
		}
		else if (wyca_bystepCurrentAction == 'gomme')
		{
		}
		else if (wyca_bystepCanChangeMenu)
		{
			RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
			RemoveClass('#wyca_by_step_edit_map_svg .activ_select', 'activ_select'); 
			RemoveClass('#wyca_by_step_edit_map_svg .poi_elem', 'movable');
						
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'poi', 'id':$(this).data('id_poi')});	
			
			$('#wyca_by_step_edit_map_boutonsPoi').show();
			
            $('#wyca_by_step_edit_map_boutonsStandard').hide();
			
			$('#wyca_by_step_edit_map_boutonsPoi a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			currentPoiWycaByStepLongTouch = $(this);
			//MENU POI DISPLAY
			if (wyca_bystepCurrentAction != 'editPoi' && wyca_bystepCurrentAction != 'addPoi')
			{
				WycaByStepHideCurrentMenuNotSelect();
				WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_poi');
			}
			
			wyca_bystepCurrentAction = 'editPoi';	
			currentStep = '';
			
			currentPoiIndex = GetPoiIndexFromID($(this).data('id_poi'));
			poi = pois[currentPoiIndex];
			saveCurrentPoi = JSON.stringify(poi);
			
			AddClass('#wyca_by_step_edit_map_svg .poi_elem_'+poi.id_poi, 'active');
			if (poi.id_fiducial < 1) // Movable que si il n'est pas lié à un reflecteur
				AddClass('#wyca_by_step_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		}
		else
			WycaByStepAvertCantChange();
	});
	
	$(document).on('click', '#wyca_by_step_edit_map_svg .augmented_pose_elem', function(e) {
		e.preventDefault();
		
		if (wyca_bystepCurrentAction == 'addAugmentedPose')
		{
		}
		else if (wyca_bystepCurrentAction == 'gomme')
		{
		}
		else if (wyca_bystepCanChangeMenu)
		{
			RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
			RemoveClass('#wyca_by_step_edit_map_svg .activ_select', 'activ_select'); 
			RemoveClass('#wyca_by_step_edit_map_svg .augmented_pose_elem', 'movable');
						
			currentSelectedItem = Array();
			currentSelectedItem.push({'type':'augmented_pose', 'id':$(this).data('id_augmented_pose')});	
			
			$('#wyca_by_step_edit_map_boutonsAugmentedPose').show();
			
            $('#wyca_by_step_edit_map_boutonsStandard').hide();
			
			$('#wyca_by_step_edit_map_boutonsAugmentedPose a').show();
			
			$('body').removeClass('no_current select');
			$('.select').css("strokeWidth", minStokeWidth);
			currentAugmentedPoseWycaByStepLongTouch=$(this);
			//MENU AUGMENTED POSE DISPLAY
			if (wyca_bystepCurrentAction != 'editAugmentedPose' && wyca_bystepCurrentAction != 'addAugmentedPose')
			{
				WycaByStepHideCurrentMenuNotSelect();
				WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_augmented_pose');
			}
			
			wyca_bystepCurrentAction = 'editAugmentedPose';	
			currentStep = '';
			
			currentAugmentedPoseIndex = GetAugmentedPoseIndexFromID($(this).data('id_augmented_pose'));
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			saveCurrentAugmentedPose = JSON.stringify(augmented_pose);
			
			AddClass('#wyca_by_step_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'active');
			if (augmented_pose.id_fiducial < 1) // Movable que si il n'est pas lié à un reflecteur
				AddClass('#wyca_by_step_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'movable');
		}
		else
			WycaByStepAvertCantChange();
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
	
	$('#wyca_by_step_edit_map_modalRecovery .bRecovery').click(function(e) {
        e.preventDefault();
		$('#wyca_by_step_edit_map_modalRecovery .bRecovery').addClass('disabled');
		
		/*INIT FEEDBACK DISPLAY*/
		$('#wyca_by_step_edit_map_modalRecovery .recovery_feedback .recovery_step').css('opacity','0').hide();
		$('#wyca_by_step_edit_map_modalRecovery .recovery_feedback .recovery_step .fa-check').hide();
		$('#wyca_by_step_edit_map_modalRecovery .recovery_feedback .recovery_step .fa-pulse').show();
		
		wycaApi.on('onRecoveryFromFiducialFeedback', function(data) {
			if(data.A == wycaApi.AnswerCode.NO_ERROR){
				target = '';
				switch(data.M){
					case 'Scan reflector': 				target = '#wyca_by_step_edit_map_modalRecovery .recovery_feedback .recovery_step.RecoveryScan';	break;
					case 'Init pose': 					target = '#wyca_by_step_edit_map_modalRecovery .recovery_feedback .recovery_step.RecoveryPose';	break;
					case 'Rotate to check obstacles': 	target = '#wyca_by_step_edit_map_modalRecovery .recovery_feedback .recovery_step.RecoveryRotate';	break;
					case 'Start navigation': 			target = '#wyca_by_step_edit_map_modalRecovery .recovery_feedback .recovery_step.RecoveryNav';		break;
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
				
				$('#wyca_by_step_edit_map_modalRecovery .recovery_step:visible').find('.fa-check').show();
				$('#wyca_by_step_edit_map_modalRecovery .recovery_step:visible').find('.fa-pulse').hide();
				setTimeout(function(){
					$('.ifRecovery').hide();
					$('.ifNRecovery').show();
					$('#wyca_by_step_edit_map_modalRecovery .bRecovery').removeClass('disabled');
					success_wyca(textRecoveryDone);
					$('#wyca_by_step_edit_map_modalRecovery').modal('hide');
				},500)
			}
			else
			{
				$('.ifRecovery').hide();
				$('.ifNRecovery').show();
				$('#wyca_by_step_edit_map_modalRecovery .bRecovery').removeClass('disabled');
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
				$('#wyca_by_step_edit_map_modalRecovery .bRecovery').removeClass('disabled');
				ParseAPIAnswerError(data);
			}
		});
    });
	
	$('#wyca_by_step_edit_map_modalRecovery .bCancelRecovery').click(function(e) {
		$('#wyca_by_step_edit_map_modalRecovery .bCancelRecovery').addClass('disabled');
		wycaApi.RecoveryFromFiducialCancel(function(data) {
			$('#wyca_by_step_edit_map_modalRecovery .bCancelRecovery').removeClass('disabled');
		})
	})
	
	/* BTN GOTOPOSE */
	
	$('#wyca_by_step_edit_map_menu .bMoveTo').click(function(e) {
        e.preventDefault();
		WycaByStepHideMenus();
		if (wyca_bystepCanChangeMenu)
		{
			//CURRENT ACTION TARGET
			wyca_bystepCurrentAction = 'prepareGotoPose';
			wyca_bystepCanChangeMenu = false;
			//AJOUT ICON MENU + CROIX
			$('#wyca_by_step_edit_map .burger_menu').hide('fast');
			$('#wyca_by_step_edit_map .icon_menu[data-menu="wyca_by_step_edit_map_menu_gotopose"]').show('fast');
			setTimeout(function(){$('#wyca_by_step_edit_map .times_icon_menu').show('fast')},50);
			
			boolHelpGotoPose = getCookie('boolHelpGotoPoseI') != '' ? JSON.parse(getCookie('boolHelpGotoPoseI')) : true; // TRICK JSON.parse STR TO BOOL
			
			if(boolHelpGotoPose){
				$('#wyca_by_step_edit_map .modalHelpClickGotoPose').modal('show');
			}			
		}
		else
			WycaByStepAvertCantChange();
		
    });
	
	$('#wyca_by_step_edit_map .bHelpClickGotoPoseOk').click(function(){boolHelpGotoPose = !$('#wyca_by_step_edit_map .checkboxHelpGotopose').prop('checked');setCookie('boolHelpGotoPoseI',boolHelpGotoPose);});//ADD SAVING BDD / COOKIES ?
		
	/* BTNS GOMME */
	
	$('#wyca_by_step_edit_map_menu .bGomme').click(function(e) {
        e.preventDefault();
		WycaByStepHideMenus();
		/*
		if ($('#wyca_by_step_edit_map_bGomme').hasClass('btn-primary'))
		{
			blockZoom = false;
			
			WycaByStepHideCurrentMenu();
			
			$('#wyca_by_step_edit_map_bGomme').removeClass('btn-primary');
		
			wyca_bystepCurrentAction = '';	
			currentStep = '';
			
			$('body').addClass('no_current');
			$('body').removeClass('gomme');
			
			//currentGommePoints = Array();
		
			WycaByStepSaveElementNeeded(true);
		}
		else
		{
			*/
			blockZoom = true;
			
			if (wyca_bystepCanChangeMenu)
			{
				WycaByStepHideCurrentMenu();
				WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_erase');
				sizeGomme = $('#wyca_by_step_edit_map_menu_erase .bGommeSize.selected').data('size');
				wyca_bystepCurrentAction = 'gomme';	
				currentStep = '';
				
				$('body').removeClass('no_current');
				$('body').addClass('gomme');
				
			}
			else
				WycaByStepAvertCantChange();
		//}
    });
	
	$('#wyca_by_step_edit_map_menu_erase .bGommeSize').click(function(e) {
        e.preventDefault();
		$('#wyca_by_step_edit_map_menu_erase .bGommeSize').removeClass('selected');
		sizeGomme = $(this).data('size');
		$(this).addClass('selected');
		
    });
	
	/* BTN MENU FORBIDDEN */
	
	$('#wyca_by_step_edit_map_menu .bAddForbiddenArea').click(function(e) {
        e.preventDefault();
		WycaByStepHideMenus();
		if (wyca_bystepCanChangeMenu)
		{
			
			//CURRENT ACTION TARGET
			wyca_bystepCurrentAction = 'prepareForbiddenArea';
			wyca_bystepCanChangeMenu = false;
			//AJOUT ICON MENU + CROIX
			$('#wyca_by_step_edit_map .burger_menu').hide('fast');
			$('#wyca_by_step_edit_map .icon_menu[data-menu="wyca_by_step_edit_map_menu_forbidden"]').show('fast');
			setTimeout(function(){$('#wyca_by_step_edit_map .times_icon_menu').show('fast')},50);
			
			boolHelpForbidden = getCookie('boolHelpForbiddenI') != '' ? JSON.parse(getCookie('boolHelpForbiddenI')) : true; // TRICK JSON.parse STR TO BOOL
			
			if(boolHelpForbidden){
				$('#wyca_by_step_edit_map .modalHelpClickForbidden').modal('show');
			}			
		}
		else
			WycaByStepAvertCantChange();
	});
	
	$('#wyca_by_step_edit_map .bHelpClickForbiddenOk').click(function(){boolHelpForbidden = !$('#wyca_by_step_edit_map .checkboxHelpForbidden').prop('checked');setCookie('boolHelpForbiddenI',boolHelpForbidden);});//ADD SAVING BDD / COOKIES ?

	$('#wyca_by_step_edit_map_bForbiddenDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this area?'))
		{
			DeleteForbidden(currentForbiddenIndex);
		}
    });
	
	$('#wyca_by_step_edit_map_svg').click(function(e){
		if(wyca_bystepCanChangeMenu == false){
			switch(wyca_bystepCurrentAction){
				case 'prepareForbiddenArea':
					//blockZoom = true;
					nextIdArea++;
					
					zoom = WycaByStepGetZoom();
					p = $('#wyca_by_step_edit_map_svg image').position();
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
					WycaByStepAddHistorique({'action':'add_forbidden', 'data':JSON.stringify(f)});
					
					forbiddens.push(f);
					WycaByStepTraceForbidden(forbiddens.length-1);
					
					RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
					RemoveClass('#wyca_by_step_edit_map_svg .activ_select', 'activ_select'); 
					
					currentSelectedItem = Array();
					currentSelectedItem.push({'type':'forbidden', 'id':nextIdArea});	
					WycaByStepHideCurrentMenuNotSelect();			
					
					$('#wyca_by_step_edit_map_boutonsForbidden').show();
					$('#wyca_by_step_edit_map_boutonsStandard').hide();
					
					$('#wyca_by_step_edit_map_boutonsForbidden #wyca_by_step_edit_map_bForbiddenDelete').show();
					
					$('body').removeClass('no_current select');
					$('.select').css("strokeWidth", minStokeWidth);
					
					currentForbiddenWycaByStepLongTouch = $(this);
					//MENU FORBIDDEN DISPLAY
					if (wyca_bystepCurrentAction != 'editForbiddenArea' && wyca_bystepCurrentAction != 'addForbiddenArea')
					{
						WycaByStepHideCurrentMenuNotSelect();
						WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_forbidden');
					}
					
					wyca_bystepCurrentAction = 'addForbiddenArea';
					currentStep = '';
					
					currentForbiddenIndex = GetForbiddenIndexFromID(nextIdArea);
					forbidden = forbiddens[currentForbiddenIndex];
					saveCurrentForbidden = JSON.stringify(forbidden);
					
					AddClass('#wyca_by_step_edit_map_svg .forbidden_elem_'+forbidden.id_area, 'active');
					
					WycaByStepSaveElementNeeded(true);
					
					$('#wyca_by_step_edit_map_boutonsForbidden').show();
					$('#wyca_by_step_edit_map_boutonsStandard').hide();
					
					$('#wyca_by_step_edit_map_boutonsForbidden #wyca_by_step_edit_map_bForbiddenDelete').hide();
					
					wyca_bystepCurrentAction = 'addForbiddenArea';	
					currentStep = 'trace';
					
					$('body').removeClass('no_current');
					$('body').addClass('addForbidden');
					
					currentForbiddenPoints = Array();
					currentForbiddenPoints.push({x:0, y:0}); // Point du curseur
					
					
				break;
				
				case 'prepareArea':
							
					
					//blockZoom = true;
					nextIdArea++;
					zoom = WycaByStepGetZoom();
					p = $('#wyca_by_step_edit_map_svg image').position();
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
					
					if(tempAreaCopy != false){
						//AIM CENTER AREA
						a = JSON.parse(tempAreaCopy);
						let centerAreaCopy = GetCenterArea(a.points);
						//console.log(centerAreaCopy);
						//console.log(a.points);
						currentAreaPoints = Array();
						
						a.points.forEach(function(item,idx){
							let deltaX = centerAreaCopy.x - item.x;
							let deltaY = centerAreaCopy.y - item.y;
							currentAreaPoints[idx]={x:xRos - deltaX, y:yRos - deltaY};
						})
						
						//console.log(GetCenterArea(currentAreaPoints));
						//console.log(currentAreaPoints);
						
						
						/*
						currentAreaPoints.push({x:xRos - tailleArea, y:yRos - tailleArea});
						currentAreaPoints.push({x:xRos + tailleArea, y:yRos - tailleArea});
						currentAreaPoints.push({x:xRos + tailleArea, y:yRos + tailleArea});
						currentAreaPoints.push({x:xRos - tailleArea, y:yRos + tailleArea});
						*/
						//FROM AREA COPY
						
						//console.log(JSON.parse(JSON.stringify(a)));
						a.id_area = nextIdArea;
						a.points = currentAreaPoints;
						//console.log(JSON.parse(JSON.stringify(a)));
						
					}
					else
					{
						//AIM TOP LEFT CORNER
					
						currentAreaPoints = Array();
						currentAreaPoints.push({x:xRos , y:yRos});
						currentAreaPoints.push({x:xRos + 2*tailleArea, y:yRos});
						currentAreaPoints.push({x:xRos + 2*tailleArea, y:yRos - 2*tailleArea});
						currentAreaPoints.push({x:xRos, y:yRos - 2*tailleArea});
						
						a = {'id_area':nextIdArea, 'id_map':id_map, 'name':'', 'comment':'', 'is_forbidden':false, 'color_r':87, 'color_g':159, 'color_b':177, 'deleted':false, 'points':currentAreaPoints, 'configs':Array()};
					}

					WycaByStepAddHistorique({'action':'add_area', 'data':JSON.stringify(a)});
					
					areas.push(a);
					WycaByStepTraceArea(areas.length-1);
					
					RemoveClass('#wyca_by_step_edit_map_svg .editing_point', 'editing_point');
					RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
					RemoveClass('#wyca_by_step_edit_map_svg .activ_select', 'activ_select'); 
					
					currentSelectedItem = Array();
					currentSelectedItem.push({'type':'area', 'id':nextIdArea});	
					WycaByStepHideCurrentMenuNotSelect();			
					
					$('#wyca_by_step_edit_map_boutonsArea').show();
					$('#wyca_by_step_edit_map_boutonsStandard').hide();
					
					$('#wyca_by_step_edit_map_boutonsArea #wyca_by_step_edit_map_bAreaDelete').show();
					
					$('body').removeClass('no_current select');
					$('.select').css("strokeWidth", minStokeWidth);
					
					currentAreaWycaByStepLongTouch = $(this);
					//MENU FORBIDDEN DISPLAY
					if (wyca_bystepCurrentAction != 'editArea' && wyca_bystepCurrentAction != 'addArea')
					{
						WycaByStepHideCurrentMenuNotSelect();
						WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_area');
					}
					
					wyca_bystepCurrentAction = 'addArea';
					currentStep = '';
					
					currentAreaIndex = GetAreaIndexFromID(nextIdArea);
					area = areas[currentAreaIndex];
					saveCurrentArea = JSON.stringify(area);
					
					AddClass('#wyca_by_step_edit_map_svg .area_elem_'+area.id_area, 'active');
					
					WycaByStepSaveElementNeeded(true);
				break;
				
				case 'prepareGotoPose':
		
					//WycaByStepHideMenus();
					
					zoom = WycaByStepGetZoom();
					p = $('#wyca_by_step_edit_map_svg image').position();
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
						$('#wyca_by_step_edit_map_svg .go_to_pose_elem').remove();
						$('#wyca_by_step_edit_map_bStop').hide();
						
						WycaByStepDisplayApiMessageGoTo(data);
						// On rebranche l'ancienne fonction
						wycaApi.on('onGoToPoseResult', onGoToPoseResult);
					});
					
					console.log('GoToPose', xRos, yRos);
					
					wycaApi.GoToPose(xRos, yRos, 0, 0, function (data){
						$('#wyca_by_step_edit_map .icon_menu').click();// POUR SORTIR DU MENU GOTOPOSE
						if (data.A == wycaApi.AnswerCode.NO_ERROR)
						{
							$('#wyca_by_step_edit_map_bStop').show();
							WycaByStepTraceGoToPose(xGotoPose,yGotoPose);
						}
						else
						{
							$('#wyca_by_step_edit_map_svg .go_to_pose_elem').remove();
							
							WycaByStepDisplayApiMessageGoTo(data);
							// On rebranche l'ancienne fonction
							wycaApi.on('onGoToPoseResult', onGoToPoseResult);
						}
					});
					
					
				break;
				
				default:
				
				break;			
			}
		}
	})
	
	/* BTN MENU AREA */
	
	$('#wyca_by_step_edit_map_menu .bAddArea').click(function(e) {
        e.preventDefault();
		WycaByStepHideMenus();
		if (wyca_bystepCanChangeMenu)
		{
			
			//CURRENT ACTION TARGET
			wyca_bystepCurrentAction = 'prepareArea';
			wyca_bystepCanChangeMenu = false;
			//AJOUT ICON MENU + CROIX
			$('#wyca_by_step_edit_map .burger_menu').hide('fast');
			$('#wyca_by_step_edit_map .icon_menu[data-menu="wyca_by_step_edit_map_menu_area"]').show('fast');
			setTimeout(function(){$('#wyca_by_step_edit_map .times_icon_menu').show('fast')},50);
			
			boolHelpArea = getCookie('boolHelpAreaI') != '' ? JSON.parse(getCookie('boolHelpAreaI')) : true; // TRICK JSON.parse STR TO BOOL
			
			if(boolHelpArea){
				$('#wyca_by_step_edit_map .modalHelpClickArea').modal('show');
			}
			
		}
		else
			WycaByStepAvertCantChange();
	});
	
	$('#wyca_by_step_edit_map .bHelpClickAreaOk').click(function(){boolHelpArea = !$('#wyca_by_step_edit_map .checkboxHelpArea').prop('checked');setCookie('boolHelpAreaI',boolHelpArea);});//ADD SAVING BDD / COOKIES ?
	
	$('#wyca_by_step_edit_map_bAreaDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this area?'))
		{
			DeleteArea(currentAreaIndex);
		}
    });
	
	$('#wyca_by_step_edit_map_bAreaOptions').click(function(e) {
        area = areas[currentAreaIndex];
		
		$('#wyca_by_step_edit_map_area_color_mode').val(rgbToHex(area.color_r, area.color_g, area.color_b));
		
		$('#wyca_by_step_edit_map_led_color_mode').val('Automatic');
		$('#wyca_by_step_edit_map_led_animation_mode').val('Automatic');
		$('#wyca_by_step_edit_map_max_speed_mode').val('Automatic');
		$('#wyca_by_step_edit_map_min_distance_obstacle_mode').val('Automatic');
		
		$.each(area.configs, function( indexConfig, config ) {
			switch(config.name)
			{
				case 'name': $('#wyca_by_step_edit_map_area_name').val(config.value); break;
				case 'led_color_mode': $('#wyca_by_step_edit_map_led_color_mode').val(config.value); break;
				case 'led_color': $('#wyca_by_step_edit_map_led_color').val(config.value); $('#wyca_by_step_edit_map_led_color').keyup(); break;
				case 'led_animation_mode': $('#wyca_by_step_edit_map_led_animation_mode').val(config.value); break;
				case 'led_animation': $('#wyca_by_step_edit_map_led_animation').val(config.value); break;
				case 'max_speed_mode': $('#wyca_by_step_edit_map_max_speed_mode').val(config.value); break;
				case 'max_speed': $('#wyca_by_step_edit_map_max_speed').val(config.value); break;
				case 'min_distance_obstacle_mode': $('#wyca_by_step_edit_map_min_distance_obstacle_mode').val(config.value); break;
				case 'min_distance_obstacle': $('#wyca_by_step_edit_map_min_distance_obstacle').val(config.value*100); break;
				case 'sound': $('#wyca_by_step_edit_map_area_sound').val(config.value); break;
			}
		});
		
		if ($('#wyca_by_step_edit_map_led_color_mode').val() == 'Automatic') $('#wyca_by_step_edit_map_led_color_group').hide(); else  $('#wyca_by_step_edit_map_led_color_group').show();
		if ($('#wyca_by_step_edit_map_led_animation_mode').val() == 'Automatic') $('#wyca_by_step_edit_map_led_animation_group').hide(); else  $('#wyca_by_step_edit_map_led_animation_group').show();
		if ($('#wyca_by_step_edit_map_max_speed_mode').val() == 'Automatic') $('#wyca_by_step_edit_map_max_speed_group').hide(); else  $('#wyca_by_step_edit_map_max_speed_group').show();
		if ($('#wyca_by_step_edit_map_min_distance_obstacle_mode').val() == 'Automatic') $('#wyca_by_step_edit_map_min_distance_obstacle_group').hide(); else  $('#wyca_by_step_edit_map_min_distance_obstacle_group').show();
    });
	
	$('#wyca_by_step_edit_map_bAreaSaveConfig').click(function(e) {
		area = areas[currentAreaIndex];
		saveCurrentArea = JSON.stringify(area);
		
		if (parseInt($('#wyca_by_step_edit_map_min_distance_obstacle').val()) > 68) $('#wyca_by_step_edit_map_min_distance_obstacle').val(68);
		if (parseInt($('#wyca_by_step_edit_map_min_distance_obstacle').val()) < 5) $('#wyca_by_step_edit_map_min_distance_obstacle').val(5);
		
		area.configs = Array();
		area.configs.push({'name':'name' , 'value':$('#wyca_by_step_edit_map_area_name').val()});
		area.configs.push({'name':'led_color_mode' , 'value':$('#wyca_by_step_edit_map_led_color_mode').val()});
		area.configs.push({'name':'led_color' , 'value':$('#wyca_by_step_edit_map_led_color').val()});
		area.configs.push({'name':'led_animation_mode' , 'value':$('#wyca_by_step_edit_map_led_animation_mode').val()});
		area.configs.push({'name':'led_animation' , 'value':$('#wyca_by_step_edit_map_led_animation').val()});
		area.configs.push({'name':'max_speed_mode' , 'value':$('#wyca_by_step_edit_map_max_speed_mode').val()});
		area.configs.push({'name':'max_speed' , 'value':$('#wyca_by_step_edit_map_max_speed').val()});
		area.configs.push({'name':'min_distance_obstacle_mode' , 'value':$('#wyca_by_step_edit_map_min_distance_obstacle_mode').val()});
		area.configs.push({'name':'min_distance_obstacle' , 'value':$('#wyca_by_step_edit_map_min_distance_obstacle').val()/100});
		area.configs.push({'name':'sound' , 'value':$('#wyca_by_step_edit_map_area_sound').val()});
		
		var c = '';
		if( $('#wyca_by_step_edit_map_area_color').val().includes('rgb') ){
			c = $('#wyca_by_step_edit_map_area_color').val().split("(")[1].split(")")[0];
			c = c.split(",");
			area.color_r = parseInt(c[0]);
			area.color_g = parseInt(c[1]);
			area.color_b = parseInt(c[2]);
		}else{
			c = hexToRgb($('#wyca_by_step_edit_map_area_color').val());
			area.color_r = c.r;
			area.color_g = c.g;
			area.color_b = c.b;
		}
		
		areas[currentAreaIndex] = area;
		
		if (wyca_bystepCurrentAction == 'editArea')
			WycaByStepAddHistorique({'action':'edit_area', 'data':{'index':currentAreaIndex, 'old':saveCurrentArea, 'new':JSON.stringify(areas[currentAreaIndex])}});
		saveCurrentArea = JSON.stringify(areas[currentAreaIndex]);
		WycaByStepTraceArea(currentAreaIndex);
	});
	
	/* BTN MENU DOCK */
	
	$('#wyca_by_step_edit_map_menu .bAddDock').click(function(e) {
        e.preventDefault();
		WycaByStepHideMenus();
		if (wyca_bystepCanChangeMenu)
		{
			$('#wyca_by_step_edit_map_container_all .texts_add_dock').hide();
			$('#wyca_by_step_edit_map_container_all .text_prepare_robot').show();
			
			$('#wyca_by_step_edit_map_container_all .modalAddDock .dock').hide();
			$('#wyca_by_step_edit_map_container_all .modalAddDock .fiducial_number_wrapper ').html('')
			$('#wyca_by_step_edit_map_container_all .modalAddDock').modal('show');
		}
		else
			WycaByStepAvertCantChange();
	});
	
	$('#wyca_by_step_edit_map_container_all .modalAddDock .joystickDiv .curseur').on('touchstart', function(e) {
		
		$('#wyca_by_step_edit_map_container_all .modalAddDock .dock').hide();
		$('#wyca_by_step_edit_map_container_all .modalAddDock .fiducial_number_wrapper ').html('')

	});
	
	$('#wyca_by_step_edit_map_container_all .modalAddDock .bScanAddDock').click(function(e) {
		$('#wyca_by_step_edit_map_container_all .modalAddDock .bScanAddDock').addClass('disabled');
		
		wycaApi.GetMapFiducialsVisible(function(data) {
			
			$('#wyca_by_step_edit_map_container_all .modalAddDock .bScanAddDock').removeClass('disabled');	
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				//console.log(data);
				
				$('#wyca_by_step_edit_map_container_all .modalAddDock .dock').hide();
				
				posRobot = $('#wyca_by_step_edit_map_container_all .modalAddDock #wyca_by_step_edit_map_modalAddDock_robot').offset();
				
				let modalOffset = $('#wyca_by_step_edit_map_container_all .modalAddDock .modal-content').offset();
				
				posRobot.left -= modalOffset.left; 
				posRobot.top -= modalOffset.top; 
				
				$('#wyca_by_step_edit_map_container_all .texts_add_dock').hide();
				if (data.D.length > 0)
					$('#wyca_by_step_edit_map_container_all .text_set_dock').show();
				else
					$('#wyca_by_step_edit_map_container_all .text_prepare_robot').show();
					
				$('#wyca_by_step_edit_map_container_all .modalAddDock .fiducial_number_wrapper ').html('');
				
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
						//FIDUCIAL
						$('#wyca_by_step_edit_map_container_all .modalAddDock #wyca_by_step_edit_map_modalAddDock_dock'+i).show();
						$('#wyca_by_step_edit_map_container_all .modalAddDock #wyca_by_step_edit_map_modalAddDock_dock'+i).css('left', posRobot.left + x_from_robot * 100); // lidar : y * -1
						$('#wyca_by_step_edit_map_container_all .modalAddDock #wyca_by_step_edit_map_modalAddDock_dock'+i).css('top', posRobot.top - y_from_robot * 100); // +20 position lidar, - 12.5 pour le centre
						//angle = (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
						
						$('#wyca_by_step_edit_map_container_all .modalAddDock #wyca_by_step_edit_map_modalAddDock_dock'+i).css({'-webkit-transform' : 'rotate('+ angle +'deg)',
																	 '-moz-transform' : 'rotate('+ angle +'deg)',
																	 '-ms-transform' : 'rotate('+ angle +'deg)',
																	 'transform' : 'rotate('+ angle +'deg)'});
						
						$('#wyca_by_step_edit_map_container_all .modalAddDock .fiducial_number_wrapper ').append('<span class="fiducial_number" id="fiducial_number'+i+'" data-id="'+data.D[i].ID+'">'+data.D[i].ID+'</span>');
						
						$('#wyca_by_step_edit_map_container_all .modalAddDock #fiducial_number'+i).css('left',xx); // lidar : y * -1
						$('#wyca_by_step_edit_map_container_all .modalAddDock #fiducial_number'+i).css('top',yy); // 
						$('#wyca_by_step_edit_map_container_all .modalAddDock #fiducial_number'+i).css({'-webkit-transform' : 'rotate('+ angle +'deg)',
																	 '-moz-transform' : 'rotate('+ (angle-180) +'deg)',
																	 '-ms-transform' : 'rotate('+ (angle-180) +'deg)',
																	 'transform' : 'rotate('+ (angle-180) +'deg)'});
						//angle = (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
						$('#wyca_by_step_edit_map_container_all .modalAddDock #wyca_by_step_edit_map_modalAddDock_dock'+i).data('id_fiducial', data.D[i].ID);
						$('#wyca_by_step_edit_map_container_all .modalAddDock #wyca_by_step_edit_map_modalAddDock_dock'+i).data('x', data.D[i].P.X);
						$('#wyca_by_step_edit_map_container_all .modalAddDock #wyca_by_step_edit_map_modalAddDock_dock'+i).data('y', data.D[i].P.Y);
						$('#wyca_by_step_edit_map_container_all .modalAddDock #wyca_by_step_edit_map_modalAddDock_dock'+i).data('theta', data.D[i].P.T);
					}
				}
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
    });
	
	$('#wyca_by_step_edit_map_container_all .modalAddDock .dock').click(function(e) {
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
				WycaByStepAddHistorique({'action':'add_dock', 'data':JSON.stringify(d)});
				docks.push(d);
				WycaByStepTraceDock(docks.length-1);
				
				$('#wyca_by_step_edit_map_container_all .modalAddDock').modal('hide');
				
				currentDockIndex = docks.length-1;
				dock = docks[currentDockIndex];
				
				$('#wyca_by_step_edit_map_dock_name').val(dock.name);
				$('#wyca_by_step_edit_map_dock_comment').val(dock.comment);
				$('#wyca_by_step_edit_map_dock_number').val(dock.num);
				$('#wyca_by_step_edit_map_dock_fiducial_number').val(dock.id_fiducial);
				$('#wyca_by_step_edit_map_dock_is_master').prop('checked', dock.is_master);
				
				
				$('#wyca_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure li').remove();
				
				indexDockElem++;
				
				$('#wyca_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
					'<li id="wyca_by_step_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="move" data-distance="-0.4">'+
					'	<span>' + (typeof(textUndockPathMove) != 'undefined' ? textUndockPathMove : 'Move') + ' ' + (typeof(textUndockPathback) != 'undefined' ? textUndockPathback : 'back') + ' ' +'  0.4m</span>'+
					'	<a href="#" class="bWycaByStepUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bWycaByStepUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
				$('#wyca_by_step_edit_map_container_all .modalDockOptions #wyca_by_step_edit_map_bDockCancelConfig').addClass('disabled');
				$('#wyca_by_step_edit_map_container_all .modalDockOptions').modal('show');
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
	
	$('#wyca_by_step_edit_map_bDockSaveConfig').click(function(e) {
		if(!CheckName(docks, $('#wyca_by_step_edit_map_dock_name').val(), currentDockIndex)){
			firstAction = $('#wyca_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure li').first();
			if (firstAction.data('action') == 'rotate')
			{
				e.preventDefault();
				alert_wyca(textNoStartRotate);
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
						
				dock.name = $('#wyca_by_step_edit_map_dock_name').val();
				dock.num = parseInt($('#wyca_by_step_edit_map_dock_number').val());
				dock.comment = $('#wyca_by_step_edit_map_dock_comment').val();
				if ($('#wyca_by_step_edit_map_dock_is_master').prop('checked'))
				{
					// Désactive les autres
					$.each(docks, function( index, dock ) {
						dock.is_master = false;
					});
				}
				dock.is_master = $('#wyca_by_step_edit_map_dock_is_master').prop('checked');
					
				dock.undock_path = Array();
				
				$('#wyca_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure li').each(function(index, element) {
					if ($(this).data('action') == 'rotate')
					{
						angle_rad = parseFloat($(this).data('angle')) * Math.PI/180;
						dock.undock_path.push({'linear_distance':0, 'angular_distance':angle_rad});
					}
					else
						dock.undock_path.push({'linear_distance':$(this).data('distance'), 'angular_distance':0});
				});
				
				docks[currentDockIndex] = dock;
						
				if (wyca_bystepCurrentAction == 'editDock')
					WycaByStepAddHistorique({'action':'edit_dock', 'data':{'index':currentDockIndex, 'old':saveCurrentDock, 'new':JSON.stringify(docks[currentDockIndex])}});
				saveCurrentDock = JSON.stringify(docks[currentDockIndex]);
				WycaByStepTraceDock(currentDockIndex);
				
				$('#wyca_by_step_edit_map_container_all .modalDockOptions').modal('hide');
				$('#wyca_by_step_edit_map_container_all .modalDockOptions #wyca_by_step_edit_map_bDockCancelConfig').removeClass('disabled');
			}
		}else{
			alert_wyca(textNameUsed);
		};
	});
	
	$('#wyca_by_step_edit_map_container_all .modalDockOptions .bWycaByStepUndockProcedureAddElem').click(function(e) {
        e.preventDefault();
		
		$('#wyca_by_step_edit_map_up_elem_action_move').prop('checked', false);
		$('#wyca_by_step_edit_map_up_elem_action_rotate').prop('checked', false);
		
		$('#wyca_by_step_edit_map_up_elem_direction_back').prop('checked', true);
		$('#wyca_by_step_edit_map_container_all .up_elem_action_move').hide();
		$('#wyca_by_step_edit_map_container_all .up_elem_action_rotate').hide();
		
		$('#wyca_by_step_edit_map_container_all .modalDockElemOptions').data('index_dock_procedure', -1);
		
		$('#wyca_by_step_edit_map_container_all .modalDockElemOptions').modal('show');
    });
	
	$('#wyca_by_step_edit_map_container_all .modalDockElemOptions input:radio[name="up_elem_action"]').change(function () {
		action = $("#wyca_by_step_edit_map_container_all input[name='up_elem_action']:checked").val()
		$('#wyca_by_step_edit_map_container_all .up_elem_action_move').hide();
		$('#wyca_by_step_edit_map_container_all .up_elem_action_rotate').hide();
		if (action == 'move') {
			
			$('#wyca_by_step_edit_map_container_all .up_elem_action_move').show();
		}
		else if (action == 'rotate') {
			$('#wyca_by_step_edit_map_container_all .up_elem_action_rotate').show();
		}
	});
		
	$('#wyca_by_step_edit_map_container_all .modalDockElemOptions .bDockElemSave').click(function(e) {
		
		index_dock_procedure = $('#wyca_by_step_edit_map_container_all .modalDockElemOptions').data('index_dock_procedure');
		if (index_dock_procedure == -1)
		{
			indexDockElem++;
			
			action = $("#wyca_by_step_edit_map_container_all input[name='up_elem_action']:checked").val();
			
			if (action == 'move') {
				
				distance = parseFloat($("#wyca_by_step_edit_map_up_elem_move_distance").val());
				direction = $("#wyca_by_step_edit_map_container_all input[name='up_elem_direction']:checked").val();
							
				$('#wyca_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
					'<li id="wyca_by_step_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="move" data-distance="' + ((direction == 'back')?distance*-1:distance) + '">'+
					'	<span>' + (typeof(textUndockPathMove) != 'undefined' ? textUndockPathMove : 'Move') + ((direction == 'back')?'back':'front') + ' ' + distance + 'm</span>'+
					'	<a href="#" class="bWycaByStepUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bWycaByStepUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
			else if (action == 'rotate') {
				
				angle = $("#wyca_by_step_edit_map_up_elem_rotate_angle").val();
				
				$('#wyca_by_step_edit_map_container_all .modalDockOptions .list_undock_procedure').append('' +
					'<li id="wyca_by_step_edit_map_list_undock_procedure_elem_'+indexDockElem+'" data-index_dock_procedure="'+indexDockElem+'" data-action="rotate" data-angle="'+angle+'">'+
					'	<span>' + (typeof(textUndockPathRotate) != 'undefined' ? textUndockPathRotate : 'Rotate')+' '+angle+'°</span>'+
					'	<a href="#" class="bWycaByStepUndockProcedureDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bWycaByStepUndockProcedureEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
		}
		else
		{
			action = $("#wyca_by_step_edit_map_container_all input[name='up_elem_action']:checked").val();
			if (action == 'move') {
				
				distance = parseFloat($("#wyca_by_step_edit_map_up_elem_move_distance").val());
				direction = $("#wyca_by_step_edit_map_container_all input[name='up_elem_direction']:checked").val();
				
				li = $('#wyca_by_step_edit_map_list_undock_procedure_elem_'+ index_dock_procedure);
				span = $('#wyca_by_step_edit_map_list_undock_procedure_elem_'+ index_dock_procedure + ' span');
				
				li.data('action', 'move');
				li.data('distance', ((direction == 'back')?distance*-1:distance));
				span.html((typeof(textUndockPathMove) != 'undefined' ? textUndockPathMove : 'Move') + ' ' + ((direction == 'back')?(typeof(textUndockPathback) != 'undefined' ? textUndockPathback : 'back'):(typeof(textUndockPathfront) != 'undefined' ? textUndockPathfront : 'front')) + ' ' + distance + 'm');
			}
			else if (action == 'rotate') {
				
				angle = $("#wyca_by_step_edit_map_up_elem_rotate_angle").val();
				
				li = $('#wyca_by_step_edit_map_list_undock_procedure_elem_'+ index_dock_procedure);
				span = $('#wyca_by_step_edit_map_list_undock_procedure_elem_'+ index_dock_procedure + ' span');
				
				li.data('action', 'rotate');
				li.data('angle', angle);
				span.html('Rotate '+' '+angle+'°');
			}
		}
    });
	
	$(document).on('click', '#wyca_by_step_edit_map_container_all .modalDockOptions .bWycaByStepUndockProcedureDeleteElem', function(e) {
		e.preventDefault();
		
		$(this).closest('li').remove();
	});
	
	$(document).on('click', '#wyca_by_step_edit_map_container_all .modalDockOptions .bWycaByStepUndockProcedureEditElem', function(e) {
		e.preventDefault();
		
		$('#wyca_by_step_edit_map_up_elem_action_move').prop('checked', false);
		$('#wyca_by_step_edit_map_up_elem_action_rotate').prop('checked', false);
		
		$('#wyca_by_step_edit_map_container_all .up_elem_action_move').hide();
		$('#wyca_by_step_edit_map_container_all .up_elem_action_rotate').hide();
		
		li = $(this).closest('li');
		if (li.data('action') == 'rotate')
		{
			$('#wyca_by_step_edit_map_container_all .up_elem_action_rotate').show();
			$('#wyca_by_step_edit_map_up_elem_action_rotate').prop('checked', true);
			$("#wyca_by_step_edit_map_up_elem_rotate_angle").val(li.data('angle'));
		}
		else
		{
			$('#wyca_by_step_edit_map_container_all .up_elem_action_move').show();
			$('#wyca_by_step_edit_map_up_elem_action_move').prop('checked', true);
			distance = li.data('distance');
			if (distance < 0)
				$('#wyca_by_step_edit_map_up_elem_direction_back').prop('checked', true);
			else
				$('#wyca_by_step_edit_map_up_elem_direction_front').prop('checked', true);
			
			$("#wyca_by_step_edit_map_up_elem_move_distance").val(Math.abs(distance));
		}
		
		
		$('#wyca_by_step_edit_map_container_all .modalDockElemOptions').data('index_dock_procedure', li.data('index_dock_procedure'));
		
		$('#wyca_by_step_edit_map_container_all .modalDockElemOptions').modal('show');
		
	});
		
	$('#wyca_by_step_edit_map_bDockCreateFromMap').click(function(e) {
        if (wyca_bystepCanChangeMenu)
		{
			blockZoom = true;
			
			$('#wyca_by_step_edit_map_boutonsDock').show();
            $('#wyca_by_step_edit_map_boutonsStandard').hide();
			
			$('#wyca_by_step_edit_map_boutonsDock #wyca_by_step_edit_map_bDockSave').hide();
			$('#wyca_by_step_edit_map_boutonsDock #wyca_by_step_edit_map_bDockDelete').hide();
			$('#wyca_by_step_edit_map_boutonsDock #wyca_by_step_edit_map_bDockDirection').hide();
			
			wyca_bystepCurrentAction = 'addDock';	
			currentStep = 'setPose';
			
			$('body').removeClass('no_current');
			$('body').addClass('addDock');
			
			$('#wyca_by_step_edit_map_message_aide').html(textClickOnMapPose);
			$('#wyca_by_step_edit_map_message_aide').show();
		}
		else
			WycaByStepAvertCantChange();
    });
	
	$('#wyca_by_step_edit_map_bDockDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this docking station?'))
		{
			DeleteDock(currentDockIndex);
		}
    });
	
	$('#wyca_by_step_edit_map_bDockDirection').click(function(e) {
        e.preventDefault();
		
		if ($('#wyca_by_step_edit_map_boutonsRotate').is(':visible'))
		{
			$('#wyca_by_step_edit_map_boutonsRotate').hide();
		}
		else
		{
			dock = docks[currentDockIndex];
			
			//zoom = ros_largeur / $('#wyca_by_step_edit_map_svg').width() / window.panZoom.getZoom();
			zoom = WycaByStepGetZoom();		
			p = $('#wyca_by_step_edit_map_svg image').position();
			
			
			x = dock.approch_pose_x * 100 / 5;
			y = dock.approch_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#wyca_by_step_edit_map_boutonsRotate').css('left', x - $('#wyca_by_step_edit_map_boutonsRotate').width()/2);
			$('#wyca_by_step_edit_map_boutonsRotate').css('top', y - 60);
			$('#wyca_by_step_edit_map_boutonsRotate').show();
		}
	});
	
	/* BTN MENU POI */
	
	$('#wyca_by_step_edit_map_menu .bAddPOI').click(function(e) {
        e.preventDefault();
		WycaByStepHideMenus();
		if (wyca_bystepCanChangeMenu)
		{
			$('#wyca_by_step_edit_map_container_all .modalAddPoi').modal('show');
		}
		else
			WycaByStepAvertCantChange();
	});
	
	$('#wyca_by_step_edit_map_container_all .modalAddPoi #wyca_by_step_edit_map_bModalAddPoiSave').click(function(e) {
        e.preventDefault();
		
		wycaApi.CheckPosition(lastRobotPose.X, lastRobotPose.Y, function(data)
		{
			if (data.A == wycaApi.AnswerCode.NO_ERROR && data.D)
			{
				
				nextIdPoi++;
				poi_temp_add = {'id_poi':nextIdPoi, 'id_map':id_map, 'final_pose_x':lastRobotPose.X, 'final_pose_y':lastRobotPose.Y, 'final_pose_t':lastRobotPose.T, 'name':'POI', 'comment':'', 'color':'', 'icon':'', 'active':true};
				
				WycaByStepAddHistorique({'action':'add_poi', 'data':JSON.stringify(poi_temp_add)});
				pois.push(poi_temp_add);
				WycaByStepTracePoi(pois.length-1);
						
				$('#wyca_by_step_edit_map_container_all .modalAddPoi').modal('hide');
				
				currentPoiIndex = pois.length-1;
				poi = pois[currentPoiIndex];
				
				$('#wyca_by_step_edit_map_poi_name').val(poi.name);
				$('#wyca_by_step_edit_map_poi_comment').val(poi.comment);
				
				$('#wyca_by_step_edit_map_container_all .modalAddPoi').modal('hide');
				$('#wyca_by_step_edit_map_container_all .modalPoiOptions').modal('show');
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
	
	$('#wyca_by_step_edit_map_bPoiSaveConfig').click(function(e) {
		
		if(!CheckName(pois, $('#wyca_by_step_edit_map_poi_name').val(), currentPoiIndex)){
			poi = pois[currentPoiIndex];
			saveCurrentPoi = JSON.stringify(poi);
			
			poi.name = $('#wyca_by_step_edit_map_poi_name').val();
			poi.comment = $('#wyca_by_step_edit_map_poi_comment').val();
			pois[currentPoiIndex] = poi;
			
			$('#wyca_by_step_edit_map_bPoiCancelConfig').show();
					
			if (wyca_bystepCurrentAction == 'editPoi')
				WycaByStepAddHistorique({'action':'edit_poi', 'data':{'index':currentPoiIndex, 'old':saveCurrentPoi, 'new':JSON.stringify(pois[currentPoiIndex])}});
			saveCurrentPoi = JSON.stringify(pois[currentPoiIndex]);
			WycaByStepTracePoi(currentPoiIndex);
			$('#wyca_by_step_edit_map .modal.modalPoiOptions').modal('hide');			
		}else{
			alert_wyca(textNameUsed);
		};
		
	});
	
	$('#wyca_by_step_edit_map_bPoiCreateFromPose').click(function(e) {
		nextIdPoi++;
		p = {'id_poi':nextIdPoi, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':lastRobotPose.x, 'final_pose_y':lastRobotPose.y, 'final_pose_t':lastRobotPose.theta, 'approch_pose_x':lastRobotPose.x, 'approch_pose_y':lastRobotPose.y, 'approch_pose_t':lastRobotPose.theta, 'fiducial_pose_x':0, 'fiducial_pose_y':0, 'fiducial_pose_t':0, 'name':'POI', 'comment':'', 'color':'', 'icon':'', 'active':true};
		WycaByStepAddHistorique({'action':'add_poi', 'data':JSON.stringify(p)});
        pois.push(p);
		WycaByStepTracePoi(pois.length-1);
		
		RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
		RemoveClass('#wyca_by_step_edit_map_svg .activ_select', 'activ_select'); 
		RemoveClass('#wyca_by_step_edit_map_svg .poi_elem', 'movable');
					
		currentSelectedItem = Array();
		currentSelectedItem.push({'type':'poi', 'id':$(this).data('id_poi')});	
		WycaByStepHideCurrentMenuNotSelect();
		
		$('#wyca_by_step_edit_map_boutonsPoi').show();
		
		$('#wyca_by_step_edit_map_boutonsStandard').hide();
		
		$('#wyca_by_step_edit_map_boutonsPoi a').show();
		
		$('body').removeClass('no_current select');
		$('.select').css("strokeWidth", minStokeWidth);
		
		wyca_bystepCurrentAction = 'editPoi';	
		currentStep = '';
		
		currentPoiIndex = GetPoiIndexFromID(nextIdPoi);
		poi = pois[currentPoiIndex];
		saveCurrentPoi = JSON.stringify(poi);
		
		AddClass('#wyca_by_step_edit_map_svg .poi_elem_'+nextIdPoi, 'active');
		AddClass('#wyca_by_step_edit_map_svg .poi_elem_'+nextIdPoi, 'movable');
		
		$('#wyca_by_step_edit_map_bPoiEditName').click();
        
    });
	
	$('#wyca_by_step_edit_map_bPoiCreateFromMap').click(function(e) {
        if (wyca_bystepCanChangeMenu)
		{
			blockZoom = true;
			
			$('#wyca_by_step_edit_map_boutonsPoi').show();
            $('#wyca_by_step_edit_map_boutonsStandard').hide();
			
			$('#wyca_by_step_edit_map_boutonsPoi #wyca_by_step_edit_map_bPoiSave').hide();
			$('#wyca_by_step_edit_map_boutonsPoi #wyca_by_step_edit_map_bPoiDelete').hide();
			$('#wyca_by_step_edit_map_boutonsPoi #wyca_by_step_edit_map_bPoiDirection').hide();
			$('#wyca_by_step_edit_map_boutonsPoi #wyca_by_step_edit_map_bPoiEditName').hide();
			
			wyca_bystepCurrentAction = 'addPoi';	
			currentStep = 'setPose';
			
			$('body').removeClass('no_current');
			$('body').addClass('addPoi');
			
			$('#wyca_by_step_edit_map_message_aide').html(textClickOnMapPose);
			$('#wyca_by_step_edit_map_message_aide').show();
		}
		else
			WycaByStepAvertCantChange();
    });
	
	$('#wyca_by_step_edit_map_bPoiEditSaveConfig').click(function(e) {
		if (wyca_bystepCurrentAction == 'addPoi')
		{
			WycaByStepSaveElementNeeded(false);
			
			nextIdPoi++;
			p = {'id_poi':nextIdPoi, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':currentPoiPose.final_pose_x, 'final_pose_y':currentPoiPose.final_pose_y, 'final_pose_t':currentPoiPose.final_pose_t, 'approch_pose_x':currentPoiPose.approch_pose_x, 'approch_pose_y':currentPoiPose.approch_pose_y, 'approch_pose_t':currentPoiPose.approch_pose_t, 'fiducial_pose_x':currentPoiPose.fiducial_pose_x, 'fiducial_pose_y':currentPoiPose.fiducial_pose_y, 'fiducial_pose_t':currentPoiPose.fiducial_pose_t, 'name':$('#wyca_by_step_edit_map_poi_name').val(), 'comment':'', 'icon':'', 'color':'', 'icon':'', 'active':true};
			WycaByStepAddHistorique({'action':'add_poi', 'data':JSON.stringify(p)});
			
			pois.push(p);
			WycaByStepTracePoi(pois.length-1);
			
			$('#wyca_by_step_edit_map_svg .poi_elem_current').remove();
			
			RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
			
			wyca_bystepCurrentAction = '';
			currentStep = '';
			
			$('#wyca_by_step_edit_map_boutonsRotate').hide();
			
			$('#wyca_by_step_edit_map_boutonsPoi').hide();
			$('#wyca_by_step_edit_map_boutonsStandard').show();
			$('#wyca_by_step_edit_map_message_aide').hide();
			blockZoom = false;
			
			$('body').addClass('no_current');
			
			WycaByStepSetModeSelect();
			
			
		}
		else
		{
			poi = pois[currentPoiIndex];
			poi.name = $('#wyca_by_step_edit_map_poi_name').val();
			if (poi.name == '') poi.name = 'POI';
		}
		
	});
	
	$('#wyca_by_step_edit_map_bPoiDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this POI?'))
		{
			DeletePoi(currentPoiIndex);
		}
    });
	
	$('#wyca_by_step_edit_map_bPoiEditName').click(function(e) {
   		poi = pois[currentPoiIndex];
		$('#wyca_by_step_edit_map_poi_name').val(poi.name);
	});
	
	$('#wyca_by_step_edit_map_bPoiDirection').click(function(e) {
        e.preventDefault();
		
		if ($('#wyca_by_step_edit_map_boutonsRotate').is(':visible'))
		{
			$('#wyca_by_step_edit_map_boutonsRotate').hide();
		}
		else
		{
			poi = pois[currentPoiIndex];
			
			//zoom = ros_largeur / $('#wyca_by_step_edit_map_svg').width() / window.panZoom.getZoom();
			zoom = WycaByStepGetZoom();		
			p = $('#wyca_by_step_edit_map_svg image').position();
			
			x = poi.approch_pose_x * 100 / 5;
			y = poi.approch_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#wyca_by_step_edit_map_boutonsRotate').css('left', x - $('#wyca_by_step_edit_map_boutonsRotate').width()/2);
			$('#wyca_by_step_edit_map_boutonsRotate').css('top', y - 60);
			$('#wyca_by_step_edit_map_boutonsRotate').show();
		}
	});
	
	/* BTN MENU AUGMENTED POSE */
	
	$('#wyca_by_step_edit_map_menu .bAddAugmentedPose').click(function(e) {
        e.preventDefault();
		WycaByStepHideMenus();
		if (wyca_bystepCanChangeMenu)
		{
			$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose .augmented_pose').hide();
			$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose .fiducial_number_wrapper ').html('')
			$('#wyca_by_step_edit_map_container_all .texts_add_augmented_pose').hide();
			$('#wyca_by_step_edit_map_container_all .text_prepare_approch').show();
			currentStepAddAugmentedPose = 'set_approch';
			
			$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose').modal('show');
		}
		else
			WycaByStepAvertCantChange();
	});
	
	$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose .joystickDiv .curseur').on('touchstart', function(e) {
		$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose .augmented_pose').hide();
		$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose .fiducial_number_wrapper ').html('')
	});
	
	$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose .bScanAddAugmentedPose').click(function(e) {
		$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose .bScanAddAugmentedPose').addClass('disabled');
		
		wycaApi.GetMapFiducialsVisible(function(data) {
			
			$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose .bScanAddAugmentedPose').removeClass('disabled');	
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				//console.log(data);
				
				$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose .augmented_pose').hide();
				
				posRobot = $('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose #wyca_by_step_edit_map_modalAddAugmentedPose_robot').offset();
				
				let modalOffset = $('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose .modal-content').offset();
				
				posRobot.left -= modalOffset.left; 
				posRobot.top -= modalOffset.top; 
				
				if (data.D.length > 0)
				{
					$('#wyca_by_step_edit_map_container_all .texts_add_augmented_pose').hide();
					if (currentStepAddAugmentedPose != 'set_final')
						$('#wyca_by_step_edit_map_container_all .text_set_approch').show();
					else
						$('#wyca_by_step_edit_map_container_all .text_set_final').show();
				}
				$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose .fiducial_number_wrapper ').html('')
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
							$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose #wyca_by_step_edit_map_modalAddAugmentedPose_augmented_pose'+i).show();
							$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose #wyca_by_step_edit_map_modalAddAugmentedPose_augmented_pose'+i).css('left', posRobot.left + x_from_robot * 100); // lidar : y * -1
							$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose #wyca_by_step_edit_map_modalAddAugmentedPose_augmented_pose'+i).css('top', posRobot.top - y_from_robot * 100); // +20 position lidar, - 12.5 pour le centre
							//angle = (data.D[i].P.T - lastRobotPose.T) * 180 / Math.PI;
														
							$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose #wyca_by_step_edit_map_modalAddAugmentedPose_augmented_pose'+i).css({'-webkit-transform' : 'rotate('+ angle +'deg)',
																	 '-moz-transform' : 'rotate('+ angle +'deg)',
																	 '-ms-transform' : 'rotate('+ angle +'deg)',
																	 'transform' : 'rotate('+ angle +'deg)'});
							
							
							$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose .fiducial_number_wrapper ').append('<span class="fiducial_number" id="fiducial_number'+i+'" data-id="'+data.D[i].ID+'">'+data.D[i].ID+'</span>');
							
							$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose #fiducial_number'+i).css('left',xx); // lidar : y * -1
							$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose #fiducial_number'+i).css('top',yy); // 
							$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose #fiducial_number'+i).css({'-webkit-transform' : 'rotate('+ angle +'deg)',
																	 '-moz-transform' : 'rotate('+ (angle-180) +'deg)',
																	 '-ms-transform' : 'rotate('+ (angle-180) +'deg)',
																	 'transform' : 'rotate('+ (angle-180) +'deg)'});
							
							
							$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose #wyca_by_step_edit_map_modalAddAugmentedPose_augmented_pose'+i).data('id_fiducial', data.D[i].ID);
							$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose #wyca_by_step_edit_map_modalAddAugmentedPose_augmented_pose'+i).data('x', data.D[i].P.X);
							$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose #wyca_by_step_edit_map_modalAddAugmentedPose_augmented_pose'+i).data('y', data.D[i].P.Y);
							$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose #wyca_by_step_edit_map_modalAddAugmentedPose_augmented_pose'+i).data('theta', data.D[i].P.T);
						}
					}
				}
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
    });
	
	$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose .augmented_pose').click(function(e) {
        e.preventDefault();
		$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose .fiducial_number_wrapper ').html('')
		if (currentStepAddAugmentedPose == 'set_approch')
		{
			that = $(this);
			wycaApi.CheckPosition(lastRobotPose.X, lastRobotPose.Y, function(data)
			{
				if (data.A == wycaApi.AnswerCode.NO_ERROR && data.D)
				{
					
					nextIdAugmentedPose++;
					
					augmented_pose_temp_add = {'id_augmented_pose':nextIdAugmentedPose, 'id_map':id_map, 'id_fiducial':that.data('id_fiducial'), 'fiducial_pose_x':that.data('x'), 'fiducial_pose_y':that.data('y'), 'fiducial_pose_t':that.data('theta'), 'final_pose_x':lastRobotPose.X, 'final_pose_y':lastRobotPose.Y, 'final_pose_t':lastRobotPose.T, 'approch_pose_x':lastRobotPose.X, 'approch_pose_y':lastRobotPose.Y, 'approch_pose_t':lastRobotPose.T, 'name':'Augmented pose', 'comment':'', 'color':'', 'icon':'', 'active':true};
					
					$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose .augmented_pose').hide();
					
					currentStepAddAugmentedPose = 'set_final';
					$('#wyca_by_step_edit_map_container_all .texts_add_augmented_pose').hide();
					$('#wyca_by_step_edit_map_container_all .text_prepare_final').show();
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
			
			WycaByStepAddHistorique({'action':'add_augmented_pose', 'data':JSON.stringify(augmented_pose_temp_add)});
			augmented_poses.push(augmented_pose_temp_add);
			WycaByStepTraceAugmentedPose(augmented_poses.length-1);
					
			$('#wyca_by_step_edit_map_container_all .modalAddAugmentedPose').modal('hide');
			
			currentAugmentedPoseIndex = augmented_poses.length-1;
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			
			$('#wyca_by_step_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose li').remove();
			
			$('#wyca_by_step_edit_map_augmented_pose_name').val(augmented_pose.name);
			$('#wyca_by_step_edit_map_augmented_pose_fiducial_number').val(augmented_pose.id_fiducial);
			$('#wyca_by_step_edit_map_augmented_pose_comment').val(augmented_pose.comment);
			
			
			indexAugmentedPoseElem++;
			
			$('#wyca_by_step_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
				'<li id="wyca_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="move" data-distance="-0.4">'+
				'	<span>' + (typeof(textUndockPathMove) != 'undefined' ? textUndockPathMove : 'Move') + ' ' + (typeof(textUndockPathback) != 'undefined' ? textUndockPathback : 'back') + ' ' +'  0.4m</span>'+
				'	<a href="#" class="bWycaByStepUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
				'	<a href="#" class="bWycaByStepUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
				'</li>'
				);
			
			$('#wyca_by_step_edit_map_bAugmentedPoseCancelConfig').addClass('disabled');
			$('#wyca_by_step_edit_map_container_all .modalAugmentedPoseOptions').modal('show');
		}
    });
	
	$('#wyca_by_step_edit_map_bAugmentedPoseSaveConfig').click(function(e) {
		if(!CheckName(augmented_poses, $('#wyca_by_step_edit_map_augmented_pose_name').val(), currentAugmentedPoseIndex)){
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			saveCurrentAugmentedPose = JSON.stringify(augmented_pose);
					
			augmented_pose.name = $('#wyca_by_step_edit_map_augmented_pose_name').val();
			augmented_pose.comment = $('#wyca_by_step_edit_map_augmented_pose_comment').val();
				
			augmented_pose.undock_path = Array();
			
			$('#wyca_by_step_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose li').each(function(index, element) {
				if ($(this).data('action') == 'rotate')
				{
					angle_rad = parseFloat($(this).data('angle')) * Math.PI/180;
					augmented_pose.undock_path.push({'linear_distance':0, 'angular_distance':angle_rad});
				}
				else
					augmented_pose.undock_path.push({'linear_distance':$(this).data('distance'), 'angular_distance':0});
			});
			
			augmented_poses[currentAugmentedPoseIndex] = augmented_pose;
			
			$('#wyca_by_step_edit_map_bAugmentedPoseCancelConfig').removeClass('disabled');
					
			if (wyca_bystepCurrentAction == 'editAugmentedPose')
				WycaByStepAddHistorique({'action':'edit_augmented_pose', 'data':{'index':currentAugmentedPoseIndex, 'old':saveCurrentAugmentedPose, 'new':JSON.stringify(augmented_poses[currentAugmentedPoseIndex])}});
			saveCurrentAugmentedPose = JSON.stringify(augmented_poses[currentAugmentedPoseIndex]);
			WycaByStepTraceAugmentedPose(currentAugmentedPoseIndex);
			$('#wyca_by_step_edit_map .modal.modalAugmentedPoseOptions').modal('hide');
		}else{
			alert_wyca(textNameUsed);
		};
	});
	
	$('#wyca_by_step_edit_map_container_all .modalAugmentedPoseOptions .bWycaByStepUndockProcedureAugmentedPoseAddElem').click(function(e) {
        e.preventDefault();
		
		$('#wyca_by_step_edit_map_up_augmented_pose_elem_action_move').prop('checked', false);
		$('#wyca_by_step_edit_map_up_augmented_pose_elem_action_rotate').prop('checked', false);
		
		$('#wyca_by_step_edit_map_up_augmented_pose_elem_direction_back').prop('checked', true);
		$('#wyca_by_step_edit_map_container_all .up_augmented_pose_elem_action_move').hide();
		$('#wyca_by_step_edit_map_container_all .up_augmented_pose_elem_action_rotate').hide();
		
		$('#wyca_by_step_edit_map_container_all .modalAugmentedPoseElemOptions').data('index_augmented_pose_procedure', -1);
		
		$('#wyca_by_step_edit_map_container_all .modalAugmentedPoseElemOptions').modal('show');
    });
	
	$('#wyca_by_step_edit_map_container_all .modalAugmentedPoseElemOptions input:radio[name="up_augmented_pose_elem_action"]').change(function () {
		action = $("#wyca_by_step_edit_map_container_all input[name='up_augmented_pose_elem_action']:checked").val()
		$('#wyca_by_step_edit_map_container_all .up_augmented_pose_elem_action_move').hide();
		$('#wyca_by_step_edit_map_container_all .up_augmented_pose_elem_action_rotate').hide();
		if (action == 'move') {
			$('#wyca_by_step_edit_map_container_all .up_augmented_pose_elem_action_move').show();
		}
		else if (action == 'rotate') {
			$('#wyca_by_step_edit_map_container_all .up_augmented_pose_elem_action_rotate').show();
		}
	});
		
	$('#wyca_by_step_edit_map_container_all .modalAugmentedPoseElemOptions .bAugmentedPoseElemSave').click(function(e) {
		
		index_augmented_pose_procedure = $('#wyca_by_step_edit_map_container_all .modalAugmentedPoseElemOptions').data('index_augmented_pose_procedure');
		if (index_augmented_pose_procedure == -1)
		{
			indexAugmentedPoseElem++;
			
			action = $("#wyca_by_step_edit_map_container_all input[name='up_augmented_pose_elem_action']:checked").val();
			
			if (action == 'move') {
				
				distance = parseFloat($("#wyca_by_step_edit_map_up_augmented_pose_elem_move_distance").val());
				direction = $("#wyca_by_step_edit_map_container_all input[name='up_augmented_pose_elem_direction']:checked").val();
							
				$('#wyca_by_step_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
					'<li id="wyca_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="move" data-distance="' + ((direction == 'back')?distance*-1:distance) + '">'+
					'	<span>' + (typeof(textUndockPathMove) != 'undefined' ? textUndockPathMove : 'Move') + ((direction == 'back')?'back':'front') + ' ' + distance + 'm</span>'+
					'	<a href="#" class="bWycaByStepUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bWycaByStepUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
			else if (action == 'rotate') {
				
				angle = $("#wyca_by_step_edit_map_up_augmented_pose_elem_rotate_angle").val();
				
				$('#wyca_by_step_edit_map_container_all .modalAugmentedPoseOptions .list_undock_procedure_augmented_pose').append('' +
					'<li id="wyca_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+indexAugmentedPoseElem+'" data-index_augmented_pose_procedure="'+indexAugmentedPoseElem+'" data-action="rotate" data-angle="'+angle+'">'+
					'	<span>' + (typeof(textUndockPathRotate) != 'undefined' ? textUndockPathRotate : 'Rotate')+' '+angle+'°</span>'+
					'	<a href="#" class="bWycaByStepUndockProcedureAugmentedPoseDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bWycaByStepUndockProcedureAugmentedPoseEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
			}
		}
		else
		{
			action = $("#wyca_by_step_edit_map_container_all input[name='up_augmented_pose_elem_action']:checked").val();
			if (action == 'move') {
				
				distance = parseFloat($("#wyca_by_step_edit_map_up_augmented_pose_elem_move_distance").val());
				direction = $("#wyca_by_step_edit_map_container_all input[name='up_augmented_pose_elem_direction']:checked").val();
				
				li = $('#wyca_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+ index_augmented_pose_procedure);
				span = $('#wyca_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+ index_augmented_pose_procedure + ' span');
				
				li.data('action', 'move');
				li.data('distance', ((direction == 'back')?distance*-1:distance));
				span.html((typeof(textUndockPathMove) != 'undefined' ? textUndockPathMove : 'Move') + ' ' + ((direction == 'back')?(typeof(textUndockPathback) != 'undefined' ? textUndockPathback : 'back'):(typeof(textUndockPathfront) != 'undefined' ? textUndockPathfront : 'front')) + ' ' + distance + 'm');
			}
			else if (action == 'rotate') {
				
				angle = $("#wyca_by_step_edit_map_up_augmented_pose_elem_rotate_angle").val();
				
				li = $('#wyca_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+ index_augmented_pose_procedure);
				span = $('#wyca_by_step_edit_map_list_undock_procedure_augmented_pose_elem_'+ index_augmented_pose_procedure + ' span');
				
				li.data('action', 'rotate');
				li.data('angle', angle);
				span.html('Rotate'+' '+angle+'°');
			}
		}
    });
	
	$(document).on('click', '#wyca_by_step_edit_map_container_all .modalAugmentedPoseOptions .bWycaByStepUndockProcedureAugmentedPoseDeleteElem', function(e) {
		e.preventDefault();
		
		$(this).closest('li').remove();
	});
	
	$(document).on('click', '#wyca_by_step_edit_map_container_all .modalAugmentedPoseOptions .bWycaByStepUndockProcedureAugmentedPoseEditElem', function(e) {
		e.preventDefault();
		
		$('#wyca_by_step_edit_map_up_augmented_pose_elem_action_move').prop('checked', false);
		$('#wyca_by_step_edit_map_up_augmented_pose_elem_action_rotate').prop('checked', false);
		
		$('#wyca_by_step_edit_map_container_all .up_augmented_pose_elem_action_move').hide();
		$('#wyca_by_step_edit_map_container_all .up_augmented_pose_elem_action_rotate').hide();
		
		li = $(this).closest('li');
		if (li.data('action') == 'rotate')
		{
			$('#wyca_by_step_edit_map_container_all .up_augmented_pose_elem_action_rotate').show();
			$('#wyca_by_step_edit_map_up_augmented_pose_elem_action_rotate').prop('checked', true);
			$("#wyca_by_step_edit_map_up_augmented_pose_elem_rotate_angle").val(li.data('angle'));
		}
		else
		{
			$('#wyca_by_step_edit_map_container_all .up_augmented_pose_elem_action_move').show();
			$('#wyca_by_step_edit_map_up_augmented_pose_elem_action_move').prop('checked', true);
			distance = li.data('distance');
			if (distance < 0)
				$('#wyca_by_step_edit_map_up_augmented_pose_elem_direction_back').prop('checked', true);
			else
				$('#wyca_by_step_edit_map_up_augmented_pose_elem_direction_front').prop('checked', true);
			
			$("#wyca_by_step_edit_map_up_augmented_pose_elem_move_distance").val(Math.abs(distance));
		}
		
		
		$('#wyca_by_step_edit_map_container_all .modalAugmentedPoseElemOptions').data('index_augmented_pose_procedure', li.data('index_augmented_pose_procedure'));
		
		$('#wyca_by_step_edit_map_container_all .modalAugmentedPoseElemOptions').modal('show');
		
	});
	
	$('#wyca_by_step_edit_map_bAugmentedPoseCreateFromPose').click(function(e) {
		nextIdAugmentedPose++;
		p = {'id_augmented_pose':nextIdAugmentedPose, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':lastRobotPose.x, 'final_pose_y':lastRobotPose.y, 'final_pose_t':lastRobotPose.theta, 'approch_pose_x':lastRobotPose.x, 'approch_pose_y':lastRobotPose.y, 'approch_pose_t':lastRobotPose.theta, 'fiducial_pose_x':0, 'fiducial_pose_y':0, 'fiducial_pose_t':0, 'name':'Augmented pose', 'comment':'', 'color':'', 'icon':'', 'active':true};
		WycaByStepAddHistorique({'action':'add_augmented_pose', 'data':JSON.stringify(p)});
        augmented_poses.push(p);
		WycaByStepTraceAugmentedPose(augmented_poses.length-1);
		
		RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
		RemoveClass('#wyca_by_step_edit_map_svg .activ_select', 'activ_select'); 
		RemoveClass('#wyca_by_step_edit_map_svg .augmented_pose_elem', 'movable');
					
		currentSelectedItem = Array();
		currentSelectedItem.push({'type':'augmented_pose', 'id':$(this).data('id_augmented_pose')});	
		WycaByStepHideCurrentMenuNotSelect();
		
		$('#wyca_by_step_edit_map_boutonsAugmentedPose').show();
		
		$('#wyca_by_step_edit_map_boutonsStandard').hide();
		
		$('#wyca_by_step_edit_map_boutonsAugmentedPose a').show();
		
		$('body').removeClass('no_current select');
		$('.select').css("strokeWidth", minStokeWidth);
		
		wyca_bystepCurrentAction = 'editAugmentedPose';	
		currentStep = '';
		
		currentAugmentedPoseIndex = GetAugmentedPoseIndexFromID(nextIdAugmentedPose);
		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		saveCurrentAugmentedPose = JSON.stringify(augmented_pose);
		
		AddClass('#wyca_by_step_edit_map_svg .augmented_pose_elem_'+nextIdAugmentedPose, 'active');
		AddClass('#wyca_by_step_edit_map_svg .augmented_pose_elem_'+nextIdAugmentedPose, 'movable');
		
		$('#wyca_by_step_edit_map_bAugmentedPoseEditName').click();
        
    });
	
	$('#wyca_by_step_edit_map_bAugmentedPoseCreateFromMap').click(function(e) {
        if (wyca_bystepCanChangeMenu)
		{
			blockZoom = true;
			
			$('#wyca_by_step_edit_map_boutonsAugmentedPose').show();
            $('#wyca_by_step_edit_map_boutonsStandard').hide();
			
			$('#wyca_by_step_edit_map_boutonsAugmentedPose #wyca_by_step_edit_map_bAugmentedPoseSave').hide();
			$('#wyca_by_step_edit_map_boutonsAugmentedPose #wyca_by_step_edit_map_bAugmentedPoseDelete').hide();
			$('#wyca_by_step_edit_map_boutonsAugmentedPose #wyca_by_step_edit_map_bAugmentedPoseDirection').hide();
			$('#wyca_by_step_edit_map_boutonsAugmentedPose #wyca_by_step_edit_map_bAugmentedPoseEditName').hide();
			
			wyca_bystepCurrentAction = 'addAugmentedPose';	
			currentStep = 'setPose';
			
			$('body').removeClass('no_current');
			$('body').addClass('addAugmentedPose');
			
			$('#wyca_by_step_edit_map_message_aide').html(textClickOnMapPose);
			$('#wyca_by_step_edit_map_message_aide').show();
		}
		else
			WycaByStepAvertCantChange();
    });
	
	$('#wyca_by_step_edit_map_bAugmentedPoseEditSaveConfig').click(function(e) {
		if (wyca_bystepCurrentAction == 'addAugmentedPose')
		{
			WycaByStepSaveElementNeeded(false);
			
			nextIdAugmentedPose++;
			p = {'id_augmented_pose':nextIdAugmentedPose, 'id_map':id_map, 'id_fiducial':-1, 'final_pose_x':currentAugmentedPosePose.final_pose_x, 'final_pose_y':currentAugmentedPosePose.final_pose_y, 'final_pose_t':currentAugmentedPosePose.final_pose_t, 'approch_pose_x':currentAugmentedPosePose.approch_pose_x, 'approch_pose_y':currentAugmentedPosePose.approch_pose_y, 'approch_pose_t':currentAugmentedPosePose.approch_pose_t, 'fiducial_pose_x':currentAugmentedPosePose.fiducial_pose_x, 'fiducial_pose_y':currentAugmentedPosePose.fiducial_pose_y, 'fiducial_pose_t':currentAugmentedPosePose.fiducial_pose_t, 'name':$('#wyca_by_step_edit_map_augmented_pose_name').val(), 'comment':'', 'icon':'', 'color':'', 'icon':'', 'active':true};
			WycaByStepAddHistorique({'action':'add_augmented_pose', 'data':JSON.stringify(p)});
			
			augmented_poses.push(p);
			WycaByStepTraceAugmentedPose(augmented_poses.length-1);
			
			$('#wyca_by_step_edit_map_svg .augmented_pose_elem_current').remove();
			
			RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
			
			wyca_bystepCurrentAction = '';
			currentStep = '';
			
			$('#wyca_by_step_edit_map_boutonsRotate').hide();
			
			$('#wyca_by_step_edit_map_boutonsAugmentedPose').hide();
			$('#wyca_by_step_edit_map_boutonsStandard').show();
			$('#wyca_by_step_edit_map_message_aide').hide();
			blockZoom = false;
			
			$('body').addClass('no_current');
			
			WycaByStepSetModeSelect();
			
			
		}
		else
		{
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			augmented_pose.name = $('#wyca_by_step_edit_map_augmented_pose_name').val();
			if (augmented_pose.name == '') augmented_pose.name = 'Augmented pose';
		}
		
	});
	
	$('#wyca_by_step_edit_map_bAugmentedPoseDelete').click(function(e) {
        if (confirm('Are you sure you want to delete this Augmented pose?'))
		{
			DeleteAugmentedPose(currentAugmentedPoseIndex);
		}
    });
	
	$('#wyca_by_step_edit_map_bAugmentedPoseEditName').click(function(e) {
   		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		$('#wyca_by_step_edit_map_augmented_pose_name').val(augmented_pose.name);
	});
	
	$('#wyca_by_step_edit_map_bAugmentedPoseDirection').click(function(e) {
        e.preventDefault();
		
		if ($('#wyca_by_step_edit_map_boutonsRotate').is(':visible'))
		{
			$('#wyca_by_step_edit_map_boutonsRotate').hide();
		}
		else
		{
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			
			//zoom = ros_largeur / $('#wyca_by_step_edit_map_svg').width() / window.panZoom.getZoom();
			zoom = WycaByStepGetZoom();		
			p = $('#wyca_by_step_edit_map_svg image').position();
			
			x = augmented_pose.approch_pose_x * 100 / 5;
			y = augmented_pose.approch_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#wyca_by_step_edit_map_boutonsRotate').css('left', x - $('#wyca_by_step_edit_map_boutonsRotate').width()/2);
			$('#wyca_by_step_edit_map_boutonsRotate').css('top', y - 60);
			$('#wyca_by_step_edit_map_boutonsRotate').show();
		}
	});
	
	window.oncontextmenu = function(event) {
		 event.preventDefault();
		 event.stopPropagation();
		 return false;
	};
	
	/* BTNS ROTATE */
	
	$(document).on('touchstart', '#wyca_by_step_edit_map_bRotateRight', function(e) {
		WycaByStepSaveElementNeeded(true);
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
		timerRotate = setInterval(function() { 
			if (wyca_bystepCurrentAction == 'addPoi')
			{
				currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) + Math.PI / 90;
				
				WycaByStepTraceCurrentPoi(currentPoiPose);
			}
			else if (wyca_bystepCurrentAction == 'addAugmentedPose')
			{
				currentAugmentedPosePose.approch_pose_t = parseFloat(currentAugmentedPosePose.approch_pose_t) + Math.PI / 90;
				
				WycaByStepTraceCurrentAugmentedPose(currentAugmentedPosePose);
			}
			else if (wyca_bystepCurrentAction == 'addDock')
			{
				currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) + Math.PI / 90;
				
				WycaByStepTraceCurrentDock(currentDockPose);
			}
			else if (wyca_bystepCurrentAction == 'editPoi')
			{
				poi = pois[currentPoiIndex];
				poi.approch_pose_t = parseFloat(poi.approch_pose_t) + Math.PI / 90;
				WycaByStepTracePoi(currentPoiIndex);			
			}
			else if (wyca_bystepCurrentAction == 'editAugmentedPose')
			{
				augmented_pose = augmented_poses[currentAugmentedPoseIndex];
				augmented_pose.approch_pose_t = parseFloat(augmented_pose.approch_pose_t) + Math.PI / 90;
				WycaByStepTraceAugmentedPose(currentAugmentedPoseIndex);			
			}
			else if (wyca_bystepCurrentAction == 'editDock')
			{
				dock = docks[currentDockIndex];
				dock.approch_pose_t = parseFloat(dock.approch_pose_t) + Math.PI / 90;
				WycaByStepTraceDock(currentDockIndex);		
			}
		}, 100);
    });
	
	$(document).on('touchend', '#wyca_by_step_edit_map_bRotateRight', function(e) {
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
    });
	
	$('#wyca_by_step_edit_map_bRotateRight').click(function(e) {
		WycaByStepSaveElementNeeded(true);
		if (wyca_bystepCurrentAction == 'addPoi')
		{
			currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) + Math.PI / 90;
			
			WycaByStepTraceCurrentPoi(currentPoiPose);
		}
		else if (wyca_bystepCurrentAction == 'addAugmentedPose')
		{
			currentAugmentedPosePose.approch_pose_t = parseFloat(currentAugmentedPosePose.approch_pose_t) + Math.PI / 90;
			
			WycaByStepTraceCurrentAugmentedPose(currentAugmentedPosePose);
		}
		else if (wyca_bystepCurrentAction == 'addDock')
		{
			currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) + Math.PI / 90;
			
			WycaByStepTraceCurrentDock(currentDockPose);
		}
		else if (wyca_bystepCurrentAction == 'editPoi')
		{
			poi = pois[currentPoiIndex];
			poi.approch_pose_t = parseFloat(poi.approch_pose_t) + Math.PI / 90;
			WycaByStepTracePoi(currentPoiIndex);			
		}
		else if (wyca_bystepCurrentAction == 'editAugmentedPose')
		{
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			augmented_pose.approch_pose_t = parseFloat(augmented_pose.approch_pose_t) + Math.PI / 90;
			WycaByStepTraceAugmentedPose(currentAugmentedPoseIndex);			
		}
		else if (wyca_bystepCurrentAction == 'editDock')
		{
			dock = docks[currentDockIndex];
			dock.approch_pose_t = parseFloat(dock.approch_pose_t) + Math.PI / 90;
			WycaByStepTraceDock(currentDockIndex);
		}
    });
	
	$(document).on('touchstart', '#wyca_by_step_edit_map_bRotateLeft', function(e) {
		WycaByStepSaveElementNeeded(true);
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
		timerRotate = setInterval(function() { 
			if (wyca_bystepCurrentAction == 'addPoi')
			{
				currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) - Math.PI / 90;
				
				WycaByStepTraceCurrentPoi(currentPoiPose);
			}
			else if (wyca_bystepCurrentAction == 'addAugmentedPose')
			{
				currentAugmentedPosePose.approch_pose_t = parseFloat(currentAugmentedPosePose.approch_pose_t) - Math.PI / 90;
				
				WycaByStepTraceCurrentAugmentedPose(currentAugmentedPosePose);
			}
			else if (wyca_bystepCurrentAction == 'addDock')
			{
				currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) - Math.PI / 90;
				
				WycaByStepTraceCurrentDock(currentDockPose);
			}
			else if (wyca_bystepCurrentAction == 'editPoi')
			{
				poi = pois[currentPoiIndex];
				poi.approch_pose_t = parseFloat(poi.approch_pose_t) - Math.PI / 90;
				WycaByStepTracePoi(currentPoiIndex);			
			}
			else if (wyca_bystepCurrentAction == 'editAugmentedPose')
			{
				augmented_pose = augmented_poses[currentAugmentedPoseIndex];
				augmented_pose.approch_pose_t = parseFloat(augmented_pose.approch_pose_t) - Math.PI / 90;
				WycaByStepTraceAugmentedPose(currentAugmentedPoseIndex);			
			}
			else if (wyca_bystepCurrentAction == 'editDock')
			{
				dock = docks[currentDockIndex];
				dock.approch_pose_t = parseFloat(dock.approch_pose_t) - Math.PI / 90;
				WycaByStepTraceDock(currentDockIndex);
			}
		}, 100);
    });
	
	$(document).on('touchend', '#wyca_by_step_edit_map_bRotateLeft', function(e) {
		if (timerRotate != null)
		{
			clearInterval(timerRotate);
			timerRotate = null;
		}
    });
	
	$('#wyca_by_step_edit_map_bRotateLeft').click(function(e) {
		WycaByStepSaveElementNeeded(true);
        if (wyca_bystepCurrentAction == 'addPoi')
		{
			currentPoiPose.approch_pose_t = parseFloat(currentPoiPose.approch_pose_t) - Math.PI / 90;
			
			WycaByStepTraceCurrentPoi(currentPoiPose);
		}
		else if (wyca_bystepCurrentAction == 'addAugmentedPose')
		{
			currentAugmentedPosePose.approch_pose_t = parseFloat(currentAugmentedPosePose.approch_pose_t) - Math.PI / 90;
			
			WycaByStepTraceCurrentAugmentedPose(currentAugmentedPosePose);
		}
		else if (wyca_bystepCurrentAction == 'addDock')
		{
			currentDockPose.approch_pose_t = parseFloat(currentDockPose.approch_pose_t) - Math.PI / 90;
			
			WycaByStepTraceCurrentDock(currentDockPose);
		}
		else if (wyca_bystepCurrentAction == 'editPoi')
		{
			poi = pois[currentPoiIndex];
			poi.approch_pose_t = parseFloat(poi.approch_pose_t) - Math.PI / 90;
			WycaByStepTracePoi(currentPoiIndex);			
		}
		else if (wyca_bystepCurrentAction == 'editAugmentedPose')
		{
			augmented_pose = augmented_poses[currentAugmentedPoseIndex];
			augmented_pose.approch_pose_t = parseFloat(augmented_pose.approch_pose_t) - Math.PI / 90;
			WycaByStepTraceAugmentedPose(currentAugmentedPoseIndex);			
		}
		else if (wyca_bystepCurrentAction == 'editDock')
		{
			dock = docks[currentDockIndex];
			dock.approch_pose_t = parseFloat(dock.approch_pose_t) - Math.PI / 90;
			WycaByStepTraceDock(currentDockIndex);
		}        
    });
		
	InitTaille();
    
    var offsetMap;
    
    AppliquerZoom();
	
	WycaByStepSetModeSelect();
	
	/* EVENTS ON MAP */
	
	$('#wyca_by_step_edit_map_svg').on('touchstart', function(e) {
		touchStarted = true;
		//zoom = ros_largeur / $('#wyca_by_step_edit_map_svg').width() / window.panZoom.getZoom();
		zoom = WycaByStepGetZoom();
		
		if (wyca_bystepCurrentAction == 'gomme' && currentStep=='')
		{
			$('#wyca_by_step_edit_map .times_icon_menu').hide();
			currentStep='trace';
			if (gommes.length == 0 || Object.keys(gommes[gommes.length-1]).length > 0)
			{
				gommes[gommes.length] = { 'size': sizeGomme, 'points':[] };
				//gommes[gommes.length-1].push({x:0, y:0}); // Point du curseur
				
				p = $('#wyca_by_step_edit_map_svg image').position();
				x = (e.originalEvent.targetTouches[0] ? e.originalEvent.targetTouches[0].pageX : e.originalEvent.changedTouches[e.changedTouches.length-1].pageX) - p.left;
				y = (e.originalEvent.targetTouches[0] ? e.originalEvent.targetTouches[0].pageY : e.originalEvent.changedTouches[e.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
								
				gommes[gommes.length-1].points.push({x:xRos, y:yRos});
				gommes[gommes.length-1].points.push({x:xRos+0.01, y:yRos+0.01}); // Point du curseur
				WycaByStepTraceCurrentGomme(gommes[gommes.length-1], gommes.length-1);
				
				wyca_bystepCanChangeMenu = false;
				$('#wyca_by_step_edit_map_bEndGomme').show();
				$('#wyca_by_step_edit_map_bCancelGomme').show();
			}
		}
		else if (wyca_bystepCurrentAction == 'addDock' && currentStep=='setPose')
		{
			p = $('#wyca_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approach_pose_x = xRos;
			currentDockPose.approach_pose_y = yRos;
			currentDockPose.approach_pose_t = 0;
			
			WycaByStepTraceCurrentDock(currentDockPose);
		}
		/*
		else if (wyca_bystepCurrentAction == 'addDock' && currentStep=='setDir')
		{
			p = $('#wyca_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approch_pose_t = GetAngleRadian(currentDockPose.approch_pose_x, currentDockPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			WycaByStepTraceCurrentDock(currentDockPose);
		}
		*/
		else if (wyca_bystepCurrentAction == 'addPoi' && currentStep=='setPose')
		{
			p = $('#wyca_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approch_pose_x = xRos;
			currentPoiPose.approch_pose_y = yRos;
			currentPoiPose.approch_pose_t = 0;
			
			WycaByStepTraceCurrentPoi(currentPoiPose);
		}
		else if (wyca_bystepCurrentAction == 'addAugmentedPose' && currentStep=='setPose')
		{
			p = $('#wyca_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentAugmentedPosePose.approch_pose_x = xRos;
			currentAugmentedPosePose.approch_pose_y = yRos;
			currentAugmentedPosePose.approch_pose_t = 0;
			
			WycaByStepTraceCurrentAugmentedPose(currentAugmentedPosePose);
		}

		/*
		else if (wyca_bystepCurrentAction == 'addDock' && currentStep=='setDir')
		{
			p = $('#wyca_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approch_pose_t = GetAngleRadian(currentPoiPose.approch_pose_x, currentPoiPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			WycaByStepTraceCurrentPoi(currentPoiPose);
		}
		*/
		/*
		else if (wyca_bystepCurrentAction == 'addForbiddenArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#wyca_by_step_edit_map_mapBox').height() - e.offsetY;
			p = $('#wyca_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentForbiddenPoints.pop(); // Point du curseur
			currentForbiddenPoints.push({x:xRos, y:yRos});
			//currentForbiddenPoints.push({x:xRos, y:yRos}); // Point du curseur
			WycaByStepTraceCurrentForbidden(currentForbiddenPoints);
		}
		else if (wyca_bystepCurrentAction == 'addArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#wyca_by_step_edit_map_mapBox').height() - e.offsetY;
			p = $('#wyca_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
		
			currentAreaPoints.pop(); // Point du curseur
			currentAreaPoints.push({x:xRos, y:yRos});
			//currentAreaPoints.push({x:xRos, y:yRos}); // Point du curseur
			WycaByStepTraceCurrentArea(currentAreaPoints);
		}
		*/
	});
	
	$('#wyca_by_step_edit_map_svg').on('touchmove', function(e) {
		if ($('#wyca_by_step_edit_map_boutonsRotate').is(':visible'))
		{
			//zoom = ros_largeur / $('#wyca_by_step_edit_map_svg').width() / window.panZoom.getZoom();
			zoom = WycaByStepGetZoom();
			 if (wyca_bystepCurrentAction == 'addDock')
			 {
				p = $('#wyca_by_step_edit_map_svg image').position();
				
				x = currentDockPose.approach_pose_x * 100 / 5;
				y = currentDockPose.approach_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#wyca_by_step_edit_map_boutonsRotate').css('left', x - $('#wyca_by_step_edit_map_boutonsRotate').width()/2);
				$('#wyca_by_step_edit_map_boutonsRotate').css('top', y - 60);
				$('#wyca_by_step_edit_map_boutonsRotate').show();
			 }
			 else if (wyca_bystepCurrentAction == 'addPoi')
			 {
				p = $('#wyca_by_step_edit_map_svg image').position();
			
				x = currentPoiPose.approach_pose_x * 100 / 5;
				y = currentPoiPose.approach_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#wyca_by_step_edit_map_boutonsRotate').css('left', x - $('#wyca_by_step_edit_map_boutonsRotate').width()/2);
				$('#wyca_by_step_edit_map_boutonsRotate').css('top', y - 60);
				$('#wyca_by_step_edit_map_boutonsRotate').show();
			 }
			 else if (wyca_bystepCurrentAction == 'addAugmentedPose')
			 {
				p = $('#wyca_by_step_edit_map_svg image').position();
			
				x = currentAugmentedPosePose.approach_pose_x * 100 / 5;
				y = currentAugmentedPosePose.approach_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#wyca_by_step_edit_map_boutonsRotate').css('left', x - $('#wyca_by_step_edit_map_boutonsRotate').width()/2);
				$('#wyca_by_step_edit_map_boutonsRotate').css('top', y - 60);
				$('#wyca_by_step_edit_map_boutonsRotate').show();
			 }
			 else if (wyca_bystepCurrentAction == 'editDock')
			 {
				dock = docks[currentDockIndex];
				
				p = $('#wyca_by_step_edit_map_svg image').position();
				
				
				x = dock.approch_pose_x * 100 / 5;
				y = dock.approch_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#wyca_by_step_edit_map_boutonsRotate').css('left', x - $('#wyca_by_step_edit_map_boutonsRotate').width()/2);
				$('#wyca_by_step_edit_map_boutonsRotate').css('top', y - 60);
				$('#wyca_by_step_edit_map_boutonsRotate').show();
			 }
			 else if (wyca_bystepCurrentAction == 'editPoi')
			 {
				poi = pois[currentPoiIndex];
				
				p = $('#wyca_by_step_edit_map_svg image').position();
				
				
				x = poi.approch_pose_x * 100 / 5;
				y = poi.approch_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#wyca_by_step_edit_map_boutonsRotate').css('left', x - $('#wyca_by_step_edit_map_boutonsRotate').width()/2);
				$('#wyca_by_step_edit_map_boutonsRotate').css('top', y - 60);
				$('#wyca_by_step_edit_map_boutonsRotate').show();
			 }
			 else if (wyca_bystepCurrentAction == 'editAugmentedPose')
			 {
				augmented_pose = augmented_poses[currentAugmentedPoseIndex];
				
				p = $('#wyca_by_step_edit_map_svg image').position();
				
				
				x = augmented_pose.approch_pose_x * 100 / 5;
				y = augmented_pose.approch_pose_y * 100 / 5;
				
				x = x / zoom;
				y = (ros_hauteur - y) / zoom;
				
				x = x + p.left;
				y = y + p.top;
				
				$('#wyca_by_step_edit_map_boutonsRotate').css('left', x - $('#wyca_by_step_edit_map_boutonsRotate').width()/2);
				$('#wyca_by_step_edit_map_boutonsRotate').css('top', y - 60);
				$('#wyca_by_step_edit_map_boutonsRotate').show();
			 }
		}
		
		if (touchStarted)
		{
			//zoom = 1;
			zoom = WycaByStepGetZoom();
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
				  
					$('#wyca_by_step_edit_map_dock_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
					$('#wyca_by_step_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
				  
					delta = (wyca_bystepDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					dock.approch_pose_x = parseFloat(dock.approch_pose_x) - delta;
					delta = (wyca_bystepDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					dock.approch_pose_y = parseFloat(dock.approch_pose_y) + delta;
					
					//movableDown.attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					//movableDown.attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 5); 
					
					
					$('#wyca_by_step_edit_map_dock_'+movableDown.data('id_docking_station')).attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					$('#wyca_by_step_edit_map_dock_'+movableDown.data('id_docking_station')).attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 1); 
					
					$('#wyca_by_step_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('x1', dock.approch_pose_x * 100 / ros_resolution - 1);
					$('#wyca_by_step_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('y1', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 1); 
					$('#wyca_by_step_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('x2', dock.approch_pose_x * 100 / ros_resolution + 1);
					$('#wyca_by_step_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('y2', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 1); 
					
					x = dock.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution);	
					angle = 0 - dock.approch_pose_t * 180 / Math.PI - 90;
					
					$('#wyca_by_step_edit_map_dock_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					$('#wyca_by_step_edit_map_dock_connect_'+movableDown.data('id_docking_station')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					
					//WycaByStepTraceDock(GetDockIndexFromID(movableDown.data('id_docking_station')));
				    
					wyca_bystepDownOnSVG_x = pageX;
					wyca_bystepDownOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'poi')
			   {
				   e.preventDefault();
				    
				   poi = GetPoiFromID(movableDown.data('id_poi'));
				   
				   pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
				   pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
				  	x = poi.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (poi.approch_pose_y * 100 / ros_resolution);
				  
					$('#wyca_by_step_edit_map_poi_sens_'+movableDown.data('id_poi')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
				  
					delta = (wyca_bystepDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					poi.approch_pose_x = parseFloat(poi.approch_pose_x) - delta;
					delta = (wyca_bystepDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					poi.approch_pose_y = parseFloat(poi.approch_pose_y) + delta;
					
					//movableDown.attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					//movableDown.attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 5); 
					
					x = poi.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (poi.approch_pose_y * 100 / ros_resolution);	
					angle = 0 - poi.approch_pose_t * 180 / Math.PI;
					
					$('#wyca_by_step_edit_map_poi_secure_'+movableDown.data('id_poi')).attr('cx', x);
					$('#wyca_by_step_edit_map_poi_secure_'+movableDown.data('id_poi')).attr('cy', y); 
					
					$('#wyca_by_step_edit_map_poi_robot_'+movableDown.data('id_poi')).attr('cx', x);
					$('#wyca_by_step_edit_map_poi_robot_'+movableDown.data('id_poi')).attr('cy', y);
										
					$('#wyca_by_step_edit_map_poi_sens_'+movableDown.data('id_poi')).attr('points', (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2));
					$('#wyca_by_step_edit_map_poi_sens_'+movableDown.data('id_poi')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					
					//WycaByStepTraceDock(GetDockIndexFromID(movableDown.data('id_docking_station')));
				    
					wyca_bystepDownOnSVG_x = pageX;
					wyca_bystepDownOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'augmented_pose')
			   {
				   e.preventDefault();
				    
				   augmented_pose = GetAugmentedPoseFromID(movableDown.data('id_augmented_pose'));
				   
				   pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
				   pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
				  	x = augmented_pose.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (augmented_pose.approch_pose_y * 100 / ros_resolution);
				  
					$('#wyca_by_step_edit_map_augmented_pose_sens_'+movableDown.data('id_augmented_pose')).attr('transform', 'rotate('+0+', '+x+', '+y+')');
				  
					delta = (wyca_bystepDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					augmented_pose.approch_pose_x = parseFloat(augmented_pose.approch_pose_x) - delta;
					delta = (wyca_bystepDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					augmented_pose.approch_pose_y = parseFloat(augmented_pose.approch_pose_y) + delta;
					
					//movableDown.attr('x', dock.approch_pose_x * 100 / ros_resolution - 5);
					//movableDown.attr('y', ros_hauteur - (dock.approch_pose_y * 100 / ros_resolution) - 5); 
					
					x = augmented_pose.approch_pose_x * 100 / ros_resolution;
					y = ros_hauteur - (augmented_pose.approch_pose_y * 100 / ros_resolution);	
					angle = 0 - augmented_pose.approch_pose_t * 180 / Math.PI;
					
					$('#wyca_by_step_edit_map_augmented_pose_secure_'+movableDown.data('id_augmented_pose')).attr('cx', x);
					$('#wyca_by_step_edit_map_augmented_pose_secure_'+movableDown.data('id_augmented_pose')).attr('cy', y); 
					
					$('#wyca_by_step_edit_map_augmented_pose_robot_'+movableDown.data('id_augmented_pose')).attr('cx', x);
					$('#wyca_by_step_edit_map_augmented_pose_robot_'+movableDown.data('id_augmented_pose')).attr('cy', y);
										
					$('#wyca_by_step_edit_map_augmented_pose_sens_'+movableDown.data('id_augmented_pose')).attr('points', (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2));
					$('#wyca_by_step_edit_map_augmented_pose_sens_'+movableDown.data('id_augmented_pose')).attr('transform', 'rotate('+angle+', '+x+', '+y+')');
					
					//WycaByStepTraceDock(GetDockIndexFromID(movableDown.data('id_docking_station')));
				    
					wyca_bystepDownOnSVG_x = pageX;
					wyca_bystepDownOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'forbidden')
			   {
					e.preventDefault();
				    
					forbidden = GetForbiddenFromID(movableDown.data('id_area'));
				   
					pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
					pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
					delta = (wyca_bystepDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					forbidden.points[movableDown.data('index_point')].x = parseFloat(forbidden.points[movableDown.data('index_point')].x) - delta;
					delta = (wyca_bystepDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					forbidden.points[movableDown.data('index_point')].y = parseFloat(forbidden.points[movableDown.data('index_point')].y) + delta;

					movableDown.attr('x', forbidden.points[movableDown.data('index_point')].x * 100 / ros_resolution - 5);
					movableDown.attr('y', ros_hauteur - (forbidden.points[movableDown.data('index_point')].y * 100 / ros_resolution) - 5); 
					
					tempClass = movableDown.attr("class");
					if(!tempClass.includes('editing_point'))
						movableDown.attr("class",tempClass+' editing_point');
					
					WycaByStepTraceForbidden(GetForbiddenIndexFromID(movableDown.data('id_area')));

					wyca_bystepDownOnSVG_x = pageX;
					wyca_bystepDownOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'area')
			   {
					e.preventDefault();
				    
					area = GetAreaFromID(movableDown.data('id_area'));
				   
					pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
					pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
				  
					delta = (wyca_bystepDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					area.points[movableDown.data('index_point')].x = parseFloat(area.points[movableDown.data('index_point')].x) - delta;
					delta = (wyca_bystepDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					area.points[movableDown.data('index_point')].y = parseFloat(area.points[movableDown.data('index_point')].y) + delta;
					
					movableDown.attr('x', area.points[movableDown.data('index_point')].x * 100 / ros_resolution - 5);
					movableDown.attr('y', ros_hauteur - (area.points[movableDown.data('index_point')].y * 100 / ros_resolution) - 5); 
					
					tempClass = movableDown.attr("class");
					if(!tempClass.includes('editing_point'))
						movableDown.attr("class",tempClass+' editing_point');
						
					WycaByStepTraceArea(GetAreaIndexFromID(movableDown.data('id_area')));
				    
					wyca_bystepDownOnSVG_x = pageX;
					wyca_bystepDownOnSVG_y = pageY;
			   }
			   else if (movableDown.data('element_type') == 'polygon_area')
			   {
					e.preventDefault();
				    //console.log(wyca_bystepDownOnSVG_x,wyca_bystepDownOnSVG_y)
					
					area = GetAreaFromID(movableDown.data('id_area'));
				   
					pageX = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX);
					pageY = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY);
					
					//console.log(pageX,pageY)
					
					zoom = WycaByStepGetZoom();
					
					deltaX = (wyca_bystepDownOnSVG_x - pageX) * zoom * ros_resolution / 100;
					deltaY = (wyca_bystepDownOnSVG_y - pageY) * zoom * ros_resolution / 100;
					area.points.forEach(function(item,idx){
						item.x = item.x - deltaX;
						item.y = item.y + deltaY;
						area.points[idx] = item;
					})
					
					WycaByStepTraceArea(GetAreaIndexFromID(movableDown.data('id_area')));
				    
					wyca_bystepDownOnSVG_x = pageX;
					wyca_bystepDownOnSVG_y = pageY;
			   }
			}
			else if (clickSelectSVG && wyca_bystepCurrentAction == 'select')
			{
				e.preventDefault();
				
				//clickSelectSVG_x_last = e.offsetX;
				//clickSelectSVG_y_last = e.offsetY;
				p = $('#wyca_by_step_edit_map_svg image').position();
				clickSelectSVG_x_last = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				clickSelectSVG_y_last = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				
				WycaByStepTraceSection(clickSelectSVG_x, clickSelectSVG_y, clickSelectSVG_x_last, clickSelectSVG_y_last);
			}
			else if (wyca_bystepCurrentAction == 'gomme' && (currentStep=='trace' || currentStep=='traced'))
			{
				e.preventDefault();
				currentStep ='traced';
				
				//x = e.offsetX;
				//y = $('#wyca_by_step_edit_map_mapBox').height() - e.offsetY;
				p = $('#wyca_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
								
				gommes[gommes.length-1].points.pop(); // Point du curseur
				gommes[gommes.length-1].points.push({x:xRos, y:yRos});
				gommes[gommes.length-1].points.push({x:xRos, y:yRos}); // Point du curseur
				WycaByStepTraceCurrentGomme(gommes[gommes.length-1], gommes.length-1);
			}
			else if (wyca_bystepCurrentAction == 'addDock' && currentStep=='setPose')
			{
				p = $('#wyca_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentDockPose.approach_pose_x = xRos;
				currentDockPose.approach_pose_y = yRos;
				currentDockPose.approach_pose_t = 0;
				
				WycaByStepTraceCurrentDock(currentDockPose);
			}
			/*
			else if (wyca_bystepCurrentAction == 'addDock' && currentStep=='setDir')
			{
				p = $('#wyca_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentDockPose.approch_pose_t = GetAngleRadian(currentDockPose.approch_pose_x, currentDockPose.approch_pose_y, xRos, yRos) + Math.PI;
								
				WycaByStepTraceCurrentDock(currentDockPose);
			}
			*/
			else if (wyca_bystepCurrentAction == 'addPoi' && currentStep=='setPose')
			{
				p = $('#wyca_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentPoiPose.approch_pose_x = xRos;
				currentPoiPose.approch_pose_y = yRos;
				currentPoiPose.approch_pose_t = 0;
				
				WycaByStepTraceCurrentPoi(currentPoiPose);
			}
			else if (wyca_bystepCurrentAction == 'addAugmentedPose' && currentStep=='setPose')
			{
				p = $('#wyca_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentAugmentedPosePose.approch_pose_x = xRos;
				currentAugmentedPosePose.approch_pose_y = yRos;
				currentAugmentedPosePose.approch_pose_t = 0;
				
				WycaByStepTraceCurrentAugmentedPose(currentAugmentedPosePose);
			}
			/*
			else if (wyca_bystepCurrentAction == 'addPoi' && currentStep=='setDir')
			{
				p = $('#wyca_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentPoiPose.approch_pose_t = GetAngleRadian(currentPoiPose.approch_pose_x, currentPoiPose.approch_pose_y, xRos, yRos) + Math.PI;
								
				WycaByStepTraceCurrentPoi(currentPoiPose);
			}
			*/
			/*
			else if (wyca_bystepCurrentAction == 'addForbiddenArea' && currentStep=='trace')
			{
				e.preventDefault();
				
				//x = e.offsetX;
				//y = $('#wyca_by_step_edit_map_mapBox').height() - e.offsetY;
				p = $('#wyca_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentForbiddenPoints.pop(); // Point du curseur
				currentForbiddenPoints.push({x:xRos, y:yRos});
				WycaByStepTraceCurrentForbidden(currentForbiddenPoints);
			}
			else if (wyca_bystepCurrentAction == 'addArea' && currentStep=='trace')
			{
				e.preventDefault();
				
				//x = e.offsetX;
				//y = $('#wyca_by_step_edit_map_mapBox').height() - e.offsetY;
				p = $('#wyca_by_step_edit_map_svg image').position();
				x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
				y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
				x = x * zoom;
				y = ros_hauteur - (y * zoom);
				
				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				currentAreaPoints.pop(); // Point du curseur
				currentAreaPoints.push({x:xRos, y:yRos});
				WycaByStepTraceCurrentArea(currentAreaPoints);
			}
			*/
		}
	});
	
	$('#wyca_by_step_edit_map_svg').on('touchend', function(e) {
		touchStarted = false;
		zoom = WycaByStepGetZoom();
		if (downOnMovable)
		{
			downOnMovable = false;
			touchStarted = false;
			blockZoom = false;
			
			if (movableDown.data('element_type') == 'forbidden')
			{
				WycaByStepTraceForbidden(GetForbiddenIndexFromID(movableDown.data('id_area')));
			}
			else if (movableDown.data('element_type') == 'area')
			{
				WycaByStepTraceArea(GetAreaIndexFromID(movableDown.data('id_area')));
			}
		}
		if (wyca_bystepCurrentAction == 'gomme' && currentStep=='traced')
		{
			currentStep='';
			WycaByStepAddHistorique({'action':'gomme', 'data':gommes[gommes.length-1]});
		}
		else if (wyca_bystepCurrentAction == 'addDock' && currentStep=='setPose')
		{
			p = $('#wyca_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approach_pose_x = xRos;
			currentDockPose.approach_pose_y = yRos;
			currentDockPose.approach_pose_t = 0;
			
			WycaByStepTraceCurrentDock(currentDockPose);
			
			
			x = currentDockPose.approach_pose_x * 100 / 5;
			y = currentDockPose.approach_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#wyca_by_step_edit_map_boutonsRotate').css('left', x - $('#wyca_by_step_edit_map_boutonsRotate').width()/2);
			$('#wyca_by_step_edit_map_boutonsRotate').css('top', y - 60);
			$('#wyca_by_step_edit_map_boutonsRotate').show();
			$('#wyca_by_step_edit_map_bDockSave').show();
			
			//currentStep='setDir';
			//$('#wyca_by_step_edit_map_message_aide').html(textClickOnMapDir);
			
		}
		/*
		else if (wyca_bystepCurrentAction == 'addDock' && currentStep=='setDir')
		{
			p = $('#wyca_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentDockPose.approch_pose_t = GetAngleRadian(currentDockPose.approch_pose_x, currentDockPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			WycaByStepTraceCurrentDock(currentDockPose);
			
			$('#wyca_by_step_edit_map_boutonsDock #wyca_by_step_edit_map_bDockSave').show();
		}
		*/
		else if (wyca_bystepCurrentAction == 'addPoi' && currentStep=='setPose')
		{
			p = $('#wyca_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approach_pose_x = xRos;
			currentPoiPose.approach_pose_y = yRos;
			currentPoiPose.approach_pose_t = 0;
			
			WycaByStepTraceCurrentPoi(currentPoiPose);
			
			zoom = ros_largeur / $('#wyca_by_step_edit_map_svg').width() / window.panZoom.getZoom();		
			p = $('#wyca_by_step_edit_map_svg image').position();
			
			
			x = currentPoiPose.approach_pose_x * 100 / 5;
			y = currentPoiPose.approach_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#wyca_by_step_edit_map_boutonsRotate').css('left', x - $('#wyca_by_step_edit_map_boutonsRotate').width()/2);
			$('#wyca_by_step_edit_map_boutonsRotate').css('top', y - 60);
			$('#wyca_by_step_edit_map_boutonsRotate').show();
			$('#wyca_by_step_edit_map_bPoiSave').show();
			
			//currentStep='setDir';
			//$('#wyca_by_step_edit_map_message_aide').html(textClickOnMapDir);
		}
		else if (wyca_bystepCurrentAction == 'addAugmentedPose' && currentStep=='setPose')
		{
			p = $('#wyca_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentAugmentedPosePose.approach_pose_x = xRos;
			currentAugmentedPosePose.approach_pose_y = yRos;
			currentAugmentedPosePose.approach_pose_t = 0;
			
			WycaByStepTraceCurrentAugmentedPose(currentAugmentedPosePose);
			
			zoom = ros_largeur / $('#wyca_by_step_edit_map_svg').width() / window.panZoom.getZoom();		
			p = $('#wyca_by_step_edit_map_svg image').position();
			
			
			x = currentAugmentedPosePose.approach_pose_x * 100 / 5;
			y = currentAugmentedPosePose.approach_pose_y * 100 / 5;
			
			x = x / zoom;
			y = (ros_hauteur - y) / zoom;
			
			x = x + p.left;
			y = y + p.top;
			
			$('#wyca_by_step_edit_map_boutonsRotate').css('left', x - $('#wyca_by_step_edit_map_boutonsRotate').width()/2);
			$('#wyca_by_step_edit_map_boutonsRotate').css('top', y - 60);
			$('#wyca_by_step_edit_map_boutonsRotate').show();
			$('#wyca_by_step_edit_map_bAugmentedPoseSave').show();
			
			//currentStep='setDir';
			//$('#wyca_by_step_edit_map_message_aide').html(textClickOnMapDir);
		}
		/*
		else if (wyca_bystepCurrentAction == 'addPoi' && currentStep=='setDir')
		{
			p = $('#wyca_by_step_edit_map_svg image').position();
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;
			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentPoiPose.approch_pose_t = GetAngleRadian(currentPoiPose.approch_pose_x, currentPoiPose.approch_pose_y, xRos, yRos) + Math.PI;
							
			WycaByStepTraceCurrentPoi(currentPoiPose);
			
			$('#wyca_by_step_edit_map_boutonsPoi #wyca_by_step_edit_map_bPoiSave').show();
		}
		*/
		/*
		else if (wyca_bystepCurrentAction == 'addForbiddenArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#wyca_by_step_edit_map_mapBox').height() - e.offsetY;
			p = $('#wyca_by_step_edit_map_svg image').position();
			
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;

			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			currentForbiddenPoints.pop(); // Point du curseur
			currentForbiddenPoints.push({x:xRos, y:yRos});
			currentForbiddenPoints.push({x:xRos, y:yRos}); // Point du curseur
			WycaByStepTraceCurrentForbidden(currentForbiddenPoints);
		}
		else if (wyca_bystepCurrentAction == 'addArea' && currentStep=='trace')
		{
			e.preventDefault();
			
			//x = e.offsetX;
			//y = $('#wyca_by_step_edit_map_mapBox').height() - e.offsetY;
			p = $('#wyca_by_step_edit_map_svg image').position();
			
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - p.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - p.top;

			x = x * zoom;
			y = ros_hauteur - (y * zoom);
			
			xRos = x * ros_resolution / 100;
			yRos = y * ros_resolution / 100;
			
			
			currentAreaPoints.pop(); // Point du curseur
			currentAreaPoints.push({x:xRos, y:yRos});
			currentAreaPoints.push({x:xRos, y:yRos}); // Point du curseur
			WycaByStepTraceCurrentArea(currentAreaPoints);
		}
		*/
	});
});


// POI FUNCS

function PoiSave()
{
	if (wyca_bystepCurrentAction == 'addPoi')
	{
		$('#wyca_by_step_edit_map_poi_name').val('');
		$('#wyca_by_step_edit_map_modalPoiEditName').modal('show');
	}
	else if (wyca_bystepCurrentAction == 'editPoi')
	{	
		WycaByStepSaveElementNeeded(false);
		
		poi = pois[currentPoiIndex];
		RemoveClass('#wyca_by_step_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		
		WycaByStepAddHistorique({'action':'edit_poi', 'data':{'index':currentPoiIndex, 'old':saveCurrentPoi, 'new':JSON.stringify(pois[currentPoiIndex])}});
		saveCurrentPoi = pois[currentPoiIndex];
		RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
		
		wyca_bystepCurrentAction = '';
		currentStep = '';
		
		$('#wyca_by_step_edit_map_boutonsRotate').hide();
		
		$('#wyca_by_step_edit_map_boutonsPoi').hide();
		$('#wyca_by_step_edit_map_boutonsStandard').show();
		$('#wyca_by_step_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		WycaByStepSetModeSelect();
	}
}

function PoiCancel()
{
	WycaByStepSaveElementNeeded(false);
	
	$('#wyca_by_step_edit_map_svg .poi_elem_current').remove();
	RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (wyca_bystepCurrentAction == 'addPoi')
	{
		$('#wyca_by_step_edit_map_svg .poi_elem_0').remove();
	}
	else if (wyca_bystepCurrentAction == 'editPoi')
	{
		poi = pois[currentPoiIndex];
		RemoveClass('#wyca_by_step_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		
		pois[currentPoiIndex] = JSON.parse(saveCurrentPoi);
		WycaByStepTracePoi(currentPoiIndex);
	}
	wyca_bystepCurrentAction = '';
	currentStep = '';
	
	$('#wyca_by_step_edit_map_boutonsRotate').hide();
	
	$('#wyca_by_step_edit_map_boutonsPoi').hide();
	$('#wyca_by_step_edit_map_boutonsStandard').show();
	$('#wyca_by_step_edit_map_message_aide').hide();
	blockZoom = false;
	
	WycaByStepSetModeSelect();
}

function DeletePoi(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	pois[indexInArray].deleted = true;
	
	WycaByStepAddHistorique({'action':'delete_poi', 'data':indexInArray});
	
	data = pois[indexInArray];
	$('#wyca_by_step_edit_map_svg .poi_elem_'+data.id_poi).remove();
	
	RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
	
	wyca_bystepCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#wyca_by_step_edit_map_boutonsPoi').hide();
    $('#wyca_by_step_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	WycaByStepSetModeSelect();
}

// AUGMENTED POSE FUNCS

function AugmentedPoseSave()
{
	if (wyca_bystepCurrentAction == 'addAugmentedPose')
	{
		$('#wyca_by_step_edit_map_augmented_pose_name').val('');
		$('#wyca_by_step_edit_map_modalAugmentedPoseEditName').modal('show');
	}
	else if (wyca_bystepCurrentAction == 'editAugmentedPose')
	{	
		WycaByStepSaveElementNeeded(false);
		
		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		RemoveClass('#wyca_by_step_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'movable');
		
		WycaByStepAddHistorique({'action':'edit_augmented_pose', 'data':{'index':currentAugmentedPoseIndex, 'old':saveCurrentAugmentedPose, 'new':JSON.stringify(augmented_poses[currentAugmentedPoseIndex])}});
		saveCurrentAugmentedPose = JSON.stringify(augmented_poses[currentAugmentedPoseIndex]);
		RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
		
		wyca_bystepCurrentAction = '';
		currentStep = '';
		
		$('#wyca_by_step_edit_map_boutonsRotate').hide();
		
		$('#wyca_by_step_edit_map_boutonsAugmentedPose').hide();
		$('#wyca_by_step_edit_map_boutonsStandard').show();
		$('#wyca_by_step_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		WycaByStepSetModeSelect();
	}
}

function AugmentedPoseCancel()
{
	WycaByStepSaveElementNeeded(false);
	
	$('#wyca_by_step_edit_map_svg .augmented_pose_elem_current').remove();
	RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (wyca_bystepCurrentAction == 'addAugmentedPose')
	{
		$('#wyca_by_step_edit_map_svg .augmented_pose_elem_0').remove();
	}
	else if (wyca_bystepCurrentAction == 'editAugmentedPose')
	{
		augmented_pose = augmented_poses[currentAugmentedPoseIndex];
		RemoveClass('#wyca_by_step_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'movable');
		
		augmented_poses[currentAugmentedPoseIndex] = JSON.parse(saveCurrentAugmentedPose);
		WycaByStepTraceAugmentedPose(currentAugmentedPoseIndex);
	}
	wyca_bystepCurrentAction = '';
	currentStep = '';
	
	$('#wyca_by_step_edit_map_boutonsRotate').hide();
	
	$('#wyca_by_step_edit_map_boutonsAugmentedPose').hide();
	$('#wyca_by_step_edit_map_boutonsStandard').show();
	$('#wyca_by_step_edit_map_message_aide').hide();
	blockZoom = false;
	
	WycaByStepSetModeSelect();
}

function DeleteAugmentedPose(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	augmented_poses[indexInArray].deleted = true;
	
	WycaByStepAddHistorique({'action':'delete_augmented_pose', 'data':indexInArray});
	
	data = augmented_poses[indexInArray];
	$('#wyca_by_step_edit_map_svg .augmented_pose_elem_'+data.id_augmented_pose).remove();
	
	RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
	
	wyca_bystepCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#wyca_by_step_edit_map_boutonsAugmentedPose').hide();
    $('#wyca_by_step_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	WycaByStepSetModeSelect();
}

// DOCK FUNCS

function DockSave()
{
	$('#wyca_by_step_edit_map_svg .dock_elem_current').remove();
	
	if (wyca_bystepCurrentAction == 'addDock')
	{
		WycaByStepSaveElementNeeded(false);
		
		nextIdDock++;
		num = GetMaxNumDock()+1;
		d = {'id_docking_station':nextIdDock, 'id_map':id_map, 'id_fiducial':$(this).data('id_fiducial'), 'final_pose_x':currentDockPose.final_pose_x, 'final_pose_y':currentDockPose.final_pose_y, 'final_pose_t':currentDockPose.final_pose_t, 'approch_pose_x':currentDockPose.approch_pose_x, 'approch_pose_y':currentDockPose.approch_pose_y, 'approch_pose_t':currentDockPose.approch_pose_t, 'fiducial_pose_x':currentDockPose.fiducial_pose_x, 'fiducial_pose_y':currentDockPose.fiducial_pose_y, 'fiducial_pose_t':currentDockPose.fiducial_pose_t, 'num':parseInt(num), 'name':'Dock '+num, 'comment':''};
		WycaByStepAddHistorique({'action':'add_dock', 'data':JSON.stringify(d)});
		
		docks.push(d);
		WycaByStepTraceDock(docks.length-1);
		
		RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
		
		$('#wyca_by_step_edit_map_svg .dock_elem_0').remove();
		$('#wyca_by_step_edit_map_svg .dock_elem_current').remove();
		
		wyca_bystepCurrentAction = '';
		currentStep = '';
		
		$('#wyca_by_step_edit_map_boutonsRotate').hide();
	
		$('#wyca_by_step_edit_map_boutonsDock').hide();
		$('#wyca_by_step_edit_map_boutonsStandard').show();
		$('#wyca_by_step_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		WycaByStepSetModeSelect();
	}
	else if (wyca_bystepCurrentAction == 'editDock')
	{	
		WycaByStepSaveElementNeeded(false);
		
		
		dock = docks[currentDockIndex];
		RemoveClass('#wyca_by_step_edit_map_svg .dock_elem_'+dock.id_docking_station, 'movable');
		
		WycaByStepAddHistorique({'action':'edit_dock', 'data':{'index':currentDockIndex, 'old':saveCurrentDock, 'new':JSON.stringify(docks[currentDockIndex])}});
		saveCurrentDock = JSON.stringify(docks[currentDockIndex]);
		RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
		
		wyca_bystepCurrentAction = '';
		currentStep = '';
		
		$('#wyca_by_step_edit_map_boutonsRotate').hide();
		
		$('#wyca_by_step_edit_map_boutonsDock').hide();
		$('#wyca_by_step_edit_map_boutonsStandard').show();
		$('#wyca_by_step_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		WycaByStepSetModeSelect();
	}
}

function DockCancel()
{
	WycaByStepSaveElementNeeded(false);
	
	$('#wyca_by_step_edit_map_svg .dock_elem_current').remove();
	RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (wyca_bystepCurrentAction == 'addDock')
	{
		$('#wyca_by_step_edit_map_svg .dock_elem_0').remove();
		$('#wyca_by_step_edit_map_svg .dock_elem_current').remove();
	}
	else if (wyca_bystepCurrentAction == 'editDock')
	{
		dock = docks[currentDockIndex];
		RemoveClass('#wyca_by_step_edit_map_svg .dock_elem_'+dock.id_docking_station, 'movable');
		
		docks[currentDockIndex] = JSON.parse(saveCurrentDock);
		WycaByStepTraceDock(currentDockIndex);
	}
	wyca_bystepCurrentAction = '';
	currentStep = '';
	
	$('#wyca_by_step_edit_map_boutonsRotate').hide();
	
	$('#wyca_by_step_edit_map_boutonsDock').hide();
	$('#wyca_by_step_edit_map_boutonsStandard').show();
	$('#wyca_by_step_edit_map_message_aide').hide();
	blockZoom = false;
	
	WycaByStepSetModeSelect();
}

function DeleteDock(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	docks[indexInArray].deleted = true;
	
	WycaByStepAddHistorique({'action':'delete_dock', 'data':indexInArray});
	
	data = docks[indexInArray];
	$('#wyca_by_step_edit_map_svg .dock_elem_'+data.id_docking_station).remove();
	
	RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
	
	wyca_bystepCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#wyca_by_step_edit_map_boutonsDock').hide();
    $('#wyca_by_step_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	WycaByStepSetModeSelect();
}

// AREA FUNCS
var tempAreaCopy = false;

function GetCenterArea(points){
	let _x = 0 ,_y = 0;
	points.forEach(function(item,idx){
		_x += item.x;
		_y += item.y;
	})
	_x=_x/points.length;
	_y=_y/points.length;
	
	return{'x':_x,'y':_y};
}

function AreaSave(origin = false)
{
	$('#wyca_by_step_edit_map_svg .area_elem_current').remove();
	
	if (wyca_bystepCurrentAction == 'addArea')
	{
		WycaByStepSaveElementNeeded(false);
		
		WycaByStepAddHistorique({'action':'edit_area', 'data':{'index':currentAreaIndex, 'old':saveCurrentArea, 'new':JSON.stringify(areas[currentAreaIndex])}});
		
		saveCurrentArea = JSON.stringify(areas[currentAreaIndex]);
		/*
		RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
		RemoveClass('#wyca_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
		
		wyca_bystepCurrentAction = '';
		currentStep = '';
		
		$('#wyca_by_step_edit_map_boutonsForbidden').hide();
		$('#wyca_by_step_edit_map_boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		WycaByStepSetModeSelect();
		*/
		currentAreaWycaByStepLongTouch = $('#wyca_by_step_edit_map_area_'+areas[currentAreaIndex].id_area);
		wyca_bystepCurrentAction = 'editArea';
		RemoveClass('#wyca_by_step_edit_map_svg .editing_point ', 'editing_point ');
		WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_area');
		if(origin == 'save' && tempAreaCopy == false)
			$('#wyca_by_step_edit_map_menu_area .bConfigArea').click();
		tempAreaCopy = false;
	}
	else if (wyca_bystepCurrentAction == 'editArea')
	{
		WycaByStepSaveElementNeeded(false);
		
		WycaByStepAddHistorique({'action':'edit_area', 'data':{'index':currentAreaIndex, 'old':saveCurrentArea, 'new':JSON.stringify(areas[currentAreaIndex])}});
		
		saveCurrentArea = JSON.stringify(areas[currentAreaIndex]);
		
		wyca_bystepCurrentAction = 'editArea';
		RemoveClass('#wyca_by_step_edit_map_svg .editing_point ', 'editing_point ');
		WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_area');
		/*
		RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
		
		wyca_bystepCurrentAction = '';
		currentStep = '';
		
		$('#wyca_by_step_edit_map_boutonsArea').hide();
		$('#wyca_by_step_edit_map_boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		WycaByStepSetModeSelect();
		*/
	}
	else if (wyca_bystepCurrentAction == 'moveArea')
	{
		//console.log('here',currentAreaIndex);
		WycaByStepSaveElementNeeded(false);
		
		WycaByStepAddHistorique({'action':'edit_area', 'data':{'index':currentAreaIndex, 'old':saveCurrentArea, 'new':JSON.stringify(areas[currentAreaIndex])}});
		
		saveCurrentArea = JSON.stringify(areas[currentAreaIndex]);
		
		wyca_bystepCurrentAction = 'editArea';
		RemoveClass('#wyca_by_step_edit_map_svg .moving ', 'moving');
		RemoveClass('#wyca_by_step_edit_map_svg polygon.movable ', 'movable');
		//WycaByStepTraceArea(currentAreaIndex);
		WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_area');
		/*
		RemoveClass('#wyca_by_step_edit_map_svg .moving', 'moving');
		areas[currentAreaIndex] = JSON.parse(saveCurrentArea);
		WycaByStepTraceArea(currentAreaIndex);
		wyca_bystepCurrentAction = 'editArea';
		WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_area');*/
	}
}

function AreaCancel()
{
	WycaByStepSaveElementNeeded(false);
	
	$('#wyca_by_step_edit_map_svg .area_elem_current').remove();
	//RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
	if(currentPointWycaByStepLongTouch != null)
		currentPointWycaByStepLongTouch.data('index_point',-1);
	currentPointWycaByStepLongTouch = null;
	
	$('body').addClass('no_current');
	
	if (wyca_bystepCurrentAction == 'addArea')
	{
		DeleteArea(currentAreaIndex);
		wyca_bystepHistoriques.pop();
		wyca_bystepHistoriqueIndex--;
		$('#wyca_by_step_edit_map .times_icon_menu').hide();
	}
	else if (wyca_bystepCurrentAction == 'editArea')
	{
		areas[currentAreaIndex] = JSON.parse(saveCurrentArea);
		WycaByStepTraceArea(currentAreaIndex);
		wyca_bystepCurrentAction = 'editArea';
		WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_area');
	}
	else if (wyca_bystepCurrentAction == 'moveArea')
	{
		RemoveClass('#wyca_by_step_edit_map_svg .moving', 'moving');
		areas[currentAreaIndex] = JSON.parse(saveCurrentArea);
		WycaByStepTraceArea(currentAreaIndex);
		wyca_bystepCurrentAction = 'editArea';
		WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_area');
	}
	
	currentStep = '';
	
	$('#wyca_by_step_edit_map_boutonsArea').hide();
	$('#wyca_by_step_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	if(tempAreaCopy != false)
		tempAreaCopy = false;
		
}

function DeleteArea(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	areas[indexInArray].deleted = true;
	
	WycaByStepAddHistorique({'action':'delete_area', 'data':indexInArray});
	
	data = areas[indexInArray];
	$('#wyca_by_step_edit_map_svg .area_elem_'+data.id_area).remove();
	
	RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
	
	wyca_bystepCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#wyca_by_step_edit_map_boutonsArea').hide();
    $('#wyca_by_step_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	WycaByStepSetModeSelect();
}

// FORBIDDEN FUNCS

function ForbiddenSave(origin = false)
{
	$('#wyca_by_step_edit_map_container_all .forbidden_elem_current').remove();
	
	if (wyca_bystepCurrentAction == 'addForbiddenArea')
	{
		WycaByStepSaveElementNeeded(false);
		
		WycaByStepAddHistorique({'action':'edit_forbidden', 'data':{'index':currentForbiddenIndex, 'old':saveCurrentForbidden, 'new':JSON.stringify(forbiddens[currentForbiddenIndex])}});
		
		saveCurrentForbidden = JSON.stringify(forbiddens[currentForbiddenIndex]);
		/*
		RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
		RemoveClass('#wyca_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
		
		wyca_bystepCurrentAction = '';
		currentStep = '';
		
		$('#wyca_by_step_edit_map_boutonsForbidden').hide();
		$('#wyca_by_step_edit_map_boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		WycaByStepSetModeSelect();
		*/
		currentForbiddenWycaByStepLongTouch = $('#wyca_by_step_edit_map_forbidden_'+forbiddens[currentForbiddenIndex].id_area);
		
		wyca_bystepCurrentAction = 'editForbiddenArea';
		RemoveClass('#wyca_by_step_edit_map_svg .editing_point ', 'editing_point ');
		if(origin == false)
			WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_forbidden');
		else{
			// UNSELECT POINT
			if(currentPointWycaByStepLongTouch != null)
				currentPointWycaByStepLongTouch.data('index_point',-1);
			currentPointWycaByStepLongTouch = null;
			
			RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
			RemoveClass('#wyca_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
			$('#wyca_by_step_edit_map_menu .bAddForbiddenArea').click();
		}
	}
	else if (wyca_bystepCurrentAction == 'editForbiddenArea')
	{	
		WycaByStepSaveElementNeeded(false);
		
		WycaByStepAddHistorique({'action':'edit_forbidden', 'data':{'index':currentForbiddenIndex, 'old':saveCurrentForbidden, 'new':JSON.stringify(forbiddens[currentForbiddenIndex])}});
		
		saveCurrentForbidden = JSON.stringify(forbiddens[currentForbiddenIndex]);
		
		wyca_bystepCurrentAction = 'editForbiddenArea';
		RemoveClass('#wyca_by_step_edit_map_svg .editing_point ', 'editing_point ');
		if(origin == false)
			WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_forbidden');
		else{
			// UNSELECT POINT
			if(currentPointWycaByStepLongTouch != null)
				currentPointWycaByStepLongTouch.data('index_point',-1);
			currentPointWycaByStepLongTouch = null;
			
			RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
			RemoveClass('#wyca_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
			$('#wyca_by_step_edit_map_menu .bAddForbiddenArea').click();
		}
		/*
		RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
		RemoveClass('#wyca_by_step_edit_map_svg .activ_select', 'activ_select'); 
			
		
		wyca_bystepCurrentAction = '';
		currentStep = '';
		
		$('#wyca_by_step_edit_map_boutonsForbidden').hide();
		$('#wyca_by_step_edit_map_boutonsStandard').show();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		WycaByStepSetModeSelect();
		*/
	}
}

function ForbiddenCancel()
{
	WycaByStepSaveElementNeeded(false);
	
	$('#wyca_by_step_edit_map_svg .forbidden_elem_current').remove();
	//RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if(currentPointWycaByStepLongTouch != null)
		currentPointWycaByStepLongTouch.data('index_point',-1);
	currentPointWycaByStepLongTouch = null;
	
	if (wyca_bystepCurrentAction == 'addForbiddenArea')
	{
		DeleteForbidden(currentForbiddenIndex);
		wyca_bystepHistoriques.pop();
		wyca_bystepHistoriqueIndex--;
		$('#wyca_by_step_edit_map .times_icon_menu').hide();
	}
	else if (wyca_bystepCurrentAction == 'editForbiddenArea')
	{
		forbiddens[currentForbiddenIndex] = JSON.parse(saveCurrentForbidden);
		WycaByStepTraceForbidden(currentForbiddenIndex);
		wyca_bystepCurrentAction = 'editForbiddenArea';
		WycaByStepDisplayMenu('wyca_by_step_edit_map_menu_forbidden');
	}

	currentStep = '';
	
	$('#wyca_by_step_edit_map_boutonsForbidden').hide();
	$('#wyca_by_step_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	//WycaByStepSetModeSelect();
	
}

function DeleteForbidden(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	forbiddens[indexInArray].deleted = true;
	
	WycaByStepAddHistorique({'action':'delete_forbidden', 'data':indexInArray});
	
	data = forbiddens[indexInArray];
	$('#wyca_by_step_edit_map_svg .forbidden_elem_'+data.id_area).remove();
	
	RemoveClass('#wyca_by_step_edit_map_svg .active', 'active');
	
	wyca_bystepCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	
	$('#wyca_by_step_edit_map_boutonsForbidden').hide();
    $('#wyca_by_step_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	WycaByStepSetModeSelect();
}

function RefreshZoomView()
{
	pSVG = $('#wyca_by_step_edit_map_svg').position();
	pImg = $('#wyca_by_step_edit_map_svg image').position();
	pImg.left -= pSVG.left;
	pImg.top -= pSVG.top;
	
	//zoom = ros_largeur / $('#wyca_by_step_edit_map_svg').width() / window.panZoom.getZoom();
	zoom = WycaByStepGetZoom();
	
	wZoom = $('#wyca_by_step_edit_map_zoom_carte').width();
	hZoom = $('#wyca_by_step_edit_map_zoom_carte').height();
	
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
	
	hNew = $('#wyca_by_step_edit_map_svg').height() * zoom  / ros_largeur * wZoom;
	wNew = $('#wyca_by_step_edit_map_svg').width() * zoom  / ros_largeur * wZoom;
	
	//if (tNew + hNew > hZoom) hNew = hZoom - tNew;
	//if (lNew + wNew > wZoom) wNew = wZoom - lNew;
		
	$('#wyca_by_step_edit_map_zone_zoom').width(wNew);
	$('#wyca_by_step_edit_map_zone_zoom').height(hNew);
				
	$('#wyca_by_step_edit_map_zone_zoom').css('top', tNew - 1);
	$('#wyca_by_step_edit_map_zone_zoom').css('left', lNew - 1);
	
}

function WycaByStepDisplayApiMessageGoTo(data)
{

	if (data.A == wycaApi.AnswerCode.NO_ERROR)
	{
		//SI SUCCESS
		wycaApi.PlaySound(wycaApi.SOUND.SUCCESS, 1);
		$('#wyca_by_step_edit_map .modalFinTest section.panel-success').show();
		$('#wyca_by_step_edit_map .modalFinTest section.panel-danger').hide();
		$('#wyca_by_step_edit_map .modalFinTest section.panel-warning').hide();
		
		$('#wyca_by_step_edit_map .modalFinTest').modal('show');
	}
	else
	{	
		let html,target;
		if(data.A == wycaApi.AnswerCode.CANCELED){
			//SI CANCEL
			$('#wyca_by_step_edit_map .modalFinTest section.panel-success').hide();
			$('#wyca_by_step_edit_map .modalFinTest section.panel-danger').hide();
			$('#wyca_by_step_edit_map .modalFinTest section.panel-warning').show();
			
			html = typeof(textActionCanceled) != 'undefined' ? textActionCanceled : wycaApi.AnswerCodeToString(data.A);
			target = $('#wyca_by_step_edit_map .modalFinTest section.panel-warning span.error_details');
		}else{
			//SI ERROR
			wycaApi.PlaySound(wycaApi.SOUND.ALERT, 1);
			$('#wyca_by_step_edit_map .modalFinTest section.panel-success').hide();
			$('#wyca_by_step_edit_map .modalFinTest section.panel-danger').show();
			$('#wyca_by_step_edit_map .modalFinTest section.panel-warning').hide();
			
			if(data.A == wycaApi.AnswerCode.DETAILS_IN_MESSAGE){
				html  = typeof(textDetailsInMessage) != 'undefined' ? textDetailsInMessage : wycaApi.AnswerCodeToString(data.A);
				html += '<span class="toggle_details" onClick="$(\'span.error_details span.details\').toggle();"><i class="fas fa-plus-circle"></i> ';
				html += typeof(textSeeMoreDetails) != 'undefined' ? textSeeMoreDetails : wycaApi.AnswerCodeToString(data.A) ;
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
			target = $('#wyca_by_step_edit_map .modalFinTest section.panel-danger span.error_details');
		}
		
		target.html(html);
		$('#wyca_by_step_edit_map .modalFinTest').modal('show');
	}
	
}

