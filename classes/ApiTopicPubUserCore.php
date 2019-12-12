<?php
class ApiTopicPubUserCore
{
	public $id_topic_pub_user = -1;
	public $id_topic_pub = -1;
	public $id_user = -1;

	public function __construct( $id_topic_pub_user = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_topic_pub_user);
		}
		elseif(! is_null($id_topic_pub_user) && $id_topic_pub_user != -1 )
		{
			$object = ApiTopicPubUser::getApiTopicPubUser( $id_topic_pub_user );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_topic_pub_user = $object->id_topic_pub_user;
		$this->id_topic_pub = $object->id_topic_pub;
		$this->id_user = $object->id_user;
	}

	public static function getApiTopicPubUser( $id_topic_pub_user )
	{
		$query = "SELECT * FROM api_topic_pub_user a1 WHERE id_topic_pub_user = '".mysqli_real_escape_string(DB::$connexion, $id_topic_pub_user)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_topic_pub_user == -1 || is_null($this->id_topic_pub_user) )
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
		$query = "INSERT INTO api_topic_pub_user ( id_topic_pub, id_user ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_topic_pub) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->id_user) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert ApiTopicPubUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_topic_pub_user = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE api_topic_pub_user SET

			id_topic_pub = '". mysqli_real_escape_string(DB::$connexion,  $this->id_topic_pub )."', 
			id_user = '". mysqli_real_escape_string(DB::$connexion,  $this->id_user )."'
		WHERE id_topic_pub_user = '". mysqli_real_escape_string(DB::$connexion, $this->id_topic_pub_user)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update ApiTopicPubUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM api_topic_pub_user WHERE id_topic_pub_user = '".mysqli_real_escape_string(DB::$connexion, $this->id_topic_pub_user)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ApiTopicPubUser : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetApiTopicPubUsers($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM api_topic_pub_user";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_topic_pub_user ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new ApiTopicPubUser($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>