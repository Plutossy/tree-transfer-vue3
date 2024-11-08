<template>
  <div class="tree-transfer">
    <!-- 左侧穿梭框 原料框 -->
    <div class="transfer-left">
      <div class="transfer-title">
        <el-checkbox v-model="fromCheckAll" :indeterminate="fromIndeterminate" @change="fromCheckAllChange" />
        <slot name="from-title">
          <span>{{ titleList[0] }}</span>
        </slot>
      </div>
      <!-- 内容区 -->
      <div class="transfer-main">
        <el-input v-if="showFilter" v-model="filterFrom" clearable :placeholder="placeholderList[0] || placeholder" class="filter-tree" />
        <el-tree
          ref="fromTreeRef"
          show-checkbox
          :data="fromData"
          :node-key="defaultProps.id"
          :props="defaultProps"
          :render-after-expand="renderAfterExpand"
          :load="load"
          :render-content="fromRenderContent"
          :highlight-current="highlightCurrent"
          :default-expand-all="defaultExpandAll"
          :expand-on-click-node="expandOnClickNode"
          :check-on-click-node="checkOnClickNode"
          :auto-expand-parent="autoExpandParent"
          :check-strictly="checkStrictly"
          :filter-node-method="fromFilterNodeMethod"
          :accordion="accordion"
          :indent="indent"
          :icon="icon"
          :lazy="lazy"
          :draggable="draggable"
          :allow-drag="fromAllowDrag"
          @node-drag-start="fromNodeDragStart"
          @node-drag-enter="fromNodeDragEnter"
          @node-drag-leave="fromNodeDragLeave"
          @node-drag-over="fromNodeDragOver"
          @node-drag-end="fromNodeDragEnd"
          @node-drop="fromNodeDrop"
          @check="fromCheck"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <slot name="from-tree-content" :node="node" :data="data">
                <span>{{ node[defaultProps.label] }}</span>
              </slot>
            </span>
          </template>
        </el-tree>
        <slot name="from-footer"></slot>
      </div>
    </div>
    <!-- 穿梭区 按钮框 -->
    <div class="transfer-center">
      <el-button type="primary" :icon="ArrowRight" :circle="!showBtnTxt" :class="{ 'hide-txt': !showBtnTxt }" :disabled="fromDisabled" @click="addToAims(true)">
        {{ showBtnTxt ? btnTitleList[0] : '' }}
      </el-button>
      <el-button type="primary" :icon="ArrowLeft" :circle="!showBtnTxt" :class="{ 'hide-txt': !showBtnTxt }" :disabled="toDisabled" @click="removeToSource(true)">
        {{ showBtnTxt ? btnTitleList[1] : '' }}
      </el-button>
    </div>
    <!-- 右侧穿梭框 目标框 -->
    <div class="transfer-right">
      <div class="transfer-title">
        <el-checkbox v-model="toCheckAll" :indeterminate="toIndeterminate" @change="toCheckAllChange" />
        <slot name="to-title">
          <span>{{ titleList[1] }}</span>
        </slot>
      </div>
      <!-- 内容区 -->
      <div class="transfer-main">
        <el-input v-if="showFilter" clearable v-model="filterTo" :placeholder="placeholderList[1] || placeholder" class="filter-tree" />
        <el-tree
          ref="toTreeRef"
          show-checkbox
          :data="toData"
          :node-key="defaultProps.id"
          :props="defaultProps"
          :render-after-expand="renderAfterExpand"
          :load="load"
          :render-content="toRenderContent"
          :highlight-current="highlightCurrent"
          :default-expand-all="defaultExpandAll"
          :expand-on-click-node="expandOnClickNode"
          :check-on-click-node="checkOnClickNode"
          :auto-expand-parent="autoExpandParent"
          :check-strictly="checkStrictly"
          :filter-node-method="toFilterNodeMethod"
          :accordion="accordion"
          :indent="indent"
          :icon="icon"
          :lazy="lazy"
          :draggable="draggable"
          :allow-drag="toAllowDrag"
          @node-drag-start="toNodeDragStart"
          @node-drag-enter="toNodeDragEnter"
          @node-drag-leave="toNodeDragLeave"
          @node-drag-over="toNodeDragOver"
          @node-drag-end="toNodeDragEnd"
          @node-drop="toNodeDrop"
          @check="toCheck"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <slot name="to-tree-content" :node="node" :data="data">
                <span>{{ node[defaultProps.label] }}</span>
              </slot>
            </span>
          </template>
        </el-tree>
        <slot name="to-footer"></slot>
      </div>
    </div>
  </div>
