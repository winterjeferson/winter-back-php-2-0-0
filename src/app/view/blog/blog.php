<div class="blog">
    <section id="pageBlogLastPost" class="blog__last-post">
        <div class="row">
            <h1 class="page__title"><?php echo $translation['lastPost']; ?></h1>
            <div class="blog-list">
                <?php
                if ($arrContent['blog']['listLastPost'] === '') {
                    echo '<p class="empty__list">' . $translation['emptyList'] . '</p>';
                } else {
                    $query = $arrContent['blog']['listLastPost'];
                    echo include __DIR__ . '/blog-item.php';
                }
                ?>
            </div>
            <?php
            if ($arrContent['blog']['btLoadMore']) {
                include __DIR__ . '/button-load-more.php';
            }
            ?>
        </div>
    </section>
    <section id="pageBlogMostViewed" class="blog__most-viwed">
        <div class="row">
            <h1 class="page__title"><?php echo $translation['mostViewed']; ?></h1>
            <div class="blog-list">
                <?php
                if ($arrContent['blog']['listMostViewed'] === '') {
                    echo '<p class="empty__list">' . $translation['emptyList'] . '</p>';
                } else {
                    $query = $arrContent['blog']['listMostViewed'];
                    echo  include __DIR__ . '/blog-item.php';
                }
                ?>
            </div>
            <?php
            if ($arrContent['blog']['btMostViewed']) {
                include __DIR__ . '/button-load-more.php';
            }
            include __DIR__ . '/tag-list.php';
            ?>
        </div>
    </section>
</div>