<?php
class SiteCore
{
	public $id_site = -1;
	public $nom = "";

	public function __construct( $id_site = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_site);
		}
		elseif(! is_null($id_site) && $id_site != -1 )
		{
			$object = Site::getSite( $id_site );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_site = $object->id_site;
		$this->nom = $object->nom;
	}

	public static function getSite( $id_site )
	{
		$query = "SELECT * FROM site a1 WHERE id_site = '".mysqli_real_escape_string(DB::$connexion, $id_site)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_site == -1 || is_null($this->id_site) )
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
		$query = "INSERT INTO site ( nom ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->nom) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert Site : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_site = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE site SET

			nom = '". mysqli_real_escape_string(DB::$connexion,  $this->nom )."'
		WHERE id_site = '". mysqli_real_escape_string(DB::$connexion, $this->id_site)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update Site : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM site WHERE id_site = '".mysqli_real_escape_string(DB::$connexion, $this->id_site)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete Site : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetSites($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM site";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_site ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Site($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>