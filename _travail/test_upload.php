<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Bootstrap 4 Example</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
		<style>
			.btn{
				margin:5px auto;
			}
			ul{
				list-style: none;
			}
		</style>
	</head>
	<body>
	<form action="save_test_upload.php" method="POST" class="d-flex justify-content-center flex-column" style="max-width:400px;margin:0 auto">
		<input class="my-3" type="text" name="device" placeholder="Device">
		<input class="my-3" type="file" name="img" accept="image/png, image/jpeg">
		<input class="my-3" type="hidden" name="timestamp">
		<input type="submit" value="GO">
	</form>
	</body>
	<script>
		$('form').submit(function(){
			$('input[type="hidden"]').val(Date.now());
		});
	</script>
</html>