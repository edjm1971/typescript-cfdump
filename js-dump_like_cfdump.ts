/* 
This is TypeScript friendly.
just import this file into your .ts e.g. import * as DUMP from './js-dump_like_cfdump';
Then call is e.g. DUMP.dump(criteria, true);
======================================================================================
Taken from Originating Author: Shuns (www.netgrow.com.au/files)

The dump method is based on one of the tags available in Coldfusion ( <cfdump>) providing the ability to display simple and
complex variables in a user friendly way that is perfect for debugging/inspecting data. There is no way to do this with
javascript and often I had wanted a method to do this. This method will do just that allowing for an infinite amount of
data nesting complete with color coding for different data types, the ability to show/hide the data's type
(String/Number/Boolean/Object/Array/Function), expandable and collapsible tables/keys and cross browser support.

Usage
  dump(value, [showTypes])
  @ param value (Any) value to dump
  @ param [showTypes] (Boolean) optional to display each key/value's type
  @ return (Void) returns nothing

Examples
  dump(myObject, true); // opens a dump window displaying key/value types of myObject
  dump([123,456,789], false); // opens a dump window not displaying key/value types of the array passed
  dump('string value', false); // opens a dump window showing the string value
*/

/**
 * ...
 * @param object 
 * @param showTypes 
 */
