function HideTuile(element)
{
	element.css({ transform: 'rotatey(90deg)', "z-index": "0" });
}
function ShowTuile(element)
{
	element.css({ transform: 'rotatey(0deg)', "z-index": "0" });
}

$(document).ready(function(e) {
	
	var elementCss = {
		'perspective': 'outerWidth',
		"transition": "all .2s ease-out"
	  };
	$('ul.tuiles a').css(elementCss);
	
	$('section:not(".active") .anim_tuiles').css({ transform: 'rotatey(90deg)', "z-index": "0" });
	
	$('.btn_change_group').click(function(e) {
        e.preventDefault();
		
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
	
	$('.button_goto').click(function(e) {
        e.preventDefault();
		
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
    });
	
	$('.select_langue').click(function(e) {
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
	
	$('#connexion_robot').hide();
	
	wycaApi = new WycaAPI({
		//host:'elodie.wyca-solutions.com:9090', //192.168.1.32:9090', // host:'192.168.100.245:9090',
		host:'192.168.0.18:9090',
		video_element_id:'webcam_local',
		webcam_name: 'r200 nav',
		nick:'robot',
		delay_no_reply : 30,
		delay_lost_connexion : 30,
		with_audio: true,
		with_video: true,
		onSessionClosed: function (){
			in_visio = false;
		},
		onNewServerMessage: function (message){
			if (message != '' && message.message != undefined)
			{
				if (message.message.substr(0,3) != 'ACK') wycaApi.SendServerMessageToServer(message.from, 'ACK_'+message.message);
				
				data = message.message.split('|')
				switch(data[0])
				{
					case 'StartCall':
						if (!in_visio)
						{
							$('#popupRemoteControl').show();
							wycaApi.SetRoom(data[1]);
							in_visio = true;
							initStateRobot(robotCurrentState);
							wycaApi.StartWebRTC(true);
						}
						break;
					case 'CloseSession':
						break;
				}
			}
		},
		onEquipmentError: function(){
			wycaApi.StartCloseWebRTC();
			alert('No webcam or microphone');
		},
		onRobotConnexionError: function(data){
			console.log('erreur');
			$('#connexion_robot').show();
		},
		onRobotConnexionOpen: function(data){
			connectedToTheRobot = true;
			$('#connexion_robot').hide();
		},
		onRobotConnexionClose: function(data){
			connectedToTheRobot = false;
			$('#connexion_robot').show();
		},
		onInitialized: function(){
		},
        onIsPoweredChange: function(data){
            initPoweredState(data);
        },
        onSOCChange: function(data){
			initBatteryState(data);
        },
        onIsSafetyStopChange: function(data){
            if (data)
                $('.safety_stop').show();
            else
                $('.safety_stop').hide();
            lastEStop = data;
        },
		onNavigationStateChange: function(data) {
			navLaunched = data;
			if (data)
			{
				$('.no_navigation').hide();
				$('.only_navigation').show();
			}
			else
			{
				$('.no_navigation').show();
				$('.only_navigation').hide();
			}
		},
		onMappingStateChange: function(data) {
			mappingLaunched = data;
		},
		onRobotPoseChange:function(pose){
			lastRobotPose = pose;
			InitRobotPose(pose);
		}
        //onNavigationRobotStateChange: function(data){
		//	initStateRobot(data);
		//},
	});
	
	
	wycaApi.init();	

});