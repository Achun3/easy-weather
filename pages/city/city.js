Page({
  data: {
    // 省市区三级联动初始化
    region: ["四川省", "绵阳市", "涪城区"],
  // 选择省市区函数
  changeRegin(e){
    this.setData({ region: e.detail.value });
  },
})
