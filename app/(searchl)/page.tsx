"use client";
import Organization from "@/components/Organization";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const [orgs, setOrgs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topQueries, setTopQueries] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const searchParams = useSearchParams();
  const page = parseInt(searchParams?.get('page') || '1');

  const fetchData = async (page: number) => {
    try {
      const [orgResponse, queriesResponse] = await Promise.all([
        fetch(`/api/organization?page=${page}&limit=15`),
        fetch("/api/queries"),
        fetch('/api/organization?countries')
      ]);

      if (!orgResponse.ok || !queriesResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const orgData = await orgResponse.json();
      const queriesData = await queriesResponse.json();

      setOrgs(orgData.organizations);
      setTotalPages(orgData.totalPages);
      setCurrentPage(orgData.currentPage);
      processCountryData(orgData.countries);

      // Process and set top queries
      const queryCount = {};
      queriesData.forEach(q => {
        queryCount[q.query] = (queryCount[q.query] || 0) + 1;
      });
      const sortedQueries = Object.entries(queryCount)
      //@ts-ignore
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));
      //@ts-ignore
      setTopQueries(sortedQueries);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data. Please try again later.");
      setIsLoading(false);
    }
  };

  const processCountryData = (organizations) => {
    
    const countries = {};
    organizations.forEach(org => {
    console.log(org.country);

      if (org.country) {
        countries[org.country] = (countries[org.country] || 0) + 1;
      }
    });
    //@ts-ignore
    setCountryData(Object.entries(countries).map(([name, value]) => ({ name, value })));
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold mb-6">Climateurope2 Dashboard</h1>
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white bg-opacity-90 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-black">Top queries</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topQueries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-black">Organizations by Country</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={countryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {countryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Organization List</h2>
        <Organization 
          initialOrganizations={orgs} 
          totalPages={totalPages} 
          currentPage={currentPage} 
        />
      </div>
    </div>
  );
}