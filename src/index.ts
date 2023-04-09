import axios from "axios";

const getList = (after: number) => {
    return axios.post("https://graphigo.prd.galaxy.eco/query?", {
        operationName: "spaceInfo",
        variables: {"id": 344, "after": after},
        query: "query spaceInfo($id: Int, $after: String!) {\n  space(id: $id) {\n    loyaltyPointsRanks(first: 1000, after: $after) {\n      totalCount\n      list {\n        address {\n          username\n          address\n          __typename\n        }\n        points\n        rank\n        __typename\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}"
    }).then((value) => value.data);
}

const getPoints = async (i: number) => {
    let points = 0
    const data = (await getList(i)).data.space?.loyaltyPointsRanks.list;
    for (let j = 0; j < data.length; j++) {
        if (data[j]?.points) {
            points += data[j].points;
        }
    }
    console.log(`${i}-${i + data.length}: ${points}`)
    return points
}

const main = async () => {
    const totalCount = (await getList(0))?.data.space.loyaltyPointsRanks.totalCount;
    const promises = []
    for (let i = 0; i < totalCount; i += 1000) {
        promises.push(getPoints(i));
    }

    const points = await Promise.all(promises).then((arr) => {
        return arr.reduce((partialSum, a) => partialSum + a, 0);
    });

    console.log(`All points: ${points}`);
}

main()
