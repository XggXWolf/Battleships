export const WS_CORS = {
  origin: (
    origin: string,
    callback: (err: Error | null, allow: boolean) => void,
  ) => {
    const allowed = process.env.FRONTEND_URL;
    if (!origin || origin === allowed) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    }
  },
  credentials: true,
};
