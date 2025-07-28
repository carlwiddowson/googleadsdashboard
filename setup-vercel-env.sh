#!/bin/bash

# Vercel Environment Variables Setup Script
# Run this after installing Vercel CLI: npm i -g vercel

echo "Setting up Vercel environment variables..."
echo "Make sure you're logged in to Vercel CLI first: vercel login"
echo ""

# Frontend variables (safe for client-side)
echo "Setting frontend environment variables..."
vercel env add GOOGLE_ADS_CLIENT_ID production
vercel env add GOOGLE_MCC_TOKEN production  
vercel env add GOOGLE_OAUTH_CLIENT_ID production
vercel env add GOOGLE_OAUTH_REDIRECT_URI production

echo ""
echo "Setting backend environment variables (sensitive)..."
# Backend variables (server-only)
vercel env add GOOGLE_ADS_CLIENT_SECRET production
vercel env add GOOGLE_ADS_DEVELOPER_TOKEN production
vercel env add GOOGLE_ADS_CUSTOMER_ID production

echo ""
echo "Environment variables setup complete!"
echo "Don't forget to also set these for 'preview' and 'development' environments if needed."
echo ""
echo "To deploy: vercel --prod"
