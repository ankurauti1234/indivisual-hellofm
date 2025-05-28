"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Calendar,
  CreditCard,
  Users,
  CheckSquare,
  ScrollText,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const StatCards = () => {
  const [selectedWeek, setSelectedWeek] = useState("Week 1");

  // Data for Week 1
  const week1Data = {
    topRadioStation: "Suryan FM",
    totalAdsDuration: "~1228 mins",
    topAd: "Sarathas Clothing",
    adCountTopAd: "706",
  };

  // Data for Week 2
  const week2Data = {
    topRadioStation: "Hello FM",
    totalAdsDuration: "~1986 mins",
    topAd: "Sarathas Clothing",
    adCountTopAd: "1033",
  };

  // Select data based on the current week
  const currentData = selectedWeek === "Week 1" ? week1Data : week2Data;

  const summaryCards = [
    {
      title: "AD Count of Top AD",
      value: currentData.adCountTopAd,
      isPositive: true,
      icon: <ScrollText className="text-gray-600" size={20} />,
    },
    {
      title: "Top Radio Station",
      value: currentData.topRadioStation,
      trend: selectedWeek === "Week 1" ? "+2.5%" : "+3.4%", // Example trends, adjust as needed
      isPositive: true,
      icon: <CheckSquare className="text-gray-600" size={20} />,
    },
    {
      title: "Top Ad",
      value: currentData.topAd,
      isPositive: true,
      icon: <Users className="text-gray-600" size={20} />,
    },
    {
      title: "Total ADs Duration of Top Radio Station",
      value: currentData.totalAdsDuration,
      icon: <BarChart className="text-gray-600" size={20} />,
    },
    {
      title: "Popular Songs",
      items: [
        "Aaj Ki Raat (Stree 2)",
        "Kesariya (Brahmastra)",
        "Apna Bana Le (Bhediya)",
      ],
      icon: <Calendar className="text-gray-600" size={20} />,
      trend: "+2.1%",
      isPositive: true,
    },
    {
      title: "Popular Program",
      items: ["Hum Tum", "Salam Ahmednagar", "Happy Evening"],
      trend: "-0.2%",
      isPositive: false,
      icon: <CreditCard className="text-gray-600" size={20} />,
    },
  ];

  const renderTrend = (trend, isPositive) => {
    if (!trend) return null;
    const color = isPositive ? "text-green-500" : "text-red-500";
    const Icon = isPositive ? ArrowUp : ArrowDown;
    return (
      <div className={`flex items-center text-sm ${color} mt-2`}>
        <Icon size={16} className="mr-1" />
        <span>{trend}</span>
        <span className="text-gray-400 text-xs ml-1">since last month</span>
      </div>
    );
  };

  return (
    <div className="">
      {/* Toggle Buttons */}
      <div className="flex justify-center mb-4">
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

      <div className="grid grid-cols-1">
        {/* Left side: 2x2 grid */}
        <div className="grid grid-cols-2 lg:col-span-2">
          {summaryCards.slice(0, 4).map((card, index) => (
            <Card key={index} className="rounded-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>
                    <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
                    {renderTrend(card.trend, card.isPositive)}
                  </div>
                  <div className="p-2 bg-accent rounded-lg">{card.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right side: Popular Songs and Popular Program */}
        
      </div>
    </div>
  );
};

export default StatCards;