<?php
 $string = '';

 foreach ($query as $key => $value) {
     $thumbnail = !is_null($value['thumbnail']) && $value['thumbnail'] !== '' ? 'dynamic/blog/thumbnail/' . $value['thumbnail'] : 'blog-thumbnail.jpg';
     $dateEdit = $value['date_edit_' . $lang];
     $datePost = $value['date_post_' . $lang];
     $dateEditText = is_null($dateEdit) ? '' :  ' / ' . $translation['editedOn'] . ' ' . $dateEdit;
     $ternaryDate =  $datePost !==  $dateEdit ?  $dateEditText : '';
     $url = $lang . '/blog/post/' . $value['id'] . '/' . $value['url_' . $lang] . '/';
     $removeImage = strip_tags($value['content_' . $lang]);

     $string .= '
             <a href="' . $url . '" class="link">
                 <div class="blog-list-image">
                     <img class="img-responsive" data-src="assets/img/' . $thumbnail . '" alt="image" data-lazy-load="true">
                 </div>
                 <div class="blog-list-text">
                         <h2 class="blog-list-title">
                         ' . encode($value['title_' . $lang]) . '
                         </h2>
                     <p class="text">
                     ' . substr($removeImage, 0, 80) . '...
                     </p>
                     <small class="date">
                     ' . $value['date_post_' . $lang] . '
                     ' . $ternaryDate . '
                     </small>
                 </div>
             </a>
         ';
 }

 return $string;
?>