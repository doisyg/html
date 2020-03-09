<?php
class ApiTopicPubGroupeCore
{
	public $id_topic_pub_groupe = -1;
	public $id_topic_pub = -1;
	public $id_groupe_user = -1;

	public function __construct( $id_topic_pub_groupe = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_topic_pub_groupe);
		}
		elseif(! is_null($id_topic_pub_groupe) && $id_topic_pub_groupe != -1 )
		{
			$object = ApiTopicPubGroupe::getApiTopicPubGroupe( $id_topic_pub_groupe );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_topic_pub_groupe = $object->id_topic_pub_groupe;
		$this->id_topic_pub = $object->id_topic_pub;
		$this->id_groupe_user = $object->id_groupe_user;
	}

	public static function getApiTopicPubGroupe( $id_topic_pub_groupe )
	{
		$query = "SELECT * FROM api_topic_pub_groupe a1 WHERE id_topic_pub_groupe = '".mysqli_real_escape_string(DB::$connexion, $id_topic_pub_groupe)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_topic_pub_groupe == -1 || is_null($this->id_topic_pub_groupe) )
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
		$query = "INSERT INTO api_topic_pub_groupe ( id_topic_pub, id_groupe_user ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_topic_pub) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->id_groupe_user) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert ApiTopicPubGroupe : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_topic_pub_groupe = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE api_topic_pub_groupe SET

			id_topic_pub = '". mysqli_real_escape_string(DB::$connexion,  $this->id_topic_pub )."', 
			id_groupe_user = '". mysqli_real_escape_string(DB::$connexion,  $this->id_groupe_user )."'
		WHERE id_topic_pub_groupe = '". mysqli_real_escape_string(DB::$connexion, $this->id_topic_pub_groupe)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update ApiTopicPubGroupe : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM api_topic_pub_groupe WHERE id_topic_pub_groupe = '".mysqli_real_escape_string(DB::$connexion, $this->id_topic_pub_groupe)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiTopicPubGroupe : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetApiTopicPubGroupes($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM api_topic_pub_groupe";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_topic_pub_groupe ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new ApiTopicPubGroupe($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>