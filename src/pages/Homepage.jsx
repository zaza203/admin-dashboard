import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const Homepage = ({ properties, users, chats, ratings, favorites }) => {
  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Properties Uploaded Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={properties}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dateCreated" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Property Views</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={properties}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">User Registrations Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={users}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dateCreated" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Chats Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#0088FE" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Ratings Per Property</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ratings}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="propertyTitle" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="rating" fill="#FFBB28" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Favorites Per Property</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={favorites}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="propertyTitle" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="favorites" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Homepage;
