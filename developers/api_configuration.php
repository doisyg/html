<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_developer"])) { header("location:login.php"); }
if ($userConnected->id_groupe_user != 1) { header("location:index.php"); }

$sectionMenu = "api_configuration";

if (isset($_GET['delete_topic']))
{
	$topic = new ApiTopic($_GET['delete_topic']);
	$topic->Supprimer();
}
if (isset($_GET['delete_topic_pub']))
{
	$topic_pub = new ApiTopicPub($_GET['delete_topic_pub']);
	$topic_pub->Supprimer();
}
if (isset($_GET['delete_service']))
{
	$service = new ApiService($_GET['delete_service']);
	$service->Supprimer();
}
if (isset($_GET['delete_action']))
{
	$action = new ApiAction($_GET['delete_action']);
	$action->Supprimer();
}

$hideColonneDroite = true;
require_once (dirname(__FILE__).'/template/header.php');

$topics = ApiTopic::GetApiTopics('groupe, nom', 'ASC');
$topic_pubs = ApiTopicPub::GetApiTopicPubs('groupe, nom', 'ASC');
$services = ApiService::GetApiServices('groupe, nom', 'ASC');
$actions = ApiAction::GetApiActions('groupe, nom', 'ASC');
$services_by_id = array();
foreach($services as $service)
	$services_by_id[$service->id_service] = $service;
