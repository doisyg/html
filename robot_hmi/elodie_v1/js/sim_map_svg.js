
var minStokeWidth = 1;
var maxStokeWidth = 5;

var robot_traced = false;

function makeSVGElement(tag, attrs, texte='')
{
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) {
        el.setAttribute(k, attrs[k]);
    }
	
	if (texte != '')
	{
		txt = document.createTextNode(texte);
		el.appendChild(txt);
	}
	
    return el;
}

function TraceRobot(pose)
{
	robot_x = pose.X;
	robot_y = pose.Y;
	robot_theta = pose.T;
	
	if(robot_x == robot_y && robot_y == robot_theta && robot_x == 0 ){
		$(tRobotNotLocalised).show();
		$('#robot_circle').remove();
		$('#robot_sens').remove();
		robot_traced = true;
	}else{
		$('#tRobotNotLocalised').hide();
		
		x = (robot_x * 100 / ros_resolution) * svg_resolution_width;
		y = (ros_hauteur - (robot_y * 100 / ros_resolution)) * svg_resolution_height;
		angle = 0 - robot_theta * 180 / Math.PI;
		rayonRobot = (26 / ros_resolution) * svg_resolution_width;
		
		x = typeof(offset_image_x) == 'undefined' ? x : x + offset_image_x;
		y = typeof(offset_image_y) == 'undefined' ? y : y + offset_image_y;
	
		if (true || !robot_traced) // true pour le mettre au premier plan
		{
			robot_traced = true;
			$('#robot_circle').remove();
			path = makeSVGElement('circle', { cx: x,
											cy: y,
										   r: rayonRobot,
										   'class': 'map_elem robot_elem robot_elem_fond',
										   'id': 'robot_circle',
										   'data-element_type': 'robot',
										   'data-element': 'robot'
										   });
			svgMap.appendChild(path);
		}
		else
		{
			$('#robot_circle').attr("cx", x);
			$('#robot_circle').attr("cy", y);
		}
		
		$('#robot_sens').remove();
		path = makeSVGElement('polyline', { 'points': (x-2*svg_resolution_width)+' '+(y-2*svg_resolution_width)+' '+(x+2*svg_resolution_width)+' '+(y)+' '+(x-2*svg_resolution_width)+' '+(y+2*svg_resolution_width),
										'stroke':'#FFFFFF',
										'stroke-width':Math.round(1*svg_resolution_width),
										'fill':'none',
										'stroke-linejoin':'round',
										'stroke-linecap':'round',
									   'class': 'map_elem robot_elem',
									   'transform':'rotate('+angle+', '+x+', '+y+')',
									   'id': 'robot_sens',
									   'data-element_type': 'robot',
									   'data-element': 'robot'
									   });
		$('#robot_circle').after(path);
		
		/*
		if($('#LED_wrapper').length > 0);
			$('#LED_wrapper').css('transform','rotate('+ (-90 - pose.T * 180 / Math.PI) +'deg)');*/
	}
}



function TraceForbidden(indexForbidden)
{
	forbidden = forbiddens[indexForbidden];
	if (forbidden.deleted) { $('#map_svg .forbidden_elem_'+forbidden.id_area).remove(); return; }
	
	points = forbidden.points;
	if (points.length > 1)
	{
		forbidden_point = '';
		$.each(points, function( indexPoint, point ) {
			if (forbidden_point != '') forbidden_point += ' ';
			
			x = (point.x * 100 / ros_resolution) * svg_resolution_width;
			y = (ros_hauteur - (point.y * 100 / ros_resolution)) * svg_resolution_height;
			
			x = typeof(offset_image_x) == 'undefined' ? x : x + offset_image_x;
			y = typeof(offset_image_y) == 'undefined' ? y : y + offset_image_y;
	
			forbidden_point += x+','+y;
		});
		
		$('#map_svg #map_forbidden_'+forbidden.id_area).remove();
		
		path = makeSVGElement('polygon', { points: forbidden_point,
							   'stroke-width': 0,
							   'class':'map_elem poly forbidden forbidden_root poly_elem forbidden_elem forbidden_elem_'+forbidden.id_area,
							   'id':'map_forbidden_'+forbidden.id_area,
							   'data-id_area': forbidden.id_area
							  });
		path.style.fill = 'rgba(255,0,0,0.3)'
		svgMap.appendChild(path);
		
	}
}

