---
title: Template
date: 2017-07-17
template: docs.ejs
---
<h1 class="uc-section-title">Template</h1>

You may want to define how each component should be rendered in accordance with some variables.

<div class="uc-code-unit"><pre>
<code class="html">&lt;!--@template title="Title" lead="" img="example.png" --&gt;
&lt;div class="uc-hero"&gt;
    &lt;div class="uc-hero-bg" style="background-image:url(<%= img %>)"&gt;&lt;/div&gt;
    &lt;div class="uc-hero-title"&gt;&lt;%= title %&gt;&lt;/div&gt;
    &lt;% if (lead) { %&gt;
    &lt;p&gt;&lt;%= lead %&gt;&lt;/p&gt;
    &lt;% } %&gt;
&lt;/div&gt;
&lt;!--@/template --&gt;</code></pre></div>