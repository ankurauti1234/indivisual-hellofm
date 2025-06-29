"use client";

import { AlertCircle } from "lucide-react";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ChartCard from "@/components/card/charts-card";

// New advertiser data for each station (Week 17: 16-04-2025 to 30-04-2025)
const newAdvertiserData = {
  hellofm: {
    name: "Hello FM",
    advertisers: [
      "ANDAVAR PLUS",
      "CARE COLLEGE OF ENGINEERING",
      "DARLING SHOWROOM",
      "KARUR VYSYA BANK",
      "MANGAL AND MANGAL FURNITURE",
      "NEHRU MEMORIAL COLLEGE",
      "NEW LAKSHMI JEWELLERY TRICHY",
      "NR THANGA MALIGAI",
      "RETRO MOVIE AD",
      "ROYAL FURNITURE",
      "SARASWATHI VIDYALAYA SCHOOL",
      "SHREE GOKULAM JEWELS",
      "SRI MAHAMAAYI JEWELLERS",
      "SRI MOOGAMBIGAI JEWELLERS",
      "TANISHQ JEWELLERY",
    ],
  },
  suryanfm: {
    name: "Suryan FM",
    advertisers: [
      "BE-RITE SUNFLOWER OIL",
      "BISHOP COLLEGE",
      "CARE COLLEGE OF ENGINEERING",
      "FEDERAL BANK",
      "GOPALDAS JEWELLERS&CO",
      "JOBFAIR",
      "JODI PREMIUM JEWELLERY",
      "KARUR VYSYA BANK",
      "MERIDIAN RAMYAS HOTEL",
      "NATIONAL COLLEGE",
      "RAMYAS HOTELS",
      "RETRO MOVIE AD",
      "ROYAL FURNITURE",
      "SARASWATHI VIDYALAYA SCHOOL",
      "SMART BAZAAR",
      "TANISHQ JEWELLERY",
      "TNN GOLD&DIAMONDS",
    ],
  },
};

// Available stations
const stationOptions = [
  { value: "hellofm", label: "Hello FM" },
  { value: "suryanfm", label: "Suryan FM" },
];

// Available weeks
const weekOptions = [
  { value: "week16", label: "Week 16" },
  { value: "week17", label: "Week 17" },
];

export default function NewAdvertisersAlerts() {
  const [selectedStations, setSelectedStations] = useState(["hellofm"]);
  const [selectedWeek, setSelectedWeek] = useState("week17");

  // Handle station selection
  const handleStationChange = (station) => {
    if (selectedStations.includes(station)) {
      // Prevent deselecting the last station
      if (selectedStations.length > 1) {
        setSelectedStations(selectedStations.filter((s) => s !== station));
      }
    } else {
      setSelectedStations([...selectedStations, station]);
    }
  };

  const handleWeekChange = (value) => {
    setSelectedWeek(value);
  };

  // Get data for selected stations
  const selectedData =
    selectedWeek === "week17"
      ? selectedStations.map((station) => ({
          name: newAdvertiserData[station].name,
          advertisers: newAdvertiserData[station].advertisers,
        }))
      : [];

  // Combine advertisers from all selected stations and remove duplicates
  const combinedAdvertisers = Array.from(
    new Set(selectedData.flatMap((data) => data.advertisers))
  );

  return (
    <ChartCard
      icon={<AlertCircle className="w-6 h-6" />}
      title="New Advertiser Alerts"
      description="Brands Recently Appearing on Competitors (16-04-2025 to 30-04-2025)"
      action={
        <div className="flex justify-end space-x-4">
          <Select onValueChange={handleWeekChange} defaultValue="week17">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              {weekOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select stations" />
              </SelectTrigger>
              <SelectContent>
                {stationOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center px-2 py-1"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStations.includes(option.value)}
                      onChange={() => handleStationChange(option.value)}
                      className="mr-2"
                    />
                    <span>{option.label}</span>
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      chart={
        <div className="w-full">
          {selectedWeek === "week16" ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-500 text-lg">
                No previous week data available
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">#</th>
                    <th className="text-left p-3 font-semibold">
                      New Advertiser
                    </th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Stations</th>
                  </tr>
                </thead>
                <tbody>
                  {combinedAdvertisers.map((advertiser, index) => (
                    <tr key={advertiser} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm text-gray-600">{index + 1}</td>
                      <td className="p-3 font-medium">{advertiser}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          New
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {selectedData
                          .filter((data) =>
                            data.advertisers.includes(advertiser)
                          )
                          .map((data) => data.name)
                          .join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      }
      footer={
        selectedWeek === "week16" ? null : (
          <p className="text-sm text-gray-500">
            Total: {combinedAdvertisers.length} new advertisers across{" "}
            {selectedStations.length} station(s)
          </p>
        )
      }
    />
  );
}
