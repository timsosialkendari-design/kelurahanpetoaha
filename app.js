// ==========================================================================
// PORTAL DESA CANTIK KELURAHAN NAMBO - ENGINE JAVASCRIPT
// ==========================================================================

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1. Mengambil data dari data-desa.json
    const response = await fetch("data-desa.json");
    if (!response.ok) {
      throw new Error(`Gagal memuat file data-desa.json (Status: ${response.status})`);
    }
    const data = await response.json();

    // 2. Render Sambutan & Foto Lurah
    if (data.profil.lurah) {
      document.getElementById("nama-lurah").innerText = data.profil.lurah.nama;
      document.getElementById("nip-lurah").innerText = `NIP. ${data.profil.lurah.nip}`;
      document.getElementById("teks-sambutan").innerText = `"${data.profil.lurah.sambutan}"`;
      document.getElementById("periode-lurah").innerText = data.profil.lurah.periode;
      if (data.profil.lurah.foto) {
        document.getElementById("foto-lurah").src = data.profil.lurah.foto;
      }
    }

    // 3. Render Profil, Sejarah, & Batas Wilayah
    document.getElementById("deskripsi-sejarah").innerText = data.profil.sejarah_singkat;
    document.getElementById("visi-text").innerText = `"${data.profil.visi}"`;
    document.getElementById("batas-utara").innerText = data.profil.batas_wilayah.utara;
    document.getElementById("batas-selatan").innerText = data.profil.batas_wilayah.selatan;
    document.getElementById("batas-barat").innerText = data.profil.batas_wilayah.barat;
    document.getElementById("batas-timur").innerText = data.profil.batas_wilayah.timur;

    // 4. Render KPI Angka Statistik Cepat
    document.getElementById("kpi-penduduk").innerText = data.statistik_2026.total_penduduk.toLocaleString("id-ID");
    document.getElementById("kpi-keluarga").innerText = data.statistik_2026.jumlah_keluarga_2026;
    document.getElementById("kpi-luas").innerText = data.profil.luas_wilayah_km2;
    document.getElementById("kpi-ekonomi").innerText = data.statistik_2026.ekonomi_ringkasan.sarana_perdagangan;

    // 5. Render Daftar Sekolah
    const listSekolah = document.getElementById("list-sekolah");
    listSekolah.innerHTML = data.statistik_2026.pendidikan_ringkasan.detail.map(item => `
      <li class="py-2.5 flex justify-between items-center">
        <div>
          <span class="font-semibold text-slate-800 block">${item.nama}</span>
          <span class="text-[11px] text-slate-400">${item.alamat}</span>
        </div>
        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Aktif</span>
      </li>
    `).join("");

    // 6. Render Kartu Infografis Resmi
    const containerInfografis = document.getElementById("container-infografis");
    containerInfografis.innerHTML = data.infografis_galeri.map((info, idx) => `
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition group">
        <div class="relative bg-slate-100 h-64 overflow-hidden cursor-pointer" onclick="openModal('${info.file_gambar}', '${info.judul}')">
          <img src="${info.file_gambar}" alt="${info.judul}" class="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300">
          <div class="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-sm font-semibold gap-2">
            <i class="fa-solid fa-expand"></i> Klik Perbesar
          </div>
          <span class="absolute top-3 left-3 bg-emerald-700 text-white font-black text-[10px] px-2.5 py-1 rounded-md shadow">${info.bab}</span>
        </div>
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h4 class="font-bold text-slate-900 text-sm leading-tight">${info.judul}</h4>
            <p class="text-xs text-slate-500 mt-2 leading-relaxed">${info.keterangan}</p>
          </div>
          <div class="mt-4 pt-3 border-t flex justify-between items-center">
            <span class="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Statistik 2026</span>
            <button onclick="openModal('${info.file_gambar}', '${info.judul}')" class="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1">
              Lihat Detail <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>
    `).join("");

    // 7. Render Struktur Organisasi Aparatur
    const containerStruktur = document.getElementById("container-struktur");
    containerStruktur.innerHTML = data.struktur_organisasi.map(pejabat => `
      <div class="bg-emerald-800/60 backdrop-blur p-4 rounded-2xl border border-emerald-700/60 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
          <i class="fa-solid fa-user-tie"></i>
        </div>
        <div>
          <span class="text-xs font-semibold text-emerald-300 block uppercase">${pejabat.jabatan}</span>
          <h4 class="font-bold text-white text-sm sm:text-base">${pejabat.nama}</h4>
          <span class="text-[11px] text-emerald-200/70">NIP. ${pejabat.nip}</span>
        </div>
      </div>
    `).join("");

    // 8. Inisialisasi Grafik Chart.js
    // Chart 1: Gender
    new Chart(document.getElementById("chartGender"), {
      type: "doughnut",
      data: {
        labels: ["Laki-laki", "Perempuan"],
        datasets: [{
          data: [data.statistik_2026.penduduk_laki, data.statistik_2026.penduduk_perempuan],
          backgroundColor: ["#059669", "#06b6d4"],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } }
      }
    });

    // Chart 2: Tren Pertumbuhan KK
    new Chart(document.getElementById("chartKeluarga"), {
      type: "bar",
      data: {
        labels: data.statistik_2026.riwayat_keluarga.map(item => item.tahun),
        datasets: [{
          label: "Jumlah KK",
          data: data.statistik_2026.riwayat_keluarga.map(item => item.jumlah),
          backgroundColor: "#10b981",
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 350, max: 480 } },
        plugins: { legend: { display: false } }
      }
    });

    // Chart 3: Industri Kecil/Mikro
    new Chart(document.getElementById("chartIndustri"), {
      type: "pie",
      data: {
        labels: data.statistik_2026.ekonomi_ringkasan.industri_detail.map(item => item.jenis),
        datasets: [{
          data: data.statistik_2026.ekonomi_ringkasan.industri_detail.map(item => item.jumlah),
          backgroundColor: ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { boxWidth: 10, font: { size: 10 } }
          }
        }
      }
    });

  } catch (error) {
    console.error("Terjadi error saat memuat data:", error);
  }
});

// Fungsi Modal Lightbox untuk melihat infografis resolusi penuh
function openModal(imgSrc, title) {
  const modal = document.getElementById("imageModal");
  document.getElementById("modalImg").src = imgSrc;
  document.getElementById("modalTitle").innerText = title;
  modal.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("imageModal").classList.add("hidden");
}