</template>

<script name="TreeTransferVue3" setup>
import { ref, defineComponent, defineProps, defineEmits, defineExpose, computed, watch, nextTick } from 'vue';
import { ElTree, ElCheckbox, ElInput, ElButton } from 'element-plus';
import { ArrowRight, ArrowLeft } from '@element-plus/icons-vue';
import { flattenTreeList, differenceBy } from '../utils/index.js';

defineComponent({
  name: 'TreeTransferVue3',
});
const props = defineProps({
  /* 标题 */
  titleList: {
    type: Array,
    default: () => ['源列表', '目标列表'],
  },
  /* 是否显示过滤框 */
  showFilter: {
    type: Boolean,
    default: true,
  },
  /* 搜索框提示文字 */
  placeholder: {
    type: String,
    default: '请输入关键字搜索',
  },
  /* 搜索框提示文字列表 */
  placeholderList: {
    type: Array,
    default: () => [],
  },
  /* 是否显示按钮文字 */
  showBtnTxt: {
    type: Boolean,
    default: false,
  },
  /* 按钮文字 */
  btnTitleList: {
    type: Array,
    default: () => ['添加', '移除'],
  },
  /* 树节点的属性配置 */
  defaultProps: {
    type: Object,
    default: () => ({
      id: 'id', // 节点id
      parentId: 'parentId', // 父节点id
      label: 'label',
      children: 'children',
      disabled: 'disabled',
    }),
  },
  /* 根节点pid，用于结束递归 */
  rootPid: {
    type: [String, Number],
    default: 0,
  },
  /* 是否在第一次展开某个树节点后才渲染其子节点 */
  renderAfterExpand: {
    type: Boolean,
    default: true,
  },
  /* 加载子树数据的方法，仅当 lazy 属性为true 时生效 */
  load: {
    type: Function,
  },
  /* 左侧树节点的内容区的渲染 Function */
  fromRenderContent: {
    type: Function,
  },
  /* 右侧树节点的内容区的渲染 Function  */
  toRenderContent: {
    type: Function,
  },
  /* 是否高亮当前选中节点，默认值是 false */
  highlightCurrent: {
    type: Boolean,
    default: false,
  },
  /* 是否默认展开所有节点 */
  defaultExpandAll: {
    type: Boolean,
    default: true,
  },
  /* 是否在点击节点的时候展开或者收缩节点 */
  expandOnClickNode: {
    type: Boolean,
    default: false,
  },
  /* 是否在点击节点的时候选中节点 */
  checkOnClickNode: {
    type: Boolean,
    default: true,
  },
  /* 是否自动展开父节点 */
  autoExpandParent: {
    type: Boolean,
    default: true,
  },
  /* 是否严格的遵守父子节点不互相关联 */
  checkStrictly: {
    type: Boolean,
    default: false,
  },
  /* 是否每次只打开一个同级树节点 */
  accordion: {
    type: Boolean,
    default: false,
  },
  /* 相邻级节点的水平缩进，单位为像素 */
  indent: {
    type: Number,
    default: 18,
  },
  /* 自定义显示节点前的展开箭头 */
  icon: {
    type: String,
  },
  /* 是否懒加载子节点数据 */
  lazy: {
    type: Boolean,
    default: false,
  },
  /* 是否开启拖拽节点功能 */
  draggable: {
    type: Boolean,
    default: false,
  },
  /* 左侧树判断节点能否被拖拽 如果返回 false ，节点不能被拖动 */
  fromAllowDrag: {
    type: Function,
  },
  /* 右侧树判断节点能否被拖拽 如果返回 false ，节点不能被拖动 */
  toAllowDrag: {
    type: Function,
  },
});
// 定义emit
const emits = defineEmits(['add', 'remove', 'nodeDragStart', 'nodeDragEnter', 'nodeDragLeave', 'nodeDragOver', 'nodeDragEnd', 'nodeDrop']);

// 左侧树数据
const fromData = defineModel('fromData', {
  type: Array,
  default: () => [
    // {
    //   id: '1',
    //   parentId: 0,
    //   label: '一级 1',
    //   children: [
    //     {
    //       id: '1-1',
    //       parentId: '1',
    //       label: '二级 1-1',
    //       children: [],
    //     },
    //     {
    //       id: '1-2',
    //       parentId: '1',
    //       label: '二级 1-2',
    //       children: [
    //         {
    //           id: '1-2-1',
    //           parentId: '1-2',
    //           disabled: true,
    //           children: [],
    //           label: '二级 1-2-1',
    //         },
    //         {
    //           id: '1-2-2',
    //           parentId: '1-2',
    //           children: [],
    //           label: '二级 1-2-2',
    //         },
    //         {
    //           id: '1-2-3',
    //           parentId: '1-2',
    //           children: [],
    //           label: '二级 1-2-3',
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   id: '2',
    //   parentId: 0,
    //   label: '一级 2',
    //   children: [
    //     {
    //       id: '2-1',
    //       parentId: '2',
    //       label: '二级 2-1',
    //     },
    //     {
    //       id: '2-2',
    //       parentId: '2',
    //       label: '二级 2-2',
    //     },
    //   ],
    // },
    // {
    //   id: '4',
    //   parentId: 0,
    //   label: '一级 4',
    //   children: [
    //     {
    //       id: '4-1',
    //       parentId: '4',
    //       label: '二级 4-1',
    //     },
    //     {
    //       id: '4-2',
    //       parentId: '4',
    //       label: '二级 4-2',
    //     },
    //   ],
    // },
  ],
});
// 右侧树数据
const toData = defineModel('toData', {
  type: Array,
  default: () => [
    // {
    //   id: '3',
    //   parentId: 0,
    //   label: '一级 3',
    //   children: [
    //     {
    //       id: '3-1',
    //       parentId: '3',
    //       label: '二级 3-1',
    //       children: []
    //     },
    //     {
    //       id: '3-2',
    //       parentId: '3',
    //       label: '二级 3-2',
    //       children: []
    //     }
    //   ]
    // }
  ],
});

const fromTreeRef = ref(null); // 左侧树DOM
const toTreeRef = ref(null); // 右侧树DOM

// 选择相关
const fromCheckAll = ref(false);
const fromIndeterminate = ref(false);
const toCheckAll = ref(false);
const toIndeterminate = ref(false);
// 选中节点
const fromCheckNode = ref([]);
const toCheckNode = ref([]);
// 过滤相关
const filterFrom = ref('');
const filterTo = ref('');
// 按钮禁用相关
const fromDisabled = computed(() => fromCheckNode.value.length === 0);
const toDisabled = computed(() => toCheckNode.value.length === 0);

watch(
  fromCheckNode,
  val => {
    if (props.checkStrictly) {
      const treeArray = flattenTreeList(fromData.value, props.defaultProps.children);
      fromIndeterminate.value = val.length !== 0 && val.length < treeArray.length;
      fromCheckAll.value = fromData.value.length !== 0 && val.length === treeArray.length && !fromIndeterminate.value;
    } else {
      const topPidNum = val.filter(item => item[props.defaultProps.parentId] == props.rootPid).length;
      fromIndeterminate.value = val.length !== 0 && topPidNum !== fromData.value.length;
      fromCheckAll.value = fromData.value.length !== 0 && topPidNum === fromData.value.length && !fromIndeterminate.value;
    }
  },
  { deep: true }
);
watch(
  toCheckNode,
  val => {
    if (props.checkStrictly) {
      const treeArray = flattenTreeList(toData.value, props.defaultProps.children);
      toIndeterminate.value = val.length !== 0 && val.length < treeArray.length;
      toCheckAll.value = toData.value.length !== 0 && val.length === treeArray.length && !toIndeterminate.value;
    } else {
      const topPidNum = val.filter(item => item[props.defaultProps.parentId] == props.rootPid).length;
      toIndeterminate.value = val.length !== 0 && topPidNum !== toData.value.length;
      toCheckAll.value = toData.value.length !== 0 && topPidNum === toData.value.length && !toIndeterminate.value;
    }
  },
  { deep: true }
);
watch(filterFrom, val => {
  fromTreeRef.value.filter(val);
});
watch(filterTo, val => {
  toTreeRef.value.filter(val);
});

