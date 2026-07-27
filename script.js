const songs = [
    {
        number: 1,
        title: "నిన్నే ఆరాధింతును",
        lyrics: `నిన్నే ఆరాధింతును(4)
మహా మంచివాడు చాలా గొప్పవాడు
నిన్ను పోలిన వారెవరు(2)
హల్లెలూయ  హల్లెలూయ

1. పాపినైనా నన్ను నీవు నీ బిడ్డగా మార్చావే
మహా మంచివారు చాలా గొప్పవారు నిన్ను పోలిన వారెవరు
హల్లెలూయ  హల్లెలూయ

2. నన్ను పిలిచిన దేవా నా నమ్మదగిన దేవా
మహా మంచివారు చాలా గొప్పవారు నిన్ను పోలిన వారెవరు
హల్లెలూయ  హల్లెలూయ

3. నీ పరిశుధ ఆత్మతో నన్ను నింపుమా(2)
మహా మంచివారు చాలా గొప్పవారు నిన్ను పోలిన వారెవరు
హల్లెలూయ  హల్లెలూయ

ninne aaradhintunu(4) 
maha manchivadu chala goppavadu 
ninnu polina varevaru(2) 
Hallelujah hallelujah

1. papinainaa nannu neevu nee biddagaa marchave 
maha manchivaaru chala goppavaaru ninnu polina varevaru 
Hallelujah hallelujah

2. nannu pilichina deva naa nammadagina devaa 
maha manchivaaru chala goppavaaru ninnu polina varevaru 
Hallelujah hallelujah

3. nee parishudha aatmato nannu nimpuma(2) 
maha manchivaaru chala goppavaaru ninnu polina varevaru 
Hallelujah hallelujah`
    },
    {
        number: 2,
        title: "మహిమ ఘనత",
        lyrics: `మహిమ ఘనత నీకే చెల్లును దేవా...
హల్లెలూయా హల్లెలూయా

మహా మహిమతో రారాజుగా
త్వరలోనే యేసు వచ్చును`
    },
    {
        number: 3,
        title: "యేసయ్యా నీవే",
        lyrics: `యేసయ్యా నీవే నా ఆశ్రయము
నీవే నా దుర్గము దేవా

నన్నెంతో ప్రేమించి కాపాడితివి
నీకే నా స్తుతులు సమర్పింతును`
    }
];

const list = document.getElementById("song-list");
const lyricsBox = document.getElementById("lyrics-box");
const presOverlay = document.getElementById("presentation-overlay");

let currentSong = null;
let presentationSlides = [];
let currentSlideIndex = 0;
let currentFontSize = 21;

// Control States
let showEnglishTransliteration = true;
let isPresentationPlaying = true;

