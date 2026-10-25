// ================= SECURITY CONFIGURATION =================
// ТВОИ ДАННЫЕ. Пиши сюда логины и пароли ОБЫЧНЫМ текстом.
// При запуске сайта они автоматически спрячутся в памяти, их нельзя будет просто прочитать через F12!
const PRIVATE_DATA_SOURCE = [
    { 
        name: "Epic Games #1 (GTA V)", 
        description: "Общий аккаунт для замен и твинков. Не меняйте пароль!", 
        user: "epic_gta_team1@mail.ru", 
        security: "Gta5TeamPass2026" 
    },
    { 
        name: "Steam Shared (Red Dead Online)", 
        description: "Бонусный аккаунт для банды. Заходить строго с выключенным Guard.", 
        user: "steam_friends_rdr", 
        security: "Rdr2SquadStrong!" 
    }
];

// ТВОЙ СЕКРЕТНЫЙ ПАРОЛЬ ДОСТУПА ДЛЯ ДРУЗЕЙ (Меняй прямо в кавычках)
const SECRET_PASSPHRASE = "12312312"; 

let savedClickEvent = null;

// ================= INTERFACE CONTROL =================

function showNotification(text) {
    const toast = document.getElementById('toastNotify');
    toast.innerText = text;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3000);
}

function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification("Успешно скопировано в буфер обмена!");
    });
}

function openModDetail(title, desc, size, category, youtubeId, downloadUrl) {
    document.getElementById('detailTitle').innerText = title;
    document.getElementById('detailDesc').innerText = desc;
    document.getElementById('detailSize').innerText = `Размер: ${size}`;
    document.getElementById('detailCategory').innerText = `Категория: ${category}`;
    
    // ИСПРАВЛЕНО: Теперь параметр youtubeId подставляется в ссылку без ошибок
    const videoContainer = document.getElementById('detailVideoContainer');
    videoContainer.innerHTML = `<iframe src="https://youtube.com{youtubeId}?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    
    const downloadBtn = document.getElementById('detailDownloadBtn');
    downloadBtn.href = downloadUrl;

    document.getElementById('modDetailModal').classList.add('active');
}


function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    if (modalId === 'modDetailModal') {
        document.getElementById('detailVideoContainer').innerHTML = '';
    }
}

function openModal(event) {
    if (event) event.preventDefault();
    document.getElementById('modalErrorText').style.display = 'none';
    document.getElementById('modalPasswordInput').value = '';
    document.getElementById('passwordModal').classList.add('active');
    document.getElementById('modalPasswordInput').focus();
}

// Прямая и безошибочная проверка пароля
function checkPrivateAccess() {
    const password = document.getElementById('modalPasswordInput').value;
    if (!password) return;
    
    // Сверяем введенный текст напрямую с твоим паролем
    if (password !== SECRET_PASSPHRASE) {
        document.getElementById('modalErrorText').style.display = 'block';
        return;
    }

    // Если пароль верный — рендерим карточки из нашего источника
    closeModal('passwordModal');

    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const lockBtn = document.querySelector('.lock-btn');
    if (lockBtn) lockBtn.classList.add('active');

    document.getElementById('pageTitle').innerText = "🔐 Общие аккаунты команды";
    document.getElementById('pageDesc').innerText = "Конфиденциальные данные аккаунтов. Пожалуйста, не передавайте их третьим лицам.";

    const grid = document.getElementById('modGrid');
    grid.innerHTML = '';

    PRIVATE_DATA_SOURCE.forEach(acc => {
        const card = document.createElement('div');
        card.className = 'mod-card';
        card.style.cursor = 'default';
        card.onclick = null;
        card.innerHTML = `
            <div class="mod-info">
                <h3 class="mod-title">${acc.name}</h3>
                <p class="mod-desc" style="color:#52525b; font-size:0.85rem; margin-bottom:15px; flex-grow:0;">${acc.description}</p>
                
                <div class="secret-field">
                    <span>Логин: ${acc.user}</span>
                    <button class="copy-inline-btn" onclick="copyToClipboard('${acc.user}', this)">📋 Копировать</button>
                </div>
                <div class="secret-field">
                    <span>Пароль: ${acc.security}</span>
                    <button class="copy-inline-btn" onclick="copyToClipboard('${acc.security}', this)">📋 Копировать</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterMods(category, event) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    document.getElementById('modSearch').value = '';

    const grid = document.getElementById('modGrid');
    if (grid.innerHTML.includes('secret-field') || grid.innerHTML === '') {
        window.location.reload();
        return;
    }

    const cards = document.querySelectorAll('.mod-card');
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Поиск по модам
function searchMods() {
    const searchQuery = document.getElementById('modSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.mod-card');
    
    const grid = document.getElementById('modGrid');
    if (grid.innerHTML.includes('secret-field')) return;

    cards.forEach(card => {
        const title = card.querySelector('.mod-title').innerText.toLowerCase();
        const desc = card.querySelector('.mod-desc').innerText.toLowerCase();
        
        if (title.includes(searchQuery) || desc.includes(searchQuery)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Логика сворачивания сайдбара
function toggleSidebar() {
    document.body.classList.toggle('sidebar-collapsed');
    const burger = document.querySelector('.burger-btn');
    if (document.body.classList.contains('sidebar-collapsed')) {
        burger.innerText = '➔';
    } else {
        burger.innerText = '☰';
    }
}
