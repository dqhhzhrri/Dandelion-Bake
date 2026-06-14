'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AppProvider, useAppContext } from './context/AppContext';
import './globals.css';

function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { 
        LOGO_URL, cartItems, currentView, setCurrentView,
        setShowGlobalSearch, setShowProfileModal,
        bestSellingItems, globalSearchInput, setGlobalSearchInput, setSelectedProductModal
    } = useAppContext();

    const handleViewChange = (view: string) => {
        setCurrentView(view);
        if (pathname !== '/') router.push('/');
    };

    return (
        <div className="app-container">
            <header className="main-header" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '70px', backgroundColor: '#14403a', color: 'white', zIndex: 1000, display: 'flex', alignItems: 'center', padding: '0 30px', borderBottom: '5px solid #FFF24B' }}>
                <div className="logo-area" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '1.2rem' }} onClick={() => handleViewChange('home-view')}>
                    <img src="/Assets/Logodandelionbake.png" alt="Logo Header" style={{ width: '40px', height: '40px', marginRight: '10px', borderRadius: '50%', objectFit: 'cover' }} onError={(e:any) => e.target.src = "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=100&h=100&q=80"} />
                    Dandelion Bake
                </div>
                <nav>
                    <ul className="nav-links" style={{ display: 'flex', gap: '25px', fontWeight: '500', marginLeft: '20px', listStyle: 'none' }}>
                        <li><a onClick={() => handleViewChange('home-view')} style={{ cursor: 'pointer', color: currentView === 'home-view' && pathname === '/' ? '#FFF24B' : 'white' }}>Menu</a></li>
                        <li><a onClick={() => handleViewChange('store-view')} style={{ cursor: 'pointer', color: currentView === 'store-view' && pathname === '/' ? '#FFF24B' : 'white' }}>Store</a></li>
                        <li><a onClick={() => handleViewChange('rewards-view')} style={{ cursor: 'pointer', color: currentView === 'rewards-view' && pathname === '/' ? '#FFF24B' : 'white' }}>Rewards</a></li>
                        <li><a onClick={() => handleViewChange('news-view')} style={{ cursor: 'pointer', color: currentView === 'news-view' && pathname === '/' ? '#FFF24B' : 'white' }}>News</a></li>
                        <li><a onClick={() => handleViewChange('group-order-view')} style={{ cursor: 'pointer', color: currentView === 'group-order-view' && pathname === '/' ? '#FFF24B' : 'white' }}>Group</a></li>
                        <li><Link href="/checkout" style={{ color: pathname === '/checkout' ? '#FFF24B' : 'white' }}>Keranjang</Link></li>
                        <li><Link href="/pesanan" style={{ color: pathname === '/pesanan' ? '#FFF24B' : 'white' }}>Pesanan</Link></li>
                    </ul>
                </nav>
                <div className="header-icons" style={{ marginLeft: 'auto', display: 'flex', gap: '15px', fontSize: '1.2rem', alignItems: 'center' }}>
                    <i className="fas fa-search" style={{ cursor: 'pointer' }} onClick={() => setShowGlobalSearch(true)}></i>
                    <div style={{ position: 'relative' }}>
                        <Link href="/checkout">
                            <i className="fas fa-shopping-bag" style={{ color: 'white' }}></i>
                            {cartItems?.length > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-10px', background: '#FFF24B', color: 'black', fontSize: '0.7rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartItems.length}</span>}
                        </Link>
                    </div>
                    <i className="far fa-user" style={{ cursor: 'pointer' }} onClick={() => setShowProfileModal(true)}></i>
                </div>
            </header>

            <main style={{ marginTop: '70px', minHeight: 'calc(100vh - 70px)' }}>
                {children}
            </main>

            <footer style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '40px 0' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
                    <div className="footer-col">
                        <h3 style={{ color: '#FFF24B', marginBottom: '20px' }}>Dandelion Bake</h3>
                        <p style={{ fontSize: '0.9rem', color: '#aaa', lineHeight: '1.6' }}>Roti artisan premium yang dipanggang dengan cinta setiap hari. Nikmati kehangatan di setiap gigitan.</p>
                    </div>
                    <div className="footer-col">
                        <h3 style={{ marginBottom: '20px' }}>Menu</h3>
                        <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', color: '#aaa' }}>
                            <li style={{ marginBottom: '10px', cursor: 'pointer' }} onClick={() => handleViewChange('home-view')}>Our Menu</li>
                            <li style={{ marginBottom: '10px', cursor: 'pointer' }} onClick={() => handleViewChange('rewards-view')}>Rewards</li>
                            <li style={{ marginBottom: '10px', cursor: 'pointer' }} onClick={() => handleViewChange('store-view')}>Store Radar</li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h3 style={{ marginBottom: '20px' }}>Hubungi Kami</h3>
                        <p style={{ fontSize: '0.9rem', color: '#aaa' }}><i className="fab fa-whatsapp"></i> +62 821-4050-6224</p>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '15px', fontSize: '1.5rem' }}>
                            <i className="fab fa-instagram"></i>
                            <i className="fab fa-tiktok"></i>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id">
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" defer></script>
                <title>Dandelion Bake - Roti Enak Setiap Hari</title>
            </head>
            <body>
                <AppProvider>
                    <LayoutContent>
                        {children}
                    </LayoutContent>
                </AppProvider>
            </body>
        </html>
    );
}
