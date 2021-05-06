function HideTuile(element)
{
	element.css({ transform: 'rotatey(90deg)', "z-index": "0" });
}

function ShowTuile(element)
{
	element.css({ transform: 'rotatey(0deg)', "z-index": "0" });
}

function change(state)
{
	if(state === null) { // initial page
	}
	else
	{
		if ($('.menu_groupe .active').attr('id') != state.current_groupe)
		{
			$('#'+state.current_groupe).click();
		}
		else
		{
			$('section:visible .bBackButton').click();
		}
	}
}
var minEBL = 5;
var minMBL = 6;
var defaultEBL = 15;
var defaultMBL = 20;

var vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', vh+'px');

window.addEventListener('resize', () => {
  // We execute the same script as before
  vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh+'px');
});

$(window).on("popstate", function(e) {
	if($('.page.active').attr('id') != 'install_by_step_edit_map')
		change(e.originalEvent.state);
});

(function(original) { // overwrite history.pushState so that it also calls
                      // the change function when called
    history.pushState = function(state) {
        //change(state);
        return original.apply(this, arguments);
    };
})(history.pushState);

var refresh_session_interval = null;
var do_refresh = false;
var do_refresh_continously = false;
function refresh_session_php(){
	if (do_refresh_continously || do_refresh)
	{
		$.ajax({
			type: "POST",
			url: 'ajax/refresh_session_php.php',
			data: {
			},
			dataType: 'json',
			success: function(data) {
			},
			error: function(e) {
				if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
					console.log(typeof(textErrorRefreshSession) != 'undefined'? textErrorRefreshSession : 'Error in refresh session');
					$('#modalErrorSession').modal('show');
					clearInterval(refresh_session_interval);
				}else
					console.log(typeof(textErrorRefreshSession) != 'undefined'? textErrorRefreshSession : 'Error in refresh session');
			}
		});
		do_refresh = false;
	}
}

