export function initData(dataList, arg) {
  if (arg.previous == null) {
    dataList = arg;
  } else {
    dataList.next = arg.next;
    dataList.previous = arg.previous;
    if (
      dataList.results[dataList.results.length - 1].date == arg.results[0].date
    ) {
      //jika header terakhir sama dengan header awal list baru
      dataList.results[dataList.results.length - 1].children = dataList.results[
        dataList.results.length - 1
      ].children.concat(arg.results[0].children);
      let i;
      //jika ada header lain
      if (arg.results.length > 1) {
        for (i = 1; i < arg.results.length; i++) {
          dataList.results = dataList.results.concat(arg.results[i]);
        }
      }
    } else {
      dataList.results = dataList.results.concat(arg.results);
    }
  }
  return dataList;
}
