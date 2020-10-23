<?php 
include ('template/header_test.php');
?>

<section id="install_dashboard" class="page hmi_tuile active">
	<header>
    	<div class="pull-left"><img src="assets/images/logo.png" /></div>
        <h2>Dashboard</h2>
    </header>
    <div class="content">
        <ul class="tuiles row">
        	<li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile1" data-goto="install_map" href="#"><i class="far fa-map"></i>Maps</a></li>
        	<li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile2" data-goto="install_setup" href="#"><i class="fa fa-gears"></i>Setup</a></li>
        	<li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile3" data-goto="install_move" href="#"><i class="fa fa-gamepad"></i>Control robot</a></li>
        	<li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile4" data-goto="install_users" href="#"><i class="fa fa-group"></i>Managers</a></li>
        	<li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile4" data-goto="install_servicebook" href="#"><i class="fa fa-book"></i>Service book</a></li>
        	<li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile6" data-goto="install_help" href="#"><i class="fa fa-question"></i>Help</a></li>
        </ul>
    </div>
</section>

<section id="install_map" class="page with_footer">
	<header>
    	<div class="pull-left"><img src="assets/images/logo.png" /></div>
        <h2>Maps</h2>
    </header>
    <div class="content">
        MAPS
    </div>
    <footer>
    	<a href="#" class="btn btn-wyca button_goto" data-goto="install_dashboard"><i class="fa fa-chevron-left"></i> Back</a>
    </footer>
</section>

<section id="install_setup" class="page hmi_tuile with_footer">
	<header>
    	<div class="pull-left"><img src="assets/images/logo.png" /></div>
        <h2>Setup</h2>
    </header>
    <div class="content">
        <ul class="tuiles row">
        	<li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile1" data-goto="install_map" href="#"><i class="fa fa-gear"></i>System</a></li>
        	<li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile2" data-goto="install_setup" href="#"><i class="fa fa-building"></i>Sites</a></li>
        	<li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile3" data-goto="install_move" href="#"><i class="fa fa-android"></i>Vehicule</a></li>
        	<li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile4" data-goto="install_users" href="#"><i class="fa fa-upload"></i>Save config</a></li>
        	<li class="col-xs-4 col-md-3 col-lg-2"><a class="button_goto anim_tuiles tuile4" data-goto="install_servicebook" href="#"><i class="fa fa-download"></i>Load config</a></li>
        </ul>
    </div>
    <footer>
    	<a href="#" class="btn btn-wyca button_goto" data-goto="install_dashboard"><i class="fa fa-chevron-left"></i> Back</a>
    </footer>
</section>

<section id="install_move" class="page with_footer">
	<header>
    	<div class="pull-left"><img src="assets/images/logo.png" /></div>
        <h2>Control robot</h2>
    </header>
    <div class="content">
        CONTROL ROBOTS
    </div>
    <footer>
    	<a href="#" class="btn btn-wyca button_goto" data-goto="install_dashboard"><i class="fa fa-chevron-left"></i> Back</a>
    </footer>
</section>

<section id="install_users" class="page with_footer">
	<header>
    	<div class="pull-left"><img src="assets/images/logo.png" /></div>
        <h2>Managers</h2>
    </header>
    <div class="content">
        MANAGERS
    </div>
    <footer>
    	<a href="#" class="btn btn-wyca button_goto" data-goto="install_dashboard"><i class="fa fa-chevron-left"></i> Back</a>
    </footer>
</section>

<section id="install_servicebook" class="page with_footer">
	<header>
    	<div class="pull-left"><img src="assets/images/logo.png" /></div>
        <h2>Service book</h2>
    </header>
    <div class="content">
        SERVICE BOOK
    </div>
    <footer>
    	<a href="#" class="btn btn-wyca button_goto" data-goto="install_dashboard"><i class="fa fa-chevron-left"></i> Back</a>
    </footer>
</section>

<section id="install_help" class="page with_footer">
	<header>
    	<div class="pull-left"><img src="assets/images/logo.png" /></div>
        <h2>Help</h2>
    </header>
    <div class="content">
        HELP
    </div>
    <footer>
    	<a href="#" class="btn btn-wyca button_goto" data-goto="install_dashboard"><i class="fa fa-chevron-left"></i> Back</a>
    </footer>
</section>

<?php 
include ('template/footer_test.php');
?>

<script>
function HideTuile(element)
{
	element.css({ transform: 'rotatey(90deg)', "z-index": "0" });
}
function ShowTuile(element)
{
	element.css({ transform: 'rotatey(0deg)', "z-index": "0" });
}

$(document).ready(function(e) {
	
	var elementCss = {
		'perspective': 'outerWidth',
		"transition": "all .2s ease-out"
	  };
	$('ul.tuiles a').css(elementCss);
	
	$('section:not(".active") .anim_tuiles').css({ transform: 'rotatey(90deg)', "z-index": "0" });
	
	$('.button_goto').click(function(e) {
        e.preventDefault();
		
		// Anim HIDE
		var startShowAfter = 0;
		if ($(this).closest('section').hasClass('hmi_tuile'))
		{
			nbTuiles = $(this).closest('section').find('.anim_tuiles').length;
			delay = 70;
			for (i=1; i <= nbTuiles; i++)
			{
				setTimeout(HideTuile, delay * (i - 1), $(this).closest('section').find('.tuile' + (nbTuiles - i + 1)));
			}
			
			startShowAfter = nbTuiles * 70;
			$(this).closest('section').delay(startShowAfter+250).fadeOut(500, function() {
               $(this).removeClass('active');
            });
		}
		else
		{
			$(this).closest('section').fadeOut(500);
		}
		
		// Anim SHOW
		next = $(this).data('goto');
		if ($('#'+next).hasClass('hmi_tuile'))
		{
			nbTuiles = $('#'+next).find('.anim_tuiles').length;
			delay = 70;
			for (i=1; i <= nbTuiles; i++)
			{
				setTimeout(ShowTuile, 700 + delay * (i - 1), $('#'+next).find('.tuile' + i));
			}
			
			$('#'+next).delay(startShowAfter+250).fadeIn(500, function() {
               $(this).addClass('active');
            });
		}
		else
		{
			$('#'+next).delay(startShowAfter).fadeIn(500, function() {
               $(this).addClass('active');
            });
		}
    });
});
</script>