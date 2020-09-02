var indexLiActions = 0;
var dataStorage = {};

function InitWycaDemoState()
{
	$('#wyca_demo_mode_start_stop .wyca_demo_mode_start_stop_loading').show();
	$('#wyca_demo_mode_start_stop .loaded').hide();
	
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetGlobalVehiculePersistanteDataStorage(function(data){
			
			if (data.D == '')
			{
				dataStorage = {};
			}
			else
			{
				dataStorage = JSON.parse(data.D);
				
				$('#wyca_demo_mode_start_stop .tuiles a').addClass('todo');
				if (typeof dataStorage.wycaDemoStarted != "undefined" && dataStorage.wycaDemoStarted)
				{
					$('#wyca_demo_mode_start_stop #wyca_demo_mode_start_stop_bStop').removeClass('todo');
				}
				else
				{
					$('#wyca_demo_mode_start_stop #wyca_demo_mode_start_stop_bStart').removeClass('todo');
				}
				
				$('#wyca_demo_mode_start_stop .wyca_demo_mode_start_stop_loading').hide();
				$('#wyca_demo_mode_start_stop .loaded').show();
			}
		});
	}
	else
	{
		setTimeout(InitWycaDemoState, 500);
	}
}

function InitWycaDemo()
{
	$('#wyca_demo_mode_config .wyca_demo_mode_config_loading').show();
	$('#wyca_demo_mode_config .loaded').hide();
	$('#wyca_demo_mode_config .list_actions li').remove();
	$('#wyca_demo_mode_config .list_all_poi li').remove();
	
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetGlobalVehiculePersistanteDataStorage(function(data){
			
			dataStorage = JSON.parse(data.D);
			
			wycaApi.GetCurrentMapComplete(function(data) {
				if (data.A == wycaApi.AnswerCode.NO_ERROR)
				{
					console.log(data.D); 
					id_map = data.D.id_map;
					id_map_last = data.D.id_map;
					
					forbiddens = data.D.forbiddens;
					areas = data.D.areas;
					gommes = Array();
					docks = data.D.docks;
					pois = data.D.pois;
					
					largeurSlam = data.D.ros_width;
					hauteurSlam = data.D.ros_height;
					largeurRos = data.D.ros_width;
					hauteurRos = data.D.ros_height;
					
					ros_largeur = data.D.ros_width;
					ros_hauteur = data.D.ros_height;
					ros_resolution = data.D.ros_resolution;
					
					indexLiAction = 0;
					
					if(typeof dataStorage.min_goto_charge != "undefined")
					{
						$('#wyca_demo_mode_config_min_goto_charge').val(dataStorage.min_goto_charge);
					}
					else
					{
						$('#wyca_demo_mode_config_min_goto_charge').val(75);
					}
					
					if(typeof dataStorage.min_goto_demo != "undefined")
					{
						$('#wyca_demo_mode_config_min_goto_demo').val(dataStorage.min_goto_demo);
					}
					else
					{
						$('#wyca_demo_mode_config_min_goto_demo').val(80);
					}
					
					if(typeof dataStorage.wycaDemo != "undefined")
					{
						$.each(dataStorage.wycaDemo, function(indexInArray, element){
							
							indexLiActions++;
							
							if (element.type == 'Poi')
							{
								// On cherche le poi
								$.each(pois, function(indexInArray, poi){
									if (poi.id_poi == element.id)
									{
										$('#wyca_demo_mode_config .list_actions').append('' +
											'<li id="list_all_poi_'+indexLiActions+'" data-index_li="'+indexLiActions+'" data-type="Poi" data-id="' + poi.id_poi + '">'+
											'	<span>' + poi.name + '</span>'+
											'	<a href="#" class="bDeleteToAction btn btn-sm btn-circle btn-warning pull-right" style="margin-left:5px;"><i class="fa fa-times"></i></a>'+
											'	<a href="#" class="bUpToAction btn btn-sm btn-circle btn-default pull-right" style="margin-left:5px;"><i class="fa fa-chevron-up"></i></a>'+
											'	<a href="#" class="bDownToAction btn btn-sm btn-circle btn-default pull-right"><i class="fa fa-chevron-down"></i></a>'+
											'</li>'
											);
									}
								});
							}
							else if (element.type == 'Dock')
							{
								// On cherche le dock
								$.each(docks, function(indexInArray, dock){
									if (dock.id_docking_station == element.id)
									{
										$('#wyca_demo_mode_config .list_actions').append('' +
											'<li id="list_all_poi_'+indexLiActions+'" data-index_li="'+indexLiActions+'" data-type="Dock" data-id="' + dock.id_docking_station + '">'+
											'	<span>' + dock.name + '</span>'+
											'	<a href="#" class="bDeleteToAction btn btn-sm btn-circle btn-warning pull-right" style="margin-left:5px;"><i class="fa fa-times"></i></a>'+
											'	<a href="#" class="bUpToAction btn btn-sm btn-circle btn-default pull-right" style="margin-left:5px;"><i class="fa fa-chevron-up"></i></a>'+
											'	<a href="#" class="bDownToAction btn btn-sm btn-circle btn-default pull-right"><i class="fa fa-chevron-down"></i></a>'+
											'</li>'
											);
									}
								});
							}
							else if (element.type == 'Wait')
							{
								$('#wyca_demo_mode_config .list_actions').append('' +
									'<li id="list_all_poi_'+indexLiActions+'" data-index_li="'+indexLiActions+'" data-type="Wait" data-duration="' + element.duration + '">'+
									'	<span>Wait ' + element.duration + ' secondes</span>'+
									'	<a href="#" class="bDeleteToAction btn btn-sm btn-circle btn-warning pull-right" style="margin-left:5px;"><i class="fa fa-times"></i></a>'+
									'	<a href="#" class="bUpToAction btn btn-sm btn-circle btn-default pull-right" style="margin-left:5px;"><i class="fa fa-chevron-up"></i></a>'+
									'	<a href="#" class="bDownToAction btn btn-sm btn-circle btn-default pull-right" style="margin-left:5px;"><i class="fa fa-chevron-down"></i></a>'+
									'	<a href="#" class="bEditWait btn btn-sm btn-circle btn-default pull-right"><i class="fa fa-pencil"></i></a>'+
									'</li>'
									);
							}
							
						});
					}
					
					
					var indexLi = 0;
					
					if (pois.length > 0)
					{
						$.each(pois, function(indexInArray, poi){
							indexLi++;
							$('#wyca_demo_mode_config .list_all_poi').append('' +
								'<li id="list_all_poi_'+indexLi+'" data-index_li="'+indexLi+'" data-type="Poi" data-id="' + poi.id_poi + '">'+
								'	<a href="#" class="bAddToAction btn btn-sm btn-circle btn-primary pull-right"><i class="fa fa-plus"></i></a>'+
								'	<span>' + poi.name + '</span>'+
								'</li>'
								);
						});
					}
					
					/*
					On ne met pas les docks
					if (docks.length > 0)
					{
						$.each(docks, function(indexInArray, dock){
							indexLi++;
							$('#wyca_demo_mode_config .list_all_poi').append('' +
								'<li id="list_all_poi_'+indexLi+'" data-index_li="'+indexLi+'" data-type="Dock" data-id="' + dock.id_docking_station + '">'+
								'	<a href="#" class="bAddToAction btn btn-sm btn-circle btn-primary pull-right"><i class="fa fa-plus"></i></a>'+
								'	<span>' + dock.name + '</span>'+
								'</li>'
								);
						});
					}
					*/
					
					$('#wyca_demo_mode_config .wyca_demo_mode_config_loading').hide();
					$('#wyca_demo_mode_config .loaded').show();
					
				}
				else
				{
					alert_wyca('Init map error : ' + wycaApi.AnswerCodeToString(data.A));
				}
			});
		});
		
	}
	else
	{
		setTimeout(InitWycaDemo, 500);
	}
}

