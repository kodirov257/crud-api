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
