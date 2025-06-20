import React, { useState, useMemo } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { Tv, Filter } from "lucide-react";
import ChartCard from "@/components/card/charts-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { sectorData } from "./treemap-sector-data";
import { sectorSecondsData } from "./treemap-sector-seconds-data";

const COLORS = [
  "#FF4B4B", // Red
  "#4CAF50", // Green
  "#2196F3", // Blue
  "#FFC107", // Yellow
  "#E91E63", // Pink
  "#00BCD4", // Cyan
  "#FF9800", // Orange
  "#9C27B0", // Purple
];

const TVChannelTreemap = () => {
  const [selectedWeek, setSelectedWeek] = useState("week16");
  const [selectedStation, setSelectedStation] = useState("Hello FM");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [dataType, setDataType] = useState("plays");

  const weeks = [
    { value: "week16", label: "Week 16 (Apr 16-23, 2025)" },
    { value: "week17", label: "Week 17 (Apr 24-30, 2025)" },
  ];
  const stations = ["Hello FM", "Suryan FM"];

  const getCurrentLevel = () => {
    if (selectedCategory) return "categories";
    if (selectedChannel) return "categories";
    return "channels";
  };

  const getTitle = () => {
    const weekDisplay = weeks.find((w) => w.value === selectedWeek)?.label || selectedWeek;
    const metric = dataType === "plays" ? "Plays" : "Seconds";
    if (selectedCategory) return `${selectedCategory} ${metric} (${weekDisplay})`;
    if (selectedChannel) return `${selectedChannel} Categories ${metric} (${weekDisplay})`;
    return `Market ${metric} by Sector (${weekDisplay} - ${selectedStation})`;
  };

  const getData = useMemo(() => {
    const mockData = dataType === "plays" ? sectorData : sectorSecondsData;
    const data = mockData[selectedWeek]?.[selectedStation] || {};

    if (selectedCategory) {
      const brands = data[selectedChannel]?.categories?.[selectedCategory]?.brands || {};
      const categoryColor = data[selectedChannel]?.categories?.[selectedCategory]?.color || COLORS[0];
      return Object.entries(brands).map(([name, brandData], index) => ({
        name,
        size: brandData.sum || 0,
        color: categoryColor,
      }));
    }
    if (selectedChannel) {
      const categories = data[selectedChannel]?.categories || {};
      const channelColor = data[selectedChannel]?.color || COLORS[0];
      return Object.entries(categories).map(([name, categoryData], index) => ({
        name,
        size: categoryData.sum || 0,
        color: categoryData.color || channelColor,
      }));
    }
    return Object.entries(data).map(([name, channelData], index) => ({
      name,
      size: channelData.sum || 0,
      color: channelData.color || COLORS[index % COLORS.length],
    }));
  }, [selectedWeek, selectedStation, selectedChannel, selectedCategory, dataType]);

  const getInnerContent = (name) => {
    const mockData = dataType === "plays" ? sectorData : sectorSecondsData;
    const data = mockData[selectedWeek]?.[selectedStation] || {};
    const level = getCurrentLevel();

    if (level === "channels" && data[name]?.categories) {
      return Object.entries(data[name].categories).map(([catName, catData]) => ({
        name: catName,
        size: catData.sum || 0,
      }));
    }
    if (level === "categories" && !selectedCategory && data[selectedChannel]?.categories?.[name]?.brands) {
      return Object.entries(data[selectedChannel].categories[name].brands).map(([brandName, brandData]) => ({
        name: brandName,
        size: brandData.sum || 0,
      }));
    }
    return [];
  };

  const handleClick = (name) => {
    const level = getCurrentLevel();
    const mockData = dataType === "plays" ? sectorData : sectorSecondsData;
    const data = mockData[selectedWeek]?.[selectedStation] || {};

    if (level === "channels" && data[name]?.categories) {
      setSelectedChannel(name);
      setSelectedCategory(null);
    } else if (level === "categories" && data[selectedChannel]?.categories?.[name]?.brands) {
      setSelectedCategory(name);
    }
  };

  const handleNavigation = (level) => {
    if (level === "channels") {
      setSelectedChannel(null);
      setSelectedCategory(null);
    } else if (level === "categories") {
      setSelectedCategory(null);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength - 3)}...`;
  };

  const CustomizedContent = ({ x, y, width, height, name, size, color }) => {
    const isHovered = hoveredItem === name;
    const display = width > 30 && height > 30;
    const level = getCurrentLevel();
    const fontSize = Math.min(width / 6, height / 5, 12);
    const isClickable = level === "channels" || (level === "categories" && !selectedCategory);
    const safeName = (name || "").replace(/\s/g, "-");

    return (
      <g
        onMouseEnter={() => setHoveredItem(name)}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => isClickable && handleClick(name)}
        style={{ cursor: isClickable ? "pointer" : "default" }}
        aria-label={`Treemap item: ${name || ""}, ${dataType === "plays" ? `${size} Plays` : `${size}s`}`}
      >
        <defs>
          <linearGradient id={`grad-${safeName}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: `${color}CC`, stopOpacity: 0.8 }} />
          </linearGradient>
        </defs>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={`url(#grad-${safeName})`}
          style={{
            transition: "all 0.3s ease-in-out",
            transformOrigin: `${x + width / 2}px ${y + height / 2}px`,
            boxShadow: isHovered ? "inset 0 0 8px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)" : "none",
          }}
          rx={4}
          ry={4}
          stroke="white"
          strokeWidth={1}
        />
        {display && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#FFFFFF"
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: "600",
              textShadow: "0 1px 3px rgba(0,0,0,0.4)",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <tspan x={x + width / 2} dy="-0.6em">
              {truncateText(name || "", Math.floor(width / (fontSize / 2)))}
            </tspan>
            <tspan
              x={x + width / 2}
              dy="1.3em"
              style={{
                fontSize: `${fontSize * 0.85}px`,
                fontWeight: "400",
              }}
            >
              {/* {dataType === "plays" ? `${size} Plays` : `${size}s`} */}
            </tspan>
          </text>
        )}
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const innerContent = getInnerContent(data.name);
      return (
        <div className="bg-popover p-3 rounded-md shadow-lg border border-border max-w-xs">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
            <h3 className="text-sm font-semibold text-foreground">{data.name}</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {dataType === "plays" ? `Plays: ${data.size}` : `Duration: ${data.size}s`}
          </p>
          {innerContent.length > 0 && (
            <div className="border-t border-border pt-2">
              <p className="text-xs font-medium text-foreground mb-1">
                {getCurrentLevel() === "channels" ? "Categories" : "Brands"}:
              </p>
              <ul className="space-y-1 max-h-40 overflow-auto">
                {innerContent.map((item, index) => (
                  <li key={index} className="text-xs text-muted-foreground">
                    {item.name}: {dataType === "plays" ? `${item.size} Plays` : `${item.size}s`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard
      icon={<Tv className="w-6 h-6 text-primary" />}
      title={getTitle()}
      description="Explore market share distribution across sectors and categories"
      action={
        <div className="flex w-full justify-between items-center gap-4 flex-wrap">
          <div className="flex gap-3 items-center flex-wrap">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select
              value={selectedWeek}
              onValueChange={(value) => {
                setSelectedWeek(value);
                setSelectedChannel(null);
                setSelectedCategory(null);
              }}
            >
              <SelectTrigger className="w-52 bg-popover shadow-sm border-border rounded-md">
                <SelectValue placeholder="Select week" />
              </SelectTrigger>
              <SelectContent className="rounded-md shadow-lg bg-popover">
                {weeks.map((week) => (
                  <SelectItem key={week.value} value={week.value}>
                    {week.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedStation}
              onValueChange={(value) => {
                setSelectedStation(value);
                setSelectedChannel(null);
                setSelectedCategory(null);
              }}
            >
              <SelectTrigger className="w-52 bg-popover shadow-sm border-border rounded-md">
                <SelectValue placeholder="Select station" />
              </SelectTrigger>
              <SelectContent className="rounded-md shadow-lg bg-popover">
                {stations.map((station) => (
                  <SelectItem key={station} value={station}>
                    {station}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ToggleGroup
              type="single"
              value={dataType}
              onValueChange={(value) => {
                if (value) {
                  setDataType(value);
                  setSelectedChannel(null);
                  setSelectedCategory(null);
                }
              }}
              className="flex gap-2"
            >
              <ToggleGroupItem
                value="plays"
                className="bg-popover shadow-sm border-border px-4 py-2 rounded-md text-sm font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted"
              >
                Plays
              </ToggleGroupItem>
              <ToggleGroupItem
                value="seconds"
                className="bg-popover shadow-sm border-border px-4 py-2 rounded-md text-sm font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted"
              >
                Seconds
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      }
      chart={
        getData.length === 0 ? (
          <div className="flex items-center justify-center h-[500px] text-muted-foreground">
            No data available for the selected {getCurrentLevel()}. Try another week or station.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <span
                className={`hover:text-primary cursor-pointer ${!selectedChannel ? "text-primary font-medium" : ""}`}
                onClick={() => handleNavigation("channels")}
                aria-label="Navigate to Sectors"
              >
                Sectors
              </span>
              {selectedChannel && (
                <>
                  <span>→</span>
                  <span
                    className={`hover:text-primary cursor-pointer ${selectedChannel && !selectedCategory ? "text-primary font-medium" : ""}`}
                    onClick={() => handleNavigation("categories")}
                    aria-label={`Navigate to ${selectedChannel}`}
                  >
                    {selectedChannel}
                  </span>
                </>
              )}
              {selectedCategory && (
                <>
                  <span>→</span>
                  <span className="text-primary font-medium">{selectedCategory}</span>
                </>
              )}
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <Treemap
                data={getData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                content={<CustomizedContent />}
                animationEasing="ease-in-out"
                animationDuration={500}
              >
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "white", strokeWidth: 1 }}
                />
              </Treemap>
            </ResponsiveContainer>
          </>
        )
      }
    />
  );
};

export default TVChannelTreemap;