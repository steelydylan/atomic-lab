---
title: Config
date: 2017-07-17
template: docs.ejs
url: config/
---

<h1 class="uc-section-title">Config</h1>

You can change settings via config.json. For example, If you want to load more css files you should add the links to `css_dependencies`
Below is the default config.json.

<div class="uc-code-unit"><pre>
<code class="json">{
  "title": "Atomic Lab.",
  "description": "this is an amazing styleguide generator",
  "local_file_path": "./components.json",
  "run_script": true,
  "enable_editing": true,
  "breakpoint": {
    "pc": 1024,
    "tablet": 768,
    "smartphone": 480
  },
  "css_dependencies": [
    "//cdn.kokush.in/units/1.0.1-beta/units.min.css"
  ],
  "lang": "en",
  "markup": "ejs",
  "parser": {
    "preview": {
      "start": "<!--@preview",
      "end": "-->",
      "body": "<!--@preview(([\n\r\t]|.)*?)-->"
    },
    "note": {
      "start": "<!--@note",
      "end": "-->",
      "body": "<!--@note(([\n\r\t]|.)*?)-->"
    },
    "template": {
      "start": "<!--@template(.*?)-->",
      "end": "<!--@\/template(.*?)-->",
      "body": "<!--@template(.*?)-->(([\n\r\t]|.)*?)<!--@\/template(.*?)-->"
    },
    "doc": {
      "start": "<!--@doc",
      "end": "-->",
      "body": "<!--@doc(([\n\r\t]|.)*?)-->"
    },
    "variable": {
      "mark": "{(.*?)}"
    }
  }
}</code></pre></div>

## title

You can change the header title by `title` property.

<div class="uc-photo _full">
<img src="../../images/config_title.png" class="_shadow"/>
</div>

## description

You can add brief description under the title.

<div class="uc-photo _full">
<img src="../../images/config_description.png" class="_shadow"/>
</div>

## enable_editing

By set it true, you can edit components on browsers.

## breakpoint

Define pc, tablet and smartphone size so to change preview screen width quickly

<div class="uc-photo _full">
<img src="../../images/config_breakpoint.png" class="_shadow"/>
</div>


## css_dependencies

Atomic lab uses iframe to render results, If you want to inject some styles to the iframe, You should declare path to the css files.

## markup

Define the template engine you want to use, ejs is set by default.
You can choose from ejs/jade/haml/html.

## parser

Sometimes There are some situation where you should use css or other format to generate a styleguide, then you may want to change the parser.

