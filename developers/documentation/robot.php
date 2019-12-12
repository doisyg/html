<?php 
require_once ('../../config/initSite.php');
if (!isset($_SESSION["id_developer"])) { header("location:../login.php"); }

$sectionMenu = "api_documentation";

$currentPage = 'robot';
include (dirname(__FILE__).'/../template/header.php');
?>
<div class="row">
<?php include (dirname(__FILE__).'/template/colonne_gauche.php');?>

<div class="col-md-12">
<div class="row call-panel">
<div class="panel-content">
	<h1>Robot</h1>

    <p>This API allow you to access to the functionnality of your robot.</p>

	<h2 id="events">Events</h2>
    
    <p><a href="reference.php#robot_events">The complete list of events</a></p>
    <p>You can attach a handler to an event from robot on the initialising of the API<br />
    In this example, we display in alert the state of the battery.</p>
    
    <pre class="line-numbers"><code class="language-js">$(document).ready(function(e) {
        wycaApi = new WycaAPI({
            'api_key':'YOUR API KEY',
            'id_site':'YOUR SITE ID',
            'id_robot':'YOUR ROBOT ID / not_robot',
            onBatteryStateChange : function(message) { 
            		alert(JSON.stringify(message)); 
            	},
            });
     });</code></pre>


	<h2 id="functions">Functions</h2>
    
    <p><a href="reference.php#robot_functions">The complete list of functions</a></p>
    <p>You can send action on robot, in this exemple, we demand to the robot to deliver a lock.</p>
    
    <pre class="line-numbers"><code class="language-js">wycaApi.DistributeLocker();</code></pre>


</div>
</div>
</div>

</div>

<?php include (dirname(__FILE__).'/../template/footer.php');?>    
    	