// JavaScript Document
var boolModalGoToPoi = true;
var boolModalGoToAugmentedPose = true;
var boolModalGoToDock = true;
var boolHelpGotoPose = true;

var userCurrentAction = '';
var svgUser;
var userDownOnSVG = false;
var userDownOnSVG_x = 0;
var userDownOnSVG_y = 0;
var userDownOnSVG_x_scroll = 0;
var userDownOnSVG_y_scroll = 0;
var userCanChangeMenu = true;
var userSavedCanClose = true;

var xGotoPose = 0 ;
var yGotoPose = 0 ;

function UserAvertCantChange()
{
	$('#user_edit_map_bModalCancelEdit').click();
}

function UserCloseSelect()
{
	userCurrentAction = '';
	currentStep = '';
}

function UserHideCurrentMenu()
{
	/*
	if (userCurrentAction == 'export') CloseExport();
	if (userCurrentAction == 'jobs') CloseJobs();
	if (userCurrentAction == 'select') UserCloseSelect()
	*/
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	$('body').attr('class', 'no_current');

	userCurrentAction = '';
	currentStep = '';
}

function UserHideCurrentMenuNotSelect()
{
	if (userCurrentAction == 'select') return;
	
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	$('body').attr('class', 'no_current');
	
	userCurrentAction = '';
	currentStep = '';
}

var userHistoriques = Array();

var userHistoriqueIndex = -1;

function UserUndo()
{
	userSavedCanClose = false;
	
	elem = userHistoriques[userHistoriqueIndex];
	switch(elem.action)
	{
		case 'add_poi':
			pois.pop();
			$('#user_edit_map_svg .poi_elem_'+elem.data.id_poi).remove();
			break;
		case 'edit_poi':
			pois[elem.data.index] = JSON.parse(elem.data.old);
			UserTracePoi(elem.data.index);
			break;
		case 'delete_poi':
			pois[elem.data].deleted = false;
			UserTracePoi(elem.data);
			break;
	}
	userHistoriqueIndex--;
	
	UserRefreshHistorique();
}

function UserRedo()
{
	userSavedCanClose = false;
	
	userHistoriqueIndex++;
	
	elem = userHistoriques[userHistoriqueIndex];
	switch(elem.action)
	{
		case 'add_poi':
			pois.push(elem.data);
			UserTracePoi(pois.length-1);
			break;
		case 'edit_poi':
			pois[elem.data.index] = JSON.parse(elem.data.new);
			UserTracePoi(elem.data.index);
			break;
		case 'delete_poi':
			pois[elem.data].deleted = true;
			UserTracePoi(elem.data);
			break;
	}
	
	UserRefreshHistorique();
}

function UserAddHistorique(elem)
{
	userSavedCanClose = false;
	
	while (userHistoriqueIndex < userHistoriques.length-1)
		userHistoriques.pop();
	
	userHistoriques.push(elem);
	userHistoriqueIndex++;
	
	UserRefreshHistorique();
}

function UserRefreshHistorique()
{
	if (userHistoriqueIndex == -1)
		$('#user_edit_map_bUserUndo').addClass('disabled');
	else
		$('#user_edit_map_bUserUndo').removeClass('disabled');
	if (userHistoriqueIndex == userHistoriques.length-1)
		$('#user_edit_map_bUserRedo').addClass('disabled');
	else
		$('#user_edit_map_bUserRedo').removeClass('disabled');
}

function UserSetModeSelect()
{
	$('body').addClass('select');
	userCurrentAction = 'select';
	currentStep = '';
}

function UserSaveElementNeeded(need)
{
	userCanChangeMenu = !need;
	if (need)
	{
		$('#user_edit_map_bSaveCurrentElem').show();
		$('#user_edit_map_bCancelCurrentElem').show();
	}
	else
	{
		$('#user_edit_map_bSaveCurrentElem').hide();
		$('#user_edit_map_bCancelCurrentElem').hide();
	}
}

