$(document).ready(function(e) {
	// DISPLAY WARNING MODAL
	$('.modal.modalWarningConnexion').modal('show','slow');
	
	$('.joystickDiv').parent().parent().append('<h3 class="warningObstacleTeleopManager"><i class="fas fa-exclamation-triangle text-danger"></i> '+typeof(textStayAwayFromObstacles) != 'undefined'? textStayAwayFromObstacles : 'Stay away from obstacles')+' <i class="fas fa-exclamation-triangle text-danger"></i></h3>');
	
	$('#modalWarningConnexion_bOk').click(function(e){
		if($('.checkboxWarningConnexion').prop('checked')){
			$('.modal.modalWarningConnexion').modal('hide');
		}else{
			$('.checkboxWarningConnexion').parent().parent().addClass('shake');
			setTimeout(function(){$('.checkboxWarningConnexion').parent().parent().removeClass('shake')},2000);
		}
	})
		
	
	$('#manager_recovery .bRecovery').click(function(e) {
        e.preventDefault();
		//----------------------- RECOVERY ----------------------------
	
		$('#manager_recovery .bRecovery').addClass('disabled');
		
		/*INIT FEEDBACK DISPLAY*/
		$('#manager_recovery .recovery_feedback .recovery_step').css('opacity','0').hide();
		$('#manager_recovery .recovery_feedback .recovery_step .fa-check').hide();
		$('#manager_recovery .recovery_feedback .recovery_step .fa-pulse').show();
		
		wycaApi.on('onRecoveryFromFiducialFeedback', function(data) {
			if(data.A == wycaApi.AnswerCode.NO_ERROR){
				target = '';
				switch(data.M){
					case 'Scan reflector': 				target = '#manager_recovery .recovery_feedback .recovery_step.RecoveryScan';	break;
					case 'Init pose': 					target = '#manager_recovery .recovery_feedback .recovery_step.RecoveryPose';	break;
					case 'Rotate to check obstacles': 	target = '#manager_recovery .recovery_feedback .recovery_step.RecoveryRotate';	break;
					case 'Start navigation': 			target = '#manager_recovery .recovery_feedback .recovery_step.RecoveryNav';		break;
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
				
				$('#manager_recovery .recovery_step:visible').find('.fa-check').show();
				$('#manager_recovery .recovery_step:visible').find('.fa-pulse').hide();
				setTimeout(function(){
					$('.ifRecovery').hide();
					$('.ifNRecovery').show();
					$('#manager_recovery .bRecovery').removeClass('disabled');
					success_wyca(textRecoveryDone);
					$('#manager_recovery .bRecovery').removeClass('disabled');
					$('#manager_recovery .manager_recovery_next').click();
				},500)
			}
			else
			{
				$('.ifRecovery').hide();
				$('.ifNRecovery').show();
				$('#manager_recovery .bRecovery').removeClass('disabled');
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
				$('#manager_recovery .bRecovery').removeClass('disabled');
				ParseAPIAnswerError(data);
			}
		});
	});
	
	$('#manager_recovery .bCancelRecovery').click(function(e) {
		$('#manager_recovery .bCancelRecovery').addClass('disabled');
		wycaApi.RecoveryFromFiducialCancel(function(data) {
			$('#manager_recovery .bCancelRecovery').removeClass('disabled');
		})
	})
		
	$('#manager_edit_map .bSaveMapTestPoi').click(function(e) {
		e.preventDefault();
		
		
		$('#manager_edit_map .bSaveMapTestPoi i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
		$('#manager_edit_map .bSaveMapTestPoi i').addClass('fa-spinner fa-pulse');
		
		id_poi_test = currentPoiManagerLongTouch.data('id_poi');
		i = GetPoiIndexFromID(currentPoiManagerLongTouch.data('id_poi'));
		
		id_fiducial_test = pois[i].id_fiducial;
		final_pose_x_test = pois[i].final_pose_x;
		final_pose_y_test = pois[i].final_pose_y;
		final_pose_t_test = pois[i].final_pose_t;
	
		data = GetDataMapToSave();
		gotoTest = false;
		
		wycaApi.SetCurrentMapData(data, function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{	
				wycaApi.GetCurrentMapComplete(function(data) {
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
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
					  
						$('#manager_mapping_use .bUseThisMapNowYes').show();
						$('#manager_mapping_use .bUseThisMapNowNo').show();
						$('#manager_mapping_use .modalUseThisMapNowTitle1').show();
						$('#manager_mapping_use .modalUseThisMapNowTitle2').hide();
						$('#manager_mapping_use .modalUseThisMapNowContent').hide();
						
						managerHistoriques = Array();
						managerHistoriqueIndex = -1;
						ManagerRefreshHistorique();
					
						ManagerInitMap();
						ManagerResizeSVG();
						
						// On recherche le nouveau poi créé avec le bon id
						if (id_poi_test >= 300000)
						{
							$.each(pois, function( index, poi ) {
								
								if (poi.id_fiducial == id_fiducial_test && poi.final_pose_x == final_pose_x_test && poi.final_pose_y == final_pose_y_test && poi.final_pose_t == final_pose_t_test)
								{
									currentPoiManagerLongTouch = $('#manager_edit_map_poi_robot_'+poi.id_poi);
								}
							});
						}
						
						$('#manager_edit_map .bSaveMapTestPoi i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
						$('#manager_edit_map .bSaveMapTestPoi i').addClass('fa-check');
					}
					else
					{
						ParseAPIAnswerError(data,textErrorGetMap);
					}
				});
				
				
			}
			else
			{
				$('#manager_edit_map .bSaveMapTestPoi i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#manager_edit_map .bSaveMapTestPoi i').addClass('fa-remove');
				ParseAPIAnswerError(data,textErrorSetMap);
			}
		});
    });
	
	$('#manager_edit_map .bSaveMapTestDock').click(function(e) {
		e.preventDefault();
		
		
		$('#manager_edit_map .bSaveMapTestDock i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
		$('#manager_edit_map .bSaveMapTestDock i').addClass('fa-spinner fa-pulse');
		
		id_dock_test = currentDockManagerLongTouch.data('id_docking_station');
		i = GetDockIndexFromID(currentDockManagerLongTouch.data('id_docking_station'));
		
		id_fiducial_test = docks[i].id_fiducial;
		
		data = GetDataMapToSave();
		gotoTest = false;
		
		wycaApi.SetCurrentMapData(data, function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{	
				wycaApi.GetCurrentMapComplete(function(data) {
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
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
					  
						$('#manager_mapping_use .bUseThisMapNowYes').show();
						$('#manager_mapping_use .bUseThisMapNowNo').show();
						$('#manager_mapping_use .modalUseThisMapNowTitle1').show();
						$('#manager_mapping_use .modalUseThisMapNowTitle2').hide();
						$('#manager_mapping_use .modalUseThisMapNowContent').hide();
						
						managerHistoriques = Array();
						managerHistoriqueIndex = -1;
						ManagerRefreshHistorique();
					
						ManagerInitMap();
						ManagerResizeSVG();
						
						// On recherche le nouveau poi créé avec le bon id
						if (id_dock_test >= 300000)
						{
							$.each(docks, function( index, dock ) {
								
								if (dock.id_fiducial == id_fiducial_test)
								{
									currentDockManagerLongTouch = $('#manager_edit_map_dock_'+poi.id_poi);
								}
							});
						}
						
						$('#manager_edit_map .bSaveMapTestDock i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
						$('#manager_edit_map .bSaveMapTestDock i').addClass('fa-check');
					}
					else
					{
						ParseAPIAnswerError(data,textErrorGetMap);
					}
				});
				
				
			}
			else
			{
				$('#manager_edit_map .bSaveMapTestDock i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#manager_edit_map .bSaveMapTestDock i').addClass('fa-remove');
				ParseAPIAnswerError(data,textErrorSetMap);
			}
		});
    });
	
	$('#manager_edit_map .bSaveEditMap').click(function(e) {
		e.preventDefault();
        
		if (!managerCanChangeMenu)
		{
			alert_wyca(textConfirmActiveElement);
		}
		else
		{
			managerCanChangeMenu = true;
			managerCurrentAction = '';
			ManagerHideMenus();
			
			data = GetDataMapToSave();
			
			if ($(this).hasClass('button_goto'))
			{
				$('#manager_test_map .list_test li').remove();
				$('#manager_test_map .manager_test_map_loading').show();
				
				gotoTest = true;
			}
			else
				gotoTest = false;
			
			console.log(data);
			
			wycaApi.SetCurrentMapData(data, function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					success_wyca(textMapSaved);
					
					// On reload la carte pour mettre à jours les ids
					GetInfosCurrentMapManager();
					/*
					if (navLaunched && id_map == current_id_map)
					{
						wycaApi.NavigationReloadMaps(function(e) { if (e.A != wycaApi.AnswerCode.NO_ERROR) console.error(wycaApi.AnswerCodeToString(data.A)+ " " + data.M); });	
					}
					*/
				}
				else
				{
					ParseAPIAnswerError(data);
				}
			});
		}
    });
	
	$('#manager_top' ).on( 'click', 'a.set_top', function(e) {
        e.preventDefault();
		
		wycaApi.on('onSetActiveTopResult', function(data) {
			
			InitTopsActiveManager();
			timerSetActiveTop = 90;
			statusSetActiveTop = 2;
			setTimeout(function(){
				$('#manager_top .modalSetActiveTop').modal('hide');
				$('#manager_top .modalSetActiveTop a').removeClass('disabled');
				
			},750);
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				setTimeout(success_wyca,750,textTopNowActive);
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
		
		wycaApi.SetActiveTop($(this).data('id_top'), function(data){
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#manager_top .modalSetActiveTop').modal('show');
				$('#manager_top .modalSetActiveTop a').addClass('disabled');
				statusSetActiveTop = 1;
				timerSetActiveTop = 0;

				//$('#pages_manager .progressSetActiveTop').show();
				TimerActiveTopNormal();
			}
			else
			{
				InitTopsActiveManager();
				ParseAPIAnswerError(data);
			}	
		});		
	});
	
	$('#manager_users .bAddUser').click(function(e) {
	
		$('#manager_users .modalUser #manager_users_i_id_user').val(-1);
		$('#manager_users .modalUser #manager_users_i_user_email').val('').removeClass('success').removeClass('error');
		$('#manager_users .modalUser #manager_users_i_user_societe').val('');
		$('#manager_users .modalUser #manager_users_i_user_prenom').val('');
		$('#manager_users .modalUser #manager_users_i_user_nom').val('');
		$('#manager_users .modalUser #manager_users_i_user_password').val('').removeClass('success').removeClass('error');
		$('#manager_users .modalUser #manager_users_i_user_cpassword').val('').removeClass('success').removeClass('error');
		
		$('#manager_users .modalUser').modal('show');
	});
	
	$('#manager_users .modalUser #manager_users_bUserSave').click(function(e) {
        e.preventDefault();
		
		let pass = $('#manager_users .modalUser #manager_users_i_user_password');
		let cpass = $('#manager_users .modalUser #manager_users_i_user_cpassword');
		
		if (pass.val() == '' || cpass.val() == ''){
			alert_wyca(textPasswordRequired);
		}else if(pass.val() != cpass.val()){
			alert_wyca(textPasswordMatching);
		}else if(!pass[0].checkValidity() || !cpass[0].checkValidity()){
			alert_wyca(textPasswordPattern);
		}/*else if (!$('#manager_users .modalUser #manager_users_i_user_email')[0].checkValidity()){
			alert_wyca(textLoginPattern);
		}*/
		else
		{
			json_user = {
				"id_user": parseInt($('#manager_users .modalUser #manager_users_i_id_user').val()),
				"company": $('#manager_users .modalUser #manager_users_i_user_societe').val(),
				"lastname": $('#manager_users .modalUser #manager_users_i_user_nom').val(),
				"firstname": $('#manager_users .modalUser #manager_users_i_user_prenom').val(),
				"email": $('#manager_users .modalUser #manager_users_i_user_email').val(),
				"pass": $('#manager_users .modalUser #manager_users_i_user_password').val(),
				"id_group_user": wycaApi.GroupUser.USER,
			};
			
			wycaApi.SetUser(json_user, function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					// On ajoute le li
					id_user = data.D;
					if ($('#manager_users_list_user_elem_'+id_user).length > 0)
					{
						$('#manager_users_list_user_elem_'+id_user+' span.email').html(json_user.email);
						$('#manager_users_list_user_elem_'+id_user+' span.societe').html(json_user.company);
						$('#manager_users_list_user_elem_'+id_user+' span.prenom').html(json_user.firstname);
						$('#manager_users_list_user_elem_'+id_user+' span.nom').html(json_user.lastname);
					}
					else
					{
						$('#manager_users .list_users').append('' +
							'<li id="manager_users_list_user_elem_'+id_user+'" data-id_user="'+id_user+'">'+
							'	<span class="email">'+json_user.email+'</span>'+
							'	<a href="#" class="bUserDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="bUserEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
							'</li>'
							);
						RefreshDisplayUserManager();
					}
					
					$('#manager_users .modalUser').modal('hide');
				}
				else
				{
					ParseAPIAnswerError(data);
				}
			});
		}
    });
	
	$(document).on('click', '#manager_users .bUserDeleteElem', function(e) {
		e.preventDefault();
		
		id_user_to_delete = parseInt($(this).closest('li').data('id_user'));
		
		wycaApi.DeleteUser(id_user_to_delete, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#manager_users_list_user_elem_'+id_user_to_delete).remove();
				RefreshDisplayUserManager();
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
	});
	
	$(document).on('click', '#manager_users .bUserEditElem', function(e) {
		e.preventDefault();
		
		id_user = $(this).closest('li').data('id_user');
		$('#manager_users .modalUser #manager_users_i_id_user').val(id_user);
		$('#manager_users .modalUser #manager_users_i_user_email').val($('#manager_users_list_user_elem_'+id_user+' span.email').html());
		$('#manager_users .modalUser #manager_users_i_user_societe').val($('#manager_users_list_user_elem_'+id_user+' span.societe').html());
		$('#manager_users .modalUser #manager_users_i_user_prenom').val($('#manager_users_list_user_elem_'+id_user+' span.prenom').html());
		$('#manager_users .modalUser #manager_users_i_user_nom').val($('#manager_users_list_user_elem_'+id_user+' span.nom').html());
		$('#manager_users .modalUser #manager_users_i_user_password').val('');
		$('#manager_users .modalUser #manager_users_i_user_cpassword').val('');
		
		$('#manager_users .modalUser #manager_users_i_user_email').removeClass('success').removeClass('error');
		$('#manager_users .modalUser #manager_users_i_user_password').removeClass('success').removeClass('error');
		$('#manager_users .modalUser #manager_users_i_user_cpassword').removeClass('success').removeClass('error');
		
		$('#manager_users .modalUser').modal('show');
	});
	
	$('#manager_users .modalUser #manager_users_i_user_email').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#manager_users .modalUser #manager_users_i_user_password').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#manager_users .modalUser #manager_users_i_user_cpassword').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
		if($('#manager_users .modalUser #manager_users_i_user_password').val() != ''){
			if($(this).val() == $('#manager_users .modalUser #manager_users_i_user_password').val())
				$(this).removeClass('error').addClass('success');
			else
				$(this).removeClass('success').addClass('error');
		}
	})
	
	$(document).on('click', '#manager_setup_sites .bSiteSetCurrentElem', function(e) {
		e.preventDefault();
		$('#manager_setup_sites .btn-danger.confirm_delete').addClass('disabled');
		$('#manager_setup_sites .bSiteSetCurrentElem').addClass('disabled');
		
		id_site_to_switch = parseInt($(this).closest('li').data('id_site'));
		str_site_to_switch =  $(this).parent().find('.societe').text();
		
		wycaApi.GetMapsList(id_site_to_switch,function(data){
			if (data.A != wycaApi.AnswerCode.NO_ERROR)
				ParseAPIAnswerError(data,textErrorGetMaps);
			else
			{
				id_map_to_switch = -1;
				if(data.D.length >= 2){
					$('#manager_setup_sites .modalSelectMap .list_maps').html('');
					$.each(data.D,function(idx,item){
						if(item.name != ''){
							let map_item="";
							map_item+='<div class="col-xs-6 text-center">';
							map_item+='	<div class="SelectMapItem btn bTuile" id="'+item.id_map+'">';
							map_item+='		<i class="fas fa-map-marked-alt"></i>';
							map_item+='		<p class="mapname">'+item.name+'</p>';
							map_item+='   </div>';
							map_item+='</div>';
							$('#manager_setup_sites .modalSelectMap .list_maps').append(map_item);
						}
					});
					$('#manager_setup_sites .modalSelectMap').modal('show');
				}else{
					if(str_site_to_switch != ''){
						if($('#modalConfirmSwitchSite').data('original_txt') == undefined)
							$('#modalConfirmSwitchSite').data('original_txt',$('#modalConfirmSwitchSite').find('h3').text());
						$('#modalConfirmSwitchSite').find('h3').html($('#modalConfirmSwitchSite').data('original_txt') + '<br><br><span><i class="fas fa-building"></i><br>' + str_site_to_switch + '</span>')
					}
					$('#modalConfirmSwitchSite').modal('show');
				}
			}
		});
	});
	
	//DECLARATION EVENTLISTENER BOUTON CREE DYNAMIQUEMENT .on('event',function(){})
	$( "#pages_manager #manager_setup_sites .modalSelectMap" ).on( 'click', '.SelectMapItem', function(e) {
		id_map_to_switch = parseInt($(this).attr('id'));
		str_map_to_switch = $(this).find('.mapname').html();
	
		if($('#modalConfirmSwitchSite').data('original_txt') == undefined)
			$('#modalConfirmSwitchSite').data('original_txt',$('#modalConfirmSwitchSite').find('h3').text());
		$('#modalConfirmSwitchSite').find('h3').html($('#modalConfirmSwitchSite').data('original_txt') + '<br><br><span><i class="fas fa-building"></i><br>' + str_site_to_switch + '<br><br><i class="fas fa-map-marked-alt"></i><br>' + str_map_to_switch+'</span>');
		
		$('#modalConfirmSwitchSite').modal('show');
		$('#manager_setup_sites .modalSelectMap').modal('hide');
	})
	
	$('#manager_setup_sites #modalConfirmSwitchSite .bModalConfirmSwitchSiteOk').click(function(e){
		if(id_site_to_switch != -1){
			wycaApi.SetSiteAsCurrent(id_site_to_switch, function(data) {
				if (data.A != wycaApi.AnswerCode.NO_ERROR) 
					ParseAPIAnswerError(data,textErrorSetSite);
				else
				{
					if(id_map_to_switch != -1){
						wycaApi.SetMapAsCurrent(id_map_to_switch, function(data){
							if (data.A == wycaApi.AnswerCode.NO_ERROR){
								if($('#manager_dashboard_modalCurrentSite').data('original_txt') == undefined)
									$('#manager_dashboard_modalCurrentSite').data('original_txt',$('#manager_dashboard_modalCurrentSite').find('h3').text());
								$('#manager_dashboard_modalCurrentSite').find('h3').html($('#manager_dashboard_modalCurrentSite').data('original_txt') + '<br><br><span>' + $('#modalConfirmSwitchSite').find('h3').find('span').html() + '</span>');
								$('#manager_setup_sites .bBackToDashboard').click();
								$('#manager_dashboard_modalCurrentSite').modal('show');
							}else{
								ParseAPIAnswerError(data,textErrorSetMap);
								GetSitesmanager();
							}
							$('#pages_manager .modalSelectMap .bCloseSelectMap').click();
							$('#manager_setup_sites .btn-danger.confirm_delete').removeClass('disabled');
							$('#manager_setup_sites .bSiteSetCurrentElem').removeClass('disabled');
							id_map_to_switch = -1;
						})
					}else{
						if($('#manager_dashboard_modalCurrentSite').data('original_txt') == undefined)
							$('#manager_dashboard_modalCurrentSite').data('original_txt',$('#manager_dashboard_modalCurrentSite').find('h3').text());
						$('#manager_dashboard_modalCurrentSite').find('h3').html($('#manager_dashboard_modalCurrentSite').data('original_txt') + '<br><br><span>' + $('#modalConfirmSwitchSite').find('h3').find('span').html() + '</span>');
						$('#manager_setup_sites .bBackToDashboard').click();
						$('#manager_dashboard_modalCurrentSite').modal('show');
						$('#manager_setup_sites .btn-danger.confirm_delete').removeClass('disabled');
						$('#manager_setup_sites .bSiteSetCurrentElem').removeClass('disabled');
					}
				}
				id_site_to_switch = -1;
			})
		}
	})
	
	$('#manager_setup_sites #modalConfirmSwitchSite .bModalConfirmSwitchSiteClose').click(function(e){
		
		$('#manager_setup_sites .btn-danger.confirm_delete').removeClass('disabled');
		$('#manager_setup_sites .bSiteSetCurrentElem').removeClass('disabled');
		
	})
	
	$(document).on('click', '#manager_setup_sites .bSiteDeleteElem', function(e) {
		e.preventDefault();
		$('#manager_setup_sites .btn-danger.confirm_delete').addClass('disabled');
		$('#manager_setup_sites .bSiteSetCurrentElem').addClass('disabled');
		
		id_site_to_delete = parseInt($(this).closest('li').data('id_site'));
		
		wycaApi.DeleteSite(id_site_to_delete, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#manager_setup_sites_list_site_elem_'+id_site_to_delete).remove();
			}
			else
			{
				ParseAPIAnswerError(data);
			}
			$('#manager_setup_sites .btn-danger.confirm_delete').removeClass('disabled');
			$('#manager_setup_sites .bSiteSetCurrentElem').removeClass('disabled');
		});
	});
	
	$(document).on('click', '#manager_setup_maps .bMapSetCurrentElem', function(e) {
		e.preventDefault();
		
		id_map = parseInt($(this).closest('li').data('id_map'));
		
		
		wycaApi.SetMapAsCurrent(id_map, function(data) {
			if (data.A != wycaApi.AnswerCode.NO_ERROR) 
				ParseAPIAnswerError(data,textErrorStopNavigation);
			else
			{
				GetMapsManager();
			}
		});
	});
	
	$(document).on('click', '#manager_setup_maps .bMapDeleteElem', function(e) {
		e.preventDefault();
		
		id_map_to_delete = parseInt($(this).closest('li').data('id_map'));
		
		wycaApi.DeleteMap(id_map_to_delete, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#manager_setup_maps_list_map_elem_'+id_map_to_delete).remove();
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
	});
	
	//---------------------- SWITCH MAP WITH LANDMARK -----------------------
	
	$(document).on('click', '#manager_switch_map_landmark .bMapSetCurrentElem',function(e) {
		e.preventDefault();
		id_map = parseInt($(this).closest('li').data('id_map'));
		
		/*INIT FEEDBACK DISPLAY*/
		$('#manager_switch_map_landmark .switch_map_feedback .switch_map_step').css('opacity','0').hide();
		$('#manager_switch_map_landmark .switch_map_feedback .switch_map_step .fa-check').hide();
		$('#manager_switch_map_landmark .switch_map_feedback .switch_map_step .fa-pulse').show();
		
		wycaApi.on('onSwitchMapWithLandmarkFeedback', function(data) {
			if(data.A == wycaApi.AnswerCode.NO_ERROR){
				target = '';
				switch(data.M){
					case 'Scan reflector': 		target = '#manager_switch_map_landmark .switch_map_feedback .switch_map_step.SwitchMapScan';			break;
					case 'Init pose': 			target = '#manager_switch_map_landmark .switch_map_feedback .switch_map_step.SwitchMapPose';			break;
					case 'Switch map': 			target = '#manager_switch_map_landmark .switch_map_feedback .switch_map_step.SwitchMapSwitchMap';		break;
					case 'Stop navigation':		target = '#manager_switch_map_landmark .switch_map_feedback .switch_map_step.SwitchMapStopNav';		break;
					case 'Start navigation': 	target = '#manager_switch_map_landmark .switch_map_feedback .switch_map_step.SwitchMapStartNav';		break;
				}
				
				target = $(target);
				if(target.prevAll('.switch_map_step:visible').length > 0){
					target.prevAll('.switch_map_step:visible').find('.fa-check').show();
					target.prevAll('.switch_map_step:visible').find('.fa-pulse').hide();
				}
				target.css('opacity','1').show();
			}
		});
		
		wycaApi.on('onSwitchMapWithLandmarkResult', function(data) {
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				
				$('#manager_switch_map_landmark .switch_map_step:visible').find('.fa-check').show();
				$('#manager_switch_map_landmark .switch_map_step:visible').find('.fa-pulse').hide();
				setTimeout(function(){
					$('#manager_switch_map_landmark #manager_switch_map_landmark_modalFeedback').modal('hide');
					success_wyca(textSwitchMapDone);
				},500)
			}
			else
			{
				$('#manager_switch_map_landmark #manager_switch_map_landmark_modalFeedback').modal('hide');
				ParseAPIAnswerError(data);
			}
			GetSwitchMapsWyca();
			// On rebranche l'ancienne fonction
			wycaApi.on('onSwitchMapWithLandmarkResult', onSwitchMapWithLandmarkResult);
			wycaApi.on('onSwitchMapWithLandmarkFeedback', onSwitchMapWithLandmarkFeedback);
		});
		
		//console.log('SwitchMapWithLandmark ',id_map,' is commented // ');
		
		wycaApi.SwitchMapWithLandmark(id_map, function(data) {
			if (data.A != wycaApi.AnswerCode.NO_ERROR) 
				ParseAPIAnswerError(data,textErrorSwitchMap);
			else
			{
				$('#manager_switch_map_landmark #manager_switch_map_landmark_modalFeedback').modal('show');
			}
		});
	});
	
	$('#manager_switch_map_landmark .bCancelSwitchMap').click(function(e) {
		$('#manager_switch_map_landmark .bCancelSwitchMap').addClass('disabled');
		wycaApi.SwitchMapWithLandmarkCancel(function(data) {
			$('#manager_switch_map_landmark .bCancelSwitchMap').removeClass('disabled');
		})
	})
	
	$('#manager_switch_map_landmark .bTeleop').click(function() {
		$('#manager_switch_map_landmark_modalTeleop').modal('show');
	});
	
});


//------------------- ACTIVE TOP ------------------------

var statusSetActiveTop = 0;
var timerSetActiveTop = 0;
	
function TimerActiveTopNormal(){
	if(statusSetActiveTop > 0){
		if(statusSetActiveTop == 2 && timerSetActiveTop==100){
			statusSetActiveTop=0;
			timerSetActiveTop=0;
			
		}else{
			delay = statusSetActiveTop == 2 ? 1 : 100;
			timerSetActiveTop++;
			if(timerSetActiveTop == 101)timerSetActiveTop=0;
			$('#manager_top .modalSetActiveTop .progressSetActiveTop .progress-bar').css('width', timerSetActiveTop+'%').attr('aria-valuenow', timerSetActiveTop); 
			setTimeout(TimerActiveTopNormal,delay);
		}
	}
}


//------------------- USERS ------------------------	

function RefreshDisplayUserManager(){
	if($('#manager_users ul.list_users li').length > 0){
		//HIDE TUILE et AFF NEXT
		$('#manager_users a.bAddUser').show();
		$('#manager_users .bAddUserTuile').hide();
	}else{
		//AFF TUILE ET SKIP
		$('#manager_users a.bAddUser').hide();
		$('#manager_users .bAddUserTuile').show();
	}
	
}