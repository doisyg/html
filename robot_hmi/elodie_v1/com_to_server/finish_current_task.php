<?php 
require_once ('../../../config/initSite.php');
require_once ('../config/config.php');

if (!isset($_SESSION['is_robot'])) die();

$taches = TacheQueue::GetTasks();
$currentTask = TacheQueue::GetCurrentTask();
$currentTask->tache = new Tache($currentTask->id_tache);

if (count($taches) == 1 && $currentTask->tache->action_fin == TacheAction::$FIN_Redo)
{
	// On se supprime pas et on refet la tache
	$currentTask->step = -1;
	$currentTask->progress = '';
	$currentTask->state = '';
	$currentTask->Save();
}
else
{
	if ($currentTask->id_tache_queue > 0)
		$currentTask->Supprimer();
}

$currentTask = TacheQueue::GetCurrentTask();    
if ($currentTask->id_tache_queue > 0)
{
	$currentTask->tache = new Tache($currentTask->id_tache);
	$currentTask->actions = $currentTask->tache->GetActions();
	
	echo json_encode($currentTask);
}
else
	echo json_encode('no_task');
