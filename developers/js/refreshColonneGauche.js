// JavaScript Document
var timerVideo = null;
var timerAudio = null;
var popupAlerteHaveClosed = false;
var timerBAlerte = null;


function ControlRobotColonneGauche(id_site, id_robot)
{
	$('#lien_attente_VisioFromAdmin').click();
	SendCommandeToRobot(id_site, id_robot, '', 'priseDeControl');
	SendCommandeToRobot(id_site, id_robot, '', 'priseDeControlHaut');
	CheckRobotPretColonneGauche(id_site, id_robot);
}

function CheckRobotPretColonneGauche(id_site, id_robot)
{
	jQuery.ajax({
		url: 'checkCheckRobotPretControl.php',
		type: "post",
		data: { 
			'id_site': id_site, 
			'id_robot': id_robot
			},
		error: function(jqXHR, textStatus, errorThrown) {
			},
		success: function(data, textStatus, jqXHR) {
				valsAppel = jQuery.parseJSON(data);
				
				if (valsAppel['visio'] != 0)
				{
					location.href = 'visio.php?fromAdmin=1&id_site_todo='+valsAppel['visio'];
				}
				else
					CheckRobotPretColonneGauche(id_site, id_robot);
			}
	});
}

$.fn.MoveToTop = function() {
		var other = $("#listGauche .list-group-item:eq(1)");
		other.before(this);
		//$(this).remove();
	};	
	
$(document).ready(function(e) {
	RefreshCG();
	
	init(Notification.permission);
});

var canNotify = false;
function init(permission)
{
	permission = permission || "default";
	if ("default" === permission)
	{
		Notification.requestPermission(function(permission){init(permission);});
	}
	else
	{
		if ("denied" === permission)
			canNotify = false;
	  	else if ("granted" === permission)
			canNotify = true;
	}
}

var notificationSended = Array();
function sendNotification(id_site_todo, title, body, tag)
{
	if (notificationSended[id_site_todo] == undefined)
	{
		notificationSended[id_site_todo] = true;
		
		var notificationWindow = $("#notificationWindowTemplate").children().clone();
		
		notificationWindow.find(".notificationWindowTitle").text(title);
		var params = params ||{};
		params.body = body;
		notificationWindow.find(".notificationWindowBody").text(body);
		
		params.tag = tag;
		notificationWindow.find(".notificationWindowTag").text(tag);
		
		params.icon = lienIconNotify;
		
		var n = (params) ? new Notification(title, params) : new Notification(title);
		
		notificationWindow.find(".notificationWindowCloseButton").on("click", function(){
			n.close();
		});
	}
}

function RefreshCG()
{
    
	jQuery.ajax({
		url: 'ajax/refreshColonneGauche.php',
		type: "post",
		error: function(jqXHR, textStatus, errorThrown) {
			location.href = location.href;
		},
		success: function(data, textStatus, jqXHR) {
			data = JSON.parse(data);
			
			RefreshSites(data.sites);
			RefreshUsers(data.users);
			
			setTimeout('RefreshCG()', 3000);
		}
	});
	
}

function MoveSiteToTop(id_site)
{
	$("#cg_site_"+id_site).MoveToTop();
}

function ClignoteVideo()
{
	$(".btn_video.btn-warning").fadeOut(500).fadeIn(500); 
    $(".btn_video.btn-danger").fadeOut(500).fadeIn(500); 
}

function ClosePopupAlerte()
{
	popupAlerteHaveClosed = true;
}

