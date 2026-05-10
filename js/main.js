document.addEventListener("DOMContentLoaded", () => {
  initLoginPage();
  initMealsPage();
  initContactPage();
  initMotogpPage();

  if (window.AOS && typeof window.AOS.init === "function") {
    window.AOS.init({
      once: true,
      duration: 700,
      easing: "ease-out-cubic",
      offset: 80
    });
  }
});

function initLoginPage() {
  const hataAlert = document.getElementById("hataAlert");
  const loginForm = document.getElementById("loginForm");
  if (!hataAlert || !loginForm) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get("hata") === "1") {
    hataAlert.classList.remove("d-none");
  }

  loginForm.addEventListener("submit", (event) => {
    const kullaniciAdi = document.getElementById("kullaniciAdi")?.value.trim() || "";
    const sifre = document.getElementById("sifre")?.value.trim() || "";

    if (!kullaniciAdi || !sifre) {
      event.preventDefault();
      alert("Lütfen tüm alanları doldurun");
    }
  });
}

function initMealsPage() {
  const loadingState = document.getElementById("loadingState");
  const errorState = document.getElementById("errorState");
  const mealGrid = document.getElementById("mealGrid");
  const recipeModalElement = document.getElementById("recipeModal");
  const recipeModalLabel = document.getElementById("recipeModalLabel");
  const recipeModalBody = document.getElementById("recipeModalBody");
  const recipeYoutubeBtn = document.getElementById("recipeYoutubeBtn");

  if (!loadingState || !errorState || !mealGrid || !recipeModalElement || !window.bootstrap) {
    return;
  }

  const recipeModal = new window.bootstrap.Modal(recipeModalElement);

  function renderMeals(meals) {
    const firstEightMeals = meals.slice(0, 8);

    firstEightMeals.forEach((meal) => {
      const col = document.createElement("div");
      col.className = "col-sm-6 col-md-4 col-xl-3";

      col.innerHTML = `
        <article class="card info-card info-card-hover h-100">
          <img src="${meal.strMealThumb}" class="meal-img" alt="${meal.strMeal}">
          <div class="card-body d-flex flex-column">
            <h3 class="h5 mb-3">${meal.strMeal}</h3>
            <button type="button" class="btn btn-primary mt-auto recipe-detail-btn" data-id="${meal.idMeal}">
              Tarifi Gör
            </button>
          </div>
        </article>
      `;

      mealGrid.appendChild(col);
    });
  }

  function showModalLoading() {
    recipeModalLabel.textContent = "Tarif Detayı";
    recipeYoutubeBtn.classList.add("d-none");
    recipeYoutubeBtn.removeAttribute("href");
    recipeModalBody.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <div class="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></div>
        <span>Tarif yükleniyor...</span>
      </div>
    `;
    recipeModal.show();
  }

  async function fetchMealDetail(mealId) {
    showModalLoading();

    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      if (!response.ok) {
        throw new Error("Detay verisi alınamadı.");
      }

      const data = await response.json();
      const meal = data.meals && data.meals[0];

      if (!meal) {
        recipeModalLabel.textContent = "Tarif Bulunamadı";
        recipeModalBody.textContent = "Bu yemeğe ait detay bilgisi bulunamadı.";
        return;
      }

      recipeModalLabel.textContent = meal.strMeal;
      recipeModalBody.innerHTML = `
        <img src="${meal.strMealThumb}" class="img-fluid rounded mb-3" alt="${meal.strMeal}">
        <div class="d-flex flex-wrap gap-2 mb-3">
          <span class="badge bg-primary">Kategori: ${meal.strCategory || "Belirtilmemiş"}</span>
          <span class="badge bg-success">Mutfak: ${meal.strArea || "Belirtilmemiş"}</span>
        </div>
        <hr>
        <p class="mb-0" style="white-space: pre-line;">${meal.strInstructions || "Yapılış talimatı bulunamadı."}</p>
      `;

      if (meal.strYoutube) {
        recipeYoutubeBtn.href = meal.strYoutube;
        recipeYoutubeBtn.classList.remove("d-none");
      } else {
        recipeYoutubeBtn.classList.add("d-none");
        recipeYoutubeBtn.removeAttribute("href");
      }
    } catch (_error) {
      recipeModalLabel.textContent = "Hata";
      recipeModalBody.textContent = "Tarif detayı yüklenirken bir sorun oluştu.";
      recipeYoutubeBtn.classList.add("d-none");
      recipeYoutubeBtn.removeAttribute("href");
    }
  }

  async function fetchCleanBulkingMeals() {
    try {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast");
      if (!response.ok) {
        throw new Error("API yanıtı başarısız.");
      }

      const data = await response.json();
      const meals = data.meals || [];
      loadingState.classList.add("d-none");

      if (!meals.length) {
        errorState.textContent = "Gösterilecek tarif bulunamadı.";
        errorState.classList.remove("d-none");
        return;
      }

      renderMeals(meals);
      mealGrid.classList.remove("d-none");
    } catch (_error) {
      loadingState.classList.add("d-none");
      errorState.classList.remove("d-none");
    }
  }

  mealGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".recipe-detail-btn");
    if (!button) {
      return;
    }
    fetchMealDetail(button.dataset.id);
  });

  fetchCleanBulkingMeals();
}

function initContactPage() {
  const form = document.getElementById("iletisimForm");
  const btnNative = document.getElementById("btnNative");
  const btnVue = document.getElementById("btnVue");
  const adSoyadInput = document.getElementById("adSoyad");
  const telefonInput = document.getElementById("telefon");
  const queryErrorAlert = document.getElementById("queryErrorAlert");

  if (!form || !btnNative || !adSoyadInput || !telefonInput) {
    return;
  }

  const epostaRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const fieldMap = {
    AdSoyad: document.getElementById("adSoyad"),
    Eposta: document.getElementById("eposta"),
    Telefon: document.getElementById("telefon"),
    Sehir: document.getElementById("sehir"),
    Mesaj: document.getElementById("mesaj")
  };

  const queryParams = new URLSearchParams(window.location.search);
  const hataMesaji = queryParams.get("hata");
  if (hataMesaji && queryErrorAlert) {
    queryErrorAlert.textContent = decodeURIComponent(hataMesaji.replace(/\+/g, " "));
    queryErrorAlert.classList.remove("d-none");
  }

  function setError(fieldKey, message) {
    const errorElement = document.getElementById(`err${fieldKey}`);
    if (errorElement) {
      errorElement.textContent = message || "";
    }
  }

  function clearErrors() {
    setError("AdSoyad", "");
    setError("Eposta", "");
    setError("Telefon", "");
    setError("Sehir", "");
    setError("Cinsiyet", "");
    setError("IlgiAlanlari", "");
    setError("Mesaj", "");
  }

  function clearInvalidStates() {
    Object.values(fieldMap).forEach((field) => field?.classList.remove("is-invalid"));
    document.querySelectorAll('input[name="cinsiyet"]').forEach((el) => el.classList.remove("is-invalid"));
    document.querySelectorAll(".ilgi-checkbox").forEach((el) => el.classList.remove("is-invalid"));
  }

  function validateValues(values) {
    const errors = {};

    if (!values.adSoyad) {
      errors.AdSoyad = "Ad Soyad alanı zorunludur.";
    } else if (!/^[A-Za-zÇĞİÖŞÜçğıöşü\s]+$/.test(values.adSoyad)) {
      errors.AdSoyad = "Ad Soyad sadece harflerden oluşmalıdır.";
    }

    if (!values.eposta) {
      errors.Eposta = "E-posta alanı zorunludur.";
    } else if (!epostaRegex.test(values.eposta)) {
      errors.Eposta = "Geçerli bir e-posta adresi giriniz.";
    }

    if (!values.telefon) {
      errors.Telefon = "Telefon alanı zorunludur.";
    } else if (!/^\d+$/.test(values.telefon)) {
      errors.Telefon = "Telefon sadece rakamlardan oluşmalıdır.";
    } else if (values.telefon.length > 11) {
      errors.Telefon = "Telefon en fazla 11 hane olmalıdır.";
    }

    if (!values.sehir) {
      errors.Sehir = "Lütfen şehir seçiniz.";
    }

    if (!values.cinsiyet) {
      errors.Cinsiyet = "Lütfen cinsiyet seçiniz.";
    }

    if (!values.ilgiAlanlari.length) {
      errors.IlgiAlanlari = "En az bir ilgi alanı seçiniz.";
    }

    if (!values.mesaj) {
      errors.Mesaj = "Mesaj alanı zorunludur.";
    }

    return errors;
  }

  function showErrors(errors) {
    clearErrors();
    clearInvalidStates();
    Object.keys(errors).forEach((key) => setError(key, errors[key]));

    if (errors.AdSoyad) fieldMap.AdSoyad.classList.add("is-invalid");
    if (errors.Eposta) fieldMap.Eposta.classList.add("is-invalid");
    if (errors.Telefon) fieldMap.Telefon.classList.add("is-invalid");
    if (errors.Sehir) fieldMap.Sehir.classList.add("is-invalid");
    if (errors.Mesaj) fieldMap.Mesaj.classList.add("is-invalid");
    if (errors.Cinsiyet) {
      document.querySelectorAll('input[name="cinsiyet"]').forEach((el) => el.classList.add("is-invalid"));
    }
    if (errors.IlgiAlanlari) {
      document.querySelectorAll(".ilgi-checkbox").forEach((el) => el.classList.add("is-invalid"));
    }
  }

  function setButtonLoading(button) {
    button.disabled = true;
    button.innerHTML = `
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Loading...
    `;
  }

  function submitWithLoading(button) {
    setButtonLoading(button);
    setTimeout(() => form.submit(), 250);
  }

  adSoyadInput.addEventListener("input", () => {
    adSoyadInput.value = adSoyadInput.value.replace(/[^A-Za-zÇĞİÖŞÜçğıöşü\s]/g, "");
  });

  telefonInput.addEventListener("input", () => {
    telefonInput.value = telefonInput.value.replace(/\D/g, "");
    if (telefonInput.value.length > 11) {
      telefonInput.value = telefonInput.value.slice(0, 11);
    }
  });

  btnNative.addEventListener("click", () => {
    const values = {
      adSoyad: adSoyadInput.value.trim(),
      eposta: document.getElementById("eposta").value.trim(),
      telefon: telefonInput.value.trim(),
      sehir: document.getElementById("sehir").value.trim(),
      cinsiyet: (document.querySelector('input[name="cinsiyet"]:checked') || {}).value || "",
      ilgiAlanlari: Array.from(document.querySelectorAll(".ilgi-checkbox:checked")).map((item) => item.value),
      mesaj: document.getElementById("mesaj").value.trim()
    };

    const errors = validateValues(values);
    showErrors(errors);

    if (Object.keys(errors).length) {
      alert("Lütfen formdaki hataları düzeltin.");
      return;
    }

    submitWithLoading(btnNative);
  });

  if (window.Vue && typeof window.Vue.createApp === "function" && btnVue) {
    const { createApp } = window.Vue;
    createApp({
      data() {
        return {
          adSoyad: "",
          eposta: "",
          telefon: "",
          sehir: "",
          cinsiyet: "",
          ilgiAlanlari: [],
          mesaj: ""
        };
      },
      methods: {
        vueKontrol() {
          this.adSoyad = this.adSoyad.replace(/[^A-Za-zÇĞİÖŞÜçğıöşü\s]/g, "");
          this.telefon = this.telefon.replace(/\D/g, "");

          const values = {
            adSoyad: this.adSoyad.trim(),
            eposta: this.eposta.trim(),
            telefon: this.telefon.trim(),
            sehir: this.sehir.trim(),
            cinsiyet: this.cinsiyet.trim(),
            ilgiAlanlari: this.ilgiAlanlari,
            mesaj: this.mesaj.trim()
          };

          const errors = validateValues(values);
          showErrors(errors);

          if (Object.keys(errors).length) {
            alert("Lütfen formdaki hataları düzeltin.");
            return;
          }

          submitWithLoading(btnVue);
        }
      }
    }).mount("#app");
  }
}

function initMotogpPage() {
  const loadingEl = document.getElementById("motogpLoading");
  const errorEl = document.getElementById("motogpError");
  const gridEl = document.getElementById("motogpGalleryGrid");
  const refreshBtn = document.getElementById("refreshGalleryBtn");

  if (!loadingEl || !errorEl || !gridEl) {
    return;
  }

  const modalEl = document.getElementById("imageModal");
  const modalLabelEl = document.getElementById("imageModalLabel");
  const modalImgEl = document.getElementById("imageModalImg");
  const modalCaptionEl = document.getElementById("imageModalCaption");
  const canUseModal = modalEl && modalLabelEl && modalImgEl && modalCaptionEl && window.bootstrap;
  const imageModal = canUseModal ? new window.bootstrap.Modal(modalEl) : null;

  const UNSPLASH_ACCESS_KEY = "";
  const QUERY = "motogp";
  const PER_PAGE = 10;

  function setLoading(isLoading) {
    if (isLoading) {
      loadingEl.classList.remove("d-none");
      gridEl.classList.add("d-none");
      errorEl.classList.add("d-none");
      return;
    }
    loadingEl.classList.add("d-none");
  }

  function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.remove("d-none");
  }

  function clearGrid() {
    gridEl.innerHTML = "";
  }

  function fallbackImages() {
    return Array.from({ length: PER_PAGE }, (_, idx) => ({
      id: `fallback_${idx + 1}`,
      alt_description: "MotoGP",
      user: { name: "Unsplash" },
      links: { html: "https://unsplash.com/" },
      urls: {
        regular: `https://source.unsplash.com/1600x1000/?motogp,racing&sig=${idx + 1}`,
        full: `https://source.unsplash.com/2400x1600/?motogp,racing&sig=${idx + 1}`
      }
    }));
  }

  async function fetchFromUnsplashApi() {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", QUERY);
    url.searchParams.set("per_page", String(PER_PAGE));
    url.searchParams.set("orientation", "landscape");
    url.searchParams.set("content_filter", "high");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        "Accept-Version": "v1"
      }
    });

    if (!response.ok) {
      throw new Error("Unsplash API isteği başarısız.");
    }

    const data = await response.json();
    return (data && data.results) || [];
  }

  function createGalleryItem(photo, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "motogp-gallery-item";
    button.dataset.full = photo.urls.full || photo.urls.regular;
    button.dataset.label = photo.alt_description || `MotoGP Görseli ${index + 1}`;
    button.dataset.caption = photo.user?.name ? `Fotoğraf: ${photo.user.name}` : "Fotoğraf: Unsplash";
    button.dataset.link = photo.links?.html || "https://unsplash.com/";
    button.setAttribute("aria-label", button.dataset.label);

    const img = document.createElement("img");
    img.loading = "lazy";
    img.src = photo.urls.regular || photo.urls.full;
    img.alt = button.dataset.label;

    const meta = document.createElement("div");
    meta.className = "motogp-gallery-meta";
    meta.innerHTML = `
      <h3>${button.dataset.label}</h3>
      <p>${button.dataset.caption}</p>
    `;

    button.appendChild(img);
    button.appendChild(meta);

    const aosDelay = 60 * (index % 5);
    button.setAttribute("data-aos", "zoom-in");
    button.setAttribute("data-aos-delay", String(aosDelay));

    return button;
  }

  function renderGallery(photos) {
    clearGrid();
    photos.slice(0, PER_PAGE).forEach((photo, index) => {
      gridEl.appendChild(createGalleryItem(photo, index));
    });
    gridEl.classList.remove("d-none");

    if (window.AOS && typeof window.AOS.refresh === "function") {
      window.AOS.refresh();
    }
  }

  async function loadGallery() {
    setLoading(true);

    try {
      if (UNSPLASH_ACCESS_KEY) {
        const photos = await fetchFromUnsplashApi();
        if (!photos.length) {
          showError("Unsplash API sonuç döndürmedi. Lütfen daha sonra tekrar deneyin.");
          setLoading(false);
          return;
        }
        renderGallery(photos);
        setLoading(false);
        return;
      }

      renderGallery(fallbackImages());
      setLoading(false);
      showError("Unsplash API anahtarı tanımlı olmadığı için geçici görseller gösteriliyor. js/main.js içindeki UNSPLASH_ACCESS_KEY alanını doldurabilirsiniz.");
    } catch (_error) {
      setLoading(false);
      renderGallery(fallbackImages());
      showError("Görseller yüklenemediği için geçici görseller gösteriliyor. İnternet bağlantısını ve Unsplash erişimini kontrol edebilirsiniz.");
    }
  }

  gridEl.addEventListener("click", (event) => {
    const button = event.target.closest(".motogp-gallery-item");
    if (!button) {
      return;
    }

    const fullUrl = button.dataset.full;
    const label = button.dataset.label || "Görsel";
    const caption = button.dataset.caption || "";
    const link = button.dataset.link || "";

    if (!imageModal) {
      if (fullUrl) {
        window.open(fullUrl, "_blank", "noopener,noreferrer");
      }
      return;
    }

    modalLabelEl.textContent = label;
    modalImgEl.src = fullUrl;
    modalImgEl.alt = label;
    modalCaptionEl.textContent = link ? `${caption} • Kaynak: ${link}` : caption;
    imageModal.show();
  });

  refreshBtn?.addEventListener("click", () => {
    loadGallery();
  });

  loadGallery();
}
