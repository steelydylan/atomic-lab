---
title: 
date: 2017-07-16
template: docs.ejs
next_url: docs/document/
next_label: document
---

<h1 class="uc-section-title">How it works</h1>

You neeed Node.js environment to use this styleguide. because this styleguide generator load json files converted from template files (ejs/jade/haml/html).
It is almost impossible to make json by manual. So You may want to use CLI or gulp to make json file. Below is the breief image how atomic-lab works.

<div class="uc-photo _full" style="margin-top:20px;margin-bottom:30px;">
  <img src="../images/how_it_works.png" class="_shadow"/>
</div>

### components.json
For reference, below is the json structure that atomic-lab needs.

<div class="uc-code-unit" style="margin-top:10px;"><pre>
<code class="json">{
  "components":[
    {
      "category":"atom/molecule/organism/template",
      "name":"name of the component",
      "html": "some HTML",
      "css": "path to the css file"
    }
    ...
  ]
}</code></pre></div>