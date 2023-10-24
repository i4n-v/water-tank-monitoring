/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';

function errorHandlerMidleWare(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.log('❗ ERROR HANDLER: ', error);
  response.status(500).json({ message: 'Erro interno do servidor root.' });
}

export default errorHandlerMidleWare;
