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
	<h1>Messaging</h1>

    <p>This API allow you to exchange message between mutiple page connexted to the same robot with API.</p>
    
    <p><strong>All message are delete after 1 minute automatically.<br />
    A message is automatically deleted when it's received by the recipient</strong></p>

	<h2 id="events">Events</h2>
    
    <p><a href="reference.php#messaging_events">The complete list of events</a></p>
    <p>You can attach a handler to an event from messaging system on the initialising of the API<br />
    In this example, we received all message send to <code>THE_NAME_OF_THIS_PAGE</code> and display the data in an alert box.</p>
    
    <pre class="line-numbers"><code class="language-js">$(document).ready(function(e) {
        wycaApi = new WycaAPI({
            'api_key':'YOUR API KEY',
            'id_site':'YOUR SITE ID',
            'id_robot':'YOUR ROBOT ID / not_robot',

            'message_to': 'THE_NAME_OF_THIS_PAGE',
            onNewMessage: function (message) { alert(JSON.stringify(message)); },
            });
     });</code></pre>


	<h2 id="functions">Functions</h2>
    
    <p><a href="reference.php#messaging_functions">The complete list of functions</a></p>
    <p>In this example, we send data <code>data of the message</code> to <code>PAGE_ON_ROBOT</code></p>
    
    <pre class="line-numbers"><code class="language-js">wycaApi.SendMessage('PAGE_ON_ROBOT', 'data of the message');</code></pre>
    
    
    <hr style="margin-top:50px; margin-bottom:50px;" />
    
    
	<h1>Messaging in real time (WebRTC)</h1>

    <p>This API allow you to exchange message between mutiple page connexted to the same robot with API.</p>
    
    <p><strong>All message are delete after 1 minute automatically.<br />
    A message is automatically deleted when it's received by the recipient</strong></p>

	<h2 id="events">Events</h2>
    
    <p><a href="reference.php#messaging_events">The complete list of events</a></p>
    <p>You can attach a handler to an event from messaging system on the initialising of the API<br />
    In this example, we received all message send in WebRTC and display the data in an alert box.</p>
    
    <pre class="line-numbers"><code class="language-js">$(document).ready(function(e) {
        wycaApi = new WycaAPI({
            'api_key':'YOUR API KEY',
            'id_site':'YOUR SITE ID',
            'id_robot':'YOUR ROBOT ID / not_robot',

            onNewWebRTCMessage:function(message){ alert(JSON.stringify(message)); },
            });
     });</code></pre>


	<h2 id="functions">Functions</h2>
    
    <p><a href="reference.php#messaging_functions">The complete list of functions</a></p>
    <p>In this example, we send data <code>data of the message</code> to the other page connected in WebRTC</p>
    
    <pre class="line-numbers"><code class="language-js">wycaApi.SendWebRTCMessage('data of the message');</code></pre>
    


</div>
</div>
</div>

</div>

<?php include (dirname(__FILE__).'/../template/footer.php');?>    
    	