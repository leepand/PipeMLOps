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

![](./imgs/col.jpg)

The `content` tab displays all the table data. Links in the table header can be used to sort the data:

![](http://media.charlesleifer.com/blog/photos/s1415479502.61.png)

The `query` tab allows you to execute arbitrary SQL queries on a table. The query results are displayed in a table and can be exported to either JSON or CSV:

![](http://media.charlesleifer.com/blog/photos/s1415487149.3.png)

The `import` tab supports importing CSV and JSON files into a table. There is an option to automatically create columns for any unrecognized keys in the import file:

![](http://media.charlesleifer.com/blog/photos/s1415479625.44.png)