<?php
class ApiTopicCore
{
	public $id_topic = -1;
	public $groupe = "";
	public $nom = "";
	public $messageType = "";
	public $event_name = "";
	public $publish_name = "";
	public $id_service_update = -1;
	public $throttle_rate = 0;

	public function __construct( $id_topic = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_topic);
		}
		elseif(! is_null($id_topic) && $id_topic != -1 )
		{
			$object = ApiTopic::getApiTopic( $id_topic );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_topic = $object->id_topic;
		$this->groupe = $object->groupe;
		$this->nom = $object->nom;
		$this->messageType = $object->messageType;
		$this->event_name = $object->event_name;
		$this->publish_name = $object->publish_name;
		$this->id_service_update = $object->id_service_update;
		$this->throttle_rate = $object->throttle_rate;
	}

	public static function getApiTopic( $id_topic )
	{
		$query = "SELECT * FROM api_topic a1 WHERE id_topic = '".mysqli_real_escape_string(DB::$connexion, $id_topic)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_topic == -1 || is_null($this->id_topic) )
		{
			$this->Insert( );	
		}
		else
		{
			$this->Update( );
		}
	}

	public function Insert()
	{
		global $_CONFIG;
		$query = "INSERT INTO api_topic ( groupe, nom, messageType, event_name, publish_name, id_service_update, throttle_rate ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->groupe) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->nom) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->messageType) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->event_name) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->publish_name) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->id_service_update) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->throttle_rate) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert ApiTopic : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_topic = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE api_topic SET

			groupe = '". mysqli_real_escape_string(DB::$connexion,  $this->groupe )."', 
			nom = '". mysqli_real_escape_string(DB::$connexion,  $this->nom )."', 
			messageType = '". mysqli_real_escape_string(DB::$connexion,  $this->messageType )."', 
			event_name = '". mysqli_real_escape_string(DB::$connexion,  $this->event_name )."', 
			publish_name = '". mysqli_real_escape_string(DB::$connexion,  $this->publish_name )."', 
			id_service_update = '". mysqli_real_escape_string(DB::$connexion,  $this->id_service_update )."', 
			throttle_rate = '". mysqli_real_escape_string(DB::$connexion,  $this->throttle_rate )."'
		WHERE id_topic = '". mysqli_real_escape_string(DB::$connexion, $this->id_topic)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update ApiTopic : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM api_topic WHERE id_topic = '".mysqli_real_escape_string(DB::$connexion, $this->id_topic)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiTopic : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetApiTopics($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM api_topic";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_topic ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new ApiTopic($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>