<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_developer"])) { header("location:login.php"); }
if ($userConnected->id_groupe_user != 1) { header("location:index.php"); }

if (isset($_POST['id_user']))
{
	ApiTopicUser::ClearUser($_POST['id_user']);
	ApiTopicPubUser::ClearUser($_POST['id_user']);
	ApiServiceUser::ClearUser($_POST['id_user']);
	ApiActionUser::ClearUser($_POST['id_user']);
	
	$topics = ApiTopic::GetApiTopics('groupe, nom', 'ASC');
	foreach($topics as $topic)
	{
		if (isset($_POST['topic_'.$topic->id_topic]) && $_POST['topic_'.$topic->id_topic] == '1')
		{
			$ut = new ApiTopicUser();
			$ut->id_user = $_POST['id_user'];
			$ut->id_topic = $topic->id_topic;
			$ut->Save();
		}
	}
	$topic_pubs = ApiTopicPub::GetApiTopicPubs('groupe, nom', 'ASC');
	foreach($topic_pubs as $topic_pub)
	{
		if (isset($_POST['topic_pub_'.$topic_pub->id_topic_pub]) && $_POST['topic_pub_'.$topic_pub->id_topic_pub] == '1')
		{
			$utc = new ApiTopicPubUser();
			$utc->id_user = $_POST['id_user'];
			$utc->id_topic_pub = $topic_pub->id_topic_pub;
			$utc->Save();
		}
	}
	$services = ApiService::GetApiServices('groupe, nom', 'ASC');
	foreach($services as $service)
	{
		if (isset($_POST['service_'.$service->id_service]) && $_POST['service_'.$service->id_service] == '1')
		{
			$us = new ApiServiceUser();
			$us->id_user = $_POST['id_user'];
			$us->id_service = $service->id_service;
			$us->Save();
		}
	}
	$actions = ApiAction::GetApiActions('groupe, nom', 'ASC');
	foreach($actions as $action)
	{
		if (isset($_POST['action_'.$action->id_action]) && $_POST['action_'.$action->id_action] == '1')
		{
			$us = new ApiActionUser();
			$us->id_user = $_POST['id_user'];
			$us->id_action = $action->id_action;
			$us->Save();
		}
	}
	
	header('location:user_configuration.php?id_user='.$_POST['id_user']);
}

$sectionMenu = "users_configuration";

$hideColonneDroite = true;
require_once (dirname(__FILE__).'/template/header.php');

$user = new User($_GET['id_user']);

$topics = ApiTopic::GetApiTopics('groupe, nom', 'ASC');
$topic_pubs = ApiTopicPub::GetApiTopicPubs('groupe, nom', 'ASC');
$services = ApiService::GetApiServices('groupe, nom', 'ASC');
$actions = ApiAction::GetApiActions('groupe, nom', 'ASC');
$services_by_id = array();
foreach($services as $service)
	$services_by_id[$service->id_service] = $service;
	
