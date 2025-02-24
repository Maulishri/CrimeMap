import * as d3 from "d3";

export const format = d3.format(",");

export const processData = (data) => {
    data.forEach((d) => {
        [
            "Crime Type",
        ].forEach((c) => {
            d[c] = Number(d[c]);
        });
    });
    return data;
};