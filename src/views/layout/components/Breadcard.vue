<template>
  <!--<div class="tags-view-container ">-->
    <!--<scroll-pane class='tags-view-wrapper' ref='scrollPane'>-->
      <!--<router-link ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''" v-for="tag in Array.from(visitedViews)"-->
                   <!--:to="tag.path" :key="tag.path" @contextmenu.prevent.native="openMenu(tag,$event)">-->
        <!--{{tag.title}}-->
        <!--<span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)'></span>-->
      <!--</router-link>-->
    <!--</scroll-pane>-->
    <!--<ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">-->
      <!--<li @click="closeSelectedTag(selectedTag)">关闭</li>-->
      <!--<li @click="closeOthersTags">关闭其它</li>-->
      <!--<li @click="closeAllTags">关闭所有</li>-->
    <!--</ul>-->
  <!--</div>-->
  <el-menu class="navbar" mode="horizontal" style="float: left;">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb class="breadcrumb-container" style=" margin-left: 20px;"></breadcrumb>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import ScrollPane from '@/components/ScrollPane'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import TagsView from './Navbar'

export default {
  components: {
    ScrollPane,
    Hamburger,
    Breadcrumb,
    TagsView,
  },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  watch: {
//    $route() {
//      this.addViewTags()
//      this.moveToCurrentTag()
//    },
//    visible(value) {
//      if (value) {
//        document.body.addEventListener('click', this.closeMenu)
//      } else {
//        document.body.removeEventListener('click', this.closeMenu)
//      }
//    },

  },
  mounted() {
    //this.addViewTags()
  },
  methods: {
    generateRoute() {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    isActive(route) {
      return route.path === this.$route.path || route.name === this.$route.name
    },
    addViewTags() {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      this.$store.dispatch('addVisitedViews', route)
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag.$el)
            break
          }
        }
      })
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.path)
          } else {
            this.$router.push('/')
          }
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag.path)
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags() {
      this.$store.dispatch('delAllViews')
      this.$router.push('/')
    },
    openMenu(tag, e) {
      this.visible = true
      this.selectedTag = tag
      this.left = e.clientX
      this.top = e.clientY
    },
    closeMenu() {
      this.visible = false
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },

  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .tags-view-container {
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    background-color: #304156;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1001;
    width: 0;
    color:white;

  .errLog-container {
    display: inline-block;
    vertical-align: top;
    color:white;
  }
  .right-menu {
    color:white;
    float: right;
    height: 100%;
  &:focus{
     outline: none;
   }
  .right-menu-item {
    display: inline-block;
    margin: 0 8px;
    color:white;
  }
  .screenfull {
    height: 20px;
    color:white;
  }
  .international{
    vertical-align: top;
    color:white;
  }
  .theme-switch {
    vertical-align: 15px;
    color:white;
  }
  .avatar-container {
    height: 50px;
    margin-right: 30px;
  .avatar-wrapper {
    cursor: pointer;
    margin-top: 5px;
    position: relative;
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    color:white;
  }
  .el-icon-caret-bottom {
    position: absolute;
    right: -20px;
    top: 25px;
    font-size: 12px;
    color:white;
  }
  }
  }
  }
  }
  .tags-view-wrapper {
    height: 60px;
    border-bottom: 1px solid #c0c4cc;
  .tags-view-item {
    display: inline-block;
    position: relative;
    height: 40px;
    line-height: 40px;
    border: 1px solid #495060;
    color: #fff;
    background: #495060;
    padding: 0 10px;
    font-size: 16px;
    margin-left: 5px;
    margin-top: 10px;
    vertical-align: super;
  &:first-of-type {
     margin-left: 15px;
   }
  &.active {
     background-color: #3599fe;
     color: #fff;
     border-color: #3599fe;

  }
  }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 2;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
  &:hover {
     background: #eee;
   }
  }
  }
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  //reset element css of el-icon-close
  .tags-view-wrapper {
  .tags-view-item {
  .el-icon-close {
    width: 16px;
    height: 16px;
    vertical-align: 2px;
    border-radius: 50%;
    text-align: center;
    transition: all .3s cubic-bezier(.645, .045, .355, 1);
    transform-origin: 100% 50%;
  &:before {
     transform: scale(.6);
     display: inline-block;
     vertical-align: -3px;
   }
  &:hover {
     background-color: #b4bccc;
     color: #fff;
   }
  }
  }
  }
</style>
