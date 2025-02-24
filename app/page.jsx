"use client";
import { useState, useEffect, useMemo, } from "react";
import React from "react";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { FlyToInterpolator } from "@deck.gl/core";
import { HexagonLayer, HeatmapLayer } from "@deck.gl/aggregation-layers";
import DeckGL from "@deck.gl/react";
import "./globals.css";
import Papa from 'papaparse';
import "./mapview.css";
import Filter from "./Filter.jsx";
import dayjs from "dayjs";
import "./style.scss";
import { debounce } from "lodash";
import { ConfigProvider, theme } from "antd";

//Filter defaults
const defaultFilters = {
  crimeType: ["BURGLARY", "LARCENY-FROM VEHICLE", "AUTO THEFT", "LARCENY-NON VEHICLE", "AGG ASSAULT", "HOMICIDE", "ROBBERY"],
  period: [dayjs("2020-01-01"), dayjs("2020-12-31")],
  time: [0, 24],
  burglary: 5,
  LARCENY_FROM_VEHICLE: 5,
  AUTO_THEFT:5,
  LARCENY_NON_VEHICLE:5,
  AGG_ASSAULT:5,
  HOMICIDE:5,
  ROBBERY:5
};


function MapView() {
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("trends");
  const [year, setYear] = useState("2020");
  const [hexSize, setHexSize] = useState(500);
  const [selectedIdx, setSelectedIdx] = useState();
  const [period, setPeriod] = useState(defaultFilters.period);
  const [time, setTime] = useState(defaultFilters.time);
  const [crimeTypes, setCrimeTypes] = useState(defaultFilters.crimeType);
  const [selectedCrimeTypes, setSelectedCrimeTypes] = useState(defaultFilters.crimeType); // Initially, all are selected
  const [burglary, setBurglaryWeight] = useState(defaultFilters.burglary)
  const [LARCENY_FROM_VEHICLE, setLarcenyFromVehicleWeight] = useState(defaultFilters.LARCENY_FROM_VEHICLE);
  const [AUTO_THEFT, setAutoTheftWeight] = useState(defaultFilters.AUTO_THEFT);
  const [LARCENY_NON_VEHICLE, setLarcenyNonVehicleWeight] = useState(defaultFilters.LARCENY_NON_VEHICLE);
  const [AGG_ASSAULT, setAggAssaultWeight] = useState(defaultFilters.AGG_ASSAULT);
  const [HOMICIDE, setHomicideWeight] = useState(defaultFilters.HOMICIDE);
  const [ROBBERY, setRobberyWeight] = useState(defaultFilters.ROBBERY);
  


  function getTooltip({ object } = {}) {
    if (!object) {
      return null;
    }
    console.log(object.points[0].source.Neighborhood)
    console.log(object.points[0].source.Location)
    const lat = object.position[1];
    const lng = object.position[0];
    const count = object.points.length;
    const loca = object.points[0].source.Location
    const neigh = object.points[0].source.Neighborhood

    return `\
    latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ""}
    longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ""}
    Total Crimes: ${count} 
    Neighborhood: ${neigh}
    Location: ${loca}`
  }

  const unselect = () => {
    setSelectedIdx(undefined);
    setSelectedData(undefined);
  };

  const resetFilters = () => {
    const { time, period, year, crimeType } = defaultFilters;
    setPeriod(period);
    setTime(time);
    setYear(year);
    setCrimeTypes(crimeType);
    setBurglaryWeight(burglary);
    setLarcenyFromVehicleWeight(LARCENY_FROM_VEHICLE);
    setAutoTheftWeight(AUTO_THEFT);
    setLarcenyNonVehicleWeight(LARCENY_NON_VEHICLE);
    setAggAssaultWeight(AGG_ASSAULT);
    setHomicideWeight(HOMICIDE);
    setRobberyWeight(ROBBERY);
  };

  const onChangeTab = () => {
    unselect();
    setTab((prev) => (prev === "trends" ? "score" : "trends"));
  };

  const viewState = useMemo(
    () => ({
      longitude: -84.643074,
      latitude: 33.940619,
      zoom: 9,
      pitch: 70,
      bearing: 0,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    }),
  );


  useEffect(() => {
    setLoading(true);
    Papa.parse('output_data.csv', {
      download: true,
      header: true,
      //dynamicTyping: true,
      complete: (results) => {
        const data = results.data;
        setData(data);
        unselect();
        setLoading(false);
      }
    });
  }, [year]);

  //TODO: ADD preprocessing for Predicted Data

  const debounceFiltering = debounce(() => {
    const filteredData = data.filter((item) => {

      //Filter by year
      if (year && item.Year !== String(year)) {
        return false;
      }

      //Filter by Date
      if (period) {
        const year = 2020;
        const startMonthDay = dayjs(`${year}-${period[0].format("MM-DD")}`);
        const endMonthDay = dayjs(`${year}-${period[1].format("MM-DD")}`);
        const checkMonthDay = dayjs(
          `${year}-${dayjs(item["Start_Time"]).format("MM-DD")}`
        );

        const isBetween =
          checkMonthDay.isAfter(startMonthDay) &&
          checkMonthDay.isBefore(endMonthDay);

        if (!isBetween) return false;
      }

      // Filter by time range
      if (!(time[0] === 0 && time[1] === 24)) {
        const itemTime = item["Occur Time"];
        const [hours, minutes] = itemTime.split(":").map(Number); // Extract hours and minutes
        const itemHour = hours + minutes / 60; // Convert to decimal for precise comparison

        if (!(itemHour >= time[0] && itemHour < time[1])) {
          return false;
        }
      }

      // Check selected crime types
      if (!selectedCrimeTypes.includes(item["Crime Type"])) return false;

      // // Add weights
      // filteredData.forEach(data=> {
      //   data[]
      // })



      return true;
    });
    setFilteredData(filteredData);
    console.log(filteredData);
  }, 300);

  // Handle Hex size filter changes
  const onChangeHexSize = (e) => {
    setHexSize(Number(e.target.value));
  };

  //Handle Time change
  const onChangeTime = (e) => {
    setTime(String(e.target.value));
  };

  //Handle Crime type change
  const onCrimeTypeChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedCrimeTypes((prev) => [...prev, value]);
    } else {
      setSelectedCrimeTypes((prev) =>{
        console.log(prev)
        const temp = prev.filter((type) => type !== value);
        console.log(temp);
      return temp;} )
    }
  };


  //Handle year change
  const onChangeYear = (e) => {
    setYear(Number(e.target.value));
  };

  const onChangeBurglaryWeight = (e) => {
    setBurglaryWeight(Number(e.target.value));
  }

  const onChangeVehicleLarcencyWeight = (e) => {
    setLarcenyFromVehicleWeight(Number(e.target.value));
};

