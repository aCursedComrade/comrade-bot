import { Schema, model } from 'mongoose';

const RSSObjSchema = new Schema({
    guild_id: { type: String, required: true },
    channel_id: { type: String, required: true },
    rss_source: { type: String, required: true },
    last_update: { type: Date, required: true },
    webhookId: { type: String, required: false },
    webhookToken: { type: String, required: false },
});

const RSSObj = model('RSSObj', RSSObjSchema);
export default RSSObj;
