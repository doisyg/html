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
	<h1>Video</h1>

    
    <p>This API allow you to to create a chat video.</p>
    
    <p>We recommend that you use the Google Chrome browser for better video performance.</p>
    
    <p>A page can publish only one video stream. To publish the 2 video streams of the robot (navigation camera and camera on the client side), you must open 2 pages.</p>
    
    <h2 id="options">Options</h2>
    
    
    <div class="tabs">
        <ul class="nav nav-tabs">
          <li role="presentation" class="active"><a data-toggle="tab" href="#init_api_js">Javascript</a></li>
          <li role="presentation"><a data-toggle="tab" href="#init_api_params">Parameters</a></li>
        </ul>
            
        <div class="tab-content">
          <div class="tab-pane active" id="init_api_js" role="tabpanel">
            <pre class="line-numbers"><code class="language-js">$(document).ready(function(e) {
        wycaApi = new WycaAPI({
            'api_key':'YOUR API KEY',
            'id_site':'YOUR SITE ID',
            'id_robot':'YOUR ROBOT ID / not_robot',

            'webcam_name':'NAME_OF_THE_WEBCAM',
            'video_element_id':'webcam_local',
            'nick':'robot_1',
            'delay_no_reply': 30,
            'delay_lost_connexion': 30,
            'checkLostConnection':true,
            'with_audio': false,
            'with_video': false,
            'on_error_webcam_try_without':true
            });
     });</code></pre>
          </div>
          
          <div class="tab-pane" id="init_api_params" role="tabpanel" style="padding:20px;">
          	<ul>
            	<li><code>webcam_name</code> : the name of webcam : 'r200_nav' or 'r200_customer' on robot</li>
            	<li><code>video_element_id</code> : the ID of HTML element for display your video</li>
            	<li><code>nick</code> : a name to identify the differents video</li>
            	<li><code>delay_no_reply</code> : delay in seconds between the start call and the close connexion if no reply</li>
            	<li><code>delay_lost_connexion</code> : delay in seconds between the start of lost connexion and the close connexion</li>
            	<li><code>checkLostConnection</code> : check or not deconnection and no reply to close automticaly the session.</li>
            	<li><code>with_audio</code> : bool, use audio</li>
            	<li><code>with_video</code> : bool, use video</li>
            	<li><code>on_error_webcam_try_without</code> : bool, if use video and equipment error, try to restart call without video</li>
            </ul>
          </div>
        </div>
    </div>
    
    
	<h2 id="events">Events</h2>
    
    <p><a href="reference.php#video_events">The complete list of events</a></p>
    <p>The event <code>onVideoAdded</code> permit you to get the video from other video on the same <code>video_room</code></p>
    
    <pre class="line-numbers"><code class="language-js">$(document).ready(function(e) {
        wycaApi = new WycaAPI({
            'api_key':'YOUR API KEY',
            'id_site':'YOUR SITE ID',
            'id_robot':'YOUR ROBOT ID / not_robot',

            onVideoAdded: function (nick, video){
                    nick 	/* name to identify the differents video (video_nick option) */
                    video 	/* video HTML element to add on your HTML page */
                }
            });
     });</code></pre>

</div>
</div>
</div>

</div>

<?php include (dirname(__FILE__).'/../template/footer.php');?>    
    	