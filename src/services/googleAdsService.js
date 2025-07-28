import axios from 'axios';

class GoogleAdsService {
  constructor() {
    this.baseURL = 'https://googleads.googleapis.com/v17';
    this.customerId = import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID || '6721897224';
    this.developerToken = import.meta.env.VITE_GOOGLE_MCC_TOKEN || 'FCabA0LrjOnj7QAMx9w_TQ';
  }

  // Initialize with access token (obtained from OAuth flow)
  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  // Get authorization headers
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'developer-token': this.developerToken,
      'Content-Type': 'application/json',
    };
  }

  // Search campaigns
  async getCampaigns() {
    try {
      const query = `
        SELECT 
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.advertising_channel_type,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.ctr,
          metrics.average_cpc
        FROM campaign 
        WHERE campaign.status = 'ENABLED'
        ORDER BY metrics.impressions DESC
        LIMIT 50
      `;

      const response = await axios.post(
        `${this.baseURL}/customers/${this.customerId}/googleAds:searchStream`,
        {
          query: query
        },
        {
          headers: this.getHeaders()
        }
      );

      return this.processCampaignData(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return this.getMockCampaigns();
    }
  }

  // Get account performance metrics
  async getAccountMetrics() {
    try {
      const query = `
        SELECT 
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.ctr,
          metrics.average_cpc,
          segments.date
        FROM customer 
        WHERE segments.date DURING LAST_30_DAYS
        ORDER BY segments.date DESC
      `;

      const response = await axios.post(
        `${this.baseURL}/customers/${this.customerId}/googleAds:searchStream`,
        {
          query: query
        },
        {
          headers: this.getHeaders()
        }
      );

      return this.processAccountMetrics(response.data);
    } catch (error) {
      console.error('Error fetching account metrics:', error);
      return this.getMockAccountMetrics();
    }
  }

  // Get keywords performance
  async getKeywords() {
    try {
      const query = `
        SELECT 
          ad_group_criterion.keyword.text,
          ad_group_criterion.keyword.match_type,
          campaign.name,
          ad_group.name,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.ctr,
          metrics.average_cpc
        FROM keyword_view 
        WHERE ad_group_criterion.status = 'ENABLED'
        AND campaign.status = 'ENABLED'
        ORDER BY metrics.impressions DESC
        LIMIT 100
      `;

      const response = await axios.post(
        `${this.baseURL}/customers/${this.customerId}/googleAds:searchStream`,
        {
          query: query
        },
        {
          headers: this.getHeaders()
        }
      );

      return this.processKeywordData(response.data);
    } catch (error) {
      console.error('Error fetching keywords:', error);
      return this.getMockKeywords();
    }
  }

  // Process campaign data from API response
  processCampaignData(data) {
    if (!data || !data.results) return [];
    
    return data.results.map(result => ({
      id: result.campaign?.id || 'N/A',
      name: result.campaign?.name || 'Unknown Campaign',
      status: result.campaign?.status || 'UNKNOWN',
      type: result.campaign?.advertisingChannelType || 'UNKNOWN',
      impressions: parseInt(result.metrics?.impressions || 0),
      clicks: parseInt(result.metrics?.clicks || 0),
      cost: (parseInt(result.metrics?.costMicros || 0) / 1000000).toFixed(2),
      conversions: parseInt(result.metrics?.conversions || 0),
      ctr: parseFloat(result.metrics?.ctr || 0).toFixed(2),
      cpc: (parseInt(result.metrics?.averageCpc || 0) / 1000000).toFixed(2)
    }));
  }

  // Process account metrics
  processAccountMetrics(data) {
    if (!data || !data.results) return this.getMockAccountMetrics();

    const totals = data.results.reduce((acc, result) => ({
      impressions: acc.impressions + parseInt(result.metrics?.impressions || 0),
      clicks: acc.clicks + parseInt(result.metrics?.clicks || 0),
      cost: acc.cost + (parseInt(result.metrics?.costMicros || 0) / 1000000),
      conversions: acc.conversions + parseInt(result.metrics?.conversions || 0)
    }), { impressions: 0, clicks: 0, cost: 0, conversions: 0 });

    return {
      totalSpend: totals.cost.toFixed(2),
      totalImpressions: totals.impressions.toLocaleString(),
      totalClicks: totals.clicks.toLocaleString(),
      totalConversions: totals.conversions.toLocaleString(),
      averageCtr: totals.clicks > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : '0.00',
      averageCpc: totals.clicks > 0 ? (totals.cost / totals.clicks).toFixed(2) : '0.00'
    };
  }

  // Process keyword data
  processKeywordData(data) {
    if (!data || !data.results) return [];
    
    return data.results.map(result => ({
      keyword: result.adGroupCriterion?.keyword?.text || 'N/A',
      matchType: result.adGroupCriterion?.keyword?.matchType || 'UNKNOWN',
      campaign: result.campaign?.name || 'Unknown Campaign',
      adGroup: result.adGroup?.name || 'Unknown Ad Group',
      impressions: parseInt(result.metrics?.impressions || 0),
      clicks: parseInt(result.metrics?.clicks || 0),
      cost: (parseInt(result.metrics?.costMicros || 0) / 1000000).toFixed(2),
      conversions: parseInt(result.metrics?.conversions || 0),
      ctr: parseFloat(result.metrics?.ctr || 0).toFixed(2),
      cpc: (parseInt(result.metrics?.averageCpc || 0) / 1000000).toFixed(2)
    }));
  }

  // Mock data fallback methods
  getMockCampaigns() {
    return [
      {
        id: '1',
        name: 'Summer Sale 2024',
        status: 'ENABLED',
        type: 'SEARCH',
        impressions: 125000,
        clicks: 3500,
        cost: '1250.00',
        conversions: 85,
        ctr: '2.80',
        cpc: '0.36'
      },
      {
        id: '2',
        name: 'Brand Campaign',
        status: 'ENABLED',
        type: 'SEARCH',
        impressions: 89000,
        clicks: 2800,
        cost: '890.00',
        conversions: 65,
        ctr: '3.15',
        cpc: '0.32'
      },
      {
        id: '3',
        name: 'Product Showcase',
        status: 'ENABLED',
        type: 'DISPLAY',
        impressions: 245000,
        clicks: 1200,
        cost: '420.00',
        conversions: 25,
        ctr: '0.49',
        cpc: '0.35'
      }
    ];
  }

  getMockAccountMetrics() {
    return {
      totalSpend: '12,345.67',
      totalImpressions: '2,145,000',
      totalClicks: '45,200',
      totalConversions: '1,234',
      averageCtr: '2.11',
      averageCpc: '0.27'
    };
  }

  getMockKeywords() {
    return [
      {
        keyword: 'google ads dashboard',
        matchType: 'EXACT',
        campaign: 'Brand Campaign',
        adGroup: 'Brand Terms',
        impressions: 15000,
        clicks: 850,
        cost: '255.00',
        conversions: 25,
        ctr: '5.67',
        cpc: '0.30'
      },
      {
        keyword: 'advertising platform',
        matchType: 'PHRASE',
        campaign: 'Summer Sale 2024',
        adGroup: 'Generic Terms',
        impressions: 32000,
        clicks: 1200,
        cost: '480.00',
        conversions: 35,
        ctr: '3.75',
        cpc: '0.40'
      },
      {
        keyword: 'marketing tools',
        matchType: 'BROAD',
        campaign: 'Product Showcase',
        adGroup: 'Tool Keywords',
        impressions: 8500,
        clicks: 320,
        cost: '128.00',
        conversions: 8,
        ctr: '3.76',
        cpc: '0.40'
      }
    ];
  }
}

export default GoogleAdsService;
