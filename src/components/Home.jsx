import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import HomeImage from "../assets/Heros/PRA_0339.jpg";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Home() {
  const [category, setCategory] = useState("all");
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  // const allWorks = [
  //   nasa1,
  //   onemonthsbaby1,
  //   boss1,
  //   babymom,
  //   birthday1,
  //   maternity1,
  //   harrypotter1,
  //   creative1,
  //   birthday2,
  //   onemonthsbaby3,
  //   maternity2,
  //   harrypotter2,
  //   creative2,
  //   birthday3,
  //   onemonthsbaby4,
  //   harrypotter3,
  //   boss1,
  //   birthday4,
  //   onemonthsbaby5,
  //   harrypotter4,
  //   creative4,
  //   birthday5,
  //   onemonthsbaby6,
  //   harrypotter5,
  //   creative5,
  //   birthday6,
  //   harrypotter6,
  //   creative6,
  //   birthday7,
  //   harrypotter7,
  //   maternity6,
  //   maternity3,
  //   maternity4,
  //   maternity5,
  // ];
  const weddings = [];
  const maternity = Object.values(
    import.meta.glob("../../optimized/meternity/*.{jpg,jpeg,png}", {
      eager: true,
    }) 
  ).map((img) => img.default);
  const creative = Object.values(
    import.meta.glob("../../optimized/creative/*.{jpg,jpeg,png}", {
      eager: true,
    })
  ).map((img) => img.default);

  const newborn = Object.values(
    import.meta.glob("../../optimized/home-new-born/*.{jpg,jpeg,png}", {
      eager: true,
    })
  ).map((img) => img.default);

  // For Navigating When clicked on Expllore this Theme this routes to that particular router
  const navigate = useNavigate();

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

  // const getImages = () => {
  //   switch (category) {
  //     case "weddings":
  //       return weddings;
  //     case "Maternity":
  //       return maternity;
  //     case "creative":
  //       return creative;
  //     case "Newborn":
  //       return newborn;
  //     default:
  //       return allWorks;
  //   }
  // };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };
  const [selectedCategory, setSelectedCategory] = useState(null);

  const openModal = (img, cat) => {
    setSelectedImage(img);
    setSelectedCategory(cat);
    setModalOpen(true);
  };

  const handleExplore = () => {
    let route = "/";
    switch (selectedCategory) {
      case "creative":
        route = "/creative";
        break;
      case "Maternity":
        route = "/maternity";
        break;
      case "weddings":
        route = "/weddings";
        break;
      case "Newborn":
        route = "/newborn";
        break;
      default:
        route = "/";
    }
    navigate(route);
    closeModal();
  };
  const [shuffledImages, setShuffledImages] = useState([]);

  useEffect(() => {
    const combined = [
      ...maternity.map((img) => ({ img, cat: "Maternity" })),
      ...newborn.map((img) => ({ img, cat: "Newborn" })),
      ...creative.map((img) => ({ img, cat: "creative" })),
    ];
    const shuffled = [...combined].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
  }, []); 

  return (
    <>
      <Navbar />
      <main>
        <div className="Hero">
          <div className="firstImage">
            <img src={HomeImage} alt="" />
            <div className="heroText">
              <h1>Welcome to Baby Photo Studio</h1>
              <p>Capturing beautiful moments forever</p>
              <a href="/contact-us" className="contact-btn">
                Contact Now
              </a>
            </div>
          </div>
        </div>
        <div className="home-serives">
          <div className="Service-section">
            <div className="head">
              <div className="head-content">
                <h1>What We Do</h1>
                <p>
                  Explore our diverse collection of photography work across
                  different specialties
                </p>
              </div>
            </div>
            <div className="specialties">
              <button
                className={`specialities-btn ${
                  category === "creative" ? "active" : ""
                }`}
                onClick={() => setCategory("creative")}
              >
                Baby's
              </button>
              <button
                className={`specialities-btn ${
                  category === "Newborn" ? "active" : ""
                }`}
                onClick={() => setCategory("Newborn")}
              >
                NewBorn
              </button>
              <button
                className={`specialities-btn ${
                  category === "all" ? "active" : ""
                }`}
                onClick={() => setCategory("all")}
              >
                All Work
              </button>
              <button
                className={`specialities-btn ${
                  category === "weddings" ? "active" : ""
                }`}
                onClick={() => setCategory("weddings")}
              >
                Weddings
              </button>
              <button
                className={`specialities-btn ${
                  category === "Maternity" ? "active" : ""
                }`}
                onClick={() => setCategory("Maternity")}
              >
                Maternity
              </button>
            </div>
          </div>
        </div>

        <div className="gallery" id="our-work">
          {(() => {
            const combined = [
              ...maternity.map((img) => ({ img, cat: "Maternity" })),
              ...newborn.map((img) => ({ img, cat: "Newborn" })),
              ...creative.map((img) => ({ img, cat: "creative" })),
              // ...weddings.map((img) => ({ img, cat: "weddings" })),
            ];

            if (category === "all") {
              return shuffledImages.slice(0, 25).map(({ img, cat }, index) => (
                <div
                  className="gallery-item"
                  key={index}
                  onClick={() => openModal(img, cat)}
                >
                  <LazyImage src={img} alt={`work-${cat}-${index}`} />
                  {/* <div className="overlay">
                    <span>View More</span>
                  </div> */}
                </div>
              ));
            }

            return combined
              .filter(({ cat }) => cat === category)
              .map(({ img, cat }, index) => (
                <div
                  className="gallery-item"
                  key={index}
                  onClick={() => openModal(img, cat)}
                >
                  <LazyImage src={img} alt={`work-${cat}-${index}`} />
                  
                </div>
              ));
          })()}
        </div>

        {isModalOpen && (
          <div className="modal" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={closeModal}>
                ✖
              </button>
              <img
                src={selectedImage}
                alt="Selected Work"
                className="modal-img"
              />
              <button className="explore-btn" onClick={handleExplore}>
                Explore This Theme
              </button>
            </div>
          </div>
        )}
        <Footer />
      </main>
    </>
  );
}