$(document).ready(function(e) {
	
	refresh_session_interval = setInterval(refresh_session_php,30000);
	
	$('#bModalErrorSession').click(function(){
		window.location.href = 'logout.php'
	});
	
	$('#bHeaderInfo').attr('onClick',"$('.global_sub_page.active section.active .popupHelp').toggle('fast')");
	
	//IRO COLOPICKER
	$('.iro-colorpicker').each(function(){
		let preview = $(this).parent().parent().find('.preview_color');
		let input = $(this).parent().parent().find('input[type="text"]');
		let div = $(this);
		let color_init = $(this).data('color_init');
		let w = window.outerWidth - 75;
		w = w > 350 ? 350 : w;
		var colorPicker = new iro.ColorPicker(this, {
			wheelLightness:false,
			color: color_init,
			width: w,
		});
		
		preview.on('click',function(){
			if(validColor(input.val())){
				if(input.val().indexOf('rgb') < 0)
					colorPicker.color.hexString = input.val();
				else
					colorPicker.color.rgbString = input.val();
			}
			$('.iro-colorpicker').not(div).hide();
			if(div.css('display') == 'none')
				div.css('display','flex');
			else
				div.css('display','none');
		})
		input.on('click',function(){
			$('.iro-colorpicker').not(div).hide();
			if(div.css('display') == 'none')
				div.css('display','flex');
			else
				div.css('display','none');
		})
		input.on('change',function(){
			if(validColor(input.val())){
				if(input.val().indexOf('rgb') < 0)
					colorPicker.color.hexString = input.val();
				else
					colorPicker.color.rgbString = input.val();
			}
		})
		colorPicker.on(['color:init', 'color:change'], function(color) {
			preview.css('color',color.rgbString);
			input.val(color.rgbString);
		});
		
	})
	
	$('.title_section').html($('div.global_page.active > div.global_sub_page.active > section.page.active  > header > h2').text()); // TITLE INIT
	
	$('.popupHelp').click(function(e) {
        e.preventDefault();
		$(this).hide(200);
    });
	
	history.pushState({ current_groupe:$('.menu_groupe .active').attr('id'), current_page:'' }, $('.menu_groupe .active').html(), "/#"+$('.menu_groupe .active').html());
	
	$('.popup_error .panel-heading .fa-times').click(function(e) {
        e.preventDefault();
		$(this).closest('.popup_error').hide();
    });
	
	var elementCss = {
		'perspective': 'outerWidth',
		"transition": "all .2s ease-out"
	  };
	
	$('ul.tuiles a').css(elementCss);
	
	$('section:not(".active") .anim_tuiles').css({ transform: 'rotatey(90deg)', "z-index": "0" });
	
	$('body').on('click', '.is_checkbox', function(e) {
        e.preventDefault();
		if (!$(this).hasClass('no_update'))
	        $(this).toggleClass('checked');
    });
	
	$('#bCloseAlertWyca').click(function(e) {
        e.preventDefault();
		$('#alert_wyca p').html('');
		$('#alert_wyca').hide();
    });
	
	$('#bCloseWarningWyca').click(function(e) {
        e.preventDefault();
		$('#warning_wyca p').html('');
		$('#warning_wyca').hide();
		
		if($('#wyca_demo_mode_start_stop').css('display') == 'block')
			$('#wyca_demo_mode_start_stop').css('display','none');
    });
	
	$('#bCloseSuccessWyca').click(function(e) {
        e.preventDefault();
		$('#success_wyca p').html('');
		$('#success_wyca').hide();
    });
	
	$('#bCloseSuccessInfoWyca').click(function(e) {
        e.preventDefault();
		$('#success_info_wyca p').html('');
		$('#success_info_wyca').hide();
    });
	
	$('.bUndock').click(function(e) {
		
        e.preventDefault();
		wycaApi.on('onUndockResult', function (data){
			//console.log('onUndockResult',data);
			if (data.A != wycaApi.AnswerCode.NO_ERROR)
				ParseAPIAnswerError(data);
			// On rebranche l'ancienne fonction
			wycaApi.on('onUndockResult', onUndockResult);
		});
		
		wycaApi.Undock(function(data){
			if (data.A != wycaApi.AnswerCode.NO_ERROR)
				ParseAPIAnswerError(data);
		});
    });
	
	$('.btn_change_group').click(function(e) {
        e.preventDefault();
		
		history.pushState({ current_groupe:$(this).attr('id'), current_page:'' }, $(this).html(), "/#"+$(this).html());
		
		$('.menu_groupe .active').addClass('btn-default');
		$('.menu_groupe .active').removeClass('btn-danger btn-warning btn-primary btn-success active');
		
		$(this).removeClass('btn-default');
		$(this).addClass($(this).data('btn_class')+ ' active');
		
		$('.global_page.active').fadeOut(500, function() {
		   $(this).removeClass('active');
		});
		$('#'+$(this).data('groupe')).fadeIn(500, function() {
		   $(this).addClass('active');
		});
    });
	
	$('.bMoveRobotTest').click(function(e) {
        e.preventDefault();
		$(this).closest('.row').hide();
		$(this).closest('.h100vh_160').children('.teleop').show();
    });
	
	$('.bInitModalTest').click(function(e) {
        $(this).parent().find('.row').show();
		$(this).parent().find('.teleop').hide();
		$(this).parent().find('.bSaveMapTestPoi i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
		$(this).parent().find('.bSaveMapTestDock i').removeClass('fa-check fa-spinner fa-pulse fa-remove');
    });
	
	/* ------------------------- GESTION BTN GOTO -----------------------*/
	
	$( 'body' ).on( 'click', '.button_goto', function(e) {
		if(isDown)SetCurseurV2(xCentre, yCentre); // REINIT JOYSTICK TO MIDDLE
		let anim_show = true; // TRIGGER ANIM ? 
		let go_to_end = false;
		
		if($(this).hasClass('btn_back')){
			
			$('#bModalBackOk').attr('data-goto','');
			let target=$(this).data('goto');
			
			$('#bModalBackOk').attr('data-goto',target+'_fromBackBtn');
			$('#bModalBackOk').data('goto',target+'_fromBackBtn');
			
			$('#modalBack').modal('show');
			console.log('back',target)
			
			if(target == 'install_by_step_mapping'){ //UPDATE INSTALL STEP ON BACK FROM MAPPING
				$.ajax({
					type: "POST",
					url: 'ajax/install_by_step_site.php',
					data: {
					},
					dataType: 'json',
					success: function(data) {
					},
					error: function(e) {
						alert_wyca((typeof(textErrorStartMapping) != 'undefined'? textErrorStartMapping : 'Error start mapping') + ' ' + e.responseText);
					}
				});
			}
			
			if(target == 'install_by_step_sound'){ //UPDATE INSTALL STEP ON BACK FROM CREATE NEW SITE PROCESS NORMAL
				if((getCookie('create_new_site') != '' ? JSON.parse(getCookie('create_new_site')) : false ) || create_new_site){
					setCookie('create_new_site',false);
					create_new_site = false;
					$.ajax({
						type: "POST",
						url: 'ajax/install_by_step_finish.php',
						data: {
						},
						dataType: 'json',
						success: function(data) {
						},
						error: function(e) {
							alert_wyca((typeof(textErrorFinish) != 'undefined'? textErrorFinish : 'Error in finish') + ' ' + e.responseText);
						}
					});
					$('#modalBack').modal('hide');
					$('#pages_install_by_step').removeClass('active');
					$('#pages_install_normal').addClass('active');
					
					//AFFICHER QQ CHOSE
					$('section#install_normal_setup_sites').show('slow');
					$('.title_section').html($('section#install_normal_setup_sites > header > h2').text());
					if ($('#install_normal_setup_sites').is(':visible'))
					{
						GetSitesNormal();
					}
					
		
				}
			}
			
			if(target == 'install_by_step_new_site'){ //UPDATE INSTALL STEP ON BACK FROM CREATE NEW MAP PROCESS NORMAL
				if((getCookie('create_new_map') != '' ? JSON.parse(getCookie('create_new_map')) : false ) || create_new_map){
					setCookie('create_new_map',false);
					create_new_map = false;
					$.ajax({
						type: "POST",
						url: 'ajax/install_by_step_finish.php',
						data: {
						},
						dataType: 'json',
						success: function(data) {
						},
						error: function(e) {
							alert_wyca((typeof(textErrorFinish) != 'undefined'? textErrorFinish : 'Error in sound') + ' ' + e.responseText);
						}
					});
					$('#modalBack').modal('hide');
					$('#pages_install_by_step').removeClass('active');
					$('#pages_install_normal').addClass('active');
					
					//AFFICHER QQ CHOSE
					$('section#install_normal_setup_maps').show('slow');
					$('.title_section').html($('section#install_normal_setup_maps > header > h2').text());
					if ($('#install_normal_setup_maps').is(':visible'))
					{
						GetMapsNormal();
					}
					
		
				}
			}
		
			if(target == 'wyca_by_step_mapping'){ //UPDATE INSTALL STEP ON BACK FROM MAPPING
				$.ajax({
					type: "POST",
					url: 'ajax/install_by_step_site.php',
					data: {
					},
					dataType: 'json',
					success: function(data) {
					},
					error: function(e) {
						alert_wyca((typeof(textErrorStartMapping) != 'undefined'? textErrorStartMapping : 'Error start mapping') + ' ' + e.responseText);
					}
				});
			}
			
			if(target == 'wyca_by_step_sound'){ //UPDATE INSTALL STEP ON BACK FROM CREATE NEW SITE PROCESS NORMAL
				if((getCookie('create_new_site') != '' ? JSON.parse(getCookie('create_new_site')) : false ) || create_new_site){
					setCookie('create_new_site',false);
					create_new_site = false;
					$.ajax({
						type: "POST",
						url: 'ajax/install_by_step_finish.php',
						data: {
						},
						dataType: 'json',
						success: function(data) {
						},
						error: function(e) {
							alert_wyca((typeof(textErrorFinish) != 'undefined'? textErrorFinish : 'Error in finish') + ' ' + e.responseText);
						}
					});
					$('#modalBack').modal('hide');
					$('#pages_wyca_by_step').removeClass('active');
					$('#pages_wyca_normal').addClass('active');
					
					//AFFICHER QQ CHOSE
					$('section#wyca_setup_sites').show('slow');
					$('.title_section').html($('section#wyca_setup_sites > header > h2').text());
					if ($('#wyca_setup_sites').is(':visible'))
					{
						GetSitesWyca();
					}
					
		
				}
			}
			
		}
		else
		{
			if(typeof($(this).data('goto')) != 'undefined'){
				let fromBackBtn = false;
				if($(this).data('goto').includes('fromBackBtn')){
					let goTo =  $(this).data('goto').split('_fromBackBtn')[0];
					$(this).data('goto',goTo);
					fromBackBtn = true;
				}
				e.preventDefault();
				history.pushState({ current_groupe:$('.menu_groupe .active').attr('id'), current_page:$(this).data('goto')}, $(this).data('goto'), "/#"+$(this).data('goto'));
				next = $(this).data('goto');
				
				//CHECK JOYSTICK TO START/STOP TELEOP ON NEXT PAGE
				if($('#'+next).find('.joystickDiv').length > 0){
					if(!teleopEnable || teleopEnable == 'not_init'){
						teleopEnable = true;
						wycaApi.TeleopStart();
					}
				}
				else
				{
					if(teleopEnable || teleopEnable == 'not_init'){
						teleopEnable = false;
						wycaApi.TeleopStop();
					}
				}
				
				$('#modalBack').modal('hide');
				let section_active = $('section.active');
				$('section.active').removeClass('active');
				$('section.page').hide();
				
				$('#bHeaderInfo').attr('onClick',""); // REINIT (i) icone
				$('#bHeaderInfo').attr('onClick',"$('#"+next+" .popupHelp').toggle('fast')");
				
				console.log('next ',next);
				
				//BYSTEP
				
				if (next == 'install_by_step_tops') InitTopsByStep();
				if (next == 'install_by_step_top') InitTopsActiveByStep();
				if (next == 'install_by_step_check') InitCheckByStep();		
				if (next == 'install_by_step_sound') InitSoundByStep();		
				if (next == 'install_by_step_wifi') InitInstallWifiPageByStep();
				if (next == 'install_by_step_config')
				{
					if((getCookie('create_new_map') != '' ? JSON.parse(getCookie('create_new_map')) : false )|| create_new_map){
						setCookie('create_new_map',false);
						create_new_map = false;
						$.ajax({
							type: "POST",
							url: 'ajax/install_by_step_finish.php',
							data: {
							},
							dataType: 'json',
							success: function(data) {
							},
							error: function(e) {
								alert_wyca((typeof(textErrorFinish) != 'undefined'? textErrorFinish : 'Error in sound') + ' ' + e.responseText);
							}
						});
						go_to_end = true;
						$('#pages_install_by_step').removeClass('active');
						$('#pages_install_normal').addClass('active');
						
						//AFFICHER QQ CHOSE
						$('section#install_normal_setup_maps').show('slow');
						$('.title_section').html($('section#install_normal_setup_maps > header > h2').text());
						if ($('#install_normal_setup_maps').is(':visible'))
						{
							GetMapsNormal();
						}
						
					}else
						GetConfigurationsByStep();
				}
				if (next == 'install_by_step_mapping') InitMappingByStep();
				if (next == 'install_by_step_import_site') InitSiteImportByStep();
				
				if (next == 'install_by_step_site_master_dock' && fromBackBtn) InitMasterDockByStep('back');
				if (next == 'install_by_step_site_master_dock' && !fromBackBtn) InitMasterDockByStep();
				if (next == 'install_by_step_site_map' && fromBackBtn) InitSiteSelectMapByStep('back');
				if (next == 'install_by_step_site_map' && !fromBackBtn) InitSiteSelectMapByStep();
				
				if (next == 'install_by_step_edit_map')GetInfosCurrentMapByStep();
				if (next == 'install_by_step_mapping_fin'){
					if(typeof(window.site_name) != 'undefined' && window.site_name != ""){
						$('#install_by_step_mapping_from_name').val(window.site_name)
					}else{
						wycaApi.GetCurrentSite(function(data){
							if (data.A == wycaApi.AnswerCode.NO_ERROR){
								window.site_name=data.D.name;
								$('#install_by_step_mapping_from_name').val(window.site_name)
							}
						})
					}
				}
				
				if (next == 'install_by_step_maintenance'){
					InitMaintenanceByStep();
					if(create_new_site){
						anim_show = false;
						if($(this).attr('id') == 'bModalBackOk')
							setTimeout(function(){$('#install_by_step_maintenance .bBackButton').click()},100);
						else
							setTimeout(function(){$('#install_by_step_maintenance .install_by_step_maintenance_next').click()},100);
					}
				}
				if (next == 'install_by_step_manager') {
					GetManagersByStep();
					$('#bHeaderInfo').attr('onClick',"$('#install_by_step_manager .modalHelpManager').modal('show')");
				}
				
				if (next == 'install_by_step_service_book') GetServiceBooksByStep();
				
				// NORMAL
				
				if (next == 'install_normal_switch_map_landmark') GetSwitchMapsNormal();
				if (next == 'install_normal_setup_sites') GetSitesNormal();
				if (next == 'install_normal_setup_export') GetSitesForExportNormal();
				if (next == 'install_normal_setup_import') InitSiteImportNormal();
				if (next == 'install_normal_setup_download_map') GetMapsForDownloadNormal();
				if (next == 'install_normal_setup_tops') InitTopsNormal();
				if (next == 'install_normal_setup_top') InitTopsActiveNormal();
				if (next == 'install_normal_setup_maps') GetMapsNormal();
				if (next == 'install_normal_setup_config') GetConfigurationsNormal();
				if (next == 'install_normal_setup_sound') InitSoundNormal();
				if (next == 'install_normal_setup_wifi') InitInstallWifiPageNormal();
				if (next == 'install_normal_manager') {
					GetManagersNormal();
					$('#bHeaderInfo').attr('onClick',"$('#install_normal_manager .modalHelpManager').modal('show')");
				}
				if (next == 'install_normal_user') GetUsersNormal();
				if (next == 'install_normal_service_book') GetServiceBooksNormal();
				if (next == 'install_normal_edit_map') GetInfosCurrentMapNormal();
				if (next == 'install_normal_setup_trinary') NormalInitTrinary();
				
				// WYCA
				
				if (next == 'wyca_switch_map_landmark') GetSwitchMapsWyca();
				if (next == 'wyca_setup_sites') GetSitesWyca();
				if (next == 'wyca_setup_maps') GetMapsWyca();
				if (next == 'wyca_setup_sound') InitSoundWyca();
				if (next == 'wyca_setup_export') GetSitesForExportWyca();
				if (next == 'wyca_setup_import') InitSiteImportWyca();
				if (next == 'wyca_setup_download_map') GetMapsForDownloadWyca();
				if (next == 'wyca_setup_tops') InitTopsWyca();
				if (next == 'wyca_setup_top') InitTopsActiveWyca();
				if (next == 'wyca_setup_config') GetConfigurationsWyca();
				if (next == 'wyca_setup_wifi') InitInstallWifiPageWyca();
				if (next == 'wyca_manager') {
					GetManagersWyca();
					$('#bHeaderInfo').attr('onClick',"$('#wyca_manager .modalHelpManager').modal('show')");
				}
				if (next == 'wyca_user') GetUsersWyca();
				if (next == 'wyca_wyca') GetWycasWyca();
				if (next == 'wyca_installer') GetInstallersWyca();
				if (next == 'wyca_service_book') GetServiceBooksWyca();
				if (next == 'wyca_edit_map') GetInfosCurrentMapWyca();
				if (next == 'wyca_setup_trinary') WycaInitTrinary();
				
				if (next == 'wyca_demo_mode_config') InitWycaDemo();
				if (next == 'wyca_demo_mode_start_stop') InitWycaDemoState();
				
				//WYCA BYSTEP
				
				if (next == 'wyca_by_step_tops') InitTopsWycaByStep();
				if (next == 'wyca_by_step_top') InitTopsActiveWycaByStep();
				if (next == 'wyca_by_step_check') InitCheckWycaByStep();		
				if (next == 'wyca_by_step_sound') InitSoundWycaByStep();		
				if (next == 'wyca_by_step_wifi') InitInstallWifiPageWycaByStep();
				if (next == 'wyca_by_step_config') GetConfigurationsWycaByStep();
				if (next == 'wyca_by_step_mapping') InitMappingWycaByStep();
				if (next == 'wyca_by_step_import_site') InitSiteImportWycaByStep();
				
				if (next == 'wyca_by_step_site_master_dock' && fromBackBtn) InitMasterDockWycaByStep('back');
				if (next == 'wyca_by_step_site_master_dock' && !fromBackBtn) InitMasterDockWycaByStep();
				if (next == 'wyca_by_step_site_map' && fromBackBtn) InitSiteSelectMapWycaByStep('back');
				if (next == 'wyca_by_step_site_map' && !fromBackBtn) InitSiteSelectMapWycaByStep();
				
				if (next == 'wyca_by_step_edit_map') GetInfosCurrentMapWycaByStep();
				if (next == 'wyca_by_step_mapping_fin'){
					if(typeof(window.site_name) != 'undefined' && window.site_name != ""){
						$('#wyca_by_step_mapping_from_name').val(window.site_name)
					}else{
						wycaApi.GetCurrentSite(function(data){
							if (data.A == wycaApi.AnswerCode.NO_ERROR){
								window.site_name=data.D.name;
								$('#wyca_by_step_mapping_from_name').val(window.site_name)
							}
						})
					}
				}
				
				if (next == 'wyca_by_step_maintenance'){
					InitMaintenanceWycaByStep();
					if(create_new_site){
						anim_show = false;
						if($(this).attr('id') == 'bModalBackOk')
							setTimeout(function(){$('#wyca_by_step_maintenance .bBackButton').click()},100);
						else
							setTimeout(function(){$('#wyca_by_step_maintenance .wyca_by_step_maintenance_next').click()},100);
					}
				}
				
				if (next == 'wyca_by_step_manager') {
					GetManagersWycaByStep();
					$('#bHeaderInfo').attr('onClick',"$('#wyca_by_step_manager .modalHelpManager').modal('show')");
				}
				
				if (next == 'wyca_by_step_service_book') GetServiceBooksWycaByStep();
				
				// MANAGER
				if (next == 'manager_switch_map_landmark') GetSwitchMapsManager();
				if (next == 'manager_setup_sites') GetSitesManager();
				if (next == 'manager_setup_maps') GetMapsManager();
				if (next == 'manager_edit_map') GetInfosCurrentMapManager();
				if (next == 'manager_top') InitTopsActiveManager();
				if (next == 'manager_users') GetUsersManager();
				
				// USER
				
				if (next == 'user_edit_map') GetInfosCurrentMapUser();
				
				// CHECK AND REFRESH PHP SESSION
				
				if(next.includes('install_by_step') || next.includes('wyca_by_step')){
					do_refresh_continously = true;
				}else{
					if (do_refresh_continously)
					{
						do_refresh_continously = false;
					}
					else
					{
						do_refresh = true;
						refresh_session_php();
					}
				}
				if(!go_to_end){
					// Anim HIDE current page
					var startShowAfter = 0;
					if ($(this).closest('section').hasClass('hmi_tuile') && anim_show )
					{
						nbTuiles = $(this).closest('section').find('.anim_tuiles').length;
						delay = 70;
						for (i=1; i <= nbTuiles; i++)
						{
							setTimeout(HideTuile, delay * (i - 1), $(this).closest('section').find('.tuile' + (nbTuiles - i + 1)));
						}
						
						startShowAfter = nbTuiles * 70;
						$(this).closest('section').delay(startShowAfter+250).fadeOut(500, function() {
						   $(this).removeClass('active');
						});
					}
					else
					{
						$(this).closest('section').fadeOut(500);
					}
						
					// Anim SHOW next page
					next = $(this).data('goto');
					if ($('#'+next).hasClass('hmi_tuile') && anim_show)
					{
						nbTuiles = $('#'+next).find('.anim_tuiles').length;
						delay = 70;
						for (i=1; i <= nbTuiles; i++)
						{
							setTimeout(ShowTuile, 700 + delay * (i - 1), $('#'+next).find('.tuile' + i));
						}
						
						$('#'+next).delay(startShowAfter+250).fadeIn(500, function() {					
							$(this).addClass('active');
						});
					}
					else
					{
						$('#'+next).delay(startShowAfter).fadeIn(500, function() {
							$(this).addClass('active');
						});
					}
					
					// ADD TITLE CHANGE 
						
					$('.title_section').html($('#'+next+' > header > h2').text());
				}
			}
		}
    });
	
	/* ------------------------- GESTION BTN GOTO -----------------------*/
	
	/* CHECK EBL/MBL INPUTS */
	
	//EBL
	$('input[name="i_level_min_gotocharge"]').change(function(){
		let val = parseInt($(this).val());
		if(isNaN(val)){
			val = (typeof(defaultEBL) != 'undefined' ? defaultEBL : 15);
		}else{
			val = val < (typeof(minEBL) != 'undefined' ? minEBL : 6) ? (typeof(minEBL) != 'undefined' ? minEBL : 6) : val;
			val = val > 100 ? 100 : val;
		}
		if(parseInt($(this).val()) != val)
			$(this).val(val);
	})
	
	//MBL
	$('input[name="i_level_min_dotask"]').change(function(){
		let val = parseInt($(this).val());
		if(isNaN(val)){
			val = (typeof(defaultMBL) != 'undefined' ? defaultMBL : 20);
		}else{
			val = val < (typeof(minMBL) != 'undefined' ? minMBL : 6) ? (typeof(minMBL) != 'undefined' ? minMBL : 6) : val;
			val = val > 100 ? 100 : val;
		}
		if(parseInt($(this).val()) != val)
			$(this).val(val);
	})
	
	$(document).on('touchstart', '.ui-slider-handle', function(event) {
		var self = this;
	
		// Ignore the event if another widget is already being handled
		if (touchHandled) {
		  return;
		}
	
		// Set the flag to prevent other widgets from inheriting the touch event
		touchHandled = true;
	
		// Track movement to determine if interaction was a click
		self._touchMoved = false;
	
		// Simulate the mouseover event
		simulateMouseEvent(event, 'mouseover');
	
		// Simulate the mousemove event
		simulateMouseEvent(event, 'mousemove');
	
		// Simulate the mousedown event
		simulateMouseEvent(event, 'mousedown');
	});
	
	$(document).on('touchmove', '.ui-slider-handle', function(event) {
		// Ignore event if not handled
		if (!touchHandled) {
		  return;
		}
	
		// Interaction was not a click
		this._touchMoved = true;
	
		// Simulate the mousemove event
		simulateMouseEvent(event, 'mousemove');
	});
	
	$(document).on('touchend', '.ui-slider-handle', function(event) {
		// Ignore event if not handled
		if (!touchHandled) {
		  return;
		}
	
		// Simulate the mouseup event
		simulateMouseEvent(event, 'mouseup');
	
		// Simulate the mouseout event
		simulateMouseEvent(event, 'mouseout');
	
		// If the touch interaction did not move, it should trigger a click
		if (!this._touchMoved) {
	
		  // Simulate the click event
		  simulateMouseEvent(event, 'click');
		}
	
		// Unset the flag to allow other widgets to inherit the touch event
		touchHandled = false;
	});
			
	//GESTION BUTTON +/- ON SLIDERS
	
	//CLICK
	$('.btn_slider_plus').on('touchstart',function(){
		let step = 1;
		let input;
		input = $(this).parent().find('input');
		input.val(parseFloat(input.val())+step);
		input.change();
	})
	//LONGPRESS
	$('.btn_slider_plus').on('touchstart',function(){
		let step = 1;
		let input;
		input = $(this).parent().find('input');
		window.timer_btn_slider = setTimeout(function(){add_sub_input('+',step,input,0)},500);
		return false;		
	}).on('touchend',function(){
		clearTimeout(window.timer_btn_slider);
		return false;		
	}).on('touchleave',function(){
		clearTimeout(window.timer_btn_slider);
		return false;		
	}).on('touchcancel',function(){
		clearTimeout(window.timer_btn_slider);
		return false;		
	});
	
	//CLICK
	$('.btn_slider_minus').on('touchstart',function(){
		let step = 1;
		let input;
		input = $(this).parent().find('input');
		input.val(parseFloat(input.val())-step);
		input.change();
	})
	//LONGPRESS
	$('.btn_slider_minus').on('touchstart',function(){
		let step = 1;
		let input;
		input = $(this).parent().find('input');
		window.timer_btn_slider = setTimeout(function(){add_sub_input('-',step,input,0)},500);
		return false;		
	}).on('touchend',function(){
		clearTimeout(window.timer_btn_slider);
		return false;		
	}).on('touchleave',function(){
		clearTimeout(window.timer_btn_slider);
		return false;		
	}).on('touchcancel',function(){
		clearTimeout(window.timer_btn_slider);
		return false;		
	});
	
	function add_sub_input(bool,step,input,iterations){
		if(bool == '+'){
			input.val(parseFloat(input.val())+step);
		}else{
			input.val(parseFloat(input.val())-step);
		}
		input.change();
		iterations++;
		let delay = (500/iterations) < 50 ? 50 : 500/iterations;
		window.timer_btn_slider = setTimeout(function(){add_sub_input(bool,step,input,iterations)},delay);
	}
	//UPDATE SLIDER 
	$('.ui-slider > input[type=hidden]').change(function(){
		let slider =  $(this).parent();
		let opt = slider.data('plugin-options');
		let max = opt.max || 100;
		let min = opt.min || 0;
		let value = $(this).val();
		value > max ? value = max : '';
		value < min ? value = min : '';
		$(this).val(value);
		let etendue = max-min;
		let temp = (value-min)*100/etendue;
		slider.data('plugin-options').value=value;
		slider.find('.ui-slider-range').css('width',temp+'%');
		slider.find('.ui-slider-handle').css('left',temp+'%');
	})	
	//CONFIRM DELETE
	$(document).on('click', '.confirm_delete', function(e) {
		e.preventDefault();
		if($(this)[0].nodeName == 'A'){
			currentDeleteId = $(this).parent().attr('id');
			
			if($(this).parent().parent().hasClass('list_wycas') && currentDeleteId.split('_elem_')[1] == user_id) //IF DELETE CURRENT CONNECTED WYCA ACCOUNT
				$('#modalConfirmDeleteCurrentAccount').modal('show');
			else{
				$('#modalConfirmDelete').modal('show');
				let txt_element = $(this).parent().find('.societe').text();
				if(txt_element != ''){
					tempConfirmDelete = $('#modalConfirmDelete').find('h3').text();
					$('#modalConfirmDelete').find('h3').html(tempConfirmDelete + '<br><br><span>' + txt_element + '</span>');
				}
			}
		}
	})
	
	$('#bModalConfirmDeleteOk').click(function(e){
		if(currentDeleteId !=''){
			$('#'+currentDeleteId).find('.btn_confirm_delete').click();
			currentDeleteId = '';
			$('#modalConfirmDelete').find('h3').html(tempConfirmDelete);
			tempConfirmDelete = '';
		}
	})
	
	$('#bModalConfirmDeleteClose').click(function(e){
		$('#modalConfirmDelete').find('h3').html(tempConfirmDelete);
		tempConfirmDelete = '';
	})
	
	$('#bModalConfirmDeleteCurrentAccountOk').click(function(e){
		if(currentDeleteId !=''){
			$('#'+currentDeleteId).find('.btn_confirm_delete').click();
			currentDeleteId = '';
			
		}
		location.href = 'logout.php';
	})
	
});

var tempConfirmDelete = "";

/* USER GROUP FUNCTIONS */

// SITE

function InitSiteImportWyca()
{
	$('#pages_wyca_normal .filename_import_site').html('');
	$('#pages_wyca_normal .filename_import_site').hide();
	$('#pages_wyca_normal .file_import_site_wrapper').css('background-color','#589fb26e');
	$('#pages_wyca_normal .file_import_site').val('');
	
	$('#pages_wyca_normal .wyca_setup_import_loading').hide();
	$('#pages_wyca_normal .wyca_setup_import_content').show();
	
	$('#pages_wyca_normal #wyca_normal_setup_import .modalSelectMap').modal('hide');
	$('#pages_wyca_normal #wyca_normal_setup_import .modalMasterDock').modal('hide');

}

function InitSiteImportWycaByStep()
{
	$('#pages_wyca_by_step .filename_import_site').html('');
	$('#pages_wyca_by_step .filename_import_site').hide();
	$('#pages_wyca_by_step .file_import_site_wrapper').css('background-color','#589fb26e');
	$('#pages_wyca_by_step .file_import_site').val('');
	
	$('#pages_wyca_by_step .wyca_by_step_setup_import_loading').hide();
	$('#pages_wyca_by_step .wyca_by_step_setup_import_content').show();
}

function InitSiteImportNormal()
{
	$('#pages_install_normal .filename_import_site').html('');
	$('#pages_install_normal .filename_import_site').hide();
	$('#pages_install_normal .file_import_site_wrapper').css('background-color','#589fb26e');
	$('#pages_install_normal .file_import_site').val('');
	
	$('#pages_install_normal .install_normal_setup_import_loading').hide();
	$('#pages_install_normal .install_normal_setup_import_content').show();
	
	$('#pages_install_normal #install_normal_setup_import .modalSelectMap').modal('hide');
	$('#pages_install_normal #install_normal_setup_import .modalMasterDock').modal('hide');

}

function InitSiteImportByStep()
{
	$('#pages_install_by_step .filename_import_site').html('');
	$('#pages_install_by_step .filename_import_site').hide();
	$('#pages_install_by_step .file_import_site_wrapper').css('background-color','#589fb26e');
	$('#pages_install_by_step .file_import_site').val('');
	
	$('#pages_install_by_step .install_by_step_setup_import_loading').hide();
	$('#pages_install_by_step .install_by_step_setup_import_content').show();
}

// SELECT MAP IMPORT SITE

function InitSiteImportSelectMapWyca()
{
	$('#pages_wyca_normal #wyca_setup_import .modalSelectMap #ImportSiteMapList').html('');
	$('#pages_wyca_normal #wyca_setup_import .modalSelectMap').modal('show');

	if (wycaApi.websocketAuthed){
		wycaApi.GetCurrentSite(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR){
				id_site = data.D.id_site;
				wycaApi.GetMapsList(id_site,function(data){
					if (data.A != wycaApi.AnswerCode.NO_ERROR){
						InitSiteImportWyca();
						ParseAPIAnswerError(data,textErrorGetMaps);
					}
					else
					{
						$('#pages_wyca_normal #wyca_setup_import .modalSelectMap #ImportSiteMapList').html('');
						$.each(data.D,function(idx,item){
							if(item.name != ''){
								let map_item="";
								map_item+='<div class="col-xs-6 text-center">';
								map_item+='	<div class="SelectMapItem btn bTuile" id="'+item.id_map+'">';
								map_item+='		<i class="fas fa-map-marked-alt"></i>';
								map_item+='		<p class="mapname">'+item.name+'</p>';
								map_item+='   </div>';
								map_item+='</div>';
								$('#pages_wyca_normal #wyca_setup_import .modalSelectMap #ImportSiteMapList').append(map_item);
							}
						});
						$('#pages_wyca_normal #wyca_setup_import .modalSelectMap').modal('show');
					}
				});
			}else{
				InitSiteImportWyca();
				ParseAPIAnswerError(data,textErrorGetSite);
			}
		})
	}else{
		setTimeout(InitSiteImportSelectMapWyca, 500);
	}

}