// 树过滤节点方法
const fromFilterNodeMethod = (value, data) => {
  if (!value) return true;
  return data[props.defaultProps.label].includes(value);
};
const toFilterNodeMethod = (value, data) => {
  if (!value) return true;
  return data[props.defaultProps.label].includes(value);
};

// 全选事件
const fromCheckAllChange = val => {
  if (!fromData.value.length) return;
  const treeArray = flattenTreeList(fromData.value, props.defaultProps.children);
  const ids = treeArray
    .map(item => {
      if (!item[props.defaultProps.disabled]) {
        return item[props.defaultProps.id];
      }
    })
    .filter(item => item);
  // 如果上次选中的节点等于所有可选节点的长度，则清空选中
  if (fromTreeRef.value.getCheckedNodes(false, true).length === ids.length) {
    fromTreeRef.value.setCheckedKeys([]);
  } else {
    // fromTreeRef.value.setCheckedKeys(ids);
    fromTreeRef.value.setCheckedKeys(val ? ids : []);
  }
  fromCheckNode.value = fromTreeRef.value.getCheckedNodes();
};
const toCheckAllChange = val => {
  if (!toData.value.length) return;
  const treeArray = flattenTreeList(toData.value, props.defaultProps.children);
  // 除去禁用节点的id列表
  const ids = treeArray
    .map(item => {
      if (!item[props.defaultProps.disabled]) {
        return item[props.defaultProps.id];
      }
    })
    .filter(item => item);
  // 如果上次选中的节点等于所有可选节点的长度，则清空选中
  if (toTreeRef.value.getCheckedNodes(false, true).length === ids.length) {
    toTreeRef.value.setCheckedKeys([]);
  } else {
    toTreeRef.value.setCheckedKeys(val ? ids : []);
  }
  toCheckNode.value = toTreeRef.value.getCheckedNodes();
};
// 树节点选中事件
const fromCheck = (node, checkTree) => {
  fromCheckNode.value = checkTree.checkedNodes;
};
const toCheck = (node, checkTree) => {
  toCheckNode.value = checkTree.checkedNodes;
};