function TraceArea(indexArea)
{
	area = areas[indexArea];
	if (area.deleted) { $('#map_svg .area_elem_'+area.id_area).remove(); return; }
	
	points = area.points;
	if (points.length > 1)
	{
		area_point = '';
		$.each(points, function( indexPoint, point ) {
			if (area_point != '') area_point += ' ';
			
			x = (point.x * 100 / ros_resolution) * svg_resolution_width;
			y = (ros_hauteur - (point.y * 100 / ros_resolution)) * svg_resolution_height;
			
			x = typeof(offset_image_x) == 'undefined' ? x : x + offset_image_x;
			y = typeof(offset_image_y) == 'undefined' ? y : y + offset_image_y;
	
			area_point += x+','+y;
		});
		
		$('#map_svg #map_area_'+area.id_area).remove();
		
		path = makeSVGElement('polygon', { points: area_point,
							   'stroke-width': 0,
							   'class':'map_elem poly area area_root poly_elem area_elem area_elem_'+area.id_area,
							   'id':'map_area_'+area.id_area,
							   'data-id_area': area.id_area
							  });
		path.style.fill = 'rgba('+area.color_r+','+area.color_g+','+area.color_b+',0.5)'
		svgMap.appendChild(path);
		
	}
}

function TraceDock(indexDock)
{
	dock = docks[indexDock];
	if (dock.deleted != undefined && dock.deleted) { $('#map_svg .dock_elem_'+dock.id_docking_station).remove(); return; }
	
	x = (dock.fiducial_pose_x * 100 / ros_resolution) * svg_resolution_width;
	y = (ros_hauteur - (dock.fiducial_pose_y * 100 / ros_resolution)) * svg_resolution_height;
	
	angle = 0 - dock.fiducial_pose_t * 180 / Math.PI - 90;
	
	x = typeof(offset_image_x) == 'undefined' ? x : x + offset_image_x;
	y = typeof(offset_image_y) == 'undefined' ? y : y + offset_image_y;
	
	path = makeSVGElement('rect', { x: x-5* svg_resolution_width, y:y-1* svg_resolution_width, height:2* svg_resolution_width, width:10* svg_resolution_width,
				   'stroke-width': minStokeWidth,
				   'fill':'red',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'map_elem dock_elem dock_elem_fond dock_elem_'+dock.id_docking_station,
				   'id': 'map_dock_'+dock.id_docking_station,
				   'data-id_docking_station': dock.id_docking_station,
				   'data-element_type': 'dock',
				   'data-element': 'dock'
				  });
	svgMap.appendChild(path);
	
	path = makeSVGElement('line', { 'x1': x-1, 'y1':y+1, 'x2': x+1, 'y2':y+1,
				   'stroke-width': 1,
				   'stroke-linecap':'square',
				   'stroke':'red',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'map_elem dock_elem dock_elem_'+dock.id_docking_station,
				   'id': 'map_dock_connect_'+dock.id_docking_station,
				   'data-id_docking_station': dock.id_docking_station,
				   'data-element_type': 'dock',
				   'data-element': 'dock'
				  });
	svgMap.appendChild(path);
	
	x = (dock.final_pose_x * 100 / ros_resolution ) * svg_resolution_width;
	y = (ros_hauteur - (dock.final_pose_y * 100 / ros_resolution)) * svg_resolution_height;
	angle = 0 - dock.final_pose_t * 180 / Math.PI;
	
	x = typeof(offset_image_x) == 'undefined' ? x : x + offset_image_x;
	y = typeof(offset_image_y) == 'undefined' ? y : y + offset_image_y;
	
	rayonRobot = (26 / ros_resolution) * svg_resolution_width;
	rayonRobotSecure = ((26+15) / ros_resolution) * svg_resolution_width;
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'map_elem dock_elem dock_elem_circle dock_elem_fond dock_elem_'+dock.id_docking_station,
								   'id': 'map_dock_robot_'+dock.id_docking_station,
								   'data-id_docking_station': dock.id_docking_station,
								   'data-element_type': 'dock',
								   'data-element': 'dock'
								   });
	svgMap.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot* 0.60,
								   'class': 'map_elem dock_elem dock_elem_robot dock_elem_fond dock_elem_'+dock.id_docking_station,
								   'id': 'map_dock_robot_'+dock.id_docking_station,
								   'data-id_docking_station': dock.id_docking_station,
								   'data-element_type': 'dock',
								   'data-element': 'dock'
								   });
	svgMap.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-1.5* svg_resolution_width)+' '+(y-1.5* svg_resolution_width)+' '+(x+1.5* svg_resolution_width)+' '+(y)+' '+(x-1.5* svg_resolution_width)+' '+(y+1.5* svg_resolution_width),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'map_elem dock_elem dock_elem_'+dock.id_docking_station,
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'map_dock_sens_'+dock.id_docking_station,
								   'data-id_docking_station': dock.id_docking_station,
								   'data-element_type': 'dock',
								   'data-element': 'dock'
								   });
	svgMap.appendChild(path);
	
}

