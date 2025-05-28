"use client";
import React, { useState } from "react";
import { Radio, Clock, Info } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { week1, week2 } from "./heatmap-data.js";

const RadioAdHeatmap = () => {
  const [selectedWeek, setSelectedWeek] = useState("Week 1");
  const [hoveredCell, setHoveredCell] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const data = selectedWeek === "Week 1" ? week1 : week2;

  const processData = (data) => {
    // Match data's hour format: "0:00", "1:00", ..., "23:00"
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const stations = ["Hello","Suryan"];

    console.log("Selected data:", data); // Debug: Log input data

    const matrix = stations.map((station) => {
      const stationData = { station };
      hours.forEach((hour) => {
        const match = data.find((d) => d.hour === hour);
        stationData[hour] = match ? match.stations[station]?.minutes || 0 : 0;
      });
      return stationData;
    });

    console.log("Matrix:", matrix); // Debug: Log processed matrix
    return matrix;
  };

  const matrix = processData(data);

  const values = matrix.flatMap((row) =>
    Object.values(row).filter((val) => typeof val === "number")
  );
  const min = Math.min(...values);
  const max = Math.max(...values); // Remove hardcoded 15 to handle large values (e.g., 286.5)

  const getColor = (value) => {
    if (!value) return "rgb(244, 245, 247)";
    const normalizedValue = (value - min) / (max - min);
    return `rgba(242, 100, 50, ${0.2 + normalizedValue * 0.5})`;
  };

  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const getTimeOfDay = (hour) => {
    const hourNum = parseInt(hour);
    if (hourNum >= 5 && hourNum < 12) return "Morning";
    if (hourNum >= 12 && hourNum < 17) return "Afternoon";
    if (hourNum >= 17 && hourNum < 21) return "Evening";
    return "Night";
  };

  return (
    <Card className="w-full bg-gradient-to-br from-gray-50/50 to-gray-100/50 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2">
              <Radio className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-1">
                Ad Airplay Time Distribution Heatmap
              </CardTitle>
              <CardDescription className="text-gray-500">
                24-hour advertisement duration analysis ({selectedWeek})
              </CardDescription>
            </div>
          </div>
          <Clock className="h-6 w-6 text-primary/60" />
        </div>
        <div className="flex justify-center mt-4">
          <button
            className={`px-4 py-2 mx-2 rounded-md ${
              selectedWeek === "Week 1"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSelectedWeek("Week 1")}
          >
            Week 1 (16-22 April)
          </button>
          <button
            className={`px-4 py-2 mx-2 rounded-md ${
              selectedWeek === "Week 2"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSelectedWeek("Week 2")}
          >
            Week 2 (23-30 April)
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="min-w-7xl">
            <div
              className="grid gap-px bg-gray-100"
              style={{
                gridTemplateColumns: "auto repeat(24, minmax(40px, 1fr))",
              }}
            >
              <div className="bg-gray-50/80 font-medium p-3 w-32 rounded-tl-lg">
                Station
              </div>
              {hours.map((hour, idx) => (
                <div
                  key={hour}
                  className="bg-gray-50/80 p-2 text-center relative group"
                  onMouseEnter={() => setHoveredCell(hour)}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  <div className="text-xs font-medium text-gray-600">
                    {hour}
                  </div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    {getTimeOfDay(hour)}
                  </div>
                </div>
              ))}
            </div>

            {matrix.map((row, idx) => (
              <div
                key={idx}
                className="grid"
                style={{
                  gridTemplateColumns: "auto repeat(24, minmax(40px, 1fr))",
                }}
                onMouseEnter={() => setHoveredRow(idx)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <div
                  className={`py-4 font-medium w-32 h-16 p-3 bg-gray-50/80 text-sm transition-colors ${
                    hoveredRow === idx ? "text-primary" : ""
                  }`}
                >
                  {row.station}
                </div>
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="relative group"
                    style={{
                      backgroundColor: getColor(row[hour]),
                    }}
                  >
                    <div
                      className={`w-full h-full p-2 text-center transition-all duration-200`}
                    >
                      <span className="text-xs font-medium">
                        {row[hour].toFixed(1)}
                      </span>
                    </div>
                    <div className="absolute -top-8 left-1/2 w-20 h-fit z-50 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      {`${row.station}: ${row[hour].toFixed(1)} mins`}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">Duration:</div>
                <div className="h-4 w-96 rounded-md bg-gradient-to-r from-[#F2643022] to-[#F26430]" />
                <div className="text-sm text-gray-600">Higher</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Hover for details</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="text-sm text-gray-500 border-t mt-4 pt-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>
            Advertisement duration analysis across 24-hour broadcast period
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RadioAdHeatmap;