export default Home;



// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Home.css";
// import HomeImage from "../assets/Home/PRA_0339.jpg";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// function Home() {
//   const [category, setCategory] = useState("all");
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   // index & category storage
//   const [photosIndex, setPhotosIndex] = useState(null); // { slug: {category,json,count}}
//   const [categoryCache, setCategoryCache] = useState({}); // slug -> {category,slug,images[]}
//   const [shuffledImages, setShuffledImages] = useState([]);

//   const navigate = useNavigate();

//   // LazyImage component (unchanged)
//   const LazyImage = ({ src, alt }) => {
//     const [isVisible, setIsVisible] = useState(false);
//     const imgRef = useRef();

//     useEffect(() => {
//       const observer = new IntersectionObserver(
//         (entries) => {
//           entries.forEach((entry) => {
//             if (entry.isIntersecting) {
//               setIsVisible(true);
//               observer.unobserve(entry.target);
//             }
//           });
//         },
//         { threshold: 0.2 }
//       );

//       if (imgRef.current) observer.observe(imgRef.current);
//       return () => observer.disconnect();
//     }, []);

//     return (
//       <div
//         ref={imgRef}
//         style={{
//           minHeight: "200px",
//           background: "#f5f5f5",
//           marginBottom: "10px",
//           borderRadius: "10px",
//           overflow: "hidden",
//         }}
//       >
//         {isVisible ? (
//           <img
//             src={src}
//             alt={alt}
//             style={{ width: "100%", height: "auto", display: "block" }}
//           />
//         ) : (
//           <p style={{ textAlign: "center", paddingTop: "80px" }}>Loading...</p>
//         )}
//       </div>
//     );
//   };

//   // open/close modal
//   const openModal = (img, cat) => {
//     setSelectedImage(img);
//     setSelectedCategory(cat);
//     setIsModalOpen(true);
//   };
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedImage(null);
//     setSelectedCategory(null);
//   };

//   // Explore button behavior (same as your original)
//   const handleExplore = () => {
//     let route = "/";
//     switch (selectedCategory) {
//       case "creative":
//         route = "/creative";
//         break;
//       case "Maternity":
//         route = "/maternity";
//         break;
//       case "weddings":
//         route = "/weddings";
//         break;
//       case "Newborn":
//         route = "/newborn";
//         break;
//       default:
//         route = "/";
//     }
//     navigate(route);
//     closeModal();
//   };

//   // Helper: fetch JSON for a category slug (cached)
//   const fetchCategoryJson = async (slug) => {
//     if (!slug) return null;
//     if (categoryCache[slug]) return categoryCache[slug];

//     try {
//       const res = await fetch(`/photos/${slug}.json`);
//       if (!res.ok) throw new Error(`Failed to load /photos/${slug}.json`);
//       const data = await res.json(); // {category,slug,images:[]}
//       setCategoryCache((prev) => ({ ...prev, [slug]: data }));
//       return data;
//     } catch (err) {
//       console.error("fetchCategoryJson:", err);
//       return null;
//     }
//   };

//   // On mount: fetch index and pre-load a few categories for initial gallery
//   useEffect(() => {
//     let mounted = true;

