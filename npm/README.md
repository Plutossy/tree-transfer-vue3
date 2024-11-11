# tree-transfer-vue3

## 效果图

![tree-transfer-vue3效果图](https://i-blog.csdnimg.cn/direct/28e9ced7068840cb9aaee99dff9e46ce.png)

## 简介

tree-transfer-vue3 是一个基于 VUE 和 element-plus 的树形穿梭框组件，使用前请确认已经引入[element-plus](https://element-plus.org/zh-CN/)！
此组件功能类似于`element-plus`的[transfer](https://element-plus.org/zh-CN/component/transfer.html)组件，但是里面的数据是树形结构！
实际上，tree-transfer-vue3 依赖的 element-plus 组件分别是[Checkbox 多选框](https://element-plus.org/zh-CN/component/checkbox.html)，[Button 按钮](https://element-plus.org/zh-CN/component/button.html)，和最主要的[Tree 树形控件](https://element-plus.org/zh-CN/component/tree.html)写成！并非是在 element-plus 的穿梭框组件上的扩展，而仅仅是参照了其外观样式和功能。

我命油我不油天，仿写一个 vue3 版本的树形穿梭框组件玩玩，请使用最新版本；参考[el-tree-transfer](https://www.npmjs.com/package/el-tree-transfer)

### [NPM](https://www.npmjs.com/package/tree-transfer-vue3) - [GitHub](https://github.com/Plutossy/tree-transfer-vue3) - [CSDN](https://blog.csdn.net/Pluto_ssy/article/details/143627575)

## 快速上手

> npm 下载插件

```
npm install tree-transfer-vue3 --save
```

或

```
npm i tree-transfer-vue3 -S
```

> 然后你可以像使用普通组件一样使用 tree-transfer-vue3

```vue
<template>
  <tree-transfer
    ref="transferRef"
    v-model:fromData="fromData"
    v-model:toData="toData"
    :defaultProps="{
      id: 'id', // 节点id
      parentId: 'parentId', // 父节点id
      label: 'label',
      children: 'children',
      disabled: 'disabled',
    }"
    rootPid="0"
    @add="handleAdd"
    @remove="handleremove"
  />
</template>

<script setup>
import { ref } from 'vue';
import TreeTransfer from 'tree-transfer-vue3'; // 引入

const transferRef = ref(null); // 穿梭框Ref
const fromData = ref([
  {
    id: '1',
    parentId: 0,
    label: '一级 1',
    children: [
      {
        id: '1-1',
        parentId: '1',
        label: '二级 1-1',
        children: [],
      },
      {
        id: '1-2',
        parentId: '1',
        label: '二级 1-2',
        children: [
          {
            id: '1-2-1',
            parentId: '1-2',
            disabled: true,
            children: [],
            label: '二级 1-2-1',
          },
          {
            id: '1-2-2',
            parentId: '1-2',
            children: [],
            label: '二级 1-2-2',
          },
          {
            id: '1-2-3',
            parentId: '1-2',
            children: [],
            label: '二级 1-2-3',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    parentId: 0,
    label: '一级 2',
    children: [
      {
        id: '2-1',
        parentId: '2',
        label: '二级 2-1',
      },
      {
        id: '2-2',
        parentId: '2',
        label: '二级 2-2',
      },
    ],
  },
  {
    id: '4',
    parentId: 0,
    label: '一级 4',
    children: [
      {
        id: '4-1',
        parentId: '4',
        label: '二级 4-1',
      },
      {
        id: '4-2',
        parentId: '4',
        label: '二级 4-2',
      },
    ],
  },
]);
const toData = ref([]);

const handleAdd = (_fromData, _toData, { checkedKeys, checkedNodes, harfKeys, harfNodes }) => {
  console.log('handleAdd', checkedKeys, checkedNodes, harfKeys, harfNodes);
};
const handleremove = (_fromData, _toData, { checkedKeys, checkedNodes, harfKeys, harfNodes }) => {
  console.log('handleremove', checkedKeys, checkedNodes, harfKeys, harfNodes);
};
</script>
```

## 属性

| 属性名            | 说明                                                                            | 类型                | 默认值                 |
| ----------------- | ------------------------------------------------------------------------------- | ------------------- | ---------------------- |
| titleList         | 标题列表                                                                        | _Array_             | ['源列表', '目标列表'] |
| showFilter        | 是否显示过滤框                                                                  | _Boolean_           | true                   |
| placeholder       | 搜索框提示文字（注意：如果 placeholderList 里面有值，优先采用 placeholderList） | _String_            | 请输入关键字搜索       |
| placeholderList   | 搜索框提示文字列表                                                              | _Array_             | []                     |
| showBtnTxt        | 是否显示按钮文字                                                                | _Boolean_           | false                  |
| btnTitleList      | 按钮文字（在 showBtnTxt 为 true 的情况下展示）                                  | _Array_             | ['添加', '移除']       |
| defaultProps      | 树节点的属性配置                                                                | _Object_            | 见下表                 |
| rootPid           | 根节点 pid，用于结束递归                                                        | _String_`/`_Number_ | 0                      |
| renderAfterExpand | 是否在第一次展开某个树节点后才渲染其子节点                                      | _Boolean_           | true                   |
| load              | 加载子树数据的方法，仅当 lazy 属性为 true 时生效                                | _Function_          | --                     |
| fromRenderContent | 左侧 from 树节点的内容区的渲染函数                                              | _Function_          | --                     |
| toRenderContent   | 右侧 to 树节点的内容区的渲染                                                    | _Function_          | --                     |
| highlightCurrent  | 是否高亮当前选中节点                                                            | _Boolean_           | false                  |
| defaultExpandAll  | 是否默认展开所有节点                                                            | _Boolean_           | true                   |
| expandOnClickNode | 是否在点击节点的时候展开或者收缩节点                                            | _Boolean_           | false                  |
| checkOnClickNode  | 是否在点击节点的时候选中节点                                                    | _Boolean_           | true                   |
| autoExpandParent  | 是否自动展开父节点                                                              | _Boolean_           | true                   |
| checkStrictly     | 是否严格的遵守父子节点不互相关联                                                | _Boolean_           | false                  |
| accordion         | 是否每次只打开一个同级树节点                                                    | _Boolean_           | false                  |
| indent            | 相邻级节点的水平缩进，单位为像素                                                | _Number_            | 18                     |
| icon              | 自定义显示节点前的展开箭头                                                      | _String_            | --                     |
| lazy              | 是否懒加载子节点数据                                                            | _Boolean_           | false                  |
| draggable         | 是否开启拖拽节点功能                                                            | _Boolean_           | false                  |
| fromAllowDrag     | 左侧树判断节点能否被拖拽 如果返回 false ，节点不能被拖动                        | _Function_          | --                     |
| toAllowDrag       | 右侧树判断节点能否被拖拽 如果返回 false ，节点不能被拖动                        | _Function_          | --                     |

> ---

## defaultProps

| defaultProps | 说明                                                     | 类型              |
| ------------ | -------------------------------------------------------- | ----------------- |
| id           | 指定节点 id 为节点对象的某个属性值                       | string            |
| parentId     | 指定节点的父节点 id 为节点对象的某个属性值               | string            |
| label        | 指定节点标签为节点对象的某个属性值                       | string`/`Function |
| children     | 指定子树为节点对象的某个属性值                           | string            |
| disabled     | 指定节点选择框是否禁用为节点对象的某个属性值             | string`/`Function |
| isLeaf       | 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效 | string`/`Function |
| class        | 自定义节点类名                                           | string`/`Function |

> ---

## 事件

| 序号 | 事件名称      | 说明                                                  | 回调参数                                                                                                                                               |
| ---- | ------------- | ----------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | add           | 点击添加按钮时触发的事件(2.4.0 以前为 addBtn)         | function(fromData,toData,obj),树形穿梭框 transfer 模式分别为 1.移动后左侧数据，2.移动后右侧数据，3.移动的节点 keys、nodes、halfKeys、halfNodes 对象；  |
| 2    | remove        | 点击移除按钮时触发的事件(2.4.0 以前为 removeBtn)      | function(fromData,toData,obj),树形穿梭框 transfer 模式分别为 1.移动后左侧数据，2.移动后右侧数据，3.移动的节点 keys、nodes、halfKeys、halfNodes 对象；  |
| 3    | nodeDragStart | 开始拖拽时触发的事件                                  | 共 3 个参数，依次为："from"/"to"、对应被拖拽节点对应的 Node、event                                                                                     |
| 4    | nodeDragEnter | 拖拽进入其他节点时触发的事件                          | 共 4 个参数，依次为："from"/"to"、对应被拖拽节点对应的 Node、所进入节点对应的 Node、event                                                              |
| 5    | nodeDragLeave | 拖拽离开某个节点时触发的事件                          | 共 4 个参数，依次为："from"/"to"、对应被拖拽节点对应的 Node、所离开节点对应的 Node、event                                                              |
| 6    | nodeDragOver  | 在拖拽节点时触发的事件（类似浏览器的 mouseover 事件） | 共 4 个参数，依次为："from"/"to"、对应被拖拽节点对应的 Node、当前进入节点对应的 Node、event                                                            |
| 7    | nodeDragEnd   | 拖拽结束时（可能未成功）触发的事件                    | 共 5 个参数，依次为："from"/"to"、对应被拖拽节点对应的 Node、结束拖拽时最后进入的节点（可能为空）、被拖拽节点的放置位置（before、after、inner）、event |
| 8    | nodeDrop      | 拖拽成功完成时触发的事件                              | 共 5 个参数，依次为："from"/"to"、对应被拖拽节点对应的 Node、结束拖拽时最后进入的节点、被拖拽节点的放置位置（before、after、inner）、event             |

> ---

## 方法

| 序号 | 名称           | 说明                                                                                                                                    |
| ---- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | fromTreeRef    | 左侧 from 树 ref 对象                                                                                                                   |
| 2    | toTreeRef      | 右侧 to 树 ref 对象                                                                                                                     |
| 3    | addToAims      | 手动调用添加穿梭，用于调整初始数据默认穿梭 function(useCallBack: Boolean) 本次穿梭是否需要触发@add 的 emit 回调； **默认 true 触发**    |
| 4    | removeToSource | 手动调用添加穿梭，用于调整初始数据默认穿梭 function(useCallBack: Boolean) 本次穿梭是否需要触发@remove 的 emit 回调； **默认 true 触发** |
| 5    | clearFilter    | 清除选中节点，默认清除全部 function(type: String) from 左边； to 右边； all 全部； **默认 all**                                         |
| 6    | clearCheck     | 清除选中节点，默认清除全部 function(type: String) from 左边； to 右边； all 全部； **默认 all**                                         |

> ---

## 插槽

| 插槽名            | 说明                      |
| ----------------- | ------------------------- |
| from-title        | from 穿梭框顶部标题       |
| to-title          | to 穿梭框顶部标题         |
| from-tree-content | from 穿梭框 tree 节点内容 |
| to-tree-content   | to 穿梭框 tree 节点内容   |
| from-footer       | from 穿梭框底部           |
| to-footer         | to 穿梭框底部             |

## 版本说明

> **1.1.0** 添加说明文档，更新事件、方法、插槽
> **1.2.0** 导出方式修改，页面样式修改，请使用最新版本

## [GitHub demo 代码地址](https://github.com/Plutossy/tree-transfer-vue3) 欢迎 star 谢谢

## [有 BUG 请随时联系我，可以在我的博客下面留言！](https://blog.csdn.net/Pluto_ssy/article/details/143627575)