// Telugu to Roman Transliteration Engine
function transliterateTelugu(text) {
    if (!text) return "";

    const vowels = {
        'అ': 'a', 'ఆ': 'aa', 'ఇ': 'i', 'ఈ': 'ee', 'ఉ': 'u', 'ఊ': 'oo',
        'ఋ': 'ru', 'ఎ': 'e', 'ఏ': 'ae', 'ఐ': 'ai', 'ఒ': 'o', 'ఓ': 'o', 'ఔ': 'au'
    };

    const matras = {
        'ా': 'aa', 'ి': 'i', 'ీ': 'ee', 'ు': 'u', 'ూ': 'oo',
        'ృ': 'ru', 'ె': 'e', 'ే': 'ae', 'ై': 'ai', 'ొ': 'o', 'ో': 'o', 'ౌ': 'au',
        'ం': 'm', 'ః': 'h'
    };

    const consonants = {
        'క': 'k', 'ఖ': 'kh', 'గ': 'g', 'ఘ': 'gh', 'ఙ': 'ng',
        'చ': 'ch', 'ఛ': 'chh', 'జ': 'j', 'ఝ': 'jh', 'ఞ': 'ny',
        'ట': 't', 'ఠ': 'th', 'డ': 'd', 'ఢ': 'dh', 'ణ': 'n',
        'త': 'th', 'థ': 'th', 'ద': 'd', 'ధ': 'dh', 'న': 'n',
        'ప': 'p', 'ఫ': 'f', 'బ': 'b', 'భ': 'bh', 'మ': 'm',
        'య': 'y', 'ర': 'r', 'ల': 'l', 'వ': 'v', 'శ': 'sh',
        'ష': 'sh', 'స': 's', 'హ': 'h', 'ళ': 'l', 'క్ష': 'ksh', 'ఱ': 'r'
    };

    let result = "";
    let i = 0;

    while (i < text.length) {
        let char = text[i];
        let nextChar = text[i + 1] || "";

        if (/^[a-zA-Z0-9\s\(\)\.,\-\n]+$/.test(char)) {
            result += char;
            i++;
            continue;
        }

        if (vowels[char]) {
            result += vowels[char];
            i++;
        } else if (consonants[char]) {
            let base = consonants[char];
            if (nextChar === '్') {
                result += base;
                i += 2;
            } else if (matras[nextChar]) {
                result += base + matras[nextChar];
                i += 2;
            } else {
                result += base + 'a';
                i++;
            }
        } else if (matras[char]) {
            result += matras[char];
            i++;
        } else {
            result += char;
            i++;
        }
    }

    return result.split('\n').map(line => {
        let trimmed = line.trim();
        return trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : "";
    }).join('\n');
}

function formatSongNumber(num) {
    return num < 10 ? `0${num}` : `${num}`;
}

function renderSongs(songsToDisplay) {
    list.innerHTML = "";
    if (songsToDisplay.length === 0) {
        list.innerHTML = `<p style="text-align: center; color: rgba(255,255,255,0.7); font-size: 18px; margin-top: 25px;">No songs found</p>`;
        return;
    }

    songsToDisplay.forEach(song => {
        const div = document.createElement("div");
        div.className = "song";
        div.innerHTML = `
            <div class="song-left">
                <span class="song-badge">#${formatSongNumber(song.number)}</span>
                <span class="song-title">${song.title}</span>
            </div>
            <span class="song-arrow">❯</span>
        `;
        div.onclick = () => showLyrics(song);
        list.appendChild(div);
    });
}

function showLyrics(song) {
    currentSong = song;
    lyricsBox.style.display = "block";
    currentFontSize = 21;

    lyricsBox.innerHTML = `
        <div class="lyrics-header-controls">
            <div class="font-controls">
                <button class="font-btn" onclick="changeFontSize(-2)">A-</button>
                <span id="font-size-indicator">${currentFontSize}px</span>
                <button class="font-btn" onclick="changeFontSize(2)">A+</button>
            </div>
            
            <div class="action-buttons">
                <button class="action-btn present-btn" onclick="startPresentation()" title="Present Mode">🖥️</button>
                <button class="close-btn" onclick="closeLyrics()">✕</button>
            </div>
        </div>

        <div class="lyrics-title-wrapper">
            <span class="lyrics-song-badge">Song #${formatSongNumber(song.number)}</span>
            <h2>${song.title}</h2>
        </div>
        
        <div class="lyrics-divider">― ✦ ―</div>
        <pre id="lyrics-text" style="font-size: ${currentFontSize}px;">${song.lyrics}</pre>
    `;

    lyricsBox.scrollIntoView({ behavior: 'smooth' });
}

function changeFontSize(delta) {
    const lyricsText = document.getElementById("lyrics-text");
    const indicator = document.getElementById("font-size-indicator");
    if (lyricsText) {
        let newSize = currentFontSize + delta;
        if (newSize >= 15 && newSize <= 35) {
            currentFontSize = newSize;
            lyricsText.style.fontSize = `${currentFontSize}px`;
            if (indicator) indicator.textContent = `${currentFontSize}px`;
        }
    }
}

function closeLyrics() {
    lyricsBox.style.display = "none";
}

