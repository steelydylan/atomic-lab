# Grammer

### document
```html
<!--@doc
# @category atom
# @name common
# @css ./common.sass
-->
```

### preview
```html
<!--@preview
code here
-->
```

### note
```html
<!--@note
markdown here
-->
```

### make template

define template
```html
<!--@template -->
code here
<!--@/template -->
```

set default variable
```html
<!--@template text="hoge" -->
<p>{text}</p>
<!--@/template -->
```

### use template
supporse that component's name is "main-visual"
```html
<!--@import parts="main-visual" -->
<main-visual image="hoge.png"></main-visual>
```
