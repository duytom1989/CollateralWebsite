import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/DatabaseService';

const db = new DatabaseService();

export const trackAnalytics = (eventType: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract analytics data
      const analyticsData = {
        eventType,
        assetId: req.params.id || null,
        sessionId: req.headers['x-session-id'] || null,
        userAgent: req.get('User-Agent') || '',
        ipAddress: req.ip || req.connection.remoteAddress || '',
        referrer: req.get('Referer') || null,
        pageUrl: req.originalUrl,
        eventData: {
          method: req.method,
          query: req.query,
          timestamp: new Date().toISOString(),
        },
      };

      // Store analytics event (non-blocking)
      setImmediate(async () => {
        try {
          await db.query(`
            INSERT INTO analytics_events (
              event_type, asset_id, session_id, user_agent, 
              ip_address, referrer, page_url, event_data, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
          `, [
            analyticsData.eventType,
            analyticsData.assetId,
            analyticsData.sessionId,
            analyticsData.userAgent,
            analyticsData.ipAddress,
            analyticsData.referrer,
            analyticsData.pageUrl,
            JSON.stringify(analyticsData.eventData),
          ]);
        } catch (error) {
          console.error('Analytics tracking error:', error);
          // Don't throw - analytics failures shouldn't break the request
        }
      });

      next();
    } catch (error) {
      console.error('Analytics middleware error:', error);
      next(); // Continue even if analytics fails
    }
  };
};