
$(document).ready(function(e) {
	$('#manager_recovery .bRecovery').click(function(e) {
        e.preventDefault();
		
		$('#manager_recovery .bRecovery').addClass('disabled');
		
		wycaApi.on('onRecoveryFromFiducialResult', function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#manager_recovery .bRecovery').removeClass('disabled');
				success_wyca('Recovery done !');
			}
			else
			{
				$('#manager_recovery .bRecovery').removeClass('disabled');
				console.log(JSON.stringify(data)); 
				text = wycaApi.AnswerCodeToString(data.A);
				if (data.M != '') text += '<br />'+data.M;
				alert_wyca(text);
			}
		});
		
		wycaApi.RecoveryFromFiducial(function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
			}
			else
			{
				$('#manager_recovery .bRecovery').removeClass('disabled');
				console.log(JSON.stringify(data)); 
				text = wycaApi.AnswerCodeToString(data.A);
				if (data.M != '') text += '<br />'+data.M;
				alert_wyca(text);
			}
		});
    });
	
	
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
						alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
					}
				});
				
				
			}
			else
			{
				$('#manager_edit_map .bSaveMapTestPoi i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#manager_edit_map .bSaveMapTestPoi i').addClass('fa-remove');
				alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
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
		gotoTest = false;f
		
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
						alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
					}
				});
				
				
			}
			else
			{
				$('#manager_edit_map .bSaveMapTestDock i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#manager_edit_map .bSaveMapTestDock i').addClass('fa-remove');
				alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
			}
		});
    });
	
	$('#manager_edit_map .bSaveEditMap').click(function(e) {
		e.preventDefault();
        
		if (!managerCanChangeMenu)
		{
			alert_wyca('You must confirm the active element');
		}
		else
		{
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
					success_wyca("Map saved !");
					
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
					alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
				}
			});
		}
    });
	
	$('#manager_top' ).on( 'click', 'a.set_top', function(e) {
        e.preventDefault();
		
		wycaApi.on('onSetActiveTopResult', function(data) {
			
			InitTopsActiveManager();
			$('#manager_top .modalSetActiveTop').modal('hide');
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				success_wyca('Top is now active !');
			}
			else
			{
				console.log(JSON.stringify(data)); 
				text = wycaApi.AnswerCodeToString(data.A);
				if (data.M != '') text += '<br />'+data.M;
				alert_wyca(text);
			}
		});
		
		wycaApi.SetActiveTop($(this).data('id_top'), function(data){
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				//success_wyca('Recovery done !');
				$('#manager_top .modalSetActiveTop').modal('show');
				$('#manager_top .modalSetActiveTop a').addClass('disabled');
				timerSetActiveTop = 10;
				timerSetActiveTopCurrent = 10;
				$('#manager_top .progressSetActiveTop').show();
				NextTimerSetActiveTop();
			}
			else
			{
				InitTopsActiveManager();
				console.log(JSON.stringify(data)); 
				text = wycaApi.AnswerCodeToString(data.A);
				if (data.M != '') text += '<br />'+data.M;
				alert_wyca(text);
			}	
		});		
	});
	
	
	$('#manager_users .bAddUser').click(function(e) {
	
		$('#manager_users .modalUser #manager_users_i_id_user').val(-1);
		$('#manager_users .modalUser #manager_users_i_user_email').val('');
		$('#manager_users .modalUser #manager_users_i_user_societe').val('');
		$('#manager_users .modalUser #manager_users_i_user_prenom').val('');
		$('#manager_users .modalUser #manager_users_i_user_nom').val('');
		$('#manager_users .modalUser #manager_users_i_user_password').val('');
		$('#manager_users .modalUser #manager_users_i_user_cpassword').val('');
		
		$('#manager_users .modalUser').modal('show');
	});
	
	$('#manager_users .modalUser #manager_users_bUserSave').click(function(e) {
        e.preventDefault();
		
		if ($('#manager_users .modalUser #manager_users_i_user_password').val() != $('#manager_users .modalUser #manager_users_i_user_cpassword').val())
		{
			alert_wyca('Invalid password or confirm');
		}
		else if ($('#manager_users .modalUser #manager_users_i_user_societe').val() == "" )
		{
			alert_wyca('Company is required');
		}
		else if ($('#manager_users .modalUser #manager_users_i_user_prenom').val() == "" )
		{
			alert_wyca('Firstname is required');
		}
		else if ($('#manager_users .modalUser #manager_users_i_user_nom').val() == "" )
		{
			alert_wyca('Lastname is required');
		}
		else
		{
			json_user = {
				"id_user": parseInt($('#manager_users .modalUser #manager_users_i_id_user').val()),
				"company": $('#manager_users .modalUser #manager_users_i_user_societe').val(),
				"lastname": $('#manager_users .modalUser #manager_users_i_user_nom').val(),
				"firstname": $('#manager_users .modalUser #manager_users_i_user_prenom').val(),
				"email": $('#manager_users .modalUser #manager_users_i_user_email').val(),
				"pass": $('#manager_users .modalUser #manager_users_i_user_password').val(),
				"id_group_user": 4,
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
							'	<span class="societe">'+json_user.company+'</span><br /><span class="prenom">'+json_user.firstname+'</span> <span class="nom">'+json_user.lastname+'</span><br /><span class="email">'+json_user.email+'</span>'+
							'	<a href="#" class="bUserDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="bUserEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
							'</li>'
							);
					}
					
					$('#manager_users .modalUser').modal('hide');
				}
				else
				{
					console.log(JSON.stringify(data)); 
					text = wycaApi.AnswerCodeToString(data.A);
					if (data.M != '') text += '<br />'+data.M;
					alert_wyca(text);
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
			}
			else
			{
				console.log(JSON.stringify(data)); 
				text = wycaApi.AnswerCodeToString(data.A);
				if (data.M != '') text += '<br />'+data.M;
				alert_wyca(text);
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
		
		$('#manager_users .modalUser').modal('show');
	});
});
