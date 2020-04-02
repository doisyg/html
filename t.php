<?php

error_reporting(E_ALL);
ini_set("display_errors", 1); 

function runBashFunction($bashfunction) {
    $descriptorspec = array(
         0 => array("pipe", "r"),    // stdin is a pipe that the child will read from
         1 => array("pipe", "w"),    // stdout is a pipe that the child will write to
         2 => array("pipe", "w") // stderr is a pipe too
    );

    $cwd = '.';
    $env = array();

    $process = proc_open('bash', $descriptorspec, $pipes, $cwd, $env);

    if (is_resource($process)) {
            fwrite($pipes[0], "source /opt/ros/melodic/setup.bash\n");
            fwrite($pipes[0], "source /home/elodie/Elodie_ws/devel/setup.bash\n");
            fwrite($pipes[0], "$bashfunction\n");
            fclose($pipes[0]);

            $output = stream_get_contents($pipes[1]);
            $error = stream_get_contents($pipes[2]);
            fclose($pipes[1]);
            fclose($pipes[2]);

            // It is important that you close any pipes before calling
            // proc_close in order to avoid a deadlock
            //

            $return_value = proc_close($process);

	print_r($error);
	print_r($return_value);

            //note, $error and $return_value are discarded
            return $output;
    }
    return null;
}

echo 'Debut<br>';


$value = runBashFunction("rosservice call /wyca_mapping/stop");
var_dump($value);

?>

