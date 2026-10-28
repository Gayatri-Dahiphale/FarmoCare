const errorHandler = (err, req, res, next) => {
  console.error('[API Error]', err);

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: 'The uploaded file exceeds the 10MB limit.',
        },
      });
    }
    return res.status(400).json({
      success: false,
      error: {
        code: 'UPLOAD_ERROR',
        message: err.message,
      },
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.keys(err.errors).map((field) => ({
      field,
      message: err.errors[field].message,
    }));
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Please correct the highlighted form errors.',
        details,
      },
    });
  }

  // CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Resource not found with identifier: ${err.value}`,
      },
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_KEY',
        message: `An account or record with this ${field} already exists.`,
      },
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred. Please try again.',
    },
  });
};

module.exports = errorHandler;
