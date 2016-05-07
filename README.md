# CC98.u
基于ionic的CC98客户端

# 开发中

## 简介
- 基于ionic的CC98客户端（访问CC98需要浙大内网）
- 大体采用Material Design，可以右滑打开菜单，下拉刷新，拉到底部加载更多（每次加载10条）
- 测试中，下载地址： [release](https://github.com/Yutyrannus/CC98.u/releases) （目前提供安卓和UWP版，wp8版不再提供）
- UWP版安装方法：
 1. 解压zip包
 2. 对于win10：在设置中打开开发人员模式，右键后缀为ps1的文件，使用powershell运行，出现提示都选yes
 3. 对于wp10： 在设置中打开开发人员模式，直接打开后缀为appx的文件安装

## 界面展示
![1](http://139.129.28.8/imgres/ss1.jpg)
![2](http://139.129.28.8/imgres/ss2.jpg)
![3](http://139.129.28.8/imgres/ss3.jpg)

## 开发
1.clone该git或下载zip包

2.安装node.js

3.安装ionic和cordova：

```bash
npm install -g ionic cordova
```

4.网页测试：（无法登录）

```bash
ionic serve
```

5.安装对应平台的SDK

6.生成对应平台的文件：（platform为平台名称，可以用ionic platform list命令查看支持的平台）

```bash
ionic platform add [platform]
```

7.运行（模拟器或真机）
```bash
ionic run [platform]
```

## TO DO LIST:
- 在浏览帖子界面的跳页，引用，站短等
- filter: 新窗口中打开图片，链接等
- 实现长期登录
- 头像显示
- 界面，动画，提示等进一步修改