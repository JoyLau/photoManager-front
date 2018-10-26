const role = {
    state:{
        roles:[],
    },
    mutations: {
        consoleRoles(state){
            console.log(state.roles);
        },
    },
    actions: {
        nativeConsoleRoles(context){
            context.commit('consoleRoles');
        }
    }
}
export default role