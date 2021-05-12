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

var WycaByStepBufferMapSaveElemName = '';

$(document).ready(function(e) {
	
	/*
	$('#pages_wyca_by_step a.save_date').click(function(e) {
        e.preventDefault();
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_save_date.php',
			data: { },
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				alert_wyca('Error save date ; ' + ' ' + e.responseText);
			}
		});
    });
	*/
	
	//------------------- STEP SELECT LANGUAGE ------------------------
	
	//AJAX INSTALL STEP CALL
	$('#pages_wyca_by_step a.select_langue').click(function(e) {
		resetCookies();
		create_new_site = false;
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
				if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
					console.log((typeof(textErrorLang) != 'undefined'? textErrorLang : 'Error lang') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
					$('#modalErrorSession').modal('show');
				}else{
					console.log((typeof(textErrorLang) != 'undefined'? textErrorLang : 'Error lang') + ' ' + e.responseText );
				}
			}
		});
    });
	
	//------------------- STEP SELECT AVAILABLES TOPS ------------------------
	
	$('#pages_wyca_by_step a.import_top').click(function(e) {
        e.preventDefault();
		
		$('#pages_wyca_by_step .modalImportTop_loading').hide();
		$('#pages_wyca_by_step .modalImportTop_content').show();
		
		$('#pages_wyca_by_step .modalImportTop').modal('show');
		InitTopImportWycaByStep();
	});
	
	$('#pages_wyca_by_step .file_import_top').change(function(){
		
		let fname = $(this)[0].files[0].name;console.log(fname);
		if(fname.slice(fname.length - 5) == '.wyca'){
			$('#pages_wyca_by_step .file_import_top_wrapper').css('background-color','#47a4476e');
		}else{
			$('#pages_wyca_by_step .file_import_top_wrapper').css('background-color','#e611116e');
			let icon = $('#pages_wyca_by_step .file_import_top_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
		$('#pages_wyca_by_step .filename_import_top').html(fname);
		$('#pages_wyca_by_step .filename_import_top').show();
	})
	
	$('#pages_wyca_by_step a.bImportTopDo').click(function(e) {
        e.preventDefault();
		file = $('#pages_wyca_by_step .file_import_top')[0].files[0];
		if(file != undefined && file.name.slice(file.name.length - 5) == '.wyca'){
			$('#pages_wyca_by_step .modalImportTop_loading').show();
			$('#pages_wyca_by_step .modalImportTop_content').hide();
			var reader = new FileReader();
			reader.onload = function(event) { 
				wycaApi.InstallNewTopWithoutKey(btoa(reader.result), function(data) { 
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						
						$('#pages_wyca_by_step .modalImportTop_loading').hide();
						$('#pages_wyca_by_step .modalImportTop_content').show();
						
						$('#pages_wyca_by_step .modalImportTop').modal('hide');
						InitTopsWycaByStep();
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
			let icon = $('#pages_wyca_by_step .file_import_top_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
    });
	
	//AJAX INSTALL STEP CALL
	$('#pages_wyca_by_step a.save_tops').click(function(e) {
        e.preventDefault();
		
		listAvailableTops = Array();
		//$('#pages_wyca_by_step .wyca_by_step_top li').hide();
		$(this).parent().parent().find('.is_checkbox.checked').each(function(index, element) {
            listAvailableTops.push($(this).data('id_top'));
			$('#pages_wyca_by_step .wyca_by_step_top .bTop'+$(this).data('id_top')).show();
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
						if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
							console.log((typeof(textErrorSaveTops) != 'undefined'? textErrorSaveTops : 'Error save tops') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
							$('#modalErrorSession').modal('show');
						}else{
							console.log((typeof(textErrorSaveTops) != 'undefined'? textErrorSaveTops : 'Error save tops') + ' ' + e.responseText );
						}
					}
				});
				
				if (listAvailableTops.length == 1)
				{
					wycaApi.SetActiveTop(listAvailableTops[0], function(data){
						$('#pages_wyca_by_step a.save_tops_next_check').click();
					});
				}
				else
					$('#pages_wyca_by_step a.save_tops_next_select').click();
			});
		}
    });
	
	//------------------- STEP SELECT ACTIVE TOP ------------------------
	
	//AJAX INSTALL STEP CALL
	$( '#pages_wyca_by_step' ).on( 'click', 'a.set_top', function(e) {
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
				if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
					console.log((typeof(textErrorSaveTop) != 'undefined'? textErrorSaveTop : 'Error save top') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
					$('#modalErrorSession').modal('show');
				}else{
					console.log((typeof(textErrorSaveTop) != 'undefined'? textErrorSaveTop : 'Error save top') + ' ' + e.responseText );
				}
			}
		});
		
		
    });
	
	//AJAX INSTALL STEP CALL
	$('#pages_wyca_by_step a.wyca_by_step_check_next').click(function(e) {
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
				if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
					console.log((typeof(textErrorCheck) != 'undefined'? textErrorCheck : 'Error check components') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
					$('#modalErrorSession').modal('show');
				}else{
					console.log((typeof(textErrorCheck) != 'undefined'? textErrorCheck : 'Error check components') + ' ' + e.responseText );
				}
			}
		});
    });
	
	$(document).on('click', '#wyca_by_step_check div.is_checkbox.checked', function(e) {
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
				case 'wyca_by_step_check_lidar':
					if (save_check_components_result.LI == 0) text = ''; 
					else if (save_check_components_result.LI == 1) text = 'The frequency of feedback of information from the Lidar is abnormal but acceptable.';
					else if (save_check_components_result.LI == 2) text = 'The frequency of feedback of information from the Lidar is abnormal.';
					else if (save_check_components_result.LI == 3) text = 'A software feature of the Lidar encounters an error.';
					else if (save_check_components_result.LI == 4) text = 'Lidar no longer responds.';
					else if (save_check_components_result.LI == 5) text = '';
					break;
				case 'wyca_by_step_check_us':
					if (save_check_components_result.US == 0) text = ''; 
					else if (save_check_components_result.US == 1) text = 'The frequency of feedback of information from the ultrasonic sensors is abnormal but acceptable.';
					else if (save_check_components_result.US == 2) text = 'The frequency of feedback of information from the ultrasonic sensors is abnormal.';
					else if (save_check_components_result.US == 3) text = 'A software feature of the ultrasonic sensors encounters an error.';
					else if (save_check_components_result.US == 4) text = 'Ultrasonic sensors no longer responds.';
					else if (save_check_components_result.US == 5) text = '';
					break;
				case 'wyca_by_step_check_motor':
					if (save_check_components_result.M == 0) text = ''; 
					else if (save_check_components_result.M == 1) text = 'The frequency of feedback of information from the motor card is abnormal but acceptable.';
					else if (save_check_components_result.M == 2) text = 'The frequency of feedback of information from the motor card is abnormal.';
					else if (save_check_components_result.M == 3) text = 'A software feature of the motor card encounters an error.';
					else if (save_check_components_result.M == 4) text = 'Motor card no longer responds.';
					else if (save_check_components_result.M == 5) text = '';
					break;
				case 'wyca_by_step_check_battery':
					if (save_check_components_result.B == 0) text = ''; 
					else if (save_check_components_result.B == 1) text = 'The frequency of feedback of information from the battery is abnormal but acceptable.';
					else if (save_check_components_result.B == 2) text = 'The frequency of feedback of information from the battery is abnormal.';
					else if (save_check_components_result.B == 3) text = 'A software feature of the battery encounters an error.';
					else if (save_check_components_result.B == 4) text = 'Battery no longer responds.';
					else if (save_check_components_result.B == 5) text = '';
					break;
				case 'wyca_by_step_check_cam3d':
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
				case 'wyca_by_step_check_leds':
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
	
	$('#wyca_by_step_wifi .refresh_wifi').click(function(e) {
		e.preventDefault();		
	});
	
	$( '#wyca_by_step_wifi tbody' ).on( 'click', 'tr', function(e) {
		e.preventDefault();
		selectedWifi = $(this).data('ssid');
		
		$('#wyca_by_step_wifi_password .wifi_connexion_error').html('');
		$('#wyca_by_step_wifi_password .wyca_by_step_wifi_password_save').show();
		$('#wyca_by_step_wifi_password .wifi_connexion_progress').hide();

		$('#wyca_by_step_wifi .set_passwd_wifi').click();
	});
	
	$('#wyca_by_step_wifi_password .wyca_by_step_wifi_password_save').click(function(e) {
        e.preventDefault();
		
		$('#wyca_by_step_wifi_password .wyca_by_step_wifi_password_save').hide();
		$('#wyca_by_step_wifi_password .wifi_connexion_progress').show();
		$('#wyca_by_step_wifi_password .wifi_connexion_error').html('');
		console.log(selectedWifi,$('#wyca_by_step_wifi_password .i_wifi_passwd_name').val());
		wycaApi.WifiConnection(selectedWifi, $('#wyca_by_step_wifi_password .i_wifi_passwd_name').val(), function(data){
			
			if (data.A != wycaApi.AnswerCode.NO_ERROR)
			{
				$('#wyca_by_step_wifi_password .wifi_connexion_error').html(data.M);
			}
			else
			{
				$('#wyca_by_step_wifi_password .skip_wifi').click();
				$('#wyca_by_step_wifi_password .wifi_connexion_error').html('');
			}

			$('#wyca_by_step_wifi_password .wyca_by_step_wifi_password_save').show();
			$('#wyca_by_step_wifi_password .wifi_connexion_progress').hide();
		});
    });
	
	//AJAX INSTALL STEP CALL

	$('#pages_wyca_by_step a.skip_wifi').click(function(e) {
        e.preventDefault();
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_skip_wifi.php',
			data: { },
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
					console.log((typeof(textErrorSkipWifi) != 'undefined'? textErrorSkipWifi : 'Error skip wifi') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
					$('#modalErrorSession').modal('show');
				}else{
					console.log((typeof(textErrorSkipWifi) != 'undefined'? textErrorSkipWifi : 'Error skip wifi') + ' ' + e.responseText );
				}
			}
		});
    });
	
	//------------------- STEP SOUND ------------------------
	$('#wyca_by_step_sound .sound_switch_ROS').change(function(){
		if(!$(this).prop('checked')){
			$('#wyca_by_step_sound .sound_switch_app').parent().find('.ios-switch').removeClass('on').addClass('off').addClass('disabled');
			$('#wyca_by_step_sound .sound_switch_app').prop('checked',false);
		}else{
			$('#wyca_by_step_sound .sound_switch_app').parent().find('.ios-switch').removeClass('disabled');
		}
	});
	
	$('#wyca_by_step_sound .bNextSound').click(function(e) {
		//SOUND
		if($('#wyca_by_step_sound .sound_switch_ROS').prop('checked')){
			//SOUND ON
			wycaApi.SetSoundIsOn(true,function(data){})
			
		}else{
			//SOUND OFF
			wycaApi.SetSoundIsOn(false,function(data){})
			
		}
		
		//APP SOUND
		if($('#wyca_by_step_sound .sound_switch_app').prop('checked')){
			//APP SOUND ON
			$.ajax({
				type: "POST",
				url: 'ajax/app_sound_on.php',
				data: { },
				dataType: 'json',
				success: function(data) {
					wycaApi.options.sound_is_on = true;
					app_sound_is_on = true;
				},
				error: function(e) {
					if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
						console.log((typeof(textErrorSaveSound) != 'undefined'? textErrorSaveSound : 'Error save sound config') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
						$('#modalErrorSession').modal('show');
					}else{
						console.log((typeof(textErrorSaveSound) != 'undefined'? textErrorSaveSound : 'Error save sound config') + ' ' + e.responseText );
					}
				}
			});
		}else{
			//APP SOUND OFF
			$.ajax({
				type: "POST",
				url: 'ajax/app_sound_off.php',
				data: { },
				dataType: 'json',
				success: function(data) {
					wycaApi.options.sound_is_on = false;
					app_sound_is_on = false;
				},
				error: function(e) {
					if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
						console.log((typeof(textErrorSaveSound) != 'undefined'? textErrorSaveSound : 'Error save sound config') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
						$('#modalErrorSession').modal('show');
					}else{
						console.log((typeof(textErrorSaveSound) != 'undefined'? textErrorSaveSound : 'Error save sound config') + ' ' + e.responseText );
					}
				}
			});
			
		}
		RefreshGlobalVehiculePersistanteDataStorage();
		//AJAX INSTALL STEP CALL
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_sound.php',
			data: { },
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
					console.log((typeof(textErrorSound) != 'undefined'? textErrorSound : 'Error sound' ) + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
					$('#modalErrorSession').modal('show');
				}else{
					console.log((typeof(textErrorSound) != 'undefined'? textErrorSound : 'Error sound ') + ' ' + e.responseText );
				}
			}
		});
	});
	
	
	//------------------- STEP SITE ------------------------

	//------------------- STEP NEW SITE ------------------------
	
	//AJAX INSTALL STEP CALL
	$('#pages_wyca_by_step form.form_site').submit(function(e) {
        e.preventDefault();
		window.site_name = $('#pages_wyca_by_step .i_site_name').val();
		if (window.site_name == '')
		{
			alert_wyca(textIndicateAName);
		}
		else
		{
			if(!form_sended){
				let site_names = Array();
				form_sended = true ;
				$('.wyca_by_step_site_save').addClass('disabled');
				wycaApi.GetSitesList(function(data){
					if (data.A != wycaApi.AnswerCode.NO_ERROR){
						ParseAPIAnswerError(data,textErrorGetSites);
					}else{
						if(!CheckName(data.D,window.site_name)){
							if (create_new_site) // BOOLEAN INSTALLATEUR_WYCA.JS GESTION DES SITES
							{
									newSite = { "id_site":-1, "comment":"", name:window.site_name };
									wycaApi.SetSite(newSite, function(data){
										if (data.A != wycaApi.AnswerCode.NO_ERROR)
											ParseAPIAnswerError(data,textErrorSetSite);
										else
										{
											wycaApi.SetSiteAsCurrent(data.D, function(data) {
												if (data.A != wycaApi.AnswerCode.NO_ERROR) 
													ParseAPIAnswerError(data,textErrorSetSite);
												else
												{
													//REFRESH FORM SUBMIT
													setTimeout(function(){form_sended = false},1000);
													$('.wyca_by_step_site_save').removeClass('disabled');
													
													$.ajax({
														type: "POST",
														url: 'ajax/install_by_step_site.php',
														data: {
														},
														dataType: 'json',
														success: function(data) {
														},
														error: function(e) {
															if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
																console.log((typeof(textErrorSaveSite) != 'undefined'? textErrorSaveSite : 'Error save site') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
																$('#modalErrorSession').modal('show');
															}else{
																console.log((typeof(textErrorSaveSite) != 'undefined'? textErrorSaveSite : 'Error save site') + ' ' + e.responseText );
															}
														}
													});
													$('#pages_wyca_by_step a.wyca_by_step_site_next').click();
												}
											});
										}
									});
								
							}
							else
							{
								wycaApi.GetCurrentSite(function(data) {
									data.D.name = $('#pages_wyca_by_step .i_site_name').val();
									wycaApi.SetSite(data.D, function(data){
										//REFRESH FORM SUBMIT
										setTimeout(function(){form_sended = false},1000);
										$('.wyca_by_step_site_save').removeClass('disabled');
										$.ajax({
											type: "POST",
											url: 'ajax/install_by_step_site.php',
											data: {
											},
											dataType: 'json',
											success: function(data) {
											},
											error: function(e) {
												if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
													console.log((typeof(textErrorSaveSite) != 'undefined'? textErrorSaveSite : 'Error save site') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
													$('#modalErrorSession').modal('show');
												}else{
													console.log((typeof(textErrorSaveSite) != 'undefined'? textErrorSaveSite : 'Error save site') + ' ' + e.responseText);
												}
												
											}
										});
										$('#pages_wyca_by_step a.wyca_by_step_site_next').click();
									});
								});
							}
						}else{
							alert_wyca(textNameUsed);
							//REFRESH FORM SUBMIT
							setTimeout(function(){form_sended = false},1000);
							$('.wyca_by_step_site_save').removeClass('disabled');
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
	
	$('#wyca_by_step_mapping .bMappingStart').click(function(e) {
		e.preventDefault();
		$('#wyca_by_step_mapping .joystickDiv').hide();
		$('#wyca_by_step_mapping .bMappingBack').hide();
		$('#wyca_by_step_mapping .bMappingStart').hide();
		$('.ifMappingInit').show();
		$('.ifNMappingInit').hide();
		if (navLaunched)
		{
			wycaApi.NavigationStop(function(data) { if (data.A != wycaApi.AnswerCode.NO_ERROR) ParseAPIAnswerError(data,textErrorStopNavigation);});
			
			$('#wyca_by_step_mapping .progressStartMapping h3').html(textStopNavigation);
			timerCreateMap = 10;
			timerCreateMapCurrent = 10;
			$('#wyca_by_step_mapping .progressStartMapping').show();
			NextTimerCreateMap();
		}
		else
		{
			if (!mappingLaunched)
			{
				wycaApi.MappingStart(function(data) {
					if (data.A != wycaApi.AnswerCode.NO_ERROR) { ParseAPIAnswerError(data,textErrorStartMapping);} 
					mappingStarted = true;
				});
				
				$('#wyca_by_step_mapping .progressStartMapping h3').html(textStartMapping);
				timerCreateMap = 5;
				timerCreateMapCurrent = 5;
				$('#wyca_by_step_mapping .progressStartMapping').show();
				NextTimerCreateMap();
			}
			else
			{
				$('#wyca_by_step_mapping .progressStartMapping').hide();
				$('#wyca_by_step_mapping .switchLiveMapping').show();
				$('#wyca_by_step_mapping .bMappingStop').show();
				$('#wyca_by_step_mapping .bMappingDone').show();
				$('.ifMapping').show();
				$('#wyca_by_step_mapping .mapping_view').show();
					
				img = document.getElementById("wyca_by_step_mapping_img_map_saved");
				img.src = "assets/images/vide.png";
				
				if (intervalMap != null)
				{
					clearInterval(intervalMap);
					intervalMap = null;
				}
				$('#wyca_by_step_mapping .joystickDiv').show();
				GetMappingInConstruction();
			}
		}
	});
	
	function NextTimerCreateMap(){
		if (timerCreateMapCurrent < 0)
		{
			setTimeout(function() {
				$('#wyca_by_step_mapping .progressStartMapping').hide();
				$('#wyca_by_step_mapping .switchLiveMapping').show();
				$('#wyca_by_step_mapping .bMappingStop').show();
				$('#wyca_by_step_mapping .bMappingDone').show();
				$('#wyca_by_step_mapping .mapping_view').show();
				img = document.getElementById("wyca_by_step_mapping_img_map_saved");
				img.src = "assets/images/vide.png";
				
				if (intervalMap != null)
				{
					clearInterval(intervalMap);
					intervalMap = null;
				}
				//intervalMap = setInterval(GetMap, 1000);
				$('#wyca_by_step_mapping .joystickDiv').show();
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
				
				$('#wyca_by_step_mapping .progressStartMapping h3').html(textStartMapping);
			}
			
			valeur = 100-parseInt(timerCreateMapCurrent / timerCreateMap * 100);

			$('#wyca_by_step_mapping .createMapProgress .progress-bar').css('width', valeur+'%').attr('aria-valuenow', valeur); 
		
			timerCreateMapCurrent -= 0.1;	
			timerCreateMapCurrent = parseInt(timerCreateMapCurrent*10)/10;
			
			setTimeout(NextTimerCreateMap, 100);
		}
	}

	$('#wyca_by_step_mapping .switchLiveMapping input').change(function(e) {
		
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
	
	$('#wyca_by_step_mapping .bMappingDone').click(function(e) {
		e.preventDefault();
		$('#wyca_by_step_mapping_modalConfirm').modal('show');
	});
	
	$('#wyca_by_step_mapping .bMappingStop').click(function(e) {
		e.preventDefault();
		
		var canvasDessin = document.getElementById('wyca_by_step_mapping_canvas_result_trinary'),
		ctx = canvasDessin.getContext('2d');
		ctx.clearRect(0, 0, canvasDessin.width, canvasDessin.height);
		
		$('#wyca_by_step_mapping_fin .loading_fin_create_map').show();
		$('#wyca_by_step_mapping_fin .bMappingSaveMap ').addClass('disabled');
		img = document.getElementById("wyca_by_step_mapping_img_map_saved_fin");
        img.src = 'assets/images/vide.png';
		
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_fin_mapping.php',
			data: {},
			dataType: 'json',
			success: function(data) {
				wycaApi.MappingStop(function(data) {
					if (data.A != wycaApi.AnswerCode.NO_ERROR) ParseAPIAnswerError(data,textErrorStopNavigation);
					
					var img = document.getElementById("wyca_by_step_mapping_img_map_saved_fin");
					img.src = 'data:image/png;base64,' + data.D;
					
					finalMapData = 'data:image/png;base64,' + data.D;
					
					setTimeout(function() {
						canvas = document.createElement('canvas');
						
						width = img.naturalWidth;
						height = img.naturalHeight;
						
						$('#wyca_by_step_mapping_canvas_result_trinary').attr('width', img.naturalWidth);
						$('#wyca_by_step_mapping_canvas_result_trinary').attr('height', img.naturalHeight);
						
						canvas.width = img.naturalWidth;
						canvas.height = img.naturalHeight;
						canvas.getContext('2d').drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
						
						CalculateMapTrinary();
					}, 100);
				});
			},
			error: function(e) {
			}
		});
		
		mappingStarted = false;
		$('#wyca_by_step_mapping .switchLiveMapping').hide();
		$('#wyca_by_step_mapping .bMappingStop').hide();
		$('#wyca_by_step_mapping .bMappingDone').hide();
		$('#wyca_by_step_mapping .mapping_view').hide();
		$('#wyca_by_step_mapping .bMappingStart').show();
		
		$('#wyca_by_step_mapping_fin .bMappingCancelMap2').show();
		$('#wyca_by_step_mapping_fin .bMappingSaveMap').show();
		
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
	$('#wyca_by_step_mapping_fin .bMappingSaveMap').click(function(e) {
		window.map_name = $('#wyca_by_step_mapping_from_name').val();
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
						ParseAPIAnswerError(data,textErrorGetSite);
					}else{
						
						wycaApi.GetMapsList(data.D.id_site,function(data){
							if (data.A != wycaApi.AnswerCode.NO_ERROR){
								ParseAPIAnswerError(data,textErrorGetMaps);
							}else{
								if(CheckName(data.D,window.map_name)){
									alert_wyca(textNameUsed);
									setTimeout(function(){form_sended = false},1000);
									$('.bMappingSaveMap').removeClass('disabled');
								}else{
																
										//
										var canvasDessin = document.getElementById('wyca_by_step_mapping_canvas_result_trinary');
									
										$('#wyca_by_step_mapping_fin .bMappingCancelMap2').hide();
										$('#wyca_by_step_mapping_fin .bMappingSaveMap').hide();
									
										$('#wyca_by_step_mapping_from_image').val(finalMapData);
										$('#wyca_by_step_mapping_from_image_tri').val(canvasDessin.toDataURL());
										$('#wyca_by_step_mapping_from_ros_largeur').val($('#wyca_by_step_mapping_img_map_saved_fin').prop('naturalWidth'));
										$('#wyca_by_step_mapping_from_ros_hauteur').val($('#wyca_by_step_mapping_img_map_saved_fin').prop('naturalHeight'));
										$('#wyca_by_step_mapping_from_threshold_free').val($('#wyca_by_step_mapping_threshold_free_slider').val());
										$('#wyca_by_step_mapping_from_threshold_occupied').val($('#wyca_by_step_mapping_threshold_occupied_slider').val());
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
														'ros_width': $('#wyca_by_step_mapping_img_map_saved_fin').prop('naturalWidth'),
														'ros_height': $('#wyca_by_step_mapping_img_map_saved_fin').prop('naturalHeight'),
														'threshold_free': parseInt($('#wyca_by_step_mapping_threshold_free_slider').val()),
														'threshold_occupied': parseInt($('#wyca_by_step_mapping_threshold_occupied_slider').val())
													};
													if(typeof(updatingMap) != 'undefined')
														updatingMap = true;
													
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
																  
																	$('#wyca_by_step_mapping_use .bUseThisMapNowYes').show();
																	$('#wyca_by_step_mapping_use .bUseThisMapNowNo').show();
																	$('#wyca_by_step_mapping_use .modalUseThisMapNowTitle1').show();
																	$('#wyca_by_step_mapping_use .modalUseThisMapNowTitle2').hide();
																	$('#wyca_by_step_mapping_use .modalUseThisMapNowContent').hide();
																	
																	$('#wyca_by_step_mapping_fin .wyca_by_step_mapping_fin_next').click();
																	
																	
																	wycaApi.SetMapAsCurrent(id_map, function(data){
																		if (data.A == wycaApi.AnswerCode.NO_ERROR)
																		{
																			wycaApi.NavigationStartFromMapping(function(data) {
																				
																				if (data.A != wycaApi.AnswerCode.NO_ERROR)
																					ParseAPIAnswerError(data,textErrorStartNavigation);
																				
																				$('#wyca_by_step_mapping_use .wyca_by_step_mapping_use_next').click();
																				
																				setTimeout(function(){
																					WycaByStepInitMap();
																					WycaByStepResizeSVG();
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
																			ParseAPIAnswerError(data,textErrorSetMap);
																			
																			$('#wyca_by_step_mapping_use .bUseThisMapNowYes').show();
																			$('#wyca_by_step_mapping_use .bUseThisMapNowNo').show();
																			$('#wyca_by_step_mapping_use .modalUseThisMapNowTitle1').show();
																			$('#wyca_by_step_mapping_use .modalUseThisMapNowTitle2').hide();
																			$('#wyca_by_step_mapping_use .modalUseThisMapNowContent').hide();
																		}
																	});
										
																	
																  
																	var img = document.getElementById("wyca_by_step_mapping_img_map_saved_fin");
																	img.src = "assets/images/vide.png";
																	
																	
																}
																else
																{
																	ParseAPIAnswerError(data,textErrorGetMap);
																}		
																
															});
														}
														else
														{
															ParseAPIAnswerError(data,textErrorSetMap);
														}							
													});
												}else{
													alert_wyca((typeof(textErrorTrinary) != 'undefined'? textErrorTrinary : 'Error get map trinary'));
													$('.bMappingSaveMap').removeClass('disabled');
												}
																
												
											},
											error: function(e) {
												var img = document.getElementById("wyca_by_step_mapping_img_map_saved_fin");
												img.src = "assets/images/vide.png";
												
												if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
													console.log((typeof(textErrorTrinary) != 'undefined'? textErrorTrinary : 'Error get map trinary') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
													$('#modalErrorSession').modal('show');
												}else{
													console.log((typeof(textErrorTrinary) != 'undefined'? textErrorTrinary : 'Error get map trinary') + ' ' + e.responseText );
												}
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
	
	$('#pages_wyca_by_step .file_import_site').change(function(){
		
		let fname = $(this)[0].files[0].name;
		if(fname.slice(fname.length - 5) == '.wyca'){
			$('#pages_wyca_by_step .file_import_site_wrapper').css('background-color','#47a4476e');
		}else{
			$('#pages_wyca_by_step .file_import_site_wrapper').css('background-color','#e611116e');
			let icon = $('#pages_wyca_by_step .file_import_site_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
		$('#pages_wyca_by_step .filename_import_site').html(fname);
		$('#pages_wyca_by_step .filename_import_site').show();
		
	})
	
	//AJAX INSTALL STEP CALL
	$('#pages_wyca_by_step a.bImportSiteDo').click(function(e) {
        e.preventDefault();
		file = $('#pages_wyca_by_step .file_import_site')[0].files[0];
		if(file != undefined && file.name.slice(file.name.length - 5) == '.wyca'){
			
			$('#pages_wyca_by_step .wyca_by_step_setup_import_loading').show();
			$('#pages_wyca_by_step .wyca_by_step_setup_import_content').hide();
			
			var reader = new FileReader();
			reader.onload = function(event) { 
				wycaApi.ImportSite(btoa(reader.result), function(data) {
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						$('#pages_wyca_by_step .wyca_by_step_setup_import_loading').hide();
						$('#pages_wyca_by_step .wyca_by_step_setup_import_content').show();
						//success_wyca(textSiteImported);
						console.log(data);
						if(data.D > -1){
							window.site_id=data.D;
							wycaApi.SetSiteAsCurrent(window.site_id,function(data){
								if (data.A == wycaApi.AnswerCode.NO_ERROR)
								{
									wycaApi.GetMapsList(window.site_id,function(data){
										if(data.D.length <= 1){ // IF ONLY ONE MAP
										
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
																$('#wyca_by_step_site_master_dock .wyca_by_step_site_master_dock_next').click();
															},
															error: function(e) {
																if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
																	console.log((typeof(textErrorMasterDock) != 'undefined'? textErrorMasterDock : 'Error step master dock')+ ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
																	$('#modalErrorSession').modal('show');
																}else{
																	console.log((typeof(textErrorMasterDock) != 'undefined'? textErrorMasterDock : 'Error step master dock')+ ' ' + e.responseText );
																}
															}
														});
													}else{
														id_map = data.D.id_map;
														id_map_last = data.D.id_map;
														forbiddens = data.D.forbiddens;
														areas = data.D.areas;
														docks = data.D.docks;
														pois = data.D.pois;
														augmented_poses = data.D.augmented_poses; 
														
														$.ajax({
															type: "POST",
															url: 'ajax/install_by_step_import_site_select_map.php',
															data: { 
															},
															dataType: 'json',
															success: function(data) {
																$('#wyca_by_step_site_map .wyca_by_step_site_map_next').click();
															},
															error: function(e) {
																if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
																	console.log((typeof(textErrorImportSite) != 'undefined'? textErrorImportSite : 'Error import site')+ ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
																	$('#modalErrorSession').modal('show');
																}else{
																	console.log((typeof(textErrorImportSite) != 'undefined'? textErrorImportSite : 'Error import site') + ' ' + e.responseText);
																}
															}
														});
													}
													
												}else{
													ParseAPIAnswerError(data);
													InitSiteImportWycaByStep();
												}
											})
										}else{
											// IF MULTIPLES MAP
											$.ajax({
												type: "POST",
												url: 'ajax/install_by_step_import_site_finish.php',
												data: { 
												},
												dataType: 'json',
												success: function(data) {
													$('#wyca_by_step_import_site .wyca_by_step_import_site_next').click();
												},
												error: function(e) {
													if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
														console.log((typeof(textErrorImportSite) != 'undefined'? textErrorImportSite : 'Error import site')+ ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
														$('#modalErrorSession').modal('show');
													}else{
														console.log((typeof(textErrorImportSite) != 'undefined'? textErrorImportSite : 'Error import site') + ' ' + e.responseText);
													}
												}
											});
										}
									})
								}else{
									ParseAPIAnswerError(data);
									InitSiteImportWycaByStep();
								}
							})
							
						}else{
							alert_wyca((typeof(textErrorIDSite) != 'undefined'? textErrorIDSite : 'Error in ID site'));
							InitSiteImportWycaByStep();
						}
						
					}
					else
					{
						ParseAPIAnswerError(data);
						InitSiteImportWycaByStep();
						$('#pages_wyca_by_step .wyca_by_step_setup_import_loading').hide();
						$('#pages_wyca_by_step .wyca_by_step_setup_import_content').show();
					}
				});
			};
			reader.readAsText(file);
		}else{
			let icon = $('#pages_wyca_by_step .file_import_site_wrapper > p > i');
			icon.toggleClass('shake');
			setTimeout(function(){icon.toggleClass('shake')},2000);
		}
    });
	
	//------------------- STEP SELECT MAP ------------------------
	
	//AJAX INSTALL STEP CALL
	//DECLARATION EVENTLISTENER BOUTON CREE DYNAMIQUEMENT .on('event',function(){})
	$( "#pages_wyca_by_step #ImportSiteMapList" ).on( 'click', '.SelectMapItem', function(e) {
		id_map = parseInt($(this).attr('id'));
		wycaApi.SetMapAsCurrent(id_map, function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR){
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
									$('#wyca_by_step_site_master_dock .wyca_by_step_site_master_dock_next').click();
								},
								error: function(e) {
									if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
										console.log((typeof(textErrorMasterDock) != 'undefined'? textErrorMasterDock : 'Error step master dock')+ ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
										$('#modalErrorSession').modal('show');
									}else{
										console.log((typeof(textErrorMasterDock) != 'undefined'? textErrorMasterDock : 'Error step master dock')+ ' ' + e.responseText );
									}
								}
							});
						}else{
							id_map = data.D.id_map;
							id_map_last = data.D.id_map;
							forbiddens = data.D.forbiddens;
							areas = data.D.areas;
							docks = data.D.docks;
							pois = data.D.pois;
							augmented_poses = data.D.augmented_poses; 
							
							$.ajax({
								type: "POST",
								url: 'ajax/install_by_step_import_site_select_map.php',
								data: { 
								},
								dataType: 'json',
								success: function(data) {
									$('#wyca_by_step_site_map .wyca_by_step_site_map_next').click();
								},
								error: function(e) {
									if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
										console.log((typeof(textErrorImportSite) != 'undefined'? textErrorImportSite : 'Error import site')+ ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
										$('#modalErrorSession').modal('show');
									}else{
										console.log((typeof(textErrorImportSite) != 'undefined'? textErrorImportSite : 'Error import site') + ' ' + e.responseText);
									}
								}
							});
						}
						
					}else{
						ParseAPIAnswerError(data);
						InitSiteImportWycaByStep();
					}
				})
										
			}else{
				ParseAPIAnswerError(data);
				InitSiteSelectMapWycaByStep();
			}
		})
	})
	
	//------------------- STEP MASTER DOCK ------------------------
	
	//AJAX INSTALL STEP CALL
	//DECLARATION EVENTLISTENER BOUTON CREE DYNAMIQUEMENT .on('event',function(){})
	$( "#pages_wyca_by_step #MasterDockList" ).on( 'click', '.MasterDockItem', function(e) {
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
						
						GetInfosCurrentMapWycaByStep(); //MAJ EDIT MAP
						$('.wyca_by_step_site_master_dock_next').click();
						
					},
					error: function(e) {
						if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
							console.log((typeof(textErrorMasterDock) != 'undefined'? textErrorMasterDock : 'Error step master dock')+ ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
							$('#modalErrorSession').modal('show');
						}else{
							console.log((typeof(textErrorMasterDock) != 'undefined'? textErrorMasterDock : 'Error step master dock')+ ' ' + e.responseText );
						}
					}
				});
			}else{
				ParseAPIAnswerError(data);
				InitMasterDockWycaByStep();
				$('#pages_wyca_by_step .wyca_by_step_setup_import_loading').hide();
				$('#pages_wyca_by_step .wyca_by_step_setup_import_content').show();
				$('#pages_wyca_by_step section#wyca_by_step_site_master_dock .bBackButton').click();
			}
		})		
	})
	
	//------------------- STEP RECOVERY ------------------------
	
	$('#wyca_by_step_site_recovery .bRecovery').click(function(e) {
        e.preventDefault();
		$('#wyca_by_step_site_recovery .bRecovery').addClass('disabled');
		
		/*INIT FEEDBACK DISPLAY*/
		$('#wyca_by_step_site_recovery .recovery_feedback .recovery_step').css('opacity','0').hide();
		$('#wyca_by_step_site_recovery .recovery_feedback .recovery_step .fa-check').hide();
		$('#wyca_by_step_site_recovery .recovery_feedback .recovery_step .fa-pulse').show();
		
		wycaApi.on('onRecoveryFromFiducialFeedback', function(data) {
			if(data.A == wycaApi.AnswerCode.NO_ERROR){
				target = '';
				switch(data.M){
					case 'Scan reflector': 				target = '#wyca_by_step_site_recovery .recovery_feedback .recovery_step.RecoveryScan';	break;
					case 'Init pose': 					target = '#wyca_by_step_site_recovery .recovery_feedback .recovery_step.RecoveryPose';	break;
					case 'Rotate to check obstacles': 	target = '#wyca_by_step_site_recovery .recovery_feedback .recovery_step.RecoveryRotate';	break;
					case 'Start navigation': 			target = '#wyca_by_step_site_recovery .recovery_feedback .recovery_step.RecoveryNav';		break;
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
				
				$('#wyca_by_step_site_recovery .recovery_step:visible').find('.fa-check').show();
				$('#wyca_by_step_site_recovery .recovery_step:visible').find('.fa-pulse').hide();
				setTimeout(function(){
					$('.ifRecovery').hide();
					$('.ifNRecovery').show();
					$('#wyca_by_step_site_recovery .bRecovery').removeClass('disabled');
					success_wyca(textRecoveryDone);
					$('#wyca_by_step_site_recovery .bRecovery').removeClass('disabled');
					$('#wyca_by_step_site_recovery .wyca_by_step_site_recovery_next').click();

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
							if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
								console.log((typeof(textErrorRecovery) != 'undefined'? textErrorRecovery : 'Error in recovery')+ ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
								$('#modalErrorSession').modal('show');
							}else{
								console.log((typeof(textErrorRecovery) != 'undefined'? textErrorRecovery : 'Error in recovery') + ' ' + e.responseText);
							}
						}
					});
				},500)
			}
			else
			{
				$('.ifRecovery').hide();
				$('.ifNRecovery').show();
				$('#wyca_by_step_site_recovery .bRecovery').removeClass('disabled');
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
				$('#wyca_by_step_site_recovery .bRecovery').removeClass('disabled');
				ParseAPIAnswerError(data);
			}
		});
    });
	
	$('#wyca_by_step_site_recovery .bCancelRecovery').click(function(e) {
		$('#wyca_by_step_site_recovery .bCancelRecovery').addClass('disabled');
		wycaApi.RecoveryFromFiducialCancel(function(data) {
			$('#wyca_by_step_site_recovery .bCancelRecovery').removeClass('disabled');
		})
	})
	
	//AJAX INSTALL STEP CALL

	$('#wyca_by_step_site_recovery a.skip_recovery').click(function(e) {
        e.preventDefault();
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_import_site_recovery.php',
			data: {
			},
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				console.log((typeof(textErrorRecovery) != 'undefined'? textErrorRecovery : 'Error in recovery') + ' ' + e.responseText);
			}
		});
    });
	/*
	$('#wyca_by_step_mapping_use .bUseThisMapNowYes').click(function(e) {
		e.preventDefault();
        
		$('#wyca_by_step_mapping_use .bUseThisMapNowYes').hide();
		$('#wyca_by_step_mapping_use .bUseThisMapNowNo').hide();
		$('#wyca_by_step_mapping_use .modalUseThisMapNowTitle1').hide();
		$('#wyca_by_step_mapping_use .modalUseThisMapNowTitle2').show();
		$('#wyca_by_step_mapping_use .modalUseThisMapNowContent').show();
		
		$('#wyca_by_step_mapping_use .modalUseThisMapNowContentDetails').html(textBuildingMap);
		
		wycaApi.SetMapAsCurrent(id_map, function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#wyca_by_step_mapping_use .modalUseThisMapNowContentDetails').html(textStartAutonomous);
				wycaApi.NavigationStartFromMapping(function(data) {
					
					if (data.A != wycaApi.AnswerCode.NO_ERROR) { alert_wyca('Error navigation start ; ' + wycaApi.AnswerCodeToString(data.A)+ " " + data.M);} 
					$('#wyca_by_step_mapping_use .wyca_by_step_mapping_use_next').click();
				});
			}
			else
			{
				text = wycaApi.AnswerCodeToString(data.A);
				if (data.M != '')
					text += ' : ' + data.M;
				alert_wyca(text);
				
				$('#wyca_by_step_mapping_use .bUseThisMapNowYes').show();
				$('#wyca_by_step_mapping_use .bUseThisMapNowNo').show();
				$('#wyca_by_step_mapping_use .modalUseThisMapNowTitle1').show();
				$('#wyca_by_step_mapping_use .modalUseThisMapNowTitle2').hide();
				$('#wyca_by_step_mapping_use .modalUseThisMapNowContent').hide();
			}
		});
		
		
    });
	*/
	
	//------------------- STEP MAPPING CONFIG ------------------------
	
	$('#wyca_by_step_mapping_fin .bResetValueThreshold').click(function(e) {
        e.preventDefault();
		
		$("#wyca_by_step_mapping_threshold_free_slider").val(25);
		$("#wyca_by_step_mapping_threshold_free_slider_elem").slider('value',25);
		$('#wyca_by_step_mapping_threshold_free_output b').text( 25 );
		threshold_free = 25;
		
		$("#wyca_by_step_mapping_threshold_occupied_slider").val(65);
		$("#wyca_by_step_mapping_threshold_occupied_slider_elem").slider('value',65);
		$('#wyca_by_step_mapping_threshold_occupied_output b').text( 65 );
		threshold_occupied = 65;
		
		$('#wyca_by_step_mapping_fin .bMappingSaveMap ').addClass('disabled');
		CalculateMapTrinary();
    });
	
	$('#wyca_by_step_mapping_threshold_free_slider').change(function() {
		$('#wyca_by_step_mapping_threshold_free_output b').text( this.value );
		threshold_free = this.value;
		
		$('#wyca_by_step_mapping_fin .bMappingSaveMap ').addClass('disabled');
		CalculateMapTrinary();
	});
	
	$('#wyca_by_step_mapping_threshold_occupied_slider').change(function() {
		$('#wyca_by_step_mapping_threshold_occupied_output b').text( this.value );
		threshold_occupied = this.value;
		
		$('#wyca_by_step_mapping_fin .bMappingSaveMap ').addClass('disabled');
		CalculateMapTrinary();
	});
	
	$("#wyca_by_step_mapping_threshold_occupied_slider_elem").slider({ "value": 65, "range": "min", "max": 100 });
	$("#wyca_by_step_mapping_threshold_occupied_slider_elem").on("slide", function(slideEvt) { $("#wyca_by_step_mapping_threshold_occupied_output b").text(slideEvt.value); $("#wyca_by_step_mapping_threshold_occupied_slider").val(slideEvt.value); });
	$("#wyca_by_step_mapping_threshold_free_slider_elem").slider({ "value": 25, "range": "min", "max": 100 });
	$("#wyca_by_step_mapping_threshold_free_slider_elem").on("slide", function(slideEvt) { $("#wyca_by_step_mapping_threshold_free_output b").text(slideEvt.value); $("#wyca_by_step_mapping_threshold_free_slider").val(slideEvt.value); });

	//------------------- STEP EDIT MAP ------------------------

	$('#wyca_by_step_edit_map .bSaveEditMap').click(function(e) {
		e.preventDefault();
        
		if (!wyca_bystepCanChangeMenu)
		{
			alert_wyca((typeof(textConfirmActiveElement) != 'undefined'? textConfirmActiveElement : 'You must confirm the active element'));
			$('#bCloseAlertWyca').click(WycaByStepShakeActiveElement());
			return false;
		}
		else
		{
			let actions_searched = ['editPoi','editDock','editAugmentedPose','editForbiddenArea','editArea'];
			if(actions_searched.includes(wyca_bystepCurrentAction)){
				switch(wyca_bystepCurrentAction){
					case 'editPoi' :
						i = GetPoiIndexFromID(currentPoiWycaByStepLongTouch.data('id_poi'));
						WycaByStepBufferMapSaveElemName = pois[i].name;
					break;
					case 'editDock' :
						i = GetDockIndexFromID(currentDockWycaByStepLongTouch.data('id_docking_station'));
						WycaByStepBufferMapSaveElemName = docks[i].name;
					break;
					case 'editAugmentedPose' :
						i = GetAugmentedPoseIndexFromID(currentAugmentedPoseWycaByStepLongTouch.data('id_augmented_pose'));
						WycaByStepBufferMapSaveElemName = augmented_poses[i].name;
					break;
					case 'editForbiddenArea' :
						i = GetForbiddenIndexFromID(currentForbiddenWycaByStepLongTouch.data('id_area'));
						WycaByStepBufferMapSaveElemName = forbiddens[i].name;
					break;
					case 'editArea' :
						i = GetAreaIndexFromID(currentAreaWycaByStepLongTouch.data('id_area'));
						WycaByStepBufferMapSaveElemName = areas[i].name;
					break;
					default: WycaByStepBufferMapSaveElemName = ''; break;
				}
			}
			wyca_bystepCanChangeMenu = true;
			wyca_bystepCurrentAction = '';
			WycaByStepHideMenus();
			$('#wyca_by_step_edit_map .bSaveEditMap').html('<i class="fa fa fa-spinner fa-pulse"></i> '+textBtnSavingMap).addClass('disabled'); // ADD SPINNER ON BTN + DISABLE BTN
			data = GetDataMapToSave();
			
			if ($(this).hasClass('button_goto'))
			{
				$('#wyca_by_step_test_map .list_test li').remove();
				$('#wyca_by_step_test_map .wyca_by_step_test_map_loading').show();
				
				gotoTest = true;
			}
			else
				gotoTest = false;
			
			wycaApi.SetCurrentMapData(data, function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					success_info_wyca((typeof(textMapSaved) != 'undefined'? textMapSaved : 'Map saved'));

					// On reload la carte pour mettre à jours les ids
					GetInfosCurrentMapWycaByStep();
					/*
					if (navLaunched && id_map == current_id_map)
					{
						wycaApi.NavigationReloadMaps(function(e) { if (e.A != wycaApi.AnswerCode.NO_ERROR) console.error(wycaApi.AnswerCodeToString(data.A)+ " " + data.M); });	
					}
					*/
				}
				else
				{
					$('#wyca_by_step_edit_map .burger_menu').removeClass('updatingMap');
					ParseAPIAnswerError(data);
				}
			});
		}
    });
	
	$('#wyca_by_step_test_map').on( 'click', '.bExecuteTest', function(e) {
        e.preventDefault();
		
		$('#wyca_by_step_test_map .bExecuteTest').addClass('disabled');
		
		currentTestIndex = $(this).parent().data('index_li');
		
		id = $(this).parent().data('id');
		if ($(this).parent().data('type') == 'Poi')
		{
			wycaApi.on('onGoToPoiResult', function (data){
				
				$('#wyca_by_step_test_map .bExecuteTest').removeClass('disabled');
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex).addClass('done');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-danger');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-success');
				}
				else
				{
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex).addClass('ko');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-success');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-danger');
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
					$('#wyca_by_step_test_map .bExecuteTest').removeClass('disabled');
				
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex).addClass('ko');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-success');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-danger');
					ParseAPIAnswerError(data);
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoiResult', onGoToPoiResult);
				}
			});
		}
		else if ($(this).parent().data('type') == 'AugmentedPose')
		{
			wycaApi.on('onGoToAugmentedPoseResult', function (data){
				
				$('#wyca_by_step_test_map .bExecuteTest').removeClass('disabled');
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex).addClass('done');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-danger');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-success');
				}
				else
				{
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex).addClass('ko');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-success');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-danger');
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
					$('#wyca_by_step_test_map .bExecuteTest').removeClass('disabled');
				
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex).addClass('ko');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-success');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-danger');
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
				
				$('#wyca_by_step_test_map .bExecuteTest').removeClass('disabled');
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex).addClass('done');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-danger');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-success');
				}
				else
				{
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex).addClass('ko');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-success');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-danger');
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
					$('#wyca_by_step_test_map .bExecuteTest').removeClass('disabled');
					
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex).addClass('ko');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').removeClass('btn-warning btn-success');
					$('#wyca_by_step_test_map #wyca_by_step_test_map_list_test_'+currentTestIndex+' a').addClass('btn-danger');
					ParseAPIAnswerError(data);
					
					// On rebranche l'ancienne fonction
					wycaApi.on('onGoToChargeResult', onGoToChargeResult);
				}
			});
			
		}
    });
	
	/*
	//AJAX INSTALL STEP CALL
	$('#wyca_by_step_test_map .bTestFinish').click(function(e) {
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_test_finish.php',
			data: {
			},
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
					alert_wyca('Error step test finish ; ' + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
					$('#modalErrorSession').modal('show');
				}else{
					alert_wyca('Error step test finish ; ' + ' ' + e.responseText );
				}
			}
		});
    });
	*/
	
	$('#wyca_by_step_edit_map .bCheckNextEditMap').click(function(e) {
		if(typeof(docks) == 'undefined' || docks.length == 0){
			$('#wyca_by_step_edit_map .modalConfirmNextNoDock').modal('show');
			
		}else{
			$('#wyca_by_step_edit_map .bNextEditMap').click();
		}			
	})
	
	$('#wyca_by_step_edit_map .modalConfirmNextNoDock .bConfirmNextNoDock').click(function(e) {
		$('#wyca_by_step_edit_map .bNextEditMap').click();
	})
	
	//AJAX INSTALL STEP CALL
	$('#wyca_by_step_edit_map .bNextEditMap').click(function(e) {
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_edit_map_finish.php',
			data: {
			},
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
					console.log((typeof(textErrorEditMap) != 'undefined'? textErrorEditMap : 'Error step edit map') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
					$('#modalErrorSession').modal('show');
				}else{
					console.log((typeof(textErrorEditMap) != 'undefined'? textErrorEditMap : 'Error step edit map') + ' ' + e.responseText );
				}
			}
		});
    });
	
	//------------------- STEP CONFIGURATION EBL/MBL ------------------------
	
	$('#pages_wyca_by_step a.real_test').click(function(e) {
        e.preventDefault();
		$('#pages_wyca_by_step .modalRealTest_loading').show();
		$('#pages_wyca_by_step .modalRealTest_content').hide();
		$('#pages_wyca_by_step .modalRealTest').modal('show');
		$('#pages_wyca_by_step a.bRealTestDo').addClass('disabled');
		wycaApi.GetCurrentMapData(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				let n = 0 ;
				$('#pages_wyca_by_step .modalRealTest_loading').hide();
				$('#pages_wyca_by_step .modalRealTest_content').show();
				$('#pages_wyca_by_step select.real_test_start > option').hide();
				$('#pages_wyca_by_step select.real_test_end > option').hide();
				//ADD POIS
				$.each(data.D.pois,function(i, item){
					$('#pages_wyca_by_step select.real_test_start').append('<option value="poi_'+item.id_poi+'" data-type="poi" data-id="'+item.id_poi+'" >&#xf3c5 - POI - '+item.name+'</option>' );
					$('#pages_wyca_by_step select.real_test_end').append('<option value="poi_'+item.id_poi+'" data-type="poi" data-id="'+item.id_poi+'">&#xf3c5 - POI - '+item.name+'</option>' );
					n++;
				});
				//ADD DOCKS
				$.each(data.D.docks,function(i, item){
					$('#pages_wyca_by_step select.real_test_start').append('<option value="dock_'+item.id_docking_station+'" data-type="dock" data-id="'+item.id_docking_station+'" >&#xf5e7 - Dock - '+item.name+'</option>' );
					$('#pages_wyca_by_step select.real_test_end').append('<option value="dock_'+item.id_docking_station+'" data-type="dock" data-id="'+item.id_docking_station+'" >&#xf5e7 - Dock - '+item.name+'</option>' );
					n++;
				});
				//ADD A POSES
				$.each(data.D.augmented_poses,function(i, item){
					$('#pages_wyca_by_step select.real_test_start').append('<option value="augmented_pose_'+item.id_docking_station+'" data-type="augmented_pose" data-id="'+item.id_augmented_pose+'" >&#xf02a; - A. pose - '+item.name+'</option>' );
					$('#pages_wyca_by_step select.real_test_end').append('<option value="augmented_pose_'+item.id_docking_station+'" data-type="augmented_pose" data-id="'+item.id_augmented_pose+'" >&#xf02a; - A. pose - '+item.name+'</option>' );
					n++;
				});
				id_map = data.D.id_map;
				id_map_last = data.D.id_map;
				if(n < 2){
					$('#pages_wyca_by_step .modalRealTest').modal('hide');
					alert_wyca(textNoRealTest);
				}
			}
			else
			{
				$('#pages_wyca_by_step .modalRealTest').modal('hide');
			}
			$('#pages_wyca_by_step a.bRealTestDo').removeClass('disabled');
		})		
		
	});
	
	/* REAL TEST */
	
	$('#pages_wyca_by_step a.bRealTestDo').click(function(e) {
        e.preventDefault();
		let start = $('#pages_wyca_by_step select.real_test_start option:selected');
		let end = $('#pages_wyca_by_step select.real_test_end option:selected');
		if(start.val()!='' && end.val()!='' && end.val()!=start.val()){
			$('#pages_wyca_by_step .modalRealTest').modal('hide');
			$('#pages_wyca_by_step .modalRealTestResult').modal('show');
			
			$("#pages_wyca_by_step .modalRealTestResult .start_point").hide();
			$("#pages_wyca_by_step .modalRealTestResult .end_point").hide();
			$("#pages_wyca_by_step .modalRealTestResult .result_RealTest").hide();
			
			$("#pages_wyca_by_step .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');			
			$("#pages_wyca_by_step .modalRealTestResult .start_point_text").html(start.html());
			$("#pages_wyca_by_step .modalRealTestResult .end_point_text").html(end.html());
			
			RealTestGotoStartWycaByStep(start,end);
		}
	});
	
	$('#pages_wyca_by_step .modalRealTestResult a.bUseRealTest').click(function(e) {
		e.preventDefault();
		let temp = battery_lvl_needed == 0?1:parseInt(battery_lvl_needed);
		let EBL = temp+5;
		let MBL = 2*temp;
		MBL < EBL ? MBL = EBL + 5:'';
		$('#wyca_by_step_config_i_level_min_gotocharge').val(EBL);
		$('#wyca_by_step_config_i_level_min_dotask').val(MBL);
		$('#pages_wyca_by_step .modalRealTestResult').modal('hide');
    });
	
	$('section#wyca_by_step_config a.bResetValueEblMbl').click(function(e) {
		
		$('#wyca_by_step_config_i_level_min_gotocharge').val((typeof(defaultEBL) != 'undefined'? defaultEBL : 15));
		$('#wyca_by_step_config_i_level_min_dotask').val((typeof(defaultMBL) != 'undefined'? defaultMBL : 20));
    });
	
	//AJAX INSTALL STEP CALL
	$('#wyca_by_step_config .bConfigurationSave').click(function(e) {
		let EBL = parseInt($('#wyca_by_step_config_i_level_min_gotocharge').val());
		let MBL = parseInt($('#wyca_by_step_config_i_level_min_dotask').val());
		/*EBL = EBL > 100 ? 15 : EBL;
		EBL = EBL < 0 ? 15 : EBL;
		MBL = MBL > 100 ? 20 : MBL;
		MBL = MBL < 0 ? 20 : MBL;*/
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
						if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
							console.log((typeof(textErrorBatteryConfig) != 'undefined'? textErrorBatteryConfig : 'Error step battery config')+ ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
							$('#modalErrorSession').modal('show');
						}else{
							console.log((typeof(textErrorBatteryConfig) != 'undefined'? textErrorBatteryConfig : 'Error step battery config') + ' ' + e.responseText );
						}
					}
				});
				$('#wyca_by_step_config .wyca_by_step_config_next').click();
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
    });
	
	//------------------- STEP EXPORT SITE ------------------------
	//AJAX INSTALL STEP CALL
	$('#wyca_by_step_export_site .bExportSite').click(function(e){
		
		$('#wyca_by_step_export_site .bExportSite').addClass('disabled');
		
		wycaApi.GetCurrentSite(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				let id = data.D.id_site;
				currentNameSiteExport = data.D.name;
				
				wycaApi.ExportSite(id, function(data){
					if (data.A == wycaApi.AnswerCode.NO_ERROR)
					{
						var a = document.createElement("a");
						document.body.appendChild(a);
						a.style = "display: none";
						
						var blob = new Blob([data.D], {type: "octet/stream"}),
						url = window.URL.createObjectURL(blob);
						a.href = url;
						a.download = 'export_site_'+currentNameSiteExport+'.wyca';
						a.click();
						window.URL.revokeObjectURL(url);
						
						$.ajax({
							type: "POST",
							url: 'ajax/install_by_step_export_site.php',
							data: {
							},
							dataType: 'json',
							success: function(data) {
								$('#wyca_by_step_export_site .bExportSite').removeClass('disabled');
								setTimeout(function(){$('#wyca_by_step_export_site .wyca_by_step_export_site_next').click();},100)
							},
							error: function(e) {
								if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
									console.log((typeof(textErrorExportSite) != 'undefined'? textErrorExportSite : 'Error export site') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
									$('#modalErrorSession').modal('show');
								}else{
									console.log((typeof(textErrorExportSite) != 'undefined'? textErrorExportSite : 'Error export site') + ' ' + e.responseText );
								}
							}
						});
					}
					else
					{
						$('#wyca_by_step_export_site .bExportSite').removeClass('disabled');
						ParseAPIAnswerError(data,(typeof(textErrorExportSite) != 'undefined'? textErrorExportSite : 'Error export site'));
					}							
				});
			}
			else
			{
				$('#wyca_by_step_export_site .bExportSite').removeClass('disabled');
				ParseAPIAnswerError(data,(typeof(textErrorGetCurrentSite) != 'undefined'? textErrorGetCurrentSite : 'Error get current site'));
			}
		})
	})
	//AJAX INSTALL STEP CALL
	
	$('#wyca_by_step_export_site .bExportSiteSkip').click(function(e){
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_export_site.php',
			data: {
			},
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
					console.log((typeof(textErrorExportSite) != 'undefined'? textErrorExportSite : 'Error export site') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
					$('#modalErrorSession').modal('show');
				}else{
					console.log((typeof(textErrorExportSite) != 'undefined'? textErrorExportSite : 'Error export site') + ' ' + e.responseText );
				}
			}
		});
	})
	//------------------- STEP MAINTENANCE ACCOUNT ------------------------
	$('#wyca_by_step_maintenance #bModalDeleteMaintenanceAccount').click(function(e){
		$('#wyca_by_step_maintenance .modalConfirmDeleteMaintenanceAccount').modal('show');
	})
	
	$('#wyca_by_step_maintenance #wyca_by_step_delete_maintenance_account').change(function(e){
		$('#wyca_by_step_maintenance #bDeleteMaintenanceAccount').toggleClass('disabled');
	})
	
	//AJAX INSTALL STEP CALL
	$('#wyca_by_step_maintenance #bDeleteMaintenanceAccount').click(function(e){
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
						success_info_wyca(textAccountDeleted);
						$('#wyca_by_step_maintenance .wyca_by_step_maintenance_next').click();
						$('#wyca_by_step_maintenance .modalConfirmDeleteMaintenanceAccount').modal('hide');
					},
					error: function(e) {
						if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
							console.log((typeof(textErrorMaintenanceAccount) != 'undefined'? textErrorMaintenanceAccount : 'Error maintenance account') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
							$('#modalErrorSession').modal('show');
						}else{
							console.log((typeof(textErrorMaintenanceAccount) != 'undefined'? textErrorMaintenanceAccount : 'Error maintenance account') + ' ' + e.responseText );
						}
					}
				});
				
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
	});
		
	$('#wyca_by_step_maintenance #bKeepMaintenanceAccount').click(function(e){
		$('#wyca_by_step_maintenance .modalMaintenance').modal('show');
	});
	
	$('#wyca_by_step_maintenance #bChangeMaintenanceAccountPassword').click(function(e){
		$('#wyca_by_step_maintenance .modalPasswordMaintenance').modal('show');
	});
		
	$('#wyca_by_step_maintenance #bKeepMaintenanceAccountPassword').click(function(e){
		$.ajax({
			type: "POST",
			url: 'ajax/install_by_step_maintenance.php',
			data: {
			},
			dataType: 'json',
			success: function(data) {
				$('#wyca_by_step_maintenance .wyca_by_step_maintenance_next').click();
				$('#wyca_by_step_maintenance .modalMaintenance').modal('hide');
				$('#wyca_by_step_maintenance .modalPasswordMaintenance').modal('hide');
			},
			error: function(e) {
				if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
					console.log((typeof(textErrorMaintenanceAccount) != 'undefined'? textErrorMaintenanceAccount : 'Error maintenance account') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
					$('#modalErrorSession').modal('show');
				}else{
					console.log((typeof(textErrorMaintenanceAccount) != 'undefined'? textErrorMaintenanceAccount : 'Error maintenance account') + ' ' + e.responseText );
				}
			}
		});
	});
	
	$('#wyca_by_step_maintenance #bChangeMaintenanceAccountPassword').click(function(e){
		$('#wyca_by_step_maintenance_i_maintenance_password').val('')
		$('#wyca_by_step_maintenance_i_maintenance_cpassword').val('')
		$('#wyca_by_step_maintenance .modalPasswordMaintenance').modal('show');
		
	});
	
	//AJAX INSTALL STEP CALL
	$('#wyca_by_step_maintenance #wyca_by_step_maintenance_bPasswordMaintenanceSave').click(function(e){
		let pass = $('#wyca_by_step_maintenance_i_maintenance_password');
		let cpass = $('#wyca_by_step_maintenance_i_maintenance_password');
		
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
							$('#wyca_by_step_maintenance .wyca_by_step_maintenance_next').click();
							$('#wyca_by_step_maintenance .modalMaintenance').modal('hide');
							$('#wyca_by_step_maintenance .modalPasswordMaintenance').modal('hide');
						},
						error: function(e) {
							if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
								console.log((typeof(textErrorMaintenanceAccount) != 'undefined'? textErrorMaintenanceAccount : 'Error maintenance account') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
								$('#modalErrorSession').modal('show');
							}else{
								console.log((typeof(textErrorMaintenanceAccount) != 'undefined'? textErrorMaintenanceAccount : 'Error maintenance account') + ' ' + e.responseText );
							}
						}
					});
					
				}
				else
				{
					ParseAPIAnswerError(data);
				}
			})
		}
	});
	
	//------------------- STEP MANAGERS ------------------------	
	
	$('#wyca_by_step_manager .bHelpManagerOk').click(function(){boolHelpManager = !$('#wyca_by_step_manager .checkboxHelpManager').prop('checked');setCookie('boolHelpManagerI',boolHelpManager);});//ADD SAVING BDD / COOKIES ?
	
	$('#wyca_by_step_manager .bAddManager').click(function(e) {
	
		$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_id_manager').val(-1);
		$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_email').val('').removeClass('success').removeClass('error');
		$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_societe').val('');
		$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_prenom').val('');
		$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_nom').val('');
		$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_password').val('').removeClass('success').removeClass('error');
		$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_cpassword').val('').removeClass('success').removeClass('error');
		
		$('#wyca_by_step_manager .modalManager').modal('show');
	});
	
	$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_bManagerSave').click(function(e) {
        e.preventDefault();
		
		let pass = $('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_password');
		let cpass = $('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_cpassword');
		
		if (pass.val() == '' || cpass.val() == ''){
			alert_wyca(textPasswordRequired);
		}else if(pass.val() != cpass.val()){
			alert_wyca(textPasswordMatching);
		}else if(!pass[0].checkValidity() || !cpass[0].checkValidity()){
			alert_wyca(textPasswordPattern);
		}/*else if (!$('#wyca_by_step_manager_i_manager_email')[0].checkValidity()){
			alert_wyca(textLoginPattern);
		}*/
		/*
		else if ($('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_societe').val() == "" )
		{
			alert_wyca('Company is required');
		}
		else if ($('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_prenom').val() == "" )
		{
			alert_wyca('Firstname is required');
		}
		else if ($('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_nom').val() == "" )
		{
			alert_wyca('Lastname is required');
		}*/
		else
		{
			json_user = {
				"id_user": parseInt($('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_id_manager').val()),
				"company": $('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_societe').val(),
				"lastname": $('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_nom').val(),
				"firstname": $('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_prenom').val(),
				"email": $('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_email').val(),
				"pass": $('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_password').val(),
				"id_group_user": wycaApi.GroupUser.MANAGER,
			};
			
			wycaApi.SetUser(json_user, function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					// On ajoute le li
					id_user = data.D;
					if ($('#wyca_by_step_manager_list_manager_elem_'+id_user).length > 0)
					{
						$('#wyca_by_step_manager_list_manager_elem_'+id_user+' span.email').html(json_user.email);
						/*
						$('#wyca_by_step_manager_list_manager_elem_'+id_user+' span.societe').html(json_user.company);
						$('#wyca_by_step_manager_list_manager_elem_'+id_user+' span.prenom').html(json_user.firstname);
						$('#wyca_by_step_manager_list_manager_elem_'+id_user+' span.nom').html(json_user.lastname);
						*/
					}
					else
					{
						$('#wyca_by_step_manager .list_managers').append('' +
							'<li id="wyca_by_step_manager_list_manager_elem_'+id_user+'" data-id_user="'+id_user+'">'+
							'	<span class="email">'+json_user.email+'</span>'+
							'	<a href="#" class="bManagerDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>'+
							'	<a href="#" class="bManagerEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pen"></i></a>'+
							'</li>'
							);
					}
					RefreshDisplayManagerWycaByStep();
					$('#wyca_by_step_manager .modalManager').modal('hide');
				}
				else
				{
					ParseAPIAnswerError(data);
				}
			});
		}
    });
	
	$(document).on('click', '#wyca_by_step_manager .bManagerDeleteElem', function(e) {
		e.preventDefault();
		
		id_user_to_delete = parseInt($(this).closest('li').data('id_user'));
		
		wycaApi.DeleteUser(id_user_to_delete, function(data) {
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				$('#wyca_by_step_manager_list_manager_elem_'+id_user_to_delete).remove();
				RefreshDisplayManagerWycaByStep();
			}
			else
			{
				ParseAPIAnswerError(data);
			}
		});
	});
	
	$(document).on('click', '#wyca_by_step_manager .bManagerEditElem', function(e) {
		e.preventDefault();
		
		id_user = $(this).closest('li').data('id_user');
		$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_id_manager').val(id_user);
		$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_email').val($('#wyca_by_step_manager_list_manager_elem_'+id_user+' span.email').html());
		$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_societe').val($('#wyca_by_step_manager_list_manager_elem_'+id_user+' span.societe').html());
		$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_prenom').val($('#wyca_by_step_manager_list_manager_elem_'+id_user+' span.prenom').html());
		$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_nom').val($('#wyca_by_step_manager_list_manager_elem_'+id_user+' span.nom').html());
		$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_password').val('');
		$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_cpassword').val('');
		
		$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_email').removeClass('success').removeClass('error');
		$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_password').removeClass('success').removeClass('error');
		$('#wyca_by_step_manager .modalManager #wyca_by_step_manager_i_manager_cpassword').removeClass('success').removeClass('error');
		
		$('#wyca_by_step_manager .modalManager').modal('show');
	});
	
	$('#wyca_by_step_manager input#wyca_by_step_manager_i_manager_email').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#wyca_by_step_manager input#wyca_by_step_manager_i_manager_password').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
	})
	
	$('#wyca_by_step_manager input#wyca_by_step_manager_i_manager_cpassword').change(function(e){
		if($(this)[0].checkValidity())
			$(this).removeClass('error').addClass('success');
		else
			$(this).removeClass('success').addClass('error');
		if($('#wyca_by_step_manager input#wyca_by_step_manager_i_manager_password').val() != ''){
			if($(this).val() == $('#wyca_by_step_manager input#wyca_by_step_manager_i_manager_password').val())
				$(this).removeClass('error').addClass('success');
			else
				$(this).removeClass('success').addClass('error');
		}
	})
	
	//AJAX INSTALL STEP CALL
	$('#wyca_by_step_manager .bValidManager').click(function(e) {
        $.ajax({
			type: "POST",
			url: 'ajax/install_by_step_managers.php',
			data: {
			},
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
					console.log((typeof(textErrorManagers) != 'undefined'? textErrorManagers : 'Error manager') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
					$('#modalErrorSession').modal('show');
				}else{
					console.log((typeof(textErrorManagers) != 'undefined'? textErrorManagers : 'Error manager') + ' ' + e.responseText );
				}
			}
		});
    });
	
	//------------------- STEP SERVICE BOOK ------------------------	
	
	$('#wyca_by_step_service_book .bAddServiceBook').click(function(e) {
	
		$('#wyca_by_step_service_book .modalServiceBook #wyca_by_step_service_book_i_service_book_title').val('');
		$('#wyca_by_step_service_book .modalServiceBook #wyca_by_step_service_book_i_service_book_comment').val('');
		
		$('#wyca_by_step_service_book .modalServiceBook').modal('show');
	});
	
	$('#wyca_by_step_service_book .modalServiceBook #wyca_by_step_service_book_bServiceBookSave').click(function(e) {
        e.preventDefault();
		
		if ($('#wyca_by_step_service_book .modalServiceBook #wyca_by_step_service_book_i_service_book_title').val() == "" )
		{
			alert_wyca((typeof(textTitleRequired) != 'undefined'? textTitleRequired : 'Title is required.'));
		}
		else if ($('#wyca_by_step_service_book .modalServiceBook #wyca_by_step_service_book_i_service_book_comment').val() == "" )
		{
			alert_wyca((typeof(textCommentRequired) != 'undefined'? textCommentRequired : 'Comment is required.'));
		}
		else
		{
			json_service_book = {
				"id_service_book": -1,
				"title": $('#wyca_by_step_service_book .modalServiceBook #wyca_by_step_service_book_i_service_book_title').val(),
				"comment": $('#wyca_by_step_service_book .modalServiceBook #wyca_by_step_service_book_i_service_book_comment').val()
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
					$('#wyca_by_step_service_book .list_service_books').prepend('' +
						'<li>'+
						'	<div class="date">'+d_txt+'</div>'+
						'	<div class="title">'+json_service_book.title+'</div>'+
						'	<div class="comment">'+json_service_book.comment+'</div>'+
						'</li>'
						);

					$('#wyca_by_step_service_book .modalServiceBook').modal('hide');
				}
				else
				{
					ParseAPIAnswerError(data);
				}
			});
		}
    });
	
    //AJAX INSTALL STEP CALL
	$('#wyca_by_step_end .bCloseInstallation').click(function(e) {
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
				if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
					console.log((typeof(textErrorFinish) != 'undefined'? textErrorFinish : 'Error in finish') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
					$('#modalErrorSession').modal('show');
				}else{
					console.log((typeof(textErrorFinish) != 'undefined'? textErrorFinish : 'Error in finish') + ' ' + e.responseText );
				}
			}
		});
		
		
		//AFFICHER QQ CHOSE
		//$('section#wyca_normal_dashboard').hide();

		$('#pages_wyca_by_step').removeClass('active');
		$('#pages_wyca_normal').addClass('active');
		
		
		// back
		$('#wyca_edit_map .bBackButton').click();
		
		/*
		if ($('#wyca_normal_setup_sites').is(':visible'))
		{
			GetSitesNormal();
		}
		else
		{
			//AFFICHER QQ CHOSE
			$('section#wyca_normal_dashboard').show('slow');
		}
		*/
		
		
		$('.menu_groupe button').show();
		
    });
	
	
});

