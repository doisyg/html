
var form_sended = false; //Boolean pour disable a form "en traitement"
var selectedWifi = '';
var json_user = {};
var timer_anim_check = undefined;
var battery_lvl_start = 0;
var battery_lvl_needed = 0;
var timerRealTestStart = 0;
var timerRealTestEnd = 0;
var statuslRealTestStart = 0;
var statusRealTestEnd = false;
$(document).ready(function(e) {
	
	$('#install_by_step_edit_map .bSaveMapTestPoi').click(function(e) {
		e.preventDefault();
		
		
		$('#install_by_step_edit_map .bSaveMapTestPoi i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
		$('#install_by_step_edit_map .bSaveMapTestPoi i').addClass('fa-spinner fa-pulse');
		
		id_poi_test = currentPoiByStepLongTouch.data('id_poi');
		i = GetPoiIndexFromID(currentPoiByStepLongTouch.data('id_poi'));
		
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
					  
						$('#install_by_step_mapping_use .bUseThisMapNowYes').show();
						$('#install_by_step_mapping_use .bUseThisMapNowNo').show();
						$('#install_by_step_mapping_use .modalUseThisMapNowTitle1').show();
						$('#install_by_step_mapping_use .modalUseThisMapNowTitle2').hide();
						$('#install_by_step_mapping_use .modalUseThisMapNowContent').hide();
						
						bysteplHistoriques = Array();
						bysteplHistoriqueIndex = -1;
						ByStepRefreshHistorique();
						
						ByStepInitMap();
						ByStepResizeSVG();
						
						// On recherche le nouveau poi créé avec le bon id
						if (id_poi_test >= 300000)
						{
							$.each(pois, function( index, poi ) {
								
								if (poi.id_fiducial == id_fiducial_test && poi.final_pose_x == final_pose_x_test && poi.final_pose_y == final_pose_y_test && poi.final_pose_t == final_pose_t_test)
								{
									currentPoiByStepLongTouch = $('#install_by_step_edit_map_poi_robot_'+poi.id_poi);
								}
							});
						}
						
						$('#install_by_step_edit_map .bSaveMapTestPoi i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
						$('#install_by_step_edit_map .bSaveMapTestPoi i').addClass('fa-check');
					}
					else
					{
						alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
					}
				});
				
				
			}
			else
			{
				$('#install_by_step_edit_map .bSaveMapTestPoi i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#install_by_step_edit_map .bSaveMapTestPoi i').addClass('fa-remove');
				alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
			}
		});
    });
	
	$('#install_by_step_edit_map .bSaveMapTestAugmentedPose').click(function(e) {
		e.preventDefault();
		
		
		$('#install_by_step_edit_map .bSaveMapTestAugmentedPose i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
		$('#install_by_step_edit_map .bSaveMapTestAugmentedPose i').addClass('fa-spinner fa-pulse');
		
		id_augmented_pose_test = currentAugmentedPoseByStepLongTouch.data('id_augmented_pose');
		i = GetAugmentedPoseIndexFromID(currentAugmentedPoseByStepLongTouch.data('id_augmented_pose'));
		
		id_fiducial_test = augmented_poses[i].id_fiducial;
		final_pose_x_test = augmented_poses[i].final_pose_x;
		final_pose_y_test = augmented_poses[i].final_pose_y;
		final_pose_t_test = augmented_poses[i].final_pose_t;
	
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
					  
						$('#install_by_step_mapping_use .bUseThisMapNowYes').show();
						$('#install_by_step_mapping_use .bUseThisMapNowNo').show();
						$('#install_by_step_mapping_use .modalUseThisMapNowTitle1').show();
						$('#install_by_step_mapping_use .modalUseThisMapNowTitle2').hide();
						$('#install_by_step_mapping_use .modalUseThisMapNowContent').hide();
						
						bysteplHistoriques = Array();
						bysteplHistoriqueIndex = -1;
						ByStepRefreshHistorique();
						
						ByStepInitMap();
						ByStepResizeSVG();
						
						// On recherche le nouveau augmented_pose créé avec le bon id
						if (id_augmented_pose_test >= 300000)
						{
							$.each(augmented_poses, function( index, augmented_pose ) {
								
								if (augmented_pose.id_fiducial == id_fiducial_test && augmented_pose.final_pose_x == final_pose_x_test && augmented_pose.final_pose_y == final_pose_y_test && augmented_pose.final_pose_t == final_pose_t_test)
								{
									currentAugmentedPoseByStepLongTouch = $('#install_by_step_edit_map_augmented_pose_robot_'+augmented_pose.id_augmented_pose);
								}
							});
						}
						
						$('#install_by_step_edit_map .bSaveMapTestAugmentedPose i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
						$('#install_by_step_edit_map .bSaveMapTestAugmentedPose i').addClass('fa-check');
					}
					else
					{
						alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
					}
				});
				
				
			}
			else
			{
				$('#install_by_step_edit_map .bSaveMapTestAugmentedPose i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#install_by_step_edit_map .bSaveMapTestAugmentedPose i').addClass('fa-remove');
				alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
			}
		});
    });
	
	$('#install_by_step_edit_map .bSaveMapTestDock').click(function(e) {
		e.preventDefault();
		
		
		$('#install_by_step_edit_map .bSaveMapTestDock i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
		$('#install_by_step_edit_map .bSaveMapTestDock i').addClass('fa-spinner fa-pulse');
		
		id_dock_test = currentDockByStepLongTouch.data('id_docking_station');
		i = GetDockIndexFromID(currentDockByStepLongTouch.data('id_docking_station'));
		
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
					  
						$('#install_by_step_mapping_use .bUseThisMapNowYes').show();
						$('#install_by_step_mapping_use .bUseThisMapNowNo').show();
						$('#install_by_step_mapping_use .modalUseThisMapNowTitle1').show();
						$('#install_by_step_mapping_use .modalUseThisMapNowTitle2').hide();
						$('#install_by_step_mapping_use .modalUseThisMapNowContent').hide();
						
						bysteplHistoriques = Array();
						bysteplHistoriqueIndex = -1;
						ByStepRefreshHistorique();
						
						ByStepInitMap();
						ByStepResizeSVG();
						
						// On recherche le nouveau dock créé avec le bon id
						if (id_dock_test >= 300000)
						{
							$.each(docks, function( index, dock ) {
								
								if (dock.id_fiducial == id_fiducial_test)
								{
									currentDockByStepLongTouch = $('#install_by_step_edit_map_dock_'+dock.id_docking_station);
								}
							});
						}
						
						$('#install_by_step_edit_map .bSaveMapTestDock i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
						$('#install_by_step_edit_map .bSaveMapTestDock i').addClass('fa-check');
					}
					else
					{
						alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
					}
				});
				
				
			}
			else
			{
				$('#install_by_step_edit_map .bSaveMapTestDock i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
				$('#install_by_step_edit_map .bSaveMapTestDock i').addClass('fa-remove');
				alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' + data.M);
			}
		});
    });
	
	
	
	$('#pages_install_by_step a.select_langue').click(function(e) {
        e.preventDefault();
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_set_langue.php',
			data: {
				'id_lang': $(this).data('id_lang')
			},
			dataType: 'json',
			success: function(data) {
				if (data.need_restart == 1)
					window.location.href = window.location.href;
			},
			error: function(e) {
				alert_wyca('Error set lang ; ' + e.responseText);
			}
		});
    });
	
	
	$('#pages_install_by_step a.skip_wifi').click(function(e) {
        e.preventDefault();
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_skip_wifi.php',
			data: { },
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				alert_wyca('Error skip wifi ; ' + e.responseText);
			}
		});
    });
	
	$('#pages_install_by_step a.save_date').click(function(e) {
        e.preventDefault();
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_save_date.php',
			data: { },
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				alert_wyca('Error save date ; ' + e.responseText);
			}
		});
    });

	$('#pages_install_by_step .file_import_top').change(function(){
		//console.log('here');
		$('#pages_install_by_step .filename_import_top').html($(this)[0].files[0].name);
		$('#pages_install_by_step .filename_import_top').show();
		$('#pages_install_by_step .file_import_top_wrapper').css('background-color','#47a4476e');
		
	})
	
	$('#pages_install_by_step a.bImportTopDo').click(function(e) {
        e.preventDefault();
		
		file = $('#pages_install_by_step .file_import_top')[0].files[0];
		if(file != undefined){
			$('#pages_install_by_step .modalImportTop_loading').show();
			$('#pages_install_by_step .modalImportTop_content').hide();
			var reader = new FileReader();
			reader.onload = function(event) { 
				wycaApi.InstallNewTopWithoutKey(btoa(reader.result), function(data) { 
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						
						$('#pages_install_by_step .modalImportTop_loading').hide();
						$('#pages_install_by_step .modalImportTop_content').show();
						
						$('#pages_install_by_step .modalImportTop').modal('hide');
						InitTopsByStep();
					}
					else
					{
						console.log(JSON.stringify(data)); 
						alert_wyca(wycaApi.AnswerCodeToString(data.A));
					}
					
					
				});
			};
			reader.readAsText(file);
		}else{
			let icon = $('#pages_install_by_step .file_import_top_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
    });
	
	$('#pages_install_by_step a.import_top').click(function(e) {
        e.preventDefault();
		
		$('#pages_install_by_step .modalImportTop_loading').hide();
		$('#pages_install_by_step .modalImportTop_content').show();
		
		$('#pages_install_by_step .modalImportTop').modal('show');
		InitTopImport();
	});
	$('#pages_install_by_step a.save_tops').click(function(e) {
        e.preventDefault();
		
		var listAvailableTops = Array();
		$('#pages_install_by_step .install_by_step_top li').hide();
		$(this).parent().parent().find('.is_checkbox.checked').each(function(index, element) {
            listAvailableTops.push($(this).data('id_top'));
			$('#pages_install_by_step .install_by_step_top .bTop'+$(this).data('id_top')).show();
        });
		
		if (listAvailableTops.length == 0)
		{
			alert_wyca(textSelectOnOrMoreTops);
		}
		else
		{
			wycaApi.SetAvailableTops(listAvailableTops, function(data){
				
				$.ajax({
					type: "POST",
					url: 'ajax/install_by_step_save_tops.php',
					data: { 
						nb_tops: listAvailableTops.length
					},
					dataType: 'json',
					success: function(data) {
					},
					error: function(e) {
						alert_wyca('Error save tops ; ' + e.responseText);
					}
				});
				
				if (listAvailableTops.length == 1)
				{
					wycaApi.SetActiveTop(listAvailableTops[0], function(data){
						$('#pages_install_by_step a.save_tops_next_check').click();
					});
				}
				else
					$('#pages_install_by_step a.save_tops_next_select').click();
			});
		}
    });
	
	$( '#pages_install_by_step' ).on( 'click', 'a.set_top', function(e) {
        e.preventDefault();		
		wycaApi.SetActiveTop($(this).data('id_top'), function(data){});		
		
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_set_top.php',
			data: { 
			},
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				alert_wyca('Error set top ; ' + e.responseText);
			}
		});
		
		
    });
	
	$('#pages_install_by_step a.install_by_step_check_next').click(function(e) {
        e.preventDefault();
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_check.php',
			data: { 
			},
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				alert_wyca('Error step check ; ' + e.responseText);
			}
		});
    });
	
	$('#pages_install_by_step form.form_site').submit(function(e) {
        e.preventDefault();
		window.site_name = $('#pages_install_by_step .i_site_name').val();
		if (window.site_name == '')
		{
			alert_wyca(textIndicateAName);
		}
		else
		{
			if(!form_sended){
				let site_names = Array();
				form_sended = true ;
				$('.install_by_step_site_save').addClass('disabled');
				// AFFICHER LOADING GIF
				wycaApi.GetSitesList(function(data){
					// HIDE LOADING GIF
					if (data.A != wycaApi.AnswerCode.NO_ERROR){
						alert_wyca('Error in scanning site\'s names ' + wycaApi.AnswerCodeToString(data.A)+ " " + data.M)
					}else{
						data.D.forEach(function(item){
							site_names.push(item.name);
						});
						
						if(!site_names.includes(window.site_name)){
							if (create_new_site) // BOOLEAN INSTALLATEUR_WYCA.JS GESTION DES SITES
							{
									newSite = { "id_site":-1, "comment":"", name:window.site_name };
									wycaApi.SetSite(newSite, function(data){
										if (data.A != wycaApi.AnswerCode.NO_ERROR) 
											alert_wyca('Error navigation stop ; ' + wycaApi.AnswerCodeToString(data.A)+ " " + data.M);
										else
										{
											wycaApi.SetSiteAsCurrent(data.D, function(data) {
												if (data.A != wycaApi.AnswerCode.NO_ERROR) 
													alert_wyca('Error navigation stop ; ' + wycaApi.AnswerCodeToString(data.A)+ " " + data.M);
												else
												{
													//REFRESH FORM SUBMIT
													setTimeout(function(){form_sended = false},1000);
													$('.install_by_step_site_save').removeClass('disabled');
													
													$.ajax({
														type: "POST",
														url: 'ajax/install_by_step_site.php',
														data: {
														},
														dataType: 'json',
														success: function(data) {
														},
														error: function(e) {
															alert_wyca('Error step site ; ' + e.responseText);
														}
													});
													$('#pages_install_by_step a.install_by_step_site_next').click();
												}
											});
										}
									});
								
							}
							else
							{
								wycaApi.GetCurrentSite(function(data) {
									data.D.name = $('#pages_install_by_step .i_site_name').val();
									wycaApi.SetSite(data.D, function(data){
										//REFRESH FORM SUBMIT
										setTimeout(function(){form_sended = false},1000);
										$('.install_by_step_site_save').removeClass('disabled');
										$.ajax({
											type: "POST",
											url: 'ajax/install_by_step_site.php',
											data: {
											},
											dataType: 'json',
											success: function(data) {
											},
											error: function(e) {
												alert_wyca('Error step site ; ' + e.responseText);
											}
										});
										$('#pages_install_by_step a.install_by_step_site_next').click();
									});
								});
							}
						}else{
							alert_wyca(textNameUsed);
							//REFRESH FORM SUBMIT
							setTimeout(function(){form_sended = false},1000);
							$('.install_by_step_site_save').removeClass('disabled');
						}	
					}
				})
			}else{
				return false;
			}
		};
	});
	
	
	$(".map_dyn").on("load", function() {  InitPosCarteMapping(); });
	
	$('#install_by_step_mapping .bMappingStart').click(function(e) {
		e.preventDefault();
		
		$('#install_by_step_mapping .bMappingBack').hide();
		$('#install_by_step_mapping .bMappingStart').hide();
		$('.ifMappingInit').show();
		$('.ifNMappingInit').hide();
		if (navLaunched)
		{
			wycaApi.NavigationStop(function(data) { if (data.A != wycaApi.AnswerCode.NO_ERROR) alert_wyca('Error navigation stop ; ' + wycaApi.AnswerCodeToString(data.A)+ " " + data.M);});
			
			$('#install_by_step_mapping .progressStartMapping h3').html(textStopNavigation);
			timerCreateMap = 10;
			timerCreateMapCurrent = 10;
			$('#install_by_step_mapping .progressStartMapping').show();
			NextTimerCreateMap();
		}
		else
		{
			if (!mappingLaunched)
			{
				wycaApi.MappingStart(function(data) {
					if (data.A != wycaApi.AnswerCode.NO_ERROR) { alert_wyca('Error mapping start ; ' + wycaApi.AnswerCodeToString(data.A)+ " " + data.M);} 
					mappingStarted = true;
				});
				
				$('#install_by_step_mapping .progressStartMapping h3').html(textStartMapping);
				timerCreateMap = 5;
				timerCreateMapCurrent = 5;
				$('#install_by_step_mapping .progressStartMapping').show();
				NextTimerCreateMap();
			}
			else
			{
				$('#install_by_step_mapping .progressStartMapping').hide();
				$('#install_by_step_mapping .switchLiveMapping').show();
				$('#install_by_step_mapping .bMappingStop').show();
				$('.ifMapping').show();
				$('#install_by_step_mapping .mapping_view').show();
					
				img = document.getElementById("install_by_step_mapping_img_map_saved");
				img.src = "assets/images/vide.png";
				
				if (intervalMap != null)
				{
					clearInterval(intervalMap);
					intervalMap = null;
				}
				
				GetMappingInConstruction();
			}
		}
	});
	
	$('#install_by_step_mapping .switchLiveMapping input').change(function(e) {
		
		if ($(this).is(':checked') )
		{
			liveMapping = true;
			if (timerGetMappingInConstruction == null)
			{
				GetMappingInConstruction();
			}
		}
		else
		{
			liveMapping = false;
			if (timerGetMappingInConstruction != null)
			{
				clearTimeout(timerGetMappingInConstruction);
				timerGetMappingInConstruction = null;
			}
		}
		
	});
	
	$('#install_by_step_mapping .bMappingStop').click(function(e) {
		e.preventDefault();
		
		$('#install_by_step_mapping_fin .loading_fin_create_map').show();
		
		img = document.getElementById("install_by_step_mapping_img_map_saved_fin");
        img.src = 'assets/images/vide.png';
		
		wycaApi.MappingStop(function(data) {
			if (data.A != wycaApi.AnswerCode.NO_ERROR) alert_wyca('Error navigation stop ; ' + wycaApi.AnswerCodeToString(data.A)+ " " + data.M);
			$.ajax({
				type: "POST",
				url: 'ajax/install_by_step_fin_mapping.php',
				data: {},
				dataType: 'json',
				success: function(data) {
				},
				error: function(e) {
				}
			});
			
			var img = document.getElementById("install_by_step_mapping_img_map_saved_fin");
            img.src = 'data:image/png;base64,' + data.D;
			
			finalMapData = 'data:image/png;base64,' + data.D;
			
			setTimeout(function() {
				canvas = document.createElement('canvas');
				
				width = img.naturalWidth;
				height = img.naturalHeight;
				
				$('#install_by_step_mapping_canvas_result_trinary').attr('width', img.naturalWidth);
				$('#install_by_step_mapping_canvas_result_trinary').attr('height', img.naturalHeight);
				
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;
				canvas.getContext('2d').drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
				
				CalculateMapTrinary();
			}, 100);
		});
		mappingStarted = false;
		$('#install_by_step_mapping .switchLiveMapping').hide();
		$('#install_by_step_mapping .bMappingStop').hide();
		$('#install_by_step_mapping .mapping_view').hide();
		$('#install_by_step_mapping .bMappingStart').show();
		
		$('#install_by_step_mapping_fin .bMappingCancelMap2').show();
		$('#install_by_step_mapping_fin .bMappingSaveMap').show();
		
		if (intervalMap != null)
		{
			clearInterval(intervalMap);
			intervalMap = null;
		}
		
		if (timerGetMappingInConstruction != null)
		{
			clearInterval(timerGetMappingInConstruction);
			timerGetMappingInConstruction = null;
		}
		
	});
	
	$('#install_by_step_mapping_fin .bMappingSaveMap').click(function(e) {
		window.map_name = $('#install_by_step_mapping_from_name').val();
		if (window.map_name == '')
		{
			alert_wyca(textIndicateAName);
			e.preventDefault();
		}
		else
		{
			if(!form_sended){
				let map_names = Array();
				form_sended = true ;
				
				$('.bMappingSaveMap').addClass('disabled');
				
				wycaApi.GetCurrentSite(function(data){
					if (data.A != wycaApi.AnswerCode.NO_ERROR){
						alert_wyca('Error in scanning map names ' + wycaApi.AnswerCodeToString(data.A)+ " " + data.M)
					}else{
						
						wycaApi.GetMapsList(data.D.id_site,function(data){
							if (data.A != wycaApi.AnswerCode.NO_ERROR){
								alert_wyca('Error in scanning map names ' + wycaApi.AnswerCodeToString(data.A)+ " " + data.M)
							}else{
								data.D.forEach(function(item){
									map_names.push(item.name);
								});
								console.log('Site ',data.D.id_site);
								console.log('Maps ',map_names);
								console.log('Map ',window.map_name);
								if(map_names.includes(window.map_name)){
									alert_wyca(textNameUsed);
									setTimeout(function(){form_sended = false},1000);
									$('.bMappingSaveMap').removeClass('disabled');
								}else{
																
										//
										var canvasDessin = document.getElementById('install_by_step_mapping_canvas_result_trinary');
									
										$('#install_by_step_mapping_fin .bMappingCancelMap2').hide();
										$('#install_by_step_mapping_fin .bMappingSaveMap').hide();
									
										$('#install_by_step_mapping_from_image').val(finalMapData);
										$('#install_by_step_mapping_from_image_tri').val(canvasDessin.toDataURL());
										$('#install_by_step_mapping_from_ros_largeur').val($('#install_by_step_mapping_img_map_saved_fin').prop('naturalWidth'));
										$('#install_by_step_mapping_from_ros_hauteur').val($('#install_by_step_mapping_img_map_saved_fin').prop('naturalHeight'));
										$('#install_by_step_mapping_from_threshold_free').val($('#install_by_step_mapping_threshold_free_slider').val());
										$('#install_by_step_mapping_from_threshold_occupied').val($('#install_by_step_mapping_threshold_occupied_slider').val());
										//$('#form_mapping').submit();
										
										$.ajax({
											type: "POST",
											url: 'ajax/get_map_tri.php',
											data: {
												'image_tri':canvasDessin.toDataURL()
											},
											dataType: 'json',
											success: function(data) {
												if (!data.error)
												{
													map = {
														'id_map': -1,
														'id_site': -1,
														'name': window.map_name,
														'comment': '',
														'image': finalMapData,
														'image_tri': data.image,
														'ros_resolution': 5,
														'ros_width': $('#install_by_step_mapping_img_map_saved_fin').prop('naturalWidth'),
														'ros_height': $('#install_by_step_mapping_img_map_saved_fin').prop('naturalHeight'),
														'threshold_free': parseInt($('#install_by_step_mapping_threshold_free_slider').val()),
														'threshold_occupied': parseInt($('#install_by_step_mapping_threshold_occupied_slider').val())
													};
													
													wycaApi.SetMap(map, function(data){
														if (data.A == wycaApi.AnswerCode.NO_ERROR)
														{
															id_map_last = data.D;
															id_map = data.D;
															wycaApi.GetMapComplete(id_map, function(data){
																if (data.A == wycaApi.AnswerCode.NO_ERROR)
																{
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
																  
																	$('#install_by_step_mapping_use .bUseThisMapNowYes').show();
																	$('#install_by_step_mapping_use .bUseThisMapNowNo').show();
																	$('#install_by_step_mapping_use .modalUseThisMapNowTitle1').show();
																	$('#install_by_step_mapping_use .modalUseThisMapNowTitle2').hide();
																	$('#install_by_step_mapping_use .modalUseThisMapNowContent').hide();
																	
																	$('#install_by_step_mapping_fin .install_by_step_mapping_fin_next').click();
																	
																	
																	wycaApi.SetMapAsCurrent(id_map, function(data){
																		if (data.A == wycaApi.AnswerCode.NO_ERROR)
																		{
																			wycaApi.NavigationStartFromMapping(function(data) {
																				
																				if (data.A != wycaApi.AnswerCode.NO_ERROR) { alert_wyca('Error navigation start ; ' + wycaApi.AnswerCodeToString(data.A)+ " " + data.M);} 
																				
																				$('#install_by_step_mapping_use .install_by_step_mapping_use_next').click();
																				
																				setTimeout(function(){
																					ByStepInitMap();
																					ByStepResizeSVG();
																				},500); 
																				
																				$.ajax({
																					type: "POST",
																					url: 'ajax/install_by_step_save_mapping.php',
																					data: {},
																					dataType: 'json',
																					success: function(data) {
																					},
																					error: function(e) {
																					}
																				});
																			});
																		}
																		else
																		{
																			text = wycaApi.AnswerCodeToString(data.A);
																			if (data.M != '')
																				text += ' : ' + data.M;
																			alert_wyca(text);
																			
																			$('#install_by_step_mapping_use .bUseThisMapNowYes').show();
																			$('#install_by_step_mapping_use .bUseThisMapNowNo').show();
																			$('#install_by_step_mapping_use .modalUseThisMapNowTitle1').show();
																			$('#install_by_step_mapping_use .modalUseThisMapNowTitle2').hide();
																			$('#install_by_step_mapping_use .modalUseThisMapNowContent').hide();
																		}
																	});
										
																	
																  
																	var img = document.getElementById("install_by_step_mapping_img_map_saved_fin");
																	img.src = "assets/images/vide.png";
																	
																	
																}
																else
																{
																	alert_wyca('Get map error : ' + wycaApi.AnswerCodeToString(data.A));
																}		
																
															});
														}
														else
														{
															alert_wyca('Save map error : ' + wycaApi.AnswerCodeToString(data.A));
														}							
													});
												}
																
												
											},
											error: function(e) {
												
												var img = document.getElementById("install_by_step_mapping_img_map_saved_fin");
												img.src = "assets/images/vide.png";
												
												alert_wyca('Error get map trinary ; ' + e.responseText);
											}
										});
										
																
									setTimeout(function(){form_sended = false},1000);
									$('.bMappingSaveMap').removeClass('disabled');
								}							
							}
						})
					}
				})
			}
		}
	});
	
	$('#install_by_step_mapping_form').submit(function(){
		
		
		
	});
	$('#install_by_step_mapping_use .bUseThisMapNowYes').click(function(e) {
		e.preventDefault();
        
		$('#install_by_step_mapping_use .bUseThisMapNowYes').hide();
		$('#install_by_step_mapping_use .bUseThisMapNowNo').hide();
		$('#install_by_step_mapping_use .modalUseThisMapNowTitle1').hide();
		$('#install_by_step_mapping_use .modalUseThisMapNowTitle2').show();
		$('#install_by_step_mapping_use .modalUseThisMapNowContent').show();
		
		$('#install_by_step_mapping_use .modalUseThisMapNowContentDetails').html(textBuildingMap);
		
		wycaApi.SetMapAsCurrent(id_map, function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_by_step_mapping_use .modalUseThisMapNowContentDetails').html(textStartAutonomous);
				wycaApi.NavigationStartFromMapping(function(data) {
					
					if (data.A != wycaApi.AnswerCode.NO_ERROR) { alert_wyca('Error navigation start ; ' + wycaApi.AnswerCodeToString(data.A)+ " " + data.M);} 
					$('#install_by_step_mapping_use .install_by_step_mapping_use_next').click();
				});
			}
			else
			{
				text = wycaApi.AnswerCodeToString(data.A);
				if (data.M != '')
					text += ' : ' + data.M;
				alert_wyca(text);
				
				$('#install_by_step_mapping_use .bUseThisMapNowYes').show();
				$('#install_by_step_mapping_use .bUseThisMapNowNo').show();
				$('#install_by_step_mapping_use .modalUseThisMapNowTitle1').show();
				$('#install_by_step_mapping_use .modalUseThisMapNowTitle2').hide();
				$('#install_by_step_mapping_use .modalUseThisMapNowContent').hide();
			}
		});
		
		
    });
	
	$('#install_by_step_mapping_fin .bResetValueThreshold').click(function(e) {
        e.preventDefault();
		
		$("#install_by_step_mapping_threshold_free_slider").val(25);
		$("#install_by_step_mapping_threshold_free_slider_elem").slider('value',25);
		$('#install_by_step_mapping_threshold_free_output b').text( 25 );
		threshold_free = 25;
		
		$("#install_by_step_mapping_threshold_occupied_slider").val(65);
		$("#install_by_step_mapping_threshold_occupied_slider_elem").slider('value',65);
		$('#install_by_step_mapping_threshold_occupied_output b').text( 65 );
		threshold_occupied = 65;
		
		CalculateMapTrinary();
    });
	
	$('#install_by_step_mapping_threshold_free_slider').change(function() {
		$('#install_by_step_mapping_threshold_free_output b').text( this.value );
		threshold_free = this.value;
		
		CalculateMapTrinary();
	});
	$('#install_by_step_mapping_threshold_occupied_slider').change(function() {
		$('#install_by_step_mapping_threshold_occupied_output b').text( this.value );
		threshold_occupied = this.value;
		
		CalculateMapTrinary();
	});
		
	$('#install_by_step_wifi .refresh_wifi').click(function(e) {
		e.preventDefault();		
	});
	
	$( '#install_by_step_wifi tbody' ).on( 'click', 'tr', function(e) {
		e.preventDefault();
		selectedWifi = $(this).data('ssid');
		
		$('#install_by_step_wifi_password .wifi_connexion_error').html('');
		$('#install_by_step_wifi_password .install_by_step_wifi_password_save').show();
		$('#install_by_step_wifi_password .wifi_connexion_progress').hide();

		$('#install_by_step_wifi .set_passwd_wifi').click();
	});
	
	$('#install_by_step_wifi_password .install_by_step_wifi_password_save').click(function(e) {
        e.preventDefault();
		
		$('#install_by_step_wifi_password .install_by_step_wifi_password_save').hide();
		$('#install_by_step_wifi_password .wifi_connexion_progress').show();
		$('#install_by_step_wifi_password .wifi_connexion_error').html('');
		
		wycaApi.WifiConnection(selectedWifi, $('#install_by_step_wifi_password .i_wifi_passwd_name').val(), function(data){
			if (data.A != wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_by_step_wifi_password .wifi_connexion_error').html(data.M);
			}
			else
			{
				$('#install_by_step_wifi_password .skip_wifi').click();
				$('#install_by_step_wifi_password .wifi_connexion_error').html('');
			}
			$('#install_by_step_wifi_password .install_by_step_wifi_password_save').show();
			$('#install_by_step_wifi_password .wifi_connexion_progress').hide();
		});
    });
	
	$("#install_by_step_mapping_threshold_occupied_slider_elem").slider({ "value": 65, "range": "min", "max": 100 });
	$("#install_by_step_mapping_threshold_occupied_slider_elem").on("slide", function(slideEvt) { $("#install_by_step_mapping_threshold_occupied_output b").text(slideEvt.value); $("#install_by_step_mapping_threshold_occupied_slider").val(slideEvt.value); });
	$("#install_by_step_mapping_threshold_free_slider_elem").slider({ "value": 25, "range": "min", "max": 100 });
	$("#install_by_step_mapping_threshold_free_slider_elem").on("slide", function(slideEvt) { $("#install_by_step_mapping_threshold_free_output b").text(slideEvt.value); $("#install_by_step_mapping_threshold_free_slider").val(slideEvt.value); });
	
	$('#install_by_step_edit_map .bSaveEditMap').click(function(e) {
		e.preventDefault();
        
		if (!bystepCanChangeMenu)
		{
			alert_wyca('You must confirm the active element');
		}
		else
		{
			data = GetDataMapToSave();
			
			if ($(this).hasClass('button_goto'))
			{
				$('#install_by_step_test_map .list_test li').remove();
				$('#install_by_step_test_map .install_by_step_test_map_loading').show();
				
				gotoTest = true;
			}
			else
				gotoTest = false;
			
			wycaApi.SetCurrentMapData(data, function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					success_wyca("Map saved !");
					
					// On reload la carte pour mettre à jours les ids
					GetInfosCurrentMapByStep();
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
	
	$('#install_by_step_test_map').on( 'click', '.bExecuteTest', function(e) {
        e.preventDefault();
		
		$('#install_by_step_test_map .bExecuteTest').addClass('disabled');
		
		currentTestIndex = $(this).parent().data('index_li');
		
		id = $(this).parent().data('id');
		if ($(this).parent().data('type') == 'Poi')
		{
			wycaApi.on('onGoToPoiResult', function (data){
				
				$('#install_by_step_test_map .bExecuteTest').removeClass('disabled');
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex).addClass('done');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-danger');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-success');
				}
				else
				{
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex).addClass('ko');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-success');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-danger');
					if (data.M != '')
						alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						alert_wyca(wycaApi.AnswerCodeToString(data.A));
				}
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToPoiResult', onGoToPoiResult);
			});
			wycaApi.GoToPoi(id, function (data){
				
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
				}
				else
				{
					$('#install_by_step_test_map .bExecuteTest').removeClass('disabled');
				
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex).addClass('ko');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-success');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-danger');
					if (data.M != '')
						alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						alert_wyca(wycaApi.AnswerCodeToString(data.A));
					
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoiResult', onGoToPoiResult);
				}
			});
		}
		else if ($(this).parent().data('type') == 'AugmentedPose')
		{
			wycaApi.on('onGoToAugmentedPoseResult', function (data){
				
				$('#install_by_step_test_map .bExecuteTest').removeClass('disabled');
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex).addClass('done');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-danger');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-success');
				}
				else
				{
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex).addClass('ko');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-success');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-danger');
					if (data.M != '')
						alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						alert_wyca(wycaApi.AnswerCodeToString(data.A));
				}
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
			});
			wycaApi.GoToAugmentedPose(id, function (data){
				
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
				}
				else
				{
					$('#install_by_step_test_map .bExecuteTest').removeClass('disabled');
				
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex).addClass('ko');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-success');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-danger');
					if (data.M != '')
						alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						alert_wyca(wycaApi.AnswerCodeToString(data.A));
					
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
				}
			});
		}
		else
		{
			// Dock
			wycaApi.on('onGoToChargeResult', function (data){
				
				$('#install_by_step_test_map .bExecuteTest').removeClass('disabled');
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex).addClass('done');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-danger');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-success');
				}
				else
				{
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex).addClass('ko');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-success');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-danger');
					if (data.M != '')
						alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						alert_wyca(wycaApi.AnswerCodeToString(data.A));
				}
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToChargeResult', onGoToChargeResult);
			});
			wycaApi.GoToCharge(id, function (data){
				
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
				}
				else
				{
					$('#install_by_step_test_map .bExecuteTest').removeClass('disabled');
					
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex).addClass('ko');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-success');
					$('#install_by_step_test_map #install_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-danger');
					if (data.M != '')
						alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
					else
						alert_wyca(wycaApi.AnswerCodeToString(data.A));
					
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToChargeResult', onGoToChargeResult);
				}
			});
			
		}
    });
	
	$('#install_by_step_test_map .bTestFinish').click(function(e) {
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_test_finish.php',
			data: {
			},
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				alert_wyca('Error step finish ; ' + e.responseText);
			}
		});
    });
	
	$('#pages_install_by_step a.real_test').click(function(e) {
        e.preventDefault();
		$('#pages_install_by_step .modalRealTest_loading').show();
		$('#pages_install_by_step .modalRealTest_content').hide();
		$('#pages_install_by_step .modalRealTest').modal('show');
		wycaApi.GetCurrentMapComplete(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#pages_install_by_step .modalRealTest_loading').hide();
				$('#pages_install_by_step .modalRealTest_content').show();
				$('select#real_test_start > option').hide();
				$('select#real_test_end > option').hide();
				//ADD POIS
				$.each(data.D.pois,function(i, item){
					$('select#real_test_start').append('<option value="poi_'+item.id_poi+'" data-type="poi" data-id="'+item.id_poi+'" >&#xf3c5 - POI - '+item.name+'</option>' );
					$('select#real_test_end').append('<option value="poi_'+item.id_poi+'" data-type="poi" data-id="'+item.id_poi+'">&#xf3c5 - POI - '+item.name+'</option>' );
				});
				//ADD DOCKS
				$.each(data.D.docks,function(i, item){
					$('select#real_test_start').append('<option value="dock_'+item.id_docking_station+'" data-type="dock" data-id="'+item.id_docking_station+'" >&#xf5e7 - Dock - '+item.name+'</option>' );
					$('select#real_test_end').append('<option value="dock_'+item.id_docking_station+'" data-type="dock" data-id="'+item.id_docking_station+'" >&#xf5e7 - Dock - '+item.name+'</option>' );
				});
				//ADD A POSES
				$.each(data.D.augmented_poses,function(i, item){
					$('select#real_test_start').append('<option value="augmented_pose_'+item.id_docking_station+'" data-type="augmented_pose" data-id="'+item.id_augmented_pose+'" >&#xf02a; &#xf3c5;   - A. pose - '+item.name+'</option>' );
					$('select#real_test_end').append('<option value="augmented_pose_'+item.id_docking_station+'" data-type="augmented_pose" data-id="'+item.id_augmented_pose+'" >&#xf02a; &#xf3c5; - A. pose - '+item.name+'</option>' );
				});
				
			}
			else
			{
				$('#pages_install_by_step .modalRealTest').modal('hide');
			}
		
		})		
		
	});
	
	/* REAL TEST */
	
	/* FONCTION PROGRESS BAR REAL TEST */
	
	
	function TimerRealTest(step)
	{
		if(step=='start'){			
			if(statusRealTestStart > 0){
				if(statusRealTestStart == 2 && timerRealTestStart==100){
					statusRealTestStart=0;
					timerRealTestStart=0;
					$('.checkStart').show();
				}else{
					$('.checkStart').hide();
					delay = statusRealTestStart == 2 ? 1 : 200;
					timerRealTestStart++;
					if(timerRealTestStart == 101)timerRealTestStart=0;
					$('#install_by_step_config .startRealTestprogress .progress-bar').css('width', timerRealTestStart+'%').attr('aria-valuenow', timerRealTestStart); 
					setTimeout(TimerRealTest,delay,step);
				}
			}
		}
		else if(step=='end'){			
			if(statusRealTestEnd > 0){
				if(statusRealTestEnd == 2 && timerRealTestEnd==100){
					statusRealTestEnd=0;
					timerRealTestEnd=0;
					$('.checkEnd').show();
				}else{
					$('.checkEnd').hide();
					delay = statusRealTestEnd == 2 ? 1 : 200;
					timerRealTestEnd++;
					if(timerRealTestEnd == 101)timerRealTestEnd=0;
					$('#install_by_step_config .endRealTestprogress .progress-bar').css('width', timerRealTestEnd+'%').attr('aria-valuenow', timerRealTestEnd); 
					setTimeout(TimerRealTest,delay,step);
				}
			}
		}
		
	}
	
	$('#pages_install_by_step a.bRealTestDo').click(function(e) {
        e.preventDefault();
		let start = $('select#real_test_start option:selected');
		let end = $('select#real_test_end option:selected');
		if(start.val()!='' && end.val()!='' && end.val()!=start.val()){
			$('#pages_install_by_step .modalRealTest').modal('hide');
			$('#pages_install_by_step .modalRealTestResult').modal('show');
			
			$(".modalRealTestResult_content #start_point").hide();
			$(".modalRealTestResult_content #end_point").hide();
			$(".modalRealTestResult_content #result_RealTest").hide();
			
			$(".modalRealTestResult_content #start_point_text").html(start.html());
			$(".modalRealTestResult_content #end_point_text").html(end.html());
			
			RealTestGotoStart(start,end);
		}
	});
	
	function RealTestGotoStart(start,end){
		console.log('Go to start');
		console.log(start.data('type'),' id ',start.data('id'));
		switch(start.data('type')){
			case 'poi':
				//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
				wycaApi.on('onGoToPoiResult', function (data){
					if (data.A == wycaApi.AnswerCode.NO_ERROR){
						battery_lvl_start = battery_lvl_current; // STOCKAGE BATTERY LVL
						// GO TO END
						RealTestGotoEnd(end);
						
						
					}else{
						if (data.M != '')
							alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
						else
							alert_wyca(wycaApi.AnswerCodeToString(data.A));
						
					}
					if(end.data('type')!='poi') // On rebranche l'ancienne fonction
						wycaApi.on('onGoToPoiResult', onGoToPoiResult);
				});
				
				id = start.data('id');
				wycaApi.GoToPoi(id,function(data){
					if (data.A == wycaApi.AnswerCode.NO_ERROR){
						$(".modalRealTestResult_content #start_point").show();
						
						statusRealTestStart = 1;
						timerRealTestStart = 0;
						TimerRealTest('start');
						
					}else{
						$('#pages_install_by_step .modalRealTestResult').modal('hide');
						if (data.M != '')
							alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
						else
							alert_wyca(wycaApi.AnswerCodeToString(data.A));
					}
				})
			break;
			case 'dock':
				//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
				wycaApi.on('onGoToChargeResult', function (data){
					if (data.A == wycaApi.AnswerCode.NO_ERROR){
						battery_lvl_start = battery_lvl_current; // STOCKAGE BATTERY LVL
						// GO TO END
						RealTestGotoEnd(end);
					}else{
						if (data.M != '')
							alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
						else
							alert_wyca(wycaApi.AnswerCodeToString(data.A));
					}
					if(end.data('type')!='dock') // On rebranche l'ancienne fonction
						wycaApi.on('onGoToChargeResult', onGoToChargeResult);
				});
				
				id = start.data('id');
				
				wycaApi.GoToCharge(id,function(data){
					if (data.A == wycaApi.AnswerCode.NO_ERROR){
						$(".modalRealTestResult_content #start_point").show();
					
						statusRealTestStart = 1;
						timerRealTestStart = 0;
						TimerRealTest('start');
						
					}else{
						$('#pages_install_by_step .modalRealTestResult').modal('hide');
						if (data.M != '')
							alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
						else
							alert_wyca(wycaApi.AnswerCodeToString(data.A));
					}
				})
				
			break;
			case 'augmented_pose':
				//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
				wycaApi.on('onGoToAugmentedPoseResult', function (data){
					if (data.A == wycaApi.AnswerCode.NO_ERROR){
						battery_lvl_start = battery_lvl_current; // STOCKAGE BATTERY LVL
						// GO TO END
						RealTestGotoEnd(end);
					}else{
						
						if (data.M != '')
							alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
						else
							alert_wyca(wycaApi.AnswerCodeToString(data.A));
					}
					if(end.data('type')!='augmented_pose') // On rebranche l'ancienne fonction
						wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
				});
				
				id = start.data('id');
				
				wycaApi.GoToAugmentedPose(id,function(data){
					if (data.A == wycaApi.AnswerCode.NO_ERROR){
						$(".modalRealTestResult_content #start_point").show();
					
						statusRealTestStart = 1;
						timerRealTestStart = 0;
						TimerRealTest('start');
						
					}else{
						$('#pages_install_by_step .modalRealTestResult').modal('hide');
						if (data.M != '')
							alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
						else
							alert_wyca(wycaApi.AnswerCodeToString(data.A));
					}						
				})
			break;
		}
		
	}
	
	function RealTestGotoEnd(end){
		console.log('Go to end');
		console.log(end.data('type'),' id ',end.data('id'));
		statusRealTestStart = 2;
		
		statusRealTestEnd = 1;
		timerRealTestEnd = 0;
		TimerRealTest('end');
						
		switch(end.data('type')){
			case 'poi':
				//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
				wycaApi.on('onGoToPoiResult', function (data){
					if (data.A == wycaApi.AnswerCode.NO_ERROR){
						statusRealTestEnd = 2;
						battery_lvl_needed = battery_lvl_start - battery_lvl_current; // STOCKAGE BATTERY LVL NEEDED
						textDisplay = battery_lvl_needed == 0 ? textLessThanOne : battery_lvl_needed;
						$('#battery_used').html(textDisplay);
						$(".modalRealTestResult_content #result_RealTest").show();
					}else{
						if (data.M != '')
							alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
						else
							alert_wyca(wycaApi.AnswerCodeToString(data.A));
					}
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoiResult', onGoToPoiResult);
				});
				
				id = end.data('id');
				
				wycaApi.GoToPoi(id,function(data){
					if (data.A == wycaApi.AnswerCode.NO_ERROR){
						$(".modalRealTestResult_content #end_point").show()
					}else{
						if (data.M != '')
							alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
						else
							alert_wyca(wycaApi.AnswerCodeToString(data.A));
					}
				})
			break;
			case 'dock':
				//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
				wycaApi.on('onGoToChargeResult', function (data){
					if (data.A == wycaApi.AnswerCode.NO_ERROR){
						statusRealTestEnd = 2;
						battery_lvl_needed = battery_lvl_start - battery_lvl_current; // STOCKAGE BATTERY LVL NEEDED
						textDisplay = battery_lvl_needed == 0 ? textLessThanOne : battery_lvl_needed;
						$('#battery_used').html(textDisplay);
						$(".modalRealTestResult_content #result_RealTest").show();
					}else{
						if (data.M != '')
							alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
						else
							alert_wyca(wycaApi.AnswerCodeToString(data.A));
					}
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToChargeResult', onGoToChargeResult);
				});
				
				id = end.data('id');
				
				wycaApi.GoToCharge(id,function(data){
					if (data.A == wycaApi.AnswerCode.NO_ERROR){
						$(".modalRealTestResult_content #end_point").show()
					}else{
						if (data.M != '')
							alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
						else
							alert_wyca(wycaApi.AnswerCodeToString(data.A));
					}
				})
				
			break;
			case 'augmented_pose':
				//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
				wycaApi.on('onGoToAugmentedPoseResult', function (data){
					if (data.A == wycaApi.AnswerCode.NO_ERROR){
						statusRealTestEnd = 2;
						battery_lvl_needed = battery_lvl_start - battery_lvl_current; // STOCKAGE BATTERY LVL NEEDED
						textDisplay = battery_lvl_needed == 0 ? textLessThanOne : battery_lvl_needed;
						$('#battery_used').html(textDisplay);
						$(".modalRealTestResult_content #result_RealTest").show();
					}else{
						if (data.M != '')
							alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
						else
							alert_wyca(wycaApi.AnswerCodeToString(data.A));
					}
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
				});
				
				id = end.data('id');
				
				wycaApi.GoToAugmentedPose(id,function(data){
					if (data.A == wycaApi.AnswerCode.NO_ERROR){
						$(".modalRealTestResult_content #end_point").show()
					}else{
						if (data.M != '')
							alert_wyca(wycaApi.AnswerCodeToString(data.A) + '<br>' +data.M);
						else
							alert_wyca(wycaApi.AnswerCodeToString(data.A));
					}						
				})
			break;
		}
		
		// LAUNCH PROGRESS BAR ANIM
	}
	
	
		
	$('#install_by_step_config .bConfigurationSave').click(function(e) {
		wycaApi.SetEnergyConfiguration(parseInt($('#install_by_step_config #install_by_step_config_i_level_min_gotocharge').val()), parseInt($('#install_by_step_config #install_by_step_config_i_level_min_dotask').val()), function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$.ajax({
					type: "POST",
					url: 'ajax/install_by_step_config.php',
					data: {
					},
					dataType: 'json',
					success: function(data) {
					},
					error: function(e) {
						alert_wyca('Error step finish ; ' + e.responseText);
					}
				});
				$('#install_by_step_config .install_by_step_config_next').click();
				
			}
			else
			{
				console.log(JSON.stringify(data)); 
				alert_wyca(wycaApi.AnswerCodeToString(data.A));
			}
		});
    });
	
	$('#install_by_step_manager .bAddManager').click(function(e) {
	
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_id_manager').val(-1);
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_email').val('');
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_societe').val('');
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_prenom').val('');
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_nom').val('');
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_password').val('');
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_cpassword').val('');
		
		$('#install_by_step_manager .modalManager').modal('show');
	});
	
	$('#install_by_step_manager .modalManager #install_by_step_manager_bManagerSave').click(function(e) {
        e.preventDefault();
		
		if ($('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_password').val() != $('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_cpassword').val() || $('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_cpassword').val() == '' || !$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_cpassword')[0].checkValidity())
		{
			alert_wyca('Invalid password or confirm');
		}
		else if (!$('#install_by_step_manager_i_manager_email')[0].checkValidity())
		{
			alert_wyca('Error in login');
		}
		/*
		else if ($('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_societe').val() == "" )
		{
			alert_wyca('Company is required');
		}
		else if ($('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_prenom').val() == "" )
		{
			alert_wyca('Firstname is required');
		}
		else if ($('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_nom').val() == "" )
		{
			alert_wyca('Lastname is required');
		}*/
		else
		{
			json_user = {
				"id_user": parseInt($('#install_by_step_manager .modalManager #install_by_step_manager_i_id_manager').val()),
				"company": $('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_societe').val(),
				"lastname": $('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_nom').val(),
				"firstname": $('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_prenom').val(),
				"email": $('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_email').val(),
				"pass": $('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_password').val(),
				"id_group_user": 3,
			};
			
			wycaApi.SetUser(json_user, function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					// On ajoute le li
					id_user = data.D;
					if ($('#install_by_step_manager_list_manager_elem_'+id_user).length > 0)
					{
						$('#install_by_step_manager_list_manager_elem_'+id_user+' span.email').html(json_user.email);
						$('#install_by_step_manager_list_manager_elem_'+id_user+' span.societe').html(json_user.company);
						/*
						$('#install_by_step_manager_list_manager_elem_'+id_user+' span.prenom').html(json_user.firstname);
						$('#install_by_step_manager_list_manager_elem_'+id_user+' span.nom').html(json_user.lastname);
						*/
					}
					else
					{
						$('#install_by_step_manager .list_managers').append('' +
							'<li id="install_by_step_manager_list_manager_elem_'+id_user+'" data-id_user="'+id_user+'">'+
							'	<span class="email">'+json_user.email+'</span>'+
							'	<a href="#" class="bManagerDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="bManagerEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pen"></i></a>'+
							'</li>'
							);
					}
					
					$('#install_by_step_manager .modalManager').modal('hide');
				}
				else
				{
					console.log(JSON.stringify(data)); 
					alert_wyca(wycaApi.AnswerCodeToString(data.A));
				}
			});
		}
    });
	
	$(document).on('click', '#install_by_step_manager .bManagerDeleteElem', function(e) {
		e.preventDefault();
		
		id_user_to_delete = parseInt($(this).closest('li').data('id_user'));
		
		wycaApi.DeleteUser(id_user_to_delete, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#install_by_step_manager_list_manager_elem_'+id_user_to_delete).remove();
			}
			else
			{
				console.log(JSON.stringify(data)); 
				alert_wyca(wycaApi.AnswerCodeToString(data.A));
			}
		});
	});
	
	$(document).on('click', '#install_by_step_manager .bManagerEditElem', function(e) {
		e.preventDefault();
		
		id_user = $(this).closest('li').data('id_user');
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_id_manager').val(id_user);
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_email').val($('#install_by_step_manager_list_manager_elem_'+id_user+' span.email').html());
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_societe').val($('#install_by_step_manager_list_manager_elem_'+id_user+' span.societe').html());
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_prenom').val($('#install_by_step_manager_list_manager_elem_'+id_user+' span.prenom').html());
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_nom').val($('#install_by_step_manager_list_manager_elem_'+id_user+' span.nom').html());
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_password').val('');
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_cpassword').val('');
		
		$('#install_by_step_manager .modalManager').modal('show');
	});
	
	$('#install_by_step_manager .bValidManager').click(function(e) {
        $.ajax({
			type: "POST",
			url: 'ajax/install_by_step_managers.php',
			data: {
			},
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				alert_wyca('Error step managers ; ' + e.responseText);
			}
		});
    });
	
	$('#install_by_step_service_book .bAddServiceBook').click(function(e) {
	
		$('#install_by_step_service_book .modalServiceBook #install_by_step_service_book_i_service_book_title').val('');
		$('#install_by_step_service_book .modalServiceBook #install_by_step_service_book_i_service_book_comment').val('');
		
		$('#install_by_step_service_book .modalServiceBook').modal('show');
	});
	
	$('#install_by_step_service_book .modalServiceBook #install_by_step_service_book_bServiceBookSave').click(function(e) {
        e.preventDefault();
		
		if ($('#install_by_step_service_book .modalServiceBook #install_by_step_service_book_i_service_book_title').val() == "" )
		{
			alert_wyca('Title is required');
		}
		else if ($('#install_by_step_service_book .modalServiceBook #install_by_step_service_book_i_service_book_comment').val() == "" )
		{
			alert_wyca('Comment is required');
		}
		else
		{
			json_service_book = {
				"id_service_book": -1,
				"title": $('#install_by_step_service_book .modalServiceBook #install_by_step_service_book_i_service_book_title').val(),
				"comment": $('#install_by_step_service_book .modalServiceBook #install_by_step_service_book_i_service_book_comment').val()
			};
			
			wycaApi.SetServiceBook(json_service_book, function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					// On ajoute le li
					$('#install_by_step_service_book .list_service_books').append('' +
						'<li>'+
						'	<div class="title">'+json_service_book.title+'</div>'+
						'	<div class="comment">'+json_service_book.comment+'</div>'+
						'</li>'
						);

					$('#install_by_step_service_book .modalServiceBook').modal('hide');
				}
				else
				{
					console.log(JSON.stringify(data)); 
					alert_wyca(wycaApi.AnswerCodeToString(data.A));
				}
			});
		}
    });
	
	$('#install_by_step_end .bCloseInstallation').click(function(e) {
        $.ajax({
			type: "POST",
			url: 'ajax/install_by_step_finish.php',
			data: {
			},
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				alert_wyca('Error step finish ; ' + e.responseText);
			}
		});
		
		$('#pages_install_by_step').removeClass('active');
		$('#pages_install_normal').addClass('active');
		
		if ($('#install_normal_setup_sites').is(':visible'))
		{
			GetSitesNormal();
		}
		
		
		$('.menu_groupe button').show();
		
    });
});

