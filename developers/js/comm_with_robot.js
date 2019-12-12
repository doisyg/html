function SendCommandeToRobot(id_site, id_robot, details, commande)
{
	jQuery.ajax({
		url: 'sendCommande.php',
		type: "post",
		data: { 
				'id_site' : id_site,
				'id_robot' : id_robot,
				'details' : details,
				'commande' : commande
			},
		error: function(jqXHR, textStatus, errorThrown) {
			},
		success: function(data, textStatus, jqXHR) {
			}
	});
}



function PrendrePhotoRobot(id_site, id_robot, id_evenement)
{
	SendCommandeToRobot(id_site, id_robot, id_evenement, 'prendrePhotoHaut');
	$('#lien_attente').click();
}