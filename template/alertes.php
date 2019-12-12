<?php
if (isset($_GET['notallow']))
{
	?>
	<div class="row">
		<div class="alert alert-danger">
			<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
			<p class="m-none text-semibold h6"><?php echo __('Vous n\'êtes pas autorisé à faire cette action');?></p>
		</div>
	</div>
	<?php
}
?>

<?php
if (isset($_GET['ok']))
{
	?>
	<div class="row">
		<div class="alert alert-success">
			<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
			<p class="m-none text-semibold h6"><?php echo __('Modification effectuée');?></p>
		</div>
	</div>
	<?php
}
?>


<?php
if (isset($_GET['error']))
{
	?>
	<div class="row">
		<div class="alert alert-danger">
			<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
			<p class="m-none text-semibold h6"><?php echo $_GET['error'];?></p>
		</div>
	</div>
	<?php
}
?>
