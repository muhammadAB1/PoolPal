export type Country = 'us' | 'es';
export type Language = 'en' | 'es';
export type Measurement = 'us' | 'metric';

export type SignUpParams = {
    email: string
    password: string
    firstName: string
    phone: string
    country: string
    language: string
    measurement: string
}