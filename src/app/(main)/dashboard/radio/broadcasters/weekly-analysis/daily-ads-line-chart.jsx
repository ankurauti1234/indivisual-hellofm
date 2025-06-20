"use client";

import { TrendingUp } from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ChartCard from "@/components/card/charts-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming you have a Checkbox component

// Data from previous conversation
const dailyAdsData = {
  week16: [
    {
      date: "Wed 16 Apr",
      day: "Wednesday",
      hellofm: { count: 1109, seconds: 10062 },
      suryanfm: { count: 776, seconds: 9563 }
    },
    {
      date: "Thu 17 Apr",
      day: "Thursday",
      hellofm: { count: 1173, seconds: 8990 },
      suryanfm: { count: 936, seconds: 11732 }
    },
    {
      date: "Fri 18 Apr",
      day: "Friday",
      hellofm: { count: 1489, seconds: 12484 },
      suryanfm: { count: 888, seconds: 10734 }
    },
    {
      date: "Sat 19 Apr",
      day: "Saturday",
      hellofm: { count: 1180, seconds: 10709 },
      suryanfm: { count: 883, seconds: 10333 }
    },
    {
      date: "Sun 20 Apr",
      day: "Sunday",
      hellofm: { count: 1041, seconds: 10222 },
      suryanfm: { count: 839, seconds: 9855 }
    },
    {
      date: "Mon 21 Apr",
      day: "Monday",
      hellofm: { count: 1257, seconds: 12586 },
      suryanfm: { count: 918, seconds: 10902 }
    },
    {
      date: "Tue 22 Apr",
      day: "Tuesday",
      hellofm: { count: 1321, seconds: 11631 },
      suryanfm: { count: 962, seconds: 12111 }
    },
    {
      date: "Wed 23 Apr",
      day: "Wednesday",
      hellofm: { count: 1325, seconds: 12139 },
      suryanfm: { count: 983, seconds: 12868 }
    }
  ],
  week17: [
    {
      date: "Thu 24 Apr",
      day: "Thursday",
      hellofm: { count: 1258, seconds: 11843 },
      suryanfm: { count: 1008, seconds: 12350 }
    },
    {
      date: "Fri 25 Apr",
      day: "Friday",
      hellofm: { count: 1805, seconds: 16732 },
      suryanfm: { count: 1044, seconds: 13453 }
    },
    {
      date: "Sat 26 Apr",
      day: "Saturday",
      hellofm: { count: 1531, seconds: 11898 },
      suryanfm: { count: 884, seconds: 12585 }
    },
    {
      date: "Sun 27 Apr",
      day: "Sunday",
      hellofm: { count: 1110, seconds: 12159 },
      suryanfm: { count: 762, seconds: 9306 }
    },
    {
      date: "Mon 28 Apr",
      day: "Monday",
      hellofm: { count: 1671, seconds: 13619 },
      suryanfm: { count: 1059, seconds: 14531 }
    },
    {
      date: "Tue 29 Apr",
      day: "Tuesday",
      hellofm: { count: 1877, seconds: 17425 },
      suryanfm: { count: 1171, seconds: 15894 }
    },
    {
      date: "Wed 30 Apr",
      day: "Wednesday",
      hellofm: { count: 1995, seconds: 16146 },
      suryanfm: { count: 1098, seconds: 14544 }
    }
  ]
};

const chartConfig = {
  hellofm: {
    label: "Hello FM",
    color: "hsl(var(--chart-1))",
  },
  suryanfm: {
    label: "Suryan FM",
    color: "hsl(var(--chart-2))",
  },
};

