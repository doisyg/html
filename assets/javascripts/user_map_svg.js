
function UserInitSVG()
{
}

function UserGetZoom()
{
	var obj = $('#user_edit_map_svg g');
	obj.attr('id', 'user_edit_map_svg_g');
	 var transformMatrix = obj.css("-webkit-transform") ||
	   obj.css("-moz-transform")    ||
	   obj.css("-ms-transform")     ||
	   obj.css("-o-transform")      ||
	   obj.css("transform");
	   
	 if (transformMatrix == undefined)
	 	return  ros_largeur / $('#user_edit_map_svg').width() / window.panZoomUser.getZoom()
	 
	 var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
	 
	 
	 return 1 / parseFloat(matrix[0]);
}

function UserTraceSection(x1, y1, x2, y2)
{
	$('#user_edit_map_svg .selection').remove();
	
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
	svgUser.appendChild(path);
}

function UserTraceForbidden(indexForbidden)
{
	forbidden = forbiddens[indexForbidden];
	if (forbidden.deleted) { $('#user_edit_map_svg .forbidden_elem_'+forbidden.id_area).remove(); return; }
	
	is_active = false;
	if ($('#user_edit_map_svg .forbidden_elem_'+forbidden.id_area).length > 0)
	{
		t = $('#user_edit_map_svg .forbidden_elem_'+forbidden.id_area);
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
		$('#user_edit_map_svg .forbidden_elem_'+forbidden.id_area).remove();		  
	
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
		
		$('#user_edit_map_svg #user_edit_map_forbidden_'+forbidden.id_area).remove();
		
		path = makeSVGElement('polygon', { points: forbidden_point,
							   'stroke-width': 0,
							   'class':'poly forbidden forbidden_root poly_elem forbidden_elem forbidden_elem_'+forbidden.id_area,
							   'id':'user_edit_map_forbidden_'+forbidden.id_area,
							   'data-id_area': forbidden.id_area
							  });
		path.style.fill = 'rgba(0,0,0,0.5)'
		svgUser.appendChild(path);
		
		if (is_active)
			AddClass('#user_edit_map_svg .forbidden_elem_'+forbidden.id_area, 'active');
	}
}

function UserTraceArea(indexArea)
{
	area = areas[indexArea];
	if (area.deleted) { $('#user_edit_map_svg .area_elem_'+area.id_area).remove(); return; }
	
	is_active = false;
	if ($('#user_edit_map_svg .area_elem_'+area.id_area).length > 0)
	{
		t = $('#user_edit_map_svg .area_elem_'+area.id_area);
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
		$('#user_edit_map_svg .area_elem_'+area.id_area).remove();
	
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
		
		$('#user_edit_map_svg #user_edit_map_area_'+area.id_area).remove();
		
		path = makeSVGElement('polygon', { points: area_point,
							   'stroke-width': 0,
							   'class':'poly area area_root poly_elem area_elem area_elem_'+area.id_area,
							   'id':'user_edit_map_area_'+area.id_area,
							   'data-id_area': area.id_area
							  });
		path.style.fill = 'rgba('+area.color_r+','+area.color_g+','+area.color_b+',0.5)'
		svgUser.appendChild(path);
		
		if (is_active)
			AddClass('#user_edit_map_svg .area_elem_'+area.id_area, 'active');
	}
}

function UserTraceCurrentDock(pose)
{
	$('#user_edit_map_svg .dock_elem_current').remove();
	
	x = pose.fiducial_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (pose.fiducial_pose_y * 100 / ros_resolution);
	
	angle = 0 - pose.fiducial_pose_t * 180 / Math.PI - 90;
	
	path = makeSVGElement('rect', { x: x-5, y:y-1, height:2, width:10,
				   'stroke-width': minStokeWidth,
				   'fill':'yellow',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'movable dock_elem dock_elem_current'
				  });
	svgUser.appendChild(path);
	
	path = makeSVGElement('line', { 'x1': x-1, 'y1':y+1, 'x2': x+1, 'y2':y+1,
				   'stroke-width': 1,
				   'stroke-linecap':'square',
				   'stroke':'orange',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'dock_elem dock_elem_current'
				  });
	svgUser.appendChild(path);
}
function UserTraceDock(indexDock)
{
	dock = docks[indexDock];
	if (dock.deleted != undefined && dock.deleted) { $('#user_edit_map_svg .dock_elem_'+dock.id_docking_station).remove(); return; }
	
	is_active = false;
	if ($('#user_edit_map_svg .dock_elem_'+dock.id_docking_station).length > 0)
	{
		t = $('#user_edit_map_svg .dock_elem_'+dock.id_docking_station);
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
		$('#user_edit_map_svg .dock_elem_'+dock.id_docking_station).remove();
	
	x = dock.fiducial_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (dock.fiducial_pose_y * 100 / ros_resolution);
	
	angle = 0 - dock.fiducial_pose_t * 180 / Math.PI - 90;
	
	path = makeSVGElement('rect', { x: x-5, y:y-1, height:2, width:10,
				   'stroke-width': minStokeWidth,
				   'fill':'red',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'dock_elem dock_elem_fond dock_elem_'+dock.id_docking_station,
				   'id': 'user_edit_map_dock_'+dock.id_docking_station,
				   'data-id_docking_station': dock.id_docking_station,
				   'data-element_type': 'dock',
				   'data-element': 'dock'
				  });
	svgUser.appendChild(path);
	
	path = makeSVGElement('line', { 'x1': x-1, 'y1':y+1, 'x2': x+1, 'y2':y+1,
				   'stroke-width': 1,
				   'stroke-linecap':'square',
				   'stroke':'red',
				   'transform':'rotate('+angle+', '+x+', '+y+')',
				   'class':'dock_elem dock_elem_'+dock.id_docking_station,
				   'id': 'user_edit_map_dock_connect_'+dock.id_docking_station,
				   'data-id_docking_station': dock.id_docking_station,
				   'data-element_type': 'dock',
				   'data-element': 'dock'
				  });
	svgUser.appendChild(path);
	
	x = dock.final_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (dock.final_pose_y * 100 / ros_resolution);
	angle = 0 - dock.final_pose_t * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	rayonRobotSecure = ((26+15) / ros_resolution);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'dock_elem dock_elem_robot dock_elem_fond dock_elem_'+dock.id_docking_station,
								   'id': 'user_edit_map_dock_robot_'+dock.id_docking_station,
								   'data-id_docking_station': dock.id_docking_station,
								   'data-element_type': 'dock',
								   'data-element': 'dock'
								   });
	svgUser.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'dock_elem dock_elem_'+dock.id_docking_station,
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'user_edit_map_dock_sens_'+dock.id_docking_station,
								   'data-id_docking_station': dock.id_docking_station,
								   'data-element_type': 'dock',
								   'data-element': 'dock'
								   });
	svgUser.appendChild(path);
	
	if (is_active)
		AddClass('#user_edit_map_svg .dock_elem_'+dock.id_docking_station, 'active');
}

