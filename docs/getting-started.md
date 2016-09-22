# Getting Started

#### 1. Install atomic-lab locally:

```sh
$ npm install atomic-lab
```

#### 2. Initialize your project directory:

```sh
$ $(npm bin)/atomic-lab init
```

```
Options:
  --src Theme/Components directory (this directory will be compiled to the dist directory) [string]
  --dist The directory Where Atomic Lab page will be created [string]
  --sample Whether You want to get some sample components or not [boolean]
```

example.
```sh
$ $(npm bin)/atomic-lab init --dist atomic-lab
```

#### 3. Build Your Project:

##### via command line

```sh
$ $(npm bin)/atomic-lab build
```

```
Options:
  --src Theme/Components directory (this directory will be compiled to the dist directory) [string]
  --dist The directory Where Atomic Lab page will be created [string]
  --markup You can choose from html/ejs/jade/haml [string]
```

##### build with gulp

```js
var gulp = require('gulp');
var atomic = require('atomic-lab');
var bs = require('browser-sync').create();

gulp.task('atomic', function(){
		atomic.build({
			src:"./components",
			dist:"./atomic-lab/resources/setting.json",
			markup:"ejs"
		}).then(bs.reload());
});

gulp.task('default', function () {
    bs.init({
        server: "./atomic-lab/"
    });
    gulp.watch('components/**',['atomic']);
});
```

#### 4. Make sure that your Project looks like this:

```
Your Project/
├── atomic-lab/
│   └── resource/
│       └── setting.json
│
├── themes or components here (like WordPress theme)/
│   └── ** (You have to watch here)
```

Through gulp, You have to update setting.json so that you can make new components to appear on `atomic-lab` pages
