import React, { useCallback, useEffect, useState, useRef } from "react";
import classnames from "classnames";

const Slider = ({ min, max, onChange, step, value }) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValRef = useRef(null);
    const maxValRef = useRef(null);
    const range = useRef(null);

    const getPercent = useCallback(
        (value) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(minVal);
            const maxPercent = getPercent(+maxValRef.current.value);
            if (range.current) {
                range.current.style.left = `calc(${minPercent}% - ${minPercent * 0.1
                    }px)`;
                range.current.style.width = `calc(${maxPercent - minPercent}% + ${(100 - maxPercent) * 0.1
                    }px)`;
            }
        }
    }, [minVal, getPercent]);

    useEffect(() => {
        if (minValRef.current) {
            const minPercent = getPercent(+minValRef.current.value);
            const maxPercent = getPercent(maxVal);

            if (range.current) {
                range.current.style.width = `calc(${maxPercent - minPercent}% + ${(100 - maxPercent) * 0.1
                    }px)`;
            }
        }
    }, [maxVal, getPercent]);

    useEffect(() => {
        setMinVal(value[0]);
        setMaxVal(value[1]);
    }, [value]);

    return (
        <div className="time-range-container">
            <input
                type="range"
                min={min}
                step={step}
                max={max}
                value={minVal}
                ref={minValRef}
                onChange={(event) => {
                    const value = Math.min(+event.target.value, maxVal - 1);
                    event.target.value = value.toString();
                    onChange({ min: value, max: maxVal });
                }}
                className={classnames("thumb thumb--zindex-3", {
                    "thumb--zindex-5": minVal > max - 100,
                })}
            />
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={maxVal}
                ref={maxValRef}
                onChange={(event) => {
                    const value = Math.max(+event.target.value, minVal + 1);
                    event.target.value = value.toString();
                    onChange({ min: minVal, max: value });
                }}
                className="thumb thumb--zindex-4"
            />

            <div className="slider">
                <div className="slider__track" />
                <div ref={range} className="slider__range" />
                <div className="slider__left-value">
                    {minVal === 12 ? 12 : minVal % 12}
                    {minVal < 12 ? "AM" : "PM"}
                </div>
                <div className="slider__right-value">
                    {maxVal === 12 ? maxVal : maxVal % 12}
                    {maxVal === 24 ? "AM" : maxVal < 12 ? "AM" : "PM"}
                </div>
            </div>
        </div>
    );
};

export default Slider;