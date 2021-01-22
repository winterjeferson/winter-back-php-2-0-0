<article class="container">
    <div class="row">
        <?php
        $title = !is_null($arrContent['post']) ? $arrContent['post']['postTitle'] : null;
        $author = !is_null($arrContent['post']) ? $arrContent['post']['postAuthor'] : null;
        $content = !is_null($arrContent['post']) ? $arrContent['post']['postContent'] : null;
        $tag = !is_null($arrContent['post']) ? $arrContent['post']['postTag'] : null;
        ?>
        <h1 class="page__title"><?php echo $title; ?></h1>
        <?php

        echo $content;
        if (!is_null($author)) {
            echo '<h4 class="author">' . $translation['author'] . ': ' . $author . '</h4>';
        }
        ?>
    </div>
    <?php
    if (!is_null($tag) && $tag !== '') {
        $explode = explode('#', $tag);
        $length = count($explode);
        $string = '
                <span class="row tag-title">Tags:</span>
                <div class="row tag-wrapper">
        ';

        for ($i = 0; $i < $length; $i++) {
            if ($explode[$i] !== '') {
                $string .= '
                    <div class="tag tag--black tag--small">
                        <a href="' . $arrContent['post']['tagLink'] . 'blog/tag/' . $explode[$i] . '" class="link link-grey">
                            <span class="text">' . $explode[$i] . '</span>
                        </a>
                    </div>
                    ';
            }
        }

        $string .= '
            </div>
        ';

        echo removeLineBreak($string);
    }
    ?>
</article>