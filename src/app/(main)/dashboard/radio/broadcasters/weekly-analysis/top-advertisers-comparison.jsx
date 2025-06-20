"use client";

import { BarChart2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChartCard from "@/components/card/charts-card";
import { week16, week17 } from "./top-ad-data"; // Import the JSON data
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Function to calculate all unique advertisers
const getTopAdvertisers = (week16Data, week17Data) => {
  const combinedBrands = new Set();
  week16Data.forEach((item) => combinedBrands.add(item.Brand));
  week17Data.forEach((item) => combinedBrands.add(item.Brand));
  return Array.from(combinedBrands);
};

// Function to calculate all unique sectors
const getUniqueSectors = (week16Data, week17Data) => {
  const combinedSectors = new Set();
  week16Data.forEach((item) => combinedSectors.add(item.Sector));
  week17Data.forEach((item) => combinedSectors.add(item.Sector));
  return Array.from(combinedSectors);
};

// Get all advertisers and sectors
const topAdvertisers = getTopAdvertisers(week16, week17);
const uniqueSectors = getUniqueSectors(week16, week17);

// Create chart configuration for the advertisers
const chartConfig = {
  hellofm: { label: "Hello FM", color: "hsl(var(--chart-1))" },
  suryanfm: { label: "Suryan FM", color: "hsl(var(--chart-2))" },
  ...Object.fromEntries(
    topAdvertisers.map((adv, index) => [
      adv,
      { label: adv, color: `hsl(var(--chart-${(index % 10) + 1}))` },
    ])
  ),
};

// Prepare data for the chart
const advertiserDataByWeek = {
  week16: {
    hellofm: {
      name: "Hello FM",
      data: week16.map((item) => ({
        advertiser: item.Brand,
        spend: item["Hello FM"] || 0,
        sector: item.Sector,
      })),
    },
    suryanfm: {
      name: "Suryan FM",
      data: week16.map((item) => ({
        advertiser: item.Brand,
        spend: item["Suryan FM"] || 0,
        sector: item.Sector,
      })),
    },
  },
  week17: {
    hellofm: {
      name: "Hello FM",
      data: week17.map((item) => ({
        advertiser: item.Brand,
        spend: item["Hello FM"] || 0,
        sector: item.Sector,
      })),
    },
    suryanfm: {
      name: "Suryan FM",
      data: week17.map((item) => ({
        advertiser: item.Brand,
        spend: item["Suryan FM"] || 0,
        sector: item.Sector,
      })),
    },
  },
};

export default function TopAdvertisersComparison() {
  const [selectedAdvertisers, setSelectedAdvertisers] = useState([topAdvertisers[0]]);
  const [selectedWeek, setSelectedWeek] = useState("week16");
  const [selectedSector, setSelectedSector] = useState("all");
  const [showTable, setShowTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get current week's data
  const currentWeekData = advertiserDataByWeek[selectedWeek];

  // Prepare data for horizontal stacked chart
  const chartData = [
    {
      station: "hellofm",
      ...Object.fromEntries(
        topAdvertisers.map((adv) => [
          adv,
          selectedAdvertisers.includes(adv)
            ? currentWeekData["hellofm"].data.find((d) => d.advertiser === adv)?.spend || 0
            : 0,
        ])
      ),
    },
    {
      station: "suryanfm",
      ...Object.fromEntries(
        topAdvertisers.map((adv) => [
          adv,
          selectedAdvertisers.includes(adv)
            ? currentWeekData["suryanfm"].data.find((d) => d.advertiser === adv)?.spend || 0
            : 0,
        ])
      ),
    },
  ];

  // Prepare data for table with sector filter
  const tableData = topAdvertisers
    .filter((adv) => {
      const weekData = selectedWeek === "week16" ? week16 : week17;
      const advertiserData = weekData.find((item) => item.Brand === adv);
      const matchesSector = selectedSector === "all" || advertiserData?.Sector === selectedSector;
      const matchesSearch = adv.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSector && matchesSearch;
    })
    .map((adv) => {
      const weekData = selectedWeek === "week16" ? week16 : week17;
      const advertiserData = weekData.find((item) => item.Brand === adv);
      return {
        advertiser: adv,
        hellofm: currentWeekData["hellofm"].data.find((d) => d.advertiser === adv)?.spend || 0,
        suryanfm: currentWeekData["suryanfm"].data.find((d) => d.advertiser === adv)?.spend || 0,
        sector: advertiserData?.Sector || "Unknown",
      };
    });

  // Pagination logic
  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (value) => {
    return `${value.toFixed(0)} Plays`; // Adjust based on what the numbers represent
  };

  const handleAdvertiserSelectChange = (value) => {
    if (value === "all") {
      setSelectedAdvertisers(topAdvertisers);
      setSearchTerm(""); // Clear search term when selecting "all"
    } else {
      setSelectedAdvertisers([value]);
      setSearchTerm(""); // Clear search term when selecting a specific advertiser
    }
    setCurrentPage(1); // Reset to first page
  };

  const handleWeekSelectChange = (value) => {
    setSelectedWeek(value);
    setCurrentPage(1); // Reset to first page when week changes
  };

  const handleSectorSelectChange = (value) => {
    setSelectedSector(value);
    setCurrentPage(1); // Reset to first page when sector changes
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <ChartCard
      icon={<BarChart2 className="w-6 h-6" />}
      title="Top Advertisers Comparison"
      description={`Your Station vs. Competitors - ${selectedWeek === "week16" ? "Week 16" : "Week 17"} 2024`}
      action={
        <div className="flex gap-2 items-center justify-end">
          <Select onValueChange={handleWeekSelectChange} defaultValue="week16">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week16">Week 16</SelectItem>
              <SelectItem value="week17">Week 17</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={handleSectorSelectChange} defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {uniqueSectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleAdvertiserSelectChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select or search advertiser" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <Input
                  placeholder="Search advertisers..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="mb-2"
                />
              </div>
              <SelectItem value="all">All Advertisers</SelectItem>
              {topAdvertisers
                .filter((adv) => {
                  const weekData = selectedWeek === "week16" ? week16 : week17;
                  const advertiserData = weekData.find((item) => item.Brand === adv);
                  return (
                    adv.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (selectedSector === "all" || advertiserData?.Sector === selectedSector)
                  );
                })
                .map((adv) => (
                  <SelectItem key={adv} value={adv}>
                    {adv}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Advertiser</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Hello FM</TableHead>
                <TableHead>Suryan FM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row.advertiser}>
                  <TableCell>{row.advertiser}</TableCell>
                  <TableCell>{row.sector}</TableCell>
                  <TableCell>{formatCurrency(row.hellofm)}</TableCell>
                  <TableCell>{formatCurrency(row.suryanfm)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      }
      footer={
        <div className="flex w-full justify-between items-center text-sm text-gray-500">
          <p>
            Showing {paginatedData.length} of {totalItems} advertisers for {selectedWeek === "week16" ? "Week 16" : "Week 17"}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      }
    />
  );
}