function InitSiteImportSelectMapNormal()
{
	$('#pages_install_normal #install_normal_setup_import .modalSelectMap #ImportSiteMapList').html('');
	$('#pages_install_normal #install_normal_setup_import .modalSelectMap').modal('show');

	if (wycaApi.websocketAuthed){
		wycaApi.GetCurrentSite(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR){
				id_site = data.D.id_site;
				wycaApi.GetMapsList(id_site,function(data){
					if (data.A != wycaApi.AnswerCode.NO_ERROR){
						InitSiteImportNormal();
						ParseAPIAnswerError(data,textErrorGetMaps);
					}
					else
					{
						$('#pages_install_normal #install_normal_setup_import .modalSelectMap #ImportSiteMapList').html('');
						$.each(data.D,function(idx,item){
							if(item.name != ''){
								let map_item="";
								map_item+='<div class="col-xs-6 text-center">';
								map_item+='	<div class="SelectMapItem btn bTuile" id="'+item.id_map+'">';
								map_item+='		<i class="fas fa-map-marked-alt"></i>';
								map_item+='		<p class="mapname">'+item.name+'</p>';
								map_item+='   </div>';
								map_item+='</div>';
								$('#pages_install_normal #install_normal_setup_import .modalSelectMap #ImportSiteMapList').append(map_item);
							}
						});
						$('#pages_install_normal #install_normal_setup_import .modalSelectMap').modal('show');
					}
				});
			}else{
				InitSiteImportNormal();
				ParseAPIAnswerError(data,textErrorGetSite);
			}
		})
	}else{
		setTimeout(InitSiteImportSelectMapNormal, 500);
	}

}

// MASTER DOCK

function InitMasterDockWyca()
{
	$('#pages_wyca_normal .modalMasterDock #MasterDockList').html('');
	$('#pages_wyca_normal .modalMasterDock .MasterDock_loading').show();
	$('#pages_wyca_normal .modalMasterDock').modal('show');
	
	if(docks != 'undefined' && docks.length > 1){
		$.each(docks,function(idx,item){
			let master_dock="";
			master_dock+='<div class="col-xs-6 text-center">';
			master_dock+='	<div class="MasterDockItem btn bTuile" id="'+item.id_docking_station+'">';
			master_dock+= item.is_master?'		<i class="fas fa-asterisk" ></i>':'';
			master_dock+='		<i class="fas fa-charging-station"></i>';
			master_dock+='		<p class="dockname">'+item.name+'</p>';
			master_dock+='   </div>';
			master_dock+='</div>';
			$('#pages_wyca_normal #MasterDockList').append(master_dock);
		});
		$('#pages_wyca_normal .MasterDock_loading').hide();
	}else{
		if (wycaApi.websocketAuthed){
			wycaApi.GetCurrentMapData(function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					if(data.D.docks.length <= 1){
						$('#pages_wyca_normal #wyca_setup_import .bImportSiteBack').click();
					}else{
						id_map = data.D.id_map;
						id_map_last = data.D.id_map;
						forbiddens = data.D.forbiddens;
						areas = data.D.areas;
						docks = data.D.docks;
						pois = data.D.pois;
						augmented_poses = data.D.augmented_poses;
						
						$.each(docks,function(idx,item){
							let master_dock="";
							master_dock+='<div class="col-xs-6 text-center">';
							master_dock+='	<div class="MasterDockItem btn bTuile" id="'+item.id_docking_station+'">';
							master_dock+= item.is_master?'		<i class="fas fa-asterisk" ></i>':'';
							master_dock+='		<i class="fas fa-charging-station"></i>';
							master_dock+='		<p class="dockname">'+item.name+'</p>';
							master_dock+='   </div>';
							master_dock+='</div>';
							$('#pages_wyca_normal #MasterDockList').append(master_dock);
						});
						$('#pages_wyca_normal .MasterDock_loading').hide();
					}
				}else{
					ParseAPIAnswerError(data);
				}
			})
		}else{
			setTimeout(InitMasterDockWyca, 500);
		}
	}
}

function InitMasterDockWycaByStep(back = false)
{
	$('#pages_wyca_by_step #MasterDockList').html('');
	$('#pages_wyca_by_step .MasterDock_loading').show();
	
	if(docks != 'undefined' && docks.length > 1){
		$.each(docks,function(idx,item){
			let master_dock="";
			master_dock+='<div class="col-xs-6 text-center">';
			master_dock+='	<div class="MasterDockItem btn bTuile" id="'+item.id_docking_station+'">';
			master_dock+= item.is_master?'		<i class="fas fa-asterisk" ></i>':'';
			master_dock+='		<i class="fas fa-charging-station"></i>';
			master_dock+='		<p class="dockname">'+item.name+'</p>';
			master_dock+='   </div>';
			master_dock+='</div>';
			$('#pages_wyca_by_step #MasterDockList').append(master_dock);
		});
		$('#pages_wyca_by_step .MasterDock_loading').hide();
	}else{
		if (wycaApi.websocketAuthed){
			wycaApi.GetCurrentMapData(function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					if(data.D.docks.length <= 1){
						if(!back)
							$('.wyca_by_step_site_master_dock_next').click();
						else
							$('#wyca_by_step_site_master_dock .bBackButton').click();
					}else{
						id_map = data.D.id_map;
						id_map_last = data.D.id_map;
						forbiddens = data.D.forbiddens;
						areas = data.D.areas;
						docks = data.D.docks;
						pois = data.D.pois;
						augmented_poses = data.D.augmented_poses;
						
						$.each(docks,function(idx,item){
							let master_dock="";
							master_dock+='<div class="col-xs-6 text-center">';
							master_dock+='	<div class="MasterDockItem btn bTuile" id="'+item.id_docking_station+'">';
							master_dock+= item.is_master?'		<i class="fas fa-asterisk" ></i>':'';
							master_dock+='		<i class="fas fa-charging-station"></i>';
							master_dock+='		<p class="dockname">'+item.name+'</p>';
							master_dock+='   </div>';
							master_dock+='</div>';
							$('#pages_wyca_by_step #MasterDockList').append(master_dock);
						});
						$('#pages_wyca_by_step .MasterDock_loading').hide();
					}
				}else{
					ParseAPIAnswerError(data);
				}
			})
		}else{
			setTimeout(InitMasterDockWycaByStep, 500);
		}
	}
	
}

function InitMasterDockNormal()
{
	$('#pages_install_normal .modalMasterDock #MasterDockList').html('');
	$('#pages_install_normal .modalMasterDock .MasterDock_loading').show();
	$('#pages_install_normal .modalMasterDock').modal('show');
	
	if(docks != 'undefined' && docks.length > 1){
		$.each(docks,function(idx,item){
			let master_dock="";
			master_dock+='<div class="col-xs-6 text-center">';
			master_dock+='	<div class="MasterDockItem btn bTuile" id="'+item.id_docking_station+'">';
			master_dock+= item.is_master?'		<i class="fas fa-asterisk" ></i>':'';
			master_dock+='		<i class="fas fa-charging-station"></i>';
			master_dock+='		<p class="dockname">'+item.name+'</p>';
			master_dock+='   </div>';
			master_dock+='</div>';
			$('#pages_install_normal #MasterDockList').append(master_dock);
		});
		$('#pages_install_normal .MasterDock_loading').hide();
	}else{
		if (wycaApi.websocketAuthed){
			wycaApi.GetCurrentMapData(function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					if(data.D.docks.length <= 1){
						$('#pages_install_normal #install_normal_setup_import .bImportSiteBack').click();
					}else{
						id_map = data.D.id_map;
						id_map_last = data.D.id_map;
						forbiddens = data.D.forbiddens;
						areas = data.D.areas;
						docks = data.D.docks;
						pois = data.D.pois;
						augmented_poses = data.D.augmented_poses;
						
						$.each(docks,function(idx,item){
							let master_dock="";
							master_dock+='<div class="col-xs-6 text-center">';
							master_dock+='	<div class="MasterDockItem btn bTuile" id="'+item.id_docking_station+'">';
							master_dock+= item.is_master?'		<i class="fas fa-asterisk" ></i>':'';
							master_dock+='		<i class="fas fa-charging-station"></i>';
							master_dock+='		<p class="dockname">'+item.name+'</p>';
							master_dock+='   </div>';
							master_dock+='</div>';
							$('#pages_install_normal #MasterDockList').append(master_dock);
						});
						$('#pages_install_normal .MasterDock_loading').hide();
					}
				}else{
					ParseAPIAnswerError(data);
				}
			})
		}else{
			setTimeout(InitMasterDockNormal, 500);
		}
	}
}

function InitMasterDockByStep(back = false)
{
	$('#pages_install_by_step #MasterDockList').html('');
	$('#pages_install_by_step .MasterDock_loading').show();
	
	if(docks != 'undefined' && docks.length > 1){
		$.each(docks,function(idx,item){
			let master_dock="";
			master_dock+='<div class="col-xs-6 text-center">';
			master_dock+='	<div class="MasterDockItem btn bTuile" id="'+item.id_docking_station+'">';
			master_dock+= item.is_master?'		<i class="fas fa-asterisk" ></i>':'';
			master_dock+='		<i class="fas fa-charging-station"></i>';
			master_dock+='		<p class="dockname">'+item.name+'</p>';
			master_dock+='   </div>';
			master_dock+='</div>';
			$('#pages_install_by_step #MasterDockList').append(master_dock);
		});
		$('#pages_install_by_step .MasterDock_loading').hide();
	}else{
		if (wycaApi.websocketAuthed){
			wycaApi.GetCurrentMapData(function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR){
					if(data.D.docks.length <= 1){
						if(!back)
							$('.install_by_step_site_master_dock_next').click();
						else
							$('#install_by_step_site_master_dock .bBackButton').click();
					}else{
						id_map = data.D.id_map;
						id_map_last = data.D.id_map;
						forbiddens = data.D.forbiddens;
						areas = data.D.areas;
						docks = data.D.docks;
						pois = data.D.pois;
						augmented_poses = data.D.augmented_poses;
						
						$.each(docks,function(idx,item){
							let master_dock="";
							master_dock+='<div class="col-xs-6 text-center">';
							master_dock+='	<div class="MasterDockItem btn bTuile" id="'+item.id_docking_station+'">';
							master_dock+= item.is_master?'		<i class="fas fa-asterisk" ></i>':'';
							master_dock+='		<i class="fas fa-charging-station"></i>';
							master_dock+='		<p class="dockname">'+item.name+'</p>';
							master_dock+='   </div>';
							master_dock+='</div>';
							$('#pages_install_by_step #MasterDockList').append(master_dock);
						});
						$('#pages_install_by_step .MasterDock_loading').hide();
					}
				}else{
					ParseAPIAnswerError(data);
				}
			})
		}else{
			setTimeout(InitMasterDockByStep, 500);
		}
	}
	
}

var current_site = {};

function GetSitesWyca()
{
	$('.wyca_setup_sites_loading').show();
	$('#wyca_setup_sites .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		
		wycaApi.GetCurrentSite(function(data) {
			current_site = data.D;
			//console.log(current_site);
			wycaApi.GetSitesList(function(data) {
				
				$('#wyca_setup_sites .list_sites').html('');
				
				if (data.D != undefined)
				$.each(data.D,function(index, value){
					let active = current_site.id_site == value.id_site?'active':'';  //'+active+'
					$('#wyca_setup_sites .list_sites').append('' +
						'<li id="wyca_setup_sites_list_site_elem_'+value.id_site+'" data-id_site="'+value.id_site+'">'+
						'	<span class="societe '+active+'">'+value.name+'</span>'+
						(current_site.id_site != value.id_site?'	<a href="#" class="bSiteDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>':'')+
						(current_site.id_site != value.id_site?'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>':'')+
						(current_site.id_site != value.id_site?'	<a href="#" class="bSiteSetCurrentElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-check"></i></a>':'')+
						'</li>'
						);
				});
				
				$('.wyca_setup_sites_loading').hide();
				$('#wyca_setup_sites .loaded').show();
			});
		});
	}
	else
	{
		setTimeout(GetSitesWyca, 500);
	}
}

function GetSitesForExportWyca()
{
	$('.wyca_setup_export_loading').show();
	$('#wyca_setup_export .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetCurrentSite(function(data) {
			current_site = data.D;
				//console.log(current_site);
			wycaApi.GetSitesList(function(data) {
				
				$('#wyca_setup_export .list_sites').html('');
				
				if (data.D != undefined)
				$.each(data.D,function(index, value){
					let active = current_site.id_site == value.id_site?'active':'';  // '+active+'
					$('#wyca_setup_export .list_sites').append('' +
						'<li id="wyca_setup_export_list_site_elem_'+value.id_site+'" data-id_site="'+value.id_site+'" class="bSiteExportElem">'+
						'	<span class="societe '+active+'">'+value.name+'</span>'+
						'	<a href="#" class="btn btn-sm btn-circle btn-success pull-right"><i class="fa fa-upload"></i></a>'+
						'</li>'
						);
				});
				
				$('.wyca_setup_export_loading').hide();
				$('#wyca_setup_export .loaded').show();
			});
		});
	}
	else
	{
		setTimeout(GetSitesForExportWyca, 500);
	}
}

function GetSitesManager()
{
	$('.manager_setup_sites_loading').show();
	$('#manager_setup_sites .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		
		wycaApi.GetCurrentSite(function(data) {
			current_site = data.D;
			//console.log(current_site);
			wycaApi.GetSitesList(function(data) {
				
				$('#manager_setup_sites .list_sites').html('');
				
				if (data.D != undefined)
				$.each(data.D,function(index, value){
					let active = current_site.id_site == value.id_site?'active':'';  // '+active+'
					$('#manager_setup_sites .list_sites').append('' +
						'<li id="manager_setup_sites_list_site_elem_'+value.id_site+'" data-id_site="'+value.id_site+'">'+
						'	<span class="societe '+active+'">'+value.name+'</span>'+
						(current_site.id_site != value.id_site?'	<a href="#" class="bSiteDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>':'')+
						(current_site.id_site != value.id_site?'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>':'')+
						(current_site.id_site != value.id_site?'	<a href="#" class="bSiteSetCurrentElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-check"></i></a>':'')+
						'</li>'
						);
				});
				
				$('.manager_setup_sites_loading').hide();
				$('#manager_setup_sites .loaded').show();
			});
		});
	}
	else
	{
		setTimeout(GetSitesManager, 500);
	}
}

function GetSitesNormal()
{
	$('.install_normal_setup_sites_loading').show();
	$('#install_normal_setup_sites .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		
		wycaApi.GetCurrentSite(function(data) {
			current_site = data.D;
			//console.log(current_site);
			wycaApi.GetSitesList(function(data) {
				
				$('#install_normal_setup_sites .list_sites').html('');
				
				if (data.D != undefined)
				$.each(data.D,function(index, value){
					let active = current_site.id_site == value.id_site?'active':'';  // '+active+'
					$('#install_normal_setup_sites .list_sites').append('' +
						'<li id="install_normal_setup_sites_list_site_elem_'+value.id_site+'" data-id_site="'+value.id_site+'">'+
						'	<span class="societe  '+active+'">'+value.name+'</span>'+
						(current_site.id_site != value.id_site?'	<a href="#" class="bSiteDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>':'')+
						(current_site.id_site != value.id_site?'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>':'')+
						(current_site.id_site != value.id_site?'	<a href="#" class="bSiteSetCurrentElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-check"></i></a>':'')+
						'</li>'
						);
				});
				
				$('.install_normal_setup_sites_loading').hide();
				$('#install_normal_setup_sites .loaded').show();
			});
		});
	}
	else
	{
		setTimeout(GetSitesNormal, 500);
	}
}

function GetSitesForExportNormal()
{
	$('.install_normal_setup_export_loading').show();
	$('#install_normal_setup_export .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetCurrentSite(function(data) {
			current_site = data.D;
			//console.log(current_site);
			wycaApi.GetSitesList(function(data) {
				
				$('#install_normal_setup_export .list_sites').html('');
				
				if (data.D != undefined)
				$.each(data.D,function(index, value){
					let active = current_site.id_site == value.id_site?'active':'';  // '+active+'
					$('#install_normal_setup_export .list_sites').append('' +
						'<li id="install_normal_setup_export_list_site_elem_'+value.id_site+'" data-id_site="'+value.id_site+'" class="bSiteExportElem">'+
						'	<span class="societe '+active+'">'+value.name+'</span>'+
						'	<a href="#" class="btn btn-sm btn-circle btn-success pull-right"><i class="fa fa-upload"></i></a>'+
						'</li>'
						);
				});
				
				$('.install_normal_setup_export_loading').hide();
				$('#install_normal_setup_export .loaded').show();
			});
		});
	}
	else
	{
		setTimeout(GetSitesForExportNormal, 500);
	}
}

