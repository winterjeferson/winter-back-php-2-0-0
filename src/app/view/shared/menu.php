<div class="theme-menu button-wrapper">
    <button type="button" class="button button--regular button--regular--proportional button--grey toggle-menu" aria-label="<?php echo $arrContent['head']['translation']['menu']; ?>">
        <svg class="icon icon--regular">
            <use xlink:href="./assets/img/icon.svg#menu"></use>
        </svg>
    </button>
    <nav class="column toggle-menu__content">
        <?php
        $string = '';
        $arr = [
            ['id' => 'admin', 'translation' => 'administrativePanel'],
            ['id' => 'blog', 'translation' => 'blog'],
            ['id' => 'form', 'translation' => 'form'],
        ];

        foreach ($arr as $key => &$value) {
            $href = $arrContent['head']['urlMain'] . $arrContent['head']['lang'] . '/' . $value['id'] . '/';
            $name = $arrContent['head']['translation'][$value['translation']];
            $string .= '
                        <a href="' . $href . '" data-id="' . $value['id'] . '" class="button button--small button--blue">
                            ' . $name . '
                        </a>
                    ';
        }

        foreach ($arrContent['head']['menuMain'] as $key => &$value) {
            $href = $arrContent['head']['urlMain'] . $arrContent['head']['lang'] . '/page/content/' . $value['id'] . '/' . $value['url'] . '/';
            $name = $value['menu'];
            if ($name != '') {
                $string .= '
                            <a href="' . $href . '" data-id="' . $value['id'] . '" class="button button--small button--purple">
                                ' . $name . '
                            </a>
                        ';
            }
        }
        echo removeLineBreak($string);
        ?>
    </nav>
</div>