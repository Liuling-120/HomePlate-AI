const sequelize = require('./src/config/database');
require('./src/models');

(async () => {
  try {
    // 强制重建所有表，只执行一次，不重复触发索引报错
    await sequelize.sync({ force: true });
    console.log('数据库表全部创建完成！');
    process.exit(0);
  } catch (err) {
    console.error('建表失败：', err);
    process.exit(1);
  }
})();