// MAPS

function GetMapsManager()
{
	$('.manager_setup_maps_loading').show();
	$('#manager_setup_maps .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetCurrentMap(function(data) {
			current_site = data.D.id_site;
			current_map = data.D
			wycaApi.GetMapsList(current_site,function(data) {
				
				$('#manager_setup_maps .list_maps').html('');
				
				if (data.D != undefined)
				$.each(data.D,function(index, value){
					if(value.name != ''){
						let active = current_map.id_map == value.id_map?'active':'';
						$('#manager_setup_maps .list_maps').append('' +
							'<li id="manager_setup_maps_list_map_elem_'+value.id_map+'" data-id_map="'+value.id_map+'">'+
							'	<span class="societe '+active+'">'+value.name+'</span>'+
							(current_map.id_map != value.id_map?'	<a href="#" class="bMapDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>':'')+
							(current_map.id_map != value.id_map?'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>':'')+
							(current_map.id_map != value.id_map?'	<a href="#" class="bMapSetCurrentElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-check"></i></a>':'')+
							'</li>'
							);
					}
				});
				
				$('.manager_setup_maps_loading').hide();
				$('#manager_setup_maps .loaded').show();
			});
		});
	}
	else
	{
		setTimeout(GetMapsManager, 500);
	}
}

function GetMapsNormal()
{
	$('.install_normal_setup_maps_loading').show();
	$('#install_normal_setup_maps .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetCurrentMap(function(data) {
			current_site = data.D.id_site;
			current_map = data.D
			wycaApi.GetMapsList(current_site,function(data) {
				
				$('#install_normal_setup_maps .list_maps').html('');
				
				if (data.D != undefined)
				$.each(data.D,function(index, value){
					if(value.name != ''){
						let active = current_map.id_map == value.id_map?'active':'';
						$('#install_normal_setup_maps .list_maps').append('' +
							'<li id="install_normal_setup_maps_list_map_elem_'+value.id_map+'" data-id_map="'+value.id_map+'">'+
							'	<span class="societe '+active+'">'+value.name+'</span>'+
							(current_map.id_map != value.id_map?'	<a href="#" class="bMapDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>':'')+
							(current_map.id_map != value.id_map?'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>':'')+
							(current_map.id_map != value.id_map?'	<a href="#" class="bMapSetCurrentElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-check"></i></a>':'')+
							'</li>'
							);
					}
				});
				
				$('.install_normal_setup_maps_loading').hide();
				$('#install_normal_setup_maps .loaded').show();
			});
		});
	}
	else
	{
		setTimeout(GetMapsNormal, 500);
	}
}

function GetMapsWyca()
{
	$('.wyca_setup_maps_loading').show();
	$('#wyca_setup_maps .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetCurrentMap(function(data) {
			current_site = data.D.id_site;
			current_map = data.D;
			//console.log(current_map);
			wycaApi.GetMapsList(current_site,function(data) {
				
				$('#wyca_setup_maps .list_maps').html('');
				
				if (data.D != undefined)
				$.each(data.D,function(index, value){
					if(value.name != ''){
						let active = current_map.id_map == value.id_map?'active':'';
						$('#wyca_setup_maps .list_maps').append('' +
							'<li id="wyca_setup_maps_list_map_elem_'+value.id_map+'" data-id_map="'+value.id_map+'">'+
							'	<span class="societe  '+active+'">'+value.name+'</span>'+
							(current_map.id_map != value.id_map?'	<a href="#" class="bMapDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>':'')+
							(current_map.id_map != value.id_map?'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>':'')+
							(current_map.id_map != value.id_map?'	<a href="#" class="bMapSetCurrentElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-check"></i></a>':'')+
							'</li>'
							);
						}
				});
				
				$('.wyca_setup_maps_loading').hide();
				$('#wyca_setup_maps .loaded').show();
			});
		});
	}
	else
	{
		setTimeout(GetMapsWyca, 500);
	}
}

function GetSwitchMapsManager()
{
	$('.manager_switch_map_landmark_loading').show();
	$('#manager_switch_map_landmark .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetCurrentMap(function(data) {
			current_site = data.D.id_site;
			current_map = data.D;
			//console.log(current_map);
			wycaApi.GetMapsList(current_site,function(data) {
				
				$('#manager_switch_map_landmark .list_switch_map_landmarks').html('');
				
				if (data.D != undefined)
				$.each(data.D,function(index, value){
					if(value.name != ''){
						let active = current_map.id_map == value.id_map?'active':'';
						$('#manager_switch_map_landmark .list_switch_map_landmarks').append('' +
							'<li id="manager_switch_map_landmark_list_map_elem_'+value.id_map+'" data-id_map="'+value.id_map+'">'+
							'	<span class="societe  '+active+'">'+value.name+'</span>'+
							(current_map.id_map != value.id_map?'	<a href="#" class="bMapSetCurrentElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fas fa-exchange-alt"></i></a>':'')+
							'</li>'
							);
					}
				});
				
				$('.manager_switch_map_landmark_loading').hide();
				$('#manager_switch_map_landmark .loaded').show();
			});
		});
	}
	else
	{
		setTimeout(GetSwitchMapsManager, 500);
	}
}

function GetSwitchMapsNormal()
{
	$('.install_normal_switch_map_landmark_loading').show();
	$('#install_normal_switch_map_landmark .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetCurrentMap(function(data) {
			current_site = data.D.id_site;
			current_map = data.D;
			//console.log(current_map);
			wycaApi.GetMapsList(current_site,function(data) {
				
				$('#install_normal_switch_map_landmark .list_switch_map_landmarks').html('');
				
				if (data.D != undefined)
				$.each(data.D,function(index, value){
					if(value.name != ''){
						let active = current_map.id_map == value.id_map?'active':'';
						$('#install_normal_switch_map_landmark .list_switch_map_landmarks').append('' +
							'<li id="install_normal_switch_map_landmark_list_map_elem_'+value.id_map+'" data-id_map="'+value.id_map+'">'+
							'	<span class="societe  '+active+'">'+value.name+'</span>'+
							(current_map.id_map != value.id_map?'	<a href="#" class="bMapSetCurrentElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fas fa-exchange-alt"></i></a>':'')+
							'</li>'
							);
					}
				});
				
				$('.install_normal_switch_map_landmark_loading').hide();
				$('#install_normal_switch_map_landmark .loaded').show();
			});
		});
	}
	else
	{
		setTimeout(GetSwitchMapsNormal, 500);
	}
}

function GetSwitchMapsWyca()
{
	$('.wyca_switch_map_landmark_loading').show();
	$('#wyca_switch_map_landmark .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetCurrentMap(function(data) {
			current_site = data.D.id_site;
			current_map = data.D;
			//console.log(current_map);
			wycaApi.GetMapsList(current_site,function(data) {
				
				$('#wyca_switch_map_landmark .list_switch_map_landmarks').html('');
				
				if (data.D != undefined)
				$.each(data.D,function(index, value){
					if(value.name != ''){
						let active = current_map.id_map == value.id_map?'active':'';
						$('#wyca_switch_map_landmark .list_switch_map_landmarks').append('' +
							'<li id="wyca_switch_map_landmark_list_map_elem_'+value.id_map+'" data-id_map="'+value.id_map+'">'+
							'	<span class="societe  '+active+'">'+value.name+'</span>'+
							(current_map.id_map != value.id_map?'	<a href="#" class="bMapSetCurrentElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fas fa-exchange-alt"></i></a>':'')+
							'</li>'
							);
					}
				});
				
				$('.wyca_switch_map_landmark_loading').hide();
				$('#wyca_switch_map_landmark .loaded').show();
			});
		});
	}
	else
	{
		setTimeout(GetSwitchMapsWyca, 500);
	}
}

function GetMapsForDownloadNormal()
{
	$('.install_normal_setup_download_loading').show();
	$('#install_normal_setup_download_map .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetCurrentMap(function(data) {
			current_site = data.D.id_site;
			current_map = data.D;
			wycaApi.GetMapsList(current_site,function(data) {
					
				$('#install_normal_setup_download_map .list_maps').html('');
				
				if (data.D != undefined)
				$.each(data.D,function(index, value){
					if(value.name != ''){
						let active = current_map.id_map == value.id_map?'active':'';
						$('#install_normal_setup_download_map .list_maps').append('' +
						'<li id="install_normal_setup_download_map_list_maps_elem_'+value.id_map+'" data-id_map="'+value.id_map+'" class="bMapDownloadElem">'+
						'	<span class="societe '+active+'">'+value.name+'</span>'+
						'	<a href="#" class="btn btn-sm btn-circle btn-success pull-right"><i class="fas fa-file-download"></i></a>'+
						'</li>'
						);
					}
				});
				
				$('.install_normal_setup_download_loading').hide();
				$('#install_normal_setup_download_map .loaded').show();
			})
		})
	}
	else
	{
		setTimeout(GetMapsForDownloadNormal, 500);
	}
}

function GetMapsForDownloadWyca()
{
	$('.wyca_setup_download_loading').show();
	$('#wyca_setup_download_map .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetCurrentMap(function(data) {
			current_site = data.D.id_site;
			current_map = data.D;
			wycaApi.GetMapsList(current_site,function(data) {
				
				$('#wyca_setup_download_map .list_maps').html('');
				
				if (data.D != undefined)
				$.each(data.D,function(index, value){
					if(value.name != ''){
						let active = current_map.id_map == value.id_map?'active':'';
						$('#wyca_setup_download_map .list_maps').append('' +
						'<li id="wyca_setup_download_map_list_maps_elem_'+value.id_map+'" data-id_map="'+value.id_map+'" class="bMapDownloadElem">'+
						'	<span class="societe '+active+'">'+value.name+'</span>'+
						'	<a href="#" class="btn btn-sm btn-circle btn-success pull-right"><i class="fas fa-file-download"></i></a>'+
						'</li>'
						);
					}
				});
				
				$('.wyca_setup_download_loading').hide();
				$('#wyca_setup_download_map .loaded').show();
			})
		})
	}
	else
	{
		setTimeout(GetMapsForDownloadWyca, 500);
	}
}

// SELECT MAP

function InitSiteSelectMapByStep(back = false)
{
	$('#pages_install_by_step #install_by_step_site_map #ImportSiteMapList').html('');
	console.log('clear')
	$('#pages_install_by_step #install_by_step_site_map .import_site_map_loading').show();

	if (wycaApi.websocketAuthed){
		wycaApi.GetCurrentSite(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR){
				current_site = data.D;
				wycaApi.GetMapsList(current_site.id_site,function(data){
					if (data.A == wycaApi.AnswerCode.NO_ERROR){
						if(data.D.length <= 1){
							$('#pages_install_by_step #install_by_step_site_map .import_site_map_loading').hide();
							if(!back)
								$('.install_by_step_site_master_dock_next').click();
							else
								$('#install_by_step_site_master_dock .bBackButton').click();
						}else{
							$.each(data.D,function(idx,item){
								if(item.name != ''){
									let map="";
									map+='<div class="col-xs-6 text-center">';
									map+='	<div class="SelectMapItem btn bTuile" id="'+item.id_map+'">';
									map+='		<i class="fas fa-map-marked-alt"></i>';
									map+='		<p class="mapname">'+item.name+'</p>';
									map+='   </div>';
									map+='</div>';
									$('#pages_install_by_step #ImportSiteMapList').append(map);
									$('#pages_install_by_step #install_by_step_site_map .import_site_map_loading').hide();
								}
							});
						}				
					}else{
						ParseAPIAnswerError(data);
						$('#pages_install_by_step #install_by_step_site_map .import_site_map_loading').hide();
					}
				})
			}else{
				ParseAPIAnswerError(data);
				$('#pages_install_by_step #install_by_step_site_map .import_site_map_loading').hide();
			}
		})
	}else{
		setTimeout(InitSiteSelectMapByStep, 500);
	}
}

function InitSiteSelectMapWycaByStep(back = false)
{
	$('#pages_wyca_by_step #wyca_by_step_site_map #ImportSiteMapList').html('');
	console.log('clear')
	$('#pages_wyca_by_step #wyca_by_step_site_map .import_site_map_loading').show();

	if (wycaApi.websocketAuthed){
		wycaApi.GetCurrentSite(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR){
				current_site = data.D;
				wycaApi.GetMapsList(current_site.id_site,function(data){
					if (data.A == wycaApi.AnswerCode.NO_ERROR){
						if(data.D.length <= 1){
							$('#pages_wyca_by_step #wyca_by_step_site_map .import_site_map_loading').hide();
							if(!back)
								$('.wyca_by_step_site_master_dock_next').click();
							else
								$('#wyca_by_step_site_master_dock .bBackButton').click();
						}else{
							$.each(data.D,function(idx,item){
								if(item.name != ''){
									let map="";
									map+='<div class="col-xs-6 text-center">';
									map+='	<div class="SelectMapItem btn bTuile" id="'+item.id_map+'">';
									map+='		<i class="fas fa-map-marked-alt"></i>';
									map+='		<p class="mapname">'+item.name+'</p>';
									map+='   </div>';
									map+='</div>';
									$('#pages_wyca_by_step #ImportSiteMapList').append(map);
									$('#pages_wyca_by_step #wyca_by_step_site_map .import_site_map_loading').hide();
								}
							});
						}				
					}else{
						ParseAPIAnswerError(data);
						$('#pages_wyca_by_step #wyca_by_step_site_map .import_site_map_loading').hide();
					}
				})
			}else{
				ParseAPIAnswerError(data);
				$('#pages_wyca_by_step #wyca_by_step_site_map .import_site_map_loading').hide();
			}
		})
	}else{
		setTimeout(InitSiteSelectMapWycaByStep, 500);
	}
}

// TOP IMPORT

function InitTopImportWyca()
{
	$('#pages_wyca_normal .modalImportTop .filename_import_top').html('');
	$('#pages_wyca_normal .modalImportTop .filename_import_top').hide();
	$('#pages_wyca_normal .modalImportTop .file_import_top_wrapper').css('background-color','#589fb26e');
	$('#pages_wyca_normal .modalImportTop .file_import_top').val('');
}

function InitTopImportWycaByStep()
{
	$('#pages_wyca_by_step .modalImportTop .filename_import_top').html('');
	$('#pages_wyca_by_step .modalImportTop .filename_import_top').hide();
	$('#pages_wyca_by_step .modalImportTop .file_import_top_wrapper').css('background-color','#589fb26e');
	$('#pages_wyca_by_step .modalImportTop .file_import_top').val('');
}

function InitTopImportNormal()
{
	$('#pages_install_normal .modalImportTop .filename_import_top').html('');
	$('#pages_install_normal .modalImportTop .filename_import_top').hide();
	$('#pages_install_normal .modalImportTop .file_import_top_wrapper').css('background-color','#589fb26e');
	$('#pages_install_normal .modalImportTop .file_import_top').val('');
}

function InitTopImportByStep()
{
	$('#pages_install_by_step .modalImportTop .filename_import_top').html('');
	$('#pages_install_by_step .modalImportTop .filename_import_top').hide();
	$('#pages_install_by_step .modalImportTop .file_import_top_wrapper').css('background-color','#589fb26e');
	$('#pages_install_by_step .modalImportTop .file_import_top').val('');
}

// SERVICE BOOK

function GetServiceBooksWyca()
{
	$('.wyca_service_book_loading').show();
	$('#wyca_service_book .loaded').hide();
	
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetServiceBooksList(function(data) {
			
			$('#wyca_service_book .list_service_books').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				let d = new Date(value.date * 1000);
				let d_txt="";
				switch(lang){
					case 'fr': d_txt = d.getDate() + '/' + (d.getMonth()+1) + '/' +  d.getFullYear() ; break;
					case 'en': d_txt = (d.getMonth()+1) + '/' + d.getDate() + '/' +  d.getFullYear() ; break;
					default: break;
				}
				$('#wyca_service_book .list_service_books').prepend('' +
						'<li>'+
						'	<div class="date">'+d_txt+'</div>'+
						'	<div class="title">'+value.title+'</div>'+
						'	<div class="comment">'+value.comment+'</div>'+
						'</li>'
						);
			});
			
			$('.wyca_service_book_loading').hide();
			$('#wyca_service_book .loaded').show();
		});
	}
	else
	{
		setTimeout(GetServiceBooksNormal, 500);
	}
}

function GetServiceBooksWycaByStep()
{
	$('.wyca_by_step_service_book_loading').show();
	$('#wyca_by_step_service_book .loaded').hide();
	
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetServiceBooksList(function(data) {
			
			$('#wyca_by_step_service_book .list_service_books').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				let d = new Date(value.date * 1000);
				let d_txt="";
				switch(lang){
					case 'fr': d_txt = d.getDate() + '/' + (d.getMonth()+1) + '/' +  d.getFullYear() ; break;
					case 'en': d_txt = (d.getMonth()+1) + '/' + d.getDate() + '/' +  d.getFullYear() ; break;
					default: break;
				}
				$('#wyca_by_step_service_book .list_service_books').prepend('' +
						'<li>'+
						'	<div class="date">'+d_txt+'</div>'+
						'	<div class="title">'+value.title+'</div>'+
						'	<div class="comment">'+value.comment+'</div>'+
						'</li>'
						);
			});
			
			$('.wyca_by_step_service_book_loading').hide();
			$('#wyca_by_step_service_book .loaded').show();
		});
	}
	else
	{
		setTimeout(GetServiceBooksWycaByStep, 500);
	}
}

