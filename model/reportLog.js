const db = require("../lib/db");

class ReportLog extends db {
  constructor() {
    super();
    this.model = this.sequelize.define(
      "report_log",
      {
        ID: {
          type: this.Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        REPORT_NAME: {
          type: this.Sequelize.STRING,
          allowNull: false,
        },
        REPORT_MESSAGE: {
          type: this.Sequelize.STRING("Max"),
          allowNull: false,
        },
        // report_type: {
        //     type: this.Sequelize.STRING,
        //     allowNull: false
        // },
        // action: {
        //     type: this.Sequelize.STRING,
        //     allowNull: false
        // },
        CREATE_TIME: {
          type: this.Sequelize.DATE,
          allowNull: false,
          defaultValue: this.Sequelize.fn("GETDATE"),
        },
      },
      {
        freezeTableName: true,
        timestamps: false,
        createdAt: "CREATE_TIME",
      }
    );
    this.model.sync();
  }

  // 新增資料範例
  insertLog(logData) {
    return this.model.create(logData)
      .then(() => {
        console.log("[insert report_log]", "success");
      })
      .catch((error) => {
        console.error("[insert report_log fail]", error);
      });
  }
}

module.exports = ReportLog;