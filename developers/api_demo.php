<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_developer"])) { header("location:login.php"); }

$sectionMenu = "api_demo";

$hideColonneDroite = true;
require_once (dirname(__FILE__).'/template/header.php');

?>
<div class="col-md-6" style="padding:40px;">
    <div class="row call-panel" style="padding:40px;">
        <div class="panel-content">
            <h3><i class="fa fa-android" aria-hidden="true"></i> <?php echo __('Demo on robot');?></h3>
            <hr>
            
            <table class="table">
            	<thead>
                	<tr>
                        <th><?php echo __('ID Robot');?></th>
                        <th><?php echo __('Company');?></th>
                        <th><?php echo __('Open these pages on the robot');?></th>
                    </tr>
                </thead>
                <tbody>
                	<?php
					$id_robots = $userConnected->GetIdsRobot();
					foreach($id_robots as $id)
					{
						$r = new Robot($id);
						?>
						<tr>
							<th><?php echo $r->id_robot;?></th>
							<td><?php echo $r->company;?></td>
							<td><a href="./demo/robot.php?id_robot=<?php echo $r->id_robot;?>" target="_blank" class="btn btn-primary"><?php echo __('Demo');?></a></td>
						</tr>
						<?php
					}
					?>
                </tbody>
            </table>
            
            <div style="clear:both;"></div>
    	</div>
    </div>	
</div>		

<div class="col-md-6" style="padding:40px;">
    <div class="row call-panel" style="padding:40px;">
        <div class="panel-content">
            <h3><i class="fa fa-desktop" aria-hidden="true"></i> <?php echo __('Demo on PC');?></h3>
            <hr>
            <table class="table">
            	<thead>
                	<tr>
                        <th><?php echo __('ID Robot');?></th>
                        <th><?php echo __('Company');?></th>
                        <th><?php echo __('Open these pages on an comupteur');?></th>
                    </tr>
                </thead>
                <tbody>
                	<?php
					$id_robots = $userConnected->GetIdsRobot();
					foreach($id_robots as $id)
					{
						$r = new Robot($id);
						?>
						<tr>
							<th><?php echo $r->id_robot;?></th>
							<td><?php echo $r->company;?></td>
							<td><a href="./demo/operateur.php?id_robot=<?php echo $r->id_robot;?>" target="_blank" class="btn btn-primary"><?php echo __('Demo');?></a></td>
						</tr>
						<?php
					}
					?>
                </tbody>
            </table>
            <div style="clear:both;"></div>
    	</div>
    </div>	
</div>		

<?php require_once (dirname(__FILE__).'/template/footer.php');?>
<script>
jQuery(document).ready(function() {
	
    $('#topics-table').dataTable({
		"aoColumnDefs": [ 
			{ "bSortable": false, "aTargets": [ 4 ] }
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
	
});
</script>
