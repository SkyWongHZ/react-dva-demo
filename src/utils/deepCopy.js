function deepCopy(source) {
  var result = null;
  if (Array.isArray(source)) {
    result = [];
    for (var i = 0; i < source.length; i++) {
      if (Array.isArray(source[i])) {
        result[i] = [];
        for (let j = 0; j < source[i].length; i++) {
          let obj = source[i][j];
          result[i][j] = typeof source[i][j] === 'object' ? deepCopy(obj) : obj;
        }
      } else if (typeof source[i] === 'object') {
        result[i] = deepCopy(source[i]);
      } else {
        result[i] = source[i];
      }
    }
  } else if (source === null) {
    result = null;
  } else if (typeof source === 'object') {
    result = {};
    for (var key in source) {
      if (Array.isArray(source[key])) {
        result[key] = [];
        for (let i = 0; i < source[key].length; i++) {
          let obj = source[key][i];
          result[key][i] = typeof source[key][i] === 'object'
            ? deepCopy(obj)
            : obj;
        }
      } else if (typeof source[key] === 'object') {
        result[key] = deepCopy(source[key]);
      } else {
        result[key] = source[key];
      }
    }
  } else {
    result = source;
  }

  return result;
}

export default deepCopy;
