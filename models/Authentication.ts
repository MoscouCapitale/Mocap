import { Error } from '@models/Error.ts'

type FormType = {
    type: 'default' | 'signup'
    additional_data?: Record<string, string>
    error?: Error
}

export type {
    FormType
}