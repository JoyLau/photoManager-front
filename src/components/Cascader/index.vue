<template>
  <div>
    <el-input v-model="current_option_disp" :readonly="true" v-if="readonly"></el-input>
    <el-cascader v-else :change-on-select="changeOnSelect" clearable expand-trigger="hover" :readonly="readonly" :show-all-levels="showAllLevels"
                 :options="optionSource" :value="current_option" :filterable="filterable" :placeholder="placeholder"
                 :props="props" @change="value => option_changed(value) ">
    </el-cascader>
  </div>
</template>
<script>
  import treeDataUtils from '@/utils/treeDataUtils'

  export default {
    props:{
      value: { default:null},
      optionSource:{  default:()=>[] },
      modelObj:{  default:()=>{a:null} },
      modelProp:{  default: 'a' },
      props:{  default:null },
      change:{  default:null },
      placeholder:{ default:'请选择' },
      changeOnSelect:{default:true},
      filterable:{default:false},
      readonly:{default:false},
      showAllLevels:{default:true}
    },
    data() {
      return {
        current_option:[{}],
        current_option_disp:''
      }
    },//data
    computed: {
      modelValue:{
        get:function() { return this.modelObj[this.modelProp] },
        set:function(v) {this.modelObj[this.modelProp] = v}
      }
    },
    methods: {
      init_Value(){
        var a = []
        if (this.value != null) {
          //console.log('***************************************')
          this.current_option = treeDataUtils.generateTreePath(this.optionSource,this.props.children,this.props.value,this.value)
          a = treeDataUtils.generateTreeLabelPath(this.optionSource,this.props.children,this.props.value,this.props.label,this.value)
          console.log(a)
        }
        else if (this.modelObj &&(this.modelObj[this.modelProp] != null)) {
          this.current_option = treeDataUtils.generateTreePath(this.optionSource,this.props.children,this.props.value,this.modelObj[this.modelProp])
          a = treeDataUtils.generateTreeLabelPath(this.optionSource,this.props.children,this.props.value,this.props.label,this.modelObj[this.modelProp])
        }
        if (a.length > 0) {
          if (!this.showAllLevels){
            this.current_option_disp = a[a.length-1]
          }else{
            this.current_option_disp = a.reduce(function(previousValue, currentValue, index, array){
              return previousValue + '/' + currentValue;
            });
          }
        }

      },
      option_changed(value){
        if (this.modelObj &&(this.modelObj[this.modelProp] != null)) {
          this.modelObj[this.modelProp] = value[value.length-1];
        }
        else {
          this.$emit('input',value[value.length-1]);
        }
        if (typeof(this.change) == 'function') {
          if (value.length > 0) this.change(value[value.length-1])
          this.change(null)
        }
        //this.$emit('changed',value[value.length-1]);

      }
    },// methods
    watch: {
      'optionSource': function(val, oldVal) {
        this.init_Value()
      },
      'modelObj': function(val, oldVal) {
        this.init_Value()
      },
      'value':function(val, oldVal) {
        this.init_Value()
        //this.dispatch('ElFormItem', 'el.form.change', [value]);
      },
    },
    mounted(){
      //console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxx')
      this.init_Value()
    }
  }
</script>
<style lang="scss" scoped>
  .el-cascader {
    display: block;
  }
</style>
