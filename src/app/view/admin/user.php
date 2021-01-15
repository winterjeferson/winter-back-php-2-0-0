<div class="container">
    <div class="row">
        <h2 class="page__title"><?php echo $arrContent['head']['translation']['register']; ?></h2>
        <form class="form form--grey" data-id="formRegister">
            <div class="row">
                <div class="column form__field">
                    <label class="form__label" for="input_name"><?php echo $arrContent['head']['translation']['name']; ?>:</label>
                    <input class="form__fill" type="text" value="" data-id="name" id="input_name">
                </div>
                <div class="column form__field">
                    <label class="form__label"><?php echo $arrContent['head']['translation']['email']; ?>:</label>
                    <input class="form__fill" type="text" value="" data-id="email">
                </div>
                <div class="column form__field">
                    <label class="form__label"><?php echo $arrContent['head']['translation']['password']; ?>:</label>
                    <input class="form__fill" type="password" value="" placeholder="" data-id="password">
                </div>
                <div class="column form__field">
                    <label class="form__label"><?php echo $arrContent['head']['translation']['permission']; ?>:</label>
                    <select class="form__fill" aria-label="select" data-id="permission">
                        <?php
                        $string = '';

                        foreach ($arrContent['user']['permission'] as $key => &$valuePermission) {
                            $string .= '<option value="' . $valuePermission['value'] . '">' . $valuePermission['text'] . '</option>';
                        }

                        echo $string;
                        ?>
                    </select>
                </div>
            </div>
            <div class="row">
                <button type="button" class="button button--regular button--blue" data-id="send">
                    <?php echo $arrContent['head']['translation']['register']; ?>
                </button>
            </div>
        </form>
    </div>
    <div class="row">
        <?php
        $action = 'active';
        include __DIR__ . '/user-list.php';
        $action = 'inactive';
        include __DIR__ . '/user-list.php';
        ?>
    </div>
</div>