document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTION ---
    const contentArea = document.querySelector('.content-area');
    const tabsContainer = document.querySelector('.tabs-container');
    const addressInput = document.getElementById('address-input');
    const homeShortcutsContainer = document.getElementById('home-shortcuts');
    const btnBack = document.getElementById('btn-back');
    const btnNext = document.getElementById('btn-next');
    const btnHome = document.getElementById('btn-home');
    const btnNewTab = document.getElementById('btn-new-tab');
    const contextMenu = document.getElementById('context-menu');
    const contextMenuNewTab = document.getElementById('context-menu-new-tab');

    // --- STATE MANAGEMENT ---
    let tabs = [];
    let activeTabId = null;
    let tabCounter = 0;
    let contextRepoId = null;

    const getActiveTab = () => tabs.find(t => t.id === activeTabId);

    // --- NAVIGATION AND HISTORY ---
    const updateNavButtonsState = () => {
        const activeTab = getActiveTab();
        if (!activeTab) {
            btnBack.classList.add('disabled');
            btnNext.classList.add('disabled');
            return;
        }
        btnBack.classList.toggle('disabled', activeTab.historyIndex <= 0);
        btnNext.classList.toggle('disabled', activeTab.historyIndex >= activeTab.history.length - 1);
    };

    const navigateTo = (pageId, fromHistory = false, repoId = null) => {
        const activeTab = getActiveTab();
        if (!activeTab) return;

        const state = repoId ? { pageId: 'repo', repoId } : { pageId, repoId: null };

        if (repoId && !document.getElementById(`page-repo-${repoId}`)) {
            createRepoPageElement(repoId);
        }

        activeTab.pageId = state.pageId;
        activeTab.repoId = state.repoId;

        if (!fromHistory) {
            const historyEntry = repoId ? `repo:${repoId}` : pageId;
            if (activeTab.historyIndex < activeTab.history.length - 1) {
                activeTab.history = activeTab.history.slice(0, activeTab.historyIndex + 1);
            }
            activeTab.history.push(historyEntry);
            activeTab.historyIndex = activeTab.history.length - 1;
        }
        render();
    };


    // --- RENDERING AND UI ---
    const simpleMarkdownToHtml = (md) => {
        return md.replace(/<img src="\/Jalpan04\/PixelPredict\/raw\/main\/demo.png"[^>]*>/, `<img src="https://raw.githubusercontent.com/Jalpan04/PixelPredict/main/demo.png" alt="PixelPredict Demo" style="max-width: 100%;">`)
            .replace(/<img src="https:\/\/img\.shields\.io[^>]*>/g, (match) => `<span class="inline-block h-5">${match}</span>`);
    };

    const render = () => {
        tabsContainer.innerHTML = tabs.map(tab => {
            const page = pages[tab.pageId] || { title: tab.repoId, url: `github.com/Jalpan04/${tab.repoId}`, icon: '📦' };
            return `
                <div class="tab flex items-center px-4 py-2 rounded-t-lg cursor-pointer ${tab.id === activeTabId ? 'active' : ''}" data-tab-id="${tab.id}">
                    <span class="mr-2 text-base">${page.icon}</span>
                    <span class="text-sm text-white truncate max-w-[120px]">${page.title}</span>
                    <button class="close-tab ml-3 text-gray-400 hover:bg-white/20 rounded-full p-0.5" data-tab-id-to-close="${tab.id}">
                        <svg class="w-3.5 h-3.5 pointer-events-none" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.content-page').forEach(p => p.classList.remove('active'));
        const activeTab = getActiveTab();
        if (activeTab) {
            const pageId = activeTab.repoId ? `page-repo-${activeTab.repoId}` : `page-${activeTab.pageId}`;
            const pageElement = document.getElementById(pageId);
            if (pageElement) pageElement.classList.add('active');
            const pageInfo = pages[activeTab.pageId] || { url: `github.com/Jalpan04/${activeTab.repoId}` };
            addressInput.value = pageInfo.url;
        } else {
            addressInput.value = '';
        }
        updateNavButtonsState();
    };


    // --- TAB MANAGEMENT ---
    const createNewTab = (pageId, options = {}) => {
        tabCounter++;
        const newTabId = `tab-${tabCounter}`;
        const historyEntry = options.repoId ? `repo:${options.repoId}` : pageId;

        if (options.repoId && !document.getElementById(`page-repo-${options.repoId}`)) {
            createRepoPageElement(options.repoId);
        }

        tabs.push({ id: newTabId, pageId, repoId: options.repoId || null, history: [historyEntry], historyIndex: 0 });
        activeTabId = newTabId;
        render();
    }

    const closeTab = (idToClose) => {
        const tabIndex = tabs.findIndex(tab => tab.id === idToClose);
        if (tabIndex === -1) return;

        const tabToClose = tabs[tabIndex];
        if (tabToClose.repoId) {
            document.getElementById(`page-repo-${tabToClose.repoId}`)?.remove();
        }

        let newActiveId = null;
        if (activeTabId === idToClose) {
            if (tabs.length > 1) {
                newActiveId = tabs[tabIndex - 1]?.id || tabs[tabIndex + 1]?.id;
            }
        }
        tabs.splice(tabIndex, 1);
        if (activeTabId === idToClose) {
            activeTabId = newActiveId;
            if (tabs.length === 0) createNewTab('home');
        }
        render();
    };

    const setActiveTab = (tabId) => {
        activeTabId = tabId;
        render();
    }


    // --- UTILITY AND HELPER FUNCTIONS ---
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date("2025-09-26T10:45:37") - new Date(date)) / 1000);
        const interval = seconds / 86400;
        if (interval > 1) return `on ${new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        return `today`;
    };


    // --- DYNAMIC PAGE CREATION ---
    const createFileRows = (files) => {
        return files.map(file => `
            <tr class="text-sm">
                <td class="p-2 whitespace-nowrap">
                    <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2 ${file.type === 'dir' ? 'text-blue-400' : 'text-gray-500'}" fill="currentColor" viewBox="0 0 16 16">${file.type === 'dir' ? '<path d="M.5 2A1.5 1.5 0 0 1 2  .5h2.25a.75.75 0 0 1 .6.3L6 2h5.25a1.25 1.25 0 0 1 1.25 1.25v.5a.75.75 0 0 1-1.5 0v-.5a.25.25 0 0 0-.25-.25H6.191a.75.75 0 0 1-.6-.3L4.34 1H2A.5.5 0 0 0 1.5 1.5v11A.5.5 0 0 0 2 13h12a.5.5 0 0 0 .5-.5v-8A.5.5 0 0 0 14 4h- возможность.75a.75.75 0 0 1 0-1.5H14A1.5 1.5 0 0 1 15.5 4v8.5A1.5 1.5 0 0 1 14 14H2A1.5 1.5 0 0 1 .5 12.5Z"></path>' : '<path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"></path>'}</svg>
                        <a href="#" class="text-gray-300 hover:text-blue-400 hover:underline">${file.name}</a>
                    </div>
                </td>
                <td class="p-2 text-gray-400 whitespace-nowrap hidden md:table-cell"><a href="#" class="hover:text-blue-400">${file.message}</a></td>
                <td class="p-2 text-gray-500 whitespace-nowrap text-right">${file.date}</td>
            </tr>
        `).join('');
    };

    const createRepoPageElement = (repoId) => {
        const repo = repoData.find(r => r.id === repoId);
        if (!repo) return;

        const repoPage = document.createElement('div');
        repoPage.id = `page-repo-${repoId}`;
        repoPage.className = 'content-page github-page-bg';
        repoPage.innerHTML = `
            <div class="border-b border-gray-800 py-3 px-4">
                <div class="flex items-center justify-between max-w-7xl mx-auto">
                    <div class="text-lg">
                        <a href="#" class="text-blue-400 hover:underline" data-nav-back-to="code">Jalpan04</a>
                        <span class="text-gray-500 mx-1">/</span>
                        <strong class="font-semibold text-white">${repo.name}</strong>
                        <span class="text-xs border border-gray-600 rounded-full px-2 py-0.5 text-gray-400 ml-2">Public</span>
                    </div>
                    <div class="flex items-center gap-2">
                         <button class="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-gray-200 text-sm font-medium py-1 px-3 rounded-md transition-colors flex items-center gap-1">
                            <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>
                            Star
                            <span class="bg-gray-700 rounded-full px-1.5 text-xs">${repo.stars}</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="p-4 md:p-8 max-w-7xl mx-auto">
                <div class="border border-gray-700 rounded-lg">
                    <div class="bg-[#161b22] px-4 py-2 border-b border-gray-700 text-sm text-gray-400">
                        Latest commit
                    </div>
                    <div class="bg-[#0d1117] p-4">
                        <table class="w-full">
                            <thead>
                                <tr class="text-left text-gray-400 border-b border-gray-700 text-sm">
                                    <th class="p-2 font-semibold">Name</th>
                                    <th class="p-2 font-semibold hidden md:table-cell">Last commit message</th>
                                    <th class="p-2 font-semibold text-right">Last commit date</th>
                                </tr>
                            </thead>
                            <tbody>${createFileRows(repo.files)}</tbody>
                        </table>
                    </div>
                </div>
                <div class="mt-6 p-6 border border-gray-700 rounded-lg markdown-body">
                    ${simpleMarkdownToHtml(repo.readme)}
                </div>
            </div>
        `;
        contentArea.appendChild(repoPage);

        repoPage.querySelector('[data-nav-back-to="code"]').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('code');
        });
    };


    // --- PAGE INITIALIZATION ---
    const initHomePage = () => {
        homeShortcutsContainer.innerHTML = Object.values(pages)
            .filter(p => p.id !== 'home')
            .map(page => `
                <div class="shortcut glass-card p-6 rounded-2xl cursor-pointer transition-all duration-300" data-page-id="${page.id}">
                    <div class="text-4xl mb-3">${page.icon}</div>
                    <div class="text-white font-medium">${page.title}</div>
                </div>
            `).join('');
        homeShortcutsContainer.addEventListener('click', (e) => {
            const shortcut = e.target.closest('[data-page-id]');
            if (shortcut) navigateTo(shortcut.dataset.pageId);
        });
    };

    const initCodePage = () => {
        const pageElement = document.getElementById('page-code');
        pageElement.innerHTML = `
        <div class="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto p-4 md:p-8">
            <div class="w-full md:w-1/4 flex-shrink-0">
                <img src="https://avatars.githubusercontent.com/u/72879689?v=4" alt="Profile Picture" class="rounded-full border-2 border-gray-700 w-full max-w-[260px] mx-auto md:mx-0">
                <div class="mt-4">
                    <h1 class="text-2xl font-bold text-gray-200">Jalpan Vyas</h1>
                    <p class="text-xl text-gray-400">Jalpan04 · <span class="text-base">he/him</span></p>
                </div>
                <button class="w-full bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-gray-200 font-medium py-1.5 px-4 rounded-lg mt-4 transition-colors text-sm">Follow</button>
                <p class="mt-4 text-gray-300">python is best<br>i try to make games and simulations</p>
                <div class="flex items-center space-x-2 mt-4 text-gray-400">
                    <svg class="w-4 h-4 text-gray-500" aria-hidden="true" viewBox="0 0 16 16" version="1.1"><path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z"></path></svg>
                    <span class="font-bold text-white">7</span> followers<span class="text-gray-500">·</span><span class="font-bold text-white">18</span> following
                </div>
            </div>
            <div class="w-full md:w-3/4">
                <div id="github-tabs-main" class="border-b border-gray-700"><nav class="flex space-x-4 -mb-px">
                    <button data-tab="overview" class="github-sub-tab py-3 px-1 text-sm font-medium flex items-center gap-x-2 active">Overview</button>
                    <button data-tab="repositories" class="github-sub-tab py-3 px-1 text-sm font-medium flex items-center gap-x-2">Repositories<span class="text-xs bg-gray-700 text-gray-300 rounded-full px-2 py-0.5">31</span></button>
                </nav></div>
                <div id="github-overview" class="github-sub-content active pt-6"></div>
                <div id="github-repositories" class="github-sub-content pt-6"></div>
            </div>
        </div>`;

        // Init sub-tab logic
        const githubTabsContainer = pageElement.querySelector('#github-tabs-main');
        githubTabsContainer.addEventListener('click', (e) => {
            const targetTab = e.target.closest('button');
            if (!targetTab) return;
            githubTabsContainer.querySelectorAll('.github-sub-tab').forEach(t => t.classList.remove('active'));
            targetTab.classList.add('active');
            pageElement.querySelectorAll('.github-sub-content').forEach(c => c.classList.remove('active'));
            pageElement.querySelector(`#github-${targetTab.dataset.tab}`).classList.add('active');
        });

        // Populate Overview
        const overviewContainer = pageElement.querySelector('#github-overview');
        overviewContainer.innerHTML = `
            <h3 class="text-lg font-normal mb-2 text-gray-200">Pinned</h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div class="github-pinned-card p-4 rounded-lg cursor-pointer" data-repo-id="PixelPredict">
                    <h4 class="font-bold text-blue-400">PixelPredict</h4>
                    <p class="text-sm text-gray-400 mt-1">A web app for digit recognition using a custom neural network trained on MNIST.</p>
                    <p class="text-xs text-gray-500 mt-2 flex items-center"><span class="repo-language-color mr-1.5" style="background-color: #e34c26;"></span>HTML</p>
                </div>
                <div class="github-pinned-card p-4 rounded-lg">
                    <h4 class="font-bold text-blue-400">Asteroid-game-ai</h4>
                    <p class="text-sm text-gray-400 mt-1">Asteroid game with AI agents trained over generations using neural networks.</p>
                     <p class="text-xs text-gray-500 mt-2 flex items-center"><span class="repo-language-color mr-1.5" style="background-color: #3572A5;"></span>Python</p>
                </div>
            </div>
        `;

        overviewContainer.addEventListener('click', (e) => {
            const pinnedItem = e.target.closest('[data-repo-id]');
            if (pinnedItem) {
                e.preventDefault();
                navigateTo('repo', false, pinnedItem.dataset.repoId);
            }
        });

        overviewContainer.addEventListener('contextmenu', (e) => {
            const pinnedItem = e.target.closest('[data-repo-id]');
            if (pinnedItem) {
                e.preventDefault();
                contextRepoId = pinnedItem.dataset.repoId;
                contextMenu.style.top = `${e.clientY}px`;
                contextMenu.style.left = `${e.clientX}px`;
                contextMenu.style.display = 'block';
            }
        });

        const repoContainer = pageElement.querySelector('#github-repositories');
        repoContainer.innerHTML = `<div id="repo-list-container-main" class="space-y-1">${repoData.map(repo => `
             <div class="flex justify-between items-center width-full py-4 border-b border-gray-800 repo-item" data-repo-id="${repo.id}">
                <div>
                    <h3 class="text-xl text-blue-400 font-semibold mb-1"><a href="#" class="hover:underline">${repo.name}</a></h3>
                    <p class="text-sm text-gray-400">${repo.description}</p>
                    <div class="text-xs text-gray-400 mt-2 flex items-center gap-x-4">
                       <span class="flex items-center"><span class="repo-language-color mr-1.5" style="background-color: ${languageColors[repo.language] || '#8b949e'};"></span>${repo.language}</span>
                       <span>Updated ${timeAgo(repo.lastUpdated)}</span>
                    </div>
                </div>
            </div>
        `).join('')}</div>`;

        repoContainer.addEventListener('click', (e) => {
            const repoItem = e.target.closest('.repo-item');
            if (repoItem) {
                e.preventDefault();
                navigateTo('repo', false, repoItem.dataset.repoId);
            }
        });

        repoContainer.addEventListener('contextmenu', (e) => {
            const repoItem = e.target.closest('.repo-item');
            if (repoItem) {
                e.preventDefault();
                contextRepoId = repoItem.dataset.repoId;
                contextMenu.style.top = `${e.clientY}px`;
                contextMenu.style.left = `${e.clientX}px`;
                contextMenu.style.display = 'block';
            }
        });
    };

    const initProjectsPage = () => {
        const pageElement = document.getElementById('page-projects');
        const projectCardsHTML = deployedProjects.map(project => `
            <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="block glass-card rounded-2xl overflow-hidden group">
                <div class="w-full h-48 bg-gray-900 overflow-hidden">
                    <img src="${project.image}" alt="${project.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                </div>
                <div class="p-4 bg-white/5">
                    <h3 class="text-lg font-semibold text-white">${project.name}</h3>
                </div>
            </a>
        `).join('');

        pageElement.innerHTML = `
            <div class="max-w-6xl mx-auto p-8">
                <h1 class="text-5xl font-bold text-white mb-10">Deployed Projects</h1>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${projectCardsHTML}
                </div>
            </div>
        `;
    };

    // --- MAIN INITIALIZATION AND EVENT LISTENERS ---
    const init = () => {
        initHomePage();
        initCodePage();
        initProjectsPage();

        tabsContainer.addEventListener('click', (e) => {
            const closeButton = e.target.closest('.close-tab');
            if (closeButton) { e.stopPropagation(); closeTab(closeButton.dataset.tabIdToClose); return; }
            const tabElement = e.target.closest('.tab');
            if (tabElement) setActiveTab(tabElement.dataset.tabId);
        });

        btnBack.addEventListener('click', () => {
            const tab = getActiveTab();
            if (tab && tab.historyIndex > 0) {
                tab.historyIndex--;
                const [pageId, repoId] = tab.history[tab.historyIndex].split(':');
                navigateTo(pageId, true, repoId);
            }
        });

        btnNext.addEventListener('click', () => {
            const tab = getActiveTab();
            if (tab && tab.historyIndex < tab.history.length - 1) {
                tab.historyIndex++;
                const [pageId, repoId] = tab.history[tab.historyIndex].split(':');
                navigateTo(pageId, true, repoId);
            }
        });

        btnHome.addEventListener('click', () => navigateTo('home'));
        btnNewTab.addEventListener('click', () => createNewTab('home'));

        document.addEventListener('click', () => contextMenu.style.display = 'none');
        contextMenuNewTab.addEventListener('click', () => {
            if (contextRepoId) {
                createNewTab('repo', { repoId: contextRepoId });
                contextRepoId = null;
            }
        });

        createNewTab('home');
    };

    init();
});