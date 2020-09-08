<template>

  <div v-loading="loadworkspace"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">

     <iframe
        id="iframeContain"
        ref= "iframeContain"
        name="iframeContain"
        seamless
        scrolling="no"
        target="_self"
        :src="iframeURL"
      >
        您当前的浏览器不支持页面上的功能，请升级您当前的浏览器版本或使用谷歌浏览器访问当前页面
     </iframe>

    
    </div>
</template>

<script>
    import { getJupyterURL } from '../api/api'
    import $ from 'jquery'
export default {
    data() {
        return {
            iframeURL:'',//http://127.0.0.1:8954/tree/?
            loadworkspace:false
        }
    },
    methods: {
        getJupyterURL_func() {
            //this.listLoading = true;
            this.loadworkspace=true;
            let self = this;
            let iframeBox = document.querySelector('#iframeBox');
            let iframe = document.createElement('iframe');
            //$("#iframeFather").show();
            let params = {
                project_id: Number(this.$route.params.project_id),
                user_key:JSON.parse(sessionStorage.getItem('name'))
            };
            let headers = {
                "Content-Type": "application/json",
                Authorization: 'Token '+JSON.parse(sessionStorage.getItem('token'))
            };
                getJupyterURL(headers, params).then(_data => {
                    let {msg, code, data} = _data;
                    //self.listLoading = false;
                    this.loadworkspace=false;
                    console.log(data)
                    if (code === '999999') {
                        self.iframeURL = data.url;
                        //console.log(self.iframeURL,"self.iframeURL")
                    }
                    else {
                        self.$message.error({
                            message: msg,
                            center: true,
                        })
                    }
                }).catch(e => this.loadworkspace = false)
            },//end of get url
        },
    mounted() {
        this.getJupyterURL_func();
    }
}

</script>

<style lang='scss' scoped>
    
    /** iframe样式 */
    #iframeContain{
      width: 100%;
      height: 800px;
    }
    </style>