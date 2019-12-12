<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_developer"])) { header("location:login.php"); }

$sectionMenu = "my-account";

$errors = '';
if (isset($_POST['prenom']))
{
	$userConnected->prenom = $_POST['prenom'];
	$userConnected->nom = $_POST['nom'];
	$userConnected->societe = $_POST['societe'];
	$userConnected->email = $_POST['email'];
	$userConnected->adresse_1 = $_POST['adresse_1'];
	$userConnected->adresse_2 = $_POST['adresse_2'];
	$userConnected->codepostal = $_POST['cp'];
	$userConnected->ville = $_POST['ville'];
	$userConnected->tel = $_POST['tel'];
	$userConnected->portable = $_POST['portable'];
	
	if ($_POST['password']!='')
	{
		if ($_POST['password']!=$_POST['cpassword'])
			$errors .= '<p>'.__('Mot de passe incorrect').'</p>';
		else
			$userConnected->pass = md5($_CONFIG['KEY'].$_POST['password']);
	}
	
	if ($_FILES["photo"]["error"]==0)
	{
		$i = 0;
		$nomFichier = str_replace('_', '', $_FILES["photo"]["name"]);
		$nomFichier = strtolower($nomFichier);
		
		$ext = pathinfo($nomFichier, PATHINFO_EXTENSION);
		$nomFichier = substr($nomFichier, 0, strlen($nomFichier) - (strlen($ext)+1));
		
		if (file_exists('./users/'.$nomFichier.'.'.$ext))
		{
			do
			{
				$i++;
			} while (file_exists('./users/'.$nomFichier.'_'.str_pad($i, 3, '0', STR_PAD_LEFT).'.'.$ext));
			$nomFichier = $nomFichier.'_'.str_pad($i, 3, '0', STR_PAD_LEFT);
		}
		
		$nomFichierSansExt = $nomFichier;
		$nomFichier .= '.'.$ext;
		$cheminFichier = './users/'.$nomFichier;
		
		$tmp_name = $_FILES["photo"]["tmp_name"];
		move_uploaded_file($tmp_name, $cheminFichier);
		
		$userConnected->photo = $nomFichier;
	}
	
	$userConnected->Save();
}
$hideColonneDroite = true;
require_once (dirname(__FILE__).'/template/header.php');
?>
<div class="col-md-12">
<div class="row call-panel">
<div class="site-error">
<?php echo $errors;?>
</div>

<div class="panel-content">

<h3><i class="fa fa-user" aria-hidden="true"></i> <?php echo __('Account settings');?></h3>
<hr>
	<form method="post" autocomplete="off" enctype="multipart/form-data">
    	
        <div class="row">
            <div class="col-md-3">
        	  <div data-provides="fileinput" class="fileinput fileinput-new">
                <div style="width: 150px; height: 150px;" class="fileinput-new thumbnail">
                  <img alt="100%x100%" data-src="holder.js/100%x100%" style="height: 100%; width: 100%; display: block;" src="users/<?php echo $userConnected->photo;?>" data-holder-rendered="true">
                </div>
                <div style="max-width: 200px; max-height: 150px; line-height: 10px;" class="fileinput-preview fileinput-exists thumbnail"></div>
                <div>
                  <span class="btn btn-default btn-file"><span class="fileinput-new"><?php echo __('Select image');?></span> <span class="fileinput-exists">Change</span> 
                    <input type="hidden"><input type="file" name="photo">
                  </span> 
                  <a data-dismiss="fileinput" class="btn btn-default fileinput-exists" href="#"><?php echo __('Remove');?></a> 
                </div>
              </div>
        	</div>
    		
            <div class="col-md-9">
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
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="tel" id="tel" value="<?php echo $userConnected->tel;?>" placeholder="<?php echo __('Phone');?>">
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="portable" id="portable" value="<?php echo $userConnected->portable;?>" placeholder="<?php echo __('Mobile phone');?>">
                    </div>
                </div>
                
			</div>
        
        
        
        </div>
        
        <input type="text" class="form-control" name="adresse_1" id="adresse_1" value="<?php echo $userConnected->adresse_1;?>" placeholder="<?php echo __('Address 1');?>">
        <input type="text" class="form-control" name="adresse_2" id="adresse_2" value="<?php echo $userConnected->adresse_2;?>" placeholder="<?php echo __('Address 2');?>">
        <div class="row">
            <div class="col-md-6">
                <input type="text" class="form-control" name="cp" id="cp" value="<?php echo $userConnected->codepostal;?>" placeholder="<?php echo __('PO Box');?>">
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control" name="ville" id="ville" value="<?php echo $userConnected->ville;?>" placeholder="<?php echo __('Town');?>">
            </div>
        </div>
        
        <input type="submit" class="btn btn-success" value="<?php echo __('Sauver');?>" />
        
        </form>

</div>
        	
</div>	
</div>		

<?php require_once (dirname(__FILE__).'/template/footer.php');?>
