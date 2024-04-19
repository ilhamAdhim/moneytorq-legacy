"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    valueIncome: Math.floor(Math.random() * 5000) + 1000,
    valueExpense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    valueIncome: Math.floor(Math.random() * 5000) + 1000,
    valueExpense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    valueIncome: Math.floor(Math.random() * 5000) + 1000,
    valueExpense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    valueIncome: Math.floor(Math.random() * 5000) + 1000,
    valueExpense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    valueIncome: Math.floor(Math.random() * 5000) + 1000,
    valueExpense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    valueIncome: Math.floor(Math.random() * 5000) + 1000,
    valueExpense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    valueIncome: Math.floor(Math.random() * 5000) + 1000,
    valueExpense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    valueIncome: Math.floor(Math.random() * 5000) + 1000,
    valueExpense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    valueIncome: Math.floor(Math.random() * 5000) + 1000,
    valueExpense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    valueIncome: Math.floor(Math.random() * 5000) + 1000,
    valueExpense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    valueIncome: Math.floor(Math.random() * 5000) + 1000,
    valueExpense: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    valueIncome: Math.floor(Math.random() * 5000) + 1000,
    valueExpense: Math.floor(Math.random() * 5000) + 1000,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart width={730} height={250} data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="5">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis
          tickFormatter={(value: any) => `$${value}`}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area type="monotone" dataKey="valueIncome" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="valueExpense" stroke="#82ca9d" fill="#82ca9d" />
      </AreaChart>
      {/* <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: any) => `$${value}`}
        />
        <Bar
          dataKey="value"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart> */}
    </ResponsiveContainer>
  )
}