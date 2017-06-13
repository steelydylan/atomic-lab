'use strict';

const path = require('path');
const find = require('findit');
const Promise = require('promise');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const extend = require('extend');

const atomicBuilder = {};
const getDirName = path.dirname;
const processPath = process.cwd();

const getFileInfo = dir => new Promise((resolve) => {
  const finder = find(dir);
  const files = [];
  finder.on('file', (filePath) => {
    files.push(filePath);
  });
  finder.on('end', () => {
    resolve(files);
  });
});

const getDoc = (source, parser) => {
  let doc = source.match(parser.body);
  if (!doc) {
    return '';
  }
  doc = doc[0];
  return doc
    .replace(parser.start, '')
    .replace(parser.end, '');
};

const getMark = (mark, source) => {
  const pattern = `@${mark}(?:[\t  ]+)(.*)`;
  const regex = new RegExp(pattern, 'i');
  const match = source.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return '';
};

const makeAtomicArray = (files, markup, styling, parser) => {
  const components = [];
  let id = 0;
  for (let i = 0, n = files.length; i < n; i += 1) {
    const file = files[i];
    const extName = path.extname(file).replace('.', '');
    if (extName !== markup) {
      continue;
    }
    const html = fs.readFileSync(file, 'utf8');
    let css;
    let js;
    const doc = getDoc(html, parser);
    if (!doc) {
      continue;
    }
    const name = getMark('name', doc);
    if (!name) {
      continue;
    }
    const category = getMark('category', doc) || 'atom';
    const cssMark = getMark('css', doc);
    if (cssMark) {
      const cssPath = path.resolve(file, '../', cssMark);
      try {
        css = fs.readFileSync(cssPath, 'utf8');
      } catch (err) {
        console.log(err);
      }
    }
    const jsMark = getMark('js', doc);
    if (jsMark) {
      const jsPath = path.resolve(file, '../', jsMark);
      try {
        js = fs.readFileSync(jsPath, 'utf8');
      } catch (err) {
        console.log(err);
      }
    }
    id += 1;
    components.push({ category, name, html, css, js, itemId: id });
  }
  return components;
};

const writeFile = function (filePath, contents, cb) {
  mkdirp(getDirName(filePath), (err) => {
    if (err) {
      return cb(err);
    }
    return fs.writeFile(filePath, contents, cb);
  });
};

atomicBuilder.build = function (opt) {
  const src = opt.src;
  const dist = opt.dist;
  const markup = opt.markup;
  const styling = opt.styling;
  const parser = extend({
    start: /<!--@doc/g,
    end: /-->/g,
    body: /<!--@doc(([\n\r\t]|.)*?)-->/g
  }, opt.parser);
  return getFileInfo(path.resolve(processPath, src))
    .then((files) => {
      const components = makeAtomicArray(files, markup, styling, parser);
      const json = JSON.stringify({ components });
      const pjson = new Promise((resolve) => {
        writeFile(path.resolve(processPath, dist), json, (err) => {
          console.log(err);
          resolve();
        });
      });
      return pjson;
    });
};

atomicBuilder.init = (opt) => {
  const dist = opt.dist;
  const src = opt.src;
  const examples = opt.examples;
  const p1 = new Promise((resolve) => {
    fs.copy(`${__dirname}/css`, path.resolve(processPath, dist, './css'), () => {
      resolve();
    });
  });
  const p2 = new Promise((resolve) => {
    fs.copy(`${__dirname}/src`, path.resolve(processPath, dist, './js'), () => {
      resolve();
    });
  });
  const p3 = new Promise((resolve) => {
    fs.copy(`${__dirname}/images`, path.resolve(processPath, dist, './images'), () => {
      resolve();
    });
  });
  const p4 = new Promise((resolve) => {
    fs.copy(`${__dirname}/index.html`, path.resolve(processPath, dist, './index.html'), () => {
      resolve();
    });
  });
  const p5 = new Promise((resolve) => {
    fs.copy(`${__dirname}/config.json`, path.resolve(processPath, dist, './config.json'), () => {
      resolve();
    });
  });
  const p6 = new Promise((resolve) => {
    if (examples) {
      fs.copy(`${__dirname}/components`, path.resolve(processPath, src), () => {
        resolve();
      });
    } else {
      resolve();
    }
  });
  const p7 = new Promise((resolve) => {
    if (examples) {
      fs.copy(`${__dirname}/resources/setting.json`, path.resolve(processPath, dist, './resources/setting.json'), () => {
        resolve();
      });
    } else {
      resolve();
    }
  });
  const p8 = new Promise((resolve) => {
    if (examples) {
      fs.copy(`${__dirname}/bundle.js`, path.resolve(processPath, dist, './bundle.js'), () => {
        resolve();
      });
    } else {
      resolve();
    }
  });

  return Promise.all([p1, p2, p3, p4, p5, p6, p7, p8]);
};

module.exports = atomicBuilder;
