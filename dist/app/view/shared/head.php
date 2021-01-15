<?php
$urlFrontEnd = $arrContent['head']['urlFrontEnd'];
$urlBackEnd = $arrContent['head']['urlMain'];
$translation = $arrContent['head']['translation'];
$lang = $arrContent['head']['lang'];
$templateFolder = $arrDefinedVars['data']['content']['folder'];
$templateFile = $arrDefinedVars['data']['content']['file'];
$templateId = $arrDefinedVars['data']['content']['id'];
?>

<!DOCTYPE html>
<html lang="<?php echo $lang ?>">

<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="format-detection" content="telephone=yes" />
    <meta name="msapplication-tap-highlight" content="no" />
    <meta name="viewport" content="initial-scale=1,maximum-scale=5,user-scalable=yes,width=device-width">
    <base href="<?php echo $urlBackEnd ?>">

    <meta name="theme-color" content="#000000" />
    <meta name="msapplication-TileColor" content="#000000" />

    <link rel="shortcut icon" href="<?php echo $urlFrontEnd .  'assets/img/logo/16-16.png' ?>" />

    <link rel="apple-touch-icon" href="<?php echo $urlFrontEnd . 'assets/img/logo/57-57.png' ?>" />
    <link rel="apple-touch-icon" sizes="72x72" href="<?php echo $urlFrontEnd . 'assets/img/logo/72-72.png' ?>" />
    <link rel="apple-touch-icon" sizes="114x114" href="<?php echo $urlFrontEnd . 'assets/img/logo/114-114.png' ?>" />

    <meta name="msapplication-TileImage" content="<?php echo $urlFrontEnd . 'assets/img/logo/144-144.png' ?>" />

    <meta name="application-name" content="<?php echo $translation['metaTitle'] ?>" />
    <title><?php echo $translation['metaTitle'] ?></title>
    <meta name="description" content="<?php echo $translation['metaDescription'] ?>" />
    <meta name="author" content="<?php echo $translation['metaAuthor'] ?>" />
    <meta name="keywords" content="<?php echo $translation['metaKeywords'] ?>" />

    <meta property="og:image" content="<?php echo $urlBackEnd . 'assets/img/logo/600-315.png' ?>" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="600" />
    <meta property="og:image:height" content="315" />
    <meta property="og:locale" content="<?php echo $lang ?>" />
    <meta property="og:url" content="<?php echo $urlBackEnd ?>" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="<?php echo $translation['metaTitle'] ?>" />
    <meta property="og:site_name" content="<?php echo $translation['metaTitle'] ?>" />
    <meta property="og:description" content="<?php echo $translation['metaDescription'] ?>" />

    <link href="<?php echo $urlFrontEnd . 'assets/css/wf-plugin.css' ?>" rel="stylesheet">
    <link href="<?php echo $urlFrontEnd . 'assets/css/wf-theme.css' ?>" rel="stylesheet">
    <link href="<?php echo $urlBackEnd  . 'assets/css/wb-theme.css' ?>" rel="stylesheet">
</head>

<body class="overflow-hidden">