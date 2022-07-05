"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../api/models");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const USER_1 = {
    email: 'user1@example.com',
    role: 'user',
    password: 'user111'
};
const ADMIN_USER_1 = {
    email: 'admin1@example.com',
    role: 'admin',
    password: '1admin1'
};
const ADMIN_USER_2 = {
    email: 'admin2@example.com',
    role: 'admin',
    password: '2admin2'
};
const B = {
    name: 'b',
    fullName: 'Random'
};
const firstThread = {
    sticked: false,
    viewId: 1
};
const firstAnon = {
    ipAddress: '141.525.646.522',
    password: 'dogshit'
};
const firstPost = {
    message: 'wbicie łopaty do ziemi',
    fileName: 'file-1609085605949.mp4',
    fileHidden: false,
    password: 'dogshit',
    viewId: 1,
    nick: 'OP'
};
const secondPost = {
    message: 'co ty pierdolisz typie',
    fileHidden: false,
    password: 'dosgsgsghit',
    viewId: 2,
    nick: 'Kołczan'
};
const thirdPost = {
    message: 'saguje',
    fileName: '123.png',
    fileHidden: false,
    password: 'do3636gshit',
    viewId: 3,
    nick: 'Motyl'
};
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        const createUserNotes = (user, num, text) => __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < num; i += 1) {
                const note = new models_1.UserNote({ user, note: `${text} ${i}` });
                yield note.save();
            }
        });
        const user1 = new models_1.User(USER_1);
        yield user1.save();
        yield createUserNotes(user1, 100, 'user1 note');
        const adminUser1 = new models_1.User(ADMIN_USER_1);
        yield adminUser1.save();
        yield createUserNotes(adminUser1, 20, 'admin1 note');
        const adminUser2 = new models_1.User(ADMIN_USER_2);
        yield adminUser2.save();
        yield createUserNotes(adminUser2, 20, 'admin2 note');
    });
}
function boardSetup() {
    return __awaiter(this, void 0, void 0, function* () {
        const board1 = new models_1.Board(B);
        yield board1.save();
    });
}
function checkNewDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const user1 = yield models_1.User.findOne({ email: USER_1.email });
        if (!user1) {
            console.log('- New DB detected ===> Initializing Dev Data...');
            yield setup();
        }
        else {
            console.log('- Skip InitData');
        }
        const board = yield models_1.Board.findOne({ name: B.name });
        if (!board) {
            console.log('- Making board...');
            yield boardSetup();
        }
        else {
            console.log('- Skip InitDataBoard');
        }
    });
}
checkNewDB();
