---
title: Cli
date: 2017-07-17
template: docs.ejs
url: cli/
next_url: docs/javascript/
next_label: JavaScript
---

<h1 class="uc-section-title">CLI</h1>

Atomic Lab supports cli to build styleguides.
You can generate styleguide anywhere by installing `atomic-lab` globally. 

<div class="uc-code-unit"><pre>
<code class="shell">npm install -g atomic-lab
atomic-lab build --src ./components --dist ./styleguide</code></pre></div>

But I'd rather recommend installing it locally and write some `npm scripts` like below.

<div class="uc-code-unit"><pre>
<code class="json">"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "build:guide": "atomic-lab build --src ./components --dist ./styleguide",
},</code></pre></div>

I know that some peopole don't know much about `npm scripts`.<br/>
so I prepared git repository that you can start `atomic-lab` easily.

https://github.com/steelydylan/atomic-lab-ejs-example

or If you have already installed `npx` you can execute local npm scripts with below command.

<div class="uc-code-unit"><pre>
<code class="shell">npx atomic-lab build --src ./components --dist ./styleguide</code></pre></div>



