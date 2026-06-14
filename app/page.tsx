'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useAppContext } from './context/AppContext';
import { useSearchParams } from 'next/navigation';

function HomeContent() {
    // FIX: Mengambil state dan handler dari AppContext
    const { 
        setCartItems, bestSellingItems, setBestSellingItems, points, setPoints, currentView, setCurrentView,
        isGeneratingAI, isScanning, scannedStore, highlightedStoreId, mapRef, luckyPrize, isOpeningBox,
        voucherQuota, setVoucherQuota, isNotified, setIsNotified, isCodeRevealed, setIsCodeRevealed,
        groupStep, setGroupStep, groupEvent, setGroupEvent, groupPax, setGroupPax,
        searchQuery, setSearchQuery, handleSearch, startStoreRadar, teleportToCard, focusMapOnStore,
        addToCart, addGroupOrderToCart, handleRedeem, handleOpenLuckyBox,
        LOGO_URL, storeLocations, groupPackages, getProductCategory
    } = useAppContext();
    
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    
    const [selectedProductModal, setSelectedProductModal] = useState<any>(null);
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(5);

    // Filter Kategori Aktif
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const productSectionRef = useRef<HTMLDivElement>(null);

    const filteredProducts = selectedCategory 
        ? bestSellingItems.filter((item: any) => getProductCategory(item.name) === selectedCategory)
        : bestSellingItems;

    const handleCategoryClick = (categoryName: string) => {
        if (selectedCategory === categoryName) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(categoryName);
            setTimeout(() => {
                productSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    const submitReview = () => {
        if (!newReviewText.trim()) return alert("Tolong isi komentar ulasanmu terlebih dahulu ya!");

        const newReviewObj = { 
            user: "Dandelion Lovers", 
            rating: newReviewRating, 
            comment: newReviewText 
        };

        const updatedItems = bestSellingItems.map((item:any) => {
            if (item.name === selectedProductModal.name) {
                const totalRatings = (item.reviews?.reduce((acc:any, curr:any) => acc + curr.rating, 0) || 0) + newReviewRating;
                const newAvgRating = (totalRatings / ((item.reviews?.length || 0) + 1)).toFixed(1);
                return { ...item, rating: parseFloat(newAvgRating), reviews: [newReviewObj, ...(item.reviews || [])] };
            }
            return item;
        });
        setBestSellingItems(updatedItems);

        setSelectedProductModal((prev:any) => ({
            ...prev,
            rating: updatedItems.find((i:any) => i.name === prev.name).rating,
            reviews: [newReviewObj, ...(prev.reviews || [])]
        }));

        setNewReviewText('');
        setNewReviewRating(5);
        alert("Terima kasih! Ulasanmu berhasil ditambahkan.");
    };

    // FIX: Memastikan sinkronisasi URL jika ada dengan Context Global
    useEffect(() => {
        if (tabFromUrl && tabFromUrl !== currentView) {
            setCurrentView(tabFromUrl);
        }
    }, [tabFromUrl, setCurrentView, currentView]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes smoothFade {
                    0% { opacity: 0; transform: translateY(15px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .smooth-transition {
                    animation: smoothFade 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
                }
                .scanning-bar {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: #14403a;
                    box-shadow: 0 0 10px #14403a;
                    animation: scan 2s linear infinite;
                }
                @keyframes scan {
                    0% { left: 0; }
                    100% { left: 100%; }
                }
                .highlighted {
                    border: 3px solid #14403a !important;
                    box-shadow: 0 0 20px rgba(20, 64, 58, 0.3) !important;
                }
            `}} />

            {/* HOME VIEW KONTEN */}
            {currentView === 'home-view' && (
                <section key="home-view" className="view-section smooth-transition">
                    <div className="hero-section" style={{ height: '400px', backgroundColor: '#000', overflow: 'hidden' }}>
                        <img src="https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?auto=format&fit=crop&w=1200&h=400&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} alt="Banner" />
                    </div>
                    
                    <div className="featured-container-wrapper" style={{ backgroundColor: '#5d3a3a', paddingBottom: '50px' }}>
                        <div className="container featured-boxes-container" style={{ position: 'relative', top: '-80px', marginBottom: '-40px' }}>
                            <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                                <div onClick={() => handleCategoryClick("Donat Favorit")} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', textAlign: 'center', cursor: 'pointer', border: selectedCategory === "Donat Favorit" ? '3px solid #14403a' : 'none' }}>
                                    <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&h=300&q=80" style={{ height: '200px', objectFit: 'cover' }} alt="Donat Lumer" />
                                    <h3 style={{ margin: '15px 0', color: '#14403a' }}>Donat Favorit</h3>
                                </div>
                                <div onClick={() => handleCategoryClick("Our Signatures")} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', textAlign: 'center', cursor: 'pointer', border: selectedCategory === "Our Signatures" ? '3px solid #14403a' : 'none' }}>
                                    <img src="https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=400&h=300&q=80" style={{ height: '200px', objectFit: 'cover' }} alt="Signatures" />
                                    <h3 style={{ margin: '15px 0', color: '#14403a' }}>Our Signatures</h3>
                                </div>
                                <div onClick={() => handleCategoryClick("Cookie Shots")} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', textAlign: 'center', cursor: 'pointer', border: selectedCategory === "Cookie Shots" ? '3px solid #14403a' : 'none' }}>
                                    <img src="https://images.unsplash.com/photo-1618923850107-d1a234d7a73a?auto=format&fit=crop&w=400&h=300&q=80" style={{ height: '200px', objectFit: 'cover' }} alt="Cookie Shots" />
                                    <h3 style={{ margin: '15px 0', color: '#14403a' }}>Cookie Shots</h3>
                                </div>
                                <div onClick={() => handleCategoryClick("Aneka Roti Klasik")} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', textAlign: 'center', cursor: 'pointer', border: selectedCategory === "Aneka Roti Klasik" ? '3px solid #14403a' : 'none' }}>
                                    <img src="https://images.unsplash.com/photo-1597079910443-60c43fc4f729?auto=format&fit=crop&w=400&h=300&q=80" style={{ height: '200px', objectFit: 'cover' }} alt="Aneka Roti" />
                                    <h3 style={{ margin: '15px 0', color: '#14403a' }}>Aneka Roti Klasik</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div ref={productSectionRef} className="home-products-section" style={{ backgroundColor: '#FFF24B', padding: '40px 0' }}>
                        <div className="container">
                            <h2 style={{ fontSize: '1.8rem', fontStyle: 'italic', marginBottom: '25px', color: '#14403a' }}>
                                {selectedCategory ? `✨ Kategori: ${selectedCategory}` : "✨ Our Best Selling Items"}
                            </h2>
                            <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                                {filteredProducts.map((item: any, index: number) => (
                                    <div key={index} style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #eee' }} onClick={() => setSelectedProductModal(item)}>
                                        <div style={{ position: 'relative', height: '200px' }}>
                                            <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.9)', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                <i className="fas fa-star" style={{ color: '#f5b041' }}></i> {item.rating}
                                            </div>
                                            <img src={item.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.name} />
                                        </div>
                                        <div style={{ padding: '15px' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#333' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888', margin: '5px 0' }}>{item.sold} Terjual • ({item.pax} pax)</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                                <div style={{ fontWeight: 'bold', color: '#14403a', fontSize: '1.1rem' }}>Rp {item.price.toLocaleString('id-ID')}</div>
                                                <button onClick={(e) => { e.stopPropagation(); addToCart(item); }} style={{ background: '#14403a', color: '#FFF24B', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' }}><i className="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* HALAMAN REWARDS */}
            {currentView === 'rewards-view' && (
                <section key="rewards-view" className="view-section smooth-transition" style={{ padding: '60px 0' }}>
                    <div className="container">
                        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontStyle: 'italic', fontSize: '2.2rem', color: '#14403a' }}>Tukarkan Poin</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                            <div className="member-card" style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)', color: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.15)', position: 'sticky', top: '90px', height: 'fit-content' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div><p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>Halo, Dandelion Lovers!</p><h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Dandelion Loyalty</h3></div>
                                    <div style={{ background: 'white', padding: '5px 15px', borderRadius: '20px', color: '#AA7C11', fontWeight: 'bold', fontSize: '0.8rem', height: 'fit-content' }}>GOLD MEMBER</div>
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '0' }}>Total Poin Kamu</p>
                                    <h1 style={{ fontSize: '3.5rem', margin: '0' }}>{points.toLocaleString('id-ID')}</h1>
                                </div>
                                <div style={{ marginTop: '25px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
                                        <span>{10000 - points > 0 ? `${(10000 - points).toLocaleString('id-ID')} poin menuju Diamond` : 'Diamond Member!'}</span><span>10.000 Pts</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px' }}>
                                        <div style={{ width: `${Math.min((points / 10000) * 100, 100)}%`, height: '100%', background: 'white', borderRadius: '4px', transition: 'width 0.5s' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {[
                                    { img: "https://images.unsplash.com/photo-1555507036-ab1e4006a2a0?auto=format&fit=crop&w=400&h=400&q=80", cost: 500, title: "Gratis 1 Classic Croissant" },
                                    { img: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=400&h=400&q=80", cost: 1000, title: "Diskon 50% Whole Cake" },
                                    { img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&h=400&q=80", cost: 2500, title: "Gratis 4pc Cronut Gift Box" },
                                    { img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&h=400&q=80", cost: 1500, title: "Signature Brownies Pack" }
                                ].map((promo, idx) => (
                                    <div key={idx} style={{ backgroundImage: `url(${promo.img})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '300px', borderRadius: '20px', position: 'relative', overflow: 'hidden', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px' }}>
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}></div>
                                        <div style={{ position: 'relative', zIndex: 2 }}>
                                            <div style={{ background: '#FFF24B', color: '#14403a', display: 'inline-block', padding: '4px 10px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px' }}>{promo.cost} Poin</div>
                                            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>{promo.title}</h3>
                                            <button style={{ width: '100%', padding: '10px', background: 'white', border: 'none', borderRadius: '20px', color: '#14403a', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleRedeem(promo.cost, promo.title)}>Tukarkan</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* HALAMAN NEWS & PROMO */}
            {currentView === 'news-view' && (
                <section key="news-view" className="view-section container smooth-transition" style={{ padding: '40px 0' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#14403a', fontStyle: 'italic', fontSize: '2.2rem' }}>News & Promo</h2>
                    <div style={{ background: 'white', border: '3px solid #14403a', padding: '40px', borderRadius: '20px', marginBottom: '40px', textAlign: 'center' }}>
                        {!isOpeningBox && !luckyPrize && (
                            <div>
                                <h2 style={{ fontWeight: 'bold', fontSize: '2rem', marginBottom: '10px', color: '#14403a' }}>🎁 Dandelion Daily Lucky Box</h2>
                                <p style={{ fontSize: '0.95rem', marginBottom: '25px', color: '#666' }}>Klik tombol di bawah untuk mendapatkan voucher rahasia hari ini!</p>
                                <button onClick={handleOpenLuckyBox} style={{ background: '#14403a', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '30px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }}><i className="fas fa-box-open"></i> Buka Kotak</button>
                            </div>
                        )}
                        {isOpeningBox && (
                            <div style={{ color: '#14403a' }}>
                                <i className="fas fa-gift fa-spin" style={{ fontSize: '3.5rem', marginBottom: '15px' }}></i>
                                <h3>Membuka kotak keberuntungan...</h3>
                            </div>
                        )}
                        {!isOpeningBox && luckyPrize && (
                            <div style={{ color: 'black' }}>
                                <span style={{ fontSize: '3rem' }}>🎉</span>
                                <h3 style={{ color: '#14403a', fontWeight: 'bold', fontSize: '1.8rem', marginTop: '10px' }}>{luckyPrize.name}</h3>
                                <p style={{ color: '#666', marginBottom: '20px' }}>{luckyPrize.desc}</p>
                                <div style={{ background: '#fffde7', border: '2px dashed #AA7C11', padding: '15px', borderRadius: '10px', fontSize: '1.3rem', fontWeight: 'bold', letterSpacing: '2px', color: '#AA7C11', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', maxWidth: '400px', margin: '0 auto 20px auto' }}>
                                    <span>{luckyPrize.code}</span>
                                    <button onClick={() => { navigator.clipboard.writeText(luckyPrize.code); alert("Disalin!"); }} style={{ background: '#14403a', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Salin</button>
                                </div>
                                <button onClick={() => setLuckyPrize(null)} style={{ background: '#eee', border: 'none', padding: '10px 25px', borderRadius: '20px', cursor: 'pointer' }}>Tutup</button>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* HALAMAN GROUP ORDER */}
            {currentView === 'group-order-view' && (
                <section key="group-order-view" className="view-section container smooth-transition" style={{ padding: '40px 0' }}>
                    <h2 style={{ fontStyle: 'italic', fontSize: '2.2rem', marginBottom: '30px', color: '#14403a' }}>Group Order</h2>
                    <div style={{ background: 'white', border: '3px solid #14403a', borderRadius: '20px', padding: '40px', textAlign: 'left', color: 'black' }}>
                        {groupStep === 1 && (
                            <div>
                                <h3 style={{ fontWeight: 'bold', fontSize: '1.4rem', color: '#14403a' }}>🎈 Langkah 1: Detail Acara</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', margin: '30px 0' }}>
                                    <div>
                                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Jenis Acara:</label>
                                        <select value={groupEvent} onChange={(e) => setGroupEvent(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #ddd' }}>
                                            <option value="Kantor">Meeting / Corporate</option>
                                            <option value="UlangTahun">Birthday Party</option>
                                            <option value="Kasual">Arisan / Santai</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Estimasi Pax:</label>
                                        <input type="number" value={groupPax} onChange={(e) => setGroupPax(parseInt(e.target.value) || 1)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #ddd' }} />
                                    </div>
                                </div>
                                <button onClick={() => setGroupStep(2)} style={{ width: '100%', padding: '15px', background: isGeneratingAI ? '#888' : '#14403a', color: 'white', border: 'none', borderRadius: '30px', fontSize: '1.05rem', fontWeight: 'bold', cursor: 'pointer' }} disabled={isGeneratingAI}>
                                    {isGeneratingAI ? 'Menganalisis...' : 'Generate Paket AI'}
                                </button>
                            </div>
                        )}
                        {groupStep === 2 && (
                            <div>
                                <h3 style={{ fontWeight: 'bold', fontSize: '1.4rem', color: '#14403a' }}>✨ Langkah 2: Rekomendasi AI</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', background: '#f5f7f6', padding: '25px', borderRadius: '15px', margin: '20px 0', border: '1px solid #e0e0e0' }}>
                                    <div>
                                        <h4 style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '10px' }}>{groupPackages[groupEvent].name}</h4>
                                        <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '15px' }}>{groupPackages[groupEvent].items}</p>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>Rp {groupPackages[groupEvent].price.toLocaleString('id-ID')}</div>
                                    </div>
                                    <img src={groupPackages[groupEvent].img} style={{ borderRadius: '10px', height: '180px', objectFit: 'cover' }} alt="Package" />
                                </div>
                                <button onClick={addGroupOrderToCart} style={{ width: '100%', padding: '15px', background: 'black', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' }}>Kunci & Checkout</button>
                            </div>
                        )}
                        {groupStep === 3 && (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3.5rem' }}>🎉</div>
                                <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#14403a' }}>Berhasil!</h3>
                                <p>Pesanan grup telah ditambahkan ke keranjang.</p>
                                <button onClick={() => setGroupStep(1)} style={{ marginTop: '20px', padding: '10px 30px', background: '#eee', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>Tutup</button>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* HALAMAN STORE RADAR */}
            {currentView === 'store-view' && (
                <section key="store-view" className="view-section container smooth-transition" style={{ padding: '20px 0' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <i className="fas fa-satellite-dish" style={{ fontSize: '3.5rem', color: '#14403a', marginBottom: '15px' }}></i>
                        <h2 style={{ fontWeight: '900', fontSize: '2.5rem', color: '#14403a' }}>Dandelion Store Radar</h2>
                    </div>

                    <div style={{ maxWidth: '800px', margin: '0 auto 30px auto', display: 'flex', gap: '15px' }}>
                        <input type="text" placeholder="Ketik nama kota..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} style={{ flex: 1, padding: '15px 25px', borderRadius: '30px', border: '2px solid #ddd', fontSize: '1rem', outline: 'none' }} />
                        <button onClick={handleSearch} style={{ background: '#14403a', color: '#FFF24B', padding: '15px 40px', borderRadius: '30px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Cari</button>
                    </div>

                    {isScanning && (
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#14403a' }}></i>
                            <p>Mencari lokasi...</p>
                        </div>
                    )}

                    {!isScanning && scannedStore && (
                        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '30px', position: 'relative', overflow: 'hidden' }}>
                            <div className="scanning-bar"></div>
                            <img src={scannedStore.img} style={{ borderRadius: '10px', height: '150px', objectFit: 'cover' }} alt={scannedStore.name} />
                            <div>
                                <h3 style={{ color: '#14403a', margin: 0 }}>{scannedStore.name}</h3>
                                <p style={{ fontSize: '0.9rem', color: '#666' }}>{scannedStore.address}</p>
                                <button onClick={() => teleportToCard(scannedStore)} style={{ background: '#14403a', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', marginTop: '10px' }}>Lihat di Peta</button>
                            </div>
                        </div>
                    )}

                    <div id="map" ref={mapRef} style={{ height: '450px', borderRadius: '24px', border: '3px solid #14403a', marginBottom: '30px' }}></div>

                    <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        {storeLocations.map((store: any) => (
                            <div id={`store-card-${store.id}`} key={store.id} className={`store-card ${highlightedStoreId === store.id ? 'highlighted' : ''}`} style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #eee' }} onClick={() => focusMapOnStore(store.lat, store.lng)}>
                                <img src={store.img} style={{ height: '120px', objectFit: 'cover' }} alt={store.name} />
                                <div style={{ padding: '10px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#14403a' }}>{store.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#666' }}>{store.address}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* MODAL DETAIL PRODUK */}
            {selectedProductModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedProductModal(null)}>
                    <div style={{ background: 'white', width: '92%', maxWidth: '480px', borderRadius: '24px', overflow: 'hidden', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ height: '240px', position: 'relative' }}>
                            <img src={selectedProductModal.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={selectedProductModal.name} />
                            <button onClick={() => setSelectedProductModal(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>&times;</button>
                        </div>
                        <div style={{ padding: '20px', overflowY: 'auto' }}>
                            <h3 style={{ color: '#14403a', margin: 0, fontSize: '1.5rem' }}>{selectedProductModal.name}</h3>
                            <p style={{ color: '#666', margin: '10px 0' }}>{selectedProductModal.description}</p>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                <div style={{ background: '#f0f0f0', padding: '5px 10px', borderRadius: '10px', fontSize: '0.8rem' }}>Stock: {selectedProductModal.stock}</div>
                                <div style={{ background: '#f0f0f0', padding: '5px 10px', borderRadius: '10px', fontSize: '0.8rem' }}>{selectedProductModal.rating} ★</div>
                            </div>
                            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                                <h4 style={{ margin: '0 0 10px 0' }}>Ulasan ({selectedProductModal.reviews?.length || 0})</h4>
                                {selectedProductModal.reviews?.map((rev: any, i: number) => (
                                    <div key={i} style={{ background: '#f9f9f9', padding: '10px', borderRadius: '10px', marginBottom: '10px' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{rev.user}</div>
                                        <p style={{ fontSize: '0.8rem', margin: '5px 0' }}>{rev.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ padding: '20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#14403a' }}>Rp {selectedProductModal.price.toLocaleString('id-ID')}</div>
                            <button onClick={() => addToCart(selectedProductModal)} style={{ background: '#14403a', color: '#FFF24B', padding: '10px 25px', borderRadius: '25px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Tambah ke Keranjang</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#14403a', fontWeight: 'bold' }}>Memuat Katalog Roti...</div>}>
      <HomeContent />
    </Suspense>
  );
}
