/**
 * @description 树级列表结构转为一维数组
 * @param {Array}
 * @param {String} 可配置子节点参数
 * @returns {Array}
 */
export const flattenTreeList = (treeArray = [], childs = 'children') => {
  return treeArray.reduce((acc, cur) => {
    return acc.concat(cur, flattenTreeList(cur[childs] || []));
  }, []);
};

/**
 * @description 一维数组转为树级列表结构
 * @param {Array} 一维数组
 * @param {Object} options: { id: 'id', pid: 'parentId', childs: 'children' }
 * @param {Number} topPid: 顶级节点的父节点id
 * @returns {Array} 树级列表结构
 */
export const arrayToTreeList = (array = [], options = { id: 'id', pid: 'parentId', childs: 'children' }, topPid = 0) => {
  const { id, pid, childs } = options;
  const result = [];
  // 将数组转为对象, 键为id, 值为对象
  const map = array.reduce((res, v) => ((res[v[id]] = v), res), {});

  // 遍历数组，将每个元素放到其父元素的children属性中
  for (const item of array) {
    if (item[pid] == topPid) {
      result.push(item);
      continue;
    }
    if (item[pid] in map) {
      map[item[pid]][childs] = map[item[pid]][childs] || [];
      map[item[pid]][childs].push(item);
    }
  }
  return result;
};

/**
 * @description 两个数组的差集
 * @param {Array} arr1 要比较的数组
 * @param {Array} arr2 要与之比较的数组
 * @param {String} key 比较的key
 * @returns {Array} 包含第一个数组中不在第二个数组中的值
 */
export const differenceBy = (arr1 = [], arr2 = [], key = 'id') => {
  const set = new Set(arr2.map(item => item[key]));
  return arr1.filter(item => !set.has(item[key]));
};
