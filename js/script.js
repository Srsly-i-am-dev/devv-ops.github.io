document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    let projectData = [];
    let allShortcutPages = [];
    let pages = {};
    let skillsData = {};

    const contentArea = document.querySelector('.content-area');
    const tabsContainer = document.querySelector('.tabs-container');
    const addressInput = document.getElementById('address-input');
    const homeShortcutsGrid = document.getElementById('home-shortcuts-grid');
    const btnBack = document.getElementById('btn-back');
    const btnNext = document.getElementById('btn-next');
    const btnHome = document.getElementById('btn-home');
    const btnNewTab = document.getElementById('btn-new-tab');
    const contextMenu = document.getElementById('context-menu');
    const contextMenuNewTabBtn = document.getElementById('context-menu-new-tab');

    let tabs = [];
    let activeTabId = null;
    let tabCounter = 0;
    let contextAction = null;

    const getActiveTab = () => tabs.find(t => t.id === activeTabId);

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

    const render = () => {
        tabsContainer.innerHTML = tabs.map(tab => {
            const pageInfo = pages[tab.pageId] || {};
            let title = pageInfo.title;
            let iconClass = pageInfo.faIcon;

            if (tab.pageId === 'project') {
                const project = projectData.find(p => p.id === tab.subPageId);
                title = project ? project.name : 'Project';
                iconClass = 'fa-solid fa-box';
            }

            return `<div class="tab flex items-center px-4 py-2 rounded-t-lg cursor-pointer ${tab.id === activeTabId ? 'active' : ''}" data-tab-id="${tab.id}"><i class="${iconClass} mr-2 text-base"></i><span class="text-sm text-white truncate max-w-[120px]">${title}</span><button class="close-tab ml-3 text-gray-400 hover:bg-white/20 rounded-full p-0.5" data-tab-id-to-close="${tab.id}"><i class="fa-solid fa-xmark w-3.5 h-3.5 pointer-events-none"></i></button></div>`;
        }).join('');

        document.querySelectorAll('.content-page').forEach(p => p.classList.remove('active'));

        const activeTab = getActiveTab();
        if (activeTab) {
            const pageElementId = activeTab.subPageId
                ? `page-project-${activeTab.id}-${activeTab.subPageId}`
                : `page-${activeTab.pageId}`;
            const pageElement = document.getElementById(pageElementId);
            if (pageElement) pageElement.classList.add('active');
            let url = pages[activeTab.pageId]?.url || '';
            if (activeTab.pageId === 'project' && activeTab.subPageId) {
                url = `portfolio://projects/${activeTab.subPageId}`;
            }
            addressInput.value = url;
        } else {
            addressInput.value = '';
        }
        updateNavButtonsState();
    };

    const createProjectDetailPage = (projectId, tabId) => {
        const project = projectData.find(p => p.id === projectId);
        if (!project) return;
        const newPage = document.createElement('div');
        newPage.id = `page-project-${tabId}-${projectId}`;
        newPage.className = 'content-page';
        const liveUrlHtml = project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="w-full text-center btn-primary"><i class="fa-solid fa-up-right-from-square mr-2"></i> View Project</a>` : '';
        const linkGapClass = project.liveUrl ? 'sm:flex-row' : '';
        newPage.innerHTML = `
            <div class="max-w-5xl mx-auto p-8">
                <button class="back-to-projects text-cyan-400 hover:underline mb-8 flex items-center gap-2">
                    <i class="fa-solid fa-arrow-left"></i> Back to all projects
                </button>
                <h1 class="text-5xl font-bold mb-2">${project.name}</h1>
                <p class="text-xl text-gray-400 mb-6">${project.tagline}</p>
                <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
                    <div class="md:col-span-3"><img src="${project.image}" alt="${project.name}" class="rounded-lg shadow-lg w-full"></div>
                    <div class="md:col-span-2">
                        <h3 class="text-2xl font-semibold mb-3">About this project</h3>
                        <p class="text-gray-300 leading-relaxed mb-6">${project.description}</p>
                        <h3 class="text-2xl font-semibold mb-3">Tech Stack</h3>
                        <div class="flex flex-wrap gap-2 mb-8">${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
                        <div class="flex flex-col ${linkGapClass} gap-4">
                            ${liveUrlHtml}
                            <a href="${project.sourceUrl}" target="_blank" rel="noopener noreferrer" class="w-full text-center btn-secondary"><i class="fa-brands fa-github mr-2"></i> View Source</a>
                        </div>
                    </div>
                </div>
            </div>`;
        contentArea.appendChild(newPage);
        newPage.querySelector('.back-to-projects').addEventListener('click', () => navigateTo('projects'));
    };

    const navigateTo = (pageId, fromHistory = false, subPageId = null) => {
        const activeTab = getActiveTab();
        if (!activeTab) return;

        const projectPageId = `page-project-${activeTab.id}-${subPageId}`;
        if (pageId === 'project' && subPageId && !document.getElementById(projectPageId)) {
            createProjectDetailPage(subPageId, activeTab.id);
        }
        activeTab.pageId = pageId;
        activeTab.subPageId = subPageId;
        if (!fromHistory) {
            const historyEntry = subPageId ? `${pageId}:${subPageId}` : pageId;
            if (activeTab.historyIndex < activeTab.history.length - 1) {
                activeTab.history = activeTab.history.slice(0, activeTab.historyIndex + 1);
            }
            activeTab.history.push(historyEntry);
            activeTab.historyIndex = activeTab.history.length - 1;
        }
        render();
    };

    const createNewTab = (pageId, options = {}) => {
        tabCounter++;
        const newTabId = `tab-${tabCounter}`;
        const historyEntry = options.subPageId ? `${pageId}:${options.subPageId}` : pageId;
        if (pageId === 'project' && options.subPageId) {
            createProjectDetailPage(options.subPageId, newTabId);
        }
        tabs.push({ id: newTabId, pageId, subPageId: options.subPageId || null, history: [historyEntry], historyIndex: 0 });
        activeTabId = newTabId;
        render();
    };

    const closeTab = (idToClose) => {
        const tabIndex = tabs.findIndex(tab => tab.id === idToClose);
        if (tabIndex === -1) return;
        const tabToClose = tabs[tabIndex];
        if (tabToClose.pageId === 'project' && tabToClose.subPageId) {
            document.getElementById(`page-project-${tabToClose.id}-${tabToClose.subPageId}`)?.remove();
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
            if (tabs.length === 0) {
                createNewTab('home');
            }
        }
        render();
    };

    const setActiveTab = (tabId) => {
        activeTabId = tabId;
        render();
    };

    const showContextMenu = (event, action) => {
        event.preventDefault();
        contextAction = action;
        contextMenu.style.top = `${event.clientY}px`;
        contextMenu.style.left = `${event.clientX}px`;
        contextMenu.classList.add('show');
    };

    const initContextMenu = () => {
        document.addEventListener('click', () => contextMenu.classList.remove('show'));
        contextMenuNewTabBtn.addEventListener('click', () => {
            if (contextAction) {
                const { type, id } = contextAction;
                if (type === 'page') {
                    const page = pages[id];
                    if (page.external) window.open(page.url, '_blank');
                    else createNewTab(id);
                } else if (type === 'projectDetail') {
                    createNewTab('project', { subPageId: id });
                } else if (type === 'externalLink') {
                    window.open(id, '_blank');
                } else if (type === 'portfolioUrl') {
                    const url = id;
                    const parts = url.replace('portfolio://', '').split('/');
                    const pageId = parts[0];
                    const subPageId = parts[1] || null;
                    if (pages[pageId] || (pageId === 'projects' && subPageId && projectData.some(p => p.id === subPageId))) {
                        createNewTab(pageId, { subPageId });
                    } else {
                        createNewTab('404');
                    }
                }
            }
            contextMenu.classList.remove('show');
        });
    };

    const initHomePage = () => {
        homeShortcutsGrid.innerHTML = allShortcutPages.map(page => `<div class="shortcut glass-card p-4 rounded-xl cursor-pointer" data-page-id="${page.id}"><i class="${page.faIcon} ${page.colorClass} text-4xl mb-3"></i><div class="text-white font-medium">${page.title}</div></div>`).join('');
        homeShortcutsGrid.addEventListener('click', (e) => {
            const shortcut = e.target.closest('[data-page-id]');
            if (!shortcut) return;
            const pageId = shortcut.dataset.pageId;
            const page = pages[pageId];
            if (page.external) window.open(page.url, '_blank');
            else navigateTo(pageId);
        });
        homeShortcutsGrid.addEventListener('contextmenu', e => {
            const shortcut = e.target.closest('[data-page-id]');
            if (shortcut) showContextMenu(e, { type: 'page', id: shortcut.dataset.pageId });
        });
    };

    const initSkillsPage = () => {
        const container = document.getElementById('skills-container');
        let content = `<h1 class="text-5xl font-bold mb-10 text-center">Skills & Technologies</h1>`;
        for (const category in skillsData) {
            content += `<h2 class="text-3xl font-semibold text-cyan-400 mt-8 mb-4">${category}</h2>`;
            content += `<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">`;
            content += skillsData[category].map(skill => `
                <div class="skill-card flex flex-col items-center justify-center p-4 rounded-lg hover:bg-white/5 transition-colors">
                    <img src="https://cdn.simpleicons.org/${skill.logo}" alt="${skill.name}" class="w-12 h-12">
                    <span class="mt-2 text-sm text-gray-300">${skill.name}</span>
                </div>`).join('');
            content += `</div>`;
        }
        container.innerHTML = content;
    };

    const initProjectsPage = () => {
        // projectData is already ordered by the Admin Tool
        const projectsGrid = document.getElementById('projects-grid');
        projectsGrid.innerHTML = projectData.map(project => `
            <div class="glass-card rounded-xl overflow-hidden group cursor-pointer" data-project-id="${project.id}">
                <div class="w-full h-48 bg-gray-900 overflow-hidden flex items-center justify-center">
                    <img src="${project.image}" alt="${project.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                </div>
                <div class="p-4 bg-white/5 flex flex-col">
                    <h3 class="text-lg font-semibold">${project.name}</h3>
                    <p class="text-sm text-gray-400 mt-1 min-h-[2.5rem]">${project.tagline}</p>
                </div>
            </div>`).join('');
        projectsGrid.addEventListener('click', e => {
            const card = e.target.closest('[data-project-id]');
            if (card) navigateTo('project', false, card.dataset.projectId);
        });
        projectsGrid.addEventListener('contextmenu', e => {
            const card = e.target.closest('[data-project-id]');
            if (card) showContextMenu(e, { type: 'projectDetail', id: card.dataset.projectId });
        });
    };

    const initDeployedPage = () => {
        const deployedGrid = document.getElementById('deployed-grid');
        const liveProjects = projectData.filter(project => project.liveUrl);
        deployedGrid.innerHTML = liveProjects.map(project => `
            <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="block glass-card rounded-xl overflow-hidden group">
                <div class="w-full h-48 bg-gray-900 overflow-hidden flex items-center justify-center">
                    <img src="${project.image}" alt="${project.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                </div>
                <div class="p-4 bg-white/5 flex flex-col">
                    <h3 class="text-lg font-semibold">${project.name}</h3>
                    <p class="text-sm text-gray-400 mt-1 min-h-[2.5rem]">${project.tagline}</p>
                </div>
            </a>`).join('');
        deployedGrid.addEventListener('contextmenu', e => {
            const card = e.target.closest('a');
            if (card) showContextMenu(e, { type: 'externalLink', id: card.href });
        });
    };

    const handleAddressInput = (event) => {
        if (event.key === 'Enter') {
            const inputUrl = addressInput.value.trim();
            if (inputUrl.startsWith('portfolio://')) {
                const path = inputUrl.replace('portfolio://', '');
                const parts = path.split('/');
                const pageId = parts[0];
                const subPageId = parts[1];

                if (pages[pageId] || (pageId === 'projects' && subPageId && projectData.some(p => p.id === subPageId))) {
                    navigateTo(pageId, false, subPageId);
                } else {
                    navigateTo('404');
                }
            } else {
                // Try to open as external URL
                window.open(inputUrl.startsWith('http') ? inputUrl : 'https://' + inputUrl, '_blank');
            }
        }
    };

    // --- INITIALIZATION ---
    // Use global portfolioData from data.js
    if (typeof portfolioData !== 'undefined') {
        projectData = portfolioData.projectData;
        allShortcutPages = portfolioData.allShortcutPages;
        skillsData = portfolioData.skillsData;

        pages = {
            home: { id: 'home', title: 'New Tab', url: 'portfolio://home', faIcon: 'fa-solid fa-house' },
            '404': { id: '404', title: 'Not Found', url: 'portfolio://404', faIcon: 'fa-solid fa-exclamation-triangle' },
            ...Object.fromEntries(allShortcutPages.map(p => [p.id, p]))
        };

        initHomePage();
        initSkillsPage();
        initProjectsPage();
        initDeployedPage();
        initContextMenu();

        // Event Listeners
        btnNewTab.addEventListener('click', () => createNewTab('home'));
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.tab');
            if (!tab) return;
            if (e.target.closest('.close-tab')) {
                e.stopPropagation();
                closeTab(tab.dataset.tabId);
            } else {
                setActiveTab(tab.dataset.tabId);
            }
        });
        btnBack.addEventListener('click', () => {
            const activeTab = getActiveTab();
            if (activeTab && activeTab.historyIndex > 0) {
                activeTab.historyIndex--;
                const entry = activeTab.history[activeTab.historyIndex];
                const [pageId, subPageId] = entry.split(':');
                navigateTo(pageId, true, subPageId);
            }
        });
        btnNext.addEventListener('click', () => {
            const activeTab = getActiveTab();
            if (activeTab && activeTab.historyIndex < activeTab.history.length - 1) {
                activeTab.historyIndex++;
                const entry = activeTab.history[activeTab.historyIndex];
                const [pageId, subPageId] = entry.split(':');
                navigateTo(pageId, true, subPageId);
            }
        });
        btnHome.addEventListener('click', () => navigateTo('home'));
        addressInput.addEventListener('keydown', handleAddressInput);

        // Start with one tab
        createNewTab('home');
    } else {
        console.error('Error loading data: portfolioData is undefined. Make sure data.js is loaded.');
    }
});
