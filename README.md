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
<<<<<<< .merge_file_GjyYT8
<!-- preview -->
code here
<!-- /preview -->
=======
<!--@preview
code here
-->
```

### note
```html
<!--@note
markdown here
-->
>>>>>>> .merge_file_nEQmSE
```

### make template

define template
```html
<<<<<<< .merge_file_GjyYT8
<!-- template -->
code here
<!-- /template -->
=======
<!--@template -->
code here
<!--@/template -->
>>>>>>> .merge_file_nEQmSE
```

set default variable
```html
<<<<<<< .merge_file_GjyYT8
<!-- template text="hoge" -->
<p>{text}</p>
<!-- /template -->
=======
<!--@template text="hoge" -->
<p>{text}</p>
<!--@/template -->
>>>>>>> .merge_file_nEQmSE
```

### use template
supporse that component's name is "main-visual"
```html
<<<<<<< .merge_file_GjyYT8
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
=======
<!--@import parts="main-visual" -->
<main-visual image="hoge.png"></main-visual>
```

## Config
You can update settings via config.js

```js
var config = {
	/*
		read data from jsonfile
		instead of localstorage
	*/
	read_from_local_file:true,
	/*
		run js on preview mode
	*/
	run_script:true,
	/*
		used for Google URL shortener
	*/
	key:"AIzaSyDNu-_s700JSm7SXzLWVt3Rku5ZwbpaQZA"
}
```

## Attribution
We use some icons created by http://patternlab.io/
>>>>>>> .merge_file_nEQmSE
## License
MIT License
