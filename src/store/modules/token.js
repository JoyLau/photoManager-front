const token = {
    state:{
        TOKEN:'',
    },
    mutations: {
        consoleRoles(state){
            console.log(state.TOKEN);
        },
    },
    actions: {
        nativeConsoleRoles(context){
            context.commit('consoleRoles');
        }
    }
}
export default token