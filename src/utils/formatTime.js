/**
 * Created by xiaolei on 18/07/14.
 */

//格式化毫秒值，得到1996年06月27日
export function getYearMonDayByH(str) {
  let unixTimestamp = new Date(str);
  return unixTimestamp.getFullYear() + "年" + (unixTimestamp.getMonth() + 1) + "月" + unixTimestamp.getDate() + "日";
}

export function getYearMonDayByH2(str) {
  let unixTimestamp = new Date(str);
  return unixTimestamp.getFullYear() + "/" + (unixTimestamp.getMonth() + 1) + "/" + unixTimestamp.getDate();
}


export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
