document.addEventListener('DOMContentLoaded', () => {
    // Phần filter tag
    const urlParams = new URLSearchParams(window.location.search);
    const selectedTag = urlParams.get('tag');
    const albums = document.querySelectorAll('.album');
    const heading = document.getElementById('main-heading');

    if (selectedTag) {
        const formattedTag = selectedTag.trim();
        heading.textContent = `Album: #${formattedTag}`;

        albums.forEach(album => {
            const tags = album.dataset.tags?.split(',').map(tag => tag.trim().toLowerCase()) || [];
            if (tags.includes(formattedTag.toLowerCase())) {
                album.classList.remove('filter-hidden');
            } else {
                album.classList.add('filter-hidden');
            }
        });
    }

    // OwlCarousel
    $('.testimonial-carousel').owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav: false,
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
        }
    });
});
