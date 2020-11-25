var today = new Date();
var y = today.getFullYear();
var m = today.getMonth() + 1;
var d = today.getDate();
var h = today.getHours();
var mi = today.getMinutes();
var s = today.getSeconds();
module.exports = {
  getFilenameDate: () => {
    return y + "_" + m + "_" + d + "_" + h + "-" + mi + "-" + s;
  },
  getDate: () => {
    return y + "-" + m + "-" + d + " at " + h + ":" + mi + ":" + s;
  },
  removeTags: (text) => text.replace(/<\/?[^>]+(>|$)/g, "")
}