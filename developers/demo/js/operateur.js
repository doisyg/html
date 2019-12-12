var in_visio = false;
var wycaApi;

$(document).ready(function(e) {
	
	wycaApi = new WycaAPI({
		'api_key':api_key,
		'id_site':id_site,
		'id_robot':'not_robot',
		video_element_id:'webcam_local',
		nick:'server',
		onVideoAdded: function (nick, video) { 
			/* first connection or re-connection after lost */
			$('#mCallInProgress').hide();
			$('#mConexionLost').hide();
			$('#webcam_robot').html(''); // We clean div before add new video
			var remotes = document.getElementById('webcam_robot');
			remotes.appendChild(video);
			video.oncontextmenu = function () { return false; };
		},
		onVideoRemoved: function (nick, video){
			$('#webcam_robot').html('');
		},
		onLostConnection: function (){
			console.log('Connexion lost');
			$('#mConexionLost').show();
		},
		onStartSessionClose: function (){
			console.log('Start closing');
			
			$('#mConexionLost').hide();
			
			$('#webcam_contact').html('');
			$('#webcam_local_contact').html('');

			$('#mClossingSession').show();
		},
		onSessionClosed: function (){
			console.log('Session closed');
			in_visio = false;
			$('#mClossingSession').hide();
			$("#visio").hide();
			$('#home').show();
		},
		onNewServerMessage: function (message){
			// StartCall|Roomrobot_demo
			if (message != '')
			{
				data = message.data.split('|')
				switch(data[0])
				{
					case 'StartCall':
						if (!in_visio)
						{
							wycaApi.SetRoom(data[1]);
							$('#nick_robot').html(message.from);
							$('#mCallInProgress').show();
						}
						break;
					case 'CloseSession':
						if (!in_visio)
							$('#mCallInProgress').hide();
						else
						{
							$('#mClossingSession').show();
						}
						break;
				}
			}
		},
		onEquipmentError: function(){
			wycaApi.StartCloseWebRTC();
			alert('No webcam or microphone');
		},
		onNewWebRTCMessage: function(data){
			$('#messages_recu').html($('#messages_recu').html() +'<br />' + data);
		}
	});
	
	
	$('#bAnswer').click(function(e) {
		e.preventDefault();

		$('#mCallInProgress').hide();
		$("#visio").show();
		$('#home').hide();
		
		in_visio = true;
		
		wycaApi.StartWebRTC(true);	
		
	});
	
	$('#bHangUp').click(function(e) {
		e.preventDefault();
		
		wycaApi.StartCloseWebRTC();
	});
	
	$('body').on('click', '.bResumeCall', function (e){
		e.preventDefault();

		$('#mCallInProgress').hide();
		$("#visio").show();
		$('#home').hide();
		
		in_visio = true;
		
		wycaApi.SetRoom($(this).data('room'));
		wycaApi.StartWebRTC(true);	
	});
		
	$('#bCloseModal').click(function(e) {
		$("#divVideo video")[0].pause();
	});
	
	$('#bSendMessage').click(function(e) {
        wycaApi.SendWebRTCMessage($('#message_text').val());
    });

});