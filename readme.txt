运行说明

调整client.html和servers.html页面的<script>里面js文件，client2.js/client4.js，verify2.js/verify4.js，选择是Merkle tree的二叉树还是四叉树模式。

启动：
1、打开终端，输入以下命令，启动区块链服务：
testrpc
2、进入项目目录输入以下命令，运行项目：
npm run dev
3、浏览器打开：
http://localhost:8080/
4、若修改了智能合约，则退出项目运行，在项目目录执行以下命令重新发布合约，在执行第二步的命令，运行项目
truffle migrate --reset

验证某个数据片：
1、进入client页面，在Challenge部分，先输入要验证第几个数据片，然后依次点击三个按钮，将信息传到Servers
2、进入servers页面，直接点此verify按钮，即可获得验证结果

验证ipfs生成的两个树根，判断树根是否相等：
1、将servers.html页面的<script>js文件选择为verifyroot.js
3、将verifyroot.js页面的变量root1的值，修改为用户存在区块链上的root1的ipfs的地址
2、进入servers页面，在输入框内输入新生成的树根root2的ipfs的地址,点击verify按钮，即可获得验证结果


根据数据片和辅助信息生成新的树根：
1、进入cloud页面，第一个输入框输入数据片内容（比如第一个数据片的内容012），第二个输入框输入辅助信息（辅助的叶子节点的哈希值）
2、点击compute按钮得到新的树根
说明：这部分的验证只对数据片位置为0是正确结果，因为为了简化，这里拼接数据片和辅助信息是按照数据片位置为0的时候写的。在servers页面验证的时候，是考虑所有数据片的位置，因此在client页面输入要验证的数据片的位置，再去servers页面验证的时候，可以验证任意位置的数据片，结果都是对的。
