//Javascript document
var form_sended = false; //Boolean pour disable a form "en traitement"
var selectedWifi = '';

var json_user = {};

var timer_anim_check = undefined;

var currentTestIndex = -1;

var finalMapData = '';

var timerCreateMap = 5;
var timerCreateMapCurrent = 5;
var timeoutTimerCreateInterval = null;

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

var battery_lvl_start = 0;
var battery_lvl_needed = 0;
var timerRealTestStart = 0;
var timerRealTestEnd = 0;
var statusRealTestStart = 0;
var statusRealTestEnd = false;

var boolHelpManager=true;

var ByStepBufferMapSaveElemName = '';

$(document).ready(function(e) {
	
	/*
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
	*/
	
	//------------------- STEP SELECT LANGUAGE ------------------------
	
	//AJAX INSTALL STEP CALL
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
					window.location.href = app_url; // equivalent window.location.reload()
			},
			error: function(e) {
				alert_wyca('Error set lang ; ' + e.responseText);
			}
		});
    });
	
	//------------------- STEP SELECT AVAILABLES TOPS ------------------------
	
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
						ParseAPIAnswerError(data);
					}
					
					
				});
			};
			reader.readAsText(file);
		}else{
			//NO FILE UPLOADED AND CLICK ON BTN => SHAKE ICON
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
		InitTopImportByStep();
	});
	
	//AJAX INSTALL STEP CALL
	$('#pages_install_by_step a.save_tops').click(function(e) {
        e.preventDefault();
		
		var listAvailableTops = Array();
		//$('#pages_install_by_step .install_by_step_top li').hide();
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
	
	//------------------- STEP SELECT ACTIVE TOP ------------------------
	
	//AJAX INSTALL STEP CALL
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
	
	//AJAX INSTALL STEP CALL
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
	
	$(document).on('click', '#install_by_step_check div.is_checkbox.checked', function(e) {
		e.preventDefault();
		
		if ($(this).hasClass('component_ok'))
		{
			// On n'affiche rien ; le composant est ok
		}
		else
		{
			// Problème sur le composant, on affiche le détail
			/*
			0: OK
			1: Frequency warning
			2: Frequency error
			3: Software error;
			4: Device error
			5: Not applicable (for cam top)
			*/
			
			text = '';
			switch($(this).attr('id'))
			{
				case 'install_by_step_check_lidar':
					if (save_check_components_result.LI == 0) text = ''; 
					else if (save_check_components_result.LI == 1) text = 'The frequency of feedback of information from the Lidar is abnormal but acceptable.';
					else if (save_check_components_result.LI == 2) text = 'The frequency of feedback of information from the Lidar is abnormal.';
					else if (save_check_components_result.LI == 3) text = 'A software feature of the Lidar encounters an error.';
					else if (save_check_components_result.LI == 4) text = 'Lidar no longer responds.';
					else if (save_check_components_result.LI == 5) text = '';
					break;
				case 'install_by_step_check_us':
					if (save_check_components_result.US == 0) text = ''; 
					else if (save_check_components_result.US == 1) text = 'The frequency of feedback of information from the ultrasonic sensors is abnormal but acceptable.';
					else if (save_check_components_result.US == 2) text = 'The frequency of feedback of information from the ultrasonic sensors is abnormal.';
					else if (save_check_components_result.US == 3) text = 'A software feature of the ultrasonic sensors encounters an error.';
					else if (save_check_components_result.US == 4) text = 'Ultrasonic sensors no longer responds.';
					else if (save_check_components_result.US == 5) text = '';
					break;
				case 'install_by_step_check_motor':
					if (save_check_components_result.M == 0) text = ''; 
					else if (save_check_components_result.M == 1) text = 'The frequency of feedback of information from the motor card is abnormal but acceptable.';
					else if (save_check_components_result.M == 2) text = 'The frequency of feedback of information from the motor card is abnormal.';
					else if (save_check_components_result.M == 3) text = 'A software feature of the motor card encounters an error.';
					else if (save_check_components_result.M == 4) text = 'Motor card no longer responds.';
					else if (save_check_components_result.M == 5) text = '';
					break;
				case 'install_by_step_check_battery':
					if (save_check_components_result.B == 0) text = ''; 
					else if (save_check_components_result.B == 1) text = 'The frequency of feedback of information from the battery is abnormal but acceptable.';
					else if (save_check_components_result.B == 2) text = 'The frequency of feedback of information from the battery is abnormal.';
					else if (save_check_components_result.B == 3) text = 'A software feature of the battery encounters an error.';
					else if (save_check_components_result.B == 4) text = 'Battery no longer responds.';
					else if (save_check_components_result.B == 5) text = '';
					break;
				case 'install_by_step_check_cam3d':
					if (save_check_components_result.CL == 0) text = 'Camera left is OK'; 
					else if (save_check_components_result.CL == 1) text = 'The frequency of feedback of information from the camera left is abnormal but acceptable.';
					else if (save_check_components_result.CL == 2) text = 'The frequency of feedback of information from the camera left is abnormal.';
					else if (save_check_components_result.CL == 3) text = 'A software feature of the camera left encounters an error.';
					else if (save_check_components_result.CL == 4) text = 'Camera left no longer responds.';
					else if (save_check_components_result.CL == 5) text = '';
					
					text += "<br /><br />";
					
					if (save_check_components_result.CR == 0) text += 'Camera right is OK'; 
					else if (save_check_components_result.CR == 1) text += 'The frequency of feedback of information from the camera right is abnormal but acceptable.';
					else if (save_check_components_result.CR == 2) text += 'The frequency of feedback of information from the camera right is abnormal.';
					else if (save_check_components_result.CR == 3) text += 'A software feature of the camera right encounters an error.';
					else if (save_check_components_result.CR == 4) text += 'Camera right no longer responds.';
					else if (save_check_components_result.CR == 5) text += '';
					
					break;
				case 'install_by_step_check_leds':
					if (save_check_components_result.LE == 0) text = ''; 
					else if (save_check_components_result.LE == 1) text = 'The frequency of feedback of information from the leds is abnormal but acceptable.';
					else if (save_check_components_result.LE == 2) text = 'The frequency of feedback of information from the leds is abnormal.';
					else if (save_check_components_result.LE == 3) text = 'A software feature of the leds encounters an error.';
					else if (save_check_components_result.LE == 4) text = 'Leds no longer responds.';
					else if (save_check_components_result.LE == 5) text = '';
					break;
			}
			
			
			if (text != '')
			{
				if ($(this).hasClass('component_warning'))
					warning_wyca(text);
				else
					alert_wyca(text);
			}
		}
	});
	
	//------------------- STEP WIFI ------------------------
	
		
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
		console.log(selectedWifi,$('#install_by_step_wifi_password .i_wifi_passwd_name').val());
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
	
	//AJAX INSTALL STEP CALL
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
	
	//------------------- STEP SITE ------------------------

	//------------------- STEP NEW SITE ------------------------
	
	//AJAX INSTALL STEP CALL
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
				wycaApi.GetSitesList(function(data){
					if (data.A != wycaApi.AnswerCode.NO_ERROR){
						ParseAPIAnswerError(data,'Error in scanning site\'s names');
					}else{
						if(!CheckName(data.D,window.site_name)){
							if (create_new_site) // BOOLEAN INSTALLATEUR_WYCA.JS GESTION DES SITES
							{
									newSite = { "id_site":-1, "comment":"", name:window.site_name };
									wycaApi.SetSite(newSite, function(data){
										if (data.A != wycaApi.AnswerCode.NO_ERROR)
											ParseAPIAnswerError(data,'Error in setting site');
										else
										{
											wycaApi.SetSiteAsCurrent(data.D, function(data) {
												if (data.A != wycaApi.AnswerCode.NO_ERROR) 
													ParseAPIAnswerError(data,'Error in setting current site');
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
	
	//------------------- STEP MAPPING ------------------------
	
	$(".map_dyn").on("load", function() {  InitPosCarteMapping(); });
	
	$('#install_by_step_mapping .bMappingStart').click(function(e) {
		e.preventDefault();
		
		$('#install_by_step_mapping .bMappingBack').hide();
		$('#install_by_step_mapping .bMappingStart').hide();
		$('.ifMappingInit').show();
		$('.ifNMappingInit').hide();
		if (navLaunched)
		{
			wycaApi.NavigationStop(function(data) { if (data.A != wycaApi.AnswerCode.NO_ERROR) ParseAPIAnswerError(data,'Error navigation stop');});
			
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
					if (data.A != wycaApi.AnswerCode.NO_ERROR) { ParseAPIAnswerError(data,'Error mapping start');} 
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
	
	function NextTimerCreateMap(){
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

	$('#install_by_step_mapping .switchLiveMapping input').change(function(e) {
		
		if ($(this).is(':checked') )
		{
			liveMapping = true;
			if (mappingStarted && timerGetMappingInConstruction == null)
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
			if (data.A != wycaApi.AnswerCode.NO_ERROR) ParseAPIAnswerError(data,'Error navigation stop');
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
	
	//AJAX INSTALL STEP CALL
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
						ParseAPIAnswerError(data,'Error in scanning map names');
					}else{
						
						wycaApi.GetMapsList(data.D.id_site,function(data){
							if (data.A != wycaApi.AnswerCode.NO_ERROR){
								ParseAPIAnswerError(data,'Error in scanning map names');
							}else{
								if(CheckName(data.D,window.map_name)){
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
																				
																				if (data.A != wycaApi.AnswerCode.NO_ERROR)
																					ParseAPIAnswerError(data,'Error navigation start');
																				
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
																			ParseAPIAnswerError(data);
																			
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
																	ParseAPIAnswerError(data,'Get map error');
																}		
																
															});
														}
														else
														{
															ParseAPIAnswerError(data,'Save map error');
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
	
	//------------------- STEP IMPORT SITE ------------------------
	
	$('#pages_install_by_step .file_import_site').change(function(){
		//console.log('here');
		$('#pages_install_by_step .filename_import_site').html($(this)[0].files[0].name);
		$('#pages_install_by_step .filename_import_site').show();
		$('#pages_install_by_step .file_import_site_wrapper').css('background-color','#47a4476e');
		
	})
	
	//AJAX INSTALL STEP CALL
	$('#pages_install_by_step a.bImportSiteDo').click(function(e) {
        e.preventDefault();
		file = $('#pages_install_by_step .file_import_site')[0].files[0];
		if(file != undefined){
			
			$('#pages_install_by_step .install_by_step_setup_import_loading').show();
			$('#pages_install_by_step .install_by_step_setup_import_content').hide();
			
			var reader = new FileReader();
			reader.onload = function(event) { 
				wycaApi.ImportSite(btoa(reader.result), function(data) {
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						$('#pages_install_by_step .install_by_step_setup_import_loading').hide();
						$('#pages_install_by_step .install_by_step_setup_import_content').show();
						//success_wyca(textSiteImported);
						console.log(data);
						if(data.D > -1){
							wycaApi.SetSiteAsCurrent(data.D,function(data){
								if (data.A == wycaApi.AnswerCode.NO_ERROR)
								{
									wycaApi.GetCurrentMapData(function(data){
										if (data.A == wycaApi.AnswerCode.NO_ERROR)
										{
											if(data.D.docks.length <= 1){
												$.ajax({
													type: "POST",
													url: 'ajax/install_by_step_import_site_master_dock.php',
													data: { 
													},
													dataType: 'json',
													success: function(data) {
														success_wyca(textSiteImported);
														$('.install_by_step_site_master_dock_next').click();
													},
													error: function(e) {
														alert_wyca('Error step check ; ' + e.responseText);
													}
												});
											}else{
												forbiddens = data.D.forbiddens;
												areas = data.D.areas;
												docks = data.D.docks;
												pois = data.D.pois;
												augmented_poses = data.D.augmented_poses; 
												
												$.ajax({
													type: "POST",
													url: 'ajax/install_by_step_import_site_finish.php',
													data: { 
													},
													dataType: 'json',
													success: function(data) {
														
														InitMasterDockByStep();
														$('.install_by_step_import_site_next').click();
													},
													error: function(e) {
														alert_wyca('Error step check ; ' + e.responseText);
													}
												});
												
											}
										}else{
											ParseAPIAnswerError(data);
											InitSiteImportByStep();
										}
									})
									window.site_id=data.D;
								}else{
									ParseAPIAnswerError(data);
									InitSiteImportByStep();
								}
							})
							
						}else{
							alert_wyca('Error in ID site');
							InitSiteImportByStep();
						}
						
					}
					else
					{
						ParseAPIAnswerError(data);
						InitSiteImportByStep();
						$('#pages_install_by_step .install_by_step_setup_import_loading').hide();
						$('#pages_install_by_step .install_by_step_setup_import_content').show();
					}
				});
			};
			reader.readAsText(file);
		}else{
			let icon = $('#pages_install_by_step .file_import_site_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
    });
	
	//------------------- STEP MASTER DOCK ------------------------
	
	//AJAX INSTALL STEP CALL
	//DECLARATION EVENTLISTENER BOUTON CREE DYNAMIQUEMENT .on('event',function(){})
	$( "#pages_install_by_step #MasterDockList" ).on( 'click', '.MasterDockItem', function(e) {
		let id_master = $(this).attr('id');
		$.each(docks,function(idx,item){
			docks[idx].is_master=false;
			if(item.id_docking_station == id_master){
				docks[idx].is_master=true;
			}
		})
		data = GetDataMapToSave();
		wycaApi.SetCurrentMapData(data, function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$.ajax({
					type: "POST",
					url: 'ajax/install_by_step_import_site_master_dock.php',
					data: { 
					},
					dataType: 'json',
					success: function(data) {
						
						GetInfosCurrentMapByStep(); //MAJ EDIT MAP
						$('.install_by_step_site_master_dock_next').click();
						
					},
					error: function(e) {
						alert_wyca('Error step check ; ' + e.responseText);
					}
				});
			}else{
				ParseAPIAnswerError(data);
				InitSiteImportByStep();
				$('#pages_install_by_step .install_by_step_setup_import_loading').hide();
				$('#pages_install_by_step .install_by_step_setup_import_content').show();
				$('#pages_install_by_step section#install_by_step_site_master_dock .bBackButton').click();
			}
		})		
	})
	
	//------------------- STEP RECOVERY ------------------------
	
	$('#pages_install_by_step #install_by_step_site_recovery .bRecovery').click(function(e) {
        e.preventDefault();
		
		$('#pages_install_by_step #install_by_step_site_recovery .bRecovery').addClass('disabled');
		
		wycaApi.on('onRecoveryFromFiducialResult', function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#pages_install_by_step #install_by_step_site_recovery .bRecovery').removeClass('disabled');
				success_wyca('Recovery done !');
				$('#pages_install_by_step #install_by_step_site_recovery .install_by_step_site_recovery_next').click();

				//AJAX INSTALL STEP CALL
				$.ajax({
					type: "POST",
					url: 'ajax/install_by_step_import_site_recovery.php',
					data: {
					},
					dataType: 'json',
					success: function(data) {
					},
					error: function(e) {
						alert_wyca('Error step site ; ' + e.responseText);
					}
				});
			}
			else
			{
				$('#pages_install_by_step #install_by_step_site_recovery .bRecovery').removeClass('disabled');
				console.log(JSON.stringify(data)); 
				ParseAPIAnswerError(data);
			}
		});
		
		wycaApi.RecoveryFromFiducial(function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
			}
			else
			{
				$('#pages_install_by_step #install_by_step_site_recovery .bRecovery').removeClass('disabled');
				ParseAPIAnswerError(data);
			}
		});
    });
	
	
	
	/*
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
	*/
	
	//------------------- STEP MAPPING CONFIG ------------------------
	
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
	
	$("#install_by_step_mapping_threshold_occupied_slider_elem").slider({ "value": 65, "range": "min", "max": 100 });
	$("#install_by_step_mapping_threshold_occupied_slider_elem").on("slide", function(slideEvt) { $("#install_by_step_mapping_threshold_occupied_output b").text(slideEvt.value); $("#install_by_step_mapping_threshold_occupied_slider").val(slideEvt.value); });
	$("#install_by_step_mapping_threshold_free_slider_elem").slider({ "value": 25, "range": "min", "max": 100 });
	$("#install_by_step_mapping_threshold_free_slider_elem").on("slide", function(slideEvt) { $("#install_by_step_mapping_threshold_free_output b").text(slideEvt.value); $("#install_by_step_mapping_threshold_free_slider").val(slideEvt.value); });

	//------------------- STEP EDIT MAP ------------------------

	$('#install_by_step_edit_map .bSaveEditMap').click(function(e) {
		e.preventDefault();
        
		if (!bystepCanChangeMenu)
		{
			alert_wyca('You must confirm the active element');
			console.log(bystepCurrentAction);
			$('#bCloseAlertWyca').click(ShakeActiveElement());
			return false;
		}
		else
		{
			let actions_searched = ['editPoi','editDock','editAugmentedPose','editForbiddenArea','editArea'];
			if(actions_searched.includes(bystepCurrentAction)){
				switch(bystepCurrentAction){
					case 'editPoi' :
						i = GetPoiIndexFromID(currentPoiByStepLongTouch.data('id_poi'));
						ByStepBufferMapSaveElemName = pois[i].name;
					break;
					case 'editDock' :
						i = GetDockIndexFromID(currentDockByStepLongTouch.data('id_docking_station'));
						ByStepBufferMapSaveElemName = docks[i].name;
					break;
					case 'editAugmentedPose' :
						i = GetAugmentedPoseIndexFromID(currentAugmentedPoseByStepLongTouch.data('id_augmented_pose'));
						ByStepBufferMapSaveElemName = augmented_poses[i].name;
					break;
					case 'editForbiddenArea' :
						i = GetForbiddenIndexFromID(currentForbiddenByStepLongTouch.data('id_area'));
						ByStepBufferMapSaveElemName = forbiddens[i].name;
					break;
					case 'editArea' :
						i = GetAreaIndexFromID(currentAreaByStepLongTouch.data('id_area'));
						ByStepBufferMapSaveElemName = areas[i].name;
					break;
					default: ByStepBufferMapSaveElemName = ''; break;
				}
			}

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
					success_info_wyca('Map saved');

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
					ParseAPIAnswerError(data);
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
					ParseAPIAnswerError(data);
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
					ParseAPIAnswerError(data);
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
					ParseAPIAnswerError(data);
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
					ParseAPIAnswerError(data);
					
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
					ParseAPIAnswerError(data);
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
					ParseAPIAnswerError(data);
					
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToChargeResult', onGoToChargeResult);
				}
			});
			
		}
    });
	
	//AJAX INSTALL STEP CALL
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
	
	//AJAX INSTALL STEP CALL
	$('#install_by_step_edit_map .bNextEditMap').click(function(e) {
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_edit_map_finish.php',
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
	
	//------------------- STEP CONFIGURATION EBL/MBL ------------------------
	
	$('#pages_install_by_step a.real_test').click(function(e) {
        e.preventDefault();
		$('#pages_install_by_step .modalRealTest_loading').show();
		$('#pages_install_by_step .modalRealTest_content').hide();
		$('#pages_install_by_step .modalRealTest').modal('show');
		$('#pages_install_by_step a.bRealTestDo').addClass('disabled');
		wycaApi.GetCurrentMapData(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#pages_install_by_step .modalRealTest_loading').hide();
				$('#pages_install_by_step .modalRealTest_content').show();
				$('#pages_install_by_step select.real_test_start > option').hide();
				$('#pages_install_by_step select.real_test_end > option').hide();
				//ADD POIS
				$.each(data.D.pois,function(i, item){
					$('#pages_install_by_step select.real_test_start').append('<option value="poi_'+item.id_poi+'" data-type="poi" data-id="'+item.id_poi+'" >&#xf3c5 - POI - '+item.name+'</option>' );
					$('#pages_install_by_step select.real_test_end').append('<option value="poi_'+item.id_poi+'" data-type="poi" data-id="'+item.id_poi+'">&#xf3c5 - POI - '+item.name+'</option>' );
				});
				//ADD DOCKS
				$.each(data.D.docks,function(i, item){
					$('#pages_install_by_step select.real_test_start').append('<option value="dock_'+item.id_docking_station+'" data-type="dock" data-id="'+item.id_docking_station+'" >&#xf5e7 - Dock - '+item.name+'</option>' );
					$('#pages_install_by_step select.real_test_end').append('<option value="dock_'+item.id_docking_station+'" data-type="dock" data-id="'+item.id_docking_station+'" >&#xf5e7 - Dock - '+item.name+'</option>' );
				});
				//ADD A POSES
				$.each(data.D.augmented_poses,function(i, item){
					$('#pages_install_by_step select.real_test_start').append('<option value="augmented_pose_'+item.id_docking_station+'" data-type="augmented_pose" data-id="'+item.id_augmented_pose+'" >&#xf02a; - A. pose - '+item.name+'</option>' );
					$('#pages_install_by_step select.real_test_end').append('<option value="augmented_pose_'+item.id_docking_station+'" data-type="augmented_pose" data-id="'+item.id_augmented_pose+'" >&#xf02a; - A. pose - '+item.name+'</option>' );
				});
				
			}
			else
			{
				$('#pages_install_by_step .modalRealTest').modal('hide');
			}
			$('#pages_install_by_step a.bRealTestDo').removeClass('disabled');
		})		
		
	});
	
	/* REAL TEST */
	
	$('#pages_install_by_step a.bRealTestDo').click(function(e) {
        e.preventDefault();
		let start = $('#pages_install_by_step select.real_test_start option:selected');
		let end = $('#pages_install_by_step select.real_test_end option:selected');
		if(start.val()!='' && end.val()!='' && end.val()!=start.val()){
			$('#pages_install_by_step .modalRealTest').modal('hide');
			$('#pages_install_by_step .modalRealTestResult').modal('show');
			
			$("#pages_install_by_step .modalRealTestResult .start_point").hide();
			$("#pages_install_by_step .modalRealTestResult .end_point").hide();
			$("#pages_install_by_step .modalRealTestResult .result_RealTest").hide();
			
			$("#pages_install_by_step .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');			
			$("#pages_install_by_step .modalRealTestResult .start_point_text").html(start.html());
			$("#pages_install_by_step .modalRealTestResult .end_point_text").html(end.html());
			
			RealTestGotoStartByStep(start,end);
		}
	});
	
	$('#pages_install_by_step .modalRealTestResult a.bUseRealTest').click(function(e) {
		e.preventDefault();
		let temp = battery_lvl_needed == 0?1:parseInt(battery_lvl_needed);
		let ebl = temp+5;
		let mbl = 2*temp;
		mbl < ebl ? mbl = ebl + 5:'';
		$('#install_by_step_config_i_level_min_gotocharge').val(ebl)
		$('#install_by_step_config_i_level_min_dotask').val(mbl)
		$('#pages_install_by_step .modalRealTestResult').modal('hide')
    });
	
	$('section#install_by_step_config a.bResetValueEblMbl').click(function(e) {
		
		$('#install_by_step_config_i_level_min_gotocharge').val(15)
		$('#install_by_step_config_i_level_min_dotask').val(20)
    });
	
	//AJAX INSTALL STEP CALL
	$('#install_by_step_config .bConfigurationSave').click(function(e) {
		let EBL = parseInt($('#install_by_step_config_i_level_min_gotocharge').val());
		let MBL = parseInt($('#install_by_step_config_i_level_min_dotask').val());
		EBL = EBL > 100 ? 15 : EBL;
		EBL = EBL < 0 ? 15 : EBL;
		MBL = MBL > 100 ? 20 : MBL;
		MBL = MBL < 0 ? 20 : MBL;
		wycaApi.SetEnergyConfiguration(EBL,MBL, function(data) {
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
				ParseAPIAnswerError(data);
			}
		});
    });
	
	//------------------- STEP MAINTENANCE ACCOUNT ------------------------
	
	//AJAX INSTALL STEP CALL
	$('#install_by_step_maintenance #bDeleteMaintenanceAccount').click(function(e){
		wycaApi.DeleteUserWyca(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$.ajax({
					type: "POST",
					url: 'ajax/install_by_step_maintenance.php',
					data: {
					},
					dataType: 'json',
					success: function(data) {
					},
					error: function(e) {
						alert_wyca('Error step finish ; ' + e.responseText);
					}
				});
				$('#install_by_step_maintenance .install_by_step_maintenance_next').click();
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
	});
		
	$('#install_by_step_maintenance #bKeepMaintenanceAccount').click(function(e){
		$('#install_by_step_maintenance_i_maintenance_password').val('')
		$('#install_by_step_maintenance_i_maintenance_cpassword').val('')
		$('#install_by_step_maintenance .modalMaintenance').modal('show');
		
	});
	
	//AJAX INSTALL STEP CALL
	$('#install_by_step_maintenance #install_by_step_maintenance_bMaintenanceSave').click(function(e){
		let pass = $('#install_by_step_maintenance_i_maintenance_password');
		let cpass = $('#install_by_step_maintenance_i_maintenance_password');
		
		if (pass.val() == '' || cpass.val() == ''){
			alert_wyca(textPasswordRequired);
		}else if(pass.val() != cpass.val()){
			alert_wyca(textPasswordMatching);
		}else if(!pass[0].checkValidity() || !cpass[0].checkValidity()){
			alert_wyca(textPasswordPattern);
		}else{
			wycaApi.ChangePasswordWyca(pass.val(),function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$.ajax({
						type: "POST",
						url: 'ajax/install_by_step_maintenance.php',
						data: {
						},
						dataType: 'json',
						success: function(data) {
						},
						error: function(e) {
							alert_wyca('Error step finish ; ' + e.responseText);
						}
					});
					$('#install_by_step_maintenance .install_by_step_maintenance_next').click();
				}
				else
				{
					ParseAPIAnswerError(data);
				}
			})
		}
	});
	
	//------------------- STEP MANAGERS ------------------------	
	
	$('#install_by_step_manager .bHelpManagerOk').click(function(){boolHelpManager = !$('#install_by_step_manager .checkboxHelpManager').prop('checked')});//ADD SAVING BDD / COOKIES ?
	
	$('#install_by_step_manager .bAddManager').click(function(e) {
	
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_id_manager').val(-1);
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_email').val('').removeClass('success').removeClass('error');
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_societe').val('');
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_prenom').val('');
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_nom').val('');
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_password').val('').removeClass('success').removeClass('error');
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_cpassword').val('').removeClass('success').removeClass('error');
		
		$('#install_by_step_manager .modalManager').modal('show');
	});
	
	$('#install_by_step_manager .modalManager #install_by_step_manager_bManagerSave').click(function(e) {
        e.preventDefault();
		
		let pass = $('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_password');
		let cpass = $('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_cpassword');
		
		if (pass.val() == '' || cpass.val() == ''){
			alert_wyca(textPasswordRequired);
		}else if(pass.val() != cpass.val()){
			alert_wyca(textPasswordMatching);
		}else if(!pass[0].checkValidity() || !cpass[0].checkValidity()){
			alert_wyca(textPasswordPattern);
		}else if (!$('#install_by_step_manager_i_manager_email')[0].checkValidity()){
			alert_wyca(textLoginPattern);
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
				"id_group_user": wycaApi.GroupUser.MANAGER,
			};
			
			wycaApi.SetUser(json_user, function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					// On ajoute le li
					id_user = data.D;
					if ($('#install_by_step_manager_list_manager_elem_'+id_user).length > 0)
					{
						$('#install_by_step_manager_list_manager_elem_'+id_user+' span.email').html(json_user.email);
						/*
						$('#install_by_step_manager_list_manager_elem_'+id_user+' span.societe').html(json_user.company);
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
					RefreshDisplayManagerByStep();
					$('#install_by_step_manager .modalManager').modal('hide');
				}
				else
				{
					ParseAPIAnswerError(data);
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
				RefreshDisplayManagerByStep();
			}
			else
			{
				ParseAPIAnswerError(data);
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
		
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_email').removeClass('success').removeClass('error');
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_password').removeClass('success').removeClass('error');
		$('#install_by_step_manager .modalManager #install_by_step_manager_i_manager_cpassword').removeClass('success').removeClass('error');
		
		$('#install_by_step_manager .modalManager').modal('show');
	});
	
	$('#install_by_step_manager input#install_by_step_manager_i_manager_email').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#install_by_step_manager input#install_by_step_manager_i_manager_password').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#install_by_step_manager input#install_by_step_manager_i_manager_cpassword').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
		if($('#install_by_step_manager input#install_by_step_manager_i_manager_password').val() != ''){
			if($(this).val() == $('#install_by_step_manager input#install_by_step_manager_i_manager_password').val())
				$(this).removeClass('error').addClass('success');
			else
				$(this).removeClass('success').addClass('error');
		}
	})
	
	//AJAX INSTALL STEP CALL
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
	
	//------------------- STEP SERVICE BOOK ------------------------	
	
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
					let d = new Date(Date.now());
					let d_txt="";
					switch(lang){
						case 'fr': d_txt = d.getDate() + '/' + (d.getMonth()+1) + '/' +  d.getFullYear() ; break;
						case 'en': d_txt = (d.getMonth()+1) + '/' + d.getDate() + '/' +  d.getFullYear() ; break;
						default: break;
					}
					// On ajoute le li
					$('#install_by_step_service_book .list_service_books').append('' +
						'<li>'+
						'	<div class="date">'+d_txt+'</div>'+
						'	<div class="title">'+json_service_book.title+'</div>'+
						'	<div class="comment">'+json_service_book.comment+'</div>'+
						'</li>'
						);

					$('#install_by_step_service_book .modalServiceBook').modal('hide');
				}
				else
				{
					ParseAPIAnswerError(data);
				}
			});
		}
    });
	
    //AJAX INSTALL STEP CALL
	$('#install_by_step_end .bCloseInstallation').click(function(e) {
		if(create_new_site){
			create_new_site = false;
			setCookie('create_new_site',create_new_site);
		}
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
		
		//AFFICHER QQ CHOSE
		$('#install_normal_edit_map .bBackButton').click();
		
		if ($('#install_normal_setup_sites').is(':visible'))
		{
			GetSitesNormal();
		}
		
		
		$('.menu_groupe button').show();
		
    });
	
	
});

//------------------- STEP AUTO DIAG ------------------------
	
function StartAnimCheckComposantInstall()
{
	timer_anim_check = undefined;
	if ($('#install_by_step_check .test').length > 0)
	{
		$('#install_by_step_check .test').addClass('checked');
		$('#install_by_step_check .test').removeClass('test');
		let lg = $('#install_by_step_check div.is_checkbox:not(".checked")').length;
		if ( lg > 0)
		{
			let rd = Math.floor(Math.random() * Math.floor(lg));
			$('#install_by_step_check div.is_checkbox:not(".checked")').eq(rd).addClass('test');
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

//------------------- STEP CONFIGURATION EBL/MBL ------------------------
	
/* FONCTION PROGRESS BAR REAL TEST */	/* REAL TEST */
	
function TimerRealTestByStep(step){
	if(step=='start'){			
		if(statusRealTestStart > 0){
			if(statusRealTestStart == 2 && timerRealTestStart==100){
				statusRealTestStart=0;
				timerRealTestStart=0;
				$('#install_by_step_config .modalRealTestResult .checkStart').show('fast');
			}else{
				$('#install_by_step_config .modalRealTestResult .checkStart').hide();
				delay = statusRealTestStart == 2 ? 1 : 200;
				timerRealTestStart++;
				if(timerRealTestStart == 101)timerRealTestStart=0;
				$('#install_by_step_config .startRealTestprogress .progress-bar').css('width', timerRealTestStart+'%').attr('aria-valuenow', timerRealTestStart); 
				setTimeout(TimerRealTestByStep,delay,step);
			}
		}
	}else if(step=='end'){			
		if(statusRealTestEnd > 0){
			if(statusRealTestEnd == 2 && timerRealTestEnd==100){
				$('#install_by_step_config .modalRealTestResult .stop_move').css('opacity',1);
				statusRealTestEnd=0;
				timerRealTestEnd=0;
				$('#install_by_step_config .modalRealTestResult .checkEnd').show('fast');
			}else{
				$('#install_by_step_config .modalRealTestResult .checkEnd').hide();
				delay = statusRealTestEnd == 2 ? 1 : 200;
				timerRealTestEnd++;
				if(timerRealTestEnd == 101)timerRealTestEnd=0;
				$('#install_by_step_config .endRealTestprogress .progress-bar').css('width', timerRealTestEnd+'%').attr('aria-valuenow', timerRealTestEnd); 
				setTimeout(TimerRealTestByStep,delay,step);
			}
		}
	}
}

function RealTestGotoStartByStep(start,end){
	
	//console.log('Go to start');
	//console.log(start.data('type'),' id ',start.data('id'));
	
	switch(start.data('type')){
		case 'poi':
			//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
			wycaApi.on('onGoToPoiResult', function (data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					battery_lvl_start = battery_lvl_current; // STOCKAGE BATTERY LVL
					// GO TO END
					RealTestGotoEndByStep(end);
				}else{
					$('#pages_install_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				if(end.data('type')!='poi') // On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoiResult', onGoToPoiResult);
			});
			
			id = start.data('id');
			wycaApi.GoToPoi(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_install_by_step .modalRealTestResult .start_point").show();
					
					$("#pages_install_by_step .modalRealTestResult .btn[data-dismiss='modal']").addClass('disabled');
					
					statusRealTestStart = 1;
					timerRealTestStart = 0;
					TimerRealTestByStep('start');
					$('#install_by_step_config .modalRealTestResult .start_point .stop_move').css('opacity',1);
				}else{
					$('#pages_install_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
			})
		break;
		case 'dock':
			//AJOUTER ECOUTER RESULT + REBIND OLD FUNCTION FIN ECOUTEUR
			wycaApi.on('onGoToChargeResult', function (data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					battery_lvl_start = battery_lvl_current; // STOCKAGE BATTERY LVL
					// GO TO END
					RealTestGotoEndByStep(end);
				}else{
					$('#pages_install_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				if(end.data('type')!='dock') // On rebranche l'ancienne fonction
					wycaApi.on('onGoToChargeResult', onGoToChargeResult);
			});
			
			id = start.data('id');
			
			wycaApi.GoToCharge(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_install_by_step .modalRealTestResult .start_point").show();
					$("#pages_install_by_step .modalRealTestResult .btn[data-dismiss='modal']").addClass('disabled');
					statusRealTestStart = 1;
					timerRealTestStart = 0;
					TimerRealTestByStep('start');
					$('#install_by_step_config .modalRealTestResult .start_point .stop_move').css('opacity',1);
				}else{
					$('#pages_install_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
			})
		break;
		case 'augmented_pose':
			//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
			wycaApi.on('onGoToAugmentedPoseResult', function (data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					battery_lvl_start = battery_lvl_current; // STOCKAGE BATTERY LVL
					// GO TO END
					RealTestGotoEndByStep(end);
				}else{
					$('#pages_install_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				if(end.data('type')!='augmented_pose') // On rebranche l'ancienne fonction
					wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
			});
			
			id = start.data('id');
			
			wycaApi.GoToAugmentedPose(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_install_by_step .modalRealTestResult .start_point").show();
					$("#pages_install_by_step .modalRealTestResult .btn[data-dismiss='modal']").addClass('disabled');
					statusRealTestStart = 1;
					timerRealTestStart = 0;
					TimerRealTestByStep('start');
					$('#install_by_step_config .modalRealTestResult .start_point .stop_move').css('opacity',1);
				}else{
					$('#pages_install_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}						
			})
		break;
	}
	
}

function RealTestGotoEndByStep(end){
	//console.log('Go to end');
	//console.log(end.data('type'),' id ',end.data('id'));
	$('#install_by_step_config .modalRealTestResult .start_point .stop_move').css('opacity',0);
	statusRealTestStart = 2;
	statusRealTestEnd = 1;
	timerRealTestEnd = 0;
	TimerRealTestByStep('end');						
	switch(end.data('type')){
		case 'poi':
			//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
			wycaApi.on('onGoToPoiResult', function (data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					statusRealTestEnd = 2;
					battery_lvl_needed = battery_lvl_start - battery_lvl_current; // STOCKAGE BATTERY LVL NEEDED
					textDisplay = battery_lvl_needed == 0 ? textLessThanOne : battery_lvl_needed;
					$('#pages_install_by_step .modalRealTestResult .battery_used').html(textDisplay);
					$("#pages_install_by_step .modalRealTestResult .result_RealTest").show();
				}else{
					$('#pages_install_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				$("#pages_install_by_step .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');
					
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToPoiResult', onGoToPoiResult);
			});
			
			id = end.data('id');
			
			wycaApi.GoToPoi(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_install_by_step .modalRealTestResult .end_point").show()
				}else{
					$('#pages_install_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
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
					$('#pages_install_by_step .modalRealTestResult .battery_used').html(textDisplay);
					$("#pages_install_by_step .modalRealTestResult .result_RealTest").show();
				}else{
					$('#pages_install_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				$("#pages_install_by_step .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToChargeResult', onGoToChargeResult);
			});
			
			id = end.data('id');
			
			wycaApi.GoToCharge(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_install_by_step .modalRealTestResult .end_point").show()
				}else{
					$('#pages_install_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
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
					$('#pages_install_by_step .modalRealTestResult .battery_used').html(textDisplay);
					$("#pages_install_by_step .modalRealTestResult .result_RealTest").show();
				}else{
					$('#pages_install_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				$("#pages_install_by_step .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
			});
			
			id = end.data('id');
			
			wycaApi.GoToAugmentedPose(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_install_by_step .modalRealTestResult .end_point").show()
				}else{
					$('#pages_install_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}						
			})
		break;
	}
	// LAUNCH PROGRESS BAR ANIM
}		

//------------------- STEP MANAGERS ------------------------	

function RefreshDisplayManagerByStep(){
	if($('#install_by_step_manager ul.list_managers li').length > 0){
		//HIDE TUILE et AFF NEXT
		$('#install_by_step_manager a.bAddManager').show();
		$('#install_by_step_manager .bValidManagerNext').show();
		
		$('#install_by_step_manager .bValidManagerSkip').hide();
		$('#install_by_step_manager .bAddManagerTuile').hide();
	}else{
		//AFF TUILE ET SKIP
		$('#install_by_step_manager a.bAddManager').hide();
		$('#install_by_step_manager .bValidManagerNext').hide();
		
		$('#install_by_step_manager .bValidManagerSkip').show();
		$('#install_by_step_manager .bAddManagerTuile').show();
	}
	
}


//------------------- STEP MAPPING CONFIG ------------------------	

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