function GetServiceBooksNormal()
{
	$('.install_normal_service_book_loading').show();
	$('#install_normal_service_book .loaded').hide();
	
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetServiceBooksList(function(data) {
			
			$('#install_normal_service_book .list_service_books').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				let d = new Date(value.date * 1000);
				let d_txt="";
				switch(lang){
					case 'fr': d_txt = d.getDate() + '/' + (d.getMonth()+1) + '/' +  d.getFullYear() ; break;
					case 'en': d_txt = (d.getMonth()+1) + '/' + d.getDate() + '/' +  d.getFullYear() ; break;
					default: break;
				}
				$('#install_normal_service_book .list_service_books').prepend('' +
						'<li>'+
						'	<div class="date">'+d_txt+'</div>'+
						'	<div class="title">'+value.title+'</div>'+
						'	<div class="comment">'+value.comment+'</div>'+
						'</li>'
						);
			});
			
			$('.install_normal_service_book_loading').hide();
			$('#install_normal_service_book .loaded').show();
		});
	}
	else
	{
		setTimeout(GetServiceBooksNormal, 500);
	}
}

function GetServiceBooksByStep()
{
	$('.install_by_step_service_book_loading').show();
	$('#install_by_step_service_book .loaded').hide();
	
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetServiceBooksList(function(data) {
			
			$('#install_by_step_service_book .list_service_books').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				let d = new Date(value.date * 1000);
				let d_txt="";
				switch(lang){
					case 'fr': d_txt = d.getDate() + '/' + (d.getMonth()+1) + '/' +  d.getFullYear() ; break;
					case 'en': d_txt = (d.getMonth()+1) + '/' + d.getDate() + '/' +  d.getFullYear() ; break;
					default: break;
				}
				$('#install_by_step_service_book .list_service_books').prepend('' +
						'<li>'+
						'	<div class="date">'+d_txt+'</div>'+
						'	<div class="title">'+value.title+'</div>'+
						'	<div class="comment">'+value.comment+'</div>'+
						'</li>'
						);
			});
			
			$('.install_by_step_service_book_loading').hide();
			$('#install_by_step_service_book .loaded').show();
		});
	}
	else
	{
		setTimeout(GetServiceBooksByStep, 500);
	}
}

// WYCA USER

function GetWycasWyca()
{
	$('.wyca_wyca_loading').show();
	$('#wyca_wyca .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetUsersList(function(data) {
			console.log(data);
			$('#wyca_wyca .list_wycas').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				if (value.id_group_user  == wycaApi.GroupUser.WYCA)
				{
					let active = user_id == value.id_user?'active':'';
					$('#wyca_wyca .list_wycas').append('' +
						'<li id="wyca_wyca_list_wyca_elem_'+value.id_user+'" data-id_wyca="'+value.id_user+'">'+
						'	<span class="email '+active+'">'+value.email+'</span>'+
						'	<a href="#" class="bWycaDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bWycaEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pen"></i></a>'+
						'</li>'
						);
				}
			});
			
			$('.wyca_wyca_loading').hide();
			$('#wyca_wyca .loaded').show();
			RefreshDisplayWycaWyca();
		});
	}
	else
	{
		setTimeout(GetWycasWyca, 500);
	}
}

// INSTALLERS

function GetInstallersWyca()
{
	$('.wyca_installer_loading').show();
	$('#wyca_installer .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetUsersList(function(data) {
			$('#wyca_installer .list_installers').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				if (value.id_group_user  == wycaApi.GroupUser.DISTRIBUTOR)
				{
					$('#wyca_installer .list_installers').append('' +
						'<li id="wyca_installer_list_installer_elem_'+value.id_user+'" data-id_installer="'+value.id_user+'">'+
						'	<span class="email">'+value.email+'</span>'+
						'	<a href="#" class="bInstallerDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bInstallerEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pen"></i></a>'+
						'</li>'
						);
				}
			});
			
			$('.wyca_installer_loading').hide();
			$('#wyca_installer .loaded').show();
			RefreshDisplayInstallerWyca();
		});
	}
	else
	{
		setTimeout(GetInstallersWyca, 500);
	}
}

// USER

function GetUsersManager()
{
	$('.manager_users_loading').show();
	$('#manager_users .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetUsersList(function(data) {
			
			$('#manager_users .list_users').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				if (value.id_group_user  == wycaApi.GroupUser.USER)
				{
					$('#manager_users .list_users').append('' +
						'<li id="manager_users_list_user_elem_'+value.id_user+'" data-id_user="'+value.id_user+'">'+
						'	<span class="email">'+value.email+'</span>'+
						'	<a href="#" class="bUserDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bUserEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pen"></i></a>'+
						'</li>'
						);
				}
			});
			RefreshDisplayUserManager();
			$('.manager_users_loading').hide();
			$('#manager_users .loaded').show();
		});
	}
	else
	{
		setTimeout(GetUsersManager, 500);
	}

}

function GetUsersWyca()
{
	$('.wyca_user_loading').show();
	$('#wyca_user .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetUsersList(function(data) {
			$('#wyca_user .list_users').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				if (value.id_group_user  == wycaApi.GroupUser.USER)
				{
					$('#wyca_user .list_users').append('' +
						'<li id="wyca_user_list_user_elem_'+value.id_user+'" data-id_user="'+value.id_user+'">'+
						'	<span class="email">'+value.email+'</span>'+
						'	<a href="#" class="bUserDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bUserEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pen"></i></a>'+
						'</li>'
						);
				}
			});
			
			$('.wyca_user_loading').hide();
			$('#wyca_user .loaded').show();
			RefreshDisplayUserWyca();
		});
	}
	else
	{
		setTimeout(GetUsersWyca, 500);
	}
}

function GetUsersNormal()
{
	$('.install_normal_user_loading').show();
	$('#install_normal_user .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetUsersList(function(data) {
			$('#install_normal_user .list_users').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				if (value.id_group_user  == wycaApi.GroupUser.USER)
				{
					$('#install_normal_user .list_users').append('' +
						'<li id="install_normal_user_list_user_elem_'+value.id_user+'" data-id_user="'+value.id_user+'">'+
						'	<span class="email">'+value.email+'</span>'+
						'	<a href="#" class="bUserDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bUserEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pen"></i></a>'+
						'</li>'
						);
				}
			});
			
			$('.install_normal_user_loading').hide();
			$('#install_normal_user .loaded').show();
			RefreshDisplayUserNormal();
		});
	}
	else
	{
		setTimeout(GetUsersNormal, 500);
	}
}

// MANAGER

function GetManagersWyca()
{
	boolHelpManager = getCookie('boolHelpManagerI') != '' ? JSON.parse(getCookie('boolHelpManagerI')) : true; // TRICK JSON.parse STR TO BOOL
	if(boolHelpManager)
		$('#wyca_manager .modalHelpManager').modal('show');
	$('.wyca_manager_loading').show();
	$('#wyca_manager .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetUsersList(function(data) {
			
			$('#wyca_manager .list_managers').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				if (value.id_group_user  == wycaApi.GroupUser.MANAGER)
				{
					$('#wyca_manager .list_managers').append('' +
						'<li id="wyca_manager_list_manager_elem_'+value.id_user+'" data-id_user="'+value.id_user+'">'+
						'	<span class="email">'+value.email+'</span>'+
						'	<a href="#" class="bManagerDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bManagerEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pen"></i></a>'+
						'</li>'
						);
				}
			});
			
			$('.wyca_manager_loading').hide();
			$('#wyca_manager .loaded').show();
			RefreshDisplayManagerWyca();
		});
	}
	else
	{
		setTimeout(GetManagersWyca, 500);
	}
}

function GetManagersWycaByStep()
{
	boolHelpManager = getCookie('boolHelpManagerI') != '' ? JSON.parse(getCookie('boolHelpManagerI')) : true; // TRICK JSON.parse STR TO BOOL
	if(boolHelpManager)
		$('#wyca_by_step_manager .modalHelpManager').modal('show');
	$('.wyca_by_step_manager_loading').show();
	$('#wyca_by_step_manager .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetUsersList(function(data) {
			
			$('#wyca_by_step_manager .list_managers').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				if (value.id_group_user  == wycaApi.GroupUser.MANAGER)
				{
					$('#wyca_by_step_manager .list_managers').append('' +
						'<li id="wyca_by_step_manager_list_manager_elem_'+value.id_user+'" data-id_user="'+value.id_user+'">'+
						'	<span class="email">'+value.email+'</span>'+
						'	<a href="#" class="bManagerDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bManagerEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pen"></i></a>'+
						'</li>'
						);
				}
			});
			
			$('.wyca_by_step_manager_loading').hide();
			$('#wyca_by_step_manager .loaded').show();
			RefreshDisplayManagerWycaByStep();
		});
		
	}
	else
	{
		setTimeout(GetManagersWycaByStep, 500);
	}

}

function GetManagersNormal()
{
	boolHelpManager = getCookie('boolHelpManagerI') != '' ? JSON.parse(getCookie('boolHelpManagerI')) : true; // TRICK JSON.parse STR TO BOOL
	if(boolHelpManager)
		$('#install_normal_manager .modalHelpManager').modal('show');
	$('.install_normal_manager_loading').show();
	$('#install_normal_manager .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetUsersList(function(data) {
			
			$('#install_normal_manager .list_managers').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				if (value.id_group_user  == wycaApi.GroupUser.MANAGER)
				{
					$('#install_normal_manager .list_managers').append('' +
						'<li id="install_normal_manager_list_manager_elem_'+value.id_user+'" data-id_user="'+value.id_user+'">'+
						'	<span class="email">'+value.email+'</span>'+
						'	<a href="#" class="bManagerDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bManagerEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pen"></i></a>'+
						'</li>'
						);
				}
			});
			
			$('.install_normal_manager_loading').hide();
			$('#install_normal_manager .loaded').show();
			RefreshDisplayManagerNormal();
		});
	}
	else
	{
		setTimeout(GetManagersNormal, 500);
	}
}

function GetManagersByStep()
{
	boolHelpManager = getCookie('boolHelpManagerI') != '' ? JSON.parse(getCookie('boolHelpManagerI')) : true; // TRICK JSON.parse STR TO BOOL
	if(boolHelpManager)
		$('#install_by_step_manager .modalHelpManager').modal('show');
	$('.install_by_step_manager_loading').show();
	$('#install_by_step_manager .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetUsersList(function(data) {
			
			$('#install_by_step_manager .list_managers').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				if (value.id_group_user  == wycaApi.GroupUser.MANAGER)
				{
					$('#install_by_step_manager .list_managers').append('' +
						'<li id="install_by_step_manager_list_manager_elem_'+value.id_user+'" data-id_user="'+value.id_user+'">'+
						'	<span class="email">'+value.email+'</span>'+
						'	<a href="#" class="bManagerDeleteElem btn_confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="btn btn-sm btn-circle btn-danger pull-right confirm_delete"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bManagerEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pen"></i></a>'+
						'</li>'
						);
				}
			});
			
			$('.install_by_step_manager_loading').hide();
			$('#install_by_step_manager .loaded').show();
			RefreshDisplayManagerByStep();
		});
		
	}
	else
	{
		setTimeout(GetManagersByStep, 500);
	}

}

// CONFIGURATION BATTERY

function GetConfigurationsWyca()
{
	$('.wyca_setup_config_loading').show();
	$('#wyca_setup_config .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetEnergyConfiguration(function(data) {
			$('#wyca_setup_config #wyca_setup_config_i_level_min_gotocharge').val(data.D.EBL);
			$('#wyca_setup_config #wyca_setup_config_i_level_min_dotask').val(data.D.MBL);
			$('.wyca_setup_config_loading').hide();
			$('#wyca_setup_config .loaded').show();
		});
	}
	else
	{
		setTimeout(GetConfigurationsWyca, 500);
	}
}

function GetConfigurationsWycaByStep()
{
	$('.wyca_by_step_config_loading').show();
	$('#wyca_by_step_config .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetEnergyConfiguration(function(data) {
			$('#wyca_by_step_config #wyca_by_step_config_i_level_min_gotocharge').val(data.D.EBL);
			$('#wyca_by_step_config #wyca_by_step_config_i_level_min_dotask').val(data.D.MBL);
			$('.wyca_by_step_config_loading').hide();
			$('#wyca_by_step_config .loaded').show();
		});
	}
	else
	{
		setTimeout(GetConfigurationsWycaByStep, 500);
	}
}

function GetConfigurationsNormal()
{
	$('.install_normal_setup_config_loading').show();
	$('#install_normal_setup_config .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetEnergyConfiguration(function(data) {
			$('#install_normal_setup_config #install_normal_setup_config_i_level_min_gotocharge').val(data.D.EBL);
			$('#install_normal_setup_config #install_normal_setup_config_i_level_min_dotask').val(data.D.MBL);
			$('.install_normal_setup_config_loading').hide();
			$('#install_normal_setup_config .loaded').show();
		});
	}
	else
	{
		setTimeout(GetConfigurationsNormal, 500);
	}
}

function GetConfigurationsByStep()
{
	$('.install_by_step_config_loading').show();
	$('#install_by_step_config .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetEnergyConfiguration(function(data) {
			$('#install_by_step_config #install_by_step_config_i_level_min_gotocharge').val(data.D.EBL);
			$('#install_by_step_config #install_by_step_config_i_level_min_dotask').val(data.D.MBL);
			$('.install_by_step_config_loading').hide();
			$('#install_by_step_config .loaded').show();
		});
	}
	else
	{
		setTimeout(GetConfigurationsByStep, 500);
	}
}

// TOP
var listAvailableTops = Array();
var templistAvailableTops = Array();

function InitTopsWyca()
{
	$('.wyca_setup_tops_loading').show();
	$('#wyca_setup_tops .tuiles').html('');
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetTopsList(function(data) {
			//console.log(data);
			$.each(data.D,function(index, value){
				if(value.available)	listAvailableTops.push(value.id_top);
				$('#wyca_setup_tops .tuiles').append('<li class="col-xs-4 col-md-3 col-lg-2">'+
				'	<a class="is_checkbox '+(value.active?'active no_update':'')+' '+(value.available?'checked':'')+' anim_tuiles tuile_img tuile'+index+'" data-id_top="'+value.id_top+'" href="#">'+
				'		<i class="fa fa-check"></i>'+
				'		<img src="data:image/png;base64, '+value.image_b64+'" />'+value.name+''+
				'	</a>'+
				'</li>');
			});
			$('.wyca_setup_tops_loading').hide();
		});
	}
	else
	{
		setTimeout(InitTopsWyca, 500);
	}
}

function InitTopsWycaByStep()
{
	$('.wyca_by_step_tops_loading').show();
	$('#wyca_by_step_tops .tuiles').html('');
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetTopsList(function(data) {
			//console.log(data);
			$.each(data.D,function(index, value){
				if(value.available)	listAvailableTops.push(value.id_top);
				$('#wyca_by_step_tops .tuiles').append('<li class="col-xs-4 col-md-3 col-lg-2">'+
				'	<a class="is_checkbox '+(value.available?'checked':'')+' anim_tuiles tuile_img tuile'+index+'" data-id_top="'+value.id_top+'" href="#">'+
				'		<i class="fa fa-check"></i>'+
				'		<img src="data:image/png;base64, '+value.image_b64+'" />'+value.name+''+
				'	</a>'+
				'</li>');
			});
			$('.wyca_by_step_tops_loading').hide();
		});
	}
	else
	{
		setTimeout(InitTopsWycaByStep, 500);
	}
}

function InitTopsNormal()
{
	$('.install_normal_setup_tops_loading').show();
	$('#install_normal_setup_tops .tuiles').html('');
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetTopsList(function(data) {
			
			//console.log(data);
			listAvailableTops = Array();
			$.each(data.D,function(index, value){
				if(value.available)	listAvailableTops.push(value.id_top);
				$('#install_normal_setup_tops .tuiles').append('<li class="col-xs-4 col-md-3 col-lg-2">'+
				'	<a class="is_checkbox '+(value.active?'active no_update':'')+' '+(value.available?'checked':'')+' anim_tuiles tuile_img tuile'+index+'" data-id_top="'+value.id_top+'" href="#">'+
				'		<i class="fa fa-check"></i>'+
				'		<img src="data:image/png;base64, '+value.image_b64+'" />'+value.name+''+
				'	</a>'+
				'</li>');
			});
			$('.install_normal_setup_tops_loading').hide();
		});
	}
	else
	{
		setTimeout(InitTopsNormal, 500);
	}
}

function InitTopsByStep()
{
	$('.install_by_step_tops_loading').show();
	$('#install_by_step_tops .tuiles').html('');
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetTopsList(function(data) {
			//console.log(data);
			$.each(data.D,function(index, value){
				if(value.available)	listAvailableTops.push(value.id_top);
				$('#install_by_step_tops .tuiles').append('<li class="col-xs-4 col-md-3 col-lg-2">'+
				'	<a class="is_checkbox '+(value.available?'checked':'')+' anim_tuiles tuile_img tuile'+index+'" data-id_top="'+value.id_top+'" href="#">'+
				'		<i class="fa fa-check"></i>'+
				'		<img src="data:image/png;base64, '+value.image_b64+'" />'+value.name+''+
				'	</a>'+
				'</li>');
			});
			$('.install_by_step_tops_loading').hide();
		});
	}
	else
	{
		setTimeout(InitTopsByStep, 500);
	}
}

