<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_developer"])) { header("location:login.php"); }
if ($userConnected->id_groupe_user != 1) { header("location:index.php"); }

$sectionMenu = "api_configuration";

if (isset($_POST['id_service']))
{
	$service = new ApiService($_POST['id_service']);
	$service->groupe = trim($_POST['groupe']);
	$service->nom = trim($_POST['nom']);
	$service->messageType = trim($_POST['messageType']);
	$service->function_name = trim($_POST['function_name']);
	$service->details = $_POST['details'];
	$service->Save();
	
	header('location:service_edit.php?id_service='.$_POST['id_service'].'&ok=1');
}

$hideColonneDroite = true;
require_once (dirname(__FILE__).'/template/header.php');

$service = new ApiService($_GET['id_service']);

?>
<div class="col-md-12">
    <div class="row call-panel">
    
        <div class="panel-content">
        	<div class="col-md-12">
                <h3><i class="fa fa-user" aria-hidden="true"></i> Modification du service</h3>
                <hr>
                <form action="service_edit.php" method="post" style="margin-bottom:20px;">
                <input type="hidden" name="id_service" value="<?php echo $_GET['id_service'];?>" />
                
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="nom" id="nom" value="<?php echo $service->nom;?>" placeholder="Nom du service">
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="messageType" id="messageType" value="<?php echo $service->messageType;?>" placeholder="Message Type">
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="groupe" id="groupe" value="<?php echo $service->groupe;?>" placeholder="Groupe">
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="function_name" id="function_name" value="<?php echo $service->function_name;?>" placeholder="Nom de la fonction dans l'API">
                    </div>
                </div>
                
                <textarea class="form-control" rows="10" name="details"><?php echo $service->details;?></textarea>
                
                <input type="submit" class="btn btn-success" value="Sauver" />
                
                </form>
            </div>
        
        </div>
                
    </div>	
</div>		

<?php require_once (dirname(__FILE__).'/template/footer.php');?>
