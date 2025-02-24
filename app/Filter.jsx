import React from "react";
import { DatePicker } from "antd";
import Slider from "./Slider";
const { RangePicker } = DatePicker;
import dayjs from "dayjs";

const dateFormat = "YYYY-MM-DD";
const colorRange = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78],
];

const Filter = ({
    year,
    setYear,
    hexBin,
    tab,
    onChangeTab,
    onChangeHexSize,
    setPeriod,
    period,
    crimeTypes,
    selectedCrimeTypes,
    onCrimeTypeChange,
    time,
    setTime,
    burglary,
    setBurglaryWeight,
    onChangeBurglaryWeight,
    onChangeVehicleLarcencyWeight,
    onChangeAutoTheftWeight,
    onChangeLarencyNonVehicleWeight,
    onChangeAggAssaultWeight,
    onChangeHomicideWeight,
    onChangeRobberyWeight,
}) => {

    return (
        <div className="form-container z-10">
            <div className="form flex flex-col gap-10">
                <div className="section flex flex-col gap-1">
                    <div className="title">
                        <div className="tabs">
                            <div
                                className={`tab ${tab === "trends" ? "active" : ""}`}
                                onClick={onChangeTab}
                            >
                                Trends
                            </div>
                            <div
                                className={`tab ${tab === "scores" ? "active" : ""}`}
                                onClick={onChangeTab}
                            >
                                Personalised Scores
                            </div>
                        </div>
                    </div>
                    {tab === "trends" && (
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Year</span>
                            </div>
                            <select
                                value={year || "2020"}
                                className="select select-bordered select-sm"
                                onChange=
                                {(e) => {
                                    setYear(e.target.value);
                                }}
                            >
                                {Array(11)
                                    .fill(2020)
                                    .map((d, i) => d - i)
                                    .map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                            </select>
                        </label>
                    )}
                </div>
                {tab === "trends" && (
                    <div className="section flex flex-col gap-1">

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Hex Bin Size</span>
                            </div>
                            <input
                                type="range"
                                min={100}
                                step={50}
                                max={2000}
                                defaultValue={hexBin}
                                className="range range-sm"
                                onChange={onChangeHexSize}
                            />
                        </label>
                    </div>
                )}
                {tab === "trends" && (
                    <div className="section flex flex-col gap-1">
                        <div className="title">Filters</div>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Date</span>
                            </div>
                            <RangePicker
                                value={period}
                                minDate={dayjs(`${year}-01-01`, dateFormat)}
                                maxDate={dayjs(`${year}-12-31`, dateFormat)}
                                format="MMM D"
                                onChange={
                                    (d) => {
                                        setPeriod(d);
                                    }}
                            />
                        </label>

                        <label className="form-control w-full max-w-xs relative">
                            <div className="label">
                                <span className="label-text">Time</span>
                            </div>
                            <Slider
                                min={0}
                                max={24}
                                step={1}
                                value={time}
                                onChange={({ min, max }) => {
                                    setTime([min, max]);
                                }}
                            ></Slider>
                        </label>



                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Crime Types</span>
                            </div>
                            <div className="flex items-center gap-5">
                                <div className="crime-type-filter">
                                    {crimeTypes.map((crime) => (
                                        <label key={crime} style={{ display: "flex", margin: "5px 10px" }}>
                                            <input
                                                type="checkbox"
                                                value={crime}
                                                checked={selectedCrimeTypes.includes(crime)}
                                                onChange={onCrimeTypeChange}
                                            />
                                            {crime}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </label>
                    </div>
                )
                }

                {
                    tab === "score" && (
                        <div className="desc">
                            <div className="title">Frequency of Crime in Choosen Area</div>
                            <div className="item">
                                <span>BURGLARY</span>
                                <span>
                                    <div className="section flex flex-col gap-1">
                                        <input
                                            type="range"
                                            min={0}
                                            step={0.5}
                                            max={10}
                                            defaultValue="5"
                                            className="range range-sm"
                                            onChange={onChangeBurglaryWeight}
                                        />
                                    </div>
                                </span>
                            </div>
                            <div className="item">
                                <span>LARCENY-FROM VEHICLE</span>
                                <span>
                                    <div className="section flex flex-col gap-1">
                                        <input
                                            type="range"
                                            min={0}
                                            step={0.5}
                                            max={10}
                                            defaultValue="5"
                                            className="range range-sm"
                                            onChange={onChangeVehicleLarcencyWeight}
                                        />
                                    </div>
                                </span>
                            </div>
                            <div className="item">
                                <span> AUTO THEFT</span>
                                <span>
                                    <div className="section flex flex-col gap-1">
                                        <input
                                            type="range"
                                            min={0}
                                            step={0.5}
                                            max={10}
                                            defaultValue="5"
                                            className="range range-sm"
                                            onChange={onChangeAutoTheftWeight}
                                        />
                                    </div>
                                </span>
                            </div>
                            <div className="item">
                                <span>LARCENY-NON VEHICLE</span>
                                <span>
                                    <div className="section flex flex-col gap-1">
                                        <input
                                            type="range"
                                            min={0}
                                            step={0.5}
                                            max={10}
                                            defaultValue="5"
                                            className="range range-sm"
                                            onChange={onChangeLarencyNonVehicleWeight}
                                        />
                                    </div>
                                </span>
                            </div>
                            <div className="item">
                                <span>AGG ASSAULT</span>
                                <span>
                                    <div className="section flex flex-col gap-1">
                                        <input
                                            type="range"
                                            min={0}
                                            step={0.5}
                                            max={10}
                                            defaultValue="5"
                                            className="range range-sm"
                                            onChange={onChangeAggAssaultWeight}
                                        />
                                    </div>
                                </span>
                            </div>
                            <div className="item">
                                <span>HOMICIDE</span>
                                <span>
                                    <div className="section flex flex-col gap-1">
                                        <input
                                            type="range"
                                            min={0}
                                            step={0.5}
                                            max={10}
                                            defaultValue="5"
                                            className="range range-sm"
                                            onChange={onChangeHomicideWeight}
                                        />
                                    </div>
                                </span>
                            </div>
                            <div className="item">
                                <span>ROBBERY</span>
                                <span>
                                    <div className="section flex flex-col gap-1">
                                        <input
                                            type="range"
                                            min={0}
                                            step={0.5}
                                            max={10}
                                            defaultValue="5"
                                            className="range range-sm"
                                            onChange={onChangeRobberyWeight}
                                        />
                                    </div>
                                </span>
                            </div>
                        </div>
                    )
                }
                {
                    tab === "score" && (
                        <div className="desc">
                            <div className="pb-1">Crime Probability</div>

                            <div className="legend">
                                {colorRange.map((color, i) => (
                                    <span
                                        key={i}
                                        style={{ backgroundColor: `rgb(${color.join(",")})` }}
                                    ></span>
                                ))}
                            </div>
                            <div className="legend-label">
                                <span>Low</span>
                                <span>High </span>
                            </div>
                        </div>
                    )
                }
            </div >
        </div >
    );
};

export default Filter;