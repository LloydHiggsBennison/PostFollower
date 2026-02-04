// Postfollower - Content Generator (Producción Segura)
const HISTORY_KEY = 'Postfollower_history';

// API Backend en Render
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://saas-backend-wc0y.onrender.com';

function getHistory() {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

function saveToHistory(data) {
    const history = getHistory();
    history.unshift({
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString()
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    const history = getHistory();

    if (history.length === 0) {
        historyList.innerHTML = '<p class="placeholder-text" style="text-align: center; padding: 2rem;">No tienes generaciones aún</p>';
        return;
    }

    historyList.innerHTML = history.map(item => `
        <div class="history-item" onclick="showHistoryItem('${item.id}')">
            <div class="history-item-header">
                <span class="history-item-type">${item.businessType} - ${item.posts.length} posts</span>
                <span class="history-item-date">${new Date(item.createdAt).toLocaleDateString('es-CL')}</span>
            </div>
            <p class="history-item-preview">${item.posts[0]?.content?.substring(0, 100)}...</p>
        </div>
    `).join('');
}

function showHistoryItem(id) {
    const history = getHistory();
    const item = history.find(h => h.id === parseInt(id));
    if (item) {
        displayPosts(item.posts);
        document.querySelector('.sidebar-nav a[data-page="generator"]').click();
    }
}

// Generate content via Backend API (SEGURO)
async function generateContent(data) {
    const response = await fetch(`${API_URL}/api/Postfollower/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al generar el contenido');
    }

    const result = await response.json();
    return result.posts;
}

// Demo content generation (fallback)
function generateDemoContent(data) {
    const templates = {
        instagram: [
            { content: `✨ ¿Sabías que ${data.businessType} puede transformar tu día? Descubre cómo en nuestra última publicación 👆\n\n¿Cuál es tu experiencia favorita con nosotros? Cuéntanos en los comentarios 💬`, hashtags: ['#Emprendimiento', '#Chile', '#Calidad'] },
            { content: `🔥 ¡Nuevo en ${data.businessType}!\n\nEstamos emocionados de compartir esto contigo. Porque tú mereces lo mejor 💯\n\n¿Te gustaría probarlo? Escríbenos 📩`, hashtags: ['#Novedades', '#Tendencias', '#MejorCalidad'] },
            { content: `💡 CONSEJO DEL DÍA\n\nUn pequeño cambio puede hacer una gran diferencia. En ${data.businessType} lo sabemos bien.\n\n¿Cuál es tu hack favorito? 👇`, hashtags: ['#Tips', '#Consejos', '#Lifestyle'] },
            { content: `📸 Behind the scenes de ${data.businessType} ✨\n\nAsí es como trabajamos para darte siempre lo mejor. Con pasión, dedicación y mucho ❤️\n\n¿Te gustaría conocer más de nuestro proceso?`, hashtags: ['#BehindTheScenes', '#Trabajo', '#Pasion'] },
            { content: `🎉 ¡GRACIAS por ser parte de nuestra comunidad!\n\nCada día nos motivan a ser mejores. ${data.businessType} existe gracias a ustedes 🙏\n\n¿Desde cuándo nos sigues?`, hashtags: ['#Comunidad', '#Gracias', '#Familia'] }
        ],
        facebook: [
            { content: `Hola familia 👋\n\nQueremos compartir algo especial con ustedes hoy...\n\nEn ${data.businessType} creemos que cada cliente es único, y por eso nos esforzamos en dar siempre lo mejor.\n\n¿Qué les gustaría ver próximamente? Los leemos 📖`, hashtags: [`#${data.businessType.replace(/\s/g, '')}`] },
            { content: `📢 ATENCIÓN\n\nTenemos noticias importantes para nuestra comunidad de ${data.businessType}.\n\nEste mes viene cargado de sorpresas y no queríamos que se las perdieran. Estén atentos 👀`, hashtags: ['#Noticias', '#Comunidad'] },
        ],
    };

    const posts = templates[data.network] || templates.instagram;
    return posts.slice(0, parseInt(data.postCount) || 5);
}

function displayPosts(posts) {
    const resultContent = document.getElementById('resultContent');
    const exportBtn = document.getElementById('exportBtn');

    resultContent.innerHTML = posts.map((post, index) => `
        <div class="post-card">
            <div class="post-card-header">
                <span>Post ${index + 1}</span>
                <button class="copy-btn" onclick="copyPost(${index})" data-index="${index}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copiar
                </button>
            </div>
            <div class="post-card-content">${post.content}</div>
            <div class="post-card-footer">
                ${post.hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join(' ')}
            </div>
        </div>
    `).join('');

    exportBtn.style.display = 'flex';
    window.generatedPosts = posts;
}

function copyPost(index) {
    const post = window.generatedPosts[index];
    const text = `${post.content}\n\n${post.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text).then(() => {
        showToast('¡Post copiado!');
    });
}

function exportAllPosts() {
    if (!window.generatedPosts) return;

    const text = window.generatedPosts.map((post, i) =>
        `=== POST ${i + 1} ===\n${post.content}\n\nHashtags: ${post.hashtags.join(' ')}\n`
    ).join('\n\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contenido_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('¡Contenido exportado!');
}

function initGenerator() {
    const form = document.getElementById('generatorForm');
    const generateBtn = document.getElementById('generateBtn');
    const resultContent = document.getElementById('resultContent');
    const exportBtn = document.getElementById('exportBtn');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = getCurrentUser();
        if (user && user.credits <= 0) {
            showToast('No tienes créditos disponibles. Actualiza tu plan.', 'error');
            return;
        }

        const data = {
            businessType: document.getElementById('businessType').value,
            businessDesc: document.getElementById('businessDesc').value,
            tone: document.getElementById('tone').value,
            network: document.getElementById('network').value,
            postCount: document.getElementById('postCount').value
        };

        generateBtn.disabled = true;
        generateBtn.innerHTML = '<div class="spinner"></div> Generando con IA...';
        resultContent.innerHTML = '<p class="placeholder-text">Generando contenido profesional...</p>';

        try {
            let posts;

            // Try backend first, fallback to demo
            try {
                posts = await generateContent(data);
            } catch (apiError) {
                console.warn('Backend no disponible, usando demo:', apiError.message);
                await new Promise(r => setTimeout(r, 2000));
                posts = generateDemoContent(data);
            }

            displayPosts(posts);

            if (user) {
                updateCredits(user.credits - 1);
                document.getElementById('creditsCount').textContent = user.credits - 1;
                document.getElementById('creditsDisplay').textContent = `${user.credits - 1} generación${user.credits - 1 !== 1 ? 'es' : ''} restante${user.credits - 1 !== 1 ? 's' : ''}`;

                const totalPosts = document.getElementById('totalPosts');
                const monthlyPosts = document.getElementById('monthlyPosts');
                if (totalPosts) totalPosts.textContent = parseInt(totalPosts.textContent) + posts.length;
                if (monthlyPosts) monthlyPosts.textContent = parseInt(monthlyPosts.textContent) + posts.length;
            }

            saveToHistory({ ...data, posts });
            showToast(`¡${posts.length} posts generados exitosamente!`);

        } catch (error) {
            resultContent.innerHTML = `<p style="color: #EF4444;">Error: ${error.message}</p>`;
            showToast(error.message, 'error');
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                <span>Generar Contenido</span>
            `;
        }
    });

    if (exportBtn) {
        exportBtn.addEventListener('click', exportAllPosts);
    }
}

