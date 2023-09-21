

// this data should be from a web service
const sampleData = [
    {
        keyStoreName: "keyStoreName1", siteCity: "siteCity1", productTag: "productTag1", userName: "userName1", machineName: "machineName1",
        requestTime: "requestTime1", returnTime: "returnTime1", projectName: "projectName1", usageMinutes: "usageMinutes1", source: "source1"
    },

    {
        keyStoreName: "keyStoreName2", siteCity: "siteCity2", productTag: "productTag2", userName: "userName2", machineName: "machineName2",
        requestTime: "requestTime2", returnTime: "returnTime2", projectName: "projectName2", usageMinutes: "usageMinutes2", source: "source2"
    },
];

// custom method to call web service
export const getExampleData = (refresh = false): Promise<any> =>
    new Promise(function (resolve, reject) {
        // mimic a delay calling web service
        setTimeout(() => {
            resolve(sampleData);
        }, refresh ? 1000 : 500);
    });


// example of using async and await with setTimeout

function timeout(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getExample(refresh = false): Promise<any> {
    await timeout(refresh ? 1000 : 0);
    return sampleData;
}