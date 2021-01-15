<h1 class="page__title"><?php echo $translation['register']; ?></h1>
<div class="card card-es card-grey">
    <form class="row form form-grey" data-id="formRegister">
        <div class="col-es-12 col-eb-6 form-field text-left">
            <label><?php echo $translation['title']; ?></label>
            <input type="text" data-id="fieldTitle" aria-label="<?php echo $translation['title']; ?>">
        </div>
        <div class="col-es-12 col-eb-6 form-field text-left">
            <label><?php echo $translation['friendlyUrl']; ?></label>
            <input type="text" data-id="fieldUrl" aria-label="<?php echo $translation['pageAdminBlogTitle']; ?>">
        </div>
        <div class="col-es-12 form-field text-left">
            <label><?php echo $translation['content']; ?></label>
            <textarea id="fieldContent" data-id="fieldContent" aria-label="<?php echo $translation['content']; ?>"></textarea>
        </div>
        <div class="col-es-12 col-eb-6 form-field text-left">
            <label><?php echo $translation['tags']; ?></label>
            <input type="text" data-id="fieldTag" aria-label="<?php echo $translation['pageAdminBlogTagsSeparator']; ?>" placeholder="<?php echo $translation['pageAdminBlogTagsSeparator']; ?>">
        </div>
        <div class="col-es-12 col-eb-6 form-field text-left">
            <label><?php echo $translation['author']; ?></label>
            <select aria-label="select" data-id="author">
                <?php
                $string = '';

                foreach ($arrContent['blog']['selectAuthor'] as $key => &$valueAuthor) {
                    $string .= '<option value="' . $valueAuthor['id'] . '">' . $valueAuthor['name'] . '</option>';
                }

                echo $string;
                ?>
            </select>
        </div>
        <div class="col-es-6 form-field text-left">
            <label><?php echo $translation['datePost']; ?></label>
            <input type="date" data-id="fieldDatePost" aria-label="<?php echo $translation['datePost']; ?>">
        </div>
        <div class="col-es-6 form-field text-left">
            <label><?php echo $translation['dateEdit']; ?></label>
            <input type="date" data-id="fieldDateEdit" aria-label="<?php echo $translation['dateEdit']; ?>">
        </div>
        <div class="col-es-12 form-field text-left" data-id="thumbnailWrapper">
            <label><?php echo $translation['thumbnail']; ?></label>
            <table class="table table-grey thumbnail-table">
                <thead>
                    <tr>
                        <th><?php echo $translation['image']; ?></th>
                        <th><?php echo $translation['name']; ?></th>
                        <th><?php echo $translation['menu']; ?></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="minimum">
                            <img src="assets/img/blog-thumbnail.jpg" data-id="thumbnail">
                        </td>
                        <td data-id="name">blog-thumbnail.jpg</td>
                        <td class="minimum">
                            <nav class="menu menu-horizontal text-right">
                                <ul>
                                    <li>
                                        <button type="button" class="bt bt-sm bt-blue" data-action="edit" title="<?php echo $translation['edit']; ?>">
                                            <span class="fa fa-pencil" aria-hidden="true"></span>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </form>
</div>