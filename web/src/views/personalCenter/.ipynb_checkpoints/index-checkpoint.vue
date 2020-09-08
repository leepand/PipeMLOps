<template>
<div class="">
  <iframe id="iframeContain"
        ref= "iframeContain"
        name="iframeContain"
          src="http://127.0.0.1:8001" frameborder="0" seamless scrolling="auto"></iframe>

</div>


</template>

<script>
  export default {
    name: "PersonalCenter",
    data() {
      return {
        tabPosition: "left",
      };
    },
    created() {},
    methods: {},
  };
</script>



<style scoped>
  .personalCenter{
    font-size: 14px;
    text-align: left;
    padding: 0px 100px;
  }
    
     #iframeContain{
      width: 100%;
      height: 800px;
    }
</style>