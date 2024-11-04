const ReportLog = require("../model/reportLog");
const { SERVICEBUS_CHANNEL } = process.env;

module.exports = {
  exchange: SERVICEBUS_CHANNEL,
  topic: 'reportLog',
  handler: msg => {
    msg = JSON.parse(msg);
    return ReportLog.createData(msg.REPORT_NAME, msg.REPORT_MESSAGE)
      .catch(err => {
        return Promise.reject();
      });
  }
}