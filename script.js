let currentCategory = 'all';
let currentFontSize = 20;
let activeLyrics = '';
let activeTitle = '';
let activeEngTitle = '';
let slides = [];
let currentSlideIndex = 0;

// పేజీ లోడ్ కాగానే కౌంట్‌లు అప్‌డేట్ అవుతాయి
document.addEventListener('DOMContentLoaded', () => {
    updateSongCounts();
});

// ఆల్బమ్‌ను సెలెక్ట్ చేసినప్పుడు కాల్ అయ్యే ఫంక్షన్
function selectAlbum(category, element) {
    currentCategory = category;

    // ఆల్బమ్ కార్డ్‌ల ఆక్టివ్ క్లాస్‌ని మార్చడం
    document.querySelectorAll('.glass-album').forEach(album => {
        album.classList.remove('active');
    });
    element.classList.add('active');

    // టైటిల్ ని మార్చడం
    const titleElem = document.getElementById('active-album-title');
    if (category === 'all') titleElem.innerText = "All Songs";
    else if (category === 'youth') titleElem.innerText = "Youth Retreat 2026 Songs";
    else if (category === 'sunday') titleElem.innerText = "Sunday Service Songs";

    // ఫిల్టర్ అమలు చేయడం
    filterSongs();
}

// పాటలను ఫిల్టర్ చేసే లాజిక్
function filterSongs() {
    const songs = document.querySelectorAll('.song-card');
    let count = 0;

    songs.forEach(song => {
        const category = song.getAttribute('data-category');
        if (currentCategory === 'all' || category === currentCategory) {
            song.style.display = 'flex';
            count++;
        } else {
            song.style.display = 'none';
        }
    });

    // పాటలు ఏవీ లేకపోతే మెసేజ్ చూపించడం
    const noSongsMsg = document.getElementById('no-songs-msg');
    noSongsMsg.style.display = count === 0 ? 'block' : 'none';
}

// సెర్చ్ ఫంక్షన్
function searchSongs() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const songs = document.querySelectorAll('.song-card');

    songs.forEach(song => {
        const category = song.getAttribute('data-category');
        const text = song.innerText.toLowerCase();

        if ((currentCategory === 'all' || category === currentCategory) && text.includes(query)) {
            song.style.display = 'flex';
        } else {
            song.style.display = 'none';
        }
    });
}

// ఆల్బమ్‌లలో ఉన్న పాటల సంఖ్యను లెక్కించే ఫంక్షన్
function updateSongCounts() {
    const total = document.querySelectorAll('.song-card').length;
    const youth = document.querySelectorAll('.song-card[data-category="youth"]').length;
    const sunday = document.querySelectorAll('.song-card[data-category="sunday"]').length;

    document.getElementById('count-all').innerText = total;
    document.getElementById('count-youth').innerText = youth;
    document.getElementById('count-sunday').innerText = sunday;
}

// లరిక్స్ ఓపెన్ చేసే ఫంక్షన్
function openLyrics(num, titleTel, titleEng, lyrics) {
    document.getElementById('lyrics-num').innerText = 'Song ' + num;
    document.getElementById('lyrics-telugu-heading').innerText = titleTel;
    document.getElementById('lyrics-english-sub').innerText = titleEng;

    const lyricsText = document.getElementById('lyrics-text-content');
    lyricsText.innerText = lyrics;
    lyricsText.style.fontSize = currentFontSize + 'px';

    activeLyrics = lyrics;
    activeTitle = titleTel;
    activeEngTitle = titleEng;

    const box = document.getElementById('lyrics-box');
    box.style.display = 'block';
    box.scrollIntoView({ behavior: 'smooth' });
}

function closeLyrics() {
    document.getElementById('lyrics-box').style.display = 'none';
}

// ఫాంట్ సైజ్ మార్చే లాజిక్
function changeFontSize(delta) {
    currentFontSize = Math.min(Math.max(14, currentFontSize + delta), 36);
    document.getElementById('lyrics-text-content').style.fontSize = currentFontSize + 'px';
    document.getElementById('font-size-val').innerText = currentFontSize + 'px';
}

// ప్రెజెంటేషన్ మోడ్ ఫంక్షన్స్
function startPresentation() {
    if (!activeLyrics) return;

    slides = activeLyrics.split('\n\n').filter(s => s.trim() !== '');
    currentSlideIndex = 0;

    document.getElementById('pres-song-heading').innerText = activeTitle;
    document.getElementById('pres-overlay').style.display = 'flex';
    renderSlide();
}

function renderSlide() {
    if (slides.length === 0) return;

    document.getElementById('pres-telugu-text').innerText = slides[currentSlideIndex];
    document.getElementById('pres-english-text').innerText = activeEngTitle;
    document.getElementById('pres-slide-counter').innerText = `Slide ${currentSlideIndex + 1} / ${slides.length}`;
}

function nextSlide(e) {
    if(e) e.stopPropagation();
    if (currentSlideIndex < slides.length - 1) {
        currentSlideIndex++;
        renderSlide();
    }
}

function prevSlide(e) {
    if(e) e.stopPropagation();
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderSlide();
    }
}

function exitPresentation() {
    document.getElementById('pres-overlay').style.display = 'none';
}