//     const bootstrap = async () => {
//       try {
//         const res = await fetch("/photos/photos_index.json");
//         if (!res.ok) {
//           console.warn("/photos/photos_index.json not found or not reachable");
//           return;
//         }
//         const index = await res.json(); // { slug: {category,json,count}, ...}
//         if (!mounted) return;
//         setPhotosIndex(index);

//         // choose up to 3 categories to prefetch for initial gallery (if exist)
//         const slugs = Object.keys(index).slice(0, 3);
//         const loads = await Promise.all(slugs.map((s) => fetchCategoryJson(s)));
//         const combined = loads
//           .filter(Boolean)
//           .flatMap((c) => c.images.map((url) => ({ img: url, cat: c.category })));

//         // shuffle and set initial list (limit to 50)
//         const shuffled = combined.sort(() => Math.random() - 0.5);
//         setShuffledImages(shuffled.slice(0, 50));
//       } catch (err) {
//         console.error("Failed to load photos index:", err);
//       }
//     };

//     bootstrap();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // When the category state changes and not "all", fetch that category (lazy)
//   useEffect(() => {
//     if (category === "all") return;

//     // Map simple category names (UI) to slug keys in photos_index.
//     // You may need to adjust these mappings to match the JSON slugs created by uploader.
//     const themeMap = {
//       creative: "creative", // e.g. slug 'creative'
//       Maternity: "maternity",
//       weddings: "weddings",
//       Newborn: "newborn",
//       // add any extra mappings if your folder names differ
//     };

//     const slug = themeMap[category] || category; // fallback
//     (async () => {
//       const catData = await fetchCategoryJson(slug);
//       if (!catData) {
//         setShuffledImages([]);
//         return;
//       }
//       const combined = catData.images.map((url) => ({ img: url, cat: catData.category }));
//       setShuffledImages(combined.sort(() => Math.random() - 0.5));
//     })();
//   }, [category]);

//   // Render gallery
//   const renderGallery = () => {
//     if (category === "all") {
//       return shuffledImages.map(({ img, cat }, index) => (
//         <div className="gallery-item" key={index} onClick={() => openModal(img, cat)}>
//           <LazyImage src={img} alt={`work-${cat}-${index}`} />
//         </div>
//       ));
//     }

//     // category-specific rendering uses shuffledImages (set by effect)
//     return shuffledImages.map(({ img, cat }, index) => (
//       <div className="gallery-item" key={index} onClick={() => openModal(img, cat)}>
//         <LazyImage src={img} alt={`work-${cat}-${index}`} />
//       </div>
//     ));
//   };

//   return (
//     <>
//       <Navbar />
//       <main>
//         <div className="Hero">
//           <div className="firstImage">
//             <img src={HomeImage} alt="" />
//             <div className="heroText">
//               <h1>Welcome to Baby Photo Studio</h1>
//               <p>Capturing beautiful moments forever</p>
//               <a href="/contact-us" className="contact-btn">
//                 Contact Now
//               </a>
//             </div>
//           </div>
//         </div>

//         <div className="home-serives">
//           <div className="Service-section">
//             <div className="head">
//               <div className="head-content">
//                 <h1>What We Do</h1>
//                 <p>Explore our diverse collection of photography work across different specialties</p>
//               </div>
//             </div>
//             <div className="specialties">
//               <button className={`specialities-btn ${category === "creative" ? "active" : ""}`} onClick={() => setCategory("creative")}>
//                 Baby's
//               </button>
//               <button className={`specialities-btn ${category === "Newborn" ? "active" : ""}`} onClick={() => setCategory("Newborn")}>
//                 NewBorn
//               </button>
//               <button className={`specialities-btn ${category === "all" ? "active" : ""}`} onClick={() => setCategory("all")}>
//                 All Work
//               </button>
//               <button className={`specialities-btn ${category === "weddings" ? "active" : ""}`} onClick={() => setCategory("weddings")}>
//                 Weddings
//               </button>
//               <button className={`specialities-btn ${category === "Maternity" ? "active" : ""}`} onClick={() => setCategory("Maternity")}>
//                 Maternity
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="gallery" id="our-work">
//           {renderGallery()}
//         </div>

//         {isModalOpen && (
//           <div className="modal" onClick={closeModal}>
//             <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//               <button className="close-btn" onClick={closeModal}>
//                 ✖
//               </button>
//               <img src={selectedImage} alt="Selected Work" className="modal-img" />
//               <button className="explore-btn" onClick={handleExplore}>
//                 Explore This Theme
//               </button>
//             </div>
//           </div>
//         )}

//         <Footer />
//       </main>
//     </>
//   );
// }

// export default Home;
