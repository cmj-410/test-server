module.exports = {
  // 整合角色列表的权限
  mergeRolesPermissions(rolePermissionList){
    const res = {menus: [], points: []}
    rolePermissionList.forEach(item => {
      item.permission.menus.forEach(x => {
        if (!res.menus.includes(x)){
          res.menus.push(x)
        }
      })
      item.permission.points.forEach(x => {
        if (!res.points.includes(x)){
          res.points.push(x)
        }
      })
    })
    return res
  }
}