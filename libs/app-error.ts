class AppError extends Error {
	statusCode: number;
	errorCode: number;
	constructor(errorCode: number, message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		this.errorCode = errorCode;
	}
}

export default AppError;