function RefreshSites (sites)
{
	$("#popupAlerte>div").hide();
	
	haveVideo = false;
	for (var index in sites)
	{
		site = sites[index];
		
		$('#cg_site_'+site.id_site+' h4.list-group-item-heading i').removeClass('site-active site-calling');
		
		if (site.encours)
		{
			$('#cg_site_'+site.id_site+' h4.list-group-item-heading i').addClass('site-active');
		}
		else if (site.calling)
		{
			MoveSiteToTop(site.id_site);
			$('#cg_site_'+site.id_site+' h4.list-group-item-heading i').addClass('site-calling');
		}
		
		
		for (var indexRobot in site.robots)
		{
			robot = site.robots[indexRobot];
			
			$('#cg_robot_'+robot.id_robot).removeClass('navbar-badge-offline navbar-badge-online navbar-badge-no canReply navbar-badge-error');
			$('#cg_robot_'+robot.id_robot).attr('href', '#');
			$('#cg_robot_'+robot.id_robot).html('');
			
			if (robot.calling)
			{
				$('#cg_robot_'+robot.id_robot).attr('data-original-title', 'Répondre');
				$('#cg_robot_'+robot.id_robot).attr('title', 'Répondre');
				$('#cg_robot_'+robot.id_robot).html(langStrCalling);
				$('#cg_robot_'+robot.id_robot).addClass('navbar-badge-offline canReply');				
				$('#cg_robot_'+robot.id_robot).attr('href', 'visio.php?id_site_todo='+robot.id_site_todo);
				
				if (currentUserIsOnline)
				{
					haveVideo = true;
					MoveSiteToTop(site.id_site);
					
					$('#alerteVideo_'+site.id_site).show();
					$('#alerteVideo_'+site.id_site).addClass('btn-danger');
						
					$('#alerteVideo_'+site.id_site).attr("href", 'visio.php?id_site_todo='+robot.id_site_todo);
					
					
					if (timerVideo==null)
					{
						$("#favicon").attr("href","images/appel-video.gif");
						timerVideo = setInterval('ClignoteVideo()',1000);
					}
					
					$("#nom_"+site.id_site).show();
					
					if ((typeof noPopupAlerte == 'undefined' || !noPopupAlerte) && $("#popupAlerte:visible").length<=0 && !popupAlerteHaveClosed)
						$('#lienPopupAlerte').click();
						
					
					sendNotification (robot.id_site_todo, 'Wyca - Call in !', 'Call from site '+ $('#cg_site_'+site.id_site+' h4.list-group-item-heading span').html(), '');
				}
			}
			else if (robot.encours)
			{
				$('#cg_robot_'+robot.id_robot).html(robot.encours_user);
				$('#cg_robot_'+robot.id_robot).addClass('navbar-badge-online');
				
				if (user_can_reprendre || id_user_connected == robot.encours_id_user)
				{
					$('#cg_robot_'+robot.id_robot).attr('data-original-title', 'Reprendre la communication');
					$('#cg_robot_'+robot.id_robot).attr('title', 'Reprendre la communication');
					$('#cg_robot_'+robot.id_robot).addClass('canReply');				
					$('#cg_robot_'+robot.id_robot).attr('href', 'visio.php?id_site_todo='+robot.id_site_todo);
				}
				else
				{
					$('#cg_robot_'+robot.id_robot).attr('data-original-title', 'Communication en cours');
					$('#cg_robot_'+robot.id_robot).attr('title', 'Communication en cours');
				}
				
				
			}
			else
			{
				$('#cg_robot_'+robot.id_robot).attr('data-original-title', 'Prendre le contrôle du robot');
				$('#cg_robot_'+robot.id_robot).attr('title', 'Prendre le contrôle du robot');
				$('#cg_robot_'+robot.id_robot).addClass('navbar-badge-off');
				$('#cg_robot_'+robot.id_robot).html('<i class="fa fa-android" aria-hidden="true"></i>');
				$('#cg_robot_'+robot.id_robot).attr('href', 'javascript:ControlRobotColonneGauche('+site.id_site+', '+robot.id_robot+');');
			}
			
			if (robot.deconnected)
			{
				$('#cg_robot_'+robot.id_robot).attr('data-original-title', 'Robot injoignable ! Contactez le support');
				$('#cg_robot_'+robot.id_robot).attr('title', 'Robot injoignable ! Contactez le support');
				$('#cg_robot_'+robot.id_robot).addClass('navbar-badge-error');
				$('#cg_robot_'+robot.id_robot).attr('href', '');
			}
		}
		
		for (var indexEquipement in site.equipements)
		{
			equipement = site.equipements[indexEquipement];
			
			$('#cg_equip_'+equipement.id_equipement).removeClass('navbar-badge-offline navbar-badge-online navbar-badge-no canReply');
			$('#cg_equip_'+equipement.id_equipement).html('');
			$('#cg_equip_'+equipement.id_equipement).attr('href', '#');
			
			if (equipement.calling)
			{
				$('#cg_equip_'+equipement.id_equipement).html(langStrCalling);
				$('#cg_equip_'+equipement.id_equipement).addClass('navbar-badge-offline canReply');
				$('#cg_equip_'+equipement.id_equipement).attr('href', 'audio.php?id_site_todo='+equipement.id_site_todo);
				$('#cg_equip_'+equipement.id_equipement).html(langStrCalling);
				
				if (currentUserIsOnline)
				{
					haveVideo = true;
					MoveSiteToTop(site.id_site);
					
					$('#alerteAudio_'+site.id_site).show();
					$('#alerteAudio_'+site.id_site).addClass('btn-danger');
						
					$('#alerteAudio_'+site.id_site).attr("href", 'audio.php?id_site_todo='+equipement.id_site_todo);
					
					
					if (timerVideo==null)
					{
						$("#favicon").attr("href","images/appel-video.gif");
						timerVideo = setInterval('ClignoteVideo()',1000);
					}
					
					$("#nom_"+site.id_site).show();
					
					if ((typeof noPopupAlerte == 'undefined' || !noPopupAlerte) && $("#popupAlerte:visible").length<=0 && !popupAlerteHaveClosed)
						$('#lienPopupAlerte').click();
						
					sendNotification (equipement.id_site_todo, 'Wyca - Appel visiophone en cours !', 'Appel visiophone en cours du site '+ $('#cg_site_'+site.id_site+' h4.list-group-item-heading span').html(), '');
				}
			}
			else if (equipement.encours)
			{
				if (equipement.encours_user == '')
					$('#cg_equip_'+equipement.id_equipement).html('Inconnu');
				else
					$('#cg_equip_'+equipement.id_equipement).html(equipement.encours_user);
				$('#cg_equip_'+equipement.id_equipement).addClass('navbar-badge-online');
				
				if (user_can_reprendre || id_user_connected == equipement.encours_id_user)
				{
					$('#cg_equip_'+equipement.id_equipement).addClass('canReply');			
					$('#cg_equip_'+equipement.id_equipement).attr('href', 'audio.php?id_site_todo='+equipement.id_site_todo);
				}
			}
			else
			{
				$('#cg_equip_'+equipement.id_equipement).addClass('navbar-badge-no');		
				$('#cg_equip_'+equipement.id_equipement).attr('href', '#');
			}
		}
	}
	
	if ($("#popupAlerte>div:visible").length<=0 && $("#popupAlerte:visible").length>0)
	{
		// On ferme la popup
		$.fancybox.close();
	}
	
	if (!haveVideo)
	{
		if (timerVideo!=null)
		{
			$("#favicon").attr("href","../favicon.gif");
			clearInterval(timerVideo);
			timerVideo = null;
		}
	}
}

function RefreshUsers (users)
{
	nbOnline = 0;
	for (var index in users)
	{
		user = users[index];
		
		$('#cg_user_'+user.id_user+' span.badge').removeClass('navbar-badge-online navbar-badge-offline');
		
		if (user.connected)
		{
			if (true || user.online == "1")
			{
				nbOnline++;
				$('#cg_user_'+user.id_user+' span.badge').addClass('navbar-badge-online');
				$('#cg_user_'+user.id_user+' span.badge').html(langStrOnline);
			}
			else
			{
				$('#cg_user_'+user.id_user+' span.badge').addClass('navbar-badge-offline');
				$('#cg_user_'+user.id_user+' span.badge').html(langStrOffline);
			}
		}
		else
			$('#cg_user_'+user.id_user+' span.badge').html(langStrNotConnected);
			
		
		
	}
	
	$('#nbUserOnline').html(nbOnline);
}
