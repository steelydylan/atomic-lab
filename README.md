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
## License
MIT License
