---
title: Cli
date: 2017-07-17
template: docs.ejs
url: cli/
next_url: js/
next_label: JavaScript
---

<h1 class="uc-section-title">CLI</h1>

Atomic Lab supports cli to build styleguides.
You can generate styleguide anywhere by installing `atomic-lab` globally 
But I'd rather recommend to install it locally and write some `npm scripts`

<div class="uc-code-unit"><pre>
<code class="json">"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "watch": "onchange \"components/\" -- npm run build:guide",
  "sync": "browser-sync start --server './' --files './styleguide/components.json' --startPath ./styleguide/index.html",
  "build:guide": "atomic-lab build --src ./components --dist ./styleguide ",
  "start": "npm run build:guide && npm-run-all -p watch sync"
},</code></pre></div>

