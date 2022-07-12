module.exports = {
  exchange2MenuStructure(originalData){
    const temp = JSON.parse(JSON.stringify(originalData))
    const res = []
    originalData.forEach(item => {
        if (item.parent){
          const node = temp.filter(x => x.permissionCode === item.permissionCode)
          temp.every(x => {
            if(x.permissionCode === item.parent){
              if(x.children){
                x.children.push(node)
                console.log('2')
              } else{
                x.children = [ node ]
              }
              return false
            }
            console.log('1')
            return true
          })
        } else {
          res.push(temp.filter(x => x.permissionCode === item.permissionCode))
        }
    })
    return res
  }
}