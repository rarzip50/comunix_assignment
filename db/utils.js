/**
 * gets json object and returns the following structure: key = value, key2 = value2 etc
 * @param {*} jsonData
 */
function jsonToEqualsKeyValue(jsonData, deleimiter = ",") {
    try {
        let string = "";
        let i = 0;
        for (let [key, value] of Object.entries(jsonData)) {
            string += `${i === 0 ? " " : deleimiter + " "}${key} = "${value}" `;
            i++;
        }
        return string;
    } catch (e) {
        throw new Error(
            "error occured when trying to generate string from json: " + e
        );
    }
}

exports.jsonToEqualsKeyValue = jsonToEqualsKeyValue;

exports.update = (tableName, data, predicate) => {
    if (!data) {
        return undefined;
    }

    return `UPDATE ${tableName} SET ${jsonToEqualsKeyValue(
        data
    )} where ${jsonToEqualsKeyValue(predicate, "and")}`;
};

/**
 * generates an add sql statement.
 * @param {*} tableName
 * @param {*} data - can be array or object
 * @returns string for add sql statement
 */
exports.add = (tableName, data) => {
    if (!data) {
        return undefined;
    }
    let dataArray = [];
    if (!Array.isArray(data)) {
        dataArray.push(data);
        data = dataArray;
    }
    return `INSERT INTO ${tableName} (${Object.keys(
        data[0]
    ).toString()}) VALUES ${data
        .map((element) => {
            return `(${Object.values(element)
                .map((value) => {
                    return `"${value}"`;
                })
                .join(",")})`;
        })
        .join(",")} `;
};

exports.get = (tableName, predicate) => {
    return `select * from ${tableName} where ${jsonToEqualsKeyValue(
        predicate,
        "and "
    )}`;
};