function InitTopsActiveManager()
{
	$('.manager_top_loading').show();
	$('#manager_top .tuiles').html('');
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetTopsList(function(data) {
			//console.log(data);
			$.each(data.D,function(index, value){
				if (value.available)
				{
					$('#manager_top .tuiles').append('<li class="col-xs-4 col-md-3 col-lg-2 bTop' + value.id_top + '">'+
					'	<a href="#" class="is_checkbox set_top '+(value.active?'checked':'')+' anim_tuiles tuile_img tuile'+index+'" data-id_top="'+value.id_top+'">'+
					'		<i class="fa fa-check"></i>'+
					'		<img src="data:image/png;base64, '+value.image_b64+'" />'+value.name+''+
					'	</a>'+
					'</li>');
				}
			});
			$('.manager_top_loading').hide();
		});
	}
	else
	{
		setTimeout(InitTopsActiveManager, 500);

	}
}

function InitTopsActiveWyca()
{
	$('.wyca_setup_top_loading').show();
	$('#wyca_setup_top .tuiles').html('');
	if (wycaApi.websocketAuthed)
	{
		//CHECK IF AVAILABLE TOPS LIST CHANGED
		templistAvailableTops = JSON.parse(JSON.stringify(listAvailableTops));
		listAvailableTops = Array();
		$('#wyca_setup_tops ul.tuiles').find('.is_checkbox.checked').each(function(index, element) {
			listAvailableTops.push($(this).data('id_top'));
		});
		
		if(JSON.stringify(listAvailableTops) == JSON.stringify(templistAvailableTops)){
			wycaApi.GetTopsList(function(data) {
				//console.log(data);
				$.each(data.D,function(index, value){
						if (value.available)
						{
							$('#wyca_setup_top .tuiles').append('<li class="col-xs-4 col-md-3 col-lg-2 bTop' + value.id_top + '">'+
							'	<a href="#" class="is_checkbox set_top '+(value.active?'checked':'')+' anim_tuiles tuile_img tuile'+index+'" data-id_top="'+value.id_top+'">'+
							'		<i class="fa fa-check"></i>'+
							'		<img src="data:image/png;base64, '+value.image_b64+'" />'+value.name+''+
							'	</a>'+
							'</li>');
						}
					});
				$('.wyca_setup_top_loading').hide();
			})
		}
		else
		{
			wycaApi.SetAvailableTops(listAvailableTops, function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					wycaApi.GetTopsList(function(data) {
						//console.log(data);
						$.each(data.D,function(index, value){
							if (value.available)
							{
								$('#wyca_setup_top .tuiles').append('<li class="col-xs-4 col-md-3 col-lg-2 bTop' + value.id_top + '">'+
								'	<a href="#" class="is_checkbox set_top '+(value.active?'checked':'')+' anim_tuiles tuile_img tuile'+index+'" data-id_top="'+value.id_top+'">'+
								'		<i class="fa fa-check"></i>'+
								'		<img src="data:image/png;base64, '+value.image_b64+'" />'+value.name+''+
								'	</a>'+
								'</li>');
							}
						});
						$('.wyca_setup_top_loading').hide();
					});
				}
				else
					ParseAPIAnswerError(data);
			});
		}
	}
	else
	{
		setTimeout(InitTopsActiveWyca, 500);

	}
}

function InitTopsActiveWycaByStep()
{
	$('.wyca_by_step_top_loading').show();
	$('#wyca_by_step_top .tuiles').html('');
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetTopsList(function(data) {
			$.each(data.D,function(index, value){
				if (value.available)
				{
					$('#wyca_by_step_top .tuiles').append('<li class="col-xs-4 col-md-3 col-lg-2 bTop' + value.id_top + '">'+
					'	<a href="#" class="set_top button_goto anim_tuiles tuile_img tuile'+index+'" data-id_top="'+value.id_top+'" data-goto="wyca_by_step_check">'+
					'		<img src="data:image/png;base64, '+value.image_b64+'" />'+value.name+''+
					'	</a>'+
					'</li>');
				}
			});
			$('.wyca_by_step_top_loading').hide();
		});
	}
	else
	{
		setTimeout(InitTopsActiveWycaByStep, 500);

	}
}

function InitTopsActiveNormal()
{
	$('.install_normal_setup_top_loading').show();
	$('#install_normal_setup_top .tuiles').html('');
	if (wycaApi.websocketAuthed)
	{
		//CHECK IF AVAILABLE TOPS LIST CHANGED
		templistAvailableTops = JSON.parse(JSON.stringify(listAvailableTops));
		listAvailableTops = Array();
		$('#install_normal_setup_tops ul.tuiles').find('.is_checkbox.checked').each(function(index, element) {
			listAvailableTops.push($(this).data('id_top'));
		});
		
		if(JSON.stringify(listAvailableTops) == JSON.stringify(templistAvailableTops)){
			wycaApi.GetTopsList(function(data) {
				//console.log(data);
				$.each(data.D,function(index, value){
					if (value.available)
					{
						$('#install_normal_setup_top .tuiles').append('<li class="col-xs-4 col-md-3 col-lg-2 bTop' + value.id_top + '">'+
						'	<a href="#" class="is_checkbox set_top '+(value.active?'checked':'')+' anim_tuiles tuile_img tuile'+index+'" data-id_top="'+value.id_top+'">'+
						'		<i class="fa fa-check"></i>'+
						'		<img src="data:image/png;base64, '+value.image_b64+'" />'+value.name+''+
						'	</a>'+
						'</li>');
					}
				});
				$('.install_normal_setup_top_loading').hide();
			});
		}
		else
		{
			wycaApi.SetAvailableTops(listAvailableTops, function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					wycaApi.GetTopsList(function(data) {
						//console.log(data);
						$.each(data.D,function(index, value){
							if (value.available)
							{
								$('#install_normal_setup_top .tuiles').append('<li class="col-xs-4 col-md-3 col-lg-2 bTop' + value.id_top + '">'+
								'	<a href="#" class="is_checkbox set_top '+(value.active?'checked':'')+' anim_tuiles tuile_img tuile'+index+'" data-id_top="'+value.id_top+'">'+
								'		<i class="fa fa-check"></i>'+
								'		<img src="data:image/png;base64, '+value.image_b64+'" />'+value.name+''+
								'	</a>'+
								'</li>');
							}
						});
						$('.install_normal_setup_top_loading').hide();
					});
				}
				else
					ParseAPIAnswerError(data);
			});
		}
		
	}
	else
	{
		setTimeout(InitTopsActiveNormal, 500);

	}
}

function InitTopsActiveByStep()
{
	$('.install_by_step_top_loading').show();
	$('#install_by_step_top .tuiles').html('');
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetTopsList(function(data) {
			$.each(data.D,function(index, value){
				if (value.available)
				{
					$('#install_by_step_top .tuiles').append('<li class="col-xs-4 col-md-3 col-lg-2 bTop' + value.id_top + '">'+
					'	<a href="#" class="set_top button_goto anim_tuiles tuile_img tuile'+index+'" data-id_top="'+value.id_top+'" data-goto="install_by_step_check">'+
					'		<img src="data:image/png;base64, '+value.image_b64+'" />'+value.name+''+
					'	</a>'+
					'</li>');
				}
			});
			$('.install_by_step_top_loading').hide();
		});
	}
	else
	{
		setTimeout(InitTopsActiveByStep, 500);

	}
}

//var app_sound_is_on declared in footer.php initialized with c.conf;
//SOUND

function InitSoundWyca()
{
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetSoundIsOn(function(data){
			if(data.D){
				//ROS SOUND TRUE
				$('#wyca_setup_sound .sound_switch_ROS').parent().find('.ios-switch').removeClass('off').addClass('on');
				$('#wyca_setup_sound .sound_switch_ROS').prop('checked',true);
				//APP SOUND
				if(app_sound_is_on){
					$('#wyca_setup_sound .sound_switch_app').parent().find('.ios-switch').removeClass('off').addClass('on');
					$('#wyca_setup_sound .sound_switch_app').prop('checked',true);
				}else{
					$('#wyca_setup_sound .sound_switch_app').parent().find('.ios-switch').removeClass('on').addClass('off');
					$('#wyca_setup_sound .sound_switch_app').prop('checked',false);
				}
			}else{
				$('#wyca_setup_sound .sound_switch_ROS').parent().find('.ios-switch').removeClass('on').addClass('off');
				$('#wyca_setup_sound .sound_switch_ROS').prop('checked',false);
				$('#wyca_setup_sound .sound_switch_app').parent().find('.ios-switch').removeClass('on').addClass('off');
				$('#wyca_setup_sound .sound_switch_app').prop('checked',false);
			}
			$('#wyca_setup_sound .sound_switch_ROS').change();
		})
	}
	else
	{
		setTimeout(InitSoundWyca, 500);

	}
}

function InitSoundWycaByStep()
{
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetSoundIsOn(function(data){
			if(data.D){
				//ROS SOUND TRUE
				$('#wyca_by_step_sound .sound_switch_ROS').parent().find('.ios-switch').removeClass('off').addClass('on');
				$('#wyca_by_step_sound .sound_switch_ROS').prop('checked',true);
				//APP SOUND
				if(app_sound_is_on){
					$('#wyca_by_step_sound .sound_switch_app').parent().find('.ios-switch').removeClass('off').addClass('on');
					$('#wyca_by_step_sound .sound_switch_app').prop('checked',true);
				}else{
					$('#wyca_by_step_sound .sound_switch_app').parent().find('.ios-switch').removeClass('on').addClass('off');
					$('#wyca_by_step_sound .sound_switch_app').prop('checked',false);
				}
			}else{
				$('#wyca_by_step_sound .sound_switch_ROS').parent().find('.ios-switch').removeClass('on').addClass('off');
				$('#wyca_by_step_sound .sound_switch_ROS').prop('checked',false);
				$('#wyca_by_step_sound .sound_switch_app').parent().find('.ios-switch').removeClass('on').addClass('off');
				$('#wyca_by_step_sound .sound_switch_app').prop('checked',false);
			}
			$('#wyca_by_step_sound .sound_switch_ROS').change();
		})
	}
	else
	{
		setTimeout(InitSoundWycaByStep, 500);

	}	
}

function InitSoundNormal()
{
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetSoundIsOn(function(data){
			if(data.D){
				//ROS SOUND TRUE
				$('#install_normal_setup_sound .sound_switch_ROS').parent().find('.ios-switch').removeClass('off').addClass('on');
				$('#install_normal_setup_sound .sound_switch_ROS').prop('checked',true);
				//APP SOUND
				if(app_sound_is_on){
					$('#install_normal_setup_sound .sound_switch_app').parent().find('.ios-switch').removeClass('off').addClass('on');
					$('#install_normal_setup_sound .sound_switch_app').prop('checked',true);
				}else{
					$('#install_normal_setup_sound .sound_switch_app').parent().find('.ios-switch').removeClass('on').addClass('off');
					$('#install_normal_setup_sound .sound_switch_app').prop('checked',false);
				}
			}else{
				$('#install_normal_setup_sound .sound_switch_ROS').parent().find('.ios-switch').removeClass('on').addClass('off');
				$('#install_normal_setup_sound .sound_switch_ROS').prop('checked',false);
				$('#install_normal_setup_sound .sound_switch_app').parent().find('.ios-switch').removeClass('on').addClass('off');
				$('#install_normal_setup_sound .sound_switch_app').prop('checked',false);
			}
			$('#install_normal_setup_sound .sound_switch_ROS').change();
		})
	}
	else
	{
		setTimeout(InitSoundNormal, 500);

	}	
}

function InitSoundByStep()
{
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetSoundIsOn(function(data){
			if(data.D){
				//ROS SOUND TRUE
				$('#install_by_step_setup_sound .sound_switch_ROS').parent().find('.ios-switch').removeClass('off').addClass('on');
				$('#install_by_step_setup_sound .sound_switch_ROS').prop('checked',true);
				//APP SOUND
				if(app_sound_is_on){
					$('#install_by_step_setup_sound .sound_switch_app').parent().find('.ios-switch').removeClass('off').addClass('on');
					$('#install_by_step_setup_sound .sound_switch_app').prop('checked',true);
				}else{
					$('#install_by_step_setup_sound .sound_switch_app').parent().find('.ios-switch').removeClass('on').addClass('off');
					$('#install_by_step_setup_sound .sound_switch_app').prop('checked',false);
				}
			}else{
				$('#install_by_step_setup_sound .sound_switch_ROS').parent().find('.ios-switch').removeClass('on').addClass('off');
				$('#install_by_step_setup_sound .sound_switch_ROS').prop('checked',false);
				$('#install_by_step_setup_sound .sound_switch_app').parent().find('.ios-switch').removeClass('on').addClass('off');
				$('#install_by_step_setup_sound .sound_switch_app').prop('checked',false);
			}
			$('#install_by_step_sound .sound_switch_ROS').change();
		})
	}
	else
	{
		setTimeout(InitSoundByStep, 500);

	}	
}

// WIFI

function InitInstallWifiPageWyca()
{
	if (wycaApi.websocketAuthed)
	{
		//$('.wyca_setup_wifi_loading').show();
		wycaApi.GetWifiList(function(data) {
			$('#wyca_setup_wifi tr').hide();
			let wifis = [];
			if (data.D.length > 0)
			{
				$.each(data.D,function(index, value){
					signal = parseInt(value.signal/20);
					if(!wifis.includes(value.ssid)){
						wifis.push(value.ssid);
						if (value.state == 'active')
							$('.tbody_wifi').append('<tr data-ssid="'+value.ssid+'" class="wifi'+value.bssid+' '+ value.state +'"><td><i class="fas fa-check"></i> '+value.ssid+'</td><td><img src="assets/images/signal-'+signal+'.png" /></td></tr>');
						else
							$('.tbody_wifi').append('<tr data-ssid="'+value.ssid+'" class="wifi'+value.bssid+' '+ value.state +'"><td>'+value.ssid+'</td><td><img src="assets/images/signal-'+signal+'.png" /></td></tr>');
					}else{
						if(value.state == 'active')
							$('.tbody_wifi tr[data-ssid="'+value.ssid+'"]:visible').addClass('active').children('td:first-child').html('<i class="fas fa-check"></i> '+value.ssid);//Add check + bold
					}
				});
			}
			$('.wyca_setup_wifi_loading').hide();
		});
		
		if ($('#wyca_setup_wifi').is(':visible'))
			setTimeout(InitInstallWifiPageWyca, 3000);
	}
	else
	{
		setTimeout(InitInstallWifiPageWyca, 500);
	}
}

function InitInstallWifiPageWycaByStep()
{
	if (wycaApi.websocketAuthed)
	{
		//$('.wyca_bystep_setup_wifi_loading').show();
		wycaApi.GetWifiList(function(data) {
			
			$('#wyca_by_step_wifi tr').hide();
			let wifis = [];
			if (data.D.length > 0)
			{
				console.log(data.D);
				$.each(data.D,function(index, value){
					signal = parseInt(value.signal/20);
					if(!wifis.includes(value.ssid)){
						wifis.push(value.ssid);
						if (value.state == 'active')
							$('.tbody_wifi').append('<tr data-ssid="'+value.ssid+'" class="wifi'+value.bssid+' '+ value.state +'"><td><i class="fas fa-check"></i> '+value.ssid+'</td><td><img src="assets/images/signal-'+signal+'.png" /></td></tr>');
						else
							$('.tbody_wifi').append('<tr data-ssid="'+value.ssid+'" class="wifi'+value.bssid+' '+ value.state +'"><td>'+value.ssid+'</td><td><img src="assets/images/signal-'+signal+'.png" /></td></tr>');
					}else{
						if(value.state == 'active')
							$('.tbody_wifi tr[data-ssid="'+value.ssid+'"]:visible').addClass('active').children('td:first-child').html('<i class="fas fa-check"></i> '+value.ssid);//Add check + bold
					}
				});
			}
			$('.wyca_bystep_setup_wifi_loading').hide();
		});
		
		if ($('#wyca_by_step_wifi').is(':visible'))
			setTimeout(InitInstallWifiPageWycaByStep, 3000);
		
	}
	else
	{
		setTimeout(InitInstallWifiPageWycaByStep, 500);
	}
}

function InitInstallWifiPageNormal()
{
	if (wycaApi.websocketAuthed)
	{
		//$('.install_normal_setup_wifi_loading').show();
		wycaApi.GetWifiList(function(data) {
			$('#install_normal_setup_wifi tr').hide();
			let wifis = [];
			if (data.D.length > 0)
			{
				$.each(data.D,function(index, value){
					signal = parseInt(value.signal/20);
					if(!wifis.includes(value.ssid)){
						wifis.push(value.ssid);
						if (value.state == 'active')
							$('.tbody_wifi').append('<tr data-ssid="'+value.ssid+'" class="wifi'+value.bssid+' '+ value.state +'"><td><i class="fas fa-check"></i> '+value.ssid+'</td><td><img src="assets/images/signal-'+signal+'.png" /></td></tr>');
						else
							$('.tbody_wifi').append('<tr data-ssid="'+value.ssid+'" class="wifi'+value.bssid+' '+ value.state +'"><td>'+value.ssid+'</td><td><img src="assets/images/signal-'+signal+'.png" /></td></tr>');
					}else{
						if(value.state == 'active')
							$('.tbody_wifi tr[data-ssid="'+value.ssid+'"]:visible').addClass('active').children('td:first-child').html('<i class="fas fa-check"></i> '+value.ssid);//Add check + bold
					}
				});
			}
			$('.install_normal_setup_wifi_loading').hide();
		});
		
		if ($('#install_normal_setup_wifi').is(':visible'))
			setTimeout(InitInstallWifiPageNormal, 3000);
	}
	else
	{
		setTimeout(InitInstallWifiPageNormal, 500);
	}
}

