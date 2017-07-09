import extend from './extend.js';

export default class Parser {

  constructor(conf) {
    this.conf = conf;
  }

  getVars(text) {
    const vars = text.match(/(\w+)="(.*?)"/g);
    const defs = {};
    if (!vars) {
      return defs;
    }
    vars.forEach(function (item) {
      const key = item.replace(/=.*/, "");
      let value = item.replace(/.*=/, "").replace(/"/g, "");
      if (value.match(/^\[(.*?)\]$/g)) {
        value = JSON.parse(value);
      }
      console.log(value);
      defs[key] = value;
    });
    return defs;
  }

  getCommentedArea(text, mark) {
    if (!text) {
      return "";
    }
    const comments = text.match(new RegExp(mark.body, "g"));
    if (!comments) {
      return "";
    }
    const comment = comments[0];
    return comment
      .replace(new RegExp(mark.start, "g"), "")
      .replace(new RegExp(mark.end, "g"), "");
  }

  getPreview(text) {
    return this.getCommentedArea(text, this.conf.preview);
  }

  getNote(text) {
    return this.getCommentedArea(text, this.conf.note);
  }

  getDoc(text) {
    return this.getCommentedArea(text, this.conf.doc);
  }

  getMark(mark, source) {
    const pattern = '@' + mark + '(?:[\t 　]+)(.*)';
    const regex = new RegExp(pattern, "i");
    const match = source.match(regex);
    if (match && match[1]) {
      return match[1];
    } else {
      return "";
    }
  }

  getTag(text, components) {
    if (!text) {
      return "";
    }
    const ret = text.match(/<(.*?)>/g);
    let result = "";
    if (!ret) {
      return "";
    }
    for (let i = 0, length = ret.length; i < length; i++) {
      const name = this.getComponentName(ret[i]);
      components.forEach(function (comp) {
        if (name.indexOf(comp.name) !== -1) {
          result = ret[i];
        }
      });
      if (result) {
        break;
      }
    }
    return result;
  }

  getComponentName(text) {
    if (!text) {
      return "";
    }
    return text.replace(/<([a-zA-Z0-9._-]+)\s*\w*.*?>/g, (comment, name) => name);
  }

  getTemplate(text) {
    const conf = this.conf;
    if (!text) {
      return "";
    }
    const templates = text.match(new RegExp(conf.template.body, "g"));
    if (!templates) {
      return "";
    }
    const template = templates[0];
    return template;
  }

  getInnerHtmlFromTemplate(template) {
    const conf = this.conf;
    return template
      .replace(new RegExp(conf.template.start, "g"), "")
      .replace(new RegExp(conf.template.end, "g"), "");
  }

  getVarsFromTemplate(template) {
    const conf = this.conf;
    const templateInside = this.getInnerHtmlFromTemplate(template);
    const templateFirst = template.replace(templateInside, "").replace(new RegExp(conf.template.end), "");
    return this.getVars(templateFirst);
  }

  getRendered(template, defs, overrides) {
    const conf = this.conf;
    const vars = extend({}, defs, overrides);
    return template.replace(new RegExp(conf.variable.mark, "g"), function (a, b) {
      return vars[b] || "";
    });
  }

  removeScript(text) {
    return text.replace(/<script([^'"]|"(\\.|[^"\\])*"|'(\\.|[^'\\])*')*?<\/script>/g, "");
  }

  removeSelf(text, self) {
    const reg = new RegExp("<" + self + "(.*?)>", "g");
    return text.replace(reg, "");
  }
}