// 添加事件
const addToAims = (useCallBack = true) => {
  // const allKeys = fromTreeRef.value
  //   .getCheckedNodes(false, true)
  //   .map((item) => item[props.defaultProps.id]); // 所有选中节点的key(包括半选)
  // const allNodes = fromTreeRef.value.getCheckedKeys(false, true); // 选中节点的node(包括半选)
  const checkedKeys = fromTreeRef.value.getCheckedKeys(); // 选中节点的key
  const checkedNodes = fromTreeRef.value.getCheckedNodes(); // 选中节点的node
  const harfKeys = fromTreeRef.value.getHalfCheckedKeys(); // 半选节点的key
  const harfNodes = fromTreeRef.value.getHalfCheckedNodes(); // 半选节点的node

  // 父子不关联的写法
  if (props.checkStrictly) {
    fromCheckNode.value.forEach(item => {
      const isHas = flattenTreeList(toData.value, props.defaultProps.children).some(m => m[props.defaultProps.id] === item[props.defaultProps.id]);
      const isHasPid = flattenTreeList(toData.value, props.defaultProps.children).some(p => p[props.defaultProps.id] === item[props.defaultProps.parentId]);
      if (!isHas) {
        if (isHasPid) {
          // 有父节点，追加到父节点下
          const _parent = item[props.defaultProps.parentId] != props.rootPid ? item[props.defaultProps.parentId] : null;
          // 合并到右侧数据
          toTreeRef.value.append(
            Object.assign({}, item, {
              [props.defaultProps.children]: [],
            }),
            _parent
          );
        } else {
          // 没有父节点，追加到根节点下
          toTreeRef.value.append(
            Object.assign({}, item, {
              [props.defaultProps.children]: [],
            }),
            null
          );
        }
      } else {
        console.warn(item[props.defaultProps.label] + ' 已存在，请勿重复添加！');
      }
      if (!item[props.defaultProps.children] || !item[props.defaultProps.children].length) {
        // 移除选中
        fromTreeRef.value.remove(item);
      }
      nextTick(() => {
        const isArlHas = flattenTreeList(toData.value, props.defaultProps.children).some(h => h[props.defaultProps.id] === item[props.defaultProps.id]);
        if (!item[props.defaultProps.children] || !item[props.defaultProps.children].length) {
          // 移除选中
          isArlHas && fromTreeRef.value.remove(item);
        }

        // 如果添加的节点是右侧已有数据的父节点，则将右侧对应数据合并到此根节点下
        const hasChildren = flattenTreeList(toData.value, props.defaultProps.children).filter(c => c[props.defaultProps.parentId] === item[props.defaultProps.id]);
        hasChildren.forEach(hc => {
          toTreeRef.value.remove(hc);
          toTreeRef.value.append(Object.assign({}, hc), item[props.defaultProps.id]);
        });
      });
    });
    // 清空选中数据
    fromTreeRef.value.setCheckedKeys([]);
    toTreeRef.value.setCheckedKeys([]);
    fromCheckNode.value = [];
    toCheckNode.value = [];
  } else {
    // 第一步：排除在对面已经存在的半选节点，然后将需穿梭半选节点的children设置为[]并穿梭;
    harfNodes.forEach(item => {
      const harfInTarget = flattenTreeList(toData.value, props.defaultProps.children).some(t => t[props.defaultProps.id] === item[props.defaultProps.id]);
      if (!harfInTarget) {
        const _parent = item[props.defaultProps.parentId] != props.rootPid ? item[props.defaultProps.parentId] : null;
        toTreeRef.value.append(
          Object.assign({}, item, {
            [props.defaultProps.children]: [],
          }),
          _parent
        );
      }
    });

    // 第二步：先将对面存在的节点抛弃
    const notInTargetNodes = differenceBy(fromCheckNode.value, flattenTreeList(toData.value, props.defaultProps.children), props.defaultProps.id);

    // 第三步：若a节点的父节点也在选中节点中，则将a节点也抛弃，最后将剩余的节点穿梭
    notInTargetNodes.forEach(i => {
      const parentInHere = notInTargetNodes.some(t => t[props.defaultProps.id] === i[props.defaultProps.parentId]);
      if (!parentInHere) {
        const _parent = i[props.defaultProps.parentId] != props.rootPid ? i[props.defaultProps.parentId] : null;
        toTreeRef.value.append(i, _parent);
      }
    });
    // 左侧删掉选中数据，也删除fromCheckNode中的数据
    fromCheckNode.value.map(item => fromTreeRef.value.remove(item));
    fromCheckNode.value = [];
  }

  // 清空对面选中
  toTreeRef.value.setCheckedKeys([]);
  toCheckNode.value = [];

  // 传递信息给父组件
  useCallBack &&
    emits('add', fromData.value, toData.value, {
      checkedKeys,
      checkedNodes,
      harfKeys,
      harfNodes,
    });
};
// 移除事件
const removeToSource = (useCallBack = true) => {
  // const allKeys = toTreeRef.value
  //   .getCheckedNodes(false, true)
  //   .map((item) => item[props.defaultProps.id]); // 所有选中节点的key(包括半选)
  // const allNodes = toTreeRef.value.getCheckedKeys(false, true); // 选中节点的node(包括半选)
  const checkedKeys = toTreeRef.value.getCheckedKeys(); // 选中节点的key
  const checkedNodes = toTreeRef.value.getCheckedNodes(); // 选中节点的node
  const harfKeys = toTreeRef.value.getHalfCheckedKeys(); // 半选节点的key
  const harfNodes = toTreeRef.value.getHalfCheckedNodes(); // 半选节点的node

  // 父子不关联的写法
  if (props.checkStrictly) {
    toCheckNode.value.forEach(item => {
      const isHas = flattenTreeList(fromData.value, props.defaultProps.children).some(m => m[props.defaultProps.id] === item[props.defaultProps.id]);
      const isHasPid = flattenTreeList(fromData.value, props.defaultProps.children).some(p => p[props.defaultProps.id] === item[props.defaultProps.parentId]);
      if (!isHas) {
        if (isHasPid) {
          // 有父节点，追加到父节点下
          const _parent = item[props.defaultProps.parentId] != props.rootPid ? item[props.defaultProps.parentId] : null;
          // 合并到右侧数据
          fromTreeRef.value.append(
            Object.assign({}, item, {
              [props.defaultProps.children]: [],
            }),
            _parent
          );
        } else {
          // 没有父节点，追加到根节点下
          fromTreeRef.value.append(
            Object.assign({}, item, {
              [props.defaultProps.children]: [],
            }),
            null
          );
        }
      } else {
        console.warn(item[props.defaultProps.label] + ' 已存在，请勿重复添加！');
      }
      if (!item[props.defaultProps.children] || !item[props.defaultProps.children].length) {
        // 移除选中
        toTreeRef.value.remove(item);
      }
      nextTick(() => {
        const isArlHas = flattenTreeList(fromData.value, props.defaultProps.children).some(h => h[props.defaultProps.id] === item[props.defaultProps.id]);
        if (!item[props.defaultProps.children] || !item[props.defaultProps.children].length) {
          // 移除选中
          isArlHas && toTreeRef.value.remove(item);
        }

        // 如果添加的节点是右侧已有数据的父节点，则将右侧对应数据合并到此根节点下
        const hasChildren = flattenTreeList(fromData.value, props.defaultProps.children).filter(c => c[props.defaultProps.parentId] === item[props.defaultProps.id]);
        hasChildren.forEach(hc => {
          fromTreeRef.value.remove(hc);
          fromTreeRef.value.append(Object.assign({}, hc), item[props.defaultProps.id]);
        });
      });
    });
    // 清空选中数据
    toTreeRef.value.setCheckedKeys([]);
    fromTreeRef.value.setCheckedKeys([]);
    toCheckNode.value = [];
    fromCheckNode.value = [];
  } else {
    // 第一步：排除在对面已经存在的半选节点，然后将需穿梭半选节点的children设置为[]并穿梭;
    harfNodes.forEach(item => {
      const harfInTarget = flattenTreeList(fromData.value, props.defaultProps.children).some(t => t[props.defaultProps.id] === item[props.defaultProps.id]);
      if (!harfInTarget) {
        const _parent = item[props.defaultProps.parentId] != props.rootPid ? item[props.defaultProps.parentId] : null;
        fromTreeRef.value.append(
          Object.assign({}, item, {
            [props.defaultProps.children]: [],
          }),
          _parent
        );
      }
    });

    // 第二步：先将对面存在的节点抛弃
    const notInTargetNodes = differenceBy(toCheckNode.value, flattenTreeList(fromData.value, props.defaultProps.children), props.defaultProps.id);

    // 第三步：若a节点的父节点也在选中节点中，则将a节点也抛弃，最后将剩余的节点穿梭
    notInTargetNodes.forEach(i => {
      const parentInHere = notInTargetNodes.some(t => t[props.defaultProps.id] === i[props.defaultProps.parentId]);
      if (!parentInHere) {
        const _parent = i[props.defaultProps.parentId] != props.rootPid ? i[props.defaultProps.parentId] : null;
        fromTreeRef.value.append(i, _parent);
      }
    });
    // 右侧删掉选中数据，也删除toCheckNode中的数据
    toCheckNode.value.map(item => toTreeRef.value.remove(item));
    toCheckNode.value = [];
  }

  // 清空对面选中
  fromTreeRef.value.setCheckedKeys([]);
  fromCheckNode.value = [];

  // 传递信息给父组件
  useCallBack &&
    emits('remove', fromData.value, toData.value, {
      checkedKeys,
      checkedNodes,
      harfKeys,
      harfNodes,
    });
};

