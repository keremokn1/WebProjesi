<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST" || empty($_POST)) {
    header("Location: ../iletisim.html?hata=Forma+dogrudan+erisilemez");
    exit;
}

function clean_value($value)
{
    return htmlspecialchars(trim((string)$value), ENT_QUOTES, "UTF-8");
}

$adSoyad = clean_value($_POST["adSoyad"] ?? "");
$eposta = clean_value($_POST["eposta"] ?? "");
$telefon = clean_value($_POST["telefon"] ?? "");
$sehir = clean_value($_POST["sehir"] ?? "");
$cinsiyet = clean_value($_POST["cinsiyet"] ?? "");
$mesaj = clean_value($_POST["mesaj"] ?? "");

$ilgiAlanlariRaw = $_POST["ilgiAlanlari"] ?? [];
if (!is_array($ilgiAlanlariRaw)) {
    $ilgiAlanlariRaw = [$ilgiAlanlariRaw];
}
$ilgiAlanlariTemiz = array_map("clean_value", $ilgiAlanlariRaw);
$ilgiAlanlari = !empty($ilgiAlanlariTemiz) ? implode(", ", $ilgiAlanlariTemiz) : "-";
?>
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Form Gönderim Bilgileri</title>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
    crossorigin="anonymous"
  />
</head>
<body class="bg-light">
  <main class="container py-5">
    <section class="card border-0 shadow-sm">
      <div class="card-body p-4 p-md-5">
        <h1 class="h3 mb-4">Form Gönderim Bilgileri</h1>

        <div class="table-responsive">
          <table class="table table-bordered table-striped align-middle mb-0">
            <tbody>
              <tr>
                <th scope="row" style="width: 220px;">Ad Soyad</th>
                <td><?php echo $adSoyad !== "" ? $adSoyad : "-"; ?></td>
              </tr>
              <tr>
                <th scope="row">E-posta</th>
                <td><?php echo $eposta !== "" ? $eposta : "-"; ?></td>
              </tr>
              <tr>
                <th scope="row">Telefon</th>
                <td><?php echo $telefon !== "" ? $telefon : "-"; ?></td>
              </tr>
              <tr>
                <th scope="row">Şehir</th>
                <td><?php echo $sehir !== "" ? $sehir : "-"; ?></td>
              </tr>
              <tr>
                <th scope="row">Cinsiyet</th>
                <td><?php echo $cinsiyet !== "" ? $cinsiyet : "-"; ?></td>
              </tr>
              <tr>
                <th scope="row">İlgi Alanları</th>
                <td><?php echo $ilgiAlanlari; ?></td>
              </tr>
              <tr>
                <th scope="row">Mesaj</th>
                <td><?php echo $mesaj !== "" ? nl2br($mesaj) : "-"; ?></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</body>
</html>