// Demo on landing page
function initDemoSection() {
    const demoBtn = document.getElementById('demoGenerateBtn');
    const demoResult = document.getElementById('demoResult');

    if (!demoBtn) return;

    demoBtn.addEventListener('click', async () => {
        const data = {
            businessType: document.getElementById('demoNegocio').value || 'Emprendimiento',
            tone: document.getElementById('demoTono').value,
            network: document.getElementById('demoRed').value,
            postCount: 5
        };

        demoBtn.disabled = true;
        demoBtn.innerHTML = '<div class="spinner"></div> Generando...';
        demoResult.innerHTML = '<p class="placeholder-text">Generando posts...</p>';

        await new Promise(r => setTimeout(r, 2000));

        const posts = generateDemoContent(data);

        demoResult.innerHTML = posts.map((post, i) => `
            <div style="background: rgba(255,255,255,0.1); padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 0.75rem;">
                <div style="font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-bottom: 0.25rem;">Post ${i + 1}</div>
                <div style="font-size: 0.875rem; line-height: 1.6;">${post.content}</div>
                <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #6ee7b7;">${post.hashtags.join(' ')}</div>
            </div>
        `).join('');

        demoBtn.disabled = false;
        demoBtn.innerHTML = `<span>Generar 5 Posts</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initGenerator();
    initDemoSection();
});
