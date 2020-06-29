

var selectedWifi = '';
var json_user = {};

$(document).ready(function(e) {
	
	if ($('#install_by_step_check').is(':visible')) setTimeout(StartAnimCheckComposantInstall, 2000);
	
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
				alert(e.responseText);
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
				alert(e.responseText);
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
				alert(e.responseText);
			}
		});
    });
	
	$('#pages_install_by_step a.bImportTopDo').click(function(e) {
        e.preventDefault();
		
		$('.modalImportTop_loading').hide();
		$('.modalImportTop_content').show();
		
		file = $('#pages_install_by_step .file_import_top')[0].files[0];
		var reader = new FileReader();
		reader.onload = function(event) { 
			wycaApi.InstallNewTopWithoutKey(btoa(reader.result), function(data) { 
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					
					$('.modalImportTop_loading').hide();
					$('.modalImportTop_content').show();
					
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
    });
	
	$('#pages_install_by_step a.import_top').click(function(e) {
        e.preventDefault();
		
		$('.modalImportTop_loading').hide();
		$('.modalImportTop_content').show();
		
		$('#pages_install_by_step .modalImportTop').modal('show');
	});
	$('#pages_install_by_step a.save_tops').click(function(e) {
        e.preventDefault();
		
		var listAvailableTops = Array();
		$('#pages_install_by_step .install_by_step_top li').hide();
		$(this).parent().find('.is_checkbox.checked').each(function(index, element) {
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
						alert(e.responseText);
					}
				});
				
				if (listAvailableTops.length == 1)
				{
					wycaApi.SetActiveTop(listAvailableTops[0], function(data){
						$('#pages_install_by_step a.save_tops_next_check').click();
						setTimeout(StartAnimCheckComposantInstall, 2000);
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
				alert(e.responseText);
			}
		});
		
		setTimeout(StartAnimCheckComposantInstall, 2000);
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
				alert(e.responseText);
			}
		});
    });
	
	$('#pages_install_by_step form.form_site').submit(function(e) {
        e.preventDefault();
		if ($('#pages_install_by_step .i_site_name').val() == '')
		{
			alert_wyca(textIndicateAName);
		}
		else
		{
			wycaApi.GetCurrentSite(function(data) {
				data.D.name = $('#pages_install_by_step .i_site_name').val();
				wycaApi.SetSite(data.D, function(data){
					$.ajax({
						type: "POST",
						url: 'ajax/install_by_step_site.php',
						data: {
						},
						dataType: 'json',
						success: function(data) {
						},
						error: function(e) {
							alert(e.responseText);
						}
					});
					$('#pages_install_by_step a.install_by_step_site_next').click();
				});
			});
		}
	});
	
	
	$(".map_dyn").on("load", function() {  InitPosCarteMapping(); });
	
	$('#install_by_step_mapping .bMappingStart').click(function(e) {
		e.preventDefault();
		
		$('#install_by_step_mapping .bMappingStart').hide();
		
		if (navLaunched)
		{
			wycaApi.NavigationStop(function(r) { if (!r.success) alert(r.message);});
			
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
				wycaApi.MappingStart(function(r) { 
					mappingStarted = true;
				});
				
				$('#install_by_step_mapping .progressStartMapping h3').html(textStartMapping);
				timerCreateMap = 5;
				timerCreateMapCurrent = 5;
				$('.progressStartMapping').show();
				NextTimerCreateMap();
			}
			else
			{
				$('#install_by_step_mapping .progressStartMapping').hide();
				$('#install_by_step_mapping .bMappingStop').show();
				$('#install_by_step_mapping .mapping_view').show();
					
				img = document.getElementById("install_by_step_mapping_img_map_saved");
				img.src = "assets/images/vide.png";
				
				if (intervalMap != null)
				{
					clearInterval(intervalMap);
					intervalMap = null;
				}
			}
		}
	});
	$('#install_by_step_mapping .bMappingStop').click(function(e) {
		e.preventDefault();
		
		$('#install_by_step_mapping_fin .loading_fin_create_map').show();
		
		img = document.getElementById("install_by_step_mapping_img_map_saved_fin");
        img.src = 'assets/images/vide.png';
		
		wycaApi.MappingStop(function(data) {
			$('#install_by_step_mapping_fin .loading_fin_create_map').hide();
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
		$('#install_by_step_mapping .bMappingStop').hide();
		$('#install_by_step_mapping .mapping_view').hide();
		$('#install_by_step_mapping .bMappingStart').show();
		
		$('#install_by_step_mapping_fin .bMappingCancelMap').show();
		
		if (intervalMap != null)
		{
			clearInterval(intervalMap);
			intervalMap = null;
		}
	});
	
	$('#install_by_step_mapping_fin .bMappingSaveMap').click(function(e) {
		if ($('#install_by_step_mapping_from_name').val() == '')
		{
			alert_wyca(textIndicateAName);
			e.preventDefault();
		}
		else
		{
			var canvasDessin = document.getElementById('canvas_result_trinary');
		
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
							'name': $('#install_by_step_mapping_from_name').val(),
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
										
										InitMap();
									  
										var img = document.getElementById("install_by_step_mapping_img_map_saved_fin");
										img.src = "assets/images/vide.png";
										
										
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
									}
									else
									{
										alert('Get map error : ' + wycaApi.AnswerCodeToString(data.A));
									}		
									
								});
							}
							else
							{
								alert('Save map error : ' + wycaApi.AnswerCodeToString(data.A));
							}							
						});
					}
									
					
				},
				error: function(e) {
					
					var img = document.getElementById("install_by_step_mapping_img_map_saved_fin");
        			img.src = "assets/images/vide.png";
					
					alert(e.responseText);
				}
			});
		}
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
				wycaApi.NavigationStartFromMapping(function(r) {
					if (!r.success) alert_wyca(r.message);
					$('#install_by_step_mapping_use .install_by_step_mapping_use_next').click();
					
					console.log('TODO : Mettre à jour liste des maps !');
				});
			}
			else
			{
				if (data.M != '')
					alert_wyca(data.M);
				else
					alert_wyca(wycaApi.AnswerCodeToString(data.A));
				
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
				
				// On reload la carte pour mettre à jours les ids
				GetInfosCurrentMap();
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
				alert(e.responseText);
			}
		});
    });
	
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
						alert(e.responseText);
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
		
		if ($('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_password').val() != $('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_cpassword').val())
		{
			alert_wyca('Invalid password or confirm');
		}
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
		}
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
						$('#install_by_step_manager_list_manager_elem_'+id_user+' span.prenom').html(json_user.firstname);
						$('#install_by_step_manager_list_manager_elem_'+id_user+' span.nom').html(json_user.lastname);
					}
					else
					{
						$('#install_by_step_manager .list_managers').append('' +
							'<li id="install_by_step_manager_list_manager_elem_'+id_user+'" data-id_user="'+id_user+'">'+
							'	<span class="societe">'+json_user.company+'</span><br /><span class="prenom">'+json_user.firstname+'</span> <span class="nom">'+json_user.lastname+'</span><br /><span class="email">'+data.D.email+'</span>'+
							'	<a href="#" class="bManagerDeleteElem btn btn-xs btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="bManagerEditElem btn btn-xs btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
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
				alert(e.responseText);
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
	
	$('#install_by_step_service_book .bFinishInstallation').click(function(e) {
        $.ajax({
			type: "POST",
			url: 'ajax/install_by_step_finish.php',
			data: {
			},
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				alert(e.responseText);
			}
		});
		
		$('#pages_install_by_step').removeClass('active');
		$('#pages_install_normal').addClass('active');
		
		
		$('.menu_groupe button').show();
		
    });
});

