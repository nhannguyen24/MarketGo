const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('y50ho8pakfawp4pm', 'k2hrjriprpd8071c', 'qed072tcc6p2exzj', {
  host: 'rwo5jst0d7dgy0ri.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  dialect: 'mysql',
  logging: false,
  timezone: '+07:00',
});

const connectionDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

connectionDatabase();
