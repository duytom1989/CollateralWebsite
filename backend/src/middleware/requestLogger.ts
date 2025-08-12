import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;
    
    // Only log in development or for errors
    if (process.env.NODE_ENV === 'development' || statusCode >= 400) {
      console.log(`${method} ${originalUrl} ${statusCode} ${duration}ms - ${ip}`);
    }
  });

  next();
};