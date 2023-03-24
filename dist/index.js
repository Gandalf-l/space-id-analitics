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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const getList = (after) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(after);
    return yield axios_1.default.post("https://graphigo.prd.galaxy.eco/query?", {
        operationName: "spaceInfo",
        variables: { "id": 344, "after": after },
        query: "query spaceInfo($id: Int, $after: String!) {\n  space(id: $id) {\n    loyaltyPointsRanks(first: 1000, after: $after) {\n      totalCount\n      list {\n        address {\n          username\n          address\n          __typename\n        }\n        points\n        rank\n        __typename\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}"
    }).then((value) => value.data);
});
const getPoints = (i) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let points = 0;
    const data = (yield getList(i)).data.space.loyaltyPointsRanks.list;
    for (let j = 0; j < 1000; j++) {
        if ((_a = data[j]) === null || _a === void 0 ? void 0 : _a.points) {
            points += data[j].points;
        }
    }
    console.log('points', points);
    return points;
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const totalCount = (_b = (yield getList(0))) === null || _b === void 0 ? void 0 : _b.data.space.loyaltyPointsRanks.totalCount;
    const promises = [];
    for (let i = 0; i < totalCount; i += 1000) {
        promises.push(getPoints(i));
    }
    const points = yield Promise.all(promises).then((arr) => {
        return arr.reduce((partialSum, a) => partialSum + a, 0);
    });
    console.log(points);
});
main();
//# sourceMappingURL=index.js.map