const dialog = {
  state:{
    ISDIALOG:false,//用户信息弹出层
    ISUSERPWDIALOG:false,//修改密码弹出层
  },
  mutations: {
    consoleRoles(state){
      console.log(state.ISDIALOG);
    },
  },
  actions: {
    nativeConsoleRoles(context){
      context.commit('consoleRoles');
    }
  }
}
export default dialog
