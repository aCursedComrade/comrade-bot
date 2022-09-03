// Just a quick way to log with timestamp (UTC)
export default class logger_func {
  constructor() {
    const d = new Date();
    this.time = d.toUTCString();
  }
  async log(log_msg) {
    console.log(`${this.time} >> ${log_msg}`);
  }
  async warn(log_msg) {
    console.log(`${this.time} >> ${log_msg}`);
  }
  async error(log_msg) {
    console.log(`${this.time} >> ${log_msg}`);
  }
}