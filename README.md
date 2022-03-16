<a name="C0aOW"></a>

# ASMO BOOT WEB v1.0

![](https://camo.githubusercontent.com/93f9eeda340b7bf61684c1bcfecc40c4b59d79008e574713ca3a94b82aa1560e/68747470733a2f2f6769746875622d7265736f75726365732e6f73732d636e2d68616e677a686f752e616c6979756e63732e636f6d2f6c6f676f2e706e67#crop=0&crop=0&crop=1&crop=1&from=url&id=f8otp&margin=%5Bobject%20Object%5D&originHeight=108&originWidth=108&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="Io8Be"></a>

### ASMO BOOT WEB 端

>     在开发了一些实际工程项目后，发现一些常见的权限、对接、消息通知等等问题。
>     由于每次定制化项目都要进行一些开发，不利于项目长期维护。
>     参考若依、JEECGBOOT以及一些低代码开发框架的启发，我们设计了一套快速开发框架。
>     具备行级权限管理，安全登录防护以及轻量级的数据中台功能。
>     除此之外，还支持集成了Amis等低代码开发框架，更多内容请自行探索。

[![](https://camo.githubusercontent.com/d6deb5fc41d9ac3b6957f5fa6701dd35388ea6b42c40d2ee33074e39f19a2662/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4170616368652532304c6963656e7365253230322e302d626c75652e737667#crop=0&crop=0&crop=1&crop=1&from=url&id=b2zhe&margin=%5Bobject%20Object%5D&originHeight=20&originWidth=164&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)](https://github.com/RotaNova/rotanova-boot/blob/master/LICENSE) ![](https://img.shields.io/badge/vue-v2.6.14-green#crop=0&crop=0&crop=1&crop=1&id=N1107&originHeight=20&originWidth=84&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=) ![](https://img.shields.io/badge/version-v1.0.0-success#crop=0&crop=0&crop=1&crop=1&id=wfGdT&originHeight=20&originWidth=96&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=) ![](https://img.shields.io/badge/Author-%E5%85%B4%E8%88%AA%E7%A7%91%E6%8A%80-orange#crop=0&crop=0&crop=1&crop=1&id=Mxgec&originHeight=20&originWidth=102&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=) ![](https://img.shields.io/badge/Ant--design--vue-v1.7.3-blue#crop=0&crop=0&crop=1&crop=1&id=by2Nk&originHeight=20&originWidth=140&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="futpj"></a>

## 适用项目

>       本项目采用Vue.js进行开发、适用SAAS项目、企业信息管理系统（MIS）、内部办公系统（OA）、企业资源计划系统（ERP）、客户关系管理系统（CRM）等，现成的管理框架体系，可以显著提高开发效率，降低开发成本。

<a name="vBor6"></a>

## 配套项目

Web 前端（Vue)：[https://github.com/RotaNova/asmoboot-web](https://github.com/RotaNova/asmoboot-web)<br />Uni-app: [https://github.com/RotaNova/asmoboot-app](https://github.com/RotaNova/asmoboot-app)<br />项目支持联系（游先生）：QQ: 365278161<br />Email: [qilinyou@rotanovaiot.com](mailto:qilinyou@rotanovaiot.com)<br />官方文档: [前端手册](https://rotanova.yuque.com/oix9ug/qiqg9g/rht9ww)
<a name="vkkPH"></a>

## 系统需求

- node >= v14
- amis >= v1.2.4-beta.11
- vue >= v2.6.14
- yarn >= v1.12.5
- webpack >= v4.31.0
- Echarts>= v4.2.1
- eslint >=v5.16.0
  <a name="gTSSK"></a>

## 技术交流群（暂定）

交流群 QQ: [189577357](https://github-resources.oss-cn-hangzhou.aliyuncs.com/asmobootQQ.JPG)

<br/>
<a name="yN3Fk"></a>

# 环境部署

```txt
● node >= v14 (推荐)
● amis >= v1.2.4-beta.11 (推荐)
● vue >= v2.6.14
● yarn >= v1.12.5
● webpack >= v4.31.0
● Echart>= v4.2.1
● eslint >=v5.16.0
```

<a name="ALgP5"></a>

# 运行系统

1、前往 Github 下载页面([https://github.com/RotaNova/asmoboot-web.git](https://github.com/RotaNova/asmoboot-web.git)),选择 web 端下载解压到工作目录<br />2、导入到 vscode，菜单 File -> Import，然后打开控制台，输入 yarn 或者 npm，更推荐使用 yarn 来安装依 赖，等候安装成功，初次加载会比较慢（根据自身网络情况而定）,推荐使用国内镜像源来安装。<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/21403834/1647306892871-763b602b-855b-4b71-b447-eb45350d9306.png#clientId=u53ede5d7-5df1-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=46&id=u751020c1&margin=%5Bobject%20Object%5D&name=image.png&originHeight=46&originWidth=393&originalType=binary&ratio=1&rotation=0&showTitle=false&size=4078&status=done&style=none&taskId=ud5bc9493-28b1-4e8e-8109-253220d6d97&title=&width=393)

```txt
yarn config set registry https://registry.npm.taobao.org --global // 国内

npm config set registry https://registry.npm.taobao.org --global  // 国内
```

<br />3、进入目录,运行 yarn serve 即可打开项目，出现如下图表示启动成功<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/21403834/1647306942991-299dfee1-c37b-410a-b7e3-bc597b50ebac.png#clientId=u53ede5d7-5df1-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=169&id=u94ed84d4&margin=%5Bobject%20Object%5D&name=image.png&originHeight=169&originWidth=554&originalType=binary&ratio=1&rotation=0&showTitle=false&size=19607&status=done&style=none&taskId=ubcdc64d7-1979-42aa-849a-5a94d23ed82&title=&width=554)<br />4、系统初始化效果<br />![系统初始化效果.png](https://cdn.nlark.com/yuque/0/2022/png/21403834/1647309623749-0e2617d5-71d9-43a7-bcaa-c406ff7594c5.png#clientId=uec294eb5-f597-4&crop=0&crop=0&crop=1&crop=1&from=drop&id=u26d60a53&margin=%5Bobject%20Object%5D&name=%E7%B3%BB%E7%BB%9F%E5%88%9D%E5%A7%8B%E5%8C%96%E6%95%88%E6%9E%9C.png&originHeight=574&originWidth=1247&originalType=binary&ratio=1&rotation=0&showTitle=false&size=31999&status=done&style=none&taskId=u71c539ae-8cf0-4126-9689-5b736bf22fa&title=)<br />推荐使用 git clone 可以实时与我们的项目同步更新

```txt
git clone https://github.com/RotaNova/asmoboot-web.git
```

# 常见问题

1. 如果使用 mac 的 m1 芯片,则需切换至镜像 amd64/nginx
   更多自定义配置请参考[官方手册](https://rotanova.yuque.com/oix9ug/qiqg9g/rht9ww)进行配置
   如遇到无法解决的问题请到反馈[issue](https://github.com/RotaNova/asmoboot-web/issues)，工作人员将会不定时进行解答。
