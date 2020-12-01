
function ManagerInitSVG()
{
}

function ManagerGetZoom()
{
	var obj = $('#manager_edit_map_svg g');
	obj.attr('id', 'manager_edit_map_svg_g');
	 var transformMatrix = obj.css("-webkit-transform") ||
	   obj.css("-moz-transform")    ||
	   obj.css("-ms-transform")     ||
	   obj.css("-o-transform")      ||
	   obj.css("transform");
	   
	if (transformMatrix == undefined  && typeof(window.panZoomManager) != 'undefined')
	 	return  ros_largeur / $('#manager_edit_map_svg').width() / window.panZoomManager.getZoom()
	if(transformMatrix != undefined){
		var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
		return 1 / parseFloat(matrix[0]);
	}else{
		return 1;
	}
}

/* TRACE FUNCS */

function ManagerTraceSection(x1, y1, x2, y2)
{
	$('#manager_edit_map_svg .selection').remove();
	
	if (x1 < x2){	x = x1; w = x2-x1; }
	else { x = x2; w = x1-x2; }
	
	if (y1 < y2) { y = y1; h = y2-y1; }
	else { y = y2; h = y1-y2; }
	
	path = makeSVGElement('rect', { x: x, y:y, height:h, width:w,
				   'stroke-width': minStokeWidth,
				   'stroke-dasharray':'5, 5',
				   'class':'selection',
				   'id': 'selection',
				  });
	svgManager.appendChild(path);
}

function ManagerTraceForbidden(indexForbidden)
{
	forbidden = forbiddens[indexForbidden];
	if (forbidden.deleted) { $('#manager_edit_map_svg .forbidden_elem_'+forbidden.id_area).remove(); return; }
	
	is_active = false;
	if ($('#manager_edit_map_svg .forbidden_elem_'+forbidden.id_area).length > 0)
	{
		t = $('#manager_edit_map_svg .forbidden_elem_'+forbidden.id_area);
		if (t.attr('class') != t.attr('class').replace('active', ''))
		{
			is_active = true;
		}
	}
		
	if (downOnMovable && movableDown.data('element_type') == 'forbidden')
	{
		index_point_movable = movableDown.data('index_point');
	}
	else
		$('#manager_edit_map_svg .forbidden_elem_'+forbidden.id_area).remove();		  
	
	points = forbidden.points;
	if (points.length > 1)
	{
		forbidden_point = '';
		$.each(points, function( indexPoint, point ) {
			if (forbidden_point != '') forbidden_point += ' ';
			
			x = point.x * 100 / ros_resolution;
			y = ros_hauteur - (point.y * 100 / ros_resolution);
			
			forbidden_point += x+','+y;
		});
		
		$('#manager_edit_map_svg #manager_edit_map_forbidden_'+forbidden.id_area).remove();
		
		path = makeSVGElement('polygon', { points: forbidden_point,
							   'stroke-width': 0,
							   'class':'poly forbidden forbidden_root poly_elem forbidden_elem forbidden_elem_'+forbidden.id_area,
							   'id':'manager_edit_map_forbidden_'+forbidden.id_area,
							   'data-id_area': forbidden.id_area
							  });
		path.style.fill = 'rgba(255,0,0,0.3)';
		svgManager.appendChild(path);
		
		if (is_active)
			AddClass('#manager_edit_map_svg .forbidden_elem_'+forbidden.id_area, 'active');
	}
}

function ManagerTraceArea(indexArea)
{
	area = areas[indexArea];
	if (area.deleted) { $('#manager_edit_map_svg .area_elem_'+area.id_area).remove(); return; }
	
	is_active = false;
	if ($('#manager_edit_map_svg .area_elem_'+area.id_area).length > 0)
	{
		t = $('#manager_edit_map_svg .area_elem_'+area.id_area);
		if (t.attr('class') != t.attr('class').replace('active', ''))
		{
			is_active = true;
		}
	}
	
	if (downOnMovable && movableDown.data('element_type') == 'area')
	{
		index_point_movable = movableDown.data('index_point');
	}
	else
		$('#manager_edit_map_svg .area_elem_'+area.id_area).remove();
	
	points = area.points;
	if (points.length > 1)
	{
		area_point = '';
		$.each(points, function( indexPoint, point ) {
			if (area_point != '') area_point += ' ';
			
			x = point.x * 100 / ros_resolution;
			y = ros_hauteur - (point.y * 100 / ros_resolution);
			
			area_point += x+','+y;
		});
		
		$('#manager_edit_map_svg #manager_edit_map_area_'+area.id_area).remove();
		
		path = makeSVGElement('polygon', { points: area_point,
							   'stroke-width': 0,
							   'class':'poly area area_root poly_elem area_elem area_elem_'+area.id_area,
							   'id':'manager_edit_map_area_'+area.id_area,
							   'data-id_area': area.id_area
							  });
		path.style.fill = 'rgba('+area.color_r+','+area.color_g+','+area.color_b+',0.5)'
		svgManager.appendChild(path);
		
		if (is_active)
			AddClass('#manager_edit_map_svg .area_elem_'+area.id_area, 'active');
	}
}

