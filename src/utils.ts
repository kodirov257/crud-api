import { IncomingMessage } from 'node:http';

export const parseRequestBody = (request: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    const body: any[] = [];

    request
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        try {
          const parsedBody: [] = JSON.parse(
            body.length > 0 ? Buffer.concat(body).toString() : '{}',
          );
          resolve(parsedBody);
        } catch (error) {
          reject(error);
        }
      });

    request.on('error', (error) => {
      reject(error);
    });
  });
};

export const matchPath = (
  route: string,
  url: string,
): { matched: boolean; params: Record<string, string> } => {
  const routeParts = route.split('/').filter(Boolean);
  const urlParts = url.split('/').filter(Boolean);

  if (routeParts.length !== urlParts.length) {
    return { matched: false, params: {} };
  }

  const params: Record<string, string> = {};

  if (route === url) {
    return { matched: true, params };
  }

  const length = routeParts.length;
  for (let i = 0; i < length; i++) {
    const routePart = routeParts[i];
    const urlPart = urlParts[i];

    if (!routePart || !urlPart) {
      return { matched: false, params: {} };
    }

    const isParam = /^\{(.+)\}$/.test(routePart);
    if (isParam) {
      const paramName = routePart.replace(/\{(.+)\}/, '$1');
      params[paramName] = urlPart;
    } else if (routePart !== urlPart) {
      return { matched: false, params: {} };
    }
  }

  return { matched: true, params };
};

export const isUUID = (id: string): boolean => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(id);
};
