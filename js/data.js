const portfolioData = {
    "projectData": [
        {
            "id": "algo-trading-platform",
            "name": "Algo Trading & Strategy Platform",
            "tagline": "Automated trading strategies and ML-driven optimization.",
            "description": "Developed and optimized automated trading strategies for MetaTrader 5, CTrader, and TradingView. Features a Python-based ML optimizer using Optuna for parameter tuning and robust validation through K-Fold and Walk-Forward testing[cite: 32, 37, 38, 39].",
            "image": "assets/images/trading.png", 
            "tech": ["Python", "MQL5", "C#", "PineScript", "Machine Learning"],
            "sourceUrl": "https://github.com/srsly-i-am-dev",
            "liveUrl": null
        },
        {
            "id": "gym-dbms",
            "name": "Black Rhino Gym DBMS",
            "tagline": "Normalized SQL database for fitness center management.",
            "description": "Designed and implemented a normalized SQL database to manage member information, billing, and class schedules for a real-world fitness center in Paldi[cite: 44, 48, 49].",
            "image": "assets/images/database.png",
            "tech": ["SQL", "MySQL", "Database Design"],
            "sourceUrl": "https://github.com/srsly-i-am-dev",
            "liveUrl": null
        },
        {
            "id": "ecommerce-replicas",
            "name": "Full Stack Web Replicas",
            "tagline": "MERN stack clones of Bonkers.com and Food.com.",
            "description": "Cloned core functionality of e-commerce and recipe portals. Built responsive front-ends and scalable back-end systems using the MERN stack[cite: 50, 54].",
            "image": "assets/images/ecommerce.png",
            "tech": ["React", "Node.js", "Express", "MongoDB"],
            "sourceUrl": "https://github.com/srsly-i-am-dev",
            "liveUrl": null
        }
    ],
    "allShortcutPages": [
        { "id": "about", "title": "About Me", "url": "portfolio://about", "faIcon": "fa-solid fa-user", "colorClass": "text-about" },
        { "id": "skills", "title": "Skills", "url": "portfolio://skills", "faIcon": "fa-solid fa-lightbulb", "colorClass": "text-skills" },
        { "id": "projects", "title": "Projects", "url": "portfolio://projects", "faIcon": "fa-solid fa-flask", "colorClass": "text-projects" },
        { "id": "deployed", "title": "Live Demos", "url": "portfolio://deployed", "faIcon": "fa-solid fa-globe", "colorClass": "text-demos" },
        { "id": "linkedin", "title": "LinkedIn", "url": "https://www.linkedin.com/in/dev-vaghela", "faIcon": "fa-brands fa-linkedin", "external": true, "colorClass": "text-linkedin" },
        { "id": "github", "title": "GitHub", "url": "https://github.com/srsly-i-am-dev", "faIcon": "fa-brands fa-github", "external": true, "colorClass": "text-github" }
    ],
    "skillsData": {
        "Languages": [
            { "name": "Python", "logo": "python" },
            { "name": "SQL", "logo": "postgresql" },
            { "name": "C", "logo": "c" },
            { "name": "C#", "logo": "csharp" },
            { "name": "MQL5", "logo": "metatrader5" }
        ],
        "AI / ML & Trading": [
            { "name": "Machine Learning", "logo": "scikitlearn" },
            { "name": "Deep Learning", "logo": "pytorch" },
            { "name": "Computer Vision", "logo": "opencv" },
            { "name": "NLP", "logo": "prodigy" },
            { "name": "Algorithmic Trading", "logo": "tradingview" }
        ],
        "Web & Databases": [
            { "name": "React", "logo": "react" },
            { "name": "Node.js", "logo": "nodedotjs" },
            { "name": "MongoDB", "logo": "mongodb" },
            { "name": "MySQL", "logo": "mysql" },
            { "name": "REST APIs", "logo": "insomnia" }
        ]
    }
};