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

var vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', vh+'px');

window.addEventListener('resize', () => {
  // We execute the same script as before
  vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh+'px');
});

$(window).on("popstate", function(e) {
    change(e.originalEvent.state);
});

(function(original) { // overwrite history.pushState so that it also calls
                      // the change function when called
    history.pushState = function(state) {
        //change(state);
        return original.apply(this, arguments);
    };
})(history.pushState);

$(document).ready(function(e) {
	$('#bHeaderInfo').attr('onClick',"$('.global_sub_page.active section.active .popupHelp').toggle('fast')");
	
	$('.iro-colorpicker').each(function(){
		let preview = $(this).parent().find('.preview_color');
		let input = $(this).parent().find('input[type="text"]');
		let div = $(this);
		let color_init = $(this).data('color_init');
		var colorPicker = new iro.ColorPicker(this, {
			wheelLightness:false,
			color: color_init,
		});
		preview.on('click',function(){
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
		colorPicker.on(['color:init', 'color:change'], function(color) {
			preview.css('color',color.rgbString);
			input.val(color.hexString);
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
			console.log('onUndockResult',data);
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
			}
			else
			{	
				ParseAPIAnswerError(data);
			}
			// On rebranche l'ancienne fonction
			wycaApi.on('onUndockResult', onUndockResult);
		});
		
		wycaApi.Undock(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
			}
			else
			{
				ParseAPIAnswerError(data);
			}
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
						alert_wyca('Error step site ; ' + e.responseText);
					}
				});
			}
			if(target == 'install_by_step_wifi'){ //UPDATE INSTALL STEP ON BACK FROM CREATE NEW SITE PROCESS NORMAL
				if(getCookie('create_new_site') || create_new_site){
					setCookie('create_new_site',false);
					$.ajax({
						type: "POST",
						url: 'ajax/install_by_step_finish.php',
						data: {
						},
						dataType: 'json',
						success: function(data) {
						},
						error: function(e) {
							alert_wyca('Error step site ; ' + e.responseText);
						}
					});
					$('#modalBack').modal('hide');
					$('#pages_install_by_step').removeClass('active');
					$('#pages_install_normal').addClass('active');
					
					//AFFICHER QQ CHOSE
					$('section#install_normal_setup_sites').show('slow');
					
					if ($('#install_normal_setup_sites').is(':visible'))
					{
						GetSitesNormal();
					}
					
		
				}
			}
			
		}else{
			let fromBackBtn = false;
			if($(this).data('goto').includes('fromBackBtn')){
				let goTo =  $(this).data('goto').split('_fromBackBtn')[0];
				$(this).data('goto',goTo);
				fromBackBtn = true;
			}
			e.preventDefault();
			history.pushState({ current_groupe:$('.menu_groupe .active').attr('id'), current_page:$(this).data('goto')}, $(this).data('goto'), "/#"+$(this).data('goto'));
			next = $(this).data('goto');
			
			$('#modalBack').modal('hide');
			let section_active = $('section.active');
			$('section.active').removeClass('active');
			$('section.page').hide();
			
			$('#bHeaderInfo').attr('onClick',""); // REINIT (i) icone
			$('#bHeaderInfo').attr('onClick',"$('#"+next+" .popupHelp').toggle('fast')");
			
			console.log('next ',next);
			
			if (next == 'install_by_step_tops') InitTopsByStep();
			if (next == 'install_by_step_top') InitTopsActiveByStep();
			if (next == 'install_by_step_check') InitCheckByStep();		
			if (next == 'install_by_step_wifi') InitInstallWifiPageByStep();
			if (next == 'install_by_step_config') GetConfigurationsByStep();
			if (next == 'install_by_step_mapping') InitMappingByStep();
			if (next == 'install_by_step_import_site') InitSiteImportByStep();
			
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
						$('#install_by_step_maintenance .bBackButton').click();
					else
						$('#install_by_step_maintenance .install_by_step_maintenance_next').click();
				}
			}
			
			if (next == 'install_by_step_site_master_dock' && fromBackBtn) InitMasterDockByStep('back');
			if (next == 'install_by_step_site_master_dock' && !fromBackBtn) InitMasterDockByStep();
			if (next == 'install_by_step_manager') {
				GetManagersByStep();
				$('#bHeaderInfo').attr('onClick',"$('#install_by_step_manager .modalHelpManager').modal('show')");
			}
			if (next == 'install_by_step_service_book') GetServiceBooksByStep();
			
			if (next == 'install_normal_setup_sites') GetSitesNormal();
			if (next == 'install_normal_setup_export') GetSitesForExportNormal();
			if (next == 'install_normal_setup_import') InitSiteImportNormal();
			if (next == 'install_normal_setup_tops') InitTopsNormal();
			if (next == 'install_normal_setup_top') InitTopsActiveNormal();
			if (next == 'install_normal_setup_config') GetConfigurationsNormal();
			if (next == 'install_normal_setup_wifi') InitInstallWifiPageNormal();
			if (next == 'install_normal_manager') {
				GetManagersNormal();
				$('#bHeaderInfo').attr('onClick',"$('#install_normal_manager .modalHelpManager').modal('show')");
			}
			if (next == 'install_normal_user') GetUsersNormal();
			if (next == 'install_normal_service_book') GetServiceBooksNormal();
			if (next == 'install_normal_edit_map') GetInfosCurrentMapNormal();
			if (next == 'install_normal_setup_trinary') NormalInitTrinary();
					
			if (next == 'manager_edit_map') GetInfosCurrentMapManager();
			if (next == 'manager_top') InitTopsActiveManager();
			if (next == 'manager_users') GetUsersManager();
			
			if (next == 'user_edit_map') GetInfosCurrentMapUser();
			
			if (next == 'wyca_demo_mode_config') InitWycaDemo();
			if (next == 'wyca_demo_mode_start_stop') InitWycaDemoState();
			
			if(anim_show){
				// Anim HIDE
				var startShowAfter = 0;
				if ($(this).closest('section').hasClass('hmi_tuile'))
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
				
				// Anim SHOW
				next = $(this).data('goto');
				if ($('#'+next).hasClass('hmi_tuile'))
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
				
				//
				InitJoystick();

				}
			}
    });
	/* ------------------------- GESTION BTN GOTO -----------------------*/
	
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
		$(this).data('confirmed_delete',false);
		if($(this)[0].nodeName == 'A'){
			currentDeleteId = $(this).parent().attr('id');
		}
		$('#modalConfirmDelete').modal('show');
	})
	
	$('#bModalConfirmDeleteOk').click(function(e){
		if(currentDeleteId !=''){
			$('#'+currentDeleteId).find('.btn_confirm_delete').click();
			currentDeleteId = '';
		}
	})
	
});
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