function InitInstallWifiPageByStep()
{
	if (wycaApi.websocketAuthed)
	{
		//$('.install_bystep_setup_wifi_loading').show();
		wycaApi.GetWifiList(function(data) {
			
			$('#install_by_step_wifi tr').hide();
			let wifis = [];
			if (data.D.length > 0)
			{
				console.log(data.D);
				$.each(data.D,function(index, value){
					signal = parseInt(value.signal/20);
					if(!wifis.includes(value.ssid)){
						wifis.push(value.ssid);
						if (value.state == 'active')
							$('.tbody_wifi').append('<tr data-ssid="'+value.ssid+'" class="wifi'+value.bssid+' '+ value.state +'"><td><i class="fas fa-check"></i> '+value.ssid+'</td><td><img src="assets/images/signal-'+signal+'.png" /></td></tr>');
						else
							$('.tbody_wifi').append('<tr data-ssid="'+value.ssid+'" class="wifi'+value.bssid+' '+ value.state +'"><td>'+value.ssid+'</td><td><img src="assets/images/signal-'+signal+'.png" /></td></tr>');
					}else{
						if(value.state == 'active')
							$('.tbody_wifi tr[data-ssid="'+value.ssid+'"]:visible').addClass('active').children('td:first-child').html('<i class="fas fa-check"></i> '+value.ssid);//Add check + bold
					}
				});
			}
			$('.install_bystep_setup_wifi_loading').hide();
		});
		
		if ($('#install_by_step_wifi').is(':visible'))
			setTimeout(InitInstallWifiPageByStep, 3000);
		
	}
	else
	{
		setTimeout(InitInstallWifiPageByStep, 500);
	}
}

// BYSTEP AND WYCA_BYSTEP RELATED FUNCS
var save_check_components_result = undefined;

/* WYCA BYSTEP */

function InitMappingWycaByStep()
{
	imgMappingLoaded = true;
	//EMPECHER RETOUR NAVIGATEUR
	history.pushState(null, null, document.URL);
	window.addEventListener('popstate', function () {
		history.pushState(null, null, document.URL);
	});
	
	
	if (wycaApi.websocketAuthed)
	{
		wycaApi.MappingIsStarted(function(data) {
			if (data.D)
			{
				mappingStarted = true;
				
				$('#wyca_by_step_mapping .bMappingStart').hide();
				$('#wyca_by_step_mapping .progressStartMapping').hide();
				$('#wyca_by_step_mapping .switchLiveMapping').show();
				$('#wyca_by_step_mapping .bMappingStop').show();
				$('#wyca_by_step_mapping .mapping_view').show();
				$('.ifMapping').show();
				$('.ifMappingInit').hide();
				$('.ifNMapping').hide();
				img = document.getElementById("wyca_by_step_mapping_img_map_saved");
				img.src = "assets/images/vide.png";
				
				if (intervalMap != null)
				{
					clearInterval(intervalMap);
					intervalMap = null;
				}
				
				GetMappingInConstruction();
			}else{
				$('.ifMapping').hide();
				$('.ifMappingInit').hide();
				$('.ifNMapping').show();
				mappingStarted = false;
			}
		});
	}
	else
	{
		setTimeout(InitMappingWycaByStep, 500);
	}
}

function GetLastMappingWycaByStep()
{
	$('#wyca_by_step_mapping_fin .bMappingSaveMap ').addClass('disabled');
	$('#wyca_by_step_mapping_fin .loading_fin_create_map').show();
	
	img = document.getElementById("wyca_by_step_mapping_img_map_saved_fin");
	img.src = 'assets/images/vide.png';
	
	if(typeof(window.site_name) != 'undefined' && window.site_name != ""){
		$('#wyca_by_step_mapping_from_name').val(window.site_name)
	}else{
		wycaApi.GetCurrentSite(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR){
				window.site_name=data.D.name;
				$('#wyca_by_step_mapping_from_name').val(window.site_name)
			}
		})
	}
	
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetLastMapping(function(data) {
		//wycaApi.GetCurrentMapComplete(function(data) { //TEST W/0 MAPPING
		
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				//data.D = data.D.image; //TEST W/0 MAPPING
				var img = document.getElementById("wyca_by_step_mapping_img_map_saved_fin");
				img.src = 'data:image/png;base64,' + data.D;
				
				finalMapData = 'data:image/png;base64,' + data.D;
				
				setTimeout(function() {
					canvas = document.createElement('canvas');
					
					width = img.naturalWidth;
					height = img.naturalHeight;
					$('#wyca_by_step_mapping_fin .loading_fin_create_map').hide();
					
					$('#wyca_by_step_mapping_canvas_result_trinary').attr('width', img.naturalWidth);
					$('#wyca_by_step_mapping_canvas_result_trinary').attr('height', img.naturalHeight);
					
					canvas.width = img.naturalWidth;
					canvas.height = img.naturalHeight;
					canvas.getContext('2d').drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
					
					//SVG MAP TRINARY
					$('#wyca_by_step_mapping_svg').attr('width', img.naturalWidth);
					$('#wyca_by_step_mapping_svg').attr('height', img.naturalHeight);
					
					$('#wyca_by_step_mapping_image').attr('width', img.naturalWidth);
					$('#wyca_by_step_mapping_image').attr('height', img.naturalHeight);
					
					InitTrinaryMap();
					CalculateMapTrinary();
				}, 100);
			}
			else
			{
				$('#wyca_by_step_mapping_fin .loading_fin_create_map').hide();
				
				ParseAPIAnswerError(data,textErrorGetMapping);
			}
			$('#wyca_by_step_mapping_fin .bMappingSaveMap').removeClass('disabled');
		});
		
		mappingStarted = false;
		$('#wyca_by_step_mapping .switchLiveMapping').hide();
		$('#wyca_by_step_mapping .bMappingStop').hide();
		$('#wyca_by_step_mapping .mapping_view').hide();
		$('#wyca_by_step_mapping .bMappingStart').show();
		
		$('#wyca_by_step_mapping_fin .bMappingCancelMap2').show();
		$('#wyca_by_step_mapping_fin .bMappingSaveMap').show();
		
		if (intervalMap != null)
		{
			clearInterval(intervalMap);
			intervalMap = null;
		}
	}
	else
	{
		setTimeout(GetLastMappingWycaByStep, 500);
	}
}

function InitMaintenanceWycaByStep()
{
	if(getCookie('create_new_site') != '')
		create_new_site = JSON.parse(getCookie('create_new_site'));
}

function DrawSvgCheckWycaByStep()
{
	let svg = $('#wyca_by_step_check svg.svg_legende');
	svg.css('opacity',0);
	if(svg.width() < 300){
		setTimeout(DrawSvgCheckWycaByStep,50);		
	}else{
		let base_w = 375;
		let base_h = 492.5;
		let base_hw_card = 111.65625;
		let base_elodie_height = 120;
		let base_offsetY = base_hw_card  + 50 + 20;
		let base_offsetX = (base_w/4) + 10;
		
		let elodie_height = $('#wyca_by_step_check img#elodie_import_top')[0].getBoundingClientRect().height;
		
		let data = $('svg.svg_legende')[0].getBoundingClientRect();
		let svg_offsetX = data.x;
		let svg_offsetY = data.y;
		let lg_offsetX = window.outerWidth > 1200 ? window.outerWidth/100 : 0;
		let lg_offsetY = window.outerWidth > 1200 ? window.outerHeight/100 : 0;
		
		$('#wyca_by_step_check div.is_checkbox').each(function(idx,item){
			let data = item.getBoundingClientRect();
			
			let top = window.scrollY + data.top;
			let left = window.scrollX + data.left;
			
			let height = data.height;
			let width = data.width;
			
			let offsetY = height + 50 + 20; //(50 margin et padding div , 20 margin img elodie)
			let offsetX = height + 50 + 20; //(50 margin et padding div , 20 margin img elodie)
			
			let line = $(item).data('line');
			
			let placement = $(item).data('line-placement');
			let svgLines = $('svg.svg_legende .'+line);
			svgLines.each(function(){
				svgLine = $(this);
				let x1,x2,y1,y2;
				
				if(isNaN(svgLine.attr('_x1'))){
					x1 = svgLine.attr('x1');
					y1 = svgLine.attr('y1');
					x2 = svgLine.attr('x2');
					y2 = svgLine.attr('y2');
					svgLine.attr('_x1',x1);
					svgLine.attr('_y1',y1);
					svgLine.attr('_x2',x2);
					svgLine.attr('_y2',y2);
				}else{
					x1 = svgLine.attr('_x1');
					y1 = svgLine.attr('_y1');
					x2 = svgLine.attr('_x2');
					y2 = svgLine.attr('_y2');
				}
				
				let _x1,_x2,_y1,_y2;
				
				//CIBLE ELODIE
				let ratioX = (x2 - base_offsetX)/base_w;
				_x2 = (svg.innerWidth()/4 + 10) + ratioX * svg.innerWidth();
				
				let ratioY = (y2 - base_offsetY)/base_elodie_height;
				_y2 = ratioY * elodie_height + offsetY - (svg_offsetY - 54);
				
				//ORIGINE FLECHE
				if(typeof(placement) != 'undefined'){
					switch(placement){
						case 'bottom' : 
							_x1 = left + width/2 - svg_offsetX;
							_y1 = top + height - svg_offsetY;
							_x2 = _x2 + lg_offsetX;
							_y2 = _y2 - lg_offsetY;
						break;				
						case 'top' : 
							_x1 = left + width/2 - svg_offsetX;
							_y1 = top - svg_offsetY;
							//_x2 = _x2 + lg_offsetX;
							_y2 = _y2 - lg_offsetY;
						break;				
						case 'left' : 
							_x1 = left - svg_offsetX;
							_y1 = top + height/2 - svg_offsetY;
						break;				
						case 'right' : 
							_x1 = left + width - svg_offsetX;
							_y1 = top + height/2 - svg_offsetY;
						break;				
						default:
							_x1 = left + width/2 - svg_offsetX;
							_y1 = top + height - svg_offsetY;
						break;			
					}
				}
				
				_x1 = Math.round(_x1);
				_x2 = Math.round(_x2);
				_y1 = Math.round(_y1);
				_y2 = Math.round(_y2);
				
				//console.log('Origine Calcul',_x1,_y1,'Origine Svg',svgLine.attr('x1'),svgLine.attr('y1'));
				//console.log('Cible Calcul',_x2,_y2,'Cible Svg',svgLine.attr('x2'),svgLine.attr('y2'));
				
				svgLine.attr('x1',_x1);
				svgLine.attr('y1',_y1);
				svgLine.attr('x2',_x2);
				svgLine.attr('y2',_y2);
			})
		})
		svg.css('opacity',1);
		console.log('SVG draw');
	}
}

function InitCheckWycaByStep()
{
	
	if (wycaApi.websocketAuthed)
	{
		//INIT 
		$('#wyca_by_step_check .test').removeClass('test'); // REMOVE CLASS TEST
		$('#wyca_by_step_check .checked').removeClass('checked'); // REMOVE CLASS CHECKED
		$('.wyca_by_step_check_next').removeClass('disabled').addClass('disabled'); //DISABLE BTN
		$('.wyca_by_step_check_next').html('<i class="fa fa fa-spinner fa-pulse"></i> '+textBtnCheckTest); // ADD SPINNER ON BTN
		$('#wyca_by_step_check .is_checkbox').removeClass('component_ok component_warning component_error'); // REMOVE OLD TEST CLASS
		
		if(timer_anim_check!=undefined){clearTimeout(timer_anim_check);timer_anim_check=undefined;}
		
		let lg = $('#wyca_by_step_check div.is_checkbox:not(".checked")').length;
		let rd = Math.floor(Math.random() * Math.floor(lg));
		$('#wyca_by_step_check div.is_checkbox:not(".checked")').eq(rd).addClass('test');
		
		wycaApi.CheckComponents(function (data){
			
			save_check_components_result = data.D;
			
			/*
			0: OK
			1: Frequency warning
			2: Frequency error
			3: Software error;
			4: Device error
			5: Not applicable (for cam top)
			*/
			
			if (data.D.LI == 0) $('#wyca_by_step_check_lidar').addClass('component_ok'); 
			else if (data.D.LI == 1) $('#wyca_by_step_check_lidar').addClass('component_warning');
			else $('#wyca_by_step_check_lidar').addClass('component_error'); 
			
			if (data.D.US == 0) $('#wyca_by_step_check_us').addClass('component_ok'); 
			else if (data.D.US == 1) $('#wyca_by_step_check_us').addClass('component_warning');
			else $('#wyca_by_step_check_us').addClass('component_error'); 
			
			if (data.D.M == 0) $('#wyca_by_step_check_motor').addClass('component_ok'); 
			else if (data.D.M == 1) $('#wyca_by_step_check_motor').addClass('component_warning');
			else $('#wyca_by_step_check_motor').addClass('component_error'); 
			
			if (data.D.B == 0) $('#wyca_by_step_check_battery').addClass('component_ok'); 
			else if (data.D.B == 1) $('#wyca_by_step_check_battery').addClass('component_warning');
			else $('#wyca_by_step_check_battery').addClass('component_error'); 
			
			if (data.D.CL == 0 && data.D.CR == 0) $('#wyca_by_step_check_cam3d').addClass('component_ok'); 
			else if (data.D.CL <= 1 && data.D.CR <= 1) $('#wyca_by_step_check_cam3d').addClass('component_warning');
			else $('#wyca_by_step_check_cam3d').addClass('component_error'); 
			
			if (data.D.LE == 0) $('#wyca_by_step_check_leds').addClass('component_ok'); 
			else if (data.D.LE == 1) $('#wyca_by_step_check_leds').addClass('component_warning');
			else $('#wyca_by_step_check_leds').addClass('component_error'); 
			
			setTimeout(StartAnimCheckComposantInstall, 2000);
			
		});
		DrawSvgCheckWycaByStep();
	}
	else
	{
		setTimeout(InitCheckWycaByStep, 500);
	}
}

/* BYSTEP */

function InitMappingByStep()
{
	imgMappingLoaded = true;
	//EMPECHER RETOUR NAVIGATEUR
	history.pushState(null, null, document.URL);
	window.addEventListener('popstate', function () {
		history.pushState(null, null, document.URL);
	});
	
	
	if (wycaApi.websocketAuthed)
	{
		wycaApi.MappingIsStarted(function(data) {
			if (data.D)
			{
				mappingStarted = true;
				
				$('#install_by_step_mapping .bMappingStart').hide();
				$('#install_by_step_mapping .progressStartMapping').hide();
				$('#install_by_step_mapping .switchLiveMapping').show();
				$('#install_by_step_mapping .bMappingStop').show();
				$('#install_by_step_mapping .mapping_view').show();
				$('.ifMapping').show();
				$('.ifMappingInit').hide();
				$('.ifNMapping').hide();
				img = document.getElementById("install_by_step_mapping_img_map_saved");
				img.src = "assets/images/vide.png";
				
				if (intervalMap != null)
				{
					clearInterval(intervalMap);
					intervalMap = null;
				}
				
				GetMappingInConstruction();
			}else{
				$('.ifMapping').hide();
				$('.ifMappingInit').hide();
				$('.ifNMapping').show();
				mappingStarted = false;
			}
		});
	}
	else
	{
		setTimeout(InitMappingByStep, 500);
	}
}

function GetLastMappingByStep()
{
	$('#install_by_step_mapping_fin .bMappingSaveMap ').addClass('disabled');
	$('#install_by_step_mapping_fin .loading_fin_create_map').show();
	
	img = document.getElementById("install_by_step_mapping_img_map_saved_fin");
	img.src = 'assets/images/vide.png';
	
	if(typeof(window.site_name) != 'undefined' && window.site_name != ""){
		$('#install_by_step_mapping_from_name').val(window.site_name)
	}else{
		wycaApi.GetCurrentSite(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR){
				window.site_name=data.D.name;
				$('#install_by_step_mapping_from_name').val(window.site_name)
			}
		})
	}
	
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetLastMapping(function(data) {
		//wycaApi.GetCurrentMapComplete(function(data) { //TEST W/0 MAPPING
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
				//data.D = data.D.image; //TEST W/0 MAPPING
				var img = document.getElementById("install_by_step_mapping_img_map_saved_fin");
				img.src = 'data:image/png;base64,' + data.D;
				
				finalMapData = 'data:image/png;base64,' + data.D;
				
				setTimeout(function() {
					canvas = document.createElement('canvas');
					
					width = img.naturalWidth;
					height = img.naturalHeight;
					$('#install_by_step_mapping_fin .loading_fin_create_map').hide();
					
					$('#install_by_step_mapping_canvas_result_trinary').attr('width', img.naturalWidth);
					$('#install_by_step_mapping_canvas_result_trinary').attr('height', img.naturalHeight);
					
					canvas.width = img.naturalWidth;
					canvas.height = img.naturalHeight;
					canvas.getContext('2d').drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
					
					//SVG MAP TRINARY
					$('#install_by_step_mapping_svg').attr('width', img.naturalWidth);
					$('#install_by_step_mapping_svg').attr('height', img.naturalHeight);
					
					$('#install_by_step_mapping_image').attr('width', img.naturalWidth);
					$('#install_by_step_mapping_image').attr('height', img.naturalHeight);
					
					InitTrinaryMap();
					CalculateMapTrinary();
				}, 100);
			}
			else
			{
				$('#install_by_step_mapping_fin .loading_fin_create_map').hide();
				
				ParseAPIAnswerError(data,textErrorGetMapping);
			}
			$('#install_by_step_mapping_fin .bMappingSaveMap').removeClass('disabled');
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
	}
	else
	{
		setTimeout(GetLastMappingByStep, 500);
	}
}

