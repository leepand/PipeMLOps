# PipeMLOps-dblab

`PipeMLOps-dblab`是一个用Python编写的基于Vue的SQLite数据库实验UI
项目依赖:

* [flask](http://flask.pocoo.org)
* [peewee](http://docs.peewee-orm.com)
* [pygments](http://pygments.org)
* Vue

### 特性

* 与您现有的SQLite数据库一起工作，或者可以用来创建新的数据库。
* 添加或删除:
  * 表
  * 列 (是的，您可以删除和重命名列!)
  * 索引
* 导出 JSON/CSV 格式的数据。
* 加载 JSON/CSV 格式的数据文件.
* 对表数据进行查询等操作.

### 截图

索引页面显示了数据库的一些基本信息，包括表和索引的数量，以及它在磁盘上的大小:

`表结构`选项卡显示有关表的结构信息，包括列、索引和外键（如果有的话）。在这个页面上，你还可以创建、重命名或删除列和索引。

`列及添加列`选项可以对表的列进行操作
![](./imgs/col.jpg)

`索引及添加索引`选项可以对索引进行操作
![](./imgs/index.jpg)
![](./imgs/add_index.jpg)

`表内容`选项显示表的建表结构，该信息会随着列操作实时更新，同时该选项可以加载本地文件到数据库（支持json/csv格式）:

![](./imgs/content.jpg)

`查询`可以对当前表进行查询、下载数据等操作:

![](./imgs/query.png)