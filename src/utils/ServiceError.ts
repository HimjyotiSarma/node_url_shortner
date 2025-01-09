class ServiceError extends Error {
  status: number;
  details: string;

  constructor(message: string, status: number = 500, details: string = "") {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export default ServiceError;
