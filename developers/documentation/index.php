<?php 
require_once ('../../config/initSite.php');
if (!isset($_SESSION["id_developer"])) { header("location:../login.php"); }

$sectionMenu = "api_documentation";

$currentPage = 'getstarted';
include (dirname(__FILE__).'/../template/header.php');
?>
<div class="row">
<?php include (dirname(__FILE__).'/template/colonne_gauche.php');?>

    <div class="col-md-12">
    <div class="row call-panel">
    <div class="panel-content">
        <h1>Get started</h1>
    
        <h2>Requirement</h2>
        <p>The HTML page and all elements of this need to be call with SSL certificate (<code>https</code>)</p>
        <p>For best results, we advise you to exclusively use the <code>Chrome browser</code></p>
    
        <h2>Adding JS files to your web pages</h2>
        
        <pre class="line-numbers"><code class="language-html">&lt;!DOCTYPE html>
    &lt;html>
        &lt;head>
            ...
            &lt;script src="https://www.wyca-solutions.com/API/extern/jquery-1.11.3.min.js">&lt;/script>
            &lt;script src="https://www.wyca-solutions.com/API/extern/roslib.js">&lt;/script>
            &lt;script src="https://www.wyca-solutions.com/API/webrtc.wyca2.min.js">&lt;/script>
            &lt;script src="https://www.wyca-solutions.com/API/wyca_api.latest.min.php?id_site={YOUR_SITE_ID}&api_key={YOUR_API_KEY}">&lt;/script>
            ...
        &lt;/head>
        &lt;body>
            ...
        &lt;/body>
    &lt;/html></code></pre>
    
    
        <h2>Init API</h2>
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
                'id_robot':'YOUR ROBOT ID / not_robot'
                });
            
            wycaApi.init();
         });
        </code></pre>
              </div>
              
              <div class="tab-pane" id="init_api_params" role="tabpanel" style="padding:20px;">
                <p>You can get the value of this 4 parameters in your developpers account :
                <a href="https://www.wyca-solutions.com/developers/" target="_blank">https://www.wyca-solutions.com/developers/</a>
                <ul>
                    <li><code>YOUR API KEY</code> : Your unique API key for authentification</li>
                    <li><code>YOUR SITE ID</code> : An unique ID for your location</li>
                    <li><code>YOUR ROBOT ID / not_robot</code> : An unique ID for your robot for the page launch on robot, <code>not_robot</code> for the page launch on other equipement</li>
                </ul>
              </div>
            </div>
        </div>
    
    </div>
    </div>
    </div>
</div>

<?php include (dirname(__FILE__).'/../template/footer.php');?>