$(document).ready(function() {
	/* RELOAD MAP */
	
	$('#user_edit_map #user_edit_map_bAbortReloadMap').click(function(){
		$('.modalConfirmNoReloadMap').modal('show');
	})
	
	$('#user_edit_map .modalReloadMap .user_edit_map_bReloadMap').click(function(){
		$('#user_edit_map .modalReloadMap .btn').addClass('disabled');
		$('#user_edit_map .modalReloadMap .user_edit_map_modalReloadMap_loading').show();
		GetInfosCurrentMapUser();
	})
	
	$('#user_edit_map .modalConfirmNoReloadMap .user_edit_map_bReloadMap').click(function(){
		$('#user_edit_map .modalConfirmNoReloadMap .btn').addClass('disabled');
		$('#user_edit_map .modalConfirmNoReloadMap .user_edit_map_modalReloadMap_loading').show();
		GetInfosCurrentMapUser();
	})
	
	window.addEventListener('beforeunload', function(e){
		if (!userSavedCanClose)
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
	
	
	svgUser = document.querySelector('#user_edit_map_svg');
	UserInitSVG();
	
	$('#user_edit_map #user_edit_map_bStop').click(function(e) {
        e.preventDefault();
		
		wycaApi.StopMove();	
    });
	
	$('#user_edit_map #user_edit_map_bSaveCurrentElem').click(function(e) {
        e.preventDefault();
		
		if (userCurrentAction == 'addPoi' || userCurrentAction == 'editPoi')
			UserPoiSave();
		else if (userCurrentAction == 'addDock' || userCurrentAction == 'editDock')
			UserDockSave();
		else if (userCurrentAction == 'addArea' || userCurrentAction == 'editArea')
			UserAreaSave();
		else if (userCurrentAction == 'addForbiddenArea' || userCurrentAction == 'editForbiddenArea')
			UserForbiddenSave();		
    });
	
	$('#user_edit_map #user_edit_map_bCancelCurrentElem').click(function(e) {
        e.preventDefault();
		
		if (userCurrentAction == 'addPoi' || userCurrentAction == 'editPoi')
			UserPoiCancel();
		else if (userCurrentAction == 'addDock' || userCurrentAction == 'editDock')
			UserDockCancel();
		else if (userCurrentAction == 'addArea' || userCurrentAction == 'editArea')
			UserAreaCancel();
		else if (userCurrentAction == 'addForbiddenArea' || userCurrentAction == 'editForbiddenArea')
			UserForbiddenCancel();		
    });
	
	$('#user_edit_map_bUserUndo').click(function(e) {
        e.preventDefault();
		if (!userCanChangeMenu)
			UserShakeActiveElement();
		else
			if (!$('#user_edit_map_bUserUndo').hasClass('disabled'))
				UserUndo();
	});
	/*
	$('#user_edit_map_bUserUndo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#user_edit_map_bUserUndo').hasClass('disabled'))
			UserUndo();
	});
	*/
	$('#user_edit_map_bUserRedo').click(function(e) {
        e.preventDefault();
		if (!userCanChangeMenu)
			UserShakeActiveElement();
		else
			if (!$('#user_edit_map_bUserRedo').hasClass('disabled'))
				UserRedo();
    });
	/*
	$('#user_edit_map_bUserRedo').on('touchstart', function(e) { 
		e.preventDefault();
		if (!$('#user_edit_map_bUserRedo').hasClass('disabled'))
			UserRedo();
	});
	*/
	/* AUGMENTED POSE */
	
	$('#user_edit_map .bTestAugmentedPose').click(function(e) {
        e.preventDefault();
		RemoveClass('#user_edit_map_svg .augmented_pose_elem', 'active');
		wycaApi.on('onGoToAugmentedPoseResult', function (data){
			$('#user_edit_map_bStop').hide();
			
			UserDisplayApiMessageGoTo(data);
			// On rebranche l'ancienne fonction
			wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
		
		});
		
		wycaApi.GoToAugmentedPose(currentAugmentedPoseUserLongTouch.data('id_augmented_pose'), function (data){
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#user_edit_map_bStop').show();
			}
			else
			{
				UserDisplayApiMessageGoTo(data);
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
			}
		});
	
    });
	
	$('#user_edit_map .bModalGoToAugmentedPose').click(function(e){
		e.preventDefault();
		$('#user_edit_map .bTestAugmentedPose').click();
		boolModalGoToAugmentedPose = !$('#user_edit_map .checkboxGotoaugmentedpose').prop('checked'); //ADD SAVING BDD / COOKIES ?
	})
	
	$('#user_edit_map .bModalCancelGoToAugmentedPose').click(function(){
		boolModalGoToAugmentedPose = !$('#user_edit_map .checkboxGotoaugmentedpose').prop('checked'); //ADD SAVING BDD / COOKIES ?
		RemoveClass('#user_edit_map_svg .active', 'active'); 
	});
	
	/* DOCK */
	
	$('#user_edit_map .bModalGoToDock').click(function(){
		$('#user_edit_map .bTestDock').click();
		boolModalGoToDock = !$('#user_edit_map .checkboxGotodock').prop('checked'); //ADD SAVING BDD / COOKIES ?
	});
	
	$('#user_edit_map .bModalCancelGoToDock').click(function(){
		boolModalGoToDock = !$('#user_edit_map .checkboxGotodock').prop('checked'); //ADD SAVING BDD / COOKIES ?
		RemoveClass('#user_edit_map_svg .active', 'active');
	});
	
	$('#user_edit_map .bTestDock').click(function(e) {
        e.preventDefault();
		RemoveClass('#user_edit_map_svg .dock_elem', 'active');
		wycaApi.on('onGoToChargeResult', function (data){
			$('#user_edit_map_bStop').hide();
			UserDisplayApiMessageGoTo(data);
			// On rebranche l'ancienne fonction
			wycaApi.on('onGoToChargeResult', onGoToChargeResult);
		});
		
		wycaApi.GoToCharge(currentDockUserLongTouch.data('id_docking_station'), function (data){
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#user_edit_map_bStop').show();
			}
			else
			{
				UserDisplayApiMessageGoTo(data);
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToChargeResult', onGoToChargeResult);
			}
		});
    });
	
	/* POI */
	
	$('#user_edit_map .bModalGoToPoi').click(function(){
		$('#user_edit_map .bTestPoi').click();
		boolModalGoToPoi = !$('#user_edit_map .checkboxGotopoi').prop('checked'); //ADD SAVING BDD / COOKIES ?
	});
	
	$('#user_edit_map .bModalCancelGoToPoi').click(function(){
		boolModalGoToPoi = !$('#user_edit_map .checkboxGotopoi').prop('checked'); //ADD SAVING BDD / COOKIES ?
		RemoveClass('#user_edit_map_svg .active', 'active');
	});
	
	$('#user_edit_map .bTestPoi').click(function(e) {
        e.preventDefault();
		RemoveClass('#user_edit_map_svg .poi_elem', 'active');
		wycaApi.on('onGoToPoiResult', function (data){
			$('#user_edit_map_bStop').hide();
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#user_edit_map .modalFinTest section.panel-success').show();
				$('#user_edit_map .modalFinTest section.panel-danger').hide();
				$('#user_edit_map .modalFinTest section.panel-warning').hide();
			}
			else
			{	
				if(data.A == wycaApi.AnswerCode.CANCELED){
					$('#user_edit_map .modalFinTest section.panel-success').hide();
					$('#user_edit_map .modalFinTest section.panel-danger').hide();
					$('#user_edit_map .modalFinTest section.panel-warning').show();
					
					$('#user_edit_map .modalFinTest section.panel-warning .error_details').html(wycaApi.AnswerCodeToString(data.A));
				}else{
					
					$('#user_edit_map .modalFinTest section.panel-success').hide();
					$('#user_edit_map .modalFinTest section.panel-danger').show();
					$('#user_edit_map .modalFinTest section.panel-warning').hide();
					
					if (data.M != '')
						if(data.M.length > 50)
							$('#user_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br><span>' +data.M+ '</span>');
						else
							$('#user_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						$('#user_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
				}
			}
			
			// On rebranche l'ancienne fonction
			wycaApi.on('onGoToPoiResult', onGoToPoiResult);
		
			$('#user_edit_map .modalFinTest').modal('show');
		});
		
		wycaApi.GoToPoi(currentPoiUserLongTouch.data('id_poi'), function (data){
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#user_edit_map_bStop').show();
			}
			else
			{
				$('#user_edit_map .modalFinTest section.panel-success').hide();
				$('#user_edit_map .modalFinTest section.panel-warning').hide();
				$('#user_edit_map .modalFinTest section.panel-danger').show();
				
				if (data.M != '')
					$('#user_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
				else
					$('#user_edit_map .modalFinTest section.panel-danger .error_details').html(wycaApi.AnswerCodeToString(data.A));
			
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToPoiResult', onGoToPoiResult);
				
				$('#user_edit_map .modalFinTest').modal('show');
			}
		});
    });
	
	/**************************/
	/*        ZOOM            */
	/**************************/
	
	$('#user_edit_map_zone_zoom_click').mousedown(function(e) {
       e.preventDefault();
	   downOnZoomClick = true;
    });
	
	$('#user_edit_map_zone_zoom_click').mousemove(function(e) {
       e.preventDefault();
	   if (downOnZoomClick)
	   {
			w = $('#user_edit_map_zoom_carte').width();
			h = $('#user_edit_map_zoom_carte').height();
			
			wZoom = $('#user_edit_map_zone_zoom').width();
			hZoom = $('#user_edit_map_zone_zoom').height();
			
			x = e.offsetX - wZoom / 2;
			y = e.offsetY - hZoom / 2;
					
			//zoom = ros_largeur / $('#user_edit_map_svg').width() / window.panZoomUser.getZoom();
			zoom = UserGetZoom();
			
			largeur_img = ros_largeur / zoom
			
			x = - x / w * largeur_img;
			y = - y / w * largeur_img;
			
			window.panZoomUser.pan({'x':x, 'y':y});
	   }
    });
	
	$('#user_edit_map_zone_zoom_click').click(function(e) {
		e.preventDefault();
		
		w = $('#user_edit_map_zoom_carte').width();
		h = $('#user_edit_map_zoom_carte').height();
		
		wZoom = $('#user_edit_map_zone_zoom').width();
		hZoom = $('#user_edit_map_zone_zoom').height();
		
		x = e.offsetX - wZoom / 2;
		y = e.offsetY - hZoom / 2;
				
		//zoom = ros_largeur / $('#user_edit_map_svg').width() / window.panZoomUser.getZoom();
		zoom = UserGetZoom();
		
		largeur_img = ros_largeur / zoom
		
		x = - x / w * largeur_img;
		y = - y / w * largeur_img;
		
		window.panZoomUser.pan({'x':x, 'y':y});
	});
	
	$('#user_edit_map_zone_zoom_click').on('touchstart', function(e) {
       e.preventDefault();
	   downOnZoomClick = true;
	   
	    w = $('#user_edit_map_zoom_carte').width();
		h = $('#user_edit_map_zoom_carte').height();
		
		wZoom = $('#user_edit_map_zone_zoom').width();
		hZoom = $('#user_edit_map_zone_zoom').height();
		
		r = document.getElementById("user_edit_map_zoom_carte_container").getBoundingClientRect();
		
		x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - r.left;
		y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - r.top;
		
		x = x - wZoom / 2;
		y = y - hZoom / 2;
				
		//zoom = ros_largeur / $('#user_edit_map_svg').width() / window.panZoomUser.getZoom();
		zoom = UserGetZoom();
		
		largeur_img = ros_largeur / zoom
		
		x = - x / w * largeur_img;
		y = - y / w * largeur_img;
		
		window.panZoomUser.pan({'x':x, 'y':y});
	   
    });
	
	$('#user_edit_map_zone_zoom_click').on('touchend', function(e) {
       e.preventDefault();
	   downOnZoomClick = false;
    });
	
	$('#user_edit_map_zone_zoom_click').on('touchmove', function(e) {
       e.preventDefault();
	   if (downOnZoomClick)
	   {
		    w = $('#user_edit_map_zoom_carte').width();
			h = $('#user_edit_map_zoom_carte').height();
			
			wZoom = $('#user_edit_map_zone_zoom').width();
			hZoom = $('#user_edit_map_zone_zoom').height();
			
			r = document.getElementById("user_edit_map_zoom_carte_container").getBoundingClientRect();
		
			x = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX) - r.left;
			y = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY) - r.top;
			
			x = x - wZoom / 2;
			y = y - hZoom / 2;
					
			//zoom = ros_largeur / $('#user_edit_map_svg').width() / window.panZoomUser.getZoom();
			zoom = UserGetZoom();
			
			largeur_img = ros_largeur / zoom
			
			x = - x / w * largeur_img;
			y = - y / w * largeur_img;
			
			window.panZoomUser.pan({'x':x, 'y':y});
	   }
    });
	
	/**************************/
	/*  Click on element      */
	/**************************/
	
	$(document).on('click', '#user_edit_map_svg .dock_elem', function(e) {
		e.preventDefault();
		
		if(boolModalGoToDock)
			$('#user_edit_map_modalGoToDock').modal('show');
		else
			$('#user_edit_map .bTestDock').click();
		
		$('#user_edit_map_modalDoSaveBeforeTestDock').modal('show');
	});
	
	$(document).on('click', '#user_edit_map_svg .poi_elem', function(e) {
		e.preventDefault();
		if(boolModalGoToPoi)
			$('#user_edit_map_modalGoToPoi').modal('show');
		else
			$('#user_edit_map .bTestPoi').click();
		
		$('#user_edit_map_modalDoSaveBeforeTestPoi').modal('show');
	});
	
	$(document).on('click', '#user_edit_map_svg .augmented_pose_elem', function(e) {
		e.preventDefault();
		if(boolModalGoToAugmentedPose)
			$('#user_edit_map_modalGoToAugmentedPose').modal('show');
		else
			$('#user_edit_map .bTestAugmentedPose').click();
		
		$('#user_edit_map_modalDoSaveBeforeTestAugmentedPose').modal('show');
	});
	
	/**************************/
	/*  Click on element      */
	/**************************/
	
	
	$('#user_edit_map .times_icon_menu').click(function(e) {
		$('#user_edit_map_menu .bMoveTo').click();
    });
	
	$('#user_edit_map_menu .bMoveTo').click(function(e) {
		e.preventDefault();
		UserHideMenus();
		if (userCanChangeMenu)
		{
			//CURRENT ACTION TARGET
			userCurrentAction = 'prepareGotoPose';
			userCanChangeMenu = false;
			//AJOUT ICON MENU + CROIX
			
			setTimeout(function(){$('#user_edit_map .times_icon_menu').show('fast')},50);
			
			boolHelpGotoPose = getCookie('boolHelpGotoPoseU') != '' ? JSON.parse(getCookie('boolHelpGotoPoseU')) : true; // TRICK JSON.parse STR TO BOOL
			
			if(boolHelpGotoPose){
				$('#user_edit_map .modalHelpClickGotoPose').modal('show');
			}			
		}
		else if(userCurrentAction == 'prepareGotoPose'){
			$('#user_edit_map .times_icon_menu').hide();
			userCurrentAction = '';
			userCanChangeMenu = true;
		}else
			UserAvertCantChange();
		
    });
	
	$('#user_edit_map .bHelpClickGotoPoseOk').click(function(){boolHelpGotoPose = !$('#user_edit_map .checkboxHelpGotopose').prop('checked');setCookie('boolHelpGotoPoseU',boolHelpGotoPose);});//ADD SAVING BDD / COOKIES ?
	
	InitTaille();
    
    var offsetMap;
    
    AppliquerZoom();
	
	UserSetModeSelect();
	
	$('#user_edit_map_svg').click(function(e){
		if(userCanChangeMenu == false){
			if(userCurrentAction == 'prepareGotoPose'){
				$('#user_edit_map_menu .times_icon_menu').hide();
				//UserHideMenus();
				
				zoom = UserGetZoom();
				p = $('#user_edit_map_svg image').position();
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
				yGotoPose = ros_hauteur-y ;

				xRos = x * ros_resolution / 100;
				yRos = y * ros_resolution / 100;
				
				wycaApi.on('onGoToPoseResult', function (data){
					$('#user_edit_map_svg .go_to_pose_elem').remove();
					$('#user_edit_map_bStop').hide();
					UserDisplayApiMessageGoTo(data);
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoseResult', onGoToPoseResult);
					userCanChangeMenu = true;
				});
				
				console.log('GoToPose', xRos, yRos);
				
				wycaApi.GoToPose(xRos, yRos, 0, 0, function (data){
					
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						$('#user_edit_map_bStop').show();
						UserTraceGoToPose(xGotoPose,yGotoPose);
					}
					else
					{
						UserDisplayApiMessageGoTo(data);
						// On rebranche l'ancienne fonction
						wycaApi.on('onGoToPoseResult', onGoToPoseResult);
						userCanChangeMenu = true;
					}
				});
			}
		}
	})
	
});

