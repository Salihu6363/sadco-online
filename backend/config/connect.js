const sequelize = require('./database');

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected successfully!');
    
    // Sync models WITHOUT alter to avoid index issues
    await sequelize.sync({ force: false });
    console.log('✅ Database synced successfully!');
    
    return sequelize;
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
