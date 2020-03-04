<?php
require_once dirname(__FILE__).'/../lib/mailer/PHPMailerAutoload.php';

class Email
{ 
	public $destinataire = "";
	public $emetteur = "no-reply@wyca.com";
	public $emetteur_nom = "Wyca";
	public $objet = "";
	public $message = "";
	
	public function __construct() 
	{
		
	}
	
	private function GetHeader()
	{
		$texte = "";
		
		return $texte;
	}
	
	private function GetFooter()
	{
		$texte = "";
		
		return $texte;
	}
	
	public function Send()
	{
		if ($this->objet == "")
			die ("Pas d'objet dans le mail");
		if ($this->message == "")
			die ("Pas de message dans le mail");
		if ($this->destinataire == "")
			die ("Pas de destinataire");
		
		$e = new EmailSend();
		$e->sended = 0;
		$e->destinataire = $this->destinataire;
		$e->sujet = $this->objet;
		$e->message = $this->message;
		$e->Save();
	}
	
	
}
?>