<header id="header" class="grid__header">
    <div class="row theme-header">
        <a href="<?php echo $arrContent['head']['urlMain'] . $arrContent['head']['lang'] . '/'; ?>home/" class="button button--regular button--regular--proportional button--grey" aria-label="<?php echo $arrContent['head']['translation']['home']; ?>">
            <svg class="icon icon--regular icon--grey">
                <use xlink:href="./assets/img/icon.svg#home"></use>
            </svg>
        </a>
        <div class="form__field">
            <label class="mobile-hide text" for="translationSelect"><?php echo $arrContent['head']['translation']['language']; ?>:</label>
            <select id="translationSelect" class="form__fill" aria-label="<?php echo $arrContent['head']['translation']['language']; ?>">
                <?php
                $string = '';
                foreach (getUrArrLanguage() as $key => &$valeu) {
                    $lang = $valeu['lang'];
                    $string .= '<option value="' . $lang . '" data-url="' . $arrContent['head']['url' . ucfirst($lang)] . '">' . $arrContent['head']['translation'][$lang] . '</option>';
                }
                echo $string;
                ?>
            </select>
            <div class="theme-version">
                <span class="text">v: 2.0.0</span>
                <a href="<?php echo $arrContent['head']['urlBackEnd']; ?>" target="_blank" rel="noopener" class="button button--regular button--green">
                    Download (Github)
                </a>
            </div>
        </div>
    </div>
</header>