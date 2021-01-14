<?php
$listSize = count($arrContent['page']['list' . ucfirst($temp)]);
$classDisplay = $listSize === 0 ? 'display-none' : '';
?>
<div class="row <?php echo $classDisplay ?>">
    <h2 class="page__title">
        <?php echo $arrContent['head']['translation']['listing']; ?>
        (<?php echo $arrContent['head']['translation'][$temp . 's']; ?>)
    </h2>
    <table class="table table--grey" data-id="table<?php echo ucfirst($temp); ?>">
        <thead>
            <tr>
                <th>Id</th>
                <th><?php echo $arrContent['head']['translation']['menu']; ?></th>
                <th><?php echo $arrContent['head']['translation']['title']; ?></th>
                <th><?php echo $arrContent['head']['translation']['friendlyUrl']; ?></th>
                <th><?php echo $arrContent['head']['translation']['content']; ?></th>
                <th><?php echo $arrContent['head']['translation']['actions']; ?></th>
            </tr>
        </thead>
        <tbody>
            <?php
            $string = '';
            foreach ($arrContent['page']['list' . ucfirst($temp)] as $key => &$value) {
                $string .= buildListHTML($value, $arrContent['page']['language'], $temp);
            }

            echo removeLineBreak($string);
            ?>
        </tbody>
    </table>
</div>