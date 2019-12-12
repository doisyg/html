<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_developer"])) { header("location:login.php"); }
if ($userConnected->id_groupe_user != 1) { header("location:index.php"); }

$sectionMenu = "api_configuration";

if (isset($_POST['id_action']))
{
	$action = new ApiAction($_POST['id_action']);
	$action->groupe = trim($_POST['groupe']);
	$action->nom = trim($_POST['nom']);
	$action->messageType = trim($_POST['messageType']);
	$action->function_name = trim($_POST['function_name']);
	$action->details = $_POST['details'];
	$action->Save();
	
	header('location:action_edit.php?id_action='.$_POST['id_action'].'&ok=1');
}

$hideColonneDroite = true;
require_once (dirname(__FILE__).'/template/header.php');

$action = new ApiAction($_GET['id_action']);

?>
<div class="col-md-12">
    <div class="row call-panel">
    
        <div class="panel-content">
        	<div class="col-md-12">
                <h3><i class="fa fa-user" aria-hidden="true"></i> Modification du action</h3>
                <hr>
                <form action="action_edit.php" method="post" style="margin-bottom:20px;">
                <input type="hidden" name="id_action" value="<?php echo $_GET['id_action'];?>" />
                
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="nom" id="nom" value="<?php echo $action->nom;?>" placeholder="Nom du action">
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="messageType" id="messageType" value="<?php echo $action->messageType;?>" placeholder="Message Type">
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="groupe" id="groupe" value="<?php echo $action->groupe;?>" placeholder="Groupe">
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="function_name" id="function_name" value="<?php echo $action->function_name;?>" placeholder="Nom de la fonction dans l'API">
                    </div>
                </div>
                
                <textarea class="form-control" rows="10" name="details"><?php echo $action->details;?></textarea>
                
                <input type="submit" class="btn btn-success" value="Sauver" />
                
                </form>
            </div>
        
        </div>
                
    </div>	
</div>		

<?php require_once (dirname(__FILE__).'/template/footer.php');?>
