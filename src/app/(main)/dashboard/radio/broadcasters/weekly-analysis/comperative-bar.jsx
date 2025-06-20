import React, { useState, useMemo } from "react";
import { Radio, Filter } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const HelloSectorData = [
  {
    "week": "week_1",
    "seconds": {
      "ACCESSORIES": 19208,
      "RETAIL": 11189,
      "CONSUMER DURABLES": 11052,
      "HEALTHCARE": 7600,
      "ENTERTAINMENT": 5571,
      "EDUCATION": 4149,
      "FMCG": 3960,
      "AUTOMOBILE": 3625,
      "CONSTRUCTIONS": 1957,
      "PUBLIC INTEREST": 1948,
      "FINANCE": 1823,
      "PROPERTY": 1452,
      "TRAVEL&TOURISM": 1440,
      "HOSPITALITY": 1223,
      "HOME FURNISHING": 379,
      "ORAL CARE": 108
    },
    "plays": {
      "ACCESSORIES": 1658,
      "RETAIL": 1445,
      "CONSUMER DURABLES": 1083,
      "HEALTHCARE": 912,
      "ENTERTAINMENT": 497,
      "EDUCATION": 539,
      "FMCG": 796,
      "AUTOMOBILE": 517,
      "CONSTRUCTIONS": 300,
      "PUBLIC INTEREST": 63,
      "FINANCE": 154,
      "PROPERTY": 262,
      "TRAVEL&TOURISM": 72,
      "HOSPITALITY": 145,
      "HOME FURNISHING": 78,
      "ORAL CARE": 49
    }
  },
  {
    "week": "week_2",
    "seconds": {
      "ACCESSORIES": 42646,
      "RETAIL": 12447,
      "CONSUMER DURABLES": 9479,
      "FINANCE": 7914,
      "ENTERTAINMENT": 7267,
      "HEALTHCARE": 6423,
      "FMCG": 5853,
      "EDUCATION": 5200,
      "AUTOMOBILE": 3049,
      "PUBLIC INTEREST": 2683,
      "HOSPITALITY": 2424,
      "CONSTRUCTIONS": 2170,
      "TRAVEL&TOURISM": 1833,
      "HOME FURNISHING": 1086,
      "PROPERTY": 897,
      "JEWELLERY-RETAIL": 363,
      "ORAL CARE": 130,
      "FURNITURE-RETAIL": 97
    },
    "plays": {
      "ACCESSORIES": 3657,
      "RETAIL": 1637,
      "CONSUMER DURABLES": 1140,
      "FINANCE": 505,
      "ENTERTAINMENT": 857,
      "HEALTHCARE": 1023,
      "FMCG": 1163,
      "EDUCATION": 711,
      "AUTOMOBILE": 613,
      "PUBLIC INTEREST": 33,
      "HOSPITALITY": 338,
      "CONSTRUCTIONS": 311,
      "TRAVEL&TOURISM": 93,
      "HOME FURNISHING": 183,
      "PROPERTY": 211,
      "JEWELLERY-RETAIL": 26,
      "ORAL CARE": 60,
      "FURNITURE-RETAIL": 11
    }
  }
]

