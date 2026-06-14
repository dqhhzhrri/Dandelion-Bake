'use client';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { createOrder } from '../actions/orders';

const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
    // CDN Fallback Images
    const LOGO_URL = "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=100&h=100&q=80";
    const HALAL_URL = "https://img.icons8.com/ios/50/e0bb66/halal-sign.png";
    const GAMBAR_1 = "https://images.unsplash.com/photo-1555507036-ab1e4006a2a0?auto=format&fit=crop&w=800&q=80";
    const GAMBAR_2 = "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80";
    const GAMBAR_3 = "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80";
    const GAMBAR_4 = "https://images.unsplash.com/photo-1618923850107-d1a234d7a73a?auto=format&fit=crop&w=800&q=80";
    const GAMBAR_5 = "https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?auto=format&fit=crop&w=800&q=80";
    const VID_POSTER = "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?auto=format&fit=crop&w=1200&h=400&q=80";

    const [currentView, setCurrentView] = useState('home-view');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showGlobalSearch, setShowGlobalSearch] = useState(false);
    const [globalSearchInput, setGlobalSearchInput] = useState('');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [points, setPoints] = useState(8025);
    const [selectedProductModal, setSelectedProductModal] = useState<any>(null);
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(5);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [showPaymentGate, setShowPaymentGate] = useState(false);
    const [primaryMethod, setPrimaryMethod] = useState(null);
    const [selectedSubMethod, setSelectedSubMethod] = useState('credit');
    const [cardName, setCardName] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [activeOrders, setActiveOrders] = useState<any[]>([]);

    // STORE LOCATOR STATES
    const [showAllStores, setShowAllStores] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedStoreId, setHighlightedStoreId] = useState<number | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scannedStore, setScannedStore] = useState<any>(null);
    const mapRef = useRef<any>(null);
    const mapInstance = useRef<any>(null);

    // GROUP ORDER STATES
    const [groupStep, setGroupStep] = useState(1);
    const [groupEvent, setGroupEvent] = useState('Kantor');
    const [groupPax, setGroupPax] = useState(15);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    // LUCKY BOX & VOUCHER STATES
    const [isOpeningBox, setIsOpeningBox] = useState(false);
    const [luckyPrize, setLuckyPrize] = useState<any>(null);
    const [isNotified, setIsNotified] = useState(false);
    const [voucherQuota, setVoucherQuota] = useState(7);
    const [isCodeRevealed, setIsCodeRevealed] = useState(false);

    const defaultReviews = [
        { author: "Rina S.", rating: 5, text: "Rasanya premium banget, manisnya pas!", date: "12/05/2026" },
        { author: "Andi Wijaya", rating: 4, text: "Enak, packaging rapi, cocok buat kado.", date: "10/05/2026" }
    ];

    const bestSellingItemsData = [
        { name: "4pc Cronut Gift Box", price: 55000, pax: 4, img: GAMBAR_1, rating: "4.9", sold: "2rb+", reviews: [...defaultReviews] },
        { name: "Cronut & DKA Combo", price: 50000, pax: 4, img: GAMBAR_3, rating: "4.8", sold: "1.5rb+", reviews: [...defaultReviews] },
        { name: "4pc DKA Gift Box", price: 48000, pax: 4, img: GAMBAR_2, rating: "4.9", sold: "3rb+", reviews: [...defaultReviews] },
        { name: "Cookie Shot Gift Box", price: 35000, pax: 3, img: GAMBAR_4, rating: "4.7", sold: "800+", reviews: [...defaultReviews] },
        { name: "Signature Brownies", price: 28000, pax: 2, img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=300&h=200&q=80", rating: "4.9", sold: "5rb+", reviews: [] },
        { name: "Strawberry Tart", price: 25000, pax: 1, img: "https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&w=300&h=200&q=80", rating: "4.8", sold: "1.2rb+", reviews: [] },
        { name: "Classic Croissant", price: 18000, pax: 1, img: "https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?auto=format&fit=crop&w=800&q=80", rating: "4.9", sold: "10rb+", reviews: [] },
        { name: "Artisan Baguette", price: 15000, pax: 1, img: GAMBAR_5, rating: "4.6", sold: "1.5rb+", reviews: [] }
    ];
    const [bestSellingItems, setBestSellingItems] = useState(bestSellingItemsData);

    const storeLocations = [
        { id: 1, name: "Jakarta (Senopati)", lat: -6.2349, lng: 106.8115, address: "Jl. Senopati No. 45, Jakarta Selatan", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&h=150&q=80" },
        { id: 2, name: "Bandung (Braga)", lat: -6.9175, lng: 107.6098, address: "Jl. Braga No. 12, Bandung", img: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=300&h=150&q=80" },
        { id: 3, name: "Surabaya (Sukolilo)", lat: -7.2823, lng: 112.7949, address: "Jl. Kampus ITS Sukolilo, Surabaya", img: "https://images.unsplash.com/photo-1559925393-8be0ec41b50d?auto=format&fit=crop&w=300&h=150&q=80" },
        { id: 4, name: "Bali (Seminyak)", lat: -8.6839, lng: 115.1675, address: "Jl. Kayu Aya, Seminyak, Bali", img: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?auto=format&fit=crop&w=300&h=150&q=80" },
        { id: 5, name: "Yogyakarta (Malioboro)", lat: -7.7956, lng: 110.3695, address: "Jl. Malioboro No. 88, Yogyakarta", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&h=150&q=80" }
    ];

    const groupPackages: any = {
        Kantor: { name: "Corporate Coffee Break", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&h=300&q=80", items: "5x Croissant, 5x Baguette, 5x Cake", price: 350000 },
        UlangTahun: { name: "Sweet Birthday Bundles", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&h=300&q=80", items: "1x Whole Cake, 8x Donat, 8x Cupcakes", price: 450000 },
        Kasual: { name: "Picnic Sharing Box", img: "https://images.unsplash.com/photo-1618923850107-d1a234d7a73a?auto=format&fit=crop&w=600&h=300&q=80", items: "10x Cookies, 5x Lava Cake, 5x Roll", price: 250000 }
    };

    // PERSISTENCE
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) setCartItems(JSON.parse(savedCart));
        const savedPoints = localStorage.getItem('points');
        if (savedPoints) setPoints(parseInt(savedPoints) || 8025);
        const savedOrders = localStorage.getItem('activeOrders');
        if (savedOrders) setActiveOrders(JSON.parse(savedOrders));
    }, []);

    useEffect(() => { localStorage.setItem('cart', JSON.stringify(cartItems)); }, [cartItems]);
    useEffect(() => { localStorage.setItem('points', points.toString()); }, [points]);
    useEffect(() => { localStorage.setItem('activeOrders', JSON.stringify(activeOrders)); }, [activeOrders]);

    // MAP RE-INITIALIZATION EFFECT (Watches view change)
    useEffect(() => {
        const initMap = () => {
            if (typeof window !== 'undefined' && (window as any).L && mapRef.current && !mapInstance.current) {
                mapInstance.current = (window as any).L.map(mapRef.current).setView([-2.5489, 118.0149], 5);
                (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(mapInstance.current);

                storeLocations.forEach(store => {
                    (window as any).L.marker([store.lat, store.lng])
                        .addTo(mapInstance.current)
                        .bindPopup(`<b>${store.name}</b><br>${store.address}`);
                });
                
                setTimeout(() => { if (mapInstance.current) mapInstance.current.invalidateSize(); }, 500);
            }
        };

        if (currentView === 'store-view') {
            const checkLeaflet = setInterval(() => {
                if ((window as any).L && mapRef.current) {
                    initMap();
                    clearInterval(checkLeaflet);
                }
            }, 300);
            return () => clearInterval(checkLeaflet);
        } else if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
        }
    }, [currentView, storeLocations]);

    // HANDLERS
    const getProductCategory = (name: string) => {
        if (name.includes("Cronut") || name.includes("Combo")) return "Donat Favorit";
        if (name.includes("Cookie Shot")) return "Cookie Shots";
        if (name.includes("Croissant") || name.includes("Baguette")) return "Aneka Roti Klasik";
        return "Our Signatures";
    };

    const addToCart = (product: any) => {
        setCartItems((prev:any) => [...prev, { ...product, id: Date.now().toString(), qty: 1 }]);
        alert(`${product.name} masuk keranjang!`);
    };

    const handleCheckoutSuccess = async (requireTerms: boolean) => {
        if (requireTerms && !termsAgreed) return alert("Centang persetujuan dulu!");
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const total = Math.round(subtotal * 1.1);
        const result = await createOrder({
            namaPembeli: customerName || "Guest",
            totalTagihan: total,
            items: cartItems.map(i => ({ name: i.name, qty: i.qty }))
        });

        if (result.success) {
            const newOrder = { id: result.order.id, date: new Date().toLocaleDateString('id-ID'), total, items: cartItems.map(i => ({ name: i.name, qty: i.qty })), status: 'Dikonfirmasi' };
            setActiveOrders(prev => [newOrder, ...prev]);
            setCartItems([]);
            setShowPaymentGate(false);
            setCurrentView('order-tracking-view');
            alert("Pesanan Berhasil!");
            return true;
        }
        return false;
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        const found = storeLocations.find(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.address.toLowerCase().includes(searchQuery.toLowerCase()));
        if (found) {
            focusMapOnStore(found.lat, found.lng);
            setHighlightedStoreId(found.id);
            const card = document.getElementById(`store-card-${found.id}`);
            if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const focusMapOnStore = (lat: number, lng: number) => {
        if (mapInstance.current) mapInstance.current.setView([lat, lng], 15);
    };

    const handleOpenLuckyBox = () => {
        setIsOpeningBox(true); setLuckyPrize(null);
        setTimeout(() => {
            setIsOpeningBox(false);
            setLuckyPrize({ name: "Diskon Rp10.000", code: "BAKEOFF10K", desc: "Berlaku hari ini." });
        }, 1500);
    };

    const contextValue = {
        LOGO_URL, currentView, setCurrentView, points, setPoints, cartItems, setCartItems,
        bestSellingItems, setBestSellingItems, showGlobalSearch, setShowGlobalSearch,
        showProfileModal, setShowProfileModal, selectedProductModal, setSelectedProductModal,
        newReviewText, setNewReviewText, newReviewRating, setNewReviewRating,
        showPaymentGate, setShowPaymentGate, primaryMethod, setPrimaryMethod,
        selectedSubMethod, setSelectedSubMethod, cardName, setCardName,
        customerName, setCustomerName, termsAgreed, setTermsAgreed, activeOrders,
        showAllStores, setShowAllStores, searchQuery, setSearchQuery, highlightedStoreId,
        isScanning, scannedStore, setScannedStore, mapRef, groupStep, setGroupStep,
        groupEvent, setGroupEvent, groupPax, setGroupPax, isGeneratingAI,
        isOpeningBox, luckyPrize, isNotified, setIsNotified, voucherQuota, setVoucherQuota,
        isCodeRevealed, setIsCodeRevealed, storeLocations, groupPackages,
        getProductCategory, addToCart, handleCheckoutSuccess, handleRedeem: (c:number, t:string) => alert(`Redeem ${t}`),
        addGroupOrderToCart: () => { setIsGeneratingAI(true); setTimeout(() => { setGroupStep(3); setIsGeneratingAI(false); }, 1500); },
        handleOpenLuckyBox, handleSearch, teleportToCard: (s:any) => focusMapOnStore(s.lat, s.lng), focusMapOnStore
    };

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useAppContext() { return useContext(AppContext); }
