/**
 ** eg: https://github.com/sanyuan0704/ewas/blob/main/packages/esbuild-plugin-html/src/index.ts
 */

const createScript = (src) => `<script type="module" src="${src}"></script>`;
const createLink = (src) => `<link rel="stylesheet" href="${src}"></link>`;

const generateHTML = (script, links) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Esbuild App</title>  
  ${links.join('\n')}
</head>

<body>
  <div id="root"></div>
  ${script.join('\n')}
</body>
`;

module.exports = { createScript, createLink, generateHTML };
