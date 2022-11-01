// Just a quick way to log with timestamp in my local timezone no matter where its deployed
// https://jsdoc.app/index.html

import { DateTime } from 'luxon';

/** Logging with timestamp */
class logclass {
  get_time() {
    return DateTime.now().setZone('Asia/Colombo').toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
  }
  /**
   * Alternative to `console.log()`
   * @param {*} log_msg - The message to log
   */
  async log(log_msg) {
    console.log(`${this.get_time()} >> ${log_msg}`);
  }
  /**
   * Alternative to `console.error()`
   * @param {*} log_msg - The message to log
   */
  async error(log_msg) {
    console.error(`${this.get_time()} >> ${log_msg}`);
  }
}

export default logclass;
