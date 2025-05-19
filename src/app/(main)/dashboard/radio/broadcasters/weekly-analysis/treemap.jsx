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

const AppleStyleTreemap = () => {
  const [selectedStation, setSelectedStation] = useState("1");
  const [hoveredItem, setHoveredItem] = useState(null);

  // Define colors based on ad count ranges
  const getColorByRange = (size) => {
    if (size >= 0 && size <= 200) return "#FF3B30";      // Red for highest range
    if (size >= 1200 && size <= 3000) return "#007AFF";      // Blue for high range
    if (size >= 600 && size <= 1200) return "#34C759";      // Green for medium range
    if (size >= 200 && size <= 600) return "#5856D6";      // Purple for lower range
    return "#FFCC00";                                    // Yellow for outliers
  };

  const stations = [
    { id: "1", name: "Radio City FM" },
    { id: "2", name: "Radio Mirchi" },
    { id: "3", name: "Red FM" },
    { id: "4", name: "Big FM" },
    { id: "5", name: "Rainbow FM" },
  ];

  // Enhanced station data with dynamic colors based on size
  const stationData = {
    1: {
      name: "Radio City FM",
      children: [
        {
          name: "Accessories - Jewellery",
          size: 1416,
          brands: ["Tanishq", "Malabar Gold", "Kalyan Jewellers", "CaratLane"],
        },
        {
          name: "Textiles & Apparels",
          size: 1071,
          brands: ["Raymond", "Allen Solly", "Levi's", "Van Heusen"],
        },
        {
          name: "Food Products",
          size: 486,
          brands: ["Nestle", "Amul", "Britannia", "Parle"],
        },
        {
          name: "Services - Medical",
          size: 412,
          brands: ["Apollo Hospitals", "Fortis", "Max Healthcare", "AIIMS"],
        },
        {
          name: "Education",
          size: 348,
          brands: ["Byju's", "Unacademy", "Coursera", "Udemy"],
        },
        {
          name: "Radio",
          size: 347,
          brands: ["Radio Mirchi", "Red FM", "Big FM", "Fever FM"],
        },
        {
          name: "Consumer Durables",
          size: 316,
          brands: ["Samsung", "LG", "Whirlpool", "Sony"],
        },
        {
          name: "Building Material",
          size: 283,
          brands: ["Ultratech Cement", "ACC", "Ambuja", "Shree Cement"],
        },
        {
          name: "Automobile - Car",
          size: 260,
          brands: ["Maruti Suzuki", "Hyundai", "Tata Motors", "Honda"],
        },
        {
          name: "Consumer Durables - Home Appliances",
          size: 229,
          brands: ["LG", "Samsung", "Voltas", "Haier"],
        },
        {
          name: "Retail",
          size: 161,
          brands: ["Reliance Retail", "DMart", "Big Bazaar", "Spencer's"],
        },
        {
          name: "Consumer Durables - Mobile Phone",
          size: 82,
          brands: ["Samsung", "Apple", "Xiaomi", "OnePlus"],
        },
        {
          name: "Consumer Durables - Solar Products",
          size: 66,
          brands: ["Loom Solar", "Tata Power Solar", "Vikram Solar", "Waaree"],
        },
        {
          name: "Entertainment - Others",
          size: 58,
          brands: ["Netflix", "Amazon Prime", "Disney+", "Sony Liv"],
        },
        {
          name: "Financial Services",
          size: 58,
          brands: ["HDFC", "ICICI", "SBI", "Axis Bank"],
        },
        {
          name: "Consumer Durables-Home Appliances",
          size: 52,
          brands: ["Godrej", "Panasonic", "Blue Star", "IFB"],
        },
        {
          name: "Public Service Ads",
          size: 41,
          brands: ["Ministry of Health", "WHO", "UNICEF", "NITI Aayog"],
        },
        {
          name: "Entertainment - Pubs & Discotheques",
          size: 41,
          brands: ["Kitty Su", "Privee", "Tito's", "Social"],
        },
      ].map((item) => ({ ...item, fill: getColorByRange(item.size) })),
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
              {`${size} Ads`}
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
            Number of Ads: {industry.size}
          </p>
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
        </div>
      );
    }
    return null;
  };

  const currentStation = stationData[selectedStation];

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
                Advertisement Distribution by Count Range
              </p>
            </div>
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#5856D6]" />
                <span>15-20</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#34C759]" />
                <span>21-25</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#007AFF]" />
                <span>26-30</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#FF3B30]" />
                <span>31-35</span>
              </div>
            </div>
            <div className="w-72">
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
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">{currentStation.name}</h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {currentStation.children.length} Industries
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

export default AppleStyleTreemap;