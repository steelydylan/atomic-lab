---
title: Document
date: 2017-07-16
template: docs.ejs
url: document/
next_url: docs/preview/
next_label: preview
---

<h1 class="uc-section-title">Document</h1>

To convert partial templates to component-styleguides, you should leave a comment like below.
<div class="uc-code-unit"><pre>
<code class="html">&lt;!--@doc
# @category atom
# @name card
# @css ./card.scss
# @desc it's just a card component
--&gt;</code></pre></div>

## @category
 
When you want to categorize each component, you should add this attribute.

## @name

You can give each component a name for your reference.
By giving them names, you can easily find components.

<div class="uc-photo _full">
<img src="../../images/name.png" class="_shadow"/>
</div>

## @css

If you want to show css source of the component, you should write the path from the template file.

<div class="uc-photo _full">
<img src="../../images/css-source.png" class="_shadow"/>
</div>

## @desc

You can write a description of the component.

<img src="../../images/description.png" class="_shadow"/>
