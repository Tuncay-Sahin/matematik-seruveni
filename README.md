<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/89069b0d-a85f-4a98-80a3-9ab2dc14c4c8

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
#  Matematik Serüveni: Interactive AI-Driven Multiplication Arena

An interactive, responsive, and prompt-driven web application designed to accelerate multiplication table mastery through gamified cognitive learning paths.

---

## Executive Summary (Yönetici Özeti)

**Matematik Serüveni**, geleneksel ezberci eğitim modellerini kırarak, öğrencilerin matematiksel işlem kabiliyetlerini artırmayı hedefleyen modern bir web uygulamasıdır. Bu projenin en kritik özelliği, mimarisinin uçtan uca **AI Studio (Prompt-Driven Development)** ve **No-Code Engineering** prensipleriyle koordine edilmiş olmasıdır. 

Proje; gereksinim analizinden (Requirements Engineering), CI/CD dağıtım süreçlerine (Deployment Lifecycle) kadar tam bir **Business Analyst (İş Analisti)** ve **Product Owner (Ürün Sahibi)** vizyonuyla yönetilmiştir.

---

## Key Features & Functional Requirements (Ana Fonksiyonel Gereksinimler)

Application, kullanıcı deneyimini (UX) en üst düzeyde tutmak için modüler bir yapıda kurgulanmıştır:

* **Interactive Arena (Çarpım Arenası):** Dinamik soru üretme algoritmaları ile kullanıcıyı sürekli aktif tutan canlı oyun motoru.
* **Visual Block Modeling (Görsel Blok Modellemesi):** Soyut matematiksel kavramları somutlaştırarak pedagojik öğrenimi destekleyen görsel matris yapıları.
* **Gamified Progression (Kamp Mücadelesi):** Kullanıcı motivasyonunu artırmak amacıyla kurgulanmış aşamalı zorluk seviyeleri ve skor takibi (Scoreboard).
* **Responsive Layout:** Hem masaüstü hem de mobil cihazlarda (Mobile-first responsive design) kusursuz çalışan esnek arayüz.

---

## Technical Stack & Architecture (Teknik Mimari)

Projenin altyapısı, yüksek performans, hızlı derleme (Fast Build) ve modern tasarım standartları baz alınarak seçilmiştir:

| Bileşen | Teknoloji | İş Analizi Açısından Rolü (Rationale) |
| :--- | :--- | :--- |
| **Frontend Framework** | `React` (TypeScript) | Bileşen tabanlı (Component-based) yapısı sayesinde sürdürülebilir ve ölçeklenebilir kod mimarisi. |
| **Build Tool** | `Vite` | Hızlı modül değişimi (HMR) ve optimize edilmiş paketleme (Bundling) ile yüksek performans. |
| **Styling Engine** | `Tailwind CSS` v4 | Utility-first yaklaşımıyla sıfır CSS karmaşası ve hızlı UI/UX iterasyonları. |
| **CI/CD Platform** | `GitHub Actions` | Kod her push edildiğinde otomatik olarak çalışan ve canlıya alan otomasyon hattı. |
| **Hosting** | `GitHub Pages` | Bulut tabanlı, sunucusuz (Serverless) ve kesintisiz canlı yayın altyapısı. |

---

## Security & Code Quality (Güvenlik ve Kod Kalitesi)

Proje, kurumsal yazılım standartlarına (Enterprise Standards) uygun şekilde zırhlandırılmıştır:

* **Relative Base Path Optimization:** `vite.config.ts` üzerinde yapılan mimari dokunuşla, uygulama bağıl yollara (`base: './'`) taşınmıştır. Bu sayede klasör çakışmaları (Path conflicts) ve `404 Not Found` hataları kökten çözülmüştür.
* **Secret Scanning & Guardrails:** Kod tabanında (Codebase) hassas veri, şifre veya API anahtarı sızıntısını engelleyen koruma kalkanları aktiftir.
* **Dependabot Integration:** Projenin kullandığı tüm üçüncü parti kütüphaneler (Dependencies) olası exploit ve güvenlik açıklarına karşı GitHub sunucuları tarafından 7/24 izlenmektedir.

---

## Deployment Lifecycle & Automation (Canlıya Alım Süreci)

Bu projenin yaşam döngüsü tam bir otomasyon üzerine kuruludur. Geliştirme sürecinde manuel paketleme (Manual deployment) riskleri tamamen ortadan kaldırılmıştır:

1. **Local Development:** VS Code ortamında değişiklikler tamamlanır ve test edilir.
2. **Version Control:** GitHub Desktop aracılığıyla değişiklikler izlenir, anlamlı commit mesajları ile `main branch` yapısına işlenir.
3. **Continuous Integration (CI):** Kod GitHub'a ulaştığı an `.github/workflows/deploy.yml` sihirbazı otomatik olarak tetiklenir.
4. **Continuous Deployment (CD):** GitHub Actions bulut sunucuları projeyi sıfırdan derler (build app) ve saniyeler içinde canlı linki günceller.

---

## Live Demo (Canlı Uygulama)

Uygulama tamamen canlı ortamda test edilebilir ve dünyanın her yerinden erişime açıktır:

🔗 **[Matematik Serüveni - Canlı Oyun Linki](https://tuncay-sahin.github.io/matematik-seruveni/)**

---

### Author / Product Manager
* **Tuncay Şahin** 