const SuryanSectorData = [
  {
    "week": "week_1",
    "seconds": {
      "ACCESSORIES": 17591,
      "RETAIL": 14910,
      "CONSUMER DURABLES": 10259,
      "HEALTHCARE": 7145,
      "EDUCATION": 5554,
      "AUTOMOBILE": 4889,
      "CONSTRUCTIONS": 3317,
      "FINANCE": 2950,
      "PUBLIC INTEREST": 2660,
      "FMCG": 1936,
      "TRAVEL&TOURISM": 1600,
      "PROPERTY": 1063,
      "RENEWABLE ENERGY": 950,
      "ENTERTAINMENT": 181,
      "HOSPITALITY": 112,
      "ORAL CARE": 70,
      "HOME FURNISHING": 43
    },
    "plays": {
      "ACCESSORIES": 1291,
      "RETAIL": 1554,
      "CONSUMER DURABLES": 798,
      "HEALTHCARE": 546,
      "EDUCATION": 501,
      "AUTOMOBILE": 371,
      "CONSTRUCTIONS": 343,
      "FINANCE": 120,
      "PUBLIC INTEREST": 78,
      "FMCG": 340,
      "TRAVEL&TOURISM": 80,
      "PROPERTY": 52,
      "RENEWABLE ENERGY": 95,
      "ENTERTAINMENT": 8,
      "HOSPITALITY": 16,
      "ORAL CARE": 7,
      "HOME FURNISHING": 2
    }
  },
  {
    "week": "week_2",
    "seconds": {
      "ACCESSORIES": 36665,
      "RETAIL": 16828,
      "FINANCE": 11345,
      "EDUCATION": 9786,
      "CONSUMER DURABLES": 8617,
      "HEALTHCARE": 6219,
      "FMCG": 3934,
      "CONSTRUCTIONS": 3624,
      "AUTOMOBILE": 3084,
      "TRAVEL&TOURISM": 1840,
      "PUBLIC INTEREST": 1100,
      "RENEWABLE ENERGY": 1060,
      "HOSPITALITY": 478,
      "PROPERTY": 324,
      "HOME FURNISHING": 286,
      "ENTERTAINMENT": 240,
      "ORAL CARE": 101
    },
    "plays": {
      "ACCESSORIES": 2293,
      "RETAIL": 1741,
      "FINANCE": 511,
      "EDUCATION": 762,
      "CONSUMER DURABLES": 660,
      "HEALTHCARE": 543,
      "FMCG": 444,
      "CONSTRUCTIONS": 357,
      "AUTOMOBILE": 270,
      "TRAVEL&TOURISM": 92,
      "PUBLIC INTEREST": 36,
      "RENEWABLE ENERGY": 106,
      "HOSPITALITY": 53,
      "PROPERTY": 74,
      "HOME FURNISHING": 34,
      "ENTERTAINMENT": 24,
      "ORAL CARE": 9
    }
  }
]