function TracePoi(indexPoi)
{
	poi = pois[indexPoi];
	if (poi.deleted != undefined && poi.deleted) { $('#map_svg .poi_elem_'+poi.id_poi).remove(); return; }
	
	x = (poi.final_pose_x * 100 / ros_resolution) * svg_resolution_width;
	y = (ros_hauteur - (poi.final_pose_y * 100 / ros_resolution)) * svg_resolution_height;	
	angle = 0 - poi.final_pose_t * 180 / Math.PI;
	
	x = typeof(offset_image_x) == 'undefined' ? x : x + offset_image_x;
	y = typeof(offset_image_y) == 'undefined' ? y : y + offset_image_y;
	
	rayonRobot = (26 / ros_resolution)* svg_resolution_width;
	rayonRobotSecure = ((26+15) / ros_resolution)* svg_resolution_width;
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'map_elem poi_elem poi_elem_circle poi_elem_'+poi.id_poi,
								   'id': 'map_poi_secure_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svgMap.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot * 0.6,
								   'class': 'map_elem poi_elem poi_elem_fond poi_elem_'+poi.id_poi,
								   'id': 'map_poi_robot_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svgMap.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-1.5* svg_resolution_width)+' '+(y-1.5* svg_resolution_width)+' '+(x+1.5* svg_resolution_width)+' '+(y)+' '+(x-1.5* svg_resolution_width)+' '+(y+1.5* svg_resolution_width),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'map_elem poi_elem poi_elem_'+poi.id_poi,
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'map_poi_sens_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svgMap.appendChild(path);
	
}
function TraceAugmentedPose(indexAugmentedPose)
{
	augmented_pose = augmented_poses[indexAugmentedPose];
	if (augmented_pose.deleted != undefined && augmented_pose.deleted) { $('#map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose).remove(); return; }
	
	x = (augmented_pose.final_pose_x * 100 / ros_resolution)* svg_resolution_width;
	y = (ros_hauteur - (augmented_pose.final_pose_y * 100 / ros_resolution)) * svg_resolution_width;	
	angle = 0 - augmented_pose.final_pose_t * 180 / Math.PI;
	
	x = typeof(offset_image_x) == 'undefined' ? x : x + offset_image_x;
	y = typeof(offset_image_y) == 'undefined' ? y : y + offset_image_y;
	
	rayonRobot = (26 / ros_resolution)* svg_resolution_width;
	rayonRobotSecure = ((26+15) / ros_resolution)* svg_resolution_width;
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'map_elem augmented_pose_elem augmented_pose_elem_circle augmented_pose_elem_'+augmented_pose.id_augmented_pose,
								   'id': 'map_augmented_pose_secure_'+augmented_pose.id_augmented_pose,
								   'data-id_augmented_pose': augmented_pose.id_augmented_pose,
								   'data-element_type': 'augmented_pose',
								   'data-element': 'augmented_pose'
								   });
	svgMap.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot * 0.6,
								   'class': 'map_elem augmented_pose_elem augmented_pose_elem_fond augmented_pose_elem_'+augmented_pose.id_augmented_pose,
								   'id': 'map_augmented_pose_robot_'+augmented_pose.id_augmented_pose,
								   'data-id_augmented_pose': augmented_pose.id_augmented_pose,
								   'data-element_type': 'augmented_pose',
								   'data-element': 'augmented_pose'
								   });
	svgMap.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-1.5* svg_resolution_width)+' '+(y-1.5* svg_resolution_width)+' '+(x+1.5* svg_resolution_width)+' '+(y)+' '+(x-1.5* svg_resolution_width)+' '+(y+1.5* svg_resolution_width),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'map_elem augmented_pose_elem augmented_pose_elem_'+augmented_pose.id_augmented_pose,
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'map_augmented_pose_sens_'+augmented_pose.id_augmented_pose,
								   'data-id_augmented_pose': augmented_pose.id_augmented_pose,
								   'data-element_type': 'augmented_pose',
								   'data-element': 'augmented_pose'
								   });
	svgMap.appendChild(path);
}

function DrawMapElements(){
	
	$('#map_svg .forbidden_elem').remove();
	$.each(forbiddens, function( index, forbidden ) {
		TraceForbidden(index);
	});
	$('#map_svg .area_elem').remove();
	$.each(areas, function( index, area ) {
		TraceArea(index);
	});
	$('#map_svg .dock_elem').remove();
	$.each(docks, function( index, dock ) {
		TraceDock(index);
	});
	$('#map_svg .poi_elem').remove();
	$.each(pois, function( index, poi ) {
		TracePoi(index);
	});
	$('#map_svg .augmented_pose_elem').remove();
	$.each(augmented_poses, function( index, augmented_pose ) {
		TraceAugmentedPose(index);
	});
	
	
}