var currentTestIndex = -1;

function StartAnimCheckComposantInstall()
{
	timer_anim_check = undefined;
	if ($('#install_by_step_check .test').length > 0)
	{
		$('#install_by_step_check .test').addClass('checked');
		$('#install_by_step_check .test').removeClass('test');
		
		if ($('#install_by_step_check div.is_checkbox:not(".checked")').length > 0)
		{
			$('#install_by_step_check div.is_checkbox:not(".checked")').first().addClass('test');
			timer_anim_check = setTimeout(StartAnimCheckComposantInstall, Math.floor(Math.random() * 1500 + 500));
		}
		else
		{
			//$('#install_by_step_check .install_by_step_check_next').show();
			$('.install_by_step_check_next').removeClass('disabled');
			$('.install_by_step_check_next').html(textBtnCheckNext);
			
		
		}
	}	
}

var finalMapData = '';

var timerCreateMap = 5;
var timerCreateMapCurrent = 5;
var timeoutTimerCreateInterval = null;

function NextTimerCreateMap()
{
	if (timerCreateMapCurrent < 0)
	{
		setTimeout(function() {
			$('#install_by_step_mapping .progressStartMapping').hide();
			$('#install_by_step_mapping .switchLiveMapping').show();
			$('#install_by_step_mapping .bMappingStop').show();
			$('#install_by_step_mapping .mapping_view').show();
			img = document.getElementById("install_by_step_mapping_img_map_saved");
			img.src = "assets/images/vide.png";
			
			if (intervalMap != null)
			{
				clearInterval(intervalMap);
				intervalMap = null;
			}
			//intervalMap = setInterval(GetMap, 1000);
			
			GetMappingInConstruction();
		}, 500);
	}
	else	
	{
		if (timerCreateMapCurrent == 5 && timerCreateMap == 10) // Stop navigation before
		{
			wycaApi.MappingStart(function(r) { 
				mappingStarted = true;
			});
			
			$('#install_by_step_mapping .progressStartMapping h3').html(textStartMapping);
		}
		
		valeur = 100-parseInt(timerCreateMapCurrent / timerCreateMap * 100);

		$('#install_by_step_mapping .createMapProgress .progress-bar').css('width', valeur+'%').attr('aria-valuenow', valeur); 
	
		timerCreateMapCurrent -= 0.1;	
		timerCreateMapCurrent = parseInt(timerCreateMapCurrent*10)/10;
		
		setTimeout(NextTimerCreateMap, 100);
	}
}

