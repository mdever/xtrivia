import express from 'express';

export const applicationJson = (req: express.Request, res: express.Response) => {
    res.contentType('application/json');
}

export * from './auth';
export * from './validation';