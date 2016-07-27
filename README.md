#[Atomic Lab.](http://steelydylan.github.io/atomic-lab/)
Template sharing and coding environment based on atomic design

## Screenshot
<img src="https://raw.github.com/steelydylan/atomic-lab/master/screenshot.png"></img>

## Features

- You can use template engines like haml, ejs and jade.
- You can use css preprocessors like scss, less and stylus
- You can share components you have created with others by sharing shortened URL

## Usage

### preview
```html
<!-- preview -->
code here
<!-- /preview -->
```

### make template

define template
```html
<!-- template -->
code here
<!-- /template -->
```

set default variable
```html
<!-- template text="hoge" -->
<p>{text}</p>
<!-- /template -->
```

### use template
supporse that component's name is "main-visual"
```html
<!-- import="main-visual,button" -->
<!-- main-visual image="hoge.png" -->
<!-- button -->
```

## Attribution
We use these icons created by http://patternlab.io/

<img src="https://raw.github.com/steelydylan/atomic-lab/master/images/atom.svg">
<img src="https://raw.github.com/steelydylan/atomic-lab/master/images/molucule.svg">
<img src="https://raw.github.com/steelydylan/atomic-lab/master/images/organism.svg">
<img src="https://raw.github.com/steelydylan/atomic-lab/master/images/template.svg">
## License
MIT License
