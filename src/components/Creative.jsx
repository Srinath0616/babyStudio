// Creative.jsx
import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import HomeImage from "../../optimized/creativepage/pra_1014.jpg";
import "./Creative.css";
import Footer from "./Footer";

/**
 * This component:
 * - Loads Radha Krishna images from local optimized folder (so they are served from your project).
 * - Loads other themes (army, santa, beach, etc.) from Cloudinary via a manifest (photos_index.json).
 *
 * Ensure:
 * - photos_index.json exists at PUBLIC_MANIFEST_PATH and includes the Cloudinary public_id/format or url.
 * - local optimized folder path (used below in import.meta.glob) is accessible by Vite.
 */

const CLOUD_NAME = "dwwfhnjjo"; // your Cloudinary cloud name
const PUBLIC_MANIFEST_PATH = "/photos_index.json"; // manifest location (public/assets or public root)

const Creative = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [theme, setTheme] = useState("all");
  const [shuffledImages, setShuffledImages] = useState([]);

  // ---------------------------
  // RADHA (local optimized files)
  // ---------------------------
  // Note: this path assumes `optimized/studio-1-y-themes/20 Radha Krishna` is reachable relative to this file.
  // Adjust the relative path if your optimized folder is located elsewhere in the project.
  const radhaLocalUrls = Object.values(
    import.meta.glob(
      "../../optimized/studio-1-y-themes/20 Radha Krishna/*.{jpg,jpeg,png,webp}",
      { eager: true, as: "url" }
    )
  ).map((url) => url); // array of string URLs served by Vite

  // ---------------------------
  // Helper: Cloudinary URL builder
  // ---------------------------
  const cloudinaryUrlFor = (publicId, format, width) => {
    if (!publicId) return "";
    const encoded = publicId.split("/").map(encodeURIComponent).join("/");
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_auto,f_auto/${encoded}.${format}`;
  };

  const slugToTheme = (slug, folder) => {
    const s = (slug || folder || "").toLowerCase();
    if (s.includes("radha") || s.includes("radha-krishna") || s.includes("radha_krishna"))
      return "radha";
    if (s.includes("army")) return "army";
    if (s.includes("christmas") || s.includes("santa")) return "santa";
    if (s.includes("beach") || s.includes("beeach")) return "beach";
    return "other";
  };

  // LazyImage component (unchanged behavior, but takes responsive URLs)
  const LazyImage = ({ src400, src800, src1200, alt }) => {
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      if (imgRef.current) observer.observe(imgRef.current);
      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={imgRef}
        style={{
          minHeight: "200px",
          background: "#f5f5f5",
          marginBottom: "10px",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {isVisible ? (
          <img
            src={src800 || src400}
            srcSet={
              (src400 ? `${src400} 400w, ` : "") +
              (src800 ? `${src800} 800w, ` : "") +
              (src1200 ? `${src1200} 1200w` : "")
            }
            sizes="(max-width:600px) 400px, (max-width:1200px) 800px, 1200px"
            alt={alt}
            loading="lazy"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        ) : (
          <p style={{ textAlign: "center", paddingTop: "80px" }}>Loading...</p>
        )}
      </div>
    );
  };

  // Build unified image list: local Radha entries + Cloudinary manifest entries for others
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // 1) Build local radha entries (use same image as all breakpoints — they are optimized locally)
        const radhaEntries = radhaLocalUrls.map((url) => ({
          img400: url,
          img800: url,
          img1200: url,
          original: url,
          cat: "radha",
          alt: "", // you can enhance by reading file names if needed
        }));

        // 2) Fetch manifest for Cloudinary-hosted themes
        const res = await fetch(PUBLIC_MANIFEST_PATH);
        let cloudEntries = [];
        if (res.ok) {
          const manifest = await res.json();
          cloudEntries = Object.entries(manifest || {})
            .flatMap(([slug, catObj]) => {
              const catKey = slugToTheme(slug, catObj.folder);
              // skip radha here because we prefer local radha
              if (catKey === "radha") return [];
              return (catObj.images || []).map((img) => {
                const publicId = img.public_id || img.publicId || "";
                const format =
                  img.format || (img.url ? img.url.split(".").pop().split("?")[0] : "jpg");
                return {
                  img400: publicId ? cloudinaryUrlFor(publicId, format, 400) : (img.variants?.["400"] || img.url),
                  img800: publicId ? cloudinaryUrlFor(publicId, format, 800) : (img.variants?.["800"] || img.url),
                  img1200: publicId ? cloudinaryUrlFor(publicId, format, 1200) : (img.variants?.["1200"] || img.url),
                  original: img.url || img.secure_url || (publicId ? cloudinaryUrlFor(publicId, format, 1600) : ""),
                  cat: catKey,
                  alt: img.alt || img.public_id || img.id || "",
                };
              });
            });
        } else {
          console.warn("Manifest not found at", PUBLIC_MANIFEST_PATH, "— only local radha will be available.");
        }

        // Combine: local radha first (or you can shuffle across both)
        const combined = [...radhaEntries, ...cloudEntries];

        if (!mounted) return;
        const shuffled = [...combined].sort(() => Math.random() - 0.5);
        setShuffledImages(shuffled);
      } catch (err) {
        console.error("Failed to build gallery list:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const openModal = (item) => {
    setSelectedImage(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
  };

  // render gallery (keeps previous behavior)
  const renderGallery = () => {
    if (theme === "all") {
      return shuffledImages.slice(0, 35).map((item, index) => (
        <div className="gallery-item" key={index} onClick={() => openModal(item)}>
          <LazyImage src400={item.img400} src800={item.img800} src1200={item.img1200} alt={`work-${item.cat}-${index}`} />
        </div>
      ));
    }

    return shuffledImages
      .filter((it) => it.cat === theme)
      .map((item, index) => (
        <div className="gallery-item" key={index} onClick={() => openModal(item)}>
          <LazyImage src400={item.img400} src800={item.img800} src1200={item.img1200} alt={`work-${item.cat}-${index}`} />
        </div>
      ));
  };

  return (
    <>
      <Navbar />
      <div className="Hero">
        <div className="firstImage">
          <img src={HomeImage} alt="Creative" />
          <div className="heroText">
            <h1>Create. Capture. Cherish.</h1>
            <p>From candid smiles to cinematic frames — we bring your vision to life.</p>
            <a href="/contact-us" className="contact-btn">Start Your Journey</a>
          </div>
        </div>
      </div>

      <div className="home-serives">
        <div className="Service-section">
          <div className="head">
            <div className="head-content">
              <h1>Creative Themes</h1>
              <p>Discover unique photography ideas — from divine Radha Krishna vibes to fun Santa and beach adventures.</p>
            </div>
          </div>

          <div className="specialties">
            <button className={`specialities-btn ${theme === "all" ? "active" : ""}`} onClick={() => setTheme("all")}>All Themes</button>
            <button className={`specialities-btn ${theme === "radha" ? "active" : ""}`} onClick={() => setTheme("radha")}>Radha Krishna</button>
            <button className={`specialities-btn ${theme === "army" ? "active" : ""}`} onClick={() => setTheme("army")}>Army Theme</button>
            <button className={`specialities-btn ${theme === "santa" ? "active" : ""}`} onClick={() => setTheme("santa")}>Santa Claus</button>
            <button className={`specialities-btn ${theme === "beach" ? "active" : ""}`} onClick={() => setTheme("beach")}>Beach Theme</button>
          </div>
        </div>
      </div>

      <div className="gallery">{renderGallery()}</div>

      {isModalOpen && selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>✖</button>
            <img
              src={selectedImage.original || selectedImage.img1200 || selectedImage.img800}
              alt="Selected Work"
              className="modal-img"
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Creative;
