 <h2 class="page__title">
     <?php
        echo $translation['register'];
        ?>
 </h2>
 <form class="row form form--grey" data-id="formRegister">
     <div class="col-es-12 col-eb-4 form-field text-left">
         <label><?php echo $translation['menu']; ?></label>
         <input class="input" type="text" value="" maxlength="100" data-id="formFieldMenu">
     </div>
     <div class="col-es-12 col-eb-4 form-field text-left">
         <label><?php echo $translation['title']; ?></label>
         <input class="input" type="text" value="" maxlength="100" data-id="formFieldTitle">
     </div>
     <div class="col-es-12 col-eb-4 form-field text-left">
         <label><?php echo $translation['url']; ?></label>
         <input class="input" type="text" value="" maxlength="100" data-id="formFieldUrl">
     </div>
     <div class="col-es-12 form-field text-left">
         <label><?php echo $translation['content']; ?></label>
         <textarea id="fieldContent" data-id="fieldContent" aria-label="<?php echo $arrContent['page']['page']['content']; ?>"></textarea>
     </div>
 </form>