$user_topic_ids = $user->GetApiTopicIds();
$user_topic_pub_ids = $user->GetApiTopicPubIds();
$user_service_ids = $user->GetApiServiceIds();
$user_action_ids = $user->GetApiActionIds();
?>
<div class="col-md-12">
    <div class="row call-panel">
    
        <div class="panel-content">
        
        	<form method="post">
               	<input type="hidden" name="id_user" value="<?php echo $_GET['id_user'];?>" />
        
            <div class="col-md-12">
            	<div style="float:right;"><a id="bTopicToutCocher" href="#"><?php echo __('Tout cocher');?></a> <a id="bTopicToutDecocher" href="#"><?php echo __('Tout décocher');?></a></div>
                <h3><i class="fa fa-user" aria-hidden="true"></i> <?php echo __('Topics');?></h3>
                <hr>
                
                <table id="topics-table" class="table">
                    <thead>
                        <tr>
                            <th>Groupe</th>
                            <th>Nom</th>
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
                                <td><?php echo $topic->event_name;?></td>
                                <td><?php echo $topic->publish_name;?></td>
                                <td><?php echo isset($services_by_id[$topic->id_service_update])?$services_by_id[$topic->id_service_update]->nom:'';?></td>
                                <td>
                                    <input type="hidden" id="topic_<?php echo $topic->id_topic;?>" name="topic_<?php echo $topic->id_topic;?>" value="<?php echo isset($user_topic_ids[$topic->id_topic])?'1':'0';?>" />
                                    <a href="#topic_<?php echo $topic->id_topic;?>" class="btn <?php echo isset($user_topic_ids[$topic->id_topic])?'btn-success':'btn-danger';?> btn-sm btn-circle btn-grad btn-check"><i class="fa <?php echo isset($user_topic_ids[$topic->id_topic])?'fa-check':'fa-times';?>"></i></a>
                                </td>
                            </tr>
                            <?php
                        }
                        ?>
                    </tbody>
                </table>
                
            </div>
            <div class="col-md-12">
            	<div style="float:right;"><a id="bTopicPubToutCocher" href="#"><?php echo __('Tout cocher');?></a> <a id="bTopicPubToutDecocher" href="#"><?php echo __('Tout décocher');?></a></div>
                <h3><i class="fa fa-user" aria-hidden="true"></i> <?php echo __('Topic publishers');?></h3>
                <hr>
                <table id="topic_pubs-table" class="table">
                    <thead>
                        <tr>
                            <th>Groupe</th>
                            <th>Nom</th>
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
                                <td><?php echo $topic_pub->function_name;?></td>
                                <td><?php echo nl2br($topic_pub->details);?></td>
                                <td>
                                    <input type="hidden" id="topic_pub_<?php echo $topic_pub->id_topic_pub;?>" name="topic_pub_<?php echo $topic_pub->id_topic_pub;?>" value="<?php echo isset($user_topic_pub_ids[$topic_pub->id_topic_pub])?'1':'0';?>" />
                                    <a href="#topic_pub_<?php echo $topic_pub->id_topic_pub;?>" class="btn <?php echo isset($user_topic_pub_ids[$topic_pub->id_topic_pub])?'btn-success':'btn-danger';?> btn-sm btn-circle btn-grad btn-check"><i class="fa <?php echo isset($user_topic_pub_ids[$topic_pub->id_topic_pub])?'fa-check':'fa-times';?>"></i></a>
                                </td>
                            </tr>
                            <?php
                        }
                        ?>
                    </tbody>
                </table>
            </div>
            <div class="col-md-12">
            	<div style="float:right;"><a id="bServiceToutCocher" href="#"><?php echo __('Tout cocher');?></a> <a id="bServiceToutDecocher" href="#"><?php echo __('Tout décocher');?></a></div>
                <h3><i class="fa fa-user" aria-hidden="true"></i> <?php echo __('Services');?></h3>
                <hr>
                <table id="services-table" class="table">
                    <thead>
                        <tr>
                            <th>Groupe</th>
                            <th>Nom</th>
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
                                <td><?php echo $service->function_name;?></td>
                                <td><?php echo nl2br($service->details);?></td>
                                <td>
                                    <input type="hidden" id="service_<?php echo $service->id_service;?>" name="service_<?php echo $service->id_service;?>" value="<?php echo isset($user_service_ids[$service->id_service])?'1':'0';?>" />
                                    <a href="#service_<?php echo $service->id_service;?>" class="btn <?php echo isset($user_service_ids[$service->id_service])?'btn-success':'btn-danger';?> btn-sm btn-circle btn-grad btn-check"><i class="fa <?php echo isset($user_service_ids[$service->id_service])?'fa-check':'fa-times';?>"></i></a>
                                </td>
                            </tr>
                            <?php
                        }
                        ?>
                    </tbody>
                </table>
            </div>
            <div class="col-md-12">
            	<div style="float:right;"><a id="bActionToutCocher" href="#"><?php echo __('Tout cocher');?></a> <a id="bActionToutDecocher" href="#"><?php echo __('Tout décocher');?></a></div>
                <h3><i class="fa fa-user" aria-hidden="true"></i> <?php echo __('Actions');?></h3>
                <hr>
                <table id="actions-table" class="table">
                    <thead>
                        <tr>
                            <th>Groupe</th>
                            <th>Nom</th>
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
                                <td><?php echo $action->function_name;?></td>
                                <td><?php echo nl2br($action->details);?></td>
                                <td>
                                    <input type="hidden" id="action_<?php echo $action->id_action;?>" name="action_<?php echo $action->id_action;?>" value="<?php echo isset($user_action_ids[$action->id_action])?'1':'0';?>" />
                                    <a href="#action_<?php echo $action->id_action;?>" class="btn <?php echo isset($user_action_ids[$action->id_action])?'btn-success':'btn-danger';?> btn-sm btn-circle btn-grad btn-check"><i class="fa <?php echo isset($user_action_ids[$action->id_action])?'fa-check':'fa-times';?>"></i></a>
                                </td>
                            </tr>
                            <?php
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        
        	<input type="submit" value="Sauver" class="btn btn-success btn-lg" />
        	
            </form>
        
        </div>
                
    </div>	