var threshold_free = 25;
var threshold_occupied = 65;

var color_free = 255;
var color_occupied = 0;
var color_unknow = 205;

var timeoutCalcul = null;

var img;
var canvas;

var width = 0;
var height = 0;


function CalculateMapTrinary()
{
	if (timeoutCalcul != null)
	{
		clearTimeout(timeoutCalcul);
		timeoutCalcul = null;
	}
	timeoutCalcul = setTimeout(CalculateMapTrinaryDo, 500);
}

function CalculateMapTrinaryDo()
{
	threshold_free_255 = 255 - threshold_free / 100 * 255;
	threshold_occupied_255 = 255 - threshold_occupied / 100 * 255;
	
	buffer = new Uint8ClampedArray(width * height * 4); // have enough bytes

	var pixelsData = canvas.getContext('2d').getImageData(0, 0, width, height).data;	
	
	for(var y = 0; y < height; y++)
	{
		for(var x = 0; x < width; x++)
		{
			var pos = (y * width + x) * 4; // position in buffer based on x and y
			
			if (pixelsData[pos+3] == 0) // Alpha 0
				color = color_unknow;
			else if (pixelsData[pos] > threshold_free_255)
				color = color_free;
			else if (pixelsData[pos] < threshold_occupied_255)
				color = color_occupied;
			else
				color = color_unknow;
			
			buffer[pos  ] = color;           // some R value [0, 255]
			buffer[pos+1] = color;           // some G value
			buffer[pos+2] = color;           // some B value
			if (color == color_unknow)
				buffer[pos+3] = 0;           // set alpha channel
			else
				buffer[pos+3] = 255;           // set alpha channel
		}
	}
	
	var canvasDessin = document.getElementById('install_by_step_mapping_canvas_result_trinary'),
	ctx = canvasDessin.getContext('2d');
	
	var idata = ctx.createImageData(width, height);
	idata.data.set(buffer);
	ctx.putImageData(idata, 0, 0);
	
	$('#install_by_step_mapping_fin .loading_fin_create_map').hide();
}

