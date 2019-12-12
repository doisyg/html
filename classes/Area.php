<?php
class Area extends AreaCore
{
	public $points = array();
	
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
	
	public function Save($save_points = false)
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
				$p->x = $point['x'];
				$p->y = $point['y'];
				$p->Save();
			}
			
			$this->points = array();
			$this->GetPoints(); 
		}
		
	}
}
?>