//------------------- STEP AUTO DIAG ------------------------
	
function StartAnimCheckComposantInstall()
{
	timer_anim_check = undefined;
	if ($('#wyca_by_step_check .test').length > 0)
	{
		$('#wyca_by_step_check .test').addClass('checked');
		$('#wyca_by_step_check .test').removeClass('test');
		let lg = $('#wyca_by_step_check div.is_checkbox:not(".checked")').length;
		if ( lg > 0)
		{
			let rd = Math.floor(Math.random() * Math.floor(lg));
			$('#wyca_by_step_check div.is_checkbox:not(".checked")').eq(rd).addClass('test');
			timer_anim_check = setTimeout(StartAnimCheckComposantInstall, Math.floor(Math.random() * 1500 + 500));
		}
		else
		{
			//$('#wyca_by_step_check .wyca_by_step_check_next').show();
			$('.wyca_by_step_check_next').removeClass('disabled');
			$('.wyca_by_step_check_next').html(textBtnCheckNext);
			
		
		}
	}	
}

//------------------- STEP CONFIGURATION EBL/MBL ------------------------
	
/* FONCTION PROGRESS BAR REAL TEST */	/* REAL TEST */
	
function TimerRealTestWycaByStep(step){
	if(step=='start'){			
		if(statusRealTestStart > 0){
			if(statusRealTestStart == 2 && timerRealTestStart==100){
				statusRealTestStart=0;
				timerRealTestStart=0;
				$('#wyca_by_step_config .modalRealTestResult .checkStart').show('fast');
			}else{
				$('#wyca_by_step_config .modalRealTestResult .checkStart').hide();
				delay = statusRealTestStart == 2 ? 1 : 200;
				timerRealTestStart++;
				if(timerRealTestStart == 101)timerRealTestStart=0;
				$('#wyca_by_step_config .startRealTestprogress .progress-bar').css('width', timerRealTestStart+'%').attr('aria-valuenow', timerRealTestStart); 
				setTimeout(TimerRealTestWycaByStep,delay,step);
			}
		}
	}else if(step=='end'){			
		if(statusRealTestEnd > 0){
			if(statusRealTestEnd == 2 && timerRealTestEnd==100){
				$('#wyca_by_step_config .modalRealTestResult .stop_move').css('opacity',1);
				statusRealTestEnd=0;
				timerRealTestEnd=0;
				$('#wyca_by_step_config .modalRealTestResult .checkEnd').show('fast');
			}else{
				$('#wyca_by_step_config .modalRealTestResult .checkEnd').hide();
				delay = statusRealTestEnd == 2 ? 1 : 200;
				timerRealTestEnd++;
				if(timerRealTestEnd == 101)timerRealTestEnd=0;
				$('#wyca_by_step_config .endRealTestprogress .progress-bar').css('width', timerRealTestEnd+'%').attr('aria-valuenow', timerRealTestEnd); 
				setTimeout(TimerRealTestWycaByStep,delay,step);
			}
		}
	}
}

