import React from 'react';

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getFileExtension(filename) {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

export function getDateDiff(date_future, date_now) {
  var d = Math.abs(date_future - date_now) / 1000; // delta
  var r = {}; // result
  var s = {
    // structure
    // year: 31536000,
    // month: 2592000,
    // week: 604800,
    // day: 86400,
    // hour: 3600,
    minute: 60,
    second: 1,
  };

  Object.keys(s).forEach(function (key) {
    r[key] = Math.floor(d / s[key]);
    d -= r[key] * s[key];
  });

  return r;
}

export function getDateDiffSeconds(date_future, date_now) {
    return Math.abs(date_future - date_now) / 1000
}

export function isReactDevMode(){ 
    return '_self' in React.createElement('div');
}

