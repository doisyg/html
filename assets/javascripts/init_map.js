// JavaScript Document
var isDown = false;

var largeurSlam = 0;
var hauteurSlam = 0;
var largeurRos = 0;
var hauteurRos = 0;

var start = true;

function distance(x1, y1, x2, y2)
{
    return Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

function diff(x, y) 
{
	var centerItem = $('#install_by_step_edit_map_robotDestination'),Fin
		centerLoc = centerItem.offset();
	var dx = x - (centerLoc.left + (centerItem.width() / 2));
		dy = y - (centerLoc.top + (centerItem.height() / 2));
	return Math.atan2(dy, dx) * (180 / Math.PI);
}

var svgTemp;
var svgData;
var imgForSVG;

var canvas;
var canvasWidth;
var canvasHeight;
var ctx;
var canvasData;
var zoom = 1.5;

var ros_largeur = 0;
var ros_hauteur = 0;
var ros_resolution = 5;

var positions = Array();

var xObject = 0;
var yObject = 0;

var zoom_carte = 1;

var nextIdArea = 300000;
var nextIdDock = 300000;
var nextIdPoi = 300000;
var nextIdAugmentedPose = 300000;
var nextIdLandmark = 300000;
var forbiddens = Array();
var areas = Array();
var gommes = Array();
var docks = Array();
var pois = Array();
var augmented_poses = Array();
var landmarks = Array();
var id_map = -1;
var id_map_zoom = -1;


var blockZoom = false;
var gotoTest = false;

var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

var minStokeWidth = 1;
var maxStokeWidth = 5;

var canvas;
var dessin;

var currentStep = '';

var currentStepAddPoi = '';
var currentStepAddAugmentedPose = '';


var timerRotate = null;

var previewDisplayed = false;
var currentForbiddenIndex = -1;
var saveCurrentForbidden = null;
var currentAreaIndex = -1;
var saveCurrentArea = null;
var currentDockIndex = -1;
var saveCurrentDock = null;
var currentPoiIndex = -1;
var saveCurrentPoi = null;
var currentAugmentedPoseIndex = -1;
var saveCurrentAugmentedPose = null;

var currentDockPose = {};
var currentPoiPose = {};
var currentAugmentedPosePose = {};

var downOnZoomClick = false;
var downOnMovable = false;
var movableDown = null;
var currentForbiddenPoints = Array();
var currentAreaPoints = Array();
var currentGommePoints = Array();
var ctrlZ = false;
var previewInProgress = false;
var displayHelpAddShelf = true;

var currentSelectedItem = Array();
var ctrlClickIsPressed = false;
var cPressed = false;

var clickSelectSVG = false;
var clickSelectSVG_x = 0;
var clickSelectSVG_y = 0;
var clickSelectSVG_x_last = -1;
var clickSelectSVG_y_last = -1;

var currentModePath;

var timerSaveUserOptions = null;
var timerOpenInfo = null;
var id_info_to_open = -1;
var info_to_open_x = -1;
var info_to_open_y = -1;

var intervalRefreshConn = null;

var indexDockElem = 0;
var indexPoiElem = 0;
var indexAugmentedPoseElem = 0;
var indexLandmarkElem = 0;

var boolHelpArea=true;
var boolHelpForbidden=true;
var boolHelpGotoPose=true;

var boolGotopoi=true;
var boolGotodock=true;
var boolGotoaugmentedpose=true;

var poi_temp_add = {};
var augmented_pose_temp_add = {};

var timerCantChange = null;
var sizeGomme = 1;

// OTHER FUNCS

function InitTaille()
{
}

function RefreshAllPath()
{
}

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

function AppliquerZoom()
{
	//$('#all').width(saveWidth * zoom_carte);
	//Resize();
	//$('#boxsmap').resize();
	
	if ($('#install_by_step_edit_map').is(':visible')) ByStepResizeSVG();
	if ($('#install_normal_edit_map').is(':visible')) NormalResizeSVG();
	if ($('#manager_edit_map').is(':visible')) ManagerResizeSVG
	if ($('#user_edit_map').is(':visible')) UserResizeSVG
	
	//RefreshZoomView();
	//setTimeout(RefreshZoomView, 100);
}

function InitSVG()
{
}

function RemoveClass(query_element, class_to_delete)
{
	$(query_element).each(function(index, element) {
		if ($(this).attr('class') != undefined)
	        $(this).attr('class',  $(this).attr('class').replace(class_to_delete, ''));
    });
}

function AddClass(query_element, class_to_add)
{
	$(query_element).each(function(index, element) {
		if ($(this).attr('class') != undefined)
	        $(this).attr('class',  $(this).attr('class') + ' ' + class_to_add);
		else
	        $(this).attr('class',  class_to_add);
    });
}

function componentToHex(c)
{
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b)
{
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function sortUL(selector)
{
    $(selector).children("li").sort(function(a, b) {
        var upA = $(a).text().toUpperCase();
        var upB = $(b).text().toUpperCase();
        return (upA < upB) ? -1 : (upA > upB) ? 1 : 0;
    }).appendTo(selector);
}

function GetAngleRadian(x1, y1, x2, y2)
{
	var dx = x2 - x1;
	var dy = y2 - y1;
	return Math.atan2(dy, dx);
}

function GetAngleDegre(x1, y1, x2, y2)
{
	return GetAngleRadian(x1, y1, x2, y2) * (180 / Math.PI);
}

function GetDockPosition(pose)
{
	dockPose = {'x': pose.x + Math.cos(pose.theta) * 0.26 , 'y': pose.y + Math.sin(pose.theta) * 0.26, 'theta':pose.theta};
	
	return dockPose;
}

function RotatePoint (M, O, angle)
{
    var xM, yM, x, y;
    //angle *= Math.PI / 180;
    xM = M.X - O.X;
    yM = M.Y - O.Y;
    x = xM * Math.cos (angle) + yM * Math.sin (angle) + O.X;
    y = - xM * Math.sin (angle) + yM * Math.cos (angle) + O.Y;
    return ({X:Math.round (x*100)/100, Y:Math.round (y*100)/100});
}

function GetPoiFromID(id)
{
	ret = null;
	$.each(pois, function(indexInArray, poi){
		if (poi.id_poi == id)
		{
			ret = poi;
			return ret;
		}
	});
	return ret;
}

function GetPoiIndexFromID(id)
{
	ret = null;
	$.each(pois, function(indexInArray, poi){
		if (poi.id_poi == id)
		{
			ret = indexInArray;
			return ret;
		}
	});
	return ret;
}

function GetAugmentedPoseFromID(id)
{
	ret = null;
	$.each(augmented_poses, function(indexInArray, augmented_pose){
		if (augmented_pose.id_augmented_pose == id)
		{
			ret = augmented_pose;
			return ret;
		}
	});
	return ret;
}

function GetAugmentedPoseIndexFromID(id)
{
	ret = null;
	$.each(augmented_poses, function(indexInArray, augmented_pose){
		if (augmented_pose.id_augmented_pose == id)
		{
			ret = indexInArray;
			return ret;
		}
	});
	return ret;
}

function GetLandmarkFromID(id)
{
	ret = null;
	$.each(landmarks, function(indexInArray, landmark){
		if (landmark.id_landmark == id)
		{
			ret = landmark;
			return ret;
		}
	});
	return ret;
}

function GetLandmarkIndexFromID(id)
{
	ret = null;
	$.each(landmarks, function(indexInArray, landmark){
		if (landmark.id_landmark == id)
		{
			ret = indexInArray;
			return ret;
		}
	});
	return ret;
}

function GetDockFromID(id)
{
	ret = null;
	$.each(docks, function(indexInArray, dock){
		if (dock.id_docking_station == id)
		{
			ret = dock;
			return ret;
		}
	});
	return ret;
}

function GetDockIndexFromID(id)
{
	ret = null;
	$.each(docks, function(indexInArray, dock){
		if (dock.id_docking_station == id)
		{
			ret = indexInArray;
			return ret;
		}
	});
	return ret;
}

function GetMaxNumDock()
{
	ret = 0;
	$.each(docks, function(indexInArray, dock){
		if (dock.num > ret)
			ret = dock.num;
	});
	return ret;
}

function GetAreaFromID(id)
{
	ret = null;
	$.each(areas, function(indexInArray, area){
		if (area.id_area == id)
		{
			ret = area;
			return ret;
		}
	});
	return ret;
}

function GetAreaIndexFromID(id)
{
	ret = null;
	$.each(areas, function(indexInArray, area){
		if (area.id_area == id)
		{
			ret = indexInArray;
			return ret;
		}
	});
	return ret;
}

function GetForbiddenFromID(id)
{
	ret = null;
	$.each(forbiddens, function(indexInArray, forbidden){
		if (forbidden.id_area == id)
		{
			ret = forbidden;
			return ret;
		}
	});
	return ret;
}

function GetForbiddenIndexFromID(id)
{
	ret = null;
	$.each(forbiddens, function(indexInArray, forbidden){
		if (forbidden.id_area == id)
		{
			ret = indexInArray;
			return ret;
		}
	});
	return ret;
}


var touchStarted = false;

var statusSavingMapBeforeTestPoi = 0 ;
var timerSavingMapBeforeTestPoi = 0 ;

var statusSavingMapBeforeTestDock = 0 ;
var timerSavingMapBeforeTestDock = 0 ;

var statusSavingMapBeforeTestAugmentedPose = 0 ;
var timerSavingMapBeforeTestAugmentedPose = 0 ;

function TimerSavingMapBeforeTest(element)
{
	switch(element){
		case 'dock' : 
			if(statusSavingMapBeforeTestAugmentedPose == 2 && timerSavingMapBeforeTestAugmentedPose==100){
				statusSavingMapBeforeTestAugmentedPose=0;
				timerSavingMapBeforeTestAugmentedPose=0;
			}else{
				delay = statusSavingMapBeforeTestAugmentedPose == 2 ? 1 : 200;
				timerSavingMapBeforeTestAugmentedPose++;
				if(timerSavingMapBeforeTestAugmentedPose == 101)timerSavingMapBeforeTestAugmentedPose=0;
				$('.SaveBeforeTestDockProgress .progress-bar').css('width', timerSavingMapBeforeTestAugmentedPose+'%').attr('aria-valuenow', timerSavingMapBeforeTestAugmentedPose); 
				setTimeout(TimerSavingMapBeforeTest,delay,element);
			}
		
		break;
		case 'poi' : 
			if(statusSavingMapBeforeTestPoi == 2 && timerSavingMapBeforeTestPoi==100){
				statusSavingMapBeforeTestPoi=0;
				timerSavingMapBeforeTestPoi=0;
			}else{
				delay = statusSavingMapBeforeTestPoi == 2 ? 1 : 200;
				timerSavingMapBeforeTestPoi++;
				if(timerSavingMapBeforeTestPoi == 101)timerSavingMapBeforeTestPoi=0;
				$('.SaveBeforeTestPoiProgress .progress-bar').css('width', timerSavingMapBeforeTestPoi+'%').attr('aria-valuenow', timerSavingMapBeforeTestPoi); 
				setTimeout(TimerSavingMapBeforeTest,delay,element);
			}
		break;
		case 'augmented_pose' : 
			if(statusSavingMapBeforeTestDock == 2 && timerSavingMapBeforeTestDock==100){
				statusSavingMapBeforeTestDock=0;
				timerSavingMapBeforeTestDock=0;
			}else{
				delay = statusSavingMapBeforeTestDock == 2 ? 1 : 200;
				timerSavingMapBeforeTestDock++;
				if(timerSavingMapBeforeTestDock == 101)timerSavingMapBeforeTestDock=0;
				$('.SaveBeforeTestAugmentedPoseProgress .progress-bar').css('width', timerSavingMapBeforeTestDock+'%').attr('aria-valuenow', timerSavingMapBeforeTestDock); 
				setTimeout(TimerSavingMapBeforeTest,delay,element);
			}
		break;
		
	}
}