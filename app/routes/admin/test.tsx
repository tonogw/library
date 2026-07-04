(async () => {
  // 1. Ambil token otomatis yang sedang aktif di browser Pak Tono
  const token = localStorage.getItem("token");
  if (!token) {
    console.error(
      "Waduh, token login tidak ditemukan di localStorage. Silakan login ulang dulu.",
    );
    return;
  }

  // 2. Buat element input file bayangan untuk mengambil gambar asli dari MacBook Anda
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  // Tampilkan dialog pemilih file
  fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) {
      console.log("Pemilihan file gambar dibatalkan.");
      return;
    }
    console.log(
      `File terpilih: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB). Mulai membungkus FormData...`,
    );

    // 3. Susun FormData dengan tipe data ketat (Angka dikirim sebagai String murni, authorId dikosongkan)
    const formData = new FormData();
    formData.append(
      "title",
      "Design of a Modular and Scalable loT Based System for Utility Management: A Case Study at 3 Towers Residences",
    );
    formData.append(
      "description",
      "International Journal of Engineering Trends and Technology",
    );
    formData.append("isbn", "IJETT-V7316P117");
    formData.append("publishedYear", "2025");
    formData.append("authorId", ""); // String kosong sesuai curl yang sukses
    formData.append("authorName", "Gunarto Wibisono");
    formData.append("categoryId", "11");
    formData.append("totalCopies", "1");
    formData.append("availableCopies", "1");

    // Masukkan file biner asli laptop Anda ke field 'coverImage' sesuai Swagger
    formData.append("coverImage", file);

    console.log(
      "Menembak API Railway... Mohon tunggu karena proses upload gambar bisa memakan waktu 30 detik...",
    );

    try {
      // 4. Lakukan penembakan langsung menggunakan Fetch API bawaan browser
      const response = await fetch(
        "https://library-backend-production-b9cf.up.railway.app/api/books",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Jangan tulis Content-Type, browser otomatis membuat boundary multipart yang sah
          },
          body: formData,
        },
      );

      const result = await response.json();

      if (response.ok) {
        console.log(
          "%cBERHASIL SUKSES (201 Created)!",
          "color: green; font-size: 16px; font-weight: bold;",
        );
        console.log(result);
      } else {
        console.error(
          "%cSERVER MENOLAK (Eror dari Backend):",
          "color: red; font-size: 14px; font-weight: bold;",
        );
        console.error(`Status: ${response.status}`);
        console.error(result);
      }
    } catch (err) {
      console.error(
        "%cKONEKSI JARINGAN GAGAL (HTTP/2 Protocol Error / Timeout):",
        "color: orange; font-size: 14px; font-weight: bold;",
      );
      console.error(err);
    }
  };

  // Trigger klik agar jendela pemilih file di MacBook Anda terbuka
  fileInput.click();
})();
