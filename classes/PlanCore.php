<?php
class PlanCore
{
	public $id_plan = -1;
	public $id_site = -1;
	public $nom = "";
	public $image = "";
	public $ros_resolution = -1;
	public $ros_largeur = -1;
	public $ros_hauteur = -1;

	public function __construct( $id_plan = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_plan);
		}
		elseif(! is_null($id_plan) && $id_plan != -1 )
		{
			$object = Plan::getPlan( $id_plan );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_plan = $object->id_plan;
		$this->id_site = $object->id_site;
		$this->nom = $object->nom;
		$this->image = $object->image;
		$this->ros_resolution = $object->ros_resolution;
		$this->ros_largeur = $object->ros_largeur;
		$this->ros_hauteur = $object->ros_hauteur;
	}

	public static function getPlan( $id_plan )
	{
		$query = "SELECT * FROM plan a1 WHERE id_plan = '".mysqli_real_escape_string(DB::$connexion, $id_plan)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_plan == -1 || is_null($this->id_plan) )
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
		$query = "INSERT INTO plan ( id_site, nom, image, ros_resolution, ros_largeur, ros_hauteur ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->id_site) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->nom) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->image) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->ros_resolution) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->ros_largeur) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->ros_hauteur) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert Plan : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_plan = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE plan SET

			id_site = '". mysqli_real_escape_string(DB::$connexion,  $this->id_site )."', 
			nom = '". mysqli_real_escape_string(DB::$connexion,  $this->nom )."', 
			image = '". mysqli_real_escape_string(DB::$connexion,  $this->image )."', 
			ros_resolution = '". mysqli_real_escape_string(DB::$connexion,  $this->ros_resolution )."', 
			ros_largeur = '". mysqli_real_escape_string(DB::$connexion,  $this->ros_largeur )."', 
			ros_hauteur = '". mysqli_real_escape_string(DB::$connexion,  $this->ros_hauteur )."'
		WHERE id_plan = '". mysqli_real_escape_string(DB::$connexion, $this->id_plan)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update Plan : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM plan WHERE id_plan = '".mysqli_real_escape_string(DB::$connexion, $this->id_plan)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete Plan : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetPlans($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM plan";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_plan ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Plan($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>