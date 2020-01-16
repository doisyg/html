<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_developer"])) { header("location:login.php"); }

$sectionMenu = "home";


$errors = '';
if (isset($_POST['prenom']))
{
	$userConnected->prenom = $_POST['prenom'];
	$userConnected->nom = $_POST['nom'];
	$userConnected->societe = $_POST['societe'];
	$userConnected->email = $_POST['email'];
	
	if ($_POST['password']!='')
	{
		if ($_POST['password']!=$_POST['cpassword'])
			$errors .= '<p>'.__('Mot de passe incorrect').'</p>';
		else
			$userConnected->pass = md5($_CONFIG['KEY'].$_POST['password']);
	}
	
	
	$userConnected->Save();
}

$hideColonneDroite = true;
require_once (dirname(__FILE__).'/template/header.php');
?>

<div class="col-md-6" style="padding:40px;">
<div class="row call-panel" style="padding:40px;">

<div class="panel-content">

<h3><i class="fa fa-user" aria-hidden="true"></i> <?php echo __('Account settings');?></h3>
<hr>
	<form method="post" autocomplete="off" enctype="multipart/form-data" class="col-md-12">
    	
        <div class="row">
    		
            <div class="col-md-12">
        		<div class="row">
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="prenom" id="prenom" value="<?php echo $userConnected->prenom;?>" placeholder="<?php echo __('First name');?>">
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="nom" id="nom" value="<?php echo $userConnected->nom;?>" placeholder="<?php echo __('Last name');?>">
                    </div>
                </div>
                <input type="text" class="form-control" name="societe" id="societe" value="<?php echo $userConnected->societe;?>" placeholder="<?php echo __('Company');?>">
        
        		<input type="text" class="form-control" name="email" id="email" value="<?php echo $userConnected->email;?>" placeholder="<?php echo __('Email');?>">
                
                
                <div class="row">
                    <div class="col-md-6">
                        <input type="password" class="form-control" name="password" id="password" autocomplete="off" value="" placeholder="<?php echo __('Password');?>">
                    </div>
                    <div class="col-md-6">
                        <input type="password" class="form-control" name="cpassword" id="cpassword" autocomplete="off" value="" placeholder="<?php echo __('Confirm Password');?>">
                    </div>
                </div>
                
			</div>
        
        
        
        </div>
        
        <input type="submit" class="btn btn-success" value="<?php echo __('Sauver');?>" />
        
        </form>
        
        <div style="clear:both;"></div>

</div>
        	
</div>	
</div>	


<div class="col-md-6" style="padding:40px;">
<div class="row call-panel" style="padding:40px;">

<div class="panel-content">

<h3><i class="fa fa-exchange" aria-hidden="true"></i> <?php echo __('API');?></h3>
<hr>
    <div class="row">
        
        <div class="col-md-12">
            <label><strong>API Key : </strong></label> <?php echo $userConnected->api_key;?>
            
        </div>
    
    </div>

</div>
        	
</div>	
</div>		

      	
		

<?php require_once (dirname(__FILE__).'/template/footer.php');?>
