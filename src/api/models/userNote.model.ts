export {};
const mongoose = require('mongoose');
import { transformData, listData } from '../../api/utils/ModelUtils';

const userNoteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, default: '' },
    note: String
  },
  { timestamps: true }
);
const ALLOWED_FIELDS = ['id', 'user', 'title', 'note', 'createdAt'];

userNoteSchema.method({
  transform({ query = {} }: { query?: any } = {}) {
    return transformData(this, query, ALLOWED_FIELDS);
  }
});

userNoteSchema.statics = {
  list({ query }: { query: any }) {
    return listData(this, query, ALLOWED_FIELDS);
  }
};

const Model = mongoose.model('UserNote', userNoteSchema);
Model.ALLOWED_FIELDS = ALLOWED_FIELDS;

module.exports = Model;
