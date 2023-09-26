

const r = (max: number) => Math.floor(Math.random() * max);
const rd = () => new Date((new Date()).getTime() - Math.random()*(1e+12)).toLocaleDateString();

const generateData = () => {
    const rowNum = r(100);
    let data: object[] = [];
    for (let i = 0; i < rowNum; i++) {
        let j = i * 2 + 10;
        data.push({
            keyStoreName: `keyStoreName${r(j)}`, siteCity: `siteCity${r(j)}`, productTag: `productTag${r(j)}`, userName: `userName${r(j)}`, machineName: `machineName${r(j)}`,
            requestTime: rd(), returnTime: rd(), projectName: `projectName${r(j)}`, usageMinutes: r(j), source: `source${r(j)}`
        });
    }
    return data;
}

// custom method to call web service
export const getExampleData = (refresh = false): Promise<any> =>
    new Promise(function (resolve, reject) {
        // mimic a delay calling web service
        setTimeout(() => {
            resolve(generateData());
        }, refresh ? 1000 : 500);
    });


// example of using async and await with setTimeout

function timeout(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getExample(refresh = false): Promise<any> {
    await timeout(refresh ? 1000 : 0);
    return generateData();
}