
$(document).ready(function(e) {
	$('#user_recovery .bRecovery').click(function(e) {
         e.preventDefault();
		//----------------------- RECOVERY ----------------------------
	
		$('#user_recovery .bRecovery').addClass('disabled');
		
		/*INIT FEEDBACK DISPLAY*/
		$('#user_recovery .recovery_feedback .recovery_step').css('opacity','0').hide();
		$('#user_recovery .recovery_feedback .recovery_step .fa-check').hide();
		$('#user_recovery .recovery_feedback .recovery_step .fa-pulse').show();
		
		wycaApi.on('onRecoveryFromFiducialFeedback', function(data) {
			if(data.A == wycaApi.AnswerCode.NO_ERROR){
				target = '';
				switch(data.M){
					case 'Scan reflector': 				target = '#user_recovery .recovery_feedback .recovery_step.RecoveryScan';	break;
					case 'Init pose': 					target = '#user_recovery .recovery_feedback .recovery_step.RecoveryPose';	break;
					case 'Rotate to check obstacles': 	target = '#user_recovery .recovery_feedback .recovery_step.RecoveryRotate';	break;
					case 'Start navigation': 			target = '#user_recovery .recovery_feedback .recovery_step.RecoveryNav';		break;
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
				
				$('#user_recovery .recovery_step:visible').find('.fa-check').show();
				$('#user_recovery .recovery_step:visible').find('.fa-pulse').hide();
				setTimeout(function(){
					$('.ifRecovery').hide();
					$('.ifNRecovery').show();
					$('#user_recovery .bRecovery').removeClass('disabled');
					success_wyca(textRecoveryDone);
					$('#user_recovery .bRecovery').removeClass('disabled');
					$('#user_recovery .user_recovery_next').click();
				},500)
			}
			else
			{
				$('.ifRecovery').hide();
				$('.ifNRecovery').show();
				$('#user_recovery .bRecovery').removeClass('disabled');
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
				$('#user_recovery .bRecovery').removeClass('disabled');
				ParseAPIAnswerError(data);
			}
		});
	});
	
	$('#user_recovery .bCancelRecovery').click(function(e) {
		$('#user_recovery .bCancelRecovery').addClass('disabled');
		wycaApi.RecoveryFromFiducialCancel(function(data) {
			$('#user_recovery .bCancelRecovery').removeClass('disabled');
		})
	})
	
	$('#user_edit_map .bSaveEditMap').click(function(e) {
		e.preventDefault();
        
		if (!userCanChangeMenu)
		{
			alert_wyca(textConfirmActiveElement);
		}
		else
		{
			data = GetDataMapToSave();
			
			if ($(this).hasClass('button_goto'))
			{
				$('#user_test_map .list_test li').remove();
				$('#user_test_map .user_test_map_loading').show();
				
				gotoTest = true;
			}
			else
				gotoTest = false;
			
			console.log(data);
			
			wycaApi.SetCurrentMapData(data, function(data){
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					success_wyca(textMapSaved);
					
					// On reload la carte pour mettre à jours les ids
					GetInfosCurrentMapUser();
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
});
