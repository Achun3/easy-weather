<template>
	<div>
	<view class="container">
		<view class="top">
			<view class="subtitle">—— 更新于{{time}} ——</view>
			<!-- 用户信息模块 -->
			<view class="user">
				<!-- 头像 -->
				<open-data class="open-data-userAvatarUrl" type="userAvatarUrl"></open-data> 
				<!-- 昵称 -->
				<open-data class="open-data-userNickName line1" type="userNickName" lang="zh_CN"></open-data>
			</view>
			<view class="location">
				您的当前位置
			</view>
			<view class="city">
				<image class="weizhi" src="/static/img/位置.png"></image>{{city}}
				<view class="pm">
					{{primarypollutant}} {{quality}}
				</view>
			</view>
			<!-- 当前温度 -->
			<view class="winter">
				{{nowwinter}} <text class="du">℃</text>
			</view>
			<view class="day">
				{{day}}
			</view>
			<view class="weather">
				<text class="weather2">
					{{weather}}
				</text>
			</view>
			<view class="tip">
				温馨提示：当前天气{{Now}}, {{tip}}
			</view>
		</view>
		<uni-card isFull="true" >
		<view class="today">
			<view class="">
				今天&#12288;&#12288;&#12288;{{listArray[0].day.temphigh}}/{{listArray[0].night.templow}}℃
				<br>
				{{listArray[0].day.weather}}
				
				<img :src="require('../../static/icon/天气图标/weathercn02/'+listArray[0].day.img+'.png')" class="img" style="float: right;"/>
			</view>
			<view class="">
				明天&#12288;&#12288;&#12288;{{listArray[1].day.temphigh}}/{{listArray[1].night.templow}}℃
				<br>
				{{listArray[1].day.weather}}&#12288;&#12288;&#12288;				
				<img :src="require('../../static/icon/天气图标/weathercn02/'+listArray[1].day.img+'.png')" class="img" style="float: right;"/>
			</view>
		</view>
		</uni-card>
		
		<view class="daily">
			<view v-for="(item,index) in listArray":key="item.id">
				<view class="">
					{{item.week}}<br>
					{{item.day.weather}}<br>
					<img :src="require('../../static/icon/天气图标/weathercn02/'+item.day.img+'.png')" class="img"/>
					</view>
				</view>
			</view>	
		</view>
	<view class="qiun-columns">
		<view class="qiun-charts" >
			<!--#ifdef MP-ALIPAY -->
			<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio" :style="{'width':cWidth+'px','height':cHeight+'px'}" @touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
			<!--#endif-->
			<!--#ifndef MP-ALIPAY -->
			<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts"></canvas>
			<!--#endif-->
		</view>
	</view>
	</view>
	</div>
</template>

<script>
	import uniCard from '@/components/uni-card/uni-card.vue'
	import uCharts from '@/js_sdk/u-charts/u-charts/u-charts.js';
	var _self;
	var canvaLineA=null;
	export default {
		components: {
			uniCard
		},
		
		data() {
			return {
				navHeight: 0, //滚动区域的所需高度
				city: 'loading...', //城市
				time: 'loading...', //正在加载中
				day:'loading...',
				week: 'loading...', //星期
				nowwinter: '0', //温度
				todaytemphigh:"0",
				img:"0",
				listArray: [], //列表数据
				
				weather: 'loading...', //天气
				Now: '', //当前
				tip: '', //提示
				primarypollutant: '', //PM
				quality: '' ,//污染等级
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				textarea:'',
				chartData: {
					categories: ['', '', '', '', '', ''],
					series: [{
						name: '最高气温',
						data: [35, 27, 36, 34, 34, 34,36],
						color: '#ffad35',
						format: function (val, name) {
									return val + '°';
								}
						
					}, {
						name: '最低气温',
						data: [24, 25, 25, 25, 25, 26,28],
						color:"#4fc3f7",
						format: function (val, name) {
									return val + '°';
								}
					}]
				}
			}
		},
		onLoad() {
			var time =require('../../components/calendar.js').calendar.solar2lunar();
			this.day=time.cMonth+'月'+time.cDay+' '+time.ncWeek+' 农历'+time.IMonthCn+time.IDayCn
			// 动态获取列表高度
			this.calcScrollHeight()
			var self = this;
			// 获取用户位置经纬度
			uni.getLocation({
				type: 'wgs84',
				success: function(res) {
					const longitude = res.longitude;
					const latitude = res.latitude;
					// 请求数据接口获取经纬度,然后转换为城市
					uni.request({
						url: 'https://api.jisuapi.com/weather/query?appkey=70c18afb45867f37&location=' + latitude + ',' + longitude +
							'',
						header: {
							'content-type': 'application/json'
						},
						success: function(res) {
							self.city = res.data.result.city
							self.time = res.data.result.updatetime
							self.winter = res.data.result.temphigh
							self.listArray = res.data.result.daily
							// 当前实况
							self.nowwinter = res.data.result.hourly[0].temp
							self.weather = res.data.result.hourly[0].weather
							self.Now = res.data.result.index[6].ivalue
							self.tip = res.data.result.index[6].detail
							self.primarypollutant = res.data.result.aqi.primarypollutant
							self.quality = res.data.result.aqi.quality
							for(var i=0;i<7;i++)
							{
								self.chartData.series[0].data[i]=res.data.result.daily[i].day.temphigh
							}
							for(var i=0;i<7;i++)
							{
								self.chartData.series[1].data[i]=res.data.result.daily[i].night.templow
							}
						  
						}
					})
				}
			}),
			_self = this;
			//#ifdef MP-ALIPAY
			uni.getSystemInfo({
				success: function (res) {
					if(res.pixelRatio>1){
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio =2;
					}
				}
			});
			//#endif
			this.cWidth=uni.upx2px(650);
			this.cHeight=uni.upx2px(240);
			let LineA=_self.chartData;
			_self.showLineA("canvasLineA",LineA);
		},
		methods: {
			// 计算滚动区域高度
			calcScrollHeight() {
				let that = this;
				uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
					success(res) { //成功回调函数
						that._data.pH = res.windowHeight //windoHeight为窗口高度，主要使用的是这个
						let titleH = uni.createSelectorQuery().select("#list"); //想要获取高度的元素名（class/id）
						titleH.boundingClientRect(data => {
							console.log(data)
							let pH = that._data.pH;
							that._data.navHeight = pH - data.top //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
						}).exec()
					}
				})
			},
			//折线图部分
			showLineA(canvasId,chartData){
							canvaLineA=new uCharts({
								$this:_self,
								canvasId: canvasId,
								type: 'line',
			colors:['#ffad35', '#4fc3f7'],
								fontSize:11,
								padding:[15,15,0,15],
								legend:{
									show:true,
									padding:5,
									lineHeight:11,
									margin:0,
								},
								dataLabel:true,
								dataPointShape:true,
								background:'#FFFFFF',
								pixelRatio:_self.pixelRatio,
								categories: chartData.categories,
								series: chartData.series,
								animation: true,
								xAxis: {
									disableGrid: true,
									disabled: true,
								    axisLine: false
								},
								yAxis: {
									gridType:'dash',
									gridColor:'#CCCCCC',
									dashLength:8,
									disabled: true,
									disableGrid: true,
								},
								width: _self.cWidth*_self.pixelRatio,
								height: _self.cHeight*_self.pixelRatio,
								extra: {
									line:{
										type: 'straight'
									}
								}
							});
							
						},

		}
	}
</script>

<style>
@import url("./index.css");
</style>
