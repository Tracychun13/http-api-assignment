const http = require('http');
const url = require('url');

const htmlHandler = require('./htmlResponses');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/success': responseHandler.success,
    '/badRequest': responseHandler.badRequest,
    '/unauthorized': responseHandler.unauthorized,
    '/forbidden': responseHandler.forbidden,
    '/internal': responseHandler.internal,
    '/notImplemented': responseHandler.notImplemented,
    notFound: responseHandler.notFound,
  },HEAD: {
    notFound: responseHandler.notFoundMeta,
  },
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const acceptedTypes = request.headers.accept.split(',');

  if (!urlStruct[request.method]) return urlStruct.HEAD.notFound(request, response);

  if (urlStruct[request.method][parsedUrl.pathname]) {
    return urlStruct[request.method][parsedUrl.pathname](request, response, parsedUrl.query, acceptedTypes);
  }  

  return urlStruct[request.method].notFound(request, response, acceptedTypes);
};

http.createServer(onRequest).listen(port, () => { console.log(`Listening on 127.0.0.1:${port}`); });