function InitSiteImportNormal()
{
	$('#pages_install_normal .filename_import_site').html('');
	$('#pages_install_normal .filename_import_site').hide();
	$('#pages_install_normal .file_import_site_wrapper').css('background-color','#589fb26e');
	$('#pages_install_normal .file_import_site').val('');
	
	$('#pages_install_normal .install_normal_setup_import_loading').hide();
	$('#pages_install_normal .install_normal_setup_import_content').show();
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

function InitTopImportByStep()
{
	$('#pages_install_by_step .modalImportTop .filename_import_top').html('');
	$('#pages_install_by_step .modalImportTop .filename_import_top').hide();
	$('#pages_install_by_step .modalImportTop .file_import_top_wrapper').css('background-color','#589fb26e');
	$('#pages_install_by_step .modalImportTop .file_import_top').val('');
}

function InitTopImportNormal()
{
	$('#pages_install_normal .modalImportTop .filename_import_top').html('');
	$('#pages_install_normal .modalImportTop .filename_import_top').hide();
	$('#pages_install_normal .modalImportTop .file_import_top_wrapper').css('background-color','#589fb26e');
	$('#pages_install_normal .modalImportTop .file_import_top').val('');
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
		setTimeout(GetUsers, 500);
	}

}

var current_site = {};

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
					$('#install_normal_setup_sites .list_sites').append('' +
						'<li id="install_normal_setup_sites_list_site_elem_'+value.id_site+'" data-id_site="'+value.id_site+'">'+
						'	<span class="societe">'+value.name+'</span>'+
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
					$('#install_normal_setup_export .list_sites').append('' +
						'<li id="install_normal_setup_export_list_site_elem_'+value.id_site+'" data-id_site="'+value.id_site+'" class="bSiteExportElem">'+
						'	<span class="societe">'+value.name+'</span>'+
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
		setTimeout(GetSitesNormal, 500);
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

function InitTopsNormal()
{
	$('.install_normal_setup_tops_loading').show();
	$('#install_normal_setup_tops .tuiles').html('');
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetTopsList(function(data) {
			//console.log(data);
			$.each(data.D,function(index, value){
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

function InitTopsActiveNormal()
{
	$('.install_normal_setup_top_loading').show();
	$('#install_normal_setup_top .tuiles').html('');
	if (wycaApi.websocketAuthed)
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
	{
		setTimeout(InitTopsActiveNormal, 500);

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

function InitMaintenanceByStep()
{
	if(getCookie('create_new_site') != '')
		create_new_site = JSON.parse(getCookie('create_new_site'));
}

var save_check_components_result = undefined;

function DrawSvgCheckByStep()
{
	let svg = $('#install_by_step_check svg.svg_legende');
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
						break;				
						case 'top' : 
							_x1 = left + width/2 - svg_offsetX;
							_y1 = top - svg_offsetY;
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

function GetLastMappingByStep()
{
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
			
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
			
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
			}
			else
			{
				$('#install_by_step_mapping_fin .loading_fin_create_map').hide();
				
				alert_wyca('Recovery mapping error ; ' + data.M);
			}
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

function InitInstallWifiPageNormal()
{
	if (wycaApi.websocketAuthed)
	{
		
		wycaApi.GetWifiList(function(data) {
			$('.install_normal_setup_wifi_loading').hide();
			$('#install_normal_setup_wifi tr').hide();
			if (data.D.length > 0)
			{
				$.each(data.D,function(index, value){
					signal = parseInt(value.signal/20);
					if ($('#install_normal_setup_wifi .wifi'+value.bssid).length > 0)
					{
						$('#install_normal_setup_wifi tr').show();
						$('#install_normal_setup_wifi .wifi'+value.bssid+' img').attr('src', 'assets/images/signal-'+signal+'.png');
						if (value.state == 'active')
						{
							$('#install_normal_setup_wifi tr').removeClass('active');
							$('#install_normal_setup_wifi .wifi'+value.bssid).addClass('active');
						}
					}
					else
					{
						if (value.state == 'active')
							$('.tbody_wifi').append('<tr data-ssid="'+value.ssid+'" class="wifi'+value.bssid+' '+ value.state +'"><td><i class="fas fa-check"></i> '+value.ssid+'</td><td><img src="assets/images/signal-'+signal+'.png" /></td></tr>');
						else
							$('.tbody_wifi').append('<tr data-ssid="'+value.ssid+'" class="wifi'+value.bssid+' '+ value.state +'"><td>'+value.ssid+'</td><td><img src="assets/images/signal-'+signal+'.png" /></td></tr>');
					}
				});
			}
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
		
		wycaApi.GetWifiList(function(data) {
			$('.install_bystep_setup_wifi_loading').hide();
			$('#install_by_step_wifi tr').hide();
			if (data.D.length > 0)
			{
				$.each(data.D,function(index, value){
					signal = parseInt(value.signal/20);
					if ($('#install_by_step_wifi .wifi'+value.bssid).length > 0)
					{
						$('#install_by_step_wifi tr').show();
						$('#install_by_step_wifi .wifi'+value.bssid+' img').attr('src', 'assets/images/signal-'+signal+'.png');
						if (value.state == 'active')
						{
							$('#install_by_step_wifi tr').removeClass('active');
							$('#install_by_step_wifi .wifi'+value.bssid).addClass('active');
						}
					}
					else
					{
						if (value.state == 'active')
							$('.tbody_wifi').append('<tr data-ssid="'+value.ssid+'" class="wifi'+value.bssid+' '+ value.state +'"><td><i class="fas fa-check"></i> '+value.ssid+'</td><td><img src="assets/images/signal-'+signal+'.png" /></td></tr>');
						else
							$('.tbody_wifi').append('<tr data-ssid="'+value.ssid+'" class="wifi'+value.bssid+' '+ value.state +'"><td>'+value.ssid+'</td><td><img src="assets/images/signal-'+signal+'.png" /></td></tr>');
					}
				});
			}
		});
		
		if ($('#install_by_step_wifi').is(':visible'))
			setTimeout(InitInstallWifiPageByStep, 3000);
	}
	else
	{
		setTimeout(InitInstallWifiPageByStep, 500);
	}
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
		pre_txt = pre_txt == '' ? '' : pre_txt+'<br>';
		post_txt = post_txt == '' ? '' : '<br>'+post_txt;
		txt = pre_txt+txt+post_txt;
		warning_wyca(txt);
	}else{
		if (data.M != ''){
			if(data.M.length > 50)
				txt = wycaApi.AnswerCodeToString(data.A)+'<br><span>'+data.M+'</span>';
			else
				txt = wycaApi.AnswerCodeToString(data.A)+'<br>'+data.M;
		}else{
			txt = wycaApi.AnswerCodeToString(data.A);
		}
		pre_txt  = pre_txt == ''  ? '' : pre_txt + '<br>';
		post_txt = post_txt == '' ? '' : '<br>' + post_txt;
		txt = pre_txt + txt + post_txt;
		alert_wyca(txt);
	}
}

function GetDataMapToSave()
{
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
	
	return data;
}

function TogglePopupHelp(){
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
	let tab =['create_new_site','boolHelpManagerI','boolHelpAreaI','boolHelpForbiddenI','boolHelpGotoPoseI','boolHelpGotoPoseM','boolHelpGotoPoseU'];
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
