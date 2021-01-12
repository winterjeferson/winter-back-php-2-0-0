<?php
include __DIR__ . '/../shared/head.php';
include __DIR__ . '/../shared/loading.php';
?>
<main class="grid">
    <?php
    include __DIR__ . '/../shared/header.php';
    ?>
    <section id="mainMenu" class="grid__menu">
        <?php
        include __DIR__ . '/../shared/menu.php';
        ?>
    </section>
    <section id="mainContent" class="grid__content page">
        <div id="<?php echo $arrDefinedVars['data']['content']['id'] ?>" class="row page">
            <?php
            include  __DIR__ . '/../' . $arrDefinedVars['data']['content']['folder'] . '/' . $arrDefinedVars['data']['content']['file'] . '.php';
            ?>
        </div>
    </section>
    <?php
    include __DIR__ . '/../shared/signature.php';
    ?>
</main>
<?php
include __DIR__ . '/../shared/footer.php';
?>