const onChangeAutoTheftWeight = (e) => {
    setAutoTheftWeight(Number(e.target.value));
};

const onChangeLarencyNonVehicleWeight = (e) => {
    setLarcenyNonVehicleWeight(Number(e.target.value));
};

const onChangeAggAssaultWeight = (e) => {
    setAggAssaultWeight(Number(e.target.value));
};

const onChangeHomicideWeight = (e) => {
    setHomicideWeight(Number(e.target.value));
};

const onChangeRobberyWeight = (e) => {
    setRobberyWeight(Number(e.target.value));
};

  useEffect(() => {
    unselect();
    debounceFiltering();
    return () => debounceFiltering.cancel();
  }, [data, time, period, year, selectedCrimeTypes, burglary, LARCENY_FROM_VEHICLE, AUTO_THEFT, LARCENY_NON_VEHICLE, AGG_ASSAULT, HOMICIDE, ROBBERY]);


  const colorRange = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78],
  ];

  const colorRangeHeatmap = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78],
  ];

  const layers = useMemo(() => {
    if (tab === "trends") {
      // HexagonLayer for trends tab
      const layer = new HexagonLayer({
        id: "hexagon-layer",
        colorRange,
        coverage: 0.7,
        opacity: 0.5,
        data: filteredData || [],
        elevationRange: [0, 1000],
        elevationScale: 50,
        // getElevationValue:(dList) => {
        //   console.log(Object.keys(dList))
        //   return dList.filter(d => d['Crime Type'] == "BURGLARY").length*burglary;
        //   // const temp =  d['Crime Type'] == "BURGLARY" ? burglary*5000 : 0;
        //   // console.log(temp);
        //   // return temp;
        // },
        extruded: true,
        getPosition: (d) => {
          return [Number(d["Longitude"]), Number(d["Latitude"])];
        },
        pickable: true,
        radius: hexSize,
        upperPercentile: 100,
        transitions: {
          elevationScale: 1000,
          getElevationValue: 1000,
        },
        autoHighlight: true,
        highlightColor: [255, 255, 255],
        highlightedObjectIndex: selectedIdx,
        getFillColor: (d) => {
          // Default gray color for all hexes
          return [128, 128, 128, 100];
        },
        onClick: (info, event) => {
          // console.log(info)
        }
      })
      return [layer];
    } else if (tab === "score") {
      const mapping = {
        "BURGLARY" : burglary,
        "LARCENY-FROM VEHICLE": LARCENY_FROM_VEHICLE, "AUTO THEFT": AUTO_THEFT, "LARCENY-NON VEHICLE": LARCENY_NON_VEHICLE, "AGG ASSAULT": AGG_ASSAULT,
         "HOMICIDE":HOMICIDE, "ROBBERY":ROBBERY
      };

      // HeatmapLayer for personalized scores tab
      const layer = new HeatmapLayer({
        id: "heatmap-layer",
        colorRangeHeatmap,
        data: filteredData || [],
        getPosition: (d) => [Number(d["Longitude"]), Number(d["Latitude"])],
        getWeight: (dList) => {

          if(typeof dList != Array){
            
            return mapping[dList["Crime Type"]]!=0 ? (Math.pow(2, mapping[dList["Crime Type"]] || 0) ) : 0;
            
            // console.log(burglary)
            // return burglary*;
          } else{
            console.log(dList);
            console.log(typeof dList);
            return dList.map(d => mapping[d["Crime Type"]]).reduce((sum, acc) => sum + acc);
          }
          
          // console.log(mapping[crimeType])
          // return mapping[crimeType]/10 || 0;
        },
        intensity: 1,
        radiusPixels: 30,
        threshold: 0.05,
      });
      return [layer];
    }
  }, [filteredData, hexSize, selectedIdx, tab, burglary, LARCENY_FROM_VEHICLE, AUTO_THEFT, LARCENY_NON_VEHICLE, AGG_ASSAULT, HOMICIDE, ROBBERY]);


  return (
    <ConfigProvider>
      <div suppressHydrationWarning>
        <div className="dark app" data-theme="dark">
          <Filter
            {...{
              tab,
              setTab,
              year,
              setYear,
              hexSize,
              setHexSize,
              period,
              setPeriod,
              time,
              setTime,
              onChangeTime,
              crimeTypes,
              setCrimeTypes,
              onChangeTab,
              onChangeHexSize,
              onChangeYear,
              onCrimeTypeChange,
              selectedCrimeTypes,
              burglary,
              setBurglaryWeight,
              onChangeBurglaryWeight,
              setLarcenyFromVehicleWeight,
              onChangeVehicleLarcencyWeight,
              setAutoTheftWeight,
              onChangeAutoTheftWeight,
              setLarcenyNonVehicleWeight,
              onChangeLarencyNonVehicleWeight,
              setAggAssaultWeight,
              onChangeAggAssaultWeight,
              setHomicideWeight,
              onChangeHomicideWeight,
              setRobberyWeight,
              onChangeRobberyWeight,
            }}
          ></Filter>
          {selectedData !== undefined && (
            <Analysis
              data={selectedData}
              unselect={unselect}
              {...{ year, hexSize, period, time, crimeTypes }}
            ></Analysis>
          )}
        </div>

        <div className="vis relative">
          {loading && (
            <div className="flex pointer-events-none select-none z-50 justify-center items-center w-full h-full absolute">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}
          <DeckGL
            layers={layers}
            initialViewState={viewState}
            controller={true}
            getTooltip={getTooltip}
          // onClick={}
          >
            <Map
              reuseMaps
              mapLib={maplibregl}
              mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
              preventStyleDiffing={true}
            />
          </DeckGL>
        </div>
      </div >
    </ConfigProvider >

  );
}

export default MapView;
