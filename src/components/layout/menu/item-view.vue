<template>
  <component class="icon" :is="icon" />
  <span>{{ title }}</span>
</template>
<script>
export default {
  name: 'ItemView',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="less" scoped>
.arco-icon {
  &:not(.arco-icon-down) {
    font-size: 18px;
  }
}
.icon {
  width: 20px;
  margin-right: 16px;
  color: var(--color-text-3);
  vertical-align: text-top;
}
</style>
