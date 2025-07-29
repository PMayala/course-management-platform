const { DataTypes, Model } = require("sequelize")
const bcrypt = require("bcryptjs")

class Manager extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [2, 50],
          },
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [2, 50],
          },
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: [6, 100],
          },
        },
        role: {
          type: DataTypes.ENUM("manager"),
          defaultValue: "manager",
        },
      },
      {
        sequelize,
        modelName: "Manager",
        tableName: "managers",
        hooks: {
          beforeCreate: async (manager) => {
            if (manager.password) {
              manager.password = await bcrypt.hash(manager.password, 12)
            }
          },
          beforeUpdate: async (manager) => {
            if (manager.changed("password")) {
              manager.password = await bcrypt.hash(manager.password, 12)
            }
          },
        },
      },
    )
  }

  static associate(models) {
    this.hasMany(models.CourseOffering, { foreignKey: "createdBy" })
  }

  async validatePassword(password) {
    return bcrypt.compare(password, this.password)
  }

  toJSON() {
    const values = { ...this.get() }
    delete values.password
    return values
  }
}

module.exports = Manager