var touchStarted = false;

function UserPoiSave()
{
	if (userCurrentAction == 'addPoi')
	{
		$('#user_edit_map_poi_name').val('');
		$('#user_edit_map_modalPoiEditName').modal('show');
	}
	else if (userCurrentAction == 'editPoi')
	{	
		UserSaveElementNeeded(false);
		
		poi = pois[currentPoiIndex];
		RemoveClass('#user_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		
		UserAddHistorique({'action':'edit_poi', 'data':{'index':currentPoiIndex, 'old':saveCurrentPoi, 'new':JSON.stringify(pois[currentPoiIndex])}});
		
		RemoveClass('#user_edit_map_svg .active', 'active');
		
		userCurrentAction = '';
		currentStep = '';
		
		$('#user_edit_map_boutonsRotate').hide();
		
		$('#user_edit_map_boutonsPoi').hide();
		$('#user_edit_map_boutonsStandard').show();
		$('#user_edit_map_message_aide').hide();
		blockZoom = false;
		
		$('body').addClass('no_current');
		
		UserSetModeSelect();
	}
}

function UserPoiCancel()
{
	UserSaveElementNeeded(false);
	
	$('#user_edit_map_svg .poi_elem_current').remove();
	RemoveClass('#user_edit_map_svg .active', 'active');

	$('body').addClass('no_current');
	
	if (userCurrentAction == 'addPoi')
	{
		$('#user_edit_map_svg .poi_elem_0').remove();
	}
	else if (userCurrentAction == 'editPoi')
	{
		poi = pois[currentPoiIndex];
		RemoveClass('#user_edit_map_svg .poi_elem_'+poi.id_poi, 'movable');
		
		pois[currentPoiIndex] = JSON.parse(saveCurrentPoi);
		UserTracePoi(currentPoiIndex);
	}
	userCurrentAction = '';
	currentStep = '';
	
	$('#user_edit_map_boutonsRotate').hide();
	
	$('#user_edit_map_boutonsPoi').hide();
	$('#user_edit_map_boutonsStandard').show();
	$('#user_edit_map_message_aide').hide();
	blockZoom = false;
	
	UserSetModeSelect();
}

function UserRefreshZoomView()
{
	pSVG = $('#user_edit_map_svg').position();
	pImg = $('#user_edit_map_svg image').position();
	pImg.left -= pSVG.left;
	pImg.top -= pSVG.top;
	
	//zoom = ros_largeur / $('#user_edit_map_svg').width() / window.panZoomUser.getZoom();
	zoom = UserGetZoom();
	
	wZoom = $('#user_edit_map_zoom_carte').width();
	hZoom = $('#user_edit_map_zoom_carte').height();
	
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
	
	hNew = $('#user_edit_map_svg').height() * zoom  / ros_largeur * wZoom;
	wNew = $('#user_edit_map_svg').width() * zoom  / ros_largeur * wZoom;
	
	//if (tNew + hNew > hZoom) hNew = hZoom - tNew;
	//if (lNew + wNew > wZoom) wNew = wZoom - lNew;
		
	$('#user_edit_map_zone_zoom').width(wNew);
	$('#user_edit_map_zone_zoom').height(hNew);
				
	$('#user_edit_map_zone_zoom').css('top', tNew - 1);
	$('#user_edit_map_zone_zoom').css('left', lNew - 1);
	
}

function UserDeletePoi(indexInArray)
{
	if ($('.cancel:visible').length > 0) $('.cancel:visible').click();
	
	pois[indexInArray].deleted = true;
	
	UserAddHistorique({'action':'delete_poi', 'data':indexInArray});
	
	data = pois[indexInArray];
	$('#user_edit_map_svg .poi_elem_'+data.id_poi).remove();
	
	RemoveClass('#user_edit_map_svg .active', 'active');
	
	userCurrentAction = '';
	currentStep = '';
	
	$('.btn-mode-gene').removeClass('btn-primary');
	$('.btn-mode-gene').addClass('btn-default');
	
	$('#user_edit_map_boutonsPoi').hide();
    $('#user_edit_map_boutonsStandard').show();
	blockZoom = false;
	
	UserSetModeSelect();
}

function UserDisplayApiMessageGoTo(data)
{

	if (data.A == wycaApi.AnswerCode.NO_ERROR)
	{
		//SI SUCCESS
		wycaApi.PlaySound(wycaApi.SOUND.SUCCESS, 1);
		$('#user_edit_map .modalFinTest section.panel-success').show();
		$('#user_edit_map .modalFinTest section.panel-danger').hide();
		$('#user_edit_map .modalFinTest section.panel-warning').hide();
		
		$('#user_edit_map .modalFinTest').modal('show');
	}
	else
	{	
		let html,target;
		if(data.A == wycaApi.AnswerCode.CANCELED){
			//SI CANCEL
			$('#user_edit_map .modalFinTest section.panel-success').hide();
			$('#user_edit_map .modalFinTest section.panel-danger').hide();
			$('#user_edit_map .modalFinTest section.panel-warning').show();
			
			html = typeof(textActionCanceled) != 'undefined' ? textActionCanceled : wycaApi.AnswerCodeToString(data.A);
			target = $('#user_edit_map .modalFinTest section.panel-warning span.error_details');
		}else{
			//SI ERROR
			wycaApi.PlaySound(wycaApi.SOUND.ALERT, 1);
			$('#user_edit_map .modalFinTest section.panel-success').hide();
			$('#user_edit_map .modalFinTest section.panel-danger').show();
			$('#user_edit_map .modalFinTest section.panel-warning').hide();
			
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
			target = $('#user_edit_map .modalFinTest section.panel-danger span.error_details');
		}
		
		target.html(html);
		$('#user_edit_map .modalFinTest').modal('show');
	}
	
}