var currentTestIndex = -1;

function StartAnimCheckComposantInstall()
{
	if ($('#install_by_step_check .test').length > 0)
	{
		$('#install_by_step_check .test').addClass('checked');
		$('#install_by_step_check .test').removeClass('test');
		
		if ($('#install_by_step_check div.is_checkbox:not(".checked")').length > 0)
		{
			$('#install_by_step_check div.is_checkbox:not(".checked")').first().addClass('test');
			setTimeout(StartAnimCheckComposantInstall, Math.floor(Math.random() * 1500 + 500));
		}
		else
		{
			$('#install_by_step_check .install_by_step_check_next').show();
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
			$('.progressStartMapping').hide();
			$('.bMappingStop').show();
			$('.mapping_view').show();
				
			img = document.getElementById("install_by_step_mapping_img_map_saved");
			img.src = "assets/images/vide.png";
			
			if (intervalMap != null)
			{
				clearInterval(intervalMap);
				intervalMap = null;
			}
			//intervalMap = setInterval(GetMap, 1000);
		}, 500);
	}
	else	
	{
		if (timerCreateMapCurrent == 5 && timerCreateMap == 10) // Stop navigation before
		{
			wycaApi.MappingStart(function(r) { 
				mappingStarted = true;
			});
			
			$('.progressStartMapping h3').html(textStartMapping);
		}
		
		valeur = 100-parseInt(timerCreateMapCurrent / timerCreateMap * 100);

		$('.createMapProgress .progress-bar').css('width', valeur+'%').attr('aria-valuenow', valeur); 
	
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
	
	for(var y = 0; y < height; y++)
	{
		for(var x = 0; x < width; x++)
		{
			var pixelData = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
			
			var pos = (y * width + x) * 4; // position in buffer based on x and y
			
			if (pixelData[3] == 0) // Alpha 0
				color = color_unknow;
			else if (pixelData[0] > threshold_free_255)
				color = color_free;
			else if (pixelData[0] < threshold_occupied_255)
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
	
	var canvasDessin = document.getElementById('canvas_result_trinary'),
	ctx = canvasDessin.getContext('2d');
	
	var idata = ctx.createImageData(width, height);
	idata.data.set(buffer);
	ctx.putImageData(idata, 0, 0);
}

