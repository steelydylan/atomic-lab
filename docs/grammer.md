# Grammer
Comment tags should be written on your html/ejs/jade/haml files so to display component's info on atomic-lab.

## Document
Following comment is necessary, so as to update `atomic-lab/resources/setting.json`

```html
<!--@doc
# @category atom
# @name common
# @css ./common.sass
-->
```

## Preview
HTMLs Inside `preview tag` will be appeared on `Preview` panels

```html
<!--@preview
code here
-->
```

## Note
HTMLs Inside `preview tag` will be appeared on `Note` panels
```html
<!--@note
markdown here
-->
```

## Make Templates
You can define each component's template so to reuse it on other components's preview panels

### define template
```html
<!--@template -->
code here
<!--@/template -->
```

### set default variable
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
