
 export default  {

  transferCascaderData: function _transferCascaderData(root,childrenProp,removeRoot) {
    if (Array.isArray(root[childrenProp])) {
      if (root[childrenProp].length == 0) {              
        root[childrenProp] = null;
      }
      else {
        for (var i = 0; i < root[childrenProp].length; i++) {
          //console.log(root[childrenProp][i]) 
          //console.log(JSON.stringify(_transferCascaderData));   
          _transferCascaderData(root[childrenProp][i],childrenProp,false) 
        }
      }
      
      if (removeRoot) return root[childrenProp];
      else return [root]
    }
  },

  generateTreePath: function (tree, childrenProp, idProp, id) {
    var result= []
    var _generateTreePath = function (root, childrenProp, idProp, id){
      if (root[idProp] == id) {
        result.push(root[idProp])
        return true
      }
      else {
        if (Array.isArray(root[childrenProp])) {
          for (var i = 0; i < root[childrenProp].length; i++) {
            if (_generateTreePath(root[childrenProp][i],childrenProp, idProp, id)) {
              result.unshift(root[idProp])              
              return true
            }
          }  
        }
      }//else
    }// _generateTreePath
   
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {         
        if (_generateTreePath(tree[i],childrenProp, idProp, id)) break;
      }
    }
    else {
        _generateTreePath(tree,childrenProp, idProp, id)    
    }
    return result
  },

  generateTreeLabelPath: function (tree, childrenProp, idProp,labelProp, id) {
    var result= []
    var _generateTreePath = function (root, childrenProp, idProp,labelProp, id){
      if (root[idProp] == id) {
        result.push(root[labelProp])
        return true
      }
      else {
        if (Array.isArray(root[childrenProp])) {
          for (var i = 0; i < root[childrenProp].length; i++) {
            if (_generateTreePath(root[childrenProp][i],childrenProp, idProp,labelProp, id)) {
              result.unshift(root[labelProp])              
              return true
            }
          }  
        }
      }//else
    }// _generateTreePath
   
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {         
        if (_generateTreePath(tree[i],childrenProp, idProp,labelProp, id)) break;
      }
    }
    else {
        _generateTreePath(tree,childrenProp, idProp,labelProp, id)    
    }
    return result
  }
  
}



