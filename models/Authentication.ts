import { Error } from '@models/Error.ts'

type FormType = {
    type: 'default' | 'signup' | 'action_done'
    additional_data?: Record<string, string>
    error?: Error
}

export type {
    FormType
}