</div>		

<?php require_once (dirname(__FILE__).'/template/footer.php');?>
<script>
jQuery(document).ready(function() {
	
	$('#bTopicToutCocher').click(function(e) {
        e.preventDefault();
		$('#topics-table input').val(1);
		$('#topics-table a').removeClass('btn-danger');
		$('#topics-table a').addClass('btn-success');
		$('#topics-table a i').removeClass('fa-times');
		$('#topics-table a i').addClass('fa-check');
	});
	$('#bTopicToutDecocher').click(function(e) {
        e.preventDefault();
		$('#topics-table input').val(0);
		$('#topics-table a').addClass('btn-danger');
		$('#topics-table a').removeClass('btn-success');
		$('#topics-table a i').addClass('fa-times');
		$('#topics-table a i').removeClass('fa-check');
	});
	$('#bTopicPubToutCocher').click(function(e) {
        e.preventDefault();
		$('#topic_pubs-table input').val(1);
		$('#topic_pubs-table a').removeClass('btn-danger');
		$('#topic_pubs-table a').addClass('btn-success');
		$('#topic_pubs-table a i').removeClass('fa-times');
		$('#topic_pubs-table a i').addClass('fa-check');
	});
	$('#bTopicPubToutDecocher').click(function(e) {
        e.preventDefault();
		$('#topic_pubs-table input').val(0);
		$('#topic_pubs-table a').addClass('btn-danger');
		$('#topic_pubs-table a').removeClass('btn-success');
		$('#topic_pubs-table a i').addClass('fa-times');
		$('#topic_pubs-table a i').removeClass('fa-check');
	});
	$('#bServiceToutCocher').click(function(e) {
        e.preventDefault();
		$('#services-table input').val(1);
		$('#services-table a').removeClass('btn-danger');
		$('#services-table a').addClass('btn-success');
		$('#services-table a i').removeClass('fa-times');
		$('#services-table a i').addClass('fa-check');
	});
	$('#bServiceToutDecocher').click(function(e) {
        e.preventDefault();
		$('#services-table input').val(0);
		$('#services-table a').addClass('btn-danger');
		$('#services-table a').removeClass('btn-success');
		$('#services-table a i').addClass('fa-times');
		$('#services-table a i').removeClass('fa-check');
	});
	$('#bActionToutCocher').click(function(e) {
        e.preventDefault();
		$('#actions-table input').val(1);
		$('#actions-table a').removeClass('btn-danger');
		$('#actions-table a').addClass('btn-success');
		$('#actions-table a i').removeClass('fa-times');
		$('#actions-table a i').addClass('fa-check');
	});
	$('#bActionToutDecocher').click(function(e) {
        e.preventDefault();
		$('#actions-table input').val(0);
		$('#actions-table a').addClass('btn-danger');
		$('#actions-table a').removeClass('btn-success');
		$('#actions-table a i').addClass('fa-times');
		$('#actions-table a i').removeClass('fa-check');
	});
	
	$('.btn-check').click(function(e) {
        e.preventDefault();
		
		v = $($(this).attr('href')).val();
		v++;
		v%=2;
		$($(this).attr('href')).val(v);
		if (v == 1)
		{
			$(this).removeClass('btn-danger');
			$(this).addClass('btn-success');
			$(this).children('i').removeClass('fa-times');
			$(this).children('i').addClass('fa-check');
		}
		else
		{
			$(this).addClass('btn-danger');
			$(this).removeClass('btn-success');
			$(this).children('i').addClass('fa-times');
			$(this).children('i').removeClass('fa-check');
		}
    });
	
    $('#admin-table').dataTable({
		"aoColumnDefs": [ 
			{ "bSortable": false, "aTargets": [ 4 ] }
		],
		 paging: false,
		 searching: false
    });
	
    $('#topics-table').dataTable({
		"aoColumnDefs": [ 
			{ "bSortable": false, "aTargets": [ 5 ] }
		],
		 paging: false,
		 searching: false
    });
	$('#topic_pubs-table').dataTable({
		"aoColumnDefs": [ 
			{ "bSortable": false, "aTargets": [ 4 ] }
		],
		 paging: false,
		 searching: false
    });
	$('#services-table').dataTable({
		"aoColumnDefs": [ 
			{ "bSortable": false, "aTargets": [ 4 ] }
		],
		 paging: false,
		 searching: false
    });
	$('#actions-table').dataTable({
		"aoColumnDefs": [ 
			{ "bSortable": false, "aTargets": [ 4 ] }
		],
		 paging: false,
		 searching: false
    });
	
});
</script>
