<?php
$table = 'table' . ucfirst($action);
$list = 'list' . ucfirst($action);
$listSize = count($arrContent['user'][$list]);
$classDisplay = $listSize === 0 ? 'display-none' : '';
?>
<section class="content-padding <?php echo $classDisplay ?>">
    <div class="row">
        <h2 class="page__title">
            <?php echo $arrContent['head']['translation']['users']; ?> (<?php echo $arrContent['head']['translation'][$action . 's']; ?>)
        </h2>
    </div>
    <div class="row">
        <table class="table table--grey" data-id="<?php echo $table; ?>">
            <thead>
                <tr>
                    <th>Id</th>
                    <th><?php echo $arrContent['head']['translation']['name']; ?></th>
                    <th><?php echo $arrContent['head']['translation']['email']; ?></th>
                    <th><?php echo $arrContent['head']['translation']['permission']; ?></th>
                    <th><?php echo $arrContent['head']['translation']['actions']; ?></th>
                </tr>
            </thead>
            <tbody>
                <?php
                $string = '';

                foreach ($arrContent['user'][$list] as $key => &$value) {
                    $string .= '
                            <tr>
                                <td>' . $value['id'] . '</td>
                                <td>' . $value['name'] . '</td>
                                <td>' . $value['email'] . '</td>
                                <td>' . $arrContent['head']['translation'][$value['permission']] . '</td>
                                <td class="minimum">
                                    <div class="menu menu-horizontal">
                                        <ul>
                                            <li>' . buildHTMLBt('edit', $value['id']) . '</li>
                                            <li>' . buildHTMLBt($action, $value['id']) . '</li>
                                            <li>' . buildHTMLBt('delete', $value['id']) . '</li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                            ';
                }

                echo $string;
                ?>
            </tbody>
        </table>
    </div>
</section>