function RealTestGotoStartWycaByStep(start,end){
	
	//console.log('Go to start');
	//console.log(start.data('type'),' id ',start.data('id'));
	
	switch(start.data('type')){
		case 'poi':
			//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
			wycaApi.on('onGoToPoiResult', function (data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					battery_lvl_start = battery_lvl_current; // STOCKAGE BATTERY LVL
					// GO TO END
					RealTestGotoEndWycaByStep(end);
				}else{
					$('#pages_wyca_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				if(end.data('type')!='poi') // On rebranche l'ancienne fonction
					wycaApi.on('onGoToPoiResult', onGoToPoiResult);
			});
			
			id = start.data('id');
			wycaApi.GoToPoi(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca_by_step .modalRealTestResult .start_point").show();
					
					$("#pages_wyca_by_step .modalRealTestResult .btn[data-dismiss='modal']").addClass('disabled');
					
					statusRealTestStart = 1;
					timerRealTestStart = 0;
					TimerRealTestWycaByStep('start');
					$('#wyca_by_step_config .modalRealTestResult .start_point .stop_move').css('opacity',1);
				}else{
					$('#pages_wyca_by_step .modalRealTestResult').modal('hide');
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
					RealTestGotoEndWycaByStep(end);
				}else{
					$('#pages_wyca_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				if(end.data('type')!='dock') // On rebranche l'ancienne fonction
					wycaApi.on('onGoToChargeResult', onGoToChargeResult);
			});
			
			id = start.data('id');
			
			wycaApi.GoToCharge(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca_by_step .modalRealTestResult .start_point").show();
					$("#pages_wyca_by_step .modalRealTestResult .btn[data-dismiss='modal']").addClass('disabled');
					statusRealTestStart = 1;
					timerRealTestStart = 0;
					TimerRealTestWycaByStep('start');
					$('#wyca_by_step_config .modalRealTestResult .start_point .stop_move').css('opacity',1);
				}else{
					$('#pages_wyca_by_step .modalRealTestResult').modal('hide');
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
					RealTestGotoEndWycaByStep(end);
				}else{
					$('#pages_wyca_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				if(end.data('type')!='augmented_pose') // On rebranche l'ancienne fonction
					wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
			});
			
			id = start.data('id');
			
			wycaApi.GoToAugmentedPose(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca_by_step .modalRealTestResult .start_point").show();
					$("#pages_wyca_by_step .modalRealTestResult .btn[data-dismiss='modal']").addClass('disabled');
					statusRealTestStart = 1;
					timerRealTestStart = 0;
					TimerRealTestWycaByStep('start');
					$('#wyca_by_step_config .modalRealTestResult .start_point .stop_move').css('opacity',1);
				}else{
					$('#pages_wyca_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}						
			})
		break;
	}
	
}

function RealTestGotoEndWycaByStep(end){
	//console.log('Go to end');
	//console.log(end.data('type'),' id ',end.data('id'));
	$('#wyca_by_step_config .modalRealTestResult .start_point .stop_move').css('opacity',0);
	statusRealTestStart = 2;
	statusRealTestEnd = 1;
	timerRealTestEnd = 0;
	TimerRealTestWycaByStep('end');						
	switch(end.data('type')){
		case 'poi':
			//AJOUTER ECOUTER RESULT + REBIND OLS FUNCTION FIN ECOUTEUR
			wycaApi.on('onGoToPoiResult', function (data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					statusRealTestEnd = 2;
					battery_lvl_needed = battery_lvl_start - battery_lvl_current; // STOCKAGE BATTERY LVL NEEDED
					textDisplay = battery_lvl_needed == 0 ? textLessThanOne : battery_lvl_needed;
					$('#pages_wyca_by_step .modalRealTestResult .battery_used').html(textDisplay);
					$("#pages_wyca_by_step .modalRealTestResult .result_RealTest").show();
				}else{
					$('#pages_wyca_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				$("#pages_wyca_by_step .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');
					
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToPoiResult', onGoToPoiResult);
			});
			
			id = end.data('id');
			
			wycaApi.GoToPoi(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca_by_step .modalRealTestResult .end_point").show()
				}else{
					$('#pages_wyca_by_step .modalRealTestResult').modal('hide');
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
					$('#pages_wyca_by_step .modalRealTestResult .battery_used').html(textDisplay);
					$("#pages_wyca_by_step .modalRealTestResult .result_RealTest").show();
				}else{
					$('#pages_wyca_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				$("#pages_wyca_by_step .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToChargeResult', onGoToChargeResult);
			});
			
			id = end.data('id');
			
			wycaApi.GoToCharge(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca_by_step .modalRealTestResult .end_point").show()
				}else{
					$('#pages_wyca_by_step .modalRealTestResult').modal('hide');
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
					$('#pages_wyca_by_step .modalRealTestResult .battery_used').html(textDisplay);
					$("#pages_wyca_by_step .modalRealTestResult .result_RealTest").show();
				}else{
					$('#pages_wyca_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}
				$("#pages_wyca_by_step .modalRealTestResult .btn[data-dismiss='modal']").removeClass('disabled');
				
				// On rebranche l'ancienne fonction
				wycaApi.on('onGoToAugmentedPoseResult', onGoToAugmentedPoseResult);
			});
			
			id = end.data('id');
			
			wycaApi.GoToAugmentedPose(id,function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					$("#pages_wyca_by_step .modalRealTestResult .end_point").show()
				}else{
					$('#pages_wyca_by_step .modalRealTestResult').modal('hide');
					ParseAPIAnswerError(data);
				}						
			})
		break;
	}
	// LAUNCH PROGRESS BAR ANIM
}		

