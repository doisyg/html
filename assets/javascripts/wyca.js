function HideTuile(element)
{
	element.css({ transform: 'rotatey(90deg)', "z-index": "0" });
}
function ShowTuile(element)
{
	element.css({ transform: 'rotatey(0deg)', "z-index": "0" });
}

function change(state) {
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
	
	$('#bCloseSuccessWyca').click(function(e) {
        e.preventDefault();
		$('#success_wyca p').html('');
		$('#success_wyca').hide();
    });
	
	$('.bUndock').click(function(e) {
        e.preventDefault();
		wycaApi.Undock(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR)
			{
			}
			else
			{
				alert_wyca(wycaApi.AnswerCodeToString(data.A));
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
	
	$( 'body' ).on( 'click', '.button_goto', function(e) {
        e.preventDefault();
		history.pushState({ current_groupe:$('.menu_groupe .active').attr('id'), current_page:$(this).data('goto')}, $(this).data('goto'), "/#"+$(this).data('goto'));
		
		next = $(this).data('goto');
		if (next == 'install_by_step_wifi') InitInstallWifiPageByStep();
		if (next == 'install_by_step_tops') InitTopsByStep();
		if (next == 'install_by_step_top') InitTopsActiveByStep();
		if (next == 'install_by_step_check') InitCheckByStep();		
		if (next == 'install_by_step_config') GetConfigurationsByStep();
		if (next == 'install_by_step_manager') GetManagersByStep();
		if (next == 'install_by_step_service_book') GetServiceBooksByStep();
		if (next == 'install_by_step_mapping') InitMappingByStep();
		
		if (next == 'install_normal_setup_sites') GetSitesNormal();
		if (next == 'install_normal_setup_export') GetSitesForExportNormal();
		if (next == 'install_normal_setup_tops') InitTopsNormal();
		if (next == 'install_normal_setup_top') InitTopsActiveNormal();
		if (next == 'install_normal_setup_vehicule') GetConfigurationsNormal();
		if (next == 'install_normal_setup_wifi') InitInstallWifiPageNormal();
		if (next == 'install_normal_manager') GetManagersNormal();
		if (next == 'install_normal_service_book') GetServiceBooksNormal();
		if (next == 'install_normal_edit_map') GetInfosCurrentMapNormal();
		if (next == 'install_normal_setup_trinary') NormalInitTrinary();
		
		if (next == 'manager_edit_map') GetInfosCurrentMapManager();
		if (next == 'manager_top') InitTopsActiveManager();
		if (next == 'manager_users') GetUsers();
		if (next == 'user_edit_map') GetInfosCurrentMapUser();
		
		if (next == 'wyca_demo_mode_config') InitWycaDemo();
		if (next == 'wyca_demo_mode_start_stop') InitWycaDemoState();
		
		
		
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
		
		
		InitJoystick();
    });
	
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
});

var touchHandled = false;

function simulateMouseEvent (event, simulatedType) {

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
				
				var date = new Date(value.date * 1000);
				
				$('#install_normal_service_book .list_service_books').prepend('' +
						'<li>'+
						'	<div class="date">'+date.toLocaleDateString("en-US") +'</div>'+
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
				$('#install_by_step_service_book .list_service_books').append('' +
						'<li>'+
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

function GetUsers()
{
	$('.manager_users_loading').show();
	$('#manager_users .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetUsersList(function(data) {
			
			$('#manager_users .list_users').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				if (value.id_group_user  == 4)
				{
					$('#manager_users .list_users').append('' +
						'<li id="manager_users_list_user_elem_'+value.id_user+'" data-id_user="'+value.id_user+'">'+
						'	<span class="societe">'+value.company+'</span><br /><span class="prenom">'+value.firstname+'</span> <span class="nom">'+value.lastname+'</span><br /><span class="email">'+value.email+'</span>'+
						'	<a href="#" class="bUserDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bUserEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
			});
			
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
			console.log(current_site);
			wycaApi.GetSitesList(function(data) {
				
				$('#install_normal_setup_sites .list_sites').html('');
				
				if (data.D != undefined)
				$.each(data.D,function(index, value){
					$('#install_normal_setup_sites .list_sites').append('' +
						'<li id="install_normal_setup_sites_list_site_elem_'+value.id_site+'" data-id_site="'+value.id_site+'">'+
						'	<span class="societe">'+value.name+'</span>'+
						(current_site.id_site != value.id_site?'	<a href="#" class="bSiteDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>':'')+
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
			console.log(current_site);
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

function GetManagersNormal()
{
	$('.install_normal_manager_loading').show();
	$('#install_normal_manager .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetUsersList(function(data) {
			
			$('#install_normal_manager .list_managers').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				if (value.id_group_user  == 3)
				{
					$('#install_normal_manager .list_managers').append('' +
						'<li id="install_normal_manager_list_manager_elem_'+value.id_user+'" data-id_user="'+value.id_user+'">'+
						'	<span class="societe">'+value.company+'</span><br /><span class="prenom">'+value.firstname+'</span> <span class="nom">'+value.lastname+'</span><br /><span class="email">'+value.email+'</span>'+
						'	<a href="#" class="bManagerDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bManagerEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
			});
			
			$('.install_normal_manager_loading').hide();
			$('#install_normal_manager .loaded').show();
		});
	}
	else
	{
		setTimeout(GetManagersNormal, 500);
	}
}

function GetManagersByStep()
{
	$('.install_by_step_manager_loading').show();
	$('#install_by_step_manager .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetUsersList(function(data) {
			
			$('#install_by_step_manager .list_managers').html('');
			
			if (data.D != undefined)
			$.each(data.D,function(index, value){
				if (value.id_group_user  == 3)
				{
					$('#install_by_step_manager .list_managers').append('' +
						'<li id="install_by_step_manager_list_manager_elem_'+value.id_user+'" data-id_user="'+value.id_user+'">'+
						'	<span class="societe">'+value.company+'</span><br /><span class="prenom">'+value.firstname+'</span> <span class="nom">'+value.lastname+'</span><br /><span class="email">'+value.email+'</span>'+
						'	<a href="#" class="bManagerDeleteElem btn btn-sm btn-circle btn-danger pull-right"><i class="fa fa-times"></i></a>'+
						'	<a href="#" class="bManagerEditElem btn btn-sm btn-circle btn-primary pull-right" style="margin-right:5px;"><i class="fa fa-pencil"></i></a>'+
						'</li>'
						);
				}
			});
			
			$('.install_by_step_manager_loading').hide();
			$('#install_by_step_manager .loaded').show();
		});
	}
	else
	{
		setTimeout(GetManagersByStep, 500);
	}
}

function GetConfigurationsNormal()
{
	$('.install_normal_setup_vehicule_loading').show();
	$('#install_normal_setup_vehicule .loaded').hide();
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetEnergyConfiguration(function(data) {
			$('#install_normal_setup_vehicule #install_normal_setup_vehicule_i_level_min_gotocharge').val(data.D.EBL);
			$('#install_normal_setup_vehicule #install_normal_setup_vehicule_i_level_min_dotask').val(data.D.MBL);
			$('.install_normal_setup_vehicule_loading').hide();
			$('#install_normal_setup_vehicule .loaded').show();
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
			console.log(data);
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
			console.log(data);
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
			console.log(data);
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
			console.log(data);
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
	if (wycaApi.websocketAuthed)
	{
		wycaApi.MappingIsStarted(function(data) {
			if (data.D)
			{
				$('#install_by_step_mapping .bMappingStart').hide();
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
				
				GetMappingInConstruction();
			}
		});
	}
	else
	{
		setTimeout(InitMappingByStep, 500);
	}
}

function InitCheckByStep()
{
	console.log('InitCheckByStep');
	if(timer_anim_check!=undefined){clearTimeout(timer_anim_check);timer_anim_check=undefined;}
	$('#install_by_step_check .test').removeClass('test');
	$('#install_by_step_check li:first-child .is_checkbox').addClass('test');
	$('#install_by_step_check .checked').removeClass('checked');
	$('.install_by_step_check_next').removeClass('disabled');
	$('.install_by_step_check_next').addClass('disabled');
	$('.install_by_step_check_next').html('<i class="fa fa fa-spinner fa-pulse"></i> '+textBtnCheckTest);
	setTimeout(StartAnimCheckComposantInstall, 2000);
}

function GetLastMappingByStep()
{
	$('#install_by_step_mapping_fin .loading_fin_create_map').show();
	
	img = document.getElementById("install_by_step_mapping_img_map_saved_fin");
	img.src = 'assets/images/vide.png';
	
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
						$('.tbody_wifi').append('<tr data-ssid="'+value.ssid+'" class="wifi'+value.bssid+' '+ value.state +'"><td>'+value.ssid+'</td><td><img src="assets/images/signal-'+signal+'.png" /></td></tr>');
					}
				});
			}
		});
		
		if ($('#install_normal_wifi').is(':visible'))
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


function success_wyca(text)
{
	$('#success_wyca p').html(text);
	$('#success_wyca').show();
}


function DisplayError(text)
{
	 $('.popup_error .panel-body').html(text);
	 $('.popup_error').show();
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