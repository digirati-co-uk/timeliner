const http = require('http');
const path = require('path');
const fs = require('fs');

const timeliner = process.env.TIMELINER || 'http://localhost:5000/';

http
  .createServer(function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');

    console.log(`${req.method} ${req.url}`);

    if (req.url.slice(1, 5) === 'save') {
      if (req.method !== 'POST') {
        res.end();
        return;
      }

      let body = '';
      req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
      });
      req.on('end', () => {
        const target = req.url.replace(/save/, 'manifests');
        fs.writeFileSync(__dirname + target, body);

        res.writeHead(201);
        res.end('Updated!');
      });
      return;
    }

    if (req.url !== '/') {
      res.setHeader('Content-Type', 'application/json');
      try {
        res.writeHead(200);
        res.end(fs.readFileSync(__dirname + req.url));
      } catch (err) {
        res.end();
      }
      return;
    }

    fs.readdir(path.resolve(__dirname, 'manifests'), function(err, items) {
      const manifests = items
        .map(item => {
          try {
            return {
              item,
              file: fs.readFileSync(path.resolve(__dirname, 'manifests', item)),
            };
          } catch (err) {
            return null;
          }
        })
        .filter(r => r)
        .map(ret => {
          const manifest = JSON.parse(ret.file);
          return {
            label: manifest.label.en.join(''),
            summary: manifest.summary.en.join(''),
            url: `http://localhost:5001/manifests/${ret.item}`,
            callback: `http://localhost:5001/save/${ret.item}`,
          };
        });

      res.write(renderPage(manifests));
      res.end();
    });
  })
  .listen(5001); //the server object listens on port 8080

console.log('Server started: http://localhost:5001/');

function renderPage(manifests) {
  return `
    <html lang="en" class="mdl-js">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en">
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
      <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.teal-red.min.css">
      <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
      <title>Collection server</title>
      <style>
        .demo-ribbon {
          width: 100%;
          height: 40vh;
          background-color: #3F51B5;
          -webkit-flex-shrink: 0;
              -ms-flex-negative: 0;
                  flex-shrink: 0;
        }
        
        .demo-main {
          margin-top: -35vh;
          -webkit-flex-shrink: 0;
              -ms-flex-negative: 0;
                  flex-shrink: 0;
        }
        
        .demo-header .mdl-layout__header-row {
          padding-left: 40px;
        }
        
        .demo-container {
          max-width: 1600px;
          width: calc(100% - 16px);
          margin: 0 auto;
        }
        
        .demo-content {
          border-radius: 2px;
          padding: 20px 40px 40px 40px;
          margin-bottom: 40px;
        }
        
        .demo-layout.is-small-screen .demo-content {
          padding: 40px 28px;
        }
        
        .demo-content h3 {
          margin-top: 48px;
        }
        
        .demo-footer {
          padding-left: 40px;
        }
        
        .demo-footer .mdl-mini-footer--link-list a {
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="demo-layout mdl-layout mdl-layout--fixed-header mdl-js-layout mdl-color--grey-100">
        <header class="demo-header mdl-layout__header mdl-layout__header--scroll mdl-color--grey-100 mdl-color-text--grey-800">
          <div class="mdl-layout__header-row">
            <span class="mdl-layout-title">Collection server</span>
            <div class="mdl-layout-spacer"></div>
          </div>
        </header>
        <div class="demo-ribbon"></div>
      <main class="demo-main mdl-layout__content">
        ${manifests.map(renderManifest)}
      </main>
      </div>
    </body>
    </html>
    `;
}

function renderManifest(manifest) {
  return `
  <div class="demo-container mdl-grid">
    <div class="mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
    <div class="demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--8-col">
      <h2>${manifest.label}</h2>
      <p>
      ${manifest.summary}
      </p>
      <a href="${timeliner}#resource=${manifest.url}&callback=${manifest.callback}"
         target="_blank"
         class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
        Edit this manifest
      </a>
    </div>
  </div>
  `;
}
