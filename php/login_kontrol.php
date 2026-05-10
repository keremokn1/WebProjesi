<?php
$dogruKullaniciAdi = "b251210354@sakarya.edu.tr";
$dogruSifre = "b251210354";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../login.html?hata=1");
    exit;
}

$kullaniciAdi = trim($_POST["kullaniciAdi"] ?? "");
$sifre = trim($_POST["sifre"] ?? "");

if (empty($_POST["kullaniciAdi"]) || empty($_POST["sifre"]) || $kullaniciAdi === "" || $sifre === "") {
    header("Location: ../login.html?hata=1");
    exit;
}

// E-posta birebir doğru değilse anında hata sayfasına dön.
if ($kullaniciAdi !== $dogruKullaniciAdi) {
    header("Location: ../login.html?hata=1");
    exit;
}

if ($sifre === $dogruSifre) {
    header("Location: ./basarili.php");
    exit;
}

header("Location: ../login.html?hata=1");
exit;
?>
