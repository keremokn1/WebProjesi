<?php
/**
 * Web Teknolojileri Projesi - Backend Kimlik Doğrulama
 * Geliştirici: Kerem Okan (Öğrenci No: B251210354)
 * Açıklama: login.html formundan gelen POST verilerini işler,
 * öğrenci e-postası ve şifresi ile eşleşme durumuna göre yönlendirme yapar.
 */

// Sisteme giriş yapabilecek geçerli öğrenci bilgileri
$dogruKullaniciAdi = "b251210354@sakarya.edu.tr";
$dogruSifre = "b251210354";

// 1. GÜVENLİK: Sayfaya sadece form üzerinden (POST metodu ile) gelinmesini sağla.
// Doğrudan URL yazılarak girilmeye çalışılırsa login sayfasına geri gönder.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../login.html?hata=1");
    exit;
}

// 2. VERİ TEMİZLEME: Formdan gelen verileri al. 
// Null coalescing (??) ile veri yoksa boş string ata, 'trim' ile baştaki/sondaki boşlukları sil.
$kullaniciAdi = trim($_POST["kullaniciAdi"] ?? "");
$sifre = trim($_POST["sifre"] ?? "");

// 3. BOŞ ALAN KONTROLÜ: Kullanıcı veya şifre boşsa işlemi durdur ve hata döndür.
if ($kullaniciAdi === "" || $sifre === "") {
    header("Location: ../login.html?hata=1");
    exit;
}

// 4. E-POSTA DOĞRULAMASI: Girilen e-posta sistemdekiyle eşleşmiyor mu?
if ($kullaniciAdi !== $dogruKullaniciAdi) {
    header("Location: ../login.html?hata=1");
    exit;
}

// 5. ŞİFRE DOĞRULAMASI VE BAŞARILI GİRİŞ
if ($sifre === $dogruSifre) {
    // Bilgiler doğruysa hoş geldin mesajının olduğu sayfaya yönlendir.
    header("Location: ./basarili.php");
    exit;
}

// Her ihtimale karşı (fallback) hata sayfasına yönlendirme
header("Location: ../login.html?hata=1");
exit;
?>