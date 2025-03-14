const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    sessionID: String,
    name: String,
    color: String,
    avatar: { type: String, default: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/toon_1.png' },
    ready: { type: Boolean, default: false },
    nowMoving: { type: Boolean, default: false },
});

PlayerSchema.methods.changeReadyStatus = function () {
    this.ready = !this.ready;
};

PlayerSchema.methods.canMove = function (room, rolledNumber) {
    const playerPawns = room.getPlayerPawns(this.color);
    for (const pawn of playerPawns) {
        if (pawn.canMove(rolledNumber)) return true;
    }
    return false;
};

module.exports = PlayerSchema;
