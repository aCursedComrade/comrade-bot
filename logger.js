// Just a quick way to log with timestamp in my local timezone no matter where its deployed
// https://jsdoc.app/index.html

/** Logging with timestamp */
export default class logger_func {
  /**
   * A class for logging in terminal with timestamp. Edit '/logger.js' file as necessary.
   */
  constructor() {
    null;
  }
  get_time() {
    const options = {
        timeZone: 'Asia/Colombo',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      },
      formatter = new Intl.DateTimeFormat(['en-uk'], options);

    return formatter.format(new Date());
  }
  /**
   * Alternative to `console.log()`
   * @param {*} log_msg - The message to log
   */
  async log(log_msg) {
    console.log(`${this.get_time()} >> ${log_msg}`);
  }
  /**
   * Alternative to `console.warn()`
   * @param {*} log_msg - The message to log
   */
  async warn(log_msg) {
    console.warn(`${this.get_time()} >> ${log_msg}`);
  }
  /**
   * Alternative to `console.error()`
   * @param {*} log_msg - The message to log
   */
  async error(log_msg) {
    console.error(`${this.get_time()} >> ${log_msg}`);
  }
}