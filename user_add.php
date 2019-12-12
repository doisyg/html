<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = 'setup';
$sectionSousMenu = 'users';

if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'add')) { header('location:index.php?notallow=1'); exit; }


if (isset($_POST['nom']))
{
	$user = new User();
	$user->id_groupe_user = $_POST['id_groupe_user'];
	$user->id_lang = $_POST['id_lang'];
	$user->nom = $_POST['nom'];
	$user->prenom = $_POST['prenom'];
	$user->email = $_POST['email'];
	$user->pass = md5($_CONFIG['KEY'].$_POST['password']);
		
	$user->actif = 1;
	$user->deleted = 0;
	
	$user->api_key = User::GenerateAPIKey();
	$user->last_connection = '0000-00-00 00:00:00';
	
	$user->Save();
	
	$_POST['id_user'] = $user->id_user;
	
				
	header('location:user_edit.php?id_user='.$_POST['id_user'].'&ok=1');
}

$titre = __('Users management');

include ('template/header.php');

$user = new User();
?>

<div class="inner-wrapper">

	<?php include ('template/gauche.php');?>


<section role="main" class="content-body">
    <header class="page-header">
        <h2><?php echo $titre;?></h2>
    
        <div class="right-wrapper pull-right">
            <ol class="breadcrumbs" style="margin-right:20px;">
                <li>
                    <a href="index.php">
                        <i class="fa fa-home"></i>
                    </a>
                </li>
                <li><span><?php echo $titre;?></span></li>
            </ol>
    
            <!--<a class="sidebar-right-toggle" data-open="sidebar-right"><i class="fa fa-chevron-left"></i></a>-->
        </div>
    </header>

	<?php include ('template/alertes.php');?>

    <!-- start: page -->
    <div class="row">
        <div class="col-md-12">
            <div class="row">
                <div class="panel-body">
                <form method="post" class="form-horizontal">
    
                    <div class="col-md-6">
                    <fieldset>
                        <legend><?php echo __('Connexion');?></legend>
                        <div class="fieldset">
                            <div class="form-group">
                                <div class="col-md-3"></div>
                                <div class="col-md-6">
                                    <input type="hidden" name="id_lang" id="id_lang" value="<?php echo $user->id_lang;?>" />
                                    <ul id="choix_lang">
                                    <?php
                                    $langues = Lang::GetLangs();
                                    foreach ($langues as $lang)
                                    {
                                        ?><li><a href="#" class="bChoixLangue <?php echo ($user->id_lang == $lang->id_lang)?'actif':'';?>" data-id_lang="<?php echo $lang->id_lang;?>"><img src="<?php echo $_CONFIG['URL'];?>assets/images/lang/<?php echo $lang->iso;?>.jpg" /></a></li><?php
                                    }
                                    ?>
                                    </ul>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="nom" class="control-label col-md-3"><?php echo __('Nom');?></label>
                                <div class="col-md-6"><input type="text" name="nom" value="<?php echo $user->nom;?>" class="form-control" /></div>
                            </div>
                            <div class="form-group">
                                <label for="prenom" class="control-label col-md-3"><?php echo __('Prénom');?></label>
                                <div class="col-md-6"><input type="text" name="prenom" value="<?php echo $user->prenom;?>" class="form-control" /></div>
                            </div>
                            <div class="form-group">
                                <label for="email" class="control-label col-md-3"><?php echo __('Email');?></label>
                                <div class="col-md-6"><input type="text" name="email" value="<?php echo $user->email;?>" class="form-control" /></div>
                            </div>
                            <div class="form-group">
                                <label for="password" class="control-label col-md-3"><?php echo __('Mot de passe');?></label>
                                <div class="col-md-6"><input type="password" name="password" value="" class="form-control" /></div>
                            </div>
                            <div class="form-group">
                                <label for="id_groupe_user" class="control-label col-md-3"><?php echo __('Groupe');?></label>
                                <div class="col-md-6"><select name="id_groupe_user" class="form-control">
                                <?php
                                $groupes = GroupeUser::GetGroupeUsers('nom', 'ASC');
                                foreach($groupes as $groupe)
                                {
									if ($currentUser->id_groupe_user != 1 && $groupe->id_groupe_user == 1) continue;
                                   	?><option value="<?php echo $groupe->id_groupe_user;?>"><?php echo $groupe->nom;?></option><?php
                                }?>
                                </select></div>
                            </div>
                        </div>
                    </fieldset>
                    </div>
                    
                          
                          <div style="clear:both; height:30px;"></div>  
                            
                        <input type="submit" value="<?php echo __('Sauver');?>" class="btn btn-success btn-lg btn-grad" />
                        
                        <a href="users.php" class="btn btn-warning btn-lg btn-grad"><?php echo __('Annuler');?></a>
                                
                               
                    </form>
                	</div>
            </div>
        </div>
    </div>
    <!-- end: page -->
</section>

</div>		

</section>

<?php 
include ('template/footer.php');
?>
<script>
$(document).ready(function(e) {
	$('.bChoixLangue').click(function(e) {
		e.preventDefault();
		id = $(this).data('id_lang');
		$('#id_lang').val(id);
		$('.bChoixLangue').removeClass('actif');
		$(this).addClass('actif');
	});
});
</script>