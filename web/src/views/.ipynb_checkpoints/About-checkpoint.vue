<template>
  <div class="aboutus">
    <div class="title">
      <p><el-tag>企业级数据科学平台</el-tag><el-tag>2.0-beta</el-tag></p>
    </div>
    <el-card class="box-card" style="margin-bottom: 20px;">
      <div class="text item">
        <el-row :gutter="110">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              AlgoLink意在帮助更多的企业能够将实验中的优秀模型<span class="large">与生产耦合快速产生价值</span>，并实时监测线上效果。
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
                AlgoLink是一款高性能机器学习模型服务框架。它可以轻松为训练好的ML模型构建生产API端点，并支持所有主流的机器学习框架，包括Tensorflow、Keras、PyTorch、XGBoost、scikit-learn、fastai等，<span class="large">最新版本支持模型的不停机更新。</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
                我们希望减少数据科学、工程和运营团队之间的沟通与摩擦。于是着手研发一个解决方案来部署我们自己的模型。上一个版本主要实现模型建成后的系列解决方案：包括模型部署、线上实验管理等，本次重构内容意在丰富机器学习的生态，<span class="large">不局限于最后一公里。</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class='topMask square'></div><div class='topMask circular'></div>
    </el-card>
  </div>


</template>
<script>
export default {
  name: 'AboutUs',
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