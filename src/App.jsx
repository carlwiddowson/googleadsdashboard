import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  MousePointer, 
  Eye,
  Settings,
  Bell,
  RefreshCw,
  AlertCircle,
  Activity
} from 'lucide-react'
import GoogleAdsService from './services/googleAdsService'
import GoogleAuthService from './services/googleAuthService'
import AuthComponent, { AuthCallback } from './components/AuthComponent'
import { CampaignPerformanceChart, CostTrendChart, CampaignTypeChart } from './components/Charts'

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState({
    accountMetrics: null,
    campaigns: [],
    keywords: []
  })
  
  const [googleAdsService] = useState(new GoogleAdsService())
  const [googleAuthService] = useState(new GoogleAuthService())

  // Check if this is the OAuth callback page
  const isCallbackPage = window.location.pathname === '/auth/callback' || window.location.search.includes('code=')

  useEffect(() => {
    if (isAuthenticated && !isCallbackPage) {
      loadDashboardData()
    }
  }, [isAuthenticated, isCallbackPage])

  const handleAuthChange = async (authenticated) => {
    setIsAuthenticated(authenticated)
    if (authenticated) {
      const accessToken = await googleAuthService.getAccessToken()
      if (accessToken) {
        googleAdsService.setAccessToken(accessToken)
      }
    }
  }

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [accountMetrics, campaigns, keywords] = await Promise.all([
        googleAdsService.getAccountMetrics(),
        googleAdsService.getCampaigns(),
        googleAdsService.getKeywords()
      ])

      setData({
        accountMetrics,
        campaigns,
        keywords
      })
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('Failed to load Google Ads data. Using demo data instead.')
      
      // Load mock data as fallback
      const accountMetrics = googleAdsService.getMockAccountMetrics()
      const campaigns = googleAdsService.getMockCampaigns()
      const keywords = googleAdsService.getMockKeywords()
      
      setData({
        accountMetrics,
        campaigns,
        keywords
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    if (isAuthenticated) {
      loadDashboardData()
    }
  }

  // Handle OAuth callback
  if (isCallbackPage) {
    return <AuthCallback />
  }

  const stats = data.accountMetrics ? [
    { 
      title: 'Total Spend', 
      value: `$${data.accountMetrics.totalSpend}`, 
      change: '+12%', 
      icon: DollarSign, 
      color: 'text-green-600' 
    },
    { 
      title: 'Impressions', 
      value: data.accountMetrics.totalImpressions, 
      change: '+8%', 
      icon: Eye, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Clicks', 
      value: data.accountMetrics.totalClicks, 
      change: '+15%', 
      icon: MousePointer, 
      color: 'text-purple-600' 
    },
    { 
      title: 'Conversions', 
      value: data.accountMetrics.totalConversions, 
      change: '+22%', 
      icon: Users, 
      color: 'text-orange-600' 
    },
  ] : []

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
              <AuthComponent onAuthChange={handleAuthChange} />
              {isAuthenticated && (
                <button 
                  onClick={refreshData}
                  disabled={loading}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  title="Refresh data"
                >
                  <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              )}
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
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-yellow-800">{error}</p>
            </div>
          </div>
        )}

        {/* Authentication Required */}
        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <Activity className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2 text-blue-900">Connect Your Google Ads Account</h2>
            <p className="text-blue-700 mb-4">
              To view your real Google Ads data, please connect your account using the button in the header.
            </p>
            <p className="text-sm text-blue-600">
              Demo data is shown below for preview purposes.
            </p>
          </div>
        )}

        {/* Stats Grid */}
        {stats.length > 0 && (
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
        )}

        {/* Content Area */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              {data.campaigns.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CampaignPerformanceChart campaigns={data.campaigns} />
                  <CostTrendChart campaigns={data.campaigns} />
                </div>
              )}
              
              {data.campaigns.length > 0 && (
                <CampaignTypeChart campaigns={data.campaigns} />
              )}
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Account Overview</h2>
                <div className="text-gray-600">
                  <p className="mb-4">
                    {isAuthenticated 
                      ? 'Your Google Ads account overview with real-time data.' 
                      : 'Demo overview of Google Ads dashboard. Connect your account for real data.'
                    }
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Account Status</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${isAuthenticated ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        {isAuthenticated ? 'Connected to Google Ads API' : 'Using demo data - connect for live data'}
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        {data.campaigns.length} active campaigns
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        {data.keywords.length} keywords tracked
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'campaigns' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Campaign Management</h2>
                {data.campaigns.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.campaigns.map((campaign, index) => (
                          <tr key={campaign.id || index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                campaign.status === 'ENABLED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {campaign.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.impressions.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.clicks.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${campaign.cost}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.conversions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No campaign data available. Connect your Google Ads account to view campaigns.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'keywords' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Keyword Performance</h2>
                {data.keywords.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPC</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.keywords.slice(0, 10).map((keyword, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{keyword.keyword}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{keyword.matchType}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{keyword.campaign}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{keyword.impressions.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{keyword.clicks.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{keyword.ctr}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${keyword.cpc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No keyword data available. Connect your Google Ads account to view keywords.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Reports</h2>
                <div className="text-gray-600">
                  <p className="mb-4">Generate comprehensive reports for your campaigns and keywords.</p>
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-medium text-blue-900 mb-2">Available Reports</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Campaign performance summary</li>
                          <li>• Keyword analysis report</li>
                          <li>• Cost and conversion tracking</li>
                          <li>• Monthly trend analysis</li>
                        </ul>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Generate Report
                      </button>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800">Connect your Google Ads account to generate custom reports.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