export function dump(object, showTypes) {
  const st: string = typeof showTypes == 'undefined' ? true : showTypes;
  const windowName: string = 'dumpWin';
  const browser: string | boolean = _dumpIdentifyBrowser();
  const w: number = 760;
  const h: number = 800;
  const leftPos: number = screen.width ? (screen.width - w) / 2 : 0;
  const topPos: number = screen.height ? (screen.height - h) / 2 : 0;
  const settings: string =
    'height=' + h +
    ',width=' + w +
    ',top=' + topPos +
    ',left=' + leftPos +
    ',scrollbars=yes,menubar=yes,status=yes,resizable=yes';
  const title: string = 'Dump';
  let script: string =
    'function tRow(s){t=s.parentNode.lastChild;tTarget(t, tSource(s));}function tTable(s){let switchToState=tSource(s);const table=s.parentNode.parentNode;for(let i=1;i < table.childNodes.length;i++){t=table.childNodes[i];if(t.style){tTarget(t, switchToState);}}}function tSource(s){if(s.style.fontStyle=="italic"||s.style.fontStyle==null){s.style.fontStyle="normal";s.title="click to collapse";return "open";}else{s.style.fontStyle="italic";s.title="click to expand";return "closed";}}function tTarget(t, switchToState){if(switchToState=="open"){t.style.display="";}else{t.style.display="none";}}';
  let dump: string =
    /string|number|undefined|boolean/.test(typeof object) || object == null
      ? object
      : recurse(object, typeof object);
  const winName: Window = window.open('', windowName, settings);

  if (browser && (
    typeof browser === 'string' && (
      browser.indexOf('ie') != -1 ||
      browser == 'opera' ||
      browser == 'ie5mac' ||
      browser == 'safari'))
  ) {
    winName.document.write(
      '<html><head><title>' + title + '</title>' +
      '<script>' + script + '</script><head>' +
      '<body>' + dump + '</body></html>'
    );
  } else {
    winName.document.body.innerHTML = dump;
    winName.document.title = title;
    let ffs = winName.document.createElement('script');
    ffs.setAttribute('type', 'text/javascript');
    ffs.appendChild(document.createTextNode(script));
    winName.document.getElementsByTagName('head')[0].appendChild(ffs);
  }

  // Bring window back into focus in case it is behind a window
  winName.focus();

  function recurse(o, type: string) {
    let i;
    let j = 0;
    let r = '';
    let t: any;
    type = _dumpType(o);
    console.log('The type is: ', type);
    switch (type) {
      case 'regexp':
        t = type;
        r +=
          '<table' + _dumpStyles(t, 'table') + '>' +
          '<tr><th colspan="2"' + _dumpStyles(t, 'th') + '>' + t + '</th></tr>';
        r +=
          '<tr><td colspan="2"' + _dumpStyles(t, 'td-value') + '>' +
          '<table' + _dumpStyles('arguments', 'table') + '>' +
          '<tr><td' + _dumpStyles('arguments', 'td-key') + '><i>RegExp: </i></td>' +
          '<td' + _dumpStyles(type, 'td-value') + '>' + o + '</td></tr>' +
          '</table>';
        j++;
        break;
      case 'date':
        t = type;
        r +=
          '<table' + _dumpStyles(t, 'table') + '>' +
          '<tr><th colspan="2"' + _dumpStyles(t, 'th') + '>' + t + '</th></tr>';
        r +=
          '<tr><td colspan="2"' + _dumpStyles(t, 'td-value') + '>' +
          '<table' + _dumpStyles('arguments', 'table') + '>' +
          '<tr><td' + _dumpStyles('arguments', 'td-key') + '><i>Date: </i></td>' +
          '<td' + _dumpStyles(type, 'td-value') + '>' + o + '</td></tr></table>';
        j++;
        break;
      case 'function':
        t = type;
        let a = o.toString().match(/^.*function.*?\((.*?)\)/im);
        let args =
          a == null || typeof a[1] == 'undefined' || a[1] == '' ? 'none' : a[1];
        r +=
          '<table' + _dumpStyles(t, 'table') + '>' +
          '<tr><th colspan="2"' + _dumpStyles(t, 'th') + '>' + t + '</th></tr>';
        r +=
          '<tr><td colspan="2"' + _dumpStyles(t, 'td-value') + '>' +
          '<table' + _dumpStyles('arguments', 'table') + '>' +
          '<tr><td' + _dumpStyles('arguments', 'td-key') + '><i>Arguments: </i></td>' +
          '<td' + _dumpStyles(type, 'td-value') + '>' + args + '</td></tr>' +
          '<tr><td' + _dumpStyles('arguments', 'td-key') + '><i>Function: </i></td>' +
          '<td' + _dumpStyles(type, 'td-value') + '>' + o + '</td></tr>' +
          '</table>';
        j++;
        break;
      case 'domelement':
        t = type;
        r +=
          '<table' + _dumpStyles(t, 'table') + '>' +
          '<tr><th colspan="2"' + _dumpStyles(t, 'th') + '>' + t + '</th></tr>';
        r +=
          '<tr><td' + _dumpStyles(t, 'td-key') + '><i>Node Name: </i></td>' +
          '<td' + _dumpStyles(type, 'td-value') + '>' + o.nodeName.toLowerCase() + '</td></tr>';
        r +=
          '<tr><td' + _dumpStyles(t, 'td-key') + '><i>Node Type: </i></td>' +
          '<td' + _dumpStyles(type, 'td-value') + '>' + o.nodeType + '</td></tr>';
        r +=
          '<tr><td' + _dumpStyles(t, 'td-key') + '><i>Node Value: </i></td>' +
          '<td' + _dumpStyles(type, 'td-value') + '>' + o.nodeValue + '</td></tr>';
        r +=
          '<tr><td' + _dumpStyles(t, 'td-key') + '><i>innerHTML: </i></td>' +
          '<td' + _dumpStyles(type, 'td-value') + '>' + o.innerHTML + '</td></tr>';
        j++;
        break;
    }

    if (/object|array/.test(type)) {
      for (i in o) {
        t = _dumpType(o[i]);
        if (j < 1) {
          r +=
            '<table' + _dumpStyles(type, 'table') + '>' +
            '<tr><th colspan="2"' + _dumpStyles(type, 'th') + '>' + type + '</th></tr>';
          j++;
        }
        if (typeof o[i] == 'object' && o[i] != null) {
          r +=
            '<tr><td' + _dumpStyles(type, 'td-key') + '>' + i + (st ? ' [' + t + ']' : '') + '</td>' +
            '<td' + _dumpStyles(type, 'td-value') + '>' + recurse(o[i], t) + '</td></tr>';
        } else if (typeof o[i] == 'function') {
          r +=
            '<tr><td' + _dumpStyles(type, 'td-key') + '>' + i + (st ? ' [' + t + ']' : '') + '</td>' +
            '<td' + _dumpStyles(type, 'td-value') + '>' + recurse(o[i], t) + '</td></tr>';
        } else {
          r +=
            '<tr><td' + _dumpStyles(type, 'td-key') + '>' + i + (st ? ' [' + t + ']' : '') + '</td>' +
            '</td><td' + _dumpStyles(type, 'td-value') + '>' + o[i] + '</td></tr>';
        }
      }
    }

    if (j == 0 && type) {
      r +=
        '<table' + _dumpStyles(type, 'table') +
        '><tr><th colspan="2"' + _dumpStyles(type, 'th') + '>' +
        type +
        ' [empty]</th></tr>';
    }

    r += '</table>';
    return r;
  }
}

