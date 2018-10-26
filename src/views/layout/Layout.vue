<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}" style="background-color: #e3e3e3;">
    <navbar class="tags-navbar"></navbar>
    <div class="main-container">
      <sidebar class="sidebar-container"></sidebar>
      <!--<breadcard></breadcard>-->
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
  import {Navbar, Sidebar, AppMain,  Breadcard} from './components'

  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain,
      Breadcard
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }

  .tags-navbar {
    height: 74px;
    line-height: 74px;
    border-radius: 0px !important;
    background-color: #fff;
    position: fixed;
    z-index: 2001;
    width: 100%;
    color:white;

  }
</style>
