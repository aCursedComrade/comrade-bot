// Just a quick way to log with timestamp (UTC)
export default class logger_func {
  constructor() {
    null;
  }
  get_time() {
    const d = new Date();
    return d.toUTCString();
  }
  async log(log_msg) {
    console.log(`${this.get_time()} >> ${log_msg}`);
  }
  async warn(log_msg) {
    console.log(`${this.get_time()} >> ${log_msg}`);
  }
  async error(log_msg) {
    console.log(`${this.get_time()} >> ${log_msg}`);
  }
}