<template>
    <view class="mpvue-picker">
        <page-head :title="title"></page-head>
        <view class="uni-padding-wrap uni-common-mt">
            <view class="uni-btn-v">
                <button type="default" @click="showMulLinkageThreePicker">三级城市联动</button>
            </view>
			<view class="">
				{{pickerText}}
			</view>
        </view>
        <mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
         @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
        <mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
         @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
    </view>
</template>

<script>
// https://github.com/zhetengbiji/mpvue-picker
    import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
    // https://github.com/zhetengbiji/mpvue-citypicker
    import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
    import cityData from '@/common/city.data.js';

    export default {
        components: {
            mpvuePicker,
            mpvueCityPicker
        },
        data() {
            return {
                title : "mpvue-picker 使用示例",
                mulLinkageTwoPicker: cityData,
                cityPickerValueDefault: [0, 0, 1],
                themeColor: '#007AFF',
                pickerText: '',
                mode: '',
                deepLength: 1,
                pickerValueDefault: [0],
                pickerValueArray:[],
				region: [],
            };
        },
        methods: {
            onCancel(e) {
                console.log(e)
            },
            // 三级联动选择
            showMulLinkageThreePicker() {
                this.$refs.mpvueCityPicker.show()
            },
            onConfirm(e) {
                this.pickerText = JSON.stringify(e)
            }
        },
        onBackPress() {
          if (this.$refs.mpvuePicker.showPicker) {
            this.$refs.mpvuePicker.pickerCancel();
            return true;
          }
          if (this.$refs.mpvueCityPicker.showPicker) {
            this.$refs.mpvueCityPicker.pickerCancel();
            return true;
          }
        }
		};
</script>