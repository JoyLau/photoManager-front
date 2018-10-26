<template>
  <div class="dashboard-editor-container">
      首页自定义页面
  </div>
</template>

<script>
export default {
  name: 'dashboard-admin',
  methods: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  .chart-wrapper {
    background: #fff;
    padding: 27px 24px 30px;
    margin-bottom: 32px;
    height:470px;
    .chart-wrapper-text {
      font-family: "Microsoft YaHei";
      font-size: 20px;
      color: #232a30;
    }
    .chart-wrapper-right {
      display: inline-block;
      float: right;
      position: relative;
      top: -4px;
    }
  }
}

</style>
