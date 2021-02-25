
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
	}
}
