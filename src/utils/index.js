// 为组件添加install方法
export const withInstall = (comp) => {
  comp.install = (app) => {
    app.component(comp.name, comp);
  };

  return comp;
};

export const test = () => {
  console.log("测试方法导出");
};

// 树结构转对象
export const treeToObj = (tree, obj, keys) => {
  Object.keys(tree).forEach((k) => {
    let a = keys.concat([k]);
    let str = a.join(".");
    if (
      typeof tree[k] == "string" ||
      typeof tree[k] == "number" ||
      Array.isArray(tree[k])
    ) {
      obj[str] = tree[k];
    } else {
      tree[k] && treeToObj(tree[k], obj, a);
    }
  });
  return obj;
};
export const cloneDeep = (obj, hash = new WeakMap()) => {
  // 类型校验
  //  if (typeof obj == "undefined" ) return obj;
  // 校验null/ undefined不能用上述方法
  if (obj == null ) return obj;
  if (typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  // []/ {}   cloneObj
  let val = hash.get(obj);  
  if (val) { // 映射表 存在  直接将结果返回  避免重复地址
    return val; // 递归的终止条件
  }

  // 获取传入对象/方法的构造函数
  let cloneObj = new obj.constructor;
  
  for (let key in obj) {
    // 添加对象/ 数组 的自由属性，继承属性过滤
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = cloneDeep(obj[key], hash);
      hash.set(obj, cloneObj);
    }
  }
  return cloneObj;
}
export const _basePath = (path) => {
  // 若是数组，则直接返回
  if (Array.isArray(path)) return path
  // 若有 '[',']'，则替换成将 '[' 替换成 '.',去掉 ']'
  return path.replace(/\[/g, '.').replace(/\]/g, '').split('.')
}
export const set = (object, path, value) => {
  if (typeof object !== 'object') return object;
  _basePath(path).reduce((o, k, i, _) => {
      if (i === _.length - 1) { // 若遍历结束直接赋值
          o[k] = value
          return null
      } else if (k in o) { // 若存在对应路径，则返回找到的对象，进行下一次遍历
          return o[k]
      } else { // 若不存在对应路径，则创建对应对象，若下一路径是数字，新对象赋值为空数组，否则赋值为空对象
          o[k] = /^[0-9]{1,}$/.test(_[i + 1]) ? [] : {}
          return o[k]
      }
  }, object)
  // 返回object
  return object;
}
/*异步等待一段时间*/
export function sleep(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, seconds);
  });
}
