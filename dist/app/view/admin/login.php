<div class="container">
    <form class="form form--black">
        <h1 class="page__title"><?php echo $translation['login'] ?></h1>
        <div class="row form__field">
            <label class="form__label" for="pageAdminLoginUser"><?php echo $translation['email']; ?></label>
            <input class="form__fill" id="pageAdminLoginUser" type="email" maxlength="40" placeholder="<?php echo $translation['email']; ?>" value="email@email.com">
        </div>
        <div class="row form__field">
            <label class="form__label" for="pageAdminLoginPassword"><?php echo $translation['password']; ?></label>
            <input class="form__fill" id="pageAdminLoginPassword" type="password" value="123456" maxlength="40" placeholder="<?php echo $translation['password']; ?>">
        </div>
        <div class="row form__field">
            <button type="button" class="button button--regular button--blue" id="pageAdminLoginBt">
                Login
            </button>
        </div>
    </form>
</div>