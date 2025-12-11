import React from 'react'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './Dashboard.css'

const Dashboard = () => {
  const revenueData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
  ]

  const salesData = [
    { name: 'Mon', sales: 120 },
    { name: 'Tue', sales: 190 },
    { name: 'Wed', sales: 300 },
    { name: 'Thu', sales: 280 },
    { name: 'Fri', sales: 189 },
    { name: 'Sat', sales: 239 },
    { name: 'Sun', sales: 349 },
  ]

  const userData = [
    { name: 'Week 1', users: 400, new: 100 },
    { name: 'Week 2', users: 600, new: 150 },
    { name: 'Week 3', users: 800, new: 200 },
    { name: 'Week 4', users: 1000, new: 250 },
  ]

  const stats = [
    { title: 'Total Revenue', value: '$45,231', change: '+20.1%', trend: 'up' },
    { title: 'Active Users', value: '2,350', change: '+15.3%', trend: 'up' },
    { title: 'Sales', value: '1,234', change: '+12.5%', trend: 'up' },
    { title: 'Conversion Rate', value: '3.2%', change: '-2.4%', trend: 'down' },
  ]

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Demo Dashboard</h1>
        <p>Welcome to your analytics dashboard</p>
      </header>

      <div className="dashboard-content">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-header">
                <h3>{stat.title}</h3>
              </div>
              <div className="stat-body">
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.trend}`}>
                  {stat.change} from last month
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h2>Revenue Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#667eea" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>Weekly Sales</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="sales" fill="#764ba2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card full-width">
          <h2>User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#667eea" 
                strokeWidth={3}
                dot={{ fill: '#667eea', r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="new" 
                stroke="#764ba2" 
                strokeWidth={3}
                dot={{ fill: '#764ba2', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

