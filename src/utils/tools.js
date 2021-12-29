export function arrDistinct(obj) {
  var uniques = []
  var stringify = {}
  for (var i = 0; i < obj.length; i++) {
    var keys = Object.keys(obj[i])
    keys.sort(function(a, b) {
      return (Number(a) - Number(b))
    })
    var str = ''
    for (var j = 0; j < keys.length; j++) {
      str += JSON.stringify(keys[j])
      str += JSON.stringify(obj[i][keys[j]])
    }
    if (!stringify.hasOwnProperty(str)) {
      uniques.push(obj[i])
      stringify[str] = true
    }
  }
  return uniques
}

export function devide(arr) {
  var obj = {}
  var dest = []
  for (var i = 0; i < arr.length; i++) {
    var a = arr[i]
    // 当访问的对象属性是变量时用方括号来访问属性
    if (!obj[a.id]) {
      dest.push({
        ...a,
        data: [a]
      })
      // 把每个对象的id属性 赋给obj 这样每次循环就能判别会不会出现新的id
      obj[a.id] = a.id
    } else {
      for (var j = 0; j < dest.length; j++) {
        var b = dest[j]
        if (a.id == b.id) {
          dest[j].data.push(a)
          // 找到同样id的之后 后面的就不用循环了 所以跳出循环
          break
        }
      }
    }
  }
  return dest
}
