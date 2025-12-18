export const CreateCompaniesSchema = {   
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 100 },
        address: { type: 'string', minLength: 1, maxLength: 200 },
        email: { type: 'string', format: 'email' }, 
        phone: { type: 'string', pattern: '^[0-9\\-\\+]{9,15}$' },
        website: { type: 'string', format: 'uri' }
    },
    required: ['name', 'email'],
    additionalProperties: false
};