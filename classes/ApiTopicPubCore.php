<?php
class ApiTopicPubCore
{
	public $id_topic_pub = -1;
	public $groupe = "";
	public $nom = "";
	public $messageType = "";
	public $function_name = "";
	public $details = "";

	public function __construct( $id_topic_pub = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_topic_pub);
		}
		elseif(! is_null($id_topic_pub) && $id_topic_pub != -1 )
		{
			$object = ApiTopicPub::getApiTopicPub( $id_topic_pub );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_topic_pub = $object->id_topic_pub;
		$this->groupe = $object->groupe;
		$this->nom = $object->nom;
		$this->messageType = $object->messageType;
		$this->function_name = $object->function_name;
		$this->details = $object->details;
	}

	public static function getApiTopicPub( $id_topic_pub )
	{
		$query = "SELECT * FROM api_topic_pub a1 WHERE id_topic_pub = '".mysqli_real_escape_string(DB::$connexion, $id_topic_pub)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_topic_pub == -1 || is_null($this->id_topic_pub) )
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
		$query = "INSERT INTO api_topic_pub ( groupe, nom, messageType, function_name, details ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->groupe) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->nom) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->messageType) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->function_name) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->details) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert ApiTopicPub : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_topic_pub = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE api_topic_pub SET

			groupe = '". mysqli_real_escape_string(DB::$connexion,  $this->groupe )."', 
			nom = '". mysqli_real_escape_string(DB::$connexion,  $this->nom )."', 
			messageType = '". mysqli_real_escape_string(DB::$connexion,  $this->messageType )."', 
			function_name = '". mysqli_real_escape_string(DB::$connexion,  $this->function_name )."', 
			details = '". mysqli_real_escape_string(DB::$connexion,  $this->details )."'
		WHERE id_topic_pub = '". mysqli_real_escape_string(DB::$connexion, $this->id_topic_pub)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update ApiTopicPub : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM api_topic_pub WHERE id_topic_pub = '".mysqli_real_escape_string(DB::$connexion, $this->id_topic_pub)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiTopicPub : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetApiTopicPubs($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM api_topic_pub";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_topic_pub ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new ApiTopicPub($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>