# Mechanical Engineering Portfolio

A dark, engineering-focused portfolio for **CAD, additive manufacturing, FDM 3D printing and rapid prototyping**, featuring an interactive STL hero viewer.

**Live site:** https://santilofaro.github.io/mechanical_engineering_portfolio/

**Repository:** https://github.com/SantiLoFaro/mechanical_engineering_portfolio

## Portfolio focus

The site presents Santi Lo Faro's mechanical design and additive manufacturing work through:

- interactive STL visualization;
- CAD and mechanical design positioning;
- expert-level FDM 3D printing workflow;
- design for additive manufacturing;
- rapid prototyping and physical validation;
- engineering process and technical methodology.

## Interactive STL hero

The hero uses **Three.js** and `STLLoader` to render STL files directly in the browser.

Configured files:

```text
models/stl1.stl
models/stl2.stl
models/stl3.stl
models/stl4.stl
models/stl5.stl
models/stl6.stl
```

The viewer:

- rotates the model automatically;
- supports mouse/touch rotation;
- supports zoom;
- cycles between models every 7 seconds;
- includes previous / next controls;
- can pause and resume automatic cycling;
- skips unavailable configured STL files.

## Add your STL files

Place the real files inside `/models` using the exact names `stl1.stl`, `stl2.stl`, `stl3.stl`, etc.

Model titles and descriptions are configured in:

```text
js/models.js
```

If you have more or fewer than six models, add or remove entries from that array.

## Stack

- Semantic HTML5
- Responsive CSS3
- Vanilla JavaScript ES Modules
- Three.js
- STLLoader
- OrbitControls
- JSON-LD structured data
- GitHub Pages

No CSS framework and no front-end framework are used.

## Project structure

```text
mechanical_engineering_portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── models.js
│   ├── viewer.js
│   └── site.js
├── models/
│   └── .gitkeep
├── .gitignore
├── LICENSE
├── README.md
├── robots.txt
└── sitemap.xml
```

## Local development

Because the 3D viewer uses ES modules and loads STL files, use a local web server rather than opening the HTML file directly with `file://`.

For example, use **Live Server** in VS Code.

## Author

**Santi Lo Faro**

- GitHub: https://github.com/SantiLoFaro
- LinkedIn: https://www.linkedin.com/in/santi-lo-faro-b2489118b/

## License

MIT License.
