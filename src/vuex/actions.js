export const addMenu = ({ commit }, menuItems) => {  
  if (menuItems.length > 0) {  
    commit("addMenu", menuItems)  
  }  
}  
