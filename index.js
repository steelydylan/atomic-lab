'use strict';

const path = require('path');
const find = require('findit');
const Promise = require('promise');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const extend = require('extend');

const atomicLab = {};
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

const makeAtomicArray = (files, markup, parser) => {
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

const copyPromise = (src, dist) => {
  if (fs.pathExistsSync(dist)) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    fs.copy(src, dist, () => {
      resolve();
    });
  });
};

atomicLab.build = function (opt) {
  const src = opt.src;
  const dist = opt.dist;
  const markup = opt.markup;
  const parser = extend({
    start: /<!--@doc/g,
    end: /-->/g,
    body: /<!--@doc(([\n\r\t]|.)*?)-->/g
  }, opt.parser);
  return atomicLab.init(opt).then(() => {
    getFileInfo(path.resolve(processPath, src))
    .then((files) => {
      const components = makeAtomicArray(files, markup, parser);
      const json = JSON.stringify({ components });
      const pjson = new Promise((resolve) => {
        writeFile(path.resolve(processPath, dist, './components.json'), json, (err) => {
          if (err) {
            console.log(err);
          }
          resolve();
        });
      });
      return pjson;
    });
  });
};

atomicLab.init = (opt) => {
  const dist = opt.dist;
  const src = opt.src;
  const promiseArray = [
    copyPromise(`${__dirname}/index.html`, path.resolve(processPath, dist, './index.html')),
    copyPromise(`${__dirname}/config.json`, path.resolve(processPath, dist, './config.json')),
    copyPromise(`${__dirname}/bundle.js`, path.resolve(processPath, dist, './bundle.js')),
    copyPromise(`${__dirname}/components.json`, path.resolve(processPath, dist, './components.json')),
    copyPromise(`${__dirname}/components`, path.resolve(processPath, src))
  ];
  return Promise.all(promiseArray);
};

atomicLab.update = (opt) => {
  const dist = opt.dist;
  return new Promise((resolve) => {
    fs.copy(`${__dirname}/bundle.js`, path.resolve(processPath, dist, './bundle.js'), () => {
      resolve();
    });
  });
};

module.exports = atomicLab;
