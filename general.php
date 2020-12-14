<div id="connexion_robot">
	<h2><?= __('Connection with the robot')?></h2>
    
    <i class="fa fa-spinner fa-pulse"></i>
</div>

<div id="alert_wyca">
	<section class="panel panel-danger">
        <header class="panel-heading">
            <h2 class="panel-title" style="text-align:center; font-size:50px;"><i class="fa fa-remove"></i></h2>
        </header>
        <div class="panel-body" style="text-align:center; font-size:24px; line-height:36px;">
            <p class="content"></p>
            <a id="bCloseAlertWyca" href="#" class="btn btn-default">OK</a>
        </div>
    </section>
</div>

<div id="warning_wyca">
	<section class="panel panel-warning">
        <header class="panel-heading">
            <h2 class="panel-title" style="text-align:center; font-size:50px;"><i class="fa fa-exclamation-triangle"></i></h2>
        </header>
        <div class="panel-body content" style="text-align:center; font-size:24px; line-height:36px;">
            <p class="content"></p>
    		<a id="bCloseWarningWyca" href="#" class="btn btn-default">OK</a>
        </div>
    </section>
</div>

<div id="success_wyca">
	<section class="panel panel-success">
        <header class="panel-heading">
            <h2 class="panel-title" style="text-align:center; font-size:50px;"><i class="fa fa-thumbs-up"></i></h2>
        </header>
        <div class="panel-body content" style="text-align:center; font-size:24px; line-height:36px;">
            <p class="content"></p>
    		<a id="bCloseSuccessWyca" href="#" class="btn btn-default">OK</a>
        </div>
    </section>
</div>

<div id="success_info_wyca">
	<section class="panel panel-success">
        <header class="panel-heading">
            <h2 class="panel-title" style="text-align:center; font-size:50px;"><i class="fa fa-info"></i></h2>
        </header>
        <div class="panel-body content" style="text-align:center; font-size:24px; line-height:36px;">
            <p class="content"></p>
    		<a id="bCloseSuccessInfoWyca" href="#" class="btn btn-default">OK</a>
        </div>
    </section>
</div>


<div class="modal fade" id="modalConfirmDelete" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog" role="dialog">
		<div class="modal-content">
			<div class="modal-header">
				<div class="actions mh100vh_55">
					<section class="panel panel-danger">
						<header class="panel-heading">
							<h2 class="panel-title" style="text-align:center; font-size:50px;"><i class="fa fa-question-circle"></i></h2>
						</header>
						<div class="panel-body" style="text-align:center; font-size:24px; line-height:36px;">
							<h3><?= __('Are you sure to delete this element ?')?></h3>
						</div>
					</section>
					<div style="clear:both;"></div>
					<a href="#" class="btn btn-default btn_footer_left btn_50" data-dismiss="modal" ><?php echo __('Abort');?></a>
					<a href="#" id="bModalConfirmDeleteOk" class="btn btn-danger btn_footer_right btn_50" data-dismiss="modal"><?php echo __('Delete');?></a>
				</div>
			</div>
		</div>
	</div>
</div>