//------------------- STEP MANAGERS ------------------------	

function RefreshDisplayManagerWycaByStep(){
	if($('#wyca_by_step_manager ul.list_managers li').length > 0){
		//HIDE TUILE et AFF NEXT
		$('#wyca_by_step_manager a.bAddManager').show();
		$('#wyca_by_step_manager .bValidManagerNext').show();
		
		$('#wyca_by_step_manager .bValidManagerSkip').hide();
		$('#wyca_by_step_manager a.bAddManager.bTuile').hide();
	}else{
		//AFF TUILE ET SKIP
		$('#wyca_by_step_manager a.bAddManager').hide();
		$('#wyca_by_step_manager .bValidManagerNext').hide();
		
		$('#wyca_by_step_manager .bValidManagerSkip').show();
		$('#wyca_by_step_manager a.bAddManager.bTuile').show();
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
	var canvasDessin = document.getElementById('wyca_by_step_mapping_canvas_result_trinary'),
	ctx = canvasDessin.getContext('2d');

	var idata = ctx.createImageData(width, height);
	idata.data.set(buffer);
	ctx.putImageData(idata, 0, 0);
	
	$('#wyca_by_step_mapping_fin .loading_fin_create_map').hide();
	$('#wyca_by_step_mapping_fin .bMappingSaveMap ').removeClass('disabled');
}	