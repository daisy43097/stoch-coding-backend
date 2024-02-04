import * as mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  board: {
    type: [String],
    default: Array(9).fill(null),
  },
  currentPlayer: {
    type: String,
    default: 'X',
  },
  winner: {
    type: String,
    default: null,
  },
  isTie: {
    type: Boolean,
    default: false,
  }
});

export default mongoose.model('Game', gameSchema);