$(document).ready(function(e) {
	
	$('#wyca_demo_mode_start_stop_bStart').click(function(e) {
        e.preventDefault();
		
		if (!$(this).hasClass('todo'))
		{
			dataStorage.wycaDemoStarted = true;
			wycaApi.SetGlobalVehiculePersistanteDataStorage(JSON.stringify(dataStorage));
			InitWycaDemoState();
		}
    });
	
	$('#wyca_demo_mode_start_stop_bStop').click(function(e) {
        e.preventDefault();
		
		if (!$(this).hasClass('todo'))
		{
			dataStorage.wycaDemoStarted = false;
			wycaApi.SetGlobalVehiculePersistanteDataStorage(JSON.stringify(dataStorage));
			InitWycaDemoState();
		}
    });
	
	$('.bSaveDemoMode').click(function(e) {
        e.preventDefault();
       
	    dataStorage.wycaDemo = [];
	    $('#wyca_demo_mode_config .list_actions li').each(function(index, element) {
		   
		   obj = $('#'+element.id);
		   
		   if (obj.data('type') == 'Poi')
		   	dataStorage.wycaDemo.push({'type': 'Poi', 'id':obj.data('id')});
		   else if (obj.data('type') == 'Dock')
		   	dataStorage.wycaDemo.push({'type': 'Dock', 'id':obj.data('id')});
		   else if (obj.data('type') == 'Wait')
		   	dataStorage.wycaDemo.push({'type': 'Wait', 'duration':obj.data('duration')});
			
	    });
	   
	    dataStorage.min_goto_charge  = $('#wyca_demo_mode_config_min_goto_charge').val();
	    dataStorage.min_goto_demo = $('#wyca_demo_mode_config_min_goto_demo').val();
        	
		wycaApi.SetGlobalVehiculePersistanteDataStorage(JSON.stringify(dataStorage));
	   
    });
	
	$('#wyca_demo_mode_config_bSaveWait').click(function(e) {
        indexLiActions++;
		
		index_li = $('#wyca_demo_mode_config_id_li_wait').val();
		if (index_li == -1)
		{
			$('#wyca_demo_mode_config .list_actions').append('' +
					'<li id="list_all_poi_'+indexLiActions+'" data-index_li="'+indexLiActions+'" data-type="Wait" data-duration="' + $('#wyca_demo_mode_config_duration').val() + '">'+
					'	<span>Wait ' + $('#wyca_demo_mode_config_duration').val() + ' secondes</span>'+
					'	<a href="#" class="bDeleteToAction btn btn-sm btn-circle btn-warning pull-right" style="margin-left:5px;"><i class="fa fa-times"></i></a>'+
					'	<a href="#" class="bUpToAction btn btn-sm btn-circle btn-default pull-right" style="margin-left:5px;"><i class="fa fa-chevron-up"></i></a>'+
					'	<a href="#" class="bDownToAction btn btn-sm btn-circle btn-default pull-right" style="margin-left:5px;"><i class="fa fa-chevron-down"></i></a>'+
					'	<a href="#" class="bEditWait btn btn-sm btn-circle btn-default pull-right"><i class="fa fa-pencil"></i></a>'+
					'</li>'
					);
		}
		else
		{
			$('#list_all_poi_'+index_li).data('duration', $('#wyca_demo_mode_config_duration').val());
			$('#list_all_poi_'+index_li+' span').html('Wait ' + $('#wyca_demo_mode_config_duration').val() + ' secondes');
		}
			
		$('#wyca_demo_mode_config_duration').val('');
        $('#wyca_demo_mode_config_id_li_wait').val(-1);
		
    });
	
	$('#wyca_demo_mode_config_bCancelWait').click(function(e) {
        $('#wyca_demo_mode_config_duration').val('');
        $('#wyca_demo_mode_config_id_li_wait').val(-1);
		
		
    });
	
	$('#wyca_demo_mode_config').on( 'click', '.bUpToAction', function(e) {
        e.preventDefault();
		
		li = $(this).closest('li');
		li.after(li.prev().clone());
	    li.prev().remove();
	});
	$('#wyca_demo_mode_config').on( 'click', '.bDownToAction', function(e) {
        e.preventDefault();
		
		li = $(this).closest('li');
		li.next().after(li.clone());
	    li.remove();
	});
	$('#wyca_demo_mode_config').on( 'click', '.bDeleteToAction', function(e) {
        e.preventDefault();
		
		$(this).closest('li').remove();
	});
	
	$('#wyca_demo_mode_config').on( 'click', '.bEditWait', function(e) {
		
        $('#wyca_demo_mode_config_id_li_wait').val($(this).parent().data('index_li'));
		$('#wyca_demo_mode_config_duration').val($(this).parent().data('duration'));
		$('#wyca_demo_mode_config_modalWaitOptions').modal('show');
		
	});
		
	$('#wyca_demo_mode_config').on( 'click', '.bAddToAction', function(e) {
        e.preventDefault();
		
		indexLiActions++;
			
		id = $(this).parent().data('id');
		if ($(this).parent().data('type') == 'Poi')
		{
			$('#wyca_demo_mode_config .list_actions').append('' +
				'<li id="list_all_poi_'+indexLiActions+'" data-index_li="'+indexLiActions+'" data-type="Poi" data-id="' + id + '">'+
				'	<span>' + $(this).parent().children('span').html() + '</span>'+
				'	<a href="#" class="bDeleteToAction btn btn-sm btn-circle btn-warning pull-right" style="margin-left:5px;"><i class="fa fa-times"></i></a>'+
				'	<a href="#" class="bUpToAction btn btn-sm btn-circle btn-default pull-right" style="margin-left:5px;"><i class="fa fa-chevron-up"></i></a>'+
				'	<a href="#" class="bDownToAction btn btn-sm btn-circle btn-default pull-right"><i class="fa fa-chevron-down"></i></a>'+
				'</li>'
				);
		}
		else
		{
			$('#wyca_demo_mode_config .list_actions').append('' +
				'<li id="list_all_poi_'+indexLiActions+'" data-index_li="'+indexLiActions+'" data-type="Dock" data-id="' + id + '">'+
				'	<span>' + $(this).parent().children('span').html() + '</span>'+
				'	<a href="#" class="bDeleteToAction btn btn-sm btn-circle btn-warning pull-right" style="margin-left:5px;"><i class="fa fa-times"></i></a>'+
				'	<a href="#" class="bUpToAction btn btn-sm btn-circle btn-default pull-right" style="margin-left:5px;"><i class="fa fa-chevron-up"></i></a>'+
				'	<a href="#" class="bDownToAction btn btn-sm btn-circle btn-default pull-right"><i class="fa fa-chevron-down"></i></a>'+
				'</li>'
				);
		}
    });
	
});
