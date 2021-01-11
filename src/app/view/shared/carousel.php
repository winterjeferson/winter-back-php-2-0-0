<div class="carousel" data-current-slide="0" data-style="{{style}}" data-autoplay="true">
    <ul class="carousel__list">
        <?php
        $arr = [
            ['color' => 'cyan', 'translation' => 'pageInitialLanguage'],
            ['color' => 'orange', 'translation' => 'blog'],
            ['color' => 'red', 'translation' => 'friendlyUrl'],
        ];
        $string = '';

        foreach ($arr as $key => &$value) {
            $string .= '
                    <li class="carousel__item bg-' . $value['color'] . '">
                        <a href="javascript:;">
                            ' . $arrContent['head']['translation'][$value['translation']] . '
                        </a>
                    </li>
                    ';
        }

        echo removeLineBreak($string);
        ?>
    </ul>
    <div class="navigation-change button-wrapper row center">
        <button type="button" class="button button--big" data-id="previous" aria-label="<?php echo $arrContent['head']['translation']['previous']; ?>">
            <svg class="icon icon--extra-big">
                <use xlink:href="./assets/img/icon.svg#previous"></use>
            </svg>
        </button>
        <button type="button" class="button button--big" data-id="next" aria-label="<?php echo $arrContent['head']['translation']['next']; ?>">
            <svg class="icon icon--extra-big rotate-180">
                <use xlink:href="./assets/img/icon.svg#previous"></use>
            </svg>
        </button>
    </div>
    <div class="carousel__controller carousel__controller--over button-wrapper row center"></div>
</div>
{% endfor %}
{% for style in arrStyle %}
<h2 class="page__sub-title">{{style}} text</h2>
<div class="carousel" data-current-slide="0" data-style="{{style}}" data-autoplay="false">
    <ul class="carousel__list">
        {% for image in arrImage %}
        <li class="carousel__item">
            <span class="carousel__content">
                {{loop.index}} - Lorem ipsum dolor sit amet, consecttur adipscing elit. Proin ut ni
                diam. Nam ini pretium ligulas. Integersda dapibusa id quam non prium! Suspendisse
                sodalesa efficiturd nullsa, eta elementumds dui consequat eu. Curabituras interd
                augue,
                at dictuquam ullamcorperat.
            </span>
        </li>
        {% endfor %}
    </ul>
    <div class="navigation-change button-wrapper row center hide">
        <button type="button" class="button button--big" data-id="previous" aria-label="previous">
            <svg class="icon icon--extra-big">
                <use xlink:href="./assets/img/icon.svg#previous"></use>
            </svg>
        </button>
        <button type="button" class="button button--big" data-id="next" aria-label="next">
            <svg class="icon icon--extra-big rotate-180">
                <use xlink:href="./assets/img/icon.svg#previous"></use>
            </svg>
        </button>
    </div>
    <div class="carousel__controller button-wrapper row center"></div>
</div>