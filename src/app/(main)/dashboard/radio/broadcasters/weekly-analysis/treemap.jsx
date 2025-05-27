import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Radio, Info } from "lucide-react";
import { hello as helloWeek1, suriyan as suriyanWeek1 } from "./treemap-data.js";
import { hello as helloWeek2, suriyan as suriyanWeek2 } from "./treemap-data_2.js";

// Define colors based on percentage ranges
const getColorByRange = (percentage) => {
  if (percentage/100 >= 10) return "#FF3B30"; // Red for highest range
  if (percentage/100 >= 5) return "#007AFF"; // Blue for high range
  if (percentage/100 >= 3) return "#34C759"; // Green for medium range
  if (percentage/100 >= 1) return "#5856D6";  // Purple for lower range
  return "#FFCC00";                      // Yellow for lowest range
};

// Aggregate data to combine duplicate categories and their brands
const aggregateData = (data) => {
  const categoryMap = data.reduce((acc, item) => {
    const { Category, Percentage, "Brand Name/Parent Comany": brand } = item;
    if (!acc[Category]) {
      acc[Category] = { size: 0, brands: new Set() };
    }
    acc[Category].size += Percentage;
    if (brand) {
      acc[Category].brands.add(brand);
    }
    return acc;
  }, {});

  return Object.entries(categoryMap).map(([name, { size, brands }]) => ({
    name,
    size,
    brands: Array.from(brands),
    fill: getColorByRange(size),
  }));
};

const SectorTreemap = () => {
  const [selectedStation, setSelectedStation] = useState("hello");
  const [selectedWeek, setSelectedWeek] = useState("week1");
  const [hoveredItem, setHoveredItem] = useState(null);

  const stations = [
    { id: "hello", name: "Hello FM" },
    { id: "suriyan", name: "Suriyan FM" },
  ];

  const weeks = [
    { id: "week1", name: "Week 1" },
    { id: "week2", name: "Week 2" },
  ];

  // Map station and week data with aggregated categories
  const stationData = {
    week1: {
      hello: {
        name: "Hello FM",
        children: aggregateData(helloWeek1),
      },
      suriyan: {
        name: "Suriyan FM",
        children: aggregateData(suriyanWeek1),
      },
    },
    week2: {
      hello: {
        name: "Hello FM",
        children: aggregateData(helloWeek2),
      },
      suriyan: {
        name: "Suriyan FM",
        children: aggregateData(suriyanWeek2),
      },
    },
  };

  const CustomizedContent = (props) => {
    const { x, y, width, height, name, size, fill } = props;
    const isHovered = hoveredItem === name;

    return (
      <g
        onMouseEnter={() => setHoveredItem(name)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          opacity={isHovered ? 0.8 : 1}
          style={{
            transition: "all 0.3s ease",
            cursor: "pointer",
            filter: isHovered ? "brightness(1.1)" : "none",
          }}
          rx={8}
          ry={8}
          stroke="white"
          strokeWidth={3}
        />
        {width > 50 && height > 50 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#FFFFFF"
            style={{
              fontSize: width > 100 ? "16px" : "12px",
              fontWeight: "500",
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
              opacity: isHovered ? 1 : 0.9,
            }}
          >
            <tspan x={x + width / 2} dy="-0.5em">
              {name}
            </tspan>
            <tspan
              x={x + width / 2}
              dy="1.5em"
              style={{
                fontSize: width > 100 ? "14px" : "11px",
                fontWeight: "400",
              }}
            >
              {`${(size/100)?.toFixed(2)}%`}
            </tspan>
          </text>
        )}
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const industry = payload[0].payload;
      return (
        <div className="backdrop-blur-xl bg-white/90 p-4 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: industry.fill }}
            />
            <h3 className="font-semibold text-lg">{industry.name}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Percentage: {(industry.size/100)?.toFixed(2)}%
          </p>
          {industry.brands.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium text-sm">Top Brands:</p>
              <div className="grid grid-cols-2 gap-2">
                {industry.brands.map((brand, index) => (
                  <div
                    key={index}
                    className="bg-gray-50/80 px-3 py-2 rounded-xl text-sm"
                  >
                    {brand}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const currentStation = stationData[selectedWeek][selectedStation];

  return (
    <Card className="w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-3">
            <Radio className="w-7 h-7 text-primary animate-pulse" />
            <div>
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Radio Ads Distribution
              </h2>
              <p className="text-sm text-gray-500 font-normal mt-1">
                Advertisement Distribution by Percentage
              </p>
            </div>
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#FFCC00]" />
                <span>0-1%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#5856D6]" />
                <span>0-3%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#34C759]" />
                <span>0-5%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#007AFF]" />
                <span>0-10%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#FF3B30]" />
                <span>10%+</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-36">
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                  <SelectTrigger className="w-full h-11 rounded-xl">
                    <SelectValue placeholder="Select a week" />
                  </SelectTrigger>
                  <SelectContent>
                    {weeks.map((week) => (
                      <SelectItem key={week.id} value={week.id}>
                        {week.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-36">
                <Select value={selectedStation} onValueChange={setSelectedStation}>
                  <SelectTrigger className="w-full h-11 rounded-xl">
                    <SelectValue placeholder="Select a station" />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">{currentStation.name} - {weeks.find(w => w.id === selectedWeek).name}</h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {currentStation.children.length} Categories
            </div>
          </div>
          <div className="h-[500px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={currentStation.children}
                dataKey="size"
                aspectRatio={16 / 9}
                stroke="#fff"
                content={<CustomizedContent />}
                animationDuration={450}
                animationEasing="ease-out"
              >
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "white", strokeWidth: 2 }}
                />
              </Treemap>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorTreemap;