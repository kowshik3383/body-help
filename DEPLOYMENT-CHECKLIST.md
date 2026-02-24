# Diagnova Deployment Checklist

## Pre-Deployment Steps

### 1. Environment Variables

Ensure all environment variables are set in production:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/diagnova?retryWrites=true&w=majority
GEMINI_API_KEY=your_production_gemini_api_key
NODE_ENV=production
```

### 2. MongoDB Setup

- [ ] Create production MongoDB cluster
- [ ] Set up database user with appropriate permissions
- [ ] Configure IP whitelist (allow connections from deployment platform)
- [ ] Create database indexes (automatic on first run)
- [ ] Set up backup strategy
- [ ] Configure monitoring alerts

### 3. API Key Management

- [ ] Generate production Gemini API key
- [ ] Set up billing alerts for API usage
- [ ] Configure rate limiting if needed
- [ ] Monitor quota usage

### 4. Code Quality

- [ ] Run TypeScript type checking: `pnpm tsc --noEmit`
- [ ] Run linting: `pnpm lint`
- [ ] Test build: `pnpm build`
- [ ] Remove console.log statements (or configure proper logging)

### 5. Security

- [ ] Review and secure all API endpoints
- [ ] Implement rate limiting on sensitive endpoints
- [ ] Add CORS configuration if needed
- [ ] Review user data encryption
- [ ] Set up proper error handling (don't expose sensitive data)

### 6. Performance

- [ ] Enable Next.js production optimizations
- [ ] Configure CDN for static assets
- [ ] Set up image optimization
- [ ] Enable compression
- [ ] Configure caching headers

---

## Deployment Platforms

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   vercel
   ```

2. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add `MONGODB_URI`
   - Add `GEMINI_API_KEY`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Alternative: Railway

1. **Create New Project**
2. **Add Environment Variables**
3. **Deploy from GitHub**

### Alternative: AWS Amplify

1. **Connect Repository**
2. **Configure Build Settings**
3. **Add Environment Variables**
4. **Deploy**

---

## Post-Deployment Verification

### 1. Test Onboarding Flow

- [ ] Visit `/onboarding`
- [ ] Complete all 3 steps
- [ ] Verify user is created in MongoDB
- [ ] Verify redirect to home page

### 2. Test Profile Management

- [ ] Visit `/profile`
- [ ] Edit language
- [ ] Edit health goal
- [ ] Verify changes are saved to MongoDB
- [ ] Verify language change triggers cache clear

### 3. Test Disease Generation

- [ ] Select a body part
- [ ] Verify diseases are generated with demographics
- [ ] Change age/gender (via profile) and test again
- [ ] Verify different diseases are prioritized
- [ ] Test multiple languages

### 4. Test AI Model Rotation

- [ ] Monitor API logs for model rotation
- [ ] Intentionally trigger rate limit
- [ ] Verify automatic fallback works
- [ ] Check MongoDB cache is being used

### 5. Test Multilingual Updates

- [ ] Change language in profile
- [ ] Verify global language updates instantly
- [ ] Verify disease cache clears
- [ ] Verify new diseases are in selected language

---

## Monitoring & Maintenance

### 1. Set Up Monitoring

- [ ] MongoDB Atlas monitoring
- [ ] Application performance monitoring (APM)
- [ ] Error tracking (Sentry recommended)
- [ ] API usage tracking (Gemini dashboard)

### 2. Database Maintenance

- [ ] Review TTL index effectiveness (disease_cache)
- [ ] Monitor database size
- [ ] Set up automated backups
- [ ] Plan for data archival

### 3. User Support

- [ ] Set up user feedback mechanism
- [ ] Monitor onboarding completion rates
- [ ] Track language usage distribution
- [ ] Monitor API error rates

---

## Scaling Considerations

### When to Scale

- **Database**: > 10,000 active users
- **AI API**: > 1,000 requests/day (consider caching optimization)
- **Server**: > 100 concurrent users

### Scaling Strategies

1. **Database**
   - Upgrade to dedicated cluster
   - Implement read replicas
   - Add sharding for user data

2. **AI API**
   - Increase cache TTL
   - Implement smarter caching (similar queries)
   - Consider batching requests

3. **Application**
   - Enable edge caching
   - Implement CDN for static assets
   - Add load balancing

---

## Troubleshooting Common Issues

### Users Stuck in Onboarding Loop

**Cause**: User created but `onboarded` not set to `true`

**Fix**:
```javascript
// Run in MongoDB shell
db.users.updateMany(
  { onboarded: { $exists: false } },
  { $set: { onboarded: true } }
)
```

### Diseases Not Updating After Language Change

**Cause**: Cache not clearing or event listener not working

**Fix**:
1. Check browser console for `language-changed` event
2. Clear MongoDB disease_cache collection manually
3. Verify `LanguageContext` is properly configured

### AI Rate Limit Errors

**Cause**: Too many requests to Gemini API

**Fix**:
1. Check model rotation is working
2. Increase cache TTL
3. Consider implementing request queuing

### MongoDB Connection Timeout

**Cause**: IP not whitelisted or connection string incorrect

**Fix**:
1. Verify IP whitelist in MongoDB Atlas
2. Check connection string format
3. Test connection from deployment environment

---

## Backup & Recovery

### Daily Backups

Set up automated daily backups in MongoDB Atlas:
1. Go to Cluster → Backup
2. Enable continuous backup
3. Set retention period (7 days minimum)

### Recovery Procedure

In case of data loss:
1. Restore from latest backup
2. Verify data integrity
3. Clear all caches
4. Notify users if needed

---

## Cost Optimization

### MongoDB

- **Free Tier**: Up to 512MB storage
- **Upgrade When**: > 10,000 users or > 100GB data
- **Estimated Cost**: $9-25/month for small scale

### Google Gemini API

- **Free Tier**: Limited requests per day
- **Estimated Cost**: $0.01-0.10 per 1,000 requests
- **Optimization**: Aggressive caching, TTL tuning

### Hosting (Vercel)

- **Free Tier**: Personal projects, limited bandwidth
- **Pro Tier**: $20/month (production recommended)

---

## Security Best Practices

1. **Never commit `.env.local`** (add to `.gitignore`)
2. **Rotate API keys** every 90 days
3. **Use environment-specific keys** (dev vs prod)
4. **Implement rate limiting** on all API routes
5. **Sanitize user input** in all forms
6. **Use HTTPS only** in production
7. **Enable MongoDB authentication**

---

## Success Metrics

Track these KPIs:

- **Onboarding Completion Rate**: > 80%
- **Language Distribution**: Track most used languages
- **Disease Generation Success Rate**: > 95%
- **Average Response Time**: < 2 seconds
- **Cache Hit Rate**: > 60%
- **User Retention**: Track weekly active users

---

**Diagnova is ready for production!** 🚀

For support, refer to [README-SETUP.md](./README-SETUP.md)
