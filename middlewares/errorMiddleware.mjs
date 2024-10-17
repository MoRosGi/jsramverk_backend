const errorMiddleware = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
  
    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "detail": err.message
            }
        ]
    });
  };

export default errorMiddleware;