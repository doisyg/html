<?php
if (isset($_GET['popup']) && $_GET['popup']==1) { include_once(dirname(__FILE__).'/footer-ajax.php'); }
else {
?>			
    	</div>
    </div>
    
</div>
    
    <a href="#popupAlerte" id="lienPopupAlerte" class="fancyboxAlerte"></a>
    <div style="display:none;">
    	<div id="popupAlerte"><?php
			/*
			foreach ($sites as $site_t)
			{
				?><div id="nom_<?php echo $site_t->id_site;?>" style="min-width:400px; min-height:300px; text-align:center; display:none;">
					<h1 style="margin-bottom:40px;"><?php echo $site_t->nom;?></h1>
					
                    <a id="alerteVideo_<?php echo $site_t->id_site;?>" href="#" class="btn_video btn col-md-6" style="display:inline-block; float:none; font-size:80px; display:none;">
					<i class="fa fa-film"></i>
					</a>
					<a id="alerteAudio_<?php echo $site_t->id_site;?>" href="#" class="btn_audio btn col-md-6" style="display:inline-block; float:none; font-size:80px; display:none;">
					<i class="fa fa-phone"></i>
                    </a>
                    <br><span id="texte_audio_<?php echo $site_t->id_site;?>" style="display:none;">Répondez en premier sur votre téléphone</span>
					<div style="clear:both;"></div>
                </div>
				<?php
			}
			*/
			?>
        </div>
	</div>
    
    
    <div style="display:none;">
	<a href="#attenteVisioFromAdmin" class="fancybox" id="lien_attente_VisioFromAdmin"></a>
	<div id="attenteVisioFromAdmin" style="background-color:#559CB4; color:#FFFFFF; text-align:center; width:400px; padding:50px;">

        <i class="fa fa-gear fa-spin fa-3x"></i>
        
        <h2><?php echo __('Action in progress');?></h2>
        
    </div>
    
    <script src="<?php echo $_CONFIG['URL'];?>developers/js/bootstrap.min.js"></script>

	<script language="JavaScript" src="<?php echo $_CONFIG['URL'];?>developers/js/jquery-ui-1.11.4.custom/jquery-ui.min.js"></script>
    <script src="<?php echo $_CONFIG['URL'];?>developers/js/datatables/jquery.dataTables.js"></script>
    <script src="<?php echo $_CONFIG['URL'];?>developers/js/jquery.tablesorter/jquery.tablesorter.min.js"></script>
    <script>
    /*** Handle jQuery plugin naming conflict between jQuery UI and Bootstrap ***/
    $.widget.bridge('uibutton', $.ui.button);
    $.widget.bridge('uitooltip', $.ui.tooltip);
    </script>

    
<script>
$(function () {
	
	$('[data-toggle="tooltip"]').tooltip({'placement': 'bottom'});
	
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
			
			if ($("#user-status-badge").hasClass('badge navbar-badge-offline'))
			{
				$("#user-status-badge").removeClass('navbar-badge-offline')
									   .addClass('navbar-badge-online')
									   .text('Online');
				$('#user-status').html('<a href="#"><i id="navbar-badge" class="fa fa-refresh" aria-hidden="true"></i> become offline <span class="sr-only">(current)</span></a>');
				isonline = 1;
				currentUserIsOnline = true;
			}
			else
			{
				$("#user-status-badge").removeClass('navbar-badge-online')
									   .addClass('navbar-badge-offline')
									   .text('Offline');
				$('#user-status').html('<a href="#"><i id="navbar-badge" class="fa fa-refresh" aria-hidden="true"></i> become online <span class="sr-only">(current)</span></a>');
				isonline = 0;
				currentUserIsOnline = false;
			}
			
			jQuery.ajax({
                    url: 'ajax/setOnline.php',
                    type: "post",
                    data: { 
                            'isonline':isonline
                        },
                    error: function(jqXHR, textStatus, errorThrown) {
                        },
                    success: function(data, textStatus, jqXHR) {
                        }
                });
		}
    );	
});
</script>

    <script>
	function ConfirmDelete(lien)
	{
		if (confirm('<?php echo __('Etes vous sûr de vouloir supprimer cet élément ?');?>'))
			location.href = lien;
	}
		
	jQuery(document).ready(function() {
			
		$(".close-yellow").click(function () {
			$(this).parent().parent().parent().parent().parent().fadeOut("slow");
		});
		$(".close-red").click(function () {
			$(this).parent().parent().parent().parent().parent().fadeOut("slow");
		});
		$(".close-blue").click(function () {
			$(this).parent().parent().parent().parent().parent().fadeOut("slow");
		});
		$(".close-green").click(function () {
			$(this).parent().parent().parent().parent().parent().fadeOut("slow");
		});
		
		setTimeout(function(){ $(".close-green").click(); }, 3000);
	});
	</script>
  </body>
</html>
<?php }?>