/**
 * ...
 * @param type 
 * @param use 
 * @returns 
 */
export const _dumpStyles = (type: string, use: string): string => {
  let r: string = '';
  // font-size:xx-small;
  const table: string = 'font-family:verdana,arial,helvetica,sans-serif;cell-spacing:2px;';
  const th: string = 'font-family:verdana,arial,helvetica,sans-serif;text-align:left;color: white;padding: 5px;vertical-align :top;cursor:hand;cursor:pointer;';
  const td: string = 'font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;';
  const thScript: string = 'onClick="tTable(this);" title="click to collapse"';
  const tdScript: string = 'onClick="tRow(this);" title="click to collapse"';

  switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'undefined':
    case 'object':
      switch (use) {
        case 'table':
          r = ' style="' + table + 'background-color:#0000cc;"';
          break;
        case 'th':
          r = ' style="' + th + 'background-color:#4444cc;"' + thScript;
          break;
        case 'td-key':
          r =
            ' style="' +
            td +
            'background-color:#ccddff;cursor:hand;cursor:pointer;"' +
            tdScript;
          break;
        case 'td-value':
          r = ' style="' + td + 'background-color:#fff;"';
          break;
      }
      break;
    case 'array':
      switch (use) {
        case 'table':
          r = ' style="' + table + 'background-color:#006600;"';
          break;
        case 'th':
          r = ' style="' + th + 'background-color:#009900;"' + thScript;
          break;
        case 'td-key':
          r =
            ' style="' +
            td +
            'background-color:#ccffcc;cursor:hand;cursor:pointer;"' +
            tdScript;
          break;
        case 'td-value':
          r = ' style="' + td + 'background-color:#fff;"';
          break;
      }
      break;
    case 'function':
      switch (use) {
        case 'table':
          r = ' style="' + table + 'background-color:#aa4400;"';
          break;
        case 'th':
          r = ' style="' + th + 'background-color:#cc6600;"' + thScript;
          break;
        case 'td-key':
          r =
            ' style="' +
            td +
            'background-color:#fff;cursor:hand;cursor:pointer;"' +
            tdScript;
          break;
        case 'td-value':
          r = ' style="' + td + 'background-color:#fff;"';
          break;
      }
      break;
    case 'arguments':
      switch (use) {
        case 'table':
          r = ' style="' + table + 'background-color:#dddddd;cell-spacing:3;"';
          break;
        case 'td-key':
          r =
            ' style="' +
            th +
            'background-color:#eeeeee;color:#000000;cursor:hand;cursor:pointer;"' +
            tdScript;
          break;
      }
      break;
    case 'regexp':
      switch (use) {
        case 'table':
          r = ' style="' + table + 'background-color:#CC0000;cell-spacing:3;"';
          break;
        case 'th':
          r = ' style="' + th + 'background-color:#FF0000;"' + thScript;
          break;
        case 'td-key':
          r =
            ' style="' +
            th +
            'background-color:#FF5757;color:#000000;cursor:hand;cursor:pointer;"' +
            tdScript;
          break;
        case 'td-value':
          r = ' style="' + td + 'background-color:#fff;"';
          break;
      }
      break;
    case 'date':
      switch (use) {
        case 'table':
          r = ' style="' + table + 'background-color:#663399;cell-spacing:3;"';
          break;
        case 'th':
          r = ' style="' + th + 'background-color:#9966CC;"' + thScript;
          break;
        case 'td-key':
          r =
            ' style="' +
            th +
            'background-color:#B266FF;color:#000000;cursor:hand;cursor:pointer;"' +
            tdScript;
          break;
        case 'td-value':
          r = ' style="' + td + 'background-color:#fff;"';
          break;
      }
      break;
    case 'domelement':
      switch (use) {
        case 'table':
          r = ' style="' + table + 'background-color:#FFCC33;cell-spacing:3;"';
          break;
        case 'th':
          r = ' style="' + th + 'background-color:#FFD966;"' + thScript;
          break;
        case 'td-key':
          r =
            ' style="' +
            th +
            'background-color:#FFF2CC;color:#000000;cursor:hand;cursor:pointer;"' +
            tdScript;
          break;
        case 'td-value':
          r = ' style="' + td + 'background-color:#fff;"';
          break;
      }
      break;
  }

  return r;
}

