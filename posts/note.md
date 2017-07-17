---
title: Note
date: 2017-07-17
template: docs.ejs
---

<h1 class="uc-section-title">Note</h1>

Sometimes you may want to leave some explanation how to use components.
Yes You can! by using `@note` comment.
Markdown is also available.

<div class="uc-code-unit"><pre>
<code class="html">&lt;!--@note
## grid system
\`\`\`scss
@include make-grid(mod,col,12);
\`\`\`
## clearfix
\`\`\`scss
@include clearfix();
\`\`\` 
--&gt;</code></pre></div>

is to be


<div class="uc-photo _full">
  <img src="../../images/note.png" class="_shadow"/>
</div>