function ManagerTraceCurrentDock(pose)
{
	$('#manager_edit_map_svg .dock_elem_current').remove();
	
	x = pose.fiducial_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (pose.fiducial_pose_y * 100 / ros_resolution);
	
	angle = 0 - pose.fiducial_pose_t * 180 / Math.PI - 90;
	
	path = makeSVGElement('rect', { x: x-5, y:y-1, height:2, width:10,
				   'stroke-width': minStokeWidth,
				   'fill':'yellow',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'movable dock_elem dock_elem_current'
				  });
	svgManager.appendChild(path);
	
	path = makeSVGElement('line', { 'x1': x-1, 'y1':y+1, 'x2': x+1, 'y2':y+1,
				   'stroke-width': 1,
				   'stroke-linecap':'square',
				   'stroke':'orange',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'dock_elem dock_elem_current'
				  });
	svgManager.appendChild(path);
}
function ManagerTraceDock(indexDock)
{
	dock = docks[indexDock];
	if (dock.deleted != undefined && dock.deleted) { $('#manager_edit_map_svg .dock_elem_'+dock.id_docking_station).remove(); return; }
	
	is_active = false;
	if ($('#manager_edit_map_svg .dock_elem_'+dock.id_docking_station).length > 0)
	{
		t = $('#manager_edit_map_svg .dock_elem_'+dock.id_docking_station);
		if (t.attr('class') != t.attr('class').replace('active', ''))
		{
			is_active = true;
		}
	}
	
	if (downOnMovable && movableDown.data('element_type') == 'dock')
	{
		index_point_movable = movableDown.data('index_point');
	}
	else
		$('#manager_edit_map_svg .dock_elem_'+dock.id_docking_station).remove();
	
	x = dock.fiducial_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (dock.fiducial_pose_y * 100 / ros_resolution);
	
	angle = 0 - dock.fiducial_pose_t * 180 / Math.PI - 90;
	
	path = makeSVGElement('rect', { x: x-5, y:y-1, height:2, width:10,
				   'stroke-width': minStokeWidth,
				   'fill':'red',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'dock_elem dock_elem_fond dock_elem_'+dock.id_docking_station,
				   'id': 'manager_edit_map_dock_'+dock.id_docking_station,
				   'data-id_docking_station': dock.id_docking_station,
				   'data-element_type': 'dock',
				   'data-element': 'dock'
				  });
	svgManager.appendChild(path);
	
	path = makeSVGElement('line', { 'x1': x-1, 'y1':y+1, 'x2': x+1, 'y2':y+1,
				   'stroke-width': 1,
				   'stroke-linecap':'square',
				   'stroke':'red',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'dock_elem dock_elem_'+dock.id_docking_station,
				   'id': 'manager_edit_map_dock_connect_'+dock.id_docking_station,
				   'data-id_docking_station': dock.id_docking_station,
				   'data-element_type': 'dock',
				   'data-element': 'dock'
				  });
	svgManager.appendChild(path);
	
	x = dock.final_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (dock.final_pose_y * 100 / ros_resolution);
	angle = 0 - dock.final_pose_t * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	rayonRobotSecure = ((26+15) / ros_resolution);
	
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'dock_elem dock_elem_circle dock_elem_'+dock.id_docking_station,
								   'id': 'manager_edit_map_dock_robot_'+dock.id_docking_station,
								   'data-id_docking_station': dock.id_docking_station,
								   'data-element_type': 'dock',
								   'data-element': 'dock'
								   });
	svgManager.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot * 0.60,
								   'class': 'dock_elem dock_elem_robot dock_elem_fond dock_elem_'+dock.id_docking_station,
								   'id': 'manager_edit_map_dock_robot_'+dock.id_docking_station,
								   'data-id_docking_station': dock.id_docking_station,
								   'data-element_type': 'dock',
								   'data-element': 'dock'
								   });
	svgManager.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-1.5)+' '+(y-1.5)+' '+(x+1.5)+' '+(y)+' '+(x-1.5)+' '+(y+1.5),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'dock_elem dock_elem_'+dock.id_docking_station,
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'manager_edit_map_dock_sens_'+dock.id_docking_station,
								   'data-id_docking_station': dock.id_docking_station,
								   'data-element_type': 'dock',
								   'data-element': 'dock'
								   });
	svgManager.appendChild(path);
	
	if (is_active)
		AddClass('#manager_edit_map_svg .dock_elem_'+dock.id_docking_station, 'active');
}

