<template>
  <tree-transfer-vue3
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
// import TreeTransfer from 'tree-transfer-vue3'; // 引入

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
