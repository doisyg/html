<?php

require_once dirname(__FILE__).'/../lib/mailer/PHPMailerAutoload.php';

class Email
{ 
	public $destinataire = "";
	public $emetteur = "noreply@wyca.fr";
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
		
		/*
		$mail = new PHPMailer;
		
		$mail->SMTPDebug = 3;                               // Enable verbose debug output
		
		$mail->isSMTP();                                      // Set mailer to use SMTP
		$mail->Host = 'ssl0.ovh.net';  // Specify main and backup SMTP servers
		$mail->SMTPAuth = true;                               // Enable SMTP authentication
		$mail->Username = 'noreply@wyca.fr';                 // SMTP username
		$mail->Password = 'website@MDP';                           // SMTP password
		$mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
		$mail->Port = 465;                                    // TCP port to connect to
		
		$mail->setFrom('noreply@wyca.fr', 'Wyca solutions');
		
		if (is_array($this->destinataire))
		{
			foreach ($this->destinataire as $d)
				$mail->addAddress($d);
		}
		else
			$mail->addAddress($this->destinataire);
		
		$mail->isHTML(true);                                  // Set email format to HTML
		
		$mail->Subject = $this->objet;
		$mail->Body    = $this->message;
		
		if(!$mail->send()) {
			//echo 'Message could not be sent.';
			//echo 'Mailer Error: ' . $mail->ErrorInfo;
		} else {
			//echo 'Message has been sent';
		}
		*/	
	}
	
	
}
?>