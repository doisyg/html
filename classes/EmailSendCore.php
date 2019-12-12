<?php
class EmailSendCore
{
	public $id_email = -1;
	public $sended = 0;
	public $destinataire = "";
	public $sujet = "";
	public $message = "";

	public function __construct( $id_email = null, $byrow=false ) 
	{
		if ($byrow)
		{
			$this->Copy($id_email);
		}
		elseif(! is_null($id_email) && $id_email != -1 )
		{
			$object = EmailSend::getEmailSend( $id_email );
			if ($object)
			{
				$this->Copy($object);
			}
		}
	}

	protected function Copy($object)
	{
		$this->id_email = $object->id_email;
		$this->sended = $object->sended;
		$this->destinataire = $object->destinataire;
		$this->sujet = $object->sujet;
		$this->message = $object->message;
	}

	public static function getEmailSend( $id_email )
	{
		$query = "SELECT * FROM email_send a1 WHERE id_email = '".mysqli_real_escape_string(DB::$connexion, $id_email)."'";
		$resultat=mysqli_query(DB::$connexion, $query);
		return mysqli_fetch_object($resultat);
	}

	public function Save()
	{
		if( $this->id_email == -1 || is_null($this->id_email) )
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
		$query = "INSERT INTO email_send ( sended, destinataire, sujet, message ) VALUES ( 

			'". mysqli_real_escape_string(DB::$connexion, $this->sended) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->destinataire) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->sujet) ."', 
			'". mysqli_real_escape_string(DB::$connexion, $this->message) ."'
			) ";
		$insert=mysqli_query(DB::$connexion, $query) or die ('ERREUR Insert EmailSend : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
		$this->id_email = mysqli_insert_id(DB::$connexion);
	}

	public function Update( )
	{
		global $_CONFIG;
		$query = "UPDATE email_send SET

			sended = '". mysqli_real_escape_string(DB::$connexion,  $this->sended )."', 
			destinataire = '". mysqli_real_escape_string(DB::$connexion,  $this->destinataire )."', 
			sujet = '". mysqli_real_escape_string(DB::$connexion,  $this->sujet )."', 
			message = '". mysqli_real_escape_string(DB::$connexion,  $this->message )."'
		WHERE id_email = '". mysqli_real_escape_string(DB::$connexion, $this->id_email)."'";
		$update=mysqli_query(DB::$connexion, $query) or die ('ERREUR Update EmailSend : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}
	
	public function Supprimer()
	{
		$query="DELETE FROM email_send WHERE id_email = '".mysqli_real_escape_string(DB::$connexion, $this->id_email)."'";
		$delete=mysqli_query(DB::$connexion, $query) or die ('ERREUR Delete EmailSend : '.$query.'<br />'.mysqli_error(DB::$connexion).'<br /><br />');
	}

	public static function GetEmailSends($order = "", $order_sens = "")
	{
		$query = "SELECT * FROM email_send";
		if ($order!="")
			$query .= " ORDER BY ".mysqli_real_escape_string(DB::$connexion, $order)." ".mysqli_real_escape_string(DB::$connexion, $order_sens);
		else 
			$query .= " ORDER BY id_email ASC";
		$result = mysqli_query(DB::$connexion, $query);
		$array = array();
		while ($row = @mysqli_fetch_object( $result ) )
		{
			$array[] = new EmailSend($row, true);
		}
		@mysqli_free_result( $result );
		return $array;
	}
}
?>