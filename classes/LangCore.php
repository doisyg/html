<?php
class LangCore
{
	public $id_lang = -1;
	public $iso = "";
	public $langue = "";

	public function __construct( $id_lang = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_lang);
		}
		elseif(! is_null($id_lang) && $id_lang != -1 )
		{
			$object = Lang::getLang( $id_lang );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_lang = $object->id_lang;
		$this->iso = $object->iso;
		$this->langue = $object->langue;
	}

	public static function getLang( $id_lang )
	{
		$query = "SELECT * FROM lang a1 WHERE id_lang = '".mysqli_real_escape_string(DB::$connexion, $id_lang)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_lang == -1 || is_null($this->id_lang) )
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
		$query = "INSERT INTO lang ( iso, langue ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->iso) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->langue) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert Lang : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_lang = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE lang SET

			iso = '". mysqli_real_escape_string(DB::$connexion,  $this->iso )."', 
			langue = '". mysqli_real_escape_string(DB::$connexion,  $this->langue )."'
		WHERE id_lang = '". mysqli_real_escape_string(DB::$connexion, $this->id_lang)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update Lang : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM lang WHERE id_lang = '".mysqli_real_escape_string(DB::$connexion, $this->id_lang)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete Lang : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetLangs($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM lang";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_lang ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Lang($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>