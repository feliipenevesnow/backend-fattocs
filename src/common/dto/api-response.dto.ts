
export interface ApiResponseSuccess<T> {
    success: true;
    message: string;
    data: T;
  }
  
  export interface ApiResponseError {
    success: false;
    message: string;
    data: null;
  }
  
  export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;
  