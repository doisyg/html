<?php 
require_once ('../../../config/initSite.php');
require_once ('../config/config.php');

if (!isset($_SESSION['is_robot'])) die();

$task = new TacheQueue($_POST['id_tache_queue']);
$task->step = $_POST['step'];
$task->state = $_POST['state'];
$task->progress = $_POST['progress'];
$task->Save();