// 左侧拖拽相关
const fromNodeDragStart = (...args) => {
  emits('nodeDragStart', 'from', ...args);
};
const fromNodeDragEnter = (...args) => {
  emits('nodeDragEnter', 'from', ...args);
};
const fromNodeDragLeave = (...args) => {
  emits('nodeDragLeave', 'from', ...args);
};
const fromNodeDragOver = (...args) => {
  emits('nodeDragOver', 'from', ...args);
};
const fromNodeDragEnd = (...args) => {
  emits('nodeDragEnd', 'from', ...args);
};
const fromNodeDrop = (...args) => {
  emits('nodeDrop', 'from', ...args);
};

// 右侧拖拽相关
const toNodeDragStart = (...args) => {
  emits('nodeDragStart', 'to', ...args);
};
const toNodeDragEnter = (...args) => {
  emits('nodeDragEnter', 'to', ...args);
};
const toNodeDragLeave = (...args) => {
  emits('nodeDragLeave', 'to', ...args);
};
const toNodeDragOver = (...args) => {
  emits('nodeDragOver', 'to', ...args);
};
const toNodeDragEnd = (...args) => {
  emits('nodeDragEnd', 'to', ...args);
};
const toNodeDrop = (...args) => {
  emits('nodeDrop', 'to', ...args);
};

