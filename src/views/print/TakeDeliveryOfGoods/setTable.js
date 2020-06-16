export function setTable(tableData, column) {
  const spanArr = []
  let concat = 0
  tableData.forEach((item, index) => {
    if (index === 0) {
      spanArr.push(1)
    } else {
      if (item[column] === tableData[index - 1][column]) { // 第一列需合并相同内容的判断条件
        spanArr[concat] += 1
        spanArr.push(0)
      } else {
        spanArr.push(1)
        concat = index
      }
    }
  })
  return spanArr
}
