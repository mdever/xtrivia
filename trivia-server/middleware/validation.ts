import { Request, Response } from 'express';

export const requiresFields = (fieldNames: string[]) => {
    return async (req: Request, res: Response, next: any) => {
        const body = req.body;
        const missingFields = [];
        for (const field of fieldNames) {
            if (body[field] === null || body[field] === undefined) {
                missingFields.push(field);
            }
        }

        if (missingFields.length > 0) {
            res.status(400);
            res.send({
                error: {
                    userMessage: `Invalid request`,
                    developerMessage: `Request missing required fields: ${missingFields}`,
                    code: 400
                }
            })
            res.end();
            return;
        }

        next();
    }
} 