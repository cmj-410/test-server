module.exports = {
  exchange2MenuStructure(originalData){
    const temp = JSON.parse(JSON.stringify(originalData))
    const res = []
    originalData.forEach(item => {
      let node = temp.filter(x => x.permissionCode === item.permissionCode)[0]
      if (item.parent != ''){
        temp.forEach(x => {
          if(x.permissionCode == item.parent){
            if(x.children){
              x.children.push(node)
            } else{
              x.children = [ node ]
            }
          }
        })
      } else {
        res.push(node)
      }
    })
    return res
  }
}