function InitMaintenanceByStep()
{
	if(getCookie('create_new_site') != '')
		create_new_site = JSON.parse(getCookie('create_new_site'));
}

function DrawSvgCheckByStep()
{
	let svg = $('#install_by_step_check svg.svg_legende');0
	svg.css('opacity',0);
	if(svg.width() < 300){
		setTimeout(DrawSvgCheckByStep,50);		
	}else{
		let base_w = 375;
		let base_h = 492.5;
		let base_hw_card = 111.65625;
		let base_elodie_height = 120;
		let base_offsetY = base_hw_card  + 50 + 20;
		let base_offsetX = (base_w/4) + 10;
		
		let elodie_height = $('#install_by_step_check img#elodie_import_top')[0].getBoundingClientRect().height;
		
		let data = $('svg.svg_legende')[0].getBoundingClientRect();
		let svg_offsetX = data.x;
		let svg_offsetY = data.y;
		let lg_offsetX = window.outerWidth > 1200 ? window.outerWidth/100 : 0;
		let lg_offsetY = window.outerWidth > 1200 ? window.outerHeight/100 : 0;
		
		$('#install_by_step_check div.is_checkbox').each(function(idx,item){
			let data = item.getBoundingClientRect();
			
			let top = window.scrollY + data.top;
			let left = window.scrollX + data.left;
			
			let height = data.height;
			let width = data.width;
			
			let offsetY = height + 50 + 20; //(50 margin et padding div , 20 margin img elodie)
			let offsetX = height + 50 + 20; //(50 margin et padding div , 20 margin img elodie)
			
			let line = $(item).data('line');
			
			let placement = $(item).data('line-placement');
			let svgLines = $('svg.svg_legende .'+line);
			svgLines.each(function(){
				svgLine = $(this);
				let x1,x2,y1,y2;
				
				if(isNaN(svgLine.attr('_x1'))){
					x1 = svgLine.attr('x1');
					y1 = svgLine.attr('y1');
					x2 = svgLine.attr('x2');
					y2 = svgLine.attr('y2');
					svgLine.attr('_x1',x1);
					svgLine.attr('_y1',y1);
					svgLine.attr('_x2',x2);
					svgLine.attr('_y2',y2);
				}else{
					x1 = svgLine.attr('_x1');
					y1 = svgLine.attr('_y1');
					x2 = svgLine.attr('_x2');
					y2 = svgLine.attr('_y2');
				}
				
				let _x1,_x2,_y1,_y2;
				
				//CIBLE ELODIE
				let ratioX = (x2 - base_offsetX)/base_w;
				_x2 = (svg.innerWidth()/4 + 10) + ratioX * svg.innerWidth();
				
				let ratioY = (y2 - base_offsetY)/base_elodie_height;
				_y2 = ratioY * elodie_height + offsetY - (svg_offsetY - 54);
				
				//ORIGINE FLECHE
				if(typeof(placement) != 'undefined'){
					switch(placement){
						case 'bottom' : 
							_x1 = left + width/2 - svg_offsetX;
							_y1 = top + height - svg_offsetY;
							_x2 = _x2 + lg_offsetX;
							_y2 = _y2 - lg_offsetY;
						break;				
						case 'top' : 
							_x1 = left + width/2 - svg_offsetX;
							_y1 = top - svg_offsetY;
							//_x2 = _x2 + lg_offsetX;
							_y2 = _y2 - lg_offsetY;
						break;				
						case 'left' : 
							_x1 = left - svg_offsetX;
							_y1 = top + height/2 - svg_offsetY;
						break;				
						case 'right' : 
							_x1 = left + width - svg_offsetX;
							_y1 = top + height/2 - svg_offsetY;
						break;				
						default:
							_x1 = left + width/2 - svg_offsetX;
							_y1 = top + height - svg_offsetY;
						break;			
					}
				}
				
				_x1 = Math.round(_x1);
				_x2 = Math.round(_x2);
				_y1 = Math.round(_y1);
				_y2 = Math.round(_y2);
				
				//console.log('Origine Calcul',_x1,_y1,'Origine Svg',svgLine.attr('x1'),svgLine.attr('y1'));
				//console.log('Cible Calcul',_x2,_y2,'Cible Svg',svgLine.attr('x2'),svgLine.attr('y2'));
				
				svgLine.attr('x1',_x1);
				svgLine.attr('y1',_y1);
				svgLine.attr('x2',_x2);
				svgLine.attr('y2',_y2);
			})
		})
		svg.css('opacity',1);
		console.log('SVG draw');
	}
}

function InitCheckByStep()
{
	
	if (wycaApi.websocketAuthed)
	{
		
		//INIT 
		$('#install_by_step_check .test').removeClass('test'); // REMOVE CLASS TEST
		$('#install_by_step_check .checked').removeClass('checked'); // REMOVE CLASS CHECKED
		$('.install_by_step_check_next').removeClass('disabled').addClass('disabled'); //DISABLE BTN
		$('.install_by_step_check_next').html('<i class="fa fa fa-spinner fa-pulse"></i> '+textBtnCheckTest); // ADD SPINNER ON BTN
		$('#install_by_step_check .is_checkbox').removeClass('component_ok component_warning component_error'); // REMOVE OLD TEST CLASS
		
		if(timer_anim_check!=undefined){clearTimeout(timer_anim_check);timer_anim_check=undefined;}
		
		let lg = $('#install_by_step_check div.is_checkbox:not(".checked")').length;
		let rd = Math.floor(Math.random() * Math.floor(lg));
		$('#install_by_step_check div.is_checkbox:not(".checked")').eq(rd).addClass('test');
		
		wycaApi.CheckComponents(function (data){
			
			save_check_components_result = data.D;
			
			/*
			0: OK
			1: Frequency warning
			2: Frequency error
			3: Software error;
			4: Device error
			5: Not applicable (for cam top)
			*/
			
			if (data.D.LI == 0) $('#install_by_step_check_lidar').addClass('component_ok'); 
			else if (data.D.LI == 1) $('#install_by_step_check_lidar').addClass('component_warning');
			else $('#install_by_step_check_lidar').addClass('component_error'); 
			
			if (data.D.US == 0) $('#install_by_step_check_us').addClass('component_ok'); 
			else if (data.D.US == 1) $('#install_by_step_check_us').addClass('component_warning');
			else $('#install_by_step_check_us').addClass('component_error'); 
			
			if (data.D.M == 0) $('#install_by_step_check_motor').addClass('component_ok'); 
			else if (data.D.M == 1) $('#install_by_step_check_motor').addClass('component_warning');
			else $('#install_by_step_check_motor').addClass('component_error'); 
			
			if (data.D.B == 0) $('#install_by_step_check_battery').addClass('component_ok'); 
			else if (data.D.B == 1) $('#install_by_step_check_battery').addClass('component_warning');
			else $('#install_by_step_check_battery').addClass('component_error'); 
			
			if (data.D.CL == 0 && data.D.CR == 0) $('#install_by_step_check_cam3d').addClass('component_ok'); 
			else if (data.D.CL <= 1 && data.D.CR <= 1) $('#install_by_step_check_cam3d').addClass('component_warning');
			else $('#install_by_step_check_cam3d').addClass('component_error'); 
			
			if (data.D.LE == 0) $('#install_by_step_check_leds').addClass('component_ok'); 
			else if (data.D.LE == 1) $('#install_by_step_check_leds').addClass('component_warning');
			else $('#install_by_step_check_leds').addClass('component_error'); 
			
			setTimeout(StartAnimCheckComposantInstall, 2000);
			
		});
		DrawSvgCheckByStep();
	}
	else
	{
		setTimeout(InitCheckByStep, 500);
	}
}

/* GENERAL FUNCTIONS */

var currentDeleteId = '';
var touchHandled = false;

function simulateMouseEvent (event, simulatedType)
{

    // Ignore multi-touch events
    if (event.originalEvent.touches.length > 1) {
      return;
    }

    event.preventDefault();

    var touch = event.originalEvent.changedTouches[0],
        simulatedEvent = document.createEvent('MouseEvents');

    // Initialize the simulated mouse event using the touch event's coordinates
    simulatedEvent.initMouseEvent(
      simulatedType,    // type
      true,             // bubbles
      true,             // cancelable
      window,           // view
      1,                // detail
      touch.screenX,    // screenX
      touch.screenY,    // screenY
      touch.clientX,    // clientX
      touch.clientY,    // clientY
      false,            // ctrlKey
      false,            // altKey
      false,            // shiftKey
      false,            // metaKey
      0,                // button
      null              // relatedTarget
    );

    // Dispatch the simulated event to the target element
    event.target.dispatchEvent(simulatedEvent);
}

function alert_wyca(text)
{
	$('#alert_wyca p').html(text);
	$('#alert_wyca').show();
}

function warning_wyca(text)
{
	$('#warning_wyca p').html(text);
	$('#warning_wyca').show();
}

function success_wyca(text)
{
	$('#success_wyca p').html(text);
	$('#success_wyca').show();
}

function success_info_wyca(text)
{
	$('#success_info_wyca p').html(text);
	$('#success_info_wyca').show();
}

function validColor(str){
	if(str.indexOf('#') == 0){
		hex = str.substring(1);
		return typeof hex === 'string' && hex.length === 6 && !isNaN(Number('0x' + hex));
	}else if(str.indexOf('rgb') == 0){
		rgb = str.substring(3).replace('(','').replace(')','').split(',');
		return rgb.length === 3 && !isNaN(parseInt(rgb[0])) && rgb[0] >= 0 && rgb[0] <= 255&& !isNaN(parseInt(rgb[1])) && rgb[1] >= 0 && rgb[1] <= 255 && !isNaN(parseInt(rgb[2])) && rgb[2] >= 0 && rgb[2] <= 255;
	}else 
		return false;
}

function hexToRgb(hex)
{
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function DisplayError(text)
{
	$('.popup_error .panel-body').html(text);
	$('.popup_error').show();
}

function CheckName(tab, nom, index_ignore=-1)
{
	let res = false;
	nom = nom.toLowerCase();
	if(typeof(tab) == 'object'){
		$.each(tab,function(idx,item){
			if(idx != index_ignore && item.name.toLowerCase() == nom && item.deleted != true)
			{
				res = true;
			}
		});
	}
	return res;
}

function FindElemByName(tab, nom)
{
	let res = false;
	nom = nom.toLowerCase();
	$.each(tab,function(idx,item){
		if(item.name.toLowerCase() == nom)
		{
			res = item;
		}
	});
	return res;
}

function ParseAPIAnswerError(data,pre_txt = '' ,post_txt = '')
{
	console.log('ERROR API',JSON.stringify(data));
	let txt = '';
	if( data.A == wycaApi.AnswerCode.CANCELED ){
		if (data.M != ''){
			if(data.M.length > 50)
				txt = wycaApi.AnswerCodeToString(data.A)+'<br><span>'+data.M+'</span>';
			else
				txt = wycaApi.AnswerCodeToString(data.A)+'<br>'+data.M;
		}else{
			txt = wycaApi.AnswerCodeToString(data.A);
		}
		pre_txt  = pre_txt  == '' ? '' : pre_txt + ' <br>';
		post_txt = post_txt == '' ? '' : '<br> ' + post_txt;
		txt = pre_txt + txt + post_txt;
		warning_wyca(txt);
	}else{
		if(data.A == wycaApi.AnswerCode.NOT_CURRENT_MAP){
			setTimeout(AskReloadMap,500);
		}
		if (data.M != ''){
			if(data.M.length > 50)
				txt = wycaApi.AnswerCodeToString(data.A)+'<br><span>'+data.M+'</span>';
			else
				txt = wycaApi.AnswerCodeToString(data.A)+'<br>'+data.M;
		}else{
			txt = wycaApi.AnswerCodeToString(data.A);
		}
		pre_txt  = pre_txt  == '' ? '' : pre_txt + ' <br>';
		post_txt = post_txt == '' ? '' : '<br> ' + post_txt;
		txt = pre_txt + txt + post_txt;
		alert_wyca(txt);
	}
}

function GetDataMapToSave()
{
	if(typeof(updatingMap) != 'undefined')
		updatingMap = true;
	
	if($('.burger_menu:visible').length >0)
		$('.burger_menu:visible').addClass('updatingMap');
	
	data = {};
	
	data.forbiddens = forbiddens;
	$.each(data.forbiddens, function(indexInArray, forbidden){
		if (forbidden.id_area >= 300000)
		{
			data.forbiddens[indexInArray].id_area = -1;
		}
	});
	data.areas = areas;
	$.each(data.areas, function(indexInArray, area){
		if (area.id_area >= 300000)
		{
			data.areas[indexInArray].id_area = -1;
		}
	});
	data.gommes = gommes;
	data.docks = docks;
	$.each(data.docks, function(indexInArray, dock){
		if (dock.id_docking_station >= 300000)
		{
			data.docks[indexInArray].id_docking_station = -1;
		}
	});
	data.pois = pois;
	$.each(data.pois, function(indexInArray, poi){
		if (poi.id_poi >= 300000)
		{
			data.pois[indexInArray].id_poi = -1;
		}
	});
	data.augmented_poses = augmented_poses;
	$.each(data.augmented_poses, function(indexInArray, augmented_pose){
		if (augmented_pose.id_augmented_pose >= 300000)
		{
			data.augmented_poses[indexInArray].id_augmented_pose = -1;
		}
	});
	data.landmarks = landmarks;
	$.each(data.landmarks, function(indexInArray, landmark){
		if (landmark.id_landmark >= 300000)
		{
			data.landmarks[indexInArray].id_landmark = -1;
		}
	});
	data.id_map = id_map;
	return data;
}

function TogglePopupHelp()
{
	if($('.global_sub_page').length == 0)
		$('.global_page.active section.active .popupHelp').toggle('fast');
	else
		$('.global_sub_page.active section.active .popupHelp').toggle('fast');
}

/* GESTION COOKIES */

function setCookie(cname, cvalue, exdays = 90)
{
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname)
{
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function deleteCookie(cname)
{
	cvalue = '';
	var d = new Date(null); //1 Janv 1970 use passed date to delete cookies
	d.setTime(d.getTime() + (90 * 24 * 60 * 60 * 1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function resetCookies()
{
	let tab =['create_new_site','create_new_map','boolHelpManagerI','boolHelpAreaI','boolHelpForbiddenI','boolHelpGotoPoseI','boolHelpGotoPoseM','boolHelpGotoPoseU','APP_SOUND'];
	tab.forEach(cookie => deleteCookie(cookie))
}

function listCookies()
{
    var theCookies = document.cookie.split(';');
    var aString = '';
    for (var i = 1 ; i <= theCookies.length; i++) {
        aString += i + ' ' + theCookies[i-1] + "\n";
    }
    return aString;
}

/* GESTION C.CONF */

function GetAppSoundConf(){
	$.ajax({
		type: "POST",
		url: 'ajax/get_app_sound.php',
		data: { },
		dataType: 'json',
		success: function(data) {
			//console.log(data);
			if(data.app_sound){
				app_sound_is_on = true;
			}else{
				app_sound_is_on = false;
			}
		},
		error: function(e) {
		   if(e.responseText == 'no_auth' || e.responseText == 'no_right'){
				console.log((typeof(textErrorGetSound) != 'undefined'? textErrorGetSound : 'Error get sound config') + ' ' + e.responseText + '\n' + (typeof(textNeedReconnect) != 'undefined'? textNeedReconnect : 'Reconnection is required'));
				$('#modalErrorSession').modal('show');
			}else{
				console.log((typeof(textErrorGetSound) != 'undefined'? textErrorGetSound : 'Error get sound config') + ' ' + e.responseText );
			}
		}
	});
}

function RefreshGlobalVehiculePersistanteDataStorage(){
	wycaApi.GetGlobalVehiculePersistanteDataStorage(function(data) {
		if (data.A == wycaApi.AnswerCode.NO_ERROR)
		{
			console.log('GlobalVehiculePersistanteDataStorage',data.D);
			wycaApi.SetGlobalVehiculePersistanteDataStorage(data.D,function(data) {
				if (data.A != wycaApi.AnswerCode.NO_ERROR)
					ParseAPIAnswerError(data,textErrorSetGlobalVehiculePersistanteDataStorage);
			})
		}
		else
			ParseAPIAnswerError(data,textErrorGetGlobalVehiculePersistanteDataStorage);
	});
}