function ManagerTraceCurrentPoi(pose)
{
	$('#manager_edit_map_svg .poi_elem_current').remove();
	
	x = pose.final_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (pose.final_pose_y * 100 / ros_resolution);
	angle = 0 - pose.final_pose_t * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	rayonRobotSecure = ((26+15) / ros_resolution);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobotSecure,
								   'class': 'poi_elem poi_elem_current',
								   });
	path.style.fill = '#AAAAAA';
	svgManager.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'poi_elem poi_elem_current',
								   });
	path.style.fill = '#589FB1';
	svgManager.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'poi_elem poi_elem_current',
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   });
	svgManager.appendChild(path);
}
function ManagerTracePoi(indexPoi)
{
	poi = pois[indexPoi];
	if (poi.deleted != undefined && poi.deleted) { $('#manager_edit_map_svg .poi_elem_'+poi.id_poi).remove(); return; }
	
	is_active = false;
	if ($('#manager_edit_map_svg .poi_elem_'+poi.id_poi).length > 0)
	{
		t = $('#manager_edit_map_svg .poi_elem_'+poi.id_poi);
		if (t.attr('class') != t.attr('class').replace('active', ''))
		{
			is_active = true;
		}
	}
	
	if (downOnMovable && movableDown.data('element_type') == 'poi')
	{
		index_point_movable = movableDown.data('index_point');
	}
	else
		$('#manager_edit_map_svg .poi_elem_'+poi.id_poi).remove();
	
	x = poi.final_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (poi.final_pose_y * 100 / ros_resolution);	
	angle = 0 - poi.final_pose_t * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	rayonRobotSecure = ((26+15) / ros_resolution);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'poi_elem poi_elem_circle poi_elem_'+poi.id_poi,
								   'id': 'manager_edit_map_poi_secure_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svgManager.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot * 0.6,
								   'class': 'poi_elem poi_elem_fond poi_elem_'+poi.id_poi,
								   'id': 'manager_edit_map_poi_robot_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svgManager.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-1.5)+' '+(y-1.5)+' '+(x+1.5)+' '+(y)+' '+(x-1.5)+' '+(y+1.5),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'poi_elem poi_elem_'+poi.id_poi,
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'manager_edit_map_poi_sens_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svgManager.appendChild(path);
	
	if (is_active)
		AddClass('#manager_edit_map_svg .poi_elem_'+poi.id_poi, 'active');
}

