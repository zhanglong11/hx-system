/**
 *
 * @param {Array} treeList 树形列表
 * @param {Function} fn  处理函数
 * @param {String} [childrenKey='children'] 子级key
 * @returns {Array}
 */

/**
 任务名称：2689/ 基础服务-用户管理（react->vue）迁移
 开发人员：李建敏
 日期：2020-3月-24日
 任务类型：2.复制代码
 **/

export default function(treeList, fn, childrenKey = 'children') {
  c(treeList)
  function c(list) {
    _.forEach(list, (item, index) => {
      if (item[childrenKey]) c(item[childrenKey])
      if (_.isFunction(fn)) {
        fn(item)
      }
    })
  }
  return treeList
}