function UserTraceCurrentPoi(pose)
{
	$('#user_edit_map_svg .poi_elem_current').remove();
	
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
	svgUser.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'poi_elem poi_elem_current',
								   });
	path.style.fill = '#589FB1';
	svgUser.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'poi_elem poi_elem_current',
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   });
	svgUser.appendChild(path);
}
function UserTracePoi(indexPoi)
{
	poi = pois[indexPoi];
	if (poi.deleted != undefined && poi.deleted) { $('#user_edit_map_svg .poi_elem_'+poi.id_poi).remove(); return; }
	
	is_active = false;
	if ($('#user_edit_map_svg .poi_elem_'+poi.id_poi).length > 0)
	{
		t = $('#user_edit_map_svg .poi_elem_'+poi.id_poi);
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
		$('#user_edit_map_svg .poi_elem_'+poi.id_poi).remove();
	
	x = poi.final_pose_x * 100 / ros_resolution;
	y = ros_hauteur - (poi.final_pose_y * 100 / ros_resolution);	
	angle = 0 - poi.final_pose_t * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	rayonRobotSecure = ((26+15) / ros_resolution);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobotSecure,
								   'class': 'poi_elem poi_elem_secure poi_elem_'+poi.id_poi,
								   'id': 'user_edit_map_poi_secure_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svgUser.appendChild(path);
	
	path = makeSVGElement('circle', { cx: x,
									cy: y,
								   r: rayonRobot,
								   'class': 'poi_elem poi_elem_fond poi_elem_'+poi.id_poi,
								   'id': 'user_edit_map_poi_robot_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svgUser.appendChild(path);
	
	path = makeSVGElement('polyline', { 'points': (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'poi_elem poi_elem_'+poi.id_poi,
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'user_edit_map_poi_sens_'+poi.id_poi,
								   'data-id_poi': poi.id_poi,
								   'data-element_type': 'poi',
								   'data-element': 'poi'
								   });
	svgUser.appendChild(path);
	
	if (is_active)
		AddClass('#user_edit_map_svg .poi_elem_'+poi.id_poi, 'active');
}

var robot_traced_user = false;
function UserTraceRobot(robot_x, robot_y, robot_theta)
{
	x = robot_x * 100 / ros_resolution;
	y = ros_hauteur - (robot_y * 100 / ros_resolution);	
	angle = 0 - robot_theta * 180 / Math.PI;
	
	rayonRobot = (26 / ros_resolution);
	
	if (true || !robot_traced_user) // true pour le mettre au premier plan
	{
		robot_traced_user = true;
		$('#user_edit_map_robot_circle').remove();
		path = makeSVGElement('circle', { cx: x,
										cy: y,
									   r: rayonRobot,
									   'class': 'robot_elem robot_elem_fond',
									   'id': 'user_edit_map_robot_circle',
									   'data-element_type': 'robot',
									   'data-element': 'robot'
									   });
		svgUser.appendChild(path);
	}
	else
	{
		$('#user_edit_map_robot_circle').attr("cx", x);
		$('#user_edit_map_robot_circle').attr("cy", y);
	}
	
	$('#user_edit_map_robot_sens').remove();
	path = makeSVGElement('polyline', { 'points': (x-2)+' '+(y-2)+' '+(x+2)+' '+(y)+' '+(x-2)+' '+(y+2),
									'stroke':'#FFFFFF',
									'stroke-width':1,
									'fill':'none',
									'stroke-linejoin':'round',
									'stroke-linecap':'round',
								   'class': 'robot_elem',
								   'transform':'rotate('+angle+', '+x+', '+y+')',
								   'id': 'user_edit_map_robot_sens',
								   'data-element_type': 'robot',
								   'data-element': 'robot'
								   });
	$('#user_edit_map_robot_circle').after(path);
}

function UserResizeSVG()
{	
	$('#user_edit_map_svg .forbidden_elem').remove();
	$.each(forbiddens, function( index, forbidden ) {
		UserTraceForbidden(index);
	});
	$('#user_edit_map_svg .area_elem').remove();
	$.each(areas, function( index, area ) {
		UserTraceArea(index);
	});
	$('#user_edit_map_svg .dock_elem').remove();
	$.each(docks, function( index, dock ) {
		UserTraceDock(index);
	});
	$('#user_edit_map_svg .poi_elem').remove();
	$.each(pois, function( index, poi ) {
		UserTracePoi(index);
	});
	
	UserTraceRobot(lastRobotPose.X, lastRobotPose.Y, lastRobotPose.T);
}