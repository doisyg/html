<?php 
require_once ('../../config/initSite.php');
if (!isset($_SESSION["id_developer"])) { header("location:../login.php"); }

$sectionMenu = "api_documentation";

$currentPage = 'messaging';
include (dirname(__FILE__).'/../template/header.php');
?>
<div class="row">
<?php include (dirname(__FILE__).'/template/colonne_gauche.php');?>

<div class="col-md-12">
<div class="row call-panel">
<div class="panel-content">
	<h1>LEDs</h1>

    <p>This API allow you to customized the colors and animations of the LEDs.</p>
    
	<h2 id="events">Events</h2>
    
    <p><a href="reference.php#led_events">The complete list of events</a></p>
    <p>You can attach a handler to an event from led system on the initialising of the API.</p>
    
    <pre class="line-numbers"><code class="language-js">$(document).ready(function(e) {
        wycaApi = new WycaAPI({
            'api_key':'YOUR API KEY',
            'id_site':'YOUR SITE ID',
            'id_robot':'YOUR ROBOT ID / not_robot',

            onLedManualModeChange: function (message) { alert(JSON.stringify(message)); },
            });
     });</code></pre>


	<h2 id="functions">Functions</h2>
    
    <p><a href="reference.php#messaging_functions">The complete list of functions</a></p>
    <p>In this example, we send data <code>data of the message</code> to <code>PAGE_ON_ROBOT</code></p>
    
    <pre class="line-numbers"><code class="language-js">wycaApi.SendMessage('PAGE_ON_ROBOT', 'data of the message');</code></pre>


</div>
</div>
</div>

</div>

<?php include (dirname(__FILE__).'/../template/footer.php');?>