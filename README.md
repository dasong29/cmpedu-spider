# cmpedu-spider
爬取 机械工业出版社 的视频

## 食用方法
  执行项目
  * npm install --save-dev
  * npm start
  
  项目在目录 ./aria2/ 生成两类文件
  * accessLog.txt，是爬取记录
  * aria2-cmpedu-*.txt，用于 aria2 的 input file
  
  使用 aria2 来下载视频文件
  ```
  aria2 -i aria2-cmpedu-*.txt
  ```
