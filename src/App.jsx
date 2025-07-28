import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  MousePointer, 
  Eye,
  Settings,
  Bell
} from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { title: 'Total Spend', value: '$12,345', change: '+12%', icon: DollarSign, color: 'text-green-600' },
    { title: 'Impressions', value: '2.1M', change: '+8%', icon: Eye, color: 'text-blue-600' },
    { title: 'Clicks', value: '45.2K', change: '+15%', icon: MousePointer, color: 'text-purple-600' },
    { title: 'Conversions', value: '1,234', change: '+22%', icon: Users, color: 'text-orange-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Google Ads Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['overview', 'campaigns', 'keywords', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard
            </h2>
            <div className="text-gray-600">
              {activeTab === 'overview' && (
                <div>
                  <p className="mb-4">Welcome to your Google Ads dashboard overview. Here you can monitor your campaign performance at a glance.</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Recent Activity</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Campaign "Summer Sale 2024" performance increased by 15%</li>
                      <li>• New keyword "google ads dashboard" added to campaign</li>
                      <li>• Budget adjustment for "Brand Campaign" completed</li>
                    </ul>
                  </div>
                </div>
              )}
              {activeTab === 'campaigns' && (
                <div>
                  <p>Manage and monitor your Google Ads campaigns here.</p>
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">Campaign management features coming soon!</p>
                  </div>
                </div>
              )}
              {activeTab === 'keywords' && (
                <div>
                  <p>View and optimize your keyword performance.</p>
                  <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-purple-800">Keyword analysis tools coming soon!</p>
                  </div>
                </div>
              )}
              {activeTab === 'reports' && (
                <div>
                  <p>Generate comprehensive reports for your campaigns.</p>
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800">Advanced reporting features coming soon!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
