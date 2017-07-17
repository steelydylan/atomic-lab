---
title: Config
date: 2017-07-17
template: docs.ejs
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

## description

## enable_editing

## breakpoint

## css_dependencies

## markup

## parser