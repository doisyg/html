<?php
class ApiTopicGroupeCore
{
	public $id_topic_groupe = -1;
	public $id_topic = -1;
	public $id_groupe_user = -1;

	public function __construct( $id_topic_groupe = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_topic_groupe);
		}
		elseif(! is_null($id_topic_groupe) && $id_topic_groupe != -1 )
		{
			$object = ApiTopicGroupe::getApiTopicGroupe( $id_topic_groupe );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_topic_groupe = $object->id_topic_groupe;
		$this->id_topic = $object->id_topic;
		$this->id_groupe_user = $object->id_groupe_user;
	}

	public static function getApiTopicGroupe( $id_topic_groupe )
	{
		$query = "SELECT * FROM api_topic_groupe a1 WHERE id_topic_groupe = '".mysqli_real_escape_string(DB::$connexion, $id_topic_groupe)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_topic_groupe == -1 || is_null($this->id_topic_groupe) )
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
		$query = "INSERT INTO api_topic_groupe ( id_topic, id_groupe_user ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_topic) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->id_groupe_user) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert ApiTopicGroupe : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_topic_groupe = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE api_topic_groupe SET

			id_topic = '". mysqli_real_escape_string(DB::$connexion,  $this->id_topic )."', 
			id_groupe_user = '". mysqli_real_escape_string(DB::$connexion,  $this->id_groupe_user )."'
		WHERE id_topic_groupe = '". mysqli_real_escape_string(DB::$connexion, $this->id_topic_groupe)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update ApiTopicGroupe : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM api_topic_groupe WHERE id_topic_groupe = '".mysqli_real_escape_string(DB::$connexion, $this->id_topic_groupe)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiTopicGroupe : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetApiTopicGroupes($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM api_topic_groupe";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_topic_groupe ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new ApiTopicGroupe($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>