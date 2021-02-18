exports.createSuccessResponse = createSuccessResponse;

function createSuccessResponse(res, data, message='OK', status=200) {
  res.status(status);
  return {
    success: true,
    status,
    message,
    data
  };
}
