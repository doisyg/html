<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_developer"])) { header("location:login.php"); }
if ($userConnected->id_groupe_user != 1) { header("location:index.php"); }

$sectionMenu = "users_configuration";

$hideColonneDroite = true;
require_once (dirname(__FILE__).'/template/header.php');

$users = User::GetUsers();
?>
<div class="col-md-12">
    <div class="row call-panel">
    
        <div class="panel-content">
        
            <div class="col-md-12">
                <table border="0" width="100%" cellpadding="0" cellspacing="0" id="admin-table" class="table table-bordered table-condensed table-hover table-striped table-wrapped">
                <thead>
                    <tr>
                        <th class="table-header-repeat line-left minwidth-1"><?php echo __('Nom');?></th>
                        <th class="table-header-repeat line-left"><?php echo __('Prénom');?></th>
                        <th class="table-header-repeat line-left"><?php echo __('Email');?></th>
                        <th class="table-header-repeat line-left"><?php echo __('Groupe');?></th>
                        <th class="table-header-options line-left"><?php echo __('Options');?></th>
                    </tr>
                </thead>
                <tbody>
                <?php
                $i=0;
                
                $groupes = array();
                    
                foreach ($users as $user)
                {
                    $i++;
                    
                    if (!isset($groupes[$user->id_groupe_user])) $groupes[$user->id_groupe_user] = new GroupeUser($user->id_groupe_user);
                    
                    ?>
                    <tr <?php if ($i%2==0) {?>class="alternate-row"<?php }?>>
                        <td><?php echo $user->nom;?></td>
                        <td><?php echo $user->prenom;?></td>
                        <td><a href="mailto:<?php echo $user->email;?>"><?php echo $user->email;?></a></td>
                        <td><?php echo $groupes[$user->id_groupe_user]->nom;?></td>
                        <td style="text-align:center;"><a href="user_configuration.php?id_user=<?php echo $user->id_user;?>" title="<?php echo __('Modifier');?>" class="btn btn-success btn-sm btn-circle btn-grad" style="margin-right:10px;"><i class="fa fa-pencil "></i></a></td>
                    </tr>
                    <?php
                }
                ?>
                </tbody>
                </table>
        
        </div>
                
    </div>	
</div>		

<?php require_once (dirname(__FILE__).'/template/footer.php');?>
<script>
jQuery(document).ready(function() {
	
    $('#admin-table').dataTable({
		"aoColumnDefs": [ 
			{ "bSortable": false, "aTargets": [ 4 ] }
		],
		 paging: false,
		 searching: false
    });
	
});
</script>