function ManagerTraceCurrentAugmentedPose(pose)
{
	$('#manager_edit_map_svg .augmented_pose_elem_current').remove();
	
	x = pose.final_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (pose.final_pose_y * 100 / ros_resolution);
	angle = 0 - pose.final_pose_t * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	rayonRobotSecure = ((26+15) / ros_resolution);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobotSecure,
								   'class': 'augmented_pose_elem augmented_pose_elem_current',
								   });
	path.style.fill = '#AAAAAA';
	svgManager.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'augmented_pose_elem augmented_pose_elem_current',
								   });
	path.style.fill = '#589FB1';
	svgManager.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'augmented_pose_elem augmented_pose_elem_current',
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   });
	svgManager.appendChild(path);
}
function ManagerTraceAugmentedPose(indexAugmentedPose)
{
	augmented_pose = augmented_poses[indexAugmentedPose];
	if (augmented_pose.deleted != undefined && augmented_pose.deleted) { $('#manager_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose).remove(); return; }
	
	is_active = false;
	if ($('#manager_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose).length > 0)
	{
		t = $('#manager_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose);
		if (t.attr('class') != t.attr('class').replace('active', ''))
		{
			is_active = true;
		}
	}
	
	if (downOnMovable && movableDown.data('element_type') == 'augmented_pose')
	{
		index_point_movable = movableDown.data('index_point');
	}
	else
		$('#manager_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose).remove();
	
	x = augmented_pose.final_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (augmented_pose.final_pose_y * 100 / ros_resolution);	
	angle = 0 - augmented_pose.final_pose_t * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	rayonRobotSecure = ((26+15) / ros_resolution);
	
	
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'augmented_pose_elem augmented_pose_elem_circle augmented_pose_elem_'+augmented_pose.id_augmented_pose,
								   'id': 'manager_edit_map_augmented_pose_secure_'+augmented_pose.id_augmented_pose,
								   'data-id_augmented_pose': augmented_pose.id_augmented_pose,
								   'data-element_type': 'augmented_pose',
								   'data-element': 'augmented_pose'
								   });
	svgManager.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot * 0.6,
								   'class': 'augmented_pose_elem augmented_pose_elem_fond augmented_pose_elem_'+augmented_pose.id_augmented_pose,
								   'id': 'manager_edit_map_augmented_pose_robot_'+augmented_pose.id_augmented_pose,
								   'data-id_augmented_pose': augmented_pose.id_augmented_pose,
								   'data-element_type': 'augmented_pose',
								   'data-element': 'augmented_pose'
								   });
	svgManager.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-1.5)+' '+(y-1.5)+' '+(x+1.5)+' '+(y)+' '+(x-1.5)+' '+(y+1.5),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'augmented_pose_elem augmented_pose_elem_'+augmented_pose.id_augmented_pose,
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'manager_edit_map_augmented_pose_sens_'+augmented_pose.id_augmented_pose,
								   'data-id_augmented_pose': augmented_pose.id_augmented_pose,
								   'data-element_type': 'augmented_pose',
								   'data-element': 'augmented_pose'
								   });
	svgManager.appendChild(path);
	
	
	if (is_active)
		AddClass('#manager_edit_map_svg .augmented_pose_elem_'+augmented_pose.id_augmented_pose, 'active');
}

var robot_traced_manager = false;

function ManagerTraceRobot(robot_x, robot_y, robot_theta)
{
	x = robot_x * 100 / ros_resolution;
	y = ros_hauteur - (robot_y * 100 / ros_resolution);	
	angle = 0 - robot_theta * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	
	if (!robot_traced_manager)
	{
		robot_traced_manager = true;
		
		path = makeSVGElement('circle', { cx: x,
										cy: y,
									   r: rayonRobot,
									   'class': 'robot_elem robot_elem_fond',
									   'id': 'manager_edit_map_robot_circle',
									   'data-element_type': 'robot',
									   'data-element': 'robot'
									   });
		svgManager.appendChild(path);
	}
	else
	{
		$('#manager_edit_map_robot_circle').attr("cx", x);
		$('#manager_edit_map_robot_circle').attr("cy", y);
	}
	
	$('#manager_edit_map_robot_sens').remove();
	path = makeSVGElement('polyline', { 'points': (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'robot_elem',
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'manager_edit_map_robot_sens',
								   'data-element_type': 'robot',
								   'data-element': 'robot'
								   });
	$('#manager_edit_map_robot_circle').after(path);
}

function ManagerResizeSVG()
{	
	ManagerTraceRobot(lastRobotPose.X, lastRobotPose.Y, lastRobotPose.T);
	
	$('#manager_edit_map_svg .forbidden_elem').remove();
	$.each(forbiddens, function( index, forbidden ) {
		ManagerTraceForbidden(index);
	});
	$('#manager_edit_map_svg .area_elem').remove();
	$.each(areas, function( index, area ) {
		ManagerTraceArea(index);
	});
	$('#manager_edit_map_svg .dock_elem').remove();
	$.each(docks, function( index, dock ) {
		ManagerTraceDock(index);
	});
	$('#manager_edit_map_svg .poi_elem').remove();
	$.each(pois, function( index, poi ) {
		ManagerTracePoi(index);
	});
	$('#manager_edit_map_svg .augmented_pose_elem').remove();
	$.each(augmented_poses, function( index, augmented_pose ) {
		ManagerTraceAugmentedPose(index);
	});
}