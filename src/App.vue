<template>
  <tree-transfer-vue3
    ref="transferRef"
    v-model:fromData="fromData"
    v-model:toData="toData"
    :defaultProps="{
      id: 'uid', // 节点id
      parentId: 'parentId', // 父节点id
      label: 'ulabel',
      children: 'childs',
      disabled: 'disabled',
    }"
    rootPid="0"
    @add="handleAdd"
    @remove="handleremove"
  />
</template>

<script setup>
import { ref } from 'vue';
import TreeTransferVue3 from '../tree-transfer-vue3/tree-transfer-vue3.js'; // 引入

const transferRef = ref(null); // 穿梭框Ref
const fromData = ref([
  {
    uid: '1',
    parentId: 0,
    ulabel: '一级 1',
    childs: [
      {
        uid: '1-1',
        parentId: '1',
        ulabel: '二级 1-1',
        childs: [],
      },
      {
        uid: '1-2',
        parentId: '1',
        ulabel: '二级 1-2',
        childs: [
          {
            uid: '1-2-1',
            parentId: '1-2',
            disabled: true,
            childs: [],
            ulabel: '二级 1-2-1',
          },
          {
            uid: '1-2-2',
            parentId: '1-2',
            childs: [],
            ulabel: '二级 1-2-2',
          },
          {
            uid: '1-2-3',
            parentId: '1-2',
            childs: [],
            ulabel: '二级 1-2-3',
          },
        ],
      },
    ],
  },
  {
    uid: '2',
    parentId: 0,
    ulabel: '一级 2',
    childs: [
      {
        uid: '2-1',
        parentId: '2',
        ulabel: '二级 2-1',
      },
      {
        uid: '2-2',
        parentId: '2',
        ulabel: '二级 2-2',
      },
    ],
  },
  {
    uid: '4',
    parentId: 0,
    ulabel: '一级 4',
    childs: [
      {
        uid: '4-1',
        parentId: '4',
        ulabel: '二级 4-1',
      },
      {
        uid: '4-2',
        parentId: '4',
        ulabel: '二级 4-2',
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
