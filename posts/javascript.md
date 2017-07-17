---
title: JavaScript
date: 2017-07-16
template: docs.ejs
url: javascript/
---

<h1 class="uc-section-title">JavaScript</h1>

I think some people prefere to use JavaScript API to work with build tools such as gulp.
So I have prepared JavaScript API you can `require()`;

<div class="uc-code-unit"><pre>
<code class="js">// import atomic-lab
const atomic = require('atomic-lab');

// build styleguide
atomic.build({
  src: 'components/',
  dist: 'styleguide/'
});</code></pre></div>

## Example to use with gulp.

<div class="uc-code-unit"><pre>
<code class="js">const gulp = require('gulp');
const atomic = require('atomic-lab');

gulp.task('atomic', function(){
  atomic.build({
    src: 'components/',
    dist: 'styleguide/',
    markup: 'html'
  });
});

gulp.task('watch',function(){
  gulp.watch('components/**/*.*',['atomic']);
});</code></pre></div>


