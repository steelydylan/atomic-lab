---
title: 
date: 2017-07-16
template: docs.ejs
---

<h1 class="uc-section-title">Document</h1>

To convert partial templates to component-styleguides, you should leave a comment like below.
<div class="uc-code-unit"><pre>
<code class="shell">&lt;!--@doc
# @category atom
# @name card
# @css ./card.scss
# @desc it's just a card component
--&gt;</code></pre></div>

## category
 
There are 4 types of category in Atomic Lab

### Atom

Premitive components such as labels, buttons, inputs etc.
These components can't be used without being mixed to be molecule/organism components.  

#### Molecule

Mixed components built with several premitive components. 
eg) Form component built with label, button and input component.

### Organism

organisms are complex components several molucule/atom components joined together.
eg) Header component built with logo, title and form component

### Template

A website wireframe made with organism/molecule/atom components.


## @name

You can give each component a name for your reference.
By giving them names, you can easily find components.


<div class="uc-photo _full">
<img src="../images/name.png" class="_shadow"/>
</div>

## @css

If you want to show css source of the component, you should write the path from the template file.

<div class="uc-photo _full">
<img src="../images/css-source.png" class="_shadow"/>
</div>

## @desc

You can write a description of the component.

<img src="../images/description.png" class="_shadow"/>