/**
 * ...
 * @returns 
 */
export const _dumpIdentifyBrowser = (): string | boolean => {
  let agent = navigator.userAgent.toLowerCase();

  if (typeof window["opera"] != 'undefined') {
    return 'opera';
  }
  else if (typeof document.getElementById != 'undefined') {
    if (navigator.vendor.indexOf('Apple Computer, Inc.') != -1) {
      return 'safari';
    } else if (agent.indexOf('gecko') != -1) {
      return 'mozilla';
    }
  }

  return false;
}

/**
 * ...
 * @param obj 
 * @returns string
 */
export const _dumpType = (obj): string => {
  let t: string = typeof obj;
  if (t == 'function') {
    let f = obj.toString();
    if (/^\/.*\/[gi]??[gi]??$/.test(f)) {
      return 'regexp';
    } else if (/^\[object.*\]$/i.test(f)) {
      t = 'object';
    }
  }

  if (t != 'object') {
    return t;
  }

  switch (obj) {
    case null:
      return 'null';
    case window:
      return 'window';
    case document:
      return 'document';
    case window.event:
      return 'event';
  }

  // TODO find alternate to event.type
  if (window.event && event.type == obj.type) {
    return 'event';
  }

  let c = obj.constructor;
  if (c != null) {
    switch (c) {
      case Array:
        t = 'array';
        break;
      case Date:
        return 'date';
      case RegExp:
        return 'regexp';
      case Object:
        t = 'object';
        break;
      case ReferenceError:
        return 'error';
      default:
        let sc = c.toString();
        let m = sc.match(/\s*function(.*)\(/);
        if (m != null) {
          return 'object';
        }
    }
  }

  let nt = obj.nodeType;
  if (nt != null) {
    switch (nt) {
      case 1:
        if (obj.item == null) {
          return 'domelement';
        }
        break;
      case 3:
        return 'string';
    }
  }

  if (obj.toString != null) {
    let ex = obj.toString();
    let am = ex.match(/^\[object(.*)\]$/i);
    if (am != null) {
      am = am[1];
      switch (am.toLowerCase()) {
        case 'event':
          return 'event';
        case 'nodelist':
        case 'htmlcollection':
        case 'elementarray':
          return 'array';
        case 'htmldocument':
          return 'htmldocument';
      }
    }
  }

  return t;
}
