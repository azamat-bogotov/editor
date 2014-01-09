<?php

if (!isset($headerContent)) {
    exit("error");
}

echo $headerContent . $pageContent . '</body></html>';
exit();
?>