const buildResponse = (message, accept, id = null) => {
  if (accept.includes('text/xml')) {
    let xmlResponse = `<response><message>${message}</message>`;
    if (id) {
      xmlResponse += `<id>${id}</id>`;
    }
    xmlResponse += '</response>';
    return { content: xmlResponse, contentType: 'text/xml' };
  }

  return {
    content: JSON.stringify({ message, id }), contentType: 'application/json',
  };
};

const sendResponse = (request, response, status, message, id = null) => {
  const accept = request.headers.accept || 'application/json';
  const { content, contentType } = buildResponse(message, accept, id);

  response.writeHead(status, { 'Content-Type': contentType });
  response.write(content);
  response.end();
};


// status codes
const success = (request, response) => sendResponse(request, response, 200, 'This is a successful response.');

const badRequest = (request, response, params = {}) => {
  if (params.valid === 'true') {
    sendResponse(request, response, 200, 'This request has the required parameters.');
  } else {
    sendResponse(request, response, 400, 'Missing valid query parameters set to true.', 'badRequest');
  }
};

const unauthorized = (request, response, params = {}) => {
  if (params.loggedIn === 'yes') {
    sendResponse(request, response, 200, 'You have successfully viewed the content.');
  } else {
    sendResponse(request, response, 401, 'Missing loggedIn query parameter set to yes.', 'unauthorized');
  }
};

const forbidden = (request, response) => sendResponse(request, response, 403, 'You do not have access to this content.', 'forbidden');
const internal = (request, response) => sendResponse(request, response, 500, 'Internal Server Error. Something went wrong.', 'internalError');
const notImplemented = (request, response) => sendResponse(request, response, 501, 'A get request for this page has not been implemented yet. Check again later for updated content.', 'notImplemented');
const notFound = (request, response) => sendResponse(request, response, 404, 'The page you are looking for was not found.', 'notFound');

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