export default function DailyAdsLineChart() {
  const [selectedWeeks, setSelectedWeeks] = useState(["week16"]);
  const [showSeconds, setShowSeconds] = useState(false);

  // Combine data from selected weeks
  const chartData = selectedWeeks
    .flatMap((week) =>
      dailyAdsData[week].map((item) => ({
        date: item.date,
        day: item.day,
        week: week,
        hellofm: item.hellofm[showSeconds ? "seconds" : "count"],
        suryanfm: item.suryanfm[showSeconds ? "seconds" : "count"]
      }))
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Get boundary dates between weeks for visual separation
  const weekBoundaries = chartData
    .reduce((acc, item, index) => {
      if (index > 0 && item.week !== chartData[index - 1].week) {
        acc.push(chartData[index - 1].date);
      }
      return acc;
    }, [])
    .map((date) => ({ date }));

  const handleWeekChange = (week) => {
    setSelectedWeeks((prev) => {
      if (prev.includes(week)) {
        // Remove week if already selected, but ensure at least one week remains
        const newWeeks = prev.filter((w) => w !== week);
        return newWeeks.length > 0 ? newWeeks : prev;
      }
      // Add week if not selected
      return [...prev, week];
    });
  };

  const CustomDot = (props) => {
    const { cx, cy, payload, dataKey } = props;
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill={chartConfig[dataKey]?.color}
          stroke="#fff"
          strokeWidth={2}
        />
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fontSize={14}
          fill={chartConfig[dataKey]?.color}
          fontWeight="600"
        >
 {payload[dataKey]}
        </text>
      </g>
    );
  };

  const formatValue = (value) => {
    return Math.round(value).toLocaleString() + (showSeconds ? "s" : "");
  };

  // Generate description based on selected weeks
  const getDescription = () => {
    if (selectedWeeks.length === 1) {
      return `${showSeconds ? "Total Ad Duration (seconds)" : "Total Ad Plays"} per Day - ${
        selectedWeeks[0] === "week16" ? "Week 16 (Apr 16-23)" : "Week 17 (Apr 24-30)"
      } 2024`;
    }
    const weekNames = selectedWeeks.map((week) =>
      week === "week16" ? "Week 16 (Apr 16-23)" : "Week 17 (Apr 24-30)"
    );
    return `${showSeconds ? "Total Ad Duration (seconds)" : "Total Ad Plays"} per Day - ${weekNames.join(" and ")} 2024`;
  };

  return (
    <ChartCard
      icon={<TrendingUp className="w-6 h-6" />}
      title={showSeconds ? "Daily Ad Duration Trends" : "Daily Ad Count Trends"}
      description={getDescription()}
      action={
        <div className="flex justify-end space-x-4 items-center">
          <div className="flex items-center space-x-2">
            <Switch id="unit-toggle" checked={showSeconds} onCheckedChange={setShowSeconds} />
            <Label htmlFor="unit-toggle">{showSeconds ? "Seconds" : "Plays"}</Label>
          </div>
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={selectedWeeks.length > 0 ? `${selectedWeeks.length} week(s) selected` : "Select weeks"} />
            </SelectTrigger>
            <SelectContent>
              <div className="flex flex-col gap-2 p-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="week16"
                    checked={selectedWeeks.includes("week16")}
                    onCheckedChange={() => handleWeekChange("week16")}
                  />
                  <Label htmlFor="week16">Week 16 (Apr 16-23)</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="week17"
                    checked={selectedWeeks.includes("week17")}
                    onCheckedChange={() => handleWeekChange("week17")}
                  />
                  <Label htmlFor="week17">Week 17 (Apr 24-30)</Label>
                </div>
              </div>
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <ChartContainer config={chartConfig} className="h-96 w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 24,
              right: 24,
              bottom: 24,
              left: 24,
            }}
            height={300}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--muted-foreground))"
              opacity={0.3}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              textAnchor="end"
              height={60}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={6}
              tickFormatter={formatValue}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `${value}`}
                  formatter={(value, name) => [
                    `${formatValue(value)} ${showSeconds ? "seconds" : "ads"}`,
                    chartConfig[name]?.label || name,
                  ]}
                />
              }
            />
            {weekBoundaries.map((boundary, index) => (
              <ReferenceLine
                key={index}
                x={boundary.date}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
                strokeWidth={2}
                label={{
                  value: `End of ${selectedWeeks[index] === "week16" ? "Week 16" : "Week 17"}`,
                  position: "top",
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 10,
                }}
              />
            ))}
            <Line
              type="linear"
              dataKey="hellofm"
              stroke={chartConfig.hellofm.color}
              strokeWidth={3}
              dot={<CustomDot dataKey="hellofm" />}
              activeDot={{ r: 6, stroke: chartConfig.hellofm.color, strokeWidth: 4, fill: "#fff" }}
            />
            <Line
              type="linear"
              dataKey="suryanfm"
              stroke={chartConfig.suryanfm.color}
              strokeWidth={3}
              dot={<CustomDot dataKey="suryanfm" />}
              activeDot={{ r: 6, stroke: chartConfig.suryanfm.color, strokeWidth: 4, fill: "#fff" }}
            />
          </LineChart>
        </ChartContainer>
      }
      footer={
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-4 text-sm">
            {Object.entries(chartConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-muted-foreground">{config.label}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Daily ad {showSeconds ? "duration" : "count"} trends for {selectedWeeks
              .map((week) => (week === "week16" ? "Week 16 (Apr 16-23)" : "Week 17 (Apr 24-30)"))
              .join(" and ")} showing all radio stations
          </p>
        </div>
      }
    />
  );
}