const clearFilter = (clear = 'all') => {
  if (clear === 'all') {
    filterFrom.value = '';
    filterTo.value = '';
  } else {
    if (clear === 'from') {
      filterFrom.value = '';
    }
    if (clear === 'to') {
      filterTo.value = '';
    }
  }
};
const clearCheck = (clear = 'all') => {
  if (clear === 'all') {
    fromTreeRef.value.setCheckedKeys([]);
    fromCheckNode.value = [];
    toTreeRef.value.setCheckedKeys([]);
    toCheckNode.value = [];
  } else {
    if (clear === 'from') {
      fromTreeRef.value.setCheckedKeys([]);
      fromCheckNode.value = [];
    }
    if (clear === 'to') {
      toTreeRef.value.setCheckedKeys([]);
      toCheckNode.value = [];
    }
  }
};

defineExpose({
  fromTreeRef,
  toTreeRef,
  addToAims,
  removeToSource,
  clearFilter,
  clearCheck,
});
</script>

<style scoped>
.tree-transfer {
  background-color: #fff;
  min-width: 560px;
  min-height: 400px;
  display: flex;
}

.tree-transfer .transfer-left,
.tree-transfer .transfer-right {
  width: 45%;
  border: 1px solid #ebeef5;
}

.tree-transfer .transfer-left .transfer-title,
.tree-transfer .transfer-right .transfer-title {
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  padding: 6px 10px;
}

.tree-transfer .transfer-left .transfer-title > span,
.tree-transfer .transfer-right .transfer-title > span {
  margin-left: 8px;
}

.tree-transfer .transfer-left .transfer-main,
.tree-transfer .transfer-right .transfer-main {
  margin: 10px;
}

.tree-transfer .transfer-left .transfer-main .filter-tree,
.tree-transfer .transfer-right .transfer-main .filter-tree {
  margin-bottom: 8px;
}

.tree-transfer .transfer-left .transfer-main .el-tree,
.tree-transfer .transfer-right .transfer-main .el-tree {
  overflow-x: auto;
}

.tree-transfer .transfer-center {
  flex: 1;
  min-width: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tree-transfer .transfer-center .el-button + .el-button {
  margin-left: 0;
  margin-top: 12px;
}

.tree-transfer .transfer-center :deep(.el-button.hide-txt) [class*='el-icon'] + span {
  margin-left: 0;
}
</style>
<!-- <style>
/* 更改警告框位置 */
.el-form-item.is-error .tree-transfer .el-input .el-input__wrapper.is-focus, .el-form-item.is-error .tree-transfer .el-input .el-input__wrapper.focus, .el-form-item.is-error .tree-transfer .el-input .el-input__wrapper:focus, .el-form-item.is-error .tree-transfer .el-input .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px transparent inset;
}
.el-form-item.is-error .tree-transfer .transfer-right {
  border: 1px solid var(--el-color-danger) !important;
}
</style> -->
