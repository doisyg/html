<?php
class ApiAction extends ApiActionCore
{
	public static function GetByFunctionName($event_name)
	{
		$query = "SELECT * FROM api_action WHERE function_name='".mysqli_real_escape_string(DB::$connexion, $event_name)."'";
		$result = mysqli_query(DB::$connexion, $query);
		if ($row = @mysqli_fetch_object( $result ) )
			$topic = new ApiAction($row, true);
		else
			$topic = new ApiAction();
		@mysqli_free_result( $result );
		return $topic;
	}
	
	public function GetParams()
	{
		$t = explode('---', html_entity_decode($this->details, ENT_QUOTES));
		$params_entree_brut = array();
		if (isset($t[0]) && $t[0] != '')	$params_entree_brut = explode("\n", trim($t[0], " \n\r\t"));
		
		$params_sortie_brut = array();
		if (isset($t[1]) && $t[1] != '')	$params_sortie_brut = explode("\n", trim($t[1], " \n\r\t"));
		
		$params_feedback_brut = array();
		if (isset($t[2]) && $t[2] != '')	$params_feedback_brut = explode("\n", trim($t[2], " \n\r\t"));
		
		$params_entree = array();
		foreach($params_entree_brut as $p)
		{
			$t = explode('#', $p);
			$t2 = explode(' ', trim($t[0], " \n\r\t"));
			$param = array('type' => (isset($t2[0])?$t2[0]:''), 'nom' => (isset($t2[1])?$t2[1]:''), 'description' => (isset($t[1])?trim($t[1], " \t"):''));
			$params_entree[] = $param;
		}
		
		$params_sortie = array();
		foreach($params_sortie_brut as $p)
		{
			$t = explode('#', $p);
			$t2 = explode(' ', trim($t[0], " \n\r\t"));
			$param = array('type' => (isset($t2[0])?$t2[0]:''), 'nom' => (isset($t2[1])?$t2[1]:''), 'description' => (isset($t[1])?trim($t[1], " \t"):''));
			$params_sortie[] = $param;
		}
		
		$params_feedback = array();
		foreach($params_feedback_brut as $p)
		{
			$t = explode('#', $p);
			$t2 = explode(' ', trim($t[0], " \n\r\t"));
			$param = array('type' => (isset($t2[0])?$t2[0]:''), 'nom' => (isset($t2[1])?$t2[1]:''), 'description' => (isset($t[1])?trim($t[1], " \t"):''));
			$params_feedback[] = $param;
		}
		
		return array('entree' => $params_entree, 'sortie' => $params_sortie, 'feedback' => $params_feedback);
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM api_action WHERE id_action = '".mysqli_real_escape_string(DB::$connexion, $this->id_action)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete api_action : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		
		$query="DELETE FROM api_action_groupe WHERE id_action = '".mysqli_real_escape_string(DB::$connexion, $this->id_action)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete api_action_groupe : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
}
?>