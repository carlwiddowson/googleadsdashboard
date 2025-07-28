import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export const CampaignPerformanceChart = ({ campaigns }) => {
  const data = campaigns.slice(0, 5).map(campaign => ({
    name: campaign.name.length > 15 ? campaign.name.substring(0, 15) + '...' : campaign.name,
    impressions: campaign.impressions,
    clicks: campaign.clicks,
    cost: parseFloat(campaign.cost),
    conversions: campaign.conversions
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Campaign Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="impressions" fill="#3B82F6" name="Impressions" />
          <Bar dataKey="clicks" fill="#10B981" name="Clicks" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CostTrendChart = ({ campaigns }) => {
  const data = campaigns.map(campaign => ({
    name: campaign.name.length > 10 ? campaign.name.substring(0, 10) + '...' : campaign.name,
    cost: parseFloat(campaign.cost),
    conversions: campaign.conversions
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Cost vs Conversions</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="cost" stroke="#EF4444" name="Cost ($)" />
          <Line type="monotone" dataKey="conversions" stroke="#8B5CF6" name="Conversions" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CampaignTypeChart = ({ campaigns }) => {
  const typeData = campaigns.reduce((acc, campaign) => {
    const type = campaign.type || 'UNKNOWN';
    acc[type] = (acc[type] || 0) + parseFloat(campaign.cost);
    return acc;
  }, {});

  const data = Object.entries(typeData).map(([type, cost]) => ({
    name: type,
    value: cost
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Spend by Campaign Type</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Spend']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
