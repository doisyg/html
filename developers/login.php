<?php 
require_once ('../config/initSite.php');
$sectionMenu = "login";

if (isset($_POST['email']))
{
	if (User::CheckConnexion($_POST['email'], $_POST['password']))
	{
		$_SESSION["id_developer"] = User::GetIdConnexion($_POST['email'], $_POST['password']);
		$_SESSION["IP"] = $_SERVER['REMOTE_ADDR'];
		header('location:index.php');
	}
	else
	{
		$ip_trace = new IpErrorTrace();
		$ip_trace->IP = $_SERVER['REMOTE_ADDR'];
		$ip_trace->type = 'Connect';
		$ip_trace->date = date('Y-m-d H:i:s');
		$ip_trace->Save();
		
		if (IpErrorTrace::CheckIP($_SERVER['REMOTE_ADDR'])>=3)
		{
			// On block l'IP
			$ipb = new IpBlocked();
			$ipb->IP = $_SERVER['REMOTE_ADDR'];
			$ipb->date = date('Y-m-d H:i:s');
			$ipb->Insert();
		}
		
		$message = __('Adresse email ou mot de passe invalide.');
		$erreur = true;
	}
}

$msgOk = '';
$erreurMdp = '';
$affForgotPwd = false;
if (isset($_POST['email_lost']))
{
	if (!User::EmailIsUsed($_POST['email_lost']))
	{
		$message = __('Adresse email inconnue.');
		$erreur = true;
		$affForgotPwd = true;
		
		$ip_trace = new IpErrorTrace();
		$ip_trace->IP = $_SERVER['REMOTE_ADDR'];
		$ip_trace->type = 'Connect';
		$ip_trace->date = date('Y-m-d H:i:s');
		$ip_trace->Save();
		
		if (IpErrorTrace::CheckIP($_SERVER['REMOTE_ADDR'])>=3)
		{
			// On block l'IP
			$ipb = new IpBlocked();
			$ipb->IP = $_SERVER['REMOTE_ADDR'];
			$ipb->date = date('Y-m-d H:i:s');
			$ipb->Insert();
		}
	}
	else
	{
		User::SendNewPassword($_POST['email_lost']);
		$message = __('Votre nouveau mot de passe viens de vous Ãªtre envoyÃ© par email.');
	}
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Connexion</title>

    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/font-awesome.min.css">

	<link href="css/custom.css" rel="stylesheet">

	<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="js/html5shiv.min.js"></script>
      <script src="js/respond.min.js"></script>
    <![endif]-->
    
  </head>
  <body>
	<div class="box container">
	  <a href="http://www.wyca.fr" target="_blank" class="list-group-item-heading"><img src="images/wyca-horizontal-bleu.png" class="img-responsive center-block" alt="Wyca Solutions Admin"></a></h3>
      <hr>
      <div class="tab-content">
        <div id="login" class="tab-pane active">
          <form class="form-signin" action="login.php" method="post">
          <input type="hidden" name="todo" value="connexion" />
            <?php if (isset($message))
			{
				?><p class="text-muted text-center alert <?php if (isset($erreur)){?> alert-danger <?php } else {?> alert-success <?php }?>">
              	<?php echo $message;?>
            	</p><?php
			}?>
            <p class="text-muted text-center">
              <?php echo __('Entrez votre email et mot de passe');?>
            </p>
            <input name="email" type="email" placeholder="mail@domain.com" class="form-control top">
            <input name="password" type="password" placeholder="<?php echo __('Mot de passe');?>" class="form-control bottom">
            <button class="btn btn-lg btn-primary btn-block" type="submit"><?php echo __('Connexion');?></button>
          </form>
        </div>
        <div id="forgot" class="tab-pane">
          <form action="login.php" method="post">
          <input type="hidden" name="todo" value="forgot_mdp" />
            <p class="text-muted text-center"><?php echo __('Entrez votre adresse email');?></p>
            <input name="email" type="email" placeholder="mail@domain.com" class="form-control">
            <br>
            <button class="btn btn-lg btn-primary btn-block" type="submit"><?php echo __('Recevoir mon mot de passe');?></button>
          </form>
        </div>
      </div>
      <hr>
      <div class="text-center">
        <ul class="list-inline">
          <li> <a class="text-muted" href="#login" data-toggle="tab"><?php echo __('Connexion');?></a>  </li>
          <li> <a class="text-muted" href="#forgot" data-toggle="tab"><?php echo __('Mot de passe oubliÃ© ?');?></a>  </li>
        </ul>
      </div>
    </div>
    
    <a href="#popupChrome" id="lienPopupChrome" class="fancyboxAlerte"></a>
    <div style="display:none;">
    	<div id="popupChrome" style="max-width:400px; text-align:center;">
    		<h2><?php echo __("L'utilisation du navigateur Google Chrome est fortement recommandée pour l'utilisation de Wyca et la communication avec les robots.");?></h2>
    		
    		<h2><?php echo __("Merci de relancer le site sous Google Chrome");?></h2>
        </div>
	</div>

    <script src="js/jquery-1.11.3.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/fancybox/source/jquery.fancybox.js?v=2.1.5"></script>
	<script>
	$(function () {
		$('.navbar-toggle').click(function () {
			$('.navbar-nav').toggleClass('slide-in');
			$('.side-body').toggleClass('body-slide-in');
			$('#search').removeClass('in').addClass('collapse').slideUp(200);

			/// uncomment code for absolute positioning tweek see top comment in css
			//$('.absolute-wrapper').toggleClass('slide-in');
        
		});
   
	   // Remove menu for searching
	   $('#search-trigger').click(function () {
			$('.navbar-nav').removeClass('slide-in');
			$('.side-body').removeClass('body-slide-in');

			/// uncomment code for absolute positioning tweek see top comment in css
			//$('.absolute-wrapper').removeClass('slide-in');

		});
	});
	</script>
	<script>

	$(function () {
		$('#user-status').hover(
  		function() {
    			$('#navbar-badge').addClass('fa-rotate-90');},
		function() {		 
    			$('#navbar-badge').removeClass('fa-rotate-90');}
		);
	});  
	</script>
	<script>
	$(function () {
		$('#user-status').click(
			function() {
				var className = $("#user-status-badge").attr('class');
		
				switch(className){
					case 'badge navbar-badge-offline':
						$("#user-status-badge").removeClass('navbar-badge-offline')
											   .addClass('navbar-badge-online')
											   .text('Online');
						$('#user-status').html('<a href="#"><i id="navbar-badge" class="fa fa-refresh" aria-hidden="true"></i> become offline <span class="sr-only">(current)</span></a>');
					break;
				
					case 'badge navbar-badge-online':
						$("#user-status-badge").removeClass('navbar-badge-online')
											   .addClass('navbar-badge-offline')
											   .text('Offline');
						$('#user-status').html('<a href="#"><i id="navbar-badge" class="fa fa-refresh" aria-hidden="true"></i> become online <span class="sr-only">(current)</span></a>');
					break;
				}
			}
		);	
	});
	</script>

    <script type="text/javascript">
    	var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      (function($) {
        $(document).ready(function() {
        
        	jQuery('.fancyboxAlerte').fancybox();
        
        	if (!isChrome) $('#lienPopupChrome').click();
        
          $('.list-inline li > a').click(function() {
            var activeForm = $(this).attr('href') + ' > form';
            //console.log(activeForm);
            $(activeForm).addClass('animated fadeIn');
            //set timer to 1 seconds, after that, unload the animate animation
            setTimeout(function() {
              $(activeForm).removeClass('animated fadeIn');
            }, 1000);
          });
        });
      })(jQuery);
      
    </script>
  </body>
</html>