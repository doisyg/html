<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }


$currentTaskQ = TacheQueue::GetCurrentTask();
if ($currentTaskQ->id_tache_queue > 0)
	$currentTache = new Tache($currentTaskQ->id_tache);
$current = '
	<section class="panel panel-featured-left panel-featured-tertiary">
		<div class="panel-body">
			<div class="widget-summary">
				<div class="widget-summary-col widget-summary-col-icon">
					';
					
					if (isset($currentTache))
					{
						if ($currentTaskQ->state == 'in_progress')
						{
							$current .= '<a href="#" class="summary-icon bg-tertiary" style="color:#FFFFFF; display:block;"><i class="fa fa-pause"></i></a>';
						}
						else
						{
							$current .= '<a href="#" class="summary-icon bg-tertiary" style="color:#FFFFFF; display:block;"><i class="fa fa-play"></i></a>';
						}
					}
$current .= '		
				</div>
				<div class="widget-summary-col">
					<div class="summary">
						<h4 class="title">'.__('Current task').'</h4>
						<div class="info">
							<strong class="amount" style="font-size:1.8rem;">'.(isset($currentTache)?$currentTache->name:__('No task currently')).'</strong><br />
							'.(isset($currentTache)?$currentTaskQ->progress:'').'
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
';

$list_taches = '';
		$taches = TacheQueue::GetTasks();
		foreach($taches as $tache)
		{
			$t = new Tache($tache->id_tache);
			$list_taches .= '
		<li>
			<div class="">'.$t->name.'</div>
			<div class="todo-actions"><a href="tasks_queue.php?delete='.$tache->id_tache_queue.'"><i class="fa fa-times"></i></a></div>
		</li>
			';
		}
		
echo json_encode(array('current'=>$current, 'list_taches'=>$list_taches));

?>