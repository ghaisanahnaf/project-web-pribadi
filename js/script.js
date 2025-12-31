// Tunggu sampai dokumen siap
document.addEventListener('DOMContentLoaded', () => {

    // 1. Inisialisasi AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // 2. GSAP Animasi Masuk (Hanya berjalan di awal load)
    const tl = gsap.timeline();

    tl.from("nav", {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "expo.out"
    })
        .from(".sub-title", {
            opacity: 0,
            y: 20,
            duration: 0.8
        }, "-=0.5")
        .from(".main-title", {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: "power4.out"
        }, "-=0.5")
        .from(".hero-desc", {
            opacity: 0,
            duration: 1
        }, "-=0.5")
        .from(".btn-primary, .btn-secondary", {
            opacity: 0,
            y: 20,
            stagger: 0.2,
            duration: 0.8
        }, "-=0.5");

    // 3. Efek Hover Magnetik Sederhana (Opsional)
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, { scale: 1.1, duration: 0.3 });
        });
        link.addEventListener('mouseleave', () => {
            gsap.to(link, { scale: 1, duration: 0.3 });
        });
    });
});

/* Page transition animation: intercept internal link clicks and animate */
(function () {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    const inner = document.createElement('div');
    inner.className = 'page-transition-inner';
    overlay.appendChild(inner);
    document.documentElement.appendChild(overlay);

    // On page load: play a quick reveal (overlay -> hide)
    window.addEventListener('DOMContentLoaded', () => {
        // Start visible then hide to create a smooth entrance
        requestAnimationFrame(() => {
            overlay.classList.add('show');
            // small delay so transition runs visibly
            setTimeout(() => overlay.classList.remove('show'), 50);
        });
    });

    // Helper: determine if URL is same-origin and navigable
    function isInternalLink(a) {
        if (!a || !a.href) return false;
        if (a.target === '_blank') return false;
        try {
            const url = new URL(a.href, location.href);
            if (url.origin !== location.origin) return false;
            if (url.hash && (url.pathname === location.pathname)) return false;
            return true;
        } catch (e) {
            return false;
        }
    }

    // Intercept clicks on anchor tags
    document.addEventListener('click', function (e) {
        // Only left-click without modifier keys
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const anchor = e.target.closest('a');
        if (!anchor) return;
        if (!isInternalLink(anchor)) return;

        // Let script-managed mobile menu links still run their handlers (they clean up classes),
        // but prevent default navigation so we can animate.
        e.preventDefault();

        const href = anchor.href;
        // Lock scroll while animating
        document.body.style.overflow = 'hidden';
        overlay.classList.add('show');

        // Wait for the CSS transition to complete, then navigate
        const duration = 600; // must match CSS transition
        setTimeout(() => {
            location.href = href;
        }, duration);
    }, { passive: false });
})();

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!menuBtn || !mobileMenu) return;

    // Accessibility
    menuBtn.setAttribute('aria-controls', 'mobile-menu');
    menuBtn.setAttribute('aria-expanded', 'false');

    // Toggle menu
    menuBtn.addEventListener('click', () => {
        const isActive = mobileMenu.classList.toggle('active');
        menuBtn.classList.toggle('menu-open', isActive);
        menuBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        document.body.style.overflow = isActive ? 'hidden' : 'auto';
    });

    // Highlight current page in mobile menu and close-on-click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    const currentPath = window.location.pathname;
    mobileLinks.forEach(link => {
        try {
            const linkPath = new URL(link.href, location.href).pathname;
            if (linkPath === currentPath || (currentPath === '/' && (linkPath === '/' || linkPath === '/index.html'))) {
                link.classList.add('gold-active');
            }
        } catch (e) {
            // ignore malformed hrefs
        }

        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('menu-open');
            menuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('menu-open');
            menuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
        }
    });
});

function openGallery(element) {
    const overlay = document.getElementById("galleryOverlay");
    const expandedImg = document.getElementById("expandedImg");
    const caption = document.getElementById("caption");
    const downloadBtn = document.getElementById("downloadBtn"); // Ambil elemen tombol
    
    const clickedImg = element.querySelector("img");

    if (clickedImg) {
        // Set sumber gambar dan caption
        expandedImg.src = clickedImg.src;
        caption.innerHTML = clickedImg.alt || "Sannproject Gallery";
        
        // Update link download agar sesuai dengan gambar yang diklik
        downloadBtn.href = clickedImg.src;

        // Tampilkan overlay
        overlay.style.display = "flex";
        
        // Animasi halus
        setTimeout(() => {
            expandedImg.style.transition = "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)";
            expandedImg.style.transform = "scale(1)";
            expandedImg.style.opacity = "1";
        }, 50);
    }
}

function closeGallery() {
    const overlay = document.getElementById("galleryOverlay");
    const expandedImg = document.getElementById("expandedImg");
    
    expandedImg.style.transform = "scale(0.8)";
    expandedImg.style.opacity = "0";
    
    setTimeout(() => {
        overlay.style.display = "none";
    }, 300);
}

// Pastikan kode ini diletakkan setelah library GSAP dimuat
document.addEventListener("DOMContentLoaded", function() {
    // Animasi melayang untuk semua elemen dengan class .js-floating
    gsap.to(".js-floating", {
        y: -20, // Jarak melayang ke atas
        duration: 2, // Durasi (detik)
        ease: "power1.inOut",
        yoyo: true, // Kembali lagi ke bawah
        repeat: -1, // Mengulang selamanya
        stagger: {
            each: 1, // Memberi jeda antar kartu agar tidak berbarengan
        }
    });
});

