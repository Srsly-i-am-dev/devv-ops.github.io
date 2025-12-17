// --- DATA ---
const repoData = [
    {
        "id": "personal-spotify-EDA",
        "name": "personal-spotify-EDA",
        "description": "An exploratory data analysis of my personal Spotify listening habits.",
        "language": "Jupyter Notebook", "stars": 5, "forks": 1, "lastUpdated": "2025-09-24T12:46:28Z",
        "files": [ {name: 'EDA.ipynb', type: 'file'}, {name: 'data', type: 'dir'}, {name: 'README.md', type: 'file'} ]
    },
    {
        "id": "Sign-Lang-Translator",
        "name": "Sign-Lang-Translator",
        "description": "Real-time sign language to text translation using computer vision and deep learning.",
        "language": "Python", "stars": 22, "forks": 8, "lastUpdated": "2025-09-17T16:30:46Z",
        "files": [ {name: 'main.py', type: 'file'}, {name: 'model', type: 'dir'}, {name: 'README.md', type: 'file'} ]
    },
    {
        "id": "PixelPredict",
        "name": "PixelPredict",
        "description": "A web app for digit recognition using a custom neural network trained on MNIST. Draw digits, get predictions with confidence scores. Built with Flask and NumPy",
        "language": "HTML", "stars": 1, "forks": 0, "lastUpdated": "2025-09-17T15:58:56Z",
        "files": [
            { name: 'LICENSE', type: 'file', message: 'Initial commit', date: 'Apr 26, 2025' },
            { name: 'README.md', type: 'file', message: 'Update README with new demo link', date: 'Apr 28, 2025' },
            { name: 'W1.npy', type: 'file', message: 'Add trained model weights', date: 'Apr 27, 2025' },
            { name: 'W2.npy', type: 'file', message: 'Add trained model weights', date: 'Apr 27, 2025' },
            { name: 'app.py', type: 'file', message: 'Refactor backend and add confidence scores', date: 'Apr 28, 2025' },
            { name: 'b1.npy', type: 'file', message: 'Add trained model weights', date: 'Apr 27, 2025' },
            { name: 'b2.npy', type: 'file', message: 'Add trained model weights', date: 'Apr 27, 2025' },
            { name: 'demo.png', type: 'file', message: 'Add demo screenshot', date: 'Apr 28, 2025' },
            { name: 'history.npy', type: 'file', message: 'Add training history', date: 'Apr 27, 2025' },
            { name: 'index.html', type: 'file', message: 'Improve UI and add chart visualization', date: 'Apr 28, 2025' },
            { name: 'neural_training.py', type: 'file', message: 'Optimize training loop', date: 'Apr 27, 2025' },
            { name: 'nueuralnet.py', type: 'file', message: 'Refactor neural network class', date: 'Apr 27, 2025' },
            { name: 'requirements.txt', type: 'file', message: 'Add gunicorn for deployment', date: 'Apr 28, 2025' },
            { name: 'visualization.py', type: 'file', message: 'Initial commit', date: 'Apr 26, 2025' }
        ],
        "readme": "<h1>PixelPredict</h1><p><a href='https://www.python.org/downloads/' rel='nofollow'><img src='https://img.shields.io/badge/python-3.7+-blue.svg' alt='Python Version'></a> <a href='https://flask.palletsprojects.com/' rel='nofollow'><img src='https://img.shields.io/badge/flask-2.0+-green.svg' alt='Flask'></a> <a href='https://numpy.org/' rel='nofollow'><img src='https://img.shields.io/badge/numpy-1.20+-orange.svg' alt='NumPy'></a> <a href='/Jalpan04/PixelPredict/blob/main/LICENSE'><img src='https://img.shields.io/badge/license-MIT-blue.svg' alt='License'></a> <a href='https://number-id.onrender.com/' rel='nofollow'><img src='https://img.shields.io/badge/demo-online-brightgreen.svg' alt='Live Demo'></a> <a href='http://yann.lecun.com/exdb/mnist/' rel='nofollow'><img src='https://img.shields.io/badge/dataset-MNIST-lightgrey.svg' alt='MNIST'></a></p><blockquote><p>PixelPredict is a web-based handwritten digit recognition application powered by a custom-built neural network, trained on the MNIST dataset. Draw digits and watch AI predict them in real-time!</p></blockquote><h2>Demo</h2><p>Try the live demo at <a href='https://number-id.onrender.com/' rel='nofollow'>https://number-id.onrender.com/</a></p><p><img src='/Jalpan04/PixelPredict/raw/main/demo.png' alt='PixelPredict Demo' style='max-width: 100%;'></p><h2>Features</h2><ul><li><strong>Custom Neural Network</strong>: Handcrafted two-layer feedforward neural network with ~97% test accuracy</li><li><strong>Interactive Canvas</strong>: User-friendly 28×28 drawing surface (scaled to 280×280 pixels)</li><li><strong>Real-time Visualization</strong>: Dynamic confidence score visualization with bar charts</li></ul>",
        "website": "https://number-id.onrender.com"
    }
];

const deployedProjects = [
    {
        name: "Vinylogue",
        url: "https://vinylogue-project.vercel.app/",
        image: "https://d33wubrfki0l68.cloudfront.net/6632431f9e204300085a8c9b/screenshot_2024-05-01-11-20-00-0000.png"
    },
    {
        name: "PixelPredict",
        url: "https://number-id.onrender.com/",
        image: "https://raw.githubusercontent.com/Jalpan04/PixelPredict/main/demo.png"
    },
    {
        name: "Particle Life Simulator",
        url: "https://jalpan04.github.io/Particle-Life-Simulator/",
        image: "https://play-lh.googleusercontent.com/9mD8khz85_t02vr6jMOk_KlSnk3Ue3XyhdH314w_s_Kw-0G_EY_p22Y-E2pc_2Y-Gtg"
    },
    {
        name: "Boids Simulation",
        url: "https://jalpan04.github.io/boid-simulation/",
        image: "https://i.ytimg.com/vi/mhjuuHiT7_k/maxresdefault.jpg"
    },
    {
        name: "Brat Text Generator",
        url: "https://jalpan04.github.io/brat-text-generator/",
        image: "https://repository-images.githubusercontent.com/495392271/58957448-6d2c-4734-93c6-0428841441a1"
    },
    {
        name: "JAX Compiler",
        url: "https://jax-compiler.onrender.com/",
        image: "https://user-images.githubusercontent.com/72879689/229346654-e883856b-3652-4753-8344-9642a49b828a.png"
    }
];

const languageColors = { "Python": "#3572A5", "JavaScript": "#f1e05a", "HTML": "#e34c26", "Jupyter Notebook": "#DA5B0B", "C#": "#178600", "Kotlin": "#A97BFF" };

const pages = {
    home: { id: 'home', title: 'New Tab', url: 'portfolio://home', icon: '🏠' },
    code: { id: 'code', title: 'Jalpan04', url: 'github.com/Jalpan04', icon: '💻' },
    projects: { id: 'projects', title: 'Deployed Projects', url: 'portfolio://projects', icon: '🚀' }
};