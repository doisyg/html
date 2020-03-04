<?php
class ServiceBookCore
{
	public $id_service_book = -1;
	public $date = "";
	public $title = "";
	public $comment = "";
	public $id_user = -1;

	public function __construct( $id_service_book = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_service_book);
		}
		elseif(! is_null($id_service_book) && $id_service_book != -1 )
		{
			$object = ServiceBook::getServiceBook( $id_service_book );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_service_book = $object->id_service_book;
		$this->date = $object->date;
		$this->title = $object->title;
		$this->comment = $object->comment;
		$this->id_user = $object->id_user;
	}

	public static function getServiceBook( $id_service_book )
	{
		$query = "SELECT * FROM service_book a1 WHERE id_service_book = '".mysqli_real_escape_string(DB::$connexion, $id_service_book)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_service_book == -1 || is_null($this->id_service_book) )
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
		$query = "INSERT INTO service_book ( date, title, comment, id_user ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->date) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->title) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->comment) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->id_user) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert ServiceBook : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_service_book = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE service_book SET

			date = '". mysqli_real_escape_string(DB::$connexion,  $this->date )."', 
			title = '". mysqli_real_escape_string(DB::$connexion,  $this->title )."', 
			comment = '". mysqli_real_escape_string(DB::$connexion,  $this->comment )."', 
			id_user = '". mysqli_real_escape_string(DB::$connexion,  $this->id_user )."'
		WHERE id_service_book = '". mysqli_real_escape_string(DB::$connexion, $this->id_service_book)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update ServiceBook : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM service_book WHERE id_service_book = '".mysqli_real_escape_string(DB::$connexion, $this->id_service_book)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete ServiceBook : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetServiceBooks($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM service_book";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_service_book ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new ServiceBook($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>