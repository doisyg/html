<?php
require_once('../config/initSite.php');

$droits = array();
$droits['tasks'] = 1;
$droits['maps'] = 1;
$droits['setup'] = array();
$droits['setup']['robot'] = 1;
$droits['setup']['sites'] = 1;
$droits['setup']['users'] = 1;
$droits['setup']['user_groups'] = 1;
$droits['setup']['export'] = 1;
$droits['setup']['configuration'] = 1;
$droits['traduction'] = 1;

foreach($droits as $droit => $sous)
{
	if (is_array($sous))
	{
		foreach($sous as $s => $v)
		{
			$d = new Droit();	$d->section = $droit; $d->sous_section = $s; $d->action = 'view'; $d->Save();
			$g = new GroupeDroit(); $g->id_groupe_user = 1; $g->id_droit = $d->id_droit; $g->Save();
			$d = new Droit();	$d->section = $droit; $d->sous_section = $s; $d->action = 'add'; $d->Save();
			$g = new GroupeDroit(); $g->id_groupe_user = 1; $g->id_droit = $d->id_droit; $g->Save();
			$d = new Droit();	$d->section = $droit; $d->sous_section = $s; $d->action = 'edit'; $d->Save();
			$g = new GroupeDroit(); $g->id_groupe_user = 1; $g->id_droit = $d->id_droit; $g->Save();
			$d = new Droit();	$d->section = $droit; $d->sous_section = $s; $d->action = 'delete'; $d->Save();
			$g = new GroupeDroit(); $g->id_groupe_user = 1; $g->id_droit = $d->id_droit; $g->Save();
		}
	}
	else
	{
		$d = new Droit();	$d->section = $droit; $d->action = 'view'; $d->Save();
		$g = new GroupeDroit(); $g->id_groupe_user = 1; $g->id_droit = $d->id_droit; $g->Save();
		$d = new Droit();	$d->section = $droit; $d->action = 'add'; $d->Save();
		$g = new GroupeDroit(); $g->id_groupe_user = 1; $g->id_droit = $d->id_droit; $g->Save();
		$d = new Droit();	$d->section = $droit; $d->action = 'edit'; $d->Save();
		$g = new GroupeDroit(); $g->id_groupe_user = 1; $g->id_droit = $d->id_droit; $g->Save();
		$d = new Droit();	$d->section = $droit; $d->action = 'delete'; $d->Save();
		$g = new GroupeDroit(); $g->id_groupe_user = 1; $g->id_droit = $d->id_droit; $g->Save();
	}
}

?>