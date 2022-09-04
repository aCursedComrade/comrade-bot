// Just a quick way to log with timestamp in my local timezone no matter where its deployed
export default class logger_func {
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
  async log(log_msg) {
    console.log(`${this.get_time()} >> ${log_msg}`);
  }
  async warn(log_msg) {
    console.warn(`${this.get_time()} >> ${log_msg}`);
  }
  async error(log_msg) {
    console.error(`${this.get_time()} >> ${log_msg}`);
  }
}