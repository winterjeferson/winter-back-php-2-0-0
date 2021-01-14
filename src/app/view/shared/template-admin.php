<?php
include __DIR__ . '/../shared/head.php';
include __DIR__ . '/../shared/loading.php';
include __DIR__ . '/../admin/admin-layout.php';
?>
<main class="grid">
    <?php
    include __DIR__ . '/../shared/header.php';
    ?>
    <section id="mainMenu" class="grid-menu">
        <?php
        include __DIR__ . '/../shared/menu.php';
        ?>
    </section>
    <section id="mainContent" class="grid-content page">
        <div id="<?php echo $arrDefinedVars['data']['content']['id'] ?>" class="row">
            <div class="user">
                <?php
                $wellcome = $arrContent['head']['translation']['wellcome'];
                $name = $arrContent['head']['user']['name'];

                echo  $wellcome . ' <strong>' . $name . '</strong>'
                ?>!
            </div>
        </div>
        <div class="button-wrapper row center tab tab--blue" id="pageAdminMenu">
            <?php
            $string = '';

            foreach ($arrContent['admin']['menu'] as $key => &$value) {
                $string .= '
                        <a href="' . $arrContent['head']['urlMain'] . $arrContent['head']['lang'] . '/' . 'admin/' . $value['id'] . '/" data-id="btAdmin' . ucfirst($value['id']) . '" class="button button--regular button--blue">
                            ' . $arrContent['head']['translation'][$value['translation']] . '
                        </a>
                    ';
            }

            echo removeLineBreak($string);
            ?>
        </div>
        <div class="row">
            <?php
            include  __DIR__ . '/../' . $arrDefinedVars['data']['content']['folder'] . '/' . $arrDefinedVars['data']['content']['file'] . '.php';
            ?>
        </div>
        </div>
    </section>
    <?php
    include __DIR__ . '/../shared/signature.php';
    ?>
</main>
<?php
include __DIR__ . '/../shared/footer.php';
?>