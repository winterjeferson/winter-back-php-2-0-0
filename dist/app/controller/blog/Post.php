<?php

namespace App\Controller\Blog;

require_once __DIR__ . '/../Main.php';

class Post extends \App\Controller\Main
{
    public function __construct()
    {
    }

    function getModel()
    {
        $data = [
            ['id' => 'head', 'folder' => 'shared', 'file' => 'head'],
            ['id' => 'post', 'folder' => 'blog', 'file' => 'post'],
        ];

        return $this->renderModel($data);
    }

    function getView($model)
    {
        $data = [
            'template' => ['file' => 'default'],
            'content' => ['id' => 'pageBlogPost', 'folder' => 'blog', 'file' => 'post', 'model' => $model],
        ];

        return $this->renderView($data);
    }
}
