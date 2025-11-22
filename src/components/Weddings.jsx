import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Weddings = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [theme, setTheme] = useState("all");
  const [shuffledImages, setShuffledImages] = useState([]);

  // 📸 Import all categories dynamically
  const allWorks = Object.values(
    import.meta.glob("../assets/My_Work/CreativePage/*.{jpg,jpeg,png}", {
      eager: true,
    })
  ).map((img) => img.default);

  const radhakrishna = Object.values(
    import.meta.glob(
      "../assets/My_Work/Studio 1 Y Themes/20 Radha Krishna/*.{jpg,jpeg,png}",
      {
        eager: true,
      }
    )
  ).map((img) => img.default);

  const army = Object.values(
    import.meta.glob(
      "../assets/My_Work/Studio 1 Y Themes/15 Army/*.{jpg,jpeg,png}",
      {
        eager: true,
      }
    )
  ).map((img) => img.default);

  const santa = Object.values(
    import.meta.glob(
      "../assets/My_Work/Studio 1 Y Themes/07 Christmas/*.{jpg,jpeg,png}",
      {
        eager: true,
      }
    )
  ).map((img) => img.default);

  const beach = Object.values(
    import.meta.glob(
      "../assets/My_Work/Studio 1 Y Themes/16 Beeach/*.{jpg,jpeg,png}",
      {
        eager: true,
      }
    )
  ).map((img) => img.default);

  const LazyImage = ({ src, alt }) => {
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
            src={src}
            alt={alt}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        ) : (
          <p style={{ textAlign: "center", paddingTop: "80px" }}>Loading...</p>
        )}
      </div>
    );
  };
  useEffect(() => {
    const combined = [
      ...radhakrishna.map((img) => ({ img, cat: "radha" })),
      ...army.map((img) => ({ img, cat: "army" })),
      ...santa.map((img) => ({ img, cat: "santa" })),
      ...beach.map((img) => ({ img, cat: "beach" })),
    ];
    const shuffled = [...combined].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
  }, []);

  const openModal = (img) => {
    setSelectedImage(img);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };
  const renderGallery = () => {
    const combined = [
      ...radhakrishna.map((img) => ({ img, cat: "radha" })),
      ...army.map((img) => ({ img, cat: "army" })),
      ...santa.map((img) => ({ img, cat: "santa" })),
      ...beach.map((img) => ({ img, cat: "beach" })),
    ];

    if (theme === "all") {
      return shuffledImages.slice(0, 35).map(({ img, cat }, index) => (
        <div
          className="gallery-item"
          key={index}
          onClick={() => openModal(img)}
        >
          <LazyImage src={img} alt={`work-${cat}-${index}`} />
          {/* <div className="overlay">
                <span>View More</span>
              </div> */}
        </div>
      ));
    }

    return combined
      .filter(({ cat }) => cat === theme)
      .map(({ img, cat }, index) => (
        <div
          className="gallery-item"
          key={index}
          onClick={() => openModal(img)}
        >
          <LazyImage src={img} alt={`work-${cat}-${index}`} />
          {/* <div className="overlay">
                <span>View More</span>
              </div> */}
        </div>
      ));
  };
  return(
  <>
    <Navbar />
    <Footer />
  </>
  )
};

export default Weddings;
