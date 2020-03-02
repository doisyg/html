<?php
class Area extends AreaCore
{
	public $points = array();
	public $configs = array();
	
	public function Supprimer()
	{
		$this->deleted=1;
		$this->Save();
	}
	
	public function GetPoints()
	{
		if (count($this->points) == 0)
		{
			$query = "SELECT * FROM area_point WHERE id_area=".(int)$this->id_area;
			$query .= " ORDER BY id_area_point ASC";
			$result = mysqli_query(DB::$connexion, $query);
			$array = array();
			while ($row = @mysqli_fetch_object( $result ) )
			{
				$array[] = new AreaPoint($row, true);
			}
			@mysqli_free_result( $result );
			
			$this->points = $array;
		}
		return $this->points;
	}
	
	public function GetConfigs()
	{
		if (count($this->configs) == 0)
		{
			$query = "SELECT * FROM area_config WHERE id_area=".(int)$this->id_area;
			$query .= " ORDER BY id_area_config ASC";
			$result = mysqli_query(DB::$connexion, $query);
			$array = array();
			while ($row = @mysqli_fetch_object( $result ) )
			{
				$array[] = new AreaConfig($row, true);
			}
			@mysqli_free_result( $result );
			
			$this->configs = $array;
		}
		return $this->configs;
	}
	
	public function Save($save_points = false, $save_configs = false)
	{
		if( $this->id_area == -1 || is_null($this->id_area) )
		{
			$this->Insert( );	
		}
		else
		{
			$this->Update( );
		}
		
		if ($save_points)
		{
			$query="DELETE FROM area_point WHERE id_area = ".(int)$this->id_area;
			$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete Area : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
			
			foreach($this->points as $point)
			{
				$p = new AreaPoint();
				$p->id_area = $this->id_area;
				if (!is_array($point))
				{
					$p->x = $point->x;
					$p->y = $point->y;
				}
				else
				{
					$p->x = $point['x'];
					$p->y = $point['y'];
				}
				$p->Save();
			}
			
			$this->points = array();
			$this->GetPoints(); 
		}
		
		if ($save_configs)
		{
			$query="DELETE FROM area_config WHERE id_area = ".(int)$this->id_area;
			$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete Area : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
			
			foreach($this->configs as $config)
			{
				$c = new AreaConfig();
				$c->id_area = $this->id_area;
				if (!is_array($point))
				{
					$c->name = $config->name;
					$c->value = $config->value;
				}
				else
				{
					$c->name = $config['name'];
					$c->value = $config['value'];
				}
				$c->Save();
			}
			
			$this->configs = array();
			$this->GetConfigs(); 
		}
		
	}
	
	public static function GetAreas($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM area WHERE deleted=0 AND is_forbidden=0";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_area ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Area($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}

	public static function GetForbiddenAreas($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM area WHERE deleted=0 AND is_forbidden=1";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_area ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new Area($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>
