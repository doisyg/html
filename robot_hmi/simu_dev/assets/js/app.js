$(document).ready(function(e) {
	/* CONNEXION ROBOT */
	
	wycaApi = new WycaAPI({
		host:robot_host,
		use_ssl: use_ssl,
		api_key:'qOnlqDnizsRJp48C3uppJEnsm4f9yfwNTHY99bgyuV5HP3',
		nick:'robot',
		
	});
	
	wycaApi.init();	
	init();
	
	
	
});

var id_site = -1;
var name_site = '';

function init(){
	if (wycaApi.websocketAuthed)
	{
		wycaApi.GetCurrentSite(function(data){
			if (data.A == wycaApi.AnswerCode.NO_ERROR){
				
				name_site = data.D.name;
				$('#site_name').html(name_site);
				id_site = data.D.id_site;
				getMap();
				
			}else{
				alert('Error getting current site',data.A,data.M);
			}
		})
	}
	else
	{
		setTimeout(init, 500);
	}
	
}
function getMap(){
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
			augmented_poses = data.D.augmented_poses;
			
			hauteurSlam = data.D.ros_height;
			largeurRos = data.D.ros_width;
			hauteurRos = data.D.ros_height;
			
			ros_largeur = data.D.ros_width;
			ros_hauteur = data.D.ros_height;
			ros_resolution = data.D.ros_resolution;
			
			$('#install_normal_edit_map_svg').attr('width', data.D.ros_width);
			$('#install_normal_edit_map_svg').attr('height', data.D.ros_height);
			
			//console.log(
			
			//$('#install_normal_edit_map_image').attr('width', data.D.ros_width);
			//$('#install_normal_edit_map_image').attr('height', data.D.ros_height);
			
			$('#install_normal_edit_map_image').attr('width', $('#map').outerWidth());
			$('#install_normal_edit_map_image').attr('height', $('#map').outerHeight()*0.95);
			$('#install_normal_edit_map_image').attr('xlink:href', 'data:image/png;base64,'+data.D.image_tri);
			
			
			
			setTimeout(function(){
				if($('html').scrollTop() < $("#dashboard").offset().top)
					$('html, body').animate({scrollTop: $("#dashboard").offset().top}, 1000)}
			,1000)
			
		}else{
			alert('Error getting current Map');
		}
	})
	
}

$('select.form-control.select_id_map').on('change', function(e) {
	if(checkMap){
		e.preventDefault();
		let name = this.name;
		let id_map = $(this).children('option:selected').val();
		if (id_map != ''){
			$('select.form-control.select_id_map option[value='+id_map+']').removeAttr('disabled');
			$('select.form-control.select_id_map:not([name='+name+']) option[value='+id_map+']').attr('disabled','disabled');
			
			
			let pois = getMapPOIs(id_map);
			let floor = $(this).parent().parent().parent();
			
			if(pois){
				//UPDATE SELECTS POIS
				floor.find('select.form-control.select_poi').each(function(){
					
					updateSelect($(this),pois);
				})
			}
			
		}else{
			$('select.form-control.select_id_map option').removeAttr('disabled');
			$('select.form-control.select_id_map option:selected[value!=""]').parent().change();
		}
	}
})
