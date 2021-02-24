
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
	
	x = robot_x * 100 / 5 * ($('#map').outerWidth()/ros_largeur);
	y = ros_hauteur - (robot_y * 100 / ros_resolution);	
	angle = 0 - robot_theta * 180 / Math.PI;
	rayonRobot = (26 / ros_resolution);
	
	if (true || !robot_traced) // true pour le mettre au premier plan
	{
		robot_traced = true;
		$('#user_edit_map_robot_circle').remove();
		path = makeSVGElement('circle', { cx: x,
										cy: y,
									   r: rayonRobot,
									   'class': 'robot_elem robot_elem_fond',
									   'id': 'user_edit_map_robot_circle',
									   'data-element_type': 'robot',
									   'data-element': 'robot'
									   });
		svgMap.appendChild(path);
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
