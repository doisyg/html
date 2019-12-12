
    <aside id="sidebar-left" class="sidebar-left">
    
        <div class="sidebar-header">
            <div class="sidebar-title"></div>
            <div class="sidebar-toggle hidden-xs" data-toggle-class="sidebar-left-collapsed" data-target="html" data-fire-event="sidebar-left-toggle">
                <i class="fa fa-bars" aria-label="Toggle sidebar"></i>
            </div>
        </div>
    
        <div class="nano">
            <div class="nano-content">
                <nav id="menu" class="nav-main" role="navigation">
                    <ul class="nav nav-main">
                        <li class="<?php echo  $sectionMenu=='home'?'nav-active':'';?>">
                            <a href="<?php echo $_CONFIG['URL'];?>index.php">
                                <i class="fa fa-home" aria-hidden="true"></i>
                                <span><?php echo __('Dashboard');?></span>
                            </a>
                        </li>
                        <li class="<?php echo  $sectionMenu=='home'?'nav-active':'';?>">
                            <a href="<?php echo $_CONFIG['URL'];?>tasks_queue.php">
                                <i class="fa fa-list" aria-hidden="true"></i>
                                <span><?php echo __('Tasks queue');?></span>
                            </a>
                        </li>
                        <?php if ($userConnected->CanDo('tasks', '', 'view')){?>
                        <li class="<?php echo  $sectionMenu=='tasks'?'nav-active':'';?>">
                            <a href="<?php echo $_CONFIG['URL'];?>tasks.php">
                                <i class="fa fa-share-alt" aria-hidden="true"></i>
                                <span><?php echo __('Tasks');?></span>
                            </a>
                        </li>
                        <?php }?>
                        <?php if ($userConnected->CanDo('maps', '', 'view')){?>
                        <li class="<?php echo  $sectionMenu=='maps'?'nav-active':'';?>">
                            <a href="<?php echo $_CONFIG['URL'];?>maps.php">
                                <i class="fa fa-map-marker" aria-hidden="true"></i>
                                <span><?php echo __('Maps');?></span>
                            </a>
                        </li>
                        <?php }?>         
                        <?php if ($userConnected->CanDo('setup', '', 'view')){?>
                        <li class="nav-parent <?php echo  $sectionMenu=='setup'?'nav-expanded nav-active':'';?>">
                            <a>
                                <i class="fa fa-tasks" aria-hidden="true"></i>
                                <span><?php echo __('Setup');?></span>
                            </a>
                            <ul class="nav nav-children">
                            	<?php 
								if ($userConnected->CanDo('setup', 'sites', 'view')){?>
                                <li class="<?php echo  $sectionMenu=='setup' && $sectionSousMenu=='sites'?'nav-active':'';?>">
                                    <a href="<?php echo $_CONFIG['URL'];?>sites.php">
                                    	<i class="fa fa-building-o" aria-hidden="true"></i>
	                                	<span><?php echo __('Sites');?></span>
                                    </a>
                                </li>
                                <?php
								}
								if ($userConnected->CanDo('setup', 'users', 'view')){?>
                                <li class="<?php echo  $sectionMenu=='setup' && $sectionSousMenu=='users'?'nav-active':'';?>">
                                    <a href="<?php echo $_CONFIG['URL'];?>users.php">
                                    	<i class="fa fa-users" aria-hidden="true"></i>
	                                	<span><?php echo __('Users management');?></span>
                                    </a>
                                </li>
                                <?php }
								if ($userConnected->CanDo('setup', 'configuration', 'view')){?>
                                <li class="<?php echo  $sectionMenu=='setup' && $sectionSousMenu=='configuration'?'nav-active':'';?>">
                                    <a href="<?php echo $_CONFIG['URL'];?>robot_configs.php">
                                    	<i class="fa fa-gears" aria-hidden="true"></i>
	                                	<span><?php echo __('Configurations');?></span>
                                    </a>
                                </li>
                                <?php }
								if ($userConnected->CanDo('setup', 'export', 'view')){?>
                                <li class="<?php echo  $sectionMenu=='setup' && $sectionSousMenu=='export'?'nav-active':'';?>">
                                    <a href="<?php echo $_CONFIG['URL'];?>export.php">
                                    	<i class="fa fa-upload" aria-hidden="true"></i>
	                                	<span><?php echo __('Import / Export');?></span>
                                    </a>
                                </li>
                                <?php }?>
                            </ul>
                        </li>
                        <?php 
						}
						
						?>
                        <hr class="separator" />
                        <?php 
						if ($userConnected->CanDo('traduction', '', 'view')){?>
                        <li class="<?php echo  $sectionMenu=='traduction'?'nav-active':'';?>">
                            <a href="<?php echo $_CONFIG['URL'];?>traduction.php">
                                <i class="fa fa-language" aria-hidden="true"></i>
                                <span><?php echo __('Translation');?></span>
                            </a>
                        </li>
                        <?php 
						}
						?>
                        <hr class="separator" />
                        <li>
                            <a href="<?php echo $_CONFIG['URL'];?>logout.php">
                                <i class="fa fa-power-off" aria-hidden="true"></i>
                                <span><?php echo __('Logout');?></span>
                            </a>
                        </li>
                    </ul>
                </nav>
                
                <ul class="notifications" style="margin-left:20px;">
					<?php
                    $langues = Lang::GetLangs();
                    foreach ($langues as $lang)
                    {
                        ?>
                        <li>
                            <a href="<?php echo ($_SERVER['QUERY_STRING']!='')?$_SERVER['REQUEST_URI'].'&':'?';?>lang=<?php echo $lang->iso;?>" class=" notification-icon"><img src="<?php echo $_CONFIG['URL'];?>assets/images/lang/<?php echo $lang->iso;?>.jpg" style="padding-top:5px;" /></a>
                        </li><?php
                    }
                    ?>
                </ul>
        </div>
    
    </aside>
    <!-- end: sidebar -->