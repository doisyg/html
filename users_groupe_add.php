<?php 
require_once ('./config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = 'setup';
$sectionSousMenu = 'user_groups';

if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'view')) header('location:index.php?notallow=1');

if (isset($_POST['nom']))
{
	$groupe = new GroupeUser();
	$groupe->nom = $_POST['nom'];
	$groupe->Save();
	
	$groupe->ViderDroits();
	
	$droit = new Droit();
	$droits = Droit::GetDroits();
	foreach ($droits as $droit)
	{
		if ($_POST['can_do_'.$droit->section.'_'.$droit->sous_section.'_'.$droit->action]==1) $groupe->AddCanDo($droit->id_droit);
	}
	
	header('location:users_groupe_edit.php?id_groupe_user='.$groupe->id_groupe_user.'&ok=1');
}

$titre = __('Groups management');

include ('template/header.php');

$groupe = new GroupeUser();
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
                    <div class="col-md-6" style="float:none;">
                        <div class="form-group">
                            <label for="nom" class="control-label col-md-3"><?php echo __('Nom');?></label>
                            <div class="col-md-6"><input type="text" name="nom" value="" class="form-control" /></div>
                        </div>
                    </div>
                       
                       
                       
                       <a href="javascript:ToutCocher();" class="button"><?php echo __('Tout cocher');?></a> - <a href="javascript:ToutDecocher();" class="button"><?php echo __('Tout décocher');?></a>
                        <table border="0" cellpadding="0" cellspacing="0" id="product-table" style="width:auto;" class="table table-bordered table-hover table-striped table-wrapped">
                        <tr>
                            <th class="table-header-repeat line-left minwidth-1"><?php echo __('Section');?></th>
                            <th class="table-header-repeat line-left minwidth-1"><?php echo __('Sous section');?></th>
                            <th class="table-header-options line-left"><?php echo __('Actions');?></th>
                        </tr>
                        <?php $i=0;?>
                        
                        <?php ?>
                
                        <?php
                        
                        $sections = Droit::GetSectionAndSousSection();
                        
                        foreach ($sections as $section => $sous_sections)
                        {
                            if (count($sous_sections)==0) // Pas de sous sction
                            {
                                ?>
                                <tr <?php if ($i%2==0) {?>class="alternate-row"<?php }?>>
                                    <td><?php echo ucfirst(str_replace('_', ' / ', $page['section']));?></td>
                                    <td></td>
                                    <td class="options-width">
                                    <input type="hidden" class="hiddenDroit" name="can_do_<?php echo $section;?>__view" id="can_do_<?php echo $section;?>__view" value="0" />
                                    <input type="hidden" class="hiddenDroit" name="can_do_<?php echo $section;?>__add" id="can_do_<?php echo $section;?>__add" value="0" />
                                    <input type="hidden" class="hiddenDroit" name="can_do_<?php echo $section;?>__edit" id="can_do_<?php echo $section;?>__edit" value="0" />
                                    <input type="hidden" class="hiddenDroit" name="can_do_<?php echo $section;?>__delete" id="can_do_<?php echo $section;?>__delete" value="0" />
                                    <a href="javascript:;" id="<?php echo $section;?>__view" title="<?php echo __('Consulter');?>" class="btn btn-sm icon_cando view btn-danger"><i class="fa fa-eye"></i></a>
                                    <a href="javascript:;" id="<?php echo $section;?>__add" title="<?php echo __('Ajouter');?>" class="btn btn-sm icon_cando add btn-danger"><i class="fa fa-plus"></i></a>
                                    <a href="javascript:;" id="<?php echo $section;?>__edit" title="<?php echo __('Modifier');?>" class="btn btn-sm icon_cando edit btn-danger"><i class="fa fa-pencil"></i></a>
                                    <a href="javascript:;" id="<?php echo $section;?>__delete" title="<?php echo __('Supprimer');?>" class="btn btn-sm icon_cando delete btn-danger"><i class="fa fa-times"></i></a>
                                    </td>
                                </tr>
                                <?php
                                $i++;
                            }
                            else
                            {
                                foreach($sous_sections as $sous_sections)
                                {
                                    ?>
                                    <tr <?php if ($i%2==0) {?>class="alternate-row"<?php }?>>
                                        <td><?php echo ucfirst(str_replace('_', ' / ', $section));?></td>
                                        <td><?php echo ucfirst($sous_sections);?></td>
                                        <td class="options-width">
                                        <input type="hidden" class="hiddenDroit" name="can_do_<?php echo $section;?>_<?php echo $sous_sections;?>_view" id="can_do_<?php echo $section;?>_<?php echo $sous_sections;?>_view" value="0" />
                                        <input type="hidden" class="hiddenDroit" name="can_do_<?php echo $section;?>_<?php echo $sous_sections;?>_add" id="can_do_<?php echo $section;?>_<?php echo $sous_sections;?>_add" value="0" />
                                        <input type="hidden" class="hiddenDroit" name="can_do_<?php echo $section;?>_<?php echo $sous_sections;?>_edit" id="can_do_<?php echo $section;?>_<?php echo $sous_sections;?>_edit" value="0" />
                                        <input type="hidden" class="hiddenDroit" name="can_do_<?php echo $section;?>_<?php echo $sous_sections;?>_delete" id="can_do_<?php echo $section;?>_<?php echo $sous_sections;?>_delete" value="0" />
                                        <a href="javascript:;" id="<?php echo $section;?>_<?php echo $sous_sections;?>_view" title="<?php echo __('Consulter');?>" class="btn btn-sm icon_cando view btn-danger"><i class="fa fa-eye"></i></a>
                                        <a href="javascript:;" id="<?php echo $section;?>_<?php echo $sous_sections;?>_add" title="<?php echo __('Ajouter');?>" class="btn btn-sm icon_cando add btn-danger"><i class="fa fa-plus"></i></a>
                                        <a href="javascript:;" id="<?php echo $section;?>_<?php echo $sous_sections;?>_edit" title="<?php echo __('Modifier');?>" class="btn btn-sm icon_cando edit btn-danger"><i class="fa fa-pencil"></i></a>
                                        <a href="javascript:;" id="<?php echo $section;?>_<?php echo $sous_sections;?>_delete" title="<?php echo __('Supprimer');?>" class="btn btn-sm icon_cando delete btn-danger"><i class="fa fa-times"></i></a>
                                        </td>
                                    </tr>
                                    <?php
                                    $i++;
                                }
                            }
                            
                        }
                        ?>
                        
                        </table>
                            
                        <input type="submit" value="<?php echo __('Sauver');?>" class="btn btn-success btn-lg btn-grad" />
                        
                        <a href="users_groupes.php" class="btn btn-warning btn-lg btn-grad"><?php echo __('Annuler');?></a>
                                
                               
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
    $('.icon_cando').click(function(e) {
        id = $(this).attr('id');
		
		v = $('#can_do_'+id).val();
		v++;
		v=v%2;
		$('#can_do_'+id).val(v);
		
		$(this).removeClass('btn-success');
		$(this).removeClass('btn-danger');
		if (v==0)
			$(this).addClass('btn-danger');
		else
			$(this).addClass('btn-success');
    });
});

function ToutCocher()
{
	$('.hiddenDroit').val(1);
	$('.icon_cando').removeClass('btn-danger');
	$('.icon_cando').addClass('btn-success');
}

function ToutDecocher()
{
	$('.hiddenDroit').val(0);
	$('.icon_cando').removeClass('btn-success');
	$('.icon_cando').addClass('btn-danger');
}
</script>