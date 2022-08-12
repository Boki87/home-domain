import TimeAgo from "javascript-time-ago"

// English.
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en)

function returnTimeAgo(timestamp: number) {
  return new TimeAgo('en-US').format(timestamp)
}


function formatNumberToCurrency(number: number, code='EUR') {
    const money = Intl.NumberFormat("en-US", {style: 'currency', currency: code})
    return money.format(number)
}


export {
    returnTimeAgo,
    formatNumberToCurrency
}