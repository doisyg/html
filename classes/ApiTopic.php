<?php
class ApiTopic extends ApiTopicCore
{
	public static function GetByEventName($event_name)
	{
		$query = "SELECT * FROM api_topic WHERE event_name='".mysqli_real_escape_string(DB::$connexion, $event_name)."'";
		$result = mysqli_query(DB::$connexion, $query);
		if ($row = @mysqli_fetch_object( $result ) )
			$topic = new ApiTopic($row, true);
		else
			$topic = new ApiTopic();
		@mysqli_free_result( $result );
		return $topic;
	}
	
	public static function GetIdServicesAndTopicsToInit()
	{
		$query = "SELECT id_service_update, id_topic FROM api_topic WHERE id_service_update > 0";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			if (!isset($array[$row->id_service_update])) $array[$row->id_service_update] = array();
			$array[$row->id_service_update][] = $row->id_topic;
		}
		@mysqli_free_result( $result );
		return $array;
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM api_topic WHERE id_topic = '".mysqli_real_escape_string(DB::$connexion, $this->id_topic)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiTopic : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		
		$query="DELETE FROM api_topic_user WHERE id_topic = '".mysqli_real_escape_string(DB::$connexion, $this->id_topic)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiTopic : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	
}
?>