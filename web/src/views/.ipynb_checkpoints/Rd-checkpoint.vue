<template>
<div class="block">
  <el-timeline>
    <el-timeline-item timestamp="2020/8/15" placement="top">
      <el-card>
        <h4>新增模型开发日志</h4>
        <p>更新内容：记录每个服务下涉及模型的训练过程及效果对比</p>
        <p>李攀登 提交于 2020/8/15 10:06</p>
      </el-card>
    </el-timeline-item>

    <el-timeline-item timestamp="2020/8/6" placement="top">
      <el-card>
        <h4>新增请求信息插件</h4>
        <p>更新内容：记录每次请求详情，并对请求信息进行统计和性能跟踪</p>
        <p>李攀登 提交于 2020/8/6 14:06</p>
      </el-card>
    </el-timeline-item>

    <el-timeline-item timestamp="2020/7/19" placement="top">
      <el-card>
        <h4>发布3.0.0版本，基于VUE框架重构，前后端分离</h4>
        <p>更新内容：简化操作流程，新增团队管理功能，优化前后端性能</p>
        <p>李攀登 提交于 2020/7/19 20:46</p>
      </el-card>
    </el-timeline-item>
    <el-timeline-item timestamp="2019/11/13" placement="top">
      <el-card>
        <h4>发布2.0.0版本,更名AlgoLink，前端基于Html/js</h4>
        <p>更新内容：新增项目管理、A/B Testing</p>
        <p>李攀登 提交于 2019/11/13 16:17</p>
      </el-card>
    </el-timeline-item>
    <el-timeline-item timestamp="2018/12/1" placement="top">
      <el-card>
        <h4>发布1.0.0，命名<strong>Arthur.io</strong></h4>
        <p>更新内容：基于配置的模型自动部署，包含个人模型中心和模型市场</p>
        <p>李攀登 提交于 2018/12/1 13:09</p>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</div>
</template>
<script>
export default {
  name: 'AboutUs'
}
</script>
<style>
  .aboutus .grid-content.line{
    border-right: 1px solid #ddd;
    height: 150px;
  }
  .aboutus .el-card__header{
    background: #545c64;
  }
  .aboutus .el-card__body{
    padding: 50px 20px;
  }
  .aboutus .el-timeline-item__wrapper{
    top: -8px;
  }
  .aboutus .title p .el-tag{
    margin: 0px 5px;
    cursor: pointer;
  }
</style>
<style scoped>
  .aboutus{
    font-size: 14px;
    text-align: left;
    padding: 0px 100px;
  }
  .intro{
    width: 200px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .text {
    font-size: 14px;
    text-align: left;
    line-height: 30px;
    text-indent: 2em;
  }
  .box-card{
    position: relative;
  }
  .item {
    display: inline-block;
    margin: 30px 50px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .clearfix span{
    color: #fff;
    font-weight: bold;
  }
  .title p{
    color: #8c8888;
    font-size: 15px;
    margin-bottom: 80px;
    text-align: center;
  }
  .grid-content .large{
    font-size: 16px;
    color: #409EFF;
    font-weight: bold;
  }
  .topMask{
    width: 100px;
    height: 100px;
    background-color: rgba(68,138,255,0.2);
    transform: rotate(45deg);
    position: absolute;
  }
  .square{
    border-radius: 5px;
    top: 0px;
  }
  .circular{
    border-radius: 50%;
    top:80px;
    left: 80%;
    background-color: rgba(255, 208, 75,0.2);
  }
</style>