?>
<script>
$(document).ready(function(e) {
    $('.updown').click(function(e) {
        e.preventDefault();
		
		if ($(this).children('i').hasClass('fa-caret-up'))
		{
			$(this).children('i').removeClass('fa-caret-up');
			$(this).children('i').addClass('fa-caret-down');
		}
		else
		{
			$(this).children('i').addClass('fa-caret-up');
			$(this).children('i').removeClass('fa-caret-down');
		}
		
		div = $(this).parent().parent().children('.divupdown');
		div.slideToggle();
    });
});
</script>
<div class="col-md-12">
    <div class="row call-panel">
    
        <div class="panel-content">
        
            <div class="col-md-12">
            	<a href="topic_add.php" class="btn btn-primary" style="float:right; margin-top:10px;">Add topic</a>
                <h3><i class="fa fa-user" aria-hidden="true"></i> <?php echo __('Topics');?> <a href="#" class="updown" style="color:#343434;"><i class="fa fa-caret-down"></i></a></h3>
                <hr>
                <div class="divupdown" style="display:none;">
                <table id="topics-table" class="table">
                    <thead>
                        <tr>
                            <th>Groupe</th>
                            <th>Nom</th>
                            <th>Message type</th>
                            <th>API event</th>
                            <th>API function</th>
                            <th>Update service</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        foreach($topics as $topic)
                        {
                            ?>
                            <tr>
                                <td><?php echo $topic->groupe;?></td>
                                <td><?php echo $topic->nom;?></td>
                                <td><?php echo $topic->messageType;?></td>
                                <td><?php echo $topic->event_name;?></td>
                                <td><?php echo $topic->publish_name;?></td>
                                <td><?php echo isset($services_by_id[$topic->id_service_update])?$services_by_id[$topic->id_service_update]->nom:'';?></td>
                                <td><a href="topic_edit.php?id_topic=<?php echo $topic->id_topic;?>" title="<?php echo __('Modifier');?>" class="btn btn-success btn-sm btn-circle btn-grad" style="margin-right:10px;"><i class="fa fa-pencil "></i></a>
                                <a href="api_configuration.php?delete_topic=<?php echo $topic->id_topic;?>" title="<?php echo __('Supprimer');?>" class="btn btn-danger btn-sm btn-circle btn-grad" style="margin-right:10px;"><i class="fa fa-times "></i></a>
                                </td>
                            </tr>
                            <?php
                        }
                        ?>
                    </tbody>
                </table>
                </div>
            </div>
            
            <div class="col-md-12">
            	<a href="topic_pub_add.php" class="btn btn-primary" style="float:right; margin-top:10px;">Add topic publisher</a>
                <h3><i class="fa fa-user" aria-hidden="true"></i> <?php echo __('Topic Publishers');?> <a href="#" class="updown" style="color:#343434;"><i class="fa fa-caret-down"></i></a></h3>
                <hr>
                <div class="divupdown" style="display:none;">
                <table id="topic_pubs-table" class="table">
                    <thead>
                        <tr>
                            <th>Groupe</th>
                            <th>Nom</th>
                            <th>Message type</th>
                            <th>API function</th>
                            <th>Details</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        foreach($topic_pubs as $topic_pub)
                        {
                            ?>
                            <tr>
                                <td><?php echo $topic_pub->groupe;?></td>
                                <td><?php echo $topic_pub->nom;?></td>
                                <td><?php echo $topic_pub->messageType;?></td>
                                <td><?php echo $topic_pub->function_name;?></td>
                                <td><?php echo nl2br($topic_pub->details);?></td>
                                <td><a href="topic_pub_edit.php?id_topic_pub=<?php echo $topic_pub->id_topic_pub;?>" title="<?php echo __('Modifier');?>" class="btn btn-success btn-sm btn-circle btn-grad" style="margin-right:10px;"><i class="fa fa-pencil "></i></a>
                                <a href="api_configuration.php?delete_topic_pub=<?php echo $topic_pub->id_topic_pub;?>" title="<?php echo __('Supprimer');?>" class="btn btn-danger btn-sm btn-circle btn-grad" style="margin-right:10px;"><i class="fa fa-times "></i></a></td>
                            </tr>
                            <?php
                        }
                        ?>
                    </tbody>
                </table>
                </div>
            </div>
            
            <div class="col-md-12">
            	<a href="service_add.php" class="btn btn-primary" style="float:right; margin-top:10px;">Add service</a>
                <h3><i class="fa fa-user" aria-hidden="true"></i> <?php echo __('Services');?> <a href="#" class="updown" style="color:#343434;"><i class="fa fa-caret-down"></i></a></h3>
                <hr>
                <div class="divupdown" style="display:none;">
                <table id="services-table" class="table">
                    <thead>
                        <tr>
                            <th>Groupe</th>
                            <th>Nom</th>
                            <th>Message type</th>
                            <th>API function</th>
                            <th>Details</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        foreach($services as $service)
                        {
                            ?>
                            <tr>
                                <td><?php echo $service->groupe;?></td>
                                <td><?php echo $service->nom;?></td>
                                <td><?php echo $service->messageType;?></td>
                                <td><?php echo $service->function_name;?></td>
                                <td><?php echo nl2br($service->details);?></td>
                                <td><a href="service_edit.php?id_service=<?php echo $service->id_service;?>" title="<?php echo __('Modifier');?>" class="btn btn-success btn-sm btn-circle btn-grad" style="margin-right:10px;"><i class="fa fa-pencil "></i></a>
                                <a href="api_configuration.php?delete_service=<?php echo $service->id_service;?>" title="<?php echo __('Supprimer');?>" class="btn btn-danger btn-sm btn-circle btn-grad" style="margin-right:10px;"><i class="fa fa-times "></i></a></td>
                            </tr>
                            <?php
                        }
                        ?>
                    </tbody>
                </table>
                </div>
            </div>
            
            
            <div class="col-md-12">
            	<a href="action_add.php" class="btn btn-primary" style="float:right; margin-top:10px;">Add action</a>
                <h3><i class="fa fa-user" aria-hidden="true"></i> <?php echo __('Actions');?> <a href="#" class="updown" style="color:#343434;"><i class="fa fa-caret-down"></i></a></h3>
                <hr>
                <div class="divupdown" style="display:none;">
                <table id="actions-table" class="table">
                    <thead>
                        <tr>
                            <th>Groupe</th>
                            <th>Nom</th>
                            <th>Message type</th>
                            <th>API function</th>
                            <th>Details</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        foreach($actions as $action)
                        {
                            ?>
                            <tr>
                                <td><?php echo $action->groupe;?></td>
                                <td><?php echo $action->nom;?></td>
                                <td><?php echo $action->messageType;?></td>
                                <td><?php echo $action->function_name;?></td>
                                <td><?php echo nl2br($action->details);?></td>
                                <td><a href="action_edit.php?id_action=<?php echo $action->id_action;?>" title="<?php echo __('Modifier');?>" class="btn btn-success btn-sm btn-circle btn-grad" style="margin-right:10px;"><i class="fa fa-pencil "></i></a>
                                <a href="api_configuration.php?delete_action=<?php echo $action->id_action;?>" title="<?php echo __('Supprimer');?>" class="btn btn-danger btn-sm btn-circle btn-grad" style="margin-right:10px;"><i class="fa fa-times "></i></a></td>
                            </tr>
                            <?php
                        }
                        ?>
                    </tbody>
                </table>
                </div>
            </div>
        
        </div>
                
    </div>	
</div>		

<?php require_once (dirname(__FILE__).'/template/footer.php');?>
<script>
jQuery(document).ready(function() {
	
    $('#topics-table').dataTable({
		"aoColumnDefs": [ 
			{ "bSortable": false, "aTargets": [ 6 ] }
		],
		 paging: false,
		 searching: false
    });
	$('#services-table').dataTable({
		"aoColumnDefs": [ 
			{ "bSortable": false, "aTargets": [ 5 ] }
		],
		 paging: false,
		 searching: false
    });
	$('#actions-table').dataTable({
		"aoColumnDefs": [ 
			{ "bSortable": false, "aTargets": [ 5 ] }
		],
		 paging: false,
		 searching: false
    });
	
});
</script>
