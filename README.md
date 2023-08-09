># <font size=4> 一、如何运行

>## <font size=3> 1.配置yarn或者npm就不说了 <br> 2.需要使用yarn add postcss-pxtorem amfe-flexible(使用npm即为 npm install postcss-pxtorem amfe-flexible ) 添加移动端适应性配置(在postcss.config.js中我规定设计稿宽度为1000，即在页面设计中手机页面的最大宽度就为1000px,在设计宽度时要根据此前提进行比例调节) <br> 3.需要使用yarn add vant@latest-v2(使用npm即为 npm install vant@latest-v2 )安装Vant 2组件，其官方文档为https://youzan.github.io/vant/v2/#/zh-CN/，开发时可查看。(Vant 2组件是我比较多个后觉得最全面且好看的组件，若要使用其他组件自行导入) <br> 4.将vue.config.js中的post换成自己电脑的ip地址(在cmd使用ipconfig命令可查看)，然后使用手机开启热点给电脑连接，此时在电脑运行vue项目手机也可以查看，也可以在网页右键检查查看移动端页面 <br> 5.至于store、service那些东西就按之前那个项目自行添加就行

> # debug
> 1.遇到了CRLF的问题，晖哥的方法是在终端输入 "eslint --ext .js,.vue --fix"，
> 我（龚敬）的方法是在.eslintrc.js中添加"linebreak-style": ["error", "windows"],"
> 2.遇到了手机开热点但不能连接到的问题，我（龚敬）的方法是在vue.config.js中的host用
> 无线局域网适配器的IPv4地址替换（在终端输入"ipconfig"可查到）
