<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_developer"])) { header("location:login.php"); }
if ($userConnected->id_groupe_user != 1) { header("location:index.php"); }

$sectionMenu = "api_configuration";

if (isset($_POST['groupe']))
{
	$topic_pub = new ApiTopicPub();
	$topic_pub->groupe = trim($_POST['groupe']);
	$topic_pub->nom = trim($_POST['nom']);
	$topic_pub->messageType = trim($_POST['messageType']);
	$topic_pub->function_name = trim($_POST['function_name']);
	$topic_pub->details = $_POST['details'];
	$topic_pub->Save();
	
	header('location:topic_pub_edit.php?id_topic_pub='.$topic_pub->id_topic_pub.'&ok=1');
}

$hideColonneDroite = true;
require_once (dirname(__FILE__).'/template/header.php');


?>
<div class="col-md-12">
    <div class="row call-panel">
    
        <div class="panel-content">
        	<div class="col-md-12">
                <h3><i class="fa fa-user" aria-hidden="true"></i> Ajouter du topic_pub</h3>
                <hr>
                <form action="topic_pub_add.php" method="post" style="margin-bottom:20px;">
                
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="nom" id="nom" value="" placeholder="Nom du topic_pub">
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="messageType" id="messageType" value="" placeholder="Message Type">
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="groupe" id="groupe" value="" placeholder="Groupe">
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="function_name" id="function_name" value="" placeholder="Nom de la fonction dans l'API">
                    </div>
                </div>
                
                <textarea class="form-control" rows="10" name="details"></textarea>
                
                <input type="submit" class="btn btn-success" value="Sauver" />
                
                </form>
            </div>
        
        </div>
                
    </div>	
</div>		

<?php require_once (dirname(__FILE__).'/template/footer.php');?>