/* ================= PRESENTATION CONTROLS ================= */
function startPresentation() {
    if (!currentSong) return;

    // Filter out slides that do not contain Telugu characters
    presentationSlides = currentSong.lyrics
        .split(/\n\s*\n/)
        .map(slide => slide.trim())
        .filter(slide => slide.length > 0 && /[\u0C00-\u0C7F]/.test(slide));

    currentSlideIndex = 0;
    isPresentationPlaying = true;
    
    const playBtn = document.getElementById("pres-play-btn");
    if (playBtn) playBtn.textContent = "⏸️";

    presOverlay.style.display = "flex";
    updateSlide();
}

function exitPresentation() {
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
    }
    presOverlay.style.display = "none";
}

function updateSlide() {
    const presContent = document.getElementById("pres-content");
    
    if (!isPresentationPlaying) {
        presContent.style.opacity = "0";
        return;
    }

    presContent.style.opacity = "1";
    const totalSlides = presentationSlides.length;
    const currentVerseText = presentationSlides[currentSlideIndex];
    const transliteratedText = transliterateTelugu(currentVerseText);

    presContent.classList.remove("slide-fade-in");
    void presContent.offsetWidth; 
    presContent.classList.add("slide-fade-in");

    let contentHTML = `<div class="pres-telugu">${currentVerseText}</div>`;
    
    if (showEnglishTransliteration) {
        contentHTML += `<div class="pres-english-trans">${transliteratedText}</div>`;
    }

    presContent.innerHTML = contentHTML;

    document.getElementById("pres-title").textContent = currentSong.title;
    document.getElementById("pres-counter").textContent = `${currentSlideIndex + 1} / ${totalSlides}`;

    const upNextElem = document.getElementById("pres-upnext");
    if (currentSlideIndex < totalSlides - 1) {
        upNextElem.textContent = `Up next: verse ${currentSlideIndex + 2}`;
    } else {
        upNextElem.textContent = "End of Song";
    }
}

// 1. FULLSCREEN TOGGLE
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        presOverlay.requestFullscreen().catch(err => console.log(err));
    } else {
        document.exitFullscreen();
    }
}

// 2. PLAY / PAUSE
function togglePlayPause() {
    isPresentationPlaying = !isPresentationPlaying;
    const playBtn = document.getElementById("pres-play-btn");

    if (isPresentationPlaying) {
        playBtn.textContent = "⏸️";
        playBtn.title = "Pause/Blank Screen";
    } else {
        playBtn.textContent = "▶️";
        playBtn.title = "Play Presentation";
    }

    updateSlide();
}

// 3. EYE ICON (TRANSLITERATION TOGGLE)
function toggleTransliteration() {
    showEnglishTransliteration = !showEnglishTransliteration;
    const eyeBtn = document.getElementById("pres-eye-btn");

    if (showEnglishTransliteration) {
        eyeBtn.textContent = "👁️";
        eyeBtn.title = "Hide English Transliteration";
    } else {
        eyeBtn.textContent = "🙈";
        eyeBtn.title = "Show English Transliteration";
    }

    updateSlide();
}

function nextSlide(e) {
    if (e) e.stopPropagation();
    if (!isPresentationPlaying) return;
    if (currentSlideIndex < presentationSlides.length - 1) {
        currentSlideIndex++;
        updateSlide();
    }
}

function prevSlide(e) {
    if (e) e.stopPropagation();
    if (!isPresentationPlaying) return;
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        updateSlide();
    }
}

// Keyboard Hotkeys
document.addEventListener('keydown', (e) => {
    if (presOverlay.style.display === "flex") {
        if (e.key === "ArrowRight" || e.key === " ") nextSlide();
        if (e.key === "ArrowLeft") prevSlide();
        if (e.key === "b" || e.key === "B") togglePlayPause();
        if (e.key === "f" || e.key === "F") toggleFullscreen();
        if (e.key === "Escape" && !document.fullscreenElement) exitPresentation();
    }
});

// Initial Render
renderSongs(songs);