const RadioSectorAnalysis = () => {
  const [selectedWeeks, setSelectedWeeks] = useState(["week_1"]);
  const [selectedStations, setSelectedStations] = useState(["all"]);
  const [dataType, setDataType] = useState("seconds");
  const [highlightedSector, setHighlightedSector] = useState(null);

 const sectors = {
  "ACCESSORIES": { name: "Accessories", color: "#34D399" },               // Emerald
  "AUTOMOBILE": { name: "Automobile", color: "#F472B6" },                 // Pink
  "CONSTRUCTIONS": { name: "Constructions", color: "#F59E0B" },           // Amber
  "CONSUMER DURABLES": { name: "Consumer Durables", color: "#3B82F6" },   // Blue
  "EDUCATION": { name: "Education", color: "#4ADE80" },                   // Green
  "ENTERTAINMENT": { name: "Entertainment", color: "#F87171" },           // Red
  "FINANCE": { name: "Finance", color: "#60A5FA" },                       // Light Blue
  "FMCG": { name: "FMCG", color: "#A78BFA" },                             // Purple
  "FURNITURE-RETAIL": { name: "Furniture - Retail", color: "#FB7185" },   // Rose
  "HEALTHCARE": { name: "Healthcare", color: "#10B981" },                // Teal
  "HOME FURNISHING": { name: "Home Furnishing", color: "#E879F9" },       // Orchid
  "HOSPITALITY": { name: "Hospitality", color: "#FCD34D" },               // Yellow
  "JEWELLERY-RETAIL": { name: "Jewellery - Retail", color: "#FBBF24" },   // Golden
  "ORAL CARE": { name: "Oral Care", color: "#818CF8" },                   // Indigo
  "PROPERTY": { name: "Property", color: "#FB923C" },                     // Orange
  "PUBLIC INTEREST": { name: "Public Interest", color: "#93C5FD" },       // Sky Blue
  "RENEWABLE ENERGY": { name: "Renewable Energy", color: "#6EE7B7" },     // Mint
  "RETAIL": { name: "Retail", color: "#FCA5A5" },                         // Salmon
  "TRAVEL&TOURISM": { name: "Travel & Tourism", color: "#FDBA74" },       // Peach
};


  const weeks = [
    { value: "week_1", label: "Week 16 (Apr 16-23, 2025)", shortLabel: "Week 16" },
    { value: "week_2", label: "Week 17 (Apr 24-30, 2025)", shortLabel: "Week 17" },
  ];

  const stations = [
    { value: "all", label: "All Stations" },
    { value: "Hello FM", label: "Hello FM" },
    { value: "Suryan FM", label: "Suryan FM" },
  ];

  const rawData = {
    "Hello FM": {
      region: "Trichy",
      language: "malayalam",
      weekly: Object.fromEntries(
        HelloSectorData.map(({ week, seconds, plays }) => [
          week,
          { seconds, plays },
        ])
      ),
    },
    "Suryan FM": {
      region: "Trichy",
      language: "malayalam",
      weekly: Object.fromEntries(
        SuryanSectorData.map(({ week, seconds, plays }) => [
          week,
          { seconds, plays },
        ])
      ),
    },
  };

  const flattenedData = Object.entries(rawData).map(([station, data]) => ({
    station,
    ...data,
  }));

 const filteredData = useMemo(() => {
  const isAllSelected = selectedStations.includes("all");
  return flattenedData
    .filter((stationData) =>
      isAllSelected || selectedStations.includes(stationData.station)
    )
    .map((stationData) => ({
      station: stationData.station,
      weeklyData: selectedWeeks.map((week) => ({
        week,
        sectors: stationData.weekly[week]?.[dataType] || {},
      })),
      region: stationData.region,
      language: stationData.language,
    }));
}, [selectedWeeks, selectedStations, dataType]);

  const formatSelectedWeeks = (selected) => {
    if (selected.length === 0) return "Select weeks";
    return selected
      .map((week) => weeks.find((w) => w.value === week)?.shortLabel)
      .sort(
        (a, b) =>
          weeks.findIndex((w) => w.shortLabel === a) -
          weeks.findIndex((w) => w.shortLabel === b)
      )
      .join(", ");
  };

  const formatSelectedStations = (selected) => {
    if (selected.length === 0) return "Select stations";
    if (selected.includes("all")) return "All Stations";
    return selected
      .map((station) => stations.find((s) => s.value === station)?.label || station)
      .join(", ");
  };

  const handleWeekSelection = (value) => {
    setSelectedWeeks((prev) =>
      prev.includes(value)
        ? prev.filter((week) => week !== value)
        : [...prev, value]
    );
  };

  const handleStationSelection = (value) => {
    if (value === "all") {
      setSelectedStations(["all"]);
    } else {
      setSelectedStations((prev) => {
        const newSelection = prev.includes(value)
          ? prev.filter((station) => station !== value)
          : [...prev.filter((station) => station !== "all"), value];
        return newSelection.length === 0 ? ["all"] : newSelection;
      });
    }
  };

  const formatValue = (value) => {
    if (dataType === "seconds") {
      return `${Math.round(value)}s`;
    }
    return `${Math.round(value)}`;
  };

  const toggleSectorHighlight = (sectorKey) => {
    setHighlightedSector((prev) => (prev === sectorKey ? null : sectorKey));
  };

  return (
    <Card className="w-full bg-card shadow-lg rounded-lg border border-border">
      <CardHeader className="p-6 border-b">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-2 shadow-md">
                <Radio className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  Sector-wise Ad Distribution
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-1">
                  Interactive sector performance across radio stations
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <div className="flex gap-2 flex-wrap">
                <Select value="" onValueChange={handleWeekSelection}>
                  <SelectTrigger className="w-40 bg-popover shadow-sm border-border rounded-md">
                    <SelectValue placeholder={formatSelectedWeeks(selectedWeeks)} />
                  </SelectTrigger>
                  <SelectContent className="rounded-md shadow-lg bg-popover">
                    {weeks.map((week) => (
                      <SelectItem
                        key={week.value}
                        value={week.value}
                        className="flex items-center gap-2 px-3 py-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedWeeks.includes(week.value)}
                          onChange={() => handleWeekSelection(week.value)}
                          className="h-4 w-4"
                        />
                        {week.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value="" onValueChange={handleStationSelection}>
                  <SelectTrigger className="w-48 bg-popover shadow-sm border-border rounded-md">
                    <SelectValue placeholder={formatSelectedStations(selectedStations)} />
                  </SelectTrigger>
                  <SelectContent className="rounded-md shadow-lg bg-popover">
                    {stations.map((station) => (
                      <SelectItem
                        key={station.value}
                        value={station.value}
                        className="flex items-center gap-2 px-3 py-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStations.includes(station.value)}
                          onChange={() => handleStationSelection(station.value)}
                          className="h-4 w-4"
                        />
                        {station.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ToggleGroup
                  type="single"
                  value={dataType}
                  onValueChange={(value) => value && setDataType(value)}
                  className="flex gap-2"
                >
                  <ToggleGroupItem
                    value="seconds"
                    className="bg-popover shadow-sm border-border px-4 py-2 rounded-md text-sm font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted"
                  >
                    Seconds
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="plays"
                    className="bg-popover shadow-sm border-border px-4 py-2 rounded-md text-sm font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted"
                  >
                    Plays
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 bg-card">
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {Object.entries(sectors).map(([key, sector]) => (
            <button
              key={key}
              onClick={() => toggleSectorHighlight(key)}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 shadow-sm transition-all duration-200 ${
                highlightedSector === key
                  ? "bg-accent ring-2 ring-primary"
                  : "bg-popover hover:bg-muted"
              }`}
            >
              <div
                className="h-2.5 w-2.5 rounded-full ring-1 ring-border"
                style={{ backgroundColor: sector.color }}
              />
              <span className="text-xs font-medium text-foreground">
                {sector.name}
              </span>
            </button>
          ))}
        </div>
        <div className="space-y-6">
          {filteredData.map((station) => (
            <div
              key={station.station}
              className="bg-card rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-36 flex-shrink-0">
                  <div className="text-sm font-semibold text-foreground">
                    {station.station}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{station.region}</div>
                  <div className="text-xs text-muted-foreground">{station.language}</div>
                </div>
                <div className="flex-1">
                  <div className="space-y-4">
                    {station.weeklyData.map((weekData) => {
                      const totalWeekValue = Object.values(weekData.sectors).reduce(
                        (sum, value) => sum + (value || 0),
                        0
                      );
                      if (totalWeekValue === 0) {
                        return (
                          <div key={weekData.week} className="relative">
                            <div className="text-xs font-medium text-foreground mb-2">
                              {weeks.find((w) => w.value === weekData.week)?.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              No data available
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={weekData.week} className="relative">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-xs font-medium text-foreground">
                              {weeks.find((w) => w.value === weekData.week)?.label}
                            </div>
                            <div className="text-xs font-semibold text-foreground">
                              Total: {formatValue(totalWeekValue)}
                            </div>
                          </div>
                          <div className="relative h-10 w-full">
                            <div className="absolute inset-y-0 w-full bg-muted rounded-md shadow-inner" />
                            <div
                              className="relative h-full rounded-md flex shadow-sm"
                              style={{ width: "100%" }}
                            >
                              {Object.entries(weekData.sectors)
                                .filter(([, value]) => value > 0)
                                .sort(([, a], [, b]) => b - a) // Sort in descending order
                                .map(([sectorKey, value]) => {
                                  const barWidth = (value / totalWeekValue) * 100;
                                  const percentage = ((value / totalWeekValue) * 100).toFixed(1);
                                  const isHighlighted =
                                    highlightedSector === null || highlightedSector === sectorKey;
                                  return (
                                    <div
                                      key={sectorKey}
                                      className="h-full flex items-center justify-center group transition-all duration-200 relative hover:scale-105"
                                      style={{
                                        width: `${barWidth}%`,
                                        backgroundColor: sectors[sectorKey]?.color || "#CCCCCC",
                                        minWidth: value > 0 ? "24px" : "0px",
                                        opacity: isHighlighted ? 1 : 0.1,
                                        transformOrigin: "center",
                                        boxShadow: isHighlighted
                                          ? "inset 0 0 6px rgba(0,0,0,0.15)"
                                          : "none",
                                      }}
                                    >
                                      <div className="text-xs font-semibold text-white px-1.5 truncate drop-shadow">
                                        {formatValue(value)}
                                      </div>
                                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2.5 py-1 bg-background text-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
                                        {sectors[sectorKey]?.name || sectorKey}: {formatValue(value)} ({percentage}%)
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RadioSectorAnalysis;