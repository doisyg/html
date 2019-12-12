<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_developer"])) { header("location:login.php"); }
if ($userConnected->id_groupe_user != 1) { header("location:index.php"); }

$sectionMenu = "api_configuration";

if (isset($_POST['groupe']))
{
	$topic = new ApiTopic();
	$topic->groupe = trim($_POST['groupe']);
	$topic->nom = trim($_POST['nom']);
	$topic->messageType = trim($_POST['messageType']);
	$topic->event_name = trim($_POST['event_name']);
	$topic->publish_name = trim($_POST['publish_name']);
	$topic->id_service_update = $_POST['id_service_update'];
	$topic->Save();
	
	header('location:topic_edit.php?id_topic='.$topic->id_topic.'&ok=1');
}

$hideColonneDroite = true;
require_once (dirname(__FILE__).'/template/header.php');

?>
<div class="col-md-12">
    <div class="row call-panel">
    
        <div class="panel-content">
        	<div class="col-md-12">
                <h3><i class="fa fa-user" aria-hidden="true"></i> Ajouter du topic</h3>
                <hr>
                <form action="topic_add.php" method="post" style="margin-bottom:20px;">
                
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="nom" id="nom" value="" placeholder="Nom du topic">
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="messageType" id="messageType" value="" placeholder="Message Type">
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="groupe" id="groupe" value="" placeholder="Groupe">
                    </div>
                    <div class="col-md-6">
                        <select type="text" class="form-control" name="id_service_update" id="id_service_update">
                        <option value="0">Service de mise à jour du topic</option>
						<?php
						$services = ApiService::GetApiServices('groupe, nom', 'ASC');
						foreach($services as $service)
						{
							?><option value="<?php echo $service->id_service;?>"><?php echo $service->nom;?></option><?php
						}
						?>
                        </select>
                    </div>
                    <div style="clear:both;"></div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="event_name" id="function_name" value="" placeholder="Nom de l'évènement dans l'API">
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="publish_name" id="publish_name" value="" placeholder="Nom de la fonction de publication dans l'API">
                    </div>
                </div>
                
                <input type="submit" class="btn btn-success" value="Sauver" />
                
                </form>
            </div>
        
        </div>
                
    </div>	
</div>		

<?php require_once (dirname(__FILE__).'/template/footer.php');?>
